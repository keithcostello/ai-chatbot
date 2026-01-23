/**
 * CopilotKit API Route with SteerTrue Governance
 *
 * FIX for BUG-009: CopilotKit Bypasses Custom Adapter
 *
 * Problem: CopilotKit 1.51.2 ignores serviceAdapter.process() method.
 * When serviceAdapter is provided, CopilotKit only extracts provider/model
 * and creates BuiltInAgent that calls Anthropic directly.
 *
 * Solution: Use the `agents` parameter to provide a custom SteerTrueAgent
 * that extends AbstractAgent. This agent is used directly by CopilotKit
 * and calls SteerTrue before Anthropic.
 *
 * Phase 5: Message Persistence
 * Route now extracts conversationId from request headers and sets up
 * persistence callbacks to save messages to the database.
 */

import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  EmptyAdapter,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { createSteerTrueAgent, type PersistenceCallbacks } from "@/lib/steertrue-agent";
import {
  saveUserMessage,
  saveAssistantMessage,
  getOrCreateConversation,
} from "@/lib/persistence";

// Python service URL from environment (optional - for future CoAgents integration)
const PYDANTIC_AI_URL = process.env.PYDANTIC_AI_URL;

export const POST = async (req: NextRequest) => {
  // Verify authentication
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ error: "Not authenticated", code: "NOT_AUTHENTICATED" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Log for debugging
  const userId = session.user.id;
  console.log("[CopilotKit] Request received, user:", userId);
  console.log("[CopilotKit] Using SteerTrueAgent (BUG-009 fix) with governance injection");
  if (PYDANTIC_AI_URL) {
    console.log("[CopilotKit] PYDANTIC_AI_URL configured for future CoAgents:", PYDANTIC_AI_URL);
  }

  // Phase 5: Extract conversationId from header (set by client)
  // Client sends X-Conversation-Id header to persist messages
  const conversationIdHeader = req.headers.get("X-Conversation-Id");
  console.log("[CopilotKit] ConversationId from header:", conversationIdHeader);

  // Get or create conversation for this user
  let conversationId: string | undefined;
  try {
    conversationId = await getOrCreateConversation(userId, conversationIdHeader);
    console.log("[CopilotKit] Using conversation:", conversationId);
  } catch (error) {
    console.error("[CopilotKit] Failed to get/create conversation:", error);
    // Continue without persistence
  }

  // Phase 5: Set up persistence callbacks
  const persistence: PersistenceCallbacks | undefined = conversationId
    ? {
        onUserMessage: async (content: string) => {
          await saveUserMessage(conversationId!, content);
        },
        onAssistantMessage: async (
          content: string,
          blocksInjected: string[],
          totalTokens: number
        ) => {
          await saveAssistantMessage(
            conversationId!,
            content,
            blocksInjected,
            totalTokens
          );
        },
      }
    : undefined;

  // Create SteerTrueAgent with user's session ID and persistence
  // FIX for BUG-009: Use custom agent instead of serviceAdapter
  // The agent is provided via `agents` parameter which CopilotKit uses directly
  const steerTrueAgent = createSteerTrueAgent({
    model: "claude-sonnet-4-20250514",
    sessionId: userId,
    conversationId: conversationId,
    userId: userId,
    agentId: "steertrue-default",
    description: "SteerTrue-governed AI assistant",
    persistence: persistence,
  });

  // Create CopilotRuntime with custom agent
  // Note: remoteActions would be used for Python/CoAgents integration (future S2.4)
  const runtime = new CopilotRuntime({
    agents: {
      // 'default' is the agent CopilotKit uses when no specific agent is requested
      default: steerTrueAgent,
    },
    remoteActions: PYDANTIC_AI_URL
      ? [
          {
            url: `${PYDANTIC_AI_URL}/copilotkit`,
          },
        ]
      : [],
  });

  // FIX for BUG-010: CopilotKit's getCommonConfig() accesses serviceAdapter.constructor.name
  // for telemetry without checking if serviceAdapter is defined. This causes:
  // TypeError: Cannot read properties of undefined (reading 'constructor')
  // Solution: Provide EmptyAdapter to satisfy telemetry. Our custom agent in `agents.default`
  // handles actual LLM calls, so EmptyAdapter is never used for processing.
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilot",
    serviceAdapter: new EmptyAdapter(),
  });

  return handleRequest(req);
};
