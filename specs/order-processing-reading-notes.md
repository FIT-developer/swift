# 訂單處理作業 > 訂單處理 — Figma 讀取記錄（進行中，尚未寫入正式 spec）

> 這是 figma-go 多批次讀取的工作記錄檔，不是正式 component/section/layout spec。
> 依 start.md 三階段流程，目前停在 **Read** 階段；使用者說「讀完」後才進入 Spec checkpoint。
> 不可直接拿本檔內容當實作依據，需等 Spec checkpoint 確認。

---

## 批次進度

- [x] 讀取 1/N：desktop default 桌面版主頁面（本檔記錄）
- [x] 讀取 2/N：desktop extend 桌面版（同一頁面的「側欄收合」狀態，非新內容，本檔記錄）
- [x] 讀取 3/N：desktop extend 0701-2 button clicked（訂單編號 pill 的下拉選單互動狀態，本檔記錄）
- [x] 讀取 4/N：desktop extend 0701-3 order button clicked（點下拉選單「訂單」後開啟的「訂單明細」大 modal，本檔記錄）
- [x] 讀取 5/N：desktop extend 0701-4 edit button clicked - normal member（點下拉選單「修改」後開啟的「訂單修改」大 modal，一般會員版，本檔記錄）
- [x] 讀取 6/N：desktop extend 0701-4 edit button clicked - contract member（同一個「訂單修改」modal，合約會員版，本檔記錄，用 diff 比對找差異）
- [x] 讀取 7/N：desktop extend 0701-5 message button clicked（點下拉選單「簡訊」後開啟的「簡訊」發送 modal，本檔記錄）
- [x] desktop 批次：使用者於讀取 7 後表示 desktop 批次結束，轉入 mobile ~ tablet 批次
- [x] 讀取 8/N：mobile ~ tablet 0701-1 more condintions not collapsed（第二批第一個 frame，本檔記錄）
- [x] 讀取 9/N：mobile ~ tablet 0701-2 more conditions collapsed（本檔記錄，解開讀取 8 的命名矛盾）
- [x] 讀取 10/N：mobile ~ tablet 0701-3 button clicked（訂單編號 pill 下拉選單在 mobile 變成 Offcanvas，本檔記錄）
- [x] 讀取 11/N：mobile ~ tablet 0701-3 info button clicked（2 個 Tooltips：訂單狀態圖例 + 日期狀態說明，本檔記錄）
- [x] 使用者表示所有頁面（desktop + mobile ~ tablet）讀完
- [x] 讀取 12：使用者補充 `Offcanvas` COMPONENT_SET 本體（非新頁面，component 定義 cross-check），本檔記錄

> **使用者指示（2026-07-03）**：這頁的 tips（tooltip）展開行為**對所有尺寸都適用**（desktop 也有，不是 mobile 專屬），使用者只是選在 mobile ~ tablet frame 示範，不代表這兩個 tooltip 只存在於窄螢幕。實作與 spec 記錄時，tooltip 內容/觸發規則要套用到 desktop 對應的相同 `(i)` icon 上（讀取 1 的「訂單編號 (i)」跟讀取 2 的「日期狀態 (i)」）。

> **使用者指示（2026-07-03）**：Figma frame 內出現的 `icons/cursor`（手指/游標圖示）是文件標註「點擊/hover 位置」用，正式環境不會出現，讀取時忽略不實作。已存成 memory `feedback_figma_cursor_icon_is_doc_annotation`。

> **使用者指示（2026-07-03）**：讀取 5 與下一個 frame 的 title 內「（...）」括號文字**不會出現在正式環境**，只是 Figma 文件用來標註欄位版本差異（例如「一般會員版」vs 下一個 frame 的其他會員版）。記錄時 production 標題不含括號，括號內容另外記成「變體標籤」。
- [ ] mobile ~ tablet 版本（第二批，尚未開始）

> 從讀取 3 開始改用 `scripts/figma-read.py`（見 `scripts/README.md`）取代逐次手寫 python heredoc。

---

## 讀取 1：Content page - 訂單處理 desktop default 0701

- **node id**: `2032:86476`
- **name**: `Content page - 訂單處理 desktop default 0701`
- **type**: SECTION
- **bounds**: 1440 x 1542 (Figma canvas @ -5167,67332)
- **讀取日期**: 2026-07-03

### 頂層結構

```
Section (1440x1542)
├── Frame 688 (1400x1518 @ 20,12)
│   └── Frame 401 (1400x1494)
│       ├── menu (INSTANCE, 240x1191.48)  -- sidebar，沿用既有 menu 元件，未展開細讀（跟其他頁一致）
│       └── Frame 400 (1140x1494 @ 260,0) -- 主內容區
│           ├── Frame 398 (1140x36)   -- 頂部工具列
│           ├── shirnk-model-1 (1140x500 @ 0,60)  -- 篩選面板（可收合，名稱暗示 shrink/收合 model）
│           └── Frame 678 (1109x910 @ 0,584)  -- tabs + 表格 + footer
└── floatIcons/ai (INSTANCE, 40x70 @ 1372,1058)  -- 沿用全站浮動 AI icon，未細讀（跟其他頁一致）
```

### A. Frame 398 頂部工具列（1140x36）

- Frame 220 (235x36)：兩個 chip 型 Input，各帶 `icons/close`
  - Input 1: label `訂單處理` (127x36)
  - Input 2: label `xxoo` (96x36)
  - **疑點**：這兩個 chip 內容像是「搜尋 tag / 麵包屑」但實際語意未明，`xxoo` 疑似佔位假字。需使用者確認這兩個 chip 代表什麼（例如：頁面名稱 breadcrumb？可移除的篩選條件 tag？）
- Function icons (156x24 @ 984,6)：4 個圖示 + badge，沿用全站頂部功能列 pattern
  - `icons/bulletin` badge `99`
  - `icons/message` badge `0`
  - `icons/person-md` badge `99+`
  - `icons/system` badge `99+`
  - 與既有 `components/function-icons.md` 疑似同一元件，需 cross-check（未展開讀取，假設沿用）

### B. shirnk-model-1 篩選面板（1140x500 @ 0,60）

容器樣式：radius 12、fill `#f6fafd`、stroke `#d1d1d1`、padding 20 all sides

三欄 + 底部操作列：

**欄 1 — Frame 651 (340x398 @ 20,20)**
- Frame 639/637：日期相關 Calendar simple + Input，顯示 `2026-02-27`（兩個一樣的 date input，疑似入住/退房或篩選起訖日，需確認）
- Frame 697 (340x198 @ 0,200)：4 個 row，每 row label + 控制元件
  - `日期狀態` — 內含 Input `訂單日`（可能是下拉選單：訂單日/入住日/退房日等）
  - `訂單編號` — Input placeholder
  - `名稱` — Input placeholder
  - `行動電話` — Input `0988777111`

**欄 2 — Frame 650 (340x364 @ 400,20)**，內部 Frame 640 共 7 row：
- `Frame 606` 內文字 `訂金`（獨立一行，疑似 checkbox/toggle label，未見到控制元件細節，需再深入）
- `處理狀態` — Select `全部`
- `預付方式` — Select `全部`
- `客戶類別` — Select `全部`
- `團散類別` — Select `全部`
- `訂單來源` — Select `全部`
- `使用人` — Select `訂房人`

**欄 3 — Frame 635 (340x230 @ 780,20)**
- `房型` — Select `全部`
- `Nation`（既有元件，沿用 order-data.md 國籍 pattern）— `國籍` label + `臺灣`/`外籍` 二選一 chip（increasing content slot）
- Frame 629 (340x76)：
  - Frame 636：`專案` label + sm 文字 `所有專案`（疑似有 chip/badge 顯示目前套用專案數，需再確認結構）
  - Frame 374：Input placeholder + Select `專案`（合併 input+select，跟 member-data-modal 的「更換合約公司」merged pattern類似）
- Frame 633/634：`條件查詢` label + Input placeholder + Select `其他需求`（合併 input+select 同上）

**底部操作列 — Frame 653 (1100x62 @ 20,418)**
- 2 個 Button Y/N，靠右對齊：`清除`（980,20）、`查詢`（1044,20）

**開放疑點（篩選面板）**：
1. 兩個一模一樣的日期 input（`2026-02-27` x2）用途不明，需確認是「起訖區間」還是重複讀取錯誤
2. `訂金`（Frame 606, 欄2）只有文字沒看到控制元件細節，需再展開讀
3. `專案` 區塊的 `所有專案` sm 文字用途不明（是 badge 還是純提示文字）
4. 面板名稱 `shirnk-model-1` 暗示可收合（shrink model），但本次讀取未看到收合 trigger/icon，需確認是否有 collapse 行為

