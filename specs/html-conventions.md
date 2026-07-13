# HTML 實作規範（全站通用）

> 本文件記錄全站 HTML 實作的共用規範，適用於所有頁面與元件。  
> 每條規範須經 UI 確認後方可寫入。

---

## Table 格線規範

**確認日期**：2026-04-15

### 規則

| 位置 | 格線 | 說明 |
|---|---|---|
| 欄與欄之間（垂直線） | **無** | 不加 `border-r` |
| 行與行之間（水平線） | **有** `border-b border-border-disabled` | 加在 `<tr>` 上 |
| 最後一行底線 | **無** | 若下方緊鄰已有 `border-t` 的元素（如 footer），最後一個 `<tr>` 移除 `border-b` |
| Header 底線 | **有** `border-b border-border-disabled` | 加在每個 `<th>` 上 |
| Header 底色 | **保留** `bg-brand-50` | 加在 `<tr>` 上 |
| Table 外框 | **無** | `<table>` 不加外框 |

### 標準寫法

```html
<table class="text-sm text-text-default border-collapse min-w-max w-full">
  <thead>
    <tr class="bg-brand-50 text-left font-semibold">
      <th class="px-3 py-2 border-b border-border-disabled whitespace-nowrap">欄位一</th>
      <th class="px-3 py-2 border-b border-border-disabled whitespace-nowrap">欄位二</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-border-disabled hover:bg-border-default transition-colors">
      <td class="px-3 py-2 whitespace-nowrap">資料</td>
      <td class="px-3 py-2 whitespace-nowrap">資料</td>
    </tr>
    <!-- 最後一行不加 border-b -->
    <tr class="hover:bg-border-default transition-colors">
      <td class="px-3 py-2 whitespace-nowrap">資料</td>
      <td class="px-3 py-2 whitespace-nowrap">資料</td>
    </tr>
  </tbody>
</table>
```

### Overflow 規範（搭配使用）

- 外層容器加 `overflow-x-auto`，確保窄螢幕可水平滾動
- `<table>` 加 `min-w-max`，防止欄位被壓縮
- 所有 `th` / `td` 加 `whitespace-nowrap`，禁止儲存格內文字自動換行

---

## Tab / 控制按鈕列規範

**確認日期**：2026-04-15

### 規則

- 按鈕加 `whitespace-nowrap`，防止文字換行
- 按鈕以 `w-max` 的 flex 容器包住，再外包一層 `overflow-x-auto flex-1 min-w-0`，小尺寸水平滑動

### 標準寫法

```html
<div class="flex-1 min-w-0 overflow-x-auto">
  <div class="flex border border-border-disabled rounded-md overflow-hidden text-sm text-text-default w-max">
    <button class="px-3 py-1.5 bg-tab-yellow border-r border-border-disabled font-medium whitespace-nowrap">選中</button>
    <button class="px-3 py-1.5 bg-white hover:bg-surface-default border-r border-border-disabled whitespace-nowrap">未選中</button>
    <button class="px-3 py-1.5 bg-white hover:bg-surface-default whitespace-nowrap">未選中</button>
  </div>
</div>
```

---

## Modal 內 Search Input 規範

**確認日期**：2026-04-15

### 規則

- **mobile**：與 tabs 上下層，`w-full`
- **`sm:` 以上**：與 tabs 並排，`w-[124px]`
- Tabs + Search 外層容器：`flex flex-col sm:flex-row sm:items-center gap-2`

### 標準寫法

```html
<div class="px-3 pt-3 pb-2 flex flex-col sm:flex-row sm:items-center gap-2">
  <!-- Tab 列 -->
  <div class="flex-1 min-w-0 overflow-x-auto">
    <div class="flex border border-border-disabled rounded-md overflow-hidden text-sm w-max">
      ...tabs...
    </div>
  </div>
  <!-- Search -->
  <div class="relative sm:flex-shrink-0">
    <input type="text" placeholder="主題搜尋"
      class="border border-border-disabled rounded-md pl-3 pr-8 py-1.5 text-sm outline-none focus:border-menu w-full sm:w-[124px]" />
    <img src="./assets/icons/search.svg" class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 pointer-events-none" />
  </div>
</div>
```

