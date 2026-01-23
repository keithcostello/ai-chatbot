/**
 * CopilotKit Proxy Route
 *
 * Proxies requests to the Python agent to:
 * 1. Avoid mixed content issues (browser sees only HTTPS)
 * 2. Handle CORS internally
 * 3. Preserve SSE streaming
 */

import { NextRequest, NextResponse } from "next/server";

const PYTHON_AGENT_URL = process.env.PYDANTIC_AI_URL || "https://steertrue-pydantic-ai-dev-sandbox.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const response = await fetch(`${PYTHON_AGENT_URL}/copilotkit/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body,
    });

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
    console.error("CopilotKit proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Handle info endpoint
  const url = new URL(request.url);
  if (url.pathname.endsWith("/info")) {
    try {
      const response = await fetch(`${PYTHON_AGENT_URL}/copilotkit/info`);
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: "Info endpoint not available" },
        { status: 404 }
      );
    }
  }

  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
