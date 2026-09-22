# 數量價格表

> current source: Figma `2386:98253` `數量價格表`, read 2026-09-21
> current modals: `2386:99177`, `2387:105078`, `2387:106427`
> quick inventory current source: `2387:105078`, reread 2026-09-22
> current calendar states: `2387:103133`, `2387:104431`, `2387:103777`, `2387:104101`
> current inline number state: `2387:106298`

## Scope

- 產品設定下的獨立頁面, 頁籤名稱為「數量價格表」。
- Figma 只有 desktop。Tablet 和 mobile 依既有後台手法做流動排列, 寬表格與
  month grid 保留完整內容並在元件內水平捲動, 不產生 page-level overflow。
- Figma 頂部 `xxoo` 是示意字, 不建立頁籤。
- 房型、專案、日期、月份、數量與價格均為展示資料, 後端資料生成不在本輪。

## Page layout

- desktop frame: 1440 x 943.48px, content frame 1140 x 535px。
- 使用既有 `aside`、`topbar`、session modal 與 topbar modal partial。
- 主卡片為 Neutral/75 背景、Neutral/200 邊框、Radius/12、Padding/20。
- 篩選第一列為「專案」與「房型」select；第二列依序為日期區間、群組編輯、
  快速新增庫存，右側為 Reset 與查詢。
- tablet/mobile 時篩選控制自然換行；select 與主要按鈕在窄寬度填滿可用空間。

## Fourteen-day table

- 日期表頭固定展示 14 欄：2026 年 8 月 24 至 30 日，以及 2026 年 9 月 24 至
  30 日。這是展示資料, 不代表日期生成規則。
- label 欄寬 320px, 日期欄 64px, 整張表寬 1216px。日期欄不得窄於狀態 chip,
  「無單量」不可超出所屬 td，且以完整 td 寬度水平置中，不受 cell padding 偏移。
- 「開放訂房」綠底填滿它所屬的 colspan 合併 td，用整段色帶表示該日期區間
  都是開放訂房；文字保持置中。「無單量」維持獨立小區塊。
- 窄螢幕由 `.qp-table-shell` 水平捲動。所有 row、th、td 的實際邊界必須延伸
  到 table 最右側, 不可出現內容超過框線的狀況。
- 內容順序：
  1. `專案內容 （ID：222111）`
  2. 房況
  3. 可售房量
  4. 淨訂單量
  5. `Standard Rate 447`, person icon, 設定
  6. `Non-refundable (BF,D 503)`, `非 XML`, person icon, 設定
  7. `Non-refundable (Standar Rate 447)`, `非 XML`, person icon, `X2 編輯`
- 價格 cell 顯示 `TWD` 與 `8000`。`Standar Rate` 的拼字保留 Figma 原文。

## Inline number edit and detail modal

- 點擊價格 cell 的顯示值後, 轉為 `input type="number"`, 並帶入原值 `8000`。
- number input 高 34px、最小寬 64px；按 Enter 後回到純數字顯示並呈現輸入值。
- 本輪不處理 blur、Escape、驗證或 API。
- input 顯示時, cell 上方保留 15px 可點區域；點該區域開啟細部 modal。
- 細部 modal 顯示房型、房價專案、日期、群組編輯入口、開房/關房 radio、
  儲存變更與取消。`取消` 與 close 均關閉 modal。
- 內層「群組編輯」本輪只保留外觀, 不串接另一個 modal；送出行為交由後端。

## Group edit modal

- source: `2386:99177`, modal 寬 514px, Radius/8。
- title `群組編輯`。起始日、截止日與星期一至日選項同時呈現, 不規定先後。
- 星期預設依示意選取星期二；未來由後端提供實際值。
- `景觀多人房` 是房型標題, 不是 tab。
- 三個獨立區塊：可售數量、價格、房況。各自的「儲存變更」只影響自己區域。
- 房況示意預設為關房；未來由後端提供實際值。
- 任一區塊的「取消」均關閉整個 modal。
- modal action 保留 Figma 原色：儲存按鈕 Neutral/800 深灰底、Neutral/100
  文字；取消按鈕 Neutral/200 淺灰底、Text/800 文字。不得套用頁面橘色 primary。
