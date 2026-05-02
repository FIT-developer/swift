# 正式單與候補單 — Figma Frame 1437:47168

Accordion section, 425×888, bg `#f6fafd`, radius 12, padding 20, border `#d1d1d1`.

Sits as `[E]` next to `[D] 訂房資料`. Wrapped together in a grid:

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
  [D] 訂房資料 (lg:col-span-2)   —— 2/3
  [E] 正式單與候補單 (lg:col-span-1) —— 1/3
</div>
```

- `<xl` (1280 px): stacks vertically (1 col), full width each
- `≥xl`: side-by-side, [D] = 2/3, [E] = 1/3 (matches Figma 685 + 425 ratio)

**Why xl, not lg**: at lg (1024 px), [D]'s internal `lg:grid-cols-2` becomes active, but [D] would only get 2/3 (~640 px) → inner 2-col = 320 px each, too cramped. Pushing the outer split to xl gives [D] one viewport range (1024-1280 px) to display its 2-col internal layout at full width before the side-by-side split kicks in.

合約 panel's 3-col breakpoint also bumped up: `md:grid-cols-2 2xl:grid-cols-3` (was `xl:grid-cols-3`). At 1280 px side-by-side, [D] = ~840 px → 3 cols would be ~280 px each. Waiting until 1536 px (2xl) gives [D] ~1000 px in side-by-side mode → 3 cols ~330 px each.

## Header
`正式單與候補單` (md 20 px `#454545`) + icons/down

## Content (Frame 295, white card, radius 12, pad 20)

### 訂單類型 radio group (1 line)
- Label: `訂單類型` (16 px, w-[76px])
- 3 radios (gap 24 px between groups):
  - `無設定` — default selected (stroke `#d1d1d1` + `#2178cf`)
  - `正式單`
  - `候補單`
- All radios use Tailwind `accent-[#2178cf]`

### 內容區
- Centered text. Default state (`無設定`) → shows `未設定` (md 20 px `#454545`).
- Behavior: clicking a different radio swaps the panel via `[data-order-type-panel]` selector → `hidden` class.
- `正式單` / `候補單` panels currently placeholder; need Figma frames to fill in actual content.

## DOM contract
- Radios: `name="rb-order-type"`, values `none` | `official` | `substitute`, `data-order-type` attribute too
- Panels: `[data-order-type-panel="..."]` inside `#orderTypeContent`
- JS in `initSubPageBehaviors`: listens to `change`, toggles `.hidden` per matching key
