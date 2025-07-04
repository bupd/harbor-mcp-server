import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const ListQuotasParamsShape = {
  page: z.number().int().optional().default(1).describe("The page number."),
  page_size: z
    .number()
    .int()
    .optional()
    .default(10)
    .describe("The size of per page."),
  reference: z
    .string()
    .optional()
    .describe("The reference type of quota (e.g., 'project')."),
  reference_id: z
    .string()
    .optional()
    .describe("The reference ID of quota (e.g., a project ID)."),
};

interface Quota {
  id: number;
  ref?: Record<string, any>;
  hard?: Record<string, number>;
  used?: Record<string, number>;
  update_time: string;
}

export function registerListQuotasTool() {
  server.tool(
    "list-quotas",
    "List storage quotas for projects.",
    ListQuotasParamsShape,
    async (params) => {
      const quotas = await makeHarborRequest<Quota[]>("/quotas", {
        query: params,
      });

      if (!quotas) {
        return {
          content: [{ type: "text", text: "Failed to retrieve quotas." }],
        };
      }
      if (quotas.length === 0) {
        return { content: [{ type: "text", text: "No quotas found." }] };
      }

      const formatStorage = (bytes: number): string => {
        if (bytes === -1) return "Unlimited";
        if (bytes === 0) return "0 B";
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
      };

      const quotaSummaries = quotas
        .map((q) => {
          const usedStorage = q.used?.["storage"] ?? 0;
          const hardLimitStorage = q.hard?.["storage"] ?? -1;
          const usedCount = q.used?.["count"] ?? 0;
          const hardLimitCount = q.hard?.["count"] ?? -1;

          return (
            `### Quota for: ${q.ref?.name || `ID ${q.ref?.id || q.id}`}\n` +
            `- Storage: ${formatStorage(usedStorage)} / ${formatStorage(hardLimitStorage)}\n` +
            `- Artifact Count: ${usedCount === -1 ? "N/A" : usedCount} / ${hardLimitCount === -1 ? "Unlimited" : hardLimitCount}`
          );
        })
        .join("\n\n");

      return { content: [{ type: "text", text: quotaSummaries }] };
    },
  );
}
