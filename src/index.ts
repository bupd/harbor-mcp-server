import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- Harbor Configuration ---
const HARBOR_API_BASE = "https://demo.goharbor.io/api/v2.0";
const AUTH_USER = "harbor-cli";
const AUTH_PASS = "Harbor12345";

// --- MCP Server Setup ---
// Create a new server instance with details for the Harbor tool.
const server = new McpServer({
  name: "harbor-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// --- Helper Functions ---

/**
 * Creates a Basic Authentication header value.
 * The format is "Basic " followed by the base64 encoding of "username:password".
 * @param username - The username for authentication.
 * @param password - The password for authentication.
 * @returns The formatted Basic Auth string.
 */
function createAuthHeader(username: string, password: string): string {
  // Correctly encode the "username:password" string in base64.
  const credentials = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${credentials}`;
}

/**
 * A generic helper function to make requests to the Harbor API.
 * It automatically includes the required authentication and content type headers.
 * @param url - The full URL for the API endpoint.
 * @returns A promise that resolves to the JSON response data or null if an error occurs.
 */
async function makeHarborRequest<T>(url: string): Promise<T | null> {
  const headers = {
    Authorization: createAuthHeader(AUTH_USER, AUTH_PASS),
    Accept: "application/json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      // Throw an error if the HTTP response is not successful.
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making Harbor API request:", error);
    return null;
  }
}

// --- Type Interfaces for Harbor API Response ---

/**
 * Defines the structure for a single component in the Harbor health response.
 */
interface HealthComponent {
  name?: string;
  status?: string;
}

/**
 * Defines the structure for the overall health response from the Harbor API.
 */
interface HealthResponse {
  status?: string;
  components?: HealthComponent[];
}

// --- Tool Definition ---

// Register the "get-health" tool with the MCP server.
server.tool(
  "get-health",
  "Get the health status of the Harbor instance.",
  {}, // No input parameters are needed for this tool.
  async () => {
    const healthUrl = `${HARBOR_API_BASE}/health`;
    const healthData = await makeHarborRequest<HealthResponse>(healthUrl);

    // Handle cases where the API request fails.
    if (!healthData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve health data from Harbor. Please check the connection and configuration.",
          },
        ],
      };
    }

    // Format the components' health status into a readable list.
    const componentDetails =
      healthData.components
        ?.map(
          (comp) =>
            `- ${comp.name || "Unknown Component"}: ${comp.status || "Unknown Status"}`,
        )
        .join("\n") || "No component details available.";

    // Construct the final text output.
    const healthText = `
Harbor Health Status
Overall Status: ${healthData.status || "Unknown"}

Component Details:
${componentDetails}
    `.trim();

    return {
      content: [
        {
          type: "text",
          text: healthText,
        },
      ],
    };
  },
);

// --- Main Application Logic ---

/**
 * The main function to initialize and run the MCP server.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Harbor MCP Server running on stdio");
}

// Start the server and handle any fatal errors.
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

