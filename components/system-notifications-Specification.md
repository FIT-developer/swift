# Component Specification: `System notifications`

**Figma Node ID**: `270:12598`（INSTANCE）  
**Type**: INSTANCE（component instance，非 Component Set）  
**最後同步**: 2026-04-13（依 Landing page - 0116）

---

## 概述

`System notifications` 是系統通知列表區塊，顯示各類型系統警示（簡訊餘額、授權數量、網域到期等）。  
固定尺寸 **572×313px**，內含標題列與 7 筆通知列，每列由純文字、inline Input chip、彩色數字 `Texts` 混合組成。

---

## 尺寸與樣式（容器）

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `572px` | — |
| 高度 | `313px` | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Background | `#FFFFFF` | `Color/Neutral/0` |
| Border (stroke) | `#D1D1D1` | `Color/Neutral/200` |
| Border width | `1px` | — |

---

## 結構

```
[INSTANCE] System notifications (572×313px)
├── [INSTANCE] Title
│   ├── [INSTANCE] icons/label (24×24)
│   └── [INSTANCE] Texts → [TEXT] "系統通知"  20px  SemiBold 600  #454545
├── [FRAME] notification list (548×250, x:12 y:51)
│   ├── Frame 79  — 第 1 列：授權數量
│   ├── Frame 80  — 第 2 列：簡訊餘額（總部）
│   ├── Frame 81  — 第 3 列：簡訊餘額（分館）
│   ├── Frame 82  — 第 4 列：網域到期
│   ├── Frame 83  — 第 5 列：網域到期
│   ├── Frame 84  — 第 6 列：網域到期
│   └── Frame 85  — 第 7 列：網域到期
└── [RECT] Rectangle 15 (6×161, x:552, #D9D9D9) ← 右側捲動指示器
```

---

## Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/label` (24×24) | — |
| 文字 | `"系統通知"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `#454545` | `Color/Neutral/800` |

> **注意**：此元件的 Title 字重為 SemiBold 600，已確認為設計意圖（2026-04-13 統一）。

---

## 通知列完整內容（共 7 列）

### 第 1 列 — 授權數量

```
"1.有" [plain] + "28" [red] + "筆授權單。" [plain]
```

| 元素 | 文字 | 顏色 | Token |
|---|---|---|---|
| 數字編號 + 前綴 | `1.有` | `#454545` | `Color/Neutral/800` |
| 強調數字 | `28` | `#E12129` | `Color/Surface/Negative` |
| 後綴 | `筆授權單。` | `#454545` | `Color/Neutral/800` |

---

### 第 2 列 — 簡訊餘額（總部）

```
"2." [plain] + [Input 簡訊 GREEN] + [Input 總部 RED] + "簡訊剩" [plain] + "28" [red] + "通。" [plain]
```

| 元素 | 文字 | 顏色 | Token |
|---|---|---|---|
| 數字編號 | `2.` | `#454545` | `Color/Neutral/800` |
| Input chip | `簡訊` | bg `#34C759` | `Color/Accent/Green` |
| Input chip | `總部` | bg `#E12129` | `Color/Surface/Negative` |
| 一般文字 | `簡訊剩` | `#454545` | `Color/Neutral/800` |
| 強調數字 | `28` | `#E12129` | `Color/Surface/Negative` |
| 後綴 | `通。` | `#454545` | `Color/Neutral/800` |

---

### 第 3 列 — 簡訊餘額（分館）

```
"3." [plain] + [Input 簡訊 GREEN] + [Input 分館 ORANGE] + "簡訊剩" [plain] + "28" [red] + "通。" [plain]
```

| 元素 | 文字 | 顏色 | Token |
|---|---|---|---|
| 數字編號 | `3.` | `#454545` | `Color/Neutral/800` |
| Input chip | `簡訊` | bg `#34C759` | `Color/Accent/Green` |
| Input chip | `分館` | bg `#F28B45` | `Color/Surface/Brand-400-Hover` |
| 一般文字 | `簡訊剩` | `#454545` | `Color/Neutral/800` |
| 強調數字 | `28` | `#E12129` | `Color/Surface/Negative` |
| 後綴 | `通。` | `#454545` | `Color/Neutral/800` |

---

### 第 4–7 列 — 網域到期（共 4 列，內容相同）

```
"N." [plain] + [Input 網址 BLUE] + "義大利山莊網址到期日" [plain] + "2022-01-22" [blue] + "於" [plain] + "28" [red] + "天後過期。" [plain]
```

| 元素 | 文字 | 顏色 | Token |
|---|---|---|---|
| 數字編號 | `4.`–`7.` | `#454545` | `Color/Neutral/800` |
| Input chip | `網址` | bg `#2178CF` | `Color/MenuItem/Default` |
| 場館名稱 | `義大利山莊網址到期日` | `#454545` | `Color/Neutral/800` |
| 日期 | `2022-01-22` | `#2178CF` | `Color/MenuItem/Default` |
| 連接詞 | `於` | `#454545` | `Color/Neutral/800` |
| 強調天數 | `28` | `#E12129` | `Color/Surface/Negative` |
| 後綴 | `天後過期。` | `#454545` | `Color/Neutral/800` |

> 實作時第 4–7 列以動態資料渲染，上方為範例值。

---

## Input Chip 規格（本元件觀測值）

> 完整規格待 `Input` component spec 完成後補充。

| 屬性 | 值 | Token |
|---|---|---|
| 高度 | `28px` | — |
| Padding | top/bottom `6px`、left/right `12px` | `Spacing/6`、`Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Font size | `12px`（sm） | — |
| Text color | `#F6F6F6` | `Color/Neutral/50` |

### Chip 顏色一覽

| 語意 | 文字 | bg 色 | Token |
|---|---|---|---|
| 類型：簡訊 | `簡訊` | `#34C759` | `Color/Accent/Green` |
| 嚴重度：總部 | `總部` | `#E12129` | `Color/Surface/Negative` |
| 嚴重度：分館 | `分館` | `#F28B45` | `Color/Surface/Brand-400-Hover` |
| 類型：網址 | `網址` | `#2178CF` | `Color/MenuItem/Default` |

---

## 右側元素：Rectangle 15

| 屬性 | 值 |
|---|---|
| 尺寸 | `6×161px` |
| 位置 | `x:552, y:68`（容器右側） |
| Fill | `#D9D9D9` |
| Token | ⚠️ tokens.md 未定義（`Neutral/200` = `#D1D1D1`，值不同） |
| 用途 | 推測為垂直捲動指示器，Figma 未明確標示 |

---

## 文字樣式（通知列）

| 樣式 | 大小 | 字重 | 顏色 | 用途 |
|---|---|---|---|---|
| base | `16px` | Regular 400 | `#454545` | 一般說明文字 |
| base | `16px` | Regular 400 | `#E12129` | 強調數字（餘額、天數） |
| base | `16px` | Regular 400 | `#2178CF` | 日期、連結 |
| sm | `12px` | Regular 400 | `#F6F6F6` | chip 內文字 |

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| `#34C759`（簡訊 chip）對應 token | ✅ `Color/Accent/Green`（2026-04-13 確認） |
| `#D9D9D9`（Rectangle 15）對應 token | ⚠️ 與 Neutral/200 數值不同，待確認 |
| 捲動行為（列數超出容器高度時） | Figma 未定義 |
| 空狀態（無通知時） | Figma 未定義 |
| Hover / Click 互動 | Figma 未定義 |
| 行動版（mobile）佈局 | Figma 未定義 |

---

*Generated from Figma display page · Updated 2026-04-13（Landing page - 0116）*
