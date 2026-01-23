import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Python service URL from environment
const PYDANTIC_AI_URL = process.env.PYDANTIC_AI_URL;

// Create CopilotRuntime with remote actions pointing to Python service
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
  console.log("[CopilotKit] PYDANTIC_AI_URL:", PYDANTIC_AI_URL || "NOT SET");

  if (!PYDANTIC_AI_URL) {
    console.error("[CopilotKit] PYDANTIC_AI_URL not configured");
    return new Response(
      JSON.stringify({
        error: "Python service not configured",
        code: "SERVICE_NOT_CONFIGURED",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: undefined, // Using remoteActions, not direct LLM
    endpoint: "/api/copilot",
  });

  return handleRequest(req);
};
