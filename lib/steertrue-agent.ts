/**
 * SteerTrueAgent
 *
 * Custom AG-UI agent that routes LLM calls through SteerTrue governance.
 * This agent extends AbstractAgent and is used directly by CopilotRuntime
 * via the `agents` parameter, bypassing CopilotKit's BuiltInAgent.
 *
 * Created for BUG-009: CopilotKit Bypasses Custom Adapter
 *
 * Architecture:
 * CopilotKit -> SteerTrueAgent -> SteerTrue API (get system_prompt) -> Anthropic API
 */

import { AbstractAgent, type AgentConfig } from '@ag-ui/client';
import {
  EventType,
  type RunAgentInput,
  type BaseEvent,
  type Message,
  type RunStartedEvent,
  type RunFinishedEvent,
  type RunErrorEvent,
  type TextMessageStartEvent,
  type TextMessageContentEvent,
  type TextMessageEndEvent,
} from '@ag-ui/core';
import { Observable, Subscriber } from 'rxjs';
import Anthropic from '@anthropic-ai/sdk';

// SteerTrue API configuration
const STEERTRUE_API_URL = process.env.STEERTRUE_API_URL;
const STEERTRUE_TIMEOUT_MS = 5000; // 5 second timeout

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
  console.log('[SteerTrueAgent] callSteerTrue called with sessionId:', sessionId);
  console.log('[SteerTrueAgent] STEERTRUE_API_URL:', STEERTRUE_API_URL || 'NOT SET');

  if (!STEERTRUE_API_URL) {
    console.warn('[SteerTrueAgent] STEERTRUE_API_URL not configured, using fallback');
    return {
      systemPrompt: FALLBACK_SYSTEM_PROMPT,
      blocksInjected: ['FALLBACK/not_configured'],
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), STEERTRUE_TIMEOUT_MS);

    console.log('[SteerTrueAgent] Calling:', `${STEERTRUE_API_URL}/api/v1/analyze`);
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
      console.error(`[SteerTrueAgent] SteerTrue returned ${response.status}: ${response.statusText}`);
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/steertrue_error'],
      };
    }

    const data: SteerTrueResponse = await response.json();
    console.log('[SteerTrueAgent] Response received, blocks_injected:', data.blocks_injected);

    if (!data.system_prompt || !Array.isArray(data.blocks_injected)) {
      console.error('[SteerTrueAgent] Response missing required fields:', JSON.stringify(data));
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/invalid_response'],
      };
    }

    console.log('[SteerTrueAgent] SUCCESS - returning', data.blocks_injected.length, 'blocks');
    return {
      systemPrompt: data.system_prompt,
      blocksInjected: data.blocks_injected,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[SteerTrueAgent] SteerTrue request timed out after', STEERTRUE_TIMEOUT_MS, 'ms');
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/timeout'],
      };
    }

    console.error('[SteerTrueAgent] SteerTrue request failed:', error);
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

/**
 * SteerTrueAgent configuration
 */
export interface SteerTrueAgentConfig extends AgentConfig {
  model?: string;
  sessionId?: string;
}

/**
 * SteerTrueAgent
 *
 * Extends AbstractAgent to provide SteerTrue governance injection
 * for all LLM calls made through CopilotKit.
 */
export class SteerTrueAgent extends AbstractAgent {
  private anthropic: Anthropic;
  private model: string;
  private sessionId: string;

  constructor(config?: SteerTrueAgentConfig) {
    super({
      agentId: config?.agentId || 'steertrue-agent',
      description: config?.description || 'SteerTrue-governed AI agent',
      threadId: config?.threadId,
      initialMessages: config?.initialMessages,
      initialState: config?.initialState,
      debug: config?.debug,
    });

    this.model = config?.model || 'claude-sonnet-4-20250514';
    this.sessionId = config?.sessionId || 'default-session';
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log('[SteerTrueAgent] Initialized with model:', this.model, 'sessionId:', this.sessionId);
  }

  /**
   * Update session ID (can be called per-request from route handler)
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
    console.log('[SteerTrueAgent] Session ID updated to:', sessionId);
  }

  /**
   * Implement the abstract run method from AbstractAgent
   * This is called by CopilotKit to handle chat messages
   *
   * FIX for BUG-013: Use new Observable() pattern like BuiltInAgent
   *
   * ROOT CAUSE: The previous fix used Subject and emitted RUN_STARTED before
   * returning the Observable. Subject does NOT buffer events - events emitted
   * before subscription are LOST. When AbstractAgent.runAgent() pipes through
   * transformChunks and verifyEvents, it subscribes AFTER our run() returns,
   * so RUN_STARTED was already emitted and lost.
   *
   * FIX: Use new Observable((subscriber) => {...}) pattern. The callback runs
   * when subscribed, so RUN_STARTED is emitted at the right time.
   */
  run(input: RunAgentInput): Observable<BaseEvent> {
    const runIdToUse = input?.runId || generateMessageId();

    return new Observable<BaseEvent>((subscriber: Subscriber<BaseEvent>) => {
      // Emit RUN_STARTED - this happens when subscribed, not when Observable is created
      const runStartedEvent: RunStartedEvent = {
        type: EventType.RUN_STARTED,
        runId: runIdToUse,
        threadId: this.threadId,
        timestamp: Date.now(),
      };
      subscriber.next(runStartedEvent);
      console.log('[SteerTrueAgent] RUN_STARTED emitted');

      // Run the async handler
      this.handleRun(input, subscriber, runIdToUse)
        .then(() => {
          subscriber.complete();
        })
        .catch((error) => {
          console.error('[SteerTrueAgent] Run error:', error);
          subscriber.error(error);
        });
    });
  }

