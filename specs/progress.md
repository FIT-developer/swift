# Progress — 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。

---

## 當前狀態

**階段**：實作進行中（specs ✅ → landing.html 🔄）

**當前任務**：`preview/landing.html` 持續修正中，桌面與行動版皆在同一檔案。

**Figma 當前頁面**：Landing page - 0414 extend frame

---

## 已完成

| 項目 | 檔案 | 完成日期 |
|---|---|---|
| Design Tokens | `specs/assets/tokens.md` | 2026-04-13 |
| Icon System（87 個） | `specs/icons.md` + `preview/assets/icons/*.svg` | 2026-04-13 |
| menu component | `components/menu-Specification.md` | 2026-04-13 |
| 開發規則 | `start.md` | 2026-04-13 |
| Order component | `components/order-Specification.md` | 2026-04-13 |
| System notifications component | `components/system-notifications-Specification.md` | 2026-04-13 |
| Revenue trends section | `components/revenue-trends-Specification.md` | 2026-04-13 |
| Card component | `components/card-Specification.md` | 2026-04-13 |
| Input component | `components/input-Specification.md` | 2026-04-13 |
| Statistics section | `components/statistics-Specification.md` | 2026-04-13 |
| Folder component | `components/folder-Specification.md` | 2026-04-13 |
| Mobile layout | `layout/mobile-Specification.md` | 2026-04-13 |
| Mobile top section（Frame 25） | `section/mobile-top-Specification.md` | 2026-04-13 |
| Mobile System notifications section | `section/mobile-system-notifications-Specification.md` | 2026-04-13 |
| Mobile Revenue trends section | `section/mobile-revenue-trends-Specification.md` | 2026-04-13 |
| Mobile Statistics section | `section/mobile-statistics-Specification.md` | 2026-04-13 |
| Mobile floatIcons/ai section | `section/mobile-float-ai-Specification.md` | 2026-04-13 |
| chartjs - diverging preview HTML | `preview/chartjs-diverging.html` | 2026-04-14 |
| chartjs - doughnut preview HTML | `preview/chartjs-doughnut.html` | 2026-04-14 |
| Desktop layout spec | `layout/desktop-Specification.md` | 2026-04-14 |
| Desktop Order status section spec | `section/desktop-order-status-Specification.md` | 2026-04-14 |
| Desktop System notifications section spec | `section/desktop-system-notifications-Specification.md` | 2026-04-14 |
| Desktop Revenue trends section spec | `section/desktop-revenue-trends-Specification.md` | 2026-04-14 |
| Desktop Statistics section spec | `section/desktop-statistics-Specification.md` | 2026-04-14 |
| start.md 修正（Figma 讀取後必須立刻寫檔、交接寫入 progress.md） | `start.md` | 2026-04-14 |
| Texts component | `components/texts-Specification.md` | 2026-04-13 |
| Title component | `components/title-Specification.md` | 2026-04-13 |
| Logo component | `components/logo-Specification.md` | 2026-04-13 |
| Select component | `components/select-Specification.md` | 2026-04-13 |
| Select content component | `components/select-content-Specification.md` | 2026-04-13 |
| Dropdown aside component | `components/dropdown-aside-Specification.md` | 2026-04-13 |
| Function icons component | `components/function-icons-Specification.md` | 2026-04-13 |
| Customers service component | `components/customers-service-Specification.md` | 2026-04-13 |
| Account component | `components/account-Specification.md` | 2026-04-13 |
| Tooltips component | `components/tooltips-Specification.md` | 2026-04-13 |
| Button Y/N component | `components/button-yn-Specification.md` | 2026-04-13 |
| Modal component | `components/modal-Specification.md` | 2026-04-13 |
| Bulletin - vendor component | `components/bulletin-vendor-Specification.md` | 2026-04-13 |
| Bulletin - Administer component | `components/bulletin-administer-Specification.md` | 2026-04-13 |
| Pagination component | `components/pagination-Specification.md` | 2026-04-13 |
| Color/Tab/Yellow token | `specs/assets/tokens.md` | 2026-04-13 |

---

## 進行中

| 項目 | 狀態 | 備註 |
|---|---|---|
| HTML 實作 | ⬜ 未開始 | 所有 spec 已就緒，待指示開始 |

---

## 重要決定紀錄

