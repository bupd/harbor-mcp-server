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
  owner_id: number;
  name: string;
  registry_id: number;
  creation_time: string;
  update_time: string;
  deleted: boolean;
  owner_name: string;
  togglable: boolean;
  current_user_role_id: number;
  repo_count: number;
  chart_count: number;
  metadata: {
    public: "true" | "false";
    enable_content_trust: string;
    prevent_vul: string;
    severity: string;
    auto_scan: string;
  };
  cve_allowlist: {
    id: number;
    project_id: number;
    expires_at: number;
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

const GetProjectParamsShape = {
  project_name_or_id: z.string().describe("The name or ID of the project."),
};

export function registerGetProjectTool() {
  server.tool(
    "get-project",
    "Get a specific project.",
    GetProjectParamsShape,
    async (params) => {
      const { project_name_or_id } = params;
      const data = await makeHarborRequest<Project>(
        `/projects/${project_name_or_id}`,
      );

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve project." }],
        };
      }

      const projectDetails =
        "- **Project ID**: " +
        data.project_id +
        "\n- **Owner ID**: " +
        data.owner_id +
        "\n- **Name**: " +
        data.name +
        "\n- **Registry ID**: " +
        data.registry_id +
        "\n- **Creation Time**: " +
        data.creation_time +
        "\n- **Update Time**: " +
        data.update_time +
        "\n- **Deleted**: " +
        data.deleted +
        "\n- **Owner Name**: " +
        data.owner_name +
        "\n- **Togglable**: " +
        data.togglable +
        "\n- **Current User Role ID**: " +
        data.current_user_role_id +
        "\n- **Repo Count**: " +
        data.repo_count +
        "\n- **Chart Count**: " +
        data.chart_count +
        "\n- **Metadata**:" +
        "\n  - **Public**: " +
        data.metadata.public +
        "\n  - **Enable Content Trust**: " +
        data.metadata.enable_content_trust +
        "\n  - **Prevent Vulnerable Images from Running**: " +
        data.metadata.prevent_vul +
        "\n  - **Severity**: " +
        data.metadata.severity +
        "\n  - **Auto Scan**: " +
        data.metadata.auto_scan +
        "\n- **CVE Allowlist**:" +
        "\n  - **ID**: " +
        data.cve_allowlist.id +
        "\n  - **Project ID**: " +
        data.cve_allowlist.project_id +
        "\n  - **Expires At**: " +
        data.cve_allowlist.expires_at;

      return { content: [{ type: "text", text: projectDetails }] };
    },
  );
}

const GetProjectDeletableParamsShape = {
  project_name_or_id: z.string().describe("The name or ID of the project."),
};

interface DeletableResponse {
  deletable: boolean;
  message: string;
}

export function registerGetProjectDeletableTool() {
  server.tool(
    "get-project-deletable",
    "Get whether a project is deletable.",
    GetProjectDeletableParamsShape,
    async (params) => {
      const { project_name_or_id } = params;
      const data = await makeHarborRequest<DeletableResponse>(
        `/projects/${project_name_or_id}/_deletable`,
      );

      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve project deletable status.",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text:
              "Project is " +
              (data.deletable ? "" : "not ") +
              "deletable. Message: " +
              data.message,
          },
        ],
      };
    },
  );
}

const GetProjectSummaryParamsShape = {
  project_name_or_id: z.string().describe("The name or ID of the project."),
};

interface ProjectSummary {
  repo_count: number;
  chart_count: number;
  project_admin_count: number;
  maintainer_count: number;
  developer_count: number;
  guest_count: number;
  limited_guest_count: number;
  quota: {
    hard: {
      storage: number;
    };
    used: {
      storage: number;
    };
  };
  registry: {
    id: number;
    name: string;
  };
  not_scanned_cnt: number;
  scanned_cnt: number;
  dep_scan_total: number;
  dep_scan_pending: number;
}

export function registerGetProjectSummaryTool() {
  server.tool(
    "get-project-summary",
    "Get a summary of a project.",
    GetProjectSummaryParamsShape,
    async (params) => {
      const { project_name_or_id } = params;
      const data = await makeHarborRequest<ProjectSummary>(
        "/projects/" + project_name_or_id + "/summary",
      );

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve project summary." },
          ],
        };
      }

      const summaryDetails =
        "- **Repo Count**: " +
        data.repo_count +
        "\n- **Chart Count**: " +
        data.chart_count +
        "\n- **Project Admin Count**: " +
        data.project_admin_count +
        "\n- **Maintainer Count**: " +
        data.maintainer_count +
        "\n- **Developer Count**: " +
        data.developer_count +
        "\n- **Guest Count**: " +
        data.guest_count +
        "\n- **Limited Guest Count**: " +
        data.limited_guest_count +
        "\n- **Quota**:" +
        "\n  - **Hard Storage**: " +
        data.quota.hard.storage +
        "\n  - **Used Storage**: " +
        data.quota.used.storage +
        "\n- **Registry**:" +
        "\n  - **ID**: " +
        data.registry.id +
        "\n  - **Name**: " +
        data.registry.name +
        "\n- **Not Scanned Count**: " +
        data.not_scanned_cnt +
        "\n- **Scanned Count**: " +
        data.scanned_cnt +
        "\n- **Dep Scan Total**: " +
        data.dep_scan_total +
        "\n- **Dep Scan Pending**: " +
        data.dep_scan_pending;

      return { content: [{ type: "text", text: summaryDetails }] };
    },
  );
}

const ListProjectMembersParamsShape = {
  project_name_or_id: z.string().describe("The name or ID of the project."),
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
    .describe("The number of members per page."),
  entityname: z
    .string()
    .optional()
    .describe("The name of the entity to search for."),
};

interface ProjectMember {
  id: number;
  project_id: number;
  entity_name: string;
  role_name: string;
  role_id: number;
  entity_id: number;
  entity_type: string;
}

export function registerListProjectMembersTool() {
  server.tool(
    "list-project-members",
    "List members of a project.",
    ListProjectMembersParamsShape,
    async (params) => {
      const { project_name_or_id, ...query } = params;
      const data = await makeHarborRequest<ProjectMember[]>(
        "/projects/" + project_name_or_id + "/members",
        { query },
      );

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve project members." },
          ],
        };
      }

      if (data.length === 0) {
        return {
          content: [
            { type: "text", text: "No members found for this project." },
          ],
        };
      }

      const memberList = data
        .map(
          (member) =>
            `- **${member.entity_name}** (Role: ${member.role_name}, Type: ${member.entity_type})`,
        )
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `## Project Members\n${memberList}`,
          },
        ],
      };
    },
  );
}
