'use client';

import { useState } from 'react';

interface RightPanelProps {
  children: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
}

export function RightPanel({ children, title, defaultOpen = true }: RightPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="relative flex">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-8 top-4 z-10 w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-l border border-zinc-700 text-zinc-400"
      >
        {isOpen ? '›' : '‹'}
      </button>
      <div className={`transition-all duration-300 overflow-hidden border-l border-zinc-800 bg-zinc-900 ${isOpen ? 'w-80' : 'w-0'}`}>
        <div className="w-80 h-full overflow-y-auto">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
