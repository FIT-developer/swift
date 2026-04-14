# Section Specification: floatIcons/ai（Mobile 浮動按鈕）

**Figma Node ID**: （INSTANCE，floatIcons/ai）  
**Type**: INSTANCE  
**父層**: Landing page (mobile) - 0116（768×2278px）  
**最後同步**: 2026-04-13

---

## 概述

Mobile 版右下角浮動客服按鈕，**僅出現於 Mobile**，Desktop 版無此元素。  
由「客服」標籤文字與圓形 icon 按鈕上下堆疊組成，fixed 定位於視窗右下角。

---

## 佈局位置（Figma 示意稿）

| 屬性 | 值 | 說明 |
|---|---|---|
| 位置 | x:663, y:1786 | 相對於 768px 示意稿 |
| 距右側 | 768 - (663 + 40) = **65px** | — |
| 距底部 | 2278 - (1786 + 70) = **422px** | 示意稿底部，實際以 fixed 處理 |
| 寬度 | `40px` | — |
| 高度 | `70px` | — |

> 實作使用 `position: fixed`，具體 `bottom` 值依 viewport 設計稿調整。  
> Figma 未定義確切的 fixed bottom 值，建議預設 `bottom-16`（64px）右側 `right-[65px]`。

---

## 結構

```
[INSTANCE] floatIcons/ai (40×70px)
├── [TEXT] "客服"     base 16px  Regular  #454545  ← 上方標籤
└── [FRAME] Frame 78 (48×48px, cornerRadius 56, fills #F6FAFD, padding 6px)
    └── [INSTANCE] icons/ai (24×24, cornerRadius 56, fills #FFFFFF)
```

> 注意：外層 instance 尺寸為 40×70px，但 Frame 78（圓形按鈕）為 48×48px，可能有 overflow 或對齊方式差異。

---

## 樣式規格

| 元素 | 屬性 | 值 | Token |
|---|---|---|---|
| 標籤文字 | font size | `16px`（base） | — |
| 標籤文字 | font weight | Regular（400） | — |
| 標籤文字 | color | `#454545` | `Color/Neutral/800` |
| 標籤文字 | 對齊 | 水平置中 | — |
| 圓形容器 | 尺寸 | 48×48px | — |
| 圓形容器 | cornerRadius | `56px`（完整圓） | `Radius/56` |
| 圓形容器 | background | `#F6FAFD` | `Color/Neutral/75` |
| 圓形容器 | padding | `6px` all sides | `Spacing/6` |
| Icon 容器 | 尺寸 | 24×24px | — |
| Icon 容器 | cornerRadius | `56px` | `Radius/56` |
| Icon 容器 | background | `#FFFFFF` | `Color/Neutral/0` |
| Icon | `icons/ai` | 24×24px | — |

---

## 實作注意事項

1. **定位**：`position: fixed; bottom: 64px; right: 65px;`（`right` 值固定 65px，`bottom` 依需求調整）
2. **層級**：`z-index: 50`（高於一般內容）
3. **排列**：`flex flex-col items-center gap-2`（文字在上，圓形按鈕在下）
4. **圓形按鈕**：`w-12 h-12 rounded-full bg-[#F6FAFD] p-1.5 flex items-center justify-center`
5. **Icon 白底圓**：`w-6 h-6 rounded-full bg-white flex items-center justify-center`
6. **僅 Mobile**：包在 `md:hidden` 內，Desktop 不顯示

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| 點擊後的互動（開啟客服視窗？） | Figma 未定義 |
| Hover 狀態 | Figma 未定義 |
| 實際 fixed bottom 值 | 需實作時確認 |

---

*Generated from Figma mobile layout · Updated 2026-04-13*
