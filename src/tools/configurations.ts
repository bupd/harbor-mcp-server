import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";
import { z } from "zod";

interface ConfigurationsResponse {
  [key: string]: any;
}

const UpdateConfigurationsParamsShape = {
  configurations: z
    .record(z.any())
    .describe(
      "A map of configuration keys and their new values. Only editable fields will be updated. Example: { token_expiration: 31 }"
    ),
  confirm: z
    .boolean()
    .describe(
      "You must set this to true to confirm you want to make these changes. This is required because configuration changes can heavily impact the Harbor server."
    ),
};

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

  // PUT endpoint for updating configurations
  server.tool(
    "update-configurations",
    "Update Harbor system configurations (admin only, confirmation required). ⚠️ WARNING: This action can heavily impact the Harbor server. The AI will always ask for explicit user confirmation before proceeding. Only use this if you are an admin and fully understand the consequences.",
    UpdateConfigurationsParamsShape,
    async (params) => {
      const { configurations, confirm } = params;
      if (!confirm) {
        return {
          content: [
            {
              type: "text",
              text:
                "❗ You must explicitly confirm this action by setting 'confirm' to true. Configuration changes can have major impact. The AI will not proceed without your confirmation.",
            },
          ],
        };
      }
      // Only send the provided keys/values
      try {
        await makeHarborRequest<any>("/configurations", {
          method: "PUT",
          body: configurations,
        });
        return {
          content: [
            {
              type: "text",
              text:
                "✅ Configuration update request sent successfully (empty response body, status code indicates success). Please verify the changes in the Harbor UI or by fetching the configurations again.",
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text:
                "Failed to update configurations. You may need admin permissions, or there was an error with the request.",
            },
          ],
        };
      }
    }
  );
}
