# 數量價格表

> Current source: Figma `2590:124601`, `2590:124714`, `2590:124715`,
> `2590:125176`, `2592:128347`, `2590:124719`, `2590:124819`,
> `2590:124914`, `2590:125009`
> Read date: 2026-10-03
> Status: current contract, implementation pending; wait for user's start instruction

## 範圍與交接狀態

本輪是「產品設定 -> 數量價格表」的新版 Figma contract。使用者要求先寫入交接,
待通知開工後才修改實作。本輪不修改 preview HTML、partial、CSS、JS 或測試。

本任務與 Session 161 的「專案內容」改版分開管理。「專案內容」的住宿 / GHA
卡片、三步驟 modal、四月曆、日期範本、Popover 與 Offcanvas 均不屬於本任務。
本頁 table 中的「專案內容」文字是表格內容, 不代表引用專案內容頁的改版規格。

## Current Figma contract

| # | 區塊 | Node / name | Type | 尺寸 |
|---|---|---|---|---|
| 1 | Desktop page | `2590:124601` `數量價格表` | FRAME | 1440 x 943.48 |
| 2 | Main content | `2590:124605` `Frame 400` | FRAME | 1140 x 569 |
| 3 | Main card | `2590:124611` `content` | FRAME | 1140 x 509 |
| 4 | Group edit reference | `2590:124714` `群組編輯按鈕點擊後` | FRAME | 534 x 1081 |
| 5 | Group edit modal | `2590:124715` `Modal(有分資料設定與資料修改 title)` | INSTANCE | 514 x 1061 |
| 6 | Detail modal | `2590:125176` `Modal(有分資料設定與資料修改 title)` | INSTANCE | 514 x 297 |
| 7 | Inventory modal | `2592:128347` `Modal(新增庫存)` | INSTANCE | 1044 x 367 |
| 8 | Date range open | `2590:124719` `月曆區間點擊` | FRAME | 746 x 406 |
| 9 | Calendar default | `2590:124819` | FRAME | 706 x 324 |
| 10 | Calendar single date | `2590:124914` | FRAME | 706 x 324 |
| 11 | Calendar range | `2590:125009` | FRAME | 706 x 328 |

### Children checklist

- Page 的外層 child 是 `2590:124602` `Frame 427319087`, FRAME, 1400 x 919.48。
- Page shell 包含 `2590:124604` `menu`, INSTANCE, 240 x 895.48, 與主內容
  `2590:124605`。主內容包含 topbar `2590:124606`, FRAME, 1140 x 36, 及主卡片。
- 主卡片有新增庫存操作列 `2591:127029`, FRAME, 1100 x 54, 以及內容容器
  `2591:127675`, FRAME, 1100 x 415。
- 內容容器依序包含 select 列 `2590:124612`, FRAME, 708 x 36; 操作列
  `2591:127661`, FRAME, 1100 x 42; table 容器 `2590:124628`, FRAME, 1000 x 305。
- Figma 下方示意 table `2590:124655`, FRAME, 604 x 214, 有 6 個 row:
  `2590:124656`, `2590:124664`, `2590:124673`, `2590:124682`,
  `2590:124692`, `2590:124703`。
- Group edit modal 可見內容依序為起始日、截止日、星期說明、7 個星期選項、
  房型標題與 3 個 accordion。Detail modal 可見內容有 5 個直屬 children。
- Inventory table `I2592:128347;73:678;2592:128808`, FRAME, 1020 x 238,
  有 5 個 row: 表頭、全部房型、AAC、AZC、ZZO。
- 三顆 modal 的 `Slot 2` 雖含「清除 / 下一頁」JSON, PNG 均不可見, 不實作。
- 日期區間 root 有 trigger 與 popover 兩個 children; 三個 calendar state
  都是左右兩月, 每月包含 heading、7 個 weekday 與 35 個日期格。

## Scope

- 產品設定下的獨立頁面, 頁籤名稱為「數量價格表」。
- Figma 只有 desktop。Tablet 和 mobile 依既有後台手法做流動排列, 寬表格與
  month grid 保留完整內容並在元件內水平捲動, 不產生 page-level overflow。
