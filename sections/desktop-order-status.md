# Section Specification: Desktop — Order status（訂單快覽）

**Figma Node ID**: `270:11735`（FRAME）  
**父層**: Landing page - 0116  
**最後同步**: 2026-04-14

---

## 概述

Desktop Row 1 左欄。顯示今日各類訂單的即時數量，由 `Title` + 5 列 `Order` component 垂直堆疊組成。  
位於頁面 x:272, y:72，與右側 System notifications 並排。

---

## 容器

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `556×313px` | — |
| 位置 | x:272, y:72（頁面絕對） | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Background | `#FFFFFF` | `Color/Neutral/0` |
| Border | `#D1D1D1` | `Color/Neutral/200` |

---

## 結構

```
[FRAME] Order status (556×313px)
├── [INSTANCE] Title (112×27px, x:12, y:12)
│   ├── [INSTANCE] icons/operation-system (24×24)
│   └── [INSTANCE] Texts → [TEXT] "訂單快覽"  20px  SemiBold 600  #454545
└── [FRAME] today order status (532×250px, x:12, y:51)
    ├── [INSTANCE] Order — 今日到訪    (532×34px, y:0)
    ├── [INSTANCE] Order — 今日訂單    (532×34px, y:54)
    ├── [INSTANCE] Order — 今日進房    (532×34px, y:108)
    ├── [INSTANCE] Order — 今日退款    (532×34px, y:162)
    └── [INSTANCE] Order — 今日逾期    (532×34px, y:216)
```

---

## Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/operation-system`（24×24） | — |
| 文字 | `"訂單快覽"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `#454545` | `Color/Neutral/800` |

---

## Order rows

| 屬性 | 值 | Token |
|---|---|---|
| 列寬 | `532px`（fill，556 - 24 padding） | — |
| 列高 | `34px` | — |
| 列間距 | `54 - 34 = 20px` | `Spacing/20` |
| Background | `#F6FAFD` | `Color/Neutral/75` |
| Border | **左側僅一條** `#E05216`，`2px`；其他三邊無 | `Color/Surface/Brand-600-Active` |
| Padding | top/bottom `6px`、left/right `12px` | `Spacing/6`、`Spacing/12` |
| Corner radius | `6px` | `Radius/6` |

### 資料列（範例，實際值由後端提供）

| # | 標籤 | 說明 |
|---|---|---|
| 1 | 今日到訪 | 今日到訪訂單數 |
| 2 | 今日訂單 | 今日訂單總數 |
| 3 | 今日進房 | 今日 check-in 數 |
| 4 | 今日退款 | 今日退款數 |
| 5 | 今日逾期 | 今日逾期未處理數 |

> 標籤文字為動態資料，以上為 Figma 示意稿的範例值。  
> 完整 Order component 規格（badge 狀態等）見 `components/order.md`。

---

## Desktop vs Mobile 差異

| 項目 | Desktop | Mobile |
|---|---|---|
| 容器寬度 | `556px` | `744px`（fill） |
| Order row 寬 | `532px` | `720px`（fill） |
| 位置 | Row 1 左欄（與 System notif. 並排） | 獨立全寬 section |
| 上方 nav bar | 無（sidebar 取代導覽） | 有 nav bar（Frame 4） |

---

## 實作注意事項

1. **Order rows 全寬**：`w-full` 填滿父容器去掉 padding 後的寬度
2. **列間距**：`gap-5`（20px）
3. **左側 border 僅**：`border-l-2 border-[#E05216]`，不加 `border` 全框
4. **Badge Active**：`bg-[#E12129] text-[#F6F6F6] rounded`（4px radius），值 ≤ 99 顯示數字，> 99 顯示 `99+`
5. **Badge Empty**：`bg-[#D1D1D1] text-[#454545] rounded-lg`（8px radius），顯示 `0`
6. **此 section 在 Mobile 不存在**；Mobile 版 Order status 包含於 `mobile-top` section 中

---

*Generated from Figma display page · Updated 2026-04-14*
