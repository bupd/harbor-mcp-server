import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const ListJobQueuesParamsShape = {};

interface JobQueue {
  job_type: string;
  count: number;
  latency: number;
  paused: boolean;
}

export function registerListJobQueuesTool() {
  server.tool(
    "list-job-queues",
    "List job queues.",
    ListJobQueuesParamsShape,
    async (params) => {
      const data = await makeHarborRequest<JobQueue[]>("/jobservice/queues");

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve job queues." }],
        };
      }

      if (data.length === 0) {
        return {
          content: [{ type: "text", text: "No job queues found." }],
        };
      }

      const jobQueuesDetails = data
        .map(
          (queue) =>
            `### Job Queue: ${queue.job_type}\n` +
            `- Count: ${queue.count}\n` +
            `- Latency: ${queue.latency}\n` +
            `- Paused: ${queue.paused}`,
        )
        .join("\n\n");

      return { content: [{ type: "text", text: jobQueuesDetails }] };
    },
  );
}
