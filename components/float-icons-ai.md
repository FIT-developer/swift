# Component Specification: `floatIcons/ai`

**Figma Node ID**: `266:13224`（COMPONENT）
**狀態**: removed（2026-07-13 使用者訂正）

---

## 現況

本元件（全站右下角常駐的 AI 客服浮動按鈕, 40x70px, 文字「客服」+ 漸層
外框圓形 ai icon）已於 2026-07-13 隨「AI bot 服務退役」決策整組移除,
不再是產品的一部分。

- 實作已自 `preview/partials/room-booking-modals.html` 與
  `preview/assets/css/shell.css`（`.float-service-frame`）刪除
- `preview/assets/icons/ai.svg` 檔案與 tokens
  （`--color-accent-float-circle-mixed-1/2`、`--effect-float-shadow`）
  保留未用
- Figma 0713 系統基本 mobile 稿中此 instance 為隱藏圖層, 與移除決策一致

歷史外觀規格與 HTML 實作細節見 git history
（移除 commit `79b6ab2`, 移除前規格見該 commit 之前的本檔版本）。

---

*Removed 2026-07-13 - 記錄格式依 2026-07-14 使用者裁決: 移除時 spec 內文
重寫成現況, 細節交給 git history*
