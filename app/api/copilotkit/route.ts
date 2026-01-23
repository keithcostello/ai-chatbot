/**
 * CopilotKit API Route - Official Pattern
 * Source: https://github.com/CopilotKit/with-pydantic-ai
 *
 * BUG-001 Fix: Use CopilotRuntime + HttpAgent instead of raw fetch proxy
 * This properly handles AG-UI protocol format (RunAgentInput)
 */

import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

const PYTHON_AGENT_URL =
  process.env.PYDANTIC_AI_URL ||
  "https://steertrue-pydantic-ai-dev-sandbox.up.railway.app";

const serviceAdapter = new ExperimentalEmptyAdapter();

const runtime = new CopilotRuntime({
  agents: {
    steertrue_agent: new HttpAgent({ url: `${PYTHON_AGENT_URL}/` }),
  },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};
