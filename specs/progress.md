# Progress - 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。
> 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
> （歷史決策可能已被推翻，一律以本檔最新 session 為準）。
> 本檔超過 ~25 個 session 時，將最舊的 10 個搬進 archive。

---

## Session 152：房型 modal 新增加人 Select (2026-08-27)

使用者確認 `room-type.html` 的資料新增、資料修改、資料查看 modal 只新增一個
「加人」Select，其餘既有欄位、房間數互動與 modal 行為全部維持。

### Figma current source

- 新增／修改 section：`2308:85675`；modal instance `2308:85163`
- 僅查看 section：`2308:85677`；modal instance `2308:85438`

### 使用者拍板

1. 新增與修改提供 `不可加人 / 1 / 2` 三個可選 option，預設為 `不可加人`。
2. 查看固定顯示 `2`，Select 必須 disabled。
3. 欄位位於「網路訂購」下方、文案卡上方；desktop 橫跨兩欄，mobile 滿寬。
4. 三個 modal 的其餘設定完全沿用既有規格。

### 本輪改動

1. `components/modal.md` 登錄 0827 Figma nodes、欄位位置、options 與狀態規則。
2. `preview/partials/room-type-modals.html` 在新增／修改／查看三個 modal 加入
   對應 Select，並使用 `data-room-extra-people` 作為穩定 contract hook。
3. `scripts/smoke-test.mjs` 新增三個 modal 的 options、可操作性、disabled 與
   固定值 regression check。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0（8 pages, 3 standalone）
- `./scripts/lint-tokens.sh` exit 0（92 raw hex tokens）
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，`room-type.html`
  16 checks 通過

## Session 151：房間預定 modal 新增加人資訊 (2026-08-27)

使用者確認只更新房間預定 table 第一個 `edit.svg` 所使用的共用
`modalRoomEditBackdrop`。既有 lock、clear、textarea 與 modal 開關行為維持，
本輪新增加人資訊與價格表展示欄位。

### Figma current source

- Icons frame: `25:93` `Icons`
- Icon batch: `2178:124636` `icons/projects` 20x20、
  `2303:85281` `icons/adding-people` 20x20、
  `2303:85275` `icons/adding-bed` 24x24
- Modal: `2308:84584` `Modal（0827 新增 可加人）` 800x740

### 使用者拍板

1. 房型摘要新增 `adding-people` icon、`可加人`、`總人數限制 5` 雙行 chip。
2. 價格 table 新增 `多加成人 / +1,000` 與 `多加孩童 / +800` 兩欄，
   每個日期 row 各有一組 stepper。
3. Modal stepper 只實作設計稿外觀；不加前端運算、min / max、總人數限制、
   lock 或 clear 行為。實際資料與操作由後端處理。
4. 新 stepper 視覺沿用外層 table「間數」的 `.stepper`，但不掛
   `.rb-step-*` 行為 hooks。
5. 0527 已移除的 date controller / 訂房間數 stepper 不恢復。
6. Icons selection 視為整批交付：三顆都必須寫入 `specs/icons.md`、由原 Figma
   node 匯出成正式資產，再由 modal 取用；不可只為當前畫面臨時補單顆 SVG。

### 本輪改動

1. `components/modal.md` 更新 0827 current contract。
2. `specs/icons.md` 完整登錄本批 `projects`、`adding-people`、`adding-bed` 的
   Figma node、尺寸、正式檔案與取用狀態；三顆均重新由原 node 匯出，僅將
   中性色正規化為 `currentColor`。本 modal 取用正式的 `adding-people.svg`，
   `adding-bed.svg` 同批入庫但不在本 modal 額外使用。
3. `preview/partials/room-booking-modals.html` 新增 summary chip、兩個價格欄位、
   四組純展示 stepper 與 footer totals。
4. `preview/assets/css/modals.css` 將 desktop modal 寬度改為 800px，價格表固定
   768px 並在窄 viewport 於 modal 內水平捲動。
5. `scripts/smoke-test.mjs` 新增 0827 contract regression checks。

### 驗證

- `xmllint --noout`：`projects.svg`、`adding-people.svg`、`adding-bed.svg`
  三顆正式資產皆通過，且無中性 `fill="black"` / `stroke="black"` 殘留
- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`92 raw hex tokens`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `room-booking.html` 12 checks 通過
- Chrome contract checks：desktop modal 800px、價格 table 768px；mobile modal
  375px，table 只在 modal wrapper 內水平捲動，無 page-level overflow

## Session 150：新對話直接同步 GitHub 規則 (2026-08-26)

使用者要求新對話啟動時若 remote commit 領先本地，agent 必須直接同步，
不可只做版本比對後停止；若同步產生 conflict，保留現場由使用者處理。

### 本輪改動

1. `start.md`：
   - 本地無 repo 時使用 `git clone`；已有 repo 時使用 `git pull`。
   - remote 領先時立即同步，不因未提交改動而預先跳過。
   - branch diverged 時採一般 merge-based pull。
   - Git 實際產生 conflict 或拒絕覆蓋時保留工作樹並回報，不自行 stash、
     discard、解 conflict、rebase 或 force。
2. 回溯 audit：原流程在本地 `start.md` 有未提交修改時只比對、不 pull，正是
   本次修正的違規情境；新規則套用後已直接同步。
3. 機器可判定性：此規則依賴 GitHub 連線、remote branch 與工作樹狀態，不能由
   pre-commit lint 完整判定，保留在新對話啟動流程執行。

### 驗證

