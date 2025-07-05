# Harbor-MCP (Community Experimental)

**This is an experimental, community-driven MCP server for Harbor. It is _not_ an official Harbor project.**  
We welcome and rely on community contributions—join us to improve and expand this tool!

---

## What is this?

A Model Context Protocol (MCP) server for Harbor, enabling AI models and tools to interact with a Harbor container registry in real time.

---

## Quick Start

1. **Clone & Install:**
   ```bash
   git clone https://github.com/bupd/harbor-mcp-server.git
   cd harbor-mcp-server
   bun install
   bun run build
   ```

2. **Set Environment Variables:**
   - export HARBOR_API_BASE=YOUR_HARBOR_URL (e.g. `https://demo.goharbor.io/api/v2.0`)
   - export HARBOR_AUTH_USER=YOUR_USERNAME
   - export HARBOR_AUTH_PASS=YOUR_PASSWORD (or token or secret or whatever you call it)

3. **Run:**
   ```bash
   node build/index.js
   ```

4. **Integrate with your MCP client** (e.g. Claude Desktop, Cursor) using the appropriate command and environment variables.

```json
{
  "mcpServers": {
    "harbor": {
      "command": "npx",
      "args": [
        "-y",
        "harbor-mcp"
      ],  
      "env": {
        "HARBOR_API_BASE": "HARBOR_URL",
        "HARBOR_AUTH_USER": "HARBOR_USERNAME",
        "HARBOR_AUTH_PASS": "HARBOR_PASSWORD_OR_SECRET"
      }
    }
  }
}
```

#### If you have it locally use the below
```json
{
  "mcpServers": {
    "harbor": {
      "command": "node",
      "args": [
        "YOUR_ABSOLUTE_PATH/harbor-mcp-server/build/index.js"
      ],
      "env": {
        "HARBOR_API_BASE": "HARBOR_URL",
        "HARBOR_AUTH_USER": "HARBOR_USERNAME",
        "HARBOR_AUTH_PASS": "HARBOR_PASSWORD_OR_SECRET"
      }
    }
  }
}
```

## For Usage in Docker Coming Soon.

---

## Features / Commands

The following Harbor operations are available as MCP tools:

- `get-health`: Check Harbor instance health.
- `get-statistics`: Get project and repository statistics.
- `list-projects`: List projects (with filters/pagination).
- `get-project`: Get details for a specific project.
- `get-project-summary`: Get a summary of a project.
- `list-project-members`: List members of a project.
- `list-repositories-in-project`: List repositories in a project.
- `list-quotas`: List storage quotas for projects.
- `search`: Search for projects and repositories by name.
- `get-configurations`: Get system configurations (admin only).
- `update-configurations`: Update system configurations (admin only, confirmation required).
- `get-volumes`: Get system volume info (total/free size).

---

## Contributing

- This project is maintained by the community, for the community.
- We are looking for contributors!  
- Open an issue or PR to get involved.

For more details look at (CONTRIBUTING.md)[CONTRIBUTING.md]

---

## Disclaimer

This is **not** an official Harbor MCP server.  
It is experimental and under active development by the community.