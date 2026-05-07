# Component Specification: `menu`

**Figma Node ID**: `57:439`  
**Type**: COMPONENT_SET  
**Total Variants**: 6

---

## Overview

`menu` 是一個側邊導航欄 component，寬度固定為 **240px**，高度依 state 不同而變化。包含帳號資訊、主選單（含子項目展開）、客服資訊、檔案下載等區塊。共有六個 state variant，覆蓋展開、收合、Hover、POS 模式、Mobile 三種場景。

---

## Visual Tokens

| Token | Value |
|-------|-------|
| Background | `Color/Neutral/0` |
| Border | `Color/Neutral/100` |
| Text primary | `Color/Neutral/800` |
| Text link / active | `Color/MenuItem/Default` |
| Corner radius (component) | `8px` |
| Padding (all sides) | `12px` |
| Inner content width | `216px` (= 240 − 12×2) |

---

## Variants Overview

| Variant name | Node ID | Size (W×H) | 說明 |
|---|---|---|---|
| `state=extend` | `57:438` | 240 × 1188 | 預設展開狀態，客服/檔案區完整顯示 |
| `state=extend hover` | `245:10765` | 240 × 1184 | 展開且滑鼠 hover，視覺同 extend |
| `state=POS - list` | `274:13258` | 240 × 1184 | POS 列表模式，客服/檔案區收合 |
| `state=POS - pattern` | `275:13685` | 240 × 1184 | POS 樣板模式，新增 POS 入口項目 |
| `state=mobile` | `187:8312` | 240 × 1146 | 行動版，無 Logo，改為功能圖示列 |
| `state=closure` | `57:440` | 240 × 48 | 完全收合，僅顯示圖示欄 |

---

## Layer Structure (Common Skeleton)

```
[COMPONENT] state=*
├── [INSTANCE] Folder          24 × 20   — 展開/收合切換按鈕（mobile 無此節點）
├── [FRAME]    Ul              216 × var — 主體捲動容器
│   ├── [FRAME]    Frame 47           — Logo + Account 區塊 (158px / closure: 24px)
│   │   ├── [INSTANCE] Logo          216 × 116  (closure: 216 × 24，僅 icon)
│   │   └── [INSTANCE] Account       127 × 24
│   │       ├── [INSTANCE] Texts → sm "xiaomi999"
│   │       └── [FRAME]    Frame 9
│   │           ├── [INSTANCE] icons/logout  24 × 24
│   │           └── [INSTANCE] icons/switch  24 × 24
│   ├── [FRAME]    main selection     216 × 84  — 兩個下拉選單
│   │   ├── [INSTANCE] Select  "188 ) 總部"
│   │   └── [INSTANCE] Select  "199) 地球村美日語太平洋旅店"
│   ├── [FRAME]    system operation   216 × 311 — 主選單區
│   │   ├── [INSTANCE] Title          "系統操作"
│   │   ├── [INSTANCE] Dropdown aside "主項目 一"   (collapsed → icons/right)
│   │   ├── [INSTANCE] Dropdown aside "主項目 二"   (expanded → icons/down + sub-items)
│   │   │   └── 子項目 一 / 二 / 三
│   │   ├── [INSTANCE] Dropdown aside "主項目 三"
│   │   ├── [INSTANCE] Dropdown aside "主項目 四"
│   │   ├── [INSTANCE] Dropdown aside "主項目 五"
│   │   └── [INSTANCE] Dropdown aside "主項目 六"
│   ├── [INSTANCE] Customers service  216 × var — 客服區 (展開 395px / 收合 39px)
│   └── [INSTANCE] File download      216 × var — 檔案區 (展開 170px / 收合 39px)
└── (closure only) [INSTANCE] Account  — 移至 Ul 外部
```

> **mobile 特例**：`Ul` 頂部新增 `icons/close`（24×24）與 `Function icons` 橫列（含 bulletin / message / person2 / system，各帶 badge 數字）。

---

## Variant-by-Variant Differences

