# Component Specification: `Button Y/N`

**Figma Node ID**: `73:554`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Button Y/N` 是確認/取消對話框的按鈕組，共 **2 個 variants**（屬性 `state`）：確定（深色）與取消（淺色）。  
通常成對出現於 Modal 對話框底部。


---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=yes` | `73:553` | 56×34px | 確定按鈕（深色） |
| `state=cancel` | `73:558` | 56×34px | 取消按鈕（淺色） |

---

## 結構（共用）

```
[COMPONENT] Button Y/N (56×34px)
└── Texts — base (32×22px, x:12, y:6)
    └── TEXT  16px  Regular
```

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `56×34px` | — |
| Padding | top/bottom `6px`、left/right `12px` | `Spacing/6`、`Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| 文字 variant | `Texts / base (16px Regular)` | — |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |

---

## state=yes（確定）

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `Color/Neutral/800` | `Color/Neutral/800` |
| 文字 | `"確定"` | — |
| 文字色 | `Color/Neutral/100` | `Color/Neutral/100` |

---

## state=cancle（取消）

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `Color/Neutral/200` | `Color/Neutral/200` |
| 文字 | `"取消"` | — |
| 文字色 | `Color/Neutral/800` | `Color/Neutral/800` |

---

## 實作

```html
<!-- 確定 -->
<button class="px-3 py-1.5 rounded-md bg-[Color/Neutral/800] text-text-inverse text-base border border-border-disabled">
  確定
</button>

<!-- 取消 -->
<button class="px-3 py-1.5 rounded-md bg-border-disabled text-text-default text-base border border-border-disabled">
  取消
</button>
```

---

*Generated from Figma component set · Updated 2026-04-13*
