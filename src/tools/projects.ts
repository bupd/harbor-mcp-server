import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const ListProjectsParamsShape = {
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
    .describe("The number of projects per page."),
  name: z.string().optional().describe("Filter by project name."),
  public: z
    .boolean()
    .optional()
    .describe("Filter by public (true) or private (false) projects."),
  owner: z
    .string()
    .optional()
    .describe("Filter by the name of the project owner."),
};

interface Project {
  project_id: number;
  name: string;
  owner_name: string;
  repo_count: number;
  creation_time: string;
  metadata: {
    public: "true" | "false";
  };
}

export function registerListProjectsTool() {
  server.tool(
    "list-projects",
    "List projects with optional filters and pagination.",
    ListProjectsParamsShape,
    async (params) => {
      const projects = await makeHarborRequest<Project[]>("/projects", {
        query: params,
      });

      if (!projects) {
        return {
          content: [{ type: "text", text: "Failed to retrieve projects." }],
        };
      }
      if (projects.length === 0) {
        return {
          content: [
            { type: "text", text: "No projects found matching the criteria." },
          ],
        };
      }

      const projectSummaries = projects
        .map(
          (p) =>
            `### Project: ${p.name}\n` +
            `- ID: ${p.project_id}\n` +
            `- Owner: ${p.owner_name}\n` +
            `- Repositories: ${p.repo_count}\n` +
            `- Public: ${p.metadata.public}\n` +
            `- Created: ${new Date(p.creation_time).toLocaleString()}`,
        )
        .join("\n\n");

      return { content: [{ type: "text", text: projectSummaries }] };
    },
  );
}
