# Section Specification: Desktop — System notifications（系統通知）

> status: frozen-reference（dashboard 時期產物，2026-05-07 後未更新；新頁面規格一律走 specs/pages/ + components/，本檔不可作為新實作依據）

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
| Background | `Color/Neutral/0` | `Color/Neutral/0` |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |

---

## 結構

```
[INSTANCE] System notifications (572×313px)
├── [INSTANCE] Title (112×27px, x:12, y:12)
│   ├── [INSTANCE] icons/label (24×24)
│   └── [INSTANCE] Texts → [TEXT] "系統通知"  20px  SemiBold 600  Color/Neutral/800
├── [FRAME] notification list (548×250, x:12, y:51)
│   ├── Frame 79  — 第 1 列（22px 高）
│   ├── Frame 80  — 第 2 列（28px 高）
│   ├── Frame 81  — 第 3 列（28px 高）
│   ├── Frame 82  — 第 4 列（28px 高）
│   ├── Frame 83  — 第 5 列（28px 高）
│   ├── Frame 84  — 第 6 列（28px 高）
│   └── Frame 85  — 第 7 列（28px 高）
└── [RECT] Rectangle 15 (6×161px, x:552, y:68, visual-only scrollbar indicator) ← 捲動指示條
```

---

## Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/label`（24×24） | — |
| 文字 | `"系統通知"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `Color/Neutral/800` | `Color/Neutral/800` |

---

## 捲動指示條

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `6×161px` | — |
| 位置 | x:552, y:68（緊貼右側內邊） | — |
| Color | visual-only scrollbar indicator | 不作為 HTML 色彩 token；實作使用 browser scrollbar / existing neutral token |

> 捲動指示條為視覺設計元素，實作時由瀏覽器原生捲動條取代，不需手動實作。

---

## Desktop vs Mobile 差異

| 項目 | Desktop | Mobile |
|---|---|---|
| 容器寬度 | `572px` | `744px`（fill） |
| 位置 | Row 1 右欄（與 Order status 並排） | 獨立全寬 section |

---

## Input Chip 規格（inline badge）

> `Input — Default` variant 在此作為彩色 chip 使用，填色覆寫原始白底。

| 語意 | 文字 | bg | Token | 用於 |
|---|---|---|---|---|
| 類型：簡訊 | `簡訊` | `Color/Accent/Green` | `Color/Accent/Green` | Row 2, 3 |
| 嚴重度：總部 | `總部` | `Color/Surface/Negative` | `Color/Surface/Negative` | Row 2 |
| 嚴重度：分館 | `分館` | `Color/Brand/Brand-400` | `Color/Surface/Brand-400-Hover` | Row 3 |
| 類型：網址 | `網址` | `Color/MenuItem/Default` | `Color/MenuItem/Default` | Row 4–7 |

共用 chip 樣式：`height: 28px`、`padding: 6px 12px`、`border-radius: 6px`、`font-size: 12px`、`color: Color/Neutral/50`

---

## 通知列 HTML 實作規格

| 列 | 結構 | chip |
|---|---|---|
| 1 | `序號` + 純文字（`Color/Surface/Negative` 強調數字） | 無 |
| 2 | `序號` + GREEN chip + RED chip + 文字 | 簡訊（綠）、總部（紅） |
| 3 | `序號` + GREEN chip + ORANGE chip + 文字 | 簡訊（綠）、分館（橘） |
| 4–7 | `序號` + BLUE chip + 文字（日期 `Color/MenuItem/Default`，天數 `Color/Surface/Negative`） | 網址（藍） |

**HTML 語意選用**：
- 列表容器：`<ol class="list-none">` — 有序列表，符合編號語意
- 日期值：`<time>` — 語意化時間標記
- 強調數字：`<span class="text-status-negative">` — 僅色彩強調，不改變字重
- 藍色日期：`<time class="text-menu">` — 日期 + 顏色合一
- Chip：`<span class="inline-flex ...">` — inline badge，無互動

---

## 實作注意事項

1. **chip 位置**：chip 在序號之後、說明文字之前（非行末）
2. **文字大小**：通知文字為 `base`（16px），chip 內文字為 `sm`（12px）
3. **右側捲動**：若通知列超過容器高度，加 `overflow-y: auto`；原生捲動條取代 Figma 的指示矩形
4. **不使用 `<strong>` 改字重**：數字強調只需換色，字重保持 Regular 400

---

*Generated from Figma display page · Updated 2026-04-14*
