export const SETTINGS_STORAGE_VERSION = 1;
export const SETTINGS_STORAGE_KEY = 'block-settings';

interface BlockData {
  role: string;
  scope: string;
  is: string[];
  isNot: string[];
  must: string[];
  prohibited: string[];
}

interface StoredSettings {
  version: number;
  data: BlockData;
}

// Save with version schema
export function saveBlockSettings(data: BlockData): boolean {
  try {
    const stored: StoredSettings = {
      version: SETTINGS_STORAGE_VERSION,
      data,
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(stored));
    return true;
  } catch (error) {
    // localStorage.setItem can throw QuotaExceededError
    return false;
  }
}

// Load with version check and data shape validation
export function loadBlockSettings(): BlockData | null {
  try {
    const item = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!item) {
      return null;
    }

    const stored: StoredSettings = JSON.parse(item);

    // Version mismatch → clear and return null
    if (stored.version !== SETTINGS_STORAGE_VERSION) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      return null;
    }

    // Validate data shape - use defaults for missing fields
    const data = stored.data;
    return {
      role: data.role || '',
      scope: data.scope || '',
      is: Array.isArray(data.is) ? data.is : [],
      isNot: Array.isArray(data.isNot) ? data.isNot : [],
      must: Array.isArray(data.must) ? data.must : [],
      prohibited: Array.isArray(data.prohibited) ? data.prohibited : [],
    };
  } catch (error) {
    // Parse error → clear and return null
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    return null;
  }
}
