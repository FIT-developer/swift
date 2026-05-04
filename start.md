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
**先做靜默準備**:
- 檢查「專案結構」段落列出的所有資料夾是否存在
- 缺少的直接建立 (不用問我)
**然後請立刻做這些事,不要等我指示**:
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
- **RWD 斷點**: 375px ~768px（小尺寸 mobile） / 769px 以上 ~ 1440px （desktop 尺寸）/ 最高 1440 px 開版
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
**Figma 讀取後必須立刻寫檔**:
- 讀取 component → 立刻寫 `components/{name}.md`
- 讀取 section → 立刻寫 `sections/{name}.md`
- 讀取 layout → 立刻寫 `layouts/{name}.md`
- **不允許只把分析結果顯示在對話中而不寫入檔案**

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
產出 HTML 後,Claude 必須對照對應的規格檔 (components/sections/layouts 下的 .md) 執行自我檢查
並在對話中用 checklist 形式報告結果:
- [ ] **Token 檢查**: 所有顏色/間距/圓角都引用 tokens.md 的 token 名稱,沒有寫死 hex 或任意數值
- [ ] **Icon 檢查**: 所有 icon 都從 `preview/assets/icons/` 引用,沒有自己畫 SVG 或用其他 icon library
- [ ] **RWD 檢查**: 斷點符合 375/768/1440 的規範,且元件在各斷點的行為有實際測試過 (不只是 CSS 寫了就算)
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
- 放元件樣式 (元件樣式一律 inline 在 HTML 裡用 Tailwind class)
- 放頁面特定的樣式

## 程式碼格式化
- HTML 的 Tailwind class 順序由 `prettier-plugin-tailwindcss` 自動處理,
  Claude 不需要手動排序
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
  → 先讀再動
- ❌ 刪除任何 specs/ 底下的檔案
  → 改內容可以,刪檔要我同意
- ❌ 產出 React / Next / 其他框架的 code
  → 這個專案堅持原生 HTML + Tailwind CDN

## 進度同步（每次任務完成後立刻執行）
每完成一個 spec 或實作，立刻更新 `specs/progress.md`：
- 將完成項目移到「已完成」表格（含日期）
- 更新「進行中」狀態
- 更新「下一步應做」

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

