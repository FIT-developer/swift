# Progress Archive - Session 73 to 82 (2026-07-03 to 2026-07-04)

> 本檔為 specs/progress.md 的歷史封存。
> 注意：本檔內的決策可能已被後續 session 推翻，查詢決策時一律以
> specs/progress.md 最新 session 為準；本檔僅供追溯當時為什麼這樣做。

---

## Session 82 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 1b（order-processing.html 靜態頁 + topbar partial）

延續 Session 81；本輪仍不讀 Figma，照既有 spec/html 拆頁。Stage 1b 只要求新頁獨立載入、顯示、RWD 不爆版，先不接互動。

### 本輪改動

1. `preview/partials/topbar.html`（新）：自 `landing.html` 抽出 desktop top row（`desktopTopRow` / `sidebarCompact` / `pageTabsInline` / function icons）。Mobile logo/menu bar 保留在 page shell，因為它在 `bodyArea` 外層；若和 desktop row 放同一 partial 會改變 landing 或新頁的 DOM hierarchy。
2. `preview/landing.html`：desktop top row 改同步 XHR 注入 `./partials/topbar.html`，讓既有 load-time handlers 仍可在主 script 執行前找到 `desktopBulletinBtn` / `desktopMessageBtn` / `desktopMemberBtn` / `expandBtn` / `pageTabsInline`。
3. `preview/order-processing.html`（新）：建立訂單處理靜態頁骨架，使用 `data-partial="aside"` 與 `data-partial="topbar"` async 載入共用 partials；頁面內容自 `tpl-order-processing` 搬出。`body[data-page="訂單處理"]` 供 `partials.js` 標示 aside active。
4. 新頁 module：`await loadPartials()` 後在 `pageTabsInline` render 一顆 active `訂單處理` navigation chip（真實 link，無 close button，符合 tab chips 降級為導航列的決策）。
5. `preview/assets/css/landing.css`：`.page-tab` 補 `text-decoration: none;`，讓新頁 anchor chip 不出現瀏覽器預設底線；landing 既有 div chip 視覺不變。
6. 新頁 static display 補值：`data-op-date-from` / `data-op-date-to` 先填 `2026-07-01` / `2026-07-02`，避免 Stage 1c 前沒有 calendar JS 時日期欄空白。

### 驗證

- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `git diff --check` pass
- 結構檢查 pass：
  - `order-processing.html` 含 `data-partial="aside"` / `data-partial="topbar"`
  - `order-processing.html` 含 `op-filter-panel` / `op-row-menu`
  - 新頁日期靜態值存在
  - 新頁 module 會 render `page-tab active` 的 `訂單處理`
  - `topbar.html` 含 `pageTabsInline` 與三個 desktop function icon trigger
  - `landing.html` 含 `topbarMount` 與 `./partials/topbar.html` 同步注入
- HTTP server 檢查：另開 8010 server 後，外部 `curl` 仍回 `connection refused`（同 Session 81 的 8000/8002 問題）。已關閉本輪啟動的 8010 session；本輪以 lint + 本地結構檢查作為 Stage 1b 驗證。

### 下一步

1. Stage 1c：建立 `preview/js/order-processing.js`，搬入 op-* 行為（pill menu、filter tabs、quick filter、tooltip clamp、project toggle）。
2. 視需要建立共用 module 給新頁使用：`rb-accordion` / `nation-group` / `rb-cal-cell` 等；landing inline 版暫留，Stage 3 再收斂去重。
3. Stage 1c 後再做新頁互動回歸；Stage 1d 才搬 modal 與退役 `orderEdit_` clone。

### 重要決定

- 1b 期間 aside 的「訂單處理」href 仍不切；新頁先用直接網址驗收，避免 landing SPA 入口在 1c/1d 前中斷。
- `landing.html` 內的 `tpl-order-processing` 凍結待刪；後續訂單處理頁視覺調整應改 `preview/order-processing.html`。

### 未解問題

