import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const ListRetentionTasksParamsShape = {
  id: z.number().int().describe("The ID of the retention policy."),
  eid: z.number().int().describe("The ID of the retention execution."),
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
    .describe("The number of tasks per page."),
};

interface RetentionTask {
  id: number;
  execution_id: number;
  repository: string;
  job_id: string;
  status: string;
  start_time: string;
  end_time: string;
}

export function registerListRetentionTasksTool() {
  server.tool(
    "list-retention-tasks",
    "List retention tasks.",
    ListRetentionTasksParamsShape,
    async (params) => {
      const { id, eid, ...query } = params;
      const data = await makeHarborRequest<RetentionTask[]>(
        `/retentions/${id}/executions/${eid}/tasks`,
        { query },
      );

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve retention tasks." },
          ],
        };
      }

      if (data.length === 0) {
        return {
          content: [{ type: "text", text: "No retention tasks found." }],
        };
      }

      const retentionTasksDetails = data
        .map(
          (task) =>
            `### Task: ${task.id}\n` +
            `- Execution ID: ${task.execution_id}\n` +
            `- Repository: ${task.repository}\n` +
            `- Job ID: ${task.job_id}\n` +
            `- Status: ${task.status}\n` +
            `- Start Time: ${new Date(task.start_time).toLocaleString()}\n` +
            `- End Time: ${new Date(task.end_time).toLocaleString()}`,
        )
        .join("\n\n");

      return { content: [{ type: "text", text: retentionTasksDetails }] };
    },
  );
}
