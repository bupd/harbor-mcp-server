import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetScannerMetadataParamsShape = {
  registration_id: z.string().describe("The ID of the scanner registration."),
};

interface ScannerMetadata {
  // Define the structure of the scanner metadata here
  // This is a placeholder, as the swagger spec does not define the response schema
  [key: string]: any;
}

export function registerGetScannerMetadataTool() {
  server.tool(
    "get-scanner-metadata",
    "Get the metadata of a scanner registration.",
    GetScannerMetadataParamsShape,
    async (params) => {
      const { registration_id } = params;
      const data = await makeHarborRequest<ScannerMetadata>(
        `/scanners/${registration_id}/metadata`,
      );

      if (!data) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve scanner metadata.",
            },
          ],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    },
  );
}
