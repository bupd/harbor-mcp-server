import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

interface HealthComponent {
  name?: string;
  status?: string;
}
interface HealthResponse {
  status?: string;
  components?: HealthComponent[];
}

/**
 * Registers the 'get-health' tool with the MCP server.
 */
export function registerGetHealthTool() {
  server.tool(
    "get-health",
    "Get the health status of the Harbor instance.",
    {},
    async () => {
      const healthData = await makeHarborRequest<HealthResponse>("/health");

      if (!healthData) {
        return {
          content: [{ type: "text", text: "Failed to retrieve health data." }],
        };
      }

      const componentDetails =
        healthData.components
          ?.map((c) => `- ${c.name || "Unknown"}: ${c.status || "Unknown"}`)
          .join("\n") || "No component details.";

      const healthText = `
Harbor Health Status
Overall Status: ${healthData.status || "Unknown"}

Component Details:
${componentDetails}
      `.trim();

      return { content: [{ type: "text", text: healthText }] };
    },
  );
}
