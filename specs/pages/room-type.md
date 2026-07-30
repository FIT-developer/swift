# Page: 房型 (room-type)

**Figma 來源**：
- Desktop：FRAME `2137:101408`「房型資料 desktop 0730」1440x1130
- Mobile~tablet：FRAME `2137:103071`「房型資料 mobile ~ tablet 0730」767x2956
- Mobile：FRAME `2137:103890`「房型資料 mobile 0731」375x3164
- Modal（新增/修改/查看）：`2137:101712` / `2137:104312` / `2137:104757`，
  見 `components/modal.md` `state=room-type` 段

**實作**：尚未開始（本輪只完成 spec）
**狀態**：2026-07-30 spec 初版，待實作

---

## 使用者確認事項（2026-07-30 拍板）

1. ribbon 數字（卡片左上角三角形色塊內數字）跟部分文字都是佔位資料，版位刻對即可，
   之後由後端渲染真實內容，不用深究語意
2. 「嗚啦啦」卡缺少「房價跟隨」副標是刻意設計，不是內容缺漏
3. 「僅 住宿類型」旁沒有 toggle/checkbox，是純說明文字
4. 頁面右上角「重整」按鈕（`icons/restore` + 文字「重整」）= 重新整理當前頁，
   跟卡片內「還原」（`icons/restore-page-outline-rounded`）語意不同，不要混用；
   已記錄在使用者長期記憶 `feedback_refresh_button_semantics`，之後同元件同位置
   不用再問
5. aside 選單佔位標籤（主項目一~六、前台作業/房間預訂/子項目二三）沿用既有實作，
   不跟 Figma；沿用既有規則 `feedback_menu_list_source`
6. mobile/tablet 消失的 breadcrumb chips + 頂部 function icons，沿用既有 shell
   pattern，不是頁面專屬規格 - 對照 `preview/lodging-info.html` +
   `preview/partials/topbar.html`/`aside.html` 確認：`#desktopTopRow`
   只在 `md:flex` 顯示；`<768` 用獨立 mobile top bar（logo +
   `#mobileMenuBtn` 開 `folder.svg`），chips/function icons 收進 aside
   抽屜（`mobile-sidebar-header`）
7. 統計列（代號/床型/間數/營運方式）當 table 做，外層 `overflow-x-auto`，不分斷點
   另外設計版面；細節見 `components/room-type-card.md`「統計列」段
8. 卡片圓形圖片（有圖/無圖皆可點擊）開啟跟「系統設定 -> 民宿資料」頁共用同一版型的
   照片管理 modal（`components/modal.md` `state=photo-gallery`），但 JS 各自獨立
   實作，不共用 `lodging-info-modals.js`；細節見 `components/room-type-card.md`
   「圖片點擊行為」段
9. 新增/修改/查看 modal 欄位規則、disabled 判斷、footer 按鈕差異，全部見
   `components/modal.md` `state=room-type` 段，本檔不重複

---

## 佈局

### Shell（全部沿用既有 partial，不新增頁面專屬 shell 邏輯）

- `partials/aside.html` + `partials/topbar.html` +
  `partials/session-modals.html` + `partials/topbar-modals.html`
- topbar tab：登記 `js/page-tabs.js` TAB_PAGES（`room-type.html` -> 「房型資料」）
- aside「系統設定 -> 房型」由 inactive 佔位改接真實連結，active 標示依
  `body[data-page="房型資料"]`
- mobile（`<768`）：logo + drawer 收合鈕（既有 shell 行為），breadcrumb chips
  跟 function icons 收進 aside 抽屜，見上方使用者確認事項 6

### Content

- 外層容器（跟 `system-basic` / `account-permission` pattern 相同）：
  bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20
- 容器內直排：
  1. 摘要/篩選列 + 操作按鈕列（見下方「操作列」，desktop/tablet 跟 mobile
     的元素順序不同）
  2. 房型卡片列表（規格見 `components/room-type-card.md`）

### 操作列

| 斷點 | 排列 |
|---|---|
| Desktop / Mobile~tablet（`>=768`） | 摘要文字（住宿:82 非住宿:0 + 僅住宿類型說明）在左，「+ 新增」「重整」按鈕在右，同一列 |
| Mobile（`<768`） | 順序反過來：「+ 新增」「重整」按鈕置中在上，摘要文字在下，各自獨立一列 |

摘要文字內容：「住宿：{n}」「非住宿：{n}」（數字橘色 `Color/Brand/Brand-400`）+
「僅 [住宿類型（橘字強調）] 作用於「房間預定」，並計算住房率」，純說明文字，
沒有互動控制項（見使用者確認事項 3）。

### 房型卡片列表

- Desktop：3 欄 grid
- Mobile~tablet / Mobile：單欄滿寬堆疊
- 卡片本身規格（anatomy、狀態、RWD 細節、圖片點擊行為、統計列 table 實作）見
  獨立檔 `components/room-type-card.md`

---

## Modal

- 「+ 新增」開啟新增 modal；卡片「修改」按鈕開啟修改 modal；卡片「查看」按鈕
  開啟查看 modal；卡片圓形圖片開啟照片管理 modal（跟民宿資料頁共用版型，JS 獨立）
- 前三個 modal 欄位規格、disabled 規則、footer 差異，見 `components/modal.md`
  `state=room-type` 段
- 照片管理 modal 規格見 `components/modal.md` `state=photo-gallery` 段

---

## Partial / module manifest（實作時登記進 `scripts/lint-partials.py`）

- partials：aside、topbar、session-modals、topbar-modals（沿用既有，本頁不新增
  頁面專屬 partial 內容，除非之後 modal HTML 量太大需要拆檔）
- 預計新增 JS module：`room-type.js`（頁面卡片列表渲染/篩選）、
  `room-type-modals.js`（新增/修改/查看 modal 行為）、
  `room-type-photo-modal.js`（照片管理 modal，跟 `lodging-info-modals.js`
  獨立不共用，見使用者確認事項 8）；實際檔名與 import 順序在實作時依
  `scripts/lint-partials.py` MANIFEST 慣例登記

---

## Figma 未定義 / 待確認

- 「已刪除」狀態卡片是否強制不能有照片，樣本不足，見
  `components/room-type-card.md`「Figma 未定義」段
- 本次 Figma 未提供這 3 個 modal 的窄版單獨 frame，窄 viewport 下的兩欄 row
  版面调整見 `components/modal.md` `state=room-type` 段「Layout / RWD」