---

## 展開內文（Input / textarea 型內容區塊）規範

**確認日期**：2026-04-15

### 規則

- **不放進** `<table>` 或受 `min-w-max` 約束的容器，否則 `w-full` 會把容器撐寬
- 改用 **div-based row group**：每個 group 包住 data 行 + 展開內文
- data 行（header 含）各自用 `overflow-x-auto` 包住，內層 flex 加 `min-w-max`，窄螢幕可水平滑動
- 欄寬用 `w-X flex-shrink-0`，主要彈性欄用 `flex-1 min-w-0`
- 展開內文在 `overflow-x-auto` 外側，自然填滿 modal 寬度，文字向下流動（`whitespace-normal`，不需 `w-full`）

### 標準寫法

```html
<div class="px-3 text-sm text-text-default">
  <!-- Header — 獨立 overflow-x-auto -->
  <div class="overflow-x-auto">
    <div class="flex min-w-max bg-brand-50 border-b border-border-disabled font-semibold">
      <div class="w-10 flex-shrink-0 px-3 py-2 whitespace-nowrap">#</div>
      <div class="w-20 flex-shrink-0 px-3 py-2 whitespace-nowrap">分類</div>
      <div class="flex-1 min-w-0 px-3 py-2 whitespace-nowrap">主題</div>
      <div class="w-24 flex-shrink-0 px-3 py-2 whitespace-nowrap">日期</div>
    </div>
  </div>
  <!-- Row group -->
  <div class="border-b border-border-disabled">
    <!-- data 行：獨立 overflow-x-auto，內層 min-w-max -->
    <div class="overflow-x-auto">
      <div class="flex min-w-max">
        <div class="w-10 flex-shrink-0 px-3 py-2 whitespace-nowrap">1</div>
        <div class="w-20 flex-shrink-0 px-3 py-2 whitespace-nowrap">系統維護</div>
        <div class="flex-1 min-w-0 px-3 py-2 whitespace-nowrap">系統維護與穩定性管理</div>
        <div class="w-24 flex-shrink-0 px-3 py-2 whitespace-nowrap">2026-01-01</div>
      </div>
    </div>
    <!-- 展開內文：overflow-x-auto 外側，自然填滿，文字向下斷行 -->
    <div class="px-3 pb-2">
      <div class="leading-relaxed border border-border-disabled rounded-md px-3 py-1.5 bg-white">
        長文內容自然斷行...
      </div>
    </div>
  </div>
  <!-- 最後一個 row group 不加 border-b -->
</div>
```

---

## Modal 規範

詳見 `components/modal.md`。

---

*Updated 2026-04-15*

---

## 元件 conventions（跨頁通用）

實作元件時的固定規格與語意對照，避免每次重發明：

### 外層 padding
- 頁面 / 主要區塊外層 padding 左右 `20px = px-5`（**不是** `px-3` 12px）
- 對應 token: `--spacing-20`

### Pill chip button
- gap 16px (`gap-4`)、padding `10px 16px` (`px-4 py-2.5`)、radius 28px
- 不用 `gap-0`、不用 `rounded-full`（明確 r:28）
- 黃藍語意分流見下

### Chip yellow vs blue（語意不可混）
- **黃** `#f7d275`（`--color-subitem-selected`）= tag / 付款指示 / 子項目 selected（如 `circle-selected-yellow` variant）
- **藍** `#005fcc`（`--color-menuitem-default-strong` 或 brand-600）= toggle / mode 切換（如 mode-toggle active）
- 不可互換、不可同時用在同一語意

### Lock toggle（input 群組鎖定態）
- lock icon 不是裝飾，是 toggle button：
  - **紅鎖** `--color-brand-active` = inputs **disabled**，input bg 灰底
  - **綠鎖** `--color-accent-green-positive` = inputs **active**，input bg 白
