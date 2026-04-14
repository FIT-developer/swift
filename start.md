# Start — 開發規則

> 本文件為此設計系統專案的總規則，所有 component / section / layout 的生成與維護皆遵循此規範。

---

## 專案結構

```
Figma/
├── start.md              ← 本文件，開發規則入口
├── components/           ← 各 component 的 Specification.md
├── section/              ← 由多個 component 組合而成的區塊規格
├── layout/               ← 完整頁面佈局規格
├── specs/
│   ├── icons.md          ← Icon 系統清單與規範
│   └── assets/
│       └── tokens.md     ← Design Tokens（色彩、間距、圓角）
└── preview/
    └── assets/
        └── icons/        ← 匯出的 SVG icon 檔案
```

---

## 讀完這份檔案後
請立刻做這些事,不要等我指示:
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
- 讀取 component → 立刻寫 `components/{name}-Specification.md`
- 讀取 section → 立刻寫 `section/{name}-Specification.md`
- 讀取 layout → 立刻寫 `layout/{name}-Specification.md`
- **不允許只把分析結果顯示在對話中而不寫入檔案**
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
1. 先查 components.md 該元件是否定義了對應斷點行為
2. 有定義 → 照 components.md 執行
3. 沒定義 → 中止開發,通知我去 Figma 補該元件的 RWD 規格
4. 絕不自己決定元件在不同斷點該怎麼變

## 檔案地圖
所有設計權威來源,優先順序由上到下:
1. **specs/assets/tokens.md** — 色彩/間距/圓角/字體的唯一權威
   - 任何顏色都必須用這裡的 token 名稱,不可寫死 hex
   - 需要 hex 值時在此查
2. **specs/assets/icons.md** — Icon 系統
   - 所有 icon 從 ./assets/icons/ 引用
   - 查詢 icon 語意對應先看這裡
3. **specs/components.md** — 元件規格字典
   - 元件的狀態、變體、互動邏輯
   - 實作元件前必讀對應章節
4. **specs/sections.md** — 區塊組合規格
   - 各區塊如何用 components 組合
   - 區塊層級的排版與互動
5. **specs/layout.md** — 頁面骨架
   - 整頁的主框架、RWD 行為
6. **specs/progress.md** — 當前進度與決策紀錄
   - 做到哪、為什麼這樣決定
**衝突處理**: 如果 Figma 和 md 檔衝突,先停下來問我,不要自己決定。

## 禁區
絕對不要做的事:
- ❌ 在 components / sections / layout 實作中寫死 hex 值
  → 一律用 tokens.md 定義的 token 名稱
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
2. [ ] 確認目前在正確的 Figma 頁面 (根據 progress.md 的當前任務)
3. [ ] 重新讀取 Figma variables,與 tokens.md 比對
   - 有差異時產出 diff 給我,等我確認才更新
   - 無差異時直接進下一步
4. [ ] 讀 progress.md,告訴我「上次做到哪、這次要做什麼」
5. [ ] 列出這次任務預計會動到哪些檔案
6. [ ] 等我確認 OK,才開始實際工作
**不要跳過任何一步**。即使我說「快點開始」,也要先跑完 checklist。


