# Component Specification: `Account`

**Figma Node ID**: `63:461`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Account` 是側邊欄底部的帳號列元件，顯示目前登入的帳號名稱與操作按鈕（登出、切換帳號）。  
共 **4 個 variants**（屬性 `state`）。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=Default` | `63:460` | 127×24px | 預設狀態 |
| `state=logout tooltip` | `71:371` | 127×24px | 滑鼠移至登出 icon，顯示 tooltip |
| `state=mobile` | `187:8527` | 127×24px | Mobile 版（左 padding 8px） |
| `state=transfer account` | `71:412` | 127×24px | 切換帳號狀態（結構同 Default） |

---

## 結構（Default / logout tooltip / transfer account 共用）

```
[COMPONENT] Account (127×24px)
├── Texts sm — 帳號名 (59×16, x:0, y:4)
│   └── TEXT "xiaomi999"  12px  Regular  Color/Neutral/800
└── Frame 9 — 操作按鈕列 (64×24, x:63)
    ├── icons/logout (24×24, x:4)   ← 登出
    └── icons/switch (24×24, x:40)  ← 切換帳號
```

| 屬性 | 值 | Token |
|---|---|---|
| 帳號文字 | `Texts / sm (12px Regular)` | — |
| 帳號文字色 | `Color/Neutral/800` | `Color/Neutral/800` |
| 帳號 x 位置 | x:0 | — |
| 操作列 x 位置 | x:63 | — |
| 兩 icon 間距 | x:40 - x:4 - 24 = **12px** | — |

---

## state=logout tooltip

在 Default 結構之上，疊加 `Tooltips` instance 於 logout icon 上方：

```
Tooltips instance (48×20px, x:48, y:17)
├── Polygon 1 (tooltip 箭頭, fills Color/Neutral/700, x:18, y:-6)  ← 向上箭頭
└── Texts sm → "登出"  12px  Regular  Color/Neutral/100
```

| 屬性 | 值 | Token |
|---|---|---|
| Tooltip 背景 | `Color/Neutral/700` | `Color/Neutral/700` |
| Tooltip corner radius | `6px` | `Radius/6` |
| Tooltip padding | top/bottom `2px`、left/right `12px` | `Spacing/2`、`Spacing/12` |
| Tooltip 文字色 | `Color/Neutral/100` | `Color/Neutral/100` |
| 箭頭 fill | `Color/Neutral/700` | `Color/Neutral/700` |
| 箭頭位置 | x:18, y:-6（向上，指向 icon） | — |

---

## state=mobile

與 Default 結構相同，差異在左側 padding：

| 屬性 | Default | Mobile |
|---|---|---|
| 帳號文字 x | `0` | `8px` |
| Padding left | `0` | `8px` |

---

## 操作 Icons

| Icon | 功能 | Node |
|---|---|---|
| `icons/logout` | 登出 | — |
| `icons/switch` | 切換帳號 | — |

---

## 實作注意事項

1. **帳號名稱**：動態渲染，`"xiaomi999"` 為示例值
2. **Tooltip**：logout icon hover 時顯示，`position: absolute; top: -28px`
3. **icons/switch**：點擊後觸發帳號切換流程（Figma 未定義切換後畫面）
4. **Mobile variant**：在 Mobile 側邊 menu 中使用，多 8px left padding

---

*Generated from Figma component set · Updated 2026-04-13*
