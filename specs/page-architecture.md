# 頁面架構規範（multi-page + partials + ES modules）

> 制定日：2026-07-03（Session 76 結構體檢 B1 項）
> 背景：公司要求原生技術（無框架），但「原生」不等於「單檔」。
> landing.html 曾達 11583 行（91 個 modal id、~3800 行 JS），單檔全域 id
> 命名空間是巢狀 modal orderEdit_ clone 那整套工程債的根因。
> 本規範凍結單檔增量，新頁面改走 multi-page 架構。

---

## 技術可行性（2026-07-03 實測確認）

1. **Tailwind Play CDN + fetch 注入**：CDN 的 MutationObserver 對 runtime
   注入的 HTML 完整生成樣式，含 arbitrary value（`tracking-[0.37em]`）、
   CSS var arbitrary（`bg-[var(--color-brand-300)]`）、config 自訂色
   （`text-surface-brand`），全數驗證通過
2. **原生 ES modules**：`<script type="module">` + `import/export`，
   python http.server 直接服務，無 build step、100% 原生

## 硬性規則

1. **landing.html dashboard-only**：不再新增頁面 template、不再新增 modal、
   不再新增大段 JS。今日總覽只接受 bug 修正與使用者指名的調整
2. **新頁面 = 獨立 html 檔**（`preview/{page-name}.html`，kebab-case）
3. 新頁面的共用區塊走 partials、共用邏輯走 ES modules，不複製貼上

## 目標結構

```
preview/
  landing.html              (dashboard only)
  {new-page}.html           (之後每頁獨立)
  partials/
    aside.html              (共用側欄選單)
    topbar.html             (共用頂部工具列)
    {shared-modal}.html     (跨頁共用的 modal，如客服)
  js/
    partials.js             (fetch + 注入 + loaded event)
    tailwind-config.js      (共用 tailwind.config，各頁引用同一份)
    {feature}.js            (共用元件邏輯：calendar/modal/tooltip...)
  assets/
    css/
      app.css               (CSS entrypoint imports domain files)
      {domain}.css          (shell / dashboard / modals / room-booking / order-processing)
    icons/
    images/
```

## 新頁面骨架（每頁固定開頭）

```html
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Swift - {頁名}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="./js/tailwind-config.js"></script>
    <link rel="stylesheet" href="./assets/css/base.css" />
    <link rel="stylesheet" href="./assets/css/app.css" />
  </head>
  <body>
    <div data-partial="aside"></div>
    <main>
      <div data-partial="topbar"></div>
      <!-- 頁面內容 -->
    </main>
    <script type="module">
      import { loadPartials } from "./js/partials.js";
      await loadPartials();
      // 頁面自己的初始化
    </script>
  </body>
</html>
```

## Partial 載入機制

- `js/partials.js` 提供 `loadPartials(root?)`：掃描 `[data-partial]`，
  fetch `partials/{name}.html` 注入，全部完成後 dispatch
  `partials:loaded` event
- partial 內不放 `<script>`；partial 相關的行為由頁面 module 在
  `loadPartials()` resolve 後綁定
- aside 的 active 狀態：partial 注入後由 `partials.js` 依
  `document.body.dataset.page` 標示當前頁

## Partial dependency manifest

- 每頁必載的 partials 與 JS module import 順序，權威登記在
  `scripts/lint-partials.py` 的 `MANIFEST`（機器檢查，pre-commit hook 執行）
