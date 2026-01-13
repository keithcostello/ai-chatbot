/**
 * SteerTrue API Client Library
 *
 * Provides interfaces and functions for integrating with the SteerTrue governance API.
 */

export interface AnalyzeRequest {
  message: string;
  user_id: string;
  session_id: string | null;
  source: string;
  project: string;
}

export interface AnalyzeResponse {
  session_id: string;
  system_prompt: string;
  blocks_injected: string[];
  total_tokens: number;
  degraded: boolean;
}

/**
 * Analyzes a user message through the SteerTrue governance API.
 *
 * @param request - The analyze request containing message and metadata
 * @returns Promise<AnalyzeResponse> - Governance directives for the LLM
 *
 * @throws Never throws - returns degraded response on any error
 */
export async function analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const apiUrl = process.env.STEERTRUE_API_URL;

  if (!apiUrl) {
    console.warn('STEERTRUE_API_URL not configured, returning degraded response');
    return createDegradedResponse();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${apiUrl}/api/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`SteerTrue API returned ${response.status}: ${response.statusText}`);
      return createDegradedResponse();
    }

    const data = await response.json();

    return {
      session_id: data.session_id || '',
      system_prompt: data.system_prompt || '',
      blocks_injected: data.blocks_injected || [],
      total_tokens: data.total_tokens || 0,
      degraded: false,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('SteerTrue API request timed out after 10 seconds');
      } else {
        console.error('SteerTrue API request failed:', error.message);
      }
    }
    return createDegradedResponse();
  }
}

/**
 * Creates a degraded response when SteerTrue API is unavailable.
 * Allows chat to continue functioning without governance.
 */
function createDegradedResponse(): AnalyzeResponse {
  return {
    session_id: '',
    system_prompt: '',
    blocks_injected: [],
    total_tokens: 0,
    degraded: true,
  };
}

/**
 * Submits user response/feedback to SteerTrue API.
 *
 * STUB: Implementation placeholder for Stage 1.2 (grading feature).
 *
 * @param sessionId - The session ID from the analyze response
 * @param userResponse - User's feedback or response
 */
export async function submitResponse(
  sessionId: string,
  userResponse: string
): Promise<void> {
  // Stub for Stage 1.2 - will implement grading submission
  console.log('submitResponse stub called:', { sessionId, userResponse });
  // TODO: Implement in Stage 1.2
}
