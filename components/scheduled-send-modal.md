# 排程發送 modal

## Current source

- 2026-11-13, Figma `2803:112567`, Modal, 800 x 926.
- Header `I2803:112567;73:628`, body `I2803:112567;73:678`,
  footer `I2803:112567;73:632`. Full JSON plus PNG / SVG checked.
- Page / state contract: [scheduled-send](../specs/pages/scheduled-send.md).
- Existing SMS modal is a shell / behavior reference only. This is a separate
  partial and native module; no template / condition / payment / rank fields.

## Structure and geometry

- Same shared modal controller / backdrop behavior as existing SMS modal.
  Desktop width 800, viewport-constrained height with scrollable body and fixed
  header / footer. Mobile below 640 uses the existing full-screen modal pattern.
- White box, Radius/8, Neutral/300 outline, named modal shadow. Header 77px,
  footer 58px, Spacing/12 padding. Title 新增 / 修改, subtitle 總部 / 僅適用分館,
  top-right existing close icon. View title 查看.
- Body 776px at desktop, Spacing/12 padding, following order:
  1. Category 全部 and 文本標題 / 非簡訊內容 in equal columns, gap Spacing/20.
     First row height 42; controls height 36, Neutral/200 border, Radius/6.
  2. 日期 label / 入住日前 hint, then two fields with suffix 日 and 時.
     Source row `...;2803:112857`, 776 x 36. Label column plus gap has 80px
     offset, aligned with category input above. Two 318px inputs at source width,
     height 34, equal flexible widths. Use fluid columns and wrap at narrow sizes.
  3. Counter 1 / 已使用 52 字元 on left, 範例 at the start of right half.
     範例 source `...;2803:112906`, 44 x 26, MenuItem/Default blue, white text,
     Radius/4, Spacing/6 horizontal padding. It is a real button reserved for backend
     content insertion; no fabricated payload, dialog or local replacement.
  4. 簡訊內容 label and 147px textarea, Spacing/10 gap.
  5. Open 簡訊預覽 accordion, 122px, Neutral/75 panel, Neutral/200 border,
     Radius/12, Spacing/20 padding, white 42px inner preview.
  6. 組合發送語塊, hint 點選文字按鈕，系統將自動套用與單位相關的訂單條件,
     16 existing phrase chips: 姓名 / 入住日 / 單位 / 繳款帳號 / 應付訂金 /
     繳款期限 / 訂單總金額 / 入住日(帶上星期幾) / 生日 / 入住夜數 /
     訂單編號 / 銀行 / 已付金額 / 繳款期限僅日期 / 訂單取消日 / 訂房內容.
     Product text preserves the Figma full-width parentheses. Panel and chips
     reuse SMS visual values, Spacing/20 padding / column gap, Spacing/12 row gap,
     Radius/28 chip, 42px height, Neutral/200 border.
- Major body blocks separated by Spacing/20. Text 16px, hints minimum 12px,
  title20px /600, token-only colors and dimensions where tokens exist.

## Behavior and defaults

- New: category 全部, title / day / hour empty with supplied placeholder,
  hint 入住日前, content 我是簡訊內容, preview 我是簡訊內容(完整預覽),
  preview open. Full-width preview parentheses follow the source text.
- Edit: title / category / day / hour / content from the record; hint combines its
  supplied event anchor and 前 / 後 metadata. The hint is display text, not a selector.
- Card information is read-only; changes to fields are committed only via Save.
  Preserve event label / anchor / direction / permissions / scope / usage / lifecycle.
  No real schedule computation or invented hour range / required-field validation.
- View: all form inputs / textarea / phrase buttons / 範例 disabled. Header close,
  preview disclosure and footer 關閉 remain operable. Hide 清除 / 儲存.
- Clear resets the current modal draft to new-form display defaults, without updating
  a card until Save. Metadata remains the current record's backend metadata.
- Save updates demo data then closes. Closing without Save discards draft; reopen
  restores current record. Backdrop / Escape / close use shared controller behavior.
- Phrase buttons retain the existing SMS backend-integration boundary: no invented
  interpolation syntax or plain-label insertion. Preview retains its supplied static
  complete-preview text, as in the existing SMS module. Actual insertion / interpolation and
  accurate SMS counts are deferred; retain supplied illustrative counters.
- 範例 is retained without a local click side effect, ready for backend handler.

## RWD and verification

- Follow existing adaptive form pattern: two-column first row becomes one column
  below 776px of modal width. Query the stable outer modal, so a vertical body
  scrollbar does not force a full 800px desktop modal into one column.
  Date row maintains label-to-input alignment and equal input
  columns with unit suffixes. No fixed mobile width or horizontal body scrolling.
- QA 375 / 768 / 1440: new / edit / view, field left alignment, date field bounds,
  fixed footer / scroll body, save / clear / discard, phrase / preview / no-op example.
