# harbor-mcp

A Model Context Protocol (MCP) server for Harbor, enabling AI models and external tools to interact with a Harbor container registry in real time.

## What is MCP?

Model Context Protocol (MCP) is an open communication framework that allows AI models (like Claude) to interact with external tools and APIs. This enables access to real-time data, process automation, and integration with external services.

Learn more about MCP:
- [MCP Official Documentation](https://modelcontextprotocol.io)
- [Getting Started with MCP](https://modelcontextprotocol.io/quickstart/server)
- [Postmans MCP Developer Community](https://discord.gg/kTnA7cpn)

## What This Repository Contains

- **Complete MCP Server for Harbor**: A ready-to-use implementation that gives MCP clients access to Harbor registry data and management endpoints.
- **Configuration Examples**: Sample configuration for connecting to Claude Desktop or other MCP clients.

## Features

The Harbor MCP Server implements the following tools:
- Health and liveness checks for the Harbor instance
- Project and repository listing
- Storage quota reporting
- Registry statistics

## Installation

### Prerequisites
- Node.js 16+ and npm
- Access to a Harbor instance

### Install via npm (recommended for CLI/production use)
```bash
npm install -g harbor-mcp-server
```

Or run directly with npx (no install required):
```bash
npx harbor-mcp-server
```

Or clone and build from source:
```bash
git clone https://github.com/bupd/harbor-mcp-server.git
cd harbor-mcp-server
npm install
npm run build
node build/index.js
```

## Via NPM

- [harbor-mcp on npm](https://www.npmjs.com/package/harbor-mcp)

## Usage

### As an MCP Server for Claude Desktop or Cursor
Add to your configuration (replace with your actual install path if not using npx):
```json
{
  "mcpServers": {
    "harbor-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "harbor-mcp"
      ]
    }
  }
}
```
Or, if installed globally:
```json
{
  "mcpServers": {
    "harbor-mcp": {
      "command": "harbor-mcp-server",
      "args": []
    }
  }
}
```

### Configuration
- The default Harbor instance is set to https://demo.goharbor.io. To change, edit `src/config.ts` or set environment variables as needed.
- Authentication credentials are also set in `src/config.ts`.

## Troubleshooting
- Ensure your Harbor instance is reachable and credentials are correct.
- For issues with MCP integration, see the [MCP documentation](https://modelcontextprotocol.io) and check logs for errors.

## Contributing
Contributions are welcome! Please submit a Pull Request or open an issue.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using the [Model Context Protocol](https://modelcontextprotocol.io)