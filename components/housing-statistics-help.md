# Housing statistics explanation

**Current source**: Tooltips 2836:109151, state=left, main component 194:2195.
Reread 2026-11-17 after user removed the duplicate 間數 row: 745 x 404,
export 753 x 404 including 8px left arrow. Earlier 442px height is reference.

Parent: [Tooltips](tooltips.md). Reuse its dark surface / Radius/6 / pointer;
this rich-text instance overrides generic small-body typography and padding.

## Current visual contract

- Surface and left arrow Neutral/700; Radius/6; vertical padding 8, horizontal 12.
- Content gap 8; headings have vertical padding 6, 20px SemiBold,
  SubItem/Selected, 27px line box.
- Labels and paragraphs use Text/50, 16px Regular, 22px line box.
- Labels have four-sided 1px Neutral/100 outline, padding 4 / 8.
  Label-to-paragraph gap 6. No white instance backgrounds are visible.
- Preserve source copy and punctuation. Browser text is real DOM content.
  Ellipsis may be encoded as an HTML entity while rendering the same character.
- Noto Sans TC follows the project font policy.

## Ordered content

1. 篩選條件 heading.
2. 訂房來源 and its full source paragraph listing 實體 / 網路 /
   官網訂房系統 / 官網 / 公共渠道 / 自設渠道, including examples.
3. 欄位顯示依據 heading.
4. 筆數: 當日住房之訂單量.
5. 間數: 當日住房之房間數. Exactly one row.
6. 金額: 當日個別房價總和.
7. 百分比: 該數據占全部日期之比例。
8. 住房率: 預訂單占開放房間數量之比率。
9. RevPAR（平均客房收益）: 客房收入/可售客房總數 或 住房率*平均房價.

The complete unmodified booking-source paragraph is included in the page HTML
and retained in local help-current.data.json. Explanation formulas are copy,
not authorization to compute actual report metrics or add report columns.

## Interaction

- Trigger is the original info + 說明 button, confirmed by user.
- Click toggles; outside click and Escape close, matching the existing
  order-processing click-help interaction rather than generic hover-only tips.
- Use a native auto popover without a backdrop or new modal controls. Set
  aria-expanded from its toggle event and keep focus handling native.
- Constrain the panel inside the viewport with 12px margins. Wide source
  width is a maximum, never a mobile minimum. Text wraps, labels can wrap,
  and the content scrolls vertically if it exceeds viewport height.
- The exported frame's separate canvas position is not an on-screen anchor
  contract. Viewport-contained nonmodal placement prevents clipping within the
  query panel and shared page shell.
