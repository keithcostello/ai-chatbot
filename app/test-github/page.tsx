'use client';

import { GitHubPanel } from '@/components/panels/GitHubPanel';
import { GitHubFile } from '@/lib/github';

export default function TestGitHubPage() {
  const handleFileSelect = (file: GitHubFile) => {
    console.log('File selected:', file.path);
  };

  // Test with public repo - no token needed for public repos
  return (
    <div className="h-screen bg-zinc-900 p-4">
      <h1 className="text-white mb-4">GitHub Panel Test</h1>
      <div className="h-[calc(100vh-100px)]">
        <GitHubPanel
          repo="vercel/next.js"
          token=""
          onFileSelect={handleFileSelect}
        />
      </div>
    </div>
  );
}
