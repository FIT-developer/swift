# Start - 開發規則

> 本文件為此設計系統專案的總規則，所有 component / section / layout 的生成與維護皆遵循此規範。

## 輸出格式 (Output formatting)

Please avoid using special Unicode characters, emoji, box-drawing characters, or decorative symbols in your responses. Use plain ASCII only.

- 適用範圍: chat 回覆與寫入 .md / spec / code comment 的文字
- CJK (中文) 字元仍可使用, 因為是正常內容
- 不可使用: emoji, check mark, warning sign, arrow glyph, bullet glyph, table box-drawing, 任何裝飾性符號
- 改用純文字: "OK", "warning", "->", "-", "*"
- 表格用標準 markdown pipe `|` 即可, 不用 box-drawing
- 任何 ASCII 可表達的概念都應該用 ASCII; 裝飾性 update icon 改寫 "update" 或 "changed", check mark 改 "OK", warning sign 改 "warning", arrow glyph 改 "->"
- 既有歷史交接內容可保留到被編輯時再清理; 新增或本輪有修改的 .md / spec / code comment 必須符合本規則。

---

## 專案結構

Figma/
- start.md: 本文件, 開發規則入口
- components/: 各獨立元件規格 (e.g., button.md)
- sections/: 區塊組合規格 - frozen-reference, 新頁面不再使用
- layouts/: 頁面佈局規格 - frozen-reference, 新頁面不再使用
- specs/
  - progress.md: 核心, 當前進度、決策、交接紀錄
  - pages/: 頁面規格 (現行做法, e.g., order-processing.md)
  - html-conventions.md: HTML/CSS 實作慣例
  - icons.md: 核心, Icon 系統語意對照表
  - assets/
    - tokens.md: 核心, Design Tokens (色彩、間距、圓角)
- preview/
  - *.html: 實作產出 (e.g., landing.html)
  - assets/
    - icons/: SVG 檔案庫
    - images/: 靜態圖檔 (如 QR Code)
    - css/
      - base.css: 全域樣式 (Scrollbar, Tailwind Reset 等)
      - app.css: 跨頁共用元件與頁面樣式

---

## 讀完這份檔案後
若這是在新對話啟動階段，先遵守 repo root 的 `AGENTS.md`：用簡短摘要說明目前任務與會影響當前請求的限制，不要重複完整開工 checklist。

**先做靜默準備**:
- 檢查「專案結構」段落列出的所有資料夾是否存在
- 缺少的直接建立 (不用問我)
**若不是新對話啟動階段，且使用者要求讀完規則後進入工作，請立刻做這些事，不要等我指示**:
1. 用一句話總結你理解的這個專案
2. 告訴我 progress.md 顯示的當前任務是什麼
3. 問我:「要開工跑 checklist,還是繼續某個已在進行的工作?」

**不要在讀完後就停下來等指令**。主動報告理解、主動引導下一步。

## 專案 swift
**名稱**: swift - 房間預訂系統後台
**類型**: 複雜 SaaS dashboard,繁體中文介面（將來會新增英文，至少二個語系）
 **主要使用者**: 飯店櫃檯 / 業務人員 
**技術棧**:
- 目前階段: HTML + Tailwind CDN + 原生 JS
- 未來階段: 切換到 local Tailwind 並做客製化設定 (時機未定)
- **當前不要**使用任何需要 build step 的特性
  (例如 @apply、plugin、custom utility)
- **RWD 原則**: 375px 是目前 Figma mobile 參考稿寬度，不代表產品最小支援寬度。實作必須採流動寬度與 responsive constraints，不可把 UI 寫死為固定 375px；實際 QA viewport 依任務指定，可包含 360 / 375 / 768 / 1440。最高 1440px 開版。
**字體**: Noto Sans TC（全語系適用）
**主色**: 尚未定案,採滾動式調整。
實作時一律引用 tokens.md 的 `Color/Surface/Brand-500-Default`,
主色值變動時只改 tokens.md 一處,所有實作自動跟上。

