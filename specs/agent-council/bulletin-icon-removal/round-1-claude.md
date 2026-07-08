---
author: Claude CLI
role: round-1 independent analysis
model_family: Claude
source_files:
  - specs/agent-council/bulletin-icon-removal/brief.md
---

# Round 1 - Claude independent analysis

## Position
Recommend **Option A (full removal)**, contingent on treating it as a proper multi-file removal (not a copy of the `system` icon's trivial delete) with explicit binding-disposition audit per file.

## Facts
- Bulletin is a fully interactive feature across all three pages (topbar button, mobile drawer button, shared modal, tab switching, row-toggle JS) -- unlike `system`, which had zero interactions before its removal.
- Brief has already verified `.bulletin-tab` / `data-bulletin-row-toggle` are isolated to `modalBulletinBackdrop` and don't overlap with the message modal's `.administer-tab`. This isolation check is a precondition for safe removal, and the brief states it can be relied on as-is for this round.
- Removal touches at least four files: `preview/partials/topbar.html`, `preview/partials/aside.html`, `preview/partials/topbar-modals.html`, `preview/js/topbar-modals.js` (both the binding calls and the function bodies `bindTabGroup(".bulletin-tab", ...)` / `bindBulletinRows()`).
- The modal partial is shared across three pages (since Session 97), so removal is a single edit that propagates everywhere -- no per-page conditional logic needed either way.
- The brief does not mention whether a bulletin count/badge data source exists outside the DOM (e.g., a JS variable or fetch feeding the badge number). This is unverified and should be checked before implementation, regardless of which option is chosen.

## Assessment
The two options carry different weight here than they did for `system`, because bulletin is real, working code, not an inert placeholder.

**Removal's main stated risk** -- "if the customer wants it back later, we have to dig it out of an old commit or rewrite it" -- is weak. Git history is exactly the recovery mechanism for this case: the commit that deletes the code preserves it verbatim, and it's trivially retrievable (`git log`, `git show`) if bulletin is reinstated in a future engagement. This mirrors the project's own general engineering stance (avoid keeping backwards-compat shims or unused code "just in case").

**Hiding's main stated risk** -- "dead code with no entry point, delayed removal" -- is the more concrete long-term cost. A customer-facing deliverable that contains a fully wired modal with no way to reach it is odd: it adds surface area to review, risks accidental exposure through a CSS regression, and doesn't match the business decision ("not offering this feature") as cleanly as a real removal does. The brief's own proposed mitigation for hiding (one unified class, no per-page logic) avoids the Session 84-85 mistake, but doesn't remove the underlying dead-weight problem.

One point not raised in the brief: if Option A is chosen, the sub-question about renaming the stale "Modal C - Bulletin - vendor（管理訊息）" comment (question 3) becomes moot -- the whole modal block is deleted, so there's no comment left to rename. That question only matters under Option B.

The one real gap in scope for A is verifying whether the badge counter has a backing data source (e.g., a count fetched or computed in JS) that also needs removal -- this wasn't checked in the brief and should be part of implementation-time audit, not assumed away.

## Recommendation
- Q1: Option A (full removal), executed as a proper multi-file, multi-binding removal -- not a copy-paste of the `system` icon's minimal deletion, since this feature has real JS behavior to unwind.
- Q2: Sync Figma `Function icons` COMPONENT_SET to 2 icons in the same pass, for consistency with the `system` icon precedent and to avoid Figma/code drift.
- Q3: Defer / moot under Option A (the modal block is deleted, so there's nothing to rename). Only relevant if the user picks Option B instead.

## Needs User Decision
- Final choice between Option A and Option B (this is the core decision the brief asks the council to converge on).
- If A: confirm Figma COMPONENT_SET sync timing (same-pass vs. code-first-Figma-later, matching the `system` icon 1a-variant option).
- Confirm whether a bulletin badge count data source exists outside the DOM that also needs to be identified/removed during implementation (unverified in this brief, flagged for the implementation phase regardless of which option wins).
