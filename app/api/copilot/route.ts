import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { createSteerTrueAdapter } from "@/lib/steertrue-adapter";

// Python service URL from environment (optional - for future CoAgents integration)
const PYDANTIC_AI_URL = process.env.PYDANTIC_AI_URL;

// Create CopilotRuntime
// Note: remoteActions would be used for Python/CoAgents integration (future S2.4)
const runtime = new CopilotRuntime({
  remoteActions: PYDANTIC_AI_URL
    ? [
        {
          url: `${PYDANTIC_AI_URL}/copilotkit`,
        },
      ]
    : [],
});

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
  console.log("[CopilotKit] Using SteerTrueAnthropicAdapter with governance injection");
  if (PYDANTIC_AI_URL) {
    console.log("[CopilotKit] PYDANTIC_AI_URL configured for future CoAgents:", PYDANTIC_AI_URL);
  }

  // Create SteerTrueAnthropicAdapter with user's session ID
  // This adapter calls SteerTrue /api/v1/analyze before Anthropic to inject governance
  // FIX for BUG-007: CopilotKit Bypasses SteerTrue Governance
  const serviceAdapter = createSteerTrueAdapter({
    model: "claude-sonnet-4-20250514",
    sessionId: userId,
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilot",
  });

  return handleRequest(req);
};
