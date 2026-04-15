# Component Specification: `Texts`

**Figma Node ID**: `4:4`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Texts` 是全站通用文字元件，提供 6 個字號 × Regular/Bold 共 **12 個 variants**。  
所有 variant 預設文字色為 `#454545`，在 instance 使用時依情境 swap 顏色。  
字體統一為 **Noto Sans**。

---

## Variants

| Variant 名稱 | 屬性 `size` | 字號 | 字重 | Font Style | Figma Node |
|---|---|---|---|---|---|
| `size=sm (12)` | sm | `12px` | 400 Regular | Regular | `4:5` |
| `size=sm (12) Bold` | sm Bold | `12px` | 600 SemiBold | SemiBold | `5:67` |
| `size=base (16)` | base | `16px` | 400 Regular | Regular | `4:3` |
| `size=base (16) Bold` | base Bold | `16px` | 600 SemiBold | SemiBold | `5:72` |
| `size=md (20)` | md | `20px` | 400 Regular | Regular | `5:50` |
| `size=md (20) Bold` | md Bold | `20px` | 600 SemiBold | SemiBold | `5:74` |
| `size=lg (24)` | lg | `24px` | 400 Regular | Regular | `5:52` |
| `size=lg (24) Bold` | lg Bold | `24px` | 600 SemiBold | SemiBold | `5:76` |
| `size=xl (28)` | xl | `28px` | 400 Regular | Regular | `5:54` |
| `size=xl (28) Bold` | xl Bold | `28px` | 600 SemiBold | SemiBold | `5:78` |
| `size=xxl (32)` | xxl | `32px` | 400 Regular | Regular | `5:56` |
| `size=xxl (32) Bold` | xxl Bold | `32px` | 600 **Display SemiBold** | Display SemiBold | `5:80` |

> `xxl Bold` 使用 `Display SemiBold` 字型樣式（而非 SemiBold），兩者字重同為 600，但 Noto Sans Display 系列有不同的字形設計。

---

## 共通樣式

| 屬性 | 值 | Token |
|---|---|---|
| 字體 | Noto Sans | — |
| 預設文字色 | `#454545` | `Color/Neutral/800` |
| 背景 | `#ffffff`（透明底） | — |
| Padding | 無（0px） | — |
| 對齊 | LEFT | — |

---

## 字號對照表

| 名稱 | 字號 | Tailwind 類別 |
|---|---|---|
| sm | `12px` | `text-xs` |
| base | `16px` | `text-base` |
| md | `20px` | `text-xl` |（Tailwind `text-xl` = 20px）
| lg | `24px` | `text-2xl` |
| xl | `28px` | `text-[28px]` |
| xxl | `32px` | `text-[32px]` |

---

## 使用情境（已知）

| 元件 | 使用 variant | 說明 |
|---|---|---|
| Order | `base`（16px Regular） | 訂單類型標籤（#4F4F4F） |
| Order | `sm`（12px Regular） | Badge 數字 |
| System notifications | `base` / `sm` | 通知內文、chip 文字 |
| Revenue trends Title | `md Bold`（20px SemiBold） | Section 標題 |
| Statistics Title | `md Bold`（20px SemiBold） | Section 標題 |
| Card | `sm` / `base` | 標籤、數值、趨勢說明 |
| Input | `sm` / `base` | 輸入文字、sub label |
| floatIcons/ai | `base`（16px Regular） | "客服" 標籤 |
| chartjs 圖表 | `sm` | 軸標籤、圖例文字 |

---

## 實作說明

`Texts` 在 HTML 中對應為帶有 Tailwind 字級與字重的 `<span>` 或 `<p>`，  
不需要獨立的 component wrapper，直接套用 class 即可。

```html
<!-- sm Regular -->
<span class="text-xs font-normal text-[#454545]">...</span>

<!-- base Regular -->
<span class="text-base font-normal text-[#454545]">...</span>

<!-- md Bold (Section Title 用) -->
<span class="text-xl font-semibold text-[#454545]">...</span>

<!-- xxl Bold (Display SemiBold) -->
<span class="text-[32px] font-semibold text-[#454545]">...</span>
```

> 文字色依情境覆蓋，不鎖定在 `#454545`。

---

*Generated from Figma component set · Updated 2026-04-13*
