import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

// Define the parameters for the useful, project-specific repository listing.
const ListReposInProjectParamsShape = {
  project_name: z
    .string()
    .describe("The name of the project to list repositories from."),
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
    .describe("The number of repositories per page."),
  q: z
    .string()
    .optional()
    .describe('Query string to filter repositories, e.g., "name=~my-repo"'),
};

// Define the response type for a single repository.
interface Repository {
  id: number;
  name: string;
  project_id: number;
  description: string;
  artifact_count: number;
  pull_count: number;
  update_time: string;
}

/**
 * Registers a tool to list repositories within a specific Harbor project.
 * This is more practical than a global repository list.
 */
export function registerListRepositoriesTool() {
  server.tool(
    "list-repositories-in-project",
    "List repositories within a specific project, with optional filtering and pagination.",
    ListReposInProjectParamsShape,
    async (params) => {
      const { project_name, ...queryParams } = params;

      // Make the API call to the correct, project-specific endpoint.
      const repos = await makeHarborRequest<Repository[]>(
        `/projects/${project_name}/repositories`,
        { query: queryParams },
      );

      // Handle the case where the API call fails.
      if (!repos) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to retrieve repositories for project '${project_name}'. Check if the project exists.`,
            },
          ],
        };
      }

      // Handle the case where no repositories are found.
      if (repos.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No repositories found in project '${project_name}' matching the criteria.`,
            },
          ],
        };
      }

      // Format the successful response.
      const repoSummaries = repos
        .map(
          (r) =>
            `### Repository: ${r.name}\n` +
            `- Pulls: ${r.pull_count}\n` +
            `- Artifacts: ${r.artifact_count}\n` +
            `- Last Updated: ${new Date(r.update_time).toLocaleString()}`,
        )
        .join("\n\n");

      return {
        content: [{ type: "text", text: repoSummaries }],
      };
    },
  );
}
