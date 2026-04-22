# Swift Design System — Agent Brief

> 給 AI agent 的快速上手文件。讀完這份，再依需要深入對應的 spec 檔。  
> 授權來源：Figma file（Swift — 飯店後台）  
> 最後同步：2026-04-22

---

## 1. Project Snapshot

**Swift** 是一套飯店房間預訂系統的後台管理介面（SaaS Dashboard）。

- **使用者**：飯店櫃檯 / 業務人員，操作密集、需快速判讀資訊
- **語系**：繁體中文（未來擴充英文，但現階段全部硬編碼中文）
- **技術棧**：原生 HTML + Tailwind CDN（無 build step）+ 原生 JS
- **字體**：Noto Sans TC（唯一字體，全語系適用）
- **斷點**：`375px`（mobile）/ `769px+`（desktop，最高 1440px）

---

## 2. Visual Personality

**這是什麼風格**：
- 專業、功能導向的 SaaS 後台
- 低調暖性中性底色（接近米白的灰 `#F6F6F6`）
- 品牌橙（`#EF6F25`）為唯一主色，用量節制
- 乾淨、資訊密度高、沒有裝飾性元素

**這不是什麼風格**：
- ❌ 不是 glassmorphism（無磨砂玻璃效果）
- ❌ 不是 dark mode（全站淺色底）
- ❌ 不是圓潤 / 卡片堆疊風（圓角保守，6–12px 為主）
- ❌ 不是有大量 box-shadow 的設計（幾乎不用陰影）
- ❌ 不是多彩介面（accent 色只在特定語意出現，不隨意使用）

---

## 3. Color Philosophy

所有色值定義在 `specs/assets/tokens.md`，以下是使用邏輯。

### 色彩角色

| 角色 | Token | Hex | 使用場景 |
|---|---|---|---|
| 頁面底色 | `Color/Surface/Default` | `#F6F6F6` | `<body>` 背景 |
| 卡片 / 白底 | `Color/Neutral/0` | `#FFFFFF` | 所有卡片、modal、input 背景 |
| 主要內文 | `Color/Neutral/800` | `#454545` | 最常用的文字色 |
| 標題 / 最深文字 | `Color/Neutral/950` | `#262626` | Heading，用量少 |
| 次要說明文字 | `Color/Neutral/400` | `#888888` | 輔助文字、placeholder |
| 一般邊框 | `Color/Border/Default` | `#E1E1E0` | 幾乎所有元件外框 |
| 主品牌色（按鈕/強調） | `Color/Surface/Brand-Default` | `#EF6F25` | 主 CTA 按鈕、focus 邊框 |
| 主品牌色 Hover | `Color/Surface/Brand-Hover` | `#F28B45` | 主按鈕 hover |
| 主品牌色 Active | `Color/Surface/Brand-Active` | `#E05216` | 主按鈕 pressed |
| 動作按鈕（藍） | `Color/Surface/Action-Default` | `#005FCC` | 品牌橙以外的次要動作按鈕 |
| 成功 / 正向趨勢 | `Color/Surface/Status-Positive` | `#2ACA18` | 向下趨勢（營業數字降低 = 好） |
| 錯誤 / 負向趨勢 | `Color/Surface/Status-Negative` | `#E12129` | 向上趨勢（警告用）/ 驗證錯誤 |
| Table header 底色 | `Color/Brand/Brand-50` | `#FEF6EE` | `<thead>` 背景，極淡橙 |
| Tab 選中狀態 | `Color/Tab/yellow` | `#FFCC00` | Tab / 篩選按鈕選中底色 |
| 側欄選中 sub-item | `Color/SubItem/Selected` | `#F7D275` | 側邊欄子選單選中項 |

### 注意事項

- `Color/Text/*` 與 `Color/Neutral/*` 數值高度重疊，各有獨立元件綁定，**不可互換**
- Chart 顏色（`Color/Chart/*`）語意獨立，僅用於 Chart.js 圖表系列色
- Bootstrap 前綴色（`Color/Bootstrap/*`）僅用於 input focus ring，**不要外擴使用**

---

## 4. Typography Rules

**字體**：Noto Sans TC（`font-family: "Noto Sans TC", sans-serif`）  
**字重**：只用 Regular（400）與 SemiBold（600），無其他 weight

| 層級名稱 | 大小 | 字重 | 常見用途 |
|---|---|---|---|
| `sm` | `12px` | 400 | Badge、日期、chip 文字、說明標籤 |
| `base` | `16px` | 400 | 趨勢數值、選單項目文字 |
| `md` | `20px` | 400 | KPI 卡片標籤、Section 副標題 |
| `lg` | `24px` | 600 | KPI 卡片數值 |
| Modal 標題 | `20px` | 600 | Modal header 標題 |
| Table header | `12px` | 600 | `<th>` 文字 |

> 目前無正式 Text Style token，以上為從元件節點觀察的實際規格。

---

## 5. Component Fingerprint

### 卡片（section-card）

```html
<div class="bg-white border border-[#d1d1d1] rounded-md p-3">
  <!-- content -->
</div>
```

- 白底 `#FFFFFF`
- 邊框 `#D1D1D1`，`rounded-md`（6px）
- padding `12px`（`p-3`）
- **無** box-shadow

---

### 主品牌按鈕

```html
<button class="px-4 py-2 rounded-md bg-[#EF6F25] hover:bg-[#F28B45] active:bg-[#E05216] text-white text-sm">
  動作
</button>
```

---

