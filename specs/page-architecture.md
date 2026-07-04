# 頁面架構規範（multi-page + partials + ES modules）

> 制定日：2026-07-03（Session 76 結構體檢 B1 項）
> 背景：公司要求原生技術（無框架），但「原生」不等於「單檔」。
> landing.html 已達 11583 行（91 個 modal id、~3800 行 JS），單檔全域 id
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

1. **landing.html 凍結**：不再新增頁面 template、不再新增 modal、不再新增
   大段 JS。既有內容（dashboard/房間預定/訂單處理）維持原樣，只接受
   bug 修正與使用者指名的調整
2. **新頁面 = 獨立 html 檔**（`preview/{page-name}.html`，kebab-case）
3. 新頁面的共用區塊走 partials、共用邏輯走 ES modules，不複製貼上

## 目標結構

```
preview/
  landing.html              (凍結：dashboard + 房間預定 + 訂單處理)
  {new-page}.html           (之後每頁獨立)
  partials/
    aside.html              (共用側欄選單)
    topbar.html             (共用頂部工具列)
    {shared-modal}.html     (跨頁共用的 modal，如客服)
  js/
    partials.js             (fetch + 注入 + loaded event)
    tailwind-config.js      (共用 tailwind.config，各頁引用同一份)
    {feature}.js            (共用元件邏輯：calendar/modal/tooltip...)
  assets/                   (不變：css/ icons/ images/)
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
    <link rel="stylesheet" href="./assets/css/landing.css" />
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

## id 命名空間

- 跨頁面不存在 id 碰撞（每頁是獨立 document）- 這是本架構的核心收益，
  orderEdit_ 前綴 clone 那類 workaround 在新頁面不需要存在
- 頁內 id 沿用既有 kebab/camel 慣例；partial 內的 id 因每頁只注入一份，
  無需前綴

## CSS 歸屬

- token：`base.css`（不變）
- 跨頁共用元件樣式：`landing.css`（沿用；改名遷移成本大於收益，不動）
- 單頁專用樣式：該頁 `<style>` 內 scoped class（沿用 start.md 既有規則）

## 導航（open question，見下）

- landing.html 內部三頁（dashboard/房間預定/訂單處理）維持既有 SPA tab 機制
- aside 選單指向新頁面的項目用一般 `<a href="{page}.html">`
- 新頁面 aside 指回舊三頁：連結 `landing.html`（可帶 hash 指定開哪頁，
  待實作時定義）

## 遷移策略

- **存量不遷移**：landing.html 的三頁不搬出來（全頁 regression 成本 >
  收益，audit D1 結論）
- ~~open question：aside 雙份 vs 單份~~ -> **已裁決（2026-07-03，使用者
  選單一事實來源）並完成實作**：
  - `partials/aside.html`：全站唯一的 aside（668 行，自 landing.html 抽出），
    純 markup 不含 script，選單變動只改這一份
  - **landing.html 用同步注入**（`asideMount` + sync XHR + outerHTML
    replace）：因其 sidebar 綁定散佈於 load-time 多個 IIFE，async 注入
    會讓全部綁定落空。sync XHR 的 console deprecation warning（1 筆）
    為已知且接受的 demo 取捨
  - **新頁面用 `js/partials.js` 的 async `loadPartials()`**：掃描
    `[data-partial]` 注入，完成後標 aside active 態（依
    `body[data-page]`）並 dispatch `partials:loaded`
  - 回歸驗證（2026-07-03）：選單導航、accordion 收合、收合全部、
    mobile drawer 開關、backdrop 關閉，全數通過
- `js/tailwind-config.js` 於下一個新頁面實作時建立（目前只有 landing
  一頁，無共用需求）

## 對後端的意義

後端接手時看到的是接近正式產品的 multi-page 結構：每頁一個入口、共用
partial、模組化 JS。比 11583 行單檔更接近他們要重寫的形狀。

---

## landing.html 拆頁重構計畫（2026-07-04 使用者核准，依序執行）

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

**分階段（每 stage 交接進 progress.md；commit/push 一律等使用者明確指示，不自動執行）**：

| Stage | 內容 | 狀態 |
|---|---|---|
| 0 | 決策 + 本計畫 + js/tailwind-config.js 抽出 | 完成（2026-07-04） |
| 1 | 拆訂單處理（細分 1a-1d，見下方執行要點） | 完成（2026-07-04，Session 81-84） |
| 2 | 拆房間預定 -> room-booking.html（改用同一份 [A]-[E] partial） | 完成（2026-07-04，Session 85） |
| 3 | landing 清理只剩 dashboard；topbar 抽 partial；殘餘共用 JS 模組化 | 待做 |

Stage 2 產出（Session 85）：
- room-booking.html：頁面內容直接注入 room-booking-sections partial（與
  訂單修改 modal body 同一來源，目標終態達成）
- js/arrival-method-modal.js：到店完整互動（13 bindings 全搬）；只在 rb 頁載入
- js/page-shell.js：aside accordion / 收合全部 / mobile drawer（兩個新頁共用）
- partials/session-modals.html：登出 / 帳號切換 modal 全站共用
- 導航裁決：logo = 回 landing.html（原 hash open question 作廢）；
  aside 房間預定 / 訂單處理 皆真實連結，landing SPA 只剩 placeholder 頁

Stage 1 產出（Session 84 收尾）：
- partials/room-booking-modals.html：8 共用 modal + 庫存月曆 offcanvas 單一來源
  （landing sync XHR 注入 / 新頁 data-partial async 注入）
- js/room-booking-behaviors.js：[A]-[E] 行為 module（landing inline 版保留，
  過渡性複製，Stage 3 去重）
- js/order-modals.js：新頁 modal 系統（動態 z-index 疊層取代 orderEdit_ clone）
- landing 的 orderEdit_ clone 機制整組退役；aside 訂單處理 = 真實連結
- 到店方式 modal 在新頁為靜態 + 開關（等價舊副本保真）；其互動 JS 與
  頁面層行為（產生訂單 / customer-toggle 等）屬 Stage 2 範圍

**Stage 1 細分為 4 個可驗收小段（2026-07-04 使用者定案）**：

**1a - 抽共用內容，先不拆訂單頁**
- 建 partials/room-booking-sections.html：自 tpl-room-booking 的 wrapper 抽 [A]-[E] 4 區塊
- landing 的 tpl 以同步注入把 partial 塞回原位（同 aside 模式）：openPage 的
  innerHTML clone 與訂單修改 modal 的 build 照舊運作，**對外行為零變化**
- 目的：最大重複源先變單一來源

**1b - 建 order-processing.html 靜態頁**
- 頁內容自 tpl-order-processing 搬出；用 partials/aside.html + js/tailwind-config.js
- **topbar 同步抽成 partials/topbar.html**（避免先複製後搬移）：partial 只含容器
  markup（含 #pageTabsInline 容器），chips 內容由各頁 JS 自行渲染 -
  landing 照舊動態 render、新頁 render 靜態導航 chip，單一 partial、行為分頁
- 驗收標準：頁面獨立載入、顯示、RWD 不爆版（先不含互動）
- **過渡期規則**：新頁是訂單處理的 source of truth，landing 內的 tpl-order-processing
  凍結待刪（1d 清），不可兩邊都改
- aside 的「訂單處理」連結**先不改** href（改了會斷 landing 的 SPA 入口），
  1b/1c 期間新頁以網址直接訪問，1d 才切換

**1c - 抽訂單處理 JS module**
- 建 js/order-processing.js（頁面 module）：op-* 行為（pill menu、filter tabs、
  quick filter、tooltip clamp、project toggle）分批搬入
- 該頁依賴的共用行為（rb-cal-cell 日曆、nation-group、rb-accordion 等）：
  **允許複製成 js/ module 給新頁用，landing 保留 inline 版** - 過渡性重複，
  Stage 3 收斂去重（此重複為計畫內，不是 drift）
- 不引用 landing 的整包 script

**1d - 搬 modal 並退役 clone 機制**
- 訂單修改 modal 外殼 + 該頁所需 modal（訂單明細/簡訊/加購/會員資料/合約公司/
  房型/到店/月曆 offcanvas）搬到新頁或 partial
- 訂單修改 body 直接用 partials/room-booking-sections.html
- 新頁獨立 document，orderEdit_ clone 防撞機制整組退役
- 工程量註記：現行 clone 出的巢狀 modal 本來就是不接互動 JS 的視覺副本，
  新頁做靜態 partial + 開關綁定 = 與今日等價保真，非降級
- aside「訂單處理」改 <a href="order-processing.html">，landing SPA 入口移除
- 回歸三條鏈：訂單明細、簡訊、修改 modal 內再開會員資料/合約公司（三層疊層）

每小段完成：三 lint + 該段驗收標準 + progress.md 交接。