### `state=extend`
- Folder visible ✓
- Logo: full size (216 × 116)
- Account inside Frame 47 ✓
- Customers service: **expanded** (395px) — 含 QR code 區、電話、傳真、北/西/東客服、email
- File download: **expanded** (170px) — 含 教育訓練手冊、套件 1.0.13
- POS entrance: ✗

### `state=extend hover`
- 結構與 `extend` 相同，視覺上 hover 樣式由底層 interaction/style 控制
- Customers service: **expanded** (395px)
- File download: **expanded** (170px)

### `state=POS - list`
- Folder visible ✓
- Logo: full size
- Ul 高度 628px → 客服/檔案區收合（僅顯示標題列）
- POS entrance: ✗

### `state=POS - pattern`
- Folder visible ✓
- Logo: full size
- Customers service: **collapsed** (39px)
- File download: **collapsed** (39px)
- **POS entrance 新增**：`Pos entance icon` (216 × 39)
  - 含 icons/pos + 文字 "POS" + icons/attached-link（外連結）
  - 外框：horizontal gradient stroke 3px，`Color/Accent/linear-pos-left`（左）→ `Color/Accent/linear-pos-right`（右）
  - 形狀：pill（`cornerRadius: 56`，`rounded-full`）
  - 內距：`padding: 6px 12px`
  - **Hover 狀態**：stroke 不變 + 新增 fill `Color/Accent/float-circle-filled-1` → `Color/Accent/float-circle-filled-2`

#### POS entrance 漸層外框實作方式
與 floatIcons/ai 相同的雙層包裹技巧（gradient stroke 無法用 `border` 直接實現）：
- 外層：`p-[3px] rounded-full`，使用 `.pos-entrance-gradient-border` 套用 `Color/Accent/linear-pos-left` → `Color/Accent/linear-pos-right`
- 內層：`rounded-full bg-white`，hover 時背景換為 `Color/Accent/float-circle-filled-1` → `Color/Accent/float-circle-filled-2`

#### POS entrance HTML 實作
```html
<div class="mb-4 pos-entrance-btn">
  <div class="pos-entrance-gradient-border p-[3px] rounded-full">
    <div class="pos-entrance-inner flex items-center justify-between px-3 h-[33px] rounded-full cursor-pointer">
      <div class="flex items-center gap-1.5">
        <img src="./assets/icons/pos.svg" class="w-6 h-6 shrink-0" />
        <span class="text-sm font-semibold text-text-default">POS</span>
      </div>
      <img src="./assets/icons/attached-link.svg" class="w-6 h-6 shrink-0" />
    </div>
  </div>
</div>
```
CSS（加入 `<style>` 區塊）：
```css
.pos-entrance-inner { background: white; transition: background 0.2s; }
.pos-entrance-btn:hover .pos-entrance-inner {
  background: linear-gradient(to right, rgba(252,254,192,0.2), rgba(248,171,251,0.2));
}
```

### `state=mobile`
- Folder: ✗（不存在）
- Logo: ✗（不存在）
- **新增 icons/close** (24 × 24) 在 Ul 頂部
- **新增 Function icons** (216 × 48) 橫列：
  | Icon | Badge |
  |------|-------|
  | icons/bulletin | 99 |
  | icons/message | 0 |
  | icons/person2 | 99+ |
  | icons/system | 99+ |
- Account 移至 Frame 45 底部（全寬 216px）
- Customers service: **expanded** (395px)
- File download: **expanded** (170px)

### `state=closure`
- 整體高度僅 **48px**，Ul overflow hidden（內容 494px 但不顯示）
- Logo 縮為純 icon（24 × 24）
- Account 節點移出 Ul，位於 component 底層
- Customers service: collapsed (39px) in Ul
- File download: ✗（Ul 中不存在）

---

## Sub-components & Instances

