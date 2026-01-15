'use client';

import { useState, useEffect } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { loadPanelWidth, savePanelWidth } from '@/lib/panelStorage';

interface RightPanelProps {
  children: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  mainContent?: React.ReactNode;
}

const MIN_WIDTH_PERCENT = 20; // ~280px at 1400px viewport
const MAX_WIDTH_PERCENT = 35; // ~480px at 1400px viewport
const DEFAULT_WIDTH_PERCENT = 23; // ~320px at 1400px viewport

export function RightPanel({ children, title, defaultOpen = true, mainContent }: RightPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [panelWidth, setPanelWidth] = useState<number>(DEFAULT_WIDTH_PERCENT);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved width on mount
  useEffect(() => {
    const savedWidth = loadPanelWidth();
    if (savedWidth !== null) {
      setPanelWidth(savedWidth);
    }
    setIsInitialized(true);
  }, []);

  const handleResize = (layout: { [panelId: string]: number }) => {
    // In v4, layout is an object mapping panel IDs to percentages
    // We need to find the right panel's size from the layout object
    const panelIds = Object.keys(layout);
    if (panelIds.length >= 2) {
      // Second panel is the right panel
      const rightPanelId = panelIds[1];
      const newWidth = layout[rightPanelId];
      if (newWidth !== undefined && newWidth >= MIN_WIDTH_PERCENT && newWidth <= MAX_WIDTH_PERCENT) {
        setPanelWidth(newWidth);
        savePanelWidth(newWidth);
      }
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Don't render until we've checked localStorage to avoid flash
  if (!isInitialized) {
    return null;
  }

  return (
    <Group orientation="horizontal" onLayoutChanged={handleResize}>
      {/* Main content panel */}
      <Panel defaultSize={100 - panelWidth} minSize={65} maxSize={80}>
        <div className="relative h-full">
          {/* Main content */}
          {mainContent}
          {/* Toggle button positioned on the right edge of main panel */}
          <button
            onClick={togglePanel}
            className="absolute right-0 top-4 z-10 w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-l border border-zinc-700 text-zinc-400"
            aria-label={isOpen ? 'Close panel' : 'Open panel'}
          >
            {isOpen ? '›' : '‹'}
          </button>
        </div>
      </Panel>

      {/* Right panel - only render when open */}
      {isOpen && (
        <>
          <Separator className="w-1 bg-zinc-800 hover:bg-zinc-600 transition-colors cursor-col-resize" />
          <Panel
            defaultSize={panelWidth}
            minSize={MIN_WIDTH_PERCENT}
            maxSize={MAX_WIDTH_PERCENT}
            className="border-l border-zinc-800 bg-zinc-900"
          >
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
              </div>
              <div className="p-4">{children}</div>
            </div>
          </Panel>
        </>
      )}
    </Group>
  );
}