- 本機 HTTP server 在目前執行環境下仍不可靠，後續若要瀏覽器截圖驗證，需先排除 port/listener 問題或改用可穩定控制的 browser tooling。

## Session 81 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 1a（room-booking sections partial）

使用者已將 Stage 1 細分 1a-1d 寫入 `specs/page-architecture.md`，並明確指示本輪不用 Figma，照既有 spec/html 開工。Figma MCP checklist 視為不適用；未同步 tokens（沒有新 Figma Variables 或新設計值）。

### 本輪改動

1. `preview/partials/room-booking-sections.html`（新）：自 `preview/landing.html` 的 `tpl-room-booking` 抽出 [A]-[E] wrapper 內容，作為房間預定頁與訂單修改 modal 後續共用來源。
2. `preview/landing.html`：`tpl-room-booking` 內改成同步 XHR 注入 `./partials/room-booking-sections.html`，模式同現有 aside 同步注入；目標是讓 `openPage()` 的 `tpl.innerHTML` clone 與 `buildOrderEditModalBody()` 的 `tpl.firstElementChild.children` 行為維持不變。
3. 新 partial 變成新增檔後，清理新增行 lint 會擋的歷史內容：註解中的裝飾性 Unicode 改 ASCII、stepper minus glyph 改 `&minus;` 保持畫面、兩個 mobile-unsafe `min-w` 改為 `md:min-w-[580px]` / `w-[54px]`。

### 驗證

- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `git diff --check` pass
- Inline script parse check pass（3 個 inline scripts）
- 本地結構檢查 pass：模擬同步注入後 `tpl-room-booking` 第一個元素仍為 `<div class="flex flex-col gap-4">`，且包含 `data-order-summary-submit` / `id="btnInventory"` / `data-data-exists-trigger`
- 訂單修改 modal 依賴 selector 檢查 pass：`invCalendarLeft` / `tableInventory` / `data-inventory-date-modal` / `customer-toggle` / `orderDataClear` / 加購與到店 modal trigger 皆仍在 partial
- HTTP 檢查：`landing.html` 曾回 200；partial curl 驗證受本機 server/port listener 狀態干擾（8000/8002 皆出現 first request 後連線不穩，8000 上 lsof 看到多個 Python listener），本輪改以本地結構檢查替代，未做瀏覽器截圖。

### 下一步

1. Stage 1b：建立 `preview/order-processing.html` 靜態頁，頁內容自 `tpl-order-processing` 搬出。
2. 同步抽 `preview/partials/topbar.html`（partial 只含容器 markup，landing 與新頁各自 render chips）。
3. 1b 期間 aside 的「訂單處理」href 先不切，避免 landing SPA 入口斷掉；新頁先用直接網址驗收。

### 重要決定

- 本輪只做 Stage 1a，不退役 `orderEdit_` clone；clone 機制留到 Stage 1d 搬 modal 時處理。
- `preview/room-booking.html` 仍是 superseded 舊檔，不作為拆分來源。

### 未解問題

- 需要後續用穩定 server 或 browser tooling 做 Stage 1b/1c/1d 的視覺回歸截圖；本輪沒有新增視覺設計，只做 template partial 抽離。

## Session 80 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 0（使用者核准整個分階段計畫）

使用者決定將 landing.html 依 content 拆成獨立 html（房間預定/訂單處理各自一頁，landing 剩 dashboard）。完整計畫與決策記錄在 **specs/page-architecture.md「landing.html 拆頁重構計畫」段**（含 tab chips 降級為導航列的決策、四個 stage、Stage 1 執行要點）。

### 本輪產出（Stage 0）

1. 拆頁計畫寫入 page-architecture.md（每 stage 一個 session、中間態皆可用）
2. `js/tailwind-config.js`：landing 的 inline tailwind.config（63 行）抽出共用，landing 改外部引用；回歸：config 自訂色正常渲染

### 下一步（下個 session 開場直接做）

