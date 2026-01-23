/**
 * SteerTrueAnthropicAdapter
 *
 * Custom CopilotKit service adapter that routes LLM calls through SteerTrue governance
 * before calling Anthropic. This ensures all AI responses include SteerTrue headers.
 *
 * Created for BUG-007: CopilotKit Bypasses SteerTrue Governance
 *
 * Architecture:
 * CopilotKit -> SteerTrueAnthropicAdapter -> SteerTrue API (get system_prompt) -> Anthropic API
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  CopilotServiceAdapter,
  CopilotRuntimeChatCompletionRequest,
  CopilotRuntimeChatCompletionResponse,
} from '@copilotkit/runtime';

// SteerTrue API configuration
const STEERTRUE_API_URL = process.env.STEERTRUE_API_URL;
const STEERTRUE_TIMEOUT_MS = 5000; // 5 second timeout per CONTEXT.md Section 5

// Fallback system prompt when SteerTrue is unavailable
const FALLBACK_SYSTEM_PROMPT = `You are a helpful AI assistant.
Note: Governance system temporarily unavailable. Operating in fallback mode.
Respond helpfully while maintaining safety guidelines.`;

// SteerTrue response type
interface SteerTrueResponse {
  system_prompt: string;
  blocks_injected: string[];
  session_id: string;
}

/**
 * Call SteerTrue /api/v1/analyze endpoint to get governance-injected system prompt
 */
async function callSteerTrue(
  message: string,
  sessionId: string
): Promise<{ systemPrompt: string; blocksInjected: string[] }> {
  console.log('[SteerTrueAdapter] callSteerTrue called with sessionId:', sessionId);
  console.log('[SteerTrueAdapter] STEERTRUE_API_URL:', STEERTRUE_API_URL || 'NOT SET');

  if (!STEERTRUE_API_URL) {
    console.warn('[SteerTrueAdapter] STEERTRUE_API_URL not configured, using fallback');
    return {
      systemPrompt: FALLBACK_SYSTEM_PROMPT,
      blocksInjected: ['FALLBACK/not_configured'],
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), STEERTRUE_TIMEOUT_MS);

    console.log('[SteerTrueAdapter] Calling:', `${STEERTRUE_API_URL}/api/v1/analyze`);
    const response = await fetch(`${STEERTRUE_API_URL}/api/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        session_id: sessionId,
        user_id: sessionId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[SteerTrueAdapter] SteerTrue returned ${response.status}: ${response.statusText}`);
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/steertrue_error'],
      };
    }

    const data: SteerTrueResponse = await response.json();
    console.log('[SteerTrueAdapter] Response received, blocks_injected:', data.blocks_injected);

    if (!data.system_prompt || !Array.isArray(data.blocks_injected)) {
      console.error('[SteerTrueAdapter] Response missing required fields:', JSON.stringify(data));
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/invalid_response'],
      };
    }

    console.log('[SteerTrueAdapter] SUCCESS - returning', data.blocks_injected.length, 'blocks');
    return {
      systemPrompt: data.system_prompt,
      blocksInjected: data.blocks_injected,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[SteerTrueAdapter] SteerTrue request timed out after', STEERTRUE_TIMEOUT_MS, 'ms');
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/timeout'],
      };
    }

    console.error('[SteerTrueAdapter] SteerTrue request failed:', error);
    return {
      systemPrompt: FALLBACK_SYSTEM_PROMPT,
      blocksInjected: ['FALLBACK/steertrue_error'],
    };
  }
}

/**
 * Generate a unique message ID
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Type guard interfaces for CopilotKit Message (internal types not exported)
interface TextMessageLike {
  isTextMessage(): boolean;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * SteerTrueAnthropicAdapter
 *
 * Implements CopilotServiceAdapter to inject SteerTrue governance before Anthropic calls
 */
export class SteerTrueAnthropicAdapter implements CopilotServiceAdapter {
  public model: string;
  public provider: string = 'anthropic-steertrue';
  private anthropic: Anthropic;
  private sessionId: string;

  constructor(params?: { model?: string; sessionId?: string }) {
    this.model = params?.model || 'claude-sonnet-4-20250514';
    this.sessionId = params?.sessionId || 'default-session';
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    console.log('[SteerTrueAdapter] Initialized with model:', this.model, 'sessionId:', this.sessionId);
  }

  get name(): string {
    return 'SteerTrueAnthropicAdapter';
  }

  /**
   * Update session ID for request context (can be called per-request)
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
    console.log('[SteerTrueAdapter] Session ID updated to:', sessionId);
  }

  /**
   * Process a chat completion request with SteerTrue governance
   */
  async process(
    request: CopilotRuntimeChatCompletionRequest
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    const { eventSource, messages, threadId } = request;

    // Extract text messages from CopilotKit format
    // CopilotKit Message type has isTextMessage() method and role/content properties
    // We use runtime checks and type assertions since internal types are not exported
    const textMessages: TextMessageLike[] = [];
    for (const m of messages) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = m as any;
      if (typeof msg.isTextMessage === 'function' && msg.isTextMessage()) {
        textMessages.push({
          isTextMessage: () => true,
          role: msg.role,
          content: msg.content || '',
        });
      }
    }

    const latestUserMessage =
      textMessages
        .filter((m) => m.role === 'user')
        .map((m) => m.content)
        .pop() || '';

    console.log('[SteerTrueAdapter] Processing request with', messages.length, 'messages');
    console.log('[SteerTrueAdapter] Latest user message:', latestUserMessage.substring(0, 100) + '...');

    // Call SteerTrue to get governance-injected system prompt
    const { systemPrompt, blocksInjected } = await callSteerTrue(
      latestUserMessage,
      this.sessionId
    );

    console.log('[SteerTrueAdapter] Got system prompt with', blocksInjected.length, 'blocks');

    // Convert CopilotKit messages to Anthropic format
    // Filter to only text messages with user/assistant roles
    const anthropicMessages: Anthropic.Messages.MessageParam[] = textMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content || '',
      }));

    // Stream response through eventSource
    const messageId = generateMessageId();
    const resultThreadId = threadId || `thread_${Date.now()}`;

    // Use the callback-based stream API
    await eventSource.stream(async (eventStream$) => {
      try {
        // Signal start of text message
        eventStream$.sendTextMessageStart({ messageId });

        // Call Anthropic with SteerTrue-injected system prompt
        const stream = await this.anthropic.messages.stream({
          model: this.model,
          max_tokens: 4096,
          system: systemPrompt, // SteerTrue governance-injected system prompt
          messages: anthropicMessages,
        });

        // Process streaming events
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            eventStream$.sendTextMessageContent({
              messageId,
              content: event.delta.text,
            });
          }
        }

        // Signal end of text message
        eventStream$.sendTextMessageEnd({ messageId });
        eventStream$.complete();
      } catch (error) {
        console.error('[SteerTrueAdapter] Stream error:', error);
        eventStream$.error(error);
      }
    });

    return {
      threadId: resultThreadId,
    };
  }
}

/**
 * Factory function to create a SteerTrueAnthropicAdapter
 * Use this in copilot route.ts
 */
export function createSteerTrueAdapter(params?: {
  model?: string;
  sessionId?: string;
}): SteerTrueAnthropicAdapter {
  return new SteerTrueAnthropicAdapter(params);
}
