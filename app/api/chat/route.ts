import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@/lib/auth';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// SteerTrue API configuration
const STEERTRUE_API_URL = process.env.STEERTRUE_API_URL;
const STEERTRUE_TIMEOUT_MS = 5000; // 5 second timeout per CONTEXT.md Section 5

// Fallback system prompt when SteerTrue is unavailable
// Per CONTEXT.md Section 5
const FALLBACK_SYSTEM_PROMPT = `You are a helpful AI assistant.
Note: Governance system temporarily unavailable. Operating in fallback mode.
Respond helpfully while maintaining safety guidelines.`;

// SteerTrue response type
interface SteerTrueResponse {
  system_prompt: string;
  blocks_injected: string[];
  session_id: string;
}

// Call SteerTrue /api/v1/analyze endpoint
// Returns system_prompt and blocks_injected, or fallback values on failure
async function callSteerTrue(
  message: string,
  sessionId: string
): Promise<{ systemPrompt: string; blocksInjected: string[] }> {
  console.log('[SteerTrue] callSteerTrue called with sessionId:', sessionId);
  console.log('[SteerTrue] STEERTRUE_API_URL:', STEERTRUE_API_URL || 'NOT SET');

  // If no SteerTrue URL configured, use fallback
  if (!STEERTRUE_API_URL) {
    console.warn('[SteerTrue] STEERTRUE_API_URL not configured, using fallback');
    return {
      systemPrompt: FALLBACK_SYSTEM_PROMPT,
      blocksInjected: ['FALLBACK/not_configured'],
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), STEERTRUE_TIMEOUT_MS);

    console.log('[SteerTrue] Calling:', `${STEERTRUE_API_URL}/api/v1/analyze`);
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

    // Handle non-200 responses (5xx errors)
    if (!response.ok) {
      console.error(`SteerTrue returned ${response.status}: ${response.statusText}`);
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/steertrue_error'],
      };
    }

    const data: SteerTrueResponse = await response.json();
    console.log('[SteerTrue] Response received, blocks_injected:', data.blocks_injected);

    // Validate response has required fields
    if (!data.system_prompt || !Array.isArray(data.blocks_injected)) {
      console.error('[SteerTrue] Response missing required fields:', JSON.stringify(data));
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/invalid_response'],
      };
    }

    console.log('[SteerTrue] SUCCESS - returning', data.blocks_injected.length, 'blocks');
    return {
      systemPrompt: data.system_prompt,
      blocksInjected: data.blocks_injected,
    };
  } catch (error) {
    // Handle timeout (AbortError) or other fetch errors
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('SteerTrue request timed out after', STEERTRUE_TIMEOUT_MS, 'ms');
      return {
        systemPrompt: FALLBACK_SYSTEM_PROMPT,
        blocksInjected: ['FALLBACK/timeout'],
      };
    }

    console.error('SteerTrue request failed:', error);
    return {
      systemPrompt: FALLBACK_SYSTEM_PROMPT,
      blocksInjected: ['FALLBACK/steertrue_error'],
    };
  }
}

export async function POST(req: Request) {
  // Verify authentication
  const session = await auth();
  if (!session?.user) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated', code: 'NOT_AUTHENTICATED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required', code: 'VALIDATION_ERROR' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use user ID as session identifier for SteerTrue
    const sessionId = session.user.id || session.user.email || 'anonymous';

    // Call SteerTrue BEFORE Anthropic call (Phase 3A requirement)
    const { systemPrompt, blocksInjected } = await callSteerTrue(message, sessionId);

    // Create streaming response using SSE
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Use Anthropic streaming API with SteerTrue system prompt
          // Reference: https://docs.anthropic.com/en/api/streaming
          const messageStream = anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: systemPrompt, // Use SteerTrue composed system prompt
            messages: [
              {
                role: 'user',
                content: message,
              },
            ],
          });

          // Handle streaming events
          messageStream.on('text', (text) => {
            const data = JSON.stringify({ type: 'chunk', content: text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          });

          messageStream.on('error', (error) => {
            console.error('Anthropic stream error:', error);
            const data = JSON.stringify({
              type: 'error',
              code: 'ANTHROPIC_ERROR',
              message: 'Error from AI service',
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            controller.close();
          });

          // Wait for stream to complete
          const finalMessage = await messageStream.finalMessage();

          // Send done event with metadata including blocksInjected (Phase 3A requirement)
          const doneData = JSON.stringify({
            type: 'done',
            blocksInjected: blocksInjected, // Include governance blocks from SteerTrue
            totalTokens:
              (finalMessage.usage?.input_tokens || 0) +
              (finalMessage.usage?.output_tokens || 0),
          });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            code: 'STREAM_ERROR',
            message: 'Failed to stream response',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    // Return SSE response
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
