import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

/**
 * Registers the 'ping' tool with the MCP server.
 * This tool checks if the Harbor API server is alive.
 */
export function registerPingTool() {
  server.tool(
    "ping",
    "Pings the Harbor API server to check if it is alive. This does not check the health of underlying components.",
    {},
    async () => {
      // Call the API helper, specifying that this endpoint does NOT need auth.
      // We expect a string response, as per the Swagger doc (text/plain).
      const pingResponse = await makeHarborRequest<string>("/ping", {
        needsAuth: false,
      });

      // Handle cases where the API request fails.
      if (!pingResponse) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to get a response from the Harbor /ping endpoint. The server may be down or unreachable.",
            },
          ],
        };
      }

      // Construct the final text output.
      const responseText = `
Harbor Ping Check
Server Response: ${pingResponse}
Status: The Harbor API server is up and responding.
      `.trim();

      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    },
  );
}
