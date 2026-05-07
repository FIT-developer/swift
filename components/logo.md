# Component Specification: `Logo`

**Figma Node ID**: `22:194`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Logo` 提供品牌 logo 的三種尺寸 variants。  
`size=small` 為 24×24px 圖示版，用於 Mobile nav bar；  
`size=Large` 為完整橫幅版（含留白）；  
`size=mobile` 為 Mobile 側邊 menu 展開後的頂部列（logo + 關閉按鈕）。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 用途 |
|---|---|---|---|
| `size=Large` | `22:193` | 119×132.48px | Desktop sidebar 頂部大型 logo |
| `size=small` | `22:195` | 24×24px | Mobile nav bar 左側 icon |
| `size=mobile` | `187:8509` | 119×24px | Mobile 側邊 menu 展開後頂部列 |

---

## Variant 詳細

### size=Large

```
[COMPONENT] Logo — size=Large (119×132.48px)
└── Vector (111×84.48px, x:4, y:24)  ← 多色品牌圖形（fills: mixed）
```

| 屬性 | 值 |
|---|---|
| 尺寸 | 119×132.48px |
| Padding | top/bottom `24px`、left/right `4px` |
| 內容 | 多色向量圖形（品牌完整 logo） |
| 背景 | `Color/Neutral/0` |

---

### size=small

```
[COMPONENT] Logo — size=small (24×24px)
└── Vector (24×24px)  ← 多色品牌圖形（fills: mixed）
```

| 屬性 | 值 |
|---|---|
| 尺寸 | 24×24px |
| Padding | 無（0px） |
| 內容 | 多色向量圖形（品牌 icon 版） |
| 背景 | `Color/Neutral/0` |

> Mobile nav bar（Frame 4）使用此 variant，對應節點名稱 `icons/logo`。

---

### size=mobile

```
[COMPONENT] Logo — size=mobile (119×24px)
└── Frame 46 (115×24px)
    ├── Vector (24×24, x:0)         ← 品牌 logo icon（同 small）
    └── icons/close (24×24, x:91)  ← 關閉按鈕
```

| 屬性 | 值 |
|---|---|
| 尺寸 | 119×24px |
| Padding | right `4px`，其餘 0 |
| Logo icon | 24×24px，x:0 |
| 關閉 icon | `icons/close`，24×24px，x:91 |
| Logo 與 close 間距 | 91 - 24 = **67px** |
| 背景 | `Color/Neutral/0` |

> 用於 Mobile 側邊 menu 展開後的頂部列：左側 logo、右側 × 關閉按鈕。  
> 關閉按鈕 icon 為 `icons/close`（13.15×13.15px Vector，fills `Color/Icon/Default`）。

---

## 使用情境

| 情境 | Variant | 位置 |
|---|---|---|
| Desktop sidebar 頂部 | `size=Large` | menu component 內 |
| Mobile nav bar | `size=small` | Frame 4，x:0 |
| Mobile 側邊 menu 展開後頂部 | `size=mobile` | 展開 menu 頂部列 |

---

## 實作說明

- `size=small`：直接用 `<img src="assets/icons/logo.svg" class="w-6 h-6">` 或內嵌 SVG
- `size=Large`：`<img src="assets/logo-large.svg" class="w-[119px]">`
- `size=mobile`：`<div class="flex justify-between items-center pr-1">logo + close button</div>`

---

*Generated from Figma component set · Updated 2026-04-13*
