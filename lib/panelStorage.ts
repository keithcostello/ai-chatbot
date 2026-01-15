export const PANEL_STORAGE_VERSION = 1;
export const PANEL_STORAGE_KEY = 'right-panel-width';

interface StoredPanelWidth {
  version: number;
  width: number;
}

/**
 * Save panel width to localStorage with version schema
 * @param width - Panel width as percentage (0-100)
 */
export function savePanelWidth(width: number): void {
  if (typeof window === 'undefined') return;

  try {
    const data: StoredPanelWidth = {
      version: PANEL_STORAGE_VERSION,
      width,
    };
    localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save panel width:', error);
  }
}

/**
 * Load panel width from localStorage
 * Returns null if not found or version mismatch
 * Gracefully clears storage on version mismatch
 * @returns Panel width as percentage (0-100) or null
 */
export function loadPanelWidth(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(PANEL_STORAGE_KEY);
    if (!stored) return null;

    const data: StoredPanelWidth = JSON.parse(stored);

    // Version check - clear if mismatch
    if (data.version !== PANEL_STORAGE_VERSION) {
      localStorage.removeItem(PANEL_STORAGE_KEY);
      return null;
    }

    return data.width;
  } catch (error) {
    console.warn('Failed to load panel width:', error);
    // Clear corrupted data
    localStorage.removeItem(PANEL_STORAGE_KEY);
    return null;
  }
}
