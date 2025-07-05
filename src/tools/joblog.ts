import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetJobLogParamsShape = {
  job_id: z.string().describe("The ID of the job."),
};

export function registerGetJobLogTool() {
  server.tool(
    "get-job-log",
    "Get job log by job id.",
    GetJobLogParamsShape,
    async (params) => {
      const { job_id } = params;
      const data = await makeHarborRequest<string>(
        `/jobservice/jobs/${job_id}/log`,
      );

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve job log." }],
        };
      }

      return { content: [{ type: "text", text: data }] };
    },
  );
}
