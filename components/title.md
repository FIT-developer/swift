# Component Specification: `Title`

**Figma Node ID**: `43:328`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Title` 是各 section 的標題列元件，由左側 icon + 右側文字橫向排列組成。  
僅有 **1 個 variant**（`type=Default`），icon 與文字在 instance 使用時各自 swap。

---

## Variants

| Variant 名稱 | Node ID | 說明 |
|---|---|---|
| `type=Default` | `43:327` | 唯一 variant |

---

## 結構

```
[COMPONENT] Title - type=Default (112x27px)
- [INSTANCE] icons/operation-system (24x24, x:0, y:1.5) <- icon slot（可 swap）
- [INSTANCE] Texts - md Bold (80x27, x:32)              <- 文字 slot（可 swap）
    - [TEXT] "系統操作"  20px  SemiBold 600  Color/Neutral/800
```

> icon 垂直置中（y:1.5 = (27-24)/2）  
> icon 與文字間距：x:32 - 24 = **8px**

---

## 樣式

| 屬性 | 值 | Token |
|---|---|---|
| 高度 | `27px`（由 md 字號決定） | - |
| Icon 尺寸 | `24x24px` | - |
| Icon-文字間距 | `8px` | `Spacing/8` |
| 文字 variant | `Texts / size=md (20) Bold` | - |
| 文字字號 | `20px` | - |
| 文字字重 | SemiBold 600 | - |
| 文字色 | `Color/Neutral/800` | `Color/Neutral/800` |
| 背景 | 無（透明） | - |
| Padding | 無（0px） | - |

---

## 各 Section 使用情境

| Section | Icon（swap） | 文字（swap） |
|---|---|---|
| Order status | `icons/operation-system` | "訂單快覽" |
| System notifications | `icons/label` | "系統通知" |
| Revenue trends | `icons/operation-system` | "營業資訊" |
| Statistics | `icons/operation-system` | "統計圖表" |

> 多個 section 共用 `icons/operation-system`，icon 命名統一，文字各自不同。

---

## 實作

```html
<div class="flex items-center gap-2">
  <img src="../assets/icons/operation-system.svg" class="w-6 h-6" alt="">
  <span class="text-xl font-semibold text-text-default">統計圖表</span>
</div>
```

> `gap-2` = 8px（`Spacing/8`）

---

*Generated from Figma component set - Updated 2026-04-13*

---

## 0527 重讀（**新增 8 個 pill-button variant**，共 9 variant）

Figma source：同一 `COMPONENT_SET Title` (`43:328`)，2026-05-27 重讀後 variant 由 1 增為 9。原 `type=Default` 是「icon + 文字」純標題（無 pill），新增的 8 個是同一 layout 包進**圓角藥丸按鈕**（pill），用於 trigger button 場景（如「加購明細」/「系統操作」按鈕）。

### 9 variant 全列

| # | variant 名 | id | w x h | pill bg | stroke | 用途 |
|---|---|---|---|---|---|---|
| 0 | `type=Default` | `43:327` | 288 x 27 | - | - | section header 純標題（既有，0413 段已記）|
| 1 | `type=button-active` | `1645:91755` | 152 x 51 | `Color/Accent/cart-button-active` (`#00c8b3`) 綠 | - | 已啟用 pill button（icon 白、字白）|
| 2 | `type=button-original` | `1646:91813` | 152 x 51 | `#ffffff` | `#d1d1d1` | idle pill button（icon 黑、字 `#454545`）|
| 3 | `type=button-has-value` | `1645:91032` | 152 x 51 | `Color/Accent/cart-button-active` (`#00c8b3`) 綠 | - | 綠 pill + 橙 badge「16」+ 上方浮動 Tooltip `$ ...` |
| 4 | `type=button-has-value-none-selected` | `1648:100878` | 152 x 51 | `#ffffff` | `#d1d1d1` | 白 pill + 橙 badge + Tooltip（同 #3 但白底）|
| 5 | `type=button-has-value-none-selected-calcY` | `1682:34755` | 268 x 51 | `#ffffff` | `#d1d1d1` | 白 pill + **藍** badge + **inline 價** `$ 199,299,399`（替代 Tooltip）|
| 6 | `type=button-has-value-none-selected-calcY-thumb` | `1786:54818` | 288 x 51 | `#ffffff` | `#d1d1d1` | 同 #5 + badge 內加 `icons/pin` |
| 7 | `type=button-has-value-selected-calcY-thumb` | `1786:54867` | 288 x 51 | `#f7d275` 黃 | `#d1d1d1` | 同 #6，pill bg 換成黃（selected 態）|
| 8 | `type=button-has-value-selected-calcY` | `1682:41209` | 268 x 51 | `#f7d275` 黃 | `#d1d1d1` | 同 #5，pill bg 換成黃（selected 態）|

