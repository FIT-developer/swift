# 排程發送

## Current source

- Read date: 2026-11-13, Figma file swift, components page.
- Current frame: `2803:111821`, 排程發送 1113 v1.1, 1440 x 1160.
- Current editor: `2803:112567`, Modal, 800 x 926.
- Current source is the complete selection JSON plus PNG / SVG exports in
  local `specs/qa-screenshots/session-188/`. JSON traversal covered every child.
- User authorized implementation after reading and clarified both new behaviors:
  範例 will insert backend-provided content into the textarea in the future;
  retain the button without invented example text. Card schedule information is
  a read-only result; editing happens in the 新增 / 修改 modal.
- Modal contract: [scheduled-send-modal](../../components/scheduled-send-modal.md).

## Existing implementation difference checkpoint

- Reuse shared sidebar / topbar / tabs / modal controller and independent page
  architecture. Sidebar has an inactive 排程發送 item; replace it with this page link.
- Reuse the confirmed SMS interaction pattern: lifecycle and usage are independent,
  toggle presence is per record, no-toggle records remain visible in either usage
  filter. Disabled lifecycle does not disable a card usage toggle. Clear resets the
  modal draft, Save updates demo state and closes, View disables all form controls.
- Reuse immediate-save card sorting including desktop title / blank / number
  starts, touch number handle, keyboard move / Enter save / Escape cancel,
  visible-slot ordering and cancellation on filter / modal action.
- Figma overrides SMS-specific card content with event / anchor / day / hour results,
  and the first card's permission notice instead of action buttons / toggle.
- Figma overrides SMS editor fields with the selected schedule editor. Do not copy
  template / condition / payment / rank fields into this modal.
- Existing SMS page remains an independent page. Generic sorting can be shared
  without changing its selectors, visual state or saved order storage key.
- Figma shell placeholders / xxoo tab / old account-switch layout are reference
  only. Use the established shared shell. No current source conflicts remain.

## Root children checklist

| Node | Content | Size |
| --- | --- | --- |
| 2803:111822 | Shell / main wrapper | 1400 x 1136 |
| 2803:111833 | Content panel | 1140 x 1052 |
| 2803:111834 | Remaining quota / scope / Add | 1100 x 54 |
| 2803:111849 | Category | 1100 x 36 |
| 2803:111852 | Lifecycle / usage filters | 336 x 46 |
| 2803:111862 | Sort hint | 320 x 32 |
| 2803:111865 | Four-card example grid | 1100 x 796 |
| 2803:111866 / 111893 / 111920 / 111947 | Cards 001 to 004 | 544 x 392 each |

## Layout and tokens

- Native independent `preview/scheduled-send.html`, maximum desktop width 1440,
  common shell and fluid widths. Panel padding Spacing/20, radius Radius/12,
  Neutral/75 fill and 1px Neutral/200 border. Major content gaps Spacing/12.
- Header: remaining quota 0, HQ / branch explanatory copy, plus Add button.
  Category select has the single supplied demo option 全部.
- Filters: enabled / disabled underline tabs with live counts, then MenuItem/Default
  blue 使用 / 不使用 chips, Radius/4. Initial filters follow the existing list default:
  啟用 and 使用. The Figma mixed four-card composition illustrates all card variants;
  it is not a requirement to show disabled / unused cards under active filters.
- Four supplied records produce live counts 2 / 2; Figma 2 / 8 is illustrative copy.
- Grid gap Spacing/12, two equal columns when the content can fit two 320px cards
  plus gap, otherwise one column. Adopt the previously authorized adaptive RWD.
- Card: minimum height 392, white fill, Neutral/300 border, Radius/12,
  existing named SMS card shadow, Spacing/16 padding. Heading 24px / 600,
  body 16px / 400, Noto Sans TC. Narrow cards reserve ribbon space above heading.
- Scope badges: Radius/28, HQ Accent/float-circle-filled-2 at 50% over white,
  branch Accent/float-circle-mixed-2 at 50%, branch text white.
- Ribbon: current SVG uses the same room-type / SMS ribbon geometry and
  Brand/100 to white for enabled, Neutral/100 to white for disabled.
  Retain original exported path and numbered handle rather than drawing a new icon.