- Figma 頂部 `xxoo` 是示意字, 不建立頁籤。
- 房型、專案、日期、月份、數量與價格均為展示資料, 後端資料生成不在本輪。

## Page layout

- desktop frame: 1440 x 943.48px, content frame 1140 x 569px, 主卡片 1140 x 509px。
  高度是 Figma 參考尺寸, 實作仍隨內容自然伸展。
- 使用既有 `aside`、`topbar`、session modal 與 topbar modal partial。
- 主卡片為 Neutral/75 背景、Neutral/200 邊框、Radius/12、Padding/20。
- 主卡片最上方獨立操作列右側顯示「新增庫存」, 含 `icons/outline-plus`。
  按鈕 node `2591:127030`, 128 x 42, 白底、Neutral/200 邊框、Radius/28,
  上下 padding 10、左右 padding 16, icon 與文字間距 8。
- 下方篩選第一列為「專案」與「房型」select, 示意值皆為 `content`。兩組欄位
  相隔 20px, input 高 36px、Radius/6、白底與 Neutral/200 邊框。
- 第二列左側依序為日期區間、帶 icon 的「群組編輯」; 右側為「清除」與「查詢」。
  select 列、操作列與 table 之間各留 Spacing/16。
- 「群組編輯」為 128 x 42 的白底 pill, Radius/28、padding 10 / 16。
- 「清除」取代舊 `Reset`, 只清除本頁「專案」「房型」select 與日期區間,
  不開啟 modal。「查詢」為 Neutral/800 深灰底、Text/100 文字。
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
  5. `Standard Rate 447`
  6. `Non-refundable (BF,D 503)`
  7. `Non-refundable (Standar Rate 447)`
- 三個價格 row 的 label cell 只顯示上述名稱。依 Figma `2590:124682`、
  `2590:124692`、`2590:124703`, 不顯示 `非 XML`、person icon、`設定` 或
  `X2 編輯`。第一列 label cell 維持 Neutral/0；第二、三列 label cell 使用
  `Color/Neutral/100` 灰底，灰底不可延伸到右側價格 cell。
- 價格 cell 顯示 `TWD` 與 `8000`。`Standar Rate` 的拼字保留 Figma 原文。
- 本次 Figma 表頭仍有 14 天, 下方 table 只畫 5 個日期 cell。使用者明確確認
  沿用原有完整 14 天 table、1216px 寬度及完整框線, 不採用縮短的示意寬度。

## Inline number edit and detail modal

- 點擊價格 cell 的顯示值後, 轉為 `input type="number"`, 並帶入原值 `8000`。
- number input 高 34px、最小寬 64px；按 Enter 後回到純數字顯示並呈現輸入值。
- 本輪不處理 blur、Escape、驗證或 API。
- input 顯示時, cell 上方保留 15px 可點區域；點該區域開啟細部 modal。
- 上述 inline number 與 hotspot 沿用已確認 source `2387:106298`, 本次未提供
  新的 inline number state, 不從新版 detail modal 推測新的觸發操作。
- 細部 modal 的新版 source 是 `2590:125176`, 514 x 297, Radius/8。
- 細部 modal 顯示房型、房價專案、日期、群組編輯入口、開房/關房 radio、
  儲存變更與取消。`取消` 與 close 均關閉 modal。
- Figma `景觀房` 是示意字。使用者確認實際資料從主頁 `Standard Rate 447`
  等被操作的價格 row / cell 帶入, 不可把示意標題固定寫成真實房型名稱。
- Figma 副文字為 `Standar Rate-447`、`0000-00-00`, 預覽房況示意為關房。
- 內層「群組編輯」改為帶 icon 的白底 pill, 128 x 42, Radius/28。
  是否開啟巢狀 group modal 尚未確認, 不得把舊版「只保留外觀」升格為新版決定。
- 「取消」改「清除」及儲存不關閉 modal 的確認範圍是 group accordion;
  不擴張套用到此 modal。此處儲存後的 modal 開關行為尚未確認。

