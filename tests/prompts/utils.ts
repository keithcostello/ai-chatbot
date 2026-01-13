// AI SDK v6 doesn't export LanguageModelV1StreamPart, use any
type StreamPart = any;

const mockUsage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 20, text: 20, reasoning: 0 },
};

export function getResponseChunksByPrompt(
  _prompt: unknown,
  includeReasoning = false
): StreamPart[] {
  const chunks: StreamPart[] = [];

  if (includeReasoning) {
    chunks.push(
      { type: "reasoning-start", id: "r1" },
      { type: "reasoning-delta", id: "r1", delta: "Let me think about this." },
      { type: "reasoning-end", id: "r1" }
    );
  }

  chunks.push(
    { type: "text-start", id: "t1" },
    { type: "text-delta", id: "t1", delta: "Hello, world!" },
    { type: "text-end", id: "t1" },
    { type: "finish", finishReason: "stop", usage: mockUsage }
  );

  return chunks;
}
