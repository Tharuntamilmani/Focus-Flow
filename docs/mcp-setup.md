# MCP Configuration — FocusFlow

## Overview

FocusFlow demonstrates MCP (Model Context Protocol) using the **official filesystem server** from Anthropic. This server gives Kiro read/write access to the local project directory — no credentials, no paid API, no cloud dependency.

## Configuration

Add the following to your Kiro MCP settings file.

**File location (workspace-level):** `.kiro/settings/mcp.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem@latest",
        "e:\\Study-Planner"
      ],
      "disabled": false
    }
  }
}
```

> If you are using Kiro's MCP settings UI, search the Command Palette for **"Open MCP Settings"** and paste the `filesystem` entry into the `mcpServers` object.

## Prerequisites

| Requirement | Notes |
|---|---|
| Node.js ≥ 18 | Required to run `npx` |
| Internet (first run only) | `npx` downloads the server package on first use; subsequent runs use the cache |
| No API key | The filesystem server is fully local |

## What it does

The filesystem MCP server exposes tools that let Kiro:
- **Read** files inside the project directory
- **Write / create** files inside the project directory
- **List** directory contents

This is useful when you want Kiro to inspect the FocusFlow source files, update the spec, or run the QA reviewer agent against the actual implementation.

## Verifying the connection

1. Add the config above to `.kiro/settings/mcp.json`.
2. Open the Kiro panel → **MCP Servers** view.
3. The `filesystem` server should appear with a green status indicator.
4. Ask Kiro: *"List the files in the FocusFlow project"* — it will use the MCP filesystem tool to respond.

## Security note

The path `e:\Study-Planner` is passed as the allowed root directory. The server will refuse requests that try to read or write outside that directory.