- `git fetch origin` exit 0。
- 本地原為 `d4ab2f0`，`origin/main` 為 `1932684`，remote 領先 1 commit。
- `git pull --no-rebase origin main` exit 0，以 fast-forward 同步到 `1932684`。
- 本地未提交的 `start.md` 規則修改仍保留，未產生 conflict。
- `git diff --check` exit 0。
- `./scripts/lint-conventions.sh` exit 0。

## Session 149：加購商品 0818 批次更新 (2026-08-25)

使用者批次提供 0818 Figma frame，並確認本輪以 deployed 動態資料行為為
基線：移除商品類型分流 tabs 與限定 / 非限定 / 住宿加購 icons，新增產品
table 多語系狀態，調整專案按鈕填色，並更新產品 / 類別 data modal。

### Figma current source

- Page: `2275:84175`「加購商品 desktop 0818」1440x1718
- Product table: `2275:84177`「Limitation Table」1171x458
- Product edit modal: `2245:84443`「Modal（產品設定 - 修改 - 上架開啟）0818」800x788
- Category new modal: `2245:84164`「Modal（類別新增設定）0818」800x564
- Category edit modal: `2245:84205`「Modal（類別修改設定）0818」800x564

### 使用者拍板

1. Desktop 外層維持 shared shell 12px page padding 與 12px sidebar gap，不採
   Figma frame 外層 20px。
2. 啟用 / 停用 counts、14 / 5 rows、全部顯示 / 分頁與狀態移動維持 deployed
   動態資料行為，不把 Figma sample count 寫死。
3. 產品設定與類別設定的「所有商品 / 住宿加購 / 其他商品」tabs 全部移除。
4. 限定、非限定、住宿加購圖例與 row icons 全部移除。
5. Category 管理欄「複製」保留。
6. Product / Category data modal desktop shell 採 800px。

### 本輪改動

1. `specs/pages/purchase-addon.md`：
   - 更新 current Figma nodes、使用者拍板、table 欄位與 modal contract。
   - 修正舊 99 / 8 靜態狀態描述，改回 deployed 14 / 5 動態 state。
2. `preview/purchase-addon.html` / `preview/assets/css/purchase-addon.css`：
   - 移除兩區 type tabs、圖例與 row icons。
   - Product table 新增「多語系」欄，table shell 使用 Figma 12px / 16px
     padding 與固定欄寬；Category 保留複製按鈕。
   - limited project button 使用 `Color/Accent/light-green`；all-project button
     維持白底。
   - Product / Category data modal desktop 寬度改為 800px；control、文案卡、
     編輯按鈕與日期 panel 尺寸依 0818 Figma 調整。
3. `preview/js/purchase-addon.js`：
   - 多語系 badge 使用 row state 與 delegated click；各語系可獨立切換，
     支援同 row 多選。
   - Product / Category 共用 modal shell，依 kind 切換專屬 body 與 title。
   - 上架 panel 移除時段 toggle、起迄 hour 與時間提示，只保留全日日期範圍。
4. `preview/partials/purchase-addon-modals.html`：
   - Product 上架 panel 只保留日期。
   - 新增 Category 專屬新增 / 修改 body：排序、disabled 型態、品名、品名文案、
     備註文案；不顯示住宿加購 toggle。
5. `scripts/smoke-test.mjs`：
   - 補測 tabs / legends / row icons 不存在、多語系 multi-select、限定專案填色、
     Category 複製、800px modal、378px 日期 panel、日期不截字、Category body
     與移除的時間 / 住宿加購 controls。
6. 驗收 follow-up：產品 quick filters 文案由「全部 / 線上隨單加購 / 僅後台加購」
   改為「全部 / 網路可訂 / 只限現場」，單選互動不變，smoke test 鎖定新文案。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- Product fallback rows 每列 10 cells；Category fallback rows 每列 8 cells
- 視覺 QA 截圖輸出到 ignored 目錄 `specs/qa-screenshots/session-149/`：
  - `purchase-addon-desktop-1440.png`
  - `purchase-addon-tablet-767.png`
  - `purchase-addon-mobile-375.png`
  - `purchase-addon-product-edit-publish-1440.png`
  - `purchase-addon-category-new-1440.png`
  - `purchase-addon-category-edit-1440.png`
  - `purchase-addon-category-new-mobile-375.png`

## Session 148：加購商品停用專案按鈕與 readonly modal (2026-08-11)

使用者澄清產品設定 table 的「專案」按鈕顯示條件只跟產品是否有
`限定` / `非限定` 標籤有關，與啟用 / 停用狀態無關；停用 row 也要可開啟
project modal，但 modal 內容需 locked / disabled 不可操作。

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - 停用 demo 產品補上 project state：
     - `product-15` `舊版餐券` -> `limited`
     - `product-19` `舊版折抵` -> `nonLimited`
   - `renderActionButtons()` 停用 row 分支也依 `hasProjectState(row)` 顯示
     「專案」按鈕，並開啟 `modalPurchaseAddonProjectBackdrop`
   - project modal state 新增 `readonly`
   - 停用 row 開啟 project modal 時：
     - `專案分類` / `類別條件` disabled
     - `全選` / `取消全選` disabled
     - project chips disabled
     - footer 只顯示一個「關閉」按鈕，`儲存` 隱藏
     - click / change handler 對 readonly state 直接 return，不改 selection state
2. `preview/partials/purchase-addon-modals.html`：
   - project modal 儲存按鈕補 `data-pa-project-save`
3. `preview/assets/css/purchase-addon.css`：
   - project modal readonly controls 加 disabled cursor / opacity
4. `specs/pages/purchase-addon.md`：
   - 補記「專案」按鈕顯示與啟用 / 停用無關
   - 補記停用 row 開啟 project modal 後內容 disabled
