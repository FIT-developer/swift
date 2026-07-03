# Section Specification: Statistics（Mobile）

> status: frozen-reference（dashboard 時期產物，2026-05-07 後未更新；新頁面規格一律走 specs/pages/ + components/，本檔不可作為新實作依據）

**Figma Node ID**: `270:11721`（推測，Statistics FRAME）  
**Type**: FRAME  
**父層**: Landing page (mobile) - 0116（768×2278px）  
**最後同步**: 2026-04-13

---

## 概述

Mobile 版統計圖表區塊。Desktop 的 2×2 grid 改為**單欄垂直堆疊**，圖表順序：bar → diverging → line → doughnut。  
所有圖表水平置中。容器高度從 804px 增至 1320px。

---

## 佈局位置

| 屬性 | 值 | 說明 |
|---|---|---|
| 位置 | x:12, y:946 | 頁面 padding 內 |
| 與上方間距 | 24px（Revenue trends 底部 y:922 → 此區塊 y:946） | `Spacing/24` |

---

## 容器尺寸（Mobile vs Desktop）

| 屬性 | Mobile | Desktop |
|---|---|---|
| 寬度 | `744px` | `1154px` |
| 高度 | `1320px` | `804px` |
| Padding | `12px` all sides | `12px`（相同） |
| Corner radius | `6px` | `6px`（相同） |
| Border | `Color/Neutral/200` | `Color/Neutral/200`（相同） |

---

## 結構

```
[FRAME] Statistics (744×1320px)
├── [INSTANCE] Title
│   ├── [INSTANCE] icons/operation-system (24×24)
│   └── [INSTANCE] Texts → [TEXT] "統計圖表"  20px  SemiBold 600  Color/Neutral/800
└── [FRAME] Statistics details (720×1267, y:51)  ← 單欄垂直排列
    ├── chartjs - bar       (342×265px, x:189, y:0)    ← 第 1 欄
    ├── chartjs - diverging (342×334px, x:189, y:285)  ← 第 2 欄
    ├── chartjs - line      (342×181px, x:189, y:639)  ← 第 3 欄
    └── chartjs - doughnut  (367×417px, x:176.5, y:840) ← 第 4 欄
```

---

## Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/operation-system`（24×24） | — |
| 文字 | `"統計圖表"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `Color/Neutral/800` | `Color/Neutral/800` |

---

## Statistics details（單欄垂直排列）

| 屬性 | 值 |
|---|---|
| 尺寸 | `720×1267px` |
| 排列 | 單欄垂直，`flex flex-col items-center` |
| 圖表間距 | `20px`（`gap-5` / `Spacing/20`） |

### 圖表排列

| 順序 | 圖表 | 尺寸 | x（置中計算） | y | 上方間距 |
|---|---|---|---|---|---|
| 1 | chartjs - bar | 342×265px | x:189 | y:0 | — |
| 2 | chartjs - diverging | 342×334px | x:189 | y:285 | 20px |
| 3 | chartjs - line | 342×181px | x:189 | y:639 | 20px |
| 4 | chartjs - doughnut | 367×417px | x:176.5 | y:840 | 20px |

> 水平置中計算（內容區 720px）：
> - 342px 圖表：(720 - 342) / 2 = **189px** ✓
> - 367px 圖表：(720 - 367) / 2 = **176.5px** ✓

---

## 各圖表規格（Mobile 尺寸）

> 顏色、資料、軸標籤等完整規格見 `components/statistics.md`。  
> 以下僅記錄 Mobile 尺寸（與 Desktop 不同）。

| 圖表 | Desktop 尺寸 | Mobile 尺寸 | 說明 |
|---|---|---|---|
| chartjs - bar | 525×293.5px | **342×265px** | 縮小 |
| chartjs - diverging | 525×334px | **342×334px** | 寬縮，高相同 |
| chartjs - line | 525×304px | **342×181px** | 縮小 |
| chartjs - doughnut | 367×417px | **367×417px** | 尺寸相同 |

---

## Desktop vs Mobile 差異

| 項目 | Desktop | Mobile |
|---|---|---|
| 容器尺寸 | 1154×804px | 744×1320px |
| 排列方式 | 2×2 grid（bar+line 上排，diverging+doughnut 下排） | 單欄垂直（bar→diverging→line→doughnut） |
| 圖表順序 | bar（左上）、line（右上）、diverging（左下）、doughnut（右下） | bar → diverging → line → doughnut |
| 圖表對齊 | 絕對位置（2 欄） | 水平置中（單欄） |
| 圖表間距 | ~20–30px（垂直） | **20px** |

> ⚠️ Mobile 排列順序（bar→diverging→line→doughnut）與 Desktop 不同（bar→line→diverging→doughnut）。

---

## 實作注意事項

1. **單欄置中**：`flex flex-col items-center gap-5`（gap-5 = 20px）
2. **圖表寬度固定**：不隨父容器 fill，使用固定 px 值
3. **Statistics details y:51**：Title 高度約 20px + Title 到 details 間距約 31px
4. **最小寬度保障**：`min-w-[375px]` 全局設定，圖表需在 375px 下確認不溢出
5. **Tailwind 斷點**：`< 769px` 用此 mobile 排列，`md:` 以上改 Desktop 2×2 grid

---

*Generated from Figma mobile layout · Updated 2026-04-13*
