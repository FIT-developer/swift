# Component Specification: `Select content`

**Figma Node ID**: `25:119`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Select content` 是 `Select` 下拉面板中的單一選項列，共 **2 個 variants**（屬性 `state`）。  
由 `icons/check`（左）+ `Texts base`（右）橫向排列組成。

---

## Variants

| Variant 名稱 | Node ID | 背景 | 說明 |
|---|---|---|---|
| `state=none selected` | `25:118` | `Color/Neutral/0` | 未選中 |
| `state=selected` | `25:120` | `Color/Chart/blue` | 已選中 |

---

## 結構

```
[COMPONENT] Select content (241×30px)
├── icons/check (16×16, x:4, y:7)     ← 勾選 icon
│   └── Vector (8.35×5.67px)
└── Texts — base (213×22, x:24, y:4)  ← 選項文字
    └── TEXT  16px  Regular
```

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `241×30px` | — |
| Padding | `4px` all sides | `Spacing/4` |
| Corner radius | `8px` | `Radius/8` |
| Icon 尺寸 | `16×16px` | — |
| Icon 位置 | x:4, y:7（垂直置中） | — |
| 文字位置 | x:24（icon 16 + gap 4 = 20，再 +4 padding = x:24） | — |
| 文字 variant | `Texts / base (16px Regular)` | — |

---

## 狀態樣式

### state=none selected

| 元素 | 屬性 | 值 | Token |
|---|---|---|---|
| 容器 | background | `Color/Neutral/0` | `Color/Neutral/0` |
| icons/check | Vector fill | `Color/Neutral/0` | `Color/Neutral/0`（不可見） |
| Texts | 文字色 | `Color/Neutral/800` | `Color/Neutral/800` |

> `icons/check` 填色與背景同色（Color/Neutral/0），視覺上不可見，結構上保留位置。

---

### state=selected

| 元素 | 屬性 | 值 | Token |
|---|---|---|---|
| 容器 | background | `Color/Chart/blue` | `Color/Bootstrap/components/focus` |
| icons/check | Vector fill | `Color/Neutral/50` | `Color/Neutral/50` |
| Texts | 文字色 | `Color/Neutral/50` | `Color/Neutral/50` |

---

## 示例文字

Figma 佔位文字：`"199) 地球村美日語太平洋旅店"`  
（格式：`{代號}) {名稱}`，實際使用時 swap 文字內容）

---

## 實作

```html
<!-- none selected -->
<div class="flex items-center gap-1 px-1 py-1 rounded-lg bg-white cursor-pointer hover:bg-surface-hover">
  <span class="w-4 h-4 flex-shrink-0"></span><!-- check icon placeholder (invisible) -->
  <span class="text-base text-text-default">199) 地球村美日語太平洋旅店</span>
</div>

<!-- selected -->
<div class="flex items-center gap-1 px-1 py-1 rounded-lg bg-[Color/Chart/blue]">
  <img src="../assets/icons/check.svg" class="w-4 h-4 flex-shrink-0">
  <span class="text-base text-surface-default">199) 地球村美日語太平洋旅店</span>
</div>
```

---

*Generated from Figma component set · Updated 2026-04-13*