**Stage 1：拆訂單處理 -> order-processing.html**，執行要點見 page-architecture.md 該段（先抽 [A]-[E] partial -> 頁骨架 -> 頁內容搬移 -> JS 抽 modules -> aside 連結改真實 href -> 三 lint + 全回歸）。Stage 1 完成後 orderEdit_ clone 機制可整組退役。

其他遺留：使用者操作驗收訂單處理頁（截圖 session-78/）；未 push commits x5（ee06dfb/b9722a8/26fedd1/f6deac1/本輪）。

---

## Session 79 交接 (2026-07-04)

### 任務: B3 start.md 瘦身 + 驗收材料 + 三層 modal 疊層修正

1. **B3**：start.md「元件 conventions」「可復用 UI patterns」兩段（60 行，無界增長區）整段移至 specs/html-conventions.md（現 229 行），start.md 留指標段（450 -> 396 行）；memory 的行號引用改段落名引用
2. **驗收材料**：11 張多角度截圖存 specs/qa-screenshots/session-78/（accept-01~11：1440 篩選/表格/dropdown/修改 modal 三區塊/tooltip + 390 頁面/bottom sheet/modal/月曆 offcanvas），等使用者實際操作驗收
3. **三層 modal 疊層修正**（使用者回報：會員資料內「公司名稱 edit」開出的 modal 層級不對）：
   - 根因：orderEdit_ 副本 append 在 body 不在 #modalOrderEditBackdrop 內，副本內 delegated trigger 過不了 scope 檢查，開到原版（z60）壓在副本（z65）下
   - 修正：scope 檢查改 `closest('#modalOrderEditBackdrop, [id^="orderEdit_"]')`；z 改動態疊層（openModal 依已開數 N 給 60+N*5，任意深度）；Esc 只認 computed z 最上層、最上層 no-dismiss 則不動作（修掉穿透關底層的衍生 bug）；data-order-summary-submit 加防禦性分流
   - 驗證：三層鏈 60/65/70、原版全程未動、Esc/按鈕逐層關、房間預定頁原路徑回歸全過
   - spec：order-edit-modal.md 巢狀規則段更新為動態疊層版

### 下一步

1. 使用者操作驗收訂單處理頁（截圖組在 session-78/）
2. 未 push commits：ee06dfb / b9722a8 / 26fedd1 / 本輪
3. audit 項目全數完成（B1-B4 + 5 項止血）

---

## Session 78 交接 (2026-07-03)

### 任務: audit B2 + B4（B3 start.md 瘦身留待下個 session）

1. **B4 token mirror drift check**：新增 `scripts/lint-tokens.py` / `.sh`，比對 tokens.md 的 Color raw hex 定義與 base.css `--color-*`（含 var() alias 鏈遞迴解析），掛進 pre-commit hook（第三個 lint）。首跑 86 個 token 全數一致零 drift
2. **B2 progress.md archive**：Session 6-62 搬 `specs/progress-archive-s06-s62.md`（2684 行），本檔留最近 15 個 session（822 行）；檔頭與 start.md 檔案地圖加「archive 決策可能已被推翻，以本檔最新為準」規則；lint-conventions 豁免 progress-archive 檔（歷史內容依 start.md 本就豁免）
3. 修 lint-conventions worktree 模式在前一輪已補的 untracked 掃描於本輪實戰生效

### 下一步

1. **B3 start.md 瘦身**（唯一剩餘 audit 項）：元件 conventions + UI patterns 段搬 specs/html-conventions.md，目標 ~250 行；搬完掃 memory 檔的行號引用
2. 訂單處理頁最終驗收；未 push commits：ee06dfb + b9722a8 + 本輪

---

## Session 77 交接 (2026-07-03)

### 任務: B1 頁面架構調整（landing.html 凍結 + multi-page 架構 + aside 單一化）

背景：公司要求原生技術（無框架），單檔會持續膨脹（使用者原話「將來還會恐怖的大包」），故執行 audit B1。核心論點：**原生不等於單檔** - ES modules 與 fetch partial 都是瀏覽器原生能力。

