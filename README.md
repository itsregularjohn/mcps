# JP's MCP Collection

JP's personal collection of [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) modules that provides a set of utility functions for Claude and other AI assistants. Built using the MCP SDK, this server exposes tools for system operations, Google services integration, and AI-powered text processing.

## Overview

MCPs are built using the MCP SDK and exposes a set of tools that can be used by AI assistants to interact with:

- System command execution
- File system operations
- Google Sheets integration
- Google Tasks management
- OpenAI chat completion and grammar checking
- Dynamic prompt loading from markdown files

## Features

### System Operations

- Command Execution: Run shell commands on the system with proper error handling and safety checks

### File System Operations

- Move Files to Trash: Safely delete files by moving them to the system trash
- Read Images: Read image files and return base64-encoded content with metadata

### Google Sheets Integration

- List Sheets: Get available sheets in the configured spreadsheet
- Read Sheet Content: Read data from specific ranges with pagination support
- Update Sheets: Modify cell values in spreadsheets
- Delete Rows: Remove specific rows from sheets
- Get Sheet Properties: Retrieve metadata about sheet structure
- Conditional Formatting: Add row-based conditional formatting rules

### Google Tasks Management

- Task Lists: Create, update, delete, and list task lists
- Tasks: Full CRUD operations for tasks including creation, updates, completion, and deletion
- Subtasks: Create hierarchical task structures
- Task Properties: Manage due dates, notes, and task status

### AI-Powered Text Processing

- Chat Completion: Send prompts to OpenAI's GPT models with customizable parameters
- Grammar Checking: Improve text grammar and clarity using AI

### Dynamic Prompt Management

- Automatic Prompt Loading: Loads prompts from markdown files at server startup
- Flexible Configuration: Configure prompt directory via environment variables
- Smart Naming: Auto-generate prompt names from filenames when not specified in frontmatter
- Frontmatter Support: Parse markdown frontmatter for prompt metadata

## Usage

The server runs using Deno and can be started in development mode:

```bash
# Run in development mode
npm run dev

# Run with the MCP inspector for debugging
npm run monitor

# Format code
npm run format
```

## Project Organization

### Directory Structure

```
jp-mcps/
├── package.json        # Project configuration and dependencies
├── README.md           # Documentation
├── .env.example        # Environment variables template
├── prompts/            # Default directory for dynamic prompts
└── src/                # Source code
    ├── modules/        # Modular MCP tool implementations
    │   ├── command/    # System command execution
    │   │   ├── functions/
    │   │   │   ├── run-command.ts
    │   │   │   └── index.ts
    │   │   ├── registerCommand.ts
    │   │   └── index.ts
    │   ├── dynamic-prompts/ # Dynamic prompt loading
    │   │   ├── functions/
    │   │   │   ├── load-prompts.ts
    │   │   │   └── index.ts
    │   │   ├── utils/
    │   │   │   ├── to-snake-case.ts
    │   │   │   └── index.ts
    │   │   ├── registerDynamicPrompts.ts
    │   │   └── index.ts
    │   ├── filesystem/ # File system operations
    │   │   ├── functions/
    │   │   │   ├── move-file-to-trash.ts
    │   │   │   ├── read-image.ts
    │   │   │   └── index.ts
    │   │   ├── registerFilesystem.ts
    │   │   └── index.ts
    │   ├── hello/      # Reference implementation module
    │   ├── openai/     # OpenAI API integration
    │   │   ├── functions/
    │   │   │   ├── chat-completion.ts
    │   │   │   ├── check-grammar.ts
    │   │   │   └── index.ts
    │   │   ├── registerOpenAI.ts
    │   │   └── index.ts
    │   ├── sheets/     # Google Sheets API integration
    │   │   ├── functions/
    │   │   │   ├── list-sheets.ts
    │   │   │   ├── list-sheet-content.ts
    │   │   │   ├── update-sheet.ts
    │   │   │   ├── delete-row.ts
    │   │   │   ├── get-sheet-properties.ts
    │   │   │   ├── add-row-conditional-formatting.ts
    │   │   │   └── index.ts
    │   │   ├── registerGoogleSheets.ts
    │   │   ├── utils.ts
    │   │   └── index.ts
    │   └── tasks/      # Google Tasks API integration
    │       ├── functions/
    │       │   ├── list-task-lists.ts
    │       │   ├── create-task-list.ts
    │       │   ├── update-task-list.ts
    │       │   ├── delete-task-list.ts
    │       │   ├── list-tasks.ts
    │       │   ├── create-task.ts
    │       │   ├── update-task.ts
    │       │   ├── complete-task.ts
    │       │   ├── delete-task.ts
    │       │   ├── create-subtask.ts
    │       │   └── index.ts
    │       ├── registerGoogleTasks.ts
    │       ├── client.ts
    │       └── index.ts
    └── index.ts        # Main entry point
```

