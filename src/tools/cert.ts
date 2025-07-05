import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

export function registerGetCertTool() {
  server.tool("get-cert", "Get default root certificate.", {}, async () => {
    const data = await makeHarborRequest<any>("/systeminfo/getcert");

    if (!data) {
      return {
        content: [{ type: "text", text: "Failed to retrieve certificate." }],
      };
    }

    return { content: [{ type: "text", text: JSON.stringify(data) }] };
  });
}
