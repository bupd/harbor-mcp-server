import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

interface StatisticsResponse {
  total_project_count: number;
  public_project_count: number;
  private_project_count: number;
  total_repo_count: number;
  public_repo_count: number;
  private_repo_count: number;
  total_storage_consumption: number;
}

export function registerGetStatisticsTool() {
  server.tool(
    "get-statistics",
    "Get the statistic information about projects and repositories.",
    {},
    async () => {
      const data = await makeHarborRequest<StatisticsResponse>("/statistics");

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve statistics." }],
        };
      }

      const storageInGB = (data.total_storage_consumption / 1024 ** 3).toFixed(
        2,
      );

      const text = `
Harbor Instance Statistics:
- Total Projects: ${data.total_project_count} (${data.public_project_count} public, ${data.private_project_count} private)
- Total Repositories: ${data.total_repo_count} (${data.public_repo_count} public, ${data.private_repo_count} private)
- Total Storage Used: ${storageInGB} GB
      `.trim();

      return { content: [{ type: "text", text }] };
    },
  );
}
