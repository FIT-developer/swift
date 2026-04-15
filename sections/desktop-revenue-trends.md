# Section Specification: Desktop — Revenue trends（營業資訊）

**Figma Node ID**: `270:11728`（FRAME）  
**父層**: Landing page - 0116  
**最後同步**: 2026-04-14

---

## 概述

Desktop Row 2，全寬橫排。顯示今日 4 項 KPI 數據（營收、房價、住房率、超賣），  
由 `Title` + `Trend details`（4 個 `Card` instances 橫排）組成。

---

## 容器

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `1154×200px` | — |
| 位置 | x:272, y:409（頁面絕對） | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Background | 無（透明） | — |
| Border | `#D1D1D1` | `Color/Neutral/200` |

---

## 結構

```
[FRAME] Revenue trends (1154×200px)
├── [INSTANCE] Title (112×27px, x:12, y:12)
│   ├── [INSTANCE] icons/operation-system (24×24)
│   └── [INSTANCE] Texts → [TEXT] "營業資訊"  20px  SemiBold 600  #454545
└── [FRAME] Trend details (1130×137px, x:12, y:51)
    ├── [INSTANCE] Card — 今日營收    (270.5×137px,   x:0)
    ├── [INSTANCE] Card — 平均房價    (270.5×134.5px, x:286.5)
    ├── [INSTANCE] Card — 今日住房率  (270.5×134.5px, x:573)
    └── [INSTANCE] Card — 今日超賣    (270.5×132px,   x:859.5)
```

---

## Trend details 橫排配置

| Card | 寬度 | x（local）| 間距 |
|---|---|---|---|
| 今日營收 | 270.5px | 0 | — |
| 平均房價 | 270.5px | 286.5 | 16px |
| 今日住房率 | 270.5px | 573 | 16px |
| 今日超賣 | 270.5px | 859.5 | 16px |

- 4 卡等寬：`(1130 - 16×3) / 4 = 270.5px` ✓
- Card 間距：**16px**（`Spacing/16`）

---

## Desktop vs Mobile 差異

| 項目 | Desktop | Mobile |
|---|---|---|
| 容器寬度 | `1154px` | `744px` |
| Cards 排列 | 4 卡全寬平排 | 橫向捲動（第 4 卡部分露出） |
| Card 寬度 | `270.5px` | `220px`（前 3 卡）/ `190px`（第 4 卡） |

---

## 實作注意事項

1. **Desktop**：`flex gap-4`（16px），4 卡不換行
2. **Card 規格**：完整見 `components/card-Specification.md` 與 `components/revenue-trends-Specification.md`

---

*Generated from Figma display page · Updated 2026-04-14*
