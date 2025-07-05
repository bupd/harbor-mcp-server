import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetRetentionParamsShape = {
  id: z.number().int().describe("The ID of the retention policy."),
};

interface RetentionPolicy {
  id: number;
  algorithm: string;
  rules: any[]; // The rules can be complex, so using 'any' for now.
  trigger: any; // The trigger can be complex, so using 'any' for now.
  scope: any; // The scope can be complex, so using 'any' for now.
}

export function registerGetRetentionTool() {
  server.tool(
    "get-retention-policy",
    "Get a specific retention policy.",
    GetRetentionParamsShape,
    async (params) => {
      const { id } = params;
      const data = await makeHarborRequest<RetentionPolicy>(
        `/retentions/${id}`,
      );

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve retention policy." },
          ],
        };
      }

      const retentionPolicyDetails =
        "- **ID**: " + data.id + "\n- **Algorithm**: " + data.algorithm;

      return { content: [{ type: "text", text: retentionPolicyDetails }] };
    },
  );
}