5. `scripts/smoke-test.mjs`：
   - regression 補測停用 tab：
     - limited deleted row 有「專案」按鈕
     - 無 project state 的 deleted row 沒有「專案」按鈕
     - deleted project modal 可開啟並帶入產品代號 / 品名
     - select / list actions / chips 都 disabled
     - footer 顯示「關閉」且 `儲存` 隱藏
     - readonly chips click 不改 selected state

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-148/`
  - `purchase-addon-deleted-project-button-1440.png`
  - `purchase-addon-deleted-project-readonly-modal-1080.png`（已更新為 footer 只顯示
    `關閉`）

## Session 147：加購商品類別設定 home icon 欄位歸屬修正 (2026-08-11)

使用者要求依 Figma `類別設定` frame 修正 category table：住宿加購的
`icons/home` 應跟在 `型態` 欄 `商品` 後方，而不是接在 `品名` 後方。此 table
共用於分頁 1 / 2 / 3 與停用狀態，因此改 render 來源即可覆蓋多個狀態。

### Figma 讀取

- Current page: `components`
- Selection count: 1
- Frame: `2183:129503` `Accordion 11`
- Title: `類別設定`
- Table columns: `順序` / `代號` / `館別` / `品名` / `型態` / `設定數量` /
  `排序` / `管理`
- Contract:
  - `品名` 欄只放品名文字，例如 `餐飲服務`
  - `型態` 欄放 `商品`，住宿加購 row 的 `icons/home` 跟在此欄後方
  - 與產品設定 table 對齊：產品的住宿 icon 跟在 `類別` 欄，不接在商品名稱後方

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - category row 的 `品名` 欄改為只 render `row.name`
   - 新增 / 改用 `renderCategoryType(row)`，住宿加購 row 在 `型態` 欄渲染
     `row.type + icons/home`
2. `preview/purchase-addon.html`：
   - 同步靜態 fallback markup，避免 category table 初始 HTML 仍把 home icon
     放在 `品名` 欄
3. `specs/pages/purchase-addon.md`：
   - Category Table spec 改為 `品名` 無 icon、`型態` 欄接住宿加購 home icon
4. `scripts/smoke-test.mjs`：
   - regression 補測第一筆 category row：`品名` 欄不得有 `home.svg`，
     `型態` 欄必須有 `home.svg`

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-147/`
  - `purchase-addon-category-home-type-1440.png`

## Session 146：加購商品造飛機專案 chips 篩選 (2026-08-11)

使用者在 Figma 補充「專案設定」modal 中 `類別條件 = 造飛機專案`
時，專案 chips 暫定只有三個；`全選` / `取消全選` / chip selected
active 狀態維持目前 JS 邏輯，不依示意稿另外改狀態。

### Figma 讀取

- Current page: `components`
- Selection count: 1
- Frame: `2178:126955` `Modal（專案設定）`
- 示意狀態：
  - `專案分類 = 限定`
  - `類別條件 = 造飛機專案`
  - `專案清單列表` 顯示 `[999] 飛天六人滿意` + `網` / `企` badge、
    `[89] 地勤很辛苦`、`[09] 空姐滿班`

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - 新增 `FLIGHT_PROJECT_ITEM_IDS = ["999", "89", "09"]`
   - `renderProjectModal()` 改用 `visibleProjectItems()`
   - `類別條件 = flight` 時只渲染三個可見 chips
   - `專案分類 = 不限` 時不套用 hidden `類別條件 = flight` 的篩選，恢復
     顯示全部 6 個 chips
   - `全選` / `取消全選` 按鈕操作仍沿用完整 6 筆 demo 專案；active state
     改以目前可見 chips selected count 判斷，避免 `造飛機專案` 可見 3 顆全選
     時 `全選` 沒有 active
2. `specs/pages/purchase-addon.md`：
   - Project Modal spec 補記 `造飛機專案` 暫定三個 chips 與 state 不重置規則
3. `scripts/smoke-test.mjs`：
   - regression 補測切到 `限定` + `造飛機專案` 後只顯示三個 chips
   - 補測切 condition 不重置 `全選` active state
   - 補測切回 `不限` 後恢復 6 個 chips
   - 補測手動選中 `造飛機專案` 可見三個 chips 後 `全選` active
   - 補測 hidden condition 仍是 `造飛機專案` 時切 `專案分類 = 不限` 會顯示
     6 個 chips

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-146/`
  - `purchase-addon-project-flight-1080.png`
  - `purchase-addon-project-flight-manual-all-1080.png`
  - `purchase-addon-project-unlimited-after-flight-1080.png`

## Session 145：加購商品專案設定 chips 單點狀態同步 (2026-08-11)

使用者要求「專案設定」modal 開啟時 `專案分類` 預設為 `不限`，
且在 `全選` / `取消全選` 任一 active 狀態下，下面 chips 仍可個別點擊；
chips 的 selected 數量必須反向影響兩個 label button 的 active 狀態。

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - project modal 初始 state 改為 `mode = none`
   - open modal 時固定帶入 `不限`、`類別條件 = 不限`、`全選` active、
     6 個 chips selected
   - chip click 在 `不限` / `限定` 都可個別切換 selected
   - 新增 selected count 判斷：
     - selected 數量等於全部：`全選` active
     - selected 數量為 0：`取消全選` active
     - selected 數量介於中間：兩者都 inactive
2. `preview/partials/purchase-addon-modals.html`：
   - 靜態 markup 預設同步為 `專案分類 = 不限`、`全選` active
3. `scripts/smoke-test.mjs`：
   - regression 補測預設 `不限` 時隱藏類別條件
   - 補測 `全選` active 後單點 chip 會取消 active 並保留 5 個 selected
   - 補測 `取消全選` active 後單點 chip 會取消 active 並保留 1 個 selected
   - 補測切換 `類別條件` 不重置目前 chips 狀態
4. `specs/pages/purchase-addon.md`：
   - Project Modal spec 補明 chips 可單點，且單點後依 selected count 同步
     `全選` / `取消全選` active 狀態

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-145/`
  - `purchase-addon-project-default-unlimited-1080.png`
  - `purchase-addon-project-chip-custom-1080.png`

