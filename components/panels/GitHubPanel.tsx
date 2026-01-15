"use client";

import { useState, useRef } from "react";
import { FileTree } from "@/components/github/FileTree";
import { FilePreview } from "@/components/github/FilePreview";
import type { GitHubFile, GitHubApiError } from "@/lib/github";
import { AlertCircle, Github } from "lucide-react";

interface GitHubPanelProps {
  repo: string;
  token: string;
  onFileSelect?: (file: GitHubFile, content: string) => void;
  highlightedPaths?: string[];
  onError?: (error: GitHubApiError) => void;
}

export function GitHubPanel({
  repo,
  token,
  onFileSelect,
  highlightedPaths = [],
  onError,
}: GitHubPanelProps) {
  const [selectedFile, setSelectedFile] = useState<GitHubFile | null>(null);
  const [error, setError] = useState<GitHubApiError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileSelect = (file: GitHubFile) => {
    // Deselect if clicking the same file
    if (selectedFile?.path === file.path) {
      setSelectedFile(null);
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Only select files, not directories
    if (file.type === "file") {
      abortControllerRef.current = new AbortController();
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAddToChat = (file: GitHubFile, content: string) => {
    onFileSelect?.(file, content);
  };

  const handleError = (error: GitHubApiError) => {
    setError(error);
    onError?.(error);
  };

  const getErrorDisplay = (error: GitHubApiError) => {
    const errorMessages: Record<string, string> = {
      auth_error: "Authentication failed. Please check your GitHub token.",
      rate_limit: error.resetTime
        ? `Rate limit exceeded. Resets at ${new Date(error.resetTime * 1000).toLocaleTimeString()}`
        : "Rate limit exceeded. Please try again later.",
      not_found: "Repository or path not found.",
      network_error: "Unable to connect. Please check your network connection.",
      unknown: "An unexpected error occurred.",
    };

    return errorMessages[error.type] || error.message;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-700 bg-zinc-800">
        <Github className="h-5 w-5 text-zinc-400" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-zinc-200">GitHub Browser</h3>
          <p className="text-xs text-zinc-500 truncate">{repo}</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && error.type !== 'network_error' && (
        <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{getErrorDisplay(error)}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex min-h-0">
        {/* File Tree */}
        <div className="w-64 border-r border-zinc-700 overflow-auto bg-zinc-800">
          <FileTree
            repo={repo}
            token={token}
            onFileSelect={handleFileSelect}
            selectedPath={selectedFile?.path}
            highlightedPaths={highlightedPaths}
            onError={handleError}
          />
        </div>

        {/* File Preview */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <FilePreview
              file={selectedFile}
              repo={repo}
              token={token}
              onAddToChat={handleAddToChat}
              onError={handleError}
              abortSignal={abortControllerRef.current?.signal}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <Github className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-sm text-zinc-500">
                  Select a file to preview
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
