import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetSystemInfoParamsShape = {};

interface SystemInfo {
  with_notary: boolean;
  with_admiral: boolean;
  admiral_endpoint: string;
  auth_mode: string;
  registry_url: string;
  external_url: string;
  project_creation_restriction: string;
  self_registration: boolean;
  has_ca_root: boolean;
  harbor_version: string;
  registry_storage_provider_name: string;
  read_only: boolean;
  notification_enable: boolean;
}

export function registerGetSystemInfoTool() {
  server.tool(
    "get-system-info",
    "Get general system info.",
    GetSystemInfoParamsShape,
    async (params) => {
      const data = await makeHarborRequest<SystemInfo>("/systeminfo");

      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to retrieve system info." }],
        };
      }

      const systemInfoDetails =
        "- **With Notary**: " +
        data.with_notary +
        "\n- **With Admiral**: " +
        data.with_admiral +
        "\n- **Admiral Endpoint**: " +
        data.admiral_endpoint +
        "\n- **Auth Mode**: " +
        data.auth_mode +
        "\n- **Registry URL**: " +
        data.registry_url +
        "\n- **External URL**: " +
        data.external_url +
        "\n- **Project Creation Restriction**: " +
        data.project_creation_restriction +
        "\n- **Self Registration**: " +
        data.self_registration +
        "\n- **Has CA Root**: " +
        data.has_ca_root +
        "\n- **Harbor Version**: " +
        data.harbor_version +
        "\n- **Registry Storage Provider Name**: " +
        data.registry_storage_provider_name +
        "\n- **Read Only**: " +
        data.read_only +
        "\n- **Notification Enable**: " +
        data.notification_enable;

      return { content: [{ type: "text", text: systemInfoDetails }] };
    },
  );
}
