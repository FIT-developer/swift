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
| Background | `#ffffff` |
| Border | `#e1e1e0` |
| Text primary | `#454545` |
| Text link / active | `#2178cf` |
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
  - 含 icons/pos + 文字 "POS"
  - 含 icons/attached-link（外連結）

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

*Generated from Figma COMPONENT_SET `57:439` on 2026-04-13*
