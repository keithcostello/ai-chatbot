"use client";

/**
 * Chat Page - Phase 2 Frontend Connection
 *
 * Uses official CopilotKit + Pydantic AI pattern from PROMPT.md
 * Source: https://github.com/CopilotKit/with-pydantic-ai
 *
 * Route: /chat
 *
 * Environment: NEXT_PUBLIC_COPILOT_RUNTIME_URL must be set with https:// prefix
 */

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function ChatPage() {
  // Use local proxy to avoid mixed content issues with external agent
  // The proxy at /api/copilotkit forwards to PYDANTIC_AI_URL server-side
  const runtimeUrl = "/api/copilotkit";

  // Debug: Log runtime URL
  console.log("CopilotKit runtimeUrl:", runtimeUrl);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <CopilotKit runtimeUrl={runtimeUrl} agent="steertrue_agent">
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
