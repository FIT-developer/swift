# 數量價格表

> Current source: 2026-10-28 Figma `2741:102458`, `2741:102808`,
> `2741:102809`, `2742:103754`, `2742:103755`, `2742:104942`,
> `2742:104943`, `2742:105152` + 本輪使用者確認。
> Read date: 2026-10-28
> Status: self-tested implementation, user authorized commit and push on 2026-10-28
> Carried-forward source: detail `2590:125176`, inline edit `2387:106298`,
> date range `2590:124719` / `2590:124819` / `2590:124914` / `2590:125009`。
> 雙月曆與 inline edit 沿用既有確認; detail 的既有 source 於本輪補查 PNG / JSON,
> 仍作為未改版外觀來源。本輪新版與使用者更正優先於歷史 contract。

## Scope and source checkpoint

- 產品設定下的獨立數量價格表頁面。使用原生 HTML + Tailwind CDN + ES modules。
- 2026-10-28 使用者先要求逐張讀取、有疑點立即釐清, 全部讀完後才整理並實作。
  最新三個缺口均已釐清: 重置數量 0 / 日期空白 / 星期全不選,
  Standard Rate 名稱格以新版淺藍底為準, 細部入口串接 option 1 群組編輯。
- 本輪只修改本頁、專屬 modal partial / domain CSS / JS 與相關檢查,
  不修改專案內容頁或新增後端、API、i18n、build step。
- 房型、平台、專案、清單、庫存月份、開放狀態與真實預設值由後端提供;
  前端以已確認的展示資料呈現, 不自行建立篩選連動或庫存套用規則。
- Desktop Figma 參考寬 1440px。Tablet/mobile 採流動布局; 主表與庫存表於
  自己的容器水平捲動, 不造成 page-level overflow。QA 為 375 / 768 / 1440。
- 群組編輯三種Set、細部編輯與新增庫存皆沿用 `components/modal.md` 的共用
  mobile滿版規則: viewport <640px時寬高填滿backdrop, 無外側留白、圓角或外框;
  Header保留, 長內容在modal body垂直捲動, 庫存表仍在自己的容器水平捲動。
  >=640px沿用各modal的參考寬度與viewport限制; 巢狀modal同樣套用滿版與原scroll lock。
- 頂部 `xxoo` 是示意字, 不建立頁籤。

## Current Figma contract

| # | 區塊 | Node / name | Type | 尺寸 |
|---|---|---|---|---|
| 1 | Desktop | `2741:102458` 數量價格表 1028 v.1.1 | FRAME | 1440 x 943.48 |
| 2 | Main card | `2741:102468` content | FRAME | 1140 x 509 |
| 3 | Group option 1 | `2741:102808` 群組編輯按鈕點擊後 1028 v1.1 option 1 | FRAME | 534 x 815 |
| 4 | Group option 1 modal | `2741:102809` Modal | INSTANCE | 514 x 795 |
| 5 | Group option 2 | `2742:103754` 群組編輯按鈕點擊後 1028 v1.1 option 2 | FRAME | 534 x 857 |
| 6 | Group option 2 modal | `2742:103755` Modal | INSTANCE | 514 x 837 |
| 7 | Group option 3 | `2742:104942` 群組編輯按鈕點擊後 1028 v1.1 option 3 | FRAME | 534 x 857 |
| 8 | Group option 3 modal | `2742:104943` Modal | INSTANCE | 514 x 837 |
| 9 | Inventory | `2742:105152` Modal(新增庫存) | INSTANCE | 1140 x 367 |

### Children checklist and rendered-state verification

- Page direct child `2741:102459` Frame 427319087, FRAME, 1400 x 919.48。
  Shell 含 `2741:102461` menu, INSTANCE, 240 x 895.48, 與主內容 `2741:102462`。
- Main card children: `2741:102469`, FRAME, 1100 x 54, 新增庫存操作列;
  `2741:102471`, FRAME, 1100 x 415, 篩選與表格容器。
