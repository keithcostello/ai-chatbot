'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import { useCopilotReadable } from '@copilotkit/react-core';

// Import CopilotKit styles
import '@copilotkit/react-ui/styles.css';

// Design colors from CONTEXT.md Section 7
const colors = {
  background: '#f8f4ed',    // Chat area background
  cards: '#f0ebe0',         // Message bubbles (AI)
  sidebar: '#2d4a3e',       // Left sidebar
  primaryAccent: '#5d8a6b', // User message bubbles, buttons
  textPrimary: '#1e3a3a',   // Message text
};

// Inner component that uses CopilotKit hooks
function ChatContent() {
  const { data: session } = useSession();
  const [currentConversationId] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  // useCopilotReadable hooks per CONTEXT.md Section 6 lines 355-373
  // Inject conversation context for LLM awareness
  useCopilotReadable({
    description: "Current conversation ID the user is viewing",
    value: currentConversationId,
  });

  // Inject user context (first name only for PII protection per Adversarial F12 Fix)
  useCopilotReadable({
    description: "User's display name for personalization",
    value: {
      name: session?.user?.name?.split(' ')[0] || 'User',
      id: session?.user?.id,
    },
  });

  // Inject message count for context
  useCopilotReadable({
    description: "Number of messages in current conversation for context",
    value: messageCount,
  });

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.background }}>
      {/* Sidebar - design per CONTEXT.md Section 7 */}
      <div
        className="w-60 p-4 flex flex-col"
        style={{ backgroundColor: colors.sidebar }}
      >
        <div className="text-white text-xl font-bold mb-6">SteerTrue</div>
        <button
          onClick={() => {
            // New chat will be handled by conversation management in Phase 5/6
            setMessageCount(0);
          }}
          className="text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: colors.primaryAccent }}
        >
          + New Chat
        </button>
        <div className="mt-4 text-white/70 text-sm">
          {session?.user?.name && (
            <div className="mt-auto pt-4 border-t border-white/20">
              Signed in as {session.user.name}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area with CopilotChat */}
      <div className="flex-1 flex flex-col">
        <CopilotChat
          labels={{
            title: "SteerTrue Chat",
            initial: "How can I help you today?",
          }}
          className="h-full copilot-chat-custom"
          onInProgress={(inProgress) => {
            // Track when AI is responding for loading states
            console.log('[CopilotChat] inProgress:', inProgress);
          }}
          onSubmitMessage={() => {
            // Increment message count on new message
            setMessageCount(prev => prev + 1);
          }}
        />
      </div>

      {/* Custom styles to match design colors */}
      <style jsx global>{`
        /* Override CopilotKit default styles with design colors */
        .copilot-chat-custom {
          --copilot-kit-background-color: ${colors.background};
          --copilot-kit-primary-color: ${colors.primaryAccent};
          --copilot-kit-secondary-color: ${colors.cards};
        }

        /* Chat container */
        .copilot-chat-custom .copilotKitChat {
          background-color: ${colors.background} !important;
        }

        /* User messages */
        .copilot-chat-custom [data-role="user"] {
          background-color: ${colors.primaryAccent} !important;
          color: white !important;
        }

        /* Assistant messages */
        .copilot-chat-custom [data-role="assistant"] {
          background-color: ${colors.cards} !important;
          color: ${colors.textPrimary} !important;
        }

        /* Input area */
        .copilot-chat-custom input,
        .copilot-chat-custom textarea {
          background-color: white !important;
          color: ${colors.textPrimary} !important;
          border-color: #e5e0d5 !important;
        }

        .copilot-chat-custom input:focus,
        .copilot-chat-custom textarea:focus {
          border-color: ${colors.primaryAccent} !important;
          outline: none !important;
          box-shadow: 0 0 0 2px ${colors.primaryAccent}40 !important;
        }

        /* Send button */
        .copilot-chat-custom button[type="submit"],
        .copilot-chat-custom [data-send-button] {
          background-color: ${colors.primaryAccent} !important;
          color: white !important;
        }

        .copilot-chat-custom button[type="submit"]:hover,
        .copilot-chat-custom [data-send-button]:hover {
          opacity: 0.9 !important;
        }

        /* Message text */
        .copilot-chat-custom .copilotKitMessage {
          color: ${colors.textPrimary} !important;
        }

        /* Header */
        .copilot-chat-custom .copilotKitHeader {
          background-color: ${colors.background} !important;
          border-bottom: 1px solid #e5e0d5 !important;
          color: ${colors.textPrimary} !important;
        }

        /* Scrollbar styling */
        .copilot-chat-custom ::-webkit-scrollbar {
          width: 8px;
        }

        .copilot-chat-custom ::-webkit-scrollbar-track {
          background: ${colors.background};
        }

        .copilot-chat-custom ::-webkit-scrollbar-thumb {
          background: ${colors.primaryAccent}40;
          border-radius: 4px;
        }

        .copilot-chat-custom ::-webkit-scrollbar-thumb:hover {
          background: ${colors.primaryAccent}60;
        }
      `}</style>
    </div>
  );
}

export default function ChatPage() {
  const { status } = useSession();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div style={{ color: colors.textPrimary }}>Loading...</div>
      </div>
    );
  }

  // Wrap with CopilotKit provider pointing to /api/copilot endpoint
  // Per CONTEXT.md Section 6 lines 565-572
  return (
    <CopilotKit runtimeUrl="/api/copilot">
      <ChatContent />
    </CopilotKit>
  );
}
