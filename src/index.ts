import { registerGetPermissionsTool } from "./tools/permissions.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcp-server.js";
import {
  registerSearchLdapUserTool,
  registerSearchLdapGroupTool,
} from "./tools/ldap.js";
import { registerGetHealthTool } from "./tools/health.js";
import { registerPingTool } from "./tools/ping.js";
import { registerGetStatisticsTool } from "./tools/statistics.js";
import {
  registerListProjectsTool,
  registerGetProjectTool,
  registerGetProjectDeletableTool,
  registerGetProjectSummaryTool,
  registerListProjectMembersTool,
} from "./tools/projects.js";
import { registerListRepositoriesTool } from "./tools/repositories.js";
import { registerListQuotasTool } from "./tools/quotas.js";
import { registerSearchTool } from "./tools/search.js";
import { registerGetConfigurationsTool } from "./tools/configurations.js";
import { registerGetSystemInfoTool } from "./tools/systeminfo.js";
import { registerGetVolumesTool } from "./tools/volumes.js";
import { registerGetWorkerPoolsTool } from "./tools/workerpools.js";
import { registerGetWorkersTool } from "./tools/workers.js";
import { registerListJobQueuesTool } from "./tools/jobqueues.js";
import { registerListSchedulesTool } from "./tools/schedules.js";
import { registerGetSchedulePausedTool } from "./tools/schedulepaused.js";
import { registerGetRetentionTool } from "./tools/retention.js";
import { registerListRetentionExecutionsTool } from "./tools/retentionexecutions.js";
import { registerListRetentionTasksTool } from "./tools/retentiontasks.js";
import { registerGetRetentionTaskLogTool } from "./tools/retentiontasklog.js";
import { registerGetScannerTool } from "./tools/scanner.js";
import { registerGetScannerMetadataTool } from "./tools/scannermetadata.js";
import { registerGetCertTool } from "./tools/cert.js";
import { registerGetJobLogTool } from "./tools/joblog.js";

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
  registerGetProjectTool();
  registerGetProjectDeletableTool();
  registerGetProjectSummaryTool();
  registerListProjectMembersTool();
  registerListRepositoriesTool();
  registerListQuotasTool();
  registerSearchTool();
  registerGetConfigurationsTool();
  registerSearchLdapUserTool();
  registerSearchLdapGroupTool();
  registerGetSystemInfoTool();
  registerGetVolumesTool();
  registerGetWorkerPoolsTool();
  registerGetWorkersTool();
  registerListJobQueuesTool();
  registerListSchedulesTool();
  registerGetSchedulePausedTool();
  registerGetRetentionTool();
  registerListRetentionExecutionsTool();
  registerListRetentionTasksTool();
  registerGetRetentionTaskLogTool();
  registerGetScannerTool();
  registerGetScannerMetadataTool();
  registerGetCertTool();
  registerGetJobLogTool();
  registerGetPermissionsTool();
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