## Session 144：加購商品專案分類不限隱藏類別條件修正 (2026-08-11)

使用者澄清 Session 143 的口述只是補充原 frame 互動，原本
`專案分類 = 不限` 時下方 `類別條件` 不顯示的邏輯仍不變。

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - `專案分類` 切到 `不限` 時，`類別條件` row 恢復 hidden
   - 隱藏類別條件時不重置 `全選` / `取消全選` 與 chips selected state
2. `scripts/smoke-test.mjs`：
   - project modal regression 補測 `專案分類 = 不限` 時類別條件 hidden
   - 同時確認切換到不限後仍保留全選 active 與 6 個 chips selected
3. `specs/pages/purchase-addon.md`：
   - 補記 `專案分類 = 不限` 時 `類別條件` 不顯示
   - 將 `類別條件` 切換不重置 state 的規則限定在類別條件可見時

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-143/`
  - `purchase-addon-project-unlimited-hide-condition-1080.png`

## Session 143：加購商品專案設定 modal select 與全選狀態修正 (2026-08-11)

使用者確認專案設定 modal 的互動規則：專案分類只保留 `限定` / `不限`，
類別條件只保留 `不限` / `造飛機專案` 且 default 為 `不限`；類別條件切換
不得重置 `全選` / `取消全選` 與 chips selected 狀態。

### 本輪改動

1. `preview/partials/purchase-addon-modals.html`：
   - `專案分類` options 改為 `限定` / `不限`
   - `類別條件` options 改為 `不限` / `造飛機專案`，default `不限`
2. `preview/js/purchase-addon.js`：
   - project modal state 拆成 `mode`、`condition`、`selectionMode`、
     `selectedIds`
   - modal 初始開啟時 `全選` active，全部 chips selected
   - `全選` / `取消全選` 改為單選 active 狀態
   - 切換 `類別條件` 只更新 condition，不重置 chips selection
   - 手動切 chip 後依選取數量同步 selection mode：all / none / custom
3. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke 補測 options 數量、類別條件 default、全選 active、chips all
     selected、condition change 不重置 all / none state
   - page spec 同步本輪正式互動規則

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-142/`
  - `purchase-addon-project-modal-state-1080.png`

## Session 142：加購商品專案設定 modal 修正 (2026-08-11)

使用者指出「專案設定」按鈕目前誤植成其他 modal，要求重新 `figma-go`
讀取四個 frame 並完成實作。

### Figma 讀取

- 目前 selection count: 4
- Current page: `components`
- Frame:
  - `2178:125444` `Modal（專案設定）`
  - `2178:126644` `Modal（專案設定）`
  - `2178:126779` `Modal（專案設定）`
  - `2178:126955` `Modal（專案設定）`
- Contract:
  - modal title 為 `專案設定`
  - body 上方有 `產品代號` disabled input、`品名` disabled input
  - `專案分類` select 有 `不限` / `限定` / `非限定`
  - `限定` / `非限定` 狀態顯示 `類別條件` select，default `造飛機專案`
  - `不限` 狀態隱藏類別條件並顯示 `已全選`
  - `專案清單列表` 使用淡藍底 panel 與專案 chips，demo 專案包含
    `[999] 飛天六人滿意`、`[419] 不可告人優惠`、`[123] 劍湖山吃到飽`、
    `[443] 大利大吉`、`[89] 地勤很辛苦`、`[09] 空姐滿班`

### 本輪改動

1. `preview/partials/purchase-addon-modals.html`：
   - 新增獨立 `modalPurchaseAddonProjectBackdrop`
   - footer 維持取消 / 儲存，header 為 `專案設定`
2. `preview/assets/css/purchase-addon.css`：
   - 新增 project modal 800px layout、左 label / 右 control row、專案列表
     panel、全選控制、project chips 與 status tags
   - `<640px` project modal 納入滿版規則
   - 修正 selected chip 使用 `--color-menuitem-default`，避免誤用不存在的
     `--color-menu`
3. `preview/js/purchase-addon.js`：
   - 「專案」按鈕改開 `modalPurchaseAddonProjectBackdrop`
   - 依產品 row 的 `limited` / `nonLimited` 初始化 `專案分類`
   - `專案分類` 切到 `不限` 時隱藏類別條件並標示已全選
   - project chips、全選、取消全選可在 modal 內切換 demo state
   - data modal title handler 限定只處理 `modalPurchaseAddonDataBackdrop`
4. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke 補測 project modal id、title、產品代號 / 品名、限定狀態、
     類別條件顯示 / 隱藏、6 個 project chips、selected chip 藍底
   - mobile 滿版 regression 納入 project modal
   - page spec 補正式 Project Modal 規格，移除先前「暫開共用資料 modal」
     的過渡描述

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-142/`
  - `purchase-addon-project-modal-1080.png`

## Session 141：加購商品類別 table outline 內縮修正 (2026-08-11)

使用者要求類別設定下方 table 若內容未填滿橫向空間，外層 outline
需往內縮，不要整條撐滿父容器。

### 本輪改動

1. `preview/purchase-addon.html`：
   - 類別設定 table shell 補上 `pa-category-table-shell` 專用 class
2. `preview/assets/css/purchase-addon.css`：
   - `.pa-category-table-shell` 改為 `width: fit-content`
   - 保留 `max-width: 100%` 與既有 `overflow-x: auto`，小尺寸仍可水平捲動
   - 產品設定 table shell 不變，仍維持滿版
3. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - 補記與補測 desktop 1440 viewport 下，類別 table outline 需比父容器內縮
   - 同時確認產品 table outline 仍維持滿版

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過

## Session 140：加購商品查看 modal 關閉按鈕顏色修正 (2026-08-11)

使用者回報停用狀態下開啟查看 modal 時，footer「關閉」按鈕應比照
房型查看 modal 使用黑底反白，而不是灰色取消按鈕樣式。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - `.pa-data-modal-readonly [data-pa-data-cancel]` 覆蓋為
     `--color-text-800` 黑底與 `--color-text-100` 反白文字
   - 新增 / 修改模式仍維持原本取消灰色、儲存黑色
2. `scripts/smoke-test.mjs`：
   - 在停用 tab 的查看 modal regression 中補查 footer 關閉按鈕背景色，
     確認它等於房型使用的深色 token
3. `specs/pages/purchase-addon.md`：
   - 補記查看模式 footer「關閉」需使用房型查看 modal 同款黑底反白樣式

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過

## Session 139：加購商品資料 modal 欄位垂直置中修正 (2026-08-11)

使用者回報資料 modal 中左側欄位文字偏靠上，要求比對房型 modal，
讓左 label 與右側 input / control 垂直置中。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - `.pa-data-modal-field` 從 `align-items: start` 改為
     `align-items: center`
   - 上架列在 inline panel 展開時維持 `align-items: start`，避免 label
     被推到整個展開區塊中間
2. `scripts/smoke-test.mjs`：
   - 加購商品資料 modal smoke 補測第一列 label 與右側 control 的
     vertical center 差距，避免回歸成靠上對齊
3. `specs/pages/purchase-addon.md`：
   - 補記一般欄位需維持左 label / 右 control，且兩側需像房型 modal
     一樣垂直置中

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-139/`
  - `purchase-addon-data-modal-field-center-1080.png`

## Session 138：加購商品 mobile 上架日期排列修正 (2026-08-11)

使用者回報上架 toggle 展開 panel 後，小尺寸的日期控制橫向排列過擠，
要求月曆欄位上下排列。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - `<768px` 時 `.pa-publish-date-row` 改為 column
   - 起日 / 迄日各自佔滿一列，`~` 置中
   - 時段 row 維持原本橫向排列
2. `preview/js/purchase-addon.js`：
   - 修正資料 modal 重開時，上架 toggle 若已是 checked，inline panel
     會跟著顯示，不會出現 toggle 已開但 panel 收起的狀態
3. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - mobile 滿版 modal regression 加測 375px 上架 panel 日期控制上下排列
   - page spec 補記 `<768px` 起日 / 迄日上下排列

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-138/`
  - `purchase-addon-mobile-publish-dates-stacked-375.png`

---

## Session 137：加購商品 mobile modal 滿版修正 (2026-08-11)

使用者要求確認先前已說過 modal 小尺寸需滿版，指出加購商品目前不是滿版。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - 對 `#modalPurchaseAddonDataBackdrop` 與
     `#modalPurchaseAddonPhotoGalleryBackdrop` 補上 `<640px` 滿版規則
   - small viewport 下 backdrop 改 stretch、padding 0
   - modal-box 改 `width: 100%`、`height: 100%`、`margin: 0`、
     `border-radius: 0`、`border: none`、`box-shadow: none`
2. `scripts/smoke-test.mjs`：
   - 加購商品 smoke checks 從 12 項增為 13 項
   - 新增 375px viewport regression：開資料 modal 與照片 modal，
     檢查 modal-box left/top、width、height、border-radius 是否符合滿版
3. `specs/pages/purchase-addon.md`：
   - 補記小尺寸 `<640px` modal 滿版規格，與房型 modal 行為一致

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-137/`
  - `purchase-addon-mobile-data-modal-fullscreen-375.png`

---

## Session 136：加購商品頁第四輪問題回報修正 (2026-08-11)

使用者回報 pagination 按鈕形狀 / 底色、上架 panel 不應 floating、
上架 panel 需依 UI layout 顯示起迄日 / 起迄時段、專案按鈕失效，以及
modal 欄位需維持左文右 input 佈局。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - pagination 上一頁 / 下一頁改為全圓角淡藍底
   - disabled pagination 按鈕維持淡化
   - 移除 mobile 下資料 modal 欄位改垂直的覆蓋，維持左 label / 右 control
2. `preview/partials/purchase-addon-modals.html` / `preview/js/purchase-addon.js`：
   - 上架 panel 改為 inline normal-flow 區塊，checked 後直接在 toggle
     下方長出，不再 absolute floating
   - panel 內容改為 UI layout：`設定開放日期` 起迄日、`設定開放時段`
     toggle、起迄時段與提示文字；移除前一版自行加入的 panel 標題 /
     取消 / 儲存
   - 上架 panel 長出後會撐高同一 grid row，左側數量限制 row 跟著變高
3. `preview/js/purchase-addon.js`：
   - 「專案」按鈕接回共用資料 modal，點擊不再無反應；現階段 title
     顯示 `產品專案`，待專案專用 modal layout 補圖後再拆分
4. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke test 覆蓋 pagination 圓角、上架 panel inline、起迄日 / 起迄時段、
     panel 不含舊 popup 文案，以及專案按鈕可開 modal
   - page spec 同步本輪規格

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 12 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-136/`
  - `purchase-addon-pagination-rounded-1080.png`
  - `purchase-addon-edit-inline-publish-panel-1080.png`