  /**
   * Extract text content from AG-UI message content
   * Content can be string or array of content blocks
   */
  private extractTextContent(content: Message['content']): string {
    if (typeof content === 'string') {
      return content;
    }
    if (Array.isArray(content)) {
      return content
        .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
        .map(block => block.text)
        .join('\n');
    }
    return '';
  }

  /**
   * Clone this agent for safe concurrent use.
   * CRITICAL: CopilotKit clones agents before running them (see handleRunAgent).
   * Without this override, custom properties (anthropic, model, sessionId) would be lost.
   */
  clone(): SteerTrueAgent {
    const cloned = new SteerTrueAgent({
      agentId: this.agentId,
      description: this.description,
      threadId: this.threadId,
      initialMessages: [...this.messages],
      initialState: { ...this.state },
      debug: this.debug,
      model: this.model,
      sessionId: this.sessionId,
    });
    // Copy middlewares
    cloned['middlewares'] = [...this['middlewares']];
    return cloned;
  }

  /**
   * Async handler for the run method
   * NOTE: Using arrow function to preserve `this` binding when called asynchronously
   * BUG-011 FIX: this.sessionId was undefined because `this` context was lost
   * BUG-013 FIX: Uses Subscriber from Observable pattern (not Subject)
   *
   * NOTE: subscriber.complete() is called by run() after this promise resolves.
   * Do NOT call subscriber.complete() here - it's handled by the Observable creator.
   */
  private handleRun = async (input: RunAgentInput, subscriber: Subscriber<BaseEvent>, runIdToUse: string): Promise<void> => {
    const messageId = generateMessageId();

    // Defensive check for input and messages
    if (!input || !input.messages) {
      console.error('[SteerTrueAgent] Invalid input: input or messages is undefined');
      const errorEvent: RunErrorEvent = {
        type: EventType.RUN_ERROR,
        message: 'Invalid input: messages not provided',
        code: 'INVALID_INPUT',
        timestamp: Date.now(),
      };
      subscriber.next(errorEvent);
      // Don't complete here - let the Observable creator handle it
      return;
    }

    const { messages } = input;
    console.log('[SteerTrueAgent] handleRun called with', messages.length, 'messages');

    // Extract the latest user message
    const userMessages = messages.filter(m => m.role === 'user');
    const latestUserContent = userMessages[userMessages.length - 1]?.content;
    const latestUserMessage = this.extractTextContent(latestUserContent);

    console.log('[SteerTrueAgent] Latest user message:', latestUserMessage?.substring(0, 100) + '...');

    try {
      // BUG-011 DEBUG: Log this.sessionId to verify binding
      console.log('[SteerTrueAgent] About to call SteerTrue with this.sessionId:', this.sessionId);

      // Call SteerTrue to get governance-injected system prompt
      const { systemPrompt, blocksInjected } = await callSteerTrue(
        latestUserMessage || 'Hello',  // Fallback to prevent empty message
        this.sessionId
      );

      console.log('[SteerTrueAgent] Got system prompt with', blocksInjected.length, 'blocks');

      // Convert messages to Anthropic format
      const anthropicMessages: Anthropic.Messages.MessageParam[] = messages
        .filter((m): m is Message & { role: 'user' | 'assistant' } =>
          m.role === 'user' || m.role === 'assistant'
        )
        .map((m) => ({
          role: m.role,
          content: this.extractTextContent(m.content) || '',
        }));

      // Emit text message start
      const textStartEvent: TextMessageStartEvent = {
        type: EventType.TEXT_MESSAGE_START,
        messageId,
        role: 'assistant',
        timestamp: Date.now(),
      };
      subscriber.next(textStartEvent);

      // Stream from Anthropic
      const stream = await this.anthropic.messages.stream({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: anthropicMessages,
      });

      // Process streaming events
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          const textContentEvent: TextMessageContentEvent = {
            type: EventType.TEXT_MESSAGE_CONTENT,
            messageId,
            delta: event.delta.text,
            timestamp: Date.now(),
          };
          subscriber.next(textContentEvent);
        }
      }

      // Emit text message end
      const textEndEvent: TextMessageEndEvent = {
        type: EventType.TEXT_MESSAGE_END,
        messageId,
        timestamp: Date.now(),
      };
      subscriber.next(textEndEvent);

      // Emit run finished event
      const runFinishedEvent: RunFinishedEvent = {
        type: EventType.RUN_FINISHED,
        runId: runIdToUse,
        threadId: this.threadId,
        timestamp: Date.now(),
      };
      subscriber.next(runFinishedEvent);

      console.log('[SteerTrueAgent] Response complete, blocks_injected:', blocksInjected);

    } catch (error) {
      console.error('[SteerTrueAgent] Error:', error);

      // Emit error event
      const errorEvent: RunErrorEvent = {
        type: EventType.RUN_ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'AGENT_ERROR',
        timestamp: Date.now(),
      };
      subscriber.next(errorEvent);
    }
    // Don't call subscriber.complete() here - the Observable creator handles it
  }
}

/**
 * Factory function to create a SteerTrueAgent
 * Use this in copilot route.ts
 */
export function createSteerTrueAgent(config?: SteerTrueAgentConfig): SteerTrueAgent {
  return new SteerTrueAgent(config);
}
