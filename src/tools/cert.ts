import { server } from "../mcp-server.js";
import { makeHarborRequest } from "../lib/api.js";

export function registerGetCertTool() {
  server.tool(
    "get-cert",
    "Get the Harbor registry's default root certificate (SSL certificate). This certificate is required to establish secure (TLS/SSL) connections to the registry and should be trusted by clients connecting to Harbor.",
    {},
    async () => {
      try {
        // Fetch the certificate as text (PEM format)
        const cert = await makeHarborRequest<string>("/systeminfo/getcert", {
          needsAuth: false,
        });
        if (!cert) {
          return {
            content: [
              {
                type: "text",
                text:
                  "Could not retrieve the Harbor registry root certificate. It may not be configured, or the endpoint returned no data.",
              },
            ],
          };
        }
        // If the response is a PEM certificate, show a preview and instructions
        return {
          content: [
            {
              type: "text",
              text:
                `Harbor Registry Root Certificate (SSL cert):\n\n` +
                'This certificate is required to establish secure (TLS/SSL) connections to the Harbor registry.\n' +
                'You can save this as a .crt file and add it to your trusted certificate store if needed.\n' +
                '\n---\n' +
                cert.substring(0, 2000) + (cert.length > 2000 ? '\n... (truncated)' : ''),
            },
          ],
        };
      } catch (error: any) {
        if (error?.message?.includes('404')) {
          return {
            content: [
              {
                type: "text",
                text: "Not found: The Harbor registry does not have a default root certificate configured.",
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: `Failed to retrieve the registry root certificate: ${error?.message || error}`,
            },
          ],
        };
      }
    }
  );
}