## 工作方法論
這個專案採用 **Spec-driven AI development**:
- 先寫規格 (md),再實作 (HTML)
- 規格是權威,實作是規格的投影
- 發現規格不清楚時,先補規格,再實作
- 不要在實作階段自己腦補規格沒講的東西
**分層實作順序**（2026-05 中之後的現行 3 層做法）:
tokens -> icons -> components -> specs/pages -> 實作
上游沒做完,下游不動。（舊 5 層的 sections/layouts 已 frozen，見檔案地圖）
**Figma 讀取與寫檔 checkpoint**:
- 使用者說 `figma-go` 時，代表先讀目前 Figma selection / frame / section / component。
- `figma-go` 預設流程為三階段：
  1. **Read**：只回報 node id、名稱、尺寸、結構、明確觀察與疑點。
  2. **Spec checkpoint**：列出準備寫入 spec 的規則，先等使用者確認或修正。
  3. **Write + implement**：使用者確認後，才寫入 spec 並開始實作。
- 若使用者明確說「只讀」「不要寫 code」「還沒讀完」，只可讀取與回報，不可寫 spec 或實作。
- 若使用者明確說「figma-go 然後實作」「照這個 plan 做」或已提供明確實作 plan，才可讀完後補 spec 並實作。
- 不可用記憶或推測實作 Figma 來源內容；必須以當前 Figma node 與已確認 spec 為來源。
- 讀完 Figma 後，必須先整理一份 **implementation contract**，至少列出：
  - node id / node name / frame size
  - 內容順序、文字、active/default state
  - layout 結構、主要 spacing、border、radius、typography、color token
  - 特規互動、hidden/variant state、疑點與未定義項目
- 實作前必須做 **舊 HTML/spec vs Figma contract 差異 checkpoint**：
  - 明確列出「沿用」、「以 Figma 覆蓋」、「衝突 / 需使用者確認」。
  - 舊 HTML 只能作為現有實作參考，不可覆蓋已確認的 Figma contract。
  - 若 Figma 沒有覆蓋某段內容，而需要沿用舊 HTML/spec，必須先明講沿用範圍與原因。
  - 若舊 HTML/spec 和 Figma contract 衝突，先停下來回報，不可直接用舊 HTML 補齊。
- 為避免 spec 污染，當輪最新 Figma contract + 使用者確認事項是實作來源；舊 spec / 舊 HTML / Figma history 只能標為 reference 或沿用範圍，不可靜默升格為 current source。
- 若發現舊 spec 範例含 hard-coded color、inline style、過期 default state、或與最新 contract 不一致，先列入「規格污染 / 待清理」並回報；不要複製到新實作。
- 當同一元件存在多個歷史版本，必須在 spec checkpoint 明確標出 current version 的 node id / read date / confirmed defaults；未標 current 的舊段落不得作為實作依據。
- Figma selection 中的 currently selected / active visual state 不可自動推論為 default state；如果 active state 可能只是為了展示、檢查某個 variant、或讀取特規 layout，必須列為疑點並詢問使用者。
- 實作後的驗證必須包含 contract-specific checks；不可只跑 script parse / duplicate id / diff check。
- 需要寫檔時：
  - component -> `components/{name}.md`
  - page -> `specs/pages/{name}.md`
  - （sections/ 與 layouts/ 已 frozen，不再新增）

**Figma MCP「JSON 不等於視覺」限制**（get_node / get_selection / get_design_context 皆適用）:
- `get_node` / `get_design_context` 只序列化純色 paint
- 漸層 **stroke** -> 靜默省略（`styles.strokes` 欄位消失，無任何提示）
- 漸層 **fill** -> 回傳佔位符 `"s1"` 而非 hex；**也可能整個 `fills` key 直接消失**，連佔位符都沒有
- **單邊 stroke** -> `strokes:["#hex"]` 看起來像四邊框，實際可能只有一邊（tab underline、badge 左邊框都出過）
- **隱藏圖層（visible:false）** -> 照樣完整序列化、無任何標記，跟可見節點無法區分
- 對策：漸層用 `save_screenshots(format: SVG)` 讀 `<defs>`；單邊框與隱藏圖層用 `get_screenshot` / `save_screenshots(PNG)` 渲染圖比對，JSON 有、圖上沒有的節點不要實作
**粒度原則**:
- 複雜元件分開做,不要一次實作整頁
- 每個區塊做完立刻產預覽 HTML,存到 preview/ 資料夾
- 預覽用 `python3 -m http.server 8000 --directory preview` 背景執行
- 第一次跑需要我授權,選 "always allow",之後不再問
- 一次實作不超過一個 section

