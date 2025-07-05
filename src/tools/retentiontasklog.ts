import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetRetentionTaskLogParamsShape = {
  id: z.number().int().describe("The ID of the retention policy."),
  eid: z.number().int().describe("The ID of the retention execution."),
  tid: z.number().int().describe("The ID of the retention task."),
};

export function registerGetRetentionTaskLogTool() {
  server.tool(
    "get-retention-task-log",
    "Get the log of a retention task.",
    GetRetentionTaskLogParamsShape,
    async (params) => {
      const { id, eid, tid } = params;
      const data = await makeHarborRequest<string>(
        `/retentions/${id}/executions/${eid}/tasks/${tid}`,
        {},
      );

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve retention task log." },
          ],
        };
      }

      return { content: [{ type: "text", text: data }] };
    },
  );
}
