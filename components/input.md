# Component Specification: `Input`

**Figma Node ID**: `20:34`（Component Set）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-10-01（Figma current source `20:34`）

---

## 概述

`Input` 是通用輸入元件，涵蓋文字輸入、數字輸入、文字區域、單選按鈕、帶 icon 的輸入框、日期選取等。  
以 `status` 屬性區分，共 **21 個 variants**，分為 7 個語意群組。

> Figma component set 外層的紫色 selection stroke `#9747FF` 是 Figma 原生
> 編輯器標示，不屬於 Input UI，也不屬於任何 variant 的 border 或 state。

---

## 共用樣式基準

| 屬性 | 主要值 | Disabled 值 |
|---|---|---|
| Corner radius | `6px` (`Radius/6`) | 同 |
| Padding（一般） | top/bottom `6px`、left/right `12px` | 同 |
| Padding（chip 類） | top/bottom `4px`、left/right `8px` | — |
| Border（default） | `Color/Neutral/200` `Color/Neutral/200` | 同 |
| Border（focus） | `Color/Chart/blue` `Color/Bootstrap/components/focus` | — |
| Background（default） | `Color/Neutral/0` `Color/Neutral/0` | `Color/Neutral/100` `Color/Neutral/100` |
| Text color（default） | `Color/Neutral/800` `Color/Neutral/800` | `Color/Neutral/400` `Color/Neutral/400` |
| Font size | `12px`（sm） | — |

### Icon Alternative item 規則

- Component 定義中的 `icons/close` 是 icon slot 的 placeholder，已設定為
  Alternative item。
- 使用 instance 時可替換成任意 `icons/` 開頭的 icon component；
  `icons/close` 不是固定語意，也不是未定義問題。
- 實際顯示哪一顆 icon 由使用該 Input instance 的頁面或 component 規格決定。

---

## Variants 完整清單

### Group A — 基本文字輸入

| status | ID | 尺寸 | 說明 | 使用紀錄 |
|---|---|---|---|---|
| `Default` | `20:33` | 28×127px | 白底灰框，sm 文字 | ✅ System notifications 彩色 chip（fill 覆寫） |
| `Default disabled` | `502:7889` | 28×127px | 灰底，文字 Color/Neutral/400 | ⬜ 待比對 |
| `focus` | `20:35` | 28×127px | 白底，藍框 `Color/Chart/blue` | ⬜ 待比對 |

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
| `textarea scroll` | `1039:17062` | 28×155px | 同上 + 右上角捲動指示線（`Color/Neutral/200`） | ⬜ 待比對 |
| `textarea scroll disabled` | `1153:29668` | 28×155px | 灰底，resize handle + 捲動指示線 | ⬜ 待比對 |

**Resize handle 規格（Group 10）**：
- 兩條斜線，stroke `Color/Neutral/300` `Color/Neutral/300`
- 位置：右下角 (x:149, y:22)

---

### Group D — 單選按鈕（Radio）

> 尺寸均為 20×20px，無子節點（純樣式）。

| status | ID | 背景色 | 邊框 | 說明 | 使用紀錄 |
|---|---|---|---|---|---|
| `radios not focus` | `455:4120` | `Color/Neutral/0` | `Color/Neutral/200` | 未選取、未 focus | ⬜ 待比對 |
| `radios not focus disabled` | `953:16193` | `Color/Neutral/300` | `Color/Neutral/200` | 未選取、停用 | ⬜ 待比對 |
| `range` | `460:7075` | `Color/MenuItem/Default` | `Color/Neutral/200` | 已選取（藍色實心） | ⬜ 待比對 |
| `radios focus` | `455:7009` | `Color/Neutral/0` | `Color/Neutral/200` + `Color/MenuItem/Default`（雙框） | 未選取、focus 中 | ⬜ 待比對 |
| `radios disabled` | `953:13250` | `Color/Neutral/400` | `Color/Neutral/200` + `Color/Neutral/300`（雙框） | 停用中 | ⬜ 待比對 |

**Radio 顏色對照**：

| 色值 | Token |
|---|---|
| `Color/MenuItem/Default`（選取） | `Color/MenuItem/Default` |
| `Color/Neutral/300`（停用） | `Color/Neutral/300` |
| `Color/Neutral/400`（停用深） | `Color/Neutral/400` |
| `Color/Chart/blue`（focus 框） | `Color/Bootstrap/components/focus` |

---

### Group E — 右側 icon（清除按鈕）

> icon slot 在 component 定義中以 `icons/close` 為佔位，實際使用時可替換。