### 本輪產出

1. **前置實測（全過）**：Tailwind Play CDN 的 MutationObserver 對 runtime 注入內容完整生成樣式（arbitrary value / CSS var arbitrary / config 自訂色三種都驗證）；原生 ES modules 經 python http.server 直接可用
2. **`specs/page-architecture.md`**（新 spec）：目標結構（`preview/{page}.html` + `partials/` + `js/`）、新頁面固定骨架、partial 載入機制、id 命名空間（跨頁無碰撞 = 核心收益）、CSS 歸屬、遷移策略
3. **start.md 凍結規則**：landing.html 不再新增頁面 template / modal / 大段 JS；新頁面一律走新架構
4. **aside 單一化（使用者裁決選 b 單一事實來源）**：
   - `preview/partials/aside.html`（新）：全站唯一 aside，668 行自 landing.html 抽出，純 markup
   - landing.html 改 `asideMount` + **sync XHR 同步注入**：sidebar 綁定散佈於 load-time 多個 IIFE，async 注入會全部落空；同步注入讓主 script 一行不動。代價 = console 1 筆 deprecation warning（已知且接受，記錄於注入點註解）
   - `preview/js/partials.js`（新）：新頁面用的 async `loadPartials()`（掃 `[data-partial]`、標 aside active 態依 `body[data-page]`、dispatch `partials:loaded`）
5. landing.html 11583 -> 10931 行（-652），且從此凍結

### 回歸驗證（全過）

aside 注入（26 選單項目）、選單導航（開訂單處理）、accordion 收合、收合全部、mobile drawer 開關、backdrop 關閉；JS parse check、雙 lint。console 無錯誤（既有 CDN warning + 已知 1 筆 deprecation）。

### lint 加強（commit 時 hook 攔截後順手修）

- aside.html 的 mobile 關閉鈕 `\u2715` glyph 改 HTML entity `&#x2715;`（source 變 ASCII、渲染完全相同，瀏覽器驗證過）
- **lint-conventions worktree 模式盲點修補**：`git diff HEAD` 不含 untracked 新檔（partials/ js/ 曾因此漏掃），改為另以 `git diff --no-index /dev/null` 產生偽 diff 一併餵入

### 未完成 / 下一步

1. **audit 剩餘中型項目**：B2 progress.md archive（本檔即將 3600 行，建議下次做）、B3 start.md 瘦身（conventions 段搬 html-conventions.md）、B4 token drift check script
2. 下一個新頁面實作時：照 page-architecture.md 骨架 + 建 `js/tailwind-config.js` + aside 選單加新頁連結（只改 partials/aside.html 一份）+ landing 舊三頁連結機制（hash 指定，屆時定義）
3. 訂單處理頁 Batch 1-6 完成，等使用者最終驗收
4. 未 push 的 commit：ee06dfb（repo hygiene）+ 本輪

---

## Session 76 交接 (2026-07-03)

### 任務: repo 結構體檢（Fable agent audit）+ 5 項止血執行

使用者要求用最強模型對檔案結構與工作流做全面體檢（好壞都分析）。audit 完整報告已在對話中呈給使用者；本輪執行了報告中 5 項「極小/小成本」止血項，中型項目待逐項確認。

### Audit 結論摘要（完整版本見對話記錄）

- 做得好（保留）：規則帶 why、lint 落地機制、token strict mirror、Figma MCP 陷阱知識庫、交接格式、components/ 平鋪
- 兩顆定時炸彈：landing.html 單檔增量（11583 行，91 個 modal id，orderEdit_ clone 那套工程的根因）、自稱權威的過期檔案（design-system/MASTER.md 為最，navy/gold 調色盤與實際品牌橘完全不符）
- 明確不動：landing.html 存量、start.md 單檔形態、progress.md 格式、components/ 平鋪、tokens typo 鏡像、memory 與 start.md 的雙層重複

### 本輪執行（5 項止血）

