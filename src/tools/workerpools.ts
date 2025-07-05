import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetWorkerPoolsParamsShape = {};

interface WorkerPool {
  id: string;
  pid: number;
  concurrency: number;
  host: string;
  start_at: string;
  heartbeat_at: string;
}

export function registerGetWorkerPoolsTool() {
  server.tool(
    "get-worker-pools",
    "Get worker pools.",
    GetWorkerPoolsParamsShape,
    async (params) => {
      const data = await makeHarborRequest<WorkerPool[]>("/jobservice/pools");

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve worker pools." }],
        };
      }

      if (data.length === 0) {
        return {
          content: [{ type: "text", text: "No worker pools found." }],
        };
      }

      const workerPoolsDetails = data
        .map(
          (pool) =>
            `### Worker Pool: ${pool.id}\n` +
            `- PID: ${pool.pid}\n` +
            `- Concurrency: ${pool.concurrency}\n` +
            `- Host: ${pool.host}\n` +
            `- Started At: ${new Date(pool.start_at).toLocaleString()}\n` +
            `- Heartbeat At: ${new Date(pool.heartbeat_at).toLocaleString()}`,
        )
        .join("\n\n");

      return { content: [{ type: "text", text: workerPoolsDetails }] };
    },
  );
}
