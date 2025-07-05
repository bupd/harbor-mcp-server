import { z } from "zod";
import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

const GetVolumesParamsShape = {};

interface SystemVolumeInfo {
  storage: {
    total: number;
    free: number;
  };
}

export function registerGetVolumesTool() {
  server.tool(
    "get-volumes",
    "Get system volume info (total/free size).",
    GetVolumesParamsShape,
    async (params) => {
      const data = await makeHarborRequest<SystemVolumeInfo>(
        "/systeminfo/volumes",
      );

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve system volume info." },
          ],
        };
      }

      const systemVolumeInfoDetails =
        "- **Storage Total**: " +
        data.storage.total +
        "\n- **Storage Free**: " +
        data.storage.free;

      return { content: [{ type: "text", text: systemVolumeInfoDetails }] };
    },
  );
}
