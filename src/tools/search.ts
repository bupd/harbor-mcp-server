import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const SearchParamsShape = {
  q: z.string().describe("Search parameter for project and repository name."),
};

interface SearchProject {
  project_id: number;
  name: string;
  public: boolean;
  repo_count: number;
  owner_name?: string;
}

interface SearchRepository {
  repository_name: string;
  project_name: string;
  artifact_count?: number;
  pull_count?: number;
}

interface SearchResponse {
  project?: SearchProject[];
  repository?: SearchRepository[];
}

export function registerSearchTool() {
  server.tool(
    "search",
    "Search for projects and repositories by name. Returns matching projects and repositories.",
    SearchParamsShape,
    async (params) => {
      const { q } = params;
      const data = await makeHarborRequest<SearchResponse>("/search", {
        query: { q },
      });

      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve search results from Harbor.",
            },
          ],
        };
      }

      let output = "";
      if (data.project && data.project.length > 0) {
        output += `## Projects Found (${data.project.length})\n`;
        output += data.project
          .map(
            (p) =>
              `- **${p.name}** (ID: ${p.project_id}, Public: ${p.public}, Repos: ${p.repo_count}${p.owner_name ? ", Owner: " + p.owner_name : ""})`,
          )
          .join("\n");
        output += "\n\n";
      }
      if (data.repository && data.repository.length > 0) {
        output += `## Repositories Found (${data.repository.length})\n`;
        output += data.repository
          .map(
            (r) =>
              `- **${r.repository_name}** (Project: ${r.project_name}` +
              (r.artifact_count !== undefined
                ? `, Artifacts: ${r.artifact_count}`
                : "") +
              (r.pull_count !== undefined ? `, Pulls: ${r.pull_count}` : "") +
              ")",
          )
          .join("\n");
      }
      if (!output) {
        output = "No projects or repositories found matching the search query.";
      }
      return { content: [{ type: "text", text: output }] };
    },
  );
}
