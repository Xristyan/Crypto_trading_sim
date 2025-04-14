import { RequestMethod } from "@/types/actionTypes";

export async function fetchApi<T>(
  url: string,
  options: {
    method: RequestMethod;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
    body?: Record<string, unknown>;
  },
  onResponse?: (response: Response) => Promise<void>
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(url, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: options.credentials,
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });

    if (onResponse) {
      await onResponse(response);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error:
          errorData?.message || `Request failed with status ${response.status}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as T;
    return { data };
  } catch (error) {
    console.log("error", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