- 篩選列 `2741:102472`, FRAME, 1072 x 36, 含三組 344 x 36 欄位:
  `2741:102473` 平台 / `2741:102798` 專案 / `2741:102477` 房型。
  操作列 `2741:102480`, FRAME, 1100 x 42; table `2741:102487`。
- 主表有 14 個日期表頭與六個下方示意 row, 價格 cell 圖面只畫五格。
  使用者先前確認的完整 14 天 / 1216px / 完整框線仍沿用。
- 三個 group frame direct child 分別為上表列出的 modal instance。
  可見內容依序為 Set / To / 起始日 / 截止日 / 星期說明 / 七個星期 /
  各組清單 / 共用 action row。
- Inventory direct children `I2742:105152;73:627` Frame 12, FRAME,
  1140 x 367, 與 `I2742:105152;73:632` Slot 2, SLOT, 320 x 58。
  Table `I2742:105152;73:678;2742:105162`, FRAME, 1116 x 238,
  五個 row 依序為表頭、全部房型、AAC、AZC、ZZO。
- 三個 group 與 inventory 的 Slot 2 雖含清除 / 下一頁 JSON, 渲染圖均不可見,
  不實作。內容中的可見 action row 必須保留。
- 全部新版均核對 JSON styles 與 PNG。Group 標題 / Title 為 20px;
  一般 label / 清單為 16px; To / 日期值為 12px。未把展示 active state 當成預設。

## Main page

- 沿用 aside、topbar、page tabs、session/topbar modal、partial loader。
- 主卡片 Neutral/75、Neutral/200 border、Radius/12、Padding/20;
  高度隨內容自然伸展, 不固定為 Figma 高度。
- 最上方操作列右側為「新增庫存」, node `2741:102470`, 128 x 42,
  `outline-plus.svg`, Neutral/0 背景、Neutral/200 border、Radius/28,
  padding 10 / 16、icon 24px、icon/text gap 8。
- 第一列依序為平台、專案、房型, 各組 344px reference width、組間 Spacing/20。
  label 與 select 水平對齊, select 36px 高、Radius/6、Neutral/0 背景與
  Neutral/200 border。平台 / 專案 / 房型 label 統一固定64px, gap12,
  各select相對欄位左緣的偏移皆為76px; 堆疊時三個select左緣切齊。
  此為2026-10-28使用者驗收更正, 覆蓋Figma房型label原32px示意。
- 三個 select 均以 `content` 示意; 選項與真實預設由後端提供。
  本輪不實作三者間的篩選連動。
- 第二列左側依序為日期區間與帶 `document-multiple-02.svg` 的群組編輯白底 pill,
  群組按鈕 128 x 42、Radius/28、padding 10 / 16。右側是清除 / 查詢。
- 查詢使用 Neutral/800 深灰底與 Text/100 文字; 清除使用 Neutral/200 背景。
  日期與群組列高 42px, 查詢與清除高 34px。
- 篩選、操作列與表格間距 Spacing/16。小尺寸控制項自然換行,
  由巢狀容器可用寬決定欄數; mobile 填滿可用寬度。
- 清除涵蓋平台 / 專案 / 房型與日期區間: 有預設值還原預設, 無則清空,
  不開 modal。日期沒有預設日期, 回到未選區間的格式提示。

## Fourteen-day table (carried forward with confirmed label fill)

- 沿用完整 14 欄: 2026-08-24 至 30 與 2026-09-24 至 30。
  label 320px、日期各 64px、整表 1216px。展示日期不代表生成規則。
- 窄螢幕於 `.qp-table-shell` 水平捲動, 每列框線延伸至最右側。
- 順序為專案內容 (ID:222111)、房況、可售房量、淨訂單量、Standard Rate 447、
  Non-refundable (BF,D 503)、Non-refundable (Standar Rate 447)。
  實際 UI 文案保留 Figma 原文與 Standar 拼字。