- 點 lock icon 切換整段 inputs 的 disabled / active 狀態

### Figma 灰底 input baseline
- Figma 視覺稿出現灰底 input = lock disabled 態，**不是新的 input variant**
- 實作 baseline 一律白底；灰底由 `.is-locked` class 套用，不可在 spec 內定義「灰底 input」

### Checkbox 三色語意
- Figma checkbox fill 對照：
  - `#b0b0b0` = **disabled**（不可勾）
  - `#ffffff` = enabled **未勾**
  - `#2178cf` = enabled **已勾**
- 不要看到灰就整批反灰，要分清三態

## 可復用 UI patterns（持續累積）

當實作中發現某段樣式 / JS 結構在未來會被多次使用，先在這裡登記類別 + scoped class 名 + 最早出現的 component，避免下次重發明：

### Toggle switch（iOS-style）
- CSS scoped class：`.member-data-switch` / `.member-data-switch-track` / `.member-data-switch-knob`
- 結構：`<span class="member-data-switch"><input type="checkbox"><span class="member-data-switch-track"></span><span class="member-data-switch-knob"></span></span>`
- on track 色 `--color-accent-green` / off track 色 `--color-switch-off-track` / knob `--color-neutral-0`
- 來源：`components/member-data-modal.md`（會員資料 modal 常用會員、訂閱電子報）

### 藏原生控件必接替代行為（強制）
- 用 `appearance: none` 或覆蓋層藏掉原生 UI（number spinner、select chrome
  等）時, 疊上去的自訂 icon / 按鈕**必須同步接上等價行為**, 不可只有外觀。
  只有裝飾沒有功能 = 大 bug（2026-07-13 使用者訂正, 案例: 系統基本頁
  stepper icon 一開始是 pointer-events-none 裝飾圖, 點了數字不會動）
- 標準做法: 藏原生後用 JS 呼叫原生 API 補回（`input.stepUp()/stepDown()`
  自帶 min/max clamp）, 鍵盤路徑保留 input 原生行為, 替代鈕 `tabindex="-1"`
- select 例外: `appearance: none` 只拿掉外觀 chrome, 點擊整個 select 仍開
  原生下拉, 不需補 JS（自繪 chevron 畫在 select 自身 background 即可）
- 驗證要求: 實作後必須實際點擊替代控件確認值/狀態會變, 不可只做視覺驗證
- 機器可判定性: 無法 grep（需行為比對）, 靠本條 + review + 實測 checklist
- 參考實作: `preview/js/system-basic.js` stepper 段

### Pill chip 單選 toggle（橫向 scroll）
- CSS scoped class：`.member-data-title-chip` / `.is-selected`（黃底 `--color-subitem-selected`）
- 容器：`flex-nowrap overflow-x-auto`，chip `flex-shrink: 0`
- JS：delegated click handler，單選切 `is-selected`
- 來源：`components/member-data-modal.md`（訂房記錄 3 chip 切館別）

### Filter tab 底線 active（無框）
- CSS scoped class：`.member-data-filter-tab` / `.is-active`（`text-decoration: underline; font-weight: 600; text-underline-offset: 4px`）
- 與 pill button 不同：active 用底線 + semibold，沒有 border / radius / bg
- 來源：`components/member-data-modal.md`（訂房記錄 5 filter）

### Modal-scoped IIFE delegation pattern
- Modal markup 放 `<body>` level（不在 `#tpl-room-booking` 內），listener 在 script load 時 `document.getElementById(modalId)` 找到後直接掛
- 若 trigger button 在 template 內（會被 cloned）：用 `document.addEventListener("click", e => { var btn = e.target.closest("[data-...]"); ... })` event delegation，**不要** `querySelectorAll().forEach()` 預掛
- 來源：`preview/js/member-data-modal.js` 的 Data exists button / member-data modal handler

> 以上「元件 conventions」「可復用 UI patterns」兩段 2026-07-04 自 start.md 移入（B3 瘦身）；新增 pattern 一律登記於本檔。
