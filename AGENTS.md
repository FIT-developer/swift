# Agent Startup Rules

At the start of a new conversation in this repo, read:

1. `start.md`
2. `specs/progress.md`
3. `specs/assets/tokens.md` usage rules and relevant token sections only as needed

Use `start.md` as the authoritative workflow. Do not duplicate or replace its opening checklist.

After reading, briefly summarize only:

- the current task from `specs/progress.md`
- any workflow constraint that affects the user's current request

For token usage:

- Always follow `specs/assets/tokens.md`.
- Do not fully rescan or sync tokens unless the task touches colors, spacing, radius, typography, effects, or the user says Figma Variables changed.
- Before adding or changing any HTML/CSS/JS value that maps to a token, inspect the relevant section of `specs/assets/tokens.md`.

When the user says `figma-go`, first use Figma MCP / figma-go to read the currently selected Figma frame, section, or component. Confirm the selected node with the user before writing specs or implementation.

Do not implement Figma-sourced UI from memory or inference. Use the current Figma node as the source of truth, then follow:

tokens -> icons -> components -> sections -> layouts -> preview HTML
