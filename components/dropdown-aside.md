# Component Specification: `Dropdown aside`

**Figma Node ID**: `35:107`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Dropdown aside` 是側邊選單的折疊式主項目元件，含子項目列表的展開/收合行為。  
共 **2 個 variants**（屬性 `state`）：收合（Default）與展開（active）。  
用於 `menu` component 的導覽層級中。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=Default` | `35:106` | 136×22px | 收合，顯示主項目 + 右箭頭 |
| `state=active` | `35:108` | 136×90px | 展開，顯示主項目 + 子項目列表 |

---

## state=Default（收合）

```
[COMPONENT] Dropdown aside — Default (136×22px)
├── Texts — base (69×22px, x:0)     ← 主項目文字
│   └── TEXT "主項目 一"  16px  Regular  #454545
└── icons/right (16×16, x:120, y:3) ← 收合狀態箭頭（向右）
    └── Vector  fills #000000
```

| 屬性 | 值 | Token |
|---|---|---|
| 高度 | `22px` | — |
| 文字 | `Texts / base (16px Regular)` | — |
| 文字色 | `#454545` | `Color/Neutral/800` |
| 右側 icon | `icons/right`（16×16） | — |
| 背景 | 無（透明） | — |

---

## state=active（展開）

```
[COMPONENT] Dropdown aside — active (136×90px)
├── Frame 6 — 主項目列 (136×24px, y:0)
│   ├── Texts — base (112×22px, x:0)   ← 主項目文字
│   │   └── TEXT "主項目 二"  16px  Regular  #454545
│   └── icons/down (24×24, x:112)      ← 展開狀態箭頭（向下）
└── Frame 5 — 子項目區 (136×64px, y:28)
    ├── Frame 4 — 垂直連接線 (16×109px, x:0)
    │   └── Line 1  stroke #b0b0b0（左側縱線）
    └── Frame 2 — 子項目列表 (112×64px, x:24)
        └── Frame 3
            ├── Texts sm "子項目 一" (y:0)   → bg #e1e1e0（選中）+ icons/cursor overlay
            ├── Texts sm "子項目 二" (y:24)  → bg #ffffff（未選中）
            └── Texts sm "子項目 三" (y:48)  → bg #ffffff（未選中）
```

### 主項目列（Frame 6）

| 屬性 | 值 | Token |
|---|---|---|
| 高度 | `24px` | — |
| 主項目文字 | `Texts / base (16px Regular)`，#454545 | — |
| 右側 icon | `icons/down`（24×24，x:112） | — |

### 子項目區

| 屬性 | 值 | Token |
|---|---|---|
| 縱向連接線 | stroke `#b0b0b0` | `Color/Neutral/300` |
| 子項目列表 x | `24px`（連接線寬 16 + gap 8） | — |
| 子項目高度 | `16px`（sm 字號） | — |
| 子項目間距 | `8px`（y:0, y:24，高 16 → gap 8） | `Spacing/8` |
| 子項目文字 | `Texts / sm (12px Regular)`，#454545 | — |

### 子項目狀態

| 狀態 | 背景 | 說明 |
|---|---|---|
| 選中（active） | `#e1e1e0` | `Color/Neutral/100`，含 `icons/cursor` 疊加 |
| 未選中 | `#ffffff` | `Color/Neutral/0` |

> `icons/cursor`（24×24）疊加於選中子項目上方（x:47, y:8.77），代表游標 hover 狀態的視覺提示。

---

## 展開/收合差異

| 狀態 | 右側 icon | 子項目 |
|---|---|---|
| Default（收合） | `icons/right`（16×16） | 隱藏 |
| active（展開） | `icons/down`（24×24） | 顯示，帶左側縱線 |

---

## 實作注意事項

1. **收合/展開切換**：點擊主項目列 toggle `state`，icon 從 right → down
2. **左側縱線**：`border-l border-[#b0b0b0]`，高度隨子項目數量延伸
3. **選中子項目**：`bg-[#e1e1e0]`，其餘 `bg-white hover:bg-[#F6FAFD]`
4. **icons/cursor**：hover 效果，實作用 CSS `:hover` 顯示游標 icon 或改變 cursor 樣式

---

*Generated from Figma component set · Updated 2026-04-13*