### C. Frame 678 主表格區（1109x910 @ 0,584）

#### C-1. Tabs + 動作按鈕列 — Frame 673 (974x38)

**Frame 653（Tabs, 516x38, 7 個）**：
| tab | active? | 疑點 |
|---|---|---|
| 全部 | **是**（fontWeight 600，stroke `#f28b45`） | stroke 只在此文字節點出現，很可能是 border-bottom-only（依 `feedback_figma_stroke_can_e_single_side`），需 get_node 精確驗證是否單邊 |
| 正式單 | 否 | — |
| 未付款 | 否 | — |
| 已過期 | 否 | — |
| 取消單 | 否 | — |
| 未取消 | 否 | — |
| 候補單 | 否 | — |

**Frame 649（5 個 Button，右側，各 74x36）**：
`今日付款` / `今日催款` / `今日過期` / `今日取消` / `今日住房`（12px sm 文字，可能是快篩 shortcut button）

#### C-2. Table desktop（1109x856）

容器：radius 12、fill `#ffffff`、stroke `#d1d1d1`、padding top/bottom 12、left/right 16

**9 欄（Frame 117, 1077x772 @ 16,12）**，欄寬與 x offset：

| # | Frame id | 欄名 | 寬 | x |
|---|---|---|---|---|
| 1 | 2004:63531 | 編號 | 56 | 0 |
| 2 | 2004:63500 | 訂單編號（含狀態badge群） | 196 | 56 |
| 3 | 2026:68752 | 訂購日 | 111 | 252 |
| 4 | 2027:64603 | 訂購人 | 110 | 363 |
| 5 | 2027:64671 | 天數 | 110 | 473 |
| 6 | 2004:63581 | 入住 / 退房日 | 119 | 583（高度只 338 @ y:217，非 772 整欄高，疑點見下） |
| 7 | 2027:64761 | 間數 | 110 | 702 |
| 8 | 2027:64782 | 訂單內容 | 155 | 812 |
| 9 | 2032:89002 | 入住人 | 110 | 967 |

**6 資料列**：編號 `1` `2` `3` `4` `5-1` `5-2`（第 5 列拆成 5-1/5-2 兩個子列，高度合計約等於一般列的 2 倍：220 = 110+110）

**已確認業務規則（2026-07-03，Spec checkpoint）**：
- 編號 `1`/`2`/`3`/`4` 這種**純數字編號** = 獨立一列，沒有子訂單
- 編號 `n-1`/`n-2`/`n-3`... 這種**帶連字號的編號** = 代表第 `n` 筆訂單底下有**子訂單**，同一個編號群組（`n`）內的子訂單各自佔一個子列，視覺上合併顯示在同一個列區塊內
- 換句話說，表格產生列的規則是：一筆訂單若有多筆子訂單，就展開成 `n-1`、`n-2`...多個子列；沒有子訂單就是單一列 `n`
- 之後寫 table spec 要把這個「編號欄位 = 主序號 or 主序號-子序號」的規則明文寫進去，資料結構上要能表達「一個訂單 -> 多個子訂單」的階層

**逐列內容摘要**：

