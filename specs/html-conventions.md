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
