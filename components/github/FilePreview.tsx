"use client";

import { Check, FileCode, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { GitHubFile, GitHubApiError } from "@/lib/github";
import { getFileContent } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilePreviewProps {
  file: GitHubFile;
  repo: string;
  token: string;
  onAddToChat: (file: GitHubFile, content: string) => void;
  onError?: (error: GitHubApiError) => void;
  abortSignal?: AbortSignal;
}

const MAX_FILE_SIZE = 500 * 1024; // 500KB

const BINARY_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.pdf', '.exe', '.zip',
  '.tar', '.gz', '.wasm', '.ico', '.mp3', '.mp4', '.mov',
  '.avi', '.bmp', '.webp', '.svg', '.bin', '.dll'
];

export function FilePreview({
  file,
  repo,
  token,
  onAddToChat,
  onError,
  abortSignal,
}: FilePreviewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    loadContent();
  }, [file.sha]);

  const loadContent = async () => {
    setIsLoading(true);
    setError(null);
    setContent(null);

    // Check file size
    if (file.size && file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      setError(`File too large to preview (${sizeMB} MB). Maximum size is 500KB.`);
      setIsLoading(false);
      return;
    }

    // Check if binary file
    const extension = getFileExtension(file.name);
    if (BINARY_EXTENSIONS.includes(extension)) {
      setError(`Binary file cannot be previewed`);
      setIsLoading(false);
      return;
    }

    try {
      const fileContent = await getFileContent(repo, file.sha, token, abortSignal);
      setContent(fileContent);
    } catch (err) {
      const apiError = err as GitHubApiError;
      setError(apiError.message);
      onError?.(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToChat = () => {
    if (content) {
      onAddToChat(file, content);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const getFileExtension = (filename: string): string => {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.substring(lastDot).toLowerCase();
  };

  const getLanguageFromFilename = (filename: string): string => {
    const extension = getFileExtension(filename);
    const languageMap: Record<string, string> = {
      '.js': 'javascript',
      '.jsx': 'jsx',
      '.ts': 'typescript',
      '.tsx': 'tsx',
      '.py': 'python',
      '.java': 'java',
      '.c': 'c',
      '.cpp': 'cpp',
      '.cs': 'csharp',
      '.go': 'go',
      '.rs': 'rust',
      '.rb': 'ruby',
      '.php': 'php',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.scala': 'scala',
      '.sh': 'bash',
      '.bash': 'bash',
      '.zsh': 'bash',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.json': 'json',
      '.xml': 'xml',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less',
      '.md': 'markdown',
      '.sql': 'sql',
      '.dockerfile': 'docker',
      '.graphql': 'graphql',
      '.prisma': 'prisma',
    };
    return languageMap[extension] || 'text';
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mb-4" />
        <p className="text-sm text-zinc-400">Loading file content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-sm text-zinc-500">No content available</p>
      </div>
    );
  }

  const language = getLanguageFromFilename(file.name);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 bg-zinc-800">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FileCode className="h-4 w-4 text-zinc-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-200 truncate">
              {file.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {file.path} • {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleAddToChat}
          disabled={isAdded}
          className={cn(
            "shrink-0 ml-4",
            isAdded && "bg-green-500/20 hover:bg-green-500/20"
          )}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-1 text-green-400" />
              <span className="text-green-400">Added</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add to Chat
            </>
          )}
        </Button>
      </div>

      {/* Code content */}
      <div className="flex-1 overflow-auto bg-zinc-900">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            background: 'transparent',
          }}
          codeTagProps={{
            className: 'font-mono text-sm',
          }}
          lineNumberStyle={{
            color: '#71717a',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
