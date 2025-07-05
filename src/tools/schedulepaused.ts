import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetSchedulePausedParamsShape = {
  job_type: z
    .string()
    .describe(
      "The type of the job. 'all' stands for all job types, current only support query with all",
    ),
};

interface SchedulePaused {
  paused: boolean;
}

export function registerGetSchedulePausedTool() {
  server.tool(
    "get-schedule-paused",
    "Get scheduler paused status.",
    GetSchedulePausedParamsShape,
    async (params) => {
      const { job_type } = params;
      const data = await makeHarborRequest<SchedulePaused>(
        `/schedules/${job_type}/paused`,
      );

      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve schedule paused status.",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "Schedule is " + (data.paused ? "" : "not ") + "paused.",
          },
        ],
      };
    },
  );
}
