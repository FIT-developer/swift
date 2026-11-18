# Status page

Status: current, user-confirmed 2026-11-18; implementation self-tested.
The user accepted it and explicitly authorized commit and push on 2026-11-18.

## Source and variants

File swift, page display `1:3`, read 2026-11-18. The four sections are
1440 x 957. Full source traversal and root children checklists are recorded in
[Session200](../specs/progress.md). User confirmed the final questions after
the read checkpoint; the user then centered maintenance in Figma and supplied
the two gradient Variables in a screenshot. Do not reread the modified source
or infer another change from the earlier maintenance offset.

| State | Section | Error page instance | Main component | Instance bounds |
| --- | --- | --- | --- | --- |
| not-found | `328:15233` | `328:14855` | `351:19015` | 622 x 762 |
| ip-error | `328:15234` | `328:15032` | `328:14886` | 697 x 890 |
| other-error | `328:15235` | `328:15109` | `328:14954` | 551 x 706 |
| maintenance | `351:20754` | `351:20755` | `328:14867` | 622 x 762 |

## Shared appearance

- White page: Color/Neutral/0. No authenticated shell, card, border or radius.
- Center the content group horizontally and vertically in available viewport.
  The maintenance source offset is superseded by the user's centering correction.
- Heading: 32px / 600, 44px line box, Noto Sans TC per project font policy.
  Use --font-size-3xl. Source font is Noto Sans Display SemiBold.
- Heading gradient: left to right Color/Surface/Linger-start to
  Color/Surface/Linger-End, alpha1. These names and values come from the user's
  Variables screenshot; preserve the Figma spelling and path.
- Decorative illustrations remain original Figma assets, with transparent
  bounds and source colors. Never rasterize headings into the artwork.
- Return: existing icons/return scaled to24px, Spacing/8, native text
  returning label, 20px / 600 / 27px line box, Color/Text/800.
- Return hover and keyboard focus use the existing light blue
  Color/Bootstrap/focus-background. Keep Text/800 label/icon color. Background
  fades over150ms with no geometry change; reduced-motion disables transition.
  A pseudo-element extends the hit area by Spacing/8 without changing the
  source72 x 27 visual line. Use the existing global focus-visible outline.

## Per-state content and layout

### not-found

Heading text: 網頁不存在. Order: heading -> illustration -> return.
Title `I328:14855;351:19016`, illustration `I328:14855;351:19017`,
return `I328:14855;351:19020`. Heading160 x 44; illustration360.55 x 371.3;
return72 x 27. Bounds meet with zero gap. Illustration includes source
transparent space; do not add spacing inferred from visible pixels.

### ip-error

Heading text: 拒絕非台灣 IP. Supporting text: 請聯繫系統商尋求協助.
Order: heading/support group -> illustration -> return.
Header `I328:15032;353:21775` is199 x 70; Spacing/4 between32px heading
and16px / 400 / 22px supporting line, Color/Text/800. Spacing/28 between
header and illustration slot, and between slot and return.

Illustration frame `I328:15032;328:14888` is229.2 x 257.01. Original art
overflows the top and right. Its standalone export is285 x 330, beginning
72.55px above the layout slot; left origin is unchanged. Preserve this offset
and complete kite rather than clipping or laying out the330px image as the
257.01px slot. At narrow widths scale this geometry proportionally so the
right overhang also fits the page gutter. Return `I328:15032;328:14944`.

### other-error

Order: illustration -> heading -> return, Spacing/28 between each.
Artwork `I328:15109;328:14955` is338.41 x 335.58, exported339 x 336.
Use the saved original PNG: browser rendering of the exported SVG exposes
dark cone strokes that the Figma PNG masks. PNG is the visual ground truth.
Heading `I328:15109;328:15017` is251 x 44. Its source string is
`有些地方出錯了\u2026`; render the final U+2026 using an HTML entity,
not three periods. Return `I328:15109;328:15007`.

### maintenance

Order: heading -> illustration, Spacing/20. No return or other action.
Heading text: 網頁維護中, `I351:20755;328:14868`,160 x 44.
Illustration `I351:20755;351:19027` is452.64 x 337.27, export453 x 338.
User confirmed that this group is centered on both axes like the other states.

## Responsive behavior

- User confirmed the same composition on mobile, with images shrinking
  proportionally and content remaining centered. No separate mobile variant.
- Fluid page width, Spacing/12 outer gutters, source illustration widths as
  upper bounds. Typography remains legible at the source token sizes.
- No fixed mobile min-width. Keep all artwork, including the IP kite, inside
  the viewport. Preserve source aspect ratios and transparent image margins.
- Use min-height100svh and natural document flow. When a very short viewport
  cannot contain the composition plus gutters, allow vertical page scroll so
  the title and return remain reachable; never crop via overflow:hidden.

## Interaction and backend ownership

- Four independent documents; frontend does not select a status, inspect IP,
  choose HTTP codes, redirect automatically, or call a backend API.
- First three states share a native return anchor. Backend supplies its href.
  The supplied placeholder href=# is intercepted locally and emits status:return
  with detail {page,state}; it does not navigate or assume history/login/home.
- A real href uses normal native anchor navigation, including keyboard and
  modifier keys. No frontend URL parser or destination override is needed.
- initStatus is idempotent, called after loadPartials, and marks #statusRoot
  with data-status-ready=true. Maintenance contains no return anchor.