- 新增頁面時必須同步登記；未登記的 preview/*.html 會被 lint 擋下
- lint 同時檢查組合後（頁面 + partials）duplicate id、`data-modal-open` 與
  `.modal-close-btn` 的 `data-modal` 目標存在性 - 「漏載 partial 造成死按鈕」
  這類錯（Session 84/85 教訓）由此攔截
- module import 順序有相依，不可重排：
  `partials.js`（loadPartials）-> `page-shell.js`（aside/topbar shell）->
  頁面 behaviors -> modal 系統（`landing-modals.js` 或 `order-modals.js` ->
  `arrival-method-modal.js`）
- 舊單元件 preview（chartjs-*.html、toggle.html）登記在 `STANDALONE` 豁免；
  一旦開始使用 data-partial 就必須搬進 MANIFEST
- runtime 驗證由 `scripts/smoke-test.mjs` 覆蓋（真實 Chrome 載入三頁：
  console 無錯、chart 非空、drawer/accordion、session 與 topbar modal 開關），
  改動頁面 / partial / module 後手動跑

## id 命名空間

- 跨頁面不存在 id 碰撞（每頁是獨立 document）- 這是本架構的核心收益，
  orderEdit_ 前綴 clone 那類 workaround 在新頁面不需要存在
- 頁內 id 沿用既有 kebab/camel 慣例；partial 內的 id 因每頁只注入一份，
  無需前綴

## CSS 歸屬

- token：`base.css`（不變）
- 跨頁 CSS 入口：`app.css`。所有 preview page 繼續只 link 這一個入口，避免
  每頁維護 CSS 載入順序
- 分域樣式檔（2026-07-04 已拆）：`shell.css`（aside/topbar/page shell）/
  `dashboard.css` / `modals.css` / `room-booking.css` / `order-processing.css`
- 新增跨頁樣式時先選對分域檔；只有新增分域或調整 import 順序才改 `app.css`
- 單頁專用樣式：該頁 `<style>` 內 scoped class（沿用 start.md 既有規則）

## CDN dependency matrix

每頁 head 只載自己需要的外部資源；新增/移除 CDN 時同步更新本表。
（未來切 local Tailwind 時本表是遷移 checklist 的輸入）

| 資源 | landing | order-processing | room-booking | 用途 |
|---|---|---|---|---|
| Tailwind Play CDN + `js/tailwind-config.js` | v | v | v | 全站 utility class；config 共用一份 |
| chart.js@4 | v | - | - | dashboard 統計圖表 4 張（`js/landing-charts.js`） |
| dayjs@1 + isoWeek plugin | - | v | v | [A] 庫存/訂房 calendar 與 simple-calendar 日期運算（`js/room-booking-behaviors.js`，op 頁由訂單修改 modal body 使用） |
| swiper@12（JS + CSS） | - | - | v | 到店方式接送卡片 swiper（`js/arrival-method-modal.js`，只在 rb 頁載入） |

## 導航（current）

- `landing.html` 只代表今日總覽 dashboard；logo 一律連回 `landing.html`
- aside 已有真實頁面的項目用一般 `<a href="{page}.html">`：
  `房間預定` -> `room-booking.html`，`訂單處理` -> `order-processing.html`
- aside 其餘尚未拆頁項目維持 inactive markup，不開 placeholder，不新增空白頁；
  未來有真實頁面時再改成真實連結
- topbar page chip 在 demo 中降級為目前頁面的導航提示；不重現舊 SPA 的多開
  tab / close chip 語意

## 遷移策略（current）

- landing 已拆成 dashboard-only；房間預定與訂單處理為獨立頁
- `partials/aside.html` 是全站唯一 aside，純 markup 不含 script；選單變動只改
  這一份，active 狀態由 `partials.js` 依 `body[data-page]` 標示
- `partials/topbar.html`、`partials/session-modals.html` 與
  `partials/room-booking-modals.html` 是目前共用 partial；partial 內不放
  script，行為由頁面 module 初始化
- `js/tailwind-config.js`、`js/page-shell.js`、`js/partials.js` 為跨頁基礎
  module；新增頁面必須同步登記 `scripts/lint-partials.py` 的 MANIFEST

## 對後端的意義

後端接手時看到的是接近正式產品的 multi-page 結構：每頁一個入口、共用
partial、模組化 JS。比 11583 行單檔更接近他們要重寫的形狀。

---

## landing.html 拆頁重構紀錄（2026-07-04 使用者核准，Stage 0-4 landed/self-tested）

背景：audit 時「存量不動」的前提已變 - partials 基礎設施已存在、repo 確定持續增長、
拆頁後 orderEdit_ runtime clone 那整套防碰撞機制可整組退役（每頁獨立 document）。

**分頁 tab chips 決策**：demo 降級為導航列（顯示當前頁、點擊為真實跳頁連結）；
「同時多開 + 關閉 chip」的 SPA 語意屬後端範疇，不在 demo 重現。

**目標終態**：
- landing.html = 只剩 dashboard（今日總覽）
- room-booking.html = 房間預定
- order-processing.html = 訂單處理
- partials/room-booking-sections.html = [A]-[E] 單一來源
  （房間預定當頁面內容、訂單修改 modal 當 body，兩處共用）
- 共用 modal 各自成 partial；共用 JS 收進 js/ ES modules

**分階段紀錄（commit/push 一律等使用者明確指示，不自動執行）**：

| Stage | 內容 | 狀態 |
|---|---|---|
| 0 | 決策 + 本計畫 + js/tailwind-config.js 抽出 | landed（2026-07-04） |
| 1 | 拆訂單處理（細分 1a-1d，見下方歷史執行要點） | landed（2026-07-04，Session 81-84） |
| 2 | 拆房間預定 -> room-booking.html（改用同一份 [A]-[E] partial） | landed（2026-07-04，Session 85） |
| 3 | landing 清理只剩 dashboard；topbar/aside 行為模組化；殘餘共用 JS 去重 | landed（2026-07-04，Session 86） |
| 4 | order-modals.js 拆小（非計畫原始項，Session 87 使用者追加的基建改善） | self-tested（2026-07-04，Session 88） |

Stage 4 產出（Session 88；Session 87 排定）：order-modals.js（1314 行）拆成 4 個職責 module +
orchestrator：
- js/order-edit-modal.js：訂單修改 body 注入（fetch partial + 4 項差異 +
  initRoomBookingBehaviors）
- js/purchase-addon-modal.js：加購產品資料 + 分類 + editor/cart state + 渲染
  + simple calendar + 頁面層 cart（`window.renderPurchaseAddonCart` 對外介面不變）
- js/member-data-modal.js：會員資料 + 合約公司（nation-group / honorific /
  身份 radio / chips / filter tabs）
- js/order-summary-modal.js：variant + accordion + [E] 送出開啟
- js/order-modals.js（orchestrator，124 行）：modalApi 組裝、op 選單接線
  （訂單/簡訊/修改）、到店確定關閉、訂房明細編輯 lock/clear；對頁面介面不變
  （`initOrderModals()` 仍回傳 `{ openModal, closeModal }`），MANIFEST 不需更新

Stage 2 產出（Session 85）：
- room-booking.html：頁面內容直接注入 room-booking-sections partial（與
  訂單修改 modal body 同一來源，目標終態達成）
- js/arrival-method-modal.js：到店完整互動（13 bindings 全搬）；只在 rb 頁載入
- js/page-shell.js：aside accordion / 收合全部 / mobile drawer（兩個新頁共用）
- partials/session-modals.html：登出 / 帳號切換 modal 全站共用
- 導航裁決：logo = 回 landing.html（原 hash open question 作廢）；
  aside 房間預定 / 訂單處理 皆真實連結；landing 不再保留 SPA placeholder

Stage 1 產出（Session 84 收尾）：
- partials/room-booking-modals.html：8 共用 modal + 庫存月曆 offcanvas 單一來源
  （所有頁面皆 data-partial async 注入）
- js/room-booking-behaviors.js：[A]-[E] 行為 module（Stage 3 後只由
  room-booking.html 與 order-modals.js 注入的訂單修改 body 使用）
- js/order-modals.js：新頁 modal 系統（動態 z-index 疊層取代 orderEdit_ clone）
- landing 的 orderEdit_ clone 機制整組退役；aside 訂單處理 = 真實連結
- 到店方式 modal 在新頁為靜態 + 開關（等價舊副本保真）；其互動 JS 與
  頁面層行為（產生訂單 / customer-toggle 等）屬 Stage 2 範圍

**Stage 1 歷史執行要點（2026-07-04 使用者定案）**：

以下保留為拆頁過程記錄，不是現行架構指令；現行狀態以上方 current 段落與
Stage 1-4 產出為準。

**1a - 抽共用內容，先不拆訂單頁（historical stage note）**
- 建 partials/room-booking-sections.html：自 tpl-room-booking 的 wrapper 抽 [A]-[E] 4 區塊
- 當時 landing 的 tpl 以同步注入把 partial 塞回原位（同 aside 模式）：openPage 的
  innerHTML clone 與訂單修改 modal 的 build 照舊運作，**對外行為零變化**
- 目的：最大重複源先變單一來源

**1b - 建 order-processing.html 靜態頁（historical stage note）**
- 頁內容自 tpl-order-processing 搬出；用 partials/aside.html + js/tailwind-config.js
- **topbar 同步抽成 partials/topbar.html**（避免先複製後搬移）：partial 只含容器
  markup（含 #pageTabsInline 容器），chips 內容由各頁 JS 自行渲染 -
  landing 照舊動態 render、新頁 render 靜態導航 chip，單一 partial、行為分頁
- 驗收標準：頁面獨立載入、顯示、RWD 不爆版（先不含互動）
- **當時過渡期規則**：新頁是訂單處理的 source of truth，landing 內的
  tpl-order-processing 凍結待刪；1d/Stage 3 已移除
- 當時 aside 的「訂單處理」連結先不改 href，1d 才切真實連結；現行已是
  `order-processing.html`

**1c - 抽訂單處理 JS module（historical stage note）**
- 建 js/order-processing.js（頁面 module）：op-* 行為（pill menu、filter tabs、
  quick filter、tooltip clamp、project toggle）分批搬入
- 該頁依賴的共用行為（rb-cal-cell 日曆、nation-group、rb-accordion 等）：
  **當時允許複製成 js/ module 給新頁用，landing 保留 inline 版** -
  過渡性重複，Stage 3 已收斂（此重複為計畫內，不是 drift）
- 不引用 landing 的整包 script

**1d - 搬 modal 並退役 clone 機制（historical stage note）**
- 訂單修改 modal 外殼 + 該頁所需 modal（訂單明細/簡訊/加購/會員資料/合約公司/
  房型/到店/月曆 offcanvas）搬到新頁或 partial
- 訂單修改 body 直接用 partials/room-booking-sections.html
- 新頁獨立 document，orderEdit_ clone 防撞機制整組退役
- 工程量註記：現行 clone 出的巢狀 modal 本來就是不接互動 JS 的視覺副本，
  新頁做靜態 partial + 開關綁定 = 與今日等價保真，非降級
- aside「訂單處理」改 <a href="order-processing.html">，landing SPA 入口移除
- 回歸三條鏈：訂單明細、簡訊、修改 modal 內再開會員資料/合約公司（三層疊層）

每小段完成：三 lint + 該段驗收標準 + progress.md 交接。
