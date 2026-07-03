# Component Specification: `Order`

> 命名注意：本檔是**首頁 dashboard 的訂單列 widget**，與訂單處理頁完全無關。訂單處理頁的狀態 pill 見 order-status-pill.md；房間預定頁 [E] 正式單與候補單 見 order-status.md。

**Figma Node ID**: `59:866`（Component Set）  
**Type**: COMPONENT（row item）  
**最後同步**: 2026-04-13（依 Landing page - 0116）

---

## 概述

`Order` 是訂單快覽列表的單一列元件，顯示訂單類型名稱與當前數量 badge。  
寬度**水平填滿容器**（fill），高度固定 34px。  
用於 `Order status` 區塊，垂直堆疊 5 列呈現今日各類訂單即時狀態。

---

## 尺寸與樣式

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | **fill**（填滿父容器） | — |
| 高度 | `34px` | — |
| Padding | top/bottom `6px`、left/right `12px` | `Spacing/6`、`Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Background fill | `Color/Neutral/75` | `Color/Neutral/75` |
| Border | **左側僅一條**，`Color/Brand/Brand-600`，`2px` | `Color/Surface/Brand-600-Active` |
| 其他三邊 border | なし（無） | — |

---

## 結構

```
[INSTANCE] Order (fill × 34px)
├── [INSTANCE] Texts — label（左對齊，fill 撐開）
│   └── [TEXT] base  16px  Color/Neutral/700
└── [INSTANCE] Texts — badge（右對齊，固定寬度）
    └── [TEXT] sm    12px  依狀態決定顏色
```

---

## Badge 狀態

### 狀態一：Active（數量 > 0）

| 屬性 | 值 | Token |
|---|---|---|
| Background | `Color/Surface/Negative` | `Color/Surface/Negative` |
| Corner radius | `4px` | `Radius/4` |
| Padding | top/bottom `2px`、left/right `4px` | `Spacing/2`、`Spacing/4` |
| Text color | `Color/Neutral/50` | `Color/Neutral/50` |
| Font size | `12px`（sm） | — |
| 顯示規則 | 數值 ≤ 99 → 直接顯示；數值 > 99 → 顯示 `"99+"` | — |

### 狀態二：Empty（數量為 0）

| 屬性 | 值 | Token |
|---|---|---|
| Background | `Color/Neutral/200` | `Color/Neutral/200` |
| Corner radius | `8px` | `Radius/8` |
| Padding | top/bottom `2px`、left/right `4px` | `Spacing/2`、`Spacing/4` |
| Text color | `Color/Neutral/800` | `Color/Neutral/800` |
| Font size | `12px`（sm） | — |
| 顯示規則 | 固定顯示 `"0"` | — |

---

## Label 文字樣式

| 屬性 | 值 | Token |
|---|---|---|
| Font | Noto Sans Regular | — |
| Font size | `16px`（base） | — |
| Color | `Color/Neutral/700` | `Color/Neutral/700` |
| Alignment | LEFT | — |

---

## 使用情境：`Order status` 容器

`Order status` 是包含 `Title` + `Order` 列表的容器 FRAME（非 component）：

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `556px`（0116 版本） | — |
| 高度 | `313px` | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |
| Background | 無（透明） | — |

**內部排列：**
- `Title`（112×27）— 頂部，icon `icons/order-info` + 文字「訂單快覽」
- `today order status` FRAME — 5 個 `Order` 列，垂直排列，列間距 `20px`

**5 個 Order 列（固定順序）：**

| # | 標籤 | 預設狀態 |
|---|---|---|
| 1 | 今日到店 | Active（範例值 99+） |
| 2 | 今日訂單 | Empty（0） |
| 3 | 今日退房 | Empty（0） |
| 4 | 今日催款 | Empty（0） |
| 5 | 今日過期 | Empty（0） |

---

## 版本變更記錄

| 版本 | Order 列寬 | Order status 容器寬 |
|---|---|---|
| 舊版 Landing page | 172px（固定） | 196px |
| Landing page - 0116 | fill（532px 於當前容器） | 556px |

> **結論**：元件本身為 fill 寬度，固定寬度是舊版容器較窄所致。實作時寬度設為 `w-full`。

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| Hover 狀態 | Figma 未定義 |
| Click / 展開互動 | Figma 未定義 |
| 數量介於 1–98 的 badge 外觀 | 推測同 Active，待確認 |
| Badge 上限溢出（> 99+） | Figma 未定義 |
| 行動版（mobile）佈局 | Figma 未定義 |

---

*Generated from Figma display page · Updated 2026-04-13（Landing page - 0116）*
