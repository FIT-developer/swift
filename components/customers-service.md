# Component Specification: `Customers service`

**Figma Node ID**: `51:184`（COMPONENT_SET）
**Type**: COMPONENT_SET
**現行版本**: 2026-07-13 使用者確認（依 0713 系統基本稿）

---

## 概述

`Customers service` 是側邊欄的客服聯絡資訊元件。
2026-07-13 使用者訂正: **聯絡資訊僅保留 Email 一列**; LINE QR code、
電話、傳真、北/西/東客服、營業時間標籤全部移除。

---

## 現行規格

### 標題列

| 屬性 | 值 |
|---|---|
| 標題 icon | `icons/service`（24x24） |
| 標題文字 | `"客服"` 20px SemiBold 600 `Color/Neutral/800` |
| 右側 | 無（營業時間標籤已移除） |

### 聯絡卡片

| 屬性 | 值 | Token |
|---|---|---|
| Corner radius | `8px` | `Radius/8` |
| Padding | `12px` | `Spacing/12` |
| Border | `Color/Neutral/200` | `border-border-disabled` |
| 內容 | 僅 Email 一列 | - |

### Email 列

```
|-- icons/email (24x24)
`-- Texts sm -> "service@bbnet.gmail.com"  12px  Regular  Color/Neutral/800
```

### 實作位置

`preview/partials/aside.html` 客服區段（全站共用 partial, 四頁生效）。
現行不做收合/展開互動（舊 3-variant 的 Default/hover/show 已不適用）。

---

## 歷史

舊規格（3 variants: Default/hover/show, 展開卡含 QR code、電話、傳真、
北/西/東客服列, 216x395px）見 git history（縮減 commit `79b6ab2`
之前的本檔版本）。

---

*Updated 2026-07-14 - 記錄格式依 2026-07-14 使用者裁決: 移除/縮減時
spec 內文重寫成現況, 歷史細節交給 git history*