- 三個價格 row label 只顯示名稱, 不含非 XML / person / 設定 / X2 編輯。
- 第一個 Standard Rate label 依 2026-10-28 使用者確認改為 Neutral/75 淺藍底;
  第二、三個 label 為 Neutral/100。label 底色不延伸至價格 cell。
- 價格顯示 TWD / 8000。下方未畫的日期格沿用原有完整展示資料,
  不縮短為 Figma 五格示意。
- 開放訂房綠底填滿它所屬 colspan 合併 td, 文字置中;
  無單量為獨立小區塊, 完整置中且不超出日期 cell。
  無單量以本輪 node `2741:102520` 為準: Surface/Status-Negative 紅底,
  Neutral/0 字、Radius/24、16px 字、22px line-height、padding 0 /4;
  不沿用舊 HTML 的 Neutral/100 灰底。

## Inline number edit and detail modal (carried forward)

- 沿用 inline source `2387:106298`: 點價格顯示值後切換 number input,
  帶入原值 8000; input 高 34px、最小寬 64px, Enter 提交並回純數字。
  不新增 blur / Escape / 驗證 / API 規則。
- input 上方保留 15px hotspot, 點擊開細部 modal。房型 / 專案 / 日期從
  被操作 row/cell 帶入, 不把「景觀房」示意標題固定當真實資料。
- 細部外觀沿用已確認 source `2590:125176`, 514 x 297, Radius/8,
  內容有房型、專案、日期、群組編輯、開房 / 關房、儲存變更 / 取消。
  預覽房況為關房; 真實資料由後端提供。
- 群組入口使用帶 document-multiple-02 icon 的白底 128 x 42 / Radius/28 pill。
  使用者確認要串接新版群組編輯, 每次從此入口開啟 option 1。
  使用既有 nested modal controller, 子層蓋在父層上, 關閉子層回父層,
  父層存在時 body 維持 scroll lock。
- 儲存變更 / 取消 / close 關閉所在 modal; 儲存資料由後端處理。

## Group edit modal

- Current sources 為上表 option 1 / 2 / 3, 寬 514px、Neutral/0 背景、
  Neutral/300 border、Radius/8。共用 Header 引用 `components/modal.md`,
  標題群組編輯為 20px / 600, body padding 12、主要區塊間距 20。
- 新版整體取代舊景觀多人房標題與可售數量 / 價格 / 房況三個 accordion。
- Set 使用 `components/select.md` 的 select 外觀, 高 36px。
  label 64px + gap 12, option 值依序為 `option 1` / `option 2` / `option 3`。
  開啟預設 option 1; 三種 option 是不同類型, 切換時重置內容。
- To 用來調整數量, label 64px + gap 12, input 高 28px、Radius/6,
  數量值字級 12px。保留 Figma 的 Set / To UI, 不改產品文案。
- 起始日 / 截止日同為 64px label + gap 12 + 高 28px input,
  內容字級 12px, 日期格式提示 `0000-00-00`。
- 星期說明為「你想要改哪幾天？」, 下方一至日為 40 x 40、Radius/4、gap16。
  選中 MenuItem/Default 底 / Neutral/0 字, 未選中 Neutral/0 底與藍字 / 藍框。
  窄容器使用原生水平 scroll 保留七個完整控制項。
- Figma To=10、星期一 / 四選中僅為展示。使用者最新指定的重置 / 預設值:
  To=0、日期清空、星期全不選中、各組清單與各組全選皆不選。
- 各組清單初始全不選, 每組各自「全選」只影響自己內容;
  個別項目與全選雙向同步, 全選所有項目後全選勾選, 任一取消則全選取消。
  不自行加入未定義的 indeterminate 外觀或跨組連動。
- 各組清單為白底、Neutral/300 border、Radius/8、padding12、組間距20。
  個別列左側內縮12, checkbox14px, 文字16px, checkbox/text gap12;
  row 下邊框 Neutral/300, 不從 JSON 誤判成整列四邊框。
  `Title` 是20px / 400; 全選在各框右上方。