1. **刪 `design-system/`**（錯誤調色盤污染源，agent 搜 "color palette" 會撞到且自稱權威）
2. **刪 12 個未使用 agent-tool 目錄**（.agent/.cursor/.codex/.windsurf 等 + .github/prompts/ui-ux-pro-max，共 400+ 檔 ~7.6MB，skill installer 灑的複本；.claude/ 保留；.gitignore 加防再生清單）
3. **stale 檔標注**：preview/room-booking.html 標 superseded-by landing.html#tpl-room-booking；sections/ 9 檔 + layouts/ 2 檔標 frozen-reference
4. **order* 命名陷阱檔頭警告**（order.md = dashboard widget / order-status.md = 房間預定 [E] / order-status-pill.md = 訂單處理 pill，三檔互相指路）
5. **AGENTS.md 降為純指標**（15 行，重複段移除，規則本體只在 start.md）

配套：start.md 三處同步（專案結構樹標 frozen + 補列 specs/pages 與 html-conventions.md、檔案地圖重排 specs/pages 升第 4 順位、分層順序宣告 5 層改現行 3 層 tokens -> icons -> components -> specs/pages -> 實作）

### 未完成 / 下一步（audit 中型項目，待使用者逐項確認）

1. **B1（最重要）**：立規則「新頁面不再進 landing.html」+ 新頁獨立 html + fetch 共用 partial 方案（要先實測 Tailwind Play CDN 對 runtime 注入內容的 class 掃描）
2. **B2**：progress.md archive 機制（留最近 10-15 session，其餘搬 specs/progress-archive-*.md）
3. **B3**：start.md 瘦身（元件 conventions + UI patterns 段搬 specs/html-conventions.md，目標 ~250 行；CLAUDE.md 每 session 自動載入後其長度是固定 context 稅）
4. **B4**：token mirror drift check script（比對 tokens.md hex 與 base.css 值，掛進 lint-conventions）
5. 訂單處理頁 Batch 1-6 全部完成，等使用者最終驗收（延續 Session 75）

---

## Session 75 交接 (2026-07-03)

### 任務: 最近兩個 commit code review 後修正 + 規範補強 + commit/push

使用者要求檢查最近兩個 commit 後，將需要寫入規範的內容寫入規範，並交接、commit、push。本輪針對 review finding 做修正與 guardrail 補強。

### 本輪處理

1. `preview/landing.html`:
   - `initCalendar(root)` 改為 root-scoped 查找，不再用 `document.getElementById` 抓 hidden `tpl-room-booking` 或已建立的 `modalOrderEditBackdrop` clone。
   - 無 calendar 的 subpage 直接 skip，避免切到「訂單處理」時誤初始化 hidden template。
   - Backdrop click / Escape 改 delegated 通用機制，自動涵蓋 `modalOrderEditBackdrop` 與 runtime `orderEdit_` 副本。
   - `modalMemberDataBackdrop` / `modalChangeContractCompanyBackdrop` 加 `data-no-dismiss`，保留原本不吃 backdrop/Escape 關閉的既有行為；cloneNode 產生的 `orderEdit_` 副本也繼承此行為。
   - 訂單處理篩選面板 3 欄斷點從 `lg` 改 `xl`，避免 1024-1279 + sidebar 時 col3 國籍 radio nowrap 爆版。
2. `components/order-edit-modal.md`:
   - 補記 `initCalendar(root)` root-scoped 行為、modal delegated 關閉規則、`data-no-dismiss` 例外。
3. `specs/pages/order-processing.md`:
   - 補記篩選面板斷點裁決：`>=1280px` 才進 3 欄，`<1280px` 用單欄 + accordion；下拉選單 dropdown/offcanvas 仍維持 1024。
   - 補關閉 desktop 篩選面板外殼漸層待確認：PNG 取樣為純色 `#f6fafd`。
