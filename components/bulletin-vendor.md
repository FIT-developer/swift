# Component Specification: `Bulletin - vendor`

**Figma Node ID**:（COMPONENT_SET）
**Type**: COMPONENT_SET
**狀態**: removed（2026-07-08 ai-chat council `bulletin-icon-removal`
拍板, Session 99-103 落地）

---

## 現況

本元件（廠商訊息公告面板: 系統公告列表、篩選分類、搜尋、表格、分頁,
3 variants）對應的「公告」功能已整組移除, 不再是本次交付的一部分:

- 移除範圍: `desktopBulletinBtn` / `mobileBulletinBtn` /
  `modalBulletinBackdrop` / `.bulletin-tab` / `bindBulletinRows`
  （Session 103 已獨立 grep 復查無實作殘留）
- `bulletin.svg`（同心圓標靶 + 箭圖形, 使用者慣稱 target icon）檔案保留
  未用
- 決策過程見 `specs/agent-council/bulletin-icon-removal/`;
  function icons 現況（message / person-md 兩顆）見
  [function-icons.md](function-icons.md)
- 2026-07-13 使用者再次確認: 移除對象是本元件（target icon 的客戶公告
  系統）, `icons/message` 開啟的系統公告（bulletin-administer.md）保留

歷史規格（variants、外框、表格欄位等）見 git history（本檔重寫 commit
之前的版本）。

---

*Removed per council 2026-07-08 - 本檔內文 2026-07-14 依使用者裁決重寫
成現況（移除時 spec 內文不留歷史規格, 細節交給 git history）*
