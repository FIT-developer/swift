# Layout Specification: Desktop

> status: frozen-reference（dashboard 時期產物，2026-05-07 後未更新；新頁面規格一律走 specs/pages/ + components/，本檔不可作為新實作依據）

**Figma Frame**: `Landing page - 0116`  
**Figma Node ID**: `270:12234`  
**斷點範圍**: 769px+  
**示意稿寬度**: 1440px  
**最後同步**: 2026-04-14

---

## 概述

Desktop 版為左側固定 sidebar（menu）+ 右側主內容區的雙欄佈局。  
主內容區分三個水平列，列間距皆為 **24px**。  
右上角有功能 icons 列；頁面無 mobile 的浮動 AI 按鈕。

---

## 頁面容器

| 屬性 | 值 | Token |
|---|---|---|
| 示意稿寬度 | `1440px` | — |
| 頁面總高度 | `1449px` | — |
| Background | `Color/Neutral/0` | `Color/Neutral/0` |
| Padding | 無全局 padding（各元素自行定位） | — |

---

## 頁面結構（絕對定位）

```
[FRAME] Landing page - 0116 (1440×1449px, bg Color/Neutral/0)
├── [INSTANCE] menu              (240×1188px, x:12,   y:12)
├── [INSTANCE] Function icons    (156×24px,   x:1272, y:20)
├── [FRAME]    Order status      (556×313px,  x:272,  y:72)
├── [INSTANCE] System notif.     (572×313px,  x:854,  y:72)
├── [FRAME]    Revenue trends    (1154×200px, x:272,  y:409)
├── [FRAME]    Statistics        (1154×804px, x:272,  y:633)
└── [INSTANCE] floatIcons/ai     — Desktop 版不存在此元素
```

---

## 空間分配

### 水平分割

| 區域 | x 起點 | 寬度 | 說明 |
|---|---|---|---|
| 左邊距 | 0 | 12px | 頁面左 padding |
| Sidebar（menu） | 12 | 240px | 固定左欄 |
| Sidebar 右間距 | 252 | 20px | sidebar 到內容區 gap |
| 主內容區 | 272 | 1154px | 右側主要工作區 |
| 右邊距 | 1426 | 14px | 頁面右側殘留 |

### 垂直排列（主內容區）

| Section | y 起點 | 高度 | 下方間距 |
|---|---|---|---|
| Function icons | 20 | 24px | — |
| Row 1（Order + System notif.） | 72 | 313px | **24px** |
| Row 2（Revenue trends） | 409 | 200px | **24px** |
| Row 3（Statistics） | 633 | 804px | — |

> 所有 section 垂直間距一律 **24px**（`Spacing/24`）。  
> sidebar top 起始 y:12（`Spacing/12`），比內容區（y:72）早 60px，這 60px 留給頂部 Function icons 列。

---

## Section 1：Sidebar（menu）

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `240×1188px` | — |
| 位置 | x:12, y:12 | — |
| Corner radius | `8px` | `Radius/8` |
| Background | `Color/Neutral/0` | `Color/Neutral/0` |
| Border | `Color/Neutral/100` | `Color/Neutral/150` |

> 完整規格見 `components/menu.md`。

---

## Section 2：Function icons（右上）

| 屬性 | 值 |
|---|---|
| 尺寸 | `156×24px` |
| 位置 | x:1272, y:20 |
| 內容 | 4 個 icon（bulletin、message、person-md、system） |

> 完整規格見 `components/function-icons.md`。

---

## Section 3：Row 1 — 水平雙欄

| 元素 | 尺寸 | x | y |
|---|---|---|---|
| Order status | 556×313px | 272 | 72 |
| System notifications | 572×313px | 854 | 72 |

- 兩欄間距：854 - (272+556) = **26px**
- 合計：556 + 26 + 572 = **1154px**（填滿內容區）

---

## Section 4：Row 2 — Revenue trends（全寬）

| 屬性 | 值 |
|---|---|
| 尺寸 | `1154×200px` |
| 位置 | x:272, y:409 |

> 完整規格見 `components/revenue-trends.md`。

---

## Section 5：Row 3 — Statistics（全寬）

| 屬性 | 值 |
|---|---|
| 尺寸 | `1154×804px` |
| 位置 | x:272, y:633 |

### Statistics details 內部圖表格局（2×2 grid）

Statistics details 子框架（1130×741, x:12 y:51 within Statistics）：

| 圖表 | 尺寸 | x（local） | y（local） | 欄位 |
|---|---|---|---|---|
| chartjs - bar | 525×293.5px | 0 | 0 | 左上 |
| chartjs - line | 525×304px | 605 | 0 | 右上 |
| chartjs - diverging | 525×334px | 0 | 324 | 左下 |
| chartjs - doughnut | 367×417px | 763 | 324 | 右下 |

- 左欄：x=0，寬度 525px（左對齊）
- 右欄：525px + 80px gap = x=605，寬度 525px（line），右對齊邊界 x=1130
- 下排右側：doughnut 寬 367px，x=763（右對齊，763+367=1130）
- 上下排間距：y=324 - y=293.5 = **30.5px** gap（bar 下沿到 diverging 上沿）

> 完整規格見 `components/statistics.md`。

---

## Desktop vs Mobile 差異對照表

| 項目 | Desktop | Mobile |
|---|---|---|
| 頁面寬度 | 1440px | 768px |
| 導航 | 左側 `menu` component（240px，常駐） | 頂部 nav bar（logo + Folder icon） |
| Order status 寬 | `556px` | `744px`（fill） |
| System notifications 寬 | `572px` | `744px`（fill） |
| Row 1 排列 | 水平雙欄（Order + System notif.） | 僅 Order status 全寬 |
| Revenue trends Cards | 4 卡平排，全部顯示 | 橫向捲動，第 4 卡部分露出 |
| Statistics 排列 | 2×2 grid | 單欄垂直（bar→diverging→line→doughnut） |
| Statistics 高度 | `804px` | `1320px` |
| 浮動按鈕 | 無 | `floatIcons/ai`（右下角 fixed） |
| Section 垂直間距 | 24px | 24px（相同） |

---

## 實作注意事項

1. **Tailwind 斷點**：`md:` 以上（769px+）套用 desktop 樣式
2. **Sidebar**：`w-[240px] shrink-0`，高度跟隨內容或 `min-h-screen`
3. **主內容寬度**：`flex-1`，最大寬度由外層容器控制不超過 1154px
4. **Row 1 雙欄**：`flex gap-[26px]`
5. **Statistics 2×2**：CSS grid 或 flex wrap，左欄固定 525px，右欄靠右對齊
6. **最大寬度**：`max-w-[1440px] mx-auto`，置中對齊

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| Sidebar 在 769px–1024px 區間的行為（是否收合？） | ✅ 已定案：預設展開，不自動收合，由 Folder 按鈕手動控制（2026-04-16） |
| 頁面 scroll 時 sidebar 是否 sticky | ✅ 已定案：不做 sticky，維持靜態佈局（2026-04-16） |
| Function icons 的點擊行為 | Figma 未定義 |

---

*Generated from Figma display page · Updated 2026-04-14（Landing page - 0116）*
