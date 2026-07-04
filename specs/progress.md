# Progress - 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。
> 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
> （歷史決策可能已被推翻，一律以本檔最新 session 為準）。
> 本檔超過 ~25 個 session 時，將最舊的 10 個搬進 archive。

---

## Session 85 交接 (2026-07-04)

### 任務: Stage 2 - 拆房間預定 -> room-booking.html（同一對話接續 Session 84；使用者驗收 1d 後指示直接開工）

### 本輪改動

1. `preview/room-booking.html`（覆蓋 superseded 舊檔，103 行）：獨立房間預定頁。內容 = `data-partial="room-booking-sections"`（與訂單修改 modal body 同一來源）+ aside/topbar/room-booking-modals/session-modals partials。頁面 module 順序：loadPartials -> initPageShell -> initRoomBookingBehaviors(#rbPageContent) -> initOrderModals()（回傳 modalApi）-> initArrivalMethodModal(modalApi)。head 補 Swiper CDN + CSS（接送卡片依賴）。
2. `preview/js/arrival-method-modal.js`（新，420 行）：landing arrival IIFE 全量搬出 - 13 個 event bindings 逐一 disposition **全搬無略過**（依 start.md「JS 搬移/略搬 audit」規則）：chip 切換、開啟時 label->chip 同步、確定 commit label + 關閉（closeModal 走 initOrderModals 回傳的 modalApi，單一來源）、車輛 stepper、接送雙 swiper（新增/刪除/箭頭/dots/lazy init）、生效日 simple calendar。order-processing.html **不載入**本 module（使用者同意該頁到店維持靜態 + 開關）。
3. `preview/js/page-shell.js`（新，69 行）：aside accordion 收合 / 「收合」全部 / mobile drawer 開關，自 landing 對應 IIFE 搬出；room-booking 與 order-processing 兩頁共用。`partials.js` markActivePage 補 accordion icon open 態同步。
4. `preview/partials/session-modals.html`（新，125 行）：確定登出（A）/ 帳號切換（B）自 landing 抽出 - aside 的 登出/更換帳號 icon 用 data-modal-open 觸發，aside 是全站 partial，這兩個 modal 必須全站存在。landing 以 sessionModalsMount sync 注入；兩個新頁 data-partial async 注入。
5. `preview/js/order-modals.js`：會員資料 modal 的 nation-group 改為自行綁定（room-booking 頁沒有 initOrderProcessing 可依賴），以 `data-nation-init` guard 防重複；order-processing.js 與 room-booking-behaviors.js 的 nation-group 綁定套同一 guard。initOrderModals() 改回傳 `{ openModal, closeModal }` 供其他 module 使用。
6. `preview/partials/aside.html`：房間預定 -> `<a href="./room-booking.html">`（同 訂單處理 pattern）；desktop logo 包 `<a href="./landing.html">`（logo = 回今日總覽 全站慣例）。兩個新頁 mobile top bar 的 logo 也包同連結。
7. `preview/landing.html`（5028 -> 4912 行）：tpl-room-booking（含 roomBookingSectionsMount sync 注入）移除；Modal A/B 改 sessionModalsMount 注入；PAGE_TEMPLATES 清空（雙頁皆真實連結，其餘選單項維持 placeholder SPA 頁）。

### 驗證（self-tested）

- 三 lint pass、`git diff --check` pass、三頁 inline scripts parse OK（5/1/1）、三頁組合 duplicate id 均無
- room-booking.html（1440）：console 無錯誤；[A] calendar 42 格渲染 + 庫存模式 + 月曆 offcanvas teleport/日期關閉；[B] 加購 12 產品 + stepper 連動頁面 cart（3 行）；[D] 會員資料 modal 國籍外籍連動（新綁定）+ 合約公司疊層 60/65 + customer toggle 連動（合約欄位顯示 + 合約 tab 自動 active）+ lock toggle；[E] 產生訂單 variant 對應（official -> 已付款）
- 到店方式完整互動：chip 切換 panel、stepper 0->1、接送 swiper 卡片 1->2、確定 commit「包車或專車」寫回 [D] label + 關閉
- footer/header 按鈕逐顆實測（rb 頁 10 個 modal、28 顆）：全部 closes、無殘留開啟
- aside（page-shell）：accordion 展開/收合、收合全部、mobile drawer（menu 鈕開 / backdrop 關 / X 關）、登出與帳號切換 modal 確定/取消 closes
- mobile 390：無水平溢出、drawer 正常、加購 modal 貼齊視窗
- order-processing 回歸：console 無錯誤、session modals 生效、accordion 生效、房間預定連結、修改 modal body 4 區塊、nation guard 單次綁定且外籍連動正常
- landing 回歸：console 無錯誤、dashboard 4 charts、compact/aside 登出與帳號切換（經新 partial）、雙頁連結、placeholder SPA 頁開關與返回 dashboard、aside logo 連結、tpl 已除
- 截圖 specs/qa-screenshots/session-85/（room-booking 1440/390、到店接送 swiper）

### 重要決定

- 返回 landing 的導航裁決：**logo = 回今日總覽（landing.html）**，aside desktop logo 與兩個新頁 mobile logo 都包連結；原 open question 的「landing.html 帶 hash 開子頁」已無必要（兩個子頁皆獨立頁）
- Modal A/B 抽成 session-modals partial 納入 Stage 2 範圍：aside 是全站 partial，其 登出/更換帳號 觸發的 modal 不能只存在 landing（否則新頁上是死按鈕，與 Session 84 使用者連續抓到的死按鈕同類）
- op 頁到店方式維持靜態 + 開關（使用者 Session 84 同意），不載 arrival module；rb 頁載入完整互動版
- nation-group 統一 `data-nation-init` guard 慣例（三個 module 同 guard，先跑者生效）

### 下一步

Stage 3：landing 清理只剩 dashboard（移除 inert 的 initSubPageBehaviors/initCalendar/op-* 綁定、modal 系統與新 module 收斂去重、page-tab chips 機制與 placeholder 頁去留待使用者裁決）、topbar function icons / compact 收折 / role filter 行為模組化、C/D/E modal 是否抽 partial 待定。

### 未解問題

- 新頁 topbar 三顆 function icon（公告/訊息/會員安全管理）與 foldBtn/expandBtn 收折、role filter 仍 present-unbound（target modal C/D/E 只在 landing；Stage 3 範圍）
- landing 內大量 inert code（initSubPageBehaviors 全部 + modal 系統中 rb 專屬分支）待 Stage 3 清理；目前無害但佔 ~2500 行
- landing 其餘選單項的 placeholder SPA 頁機制去留，待使用者於 Stage 3 裁決

---

## Session 84 交接 (2026-07-04)

### 任務: Stage 1d - 搬 modal 並退役 orderEdit_ clone（landing 拆頁重構 Stage 1 收尾）

### 本輪改動

1. `preview/partials/room-booking-modals.html`（新，2009 行）：自 landing.html 抽出 8 個共用 modal + 庫存月曆 offcanvas（房型介紹 / 訂房明細編輯 / 加購 / 訂單明細 / 簡訊 / 到店方式 / 會員資料 / 更換合約公司 / invCalendarOffcanvas）。landing 以 sync XHR 注入（`roomBookingModalsMount`，同 aside 模式，位置在原 Modal F 處、主 script 之前）；新頁以 `data-partial` async 注入。
2. `preview/js/room-booking-behaviors.js`（新，1348 行）：landing 的 `initSubPageBehaviors` + `initCalendar` 原樣搬出（root-scoped），export `initRoomBookingBehaviors`。唯一調整：offcanvas 解析固定用單一 `invCalendarOffcanvas`（新頁獨立 document，無副本分流）。
3. `preview/js/order-modals.js`（新，1372 行）：modal 開關核心（動態 z-index 60+N*5、疊層感知 scroll lock、delegated close/backdrop/ESC + data-no-dismiss）、op 選單接線（訂單 / 簡訊 / 修改）、`buildOrderEditModalBody` 改為 fetch `partials/room-booking-sections.html` 注入 + 四項差異（[A] 標題「庫存」、移除 customer-toggle、訂單編號列、[D] 還原鈕）+ `initRoomBookingBehaviors(body)` + btnInventory 切庫存模式、加購渲染系統整包（產品資料 + render + cart + 互動）、訂單明細 variant/accordion、訂房明細編輯 lock/clear、會員資料 honorific/身份/chips/tabs、會員資料與合約公司 delegated triggers。
4. `preview/order-processing.html`（740 -> 812 行）：加 modal partial mount + 訂單修改外殼 markup + `initOrderModals()`。
5. `preview/landing.html`（7910 -> 5028 行）：移除 `tpl-order-processing`、訂單修改外殼、`ensureOrderEditModalClone` / `buildOrderEditModalBody` / `resolveScopedModalId` / `window.initSubPageBehaviors` export、PAGE_TEMPLATES 的訂單處理項；[E] 送出與會員資料 / 合約公司 trigger 改直開原 instance；initCalendar 的 offcanvas 分流簡化為單一 id。
6. `preview/partials/aside.html`：訂單處理改 `<a href="./order-processing.html">`（landing SPA click 綁定 selector 只認 div，anchor 自然走原生導航）。`preview/js/partials.js`：markActivePage selector 改 `:is(div, a)`，並展開 active 項所屬分類（新頁無 accordion JS，收合會看不到 active）。
7. lint 修正：新增行 min-w 全部 md: gate（記錄表 1000px / count pill 38px / 數量 badge 33px / price table 343px，皆在 overflow 容器內或有 padding 撐底，mobile 視覺不受影響）；裝飾性 Unicode 全數 ASCII 化。
8. 使用者回報修正：到店方式 modal footer「確定」在新頁沒有關閉效果。全面 audit 後確認全 repo 只有這一顆按鈕靠 landing 的 arrival IIFE handler 關閉（`data-am-action="confirm"` -> commit + closeModal），其餘所有 modal 的 確定/取消/確定加購/修改 都是 `.modal-close-btn` + `data-modal`（delegated close 已涵蓋）。order-modals.js 補 delegated handler：confirm -> closeModal（commit 寫回 label 的部分不搬 - 本頁 chips 不可切換，commit 無實質意義且可能覆寫 [D] label）。

9. 使用者回報修正（第二輪）：landing 的 登出（modalLogoutBackdrop）/ 帳號切換（modalSwitchBackdrop）/ 會員安全管理（modalMemberBackdrop）三顆 footer「確定」也沒有關閉效果。git 溯源：三顆自各自誕生的 commit（dec65b4 / 5c6cc93）就沒有 modal-close-btn 也沒有 JS handler，一路到 1d 前的 HEAD 都是死按鈕 - 既存 bug，非 1d 引入。依 landing 凍結例外（bug 修正 + 使用者指名）補上 `modal-close-btn` + `data-modal`。隨後把關閉語意按鈕掃描擴大到全 repo 三個檔案的所有 modal（含 aria-label、送出/儲存/完成 等字樣）：除到店「確定」為 handler-based（兩頁皆已接線）外，其餘全數有關閉機制。瀏覽器實測三顆 確定 + 三顆 取消 全部 closes。
   - **定性更正（使用者質疑後查證）**：我曾在對話中推測這三顆是「當初被當成後端動作所以前端沒做關閉」- 全 repo 與 git log 查無任何此類指令，使用者從未下過這個命令，該推測撤回。實際上 `components/modal.md` 明文相反：共用 Interaction 的關閉方式含 footer close action、訂單明細規格寫「footer 取消/確定 關閉」、簡訊規格寫「both close modal in preview」，A/B/E variant 段無任何覆寫。正確定性：**實作違反 modal.md 既有慣例的疏漏**，本次修正是讓實作回歸規格。

### 檢討與 binding-level retro audit（使用者指出驗證方法有洞後補做）

失誤根因（記錄供之後 stage 避免重蹈）：
- 決定略搬 arrival IIFE 時，沒有列出該 IIFE 的全部 event bindings 逐一標 disposition，confirm 的關閉行為被靜默丟掉
- 回歸測試「到店方式（開關）」是自選 `.modal-close-btn` 一條會過的路徑，不是逐顆按鈕實測
- 對策已寫入 start.md「JS 搬移/略搬 audit」段；footer/header 按鈕逐顆實測已補做（見上方驗證段）

Arrival IIFE 13 個 bindings 的完整 disposition（retro audit 結果）：
- confirm 關閉 -> 本輪已補
- 開啟時 label->chip 同步、確定 commit label -> 不搬：chips 固定 + [D] 預設 label「自行到店」= 預設 chip（general），皆為 no-op
- chip 切換 -> 使用者同意範圍外（現況即可）
- stepper / swiper dots / 接送卡片增刪與箭頭 / 生效日 calendar / transfer lazy init -> 全部位於 hidden panels（self-drive/charter/transfer），無 chip 切換即不可達；general panel 經實測 0 個互動元素，無其他死按鈕
- 其他 landing 全域綁定 vs partial 內容交叉檢查：`.eye-toggle`（partial 無此按鈕）、`.member-tab` / `.administer-tab`（對應 modal 不在新頁）、會員資料生日欄（兩邊都是純 text input）-> 均無落差

同類「markup 在、綁定不在」的既知缺口（1b 起既有，非 1d 引入，Stage 3 範圍）：
- 新頁 topbar 三顆 function icon（公告/訊息/會員）與 compact 登出/帳號切換 present-unbound，其 target modal（A/B/C/D/E）不在新頁
- 新頁 mobileMenuBtn drawer、aside accordion 收合、role filter 無 JS

### 驗證（self-tested）

- 三 lint pass（conventions / fonts / tokens）、`git diff --check` pass、6 個 inline script parse OK、兩頁組合 duplicate id 均無
- 瀏覽器實測（chrome-devtools，截圖 specs/qa-screenshots/session-84/）：
  - 新頁三條鏈：訂單（variant 未付款 + accordion + 內部簡訊 trigger 疊 z65）、簡訊、修改（body 4 區塊注入 + 四項差異 + 庫存模式 + 月曆 offcanvas teleport/日期關閉）
  - 三層疊層：修改 60 / 會員資料 65 / 合約公司 70；ESC 只關最上層且 data-no-dismiss 生效；關子層 body scroll 維持鎖定
  - 巢狀 modal：加購（12 產品渲染、stepper 更新 cart 與 [B] 頁面 cart）、房型介紹、訂房明細編輯（lock 預設鎖定、解鎖可輸入）、到店方式（開關）
  - mobile 390：無水平溢出、pill 選單 bottom sheet、修改 modal 貼齊視窗、會員資料疊層正常
  - footer 按鈕逐顆實測（瀏覽器）：到店 取消/確定、訂房明細編輯 確定、加購 取消/確定加購、房型介紹 關閉、會員資料 修改、合約公司 取消/確定、訂單明細 取消/確定、簡訊 取消/確定、修改 modal X/取消/確定 - 全部 closes；會員資料/訂房明細編輯的「清除」與 body 區塊內容自帶的「取消」按鈕在 landing 同樣不關閉，等價
  - landing 回歸：console 無錯誤、dashboard 正常、房間預定 SPA（加購 / 會員資料->合約公司 / 到店 chip 切換 / [E] 送出 -> 訂單明細 / 庫存月曆 offcanvas）全過、topbar 公告 / 會員 modal 正常、aside 訂單處理連結實際跳頁成功

### 重要決定

- 到店方式 modal 在新頁為「靜態 + 開關」：與 landing 時期 orderEdit_ 副本等價保真（副本本來就不接互動 JS）；chip 切換 / swiper 卡片屬房間預定頁情境，Stage 2 再模組化（新頁未載 Swiper CDN）
- 加購 modal 是 JS 渲染空殼，靜態 partial 會開出空 modal，故加購系統整包搬入 order-modals.js（保真度高於舊副本，且 Stage 2 房間預定頁可直接複用）
- 「產生訂單」按鈕位於 sections partial 的 wrapper 之外（頁面層），modal body 只取 wrapper children，故新頁修改 modal 內沒有該鈕 - 與 landing 舊行為等價，非漏搬
- landing 的 op-* 行為（快篩 / pill 選單 / tooltip 等）留在 initSubPageBehaviors 內成 inert code（tpl 已移除、selector 找不到目標），Stage 3 收斂時再清
- 過渡性 JS 複製（room-booking-behaviors / order-modals vs landing inline 版）為計畫內重複，Stage 3 去重

### 下一步

1. Stage 2：拆房間預定 -> room-booking.html（直接用 room-booking-sections + room-booking-modals partials；JS 可複用 room-booking-behaviors.js，需補頁面層 產生訂單 / 加購 cart / customer-toggle 等頁面情境行為與到店方式互動 JS 模組化）
2. Stage 3：landing 清理只剩 dashboard、殘餘共用 JS 模組化、去重

### 未解問題

- 新頁 aside 只有訂單處理是真實連結，其他選單項（含返回 landing 三頁）仍是無行為的 div；返回導航規則（landing.html + hash?）待 Stage 2 定義
- 新頁 aside 的 accordion 收合 JS 尚未有（partials.js 只展開 active 分類），其他分類點擊無反應 - 1b 起既有狀態，Stage 2/3 一併處理

---

## Session 83 交接 (2026-07-04)

### 任務: 1a/1b 瀏覽器驗收補齊 + Stage 1c（訂單處理 JS module）

1. **1a/1b 瀏覽器驗證補齊**（Session 81/82 的環境起不了 server，只做了 lint/結構檢查）：
   - landing 回歸全過：aside/topbar 注入、房間預定（[A]-[E] partial 4 區塊）、訂單處理 SPA、訂單修改 modal build（標題「庫存」）
   - order-processing.html 獨立載入全過：aside async + active 標示、topbar + 導航 chip（真實 link）、內容完整、1440/390 無溢出；截圖 specs/qa-screenshots/session-83/
2. **Stage 1c 完成**：`preview/js/order-processing.js`（新，~425 行）：
   - 自 landing 的 initSubPageBehaviors 逐塊搬出（原樣 root-scoped）：accordion、op 快篩、op pill 選單（開/關/定位）、op tabs、op tooltip（含視窗夾取）、op 專案 toggle、simple calendar（rb-cal-cell）、nation-group
   - 頁面 module `initOrderProcessing(document)` 於 loadPartials 後呼叫
   - 頁面補 dayjs CDN（simple calendar 依賴；漏載會讓 init 中途 throw、後續塊全不綁 - 已踩過並修正）
   - 快速區間鍵（今日/本週等）實測無 JS handler（靜態 markup，後端行為），無需搬移
   - 選單項目點擊僅收合（modal 接線 = Stage 1d）
3. 互動回歸全過：快篩單選/取消、tabs、pill 選單開關、tooltip 開/夾取/外部關、專案 toggle 文案、calendar popup（.calendar-dropdown 33 日期鈕）、國籍連動、mobile accordion/bottom sheet/無溢出；console 無錯誤

### 下一步

**Stage 1d**（給下個 session）：搬 modal（訂單明細/簡訊/修改外殼 + 巢狀組）至新頁或 partial、修改 body 改用 room-booking-sections partial、orderEdit_ clone 退役、aside 連結切 href、landing SPA 入口移除、三條鏈回歸。要點見 page-architecture.md。

未 push commits：5 個（至 c6aa3f2）+ 本輪未 commit 改動。

---

## Session 82 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 1b（order-processing.html 靜態頁 + topbar partial）

延續 Session 81；本輪仍不讀 Figma，照既有 spec/html 拆頁。Stage 1b 只要求新頁獨立載入、顯示、RWD 不爆版，先不接互動。

### 本輪改動

1. `preview/partials/topbar.html`（新）：自 `landing.html` 抽出 desktop top row（`desktopTopRow` / `sidebarCompact` / `pageTabsInline` / function icons）。Mobile logo/menu bar 保留在 page shell，因為它在 `bodyArea` 外層；若和 desktop row 放同一 partial 會改變 landing 或新頁的 DOM hierarchy。
2. `preview/landing.html`：desktop top row 改同步 XHR 注入 `./partials/topbar.html`，讓既有 load-time handlers 仍可在主 script 執行前找到 `desktopBulletinBtn` / `desktopMessageBtn` / `desktopMemberBtn` / `expandBtn` / `pageTabsInline`。
3. `preview/order-processing.html`（新）：建立訂單處理靜態頁骨架，使用 `data-partial="aside"` 與 `data-partial="topbar"` async 載入共用 partials；頁面內容自 `tpl-order-processing` 搬出。`body[data-page="訂單處理"]` 供 `partials.js` 標示 aside active。
4. 新頁 module：`await loadPartials()` 後在 `pageTabsInline` render 一顆 active `訂單處理` navigation chip（真實 link，無 close button，符合 tab chips 降級為導航列的決策）。
5. `preview/assets/css/landing.css`：`.page-tab` 補 `text-decoration: none;`，讓新頁 anchor chip 不出現瀏覽器預設底線；landing 既有 div chip 視覺不變。
6. 新頁 static display 補值：`data-op-date-from` / `data-op-date-to` 先填 `2026-07-01` / `2026-07-02`，避免 Stage 1c 前沒有 calendar JS 時日期欄空白。

### 驗證

- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `git diff --check` pass
- 結構檢查 pass：
  - `order-processing.html` 含 `data-partial="aside"` / `data-partial="topbar"`
  - `order-processing.html` 含 `op-filter-panel` / `op-row-menu`
  - 新頁日期靜態值存在
  - 新頁 module 會 render `page-tab active` 的 `訂單處理`
  - `topbar.html` 含 `pageTabsInline` 與三個 desktop function icon trigger
  - `landing.html` 含 `topbarMount` 與 `./partials/topbar.html` 同步注入
- HTTP server 檢查：另開 8010 server 後，外部 `curl` 仍回 `connection refused`（同 Session 81 的 8000/8002 問題）。已關閉本輪啟動的 8010 session；本輪以 lint + 本地結構檢查作為 Stage 1b 驗證。

### 下一步

1. Stage 1c：建立 `preview/js/order-processing.js`，搬入 op-* 行為（pill menu、filter tabs、quick filter、tooltip clamp、project toggle）。
2. 視需要建立共用 module 給新頁使用：`rb-accordion` / `nation-group` / `rb-cal-cell` 等；landing inline 版暫留，Stage 3 再收斂去重。
3. Stage 1c 後再做新頁互動回歸；Stage 1d 才搬 modal 與退役 `orderEdit_` clone。

### 重要決定

- 1b 期間 aside 的「訂單處理」href 仍不切；新頁先用直接網址驗收，避免 landing SPA 入口在 1c/1d 前中斷。
- `landing.html` 內的 `tpl-order-processing` 凍結待刪；後續訂單處理頁視覺調整應改 `preview/order-processing.html`。

### 未解問題

- 本機 HTTP server 在目前執行環境下仍不可靠，後續若要瀏覽器截圖驗證，需先排除 port/listener 問題或改用可穩定控制的 browser tooling。

## Session 81 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 1a（room-booking sections partial）

使用者已將 Stage 1 細分 1a-1d 寫入 `specs/page-architecture.md`，並明確指示本輪不用 Figma，照既有 spec/html 開工。Figma MCP checklist 視為不適用；未同步 tokens（沒有新 Figma Variables 或新設計值）。

### 本輪改動

1. `preview/partials/room-booking-sections.html`（新）：自 `preview/landing.html` 的 `tpl-room-booking` 抽出 [A]-[E] wrapper 內容，作為房間預定頁與訂單修改 modal 後續共用來源。
2. `preview/landing.html`：`tpl-room-booking` 內改成同步 XHR 注入 `./partials/room-booking-sections.html`，模式同現有 aside 同步注入；目標是讓 `openPage()` 的 `tpl.innerHTML` clone 與 `buildOrderEditModalBody()` 的 `tpl.firstElementChild.children` 行為維持不變。
3. 新 partial 變成新增檔後，清理新增行 lint 會擋的歷史內容：註解中的裝飾性 Unicode 改 ASCII、stepper minus glyph 改 `&minus;` 保持畫面、兩個 mobile-unsafe `min-w` 改為 `md:min-w-[580px]` / `w-[54px]`。

### 驗證

- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `git diff --check` pass
- Inline script parse check pass（3 個 inline scripts）
- 本地結構檢查 pass：模擬同步注入後 `tpl-room-booking` 第一個元素仍為 `<div class="flex flex-col gap-4">`，且包含 `data-order-summary-submit` / `id="btnInventory"` / `data-data-exists-trigger`
- 訂單修改 modal 依賴 selector 檢查 pass：`invCalendarLeft` / `tableInventory` / `data-inventory-date-modal` / `customer-toggle` / `orderDataClear` / 加購與到店 modal trigger 皆仍在 partial
- HTTP 檢查：`landing.html` 曾回 200；partial curl 驗證受本機 server/port listener 狀態干擾（8000/8002 皆出現 first request 後連線不穩，8000 上 lsof 看到多個 Python listener），本輪改以本地結構檢查替代，未做瀏覽器截圖。

### 下一步

1. Stage 1b：建立 `preview/order-processing.html` 靜態頁，頁內容自 `tpl-order-processing` 搬出。
2. 同步抽 `preview/partials/topbar.html`（partial 只含容器 markup，landing 與新頁各自 render chips）。
3. 1b 期間 aside 的「訂單處理」href 先不切，避免 landing SPA 入口斷掉；新頁先用直接網址驗收。

### 重要決定

- 本輪只做 Stage 1a，不退役 `orderEdit_` clone；clone 機制留到 Stage 1d 搬 modal 時處理。
- `preview/room-booking.html` 仍是 superseded 舊檔，不作為拆分來源。

### 未解問題

- 需要後續用穩定 server 或 browser tooling 做 Stage 1b/1c/1d 的視覺回歸截圖；本輪沒有新增視覺設計，只做 template partial 抽離。

## Session 80 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 0（使用者核准整個分階段計畫）

使用者決定將 landing.html 依 content 拆成獨立 html（房間預定/訂單處理各自一頁，landing 剩 dashboard）。完整計畫與決策記錄在 **specs/page-architecture.md「landing.html 拆頁重構計畫」段**（含 tab chips 降級為導航列的決策、四個 stage、Stage 1 執行要點）。

### 本輪產出（Stage 0）

1. 拆頁計畫寫入 page-architecture.md（每 stage 一個 session、中間態皆可用）
2. `js/tailwind-config.js`：landing 的 inline tailwind.config（63 行）抽出共用，landing 改外部引用；回歸：config 自訂色正常渲染

### 下一步（下個 session 開場直接做）

**Stage 1：拆訂單處理 -> order-processing.html**，執行要點見 page-architecture.md 該段（先抽 [A]-[E] partial -> 頁骨架 -> 頁內容搬移 -> JS 抽 modules -> aside 連結改真實 href -> 三 lint + 全回歸）。Stage 1 完成後 orderEdit_ clone 機制可整組退役。

其他遺留：使用者操作驗收訂單處理頁（截圖 session-78/）；未 push commits x5（ee06dfb/b9722a8/26fedd1/f6deac1/本輪）。

---

## Session 79 交接 (2026-07-04)

### 任務: B3 start.md 瘦身 + 驗收材料 + 三層 modal 疊層修正

1. **B3**：start.md「元件 conventions」「可復用 UI patterns」兩段（60 行，無界增長區）整段移至 specs/html-conventions.md（現 229 行），start.md 留指標段（450 -> 396 行）；memory 的行號引用改段落名引用
2. **驗收材料**：11 張多角度截圖存 specs/qa-screenshots/session-78/（accept-01~11：1440 篩選/表格/dropdown/修改 modal 三區塊/tooltip + 390 頁面/bottom sheet/modal/月曆 offcanvas），等使用者實際操作驗收
3. **三層 modal 疊層修正**（使用者回報：會員資料內「公司名稱 edit」開出的 modal 層級不對）：
   - 根因：orderEdit_ 副本 append 在 body 不在 #modalOrderEditBackdrop 內，副本內 delegated trigger 過不了 scope 檢查，開到原版（z60）壓在副本（z65）下
   - 修正：scope 檢查改 `closest('#modalOrderEditBackdrop, [id^="orderEdit_"]')`；z 改動態疊層（openModal 依已開數 N 給 60+N*5，任意深度）；Esc 只認 computed z 最上層、最上層 no-dismiss 則不動作（修掉穿透關底層的衍生 bug）；data-order-summary-submit 加防禦性分流
   - 驗證：三層鏈 60/65/70、原版全程未動、Esc/按鈕逐層關、房間預定頁原路徑回歸全過
   - spec：order-edit-modal.md 巢狀規則段更新為動態疊層版

### 下一步

1. 使用者操作驗收訂單處理頁（截圖組在 session-78/）
2. 未 push commits：ee06dfb / b9722a8 / 26fedd1 / 本輪
3. audit 項目全數完成（B1-B4 + 5 項止血）

---

## Session 78 交接 (2026-07-03)

### 任務: audit B2 + B4（B3 start.md 瘦身留待下個 session）

1. **B4 token mirror drift check**：新增 `scripts/lint-tokens.py` / `.sh`，比對 tokens.md 的 Color raw hex 定義與 base.css `--color-*`（含 var() alias 鏈遞迴解析），掛進 pre-commit hook（第三個 lint）。首跑 86 個 token 全數一致零 drift
2. **B2 progress.md archive**：Session 6-62 搬 `specs/progress-archive-s06-s62.md`（2684 行），本檔留最近 15 個 session（822 行）；檔頭與 start.md 檔案地圖加「archive 決策可能已被推翻，以本檔最新為準」規則；lint-conventions 豁免 progress-archive 檔（歷史內容依 start.md 本就豁免）
3. 修 lint-conventions worktree 模式在前一輪已補的 untracked 掃描於本輪實戰生效

### 下一步

1. **B3 start.md 瘦身**（唯一剩餘 audit 項）：元件 conventions + UI patterns 段搬 specs/html-conventions.md，目標 ~250 行；搬完掃 memory 檔的行號引用
2. 訂單處理頁最終驗收；未 push commits：ee06dfb + b9722a8 + 本輪

---

## Session 77 交接 (2026-07-03)

### 任務: B1 頁面架構調整（landing.html 凍結 + multi-page 架構 + aside 單一化）

背景：公司要求原生技術（無框架），單檔會持續膨脹（使用者原話「將來還會恐怖的大包」），故執行 audit B1。核心論點：**原生不等於單檔** - ES modules 與 fetch partial 都是瀏覽器原生能力。

### 本輪產出

1. **前置實測（全過）**：Tailwind Play CDN 的 MutationObserver 對 runtime 注入內容完整生成樣式（arbitrary value / CSS var arbitrary / config 自訂色三種都驗證）；原生 ES modules 經 python http.server 直接可用
2. **`specs/page-architecture.md`**（新 spec）：目標結構（`preview/{page}.html` + `partials/` + `js/`）、新頁面固定骨架、partial 載入機制、id 命名空間（跨頁無碰撞 = 核心收益）、CSS 歸屬、遷移策略
3. **start.md 凍結規則**：landing.html 不再新增頁面 template / modal / 大段 JS；新頁面一律走新架構
4. **aside 單一化（使用者裁決選 b 單一事實來源）**：
   - `preview/partials/aside.html`（新）：全站唯一 aside，668 行自 landing.html 抽出，純 markup
   - landing.html 改 `asideMount` + **sync XHR 同步注入**：sidebar 綁定散佈於 load-time 多個 IIFE，async 注入會全部落空；同步注入讓主 script 一行不動。代價 = console 1 筆 deprecation warning（已知且接受，記錄於注入點註解）
   - `preview/js/partials.js`（新）：新頁面用的 async `loadPartials()`（掃 `[data-partial]`、標 aside active 態依 `body[data-page]`、dispatch `partials:loaded`）
5. landing.html 11583 -> 10931 行（-652），且從此凍結

### 回歸驗證（全過）

aside 注入（26 選單項目）、選單導航（開訂單處理）、accordion 收合、收合全部、mobile drawer 開關、backdrop 關閉；JS parse check、雙 lint。console 無錯誤（既有 CDN warning + 已知 1 筆 deprecation）。

### lint 加強（commit 時 hook 攔截後順手修）

- aside.html 的 mobile 關閉鈕 `\u2715` glyph 改 HTML entity `&#x2715;`（source 變 ASCII、渲染完全相同，瀏覽器驗證過）
- **lint-conventions worktree 模式盲點修補**：`git diff HEAD` 不含 untracked 新檔（partials/ js/ 曾因此漏掃），改為另以 `git diff --no-index /dev/null` 產生偽 diff 一併餵入

### 未完成 / 下一步

1. **audit 剩餘中型項目**：B2 progress.md archive（本檔即將 3600 行，建議下次做）、B3 start.md 瘦身（conventions 段搬 html-conventions.md）、B4 token drift check script
2. 下一個新頁面實作時：照 page-architecture.md 骨架 + 建 `js/tailwind-config.js` + aside 選單加新頁連結（只改 partials/aside.html 一份）+ landing 舊三頁連結機制（hash 指定，屆時定義）
3. 訂單處理頁 Batch 1-6 完成，等使用者最終驗收
4. 未 push 的 commit：ee06dfb（repo hygiene）+ 本輪

---

## Session 76 交接 (2026-07-03)

### 任務: repo 結構體檢（Fable agent audit）+ 5 項止血執行

使用者要求用最強模型對檔案結構與工作流做全面體檢（好壞都分析）。audit 完整報告已在對話中呈給使用者；本輪執行了報告中 5 項「極小/小成本」止血項，中型項目待逐項確認。

### Audit 結論摘要（完整版本見對話記錄）

- 做得好（保留）：規則帶 why、lint 落地機制、token strict mirror、Figma MCP 陷阱知識庫、交接格式、components/ 平鋪
- 兩顆定時炸彈：landing.html 單檔增量（11583 行，91 個 modal id，orderEdit_ clone 那套工程的根因）、自稱權威的過期檔案（design-system/MASTER.md 為最，navy/gold 調色盤與實際品牌橘完全不符）
- 明確不動：landing.html 存量、start.md 單檔形態、progress.md 格式、components/ 平鋪、tokens typo 鏡像、memory 與 start.md 的雙層重複

### 本輪執行（5 項止血）

1. **刪 `design-system/`**（錯誤調色盤污染源，agent 搜 "color palette" 會撞到且自稱權威）
2. **刪 12 個未使用 agent-tool 目錄**（.agent/.cursor/.codex/.windsurf 等 + .github/prompts/ui-ux-pro-max，共 400+ 檔 ~7.6MB，skill installer 灑的複本；.claude/ 保留；.gitignore 加防再生清單）
3. **stale 檔標注**：preview/room-booking.html 標 superseded-by landing.html#tpl-room-booking；sections/ 9 檔 + layouts/ 2 檔標 frozen-reference
4. **order* 命名陷阱檔頭警告**（order.md = dashboard widget / order-status.md = 房間預定 [E] / order-status-pill.md = 訂單處理 pill，三檔互相指路）
5. **AGENTS.md 降為純指標**（15 行，重複段移除，規則本體只在 start.md）

配套：start.md 三處同步（專案結構樹標 frozen + 補列 specs/pages 與 html-conventions.md、檔案地圖重排 specs/pages 升第 4 順位、分層順序宣告 5 層改現行 3 層 tokens -> icons -> components -> specs/pages -> 實作）

### 未完成 / 下一步（audit 中型項目，待使用者逐項確認）

1. **B1（最重要）**：立規則「新頁面不再進 landing.html」+ 新頁獨立 html + fetch 共用 partial 方案（要先實測 Tailwind Play CDN 對 runtime 注入內容的 class 掃描）
2. **B2**：progress.md archive 機制（留最近 10-15 session，其餘搬 specs/progress-archive-*.md）
3. **B3**：start.md 瘦身（元件 conventions + UI patterns 段搬 specs/html-conventions.md，目標 ~250 行；CLAUDE.md 每 session 自動載入後其長度是固定 context 稅）
4. **B4**：token mirror drift check script（比對 tokens.md hex 與 base.css 值，掛進 lint-conventions）
5. 訂單處理頁 Batch 1-6 全部完成，等使用者最終驗收（延續 Session 75）

---

## Session 75 交接 (2026-07-03)

### 任務: 最近兩個 commit code review 後修正 + 規範補強 + commit/push

使用者要求檢查最近兩個 commit 後，將需要寫入規範的內容寫入規範，並交接、commit、push。本輪針對 review finding 做修正與 guardrail 補強。

### 本輪處理

1. `preview/landing.html`:
   - `initCalendar(root)` 改為 root-scoped 查找，不再用 `document.getElementById` 抓 hidden `tpl-room-booking` 或已建立的 `modalOrderEditBackdrop` clone。
   - 無 calendar 的 subpage 直接 skip，避免切到「訂單處理」時誤初始化 hidden template。
   - Backdrop click / Escape 改 delegated 通用機制，自動涵蓋 `modalOrderEditBackdrop` 與 runtime `orderEdit_` 副本。
   - `modalMemberDataBackdrop` / `modalChangeContractCompanyBackdrop` 加 `data-no-dismiss`，保留原本不吃 backdrop/Escape 關閉的既有行為；cloneNode 產生的 `orderEdit_` 副本也繼承此行為。
   - 訂單處理篩選面板 3 欄斷點從 `lg` 改 `xl`，避免 1024-1279 + sidebar 時 col3 國籍 radio nowrap 爆版。
2. `components/order-edit-modal.md`:
   - 補記 `initCalendar(root)` root-scoped 行為、modal delegated 關閉規則、`data-no-dismiss` 例外。
3. `specs/pages/order-processing.md`:
   - 補記篩選面板斷點裁決：`>=1280px` 才進 3 欄，`<1280px` 用單欄 + accordion；下拉選單 dropdown/offcanvas 仍維持 1024。
   - 補關閉 desktop 篩選面板外殼漸層待確認：PNG 取樣為純色 `#f6fafd`。
4. `start.md` / scripts:
   - Lint 自檢規則補 `./scripts/lint-conventions.sh`。
   - 新增「新規則寫入時的兩個必做動作」：回溯 audit 與機器可判定性評估。
   - 新增 `scripts/lint-conventions.py` / `.sh`，pre-commit hook 同步跑 conventions lint，攔新增行的 decorative Unicode、mobile-unsafe min-width、HTML arbitrary hex、landing.css hardcoded hex。
5. ASCII cleanup:
   - 清掉本輪 touched/new lines 的 decorative arrows / box-drawing / em dash。
   - `components/order-status-pill.md` 的 badge 順序改用 `->`。

### 驗證

- `git diff --check`
- `./scripts/lint-fonts.sh`
- `./scripts/lint-conventions.sh`
- HTML script parse check
- 待 commit 前再跑 staged hook 等同檢查

### 更正 + Batch 6 完成記錄（本 entry 初版誤記 Batch 6 為待辦，實際已完成）

**Batch 6 RWD 收尾已完成**（在 review 修正之前做的，xl 斷點與 body min-width 移除都是 Batch 6 的產出）：

1. 掃描 6 個 viewport（360/375/768/1024/1280/1440），檢查橫向溢出 + 版面模式 + 修改 modal，全數通過
2. **移除 base.css 全域 `body { min-width: 375px }`**（2026-04-14 initial commit 就存在，與 start.md RWD 規則矛盾；360 裝置全站右緣裁切 15px。使用者裁決移除；已回歸抽查房間預定頁 360 表現正常）
3. **篩選面板 3 欄斷點 lg -> xl**（1024-1279 帶 sidebar 時 col3 塞不下國籍 nowrap 列；Figma 未定義此區間，使用者裁決 1280 才進 3 欄）- 即上方「本輪處理」第 1 點所列同一件事，起因是 Batch 6 掃描發現
4. QA 截圖 9 張存 `specs/qa-screenshots/session-74/`（目錄 gitignored，本地驗收材料）
5. 各寬度結果：360/375/768 accordion + bottom sheet + modal 全螢幕（768 視窗化 744px）；1024 accordion + dropdown；1280/1440 三欄 + dropdown，modal 1192px 內部無溢出

**訂單處理頁 Batch 1-6 全部完成**（self-tested + code review 修正完畢，等使用者最終驗收）。

### 下一步

1. 訂單處理頁無剩餘批次；等使用者驗收回饋
2. `CLAUDE.md`（使用者新建，`@start.md` import）下個 session 生效，start.md 將自動載入 context

---

## Session 74 交接 (2026-07-03)

### 任務: 訂單處理 Batch 5（modal 接線 + 訂單修改 modal）+ icons 補充 + tooltip 修正

延續 Session 73（同日）。進度：**Batch 5 完成（self-tested，使用者已逐項回饋修正），僅剩 Batch 6 RWD 系統性收尾**。

### 本輪產出

1. **Batch 5a 下拉選單接線**（preview/landing.html）：
   - 「訂單」-> 既有 `modalOrderSummaryBackdrop`（demo 固定 unpaid variant，實際對應留給後端）；「簡訊」-> 既有 `modalSmsBackdrop`；連結/複製/取消維持只收合（後端）
   - 踩雷：op-row-menu 原本的 `stopPropagation` 擋掉 document 層 delegated handler，改為 closest 檢查式 outside-close
2. **Batch 5b 訂單修改 modal**（`modalOrderEditBackdrop`）：
   - 外殼靜態 HTML（header 訂單修改+還原+close / footer 取消/確定，desktop 1192 / <768 全螢幕）
   - body = `buildOrderEditModalBody()` runtime clone tpl-room-booking [A]-[E]（避免 ~2900 行靜態複製），clone 後 `initSubPageBehaviors(body)` 重綁（已曝露到 window）
   - 差異調整：[A] 標題改「庫存」+ 程式切庫存模式、移除 customer-toggle、cart 頂部插訂單編號列、[D] 插「還原」
3. **[A] 庫存模式鎖定**（使用者指正 spec 初讀「無差異」是錯的）：
   - 無 空房/庫存 切換、無 Excel、無棟別 chips、只剩 訂/餘/保 + 庫存表；月曆按鈕觸發 bottom offcanvas
   - mode toggle/Excel/chips 用 CSS 隱藏（`[data-order-edit-body]` scope）**不可移除 DOM**：共用 calendar JS 用 document.getElementById 解析，移除會 fallback 到 template 副本、污染日後開的房間預定頁
4. **巢狀 modal 權重 + 實例隔離**（使用者要求，已寫入 start.md 規則 + memory）：
   - 子 modal 一律 `orderEdit_` 前綴副本（`ensureOrderEditModalClone()`），不共用房間預定 instance；z 用新 token `--z-modal-layer-2: 65`
   - 配套修正：closeModal/offcanvas close 疊層感知（下層還開著就維持 body scroll 鎖定）、`.modal-close-btn` 改 delegated、動態渲染 modal（加購/房型編輯）clone 前先 reset/render、per-ID modal-box CSS 補 `#orderEdit_` selector（9 條）
   - 庫存月曆 offcanvas 也有專屬副本 `orderEditInvCalendarOffcanvas`，calendar JS 依 grid scope 自動分流
5. **icons 補充**（使用者以 figma-go 提供 Icons master frame）：
   - 匯出 7 顆真缺口：`triangle`（狀態 pill 正牌三角，已替換 arrow-down-drop 代用品）、`order`/`link`/`file-work-history`/`phone`/`yes`/`thumbtack`（**先入庫存著不接**，2026-07-03 使用者確認）
   - `specs/icons.md` 補 8 列（含前批漏登記的 `restore`）
6. **tooltip 視窗夾取**：兩顆 info tooltip 開啟時量測平移、不超出螢幕（手機版 390 驗證）；基準用 `documentElement.clientWidth`（innerWidth 在 mobile 會跟 content overflow 浮動，不可靠）
7. **規則/memory**：start.md 新增「Tooltip 視窗自適應」「Modal 開子 modal」兩段強制規則；memory 新增 `feedback_tooltip_clamp_viewport`、`feedback_nested_modal_scoping`
8. 已補驗關閉：desktop 篩選面板外殼 = 純色 `#f6fafd` 無漸層（PNG 網格取樣）；日期狀態 tooltip 文案 pass 歸後端

### 未完成 / 下一步

1. **Batch 6：RWD 系統性收尾** - 多 viewport 掃 訂單處理 全頁（含修改 modal 內各區塊），唯一剩餘工作
2. 驗收：全部 self-tested，等使用者最終過一輪
3. 已知 demo 限制（記錄於 order-edit-modal.md）：orderEdit_ 副本不接原 id-based 互動 JS（視覺示意 + 原生表單）；訂單明細 unpaid variant 對應留給後端

---

## Session 73 交接 (2026-07-03)

### 任務: 訂單處理 頁面分批實作 Batch 1-4（篩選面板 / tabs+快篩 / 表格+pill / footer 統計）

延續 Session 72 的 spec，開始 HTML 實作。進度：**Batch 1-4 完成（self-tested，待使用者最終驗收），Batch 5-6 未動**。

### 本輪產出

1. `preview/landing.html`：
   - `PAGE_TEMPLATES` 新增 `訂單處理: "tpl-order-processing"`，新 template 塊（搜 `tpl-order-processing`）
   - Batch 1 篩選面板：desktop 3 欄（col1 固定 340px + col2/col3 均分）、mobile(<1024) 收合為「更多條件」accordion（`.op-accordion-gradient` 漸層外殼）；日期狀態 tooltip、國籍外籍連動國家 select（沿用 `.nation-group` 既有機制）
   - Batch 2 tabs+快篩：狀態 tabs 沿用 `.member-data-filter-tab`；快篩 5 顆沿用 `.rb-filter-tab`（circle-selected-yellow 黃底選中），預設不選中、單選、再點取消選取，緊接 tabs 右邊不用 justify-between
   - Batch 3 表格：`.op-table` 全欄位垂直水平置中、9 欄 6 列（含 5-1/5-2 rowspan 子訂單，5-1 不畫底線）、狀態 pill（`.op-status-pill`）+ 下拉選單（`.op-row-menu`，desktop dropdown / mobile offcanvas 同一份 DOM breakpoint 切換）、訂單狀態圖例 tooltip、入住人欄姓名純文字不帶 link（訂購人欄才有 link）
   - Batch 4 footer 統計列：統計 label + 2間/3夜 chips + 加購/房價/總計，三組間大間距 `lg:gap-x-24`
   - JS 皆掛在 `initSubPageBehaviors` 內：quick-filter 切換、op tabs、tooltip click/outside、row menu 開關定位、專案 toggle 文案
2. `preview/assets/css/landing.css`：新增 `.op-table`/`.op-status-pill`/`.op-status-dot`/`.op-badge`/`.op-badge-source`/`.op-row-menu` 系列 + `.op-accordion-gradient`；`.rb-filter-tab` 補 inline-flex 置中（共用 class，棟別 chips 一併受惠）
3. `components/order-status-pill.md`：補 get_node 覆核後的精確數值（pill radius 44/padding 4 10/邊框 Neutral-50；兩種 badge 完整對照表）、badge 垂直順序（pill -> 來源 -> 分類）、rowspan 不畫分隔線規則、來源 badge 讀取陷阱
4. `specs/pages/order-processing.md`：footer 段補精確規格 + 隱藏 timestamp 圖層警告
5. `start.md`：「漸層限制」段擴充為「JSON 不等於視覺」限制（新增 fills key 消失/單邊 stroke/隱藏圖層 3 個模式）；新增「實作前每元素三步驟門檻」（渲染截圖 ground truth -> 查 notes 未驗證標記 -> JSON 只信結構文字）
6. Memory 新增：`feedback_figma_hidden_layer_serialized`（隱藏圖層照樣序列化）、`feedback_implement_screenshot_first`（三步驟門檻）

### 本輪踩雷記錄（全部是使用者發現後修正，檢討見 start.md 新規則）

- 快篩 chips 圓角憑感覺寫 6px，實際是 circle-selected-yellow pill（28px、黃底選中態）
- 表格欄位對齊猜左對齊，實際全部置中；badge 順序（pill/來源/分類垂直排列）也漏了
- 來源 badge（Booking/Agoda）：`strokes:["#f28b45"]` 實際是**只有左邊 2px**（SVG 其餘三邊是零面積退化路徑）；fills key 整個消失，實際是白->Brand-200 對角漸層。SVG export 覆核抓出
- footer 把 Figma **隱藏圖層** timestamp 做出來（get_node 對 visible:false 節點照樣序列化無標記）；PNG 渲染圖比對抓出
- 分類 badge 字級是 16px 不是 12px；來源 badge radius 6 不是全圓角

### 未完成 / 下一步

1. **Batch 5：modal 接線**（最大塊）- 下拉選單「訂單」「簡訊」接既有 `modalOrderSummaryBackdrop`/`modalSmsBackdrop`；「修改」新建訂單修改大 modal（spec: `components/order-edit-modal.md`，只做一般會員版）
2. **Batch 6：RWD 收尾** - 系統性多 viewport 掃全頁
3. ~~待補驗：desktop 篩選面板外殼是否有漸層~~ -> **已補驗（2026-07-03）**：PNG 渲染圖 25x25 網格取樣，背景均勻純色 `#f6fafd` 無漸層，現有實作正確（外殼 = 查詢區大圓角容器，Figma node `shirnk-model-1` 2026:64181）
4. ~~日期狀態 tooltip 9 條說明文字~~ -> **pass（2026-07-03 使用者確認）**：佔位文案維持現狀，真實文案將來由後端實作，前端不再追蹤
5. Batch 5 開工前先對本批元素過 start.md 新的三步驟門檻

---

## Session 72 交接 (2026-07-03)

### 任務: 訂單處理作業 > 訂單處理 頁面 - 完整 figma-go 讀取 + Spec checkpoint + 正式 spec

新頁面（訂單處理作業 > 訂單處理），使用者以 `figma-go` 分兩批（desktop 7 輪 + mobile~tablet 4 輪 + component cross-check 1 輪，共 12 輪）讀完，接著逐項 Spec checkpoint 討論，最後寫入正式 spec。**本輪只寫 spec，尚未動 HTML 實作**。

### 本輪產出

1. `specs/order-processing-reading-notes.md`（新檔）：12 輪 figma-go 讀取的原始工作記錄 + Spec checkpoint 討論後的確認事項，spec 撰寫依據
2. `specs/pages/order-processing.md`（新檔）：頁面主規格 - 頂部工具列、篩選面板（desktop 3 欄 / mobile accordion）、tabs + 快篩 button、9 欄表格、footer 統計、2 個 tooltip、RWD 差異、未定義清單
3. `components/order-status-pill.md`（新檔）：表格「訂單編號」欄狀態 pill + 下拉選單元件，含 `Color/Dots/*` 狀態色點對照表、6 個選單項目行為、desktop dropdown vs mobile offcanvas 差異、表格列編號規則（`n` vs `n-1`/`n-2` 子訂單）
4. `components/order-edit-modal.md`（新檔）：「訂單修改」大 modal，大量 cross-reference 既有 `room-booking.md`/`order-condition.md`/`order-status.md`/`order-data.md`，只記錄 modal 外殼跟會員版本差異
5. `components/modal.md`（修改）：新增 `state=order edit` variant 條目；在既有 `state=order summary` / `state=sms / order summary` 段補註「訂單處理頁下拉選單也會開啟這兩個既有 modal」的新觸發入口；簡訊 modal 補「訂單內容 14 欄位跟 textarea 不連動」的確認細節
6. `specs/assets/tokens.md` / `specs/assets/figma-variables.json` / `preview/assets/css/base.css`：新增 `Color/Dots/*` 5 個 token（狀態圓點色，對應訂單處理頁的 5 種訂單狀態），修正 `cart-date`/`cart-time` 舊快取的錯誤 raw hex（tokens.md 本來就是對的，只同步 json 快取）
7. `scripts/figma-read.py`（新檔）+ `scripts/README.md`：讀取大型 `get_selection`/`get_screenshot` tool-result 檔案的固定工具（tree/texts/node/screenshot/crop/pixel 6 個子指令），取代逐次手寫 python heredoc
8. `.claude/settings.json`（新檔，非 local）：`/fewer-permission-prompts` 產出，放行 `mcp__figma-mcp-go__get_selection` 跟 `Bash(python3 scripts/figma-read.py *)`

### 關鍵發現（避免下一輪重新踩雷）

- **這頁大量重用既有元件，不是全新頁面**：
  - 「訂單修改」modal 幾乎整個是房間預訂頁 [A]-[E] 搬進 modal（`room-booking.md`/`order-condition.md`/`order-status.md`/`order-data.md`）
  - 「訂單明細」「簡訊」modal 是既有 `modalOrderSummaryBackdrop`/`modalSmsBackdrop`，訂單處理頁只是多一個開啟入口，不是新 modal
  - 頂部分頁 tab chip 是既有 `#pageTabsInline` 機制，非新功能
- **檔名陷阱**：`components/order-status.md` 內容其實是房間預訂頁 [E] 正式單與候補單，跟訂單狀態無關；`components/order.md` 才是首頁訂單快覽小工具。本輪初次讀取時記錯了，Spec checkpoint 階段才發現並修正（`order-processing-reading-notes.md` 已加註警示）
- **Figma frame 標題不可信**：mobile~tablet 有兩個 frame 標題（「more conditions not collapsed」/「collapsed」）跟畫面實際 accordion 展開/收起狀態剛好寫反，已在 spec 註明「一律以畫面實際 icon 為準，不採 frame 標題字面」
- **佔位文字慣例**：新增 memory `feedback_figma_placeholder_text_conventions`，統整 `xxoo`/`icons/cursor`/標題括號/重複佔位文案 4 種讀取時要排除的非正式內容
- **Color/Dots token**：`validated`/`unpaid`/`overdues`/`cancel`/`alternative` 5 個 alias token，對應表格狀態 dot；tooltip 圖例中文 vs 篩選 tabs 中文用語不同但**使用者已確認差異是允許的**，不強制統一

### 業務規則確認（後續實作/後端交接要點）

- 表格編號 `n` = 獨立列；`n-1`/`n-2` = 同一筆訂單的子訂單分列顯示
- Tabs 篩選、次要 badge 分類歸屬、下拉選單「連結/複製/取消」行為 = 全部後端邏輯，前端這階段只要視覺示意給足、照 Figma layout 直出 HTML
- 訂單修改 modal 會員版本（一般/合約）由訂單生成時的客戶類型決定，非 modal 內可切換；**這階段 HTML 只做一般會員版**，合約會員版差異已寫入 `order-edit-modal.md` 供後端工程師參考
- Modal header「還原」= 整頁還原；[D] 訂房資料內建「還原」= 只還原該區塊

### 下一步

- 尚未實作 HTML（`preview/order-processing.html` 或併入 `landing.html`，命名待下一輪確認）
- `order-edit-modal.md` / `order-status-pill.md` 內各有列「未定義 / 待補」清單（合約公司三控制項是否合併邊框、function icons cross-check、側欄收合 icon 命名等），下一輪開工前可以先去 Figma 補這些技術細節
- 尚未 commit（本輪只完成 spec，使用者未說「commit & push」）

---

## Session 71 交接 (2026-06-03)

### 任務: 清理 startup rules 與現行內容衝突

使用者要求繼續處理 `start.md` / `AGENTS.md` / `progress.md` 內有規範, 但與現行內容互相衝突的部分。本輪聚焦規範源頭與本輪 touched files, 不全量改寫歷史交接。

### 本輪改動

- `start.md`: 將專案結構 tree、箭頭 glyph、warning / no-go 裝飾符號、dimension symbol、section sign 等改成 ASCII 寫法。
- `start.md`: 補明確規則: 既有歷史交接內容可保留到被編輯時再清理; 新增或本輪修改的 `.md` / spec / code comment 必須符合 ASCII-only。
- `start.md`: 將「不自稱完成」限定為 chat / final / 驗證報告中的狀態斷言; progress 交接欄位改用「本輪改動」或「本次處理」, 避免和模板中的「已完成」互相衝突。
- `specs/progress.md`: 最新交接欄位由「已完成」改為「本輪改動」; 檔案標題 dash 改 ASCII。
- `components/member-data-modal.md` / `components/title.md` / `preview/assets/css/base.css` / `preview/assets/css/landing.css` / `specs/assets/tokens.md`: 清理本輪 touched content 中的裝飾符號與 box-drawing 形式。

### 驗證

- `rg` 掃描本輪 touched files 的 arrow glyph / check mark / warning sign / box-drawing / dimension symbol / pencil emoji: exit 1, 沒有命中。
- `./scripts/lint-fonts.sh` exit 0。
- `git diff --check` exit 0。

### 注意

- `specs/progress.md` 歷史段落仍保留舊符號; 依 `start.md` 新規則, archival history 等被編輯時再清。
- 本輪尚未 commit。

---

## Session 70 交接 (2026-06-03)

### 任務: 盤點使用者貼上的 Figma Variables JSON 並補齊 token mirror

使用者說「先處理 figma variants」，附件實際內容是 Figma Variables JSON。按 Variables 處理, 盤點 Color / Spacing / Radius 後補齊 `tokens.md` 與 `base.css` strict mirror, 未讀 Figma selection, 未改 UI layout。

### 本輪改動

- `specs/assets/tokens.md`: 上次同步日期改為 2026-06-03 局部同步; `Color/Accent/cart-date` / `cart-time` 對齊附件 export; 新增 `Color/Accent/cart-button-active` (`#00C8B3`) 與 `Color/Accent/calc-result-background` (`#2178CF` -> MenuItem/Default); 新增 `Spacing/10` / `17` / `19` / `26`; 移除 `#00c8b3` 未解問題段。
- `preview/assets/css/base.css`: 補 `--color-accent-cart-button-active` / `--color-accent-calc-result-background`; 補 `--spacing-10` / `--spacing-17` / `--spacing-19` / `--spacing-26`; 新增 exact mirror `--color-brand-brand-*` 與 `--color-chart-purplered`, 舊 `--color-brand-*` / `--color-chart-purple-red` 保留為相容引用。
- `preview/assets/css/landing.css`: `.order-channel-chip--corp` 改用 `var(--color-accent-cart-button-active)`, 不再直接寫 `#00c8b3`。
- `components/member-data-modal.md` / `components/title.md`: 將「企」chip 與 Title pill active green 補上 `Color/Accent/cart-button-active`; calcY badge 背景補上 `Color/Accent/calc-result-background`。

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `git diff --check` exit 0
- `rg` 確認 `landing.css` 只使用 `var(--color-accent-cart-button-active)`, raw `#00c8b3` 只留在 token definition / spec 對照值。
- `jq` + shell coverage check: 附件 JSON 內全部 Color / Spacing / Radius path 轉成 strict CSS variable name 後, `preview/assets/css/base.css` 沒有缺漏。

### 注意

- 本輪尚未 commit。
- 這次沒有處理 component variants 的 Figma selection; 若使用者真的是要整理 component variants, 下一步需用 figma-go 讀目前 selection, 再走 Read -> Spec checkpoint -> Write flow。

---

## Session 69 交接（2026-06-01）

### 任務：會員資料 modal 對 Figma 0601 微調 + [A] 庫存表 mode 隱藏底部按鈕

兩波請求，2 commits：

#### Commit 1：會員資料 modal 0601 sync

使用者貼 Figma 兩個 Order condition variants 後逐項點問題：

| 改動 | 位置 | 內容 |
|---|---|---|
| 1 | Card c 類別 row | radio (實體/一般) -> 三段靜態文字 `一般 / 實體 / B2B`；註：未來會改成擇一 select/radio，本版先放假文字 |
| 2 | Card d 合約 panel | 9 欄位（在 備註 之後補 `地址 / 王大頭`，從 8 -> 9） |
| 3 | Card a row 順序 | 行動電話 與 生日 互換 → 帳號/密碼/名稱/證號/**行動電話/生日**/性別/會員備註 |
| 4 | 訂房記錄 filter tab active 樣式 | 原 `text-decoration: underline` 改為 `border-bottom: 1px solid var(--color-brand-400)`（#f28b45）；first attempt 寫成四邊框被使用者抓出，改成 border-bottom only |

#### Commit 2：[A] 空房與庫存查詢 - 庫存表 mode 隱藏底部按鈕

- 「清除 / 加入訂單」按鈕列現在只在「空房查詢」mode 顯示；切到「庫存表」mode 整列隱藏
- 實作：button 容器加 `id="rbAllocActions"`、`setMode()` 加 `allocActions.classList.toggle("hidden", mode === "inventory")`（沿用 `rangeRow` 相同 pattern）
- spec：`specs/pages/room-booking.md` Frame 11 row + 0527 section 都註明「僅空房查詢 mode 顯示」

#### Commit 3：會員資料 modal footer close 行為 swap

- 使用者指出舊版 `清除` 掛 `modal-close-btn`、`修改` noop，行為相反。我先回報確認，使用者一字「修」確認後修
- 改為：`修改` 掛 `modal-close-btn` + `data-modal="modalMemberDataBackdrop"`（click = 關 modal）；`清除` 移除 close 屬性 → 暫 noop（待後端串接欄位 reset）
- `components/member-data-modal.md` Footer section 補行為說明 + 行為清單第 6/7 點對齊

#### Commit 4：[E] 正式單與候補單 內白卡高度對齊 [C]

- bug：[C] 訂單條件 + [E] 正式單與候補單 在 xl grid 並排，CSS grid 預設 stretch 兩邊外框（灰底）同高，但 [E] 內白底 `.rb-accordion-content` 只 size 到內容（訂單類型 row + 「未設定」200px 占位區），下方露出灰底跟左側 [C] 不齊
- fix：[E] 外框加 `flex flex-col`、內白卡加 `flex-1` → 白卡吃滿剩餘高度貼齊 [C]。collapsed 態靠 `.rb-hidden { display: none }` 蓋過 flex 行為，不衝突
- 流程：使用者要求先回報再修，照 [[feedback_completion_user_confirms]] flow；回報後一字「修」核可
- spec：`specs/pages/room-booking.md` [E] section 補「height 對齊規則 (2026-06-01)」一條

### 反省

- Figma `get_node` 回傳 `strokes:["#hex"]` 我直接判定四邊框，使用者糾正才知 chip/tab 常用 single-side underline。已寫入新 memory `feedback_figma_stroke_can_be_single_side` 並更新 MEMORY.md index
- 規格本來標「active 視覺帶藍底/特殊樣式」是 0528 還沒對齊就先寫的猜測，這次對位後已改寫實際樣式
- `components/member-data-modal.md` 同步更新：類別 cell、合約 panel 欄位數、Frame 412 a 順序、Filter tab 列、移除「Filter tab default active 未確認」這條 open question

### Post-push 待 user 驗收
- preview/landing.html 開 會員資料 modal 視覺確認 4 項
- [A] 切庫存表 mode → 確認 數量分配 row 與 清除/加入訂單 按鈕都消失；切回空房查詢 → 兩列重現

---

## Session 68 交接（2026-05-27 to 2026-05-28）

### 任務：庫存表 0527 重做 / bulletin tab focus 修 / 0527 spec sync / Data exists button + 會員資料 modal

5 個 commit，全部 push 到 `origin/main`：

| commit | 範圍 |
|---|---|
| `0042a5a` | 庫存表 16 cols 重寫 + [D] 合約 panel 欄位順序對位 Figma 0527 |
| `116d3f1` | bulletin / administer modal mobile tap 後 sticky :hover 殘留變灰底 bug；CSS 提高 active tab `:hover` 特異度鎖死黃底 |
| `e85b0e9` | 0527 Figma reads 同步到 7 個 spec md（accordion / calendar / modal / table-inventory / room-booking / 新增 offcanvas） |
| `eb96968` | 庫存表 月曆 button + offcanvas CSS（HTML + JS 之前已接，補上 missing 樣式；先前 commit message 錯誤寫成 pre-wire，force-push 修正） |
| `633ecc5` | [D] 訂房資料 Data exists button + 會員資料 modal（含 nation-group / honorific / 會員身份 radio 連動 / 訂房記錄 accordion） |

### 已完成（按 commit 順序）

#### 1. `0042a5a` 庫存表 0527
- `#tableInventory` 從 7 cols（11-17）改為 16 cols（01-16）
- chip td L/R padding 4px（對位 Frame 130/131/132 padding）
- 週末 06/07/13/14 date+weekday row bg `bg-accent-pink` (#ffc0cb)
- 移除 legacy 中秋連假 annotation；row 3 是空白對齊
- th 代號/房型 text-center，data cells 維持靠左
- 總計 row 純彩色文字（無 chip 外框），使用者 override
- [D] 合約 panel：col 1 新增「地址」、col 2 全 relabel（交觀甲/聯絡電話一/聯絡電話二/業務聯絡人/財務聯絡人）

#### 2. `116d3f1` Bulletin/Administer tab :hover 修正
- bug：mobile tap inactive tab 後 sticky `:hover` 殘留，`hover:bg-surface-default` 蓋掉 active 的 `bg-tab-yellow`，顯示灰底（應該黃底）
- fix：CSS 加 `.bulletin-tab.bg-tab-yellow:hover / .administer-tab.bg-tab-yellow:hover { background-color: var(--color-tab-yellow); }`（特異度 0,3,1 蓋過 Tailwind hover 0,2,1）

#### 3. `e85b0e9` 0527 spec sync
- `accordion.md`：補 15 variant 清單 + `none calendar` 變體
- `calendar.md`：0527 day-count select 移除 disabled 態；空房查詢 vs 庫存表 mode 行為差異
- `modal.md`：房間編輯 modal 0527 移除 date controller 整段（高 1004 變 724）
- `table-inventory.md`：0527 row/col 翻轉，row=roomtype col=date；7 metric cols 合併
- `room-booking.md`：[A] 庫存表 mode 把 inline calendar 換成 offcanvas；小計 col 改唯讀；加購 cart 卡片三欄
- `offcanvas.md` (new)：bottom slide-in，2 條 dismiss 路徑

#### 4. `eb96968` 庫存表月曆 offcanvas CSS
- `.inv-calendar-btn`（pill r:28，hover/focus light-blue + 白 icon）
- `.inv-offcanvas` / header / close / body（bottom slide-in 250ms ease-in-out）
- HTML + JS 之前已接（landing.html:7183 button、10022 markup、4691/4935 JS），這 commit 純補樣式

#### 5. `633ecc5` Data exists button + 會員資料 modal
- 名稱 row 末端 Data exists button 44x44（icons/attached-link）；preview 階段永遠渲染 default 態，不 gate input value，等後端串接
- 會員資料 modal `#modalMemberDataBackdrop`（1180px max-width，scrollable body）
- 2x2 grid 4 sub-card：基本資料 / 聯絡+地址（nation-group） / 狀態+類別+toggle+會員等級純文字 / 會員身份 radio + 合約 panel
- 訂房記錄 accordion：title 含 badge + 金額；3 Title pill chips（全部 yellow / 旅宿e管家 with pin / 分館 2）；filter tabs 底線 + semibold active；11 col table（#/來源+pin/訂單編號+chip badges/...）；pagination
- chip 列 + filter 列改 `flex-nowrap overflow-x-auto` 橫向 scroll
- sub modal「更換合約公司」320x169（公司名稱 edit button 觸發）
- JS：honorific 跟性別 radio、nation-group 臺灣/外籍、會員身份 radio toggle panel、Title pill click 切 selected、filter tab click 切 active

### 注意 / 留下的 腦補（使用者 2026-05-28 指出待修）

`633ecc5` 內幾處沒嚴格對位 Figma：

| 項 | 我寫的 | Figma 實際 |
|---|---|---|
| 1 | sub modal 內容用 `<input>` + `<select>` | Figma slot 內 2 個 Texts，沒明說是 input/select，未深入讀 |
| 2 | 公司名稱 edit button `bg-white` | Frame 577 fill `#fdebd7` 淺橘 |
| 3 | Pagination 自己拼 button + 黃底 active | Figma 是「Pagination」component instance，沒對位 |
| 4 | Filter tab padding `4px 12px` | Figma active 48x30 / inactive 64x30 規格 |
| 5 | Modal 整體用 modal-box 白底 | Order condition 外框 fill `#f6fafd` 淺藍 |
| 6 | 訂房記錄 accordion bg `bg-surface-hover` | Accordion fill `#f6fafd`，token 對位未驗 |

下個 session 開工要做：（1）回 Figma 重讀 sub modal 詳細（2）edit button bg 改橘（3-6）按使用者選的優先順序修

### 重要決定 / 反省

- **memory 規則漏遵守**：5 個 commit 全沒更新 progress.md，使用者指出後補。下次每個 commit 後立即寫
- **腦補習慣再次發生**：使用者特別說「我都給你讀完整 figma 了還腦補」。下次拿到完整 Figma frame 就深入讀完每個元件規格，不要憑感覺拼樣式
- **ASCII only 違規**：本 session 大量使用 arrow / check mark / em-dash / multiplication sign 等 Unicode，違反 start.md L5-14 與 AGENTS.md L28-32。此段已 clean，但下次源頭就要用 ASCII

### Post-push 清理（2026-05-28 同 session 追加，未 push commit）

使用者點出「自我檢查 start.md / AGENTS.md 還有什麼該做沒做」後做的 8 個 task：

1. **progress.md ASCII clean** — Session 68 段內 arrow / check / em-dash / multiplication 全清成 ASCII（legacy 段保留）
2. **抽 hex 到 tokens.md + base.css** — landing.css 內 `#34c759 / #f7d275 / #bbf7d0 / #6d6d6d / rgba(60,60,67,0.3)` 全部改成 `var()` 引用既有 token；新增 `--color-switch-off-track` 到 base.css；inline style chip 改 CSS class `.order-channel-chip--add/web/corp`；tokens.md 補「系統色」段（iOS toggle）+「未解問題」段（`#00c8b3` 未進 Figma Variables）
3. **start.md 補新規則段** — 新增「commit & push flow（強制順序）」段、「流程守則（防腦補與品管）」段（不自稱完成 / Figma 必驗 styles / selection 防漏三動作 / variant 先讀 parent / 橫向 scroll 不加 fade / QA 截圖 session 資料夾）、「元件 conventions（跨頁通用）」段（px-5 / pill chip / chip 黃藍 / lock toggle / locked baseline / checkbox 三色）、「可復用 UI patterns（持續累積）」段（toggle switch / pill chip / filter tab underline / modal IIFE delegation）
4. **lint-fonts.sh** — exit 0
5. **6 個腦補回 Figma 對位修正**：
   - sub modal「更換合約公司」改 merged input-group 並排（Input 127w + Select inline，共邊框）
   - 公司名稱 edit button bg 改 `var(--color-brand-100)` peach（移除 hover:bg-surface-default border）
   - Pagination 改 7 cell merged group：← / 1 / 2(灰 active `var(--color-neutral-300)`) / ... / 4 / 5 / →；移除 inline style，用 `.member-data-pagination-page--active` class
   - Filter tab padding 改 `4px 8px`（對位 Figma Frame 607 30h 規格）
   - Modal box bg 改 `var(--color-neutral-75)` (#f6fafd) + 20px padding；新增 `.member-data-inner-card` 包 header/body/footer（white bg + r:12）
   - Accordion bg `bg-surface-hover` (`var(--color-modal-hover)` -> `var(--color-neutral-75)` #f6fafd) token 對位 verified
6. **page-specific memory 寫進 spec md**：room-booking.md 內客戶 toggle 連動 / 橘字三件套 / honorific 規則全部展開內文（不再用 `[[memory]]` 引用）；order-data.md honorific row 補完整 spec
7. **新增 memory** `feedback_commit_push_handoff_first` — commit & push keyword 先交接再 push 強制 flow
8. **`#00c8b3`（企 badge / Title pill active）**：未進 Figma Variables，CSS 暫保留 hex 並標註，tokens.md「未解問題」段已記

### Post-push 待 user 驗收
- v4 修正後 modal 各部分：top form / 會員身份 / 訂房記錄 / sub modal 截圖在 `specs/qa-screenshots/`

---

## Session 67 交接（2026-05-26）

### 任務：加購 modal — 購物車明細解重複 + cart snapshot ledger + 補齊分類產品

使用者以 `figma-go` 指定 Figma node：
- node `I1332:28485;73:678;1332:28775`，name `Frame 516`（購物車明細區塊：早餐 x4 / 機票 x2 / 會議服務 x6 / 嬰兒用品 x1 / 總價）

### 三項調整

1. **購物車明細不可與上方購物車卡片重複**：modal 下方的 `data-purchase-cart-details` 還原為原本簡單 row（`name | x qty | amount`），上方 `data-purchase-cart-cards` 仍走 `purchaseAddonCartCardHtml` 大卡片 template。`cardsHtml` 不再寫回 details。
2. **分類至少一個產品**：原本只有 dining x2 + tailetries x1 = 3 個產品覆蓋 3 個 category；補齊 tickets / coffee / tool / bed / promotion / wellness / gift / flight / service 各 1 個產品（`defaultQuantity: 0`），共 12 個產品 11 個分類。
3. **calendar 日期與 cart 卡片解綁**：原本 `getPurchaseItemState(product).date = ds` 會同步動到右側 cart card。改為 cart snapshot ledger：
   - state 拆 `editor`（per-product draft）+ `cart`（snapshot array）。
   - `+` 按鈕：找 `(productId + editor.date)` line 累加 qty；找不到就 snapshot editor 全欄位生新 line。
   - `-` 按鈕：對同 key line `qty--`；歸 0 自動移除。
   - 垃圾桶按 `lineId` 移除單一 line（不再以 productId 整批清）。
   - editor 改 date / time / cost / notice / timeEnabled 皆不動 cart 既有 snapshot。

### 已完成

1. `preview/landing.html`
   - `purchaseAddonProducts` 補 9 個產品（theme-park-ticket / fresh-coffee / projector-rental / extra-bed / early-bird / indigo-dye / pineapple-cake / airport-shuttle / meeting-room）。
   - 新 state model：`editor: {}`, `cart: []`, `nextLineId: 0`。helper：`getEditorState`、`findCartLine`、`snapshotEditorToCartLine`、`incrementCartFromEditor`、`decrementCartFromEditor`、`removeCartLineById`、`getEditorQuantity`、`resetPurchaseAddonItems`。
   - `renderPurchaseAddonProducts`：qty source 改 `getEditorQuantity(item)`，editor 狀態走 `getEditorState`。
   - `purchaseAddonCartCardHtml(line)` 簽名改吃 cart line snapshot；trash button `data-purchase-remove` 帶 `lineId`。
   - `renderPurchaseAddonCart`：iterate `purchaseAddonState.cart` snapshot 陣列；details 區塊重新內聯 row template；total 對 cart line 累加。
   - +/- / remove / time toggle / field input / change / calendar 全部 click handler 改用新 helper。

### 驗證

- chrome-devtools 互動驗證：
  - 初始 3 line（line-1 早餐 05-26 qty=2、line-2 早餐 05-26 qty=2、line-3 嬰兒用品 05-26 qty=1）。
  - 同日 + 早餐 → line-1 qty=3（無新 line）。
  - 改 editor date 為 05-30 → counter 顯示 0；+ → 生 line-4 早餐 05-30 qty=1；line-1 仍 05-26 qty=3 不動。
  - trash line-2 → 只 line-2 消失。
  - 連加 fresh-coffee / extra-bed / indigo-dye / pineapple-cake / meeting-room → cart 8 筆獨立 snapshot。
- 截圖：`specs/qa-screenshots/session-67/`（01-initial-modal / 02-after-date-change-add / 03-8-lines-mixed-dates）。
- 無 console error（只剩 Tailwind CDN warning 與一支 404 unrelated asset）。

### 注意

- 分類左側計數 chip 仍是 hardcoded `12`（line 2548 起），不跟實際 product 數，這次未動；待要求時可改 dynamic count。
- 改 cost / time / notice 不會再連動既有 cart line — 屬於 snapshot 行為的刻意設計；要修現有 line 需 trash 後重加。

---

## Session 66 交接（2026-05-21）

### 任務：統一 accordion 箭頭方向 — 展開用 down、收起用 up

使用者以 `figma-go` 指定選取，讀取 Figma Component Set：
- node `418:3834`，name `Accordion`，type `COMPONENT_SET`，page `components`
- 變體驗證：`type=accordion none collapsed`（`418:3835`，只 header 無 content）= 收起 → `icons/up`；`type=accordion collapsed`（`957:16417`，含 `flexible content`）= 展開 → `icons/down`；`type=extend N` = 展開 → `icons/down`
- ⚠️ Figma variant 命名與實際狀態相反，以「是否含 content child」判定狀態

### 規則

- 內容**展開**（顯示）→ `icons/down`（箭頭朝下）
- 內容**收起**（隱藏）→ `icons/up`（箭頭朝上）

### 已完成

1. `components/accordion.md`：icon 行改「展開用 down、收起用 up」；「收折行為」段補展開/收起對應 icon + 加 Figma 來源註記段
2. `preview/landing.html` 三類 accordion 全部對齊規則：
   - `.rb-accordion`（[A] 空房與庫存查詢 / [C] 訂單條件 / [E] 正式單與候補單）：JS（`landing.html:4205`）`opening ? "down.svg" : "up.svg"`（原為相反）；3 個 static icon 由 `up.svg` 改 `down.svg`（皆預設展開）。⚠️ [E] 的 img 縮排比 [A]/[C] 深，replace_all 漏掉、補單獨 edit
   - `.accordion-trigger`（sidebar 13 個 menu 類別）：13 個 static icon 由 `down.svg` 改 `up.svg`（皆預設收起）；CSS `.accordion-icon.open { rotate 180deg }` 不動 → 收起顯示 up、展開 rotate 180 顯示 down
   - `[data-order-summary-accordion-icon]`（訂單摘要 modal 2 個）：JS 原本就是 `expanded ? down : up`，**已符合規則，未改**

### 驗證

- chrome-devtools：3 個 rb-accordion 預設展開 `down.svg`、click 收起 `up.svg`、再 click 展開 `down.svg`
- sidebar accordion：收起 `up.svg` 無 transform、展開 `.open` + `transform: matrix(-1,0,0,-1,0,0)`（= rotate 180°）
- `./scripts/lint-fonts.sh` exit 0
- 截圖：`specs/qa-screenshots/session-66/`（rb-accordion-expanded-down.png、accordion-collapsed-up-sidebar-down.png）

### 注意

- 變更未 commit（使用者未說「commit & push」）

---

## Session 65 交接（2026-05-11）

### 任務：Figma `type=table 2 + modal` 補 Excel 匯出按鈕 + 庫存日期 details modal

使用者以 `figma-go` 指定目前選取元件，已讀取並確認 source of truth：
- Figma node：`1405:48344`
- Component name：`type=table 2 + modal`
- Size：`1019 × 514`
- Page：`components`

### 已完成

1. `components/table-inventory.md`
   - 新增 Current Figma contract（2026-05-11）
   - 記錄 toolbar 的 `Excel` + `icons/download` button（node `1405:48355`）
   - 記錄日期數字 / 星期同 column trigger 開啟 `state=date details` modal（modal node `1405:48924`）
   - 記錄 modal body 欄位：`房型 / 正式 / 未付款 / 已過期 / 候補`

2. `preview/landing.html`
   - [A] 空房與庫存查詢右側 toolbar 補 `Excel` download button
   - Excel button 只在「庫存表」mode 顯示；「空房查詢」mode 隱藏
   - Excel button 會將目前庫存表匯出為 UTF-8 BOM CSV，檔名 `庫存表.csv`
   - 庫存表日期列與星期列新增 trigger；點 `11` 或 `一` 會開 date-details modal
   - Modal 關閉行為鎖在自己的 close button；不使用 outside click / scroll / resize / Esc 關閉

3. `preview/assets/css/landing.css`
   - 新增 scoped `.inventory-*` 樣式
   - 所有新增 color / spacing / radius / font-size 使用 tokens / CSS variables
   - Modal 寬度以 Figma size `384px` 為上限，mobile 使用 `100vw - Spacing/24` clamp
   - Modal body table 預設 `overflow-x: auto`，小尺寸可水平滑動檢視內容

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- Local preview server：`http://127.0.0.1:8002/landing.html` 回 200（驗證後已關閉 server）
- Headless Chrome + DevTools Protocol 互動驗證通過：
  - 開「房間預定」→ 切「庫存表」
  - 點日期 `11` → modal 顯示，title `2026-02-11`
  - modal rows：`義大利麵房|0|0|0|0`、`香蕉船房|1|1|1|1`
  - close icon 可關閉
  - 點星期 `一` → modal 再次顯示，title `2026-02-11`
  - Excel button 觸發 1 次匯出流程

### 注意

- Figma 示意 modal header 是 `2026-04-11`，但目前 preview 庫存表標題仍是 `2026 / 02`；實作採「clicked date column」推導 title，因此 `11` 對應 `2026-02-11`。若設計要固定改成 4 月，需同步 table title 與 date column 資料。
- QA 截圖擷取步驟被拒絕，未留下新 screenshot 檔。

---

## Session 64 交接（2026-05-08 → 2026-05-09）

### 任務：iOS Safari mobile 爆版全 audit + Figma label-fluid pattern 還原 + 字體規範系統化 + Modal footer padding 統一 + Calendar dropdown 跟隨 trigger

接續 Session 63。使用者用實機 iPhone 看 GitHub Pages 部署版發現多處 mobile 爆版／視覺問題，**Chrome devtools mobile mode 看不出來**（Blink ≠ iOS WebKit、且 devtools 預設裝置寬度通常 ≥ 寫死 min-width 值）。本輪做了 4 大主題的全面修法 + 建立持續性的 lint 規範。

> **重要 cross-cutting 教訓**（已寫入記憶）：
> - `feedback_min_width_mobile_safe.md`：Figma `min-width` 不可硬寫，需 `md:` 前綴或 `@media` 包
> - `feedback_font_size_min_12px.md`：禁 `text-[10px]`、最小 12px、`scripts/lint-fonts.sh` 攔截
> - `feedback_commit_push_keyword.md`：使用者沒說「commit & push」不可自動推
> - `feedback_screenshot_session_folder.md`：QA 截圖按 session 編號分資料夾

---

### 已完成（已 commit 上線 4 顆）

#### 1. `b25f8c8` Fix mobile overflow in room booking form fields
- **Root cause**：`min-w-[280px]` 在 [C] 訂單條件 column wrapper、`.rb-cal-cell { min-width: 160px }` global、`w-[82.67px]` 兩顆 select
- 3× `min-w-[280px]` → `basis-[280px] grow`
- `.rb-cal-cell` mobile 解除 160 min（`@media (min-width: 768px)` 才設）
- 人數 selects → `flex-1 min-w-0 md:flex-none md:w-[82.67px]`
- [D] 訂房資料 地址 select/input/textarea 補 `w-full min-w-0`

#### 2. `ab38dd7` Stack 訂單條件 columns to single column on mobile and hide calendar icons
- iOS Safari 對 `basis-[280px]` 的 wrap 行為不一致（Chrome emu OK 但 iOS 仍 2 column overlap）
- columns 改 `basis-full md:basis-[280px]` 強制 mobile 1 col stack
- `.rb-cal-btn > img` mobile 隱藏、md+ 顯示（窄欄/table cell 騰出空間）

#### 3. `08fc7e0` Apply Figma label-fixed-input-fluid pattern to 訂單條件 rows
- **使用者點出 Figma 原意**：label 固定 + input/wrapper(w-full) 自適應；多 input row（人數）要包 wrapper container
- 13 個 row 全部對齊 Figma pattern：
  - 人數 row：5 children flat → label + `<div flex-1 min-w-0>[select][大][select][小]</div>`
  - 11 個 input/select/button/textarea：`flex-1` → `flex-1 min-w-0 w-full`
- iPad 768 「2+1 拼接」quirk 使用者接受不動

#### 4. `a7120f5` Add 購物車 section title to purchase add-on modal right column
- 加購 modal 右欄缺 section header 與左/中欄不對齊
- 加 `<h3>` cart icon + 「購物車」標題

---

### 已完成（pending review，未 commit）— 本次 commit 內容

#### A. iOS Safari 額外修法（4 件）
| # | 修法 | 位置 |
|---|---|---|
| 1 | `.mode-toggle` + `.mode-btn` 加 `flex-shrink: 0`（防 iOS 擠扁） | `landing.css:619-636` |
| 2 | [A] 空房與庫存查詢 accordion `mb-4` 從 header 移到 content `mt-4`（收起時無 gap） | `landing.html:7055,7066` |
| 3 | `.input-group > select` `appearance: auto → none` + 自繪 chevron + 強制 `border-radius: 0`（首尾 6px 圓角）| `landing.css:823-842` |
| 4 | 票券 chip 票券號碼 row 改 wrapper container pattern：mobile input ↓ input ↓ button stack 對齊 | `landing.html:2907-2922` |

#### B. Calendar dropdown：position fixed → absolute（**選項 A**）
- **使用者選 A**：dropdown 寫成 trigger cell 的 absolute child，scroll 時自然跟隨
- `.calendar-dropdown { position: fixed → absolute }` (`base.css:302`)
- 3× `positionDropdown()` 改寫成 cell-relative coords：把計算後的 viewport 座標減 `cellRect.top/left` 變相對值
- 驗證：scroll 時 dropdown 跟著 cell 移動、gap 保持不變
- 位置：`landing.html:4452, 5756, 6455`

#### C. 字體規範系統化
- **使用者規範**：「全域最小字體 = 12px，禁 10px，用變數管理」
- 全部 `text-[10px]` → `text-xs`（總共 7 處：4 sidebar badge + 3 calendar weekday header）
- 之前已改的 inv table：data row chip 12px、total row 16px、中秋連假 12px
- `base.css :root` 加 `--font-size-min/sm/base/lg/xl` 5 個變數
- `body { font-size: var(--font-size-base) }` 預設 16
- `tokens.md § 字體` 新增「Font-size 規範」表格 + 禁用註記
- 11px 違規順手清掉：`room-booking.html` 4 處、`chartjs-diverging.html` 1 處

#### D. Lint 系統（**新增 `scripts/` 目錄**）
- `scripts/lint-fonts.sh`：grep-based lint，禁 < 12px 字體（`text-[10px]`、`font-size: 10px` 等）
- `scripts/git-hooks/pre-commit`：committable hook 範本
- `.git/hooks/pre-commit`：本機已實裝（commit 前自動跑 lint，違規 exit 1 擋下）
- `scripts/README.md`：安裝 / 繞過說明

#### E. Modal footer padding 統一
- iOS 真機觀察 modal 右側黑色按鈕貼邊（圓角手機 12px 不夠）
- 5 處 `flex h-[58px] ... justify-end px-3` → `px-5`（12 → 20）
- 位置：`landing.html:2106, 2468, 2679, 3302, 3527`
- 驗證：mobile 390 button 距邊 20px、desktop 1440 距 modal 邊 21px

---

### 驗證截圖

`specs/qa-screenshots/session-63/`（後段已說明開新資料夾規則，下次起用 session-64）：
- `accordion-collapsed.png`：[A] 收起無 gap、merged input-group 中間方角
- `inv-table-font-fix-desktop.png`：字體 12/16px 視覺驗證
- `calendar-absolute-follows.png`：dropdown 跟著 cell
- `modal-footer-px5.png`：button 距邊 20px
- `am-arrow-first-disabled-tall.png`：arrival method swiper 首末頁 arrow disabled
- `ticket-row-mobile-390-aligned.png`：票券號碼 row 3 children 對齊
- `emu-iphone390-C-v3-final.png`：[C] 訂單條件 mobile stack
- `emu-desktop1440-C-final.png`：[C] desktop 3 col 並排
- `emu-ipad768-C-final.png`：iPad 2+1 拼接

### 還沒做 / 下一步可選
- iPad 768 「2+1 拼接」使用者已決定不動
- `body { min-width: 375px }` 使用者覺得目前 OK，未動（iPhone Mini 320 罕見）
- 4 個 sidebar 通知 badge + 3 個 calendar weekday 已從 10 改 12px，但若使用者覺得太大可微調

### 重要決定
- iOS Safari 跟 Chrome Blink 行為不一致：未來寫 mobile 一律靠真機驗證、不能只看 devtools
- Lint 自動攔截 < 12px：違規由 hook 擋 commit；繞過用 `--no-verify`（不建議）
- Calendar dropdown 改 absolute：trade-off 是若被 modal 內 `overflow: hidden` 截到要再處理，目前 inv/加購/到店 modal 都是 visible 沒事
- Modal footer 全 `px-5`：mobile 安全邊距、desktop 看起來也不過鬆

---

## Session 63 交接（2026-05-08）

### 任務：到店方式 modal — chip bug fix + Phase C/D 實作 + 4 個使用者驗收問題（**未驗收完成**）

接續 Session 62。本輪 dev 端做完 chip bug fix、Phase C 接送 swiper card stack、Phase D mobile RWD，但**使用者驗收未完成**。使用者點出 4 個問題後，我修了第 4 個（delete sync）的程式碼，使用者就 reset context。下一輪 session 必須 **先讓使用者親自開瀏覽器確認 4 項修復是否符合預期**，不可自稱完成 / 不可逕自 commit。

> **過程教訓**（已寫入記憶 `feedback_completion_user_confirms.md`）：dev 端 verify pass ≠ 使用者驗收完成；視覺類功能要主動跑多角度截圖讓使用者驗收，不要急著結案。

---

### 已完成（本輪 dev 端）

#### 1. Bug fix — 4 chip 點擊全部失效
- **Root cause**：到店方式 modal IIFE 在 `<script>`（line 3843-6440）內，但 trigger button `#arrivalMethodTrigger` 在 line ~7829，**晚於 script block 執行時被解析**。`document.getElementById("arrivalMethodTrigger")` 回傳 null，IIFE 在 `if (!chipRow || !trigger || !triggerLabel) return;` 早退。**4 個 chip 都失效**（不只 2 / 3，使用者沒注意 chip 1 因為它本來就是 default-active）。
- **Fix**（`preview/landing.html:5938-6010`）：
  - 移除早退 guard 中的 `trigger` / `triggerLabel` 檢查
  - 改用 `document.addEventListener("click", ...)` 委派，匹配 `#arrivalMethodTrigger`，handler 內 lazy `getElementById("arrivalMethodTriggerLabel")`
  - 確定 button commit 邏輯也改 lazy lookup label
- **Verified**（chrome-devtools MCP）：4 chip 切換 / confirm commit + close + label 更新 / cancel discard staging / 重開 sync 到 last committed state — 全 pass。
- **記憶教訓**：在 inline script 內直接 `getElementById` 後段 DOM 元素會 silent fail；下次寫類似 IIFE 改用 document delegation 或 `DOMContentLoaded` wrapper（待寫成記憶或在 `start.md` 補一條）。

#### 2. Phase C — 接送 雙 swiper card stack 完成
- **CDN**：head 內加 `swiper@12 swiper-bundle.min.css/js`
- **HTML**（`preview/landing.html` transfer panel + `<template data-am-transfer-card-template>`）：
  - 雙 column grid（接客單 / 送客單），每 column 含：日期 header / Add button / 序號 label / swiper stack / Dots row（左箭頭 + dots + 右箭頭）
  - 卡片 5 row：生效日期+客人數 / 客目的地點+客搭乘資訊 / 客到站時間（時+分 stepper）/ 接待時間（時+分 stepper）/ 備註 textarea / 刪除清單 button
- **JS**（IIFE 末段）：
  - `initSwiper(kind)` 用 `effect:"cards"` + `cardsEffect:{perSlideOffset:8, perSlideRotate:0}` + `grabCursor:true`
  - `appendCard` / `deleteCard` / `refreshCol`（更新序號 label / dots / 刪除 enabled state）
  - `ensureTransferInit` lazy 在第一次點 transfer chip 時 init（避免 hidden panel 內 swiper 算錯尺寸）
  - 刪除 button：cards.length<=1 時 disabled
  - dot click → `slideTo(i)`；箭頭 → slidePrev/slideNext
  - active dot 改 24×20 rounded-rect 藍 (`--color-bootstrap-components-focus` + stroke `--color-bootstrap-focus-background`)，inactive 20×20 灰圓 (`--color-neutral-200`)
- **CSS**（`preview/assets/css/landing.css` 尾段）：完整 `.am-transfer-*` 樣式
  - 外層 grid 1fr 1fr / gap 24
  - inner stack bg `--color-modal-hover` (`#f6fafd`) / 高 577px
  - card bg `--color-neutral-0` / border `--color-text-100` / radius 12 / padding 20
  - Add button bg `--color-brand-100` (`#fdebd7`)
  - 刪除清單 button 兩態（active 紅 trash / disabled 灰）— **trash icon 用 mask-image** 套 `currentColor` 切色（trash-can.svg 內建紅 stroke 不能直接 tint，所以改 `<span>` + `mask: url(...)` + `background:currentColor`）
- **Verified**（chrome-devtools 視覺）：4 卡片 add/delete 流程、dot click 同步、箭頭切換、刪除 disabled state 切換、stack 視覺 peek-out 都正常。

#### 3. Phase D — mobile RWD（同一次 commit）
- `@media (max-width: 768px)` 內：
  - `.am-modal-box[data-am-state="transfer"] { width: auto; }`
  - `.am-transfer-grid { grid-template-columns: 1fr; }` → 接客單上 / 送客單下垂直堆疊
  - inner stack 高度從 577 降為 480（mobile 視窗矮）
- **Self-verified**（chrome-devtools emulate viewport 600×900,mobile）：grid-template-columns 變單欄 526px，matchMedia `(max-width: 768px)` true。**使用者尚未親自驗收**。

#### 4. 使用者驗收回饋（2026-05-08）+ 我這輪後續修復 — **再次未驗收**

使用者反饋 4 個問題並明確說「不要急著完成」「完成要等我確認」：

| # | 問題 | 修復 | 驗收狀態 |
|---|---|---|---|
| 1 | chip 4（接送）modal **header/footer 完全被吃掉** — 因 transfer panel 過高（>900px viewport）modal 整體垂直 overflow，header 跑去視窗上方、footer 跑去下方 | `.am-modal-box` 加 `max-height: calc(100vh - 24px)` + `display:flex column`；`.am-modal-content` 加 `flex:1 / overflow-y:auto / min-height:0` 讓 chip-row + panel 在內部 scroll，不再把 header/footer 推出視窗。同步在 HTML 上加 `.am-modal-content` class（`<div class="am-modal-content border-b border-border-disabled p-3">`）作 stable hook，不依賴 tailwind class | ❌ **使用者尚未驗收** |
| 2 | active dot 形狀錯成「橢圓」（24×20 rounded-rect），應該是「全圓」 | `.am-transfer-dot.is-active` 改 20×20 圓 + 2px halo（`box-shadow: 0 0 0 2px var(--color-bootstrap-focus-background)`），底色 `--color-bootstrap-components-focus` | ❌ **使用者尚未驗收** |
| 3 | 卡片多時 dot 容器直接擠到左右箭頭，沒 padding 緩衝 | `.am-transfer-dots` 加 `padding: 0 16px` + `overflow-x: auto`，超量時水平滾動（依 `feedback_no_scroll_affordance` 不加 fade/客製 scrollbar） | ❌ **使用者尚未驗收** |
| 4 | 3 卡時刪第 2 卡，序號 label「接待單 1」沒同步更新；行為（刪後落到哪一張）不明顯 | UX 已對齊（使用者選 **Stay at idx 1**：刪後留在原 idx，自動指向下一張）。`deleteCard` 改用 `swiper.removeSlide(idx)`（Swiper 內建會自動 clamp activeIndex 並觸發 `slideChange` → `refreshCol` → 序號 label 同步） | ❌ **使用者尚未驗收**；也尚未 chrome-devtools 跑 regression 確認 label 真的同步（reset before re-verify） |

---

### 後續迭代（同 session，2026-05-08）

使用者驗收 4 個 issue 修復後，再點出 8 個視覺/結構問題並逐一修。**dev 端 self-verified 全 pass，使用者多數認可，整體尚未 commit。**

#### 視覺結構（chip / 序號 / mobile 滿版 / card stack 重組）— 5 件

| # | 問題 | 修法 |
|---|---|---|
| A | chip row 是 flex-wrap，太擠時會換行；應與「正式單 / 候補單 chips」一致 nowrap + overflow | `landing.html:3703` chip row 改 `flex flex-nowrap items-center gap-4 overflow-x-auto min-w-0`（與 `#paymentChips` 對齊） |
| B | 「接待單 1」「送客單 1」序號 label 沒置中 | `landing.css` `.am-transfer-index { text-align: center; }` |
| C | mobile (≤768px) modal **應滿版**：0 padding / 0 radius / 0 border，0~768px 範圍 | `@media (max-width:768px) #modalArrivalMethodBackdrop .am-modal-box { width:100vw; height:100vh; max-width/max-height:100vw/100vh; border-radius:0; border:0 (四向) }` |
| D | **多餘的 `.am-transfer-stack` 包裹層**：原本「藍底 stack 容器 → 內含白底 card」是錯的；正確是 card 自己就是藍底，不需要外層藍 box，stack 多耗 padding 40 害內容塞不下 | HTML 兩處刪 `<div class="am-transfer-stack">` 包裹（pickup / dropoff），swiper 直接掛 `.am-transfer-col` 下；CSS 刪 `.am-transfer-stack` 規則，`.am-swiper` 自己拿 `height/overflow:visible` |
| E | card 應全部都是藍底，**包含 swiper 下層卡**（單卡 OK，2+ 卡時下層 card 看起來「灰」的） | (1) `.am-transfer-card` bg 從 `--color-neutral-0` 改 `--color-modal-hover`（`#f6fafd` 藍）；(2) **真兇**：swiper cards effect 預設加 `.swiper-slide-shadow-cards`（rgba(0,0,0,0.15) 黑色蒙版），下層 slide opacity:1 把藍蓋成灰 → init 時加 `cardsEffect.slideShadows: false` 關掉 |

> 額外 `.am-transfer-card { touch-action: pan-y; }`：避免 mobile 上 swiper 水平拖拉吃掉卡片內垂直滑動。

#### 視覺微調 + JS — 3 件

| # | 問題 | 修法 |
|---|---|---|
| F | 「客人數」stepper 在 cell-pair 內仍是固定 96px，不是 100% | CSS 加 `.am-card-row-pair .am-stepper { width: 100%; }` 覆蓋 `.am-stepper { width: 96px; }` |
| G | delete button 下方留白太多（~74px），設計稿沒那麼多 | (1) `.am-transfer-card { padding: 20px 20px 12px; }`（下 padding 從 20→12）；(2) **真兇**：`.am-swiper` 高 577 但 card content intrinsic = 514，多餘 63px 是 swiper 強制撐高 → `.am-swiper { height: 514px; }`，並把 mobile 的 `height: 560` override 拿掉（mobile content intrinsic 也 514） |
| H | 生效日期欄位 placeholder 顯示，需預設今日 | JS `appendCard` 加 `todayISO()`，clone 時 `dateInput.value = todayISO()`（**已被 calendar 實作覆蓋，改由 dayjs 填**） |

#### 第三輪 — 生效日 calendar widget 真正接上 + 視覺 fix

| # | 問題 | 修法 |
|---|---|---|
| I | 生效日只填了 default value，沒 calendar 互動（使用者點 backlog 第 1 項） | (1) markup：`<input type=text>` 換 `.rb-cal-cell.am-card-date` 結構（`.rb-cal-btn` + `.rb-cal-date`），**無 trailing icon**（特規）；(2) 既有 `initSubPageBehaviors` 內的 simple calendar IIFE 提取 `function initCell(cell)` 並 export 為 `window.initSimpleCalendarCell`（為其他 lazy-mounted cell 鋪路）；(3) 但 arrival method trigger 在 landing 直接出現、`initSubPageBehaviors` 不會跑，所以在 arrival method IIFE 自寫 `initEffectiveDateCell(cell)`（default variant only — 過去 disabled、今日預設、無 birthday selector）；(4) `appendCard` 內 clone 完對 `.am-card-date` 呼叫 init |
| J | calendar dropdown 不可見 — swiper-wrapper 用 `transform`，破壞 `position:fixed` 的 viewport-relative 行為 | dropdown 改 `document.body.appendChild(dropdown)` portaling 出 swiper transform context；inline `z-index:100`（高於 modal `z-60`、popover token 預設只 `z-30`）防被 modal 蓋 |
| K | base.css `.rb-cal-cell { min-width: 160px }` 撐爆 modal 內生效日 cell（cell 寬僅 ~120 → 容不下 160） | CSS scoped override：`.am-card-date { min-width: 0; width: 100% }`（不動 base 規則 → 影響範圍最小，4 個既有 caller 不受影響） |
| L | day 的「藍色圓圈」在某些渲染下視覺位移到文字下方 — 1.5px border + rounded-full + border-box 在 sub-pixel anti-alias 下，藍邊會被弧形邊角削成「半圈」 | dropdown 額外加 class `am-card-date-dropdown` 作 modal-scoped hook；CSS `.am-card-date-dropdown .calendar-day { line-height: 1 }` + `.am-card-date-dropdown .calendar-day.today { border: 0; box-shadow: inset 0 0 0 1.5px var(--color-radio-default) }`（box-shadow 不被 rounded-full clip、不影響 layout） |

> **CSS cache 注意**：使用者首次回報「min-width 又出現」是瀏覽器快取舊 CSS，無痕 / hard reload 後正常。後續發類似報告先請對方 hard reload 排除。

#### Spec 同步
- `components/arrival-method-modal.md` Row 1 標 `Calendar simple（無 icon 特規）` + 補一段「生效日 calendar 特規」：本 modal 內生效日 cell 寬僅夠放 `YYYY-MM-DD`，不掛 calendar trailing icon、也不為此獨佔一行；其他地方仍依 `components/calendar-simple.md` 帶 icon。
- `.gitignore` 加 `preview/screenshots/`（同 `specs/qa-screenshots/` 規則：QA 截圖 regenerate-each-round、非 source）。

---

### 涉及檔案（commit 前狀態）

- `preview/landing.html`
  - head：加 swiper@12 CDN
  - 到店方式 modal：chip-row class 改 nowrap+overflow / 兩處 `.am-transfer-stack` 包裹移除 / `<div class="am-modal-content">` stable hook / 生效日 markup 改 `.rb-cal-cell.am-card-date`（無 icon）
  - IIFE：trigger lazy lookup / Phase C JS（swiper init+add/delete/refresh）/ `cardsEffect.slideShadows:false` / `appendCard` 內呼叫 `initEffectiveDateCell` / 完整 default-variant 月曆實作（dropdown 加 `am-card-date-dropdown` class、portal 到 body、z-index:100）
  - `initSubPageBehaviors` 內 simple calendar IIFE：cell init 提取為 `function initCell` + `window.initSimpleCalendarCell = ... || initCell` export
- `preview/assets/css/landing.css`：尾段 `.am-transfer-*` 全套 + `.am-modal-box` flex column / max-height / mobile 滿版 override / `.am-transfer-card` 改藍底 + padding 縮 + touch-action / `.am-swiper { height:514 }` / `.am-card-row-pair .am-stepper { width:100% }` / 序號 text-align:center / dot 全圓 + dots padding / `.am-card-date { min-width:0; width:100% }` / `.am-card-date-dropdown` calendar-day line-height + today inset box-shadow
- `components/arrival-method-modal.md`：Row 1 補生效日 calendar 無 icon 特規段
- `.gitignore`：加 `preview/screenshots/`
- `specs/progress.md`：本 session 紀錄
- 其他繼承 Session 62 未 commit：`components/modal.md` / `components/order-condition.md` / `components/arrival-method-modal.md`（新檔本身）/ `specs/pages/room-booking.md`

---

### 下一輪 backlog（依使用者偏好排序）
1. **icon 補**：自駕 / 包車或專車 / 接送 trigger trailing icon 待 Figma 補（目前永遠 road.svg，per 使用者 2026-05-08）
2. **UX 優化**：自行到店 chip 無次選項時的提示文字、add button 強/弱 bg 兩態語意
3. **Stepper hour/minute max**：0-23 / 0-59 後端 spec 補完再加
4. **Form input id/name + password 包 form**：console issue 警告（Session 62 backlog）
5. **`effect:"cards"` 偏移方向**：Figma D-2 back card 偏移右上、Swiper 預設右下；嚴格對齊需 customize transform
6. **trash-can mask**（已實作但記錄）：`<span>` + `mask-image:url(trash-can.svg)` + `background:currentColor`，灰態 `--color-text-300`、紅態 `--color-border-plugin-invalid`
7. **calendar prev/next month 完整 regression**：本輪 dev 端只測過開 dropdown / 點未來日期 / 互斥；月份切換按鈕未跑全 cycle
8. **calendar dropdown leak**：每張 card init 一個 dropdown 並 portal 到 body；card 被 deleteCard 時 dropdown 沒清掉，留在 body。多次 add/delete 會堆積。下次補 cleanup（observe slide remove → 移除對應 dropdown）

---

### 未解問題（繼承 + 新增）
1. inline IIFE 內直接 `getElementById` 後段元素 silent fail — 已修 chip bug 個案，codebase 其他類似 IIFE 是否同問題待全面 audit；考慮寫成記憶或補 `start.md` 守則
2. 完整 regression 仍未跑（chip 1-4 切換 / stepper / cancel/confirm / 各 issue 修復互不干擾、calendar 月份切換全 cycle）
3. mobile 滿版引入後，swiper height 514 在極矮 viewport（如 iPhone SE 568）扣 header+footer+chip-row+date-header 可能不夠 → modal-content 整體可 scroll，所以還行，但 ergonomics 待實機驗
4. calendar dropdown DOM leak（見下一輪 backlog 第 8 項）

---
