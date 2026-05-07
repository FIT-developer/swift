# Layout Specification: Mobile

**Figma Frame**: `Landing page (mobile) - 0116`  
**斷點範圍**: 375px – 768px  
**示意稿寬度**: 768px（代表 mobile 到 tablet 所有尺寸）  
**最小寬度**: 375px（無更小尺寸）  
**最後同步**: 2026-04-13

---

## 概述

Mobile 版與 Desktop 版**內容完全相同**，差異僅在佈局：
- 單欄垂直排列（無側邊 menu）
- 頂部 nav bar 簡化（logo + 漢堡選單 icon）
- 各 section 全寬展開（填滿 container）
- Revenue trends Cards 改為橫向捲動
- Statistics 圖表改為單欄垂直堆疊
- 新增右下角 `floatIcons/ai` 浮動按鈕

---

## 頁面容器

| 屬性 | 值 | Token |
|---|---|---|
| 示意稿寬度 | `768px` | — |
| 頁面總高度 | `2278px`（含所有 sections） | — |
| Background | `Color/Neutral/0` | `Color/Neutral/0` |
| Padding | `12px` all sides | `Spacing/12` |
| 內容寬度 | `744px`（768 - 24） | — |

---

## 頁面結構（由上至下）

```
[FRAME] Landing page (mobile) - 0116 (768×2278px)
├── [FRAME] Frame 25 (744×349, x:12, y:12)
│   ├── [FRAME] Frame 4 — Nav bar (744×24, y:0)
│   │   ├── icons/logo (24×24, x:0)
│   │   └── [INSTANCE] Folder (24×24, x:720) ← 漢堡/選單 icon
│   └── [FRAME] Order status (744×313, y:36)
├── [INSTANCE] System notifications (744×313, x:12, y:385)
├── [FRAME] Revenue trends (744×200, x:12, y:722)
├── [FRAME] Statistics (744×1320, x:12, y:946)
└── [INSTANCE] floatIcons/ai (40×70, x:663, y:1786) ← 浮動按鈕
```

---

## Section 間距

| Section | y 位置 | 上方 section 結束 | 間距 |
|---|---|---|---|
| Frame 25（nav + order） | y:12 | — | — |
| System notifications | y:385 | 12+349=361 | **24px** |
| Revenue trends | y:722 | 385+313=698 | **24px** |
| Statistics | y:946 | 722+200=922 | **24px** |

> 所有 section 間距一律 **24px**（`Spacing/24`）。

---

## Section 1：Nav bar（Frame 4）

| 屬性 | 值 |
|---|---|
| 尺寸 | `744×24px` |
| 左側 | `icons/logo`（24×24，x:0） |
| 右側 | `Folder` component instance（24×24，x:720） |
| 背景 | 無（透明） |

> **Desktop 差異**：Desktop 有完整側邊 `menu` component；Mobile 改為頂部 nav bar，左 logo 右 Folder icon。  
> `Folder` component 待讀取 spec，推測為漢堡選單或資料夾切換功能。

---

## Section 2：Order status

| 屬性 | Mobile | Desktop |
|---|---|---|
| 容器寬度 | `744px` | `556px` |
| 容器高度 | `313px` | `313px`（相同） |
| Padding | `12px` | `12px`（相同） |
| Corner radius | `6px` | `6px`（相同） |
| Border | `Color/Neutral/200` | `Color/Neutral/200`（相同） |
| Order row 寬度 | `720px`（fill） | `532px`（fill） |
| Order row 高度 | `34px` | `34px`（相同） |
| Row 間距 | `20px` | `20px`（相同） |
| 5 列內容 | 同 Desktop | — |

---

## Section 3：System notifications

| 屬性 | Mobile | Desktop |
|---|---|---|
| 容器寬度 | `744px` | `572px` |
| 容器高度 | `313px` | `313px`（相同） |
| 內容 | 同 Desktop | — |

---

## Section 4：Revenue trends

| 屬性 | Mobile | Desktop |
|---|---|---|
| 容器寬度 | `744px` | `1154px` |
| 容器高度 | `200px` | `200px`（相同） |
| Trend details 寬度 | `720px` | `1130px` |
| Card 排列 | 橫向，**可橫向捲動** | 橫向，4 卡完全顯示 |

### Mobile Card 排列（橫向捲動）

| Card | 寬度 | x 位置 | 說明 |
|---|---|---|---|
| Card 1（今日營收） | `220px` | x:0 | 完整顯示 |
| Card 2（平均房價） | `220px` | x:236 | 完整顯示，gap 16px |
| Card 3（今日住房率） | `220px` | x:472 | 完整顯示，gap 16px |
| Card 4（今日超賣） | `190px` | x:708 | **部分顯示**，右緣截斷 → 提示可橫向捲動 |

> Card 4 末端 x:708+190=898 > 容器寬度 720px，**超出約 178px**。  
> 這是刻意設計：Card 4 只露出左緣（約 12px），暗示使用者可左右滑動。  
> 實作：`overflow-x: auto`，Cards 不換行。

---

## Section 5：Statistics

