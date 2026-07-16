# Page: 帳號及權限 (account-permission)

**Figma 來源 (current version, read date 2026-07-16)**:
- Desktop: FRAME `2087:94594`「cp- 帳號及權限 desktop default 0716」1440x2799
  (內含 accordion 關閉 + 展開 1/2/3 狀態並列, 見 components/account-accordion.md)
- Tablet 767: `2087:96149` / `2087:96510` / `2087:96603` (accordion 展開 1/2/3)
- Mobile 340: `2078:91740` (accordion 展開 1, 單欄堆疊)

**實作**: `preview/account-permission.html` + `preview/js/account-permission.js`
**狀態**: 2026-07-16 初版

---

## 使用者確認事項 (2026-07-16 拍板)

1. 頁面初始狀態 = accordion **關閉態** (desktop default 稿)
2. Figma 稿的 1 關閉 + 3 展開為狀態並列展示; 實頁只 render 一個
   accordion, 開關與模式切換為前端互動
3. topbar「帳號及權限」chip = 本頁 active tab;「xxoo」chip = 佔位假字
   (另一顆已開 tab 示意), 不實作
4. 重整鈕 = 刷新當前頁 (demo 用 location.reload)
5. RWD 斷點 (2026-07-16 拍板, 欄數以內容可用寬度為準): <640 單欄 /
   640-767 兩欄 (mobile shell 滿版) / 768-1023 回單欄 (aside 佔
   240px) / >=1024 兩欄; 詳見 components/account-accordion.md

## 佈局

### Shell (全部沿用)
- `partials/aside.html` + `partials/topbar.html` +
  `partials/session-modals.html` + `partials/topbar-modals.html`
- topbar tab: 登記 `js/page-tabs.js` TAB_PAGES
  (`account-permission.html` ->「帳號及權限」)
- aside「系統設定 > 帳號及權限」由 inactive 佔位改接真實連結
  (同 系統基本 pattern), active 標示依 `body[data-page="帳號及權限"]`
- mobile (<768): logo + drawer 收合鈕 (既有 shell 行為)

### Content
- 外層容器 (node `2087:95008`, 同 system-basic pattern): bg
  `Color/Neutral/75`, border `Color/Neutral/200`, radius 12, padding 20
- 容器內直排, gap 12:
  1. 重整鈕列: 高 42, 重整鈕靠右
     - 重整鈕: 白底 pill, 96x42, radius 28, border
       `Color/Neutral/200`, `icons/restore.svg` 24x24 + 文字「重整」
       16px `Color/Text/800`, gap 8
     - 行為: 刷新當前頁 (location.reload)
  2. account-accordion x1 (規格見 components/account-accordion.md)
- accordion 卡面與容器同為 Neutral/75, 以 border 區隔 (Figma 渲染圖
  pixel 驗證)

### RWD
- 頁寬流動, max-w-[1440px] (既有 rootWrap)
- accordion 內部斷點見 components/account-accordion.md
  (>=640 兩欄 / <640 單欄; 模式按鈕列與紀錄 table 窄版橫向 scroll)

## Partial / module manifest (lint-partials.py 登記)

- partials: aside, topbar, session-modals, topbar-modals
- modules 順序: partials.js -> page-shell.js -> page-tabs.js ->
  account-permission.js -> modal-controller.js -> topbar-modals.js
  (本頁無專屬 modal, modal-controller 只服務共用 session/topbar 群)

## Figma 未定義

- 帳號列表 (多帳號時的排列/搜尋/新增) 未提供稿, 本頁 demo 僅單一帳號
  accordion
- 重整鈕 loading 狀態未定義, 不做
