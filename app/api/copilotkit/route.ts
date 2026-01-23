/**
 * CopilotKit Proxy Route - Main Endpoint
 *
 * Proxies POST requests to the Python agent AG-UI endpoint
 */

import { NextRequest, NextResponse } from "next/server";

const PYTHON_AGENT_URL = process.env.PYDANTIC_AI_URL || "https://steertrue-pydantic-ai-dev-sandbox.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    console.log("[CopilotKit Proxy] POST to:", `${PYTHON_AGENT_URL}/copilotkit/`);

    const response = await fetch(`${PYTHON_AGENT_URL}/copilotkit/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body,
    });

    // Check for error status
    if (!response.ok) {
      console.error("[CopilotKit Proxy] Error:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    // Stream the response
    if (response.body) {
      const stream = response.body;
      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return NextResponse.json(
      { error: "No response body" },
      { status: 500 }
    );
  } catch (error) {
    console.error("[CopilotKit Proxy] Exception:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
