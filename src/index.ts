import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcp-server.js";
import { registerGetHealthTool } from "./tools/health.js";
import { registerPingTool } from "./tools/ping.js";
import { registerGetStatisticsTool } from "./tools/statistics.js";
import { registerListProjectsTool } from "./tools/projects.js";
import { registerListRepositoriesTool } from "./tools/repositories.js";
import { registerListQuotasTool } from "./tools/quotas.js";

/**
 * The main function to initialize and run the MCP server.
 */
async function main() {
  // Register all available tools with the server.
  console.error("Registering Harbor tools...");
  registerGetHealthTool();
  registerPingTool();
  registerGetStatisticsTool();
  registerListProjectsTool();
  registerListRepositoriesTool();
  registerListQuotasTool();
  console.error("All tools registered.");

  // Connect the server to a transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Harbor MCP Server running on stdio");
}

// Start the server and handle any fatal errors.
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