- Figma hidden footer 不實作。

## Quick inventory modal

- source: `2387:105078`, modal 寬 673px, Radius/8, title `設定`。
- 顯示固定 12 個月的示意區間：2026 年 9 月至 2027 年 8 月。
- 上方全選區與每一列房型都必須顯示完整月份資料。三個月份區各使用一張巢狀
  semantic table：年份列的 `2026 年` 使用 `th colspan="4"` 合併 9 月至 12 月，
  `2027 年` 使用 `th colspan="8"` 合併 1 月至 8 月；不得以 absolute 或 sticky
  定位把年份文字疊在月份格上。
- 月份列的每一個月份與 checkbox 都放在自己的 `td`。月份以九月至十二月、
  一月至八月逐字直向排列，checkbox 位於各月份底部；文字必須受 td 寬度限制，
  不得超出儲存格或推擠相鄰欄位。
- 上方全選欄寬 60px、月份區寬 589px；房型資料 table 的欄寬依序為 60px、
  196px、301px、92px。上方月份每欄約 49px，資料列月份每欄約 25px。
- 上方每月 checkbox 的語意為選取該月份所有房型；每列月份 checkbox 可個別
  覆寫；「設定房間數量」把該列總房數套用到選取月份。
- 上述 checkbox 與批次套用效果本輪只呈現 UI, 不實作 JS；實際資料由後端處理。
- 兩列示意房型為 `(aaa) 好睡房`、`(aaa) 好讚讚`, 房間數皆為 12。
- 表格在窄螢幕於 modal 內水平捲動；Figma hidden footer 不實作。

## Double-month date range popover

- source button 是頁面上的 `0000-00-00 ~ 0000-00-00`。
- popover 寬 746px, desktop 雙月並排；mobile 改為單欄堆疊, 維持完整日期格。
- 左箭頭位於第一個月份最外側, 右箭頭位於第二個月份最外側；每次移動一個月。
- 使用 `arrow-left.svg`、`arrow-right.svg`, 不自行繪製 icon。
- 日期狀態：
  - 今天以前 disabled：Neutral/100 背景與邊框, Text/400。
  - 今天：Accent/Pink 背景, 白字。
  - 起訖端點：Bootstrap/Components/Focus 藍色, 白字；覆蓋今天粉紅色。
  - 三日以上區間的中間日：Accent/Light-Green, Text/800。
  - 跨月補位日期：只供辨識, 不可點擊。
- 第一次點擊建立藍色起點；第二次點擊可在前或後, 並正規化起訖順序。
- 相連兩日均為藍色。三日以上首末藍色、中間綠色。
- 第二個日期選完後 popover 保持展開。完成區間後再點第三個日期, 清除舊區間並
  以第三次點擊建立新起點。
- 預覽以 2026-02-03 作為今天以呈現已確認狀態；正式今天與月份由後端提供。

## Accessibility and interaction

- 所有 icon button 有可讀名稱；純裝飾 icon 使用空 alt。
- popover trigger 同步 `aria-expanded`; date button 使用 disabled 與
  `aria-pressed` 表達狀態。
- 點 popover 外或按 Escape 關閉日期 popover。共用 modal controller 處理
  backdrop、close 與 Escape。
- 所有互動控制保留 visible focus；字級不得小於 12px。

## Current implementation contract

- 沿用：頁面 shell、partial loader、page tabs、modal controller、tokens、icons。
- Figma 覆蓋：本頁內容、14 日 table、三個 modal、inline number 與雙月日期狀態。
- 無舊頁面或舊 spec 衝突。
- 未定義並保留後端：實際資料、資料送出、月份批次 checkbox、群組編輯串接。
