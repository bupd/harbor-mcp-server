import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetWorkersParamsShape = {
  pool_id: z.string().describe("The ID of the worker pool."),
};

interface Worker {
  id: string;
  job_id: string;
  start_at: string;
  check_in_at: string;
  check_in: string;
}

export function registerGetWorkersTool() {
  server.tool(
    "get-workers",
    "Get workers in a specific pool.",
    GetWorkersParamsShape,
    async (params) => {
      const { pool_id } = params;
      const data = await makeHarborRequest<Worker[]>(
        `/jobservice/pools/${pool_id}/workers`,
      );

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve workers." }],
        };
      }

      if (data.length === 0) {
        return {
          content: [{ type: "text", text: "No workers found in this pool." }],
        };
      }

      const workersDetails = data
        .map(
          (worker) =>
            `### Worker: ${worker.id}\n` +
            `- Job ID: ${worker.job_id}\n` +
            `- Started At: ${new Date(worker.start_at).toLocaleString()}\n` +
            `- Check-in At: ${new Date(worker.check_in_at).toLocaleString()}\n` +
            `- Check-in: ${worker.check_in}`,
        )
        .join("\n\n");

      return { content: [{ type: "text", text: workersDetails }] };
    },
  );
}