| Instance name | 尺寸 | 出現位置 |
|---|---|---|
| `Logo` | 216×116 / 216×24 | 所有 variants |
| `Account` | 127×24 / 216×24 | 所有 variants |
| `Select` | 216×36 | main selection (×2) |
| `Dropdown aside` | 216×22 / 216×90 | system operation |
| `Customers service` | 216×395 / 216×39 | 所有 variants |
| `File download` | 216×170 / 216×39 | 除 closure 外 |
| `Pos entance icon` | 216×39 | POS - pattern only |
| `Title` | 216×27 | 各 section header |
| `Texts` | varies | 文字容器，含 sm/base/md 三種 size |
| `Function icons` | 216×48 | mobile only |
| `Folder` | 24×20 | 非 mobile variants |

---

## Icons Used

| Icon | Size | 用途 |
|---|---|---|
| `icons/system` | 24×24 | 系統操作 section title |
| `icons/service` | 24×24 | 客服 section title |
| `icons/download` | 24×24 | 檔案 section title + 各項下載按鈕 |
| `icons/logout` | 24×24 | Account 登出 |
| `icons/switch` | 24×24 | Account 切換帳號 |
| `icons/right` | 16×16 | Dropdown aside 收合時的箭頭 |
| `icons/down` | 24×24 | Dropdown aside 展開時的箭頭 / Select |
| `icons/email` | 24×24 | 客服 email 列 |
| `icons/point` | 24×24 | 子項目 active 指示 |
| `icons/close` | 24×24 | Mobile 關閉側欄 |
| `icons/bulletin` | 24×24 | Mobile function bar |
| `icons/message` | 24×24 | Mobile function bar |
| `icons/person2` | 24×24 | Mobile function bar |
| `icons/pos` | 24×24 | POS entrance |
| `icons/attached-link` | 24×24 | POS 外連結 |

---

## Typography Scale

| Scale token | Height | 用途範例 |
|---|---|---|
| `md` | 27px | Section 標題（系統操作、客服、檔案、POS） |
| `base` | 22px | 選單項目、下拉選項、聯絡資訊 |
| `sm` | 16px | 輔助資訊（帳號名、時間、日期、badge） |

---

## Content Data (Sample)

### Account
- Username: `xiaomi999`

### Main Selection Dropdowns
- 選項 1: `188 ) 總部`
- 選項 2: `199) 地球村美日語太平洋旅店`

### System Operation Menu Items
- 主項目 一 ← collapsed
- 主項目 二 ← expanded (含 子項目 一 / 子項目 二 / 子項目 三)
- 主項目 三
- 主項目 四
- 主項目 五
- 主項目 六

### Customers Service
- 服務時段: `平日 09:00~18:00`
- 電話: `02-2826-3881`
- 傳真: `02-2821-8289`
- 北客服: `#13 紅樹林`
- 西客服: `#12 Jimmy`
- 東客服: `#22 Luka`
- Email: `service@bbnet.gmail.com`

### File Download
- 教育訓練手冊 (2018-09-06)
- 套件 (1.0.13)

---

## State Transition Logic

```
closure (48px)
  ↕ toggle Folder button
extend (1188px)
  ↓ hover
extend hover (1184px)
  ↓ switch mode
POS - list (1184px)
  ↓ switch sub-mode
POS - pattern (1184px)

mobile (1146px) — 獨立響應式版本，由視窗寬度決定，Folder 不存在
```

---

## Interactions（互動規格）

> 來源：Figma Section `Menu states - Interactions`（`194:3863`），包含 3 個 menu instance + 2 個 Modal + connector 說明  
> Tooltips 僅作為設計交付說明用，**不會出現在 HTML 呈現**

### 1. Logo

| 觸發 | 效果 |
|---|---|
| 點擊 | 回後台首頁（navigate to dashboard root） |

---

### 2. Account 區 — Logout icon（`icons/logout`）

| 觸發 | 效果 |
|---|---|
| Hover | 顯示 Tooltip `登出`（dark bg `Color/Neutral/700`，text `Color/Neutral/100`，12px，6px radius，arrow 朝上） |
| 點擊 | 開啟 **確定登出？** Modal（見下方 Modal 規格） |

---

### 3. Account 區 — Switch icon（`icons/switch`）

| 觸發 | 效果 |
|---|---|
| Hover | 顯示 Tooltip（同 logout tooltip 樣式，文字：更換帳號） |
| 點擊 | 開啟 **帳號切換** Modal（見下方 Modal 規格） |

