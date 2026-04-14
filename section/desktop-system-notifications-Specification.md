# Section Specification: Desktop — System notifications（系統通知）

**Figma Node ID**: `270:12598`（INSTANCE）  
**父層**: Landing page - 0116  
**最後同步**: 2026-04-14

---

## 概述

Desktop Row 1 右欄。顯示系統層級的警示通知（授權數量、簡訊餘額、網域到期等），由 `Title` + 7 列通知內容 + 右側捲動指示條組成。  
位於頁面 x:854, y:72，與左側 Order status 並排。

---

## 容器

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `572×313px` | — |
| 位置 | x:854, y:72（頁面絕對） | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Background | `#FFFFFF` | `Color/Neutral/0` |
| Border | `#D1D1D1` | `Color/Neutral/200` |

---

## 結構

```
[INSTANCE] System notifications (572×313px)
├── [INSTANCE] Title (112×27px, x:12, y:12)
│   ├── [INSTANCE] icons/label (24×24)
│   └── [INSTANCE] Texts → [TEXT] "系統通知"  20px  SemiBold 600  #454545
├── [FRAME] notification list (548×250, x:12, y:51)
│   ├── Frame 79  — 第 1 列（22px 高）
│   ├── Frame 80  — 第 2 列（28px 高）
│   ├── Frame 81  — 第 3 列（28px 高）
│   ├── Frame 82  — 第 4 列（28px 高）
│   ├── Frame 83  — 第 5 列（28px 高）
│   ├── Frame 84  — 第 6 列（28px 高）
│   └── Frame 85  — 第 7 列（28px 高）
└── [RECT] Rectangle 15 (6×161px, x:552, y:68, #D9D9D9) ← 捲動指示條
```

---

## Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/label`（24×24） | — |
| 文字 | `"系統通知"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `#454545` | `Color/Neutral/800` |

---

## 捲動指示條

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `6×161px` | — |
| 位置 | x:552, y:68（緊貼右側內邊） | — |
| Color | `#D9D9D9` | `Color/Scrollbar/Default` |

> 捲動指示條為視覺設計元素，實作時由瀏覽器原生捲動條取代，不需手動實作。

---

## Desktop vs Mobile 差異

| 項目 | Desktop | Mobile |
|---|---|---|
| 容器寬度 | `572px` | `744px`（fill） |
| 位置 | Row 1 右欄（與 Order status 並排） | 獨立全寬 section |

---

## 實作注意事項

1. **通知列為混合內容**：純文字、inline Input chip、彩色 Texts 混合；詳見 `components/system-notifications-Specification.md`
2. **右側捲動**：若通知列超過容器高度，加 `overflow-y: auto`；原生捲動條取代 Figma 的指示矩形

---

*Generated from Figma display page · Updated 2026-04-14*
