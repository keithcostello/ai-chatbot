'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import { useCopilotReadable, useCopilotChatInternal } from '@copilotkit/react-core';

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

// Conversation type
interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Message type from API
interface StoredMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  blocksInjected?: string[];
  totalTokens?: number;
}

// Convert stored messages to CopilotKit format
function storedToAgUIMessages(stored: StoredMessage[]): Array<{
  id: string;
  role: 'user' | 'assistant';
  content: string;
}> {
  return stored
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
}

// Component that handles message loading
function MessageLoader({
  conversationId,
  onMessagesLoaded
}: {
  conversationId: string | null;
  onMessagesLoaded: (count: number) => void;
}) {
  const { setMessages } = useCopilotChatInternal();

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      console.log('[MessageLoader] No conversation, clearing messages');
      setMessages([]);
      onMessagesLoaded(0);
      return;
    }

    const loadMessages = async () => {
      try {
        console.log('[MessageLoader] Loading messages for:', conversationId);
        const response = await fetch(`/api/conversations/${conversationId}/messages`);
        if (response.ok) {
          const data = await response.json();
          const agUIMessages = storedToAgUIMessages(data.messages || []);
          console.log('[MessageLoader] Loaded', agUIMessages.length, 'messages');
          setMessages(agUIMessages);
          onMessagesLoaded(agUIMessages.length);
        } else if (response.status === 404) {
          console.log('[MessageLoader] Conversation not found, clearing messages');
          setMessages([]);
          onMessagesLoaded(0);
        }
      } catch (error) {
        console.error('[MessageLoader] Failed to load messages:', error);
        setMessages([]);
        onMessagesLoaded(0);
      }
    };

    loadMessages();
  }, [conversationId, setMessages, onMessagesLoaded]);

  return null; // This component only handles side effects
}

// Inner component that uses CopilotKit hooks
function ChatContent({
  currentConversationId,
  conversations,
  onNewChat,
  onSelectConversation,
}: {
  currentConversationId: string | null;
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}) {
  const { data: session } = useSession();
  const [messageCount, setMessageCount] = useState(0);

  // Handle message count updates
  const handleMessagesLoaded = useCallback((count: number) => {
    setMessageCount(count);
  }, []);

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
      {/* Message loader - loads persisted messages into CopilotKit state */}
      <MessageLoader
        conversationId={currentConversationId}
        onMessagesLoaded={handleMessagesLoaded}
      />

      {/* Sidebar - design per CONTEXT.md Section 7 */}
      <div
        className="w-60 p-4 flex flex-col"
        style={{ backgroundColor: colors.sidebar }}
      >
        <div className="text-white text-xl font-bold mb-6">SteerTrue</div>
        <button
          onClick={onNewChat}
          className="text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: colors.primaryAccent }}
        >
          + New Chat
        </button>

        {/* Conversation list */}
        <div className="mt-4 flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-white/50 text-sm text-center py-4">
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 truncate text-sm transition-colors ${
                  currentConversationId === conv.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {conv.title}
              </button>
            ))
          )}
        </div>

        <div className="mt-4 text-white/70 text-sm">
          {session?.user?.name && (
            <div className="pt-4 border-t border-white/20">
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
            initial: currentConversationId
              ? "Loading conversation..."
              : "Click 'New Chat' to start a conversation",
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  // Load conversations on mount
  useEffect(() => {
    if (status === 'authenticated') {
      loadConversations();
    }
  }, [status]);

  // Load user's conversations
  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        console.log('[ChatPage] Loaded', data.conversations?.length || 0, 'conversations');
      }
    } catch (error) {
      console.error('[ChatPage] Failed to load conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Create new conversation
  const handleNewChat = useCallback(async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      if (response.ok) {
        const newConv = await response.json();
        console.log('[ChatPage] Created new conversation:', newConv.id);
        setConversations(prev => [newConv, ...prev]);
        setCurrentConversationId(newConv.id);
      }
    } catch (error) {
      console.error('[ChatPage] Failed to create conversation:', error);
    }
  }, []);

  // Select existing conversation
  const handleSelectConversation = useCallback((id: string) => {
    console.log('[ChatPage] Selected conversation:', id);
    setCurrentConversationId(id);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  if (status === 'loading' || isLoadingConversations) {
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
  // Phase 5: Pass conversationId via headers for persistence
  return (
    <CopilotKit
      runtimeUrl="/api/copilot"
      headers={{
        'X-Conversation-Id': currentConversationId || '',
      }}
    >
      <ChatContent
        currentConversationId={currentConversationId}
        conversations={conversations}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
    </CopilotKit>
  );
}
