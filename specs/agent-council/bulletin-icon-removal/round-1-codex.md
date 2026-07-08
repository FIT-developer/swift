---
author: Codex CLI
role: round-1 independent analysis
model_family: GPT
source_files:
  - specs/agent-council/bulletin-icon-removal/brief.md
---

# Round 1 - Codex independent analysis

## Position

I recommend **方案 A：整個拔除** as the default delivery choice.

Reason: the brief frames bulletin as a business-excluded feature for this customer service delivery, and the implementation is a real cross-page feature, not a harmless placeholder. Keeping a complete inaccessible modal and JS behavior in the repo would create hidden dead weight unless the user explicitly says this is a short-term, likely-to-return feature.

**Consensus: DRAFT - pending user decision.**

## Facts

- `bulletin` is currently a complete working feature across three pages, not only an icon placeholder. Source: `specs/agent-council/bulletin-icon-removal/brief.md`, 現況查證.
- Desktop entry is `desktopBulletinBtn` in `preview/partials/topbar.html`, opening `modalBulletinBackdrop`. Source: brief.md.
- Mobile drawer entry is `mobileBulletinBtn` in `preview/partials/aside.html`, also opening `modalBulletinBackdrop`. Source: brief.md.
- Modal body is in `preview/partials/topbar-modals.html` as `modalBulletinBackdrop`. Source: brief.md.
- Bulletin-specific JS is isolated: `.bulletin-tab` and `data-bulletin-row-toggle` only appear inside the bulletin modal, while message modal uses `.administer-tab`. Source: brief.md, 方案 A.
- Figma currently has `Function icons` as 3 icons after prior `system` removal: `bulletin`, `message`, `person-md`. Source: brief.md.

## Assessment

### Candidate A: 整個拔除  
Source: `brief.md`, 候選方案 / 方案 A.

This best matches a delivery where the feature is not offered. It removes the visible entry points, modal markup, and unused JS behavior. The brief already states the bulletin JS is not shared with message or member-security behavior, so removal appears technically bounded.

Main tradeoff: future restoration requires recovering from old commits or reimplementing. That is acceptable if the product decision is “not included in this delivery” rather than “temporarily disabled until later in the same service.”

### Candidate B: 隱藏  
Source: `brief.md`, 候選方案 / 方案 B.

This is appropriate only if the user expects a near-term reversal or wants a deliberately dormant feature. It minimizes restoration effort, but leaves modal content and behavior in the codebase without a user-facing path. That creates ambiguity for future maintainers and keeps unsupported UI surface present in implementation.

If chosen, the hiding should be uniform across pages, not page-conditional. Source: brief.md, 方案 B.

## Recommendation

Choose **方案 A：整個拔除** for the preview implementation.

If the user chooses A, also ask whether Figma should be synchronized now. My recommendation is to synchronize Figma now as well, because the previous `system` icon decision already established that `Function icons` should reflect the deliverable set, and code/Figma divergence would create another bookkeeping gap.

For the stale modal comment, if A is chosen and the modal is removed, no rename is needed. If B is chosen, rename the old comment because keeping a hidden modal with inaccurate “vendor（管理訊息）” labeling makes the retained code more confusing.

## Needs User Decision

1. Confirm **方案 A：整個拔除** or **方案 B：隱藏**.
2. If A: should Figma `Function icons` be synchronized from 3 icons to 2 icons now?
3. If B: should the stale `modalBulletinBackdrop` comment be corrected while the hidden modal remains?
