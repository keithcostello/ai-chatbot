export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  size?: number;
  content?: string;
}

export interface GitHubApiError {
  status: number;
  message: string;
  type: 'auth_error' | 'rate_limit' | 'not_found' | 'network_error' | 'unknown';
  resetTime?: number; // For rate_limit: Unix timestamp when limit resets
}

const TIMEOUT_MS = 10000; // 10 seconds

/**
 * List files and directories in a GitHub repository path
 */
export async function listDirectory(
  repo: string,
  path: string,
  token: string,
  signal?: AbortSignal
): Promise<GitHubFile[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Chain the external signal if provided
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const encodedPath = encodeURIComponent(path);
    const url = `https://api.github.com/repos/${repo}/contents/${encodedPath}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();

    // Ensure we got an array (directory listing)
    if (!Array.isArray(data)) {
      throw {
        status: 400,
        message: 'Path is not a directory',
        type: 'unknown',
      } as GitHubApiError;
    }

    return data.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type === 'dir' ? 'dir' : 'file',
      sha: item.sha,
      size: item.size,
    }));
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw {
        status: 0,
        message: 'Request timed out',
        type: 'network_error',
      } as GitHubApiError;
    }

    if (error.type) {
      throw error; // Already a GitHubApiError
    }

    throw {
      status: 0,
      message: 'Network request failed',
      type: 'network_error',
    } as GitHubApiError;
  }
}

/**
 * Get file content by blob SHA
 */
export async function getFileContent(
  repo: string,
  sha: string,
  token: string,
  signal?: AbortSignal
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const url = `https://api.github.com/repos/${repo}/git/blobs/${sha}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await handleApiError(response);
    }

    const data = await response.json();

    // Decode base64 content
    if (data.encoding === 'base64') {
      return atob(data.content.replace(/\n/g, ''));
    }

    return data.content;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw {
        status: 0,
        message: 'Request timed out',
        type: 'network_error',
      } as GitHubApiError;
    }

    if (error.type) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Network request failed',
      type: 'network_error',
    } as GitHubApiError;
  }
}

/**
 * Handle API error responses
 */
async function handleApiError(response: Response): Promise<GitHubApiError> {
  const status = response.status;

  // 401: Authentication failed
  if (status === 401) {
    return {
      status,
      message: 'Authentication failed',
      type: 'auth_error',
    };
  }

  // 403: Could be rate limit or permission issue
  if (status === 403) {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');

    if (remaining === '0' && reset) {
      return {
        status,
        message: 'Rate limit exceeded',
        type: 'rate_limit',
        resetTime: parseInt(reset, 10),
      };
    }

    return {
      status,
      message: 'Permission denied',
      type: 'auth_error',
    };
  }

  // 404: Not found
  if (status === 404) {
    return {
      status,
      message: 'Repository or path not found',
      type: 'not_found',
    };
  }

  // Other errors
  let message = 'Unknown error';
  try {
    const data = await response.json();
    message = data.message || message;
  } catch {
    // Ignore JSON parse errors
  }

  return {
    status,
    message,
    type: 'unknown',
  };
}
