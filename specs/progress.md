# Progress — 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。

---

## 當前狀態

**階段**：實作進行中（specs ✅ → landing.html 🔄）

**當前任務**：`preview/landing.html` 持續修正中，桌面與行動版皆在同一檔案。

**Figma 當前頁面**：Function buttons Interactions - administer（`194:6726`）

---

## Session 6 交接（2026-04-15）

### 本次完成

| 項目 | 說明 |
|---|---|
| Modal C — Bulletin vendor JS 補完 | 開啟觸發、tab 切換、row 展開/收合 |
| Modal D — Bulletin Administer 新增 | `icons/message` 觸發，9 tabs，4 欄表格，雙列預設展開，mobile 滿版 |
| Modal A/B mobile 尺寸確認 | 原設計大小置中（不滿版） |
| Table 格線規範 | 僅行間水平線，無垂直線，最後一行無底線，header 保留 `bg-[#fef6ee]` |
| Tab / 控制按鈕列規範 | `whitespace-nowrap` + `w-max` + `overflow-x-auto` 包層 |
| Modal 內 Search Input 規範 | mobile `flex-col` / `w-full`，sm+ 並排 `w-[124px]` |
| 展開內文規範 | div row group，data 行各自 `overflow-x-auto`，展開內文在外側自然填滿 |
| `specs/html-conventions.md` 新建並持續更新 | 全站 HTML 實作規範文件 |

### 尚未實作

| 項目 | 說明 |
|---|---|
| 其餘 function icons | `icons/person-md`、`icons/system` 對應 modal 尚未讀取 |
| Sidebar sub-item 選中切換 | 目前僅靜態 CSS |
| Logo click | 回後台首頁行為 |
| Main nav hover state | 視覺反饋 |

### 重要規則提醒

- **任何 modal 實作前**：詢問 mobile 滿版或原設計大小
- **展開內文**：div row group，不放進 `min-w-max` 表格
- **全站 HTML 規範**：見 `specs/html-conventions.md`

---

## 已完成

| 項目 | 檔案 | 完成日期 |
|---|---|---|
| Design Tokens | `specs/assets/tokens.md` | 2026-04-13 |
| Icon System（87 個） | `specs/icons.md` + `preview/assets/icons/*.svg` | 2026-04-13 |
| menu component | `components/menu.md` | 2026-04-13 |
| 開發規則 | `start.md` | 2026-04-13 |
| Order component | `components/order.md` | 2026-04-13 |
| System notifications component | `components/system-notifications.md` | 2026-04-13 |
| Revenue trends section | `components/revenue-trends.md` | 2026-04-13 |
| Card component | `components/card.md` | 2026-04-13 |
| Input component | `components/input.md` | 2026-04-13 |
| Statistics section | `components/statistics.md` | 2026-04-13 |
| Folder component | `components/folder.md` | 2026-04-13 |
| Mobile layout | `layouts/mobile.md` | 2026-04-13 |
| Mobile top section（Frame 25） | `sections/mobile-top.md` | 2026-04-13 |
| Mobile System notifications section | `sections/mobile-system-notifications.md` | 2026-04-13 |
| Mobile Revenue trends section | `sections/mobile-revenue-trends.md` | 2026-04-13 |
| Mobile Statistics section | `sections/mobile-statistics.md` | 2026-04-13 |
| Mobile floatIcons/ai section | `sections/mobile-float-ai.md` | 2026-04-13 |
| chartjs - diverging preview HTML | `preview/chartjs-diverging.html` | 2026-04-14 |
| chartjs - doughnut preview HTML | `preview/chartjs-doughnut.html` | 2026-04-14 |
| Desktop layout spec | `layouts/desktop.md` | 2026-04-14 |
| Desktop Order status section spec | `sections/desktop-order-status.md` | 2026-04-14 |
| Desktop System notifications section spec | `sections/desktop-system-notifications.md` | 2026-04-14 |
| Desktop Revenue trends section spec | `sections/desktop-revenue-trends.md` | 2026-04-14 |
| Desktop Statistics section spec | `sections/desktop-statistics.md` | 2026-04-14 |
| start.md 修正（Figma 讀取後必須立刻寫檔、交接寫入 progress.md） | `start.md` | 2026-04-14 |
| Texts component | `components/texts.md` | 2026-04-13 |
| Title component | `components/title.md` | 2026-04-13 |
| Logo component | `components/logo.md` | 2026-04-13 |
| Select component | `components/select.md` | 2026-04-13 |
| Select content component | `components/select-content.md` | 2026-04-13 |
| Dropdown aside component | `components/dropdown-aside.md` | 2026-04-13 |
| Function icons component | `components/function-icons.md` | 2026-04-13 |
| Customers service component | `components/customers-service.md` | 2026-04-13 |
| Account component | `components/account.md` | 2026-04-13 |
| Tooltips component | `components/tooltips.md` | 2026-04-13 |
| Button Y/N component | `components/button-yn.md` | 2026-04-13 |
| Modal component | `components/modal.md` | 2026-04-13 |
| Bulletin - vendor component | `components/bulletin-vendor.md` | 2026-04-13 |
| Bulletin - Administer component | `components/bulletin-administer.md` | 2026-04-13 |
| Pagination component | `components/pagination.md` | 2026-04-13 |
| Color/Tab/Yellow token | `specs/assets/tokens.md` | 2026-04-13 |
| 資料夾結構正規化 + spec 檔案 rename | 全部 `*-Specification.md` → `*.md`；`section/`→`sections/`；`layout/`→`layouts/` | 2026-04-15 |

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
| 2026-04-15 | Modal backdrop 全站統一 `rgba(0,0,0,0.4)`，z-index 60；Figma 的 #d9d9d9 Subtract 僅為設計稿交付示意，不對應 HTML 色值 | 見 `components/modal.md` |
| 2026-04-15 | Modal mobile 尺寸規則：個別設定，施作前詢問；Bulletin modal mobile 滿版，Modal A/B 原設計大小置中 | 見 `specs/html-conventions.md` |
| 2026-04-15 | Table 格線規範：僅行間水平線，無垂直分隔，最後一行不加底線（下方有 border-t 元素時）；header 保留 `bg-[#fef6ee]` | 見 `specs/html-conventions.md` |
| 2026-04-15 | 展開內文用 div row group + 各自 overflow-x-auto；不放進 min-w-max 表格；文字自然向下流動 | 見 `specs/html-conventions.md` |
| 2026-04-15 | Tab 列：whitespace-nowrap + w-max + overflow-x-auto；Search input：mobile w-full / sm+ w-[124px] | 見 `specs/html-conventions.md` |

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

