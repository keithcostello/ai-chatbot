import Anthropic from '@anthropic-ai/sdk';
import type { LanguageModelV1, LanguageModelV1StreamPart } from 'ai';

// Debug logging
console.log('[anthropic-direct] Initializing with API key:', process.env.ANTHROPIC_API_KEY ? `present (${process.env.ANTHROPIC_API_KEY.length} chars)` : 'MISSING');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function createDirectAnthropicModel(modelId: string): LanguageModelV1 {
  console.log('[anthropic-direct] Creating model:', modelId);

  return {
    specificationVersion: 'v1',
    provider: 'anthropic-direct',
    modelId,
    defaultObjectGenerationMode: undefined,

    async doGenerate(options) {
      console.log('[anthropic-direct] doGenerate called');

      // Extract system prompt
      const systemPrompts = options.prompt
        .filter(p => p.role === 'system')
        .map(p => {
          if (typeof p.content === 'string') return p.content;
          return p.content.map(c => c.type === 'text' ? c.text : '').join('');
        });

      // Convert messages
      const messages = options.prompt
        .filter(p => p.role !== 'system')
        .map(p => ({
          role: p.role as 'user' | 'assistant',
          content: typeof p.content === 'string'
            ? p.content
            : p.content.map(c => c.type === 'text' ? c.text : '').join('')
        }));

      const response = await client.messages.create({
        model: modelId,
        max_tokens: options.maxTokens ?? 4096,
        system: systemPrompts.join('\n\n'),
        messages
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';

      return {
        text,
        finishReason: response.stop_reason === 'end_turn' ? 'stop' as const : 'unknown' as const,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens
        },
        rawCall: { rawPrompt: options.prompt, rawSettings: {} },
        rawResponse: { headers: {} },
        warnings: []
      };
    },

    async doStream(options) {
      console.log('[anthropic-direct] doStream called');

      // Extract system prompt
      const systemPrompts = options.prompt
        .filter(p => p.role === 'system')
        .map(p => {
          if (typeof p.content === 'string') return p.content;
          return p.content.map(c => c.type === 'text' ? c.text : '').join('');
        });

      // Convert messages
      const messages = options.prompt
        .filter(p => p.role !== 'system')
        .map(p => ({
          role: p.role as 'user' | 'assistant',
          content: typeof p.content === 'string'
            ? p.content
            : p.content.map(c => c.type === 'text' ? c.text : '').join('')
        }));

      const stream = client.messages.stream({
        model: modelId,
        max_tokens: options.maxTokens ?? 4096,
        system: systemPrompts.join('\n\n'),
        messages
      });

      // Create async generator for stream parts
      async function* generateStream(): AsyncGenerator<LanguageModelV1StreamPart> {
        let inputTokens = 0;
        let outputTokens = 0;

        for await (const event of stream) {
          if (event.type === 'message_start' && event.message.usage) {
            inputTokens = event.message.usage.input_tokens;
          }
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            yield { type: 'text-delta', textDelta: event.delta.text };
          }
          if (event.type === 'message_delta' && event.usage) {
            outputTokens = event.usage.output_tokens;
          }
        }

        yield {
          type: 'finish',
          finishReason: 'stop',
          usage: { promptTokens: inputTokens, completionTokens: outputTokens }
        };
      }

      return {
        stream: generateStream(),
        rawCall: { rawPrompt: options.prompt, rawSettings: {} },
        rawResponse: { headers: {} },
        warnings: []
      };
    }
  };
}