| Set | 第一組 | 第二組 | 第三組 |
|---|---|---|---|
| option 1 | 無標題, ABC / XYZ | 無標題, 頻道 1 / 頻道 2 | 無; 重複頻道組依使用者更正移除 |
| option 2 | Title, ABC / FCG | Title, XZZ / FOG | 無標題, 頻道 1 / 頻道 2 |
| option 3 | Title, IOP / ZOQ | Title, BBQ / FUC | 無標題, 頻道 1 / 頻道 2 |

- 以上 Title / 項目為示意字, 正式內容由後端提供。
- 2026-10-28使用者再次確認原option 1設計稿本身重複, 沒有遺漏的中間內容。
  使用者會修改Figma, 並明確要求前端移除一組重複頻道; 此確認為current source,
  不再等待Figma重連。Option 1只保留ABC /XYZ與一組頻道1 /2, 共兩組清單;
  option 2 /3維持三組。各組全選與清除 /切換重置規則不變。
- >=640px時, Option 1 modal移除重複清單後高度隨內容自然伸縮,
  不保留原795px的空白; Option 2 /3維持837px參考高度。
  <640px三種Set皆滿版; viewport不足時仍由modal body垂直捲動。
- 清除: 重置整顆 modal 的 To / 日期 / 星期 / 各組清單, modal 維持開啟,
  且保留當前 Set, 不把 option 2 / 3 切回 option 1。
- 切換 Set: 保留剛選的目標 option, 其他內容重置, 不保留不同類型的輸入。
- 共用 action 只一組清除 / 儲存變更, 清除56 x34、儲存88 x34、gap8。
  清除 Neutral/200 底與 Text/800 字; 儲存 Neutral/800 底與 Neutral/100 字。
- 儲存變更關閉 modal, 不沿用舊 accordion 的儲存不關閉規則。
  真實資料更新由後端處理。close / backdrop / Escape 使用共用 modal 行為。

## Inventory modal

- Current source `2742:105152`, 寬1140px、高367px參考值、Radius/8,
  Neutral/0 背景與 Neutral/300 border, title新增庫存為20px /600。
- 一張 semantic table, 不再使用房型內嵌直向月份 table。
  Table1116 x238, header46px, 其他四列各48px。
  房型300px、月份各48px、總房數144px。
- 顯示2026-08至2027-09共14個月, 年份合併5欄 /9欄;
  年份不得用 absolute / sticky 疊在月份上, 月份文字橫向顯示。
- 原基準為2026-08至2027-07共12個月; 超出的2027-08 /09表頭
  使用 Color/Brand/Brand-100 底色提示。提示依是否超過原12個月判定,
  不以各房型開放狀態是否一致判定。
- 資料列為全部房型、AAC維力雜醬麵房、AZC味全真的不要喝房、ZZO火鍋讚,
  實際UI房型文字與括號完整保留 Figma, 各房型名稱於300px欄內水平置中。
- 全部房型旁批次套用 badge 為 Accent/linear-function-button-duplication 底,
  Text/600 字、padding 2 /6、高26px, 與全部房型文字gap12且整組置中。
  全部房型總房數引用 outline-minus.svg (24 x24),
  不以裝飾 Unicode 代替; 其他三列 input999。
- 預覽示意選中2027-03的全部房型與三個房型, AAC另選2026-12。
  這不是正式庫存預設; 月份範圍 / 開放狀態 / 真實預設由後端提供。

| 控制列 | 2027-08 | 2027-09 |
|---|---|---|
| 全部房型 | disabled | disabled |
| AAC | 可選 | disabled |
| AZC | 可選 | 可選 |
| ZZO | disabled | disabled |

- 任一房型在該月份未開放, 全部房型該月份批次 checkbox 就 disabled;
  仍開放的房型可個別勾選。有效開放期間不必對齊, 允許顯示超出的月份。
