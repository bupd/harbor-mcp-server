import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const LdapUserSearchParamsShape = {
  username: z.string().optional().describe("The username to search for."),
};

interface LdapUser {
  username: string;
  realname: string;
  email: string;
}

export function registerSearchLdapUserTool() {
  server.tool(
    "search-ldap-users",
    "Search for LDAP users.",
    LdapUserSearchParamsShape,
    async (params) => {
      const { username } = params;
      const data = await makeHarborRequest<LdapUser[]>("/ldap/users/search", {
        query: { username },
      });

      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve LDAP users from Harbor.",
            },
          ],
        };
      }

      if (data.length === 0) {
        return {
          content: [{ type: "text", text: "No LDAP users found." }],
        };
      }

      const userList = data
        .map((user) => `- ${user.username} (${user.realname}, ${user.email})`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `## Found ${data.length} LDAP Users\n${userList}`,
          },
        ],
      };
    },
  );
}

const LdapGroupSearchParamsShape = {
  groupname: z.string().optional().describe("The group name to search for."),
  groupdn: z.string().optional().describe("The group DN to search for."),
};

interface LdapGroup {
  group_name: string;
  group_dn: string;
}

export function registerSearchLdapGroupTool() {
  server.tool(
    "search-ldap-groups",
    "Search for LDAP groups.",
    LdapGroupSearchParamsShape,
    async (params) => {
      const { groupname, groupdn } = params;
      const data = await makeHarborRequest<LdapGroup[]>("/ldap/groups/search", {
        query: { groupname, groupdn },
      });

      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve LDAP groups from Harbor.",
            },
          ],
        };
      }

      if (data.length === 0) {
        return {
          content: [{ type: "text", text: "No LDAP groups found." }],
        };
      }

      const groupList = data
        .map((group) => `- ${group.group_name} (${group.group_dn})`)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `## Found ${data.length} LDAP Groups\n${groupList}`,
          },
        ],
      };
    },
  );
}
