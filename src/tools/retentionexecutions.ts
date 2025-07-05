import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const ListRetentionExecutionsParamsShape = {
  id: z.number().int().describe("The ID of the retention policy."),
  page: z
    .number()
    .int()
    .optional()
    .default(1)
    .describe("The page number to retrieve."),
  page_size: z
    .number()
    .int()
    .optional()
    .default(10)
    .describe("The number of executions per page."),
};

interface RetentionExecution {
  id: number;
  policy_id: number;
  start_time: string;
  end_time: string;
  status: string;
  trigger: string;
  dry_run: boolean;
}

export function registerListRetentionExecutionsTool() {
  server.tool(
    "list-retention-executions",
    "List retention executions.",
    ListRetentionExecutionsParamsShape,
    async (params) => {
      const { id, ...query } = params;
      const data = await makeHarborRequest<RetentionExecution[]>(
        `/retentions/${id}/executions`,
        { query },
      );

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve retention executions." },
          ],
        };
      }

      if (data.length === 0) {
        return {
          content: [{ type: "text", text: "No retention executions found." }],
        };
      }

      const retentionExecutionsDetails = data
        .map(
          (execution) =>
            `### Execution: ${execution.id}\n` +
            `- Policy ID: ${execution.policy_id}\n` +
            `- Status: ${execution.status}\n` +
            `- Trigger: ${execution.trigger}\n` +
            `- Dry Run: ${execution.dry_run}\n` +
            `- Start Time: ${new Date(execution.start_time).toLocaleString()}\n` +
            `- End Time: ${new Date(execution.end_time).toLocaleString()}`,
        )
        .join("\n\n");

      return { content: [{ type: "text", text: retentionExecutionsDetails }] };
    },
  );
}