| 日期 | 決定 | 原因 |
|---|---|---|
| 2026-04-13 | 技術棧：HTML + Tailwind CDN + 原生 JS，禁止 build step | 現階段簡單可維護 |
| 2026-04-13 | 主色用 `Color/Surface/Brand-500-Default` token 引用，不寫死 hex | 主色未定案，滾動調整 |
| 2026-04-13 | Color/Text/* 與 Color/Neutral/* 維持拆分 | 各有元件綁定，合併風險高 |
| 2026-04-13 | Radius/* 維持保留 | 各有元件使用 |
| 2026-04-13 | 不做 Typography Token | 已用 Texts component nest 達到同等效果 |
| 2026-04-13 | icons 命名：rase→eraser、person2→person-md、system(方形圓圈)→operation-system、during→duration、helps→help、point→cursor | 語意更明確 |
| 2026-04-13 | Title 元件字重統一為 SemiBold 600 | Figma 舊版為 400，0116 版已統一，以新版為準 |
| 2026-04-13 | Order 寬度為 fill（w-full），非舊版固定 172px | 舊版容器較窄所致，實作用 w-full |
| 2026-04-13 | Card variant 命名 "tend up" 為拼字錯誤，應為 "trend up" | Figma 端建議修正，不影響實作 |
| 2026-04-13 | Input attached-link 的 icon slot 在 component 定義中是 icons/close 佔位，實際 swap 使用 | MCP 回傳 resolved 值，需對照 instance 實際使用情境 |
| 2026-04-13 | Chart 圖表色從 Bootstrap token 分離，建立獨立 Color/Chart/* group | 語意獨立，避免混用 |
| 2026-04-13 | Color/Scrollbar/Default = #D9D9D9，非 Figma variable，HTML 自動生成不需引用 | 捲動條由瀏覽器渲染，Figma 視覺稿用 |
| 2026-04-13 | Mobile 範圍：375px–768px；desktop：769px+ | 最小寬度 375px，無更小尺寸 |

---

## 新增的 Tokens（本輪）

| Token | Hex | 說明 |
|---|---|---|
| Color/Accent/Green | `#34C759` | 綠色 chip（Input Green variant） |
| Color/Chart/blue | `#86B7FE` | 圖表藍色系列 |
| Color/Chart/purpleRed | `#FF0BD6` | 圖表紫紅色系列（折線） |
| Color/Chart/green | `#34C759` | 圖表綠色系列 |
| Color/Scrollbar/Default | `#D9D9D9` | 捲動條（視覺稿用，HTML 自動） |

---

## 待辦（依 start.md 分層順序）

### Components 層 ✅ 全部完成
- [x] menu、Order、System notifications、Card、Input、Folder
- [x] Texts、Logo、Select、Select content、Dropdown aside、Title
- [x] Customers service、Account、Tooltips、Button Y/N、Modal
- [x] Bulletin - vendor、Bulletin - Administer、Pagination、Function icons
- [x] chartjs - bar、chartjs - line（spec md 完成）
- [x] chartjs - diverging、chartjs - doughnut（preview HTML 完成，spec md 待補）

### Sections 層 ✅ 全部完成
- [x] Mobile：mobile-top、mobile-system-notifications、mobile-revenue-trends、mobile-statistics、mobile-float-ai
- [x] Desktop：desktop-order-status、desktop-system-notifications、desktop-revenue-trends、desktop-statistics

### Layout 層 ✅ 全部完成
- [x] `layout/mobile-Specification.md`
- [x] `layout/desktop-Specification.md`

### 實作層 ⬜ 未開始
- [ ] desktop layout HTML（`preview/desktop.html`）
- [ ] mobile layout HTML（`preview/mobile.html`）

---

## 未解問題

| 問題 | 狀態 |
|---|---|
| `Color/Surface/Secondary`（#F9E616 鮮黃）語意未確認 | ⬜ 待問 |
| `Color/Surface/Accent`（#42EBE9 青色）語意未確認 | ⬜ 待問 |
| `Spacing/18`、`Spacing/76` 非 4px 格線，用途未說明 | ⬜ 待問 |
| doughnut 官網圖例（#2ACA18）vs 扇形（#34C759）不一致 | ✅ 已對應不同 token，設計端未修正 |
| chartjs - line 圖例框（#F44DF4）vs 折線（#FF0BD6）同系不同值 | ✅ 各有獨立 token |

---

## 交接筆記區

### 本次進度交接（2026-04-14 session 2）

**已完成**：
- `preview/landing.html` 產出（desktop + mobile 單一檔案，Chart.js 4 動態圖表）
- Component 修正同步（從 Figma 讀取）：
  - `folder.svg` 建立（原缺失）
  - Customers service：icon 改 `service.svg`、layout 改垂直（QR 上、資訊下）、字體 16px、email 修正為 `service@bbnet.gmail.com`、人名 紅彤林→紅樹林
  - File download：icon 改 `download.svg`、字體 16px、日期 2018-09-06、layout 修正
  - Float icons/ai：內部 icon 尺寸 `w-5→w-6`
- Title icon 全面替換（從 desktop/mobile canvas 讀取）：
  - 訂單快覽 → `order-info.svg`
  - 營業資訊 → `dashboard.svg`
  - 統計圖表 → `chart.svg`
  - 客服 → `service.svg`（已含上述）、檔案 → `download.svg`
- 客服 QR Code 圖片：`assets/images/service_line.png` 儲存，HTML 已替換
- Revenue trends Card 4 更新（0414 frame）：今日超賣 → 平均客房收益，值 170，trend-down-green
- Card 1 Input 文字：「昨日比較」→「日營收」
- Account icon gap 修正：`gap-1(4px)` → `gap-3(12px)`
- Sidebar collapse 功能實作：
  - fold 按鈕點擊 → sidebar 變橫向 compact bar（logo / 使用者名稱 / 登出 / 切換 / Folder）
  - root wrapper 切換為 `flex-col`，main content 自動全寬展開
  - compact bar 右端 folder 按鈕可展開回原始 240px 側欄

**進行中**：
- landing.html 視覺細節持續對齊 Figma

**下一步應做**：
1. 瀏覽器測試 sidebar collapse 行為（desktop）
2. 確認 mobile AI 浮動按鈕是否需在 desktop 也顯示（Figma desktop frame 中有 floatIcons/ai at x:1372）
3. chartjs-diverging / chartjs-doughnut component spec md 補齊（目前只有 preview HTML）
4. 確認 Color/Surface/Secondary (#F9E616)、Color/Surface/Accent (#42EBE9) 語意
5. 確認 Spacing/18、Spacing/76 用途

**重要決定**：
- desktop + mobile 合併在 `preview/landing.html` 單一檔案，使用 `md:` breakpoint 區分
- Sidebar collapse 為橫向 compact bar（非隱藏）：保留外框與關鍵元素
- Chart.js 4 動態渲染，非靜態圖片

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- desktop 版 floatIcons/ai 是否也應顯示（目前 `md:hidden`）

---

### 本次進度交接（2026-04-14）

**已完成**：
- 讀取 chartjs-diverging、chartjs-doughnut，產出 preview HTML（`preview/chartjs-diverging.html`、`preview/chartjs-doughnut.html`）
- 讀取 Desktop Landing page - 0116，完整解析結構、token、間距
- 產出 `layout/desktop-Specification.md`
- 產出 desktop section specs × 4（order-status、system-notifications、revenue-trends、statistics）
- 確認 mobile sections × 5 昨天已完成，無需重做
- 修正 `start.md`：新增「Figma 讀取後必須立刻寫檔」規則 + 交接改為直接寫入 progress.md（不再依賴使用者手動貼上）
- 建立記憶系統（`MEMORY.md` + 3 個 memory 檔案），修補跨 session 記憶漏失問題

**進行中**：
- 無

**下一步應做**：
1. 開新 session，讀取 `start.md` 跑開工 checklist
2. 讀 `layout/desktop-Specification.md` + 所有 `section/desktop-*` + 相關 component specs
3. 實作 `preview/desktop.html`（desktop 完整版型）
4. 實作 `preview/mobile.html`（mobile 完整版型）
5. 補齊 `components/chartjs-diverging-Specification.md` 與 `components/chartjs-doughnut-Specification.md`（目前只有 preview HTML）

**重要決定**：
- `start.md` 已更新：Figma 讀取後必須立刻寫入 `.md`，不允許只顯示在對話中
- 交接筆記改為 Claude 直接寫入 `progress.md`，不再依賴使用者貼上
- Memory 系統已建立，下個 session 開始時會自動載入專案背景

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- chartjs-diverging / chartjs-doughnut 的 component spec md 尚未正式產出（只有 preview HTML）
- desktop Statistics 右下角 doughnut 旁的留白是否為預留空間？設計意圖未確認

---

### 本次進度交接（2026-04-13）

**已完成**：
- tokens.md 新增 Color/Accent/Green、Color/Chart/* × 3、Color/Scrollbar/Default
- 完成 components：Order、System notifications、Revenue trends（FRAME）、Card、Input、Statistics（FRAME）
- 確認 Title 字重統一為 SemiBold 600
- 確認 Mobile 斷點：375–768px

**進行中**：
- Mobile 佈局 frame 讀取（Figma 已選取，MCP 回傳資料超過 token 上限，正在分段讀取）

**下一步應做**：
1. 分段讀取 mobile 佈局 frame（用 Bash + jq 從暫存檔解析）
2. 產出 `layout/mobile-Specification.md`
3. 進入 sections 層：讀取各 section 組合，產出 `section/*.md`
4. 最終產出 HTML 預覽

**重要決定**：
- Mobile 最小寬度 375px，無更小尺寸
- 769px+ 為 desktop，稍後另行處理
- 內容與 desktop 相同，差異在佈局

**未解問題**：
- Mobile 佈局資料過大，讀取中