## Group edit modal

- source: `2590:124714` reference frame, modal `2590:124715`, 寬 514px, Radius/8。
- title `群組編輯`。起始日、截止日與星期一至日選項同時呈現, 不規定先後。
- 內容依序為起始日、截止日、`你想要改哪幾天？`、一至日選項、房型標題與
  三個 accordion。日期 input 示意為 `0000-00-00`, 文字 12px。
- 星期選項為 40 x 40、Radius/4、Spacing/16 間距; 選中是
  MenuItem/Default 藍底與白字, 未選中為白底、藍字與藍邊框。
- 使用者確認選中值是示意, preview 照新稿選中星期一與四; 未來由後端提供。
- `景觀多人房` 是房型標題, 不是 tab。
- 房型標題為 20px / 600, Brand/Brand-500 橘色。
- 三個獨立 accordion 依序為可售數量、價格、房況, 使用者確認預設全部展開,
  可各自收合, 操作其中一個不影響其他兩個。
- 三區 node 依序為 `I2590:124715;73:678;2591:127396`、
  `I2590:124715;73:678;2591:127397`、`I2590:124715;73:678;2591:127398`。
  沿用 `components/accordion.md` 的收合模式; 本 variant 標題是 20px / 400,
  另有 16px / 400、Text/400 的說明。外框為 Neutral/75、Neutral/200 邊框、
  Radius/12、padding 20; 三區間距 16。白底設定區為 Radius/12、padding 10。
- 可售數量: 「更新此房型的可售房量」, 示意 input `12`, 單位「間房」。
- 價格: 「編輯此房型的所有房價方案」,「選擇房價專案」、空白價格 input 與 TWD。
- 房況: 「開啟或關閉此房型」, 開房 / 關房 radio。
- 每區顯示 `生效期間：0000-00-00 ~ 0000-00-00`。
- 房況示意預設為關房；未來由後端提供實際值。
- 三區圖面原「取消」是誤植。使用者已改 Figma 並明確要求不用重讀,
  current contract 一律改為「清除」, 只清除所在 accordion 的設定內容,
  不影響其他 accordion 或上方共用日期 / 星期, modal 維持開啟。
- 每區「儲存變更」只作用於所在 accordion, 不關閉 modal。
- modal action 保留 Figma 原色：儲存按鈕 Neutral/800 深灰底、Neutral/100
  文字; 清除按鈕 Neutral/200 淺灰底、Text/800 文字。不得套用頁面橘色 primary。
- Figma hidden footer 不實作。

## Inventory modal

- source: `2592:128347`, modal 寬 1044px, Radius/8, title `新增庫存`。
- 一張橫向 semantic table 顯示 2026 年 8 月至 2027 年 7 月, 共 12 個月。
  年份各自合併 5 個與 7 個月份欄; 年份不得用 absolute / sticky 疊在月份格。
- Table 為 1020 x 238: header 約 46px, 其餘四列各 48px。
  欄寬為房型 300px、12 個月份各 48px、總房數 144px。月份文字橫向顯示。
- 資料列依序為「全部房型」、`（AAC）維力雜醬麵房`、`（AZC）味全真的不要喝房`、
  `（ZZO）火鍋讚`; 上述括號與文字為 Figma UI 原文。
- 「全部房型」旁顯示「批次套用」, 底色為
  Accent/linear-function-button-duplication, 文字 Text/600。
- 全部房型列總房數使用橫線示意, 三個房型的總房數 input 示意值皆為 `999`。
- 使用者確認 preview 照新稿選中狀態呈現: 全部房型與三個房型皆選中 2027 年
  3 月, AAC 另選中 2026 年 12 月。這些是示意資料, 不代表真實庫存預設。
- 上方每個月份 checkbox 代表批次套用該月份到所有房型:
  勾選 2026 年 8 月 -> 下方所有房型的 2026 年 8 月一起勾選;
  取消上方勾選 -> 下方該月份全部取消。
