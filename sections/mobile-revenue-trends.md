# Section Specification: Revenue Trends（Mobile）

**Figma Node ID**: `270:11728`（推測，Revenue trends FRAME）  
**Type**: FRAME  
**父層**: Landing page (mobile) - 0116（768×2278px）  
**最後同步**: 2026-04-13

---

## 概述

Mobile 版營業資訊趨勢區塊。Card 排列改為**橫向捲動**，Card 4 刻意部分超出視窗右緣以提示可滑動。  
內容（Card 數量、文字、數值）與 Desktop 版相同。

---

## 佈局位置

| 屬性 | 值 | 說明 |
|---|---|---|
| 位置 | x:12, y:722 | 頁面 padding 內 |
| 與上方間距 | 24px（System notifications 底部 y:698 → 此區塊 y:722） | `Spacing/24` |

---

## 容器尺寸（Mobile vs Desktop）

| 屬性 | Mobile | Desktop |
|---|---|---|
| 寬度 | `744px` | `1154px` |
| 高度 | `200px` | `200px`（相同） |
| Padding | `12px` all sides | `12px`（相同） |
| Corner radius | `6px` | `6px`（相同） |
| Border | `#D1D1D1` | `#D1D1D1`（相同） |

---

## 結構

```
[FRAME] Revenue trends (744×200px)
├── [INSTANCE] Title
│   ├── [INSTANCE] icons/operation-system (24×24)
│   └── [INSTANCE] Texts → [TEXT] "營業資訊"  20px  SemiBold 600  #454545
└── [FRAME] Trend details (720×148, y:40)  ← 橫向捲動容器
    ├── Card 1（今日營收） 220px  x:0
    ├── Card 2（平均房價） 220px  x:236
    ├── Card 3（今日住房率） 220px  x:472
    └── Card 4（今日超賣） 190px  x:708  ← 部分超出，截斷提示可滑動
```

---

## Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/operation-system`（24×24） | — |
| 文字 | `"營業資訊"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `#454545` | `Color/Neutral/800` |

---

## Trend details（橫向捲動）

| 屬性 | 值 |
|---|---|
| 尺寸 | `720×148px` |
| 排列 | 橫向，**不換行** |
| 捲動 | `overflow-x: auto`（橫向捲動） |
| Card 間距 | `16px`（gap） |

### Card 排列

| Card | 寬度 | x 位置 | 可見性 | 說明 |
|---|---|---|---|---|
| Card 1（今日營收） | `220px` | x:0 | 完整顯示 | — |
| Card 2（平均房價） | `220px` | x:236 | 完整顯示 | gap 16px |
| Card 3（今日住房率） | `220px` | x:472 | 完整顯示 | gap 16px |
| Card 4（今日超賣） | `190px` | x:708 | **部分顯示**（右緣截斷） | gap 16px，超出 178px |

> Card 4 右緣：x:708 + 190 = **898px** > 容器寬度 720px，超出約 **178px**。  
> 設計意圖：Card 4 僅露出左緣約 12px，暗示用戶可**左右滑動**。

### Card 內容摘要

| Card | type | 標籤 | 說明 |
|---|---|---|---|
| Card 1 | `tend up` | 今日營收 | 有數值 + attached-link chip + 趨勢上升 |
| Card 2 | `tend up` | 平均房價 | 同上 |
| Card 3 | `tend up` | 今日住房率 | 同上 |
| Card 4 | `over sold` | 今日超賣 | 標籤橙色，warning icon |

> 完整 Card 規格見 `components/card.md`。

---

## 實作注意事項

1. **橫向捲動容器**：`overflow-x-auto flex flex-nowrap gap-4`
2. **Card 寬度固定**：`min-w-[220px]`（Card 1–3）、`min-w-[190px]`（Card 4）
3. **截斷效果**：`overflow-x-hidden` 套用於外層容器，Card 4 自然截斷
4. **不顯示捲動條**：可用 `scrollbar-hide` 或 `-webkit-scrollbar` 隱藏
5. **Trend details y:40**：Title 高度 20px + 間距 20px = 40px offset

---

## Desktop vs Mobile 差異

| 項目 | Desktop | Mobile |
|---|---|---|
| 容器寬度 | `1154px` | `744px` |
| Trend details 寬 | `1130px` | `720px` |
| Card 排列 | 4 卡完全顯示（水平排列） | 4 卡橫向捲動，Card 4 部分截斷 |
| Card 4 可見性 | 完整可見 | 僅左緣可見（~12px） |

---

*Generated from Figma mobile layout · Updated 2026-04-13*