---

## Session 135：加購商品頁第三輪問題回報修正 (2026-08-11)

使用者回報分頁文案 / pagination 樣式、產品資料修改上架控制視窗、
停用狀態查看 modal disabled，以及 table 內容左右置中問題。

### 本輪改動

1. `preview/js/purchase-addon.js` / `purchase-addon.css`：
   - 分頁狀態的 toggle label 改為 `分頁（N 頁 / M 筆）`
   - 底部 pagination 改為上一頁 / 當前頁 / 下一頁三段式
   - 第一頁上一頁 disabled，最後一頁下一頁 disabled，disabled 按鈕淡化
2. `preview/partials/purchase-addon-modals.html` / `purchase-addon.js`：
   - 產品資料修改 modal 的「上架」toggle 點擊後開啟上架設定 panel
   - panel 內含日期、時間（時 / 分）、取消與儲存
   - 停用狀態「查看」modal 會切 readonly mode：input / select /
     上架 toggle / 文案編輯按鈕全部 disabled，footer 隱藏儲存並顯示關閉
3. `preview/assets/css/purchase-addon.css`：
   - 產品 / 類別 table header 與 body 內容改為左右置中
   - 管理按鈕群組改為管理欄內置中
4. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke test 覆蓋分頁文案、pagination disabled/next-page 行為、
     上架 panel 日期時間欄位、查看 disabled 與 table center
   - page spec 同步本輪規格

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 12 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-135/`
  - `purchase-addon-pagination-1080.png`
  - `purchase-addon-edit-publish-panel-1080.png`
  - `purchase-addon-view-disabled-1080.png`

---

## Session 134：加購商品頁第二輪問題回報修正 (2026-08-11)

使用者回報全部顯示 / 分頁 icon UI、產品新增 modal 內容、產品 table
管理按鈕消失、專案按鈕條件與類別設定 mobile 管理按鈕問題。

### 本輪改動

1. `preview/purchase-addon.html` / `preview/js/purchase-addon.js`：
   - 全部顯示 toggle 改為 icon button，all mode 使用 `all-pages.svg`，
     paged mode 使用 `split-page.svg`
   - 移除 demo data 的 action 隱藏旗標，產品 row 2、row 3 與後續 rows
     不再遺失管理按鈕
   - 「專案」按鈕改為只依 `limited` / `nonLimited` 狀態顯示；沒有
     `thumbtack` / `thumbtack-slash` 的 row 不顯示「專案」
2. `preview/partials/purchase-addon-modals.html` / `purchase-addon.css`：
   - 產品資料 modal 由占位外殼改為使用者補圖中的產品新增欄位結構
   - 移除 `demo` 副標，補類別、產品描述、產品編號、品名、定價、
     排序、數量限制、上架 toggle、產品介紹文案與品名文案卡
   - modal 寬度放大到產品新增 layout 需要的 980px 上限，mobile 改單欄
3. `preview/assets/css/purchase-addon.css`：
   - 類別 table 寬度調整，mobile 橫向 overflow 下保留完整管理欄
   - 文案卡背景改用現有 `--color-modal-hover` token
4. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke test 改查 icon button 切換、modal 欄位、專案按鈕條件、
     row 2 / row 3 / 類別管理按鈕存在
   - page spec 同步本輪互動與產品資料 modal 規格

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 12 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-134/`
  - `purchase-addon-product-new-modal-1080.png`
  - `purchase-addon-mobile-375.png`
  - `purchase-addon-mobile-product-actions-right-375.png`
  - `purchase-addon-mobile-category-actions-right-375.png`

---

## Session 133：加購商品頁問題回報修正 (2026-08-11)

使用者回報 q1-q8，要求先參考 `room-type.html` / `room-type.js` /
`room-type.css` 與既有 UI layout 再修正。

### 本輪改動

1. `preview/js/purchase-addon.js` 改為 state-driven render：
   - 產品 / 類別各自有 14 筆啟用 rows + 5 筆停用 rows
   - 啟用 / 停用 tab count 依當下 state 即時計算
   - 停用 / 啟用 row 會像房型頁一樣移到另一個 tab
   - 全部顯示 checked 時列出目前 tab 全部 rows；unchecked 時 label 改「分頁」，
     每頁 5 筆並顯示 pagination
2. `preview/partials/purchase-addon-modals.html` 新增：
   - `modalPurchaseAddonDataBackdrop`：新增 / 修改 / 查看共用資料 modal 外殼
   - `modalPurchaseAddonPhotoGalleryBackdrop`：沿用房型照片管理 modal 版型，
     但 id 與 JS state 獨立
3. `preview/assets/css/purchase-addon.css` 修正：
   - 修改 / 複製 / 停用 / 查看 / 啟用按鈕取消漸層，保留白底與各自邊框色
   - 限定專案 icon 改成 orange-filled mask
   - mobile 商品分類 select 支援 truncation
   - mobile 清除 / 查詢置中
   - table 管理按鈕固定不 shrink，避免四顆按鈕被容器擠壓變形
4. `preview/purchase-addon.html` 補上：
   - 狀態 tab / count / display toggle / pagination / table body 掛點
   - 新增按鈕與資料 modal 連線
   - 加購商品專屬 modal partial
5. `scripts/lint-partials.py` / `scripts/smoke-test.mjs` 更新：
   - manifest 登記 `purchase-addon-modals`
   - smoke test 覆蓋 14 筆 rows、分頁切換、狀態 count、停用 / 啟用、
     新增 / 修改 data modal、照片 modal 5 slots
