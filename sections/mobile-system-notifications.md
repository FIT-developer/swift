# Section Specification: System Notifications（Mobile）

**Figma Node ID**: `270:12598`（INSTANCE）  
**Type**: INSTANCE  
**父層**: Landing page (mobile) - 0116（768×2278px）  
**最後同步**: 2026-04-13

---

## 概述

Mobile 版系統通知區塊，為 `System notifications` component instance 直接全寬展開。  
內容與 Desktop 版**完全相同**，差異僅在容器寬度（744px vs 572px）。

---

## 佈局位置

| 屬性 | 值 | 說明 |
|---|---|---|
| 位置 | x:12, y:385 | 頁面 padding 內 |
| 與上方間距 | 24px（Frame 25 底部 y:361 → 此區塊 y:385） | `Spacing/24` |

---

## 容器尺寸（Mobile vs Desktop）

| 屬性 | Mobile | Desktop |
|---|---|---|
| 寬度 | `744px`（fill） | `572px` |
| 高度 | `313px` | `313px`（相同） |
| Padding | `12px` all sides | `12px`（相同） |
| Corner radius | `6px` | `6px`（相同） |
| Border | `Color/Neutral/200` | `Color/Neutral/200`（相同） |
| Background | `Color/Neutral/0` | `Color/Neutral/0`（相同） |

---

## 內容

完整規格見 `components/system-notifications.md`。

結構摘要：
- **Title**：icons/label + "系統通知"（SemiBold 600，20px，Color/Neutral/800）
- **7 個通知列**，每列含 Input chip（顏色標示來源）+ 通知內文 Texts

| # | Chip 文字 | Chip 顏色 | Token | 通知內文（節錄） |
|---|---|---|---|---|
| 1 | 簡訊 | `Color/Accent/Green` | `Color/Accent/Green` | 房型已售完，請確認超賣設定… |
| 2 | 總部 | `Color/Surface/Negative` | `Color/Surface/Negative` | 房型庫存不足，請即刻補充… |
| 3 | 分館 | `Color/Brand/Brand-400` | `Color/Surface/Brand-400-Hover` | 設備故障，請聯絡維修人員… |
| 4 | 網址 | `Color/MenuItem/Default` | `Color/MenuItem/Default` | 訂單取消率過高，請確認… |
| 5 | 總部 | `Color/Surface/Negative` | `Color/Surface/Negative` | 退款申請待審核… |
| 6 | 簡訊 | `Color/Accent/Green` | `Color/Accent/Green` | 新訂單已成立，請即刻確認… |
| 7 | 分館 | `Color/Brand/Brand-400` | `Color/Surface/Brand-400-Hover` | 客房打掃完畢，可安排入住… |

---

## 實作注意事項

1. **全寬**：`w-full`（填滿 744px 容器，Mobile 獨有）
2. **Chip 寬度**：固定，不隨容器變化
3. **通知文字**：可截斷（單行 ellipsis）或換行，依實作判斷

---

*Generated from Figma mobile layout · Updated 2026-04-13*
