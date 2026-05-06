# Start — 開發規則

> 本文件為此設計系統專案的總規則，所有 component / section / layout 的生成與維護皆遵循此規範。

---

## 專案結構

Figma/
├── start.md ← 本文件，開發規則入口
├── components/ ← 各獨立元件規格 (e.g., button.md)
├── sections/ ← 區塊組合規格 (e.g., desktop-statistics.md)
├── layouts/ ← 頁面佈局規格 (e.g., desktop.md)
├── specs/
│ ├── progress.md ← 核心：當前進度、決策、交接紀錄
│ ├── icons.md ← 核心：Icon 系統語意對照表
│ └── assets/
│ └── tokens.md ← 核心：Design Tokens (色彩、間距、圓角)
└── preview/
├── *.html ← 實作產出 (e.g., landing.html)
└── assets/
├── icons/ ← SVG 檔案庫
├── images/ ← 靜態圖檔 (如 QR Code)
└── css/
└── base.css ← 全域樣式 (Scrollbar, Tailwind Reset 等)

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
**名稱**: swift — 房間預訂系統後台 
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
**分層實作順序**:
tokens → icons → components → sections → layout → 實作
上游沒做完,下游不動。
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
- Figma selection 中的 currently selected / active visual state 不可自動推論為 default state；如果 active state 可能只是為了展示、檢查某個 variant、或讀取特規 layout，必須列為疑點並詢問使用者。
- 實作後的驗證必須包含 contract-specific checks；不可只跑 script parse / duplicate id / diff check。
- 需要寫檔時：
  - component → `components/{name}.md`
  - section → `sections/{name}.md`
  - layout → `layouts/{name}.md`

**Figma MCP 漸層限制**:
- `get_node` / `get_design_context` 只序列化純色 paint
- 漸層 **stroke** → 靜默省略（`styles.strokes` 欄位消失，無任何提示）
- 漸層 **fill** → 回傳佔位符 `"s1"` 而非 hex
- 遇到上述情況，立刻補一步 `save_screenshots(format: SVG)`，從 SVG `<defs>` 讀取完整漸層定義再實作
**粒度原則**:
- 複雜元件分開做,不要一次實作整頁
- 每個區塊做完立刻產預覽 HTML,存到 preview/ 資料夾
- 預覽用 `python3 -m http.server 8000 --directory preview` 背景執行
- 第一次跑需要我授權,選 "always allow",之後不再問
- 一次實作不超過一個 section
**決策原則**:
- 不確定時問我,不要猜
- Figma 沒定義的狀態標記為「未定義」,不要腦補
- 發現規格有漏洞時先停下來告訴我
- 若使用者提出的 HTML/CSS 實作方向在技術上不生效或不可靠，先停下說明原因與可行替代方案，不要為了執行指令而硬做一版明知不可靠的改法
**RWD 衝突處理**:
當元件與佈局出現 RWD 衝突時:
1. 先查 `components/{元件名}.md` 看該元件是否定義了對應斷點行為
2. 有定義 → 照該檔案執行
3. 沒定義 → 中止開發,通知我去 Figma 補該元件的 RWD 規格
4. 絕不自己決定元件在不同斷點該怎麼變

## 檔案地圖
所有設計權威來源,優先順序由上到下:
1. **specs/assets/tokens.md** — Design tokens (色彩/間距/圓角/字體)
   - 單一檔案,所有設計變數的唯一權威
   - 顏色必須來自 Figma Variables；若 `specs/assets/figma-variables.json` 有新匯出內容，需如實轉換進 tokens.md 後才能在 HTML/CSS/JS 使用
   - 實作前至少讀 token 使用規則；只有在改顏色、間距、圓角、字體、effect 或新增對應值時，才讀相關 token section
   - 只有使用者說 Figma Variables 有變動或要求同步時，才重新同步 / 比對完整 tokens
