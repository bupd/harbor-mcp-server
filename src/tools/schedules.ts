import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const ListSchedulesParamsShape = {
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
    .describe("The number of schedules per page."),
};

interface Schedule {
  id: number;
  schedule: any; // The schedule object can be complex, so using 'any' for now.
  status: string;
  creation_time: string;
  update_time: string;
}

export function registerListSchedulesTool() {
  server.tool(
    "list-schedules",
    "List schedules.",
    ListSchedulesParamsShape,
    async (params) => {
      const data = await makeHarborRequest<Schedule[]>("/schedules", {
        query: params,
      });

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve schedules." }],
        };
      }

      if (data.length === 0) {
        return {
          content: [{ type: "text", text: "No schedules found." }],
        };
      }

      const schedulesDetails = data
        .map(
          (schedule) =>
            `### Schedule: ${schedule.id}\n` +
            `- Status: ${schedule.status}\n` +
            `- Creation Time: ${new Date(schedule.creation_time).toLocaleString()}\n` +
            `- Update Time: ${new Date(schedule.update_time).toLocaleString()}`,
        )
        .join("\n\n");

      return { content: [{ type: "text", text: schedulesDetails }] };
    },
  );
}