**頁面架構（2026-07-03 起強制，詳見 specs/page-architecture.md）**:
- **landing.html = dashboard-only**：只承載今日總覽；不再新增頁面 template、
  modal、大段 JS。房間預定與訂單處理已拆成獨立頁，後續頁面也一律獨立
  html
- 新頁面一律獨立 html 檔 + `partials/` 共用區塊 + `js/` 原生 ES modules
  （公司要求「原生」；原生不等於單檔，ES modules 與 fetch partial 都是
  瀏覽器原生能力，已實測與 Tailwind Play CDN 相容）
**決策原則**:
- 不確定時問我,不要猜
- Figma 沒定義的狀態標記為「未定義」,不要腦補
- 發現規格有漏洞時先停下來告訴我
- 若使用者提出的 HTML/CSS 實作方向在技術上不生效或不可靠，先停下說明原因與可行替代方案，不要為了執行指令而硬做一版明知不可靠的改法
**RWD 衝突處理**:
當元件與佈局出現 RWD 衝突時:
1. 先查 `components/{元件名}.md` 看該元件是否定義了對應斷點行為
2. 有定義 -> 照該檔案執行
3. 沒定義 -> 中止開發,通知我去 Figma 補該元件的 RWD 規格
4. 絕不自己決定元件在不同斷點該怎麼變

## 檔案地圖
所有設計權威來源,優先順序由上到下:
1. **specs/assets/tokens.md** - Design tokens (色彩/間距/圓角/字體)
   - 單一檔案,所有設計變數的唯一權威
   - 顏色必須來自 Figma Variables；若 `specs/assets/figma-variables.json` 有新匯出內容，需如實轉換進 tokens.md 後才能在 HTML/CSS/JS 使用
   - 實作前至少讀 token 使用規則；只有在改顏色、間距、圓角、字體、effect 或新增對應值時，才讀相關 token section
   - 只有使用者說 Figma Variables 有變動或要求同步時，才重新同步 / 比對完整 tokens