4. `start.md` / scripts:
   - Lint 自檢規則補 `./scripts/lint-conventions.sh`。
   - 新增「新規則寫入時的兩個必做動作」：回溯 audit 與機器可判定性評估。
   - 新增 `scripts/lint-conventions.py` / `.sh`，pre-commit hook 同步跑 conventions lint，攔新增行的 decorative Unicode、mobile-unsafe min-width、HTML arbitrary hex、landing.css hardcoded hex。
5. ASCII cleanup:
   - 清掉本輪 touched/new lines 的 decorative arrows / box-drawing / em dash。
   - `components/order-status-pill.md` 的 badge 順序改用 `->`。

### 驗證

- `git diff --check`
- `./scripts/lint-fonts.sh`
- `./scripts/lint-conventions.sh`
- HTML script parse check
- 待 commit 前再跑 staged hook 等同檢查

### 更正 + Batch 6 完成記錄（本 entry 初版誤記 Batch 6 為待辦，實際已完成）

**Batch 6 RWD 收尾已完成**（在 review 修正之前做的，xl 斷點與 body min-width 移除都是 Batch 6 的產出）：

1. 掃描 6 個 viewport（360/375/768/1024/1280/1440），檢查橫向溢出 + 版面模式 + 修改 modal，全數通過
2. **移除 base.css 全域 `body { min-width: 375px }`**（2026-04-14 initial commit 就存在，與 start.md RWD 規則矛盾；360 裝置全站右緣裁切 15px。使用者裁決移除；已回歸抽查房間預定頁 360 表現正常）
3. **篩選面板 3 欄斷點 lg -> xl**（1024-1279 帶 sidebar 時 col3 塞不下國籍 nowrap 列；Figma 未定義此區間，使用者裁決 1280 才進 3 欄）- 即上方「本輪處理」第 1 點所列同一件事，起因是 Batch 6 掃描發現
4. QA 截圖 9 張存 `specs/qa-screenshots/session-74/`（目錄 gitignored，本地驗收材料）
5. 各寬度結果：360/375/768 accordion + bottom sheet + modal 全螢幕（768 視窗化 744px）；1024 accordion + dropdown；1280/1440 三欄 + dropdown，modal 1192px 內部無溢出

**訂單處理頁 Batch 1-6 全部完成**（self-tested + code review 修正完畢，等使用者最終驗收）。

### 下一步

1. 訂單處理頁無剩餘批次；等使用者驗收回饋
2. `CLAUDE.md`（使用者新建，`@start.md` import）下個 session 生效，start.md 將自動載入 context

---

## Session 74 交接 (2026-07-03)

### 任務: 訂單處理 Batch 5（modal 接線 + 訂單修改 modal）+ icons 補充 + tooltip 修正

延續 Session 73（同日）。進度：**Batch 5 完成（self-tested，使用者已逐項回饋修正），僅剩 Batch 6 RWD 系統性收尾**。

### 本輪產出

1. **Batch 5a 下拉選單接線**（preview/landing.html）：
   - 「訂單」-> 既有 `modalOrderSummaryBackdrop`（demo 固定 unpaid variant，實際對應留給後端）；「簡訊」-> 既有 `modalSmsBackdrop`；連結/複製/取消維持只收合（後端）
   - 踩雷：op-row-menu 原本的 `stopPropagation` 擋掉 document 層 delegated handler，改為 closest 檢查式 outside-close
2. **Batch 5b 訂單修改 modal**（`modalOrderEditBackdrop`）：
   - 外殼靜態 HTML（header 訂單修改+還原+close / footer 取消/確定，desktop 1192 / <768 全螢幕）
   - body = `buildOrderEditModalBody()` runtime clone tpl-room-booking [A]-[E]（避免 ~2900 行靜態複製），clone 後 `initSubPageBehaviors(body)` 重綁（已曝露到 window）
   - 差異調整：[A] 標題改「庫存」+ 程式切庫存模式、移除 customer-toggle、cart 頂部插訂單編號列、[D] 插「還原」