### 確認 / 取消按鈕組（Modal 底部）

```html
<!-- 確定 -->
<button class="px-3 py-1.5 rounded-md bg-[#454545] text-[#e1e1e0] text-base border border-[#d1d1d1]">確定</button>

<!-- 取消 -->
<button class="px-3 py-1.5 rounded-md bg-[#d1d1d1] text-[#454545] text-base border border-[#d1d1d1]">取消</button>
```

---

### Table 規格

```html
<table class="text-sm text-[#454545] border-collapse min-w-max w-full">
  <thead>
    <tr class="bg-[#fef6ee] text-left font-semibold">
      <th class="px-3 py-2 border-b border-[#d1d1d1] whitespace-nowrap">欄位</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-[#d1d1d1] hover:bg-[#e1e1e0] transition-colors">
      <td class="px-3 py-2 whitespace-nowrap">資料</td>
    </tr>
    <!-- 最後一行不加 border-b -->
  </tbody>
</table>
```

規則：無垂直線、有水平線、header 淡橙底色 `#FEF6EE`、無外框。

---

### Tab / 篩選按鈕列

```html
<div class="flex-1 min-w-0 overflow-x-auto">
  <div class="flex border border-[#d1d1d1] rounded-md overflow-hidden text-sm text-[#454545] w-max">
    <button class="px-3 py-1.5 bg-[#ffcc00] border-r border-[#d1d1d1] font-medium whitespace-nowrap">選中</button>
    <button class="px-3 py-1.5 bg-white hover:bg-[#f6f6f6] whitespace-nowrap">未選中</button>
  </div>
</div>
```

---

### Input（基本）

```html
<input type="text"
  class="border border-[#d1d1d1] rounded-md px-3 py-1.5 text-sm text-[#454545] bg-white outline-none
         focus:border-[#86b7fe] w-full" />
```

- 預設邊框 `#D1D1D1`
- Focus 邊框 `#86B7FE`（Bootstrap focus blue）
- Disabled：背景 `#E1E1E0`，文字 `#888888`

---

### Modal 外框

```html
<div class="fixed inset-0 bg-black/40 z-60 flex items-center justify-center">
  <div class="bg-white border border-[#b0b0b0] rounded-lg w-[320px]">
    <!-- header 51px -->
    <div class="flex items-center justify-between px-3 py-3 border-b border-[#d1d1d1]">
      <span class="text-[20px] font-semibold text-[#454545]">標題</span>
      <img src="./assets/icons/close.svg" class="w-6 h-6 cursor-pointer" />
    </div>
    <!-- content -->
    <!-- footer -->
  </div>
</div>
```

- 固定寬 `320px`
- 邊框 `#B0B0B0`（比一般元件略深）
- Backdrop：`rgba(0, 0, 0, 0.4)`

---

## 6. Layout Structure

### Desktop（769px+）

```
[body bg #F6F6F6]
├── Sidebar（固定左欄 240px，x:12, y:12）
├── Function icons（右上角 156×24px）
└── 主內容區（x:272，寬度 1154px）
    ├── Row 1 — Order status + System notifications（gap 24px）
    ├── Row 2 — Revenue trends（全寬）
    └── Row 3 — Statistics（全寬）
```

### Mobile（375px ~ 768px）

```
[body bg #F6F6F6]
├── Top bar（搜尋 + 帳號）
├── 主內容區（垂直堆疊，各 section 全寬）
│   ├── Statistics cards（水平 scroll）
│   ├── Revenue trends
│   ├── System notifications
│   └── Order status
└── floatIcons/ai（右下角浮動按鈕，Desktop 版不存在）
```

---

## 7. File Map（設計權威來源）

| 優先順序 | 檔案 | 內容 |
|---|---|---|
| 1 | `specs/assets/tokens.md` | 色彩 / 間距 / 圓角 token（唯一數值權威） |
| 2 | `specs/icons.md` | Icon 語意對照表 |
| 3 | `specs/html-conventions.md` | Table / Tab / Modal / Input 的 HTML 模式 |
| 4 | `components/{name}.md` | 各元件完整規格（含 variants / states） |
| 5 | `sections/{name}.md` | 各區塊組合規格 |
| 6 | `layouts/{name}.md` | 頁面骨架與 RWD 行為 |
| 7 | `specs/progress.md` | 當前開發進度與決策紀錄 |
| 8 | `start.md` | 工作方法論與所有開發規則 |

---

## 8. What NOT to Do

| 禁止事項 | 原因 |
|---|---|
| 在 HTML 裡寫死 hex 值 | 所有色值必須對應 token 名稱（見 tokens.md） |
| 加 box-shadow | 設計稿無陰影系統，不要自行添加 |
| 使用 React / Vue / 任何框架 | 專案堅持原生 HTML + Tailwind CDN |
| 使用 @apply 或 Tailwind build 特性 | 當前無 build step |
| 自行腦補 hover / disabled / error 樣式 | Figma 未定義的狀態標記「Figma 未定義」，等待確認 |
| 省略重複內容（用「同上」帶過） | 全部完整寫出 |
| 刪除 specs/ 下的任何檔案 | 需明確授權 |
| 自行決定 RWD 斷點行為 | 必須以元件 spec 定義為準；未定義則停下來詢問 |
| 使用設計稿以外的 icon | Icon 只從 `preview/assets/icons/` 引用 |
| 生成 i18n 機制 | 當前硬編碼繁體中文，不建 i18n |

---

*Generated from project specs · 2026-04-22*
