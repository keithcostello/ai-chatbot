"use client";

import { useState } from "react";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { RightPanel } from "@/components/panels/RightPanel";
import { GitHubPanel } from "@/components/panels/GitHubPanel";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import type { GitHubFile } from "@/lib/github";

// ChatFileContext: state shape for chat ↔ panel communication
interface ChatFileContext {
  selectedFile: GitHubFile | null;
  highlightedPaths: string[];
}

export default function Page() {
  const [chatId] = useState(() => generateUUID());
  const [fileContext, setFileContext] = useState<ChatFileContext>({
    selectedFile: null,
    highlightedPaths: [],
  });

  const handleFileSelect = (file: GitHubFile, content: string) => {
    setFileContext((prev) => ({
      ...prev,
      selectedFile: { ...file, content },
    }));
  };

  return (
    <>
      <div className="flex h-dvh">
        <RightPanel
          title="GitHub Browser"
          mainContent={
            <Chat
              autoResume={false}
              id={chatId}
              initialChatModel={DEFAULT_CHAT_MODEL}
              initialMessages={[]}
              initialVisibilityType="private"
              isReadonly={false}
              key={chatId}
              selectedFile={fileContext.selectedFile}
            />
          }
        >
          <GitHubPanel
            repo="keithcostello/mlaia-sprint"
            token={process.env.NEXT_PUBLIC_GITHUB_TOKEN || ""}
            onFileSelect={handleFileSelect}
            highlightedPaths={fileContext.highlightedPaths}
          />
        </RightPanel>
      </div>
      <DataStreamHandler />
    </>
  );
}