---

### 4. Dropdown aside（主項目）nav item

| 觸發 | 效果 |
|---|---|
| Hover | 背景變色（`項目 Hover` state，Figma 定義為 `extend hover` variant） |
| 點擊（`icons/right` 收合） | 展開 accordion，圖示換為 `icons/down`（旋轉 180°） |
| 點擊（`icons/down` 展開） | 收合 accordion，圖示換回 `icons/right` |

---

### 5. Sub-items（子項目）

| 狀態 | 背景 | 說明 |
|---|---|---|
| Default | `Color/Neutral/0`（白色 fill） | 未選取、未 hover |
| Hover | `Color/Neutral/0`（白色 fill）+ cursor pointer | `Hover 內容` 標記，滑鼠游標進入 |
| Selected | 透明（無 fill） | 顯示下方黃底 `Color/SubItem/Selected`（`sub-item-selected` class） |

> Sub-item text color 固定為 `Color/MenuItem/Default`，字重 Regular 400，12px（sm）。

---

### 6. Modals

#### Modal A：確定登出？

| 屬性 | 值 |
|---|---|
| 尺寸 | `320 × 109px` |
| Figma Instance | `194:4606` |
| 觸發方式 | Logout icon 點擊 |

**結構：**

```
Modal (320×109, bg Color/Neutral/0)
├── Frame 12 — 上半部
│   ├── Frame 10 (padding 12px)
│   │   ├── Texts [md] "確定登出？" — SemiBold 20px Color/Neutral/800
│   │   └── icons/close  24×24
│   └── Texts (padding 12px) — body 說明文字（placeholder，實作自訂）
└── Frame 11 (padding 12px) — 按鈕列
    ├── Button Y/N "取消"  bg Color/Neutral/200  text Color/Neutral/800
    └── Button Y/N "確定"  bg Color/Neutral/800  text Color/Neutral/100
```

#### Modal B：帳號切換

| 屬性 | 值 |
|---|---|
| 尺寸 | `320 × 277px` |
| Figma Instance | `194:4750` |
| 觸發方式 | Switch icon 點擊 |

**結構：**

```
Modal (320×277, bg Color/Neutral/0)
├── Frame 12 — 上半部
│   ├── Frame 10 (padding 12px)
│   │   ├── Texts [md] "帳號切換" — SemiBold 20px Color/Neutral/800
│   │   └── icons/close  24×24
│   └── content swap (padding 12px, border Color/Neutral/200)
│       ├── Frame 13
│       │   ├── Texts [base] "暱稱"  Color/Neutral/800
│       │   └── Select — 顯示 "xiaomi999"（帳號下拉）
│       └── Frame 14
│           ├── Texts [base] "密碼"  Color/Neutral/800
│           └── Input — 顯示 "********"（密碼輸入）
└── Frame 11 (padding 12px) — 按鈕列
    ├── Button Y/N "取消"  bg Color/Neutral/200  text Color/Neutral/800
    └── Button Y/N "確定"  bg Color/Neutral/800  text Color/Neutral/100
```

---

## 需要補讀的 Components

以下 component 在此互動規格中被引用，請個別指向後補充規格：

| Component | 目前狀態 | 需補充事項 |
|---|---|---|
| `Tooltip`（深色 hover tooltip） | `components/tooltips.md` 存在 | 深色 variant（bg `Color/Neutral/700`）樣式確認 |
| `Modal`（確定/取消）| `components/modal.md` 存在 | 兩個 modal variant（登出/帳號切換）樣式確認 |
| `Button Y/N`（確定/取消按鈕）| `components/button-yn.md` 存在 | 兩種 variant 色彩規格確認 |
| `Dropdown aside`（子項目狀態）| `components/dropdown-aside.md` 存在 | sub-item selected/hover 狀態規格確認 |

---

*Generated from Figma COMPONENT_SET `57:439` on 2026-04-13 · Interactions updated from `194:3863` on 2026-04-15 · POS - pattern hover gradient confirmed via SVG export on 2026-04-16*
