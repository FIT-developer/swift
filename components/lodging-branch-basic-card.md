# Component Specification: 分館基本資訊卡

**Figma Node ID**（分館 1 範例，desktop `2119:78284` 底下）：`2119:78148`（"Frame 427318994"，含以下各部分）
**讀取日期**：2026-07-29（跨多個 session 分批讀取，見下方各部分來源）
**使用位置**：`specs/pages/lodging-info.md`（尚未寫檔）headquarters/分館卡片區的第 1 張卡（跟「須知與聲明卡」`components/lodging-branch-notice-card.md`、「網域安全卡」`components/lodging-branch-domain-security-card.md` 並列）。

---

## 概述

這張卡是分館列表裡結構最複雜的一張，內容分 3 個部分，各自的完整規格已分散寫在不同檔案，本檔統整並補上最後一塊（企業官網/訂房網/自助報到 三個連結 chip）：

| 部分 | 規格位置 |
|---|---|
| 左側圓形照片觸發器（有圖/無圖兩態，點擊開啟照片管理 modal） | `components/modal.md` `state=photo-gallery` 段落「Open trigger」小節 |
| 總部/分館名稱、間數、排序、「修改/設定」pill 按鈕 + 開啟的編輯 modal | `components/lodging-branch-info-modal.md`（`state=branch-basic-info`） |
| 企業官網 / 訂房網 / 自助報到 三個連結 chip | 本檔，見下方 |

---

## 企業官網 / 訂房網 / 自助報到（連結 chip 列）

```
Frame 427318995（chip 列，gap 16px）
- Input chip："企業官網" + icons/attached-link
- Input chip："訂房網" + icons/attached-link
- Input chip："自助報到" + icons/attached-link
```

| 屬性 | 值 | Token |
|---|---|---|
| Chip 背景 | 白底 | `Color/Neutral/0` |
| Chip 邊框 | - | `Color/Neutral/200` |
| Chip radius | 6px | - |
| Chip padding | `4px 8px` | - |
| Chip 間距 | 16px | - |
| 文字 | 16px Regular | `Color/Neutral/800` |
| Icon | `icons/attached-link`，24x24 | `Color/Neutral/800` |

### 行為（2026-07-29 使用者拍板）

這三個 chip **本質是按鈕**，各自的點擊行為（例如導向企業官網網址、訂房網網址、開啟自助報到頁面）**由後端決定與提供實際連結/行為**，前端本輪**只需要正確渲染版位與元件外觀**，不需要實作點擊後的實際導轉邏輯，也沒有下一層 modal 或頁面需要跟著讀取。

---

## Typography / Colors

見上表；其餘欄位（照片觸發器、修改/設定 按鈕）的 Typography/Colors 已在對應檔案記錄，不重複列出。

---

## Token gaps / unresolved

- 無。

---

## 未讀取 / 待補項目

- 此卡在 `specs/pages/lodging-info.md` 頁面上的 RWD 斷點行為尚未個別示意，待補
