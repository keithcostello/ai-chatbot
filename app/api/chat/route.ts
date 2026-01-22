import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@/lib/auth';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

    // Create streaming response using SSE
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Use Anthropic streaming API
          // Reference: https://docs.anthropic.com/en/api/streaming
          const messageStream = anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
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

          // Send done event with metadata
          const doneData = JSON.stringify({
            type: 'done',
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