### 本次進度交接（2026-04-15 session 5）

**已完成**：
- 讀取 Figma `Menu states - Interactions`（`194:3863`）：
  - 解析 3 個 menu 互動狀態：hover tooltip、登出 modal flow、帳號切換 modal flow
  - 解析 7 個 Tooltip 標注（確認 md 系列為設計稿專用，不實作）
  - 解析 2 個 Modal instance（確定登出 / 帳號切換）
- 更新規格文件：
  - `components/menu.md`：新增「## Interactions」完整互動規格區段
  - `components/tooltips.md`：新增 md 系列設計稿標注說明，明確標示不實作到 HTML
  - `components/dropdown-aside.md`：修正子項目文字色（`#454545` → `#2178cf`）、選中背景（`#e1e1e0` → 透明顯示 `#f7d275`）
- 確認 `components/modal.md`、`components/button-yn.md` 已完整，不需重讀
- `preview/landing.html` 實作兩個 modal 互動：
  - Desktop sidebar / compact bar / mobile panel 的 logout、switch icon 加 ID
  - Desktop sidebar logout icon 加 hover tooltip（dark `#4f4f4f`，箭頭向下）
  - Modal A「確定登出？」：header + body + 取消/確定 footer，水平垂直置中
  - Modal B「帳號切換」：header + 暱稱 Select + 密碼 Input + 取消/確定 footer
  - 關閉方式：close button、取消按鈕、backdrop click、Escape 鍵
- 資料夾正規化（session 4 已完成，本次確認無遺漏）

**進行中**：
- landing.html 互動功能持續補齊，對應 Menu states - Interactions 規格

**下一步應做**：
1. 讀取 Account component（`components/account.md` 可能需補充 hover / tooltip 狀態）
2. 讀取 Dropdown aside 互動規格（sub-item click → selected state 切換邏輯）
3. 確認 landing.html 的 sub-item 點擊是否實作 selected state 切換（目前只有靜態 CSS）
4. 繼續補齊其他按鈕互動（logo click、主項目 hover state）
5. chartjs-diverging / chartjs-doughnut component spec md 補齊