6. 視覺 QA 截圖輸出到 ignored 目錄：
   `specs/qa-screenshots/session-133/`
   - `purchase-addon-mobile-375.png`
   - `purchase-addon-mobile-actions-right-375.png`
   - 另保留 desktop/tablet 截圖供對照

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 12 checks 通過

## Session 132：system-basic 加購商品頁列表層實作 (2026-08-11)

使用者要求「開始實作，加購商品」。依 Session 131 已確認的 Figma contract 與
使用者拍板事項，先寫 page spec，再實作「系統操作 -> 加購商品」獨立頁。

### 本輪改動

1. 新增 page spec：`specs/pages/purchase-addon.md`
2. 新增獨立頁：`preview/purchase-addon.html`
   - 兩個 section：「產品設定」「類別設定」
   - 商品 tabs default「所有商品」白底 selected
   - 啟用 / 停用狀態 tabs、全顯 checkbox、圖例、產品 / 類別 table
   - 產品設定含商品分類 / 商品名稱篩選列與 quick chips
3. 新增頁面 JS：`preview/js/purchase-addon.js`
   - section 展開 / 收合
   - 商品 tabs、狀態 tabs、quick chips 單選 active 樣式
   - 清除輸入、重整 current page
4. 新增 domain CSS：`preview/assets/css/purchase-addon.css`
   - table layout / overflow、tabs、chips、checkbox、圖例、管理 pill buttons
   - 停用按鈕使用 `var(--color-surface-status-negative-light)`
   - desktop 產品表格 100% 寬；<1200 固定 table width 觸發橫向 overflow
5. 串接共用架構：
   - `partials/aside.html` 將「加購商品」改成 `purchase-addon.html` 真實連結
   - `js/page-tabs.js` 登記 `purchase-addon.html` ->「加購商品」
   - `assets/css/app.css` import `purchase-addon.css`
   - `scripts/lint-partials.py` 登記本頁 partial / module manifest
   - `scripts/smoke-test.mjs` 更新 app.css import check 並加入
     `purchase-addon.html` smoke coverage
6. 視覺 QA 截圖輸出到 ignored 目錄：
   `specs/qa-screenshots/session-132/`
   - `purchase-addon-desktop-1440.png`
   - `purchase-addon-tablet-767.png`
   - `purchase-addon-mobile-375.png`

### 範圍決定

- 本輪只做列表層 UI；新增 / 修改 / 複製 / 停用 / 專案等 modal 仍待後續 Figma
  補互動 modal 後再接。
- 查詢 button demo 不改資料；清除 button 只清空產品設定文字輸入。
- Table 資料為 Figma demo rows；後續由後端渲染真實資料。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 9 checks 通過

### 下一步應做

- 等後續 Figma modal contract：新增 / 修改 / 複製 / 停用 / 專案相關 modal
  內容與互動，再補 spec 並接行為。

## Session 131：system-basic 加購商品頁 icons 預讀 (2026-08-11)

使用者要求讀 `start.md` / `progress.md` 後進行 figma-go 讀取；接下來會做
「系統操作 -> 加購商品」頁，先更新 icons，再依序讀 mobile / tablet /
desktop 三個 RWD layout template。

### Figma 讀取

- Figma file：`swift`
- Page：`components`
- Selection：`25:93`「Icons」frame，402 x 857.01
- 本輪從 selection 中確認新增 icon：
  `icons/projects`、`icons/thumbtack-slash`、`icons/split-page`、
  `icons/all-pages`
- RWD layout templates：
  - `2183:132622`「加購商品 mobile 0811」375 x 2186
  - `2183:130916`「加購商品 mobile ~ tablet 0811」767 x 1884
  - `2183:129489`「加購商品 desktop 0811」1440 x 1786

### 本輪改動

1. 匯出 4 個 SVG 到 `preview/assets/icons/`
2. `specs/icons.md` 新增上述 4 顆 icon 的主清單、分類索引、尺寸備註與
   currentColor 待處理記錄
3. 保存三個 RWD layout 截圖到 `specs/qa-screenshots/session-131/`
4. 使用者補充 Figma Variables export 後，同步本地 ignored
   `specs/assets/figma-variables.json`，並在 tracked source 補上
   `Color/Surface/Status-Negative-light`：
   `specs/assets/tokens.md` 與 `preview/assets/css/base.css`

### 重要決定

- 使用者確認：tablet 尺寸下 table 因設計佈局有限高，管理按鈕實作時使用
  `flex-nowrap`；Figma 設計稿不另行處理此 nowrap 視覺。
- 使用者確認：商品 tabs 為單選 tab button；default 是「所有商品」，
  selected 狀態是白底，灰底是未選中。不得把目前畫面中灰底的
  「住宿加購」誤判為 default selected。
- 使用者確認：desktop sidebar 沿用現有真實系統選單；本頁只變化上方
  `加購商品 x` page tab/button 與其下方內容。
- 使用者確認：table 管理按鈕 desktop ~ tablet 採 flex auto 自然流動；
  mobile 嚴格限制 `flex-nowrap`。若 tablet 實作跑版，也維持
  `flex-nowrap`。這幾個管理按鈕橫向鋪在自身容器中，原則上不需要
  button-level scroll。
- 使用者確認：本輪只做目前這一層 UI；新增 / 修改 / 複製 / 停用 / 專案
  modal 內容等後續 Figma 補互動 modal 後再接。