3. **[A] 庫存模式鎖定**（使用者指正 spec 初讀「無差異」是錯的）：
   - 無 空房/庫存 切換、無 Excel、無棟別 chips、只剩 訂/餘/保 + 庫存表；月曆按鈕觸發 bottom offcanvas
   - mode toggle/Excel/chips 用 CSS 隱藏（`[data-order-edit-body]` scope）**不可移除 DOM**：共用 calendar JS 用 document.getElementById 解析，移除會 fallback 到 template 副本、污染日後開的房間預定頁
4. **巢狀 modal 權重 + 實例隔離**（使用者要求，已寫入 start.md 規則 + memory）：
   - 子 modal 一律 `orderEdit_` 前綴副本（`ensureOrderEditModalClone()`），不共用房間預定 instance；z 用新 token `--z-modal-layer-2: 65`
   - 配套修正：closeModal/offcanvas close 疊層感知（下層還開著就維持 body scroll 鎖定）、`.modal-close-btn` 改 delegated、動態渲染 modal（加購/房型編輯）clone 前先 reset/render、per-ID modal-box CSS 補 `#orderEdit_` selector（9 條）
   - 庫存月曆 offcanvas 也有專屬副本 `orderEditInvCalendarOffcanvas`，calendar JS 依 grid scope 自動分流
5. **icons 補充**（使用者以 figma-go 提供 Icons master frame）：
   - 匯出 7 顆真缺口：`triangle`（狀態 pill 正牌三角，已替換 arrow-down-drop 代用品）、`order`/`link`/`file-work-history`/`phone`/`yes`/`thumbtack`（**先入庫存著不接**，2026-07-03 使用者確認）
   - `specs/icons.md` 補 8 列（含前批漏登記的 `restore`）
6. **tooltip 視窗夾取**：兩顆 info tooltip 開啟時量測平移、不超出螢幕（手機版 390 驗證）；基準用 `documentElement.clientWidth`（innerWidth 在 mobile 會跟 content overflow 浮動，不可靠）
7. **規則/memory**：start.md 新增「Tooltip 視窗自適應」「Modal 開子 modal」兩段強制規則；memory 新增 `feedback_tooltip_clamp_viewport`、`feedback_nested_modal_scoping`
8. 已補驗關閉：desktop 篩選面板外殼 = 純色 `#f6fafd` 無漸層（PNG 網格取樣）；日期狀態 tooltip 文案 pass 歸後端

### 未完成 / 下一步

1. **Batch 6：RWD 系統性收尾** - 多 viewport 掃 訂單處理 全頁（含修改 modal 內各區塊），唯一剩餘工作
2. 驗收：全部 self-tested，等使用者最終過一輪
3. 已知 demo 限制（記錄於 order-edit-modal.md）：orderEdit_ 副本不接原 id-based 互動 JS（視覺示意 + 原生表單）；訂單明細 unpaid variant 對應留給後端

---

## Session 73 交接 (2026-07-03)

### 任務: 訂單處理 頁面分批實作 Batch 1-4（篩選面板 / tabs+快篩 / 表格+pill / footer 統計）

延續 Session 72 的 spec，開始 HTML 實作。進度：**Batch 1-4 完成（self-tested，待使用者最終驗收），Batch 5-6 未動**。

### 本輪產出

