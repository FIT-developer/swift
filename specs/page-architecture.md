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
