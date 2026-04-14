# Component Specification: `Function icons`

**Figma Node ID**: `187:8227`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Function icons` 是頂部工具列的功能圖示群組，由 **4 個帶 badge 的 icon** 橫向排列組成。  
僅有 **1 個 variant**（`state=Default`）。  
每個 icon 右上角疊加計數 badge，數量為 0 時顯示灰色，大於 0 時顯示品牌橙色。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 |
|---|---|---|
| `state=Default` | `187:8209` | 156×24px |

---

## 結構

```
[COMPONENT] Function icons — state=Default (156×24px)
├── function icons (24×24, x:0)    ← icons/bulletin  + badge "99"
├── function icons (24×24, x:44)   ← icons/message   + badge "0"
├── function icons (24×24, x:88)   ← icons/person-md + badge "99+"
└── function icons (24×24, x:132)  ← icons/system    + badge "99+"
```

> 每個 unit 間距：44px（icon 24px + gap 20px）

---

## 單一 function icon 結構

```
function icons (24×24px)
├── [INSTANCE] icons/xxx (24×24)           ← 主要 icon
└── [INSTANCE] Texts — sm badge (右上角)   ← 計數 badge
    └── TEXT  12px  Regular
```

### Badge 規格

| 屬性 | 值 | Token |
|---|---|---|
| 字號 | `12px`（sm） | — |
| 字重 | Regular 400 | — |
| Padding | top/bottom `2px`、left/right `4px` | `Spacing/2`、`Spacing/4` |
| Corner radius | `56px`（完整圓角） | `Radius/56` |
| 位置 | x:12–15.5, y:-7（右上角外溢） | — |

### Badge 狀態

| 狀態 | 條件 | 背景 | 文字色 | Token |
|---|---|---|---|---|
| Active | 計數 > 0 | `#ef6f25` | `#f6f6f6` | `Color/Surface/Brand-500-Default` / `Color/Neutral/50` |
| Empty | 計數 = 0 | `#d1d1d1` | `#454545` | `Color/Neutral/200` / `Color/Neutral/800` |

---

## 4 個 Icon 詳細

| 位置 | Icon | 示例計數 | 功能說明 |
|---|---|---|---|
| x:0 | `icons/bulletin` | `99` | 公告通知 |
| x:44 | `icons/message` | `0` | 訊息（空狀態，灰色 badge） |
| x:88 | `icons/person-md` | `99+` | 客戶／人員通知 |
| x:132 | `icons/system` | `99+` | 系統通知 |

> `99+` 表示計數超過 99 時顯示上限值。

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| Active badge 背景 | `#ef6f25` | `Color/Surface/Brand-500-Default` |
| Active badge 文字 | `#f6f6f6` | `Color/Neutral/50` |
| Empty badge 背景 | `#d1d1d1` | `Color/Neutral/200` |
| Empty badge 文字 | `#454545` | `Color/Neutral/800` |

---

## 實作注意事項

1. **Badge 外溢**：badge `position: absolute; top: -7px; right: -7px`（相對於 icon 容器）
2. **計數邏輯**：0 → gray badge；1–99 → 數字 + orange；99+ → "99+" + orange
3. **Icon 容器**：`position: relative`，讓 badge 可以外溢定位

```html
<div class="flex gap-5">
  <!-- bulletin icon -->
  <div class="relative w-6 h-6">
    <img src="../assets/icons/bulletin.svg" class="w-6 h-6">
    <span class="absolute -top-1.5 -right-1.5 text-xs font-normal px-1 py-0.5 rounded-full bg-[#ef6f25] text-[#f6f6f6] leading-none">99</span>
  </div>
  <!-- message icon (empty) -->
  <div class="relative w-6 h-6">
    <img src="../assets/icons/message.svg" class="w-6 h-6">
    <span class="absolute -top-1.5 -right-1.5 text-xs font-normal px-1 py-0.5 rounded-full bg-[#d1d1d1] text-[#454545] leading-none">0</span>
  </div>
  <!-- person-md icon -->
  <div class="relative w-6 h-6">
    <img src="../assets/icons/person-md.svg" class="w-6 h-6">
    <span class="absolute -top-1.5 -right-1.5 text-xs font-normal px-1 py-0.5 rounded-full bg-[#ef6f25] text-[#f6f6f6] leading-none">99+</span>
  </div>
  <!-- system icon -->
  <div class="relative w-6 h-6">
    <img src="../assets/icons/system.svg" class="w-6 h-6">
    <span class="absolute -top-1.5 -right-1.5 text-xs font-normal px-1 py-0.5 rounded-full bg-[#ef6f25] text-[#f6f6f6] leading-none">99+</span>
  </div>
</div>
```

---

*Generated from Figma component set · Updated 2026-04-13*
