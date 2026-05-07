# Section Specification: Desktop — Statistics（統計圖表）

**Figma Node ID**: `270:11721`（FRAME）  
**父層**: Landing page - 0116  
**最後同步**: 2026-04-14

---

## 概述

Desktop Row 3，全寬。顯示 4 個統計圖表，以 **2×2 grid** 排列：  
左上 bar chart、右上 line chart、左下 diverging chart、右下 doughnut chart。

---

## 容器

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `1154×804px` | — |
| 位置 | x:272, y:633（頁面絕對） | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Background | 無（透明） | — |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |

---

## 結構

```
[FRAME] Statistics (1154×804px)
├── [INSTANCE] Title (112×27px, x:12, y:12)
│   ├── [INSTANCE] icons/operation-system (24×24)
│   └── [INSTANCE] Texts → [TEXT] "統計圖表"  20px  SemiBold 600  Color/Neutral/800
└── [FRAME] Statistics details (1130×741px, x:12, y:51)
    ├── [INSTANCE] chartjs - bar        (525×293.5px, x:0,   y:0)   ← 左上
    ├── [INSTANCE] chartjs - line       (525×304px,   x:605, y:0)   ← 右上
    ├── [INSTANCE] chartjs - diverging  (525×334px,   x:0,   y:324) ← 左下
    └── [INSTANCE] chartjs - doughnut   (367×417px,   x:763, y:324) ← 右下
```

---

## Statistics details 格局（2×2 grid）

### 水平分割

| 欄位 | x 起點 | 寬度 | 說明 |
|---|---|---|---|
| 左欄 | 0 | 525px | bar / diverging，左對齊 |
| 欄間距 | 525 | 80px | — |
| 右欄 | 605 | 525px（line）/ 367px（doughnut） | 右對齊（右邊界 x=1130） |

> 右欄 line chart 寬 525px（x=605~1130），doughnut 寬 367px（x=763~1130）。  
> 兩者皆右對齊於 x=1130，但 doughnut 比 line 窄 158px，造成右下角有留白。

### 垂直分割

| 列 | y 起點 | 高度 | 說明 |
|---|---|---|---|
| 上排 | 0 | 293.5px（bar）/ 304px（line） | 上排高度取最高值 line（304px） |
| 列間距 | — | ~30px | y=324 - y≈293.5 = 30.5px |
| 下排 | 324 | 334px（diverging）/ 417px（doughnut） | 下排高度取最高值 doughnut（417px） |

---

## 各圖表實際位置（Statistics details 內部相對座標）

| 圖表 Component | x | y | 寬 | 高 | 對齊 |
|---|---|---|---|---|---|
| chartjs - bar | 0 | 0 | 525 | 293.5 | 左上 |
| chartjs - line | 605 | 0 | 525 | 304 | 右上（右對齊） |
| chartjs - diverging | 0 | 324 | 525 | 334 | 左下 |
| chartjs - doughnut | 763 | 324 | 367 | 417 | 右下（右對齊） |

---

## Desktop vs Mobile 差異

| 項目 | Desktop | Mobile |
|---|---|---|
| 容器高度 | `804px` | `1320px` |
| 圖表排列 | 2×2 grid | 單欄垂直堆疊 |
| 欄間距 | 80px | — |
| 圖表順序 | bar、line（上）/ diverging、doughnut（下） | bar → diverging → line → doughnut |
| 圖表尺寸 | 見上表 | sm variant（342px 或 367px 寬） |
| 圖表間距 | 上下 ~30px，左右 80px | 20px（垂直） |

---

## 實作注意事項

1. **2×2 grid**：CSS grid `grid-cols-2` 或 `flex flex-wrap`
2. **右欄右對齊**：右欄圖表靠右，doughnut 不需填滿右欄寬度
3. **各圖表使用 default variant**（525px 寬）；Mobile 用 sm variant（342px）
4. **圖表各自的完整規格**：
   - `components/chartjs-bar.md`
   - `components/chartjs-line.md`
   - `components/chartjs-diverging.md`（待補）
   - `components/chartjs-doughnut.md`（待補）

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| 右下角 doughnut 左側留白的設計意圖 | Figma 未說明（推測為未來擴充空間） |

---

*Generated from Figma display page · Updated 2026-04-14*