| row | 訂單編號 | dot 狀態(語意) | dot 顏色 | 次要 badge | 其他資訊 |
|---|---|---|---|---|---|
| 1 | 133449 | `overdues`（已過期） | `#ffcc00` 黃 | Booking / 加購 / 對帳 | 訂購日 2026-07-01 15:33:41、訂購人 香港/基努李維/*391、天數1、入住退房 07-01~07-02、間數1、訂單內容「ABC 123 暑假專案」、入住人同訂購人 |
| 2 | 133391 | `alternation`（候補單） | `#86b7fe` 淺藍 | Agoda / 網路訂房 / 開發票 | 同上格式 |
| 3 | 443212 | `cancel`（取消單） | `#e12129` 紅 | Agoda / 註 / 修改 / 團體 | 同上格式（3 個次要badge，比其他列多一個） |
| 4 | 933921 | `official`（正式單） | `#2aca18` 綠 | 企業 / 國旅 / 促銷 | 訂購人改為手機 0911222333（非 *391 遮罩） |
| 5-1/5-2 | 488212 | `unpaid`（未付款） | `#b0b0b0` 灰 | 企業 / 加購 / 網路訂房 | 同一訂單拆兩子列，內容相同 placeholder 值 |

**關鍵發現 — 狀態 dot 顏色語意對照表**（Figma 內 ellipse 圖層命名直接標示狀態）：

| 語意（圖層命名） | dot fill | 對應 tab（推測） |
|---|---|---|
| `official` | `#2aca18` 綠 | 正式單 |
| `unpaid` | `#b0b0b0` 灰 | 未付款 |
| `overdues` | `#ffcc00` 黃 | 已過期 |
| `cancel` | `#e12129` 紅 | 取消單 |
| `alternation` | `#86b7fe` 淺藍 | 候補單 |

**已確認官方 token 名稱（2026-07-03 補 Figma Variables 同步後）**：這組色彩對應 `Color/Dots/*` token 群組（詳見 `specs/assets/tokens.md` § Dots），正式 token 名稱跟這裡的圖層命名/tab 用語都不完全一樣：

| dot 顏色 | `Color/Dots/*` token | tooltip 圖例中文（讀取 11） | 圖層命名（本節） | tab 用語 |
|---|---|---|---|---|
| 綠 | `validated` | 正式單 | `official` | 正式單 |
| 灰 | `unpaid` | 未付單 | `unpaid` | 未付款 |
| 黃 | `overdues` | 逾期單 | `overdues` | 已過期 |
| 紅 | `cancel` | 取消單 | `cancel` | 取消單 |
| 藍 | `alternative` | 替代單 | `alternation` | 候補單 |

實作時 CSS 顏色一律用 `var(--color-dots-*)`（見 `base.css`），不要用圖層命名或 tab 命名當 class/變數名。**已確認（2026-07-03）**：tooltip 圖例／篩選 tab 兩套中文用語是不同情境下的顯示內容，差異允許，不強制統一——tooltip 顯示 tooltip 版用語，tabs 顯示 tabs 版用語，各自照字面實作。

**訂單編號 pill（Status buttons instance）疑點**：
- dot + 訂單號文字 + `icons/triangle`（下拉箭頭，暗示可點擊展開/切換狀態）
- 訂單號文字 fill 為 `#f6f6f6`（近白），但目前抓到的 wrapper fill 都是預設 `#ffffff` 佔位 — 文字幾乎白色代表背景應該是深色/彩色，但簡化 JSON 沒抓到正確背景色（同 `feedback_figma_gradient_stroke` 類型的序列化遺漏，但這次不是漸層是純色 component variant 主色未序列化）。**需要對其中至少一顆 pill 做 `get_node` 精確查詢或 SVG screenshot 驗證背景色**，不可用 dot 顏色直接當 pill 背景色猜測。

**次要 badge（Booking/加購/對帳/Agoda/註/修改/團體/企業/國旅/促銷/網路訂房/開發票 等）**：
- 文字 fill 統一 `#6d6d6d`（灰），wrapper fill 只有預設 `#ffffff` 佔位，同樣需要 get_node 驗證實際背景（很可能是白底灰框 outline chip，但未驗證）
- 這些 badge 語意像是「訂單來源/加購狀態/客戶類別/團散類別」等 tag 的複合展示，需要對照篩選欄位（處理狀態/預付方式/客戶類別/團散類別/訂單來源）反推每個 badge 屬於哪個分類，目前只能列出文字，不能確定分類歸屬

**入住/退房日欄（Frame 128）bounds 疑點**：
- 其餘 8 欄都是 `772` 高（對齊整個 6 列表格），唯獨此欄 bounds 是 `119x338 @ (583,217)`，內部 6 個子 Frame 用負 y 偏移（如 `Frame 661 @ y:-179`）撐出視覺對齊，是 Figma 匯出時的 bounding-box 緊縮現象（該欄第一列前面有 header 但子節點沒有從 0 開始的空白），非佈局差異；**不影響最終 HTML 實作**，只是原始 JSON 的 bounding box 剪裁，記錄以防之後看到數字對不齊時誤判

#### C-3. Footer / 統計列 — Frame 672 (1077x52)

| 元素 | 內容 |
|---|---|
| `統計` label | 純文字 |
| timestamp | `2026-07-01\n15：33：41` |
| chip 1 | fill `#fdebd7`（淺橘）文字 `2 間` |
| chip 2 | fill `#e1e1e0`（灰）文字 `3 夜` |
| `加購 $ 33,999` | 純文字金額 |
| `房價 $ 33,999` | 純文字金額 |
| `總計` (橘字 `#ef6f25`) + `$ 33,999` | 總計金額，橘字標籤符合站內「橘字=強調/必要資訊」語意 |

---

## 讀取 2：Content page - 訂單處理 desktop extend 0701-1

- **node id**: `2032:86481`
- **name**: `Content page - 訂單處理 desktop extend 0701-1`
- **type**: SECTION
- **bounds**: 1440 x 1528
- **讀取日期**: 2026-07-03
- **結論**：這不是新頁面，是**讀取 1 同一頁面的「側欄收合」互動狀態**。用 `get_screenshot` 實際渲染截圖比對後確認（見下方視覺驗證），內容資料（表格 6 列、篩選欄位、footer 統計）與讀取 1 完全相同，差異只在 layout。

### 與讀取 1 的結構差異

- 側欄 `menu` instance 從 `240x1191.48`（完整選單）收合成 `240x48`（只剩頂部 logo + 帳號列的窄條），child 節點（`Ul` 選單列表等）雖然 JSON 仍回傳完整子節點但視覺上被裁掉（`clipsContent`，JSON 摘要沒有序列化這個欄位，純靠 screenshot 才能確認）
- 因側欄收合，頂部工具列 + 篩選面板容器 `shirnk-model-1` 從 `1140px` 寬變成 `1400px` 寬（3 欄篩選各欄從 `340px` 變 `426.67px`）
- 表格區 `Frame 678`／`Table desktop` **寬度不變**，仍是 `1109px`（沒有跟著側欄收合一起變寬）——經截圖確認這是刻意設計，右側空出的欄位是給浮動 `客服` AI icon 站的位置，不是遺漏

### 視覺驗證（get_screenshot, node `2032:86481`）

截圖存放：`/private/tmp/claude-501/-Users-3qb-Code-Figma/7734e722-2714-41bb-b37a-528271ec33ec/scratchpad/order-processing-extend.png`（session scratchpad，非專案正式檔案，僅供本輪核對用）

截圖解析度確認以下讀取 1 遺留疑點：

| 讀取 1 疑點 # | 結論（截圖 + 局部放大裁切驗證） |
|---|---|
| 1（頂部兩個 chip `訂單處理`/`xxoo`） | 是**分頁 tab chip**（可各自關閉 X），目前 active 分頁是「訂單處理」（藍色外框高亮），`xxoo` 是另一個開啟中分頁的佔位標籤（設計稿假資料，非真實頁面名稱）。同排左邊是 logo + 帳號名 `xiaomi999` + 登出 icon + 切換帳號 icon + **側欄收合/展開 toggle icon**（就是它控制讀取1 default ↔ 讀取2 extend 兩態切換）。**已確認（2026-07-03，Spec checkpoint）**：這個分頁 tab 功能**已經實作好了**，不是這次要新做的東西——`preview/landing.html` 既有 `#pageTabsInline` / `.page-tab` / `.page-tab-close` / `.active` 就是這套實作，訂單處理頁沿用既有機制即可，不需要重新設計。`xxoo` 是 Figma 佔位假字（見 memory `feedback_figma_placeholder_text_conventions`），正式環境不會出現這個字串。 |
| 3（兩個一樣的日期 input） | 是**日期區間**（起 - 迄），非重複讀取錯誤。下方另有 4 個快速區間按鈕：`< 今日 >` `< 本週 >` `< 本月 >` `< 今年 >`（每個都有左右箭頭，可上一/下一區間切換） |
| 4（`訂金` 控制元件） | 是 **toggle switch**（開關），非 select，預設關閉態 |
| 5（`專案` 區塊 `所有專案` 文字） | `專案` label 右側的灰色小字 `所有專案` 是**目前套用範圍的提示文字**（非 badge 數字），同一行右側是 toggle switch（預設關閉態） |
| 7（tab「全部」active stroke 是否單邊） | **確認為單邊 border-bottom**，顏色 `#f28b45`，非四邊框（像素取樣驗證） |
| 8（訂單編號 pill 背景色） | **確認為固定深灰 `#4f4f4f`（約，取樣像素 rgb(79,79,79)）**，5 個狀態列取樣皆同色，pill 背景**不隨狀態變色**，只有左側 dot 變色；文字白/近白、右側 `icons/triangle` 白色 |
| 9（次要 badge 背景色與分類歸屬） | 次要 badge（加購/對帳/網路訂房/開發票/註/修改/團體/企業/國旅/促銷 等）視覺上是**白底灰框小 pill**，非彩色填色。另外發現 `Booking`/`Agoda` 這組「訂單來源」badge 樣式跟其他次要 badge 不同：用類似括號 `( )` 的弧形邊框、橘色調外框，且**只出現在 row 1/2/3**（overdues/alternation/cancel 三個狀態），row 4（official）/row 5（unpaid）沒有這個來源 badge，直接接到分類 badge。這可能只是範例資料剛好沒填來源，**不確定是否為狀態相關的顯示規則**，先記錄現象、不下結論 |

### 新發現（讀取 1 沒觀察到的細節）

1. 側欄收合 toggle icon（top-left，方框對半分割圖示）— 控制 default/extend 兩態，需要之後補一個 icon 語意條目（可能是 `icons/sidebar-toggle` 或類似，需對照 `specs/icons.md` 是否已有定義）
2. 浮動 icon 除了 `floatIcons/ai` 本體外，上方還有 `客服`（客戶服務）文字 label，之前只讀到 instance 沒往下展開讀這個文字
3. `訂購人`/`入住人` 欄位裡的姓名（`基努李維`）在截圖中顯示為**藍色可點擊連結樣式**（底線或至少變色），暗示點擊姓名可能會開啟會員資料 modal 或類似互動——JSON 沒有這個互動線索，純粹視覺觀察，需要之後確認

---

## 讀取 3：Content page - 訂單處理 desktop extend 0701-2 button clicked

- **node id**: `2032:86482`
- **name**: `Content page - 訂單處理 desktop extend 0701-2 button clicked`
- **type**: SECTION
- **bounds**: 1440 x 1528
- **讀取日期**: 2026-07-03
- **結論**：同一頁面（extend 側欄收合態）再疊加一層互動狀態——**點擊 row 1 訂單編號 pill 的 `icons/triangle` 後彈出的下拉選單**。resolves 讀取 1 疑點：pill 上的 triangle 確認是 dropdown trigger。

### 下拉選單內容（instance `Dropdown aside`, id `2032:77575`, 136x264 @ 130,753）

視覺驗證（screenshot，見下方）：選單貼齊 pill 左下角展開，白底、陰影、圓角卡片。

| 項目 | 說明 |
|---|---|
| 訂單 | 選單項目 1 |
| 修改 | 選單項目 2，peach/橘色淺底 `#fad4ae`（**修正**：見讀取 12 對照元件本體，此淺底是寫死在 component 上的固定樣式，不是 hover/focus 互動態；「修改」被設計成視覺上跟其他 5 項不同、較顯眼的預設樣式） |
| 連結 | 選單項目 3 |
| 簡訊 | 選單項目 4 |
| 複製 | 選單項目 5 |
| 取消 | 選單項目 6（最後一項） |

每項 `136x44`，純文字（16px），無 icon。截圖中滑鼠游標（`icons/cursor` instance）出現在原本 pill 位置與選單內，屬於 Figma 標註游標位置的裝飾用途，不用實作。

### 視覺驗證

截圖：`/private/tmp/claude-501/-Users-3qb-Code-Figma/7734e722-2714-41bb-b37a-528271ec33ec/scratchpad/order-processing-dropdown.png`（session scratchpad，非正式檔案）

其餘畫面內容（篩選面板、表格 6 列、footer）與讀取 2 完全相同，僅多了這個下拉選單 overlay，不重複記錄。

### 已確認（2026-07-03，Spec checkpoint）

下拉選單 6 個選項的行為：

| 選項 | 行為 | 備註 |
|---|---|---|
| 訂單 | 開啟「訂單明細」view-only modal（讀取 4） | 已見 UI |
| 修改 | 開啟「訂單修改」edit modal（讀取 5/6） | 已見 UI |
| 連結 | 產生「訂房連結」 | 後端功能，無專屬 UI，前端只要出選項；**條件式顯示**：訂單來源不是「網路訂房」就不會有這個子項目（見下方「已確認：modal 版型」） |
| 複製 | 複製這筆訂單資料，帶進「房間預訂」頁（把可用欄位資料帶過去，讓後續可以直接在房間預訂頁操作） | 後端功能 |
| 簡訊 | 開啟「簡訊」發送 modal（讀取 7） | 已見 UI |
| 取消 | 取消這筆訂單（**高強度操作**） | 後端功能。**UI 刻意沒有特殊強化樣式**（例如沒有紅字/警示色），跟其他選項視覺一致——公司核可此版本如此設計，不是遺漏，實作時不要自行加上警示樣式 |

### 待確認
2. 選單只在讀取 1 的「default」（未收合）版本測過嗎？還是只在 extend 態才有這個示範 frame？目前只看到 extend 態的點擊示範，尚未確認 default 態的選單樣式是否相同（合理假設相同，但未經 Figma 驗證）
3. 是否只有 row1（overdues 狀態）測試過此選單，其他狀態（official/unpaid/cancel/alternation）點擊 triangle 是否有不同選單內容（例如 cancel 狀態可能沒有「取消」選項），未確認

---

## 讀取 4：Content page - 訂單處理 desktop extend 0701-3 order button clicked

- **node id**: `2032:86483`
- **name**: `Content page - 訂單處理 desktop extend 0701-3 order button clicked`
- **type**: SECTION
- **bounds**: 1440 x 1801（比前幾個 frame 更高，因為疊了一個大 modal）
- **讀取日期**: 2026-07-03
- **結論**：延續讀取 3 的下拉選單，點擊「訂單」選項後開啟的 **`訂單明細` 訂單詳情 modal**（instance `Modal`, id `2032:79583`, `1019 x 1726`）。背景畫面（篩選面板+表格）內容不變，不重複記錄。這是全新內容，需要新建 component/modal spec。

### 視覺驗證

截圖（session scratchpad，非正式檔案）：
- 完整：`/private/tmp/claude-501/.../scratchpad/order-detail-modal.png`
- 上半：`order-detail-top.png`（header ~ 訂房明細）
- 下半：`order-detail-bottom.png`（加購明細 ~ footer）

### Modal 結構（`components/modal.md` 既有 modal 外框 pattern 待 cross-check，本次先記內容差異）

```
Modal (1019 x 1726)
├── Frame 12 (header + body, 1019x1668)
│   ├── header slot：Texts「訂單內容」(20px/600/#454545) + icons/close
│   └── content swap slot -> Frame 401 (995x1593, 內距 12)
│       ├── Frame 398：「訂單明細」大標題區
│       └── Frame 399：Table（基本資訊/訂房明細/加購明細/訂單總額） + Accordion 13（訂房與入住人資訊）
└── Frame 11（footer, 1019x58）：Button Y/N 取消 / 確定
```

### A. 標題列（Frame 398）

- 左：「訂單明細」24px/600/#454545
- 右：2 個 icon+text button（peach/`#fdebd7` 底）：`簡訊`（icons/message）、`列印`（icons/print）
- 下一行：`未付款` 紅色狀態 pill（`#e12129` 底、白字 16px）+ 灰字說明「此訂單尚未付款」12px + 右側「列印日期：2026-04-26 14：49」12px
- **疑點**：這個「未付款」大 pill 跟表格列的小 dot 狀態語意是否一致（此 modal 是從 row1「已過期/overdues」點開的，但這裡顯示「未付款」——需要確認 modal 狀態是否綁定該筆訂單真實狀態，還是 Figma 示範資料剛好不同步）

### B. 基本資訊卡片（Table > dymanic content）

灰底 header bar「基本資訊」20px，內容 2 欄 label:value grid，共 9 行：

| 左欄 label | 左欄值 | 右欄 label | 右欄值 |
|---|---|---|---|
| 訂單編號 | BBBXXXYYY12345 | 訂單狀態 | 未付款（紅字 `#e12129`） |
| 訂購日期 | 2031-01-31 14：25：25 | 繳款期限 | 2031-01-31 14：25：25 |
| 付款資料 | xyz 123 | 對帳單號 | BBBXXXYYY12345 |
| 訂單人員 | Money | 修改人員 | Punchi |
| 其他需求 | xyz 123 | 應付訂金 | $ 10,000（右對齊） |
| 處理備註 | xyz 123 | 已付訂金 | $ 10,000（右對齊） |
| — | — | 尚欠金額 | $ ???（右對齊，佔位文字，非真實資料） |

label 統一灰字 `#6d6d6d`，值統一 `#454545`（訂單狀態紅字例外）。

### C. 訂房明細表格

Header 灰底「訂房明細」20px。欄位：`# / 房型 / 專案 / 入住日期 / 間數 / 單價 / 小計`

- 房型欄：單行文字（範例「超複雜超優惠超划房型 111222 333」）
- 專案欄：2 行（專案名稱 16px + 專案介紹 12px 灰字）
- 入住日期欄：2 行日期，格式 `2026-04-24（四）\n2026-04-25（五）`（含星期）
- 2 筆範例資料列，數值都是佔位測試資料（111/999/888 重複）
- Table 底部「訂單總計」列，右對齊金額 `$ 888,011`

### D. 加購明細表格 + 訂單總額摘要（同一行，左右並排）

**左：加購明細（約 65% 寬）**
- Header「加購明細」，欄位 `# / 加購項目 / 備註 / 數量 / 單價 / 小計`
- 加購項目欄格式：`(777) 超耐用陽傘`（代號 + 名稱）
- 備註欄範例值：「讚」
- 底部「加購總計」列 `$ 888,011`

**右：訂單總額（約 32% 寬，peach `#fdebd7` 底卡片）**
- 標題「訂單總額」20px **藍字 `#005fcc`**（跟其他標題灰字不同，強調用色）
- `類型 / 小計` 2 欄，3 行：訂房明細 888 / 加購明細 888 / **訂單總計 $888,011**（合計列）

### E. 訂房與入住人資訊（Accordion 13，可收合）

- Header「訂房與入住人資訊」20px + icons/down（展開態）
- 內容：白卡包 2 個子區塊，各自灰底 header bar：
  - **訂房人**：`姓名 / ID / 電話 / 生日 / 性別 / 地址 / 手機`，2 欄 label:value grid（跟基本資訊同 pattern），本次讀取範例值全部是佔位字串 `XYZ`
  - **住房人**：欄位與訂房人完全相同（姓名/ID/電話/生日/性別/地址/手機），值也是 `XYZ`
  - `手機` 那一行右欄是空字串（label 和 value 都是空的 TEXT node）——可能是「手機」只佔左欄，右欄本來就沒有對應欄位（grid 補位用空節點），非缺漏

### F. Footer（Frame 11）

- `取消`（16px/#454545，`components/button-yn.md` state=no 淺色 variant）
- `確定`（16px/`#e1e1e0`，深底 `Color/Neutral/800`）

**修正（讀取 7 交叉比對後更新）**：原本這裡誤判 `#e1e1e0` 是 disabled 態。查證 `components/button-yn.md` + `tokens.md` 後確認 `#e1e1e0` = `Color/Text/100`（`text-text-inverse`），是深色按鈕上的**標準反白文字色**，不是變淺/disabled 的訊號。`確定` 按鈕在這個 modal（view-only 訂單明細）就是**正常 active 態**的深色按鈕，跟其他 modal 的 `確定` 按鈕視覺一致，沒有特殊 disabled 樣式。之前列的「疑點：確定是否恆為 disabled」已解除，不是問題。

### 待確認清單（本次新增）

1. Modal 頂部「未付款」大 pill 跟被點擊那列（row1, `overdues` 已過期黃點）狀態語意是否一致——目前看起來像獨立示範資料，不是聯動同一筆訂單真實狀態
2. `簡訊`/`列印` 按鈕實際行為（列印會印什麼格式？簡訊要發給誰？）未定義
3. `確定` 按鈕的 disabled 態觸發條件（唯讀 modal？必填未填？）
4. ~~這個 modal 是否所有訂單狀態都共用同一版型~~ -> **已確認（2026-07-03，Spec checkpoint）**：**所有訂單狀態共用同一個 modal 版型**，不會因狀態不同而有不同版面結構。但同一版型內**顯示的內容/子項目會依後端串接的實際資料而不同**（例如上面下拉選單的「連結」子項目，訂單來源不是網路訂房就不會出現）。前端只要把版型/畫面備齊，條件式顯示的細節邏輯留給後端。
5. Modal 外框（header/footer 高度、padding、圓角、陰影）是否沿用 `components/modal.md` 既有規格，需要 cross-check（本次先記內容差異，外框留到「讀完」批次處理時對照）
6. `尚欠金額 $ ???` 是 Figma 佔位文字還是真實會顯示的格式，需確認

---

## 讀取 5：Content page - 訂單處理 desktop extend 0701-4 edit button clicked（變體標籤：一般會員版）

- **node id**: `2032:86484`
- **name（含 Figma 文件標註）**: `Content page - 訂單處理 desktop extend 0701-4 edit button clicked - normal member`
- **production 標題**（modal 內 `Frame 706 > Texts`）：`訂單修改（一般會員版）` -> 括號依使用者指示視為文件標註，production 顯示應為單純「**訂單修改**」；「一般會員版」是本 frame 代表的**會員類型變體**標籤，非畫面文字
- **type**: SECTION
- **bounds**: 1440 x 2659（目前最高的 frame，modal 內容非常長）
- **讀取日期**: 2026-07-03
- **結論**：延續讀取 3 的下拉選單，點擊「修改」選項後開啟的 **`訂單修改` 大型編輯 modal**（instance `Modal`, id `2032:81567`, `1192 x 2474`）。**這個 modal 幾乎是把整個房間預訂頁（[A]-[E] 全部區塊）搬進 modal 裡、預填該筆訂單資料，供編輯用**，不是全新設計的表單。

### 視覺驗證

截圖（session scratchpad，非正式檔案）：`order-edit-modal.png`（完整 1192x2474）+ 5 段裁切 `order-edit-p1~p5.png`

### Modal 整體結構

```
Modal (1192 x 2474)
├── header slot：Texts「訂單修改」+ 還原(icon+text) button + icons/close   <- 比一般 modal 多一顆「還原」
└── content swap (1192x2350)
    ├── Accordion「庫存」                    = 沿用 [A] 空房與庫存查詢（月曆/庫存表 toggle、日期格、訂/餘/保 圖例）
    ├── "1140"（無 Title 用 instance 名當代稱）= 沿用 `specs/pages/room-booking.md` 既有「頂部資料列」+「訂房資料 Grid」（見下方 B 段修正）
    ├── Frame 452：左右並排
    │   ├── Order condition instance          = 沿用 [C] 訂單條件（components/order-condition.md），欄位完全一致
    │   └── Accordion「正式單與候補單」          = 沿用 [E]（**components/order-status.md** 同名 spec，注意檔名跟內容乍看不符，該檔實際內容就是 [E] 正式單與候補單），訂單類型 radio 無設定/正式單/候補單
    └── Frame 453：訂房資料                    = 沿用 [D] 訂房資料（components/order-data.md），欄位/tab/lock icon/orange 三件套全部一致，但多了「還原」按鈕（見下方 D 段）
└── footer：Button Y/N 取消（淺色） / 確定（深色 active，非 disabled）
```

**沿用區塊（[A]/[C]/[D]/[E]）本次不重複記錄欄位**，跟既有 spec 逐項比對後**視覺上一致**，差異只列在下方對應段落。

### A. Modal Header

- 標題「訂單修改」+ 右側「還原」button（icon + 文字，圓角 pill，白底灰框）+ close X
- **已確認（2026-07-03，Spec checkpoint）**：header 的「還原」跟 [D] 訂房資料內建的「還原」**範圍不同**——header 還原 = **整頁**資料還原（整個 modal 表單）；[D] 內建還原 = 只還原**訂房資料這個區塊**。兩者不是重複，是不同層級的還原操作。行為邏輯留給後端實作，這裡先把範圍差異寫進 spec 即可。

### B. "1140" 訂房明細 cart 表格（新內容，暫無對應 component/section spec）

- 頂部：`訂單編號：BXY00322212AZZ`（純文字顯示，非欄位）
- 一行 3 組控制：`團體名稱`（**checkbox + input**，checkbox 已勾選/藍）+ `業務` select；右側 `使用保留房`（checkbox 已勾選）/ `自加庫存`（checkbox 未勾選）——這兩個是互斥選項還是可複選未確認
- 表格欄位（8 欄）：`入住日 / 退房日（含"5 夜" duration badge, 橘字 #e05216）/ 房型（select + info icon）/ 專案（select）/ 間數（stepper -+，右上角有「團體：8」提示）/ 單價（input）/ 小計 / 原價`（原價欄位被截斷未完整讀到，含一個灰字數值 + input）
  - 最後應該還有「操作」欄（從 texts dump 讀到但 screenshot 被截斷未看到，第一次讀 texts 有 `'操作' | 1140 > Frame 589 > Frame 195 > Frame 153`）
- 3 筆範例列（值重複，明顯佔位資料）+ 統計列（總間數 15、原價加總、小計加總，右側疑似又有 input 可調整）
- 下方獨立一小段「加購」（`Title` component，20px/600），這次示範沒有展開內容（可能只是 section 入口，未點開）
- 再下方一行 3 欄：`預付 / 百分比`（input + %select）、`預付訂金`（input）、`總售價`（label「99999」灰小字 + input `1444`——疑似原價/總價對照）

**已確認（2026-07-03，Spec checkpoint）**：這整段「1140」就是 `specs/pages/room-booking.md` 裡已經記錄的「頂部資料列（Frame 367）」+「訂房資料 Grid（Frame 557）」（該檔 line 154-179 一帶），訂單處理的「訂單修改」modal 是**沿用房間預訂頁既有邏輯**，不是新內容。之後寫 spec 直接 cross-reference `room-booking.md` 對應段落即可，不需要另立新 spec 檔。

- `團體名稱` / `使用保留房` / `自加庫存` 三個 checkbox：**三個彼此獨立**，不是互斥也不是連動關係，各自獨立勾選/取消。跟 `room-booking.md` 記錄的邏輯一致（該檔只記錄了範例當下的 active/disabled 視覺狀態，不代表關聯規則）。

### C. Order condition + 正式單與候補單（並排）

- 左：`Order condition` instance，欄位 `人數(大/小) / 到店方式 / 發票 / 統編 / 抬頭 / 繳款期限` + 右欄 `訂單備註 / 需求備註` textarea —— 跟 `components/order-condition.md` 現有規格一致
- 右：`Accordion「正式單與候補單」`，`訂單類型` radio `無設定`(selected)/`正式單`/`候補單`，內容區顯示「未設定」置中文字 —— 跟 `components/order-status.md`（[E] 段規格所在檔，非 `order.md`）一致

### D. 訂房資料（沿用 [D]，含差異）

- Header 多一顆「還原」按鈕（`components/order-data.md` 原規格只有「清除」），位置在「清除」右邊
- Tab 顯示「入住」為 active（灰底），非「訂房」——跟 order-data.md 記錄的 default 「訂房 active」不同，但這只是**這個範例當下的互動狀態**，不代表 default 改變（如同讀取 1 的 emphasis 提醒：selected state != default state，不可誤判）
- 欄位（名稱/證號/行動電話 橘字、生日、性別、國籍、地址）與 order-data.md 完全一致，本次不重複記錄
- Lock icon 呈紅色（`icons/lock`），對應 inputs 呈灰底 disabled 態（`王大頭`、`X111333555` 等欄位灰底）—— 符合既有規則 [[feedback_lock_toggle_input_state]]
- **BR 象限（Email/傳真/會員備註）右側多出一組唯讀統計**：`訂房次數：XYZ`、`累積消費：XYZ`（純文字，右對齊，無 input 樣式）—— **這很可能就是使用者說的「會員版本差異欄位」**：一般會員版顯示這兩個統計欄位，其他會員類型（下一個 frame）可能顯示不同或沒有這組欄位

### E. Modal Footer

- `取消`（淺灰框，較不顯眼）/ `確定`（深底白字，active 態，非 disabled）—— 跟讀取 4 的「訂單明細」view-only modal 的 disabled `確定` 不同，這裡是可編輯表單所以 `確定` 是 active 的，合理

### 待確認清單（本次新增）

1. ~~Modal header「還原」按鈕跟 [D] 訂房資料內「還原」按鈕的範圍差異~~ -> **已確認**：header = 整頁還原，[D] 內建 = 只還原訂房資料區塊
2. ~~「1140」是否為未成檔的 [B] 訂房明細~~ -> **已確認**：就是 `specs/pages/room-booking.md` 既有記錄的「頂部資料列」+「訂房資料 Grid」，沿用該檔案內容，不新立 spec
3. ~~團體名稱/使用保留房/自加庫存 checkbox 邏輯關係~~ -> **已確認**：三個彼此獨立，非互斥非連動
4. 「訂房次數」「累積消費」欄位極可能是會員版本差異點（使用者已提示），需要跟下一個 frame（另一個會員版本）比對後才能確認完整規則
5. cart 表格「操作」欄內容（此次只在 texts dump 看到欄名，screenshot 沒截到實際按鈕/icon）
6. 「加購」小節在此 modal 內只有標題沒有展開內容，是否點擊可展開成完整加購清單，需確認

---

## 讀取 6：Content page - 訂單處理 desktop extend 0701-4 edit button clicked（變體標籤：合約會員版）

- **node id**: `2032:86485`
- **production 標題**：`訂單修改`（同讀取 5，括號「（合約會員版）」是變體標籤非畫面文字，依使用者指示處理）
- **type**: SECTION，bounds 1440 x 2659
- **讀取日期**: 2026-07-03
- **方法**：這次用 `diff` 直接比對讀取 5（一般會員版）跟本次（合約會員版）modal 內全部文字內容，而不是重新整份手動讀——兩者結構幾乎全同，diff 能精準揪出唯一差異點，效率遠高於逐節點重讀。

### Diff 結果：唯一差異在「1140」訂房明細 cart 表格頂部

**一般會員版**（讀取 5）：
```
訂單編號：BXY00322212AZZ
[團體名稱 checkbox+input] [業務 select]          [使用保留房 checkbox] [自加庫存 checkbox]
```

**合約會員版**（本次）：
```
訂單編號：BXY00322212AZZ
[22224332 input] [合約公司 select] [新的訂房人 select]      <- 新增一整列，合約會員專屬
[團體名稱 checkbox+input] [業務 select]          [使用保留房 checkbox] [自加庫存 checkbox]
```

新增列結構（Frame 590 內的 Frame 374，1128x74 整體高度比一般會員版多 38px）：
- Input：範例值 `22224332`（疑似合約編號/公司統編，8 位數字）
- Select：`合約公司`（placeholder 文字，實際應為公司名稱下拉選單）
- Select：`新的訂房人`（placeholder 文字，可能是「從合約公司底下選一位聯絡人/訂房人」的下拉）

這三個控制項橫向並排在同一行（跟訂單條件裡「input+select 合併群組」的既有 pattern 一致，但這裡看起來是三個獨立控制並排，非合併邊框，需要 screenshot 進一步驗證邊框是否相連）

### 確認事項（推翻讀取 5 的猜測）

**讀取 5 疑點 #4** 猜測「訂房次數/累積消費」欄位可能是會員版本差異——**diff 結果證實這個猜測是錯的**，這兩個欄位在兩個版本間完全相同、沒有差異。真正的會員版本差異只在「1140」cart 表格頂部這一整列（合約公司/新的訂房人/合約編號）。這是本次唯一的差異來源，其餘 [A]/[C]/[D]/[E]/footer/BR 統計欄位在兩版之間逐字元相同。

### 待確認清單（本次新增）

1. 「22224332」「合約公司」「新的訂房人」三個控制項是否為橫向合併邊框群組，還是各自獨立框——需要 screenshot 驗證（本次為求效率只做 diff，沒有另外截圖，若「讀完」後要寫正式 spec 需要補一張）
2. ~~這一整列是否只在「合約客戶」模式才顯示~~ -> **已確認（2026-07-03，Spec checkpoint）**：**不是**同一個 modal 內可切換的 toggle/mode。會員類型是在**訂單生成當下就決定**的：這筆訂單的客戶是「一般會員」，點下拉選單「修改」開出來的就是一般會員版；是「合約會員」，開出來的就是合約會員版。同一個 modal instance 沒有「切換」路徑。**實作範圍**：這階段 HTML 示意只做「一般會員版」；「合約會員版」的差異內容寫進對應 spec `.md`（附上完整 HTML/內容差異），讓之後接手的後端工程師看得到即可，不需要另外做一份可互動的合約會員版 HTML。
3. 「新的訂房人」select 的選項來源／行為（是否連動改變下方 [D] 訂房資料欄位內容）未知

---

## 讀取 7：Content page - 訂單處理 desktop extend 0701-5 message button clicked

- **node id**: `2032:88999`
- **production 標題**：`簡訊`
- **type**: SECTION，bounds 1440 x 1528
- **讀取日期**: 2026-07-03
- **結論**：延續讀取 3 的下拉選單，點擊「簡訊」選項後開啟的 **`簡訊` 發送 modal**（instance `Modal`, id `2032:88794`, `648 x 1161`，比訂單明細/訂單修改小很多，屬於中型 modal）。

### 視覺驗證

截圖：`/private/tmp/claude-501/.../scratchpad/sms-modal.png`（session scratchpad）

### 結構

```
Modal (648 x 1161)
├── header：Texts「簡訊」+ icons/close
└── content swap
    ├── 發送號碼：2 個 radio 互斥 —— 「已登錄號碼」select（範例 0999111222，目前選中）vs 「自行設定」+ input（未選中）
    ├── 訂單內容：14 個唯讀參考欄位（3欄 grid，最後2個獨立成2欄/1欄），全部是灰底 placeholder：
    │   訂單編號 / 飯店名稱 / 銀行 / 虛擬帳號 / 入住日 / 訂單總額 / 應付訂金 / 已付金額 / 訂房人 / 入住人 / 訂房人生日 / 繳款期限 / 取消日期 / 入住夜數
    ├── 發送內容：
    │   ├── 樣本（select，範例 "sample"）+ 右側統計卡「字數統計 25 | 簡訊通數 1」
    │   └── 大 textarea（訊息內容，placeholder）
    ├── 歷史紀錄：白卡表格，欄位 # / 登錄類別 / 登錄日期 / 登錄號碼 / 登錄內容，2 筆範例列
    └── footer：取消 / 確定（皆 active 態，見上方讀取4修正說明）
```

### 已確認（2026-07-03，Spec checkpoint）

「訂單內容」14 個欄位是**可寫入的 input**（前台人員可自行填寫），跟下方「發送內容」textarea **互相獨立、不連動**（點擊或修改上面欄位不會插入/改變下面 textarea 內容）。textarea 是給前台人員套用簡訊模版（`樣本` select）或自行輸入文字用的獨立輸入區。

### 疑點

1. 「樣本」select 的選項來源（預設簡訊範本清單？）未知
2. 「發送號碼」的「已登錄號碼」select 選項來源（該訂單訂房人/入住人底下登錄過的電話清單？）未知
3. 字數統計/簡訊通數是否即時運算（隨 textarea 輸入內容變動），還是固定示範值，合理假設是即時運算但未驗證

---

# 第二批：mobile ~ tablet

desktop 批次讀取 1-7 到此結束，接下來是 mobile ~ tablet 版面。設計寬度 768px（跟 start.md 的 375px mobile 參考稿不同，這批 Figma 是 tablet 寬度示範，實作仍要走 fluid width，不寫死 768）。

## 讀取 8：Content page - 訂單處理 mobile ~ tablet 0701-1 more condintions not collapsed

- **node id**: `2032:86477`
- **name**: `Content page - 訂單處理 mobile ~ tablet 0701-1 more condintions not collapsed`（"condintions" 是 Figma 命名 typo，等同 "conditions"）
- **type**: SECTION，bounds 768 x 1585
- **讀取日期**: 2026-07-03

### 視覺驗證

截圖：`/private/tmp/claude-501/.../scratchpad/mobile-tablet-1.png`（848x1665，含些許 canvas 邊界）

### 跟 desktop 的結構差異

| 區塊 | desktop | mobile/tablet（本次） |
|---|---|---|
| 頂部工具列 | logo/帳號/登出/切換 + 搜尋 chip x2（訂單處理/xxoo）+ function icons x4（bulletin/message/person/system） | **只剩 logo + 側欄收合 icon**，搜尋 chip 與 function icons 整排都不見了 |
| 篩選面板 | 3 欄並排（`shirnk-model-1` / `extend-...`） | **單欄垂直堆疊**（容器改名 `extend-model-1`），日期區間 + 4 個快速區間鍵 + 日期狀態/訂單編號/名稱/行動電話 4 行，其餘全部（訂金/處理狀態/預付方式/客戶類別/團散類別/訂單來源/使用人/房型/國籍/專案/條件查詢）收進一個「更多條件」accordion |
| Tabs + 快篩 button | 同一行左右並排 | 各自獨立一行（tabs 一行、5 個快篩 button 另起一行，橫向 scroll 容器） |
| 表格 | `Table desktop` 1109 寬 | **JSON bounds 仍是 1109x856 沒有跟著縮**，screenshot 確認表格內容在 768 寬容器裡被截斷（畫面右緣只看到 入住/退房日 欄，間數/訂單內容/入住人 欄被裁掉），推測是水平 scroll，但本次沒有滑動驗證，需要之後截圖或用 devtools 實測確認確實可以橫向捲動而非單純溢出裁切 |

### 「更多條件」accordion 狀態疑點（需使用者澄清，不猜）

- Figma node：`icons/up`（`2026:68588`），accordion 只有 header（67 高），**沒有可見的展開內容**（訂金/處理狀態等欄位都不在這個 frame 裡）
- 依專案既有規則 [[feedback_figma_stroke_can_be_single_side]] 同類的「收折圖示」慣例（`components/accordion.md`：收起用 up、展開用 down），`icons/up` 代表**收起**狀態
- 但 **frame 名稱寫「more condintions **not** collapsed」**，字面意思應該是「更多條件沒有被收起（展開）」——跟畫面呈現的「收起」矛盾
- **不猜測哪個對**，先如實記錄矛盾，等使用者確認：（a）frame 命名寫反了、（b）「collapsed」指別的東西（例如整個篩選面板 vs 更多條件 accordion 本身）、還是（c）我對 icons/up=收起 的既有慣例套用錯誤場景

### 待確認清單（本次新增）

1. ~~頂部工具列搜尋 chip + function icons 在 mobile/tablet 是否為刻意隱藏~~ -> **已確認（2026-07-03）**：不是隱藏也不是移除，這兩組元素**本來就不屬於這個斷點的設計**，進入 mobile ~ tablet 斷點時本來就不會出現。之前用「不見」這種措辭是因為這頁其他區塊在 mobile/tablet 都是 reflow（收進 accordion、拆行、橫向 scroll）而非整組消失，這兩組打破了那個規律，才被列為疑點；並非真的預期它們該存在
2. 表格橫向捲動需要之後截圖/devtools 實測驗證（目前只能從 screenshot 裁切現象推測）
3. ~~「更多條件」accordion 收合狀態跟 frame 標題矛盾~~ -> **已由讀取 9 解開，見下方**
4. 「今日/本週/本月/今年」4 個快速區間鍵在 mobile 是 2x2 grid（跟 desktop 一致），未看到窄寬度是否需要改 1 欄

---

## 讀取 9：Content page - 訂單處理 mobile ~ tablet 0701-2 more conditions collapsed

- **node id**: `2032:86478`
- **name**: `Content page - 訂單處理 mobile ~ tablet 0701-2 more conditions collapsed`
- **type**: SECTION，bounds 768 x 2289
- **讀取日期**: 2026-07-03

### 結論：解開讀取 8 的命名矛盾 —— 兩個 frame 的標題跟實際內容是反的

- 這個 frame（標題寫「collapsed」）的 Accordion 實際是 **展開態**：`icons/down`、`flexible content` 771 高、完整 11 個欄位都在
- 讀取 8 那個 frame（標題寫「not collapsed」）的 Accordion 實際是 **收起態**：`icons/up`、只有 67 高的 header，沒有內容
- **結論**：兩個 frame 的命名跟實際畫面剛好對調/寫反了，不是我誤套用 [[feedback_figma_stroke_can_be_single_side]] 同類慣例（`icons/up`=收起／`icons/down`=展開 這條 accordion 慣例本身在兩個 frame 內部都自洽，只是 frame 標題本身標記反了）。之後寫 spec 一律以「畫面實際 icon + 內容」為準，不採用 frame 標題字面意思。

### 視覺驗證

截圖：`/private/tmp/claude-501/.../scratchpad/mobile-tablet-2.png` + 裁切 `mobile-2-top.png`

### 「更多條件」展開內容（11 欄位，跟 desktop 欄2+欄3 完全對應，摺進單欄 accordion）

`訂金`（toggle）/ `處理狀態`（select 全部）/ `預付方式`（select 全部）/ `客戶類別`（select 全部）/ `團散類別`（select 全部）/ `訂單來源`（select 全部）/ `使用人`（select 訂房人）/ `房型`（select 全部）/ `國籍`（radio 臺灣選中/外籍）/ `專案`（toggle + input/select 合併群組）/ `條件查詢`（input/select 合併群組）

### 新解開的疑點（來自 desktop 讀取 2）

**desktop 讀取 2 疑點 #5**（`專案` 區塊 `所有專案` 灰字用途）：本次截圖看到 `專案` toggle 呈 **開啟態（綠色）** 時，旁邊小字變成 **「僅有效專案」**（desktop 讀取 2 看到的是關閉態，小字是「所有專案」）。**確認這組小字是 toggle 的狀態標籤**：關閉 = 顯示「所有專案」、開啟 = 顯示「僅有效專案」（篩選是否只列有效中的專案）。同理 `訂金` toggle 這次也拍到開啟態（綠色），desktop 讀取 1/2 看到的都是關閉態（灰色）——單純示範不同 toggle 狀態，非欄位定義差異。

Toggle 開啟態顏色跟既有 `member-data-modal.md` 記錄的 iOS-style toggle on 色一致（綠色），沿用既有 `.member-data-switch` pattern 不需要新 token。

### 待確認清單（本次新增）

1. `訂金` toggle 開啟後是否會展開額外欄位（目前只看到 toggle 本身變綠，沒有看到下方出現新欄位，但也可能是這次示範沒有觸發），需要之後確認開啟後有沒有連動內容
2. `專案` toggle 開啟後除了小字變化，input/select 合併群組是否也連動變化（例如 select 選項變成只列有效專案），未確認

---

## 讀取 10：Content page - 訂單處理 mobile ~ tablet 0701-3 button clicked

- **node id**: `2032:86479`
- **name**: `Content page - 訂單處理 mobile ~ tablet 0701-3 button clicked`
- **type**: SECTION，bounds 768 x 2289
- **讀取日期**: 2026-07-03
- **結論**：desktop 讀取 3 的「訂單編號 pill 下拉選單」對應到 mobile/tablet，**元件從 inline dropdown 換成 `Offcanvas`（底部 slide-in 面板）**，instance id `2032:73340`，`744 x 330`。

### 內容（跟 desktop 完全一致，只是容器換成 offcanvas）

- Header：「選單」+ `icons/close`
- 6 個選項（各 44px 高，橫跨全寬 720）：`訂單` / `修改` / `連結` / `簡訊` / `複製` / `取消`

### 驗證方式

本次**沒有另外截圖**：`get_screenshot` 這次回傳直接內嵌在工具結果（沒有寫入暫存檔案），base64 長度太大不適合手動轉錄，貿然轉錄有資料損毀風險。改採**結構驗證**：instance 名稱就是既有元件 `Offcanvas`（跟 `庫存表` 月曆選日期用的 offcanvas、`components/offcanvas.md` 是同一元件），文字內容跟 desktop 版逐字相同，可信度足夠。若之後要寫正式 spec，再另外對這個 instance 補一次獨立 screenshot 驗證圓角/陰影/dismiss 行為等視覺細節。

### 待確認清單（本次新增）

1. Offcanvas 的 dismiss 行為（依 `components/offcanvas.md` 記錄的既有 pattern 是 2 條路徑，需確認這裡是否沿用同一套規則，未來寫 spec 時 cross-check）
2. 6 個選項在 offcanvas 版是否跟 desktop 一樣有 hover 態（mobile 觸控沒有 hover，需確認改成什麼視覺回饋，例如 active/pressed 態）

---

## 讀取 11：Content page - 訂單處理 mobile ~ tablet 0701-3 info button clicked

- **node id**: `2032:86480`
- **name**: `Content page - 訂單處理 mobile ~ tablet 0701-3 info button clicked`
- **type**: SECTION，bounds 768 x 2289
- **讀取日期**: 2026-07-03
- **適用範圍**：跨 desktop / mobile / tablet 全尺寸（依使用者指示，見上方批次進度區塊註記），本節記錄的 tooltip 內容同時回填讀取 1（訂單編號 (i)）與讀取 2（日期狀態 (i)）的疑點。

兩個 `Tooltips` instance 同時出現在這個 frame：

### A. 訂單狀態圖例 tooltip（id `2032:74034`, 220x333）

深灰底（`#4f4f4f` 左右，跟訂單編號 pill 背景同色系）、金黃色標題（`#f7d275`）、白字內容、左側有小箭頭（`Polygon 1`）指向觸發它的 `(i)` icon —— 對應**讀取 1 表格 `訂單編號` 欄標題旁的 `icons/info`**。

內容是狀態 dot 圖例（顏色 + 中文標籤），**5 項與 5 個色點逐一對應**：

| dot 顏色 | tooltip 標籤 | 對照：desktop 表格資料列 layer 命名 | 對照：desktop 篩選 tabs 用語 |
|---|---|---|---|
| 綠 `#2aca18` | 正式單 | `official` | 正式單（一致） |
| 黃 `#ffcc00` | 逾期單 | `overdues` | 已過期（**用詞不同**） |
| 藍 `#86b7fe` | 替代單 | `alternation` | 候補單（**用詞不同**） |
| 灰 `#b0b0b0` | 未付單 | `unpaid` | 未付款（**用詞不同**） |
| 紅 `#e12129` | 取消單 | `cancel` | 取消單（一致） |

**發現**：tooltip 圖例用語跟篩選 tabs 用語有 3 處不完全一致（逾期單/已過期、替代單/候補單、未付單/未付款）。

**已確認（2026-07-03，使用者 Spec checkpoint 討論）**：兩組用語是**不同情境下顯示的內容，差異是允許的**，不需要統一成同一套字。tooltip 圖例維持圖例用語、篩選 tabs 維持 tabs 用語，實作時**各自照字面顯示**，不要互相替換或合併。

### B. 日期狀態說明 tooltip（id `2032:86410`, 745x397）

同樣深灰底 + 金黃標題，對應**讀取 2「日期狀態」select 旁的 `icons/info`**。

- 標題：`不論 不論 不論 …，皆以總價`（**確認是 Figma 佔位文字**，不是真實文案，逐字重複無意義，`characters` 原始資料本身就是這串佔位字，不是我讀取工具截斷）
- 內容列出 **9 個 chip 標籤 + 各自一行說明**，說明文字全部是佔位重複字串 `以訂單…`（部分重複到 8 次），同樣確認是佔位文字，非真實文案：
  `訂單日` / `入住日` / `入住日（全）` / `到達日` / `退房日` / `取消日` / `付款日` / `到期日` / `最後修改日`

**價值**：雖然說明文字是佔位，但這 9 個 chip 標籤本身很可能就是「日期狀態」select 的**完整選項清單**（讀取 1/2 只看到 default 值「訂單日」，這裡補齊全部 9 個選項）。記為未確認但高可信度的推測，等使用者確認。

### 視覺驗證

截圖：`/private/tmp/claude-501/.../scratchpad/tooltip-0.png`（訂單狀態圖例）、`tooltip-1.png`（日期狀態說明）

### 待確認清單（本次新增）

1. tooltip 圖例用語（逾期單/替代單/未付單）跟 tabs 用語（已過期/候補單/未付款）是否同義，需使用者確認
2. 「日期狀態」select 的 9 個選項是否就是這個 tooltip 列出的 9 個 chip 標籤，需使用者確認
3. 兩個 tooltip 的真實說明文案都還沒寫（全部佔位字），之後補正式文案時要回來更新
4. ~~tooltip 觸發方式與 dismiss 方式~~ -> **已確認（2026-07-03，Spec checkpoint）**：考量手機版沒有 hover，兩個 tooltip **一律用 click 觸發**（不做 hover 版本），點擊 `(i)` icon 展開，**點擊 tooltip 以外的範圍收起**（click-outside dismiss）。

---

# 補充讀取：Component 本體 cross-check

使用者表示所有頁面 frame 讀完後，開始補充 component_set 本體讓我對照 instance 是否讀對。

## 讀取 12：`Offcanvas` COMPONENT_SET（id `1774:50139`）

- **type**: COMPONENT_SET，2 個 variant：
  - `type=Default`（`1774:50138`，1437x497）：內含 `Calendar` instance —— 這是**庫存表月曆選日期**用的 offcanvas 版本（跟本頁訂單處理無直接關係，是同一元件的另一個使用情境）
  - `type=bottom sheet`（`1907:70674`，744x330）：內含「選單」6 項——**這就是讀取 10 mobile 版訂單編號 pill 下拉選單使用的那個 variant**，id 完全對應（讀取 10 的 instance 是這個 component 的 instance）

### 確認事項

- 讀取 10 的結構推測（instance 名稱 `Offcanvas`、6 項文字內容）**經 component 本體核對無誤**

### 修正讀取 3 的一個判斷

對照 component 本體 `type=bottom sheet` 內部樣式，`修改` 那一項 fill 是 `#fad4ae`（其餘 5 項都是 `#ffffff`），**這個淺橘底是寫死在 component 上的固定樣式**，不是狀態互動（hover/focus）造成的。讀取 3（desktop 版下拉選單截圖）看到「修改」呈現橘色淺底，**原本誤判為 hover 態**，現在確認那其實是這個選單「修改」項目的**預設固定樣式**（可能是想讓最常用/建議的操作視覺上更突出）。已更新讀取 3 的記錄。

---

## 尚未讀取 / 待確認清單（累積中，供「讀完」後統一處理）

**已由讀取 2 截圖解決（見上方對照表）**：#3（日期區間）、#4（訂金是toggle）、#5（專案提示文字）、#7（tab 單邊底線）、#8（pill 深灰底色）— 細節見「讀取 2」章節對照表，不重複列。

**仍待確認 / 待處理**：

1. `menu`（sidebar instance）與 `floatIcons/ai` 本次未展開讀取內部細節，假設沿用既有全站元件（跟其他頁行為一致），若使用者確認有差異需另外讀
2. Function icons 是否與 `components/function-icons.md` 完全一致，需 cross-check
3. `shirnk-model-1` 側欄收合/展開 toggle 已確認 trigger 在頂部工具列左側（icon），但該 icon 語意/圖檔名稱未確認，需對照 `specs/icons.md`
4. ~~次要 badge 分類歸屬~~ -> **已確認（2026-07-03）**：不需要現在釐清每個 badge 對應篩選面板哪個欄位分類。前端這階段**照 Figma UI layout 直出 HTML**、視覺示意給足即可，badge 跟資料欄位的對應邏輯留給後端渲染時處理。
5. ~~`Booking`/`Agoda` 來源 badge 只出現在部分列~~ -> **已確認（2026-07-03）**：這個弧形邊框 badge 代表訂單的「來源」（訂單來自 Booking / Agoda 等 OTA 通路才會顯示），沒有對應來源的訂單就不顯示這個 badge——是條件式渲染（有值才出，沒值不出），不是狀態相關的固定規則。使用者只在 UI 示意裡列了前 3 個範例，不代表只有 3 種可能來源。前端只要支援「badge 可有可無」的 conditional render，來源判斷邏輯留給後端。
6. ~~5-1/5-2 拆列的業務語意~~ -> **已確認**：帶連字號編號（n-1/n-2）代表該筆訂單有子訂單，各子訂單各佔一子列；純數字編號代表無子訂單的獨立列。見讀取 1 表格段落。
7. ~~Tabs 對應的資料篩選邏輯~~ -> **已確認**：tabs 確實對應狀態 dot 篩選（例如「正式單」tab = 只顯示 validated 狀態列），但**篩選邏輯本身是後端處理範圍**。前端這階段只需要把版塊切出來、每種狀態的視覺示意都做齊全（例如表格至少涵蓋 5 種狀態的範例列），不需要實作真正的篩選功能。
8. `訂購人`/`入住人` 姓名顯示為藍色連結樣式，點擊互動行為未知（可能開會員資料 modal），需確認
9. 表格區寬度在側欄收合時「不跟著變寬」是否為刻意設計（目前判斷是刻意留白給客服 icon），需使用者確認非 Figma 標註疏漏

---

## 與既有 spec 的關係（2026-07-03 Spec checkpoint 後更新，含檔名澄清）

**檔名容易混淆，注意區分**：
- `components/order.md`：內容其實是首頁「訂單快覽」小工具的 `Order` 列元件（badge + label），跟本頁**無關**
- `components/order-status.md`：檔名雖然像「訂單狀態」，但內容其實是「房間預訂」頁 **[E] 正式單與候補單** 區塊規格——**這個檔跟本頁有關**，`訂單修改` modal 裡的「正式單與候補單」accordion 就是沿用這份

**訂單修改 modal 大量沿用「房間預訂」頁既有 spec**（見 `components/order-edit-modal.md`）：
- `specs/pages/room-booking.md`：[A] 庫存查詢、「1140」cart 表格（頂部資料列 + 訂房資料 Grid）
- `components/order-condition.md`：[C] 訂單條件
- `components/order-status.md`：[E] 正式單與候補單
- `components/order-data.md`：[D] 訂房資料

**訂單明細 / 簡訊 modal 直接沿用既有實作**（見 `components/modal.md` 的 `state=order summary` 與 `state=sms / order summary` 段）：這兩個不是新 modal，是既有 `modalOrderSummaryBackdrop` / `modalSmsBackdrop` 多一個開啟入口（見讀取 4 / 7）

**本頁真正全新的部分**（目前在 `start.md` 檔案地圖與既有 components/sections 都沒有對應項目）：
- `components/order-status-pill.md`（新建）：表格「訂單編號」欄狀態 pill + 下拉選單元件
- `components/order-edit-modal.md`（新建）：「訂單修改」modal 外殼 + 會員版本差異
- `specs/pages/order-processing.md`（新建）：頁面主規格（篩選面板、tabs、表格、footer、tooltip、RWD）
