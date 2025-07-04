import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * A single, shared instance of the McpServer for the Harbor tool.
 * All tool definitions will be registered against this instance.
 */
export const server = new McpServer({
  name: "harbor-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});
