# Component Specification: `Customers service`

**Figma Node ID**: `51:184`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13
**現行訂正**（2026-07-13 使用者確認，依 0713 系統基本稿）: 聯絡資訊僅保留
Email 一列；LINE QR code、電話、傳真、北/西/東客服、營業時間標籤全部移除。
本檔以下的完整聯絡資訊卡規格為歷史內容，實作以本訂正為準。

---

## 概述

`Customers service` 是側邊欄的客服聯絡資訊元件，共 **3 個 variants**（屬性 `state`）。  
預設顯示標題列，hover 時反白，點擊後展開完整聯絡資訊卡片（含 QR code、電話、分館人員、email）。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=Default` | `51:183` | 216×39px | 收合，顯示標題 + 服務時段 |
| `state=hover` | `51:282` | 216×39px | Hover，標題背景反白 + cursor |
| `state=show` | `51:185` | 216×395px | 展開，完整聯絡卡片 |

---

## 共用標題列（Frame 7）

所有 variant 頂部共用的標題結構：

```
Frame 7 (216×27px, y:12)
├── Title instance (112×27px, x:0)
│   ├── icons/service (24×24, y:1.5)
│   └── Texts md Bold → "客服"  20px  SemiBold 600  Color/Neutral/800
└── Texts sm → "平日 09:00~18:00"  12px  Regular  Color/Neutral/800  (x:120)
```

| 屬性 | 值 | Token |
|---|---|---|
| 標題文字 | `"客服"` | — |
| 標題字號 | `20px` SemiBold 600 | — |
| 標題 icon | `icons/service`（24×24） | — |
| 服務時段 | `"平日 09:00~18:00"` | — |
| 服務時段字號 | `12px` Regular | — |
| 文字色 | `Color/Neutral/800` | `Color/Neutral/800` |

---

## state=Default

標準收合狀態，無背景、無額外樣式。

| 屬性 | 值 |
|---|---|
| 背景 | 無（透明） |
| Padding | top `12px`，其餘 0 |

---

## state=hover

Hover 狀態，標題區塊背景變灰，出現游標指示。

| 變化 | 值 | Token |
|---|---|---|
| Title 的 Texts 背景 | `Color/Neutral/100` | `Color/Neutral/100` |
| 服務時段 Texts 背景 | `Color/Neutral/100` | `Color/Neutral/100` |
| 游標 Vector | 出現於 x:164, y:37（icons/cursor 風格） | — |

---

## state=show（展開）

展開後顯示完整聯絡資訊卡片（Frame 6）。

```
state=show (216×395px)
├── Frame 7 (標題列，同 Default)
└── Frame 6 — 聯絡卡片 (216×344px, y:51)
    ├── cornerRadius 8, padding 12px, stroke Color/Neutral/200
    ├── service_line (120×120px, x:48, y:12)  ← QR code 區（cornerRadius 8）
    ├── Frame 1 — 電話 (192×22px, y:143)
    ├── Frame 2 — 傳真 (192×22px, y:176)
    ├── Frame 3 — 北客服 (192×22px, y:209)
    ├── Frame 4 — 西客服 (192×22px, y:242)
    ├── Frame 5 — 東客服 (192×22px, y:275)
    └── Frame 58 — Email (174×24px, y:308)
```

### 聯絡卡片樣式

| 屬性 | 值 | Token |
|---|---|---|
| 卡片尺寸 | 216×344px | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `8px` | `Radius/8` |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |
| Background | `Color/Neutral/0` | `Color/Neutral/0` |

### QR Code 區

| 屬性 | 值 |
|---|---|
| 節點名稱 | `service_line` |
| 尺寸 | 120×120px |
| 位置 | x:48（水平置中），y:12 |
| Corner radius | `8px` |

### 聯絡資訊列

所有列寬 192px，高 22px，文字使用 `Texts / base (16px Regular, Color/Neutral/800)`：

| 列 | 左欄（Label） | 右欄（Value） | Label x | Value x |
|---|---|---|---|---|
| 電話 | `"電話"` | `"02-2826-3881"` | x:0 | x:86 |
| 傳真 | `"傳真"` | `"02-2821-8289"` | x:0 | x:86 |
| 北客服 | `"北客服"` | `"#13"` + `"紅樹林"` | x:0 | x:80 (code) + x:144 (name) |
| 西客服 | `"西客服"` | `"#12"` + `"Jimmy"` | x:0 | x:80 + x:145 |
| 東客服 | `"東客服"` | `"#22"` + `"Luka"` | x:0 | x:80 + x:156 |

### Email 列

```
Frame 58 (174×24px, y:308)
├── icons/email (24×24, x:0)
└── Texts sm → "service@bbnet.gmail.com"  12px  Regular  Color/Neutral/800  (x:28)
```

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| 文字（所有） | `Color/Neutral/800` | `Color/Neutral/800` |
| Hover 背景 | `Color/Neutral/100` | `Color/Neutral/100` |
| 卡片邊框 | `Color/Neutral/200` | `Color/Neutral/200` |

---

## 實作注意事項

1. **收合/展開**：點擊標題列 toggle `state=Default` ↔ `state=show`
2. **QR code**：`service_line` 為佔位矩形，實際需嵌入真實 QR code 圖片
3. **客服代號格式**：`#{代號}` + 空格 + 姓名/地點
4. **Email 連結**：`<a href="mailto:service@bbnet.gmail.com">`
5. **hover 效果**：`hover:bg-border-default cursor-pointer`

---

*Generated from Figma component set · Updated 2026-04-13*
