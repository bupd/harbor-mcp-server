import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

interface InternalConfigResponse {
  [key: string]: {
    value: any;
    editable: boolean;
  };
}

export function registerGetInternalConfigTool() {
  server.tool(
    "get-internal-config",
    "Get internal configurations.",
    {},
    async () => {
      const data =
        await makeHarborRequest<InternalConfigResponse>("/internalconfig");

      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve internal configurations.",
            },
          ],
        };
      }

      let output = "## Internal Configurations\n";
      for (const key in data) {
        output += `- **${key}**: ${data[key].value} (Editable: ${data[key].editable})\n`;
      }

      return { content: [{ type: "text", text: output }] };
    },
  );
}
