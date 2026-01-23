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
 */

import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { createSteerTrueAgent } from "@/lib/steertrue-agent";

// Python service URL from environment (optional - for future CoAgents integration)
const PYDANTIC_AI_URL = process.env.PYDANTIC_AI_URL;

export const POST = async (req: NextRequest) => {
  // Verify authentication
  const session = await auth();
  if (!session?.user) {
    return new Response(
      JSON.stringify({ error: "Not authenticated", code: "NOT_AUTHENTICATED" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Log for debugging
  const userId = session.user.id || session.user.email || "anonymous";
  console.log("[CopilotKit] Request received, user:", userId);
  console.log("[CopilotKit] Using SteerTrueAgent (BUG-009 fix) with governance injection");
  if (PYDANTIC_AI_URL) {
    console.log("[CopilotKit] PYDANTIC_AI_URL configured for future CoAgents:", PYDANTIC_AI_URL);
  }

  // Create SteerTrueAgent with user's session ID
  // FIX for BUG-009: Use custom agent instead of serviceAdapter
  // The agent is provided via `agents` parameter which CopilotKit uses directly
  const steerTrueAgent = createSteerTrueAgent({
    model: "claude-sonnet-4-20250514",
    sessionId: userId,
    agentId: "steertrue-default",
    description: "SteerTrue-governed AI assistant",
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

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilot",
  });

  return handleRequest(req);
};