### Pill 共用樣式（variant 1-8）

| 屬性 | 值 |
|---|---|
| `cornerRadius` | `44` |
| `padding` | top/bottom 12、left/right 20 |
| 高度 | `51` |
| icon-文字 gap | 8（icon 24x24 + Texts md 20px）|
| icon | `icons/cart`（24x24），fill 隨 pill bg 反色（白底 -> 黑、綠/黃底 -> 黑 fill + 白 stroke）|
| 標題文字 | Texts md 20px SemiBold；白底 -> `#454545`、綠/黃底 -> `#ffffff`（綠）或 `#454545`（黃）|

### Badge（Frame 562；variant 3-8）

| 屬性 | 值 |
|---|---|
| 尺寸 | 24x24（無 pin）/ 47x24（含 pin）|
| `cornerRadius` | `6` |
| `padding` | `4` |
| 數字字 | 16px Regular `#ffffff` |
| **bg 配色**（**依 calcY 軸切**）| has-value 純態 -> **橙 `#ef6f25`**（#3/#4） / calcY 系列 -> **藍 `Color/Accent/calc-result-background` (`#2178cf`)**（#5-8） |

含 `icons/pin`（thumb 變體 #6/#7）時 badge 內：左 `icons/pin` 16x16（白）+ 右側「16」字。

### Tooltip（variant 3/4 only）

`button-has-value` 與 `button-has-value-none-selected` 上方浮動小 tooltip，**僅在沒切到 calcY 系列時用**：

| 屬性 | 值 |
|---|---|
| 位置 | y: -26.5（pill 上方）|
| bg | `#4f4f4f` 深灰 |
| `cornerRadius` | `6` |
| `padding` | top/bottom 2、left/right 12 |
| 文字 | Texts base 16px `#ffffff`，範例 `$ 100,999,555` |
| 尾巴 | Polygon 1 `#4f4f4f`，位於 tooltip 底部偏右（x:68.53 y:30.25，9.53x8.25）|

> **calcY 系列（#5-8）改用 inline 價**：tooltip 從上方收回，pill 右側直接顯示 Texts base `$ 199,299,399`（`#454545`），同高度水平排列。

### Variant 軸總結

```
type=Default                                    （pure title，無 pill）
type=button-{active|original}                   （pill，無 value）
type=button-has-value[-none-selected][-calcY][-thumb]
- has-value = 有 badge
- none-selected = 白底（#4-8）
- calcY = 用 inline 價代替 Tooltip
- thumb = badge 內加 icons/pin（地理位置標記？）
- 無 none-selected = 綠底（#3）
- selected = 黃底 `#f7d275`（#7, #8）
```

### 0527 使用情境（待對位 preview/landing.html）

- 「加購明細」trigger（preview 既有 cart pill button）-> 對應 variant `button-original`（idle）/ `button-has-value-none-selected-calcY` 或 `-thumb`（有商品 + 顯示總額）/ `button-has-value-selected-calcY*`（user 點開後 selected 態）
- 「系統操作」trigger（pending；preview 未實裝）-> 對應 variant 1-4
- icon 永遠是 `icons/cart`，文字隨 trigger 用途 swap

### 0527 使用者確認（2026-05-28）

| # | 問題 | 答案 |
|---|---|---|
| 1 | 黃底 `#f7d275` 何時觸發？ | **selected 狀態**（user 點 pill 後切 selected；如 expand panel 開啟） |
| 2 | Tooltip 浮動 y:-26.5 是否會被 sticky header 遮擋？ | **不會被擋**（實裝沿用此位置即可，不需動態調整）|

*Updated 2026-05-28 (0527 reread)*
