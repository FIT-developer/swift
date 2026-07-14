# Component Specification: `menu`

**Figma Node ID**: `57:439`
**Type**: COMPONENT_SET
**現行版本**: 2026-07-13 使用者確認（POS 入口與快速切換帳號整組移除,
客服區縮減為僅 Email - 見 [customers-service.md](customers-service.md)、
[account.md](account.md)）

---

## Overview

`menu` 是一個側邊導航欄 component，寬度固定為 **240px**，高度依 state
不同而變化。包含帳號資訊、主選單（含子項目展開）、客服資訊、檔案下載
等區塊。現行適用 **4 個 state variant**（extend / extend hover / mobile /
closure）；原 `state=POS - list` / `state=POS - pattern` 兩個 variant 已隨
2026-07-13「POS 入口移除」決策退場, 規格見 git history（commit `79b6ab2`
之前的本檔版本）。

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
| Inner content width | `216px` (= 240 - 12x2) |

---

## Variants Overview（現行適用）

| Variant name | Node ID | Size (WxH) | 說明 |
|---|---|---|---|
| `state=extend` | `57:438` | 240 x 1188 | 預設展開狀態，客服/檔案區完整顯示 |
| `state=extend hover` | `245:10765` | 240 x 1184 | 展開且滑鼠 hover，視覺同 extend |
| `state=mobile` | `187:8312` | 240 x 1146 | 行動版，無 Logo，改為功能圖示列 |
| `state=closure` | `57:440` | 240 x 48 | 完全收合，僅顯示圖示欄 |

---

## Layer Structure (Common Skeleton)

```
[COMPONENT] state=*
|-- [INSTANCE] Folder          24 x 20   - 展開/收合切換按鈕（mobile 無此節點）
|-- [FRAME]    Ul              216 x var - 主體捲動容器
|   |-- [FRAME]    Frame 47           - Logo + Account 區塊
|   |   |-- [INSTANCE] Logo          216 x 116  (closure: 216 x 24，僅 icon)
|   |   `-- [INSTANCE] Account       - 帳號名 + icons/logout（僅登出，
|   |                                   切換帳號已移除，見 account.md）
|   |-- [FRAME]    main selection     216 x 84  - 兩個下拉選單
|   |   |-- [INSTANCE] Select  "188 ) 總部"
|   |   `-- [INSTANCE] Select  "199) 地球村美日語太平洋旅店"
|   |-- [FRAME]    system operation   216 x 311 - 主選單區
|   |   |-- [INSTANCE] Title          "系統操作"
|   |   `-- [INSTANCE] Dropdown aside x6（主項目為 Figma 佔位字，
|   |       實作選單清單以 git 內容為準）
|   |-- [INSTANCE] Customers service  - 客服區（現行僅標題 + Email 一列，
|   |       見 customers-service.md）
|   `-- [INSTANCE] File download      216 x var - 檔案區 (展開 170px / 收合 39px)
`-- (closure only) [INSTANCE] Account  - 移至 Ul 外部
```

> **mobile 特例**：`Ul` 頂部新增 `icons/close`（24x24）與 `Function icons`
> 橫列（含 message / person-md；message 帶 badge）。

---

## Variant-by-Variant Differences

### `state=extend`
- Folder visible: yes
- Logo: full size (216 x 116)
- Account inside Frame 47: yes
- Customers service: 標題 + Email 一列（現行規格）
- File download: **expanded** (170px) - 含 教育訓練手冊、套件 1.0.13

### `state=extend hover`
- 結構與 `extend` 相同，視覺上 hover 樣式由底層 interaction/style 控制

### `state=mobile`
- Folder / Logo: 不存在
- **新增 icons/close** (24 x 24) 在 Ul 頂部
- **新增 Function icons** (68 x 24) 橫列：
  | Icon | Badge |
  |------|-------|
  | icons/message | 0 |
  | icons/person-md | 無 |
- Account 移至底部（全寬 216px）
- File download: **expanded** (170px)

### `state=closure`
- 整體高度僅 **48px**，Ul overflow hidden
- Logo 縮為純 icon（24 x 24）
- Account 節點移出 Ul，位於 component 底層
- File download: 不存在於 Ul

---

## Sub-components & Instances

| Instance name | 尺寸 | 出現位置 |
|---|---|---|
| `Logo` | 216x116 / 216x24 | 所有 variants |
| `Account` | 127x24 / 216x24 | 所有 variants（見 account.md） |
| `Select` | 216x36 | main selection (x2) |
| `Dropdown aside` | 216x22 / 216x90 | system operation |
| `Customers service` | 216xvar | 所有 variants（見 customers-service.md） |
| `File download` | 216x170 / 216x39 | 除 closure 外 |
| `Title` | 216x27 | 各 section header |
| `Texts` | varies | 文字容器，含 sm/base/md 三種 size |
| `Function icons` | 68x24 | mobile only |
| `Folder` | 24x20 | 非 mobile variants |

---

## Icons Used

| Icon | Size | 用途 |
|---|---|---|
| `icons/system` | 24x24 | 系統操作 section title |
| `icons/service` | 24x24 | 客服 section title |
| `icons/download` | 24x24 | 檔案 section title + 各項下載按鈕 |
| `icons/logout` | 24x24 | Account 登出 |
| `icons/right` | 16x16 | Dropdown aside 收合時的箭頭 |
| `icons/down` | 24x24 | Dropdown aside 展開時的箭頭 / Select |
| `icons/email` | 24x24 | 客服 email 列 |
| `icons/point` | 24x24 | 子項目 active 指示 |
| `icons/close` | 24x24 | Mobile 關閉側欄 |
| `icons/message` | 24x24 | Mobile function bar |
| `icons/person-md` | 24x24 | Mobile function bar |

---

## Typography Scale

| Scale token | Height | 用途範例 |
|---|---|---|
| `md` | 27px | Section 標題（系統操作、客服、檔案） |
| `base` | 22px | 選單項目、下拉選項、聯絡資訊 |
| `sm` | 16px | 輔助資訊（帳號名、日期、badge） |

---

## Content Data (Sample)

### Account
- Username: `xiaomi999`

### Main Selection Dropdowns
- 選項 1: `188 ) 總部`
- 選項 2: `199) 地球村美日語太平洋旅店`

### System Operation Menu Items
- Figma 稿為佔位字（主項目 一~六）；實作選單清單以 git 內容為準
  （aside partial 13 類別）

### Customers Service
- Email: `service@bbnet.gmail.com`（僅此一列，見 customers-service.md）

### File Download
- 教育訓練手冊 (2018-09-06)
- 套件 (1.0.13)

---

## State Transition Logic

```
closure (48px)
  <-> toggle Folder button
