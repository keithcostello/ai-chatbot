"use client";

import { ChevronRight, File, Folder, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { GitHubFile, GitHubApiError } from "@/lib/github";
import { listDirectory } from "@/lib/github";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  repo: string;
  token: string;
  onFileSelect: (file: GitHubFile) => void;
  selectedPath?: string;
  highlightedPaths?: string[];
  onError?: (error: GitHubApiError) => void;
}

interface TreeNode extends GitHubFile {
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
}

export function FileTree({
  repo,
  token,
  onFileSelect,
  selectedPath,
  highlightedPaths = [],
  onError,
}: FileTreeProps) {
  const [rootNodes, setRootNodes] = useState<TreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Load root directory on mount
  useEffect(() => {
    loadDirectory("", null);
  }, [repo, token]);

  const loadDirectory = async (path: string, parentNode: TreeNode | null) => {
    try {
      if (parentNode) {
        updateNodeLoading(parentNode.path, true);
      }

      const files = await listDirectory(repo, path, token);

      if (parentNode) {
        // Update parent node with children
        setRootNodes((prev) => updateNodeChildren(prev, parentNode.path, files));
      } else {
        // Set root nodes
        setRootNodes(files);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      onError?.(error as GitHubApiError);
      if (parentNode) {
        updateNodeLoading(parentNode.path, false);
      }
    }
  };

  const updateNodeLoading = (path: string, isLoading: boolean) => {
    setRootNodes((prev) =>
      prev.map((node) => updateNodeRecursive(node, path, { isLoading }))
    );
  };

  const updateNodeChildren = (
    nodes: TreeNode[],
    path: string,
    children: GitHubFile[]
  ): TreeNode[] => {
    return nodes.map((node) => {
      if (node.path === path) {
        return {
          ...node,
          children,
          isExpanded: true,
          isLoading: false,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeChildren(node.children, path, children),
        };
      }
      return node;
    });
  };

  const updateNodeRecursive = (
    node: TreeNode,
    path: string,
    updates: Partial<TreeNode>
  ): TreeNode => {
    if (node.path === path) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) =>
          updateNodeRecursive(child, path, updates)
        ),
      };
    }
    return node;
  };

  const toggleNode = async (node: TreeNode) => {
    if (node.type === "file") {
      onFileSelect(node);
      return;
    }

    // Directory - toggle expand/collapse
    if (node.isExpanded) {
      // Collapse
      setRootNodes((prev) =>
        prev.map((n) => updateNodeRecursive(n, node.path, { isExpanded: false }))
      );
    } else {
      // Expand - load children if not already loaded
      if (!node.children) {
        await loadDirectory(node.path, node);
      } else {
        setRootNodes((prev) =>
          prev.map((n) => updateNodeRecursive(n, node.path, { isExpanded: true }))
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, node: TreeNode, index: number) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        toggleNode(node);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (node.type === "dir" && !node.isExpanded) {
          toggleNode(node);
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (node.type === "dir" && node.isExpanded) {
          toggleNode(node);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, getTotalVisibleNodes() - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Escape":
        e.preventDefault();
        if (selectedPath) {
          onFileSelect({ name: "", path: "", type: "file", sha: "" });
        }
        break;
    }
  };

  const getTotalVisibleNodes = (): number => {
    let count = 0;
    const countNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        count++;
        if (node.isExpanded && node.children) {
          countNodes(node.children);
        }
      });
    };
    countNodes(rootNodes);
    return count;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading repository...
      </div>
    );
  }

  if (rootNodes.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500">
        No files in this directory
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full">
      <TreeNodeList
        nodes={rootNodes}
        level={0}
        onToggle={toggleNode}
        selectedPath={selectedPath}
        highlightedPaths={highlightedPaths}
        focusedIndex={focusedIndex}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

interface TreeNodeListProps {
  nodes: TreeNode[];
  level: number;
  onToggle: (node: TreeNode) => void;
  selectedPath?: string;
  highlightedPaths: string[];
  focusedIndex: number;
  onKeyDown: (e: React.KeyboardEvent, node: TreeNode, index: number) => void;
}

function TreeNodeList({
  nodes,
  level,
  onToggle,
  selectedPath,
  highlightedPaths,
  focusedIndex,
  onKeyDown,
}: TreeNodeListProps) {
  // Calculate all visible indices before rendering
  const flattenNodes = (nodes: TreeNode[]): Array<{node: TreeNode, index: number, level: number}> => {
    let index = 0;
    const flatten = (nodes: TreeNode[], currentLevel: number): Array<{node: TreeNode, index: number, level: number}> => {
      return nodes.flatMap(node => {
        const current = { node, index: index++, level: currentLevel };
        if (node.isExpanded && node.children) {
          return [current, ...flatten(node.children, currentLevel + 1)];
        }
        return [current];
      });
    };
    return flatten(nodes, level);
  };

  const flatNodes = flattenNodes(nodes);

  return (
    <>
      {flatNodes.map(({ node, index: nodeIndex, level: nodeLevel }) => {
        const isSelected = selectedPath === node.path;
        const isHighlighted = highlightedPaths.includes(node.path);
        const isFocused = focusedIndex === nodeIndex;

        return (
          <div key={node.path}>
            <button
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-colors",
                "hover:bg-zinc-700/50",
                isSelected && "bg-zinc-700",
                isHighlighted && "bg-blue-500/10 border-l-2 border-blue-500",
                isFocused && "ring-1 ring-zinc-600"
              )}
              style={{ paddingLeft: `${nodeLevel * 12 + 8}px` }}
              onClick={() => onToggle(node)}
              onKeyDown={(e) => onKeyDown(e, node, nodeIndex)}
              tabIndex={0}
            >
              {node.type === "dir" ? (
                <>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform text-zinc-400",
                      node.isExpanded && "rotate-90"
                    )}
                  />
                  <Folder className="h-4 w-4 text-zinc-400" />
                </>
              ) : (
                <>
                  <span className="w-4" />
                  <File className="h-4 w-4 text-zinc-400" />
                </>
              )}
              <span className={cn(
                "flex-1 truncate",
                isSelected ? "text-zinc-200" : "text-zinc-300",
                isHighlighted && "text-blue-400"
              )}>
                {node.name}
              </span>
              {node.isLoading && (
                <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
              )}
            </button>
          </div>
        );
      })}
    </>
  );
}