### Code Organization

The JP MCPs project follows a modular architecture designed for maintainability and extensibility:

1. Main Entry Point: `src/index.ts` initializes the MCP server and registers all available tools.

2. Modular Functions: Each capability is encapsulated in its own module within the `modules` directory with standardized patterns:
   - Each module has a `functions/` directory containing individual function implementations
   - Functions are named in kebab-case for consistency
   - Each function file includes its Zod input schema alongside the implementation
   - Modules export their functions and corresponding schema definitions for type safety
   - Each function follows a consistent error handling pattern

3. MCP Tool Registration: Tools are registered in module-specific register files using the `server.tool()` method which takes:
   - A tool name (used by Claude to invoke the function)
   - A schema definition (using Zod for runtime type validation)
   - An async handler function implementing the tool's logic

4. Response Formatting: Each function formats its responses consistently as an object with `content` property containing text output.

5. Error Handling: Comprehensive error handling with a TypeScript-safe approach using a utility function `getErrorMessage()` that properly handles both Error objects and unknown error types.

### Design Patterns

JP MCPs employs several key design patterns:

- Facade Pattern: Each module presents a simplified interface to complex subsystems (APIs, filesystem, etc.)
- Function-based Organization: Clean separation of concerns with focused functions for each operation
- Schema Validation: All inputs are validated using Zod schemas before processing
- Consistent Error Handling: Try/catch blocks with standardized error responses
- Type Safety: Heavy use of TypeScript and `zod.infer` for type definitions

## Dependencies

- `@modelcontextprotocol/sdk`: Core MCP SDK for building MCP servers
- `@googleapis/sheets`: Google Sheets API client
- `@googleapis/tasks`: Google Tasks API client
- `google-auth-library`: Authentication for Google services
- `gray-matter`: Markdown frontmatter parsing for dynamic prompts
- `openai`: OpenAI API client for chat completion and text processing
- `execa`: Process execution for running system commands
- `trash`: Safe file deletion by moving to system trash
- `zod`: Schema validation and type safety

## Environment Variables

The following environment variables need to be configured:

- `OPENAI_API_KEY`: Your OpenAI API key for chat completion and grammar checking
- `GOOGLE_CLIENT_ID`: Google OAuth client ID for Tasks API
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret for Tasks API
- `GOOGLE_REDIRECT_URI`: Google OAuth redirect URI for Tasks API
- `GOOGLE_REFRESH_TOKEN`: Google OAuth refresh token for Tasks API
- `PROMPTS_DIRECTORY`: Directory path containing markdown prompt files (defaults to "./prompts")

### Dynamic Prompts Setup

Create markdown files in your prompts directory with frontmatter:

```markdown
---
name: my_prompt
description: Description of what this prompt does
---

Your prompt content here...
```

Naming Rules:
- If `name` is provided in frontmatter, it will be used as-is
- If `name` is missing, the filename (without .md) will be converted to snake_case
- If `description` is missing, it defaults to an empty string

Example:
- File: `Code Review.md` → Prompt name: `code_review`
- File: `generate-tests.md` → Prompt name: `generate_tests`

## Integration

JP MCPs is designed to be used as a tool provider for AI assistants like Claude through the Model Context Protocol, which allows the assistant to invoke functions defined in this server.

## Security Notes

- Command execution includes safety checks for potentially dangerous operations
- File operations are limited to safe actions (move to trash, read images)
- All API calls are properly authenticated and use official client libraries
- Input validation is performed using Zod schemas before any operations
- Dynamic prompts are loaded from configurable directories to avoid hardcoded paths
