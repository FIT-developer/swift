# Page: 系統基本 (system-basic)

**Figma 來源（current version, read date 2026-07-13）**:
- Desktop: SECTION `2061:72550`「Content page - 系統基本 desktop default 0713」1440x1284
- Mobile ~ Tablet: SECTION `2061:72551`「Content page - 系統基本 mobile ~ tablet default 0713-1」768x1274
  - 注意: 此 frame 畫布寬 768, 但代表的是 **767 以下**的階段（使用者 2026-07-13
    確認: 之後 tablet 稿會改設 767; 768 以上 = desktop 不變）

**實作**: `preview/system-basic.html`
**狀態**: 本輪新增

---

## 使用者確認事項 (2026-07-13, 實作前拍板)

1. topbar tab「系統基本」active = 本頁 default state；「xxoo」chip 為佔位假字
   （= 另一顆已開 tab 的示意），不實作
2. 「網路訂房版型」卡 radius 16（其他卡 12）是刻意設計, 不是手誤
3. 版型預覽區照 Figma 示意做靜態 DOM；將來由後端渲染真實圖片
4. 啟用/未啟用 icon 沿用既有 `check-green.svg` / `failure-red.svg`
5. toggle 沿用既有 `.member-data-switch` pattern（html-conventions.md）
6. aside 照 git 現行內容, 但全域調整: 客服區僅留 Email、移除快速切換帳號
   （調整記錄見 components/customers-service.md, components/account.md）
7. 「當前環境 IP」按鈕僅示意, 功能（把當前使用者 IP 嵌入 textarea）由後端實作,
   demo 不做行為
8. 全域移除: 客戶公告系統（bulletin/target icon 整組, Session 99-103 已完成,
   本輪無改動）、AI bot 右下常駐按鈕（見 components/float-icons-ai.md）
9. 版型示意區文字套 Noto Sans（Figma 稿用 Roboto 是文字體未統一, 不跟）,
   英文假文案不翻譯
10. 欄數切換點: >=768 desktop 佈局; 640-767 兩欄（mobile shell）; <640 單欄

## 佈局

### Shell
- 沿用全站 shell: `partials/aside.html` + `partials/topbar.html` +
  `partials/session-modals.html` + `partials/topbar-modals.html`
- topbar tab: 本頁登記進 `js/page-tabs.js` TAB_PAGES
  （`system-basic.html` ->「系統基本」）
- aside「系統設定 > 系統基本」接真實連結, active 標示依 `body[data-page]`
- mobile（<768）: 上方僅 logo + drawer 收合鈕（既有 shell 行為）;
  function icons 在 drawer 內（既有 Mobile function icons row）