| status | ID | 尺寸 | 背景 | 邊框 | Icon 色 | 說明 | 使用紀錄 |
|---|---|---|---|---|---|---|---|
| `icons` | `56:323` | 36×102px | `Color/Neutral/0` | `Color/Neutral/200` | 黑 `Color/Icon/Default` | 白底灰框 + 右側 close icon | ⬜ 待比對 |
| `icons disabled` | `502:5125` | 36×127px | `Color/Neutral/100` | `Color/Neutral/200` | 灰 `Color/Neutral/400` | 灰底 + 停用 icon | ⬜ 待比對 |
| `icon focus` | `648:19794` | 36×127px | `Color/Bootstrap/focus-background` | `Color/Chart/blue` | 黑 `Color/Icon/Default` | 藍底 + 藍框（focus 狀態） | ⬜ 待比對 |

**`icon focus` 背景色**：`Color/Bootstrap/focus-background` = `Color/Bootstrap/focus-background`

---

### Group F — Attached-link Chip（小型連結標籤）

> padding 4/8（比一般 Input 小），專用於「帶右側 icon 的可點擊標籤」。  
> icon slot 在 component 定義中以 `icons/close` 為佔位，實際使用時可替換（如 `attached-link`、`attached-link-moved`）。

| status | ID | 尺寸 | 背景 | 文字色 | Icon 色 | 說明 | 使用紀錄 |
|---|---|---|---|---|---|---|---|
| `attached-link` | `163:7619` | 32×86px | `Color/Neutral/0` | `Color/Neutral/800` | 黑 `Color/Icon/Default` | 白底灰框，default 狀態 | ✅ Card `tend up`（icon 替換為 attached-link） |
| `attached-link hover` | `163:7701` | 32×86px | `Color/Neutral/800` | `Color/Neutral/100` | `Color/Neutral/100` | 深色背景，hover 狀態 | ✅ Card `tend up hover`（icon 替換為 attached-link-moved） |

**Attached-link 規格詳細**：

| 屬性 | Default | Hover |
|---|---|---|
| Background | `Color/Neutral/0` `Color/Neutral/0` | `Color/Neutral/800` `Color/Neutral/800` |
| Border | `Color/Neutral/200` `Color/Neutral/200` | `Color/Neutral/200` `Color/Neutral/200` |
| Text color | `Color/Neutral/800` `Color/Neutral/800` | `Color/Neutral/100` `Color/Neutral/100` |
| Icon fill | `Color/Icon/Default` | `Color/Neutral/100` `Color/Neutral/100` |
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
| `icons leftside + 3 sub label` | `2578:105314` | 60x98px | 左 icon + 右側三行等級相同的 sm 文字 | Figma current source 2026-10-01 |

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

**三行文字格式（3 sub label）**：

```
[icon] [sm 文字]
       [sm 文字]
       [sm 文字]
```

- 外框：98x60，`Radius/6`，padding top/bottom 6px、left/right 12px。
- 背景：`Color/Neutral/0`；border：`Color/Neutral/200`。
- Icon slot：24x24，距左側 12px，垂直置中；placeholder 為 `icons/close`，
  遵守上方 Alternative item 規則。
- Icon 與文字 stack 間距 8px。
- 文字 stack：42x48，共三行；每行 42x16，Noto Sans Regular 12px，
  `Color/Neutral/800`，行間距 0。
- 三行實際內容、長文字 overflow / truncation 與 mobile 行為由使用情境規格決定；
  本次 Figma component 未定義。

---

## 彩色 chip 使用說明

> `Default` variant 在 System notifications 中作為彩色標籤使用，原始白底被覆寫為各種語意色：

| 使用場景 | 覆寫 fill | Token |
|---|---|---|
| 類型：簡訊 | `Color/Accent/Green` | `Color/Accent/Green` |
| 嚴重度：總部 | `Color/Surface/Negative` | `Color/Surface/Negative` |
| 嚴重度：分館 | `Color/Brand/Brand-400` | `Color/Surface/Brand-400-Hover` |
| 類型：網址 | `Color/MenuItem/Default` | `Color/MenuItem/Default` |

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| `number` variant 的 +/- 互動行為 | Figma 未定義 |
| `text area` 的最大高度 / 展開行為 | Figma 未定義 |
| `range`（radio selected）觸發方式 | Figma 未定義互動 |
| 行動版（mobile）佈局 | Figma 未定義 |

---

*Generated from Figma components page - Updated 2026-10-01*
