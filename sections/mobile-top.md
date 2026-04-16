# Section Specification: Mobile Top（Frame 25）

**Figma Node ID**: `270:12783`（推測，Frame 25）  
**Type**: FRAME  
**父層**: Landing page (mobile) - 0116（768×2278px）  
**最後同步**: 2026-04-13

---

## 概述

Mobile 頂部區塊，由 **Nav bar**（Frame 4）與 **Order status** 兩個子區塊組成。  
對應 Desktop 版的側邊 `menu` + `Order status` 組合，但在 Mobile 收合為頂部導覽列與全寬訂單列表。

---

## 容器尺寸

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `744px` | — |
| 高度 | `349px` | — |
| 位置 | x:12, y:12（頁面 padding 內） | — |
| Background | 無（透明） | — |

---

## 結構

```
[FRAME] Frame 25 (744×349px)
├── [FRAME] Frame 4 — Nav bar (744×24px, y:0)
│   ├── [INSTANCE] icons/logo (24×24, x:0)
│   └── [INSTANCE] Folder (24×24, x:720)
└── [FRAME] Order status (744×313px, y:36)
    ├── [INSTANCE] Title
    │   ├── [INSTANCE] icons/operation-system (24×24)
    │   └── [INSTANCE] Texts → [TEXT] "訂單快覽"  20px  SemiBold 600  #454545
    └── [FRAME] Order details（5 個 Order rows，y:36 起）
        ├── Order row 1 — 訂單預訂
        ├── Order row 2 — 待入住
        ├── Order row 3 — 已入住
        ├── Order row 4 — 訂單異常
        └── Order row 5 — 今日退房
```

> Nav bar 與 Order status 間距：y:36 - y:0 - 24px（nav bar 高度） = **12px gap**

---

## 子區塊一：Nav bar（Frame 4）

| 屬性 | 值 | 說明 |
|---|---|---|
| 尺寸 | `744×24px` | y:0 |
| 背景 | 無（透明） | — |
| 左側 | `icons/logo`（24×24，x:0） | 品牌 logo |
| 右側 | `Folder` instance（24×24，x:720） | 選單切換 icon |
| 左右間距 | 744 - 24 - 24 = **696px** | — |

### icons/logo

| 屬性 | 值 |
|---|---|
| 尺寸 | 24×24px |
| 位置 | x:0, y:0 |

### Folder component（選單 icon）

| 屬性 | 值 | 說明 |
|---|---|---|
| 尺寸 | 24×24px | — |
| 位置 | x:720, y:0 | 右邊對齊（744 - 24 = 720） |
| 結構 | Rectangle 2（左條 9×24px）+ Rectangle 1（右體 20.57×24px） | 見 `components/folder.md` |
| 視覺語意 | 面板切換（側欄 + 內容區） | 點擊展開側邊 menu |

> 完整規格見 `components/folder.md`。

---

## 子區塊二：Order status

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `744×313px` | — |
| 位置 | y:36（距 nav bar 底部 12px） | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Border | `#D1D1D1` | `Color/Neutral/200` |
| Background | `#FFFFFF` | `Color/Neutral/0` |

### Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/operation-system`（24×24） | — |
| 文字 | `"訂單快覽"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `#454545` | `Color/Neutral/800` |

### Order rows

每列為一個 `Order` component instance，垂直堆疊，列間距 **20px**（`Spacing/20`）。

| 屬性 | Mobile | Desktop |
|---|---|---|
| 列寬 | `720px`（fill，744 - 24 padding） | `532px`（fill） |
| 列高 | `34px` | `34px` |
| 列數 | 5 | 5 |
| 列間距 | `20px` | `20px` |

| # | 訂單類型 | 說明 |
|---|---|---|
| 1 | 訂單預訂 | 今日新訂單 |
| 2 | 待入住 | 尚未 check-in |
| 3 | 已入住 | 已 check-in |
| 4 | 訂單異常 | 需處理的異常訂單 |
| 5 | 今日退房 | 今日 check-out |

> 完整 Order 列規格見 `components/order.md`。

---

## Desktop vs Mobile 差異

| 項目 | Desktop | Mobile |
|---|---|---|
| 導覽位置 | 左側 `menu` component（常駐展開） | 頂部 Nav bar（Logo + Folder icon） |
| Order status 寬 | `556px` | `744px`（fill） |
| Order row 寬 | `532px`（fill） | `720px`（fill） |
| Nav bar | 無（由側邊 menu 取代） | `744×24px`，y:0 |

---

## 實作注意事項

1. **Nav bar 高度固定 24px**：高度等於 icon 尺寸，無額外 padding
2. **Folder icon 靠右**：`justify-between` 或絕對定位 `right:0`
3. **Nav bar 與 Order status 間距**：`mt-3`（12px）
4. **Order status 全寬**：`w-full`（填滿 744px 容器）
5. **Tailwind 斷點**：此 section 僅在 `< 769px`（mobile）出現；Desktop 用側邊 menu，不同結構

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| Folder icon 點擊後的展開 menu 樣式 | Figma 未定義 |
| Nav bar 的 sticky / fixed 行為 | ✅ 已定案：`sticky top-0 z-10`，下方內容補 `pt-12`（2026-04-16） |
| Logo 的連結目標 | Figma 未定義 |

---

*Generated from Figma mobile layout Frame 25 · Updated 2026-04-13*
