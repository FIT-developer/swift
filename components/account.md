# Component Specification: `Account`

**Figma Node ID**: `63:461`（COMPONENT_SET）
**Type**: COMPONENT_SET
**現行版本**: 2026-07-13 使用者確認（快速切換帳號整組移除）

---

## 概述

`Account` 是側邊欄底部的帳號列元件, 顯示目前登入的帳號名稱與登出按鈕。
2026-07-13 使用者訂正: **快速切換帳號功能整組移除** - aside 帳號列的
switch icon、topbar `compactSwitchBtn`、session-modals 的帳號切換 modal、
page-shell.js 對應接線皆已刪除。帳號列僅保留登出。

---

## 現行規格

### 結構

```
Account
|-- Texts sm - 帳號名  12px  Regular  Color/Neutral/800（動態渲染, 示例 "xiaomi999"）
`-- icons/logout (24x24)  <- 登出, data-modal-open="modalLogoutBackdrop"
```

### 登出 tooltip

logout icon hover 時顯示:

| 屬性 | 值 | Token |
|---|---|---|
| 背景 / 箭頭 fill | `Color/Neutral/700` | `Color/Neutral/700` |
| Corner radius | `6px` | `Radius/6` |
| Padding | 上下 `2px`、左右 `12px` | `Spacing/2`、`Spacing/12` |
| 文字 | 「登出」12px `Color/Neutral/100` | - |
| 位置 | icon 上方, 向下箭頭指向 icon | - |

### Mobile

與 Default 結構相同, 帳號文字多 8px left padding。

### 實作位置

- `preview/partials/aside.html` 帳號列（logout icon + tooltip）
- `preview/partials/topbar.html` `sidebarCompact`（收合態 `compactLogoutBtn`）
- 登出 modal: `preview/partials/session-modals.html` `modalLogoutBackdrop`

---

## 歷史

舊規格（4 variants, 含 `state=transfer account` 與 icons/switch 切換帳號）
見 git history（移除 commit `79b6ab2` 之前的本檔版本）。

---

*Updated 2026-07-14 - 記錄格式依 2026-07-14 使用者裁決: 移除/縮減時
spec 內文重寫成現況, 歷史細節交給 git history*
