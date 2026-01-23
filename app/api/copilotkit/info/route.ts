/**
 * CopilotKit Proxy Route - Info Endpoint
 *
 * Proxies GET /info requests to the Python agent
 * Note: The AG-UI /info endpoint may not exist - return mock data
 */

import { NextResponse } from "next/server";

const PYTHON_AGENT_URL = process.env.PYDANTIC_AI_URL || "https://steertrue-pydantic-ai-dev-sandbox.up.railway.app";

export async function GET() {
  try {
    // Try to fetch from Python agent
    const response = await fetch(`${PYTHON_AGENT_URL}/copilotkit/info`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // If Python agent doesn't have /info endpoint, return basic info
    // This allows CopilotKit to continue without this optional endpoint
    return NextResponse.json({
      agents: [],
      version: "0.1.0",
    });
  } catch (error) {
    console.log("[CopilotKit Proxy] /info not available, returning mock");
    // Return empty info if endpoint not available
    return NextResponse.json({
      agents: [],
      version: "0.1.0",
    });
  }
}
