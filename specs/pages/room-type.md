# Page: 房型 (room-type)

**Figma 來源**：
- Desktop：FRAME `2137:101408`「房型資料 desktop 0730」1440x1130
- Mobile~tablet：FRAME `2140:106747`「房型資料 mobile ~ tablet 0731」
  767x2974（2026-07-31 使用者修正版，取代舊 `2137:103071`；見下方「content
  單層結構」訂正說明）
- Mobile：FRAME `2140:106898`「房型資料 mobile 0731」375x3182（同一次修正，
  取代舊 `2137:103890`）
- Modal（新增/修改/查看）：`2137:101712` / `2137:104312` / `2137:104757`，
  見 `components/modal.md` `state=room-type` 段

### content 單層結構訂正（2026-07-31 使用者訂正）

使用者發現舊版 mobile~tablet / mobile 這兩個 Figma frame 的 `content`
不小心多包了一層（兩層 `content` 疊在一起），導致畫面多一塊底色（`Color/
Neutral/75` 淡藍白底色因為兩層疊加而看起來像多一圈邊框/色塊）。已在
Figma 修正為單層 `content`（frame 直接子節點只有「頂部 logo/選單列」+
一個 `content`，不再巢狀）。

**實作面確認**：`preview/room-type.html` 目前結構本來就只有一層內容容器
（`<main>` 內單一個 `rounded-xl border ... bg-surface-hover` 的 div），
沒有巢狀兩層的問題，這次 Figma 修正不需要改動任何程式碼，純粹是 Figma
來源檔本身的訂正 + 對應 node ID/尺寸更新（見上方來源列表與
`components/room-type-card.md` RWD 表）。

**實作**：`preview/room-type.html` 已完成（shell + 6 卡片列表 + 3 個資料 modal
+ 照片管理 modal + 啟用/停用狀態篩選 tab + 卡片停用/啟用互動）
**狀態**：2026-07-31，持續迭代中（見 `specs/progress.md` Session 121 各段交接）

---

## 使用者確認事項（2026-07-30 拍板）

1. ribbon 數字（卡片左上角三角形色塊內數字）跟部分文字都是佔位資料，版位刻對即可，
   之後由後端渲染真實內容，不用深究語意
2. 「嗚啦啦」卡缺少「房價跟隨」副標是刻意設計，不是內容缺漏
3. 「僅 住宿類型」旁沒有 toggle/checkbox，是純說明文字
4. 頁面右上角「重整」按鈕（`icons/restore` + 文字「重整」）= 重新整理當前頁，
   跟卡片內「啟用」按鈕（`icons/video-play`，2026-07-31 由「還原」/
   `icons/restore-page-outline-rounded` 改名+換圖示，見
   `components/room-type-card.md`）語意不同，不要混用；已記錄在使用者長期
   記憶 `feedback_refresh_button_semantics`，之後同元件同位置不用再問
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
- **mobile 外層 shell padding（2026-07-31 使用者截圖覆核訂正）**：房型頁是
  `specs/page-architecture.md`「Mobile/tablet 外層 shell padding」表的
  「多 card 彼此整襯型」- `#rootWrap` 用 `md:p-3`（`<768` 歸零），mobile
  top bar 自帶 `px-3 pt-3`（對應 Figma top12/left12/right12/bottom0）。
  content 本身在 mobile 要滿版貼齊左右，不能讓 `rootWrap` 無條件 `p-3`
  在 content 外面多包一層 12px；初版誤用無條件 `p-3`，已修正

### Content

- 外層容器（跟 `system-basic` / `account-permission` pattern 相同）：
  bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20
- 容器內直排：
  1. 摘要/篩選列 + 操作按鈕列（見下方「操作列」，desktop/tablet 跟 mobile
     的元素順序不同）
  2. 啟用/停用狀態篩選 tab（見下方「啟用/停用狀態篩選」）
  3. 房型卡片列表（規格見 `components/room-type-card.md`）

### 操作列

| 斷點 | 排列 |
|---|---|
| Desktop / Mobile~tablet（`>=768`） | 摘要文字（住宿:82 非住宿:0 + 僅住宿類型說明）在左，「+ 新增」「重整」按鈕在右，同一列 |
| Mobile（`<768`） | 順序反過來：「+ 新增」「重整」按鈕靠右在上，摘要文字在下，各自獨立一列
（2026-07-31 使用者訂正：按鈕是靠右對齊，不是置中） |

摘要文字內容：「住宿：{n}」「非住宿：{n}」（數字橘色 `Color/Brand/Brand-400`）+
「僅 [住宿類型（橘字強調）] 作用於「房間預定」，並計算住房率」，純說明文字，
沒有互動控制項（見使用者確認事項 3）。