- Result strip: 56px high, centered, three groups with Spacing/20 separation.
  First group has Brand/500 left border; remaining groups Neutral/200 left borders,
  4px stroke, 12px content inset with the stroke included, Spacing/8 icon-to-text
  gap, existing info / calendar / clock SVG icons.
  Only left borders are visible in PNG; do not implement four-sided input borders.
  前 uses Brand/500; 後 uses MenuItem/Default. These are text, not inputs.
- Heading / result / normal controls use Spacing/16 gaps. Permission notice is
  a separate 22px sibling below the 117px summary with Spacing/12 gap,
  Brand/500 text, centered. Its textarea starts after another Spacing/12 gap
  and keeps the supplied 147px height, rather than stretching into the bottom gap.
  Normal control row is 36px high,
  toggle label and shared member-data-switch, existing rounded gradient actions.
- Read-only content textarea uses Neutral/200 border, Radius/6, 16px / 22px text,
  minimum height 147. Keep text selection / resize and independent card drag starts.
- All colors / spacing / radii reference existing tokens. No new tokens or icon set.

## Demo records

| Rank | Title suffix | Scope | Lifecycle | Usage | Result | Permission |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | (1) | 總部 | enabled | no toggle | 入住提醒 / 入住日 前 / 2 天 / 15 時 | 當館無調整權限，請由總部調整 |
| 002 | (2) | 分館 | disabled | true | 入住感謝 / 退房日 後 / 0 天 / 4 時 | editable |
| 003 | (3) | 分館 | disabled | no toggle | 生日祝賀 / 入住日 前 / 25 天 / 15 時 | editable |
| 004 | (4) | 分館 | enabled | false | 催款通知 / 入住日 前 / 0 天 / 0 時 | editable |

- Titles use the exact Figma 自定義樣本名稱 and full-width parenthesized numbers.
  Every card's content is 我是簡訊內容 and category 全部.
- Birthday example retains 入住日 exactly as supplied; no inferred event correction.
- The notice is controlled by a per-record permission field, not inferred from scope.
  Suppress this card's form / lifecycle / usage controls as shown. No extra drag lock
  is specified, so it remains part of the list ordering.
- Other enabled cards have 修改 / 停用; disabled cards 查看 / 啟動. View modal is disabled.
- Usage changes remain available on lifecycle-disabled records. Switching usage can
  remove the card from the current usage filter; counts remain lifecycle counts.
- Add / save operates on in-memory demo data, following SMS list defaults for new
  enabled branch records without an inferred usage toggle. Preserve existing record
  metadata while changing modal fields. Category options / scope / permission /
  event metadata remain backend integration data, not invented frontend selectors.
  New records have no inferred event label; omit that group until metadata exists.
  The new-form anchor / direction display follows the supplied 入住日前 hint.

## Persistence and backend boundary

- Drag release saves order immediately under `swift.scheduled-send.order.v1`.
  Only order is persisted. No API or actual scheduled SMS dispatch is implemented.
- Day / hour field values are displayed back on the card; do not calculate an actual
  send timestamp, timezone, recurrence, before / after arithmetic, or SMS billing.
- 範例 has no local example payload. Future backend integration can supply its click
  handler / content. This button must not mutate the textarea in the current demo.
- Quota / character count / preview interpolation remain the existing illustrative
  frontend boundary. Keep 0 / 1 / 52 and the supplied static complete-preview
  placeholder, following the actual existing SMS module behavior.

## Verification contract

- Check enabled / disabled live counts, both usage filters, mixed toggle presence,
  disabled-lifecycle usage toggle, permission notice / action suppression.
- Check new / edit / view, day / hour / title / content save-to-card, clear draft,
  close / reopen discard, view disabled controls, phrase button presence, preview collapse,
  and 範例 no-op without backend content.
- Trusted pointer sorting from number / title to target center and immediate stored
  order, touch handle / body scroll separation, keyboard cancellation and reload.
- Screenshots at 375 / 768 / 1440 for page and modal, horizontal bounds and console.
  Run all four lints, syntax / whitespace checks and full browser smoke.
