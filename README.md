# H1 122 Bunfig MCP Runtime Validation

This disposable repository validates the `claude-code-action` MCP startup
behavior in a researcher-owned GitHub Actions run.

The workflow checks out a fork PR head, runs the affected action ref with a fake
Claude executable to avoid Anthropic API calls, and verifies that a PR-controlled
`bunfig.toml` preload runs before the action-owned GitHub comment MCP server.

No real tokens are printed. The preload only creates a harmless PR comment marker
if it receives a GitHub token in the MCP server environment.