- 使用者補充的 Figma Variables export 顯示：
  `Color/Surface/Status-Negative-light = #F8A4A8` 是正式 token。後續
  加購商品 table 的停用 / 負向淡紅按鈕外框與相關淡色提示，優先使用
  `var(--color-surface-status-negative-light)`，不要再借用
  `Color/Accent/linear-function-button-delete`。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)

### 下一步應做

1. 等使用者確認三個 RWD layout 的 implementation contract 與疑點
2. 使用者確認後，寫入 page spec / 必要 component spec
3. 實作「系統操作 -> 加購商品」獨立頁與必要 partial / JS / CSS；使用者確認前
   不寫 page spec、不實作 HTML

### 未解問題

- 三個 RWD layout 已讀；default tab、sidebar、table 管理按鈕與後續 modal
  範圍已由使用者確認。下一步仍需進入 spec checkpoint 後再寫 spec / 實作

---

## Session 130：GitHub Pages root demo redirect (2026-08-11)

使用者將 repo 推送到新 GitHub 帳號 `FIT-developer/swift`，GitHub Pages 顯示
deploy 成功但 root URL 尚未出現產品畫面。檢查後確認 Pages source 為
`main / (root)`，而專案入口實際位於 `preview/landing.html`。

### 本輪改動

1. **GitHub Pages 入口**：新增 repo root `index.html`，使用 meta refresh 與
   `window.location.replace` 導向 `./preview/landing.html`
2. **既有 preview 不變**：未修改 `preview/landing.html` 或其他 preview asset；
   目前 demo root 只作為 GitHub Pages 的入口橋接

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- 本機檢查 root `index.html` 含 meta refresh、canonical link、fallback link
  與 JS `window.location.replace("./preview/landing.html")`

### 未解問題

- 若未來希望 `https://fit-developer.github.io/swift/` 不顯示 `/preview/` 路徑，
  需另行規劃正式發布目錄或 GitHub Pages source。

## Session 129：room-type 資料 modal 0804 房間數互動與欄位收斂 (2026-08-04)

使用者以 figma-go 分批讀取房型頁「新增 / 修改 / 查看」modal 0804 版本，
確認後要求先寫入 spec 再開始 coding。

### Figma 讀取

- 新增：`2147:109387` / `2147:109674` / `2147:110051`
  「Modal（新增）0804-1/2/3」
- 修改：`2147:110305` / `2147:110306` / `2147:110307`
  「Modal（資料修改）0804-1/2/3」
- 查看：`2147:110598` / `2147:110904` / `2147:111139`
  「Modal（僅查看）0804-1/2/3」
- 截圖：`specs/qa-screenshots/session-129/room-type-{new,edit,view}-modal-0804-*.png`

### 本輪改動

1. **spec 同步**：`components/modal.md` 的 `state=room-type` 改為 0804 confirmed
   source，記錄三個房間數狀態、差異文案、房數修改 toggle 與查看 disabled
   active 規則；`specs/pages/room-type.md` 更新 modal source pointer
2. **HTML 欄位收斂**：`preview/partials/room-type-modals.html` 移除舊版欄位：
   顯示分類、房價跟隨、銷售單位、參考價格、加人、加床；新增 / 修改改為
   房間數 number input + 條件式房數修改區塊
3. **互動行為**：`preview/js/room-type-modals.js` 新增房間數 baseline 14 邏輯；
   改成非 14 時顯示 `增加 n 間` / `減少 n 間`，展開房數修改，active 時提示
   改為 `同步更新房型庫存，至 2027-09-11`
4. **查看狀態**：查看 modal 使用 disabled number input、disabled active toggle，
   提示文字維持一般深色，不套新增 / 修改的橘色 active hint
5. **回歸測試**：`scripts/smoke-test.mjs` 新增 room count 互動與查看 disabled
   active toggle 檢查

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`room-type.html` 15 checks 通過

### 未解問題

（無）

---

## Session 128：toggle switch 新增 disabled 狀態 (2026-08-04)

使用者以 figma-go 指示讀取 toggle button，確認後新增 disabled 狀態按鈕。

### Figma 讀取

- Selection：`991:12452`「Toggle - Switch」component set
- Page：`components`
- Size：104 x 164
- Variants：`type=closure`、`type=open`、`type=disabled`
- 截圖：`specs/qa-screenshots/session-128/toggle-switch-component-set.png`

### 本輪改動

1. **spec 同步**：`specs/html-conventions.md` 的 iOS-style toggle switch
   pattern 補上 disabled variant 規則
2. **共用 CSS**：`preview/assets/css/modals.css` 補上
   `.member-data-switch` disabled 視覺，track 維持灰色，checked disabled 的
   knob 維持右側，不整顆降低 opacity
3. **preview**：`preview/toggle.html` 新增 Disabled 範例按鈕，並避免 disabled
   按鈕被 click handler 切換

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過
- `curl -I http://127.0.0.1:8000/toggle.html`：HTTP 200

### 未解問題

（無）

---

## Session 127：lodging-info 分館資料 modal 傳真文字調整 (2026-08-04)

使用者要求將分館資料 modal 的傳真欄位改為較短名稱，純文字異動後直接
commit & push。

### 本輪改動

1. **HTML 文案**：`preview/partials/lodging-info-modals.html` 的分館資料 modal
   傳真欄位 label 改為「傳真」
2. **spec 同步**：`components/lodging-branch-info-modal.md` 對應欄位表與文案
   card 清單同步改名
3. **歷史進度一致性**：本檔 Session 126 的新增欄位描述同步改為「傳真」，
   避免後續交接沿用舊文字

### 驗證

- 舊傳真欄位名全 repo 搜尋：無結果
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`lodging-info.html` 15 checks 通過

### 未解問題

（無）

---
