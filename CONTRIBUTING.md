# Contributing to Harbor MCP Server (Experimental)

Welcome! 🚢

Thank you for your interest in contributing to the Harbor MCP Server. This project is community-driven and experimental, aiming to make Harbor more accessible to AI tools and the broader ecosystem. Whether you’re fixing bugs, adding features, or improving docs, your help is appreciated!

## Table of Contents
- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style & Guidelines](#code-style--guidelines)
- [Adding or Modifying Tools](#adding-or-modifying-tools)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)
- [Community & Conduct](#community--conduct)

---

## Project Overview
- **Not official:** This is not an official Harbor project. It’s experimental and maintained by the community.
- **Purpose:** Exposes Harbor operations as Model Context Protocol (MCP) tools for use by AI models and clients.
- **Tech stack:** TypeScript, Node.js, [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk).

See the [README.md](README.md) for more details, features, and usage.

---

## Getting Started
1. **Clone the repo:**
   ```bash
   git clone https://github.com/bupd/harbor-mcp-server.git
   cd harbor-mcp-server
   ```
2. **Install dependencies:**
   ```bash
   bun install
   bun run build
   ```
   (You can use `npm install` and `npm run build` as well.)
3. **Set environment variables:**
   - `HARBOR_API_BASE` (e.g. `https://demo.goharbor.io/api/v2.0`)
   - `HARBOR_AUTH_USER` (your Harbor username)
   - `HARBOR_AUTH_PASS` (your password, token, or secret)
4. **Run the server:**
   ```bash
   node build/index.js
   ```

---

## Development Workflow
- **Branching:** Create a feature branch for your work (e.g. `feature/add-x-tool`).
- **Build:** Run `bun run build` (or `npm run build`) to compile TypeScript.
- **Test:** Manual testing is encouraged. Automated tests are coming soon—help wanted!
- **CI:** All PRs are built using GitHub Actions (see `.github/workflows/`). Your PR must build successfully.

---

## Code Style & Guidelines
- **Language:** TypeScript (strict mode recommended).
- **Formatting:** Use Prettier or your favorite formatter for clean, consistent code.
- **Structure:**
  - Core entry: `src/index.ts`
  - MCP server logic: `src/mcp-server.ts`
  - Harbor API helpers: `src/lib/api.ts`
  - Tools/endpoints: `src/tools/`
- **Naming:** Use clear, descriptive names for files, functions, and variables.
- **Docs:** Add JSDoc comments for exported functions and modules.

---

## Adding or Modifying Tools
- Each Harbor operation is implemented as a tool in `src/tools/` (e.g. `health.ts`, `projects.ts`).
- To add a new tool:
  1. Create a new file in `src/tools/` (copy an existing one for structure).
  2. Export a `registerXTool()` function that registers the tool with the MCP server.
  3. Import and call your register function in `src/index.ts`.
  4. Test your tool locally.
- To update a tool, edit the relevant file in `src/tools/` and rebuild.

---

## Pull Requests
- **Small, focused PRs** are easier to review and merge.
- **Describe your changes** clearly in the PR title and description.
- **Reference issues** if applicable (e.g. `Fixes #12`).
- **CI must pass** before merging.
- **Be kind and constructive** in code review discussions.

---

## Reporting Issues
- Use [GitHub Issues](https://github.com/bupd/harbor-mcp-server/issues) for bugs, feature requests, or questions.
- Provide as much detail as possible (steps to reproduce, logs, etc.).

---

## Community & Conduct
- Be respectful and welcoming to all contributors.
- Assume good intent and help others learn.
- See [OWNERS.md](OWNERS.md) for project stewardship.

---

Thank you for helping make Harbor MCP Server better for everyone! 