### 啟用/停用狀態篩選（2026-07-31 figma-go 新增，node `2139:105271`）

卡片列表上方、操作列下方，一組左對齊的 2 顆文字 tab：「啟用」/「停用」。

- **視覺**：沿用既有 `.member-data-filter-tab` / `.is-active` pattern
  （底線 active，`font-weight: 600` + `border-bottom-color: Brand-400`，
  無框、無底色），不新增 CSS class；SVG 覆核 Figma 節點確認底線色正是
  `#F28B45`（`Color/Brand/Brand-400`），跟既有 token 一致
- **對齊**：靠左，不置中、不撐滿寬度（跟操作列文字/按鈕的排列邏輯無關，
  是獨立一列）
- **預設**：「啟用」為預設選中（Figma 節點 `啟用` 文字 weight 600、`停用`
  weight 400，前者才有底線）
- **行為**：切換 tab 即時篩選卡片列表，只顯示對應狀態的卡片；篩選依據是
  卡片「當下」的狀態（不是初始值）- 卡片本身的停用/啟用按鈕會改變其
  `state`，若因此不再符合目前選中的 tab，卡片會立刻從篩選結果消失
  （例如在「啟用」tab 下把某張卡停用，該卡立刻不見；切到「停用」tab 才會
  看到它）
- 實作：`preview/room-type.html` `#roomTypeStatusFilter` + `preview/js/
  room-type.js` `initStatusFilterTabs()` / `currentStatusFilter` /
  `renderCardList()` 篩選邏輯

#### 數量後綴（2026-07-31 figma-go 新增，node `2140:106117`）

每個 tab 文字後面加一組全形括號數量，如「啟用（2）」「停用（4）」：

- Figma 示範文案是「啟用（2）」「停用（8）」（2+8=10，跟目前 6 卡樣本
  對不上）- 這是 Figma 佔位數字，不是要求前端寫死顯示這兩個數字；使用者
  明確要求「動態統計數量」，數字必須即時反映 `ROOM_TYPE_CARDS` 當下真實
  分布，不是照抄 Figma demo 值
- **字重**：數量後綴固定 `font-weight: 400`，即使在目前選中（active，
  label 本身 600 粗體）的 tab 上，後綴數字也不跟著變粗 - 這是從 Figma
  節點覆核出來的細節（`啟用` label 跟 `（2）` 後綴是兩個獨立 text
  instance，字重不同），不是隨意假設
- **即時更新**：卡片透過停用/啟用按鈕切換狀態時，兩個 tab 的數量後綴要
  立刻反映最新統計，不是只在頁面載入時算一次
- 實作：`js/room-type.js` `updateStatusFilterCounts()`，在
  `renderCardList()` 內每次呼叫都重新計算並寫入
  `#roomTypeActiveCount` / `#roomTypeDeletedCount` 兩個 span

#### 篩選結果為空狀態（2026-07-31 figma-go 新增，node `2139:105859`）

任一 tab 篩選後若沒有符合的卡片，卡片列表位置改顯示一行提示文字，取代
整個卡片 grid（不是卡片 grid 空白一片）：

- 「啟用」tab 無資料：「沒有任何啟用中的卡片」
- 「停用」tab 無資料：「沒有任何停用中的卡片」
- 樣式：20px（`text-xl`）、`Color/Neutral/800`、靠左對齊，上下各 24px
  padding（`py-6`），跟 Figma 節點量測一致
- 實作：`js/room-type.js` `EMPTY_FILTER_MESSAGE` + `renderCardList()`
  於篩選結果為空陣列時提早 return，插入這行文字取代卡片渲染；文字容器
  用 `col-span-full` 撐滿 grid 寬度（避免只佔第一欄）

### 房型卡片列表

- Desktop：3 欄 grid
- Mobile~tablet / Mobile：單欄滿寬堆疊
- 卡片本身規格（anatomy、狀態、RWD 細節、圖片點擊行為、統計列 table 實作）見
  獨立檔 `components/room-type-card.md`
- 列表永遠只渲染符合目前篩選 tab 的子集（2 張啟用中 / 4 張已停用），不是
  一次渲染全部 6 張再用 CSS 隱藏 - 篩選切換時整份重新渲染
  （`renderCardList()`）

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

- 本次 Figma 未提供這 3 個 modal 的窄版單獨 frame，窄 viewport 下的兩欄 row
  版面调整見 `components/modal.md` `state=room-type` 段「Layout / RWD」
