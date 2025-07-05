/**
 * Centralized configuration for the Harbor MCP tool.
 * All values must be set via environment variables.
 */
const apiBase = process.env.HARBOR_API_BASE;
const authUser = process.env.HARBOR_AUTH_USER;
const authPass = process.env.HARBOR_AUTH_PASS;

if (!apiBase || !authUser || !authPass) {
  throw new Error(
    "Missing required Harbor configuration. Please set HARBOR_API_BASE, HARBOR_AUTH_USER, and HARBOR_AUTH_PASS environment variables."
  );
}

/**
 * Options for making a request to the Harbor API.
 */
interface HarborRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, any>;
  needsAuth?: boolean;
}

/**
 * Creates a Basic Authentication header value.
 * The format is "Basic " followed by the base64 encoding of "username:password".
 * @param username - The username for authentication.
 * @param password - The password for authentication.
 * @returns The formatted Basic Auth string.
 */
function createAuthHeader(username: string, password: string): string {
  const credentials = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${credentials}`;
}

/**
 * A generic helper function to make requests to the Harbor API.
 * Handles authentication, JSON, text responses, and query params.
 * @param path - The API endpoint path (e.g., "/health").
 * @param options - Request options.
 * @returns A promise that resolves to the response data or null on error.
 */
export async function makeHarborRequest<T>(
  path: string,
  options: HarborRequestOptions = {},
): Promise<T | null> {
  const { method = "GET", body, query, needsAuth = true } = options;
  const baseUrl = `${apiBase}${path}`;

  const url = new URL(baseUrl);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers: HeadersInit = {
    // Only add Accept header for authenticated requests that expect JSON
    Accept: needsAuth ? "application/json" : "text/plain",
  };

  if (needsAuth) {
    headers.Authorization = createAuthHeader(authUser!, authPass!);
  }

  const requestInit: RequestInit = {
    method,
    headers,
  };

  if (body) {
    headers["Content-Type"] = "application/json";
    requestInit.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), requestInit);
    if (!response.ok) {
      console.error(
        `Harbor API Error: ${response.status} ${response.statusText}`,
        await response.text(),
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check content type to decide how to parse the response
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else {
      // For text/plain or other types, return the text directly
      return (await response.text()) as T;
    }
  } catch (error) {
    console.error("Error making Harbor API request:", error);
    return null;
  }
}
