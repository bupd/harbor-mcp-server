import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetScannerParamsShape = {
  registration_id: z.string().describe("The ID of the scanner registration."),
};

interface Scanner {
  id: string;
  name: string;
  description: string;
  url: string;
  disabled: boolean;
  is_default: boolean;
  auth: string;
  access_cred: {
    username?: string;
    password?: string;
    type?: string;
  };
  skip_cert_verify: boolean;
  use_internal_addr: boolean;
  create_time: string;
  update_time: string;
}

export function registerGetScannerTool() {
  server.tool(
    "get-scanner",
    "Get a scanner registration details.",
    GetScannerParamsShape,
    async (params) => {
      const { registration_id } = params;
      const data = await makeHarborRequest<Scanner>(
        `/scanners/${registration_id}`,
      );

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve scanner details." },
          ],
        };
      }

      const scannerDetails =
        `### Scanner: ${data.name}\n` +
        `- ID: ${data.id}\n` +
        `- Description: ${data.description}\n` +
        `- URL: ${data.url}\n` +
        `- Disabled: ${data.disabled}\n` +
        `- Is Default: ${data.is_default}\n` +
        `- Auth: ${data.auth}\n` +
        `- Skip Cert Verify: ${data.skip_cert_verify}\n` +
        `- Use Internal Addr: ${data.use_internal_addr}\n` +
        `- Create Time: ${new Date(data.create_time).toLocaleString()}\n` +
        `- Update Time: ${new Date(data.update_time).toLocaleString()}`;

      return { content: [{ type: "text", text: scannerDetails }] };
    },
  );
}
