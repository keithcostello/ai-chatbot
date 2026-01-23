import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  AnthropicAdapter,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Python service URL from environment (optional - for future CoAgents integration)
const PYDANTIC_AI_URL = process.env.PYDANTIC_AI_URL;

// Create AnthropicAdapter for direct LLM access
// Uses ANTHROPIC_API_KEY from environment automatically
const serviceAdapter = new AnthropicAdapter({
  model: "claude-sonnet-4-20250514",
});

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
  console.log("[CopilotKit] Request received, user:", session.user.id);
  console.log("[CopilotKit] Using AnthropicAdapter with claude-sonnet-4-20250514");
  if (PYDANTIC_AI_URL) {
    console.log("[CopilotKit] PYDANTIC_AI_URL configured for future CoAgents:", PYDANTIC_AI_URL);
  }

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilot",
  });

  return handleRequest(req);
};