- Disabled 整格 Neutral/100 背景、checkbox Neutral/300 實心灰色,
  checkbox 本身與整格點擊範圍均不可操作, 鍵盤也不能切換。
- 可用月份批次 checkbox 勾選 / 取消 -> 下方所有房型該月份一起改變;
  下方同月全部房型皆選時批次亦選, 任一取消則批次取消。
  Disabled 的批次控制保持 disabled, 不因部分可用房型選滿而恢復。
- 可用 checkbox 的 label 點擊範圍填滿各自 cell, 點空白與點 checkbox
  效果一致且每次只切換一次。部分選取 indeterminate 未定義, 不自行新增。
- Action位於table下方20px且靠右, 取消 / 儲存變更皆關閉所在modal;
  實際總房數的庫存更新與API由後端處理, 不自行推測套用方式。
- 小尺寸強制由modal內 `.qp-inventory-scroll` 水平捲動,
  保留完整欄位與欄寬; <640px modal滿版, >=640px配合viewport縮放,
  不造成page-level overflow。

## Double-month date range popover

- 沿用 2026-10-03 已確認且逐張比對相同的雙月曆; 本輪未要求改版, 未重新讀取本組 frame。
- 下列新舊 node 排除 ID 與畫布位置後, 尺寸、結構、文字、styles 均相同,
  1x PNG 輸出亦逐一相同:

| 狀態 | Current node | 原先 node |
|---|---|---|
| 展開日期區間 | `2590:124719` | `2387:103133` |
| 尚未選取 | `2590:124819` | `2387:104431` |
| 單選 2 月 3 日 | `2590:124914` | `2387:103777` |
| 選取 2 月 3 至 7 日 | `2590:125009` | `2387:104101` |

- 下方沿用既有日期選取 contract 與實作, 不導入專案內容頁的四月曆或日期範本。
- 為適配新版篩選排版, popover定位改為fixed, 開啟 /resize /scroll時依
  document.documentElement.clientWidth量測並夾取, 四周保留12px。
  日期內容、選取與月份切換互動沿用既有contract。
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

## Accessibility and implementation checkpoint

- 所有控制項有可讀名稱, 純裝飾 icon 空 alt。原生 select / input / label,
  checkbox 使用 checked / disabled; 不讓視覺與實際狀態分離。
- 日期popover同步aria-expanded, 日期button同步disabled / aria-pressed;
  外部點擊或Escape關閉。保留visible focus, 字級不得小於12px。
- 沿用: shell / partials / modal controller / tokens / icons / 14天完整表格 /
  inline number與hotspot / 雙月曆。未改版部份以本檔明列的沿用contract為來源。
- 覆蓋: 平台篩選與清除、新增庫存入口、群組Set三態與全部重置 / 儲存規則、
  Standard Rate label淺藍底、detail群組串接、14月庫存與disabled / sync / scroll。
- 過期group accordion與12月inventory內文已退役, 不作為current source。
  舊稿2590:124601 /2590:124714 /2590:124715 /2592:128347僅歷史reference。
- 使用者確認後才開始實作; 本輪已得到條件式開工授權並釐清三個最後問題。
- 驗證需涵蓋: main清除、三態內容 / 切換重置 / 清除保留Set / 全選雙向同步 /
  儲存關閉 / detail nested入口option1、14月年份與示意勾選、disabled整格阻擋 /
  可用月份同步 / 橘底只標超出12月、375 /768 /1440局部水平捲動與完整框線。
  Modal另檢查360 /375 /639滿版、640斷點恢復置中、長內容action可捲達,
  以及fullscreen子層關閉後父層與scroll lock仍保留。
- 跑fonts / conventions / tokens / partials lint、smoke與diff whitespace,
  視覺截圖存specs/qa-screenshots/session-171/, self-tested後提供preview網址待驗收。