2. **specs/icons.md** + **preview/assets/icons/** - Icon 系統
   - icons.md 是 icon 語意對應表
   - 實體 SVG 放在 preview/assets/icons/
3. **components/{name}.md** - 元件規格 (每個元件獨立檔案)
   - 例如 components/toggle.md, components/input.md
   - 檔名一律 kebab-case
   - 查詢元件規格時先找這個資料夾
4. **specs/pages/{name}.md** - 頁面規格 (2026-05 中之後的現行做法)
   - 整頁的佈局、區塊組成、RWD 斷點行為，直接引用 components/
   - 例如 specs/pages/room-booking.md, specs/pages/order-processing.md
5. **specs/html-conventions.md** - HTML/CSS 實作慣例 (跨頁通用的元件寫法)
6. **sections/{name}.md** + **layouts/{name}.md** - status: frozen-reference
   - dashboard 時期 (2026-05-07 前) 的 5 層分層產物，之後的頁面一律走
     specs/pages/ + components/ 的 3 層做法
   - 各檔頭已標 frozen-reference，不可作為新實作依據
7. **specs/progress.md** - 當前進度與決策紀錄
   - 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
   - archive 內的決策可能已被推翻，一律以 progress.md 最新 session 為準
**衝突處理**: 如果 Figma 和 md 檔衝突,先停下來問我,不要自己決定。
**檔案命名規範**:
- 一律 kebab-case (例如 bulletin-administer.md, sidebar-default.md)
- 不加 "Specification" 後綴 (資料夾位置已經說明了它是什麼)
- 舊檔案修改前，請先儲存目前工作進度再進行 rename
- 先前定義在後綴加上 Sepcification 的命名規則已不再適用，因為已經由各資料夾分流

## 多語系策略
**當前階段**: 直接硬編碼繁體中文,不建立 i18n 機制。
**但為了未來能順利抽離,寫 HTML 時遵守**:
- 所有面向使用者的文字寫在「文字內容節點」裡,
  不要寫在 `title`、`alt`、`placeholder` 混用的地方
- 避免把文字用 CSS `content:` 偽元素產生
- 避免把文字用 JS 動態拼接 (例如 `"您有 " + n + " 筆訂單"`),
  改用完整字串模板 (例如 `"您有 {n} 筆訂單"`)
- 避免圖片內嵌文字,文字應該是真實的 DOM 節點

## 產出驗證 (每個 HTML 產出後必做)
產出 HTML 後,AI agent / Codex 必須對照對應的現行規格檔
(`components/` 與 `specs/pages/` 下的 .md；`sections/` 與 `layouts/` 只作
frozen-reference) 執行自我檢查
並在對話中用 checklist 形式報告結果:
- [ ] **Token 檢查**: 所有顏色/間距/圓角都引用 tokens.md 的 token 名稱,沒有寫死 hex 或任意數值
- [ ] **Icon 檢查**: 所有 icon 都從 `preview/assets/icons/` 引用,沒有自己畫 SVG 或用其他 icon library
- [ ] **RWD 檢查**: 採流動寬度與 responsive constraints；375px 僅作為 Figma mobile 參考稿寬度，不得固定寫死，且元件在任務指定 viewport 的行為有實際測試過 (不只是 CSS 寫了就算)
- [ ] **Font-size 檢查**: 沒有 < 12px 字體（`text-[10/11px]`、`font-size: <12px`）；用 `text-xs/sm/base/lg/xl` 或 `var(--font-size-*)`
- [ ] **min-width mobile-safe 檢查**: 所有 fixed `min-w-[Npx]` 都有 `md:` 前綴或包 `@media (min-width: 768px)`；不得讓 mobile 強制大於 viewport
- [ ] **Lint 自檢**: 跑 `./scripts/lint-fonts.sh`、`./scripts/lint-conventions.sh` 和 `./scripts/lint-partials.sh`（commit 前 hook 會自動跑，另含 lint-tokens），exit 0 才算通過。conventions lint 只檢查新增行：ASCII-only / min-w 斷點前綴 / CSS min-width gate（合法例外加 `/* min-width-ok: 原因 */` 標記）/ hardcoded hex。partials lint 檢查每頁 partial/module manifest 與組合後 duplicate id / modal target（新頁面必須登記進 `scripts/lint-partials.py` 的 MANIFEST）
- [ ] **Browser smoke test**: 改動頁面 / partial / js module 後跑 `node scripts/smoke-test.mjs`（三頁載入 console 無錯、chart 非空、aside drawer/accordion、session 與 topbar modal 開關），exit 0 才算通過；不進 pre-commit hook（需 Chrome、秒數級），屬手動 QA 步驟
- [ ] **狀態完整性**: Spec 裡定義的所有狀態 (hover/active/disabled/error 等) 都有實作,沒有漏掉
- [ ] **文字內容**: 繁體中文內容跟 Figma 一致,沒有自動翻譯或改寫
**任何一項不通過,必須修正後重新報告,直到全部通過**。
報告時用實際內容,不要用「已完成」「沒問題」這種籠統回答。
例如錯的寫法: "Token 檢查: 已完成"
對的寫法: "Token 檢查: 使用了 Color/Surface/Brand-500-Default,
Spacing/16, Radius/8,全部引用自 tokens.md"

## 流程守則（防腦補與品管）

這些是跨任務通用的工作流程規則，每個 AI agent 都要遵守：

### 不自稱完成
- 在 chat / final / 驗證報告中, 不要說「已完成」「都對了」「沒問題」這種狀態斷言。改用: `verified`（dev 端 self-test pass）、`self-tested`、`pending review`、`待你驗收`
- `progress.md` 交接可記錄客觀產出, 欄位名稱用「本輪改動」或「本次處理」, 不用「已完成」作為狀態保證。
- 視覺類功能必須主動跑多角度截圖（mobile/tablet/desktop viewport + state variations）給使用者驗收
- 驗收前不可進入下一個 task，不可 commit

### 讀 Figma 的硬性檢查
- **必驗 styles.fills / strokes**：不從前例假設顏色；每個 Figma node 都要從當前 selection 的 styles 抓 hex，再對照 `tokens.md` 翻 token 名
- **selection 防漏三動作**：
  1. 讀完 root 後列 children checklist（編號 / id / name / type / size）
  2. 對 spec 中已記錄的 frame 做 cross-check（有沒有漏 read）
  3. 若 selection JSON 過大被 truncate，用 Python 強制 iterate 取得每個 child，不可只看 root summary
- **腦補偵測點**：寫實作前自問「這個樣式 / 數值 / 結構是 Figma 給的還是我推測的？」若是推測，先停下回報為「未定義」

### 新規則寫入時的兩個必做動作
規則只寫進 .md 擋不住違規（實作時注意力在任務上，規則會輸給就地模仿既有 code 的本能）。每次新增/修訂規範時必須同時做：
1. **回溯 audit**：拿新規則掃一遍既有 code，違規處列清單回報（歷史教訓：min-width 規則 2026-05-09 寫入時沒掃舊 code，base.css 的 `body min-width:375px` 帶病生存到 2026-07-03 的 360 QA 才現形）
2. **評估機器可判定性**：規則若能用 grep/diff 判定（字元集、命名模式、數值範圍），寫進 `scripts/lint-conventions.sh` 讓 pre-commit hook 攔截；不能機器判定的才留給 .md + review

### 實作前每元素三步驟門檻（分批實作時每批開工前逐一過，不因趕進度跳過）
1. 對本批每個新視覺元素（chip/badge/pill/容器底色框線等）抓 `get_screenshot` 或 `save_screenshots(PNG)` 渲染圖當 ground truth，樣式一律以渲染圖為準
2. 回查 reading notes / spec 中該元素的「未驗證」「待確認」標記；有標記就先驗證再實作，不可照「很可能是」的猜測直接做
3. JSON 只拿結構、文字、bounds；fill / stroke / 圓角必須跟渲染圖交叉比對（JSON 說謊模式見上方「JSON 不等於視覺」段）
- 沿用既有 class（chip/tab 等通用 pattern）的前提是 Figma 節點確認為同一個 component instance；否則一律當新元素走三步驟

### Variant 先讀 parent spec
- 新 variant 不可從 Figma raw bottom-up 推，否則會重複父層規格
- 先讀通對應 `components/{parent}.md` 共用段（外框、padding、typography、colors）
- 在 variant spec 只記錄與 parent 不同的差異點，引用 parent spec 連結

### 橫向 scroll
- chip / tab 容器超寬時用 `flex-nowrap overflow-x-auto`，依賴瀏覽器原生 scrollbar
- 不主動加 fade mask、不加 indicator chevron、不自訂 scrollbar 樣式
- chip / tab 元素本身要 `flex-shrink: 0` + `white-space: nowrap`

### Tooltip 視窗自適應（強制）
- tooltip / popover 內容**必須完整顯示在螢幕內，不可超出任何一邊的螢幕邊緣**（手機版尤其必現：trigger 靠右 + 固定寬 panel）
- 固定錨點（如 `absolute left-0`）+ 固定寬度的 panel 一律在**開啟時量測夾取**：超出視窗就平移回可視範圍（左右各留 12px 邊距），每次開啟重算
- 夾取基準用 `document.documentElement.clientWidth`，**不可用 `window.innerWidth`**：emulated/真機 mobile 下 innerWidth 會跟著 content overflow 浮動，不可靠
- 參考實作：訂單處理頁 `.op-tooltip-trigger` 開啟 handler（`preview/js/order-processing.js`）

### Modal 開子 modal（巢狀 modal，強制）
- **權重**：子 modal 必須蓋在父 modal 之上（動態 z-index 60 + N*5，任意深度成立）；父 modal 維持開啟於下層，關閉子層時 body scroll 維持鎖定（疊層感知，見 `closeModal`）
- **舊 SPA 歷史規則，不作為新實作依據**：若同一 document 曾同時存在多個情境共用同一批 modal，才需要前綴副本（如 `orderEdit_`）與 per-ID 分流；這套做法已隨拆頁退役
- **multi-page 架構（現行）不需要副本**：每頁獨立 document，共用 partial 的 modal 只有單一 instance、單一情境，直接 openModal 動態 z-index 疊層即可（Stage 1d 已依此退役 landing 的 orderEdit_ clone 機制，見 specs/page-architecture.md）
- 參考實作：`components/order-edit-modal.md` 「巢狀 modal 規則」段、`preview/js/order-modals.js`

### JS 搬移/略搬 audit（Stage 1d 教訓，強制）
- 搬頁面或 modal 時若決定「略過」某段 JS，必須先列出該段內全部 event bindings
  （grep `addEventListener` / `onclick` / delegated `closest` target），
  逐一標記 disposition：搬 / 不搬（附理由：不可達或使用者同意範圍外）/ 需補
- 「關閉」是 modal 的基本行為，永遠不在可略過範圍：原實作會關閉 modal 的任何
  按鈕（不論走 `.modal-close-btn` 或 JS handler），搬移後行為必須等價
- 驗證不可抽樣：每個搬過來的 modal，header 與 footer 的每一顆按鈕都要逐顆實測
  （點了會不會關、該不該關），不能只挑一條會過的關閉路徑就回報通過
- 機器可判定性：binding 清單可用 grep 產出，但 disposition 判斷需比對行為，
  無法寫進 lint；此規則靠 checklist + review 執行
- 歷史教訓：1d 略搬 arrival IIFE 未列 binding 清單，footer「確定」的 closeModal
  被靜默丟掉，由使用者發現（Session 84）

### QA 截圖路徑
- 截圖存到 `specs/qa-screenshots/session-{N}/`，N = 當前 session 編號（讀 `progress.md` 確認）
- 不可散落 `specs/qa-screenshots/` 根目錄
- 命名格式：`{feature}-{state}-{viewport}.png`（如 `member-data-modal-foreign-1440.png`）

## 元件 conventions 與可復用 UI patterns

已整段移至 `specs/html-conventions.md`（2026-07-04 B3 瘦身）。
實作元件前必讀該檔：外層 padding、pill chip、黃藍語意、lock toggle、
checkbox 三色、toggle switch、filter tab、modal delegation pattern 等
跨頁通用規格都在那裡；新 pattern 也一律登記在該檔，不要加回本檔。

---

## 全域樣式
**非 Token 的全域樣式**放在 `preview/assets/css/base.css`,
這個檔案在所有 preview HTML 的 `<head>` 用 `<link>` 引入。
**base.css 只負責 Tailwind 處理不到的東西**:
- 自訂 scrollbar 樣式
- 選取文字顏色 (`::selection`)
- 字體平滑化 (`-webkit-font-smoothing`)
- 系統對話框樣式
- 列印樣式 (`@media print`)
- Typography token：`:root` 定義 `--font-size-min/sm/base/lg/xl`（12/14/16/18/20px），`body` 預設 `font-size: var(--font-size-base)`。詳見 `specs/assets/tokens.md` 的字體 / Font-size 規範
**不要**在 base.css 裡:
- 重新定義 Tailwind 已經有的 utility
- 放元件樣式 (元件樣式優先用 Tailwind class；Tailwind 無法表達時，使用 scoped CSS class)
- 放頁面特定的樣式

**HTML / CSS style 規則**:
- 禁止任意 inline style 與 hard-coded color / spacing / radius / font value。
- 顏色、間距、圓角、字體等可 token 化的值，必須先在 `specs/assets/tokens.md` 有對應，再透過 CSS variable 或 Tailwind semantic class 使用。
- 字體大小：**全域最小 12px**，禁用 `text-[10px]`、`font-size: 10px`、`text-[11px]` 等 < 12px 的寫法。用 `text-xs/text-sm/text-base/text-lg/text-xl` 或 `var(--font-size-min/sm/base/lg/xl)`。違規由 `scripts/lint-fonts.sh` + git pre-commit hook 自動攔截。
- Mobile RWD：`min-width` 不得寫死 fixed 值。所有 `min-w-[Npx]` 需 `md:` 前綴（如 `md:min-w-[280px]`）或包 `@media (min-width: 768px)`；偏好寬度用 `basis-[Npx]` 不用 hard min。原因：iOS Safari 對 fixed `min-width` 在窄 viewport 不會 shrink/wrap，會直接溢出，且 Chrome devtools mobile mode 看不出來（Blink != iOS WebKit）。
- 單一 preview 頁面或元件專用、Tailwind 不好表達的樣式，可放在該 HTML 的 `<style>`，但必須用明確 scoped class（例如 `.room-edit-price-table`），不可散落 inline style。
- 若 AI agent 判斷某個效果必須使用 inline style 或非 token 固定值，必須先向使用者報告原因、替代方案、影響差異，取得同意後才可使用，並把差異寫入對應 spec 或 `specs/progress.md`。

## 程式碼格式化
- HTML 的 Tailwind class 順序由 `prettier-plugin-tailwindcss` 自動處理,
  AI agent / Codex 不需要手動排序
- 格式化前後的 diff 只影響 class 順序,不影響功能

## 禁區
絕對不要做的事:
- NO: 在 components / sections / layout 實作中寫死 hex 值
  - 一律用 tokens.md 定義的 token 名稱
- NO: 套用非 Figma Variables 來源的顏色
  - Figma 沒有定義的顏色先停下來問使用者，不可用近似色或 Tailwind 預設色代替
- NO: 在 Figma 未定義的狀態下自己畫 hover / disabled / error
  - 標記「Figma 未定義」,問我要不要補
- NO: 產出內容時省略重複 (例如用 "其他卡片同上" 帶過)
  - 全部完整寫出,token 壓力大就分段做
- NO: 沒讀過 tokens.md / icons.md 就開始實作
  - 先讀使用規則與相關章節再動；不需要每次全量重讀或同步
- NO: 任意加入 inline style 或 hard-coded design value
  - 先使用 token / CSS variable / Tailwind semantic class；例外必須先報告並取得同意
- NO: 寫 < 12px 的字體（`text-[10px]`、`font-size: 10px`、`text-[11px]` 等）
  - 全域最小 = `text-xs` (12px)；用 Tailwind utility 或 `var(--font-size-min/sm/base/lg/xl)`。pre-commit hook 會擋
- NO: 寫死的 `min-width: Npx` 在 mobile context 沒有 mobile-gate
  - `min-w-[280px]` 必須是 `md:min-w-[280px]`；或改用 `basis-[Npx]` 讓 mobile 可 shrink。違反的話 iOS Safari 會直接溢出 viewport（Chrome devtools 看不出來）
- NO: 刪除任何 specs/ 底下的檔案
  - 改內容可以,刪檔要我同意
- NO: 產出 React / Next / 其他框架的 code
  - 這個專案堅持原生 HTML + Tailwind CDN
- NO: Commit / push 沒有使用者明確指示
  - 修完就 commit & push 是自作主張；使用者打「commit & push」/「推」才動作

## 進度同步（每次任務收尾時立刻執行）
每處理完一個 spec 或實作，立刻更新 `specs/progress.md`：
- 在檔案最上方新增最新 Session 交接
- 記錄：本輪改動、驗證、下一步應做、重要決定、未解問題
- 若只是小修，也要記錄會影響下一輪判斷的決策或規則變更
- **每個 commit 後立即同步**，不要累積到 session 末才補。漏更新 progress.md 等同於沒做交接

## commit & push flow（強制順序）
當使用者打「commit & push」（或同義 keyword）時，**先做交接、再 commit、再 push**，一次性 flow，不要分階段等使用者再次確認：

1. **寫 / 更新 `specs/progress.md`** - 在檔案最上方新增本次 Session 段（本輪改動 / 驗證 / 重要決定 / 未解問題）
2. **`git add`** - staging 本次改動的檔案，含 `specs/progress.md`
3. **`git commit`** - commit message 包含主要修改說明
4. **`git push origin main`** - push 到遠端

只打「commit」不打「push」、或只說「push」不說「commit」時，沿用其字面意思，不擴張為完整 flow。
若 session 中已經事先寫過 progress.md 該段，不需重寫，直接 staging 既有變更 commit。

> **Why 強制這順序**: 之前曾連續多個 commit 漏寫 progress.md，其他 AI agent 接手時無法從 progress.md 得知上下文，必須翻 git log 推測，浪費 context 與容易再次腦補。Progress.md 必須與 git history 同步。

**交接時還要 audit 三份規範檔是否同步**（漏一份就有 drift 風險）：
- `specs/progress.md`：本輪完成、決策、未解問題
- `specs/assets/tokens.md`：若新增 / 修改 token（顏色、字體、間距、圓角等）
- `start.md`：若新增 / 修改開發規則、禁區、產出驗證、全域樣式
- 完成 commit 前自問：「這次改動有 implicit rule 是未來開發要遵守的嗎？」有的話 start.md 必補

## 疲勞與交接
當你出現以下任一情況時,請主動停下工作並告知我:
1. context 使用超過 70% (如果 UI 顯示得到)
2. 你發現自己開始省略、跳步、或重複同樣的錯誤
3. 連續多輪對話後感覺回應品質下降
4. 遇到複雜度超出當前對話負擔的任務
**停下時，將本次進度寫入 `specs/progress.md` 的「交接筆記區」**，格式如下:

### 本次進度交接
**本輪改動**:
- (條列今天完成的具體項目)
**進行中**:
- (正在做但還沒完成的事)
**下一步應做**:
- (按順序列出接下來該做的事，越具體越好)
**重要決定**:
- (這輪對話中做過的、下一輪需要知道的決策)
**未解問題**:
- (還沒有答案、需要我決定的事)
**不要只顯示在對話中**，直接寫入檔案，下個 context 才能讀到。

## 任務 checklist 分級

### Full Start Checklist
當使用者說「開工」「開始工作」「新 component」「新 section」「從 Figma 實作」或任務需要讀 Figma 並產出新規格 / 新實作時，執行完整開工 checklist。

### Light Task Checklist
當使用者直接指定小修、文字修正、單一 HTML/CSS/JS bug、或要求分析文件時，不跑完整開工 checklist，但必須保留必要流程：
1. 確認會動到哪些檔案。
2. 若改 UI，先查對應 spec。
3. 若改 token 類值，讀 `tokens.md` 使用規則與相關 section。
4. 修改完成後更新 `specs/progress.md`，至少記錄會影響下一輪的規則或決策。
5. 跑必要驗證（例如 inline scripts parse、duplicate id、`git diff --check`、本機 preview 200 OK）。

## 開工 checklist
每次我說「開工」或「開始工作」時,依序執行:
1. [ ] 確認 figma-mcp-go 已連線 (呼叫 get_metadata 驗證)
2. [ ] 確認目前 Figma 頁面:
    - 讀 progress.md 的「當前任務」
    - 告訴我「你應該要在 Figma 的 XXX 頁」
    - 如果我回覆「對」就繼續
    - 如果我回覆「不對」或沒切到那頁,停下來等我處理
3. [ ] 讀 progress.md,告訴我「上次做到哪、這次要做什麼」
4. [ ] 列出這次任務預計會動到哪些檔案
5. [ ] 問我:「這次開工要不要同步 tokens?
         (如果我最近有改 Figma variables 才需要)」
6. [ ] 我回答要 -> 讀 Figma variables 跟 tokens.md 比對,
      產出 diff 給我確認
      我回答不要 -> 直接進入實際工作
7. [ ] 等我確認 OK,才開始實際工作

**不要跳過任何一步**。
