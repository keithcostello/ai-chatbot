"use client";

/**
 * Chat Page - Phase 2 Frontend Connection
 *
 * Uses official CopilotKit + Pydantic AI pattern from PROMPT.md
 * Source: https://github.com/CopilotKit/with-pydantic-ai
 *
 * Route: /chat
 */

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function ChatPage() {
  const runtimeUrl = process.env.NEXT_PUBLIC_COPILOT_RUNTIME_URL;

  // Debug: Log runtime URL in development
  if (process.env.NODE_ENV === "development") {
    console.log("CopilotKit runtimeUrl:", runtimeUrl);
  }

  if (!runtimeUrl) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}>
        <p style={{ color: "#dc3545" }}>
          Error: NEXT_PUBLIC_COPILOT_RUNTIME_URL is not configured
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <CopilotKit runtimeUrl={runtimeUrl}>
        <CopilotChat
          labels={{
            title: "SteerTrue Chat",
            initial: "How can I help you today?",
          }}
          className="h-full"
        />
      </CopilotKit>
    </div>
  );
}