1. `preview/landing.html`：
   - `PAGE_TEMPLATES` 新增 `訂單處理: "tpl-order-processing"`，新 template 塊（搜 `tpl-order-processing`）
   - Batch 1 篩選面板：desktop 3 欄（col1 固定 340px + col2/col3 均分）、mobile(<1024) 收合為「更多條件」accordion（`.op-accordion-gradient` 漸層外殼）；日期狀態 tooltip、國籍外籍連動國家 select（沿用 `.nation-group` 既有機制）
   - Batch 2 tabs+快篩：狀態 tabs 沿用 `.member-data-filter-tab`；快篩 5 顆沿用 `.rb-filter-tab`（circle-selected-yellow 黃底選中），預設不選中、單選、再點取消選取，緊接 tabs 右邊不用 justify-between
   - Batch 3 表格：`.op-table` 全欄位垂直水平置中、9 欄 6 列（含 5-1/5-2 rowspan 子訂單，5-1 不畫底線）、狀態 pill（`.op-status-pill`）+ 下拉選單（`.op-row-menu`，desktop dropdown / mobile offcanvas 同一份 DOM breakpoint 切換）、訂單狀態圖例 tooltip、入住人欄姓名純文字不帶 link（訂購人欄才有 link）
   - Batch 4 footer 統計列：統計 label + 2間/3夜 chips + 加購/房價/總計，三組間大間距 `lg:gap-x-24`
   - JS 皆掛在 `initSubPageBehaviors` 內：quick-filter 切換、op tabs、tooltip click/outside、row menu 開關定位、專案 toggle 文案
2. `preview/assets/css/landing.css`：新增 `.op-table`/`.op-status-pill`/`.op-status-dot`/`.op-badge`/`.op-badge-source`/`.op-row-menu` 系列 + `.op-accordion-gradient`；`.rb-filter-tab` 補 inline-flex 置中（共用 class，棟別 chips 一併受惠）
3. `components/order-status-pill.md`：補 get_node 覆核後的精確數值（pill radius 44/padding 4 10/邊框 Neutral-50；兩種 badge 完整對照表）、badge 垂直順序（pill -> 來源 -> 分類）、rowspan 不畫分隔線規則、來源 badge 讀取陷阱
4. `specs/pages/order-processing.md`：footer 段補精確規格 + 隱藏 timestamp 圖層警告
5. `start.md`：「漸層限制」段擴充為「JSON 不等於視覺」限制（新增 fills key 消失/單邊 stroke/隱藏圖層 3 個模式）；新增「實作前每元素三步驟門檻」（渲染截圖 ground truth -> 查 notes 未驗證標記 -> JSON 只信結構文字）
6. Memory 新增：`feedback_figma_hidden_layer_serialized`（隱藏圖層照樣序列化）、`feedback_implement_screenshot_first`（三步驟門檻）

### 本輪踩雷記錄（全部是使用者發現後修正，檢討見 start.md 新規則）

- 快篩 chips 圓角憑感覺寫 6px，實際是 circle-selected-yellow pill（28px、黃底選中態）
- 表格欄位對齊猜左對齊，實際全部置中；badge 順序（pill/來源/分類垂直排列）也漏了
- 來源 badge（Booking/Agoda）：`strokes:["#f28b45"]` 實際是**只有左邊 2px**（SVG 其餘三邊是零面積退化路徑）；fills key 整個消失，實際是白->Brand-200 對角漸層。SVG export 覆核抓出
- footer 把 Figma **隱藏圖層** timestamp 做出來（get_node 對 visible:false 節點照樣序列化無標記）；PNG 渲染圖比對抓出
- 分類 badge 字級是 16px 不是 12px；來源 badge radius 6 不是全圓角

### 未完成 / 下一步

1. **Batch 5：modal 接線**（最大塊）- 下拉選單「訂單」「簡訊」接既有 `modalOrderSummaryBackdrop`/`modalSmsBackdrop`；「修改」新建訂單修改大 modal（spec: `components/order-edit-modal.md`，只做一般會員版）
2. **Batch 6：RWD 收尾** - 系統性多 viewport 掃全頁
3. ~~待補驗：desktop 篩選面板外殼是否有漸層~~ -> **已補驗（2026-07-03）**：PNG 渲染圖 25x25 網格取樣，背景均勻純色 `#f6fafd` 無漸層，現有實作正確（外殼 = 查詢區大圓角容器，Figma node `shirnk-model-1` 2026:64181）
4. ~~日期狀態 tooltip 9 條說明文字~~ -> **pass（2026-07-03 使用者確認）**：佔位文案維持現狀，真實文案將來由後端實作，前端不再追蹤
5. Batch 5 開工前先對本批元素過 start.md 新的三步驟門檻