extend (1188px)
  -> hover
extend hover (1184px)

mobile (1146px) - 獨立響應式版本，由視窗寬度決定，Folder 不存在
```

---

## Interactions（互動規格）

> 來源：Figma Section `Menu states - Interactions`（`194:3863`）
> Tooltips 僅作為設計交付說明用，**不會出現在 HTML 呈現**

### 1. Logo

| 觸發 | 效果 |
|---|---|
| 點擊 | 回後台首頁（navigate to dashboard root） |

### 2. Account 區 - Logout icon（`icons/logout`）

| 觸發 | 效果 |
|---|---|
| Hover | 顯示 Tooltip `登出`（dark bg `Color/Neutral/700`，text `Color/Neutral/100`，12px，6px radius，arrow 朝上） |
| 點擊 | 開啟 **確定登出？** Modal（見下方 Modal 規格） |

### 3. Dropdown aside（主項目）nav item

| 觸發 | 效果 |
|---|---|
| Hover | 背景變色（`項目 Hover` state，Figma 定義為 `extend hover` variant） |
| 點擊（`icons/right` 收合） | 展開 accordion，圖示換為 `icons/down`（旋轉 180 度） |
| 點擊（`icons/down` 展開） | 收合 accordion，圖示換回 `icons/right` |

### 4. Sub-items（子項目）

| 狀態 | 背景 | 說明 |
|---|---|---|
| Default | `Color/Neutral/0`（白色 fill） | 未選取、未 hover |
| Hover | `Color/Neutral/0`（白色 fill）+ cursor pointer | `Hover 內容` 標記，滑鼠游標進入 |
| Selected | 透明（無 fill） | 顯示下方黃底 `Color/SubItem/Selected`（`sub-item-selected` class） |

> Sub-item text color 固定為 `Color/MenuItem/Default`，字重 Regular 400，12px（sm）。

### 5. Modal：確定登出？

| 屬性 | 值 |
|---|---|
| 尺寸 | `320 x 109px` |
| Figma Instance | `194:4606` |
| 觸發方式 | Logout icon 點擊 |

**結構：**

```
Modal (320x109, bg Color/Neutral/0)
|-- Frame 12 - 上半部
|   |-- Frame 10 (padding 12px)
|   |   |-- Texts [md] "確定登出？" - SemiBold 20px Color/Neutral/800
|   |   `-- icons/close  24x24
|   `-- Texts (padding 12px) - body 說明文字（placeholder，實作自訂）
`-- Frame 11 (padding 12px) - 按鈕列
    |-- Button Y/N "取消"  bg Color/Neutral/200  text Color/Neutral/800
    `-- Button Y/N "確定"  bg Color/Neutral/800  text Color/Neutral/100
```

---

## 需要補讀的 Components

以下 component 在此互動規格中被引用，請個別指向後補充規格：

| Component | 目前狀態 | 需補充事項 |
|---|---|---|
| `Tooltip`（深色 hover tooltip） | `components/tooltips.md` 存在 | 深色 variant（bg `Color/Neutral/700`）樣式確認 |
| `Modal`（確定/取消）| `components/modal.md` 存在 | 登出 modal 樣式確認 |
| `Button Y/N`（確定/取消按鈕）| `components/button-yn.md` 存在 | 兩種 variant 色彩規格確認 |
| `Dropdown aside`（子項目狀態）| `components/dropdown-aside.md` 存在 | sub-item selected/hover 狀態規格確認 |

---

## 歷史（已移除功能, 規格見 git history）

- `state=POS - list` / `state=POS - pattern` 兩個 variant、POS entrance
  按鈕（含漸層外框實作）: 2026-07-13 使用者訂正移除（commit `79b6ab2`
  之前的本檔版本有完整規格）
- Account 的 `icons/switch` 切換帳號 icon 與「帳號切換」Modal B:
  同日移除, 見 account.md

---

*Updated 2026-07-14 - 記錄格式依 2026-07-14 使用者裁決: 移除/縮減時
spec 內文重寫成現況, 歷史細節交給 git history*
