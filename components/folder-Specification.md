# Component Specification: `Folder`

**Figma Node ID**: `270:12785`（INSTANCE，component set 尚未直接讀取）  
**Type**: INSTANCE  
**最後同步**: 2026-04-13（從 mobile layout Frame 25 觀測）

---

## 概述

`Folder` 是 Mobile 版頂部 Nav bar 右側的面板切換按鈕，以兩個矩形構成「分割畫面」的視覺語意（左窄面板 + 右寬面板），用於觸發側邊選單或面板展開。

---

## 尺寸與樣式

| 屬性 | 值 | Token |
|---|---|---|
| 外框尺寸 | `24×24px` | — |
| 背景 | 無（透明） | — |

### 內部結構

```
[INSTANCE] Folder (24×24px)
├── Rectangle 2 — 左側窄條 (9×24px, x:0)
│   └── cornerRadius 2, fills #ffffff, strokes #000000
└── Rectangle 1 — 右側寬體 (20.57×24px, x:3.43)
    └── cornerRadius 2, fills #ffffff, strokes #000000
```

| 元素 | 尺寸 | 位置 | 說明 |
|---|---|---|---|
| Rectangle 2（左條） | 9×24px | x:0, y:0 | 代表折疊的側邊欄 |
| Rectangle 1（右體） | 20.57×24px | x:3.43, y:0 | 代表主內容區 |

> 兩個矩形重疊構成「側欄 + 內容區」分割圖示，視覺語意為「面板切換」，非傳統漢堡三線。

---

## 使用情境

| 情境 | 位置 | 說明 |
|---|---|---|
| Mobile nav bar | 右側 x:720 | 點擊展開/收合側邊 menu |

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| 完整 component set variants | ⬜ 待直接讀取 Folder component set |
| 點擊後的互動行為（展開 menu 樣式） | Figma 未定義 |
| Active / 展開狀態的外觀 | Figma 未定義 |
| Desktop 版是否使用 | 未觀測到（Desktop 用側邊 menu component） |

---

*Generated from Figma mobile layout · Updated 2026-04-13*
