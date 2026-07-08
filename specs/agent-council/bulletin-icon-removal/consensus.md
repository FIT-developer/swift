---
author: Codex CLI
role: synthesizer draft
model_family: GPT
source_files:
  - specs/agent-council/bulletin-icon-removal/round-1-codex.md
  - specs/agent-council/bulletin-icon-removal/round-1-claude.md
  - specs/agent-council/bulletin-icon-removal/round-2-codex-review.md
  - specs/agent-council/bulletin-icon-removal/round-2-claude-review.md
---

# Consensus (DRAFT - pending user decision)

## Decision Candidates

1. **方案 A：整個拔除公告功能**  
   Remove `desktopBulletinBtn`, `mobileBulletinBtn`, `modalBulletinBackdrop`, bulletin-only tab binding, `bindBulletinRows()`, and any bulletin-only badge/count source found during implementation audit.  
   **source: Both**

2. **方案 A + 同步 Figma**  
   If removal is approved, update Figma `Function icons` COMPONENT_SET from 3 icons to 2 icons in the same pass, matching the prior `system` icon precedent and avoiding code/design drift.  
   **source: Both**

3. **方案 B：隱藏但保留程式碼**  
   Keep bulletin markup, modal, and JS, but hide the entry uniformly across all pages, not with per-page conditional logic. This should only be chosen if the user expects near-term restoration or intentionally wants a dormant feature.  
   **source: Both**

4. **If B is chosen, rename stale modal comment**  
   The old `Modal C - Bulletin - vendor（管理訊息）` comment should be corrected only if the modal remains. If A is chosen, this question is moot because the modal block is deleted.  
   **source: Both**

5. **Implementation gate for A**  
   Before deletion, prepare a per-file binding-disposition list for `topbar.html`, `aside.html`, `topbar-modals.html`, and `topbar-modals.js`, plus a one-time check for any bulletin badge/count data source outside the DOM.  
   **source: Synthesizer synthesis**

## Why

The council converges on **方案 A：整個拔除** as the preferred delivery decision. Bulletin is not a placeholder: it is a complete three-page feature with desktop and mobile entry points, a shared modal, tab behavior, expandable rows, and JS bindings.

Because the business decision is that this customer-facing service will not provide bulletin, retaining a fully wired but inaccessible feature would create unsupported hidden surface area and future maintenance ambiguity. Removal better matches the delivery scope.

The main cost of removal is future restoration effort, but both agents treat that as preferable to carrying unused code indefinitely. Git history can recover deleted implementation if the feature is reinstated later, though later code changes may make that recovery non-trivial.

## Agreement

Both Codex and Claude recommend **方案 A：整個拔除**.

Both recommend syncing Figma now if A is approved, because the `Function icons` component set should reflect the deliverable icon set and avoid code/Figma drift.

Both agree that the stale `modalBulletinBackdrop` comment only matters under B. Under A, the block is removed.

Both agree that B is valid only if the user deliberately wants a dormant or easily restorable feature.

Both accept the brief’s verification that bulletin-specific JS is isolated from the message modal: `.bulletin-tab` and `data-bulletin-row-toggle` are bulletin-only, while message uses `.administer-tab`.

## Disagreement

There is no substantive disagreement on the product recommendation.

The only difference is emphasis:

- Claude stresses that this removal must be treated as a multi-file, binding-by-binding removal, not like the earlier trivial `system` icon deletion.
- Codex agrees with that audit but frames the badge/count source check as an implementation task, not a separate user-facing product decision.

## Risks

If A is chosen, future restoration will require recovering from history or reworking the feature against later code changes.

If A is chosen but Figma is not synced, the project may carry another code/design mismatch after already resolving the previous `system` icon drift.

If A is implemented without an audit, a bulletin-only badge/count source or DOM query could be left behind.

If B is chosen, the repo retains a complete unsupported modal and JS path with no user-facing entry point, increasing dead code and accidental exposure risk.

If B is chosen and the stale comment remains, retained hidden code will keep misleading “vendor（管理訊息）” labeling.

## Action Plan

1. Ask the user to confirm A or B.

2. Recommended default: proceed with **方案 A：整個拔除**.

3. If A is approved, ask whether Figma should be synced in the same pass. Recommended default: **sync Figma now**.

4. Before implementation under A, require a scoped audit:
   - `preview/partials/topbar.html`: remove desktop bulletin entry.
   - `preview/partials/aside.html`: remove mobile bulletin entry.
   - `preview/partials/topbar-modals.html`: remove `modalBulletinBackdrop`.
   - `preview/js/topbar-modals.js`: remove bulletin-only binding calls and function bodies.
   - Search for any bulletin badge/count data source and remove it if it has no remaining consumer.

5. If B is chosen instead, hide the entry uniformly across pages and correct the stale modal comment.

## Needs User Decision

1. Choose **方案 A：整個拔除** or **方案 B：隱藏**.

2. If A: should Figma `Function icons` be synced from 3 icons to 2 icons in the same pass, or deferred?

3. If B: should the stale `modalBulletinBackdrop` comment be renamed while the hidden modal remains?
