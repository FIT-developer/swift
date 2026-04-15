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
[COMPONENT] Title — type=Default (112×27px)
├── [INSTANCE] icons/operation-system (24×24, x:0, y:1.5) ← icon slot（可 swap）
└── [INSTANCE] Texts — md Bold (80×27, x:32)              ← 文字 slot（可 swap）
    └── [TEXT] "系統操作"  20px  SemiBold 600  #454545
```

> icon 垂直置中（y:1.5 = (27-24)/2）  
> icon 與文字間距：x:32 - 24 = **8px**

---

## 樣式

| 屬性 | 值 | Token |
|---|---|---|
| 高度 | `27px`（由 md 字號決定） | — |
| Icon 尺寸 | `24×24px` | — |
| Icon-文字間距 | `8px` | `Spacing/8` |
| 文字 variant | `Texts / size=md (20) Bold` | — |
| 文字字號 | `20px` | — |
| 文字字重 | SemiBold 600 | — |
| 文字色 | `#454545` | `Color/Neutral/800` |
| 背景 | 無（透明） | — |
| Padding | 無（0px） | — |

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
  <span class="text-xl font-semibold text-[#454545]">統計圖表</span>
</div>
```

> `gap-2` = 8px（`Spacing/8`）

---

*Generated from Figma component set · Updated 2026-04-13*