### Content 外層
- 容器: bg `Color/Neutral/75`(#f6fafd), radius 12, border `#d1d1d1`
  (border-disabled), padding 20
- 頁面外距: desktop 20px, mobile 12px（Figma frame 實測）
- 卡片區兩欄: desktop 每欄 538px gap 24（row gap 32）; 767 以下每欄流動
  （Figma 稿 340px @768 畫布）gap 24; <640 單欄
- 單欄堆疊順序（DOM order）: 網路訂房(IP) -> 網路訂房(toggles) ->
  預設加購訂金規則 -> 當日網路訂房 -> ATM 設定 -> 刷卡設定 -> 網路訂房版型
- 欄內卡片間距 24

### 卡片通用
- 白底, border `#b0b0b0`(border-default-strong 對照 tokens.md), radius 12,
  padding 16
- 標題 20px/600 `#454545`; label 16px/400; hint 12px/400
- 例外: 「網路訂房版型」卡 radius 16

## 卡片規格

### 1. 網路訂房 - IP 白名單（desktop 左上, Figma 2061:71118 / 71849）
- header 列: 標題「網路訂房」+ 右側 label「僅下列 IP 允許登入系統」(16/400,
  靠右)
- textarea: 全寬, 高 118, border `#d1d1d1` radius 6, padding 6/12,
  內文 12px（demo 值 `110.121.99.01, 110.121.99.02`）, 原生 resize 樣式即可
- 底列: 左 hint「使用「,」符號，分隔一筆以上的 IP」(12/400) +
  右深色按鈕「當前環境 IP」（Button Y/N dark: bg `#454545` text-text-inverse
  radius 6 padding 6/12, 沿用 components/button-yn.md）; demo 無行為（確認事項 7）

### 2. 網路訂房 - 開關群（desktop 右上, Figma 2061:71127 / 71858）
- 標題「網路訂房」
- 4 列 label + 右側 toggle, 列距 20:
  1. 檢查身份證 - off
  2. 訂房 Email 專案顯示詳細內容 超長文字超長文字超長文字超長文字超長文字 - on
     （label 可換行, toggle 垂直置中於列）
  3. 顯示發票資料 - off
  4. 訂房 Email 顯示需知 - on
- toggle: `.member-data-switch`（on `--color-accent-green`,
  off `--color-switch-off-track`）

### 3. 預設加購訂金規則（Figma 2061:71149 / 71880）
- 標題 + select（全寬, 值「不含加購」, icons/down, 沿用 select 慣例）

### 4. 當日網路訂房（Figma 2061:71152 / 71883）
- header 列: 標題 + toggle（default on）
- 內容列: stepper input（值 13, icons/up-and-down）+ 右側 label「時，終止」
  - input 寬度 = 填滿 label 以外的剩餘寬度（flex-1; 2026-07-13 使用者確認
    設計稿意圖, Figma 768 稿的 232px 即當時的剩餘寬度）
- hint:「時間範圍：1～24。關閉開關時，當日不開放。」(12/400)
- **toggle 連動**（2026-07-13 使用者新增）: toggle off -> input disabled +
  灰底 `bg-border-default`（沿用 room-booking lock toggle 慣例）; on ->
  恢復可輸入白底。實作在 `js/system-basic.js` `initSystemBasic()`

### 5. ATM 設定（Figma 2061:71160 / 71893）
- 標題「ATM 設定」
- 5 列 label 左 / value 右, 列距 20:
  | label | value |
  |---|---|
  | 虛擬帳號 | check-green icon 24 + 啟用 |
  | ATM 銀行 | 玉山銀行（808） |
  | 虛擬帳號前置碼 | 88888888888888 |
  | 檢查碼 | 88888888888888 |
  | 分行戶名 | 歐巴颱風超讚 |
- 「歐巴颱風超讚」「888...」為 demo 佔位資料, 照放不賦予語意

### 6. 刷卡設定（Figma 2061:71194 / 71927）
- 標題「刷卡設定」
- 3 列, 列距 20:
  | label | value |
  |---|---|
  | 線上刷卡 | failure-red icon 24 + 未啟用 |
  | 收單銀行 | 富邦銀行（xxx） |
  | 刷卡付全額 | failure-red icon 24 + 未啟用 |

### 7. 網路訂房版型（Figma 2061:71217 / 71950, radius 16）
- 標題「網路訂房版型」+ select（值「湖水綠」）
- 版型預覽（node "Green"）: 客戶端訂房網縮影, 靜態示意 DOM（確認事項 3、9）:
  - 白底, 上下 padding 12
  - 大圖佔位: bg 版型綠(#bbf7d0), radius 6, 高 360（<768 稿）/流動,
    置中文字「Featured images of the product, swipe to view」16/500
  - section title 列:「AirSoft Running Shoes」18/500 +
    subtitle「Lightweight - Breathable - Everyday comfort」12/400 半透明黑
    （Figma 原文以 U+2022 圓點分隔, 依 ASCII-only 規則改為 "-", demo 假文案）+
    「Buy now >」外框按鈕（border 黑, radius 4, padding 3/8, 文字 12）
  - 2 列 article: 80x80 圖佔位（版型綠）+ title 16/500 + subtitle 12/400
    半透明黑 + 說明 12/400 黑; 列間 divider 10% 黑
  - 顏色為版型示意專用, 登記於 tokens.md「版型示意」段（--color-template-*）,
    不與產品 UI token 混用
  - 文字為英文假文案, 套 Noto Sans, 不翻譯（確認事項 9）

### Footer（Figma 2061:71251 / 71984）
- 右對齊:「清除」（bg `#d1d1d1`）+「修改」（bg `#454545` text-text-inverse）,
  gap 8, 沿用 components/button-yn.md; padding top 20 bottom 8
- demo 無行為（Figma 未定義, 後端範疇）

## 狀態 / 互動

- Figma 只給 default state; hover/error 等未定義, 不腦補
- toggle demo 可點擊切換視覺（沿用既有 switch pattern 的 checkbox 行為）,
  不儲存
- select / stepper / textarea 為原生元素, 無自訂行為
- 頁面無 modal（topbar 共用 modal 除外）

## 產出驗證重點（contract-specific）

- 兩顆狀態 icon 用 check-green.svg / failure-red.svg, 不重畫
- 版型卡 radius 16, 其他卡 12
- 640 / 767 / 768 / 1440 四個 viewport 欄數行為: 1 / 2 / desktop / desktop
- 版型示意區顏色全部走 --color-template-* 變數