2. **specs/icons.md** + **preview/assets/icons/** — Icon 系統
   - icons.md 是 icon 語意對應表
   - 實體 SVG 放在 preview/assets/icons/
3. **components/{name}.md** — 元件規格 (每個元件獨立檔案)
   - 例如 components/toggle.md, components/input.md
   - 檔名一律 kebab-case
   - 查詢元件規格時先找這個資料夾
4. **sections/{name}.md** — 區塊組合規格 (每個區塊獨立檔案)
   - 區塊會引用 components/ 的元件
   - 區塊層級的排版與互動
5. **layouts/{name}.md** — 頁面骨架 (每個頁面獨立檔案)
   - 整頁的主框架、RWD 行為
   - 引用 sections/ 組成完整頁面
6. **specs/progress.md** — 當前進度與決策紀錄
   - 單一檔案,做到哪、為什麼這樣決定
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

## 產出驗證 (每個 HTML 完成後必做)
產出 HTML 後,AI agent / Codex 必須對照對應的規格檔 (components/sections/layouts 下的 .md) 執行自我檢查
並在對話中用 checklist 形式報告結果:
- [ ] **Token 檢查**: 所有顏色/間距/圓角都引用 tokens.md 的 token 名稱,沒有寫死 hex 或任意數值
- [ ] **Icon 檢查**: 所有 icon 都從 `preview/assets/icons/` 引用,沒有自己畫 SVG 或用其他 icon library
- [ ] **RWD 檢查**: 採流動寬度與 responsive constraints；375px 僅作為 Figma mobile 參考稿寬度，不得固定寫死，且元件在任務指定 viewport 的行為有實際測試過 (不只是 CSS 寫了就算)
- [ ] **狀態完整性**: Spec 裡定義的所有狀態 (hover/active/disabled/error 等) 都有實作,沒有漏掉
- [ ] **文字內容**: 繁體中文內容跟 Figma 一致,沒有自動翻譯或改寫
**任何一項不通過,必須修正後重新報告,直到全部通過**。
報告時用實際內容,不要用「已完成」「沒問題」這種籠統回答。
例如錯的寫法: "Token 檢查: 已完成"
對的寫法: "Token 檢查: 使用了 Color/Surface/Brand-500-Default,
Spacing/16, Radius/8,全部引用自 tokens.md"

## 全域樣式
**非 Token 的全域樣式**放在 `preview/assets/css/base.css`,
這個檔案在所有 preview HTML 的 `<head>` 用 `<link>` 引入。
**base.css 只負責 Tailwind 處理不到的東西**:
- 自訂 scrollbar 樣式
- 選取文字顏色 (`::selection`)
- 字體平滑化 (`-webkit-font-smoothing`)
- 系統對話框樣式
- 列印樣式 (`@media print`)
**不要**在 base.css 裡:
- 重新定義 Tailwind 已經有的 utility
- 放元件樣式 (元件樣式優先用 Tailwind class；Tailwind 無法表達時，使用 scoped CSS class)
- 放頁面特定的樣式

**HTML / CSS style 規則**:
- 禁止任意 inline style 與 hard-coded color / spacing / radius / font value。
- 顏色、間距、圓角、字體等可 token 化的值，必須先在 `specs/assets/tokens.md` 有對應，再透過 CSS variable 或 Tailwind semantic class 使用。
- 單一 preview 頁面或元件專用、Tailwind 不好表達的樣式，可放在該 HTML 的 `<style>`，但必須用明確 scoped class（例如 `.room-edit-price-table`），不可散落 inline style。
- 若 AI agent 判斷某個效果必須使用 inline style 或非 token 固定值，必須先向使用者報告原因、替代方案、影響差異，取得同意後才可使用，並把差異寫入對應 spec 或 `specs/progress.md`。

## 程式碼格式化
- HTML 的 Tailwind class 順序由 `prettier-plugin-tailwindcss` 自動處理,
  AI agent / Codex 不需要手動排序
- 格式化前後的 diff 只影響 class 順序,不影響功能

## 禁區
絕對不要做的事:
- ❌ 在 components / sections / layout 實作中寫死 hex 值
  → 一律用 tokens.md 定義的 token 名稱
- ❌ 套用非 Figma Variables 來源的顏色
  → Figma 沒有定義的顏色先停下來問使用者，不可用近似色或 Tailwind 預設色代替
- ❌ 在 Figma 未定義的狀態下自己畫 hover / disabled / error
  → 標記「Figma 未定義」,問我要不要補
- ❌ 產出內容時省略重複 (例如用 "其他卡片同上" 帶過)
  → 全部完整寫出,token 壓力大就分段做
- ❌ 沒讀過 tokens.md / icons.md 就開始實作
  → 先讀使用規則與相關章節再動；不需要每次全量重讀或同步
- ❌ 任意加入 inline style 或 hard-coded design value
  → 先使用 token / CSS variable / Tailwind semantic class；例外必須先報告並取得同意
- ❌ 刪除任何 specs/ 底下的檔案
  → 改內容可以,刪檔要我同意
- ❌ 產出 React / Next / 其他框架的 code
  → 這個專案堅持原生 HTML + Tailwind CDN

## 進度同步（每次任務完成後立刻執行）
每完成一個 spec 或實作，立刻更新 `specs/progress.md`：
- 在檔案最上方新增最新 Session 交接
- 記錄：已完成、驗證、下一步應做、重要決定、未解問題
- 若只是小修，也要記錄會影響下一輪判斷的決策或規則變更

## 疲勞與交接
當你出現以下任一情況時,請主動停下工作並告知我:
1. context 使用超過 70% (如果 UI 顯示得到)
2. 你發現自己開始省略、跳步、或重複同樣的錯誤
3. 連續多輪對話後感覺回應品質下降
4. 遇到複雜度超出當前對話負擔的任務
**停下時，將本次進度寫入 `specs/progress.md` 的「交接筆記區」**，格式如下:

### 本次進度交接
**已完成**:
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
6. [ ] 我回答要 → 讀 Figma variables 跟 tokens.md 比對,
      產出 diff 給我確認
      我回答不要 → 直接進入實際工作
7. [ ] 等我確認 OK,才開始實際工作

**不要跳過任何一步**。
