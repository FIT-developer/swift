# Agent Startup Rules

`start.md` is the single authoritative workflow and rules document for this
repo. Do not duplicate its rules here or anywhere else.

At the start of a new conversation:

1. Read `start.md` in full (Claude Code loads it automatically via
   `CLAUDE.md`; other tools must read it explicitly).
2. Read the latest session entries at the top of `specs/progress.md`.
3. Briefly summarize the current task from `specs/progress.md` and any
   workflow constraint that affects the user's current request.

All other rules (figma-go flow, token usage, ASCII-only output, lint)
live in `start.md`.
