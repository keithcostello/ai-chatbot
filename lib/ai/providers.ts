import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { isTestEnvironment } from "../constants";

// Log initialization
console.log('[providers] Initializing with ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? `present (${process.env.ANTHROPIC_API_KEY.length} chars)` : 'MISSING');

const THINKING_SUFFIX_REGEX = /-thinking$/;

// Map internal model IDs to Anthropic model IDs
function mapToAnthropicModel(modelId: string): string {
  const modelMap: Record<string, string> = {
    "chat-model-small": "claude-3-haiku-20240307",
    "chat-model": "claude-sonnet-4-20250514",
    "chat-model-reasoning": "claude-sonnet-4-20250514",
    "title-model": "claude-3-haiku-20240307",
    "artifact-model": "claude-3-haiku-20240307",
    "anthropic/claude-haiku-4.5": "claude-3-haiku-20240307",
  };

  return modelMap[modelId] || modelId;
}

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  const isReasoningModel =
    modelId.includes("reasoning") || modelId.endsWith("-thinking");

  if (isReasoningModel) {
    const baseModelId = modelId.replace(THINKING_SUFFIX_REGEX, "");
    const anthropicModelId = mapToAnthropicModel(baseModelId);
    console.log('[providers] Creating reasoning model:', anthropicModelId);

    return wrapLanguageModel({
      model: anthropic(anthropicModelId),
      middleware: extractReasoningMiddleware({ tagName: "thinking" }),
    });
  }

  const anthropicModelId = mapToAnthropicModel(modelId);
  console.log('[providers] Creating model:', anthropicModelId);
  return anthropic(anthropicModelId);
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  return anthropic("claude-3-haiku-20240307");
}

export function getArtifactModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("artifact-model");
  }
  return anthropic("claude-3-haiku-20240307");
}
