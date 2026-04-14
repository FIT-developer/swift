# Component Specification: `Input`

**Figma Node ID**: `20:34`（Component Set）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13（依 Landing page - 0116）

---

## 概述

`Input` 是通用輸入元件，涵蓋文字輸入、數字輸入、文字區域、單選按鈕、帶 icon 的輸入框、日期選取等。  
以 `status` 屬性區分，共 **20 個 variants**，分為 7 個語意群組。

---

## 共用樣式基準

| 屬性 | 主要值 | Disabled 值 |
|---|---|---|
| Corner radius | `6px` (`Radius/6`) | 同 |
| Padding（一般） | top/bottom `6px`、left/right `12px` | 同 |
| Padding（chip 類） | top/bottom `4px`、left/right `8px` | — |
| Border（default） | `#D1D1D1` `Color/Neutral/200` | 同 |
| Border（focus） | `#86B7FE` `Color/Bootstrap/components/focus` | — |
| Background（default） | `#FFFFFF` `Color/Neutral/0` | `#E1E1E0` `Color/Neutral/100` |
| Text color（default） | `#454545` `Color/Neutral/800` | `#888888` `Color/Neutral/400` |
| Font size | `12px`（sm） | — |

---

## Variants 完整清單

### Group A — 基本文字輸入

| status | ID | 尺寸 | 說明 | 使用紀錄 |
|---|---|---|---|---|
| `Default` | `20:33` | 28×127px | 白底灰框，sm 文字 | ✅ System notifications 彩色 chip（fill 覆寫） |
| `Default disabled` | `502:7889` | 28×127px | 灰底，文字 #888888 | ⬜ 待比對 |
| `focus` | `20:35` | 28×127px | 白底，藍框 `#86B7FE` | ⬜ 待比對 |

---

### Group B — 數字輸入

| status | ID | 尺寸 | 說明 | 使用紀錄 |
|---|---|---|---|---|
| `number` | `1057:18817` | 34×127px | 白底灰框，base 16px 文字 + `icons/up-and-down`（右側） | ⬜ 待比對 |

> 注意：此 variant 高度 34px（比 28px 高），因內含 base 16px 字型。

---

### Group C — 文字區域（Textarea）

| status | ID | 尺寸 | 說明 | 使用紀錄 |
|---|---|---|---|---|
| `text area` | `1036:13995` | 28×155px | 白底灰框，右下角 resize handle（灰色雙線） | ⬜ 待比對 |
| `textarea scroll` | `1039:17062` | 28×155px | 同上 + 右上角捲動指示線（`#D1D1D1`） | ⬜ 待比對 |
| `textarea scroll disabled` | `1153:29668` | 28×155px | 灰底，resize handle + 捲動指示線 | ⬜ 待比對 |

**Resize handle 規格（Group 10）**：
- 兩條斜線，stroke `#B0B0B0` `Color/Neutral/300`
- 位置：右下角 (x:149, y:22)

---

### Group D — 單選按鈕（Radio）

> 尺寸均為 20×20px，無子節點（純樣式）。

| status | ID | 背景色 | 邊框 | 說明 | 使用紀錄 |
|---|---|---|---|---|---|
| `radios not focus` | `455:4120` | `#FFFFFF` | `#D1D1D1` | 未選取、未 focus | ⬜ 待比對 |
| `radios not focus disabled` | `953:16193` | `#B0B0B0` | `#D1D1D1` | 未選取、停用 | ⬜ 待比對 |
| `range` | `460:7075` | `#2178CF` | `#D1D1D1` | 已選取（藍色實心） | ⬜ 待比對 |
| `radios focus` | `455:7009` | `#FFFFFF` | `#D1D1D1` + `#2178CF`（雙框） | 未選取、focus 中 | ⬜ 待比對 |
| `radios disabled` | `953:13250` | `#888888` | `#D1D1D1` + `#B0B0B0`（雙框） | 停用中 | ⬜ 待比對 |

**Radio 顏色對照**：

| 色值 | Token |
|---|---|
| `#2178CF`（選取） | `Color/MenuItem/Default` |
| `#B0B0B0`（停用） | `Color/Neutral/300` |
| `#888888`（停用深） | `Color/Neutral/400` |
| `#86B7FE`（focus 框） | `Color/Bootstrap/components/focus` |

---

### Group E — 右側 icon（清除按鈕）

> icon slot 在 component 定義中以 `icons/close` 為佔位，實際使用時可替換。

