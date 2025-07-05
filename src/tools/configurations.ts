import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

interface ConfigurationsResponse {
  [key: string]: any;
}

export function registerGetConfigurationsTool() {
  server.tool(
    "get-configurations",
    "Get Harbor system configurations (admin only).",
    {},
    async () => {
      const data = await makeHarborRequest<ConfigurationsResponse>("/configurations");

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve system configurations. You may need admin permissions or be logged in." },
          ],
        };
      }

      const keys = Object.keys(data);
      if (keys.length === 0) {
        return { content: [{ type: "text", text: "No system configurations found." }] };
      }

      const configList = keys
        .map((k) => `- **${k}**: ${JSON.stringify(data[k])}`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Harbor System Configurations (admin only):\n${configList}`,
          },
        ],
      };
    }
  );
} 