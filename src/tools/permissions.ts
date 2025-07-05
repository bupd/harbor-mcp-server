import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

interface Permission {
  resource: string;
  action: string;
}

export function registerGetPermissionsTool() {
  server.tool(
    "get-permissions",
    "Get system or project level permissions info.",
    {},
    async () => {
      const data = await makeHarborRequest<Permission[]>("/permissions");

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve permissions." }],
        };
      }

      const permissionsDetails = data
        .map(
          (permission) =>
            `### Resource: ${permission.resource}\n` +
            `- Action: ${permission.action}`,
        )
        .join("\n\n");

      return { content: [{ type: "text", text: permissionsDetails }] };
    },
  );
}