- 下方房型 checkbox 與上方該月份 checkbox 雙向同步。同一月份全部房型都
  勾選時, 上方該月份也勾選; 任一房型取消勾選, 上方該月份取消勾選。
  使用者的「選滿一行」已確認指同一月份的所有房型, 不是某房型的 12 個月份。
- 每個 checkbox 的點擊範圍必須填滿自己所屬 cell, 不能只點得到 14px checkbox。
  點 cell 的空白區與點 checkbox 效果一致, 每次只切換一次。
- 這次已確認需實作前端 checkbox 同步互動, 不沿用舊版「只呈現 UI、不實作 JS」。
  部分選取的 indeterminate 外觀未定義, 不自行新增。
- Table 下方靠右有「取消 / 儲存變更」, 與 table 間距 Spacing/20。
  儲存變更的資料套用方式與儲存後開關行為未定義, 不套用 group accordion 的規則。
- 表格在窄螢幕於 modal 內水平捲動, 不造成 page-level overflow。
  Figma hidden footer 不實作, 可見內容中的 action row 必須保留。

## Double-month date range popover

- 本輪重讀只為確認沒有差異, 使用者沒有要求修改本組 UI 或互動。
- 下列新舊 node 排除 ID 與畫布位置後, 尺寸、結構、文字、styles 均相同,
  1x PNG 輸出亦逐一相同:

| 狀態 | Current node | 原先 node |
|---|---|---|
| 展開日期區間 | `2590:124719` | `2387:103133` |
| 尚未選取 | `2590:124819` | `2387:104431` |
| 單選 2 月 3 日 | `2590:124914` | `2387:103777` |
| 選取 2 月 3 至 7 日 | `2590:125009` | `2387:104101` |

- 下方沿用既有日期選取 contract 與實作, 不導入專案內容頁的四月曆或日期範本。
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

- 沿用: 頁面 shell、partial loader、page tabs、modal controller、tokens、icons;
  完整 14 天 table、inline number / hotspot 與本輪確認相同的雙月日期區間功能。
- 以新 Figma 與使用者確認覆蓋: 頁面新增庫存位置與名稱、主頁清除範圍、查詢
  樣式、群組編輯 accordion、星期示意選中值、三區清除與儲存範圍、detail
  modal 外觀及來源資料、新增庫存橫向 table 與 checkbox 同步。
- 舊實作待替換: 第二列「快速新增庫存」、`Reset`、group 星期二預設、非
  accordion 設定區、會關閉整顆 modal 的三區取消、673px 庫存 modal、直向月份
  巢狀 table、兩個舊房型與「設定房間數量」入口。
- 舊 modal source `2386:99177`、`2387:105078`、`2387:106427` 與其過期規則
  不作為本輪 current source, 歷史細節以 git history 為準。
- 未確認: detail modal 內層群組編輯是否串接、detail / inventory 儲存後的 modal
  開關行為、庫存儲存如何套用總房數。實際資料與 API 仍由後端提供。
- 清除確認限定主頁 filters 與 group 的各個 accordion。禁止把 accordion
  「清除 / 儲存不關閉」擴張到其他 modal。

## 下一次開工

1. 等使用者明確通知開工; 開工時以本檔為數量價格表的來源, 不修改專案內容頁。
2. 比對 `preview/quantity-price-table.html`、`preview/partials/quantity-price-modals.html`、
   `preview/assets/css/quantity-price-table.css`、`preview/js/quantity-price-table.js`,
   逐項確認上述沿用、覆蓋與未確認範圍。尚未定義的互動先確認, 不從舊版推測。
3. 分批修改, 一次不超過一個 section; 不為已確認相同的雙月曆安排 UI 改版。
4. 補必要 smoke regression checks, 驗證主頁清除、三區獨立收合 / 清除 / 儲存
   不關閉、月份 checkbox 上下同步及 cell 全範圍點擊不重複切換。
5. QA 覆蓋 1440、768、375, 確認 14 天 table 框線、庫存 table 內水平捲動及
   雙月日期狀態保留。提供截圖與 preview URL, 待使用者驗收。
