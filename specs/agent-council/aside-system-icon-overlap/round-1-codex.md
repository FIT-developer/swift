---
author: Codex CLI
role: round-1 independent analysis
model_family: GPT
source_files:
  - specs/agent-council/aside-system-icon-overlap/brief.md
---

# Round 1 - Codex independent analysis

## Position

`system` icon and aside「系統設定」do create a real semantic overlap. My
preferred direction is **remove the right topbar system icon from current UI**
unless the product owner can define a distinct, non-overlapping behavior for it.

The reason is pragmatic: aside「系統設定」is now a concrete navigation category
with five visible child items, while the function icon `system` is a visible
gear with no behavior. In a backoffice product, a gear icon in the persistent
topbar naturally reads as settings. If the real settings entry is already in
aside, keeping a second inert gear adds ambiguity without adding capability.

## Facts From The Brief

- Aside now has a real「系統設定」parent item with five child items.
- `components/function-icons.md` says `system` is a future feature with no
  corresponding content and no badge.
- Desktop `system` in `preview/partials/topbar.html` is an `<img>`, not a
  button, and has no `data-modal-open`.
- Mobile drawer also includes a system icon.
- Session 97 established that function icons should not be half-working across
  pages. The three defined icons were repaired by sharing modal partials; system
  was not defined in that repair.

## Assessment Of Options

### Option A: Keep current state

This is the weakest option. It preserves visual rhythm, but it leaves an inert
gear in a persistent navigation/control region. The icon is not just decorative:
it sits beside functional icons, so users will reasonably expect it to do
something. Keeping it as-is repeats the class of problem Session 97 just exposed:
an icon can look like an available command while its behavior is undefined.

### Option B: Remove the topbar system icon

This is the cleanest current-product behavior. It makes aside the single visible
place for system settings, removes the inert command, and avoids inventing a
new future feature just to justify an old placeholder.

The cost is real: this changes the function icons component from four visible
icons to three visible icons in code, and specs must converge accordingly. If
Figma still shows four icons, the implementation contract must explicitly say
the fourth icon is deferred or removed by product decision, not silently omitted.

### Option C: Keep icon but redefine meaning

This is only valid if the user supplies a concrete product meaning. Without that,
it is a poor fit for this repo because it asks the implementation layer to create
product semantics. "Global tools", "quick settings", or "system status" are all
plausible, but they are not current requirements.

### Option D: Keep visual but mark pending

This is acceptable only as a short transition state. It improves documentation,
but it does not improve the UI. A visible inert gear still remains in the same
cluster as working icons. If the decision is not ready, D is better than A, but
it should be treated as a pending-product-decision state, not a design answer.

## Recommendation

Adopt **Option B**, with a documented convergence step:

1. Update `components/function-icons.md` so current product behavior is no
   longer "four icons, system future feature"; instead, current visible
   function icons are bulletin, message, and person/member security. `system`
   should be marked removed/deferred because settings now live in aside.
2. Update `preview/partials/topbar.html` and `preview/partials/aside.html` to
   remove the system icon from desktop and mobile function icon rows.
3. Verify desktop topbar spacing and mobile drawer spacing after removal.
4. Record the decision in `specs/progress.md`.

If the user does not want to remove it yet, adopt **Option D as a temporary
decision**, but still write the limitation into `components/function-icons.md`:
`system` is visible only as an unresolved placeholder, not a valid system
settings entry and not an implementation source for a future modal.

## Needs User Decision

1. Should the current product remove the right topbar/mobile drawer `system`
   function icon now?
2. If removed in code, should Figma be updated immediately, or should the repo
   record this as a product override until Figma catches up?
3. If kept temporarily, is a visible inert gear acceptable in the function icon
   row, or should it be hidden until behavior exists?