| 屬性 | Mobile | Desktop |
|---|---|---|
| 容器寬度 | `744px` | `1154px` |
| 容器高度 | `1320px` | `804px` |
| 圖表排列 | **單欄垂直堆疊** | 2×2 grid |

### Mobile 圖表排列（單欄，垂直，置中）

| 圖表 | 尺寸 | x（置中） | y | 上方間距 |
|---|---|---|---|---|
| chartjs - bar | 342×265px | x:189 | y:0 | — |
| chartjs - diverging | 342×334px | x:189 | y:285 | **20px** |
| chartjs - line | 342×181px | x:189 | y:639 | **20px** |
| chartjs - doughnut | 367×417px | x:176.5 | y:840 | **20px** |

> 所有圖表水平置中於 720px 內容寬度：  
> - 342px 圖表：(720-342)/2 = **189px** ✓  
> - 367px 圖表：(720-367)/2 = **176.5px** ✓

> **Desktop 差異**：Desktop 為 2×2 grid（bar+line 上排，diverging+doughnut 下排）；  
> Mobile 改為 bar → diverging → line → doughnut 單欄垂直排列，圖表間距 **20px**（`Spacing/20`）。

---

## 浮動按鈕：floatIcons/ai

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `40×70px` | — |
| 位置 | x:663, y:1786（右下浮動） | — |
| 相對右側距離 | 768 - (663+40) = **65px** | — |

### 結構

```
[INSTANCE] floatIcons/ai (40×70px)
├── [TEXT] "客服"  base 16px Regular  Color/Neutral/800  ← 上方標籤
└── [FRAME] Frame 78 (48×48, cornerRadius 56, fills Color/Neutral/75, padding 6px)
    └── [INSTANCE] icons/ai (24×24, cornerRadius 56, fills Color/Neutral/0)
```

### 樣式

| 元素 | 屬性 | 值 | Token |
|---|---|---|---|
| 標籤文字 | font | base 16px Regular | — |
| 標籤文字 | color | `Color/Neutral/800` | `Color/Neutral/800` |
| 圓形容器 | size | 48×48px | — |
| 圓形容器 | cornerRadius | `56px` | `Radius/56` |
| 圓形容器 | background | `Color/Neutral/75` | `Color/Neutral/75` |
| 圓形容器 | padding | `6px` | `Spacing/6` |
| Icon 容器 | size | 24×24px | — |
| Icon 容器 | cornerRadius | `56px` | `Radius/56` |
| Icon 容器 | background | `Color/Neutral/0` | `Color/Neutral/0` |
| Icon | `icons/ai` | 24×24 | — |

> `floatIcons/ai` 僅出現於 Mobile 版，Desktop 版無此元素。  
> 定位：fixed 右下角，實作用 `position: fixed; bottom: ...; right: ...`。

---

## Desktop vs Mobile 差異對照表

| 項目 | Desktop | Mobile |
|---|---|---|
| 頁面寬度 | 1154px content | 744px content |
| 導航 | 側邊 `menu` component | 頂部 nav bar（logo + Folder icon） |
| Order status 寬 | 556px | 744px（fill） |
| System notifications 寬 | 572px | 744px（fill） |
| Revenue trends 寬 | 1154px | 744px |
| Revenue trends Cards | 4 卡平排（全顯示） | 4 卡橫向捲動（第 4 卡部分顯示） |
| Statistics 排列 | 2×2 grid | 單欄垂直（bar→diverging→line→doughnut） |
| Statistics 高度 | 804px | 1320px |
| 浮動按鈕 | 無 | `floatIcons/ai`（右下角 fixed） |
| Section 間距 | 24px（推測） | 24px（確認） |

---

## 實作注意事項

1. **Tailwind 斷點**：`< 769px` 套用 mobile 樣式（預設），`md:` 以上套用 desktop
2. **Revenue trends 橫向捲動**：`overflow-x-auto flex flex-nowrap`，不換行
3. **Statistics 單欄置中**：`flex flex-col items-center gap-5`（gap-5 = 20px）
4. **floatIcons/ai**：`fixed bottom-[Npx] right-[65px]`，具體 bottom 值依實際 viewport 調整
5. **最小寬度保障**：`min-w-[375px]`，全局設定

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| `Folder` component 功能與 spec | ⬜ 待讀取 Folder component |
| floatIcons/ai 的點擊行為 | Figma 未定義互動 |
| Revenue trends 捲動指示器（點點或箭頭） | Figma 未定義 |
| Nav bar 的 Folder icon 展開後的 menu 樣式 | 見 `components/folder.md`（待補讀） |
| 375px 最小寬度下各元件的縮放行為 | ✅ 已定案：若有過度擠壓問題先 flag 給使用者確認，不自行決定（2026-04-16） |

---

## Nav Bar Sticky 規格（2026-04-16 定案）

Mobile nav bar（高度 48px）需 `position: sticky; top: 0`，讓使用者在任何捲動位置都可觸發側欄。

**實作影響**：
- nav bar 加 `sticky top-0 z-10`
- nav bar 下方第一個元素加 `pt-12`（48px）補回被佔掉的空間，否則頂部內容會被遮住

---

*Generated from Figma display page · Updated 2026-04-13（Landing page - mobile - 0116）· Sticky nav 定案 2026-04-16*