**重要決定**：
- Tooltips `md` 系列（md up/down/left/right）確認為設計稿標注用，不實作到 HTML
- Modal 置中：`position: fixed; inset: 0; display: flex; align-items: center; justify-content: center`
- 三個觸發點（desktop sidebar / compact bar / mobile panel）共用同一 modal，用 ID 統一管理

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- desktop 版 floatIcons/ai 是否也應顯示
- logo click 是否需要實際連結（目前純視覺）

---

### 本次進度交接（2026-04-15 session 4）

**已完成**：
- `preview/landing.html` 補齊 mobile sidebar modal function icons：
  - 新增 `Function icons` 列（bulletin / message / person-md / system），位於 modal header 與 account row 之間
  - badge 值依 Figma "Landing page (mobile) - 0414 menu modal"：bulletin=99、message=0、person-md=99+、system=99+
  - 四圖示 `justify-around`，橙色 `#EF6F25` badge，底部 border 分隔 account 區
- 資料夾結構正規化（依 start.md 規範）：
  - 所有 `*-Specification.md` → `*.md`（移除多餘後綴）
  - `section/` → `sections/`（改為複數，符合 start.md 專案結構）
  - `layout/` → `layouts/`（改為複數，符合 start.md 專案結構）
  - 舊的空資料夾 `section/`、`layout/` 已刪除
- `specs/progress.md` 所有檔案路徑已同步更新

**進行中**：
- landing.html 視覺細節持續對齊 Figma

**下一步應做**：
1. 瀏覽器測試 desktop sidebar collapse/expand + mobile modal 行為
2. 確認 mobile AI 浮動按鈕是否在 desktop 也需顯示（目前 `md:hidden`）
3. chartjs-diverging / chartjs-doughnut component spec md 補齊
4. 確認 Color/Surface/Secondary (#F9E616)、Color/Surface/Accent (#42EBE9) 語意

**重要決定**：
- spec 檔案命名：一律不加 `-Specification` 後綴，資料夾分層已足夠說明語意
- 資料夾使用複數：`sections/`、`layouts/`（與 start.md 專案結構一致）

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- desktop 版 floatIcons/ai 是否也應顯示

---

### 本次進度交接（2026-04-14 session 3）

**已完成**：
- `preview/landing.html` 佈局重構與功能實裝：
  - **Select 實裝**：兩個 `<button>` 改為真正的 `<select>` 元素（desktop sidebar + mobile panel），各有 3 個假字選項
  - **Accordion 實裝**：系統操作中有 `down.svg` 的項目（主項目二、三、五）改為真正展開/收起 accordion，圖示旋轉 180° 回饋；主項目一、四、六 維持 `right.svg` 連結
  - **客服 / 檔案**：維持靜態顯示（確認不做 accordion）
  - **Layout 結構重構**：
    - `rootWrap` 改為 `flex flex-col gap-3 p-3`（移除 `absolute` 定位 aside，12px 邊距自然由 flex 提供）
    - `aside` 改為 flow 中的 flex item（`hidden md:flex w-[240px]`），不再 absolute
    - `bodyArea`（`flex flex-col md:flex-row gap-3`）讓 aside 與 main 間有 12px gap
    - `desktopTopRow`（`hidden md:flex items-center`）內 `sidebarCompact`（左）+ `topWrap ml-auto`（右），實現收折後自然 flex-between
    - Mobile topbar 改為 `flex justify-between`（logo 左、menu 按鈕右）
  - **Sidebar 收折 bug 修正**：
    - 舊版 `expand()` 直接 `remove('hidden')` 導致 mobile 寬度下 sidebar 殘留
    - 改為 `@media (min-width:768px) { #sidebar.md-collapsed { display: none !important } }`
    - JS 只操作 `md-collapsed` class，`hidden` 永遠保留（保護 mobile 隱藏）
  - **Mobile panel** 補齊客服 / 檔案區塊

**進行中**：
- landing.html 視覺細節持續對齊 Figma

**下一步應做**：
1. 瀏覽器測試 desktop sidebar collapse/expand 行為
2. 確認 mobile AI 浮動按鈕是否在 desktop 也需顯示（目前 `md:hidden`）
3. chartjs-diverging / chartjs-doughnut component spec md 補齊
4. 確認 Color/Surface/Secondary (#F9E616)、Color/Surface/Accent (#42EBE9) 語意

**重要決定**：
- Compact bar（收折後頂部列）不顯示 select，只保留 logo / elaon999 / 登出 / 切換 / 展開按鈕
- Sidebar 的 mobile/desktop 可見性分離：`hidden` 管 mobile，`md-collapsed` 管 desktop 收折

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- desktop 版 floatIcons/ai 是否也應顯示

---

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