| status | ID | 尺寸 | 背景 | 邊框 | Icon 色 | 說明 | 使用紀錄 |
|---|---|---|---|---|---|---|---|
| `icons` | `56:323` | 36×102px | `#FFFFFF` | `#D1D1D1` | 黑 `#000000` | 白底灰框 + 右側 close icon | ⬜ 待比對 |
| `icons disabled` | `502:5125` | 36×127px | `#E1E1E0` | `#D1D1D1` | 灰 `#888888` | 灰底 + 停用 icon | ⬜ 待比對 |
| `icon focus` | `648:19794` | 36×127px | `#D3EBFD` | `#86B7FE` | 黑 `#000000` | 藍底 + 藍框（focus 狀態） | ⬜ 待比對 |

**`icon focus` 背景色**：`#D3EBFD` = `Color/Bootstrap/focus-background`

---

### Group F — Attached-link Chip（小型連結標籤）

> padding 4/8（比一般 Input 小），專用於「帶右側 icon 的可點擊標籤」。  
> icon slot 在 component 定義中以 `icons/close` 為佔位，實際使用時可替換（如 `attached-link`、`attached-link-moved`）。

| status | ID | 尺寸 | 背景 | 文字色 | Icon 色 | 說明 | 使用紀錄 |
|---|---|---|---|---|---|---|---|
| `attached-link` | `163:7619` | 32×86px | `#FFFFFF` | `#454545` | 黑 `#000000` | 白底灰框，default 狀態 | ✅ Card `tend up`（icon 替換為 attached-link） |
| `attached-link hover` | `163:7701` | 32×86px | `#454545` | `#E1E1E0` | `#E1E1E0` | 深色背景，hover 狀態 | ✅ Card `tend up hover`（icon 替換為 attached-link-moved） |

**Attached-link 規格詳細**：

| 屬性 | Default | Hover |
|---|---|---|
| Background | `#FFFFFF` `Color/Neutral/0` | `#454545` `Color/Neutral/800` |
| Border | `#D1D1D1` `Color/Neutral/200` | `#D1D1D1` `Color/Neutral/200` |
| Text color | `#454545` `Color/Neutral/800` | `#E1E1E0` `Color/Neutral/100` |
| Icon fill | `#000000` | `#E1E1E0` `Color/Neutral/100` |
| Padding | `4px / 8px` | `4px / 8px` |
| Corner radius | `6px` `Radius/6` | `6px` |

> ⚠️ **Icon slot 說明**：component 定義中的 icon 為 `icons/close`，但在實際 instance 中會被 swap 為對應圖示（如 Card 使用 `icons/attached-link` / `icons/attached-link-moved`）。實作時需確認每個使用情境的目標 icon。

---

### Group G — 左側 icon（日期 / 特殊輸入）

> icon 位於左側，文字（或多行內容）位於右側。  
> icon slot 在 component 定義中以 `icons/close` 為佔位，實際使用時替換（如 `icons/calendar`、`icons/clock` 等）。

| status | ID | 尺寸 | 說明 | 使用紀錄 |
|---|---|---|---|---|
| `icons leftside + stroke` | `91:572` | 36×98px | 左 icon + 右側單行文字 | ⬜ 待比對 |
| `icons leftside + sub label + two dates` | `698:10063` | 44×155px | 左 icon + 右側雙行（主標 + 日期區間）| ⬜ 待比對 |
| `icons leftside + sub label + one date` | `698:10131` | 44×98px | 左 icon + 右側雙行（主標 + 單一日期） | ⬜ 待比對 |

**日期區間格式（two dates）**：

```
[icon] [主標 sm]
       [日期 sm] ~ [日期 sm]
```

**單一日期格式（one date）**：

```
[icon] [主標 sm]
       [日期 sm]
```

---

## 彩色 chip 使用說明

> `Default` variant 在 System notifications 中作為彩色標籤使用，原始白底被覆寫為各種語意色：

| 使用場景 | 覆寫 fill | Token |
|---|---|---|
| 類型：簡訊 | `#34C759` | `Color/Accent/Green` |
| 嚴重度：總部 | `#E12129` | `Color/Surface/Negative` |
| 嚴重度：分館 | `#F28B45` | `Color/Surface/Brand-400-Hover` |
| 類型：網址 | `#2178CF` | `Color/MenuItem/Default` |

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| `number` variant 的 +/- 互動行為 | Figma 未定義 |
| `text area` 的最大高度 / 展開行為 | Figma 未定義 |
| `attached-link` icon slot 的完整對照表 | ⬜ 隨各 section spec 補齊 |
| `icons leftside` icon slot 的完整對照表 | ⬜ 隨各 section spec 補齊 |
| `range`（radio selected）觸發方式 | Figma 未定義互動 |
| 行動版（mobile）佈局 | Figma 未定義 |

---

*Generated from Figma components page · Updated 2026-04-13*
