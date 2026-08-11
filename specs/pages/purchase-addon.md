# Page: 加購商品 (purchase-addon)

**Figma 來源 (current version, read date 2026-08-11)**:
- Desktop: `2183:129489`「加購商品 desktop 0811」1440x1786
- Mobile ~ tablet: `2183:130916`「加購商品 mobile ~ tablet 0811」767x1884
- Mobile: `2183:132622`「加購商品 mobile 0811」375x2186
- 截圖: `specs/qa-screenshots/session-131/purchase-addon-{desktop-1440,tablet-767,mobile-375}.png`

**實作**: `preview/purchase-addon.html`
**狀態**: 2026-08-11 初版實作 + 問題回報修正。列表層、狀態統計、全部顯示 / 分頁切換、停用 / 啟用狀態移動、產品資料 modal 與照片管理 modal 已接；類別資料 modal 若後續有獨立 Figma 內容再拆分。

## 使用者確認事項

1. 商品 tabs 是單選 tab button；default 是「所有商品」。selected 狀態是白底，灰底是未選中，不得把 Figma 畫面中灰底的「住宿加購」誤判為 default selected。
2. Desktop sidebar 沿用現有真實系統選單；本頁只變化 topbar page tab「加購商品」與其下方內容。
3. Table 管理按鈕 desktop ~ tablet 採 flex auto 自然流動；mobile 嚴格限制 `flex-nowrap`。若 tablet 實作跑版，也維持 `flex-nowrap`。原則上不需要 button-level scroll。
4. 產品新增 / 修改 / 查看需開啟資料 modal；產品新增內容依使用者 2026-08-11 補圖實作完整欄位。
5. Table 的停用 / 負向淡紅按鈕外框與相關淡色提示使用 `Color/Surface/Status-Negative-light`，實作為 `var(--color-surface-status-negative-light)`。
6. 修改 / 複製 / 停用 / 查看 / 啟用的功能語意同「房型」，但加購商品頁按鈕沒有漸層底色，只保留白底與不同邊框色。
7. 照片管理沿用「房型」照片管理 modal 版型，但 id / JS state 需獨立，不可混用 `room-type` id。

## Shell

- 沿用全站 shell: `partials/aside.html` + `partials/topbar.html` + `partials/session-modals.html` + `partials/topbar-modals.html`
- topbar tab: 登記進 `js/page-tabs.js` TAB_PAGES (`purchase-addon.html` ->「加購商品」)
- aside「系統設定 -> 加購商品」改為真實連結，active 標示依 `body[data-page="加購商品"]`
- mobile / tablet (`<768`): 沿用 room-type 的整襯型頁殼，`#rootWrap` 使用 `md:p-3`，mobile top bar 自帶 `px-3 pt-3`，內容滿版貼齊 viewport 左右

## Layout

頁面內容為兩個垂直堆疊的 section：

1. 產品設定
2. 類別設定

每個 section:

- 外層: bg `Color/Neutral/75`, border `Color/Neutral/200`, radius 12, padding 20
- Header: 左側 20px/600 標題，右側 `icons/down` chevron。點擊可收合 / 展開 body，Figma 只畫展開態，收合行為作為 demo affordance。
- Body: 白底, radius 12, padding 12, 內部先顯示右上「新增」「重整」按鈕列，再顯示商品 tabs、篩選 / 狀態列 / table。

## 共用 Controls

### 右上操作列

- 「新增」: `icons/outline-plus`, 白底, border `Color/Neutral/200`, radius 28, height 42, padding 16, click 開啟資料 modal
- 「重整」: `icons/restore`, 白底, border `Color/Neutral/200`, radius 28, height 42, padding 16, click -> `window.location.reload()`

### 商品 tabs

- Tabs:「所有商品」「住宿加購」「其他商品」
- 單選；default「所有商品」
- selected: 白底 + border `Color/Neutral/200`
- inactive: `Color/Neutral/200` 灰底 + border `Color/Neutral/200`
- 小尺寸使用水平 overflow，不壓縮文字

### 啟用 / 停用狀態 tabs

- 沿用 `.member-data-filter-tab` / `.is-active` pattern
- default:「啟用（99）」active，「停用（8）」inactive
- click 只切換 active 樣式；資料篩選未定義，demo 不改 table rows

### 全部顯示 / 分頁 toggle button

- all mode: `icons/all-pages` + 文案「全部顯示（14 筆）」
- paged mode: `icons/split-page` + 文案「分頁（N 頁 / M 筆）」
- all mode: 顯示目前狀態 tab 下全部 rows（default 啟用 = 14 筆）
- paged mode: table 顯示每頁 5 筆並出現 pagination
- 切換狀態 tab 或停用 / 啟用 row 時，文案中的筆數依目前狀態即時更新

### Pagination

- 只顯示三個控制：上一頁、當前頁數字、下一頁
- 當前頁數字為純頁碼，不列出所有頁碼
- 上一頁 / 下一頁 button 為全圓角淡藍底，使用 `icons/left` / `icons/right`
- 若已在第一頁，上一頁 disabled 並淡化；若已在最後一頁，下一頁 disabled 並淡化
- 點上一頁 / 下一頁後更新 table rows 與當前頁數字

### 圖例

產品設定:
- `icons/thumbtack` +「限定專案」
- `icons/thumbtack-slash` +「非限定專案」
- `icons/home` +「住宿加購」

類別設定:
- `icons/home` +「住宿加購」

## 產品設定

### Filter

- 商品分類:
  - desktop/tablet: label 左，分類文字 input + select 同列
  - mobile: label 獨立一列，input + select 下一列，select 文字可截斷
  - input value placeholder:「輸入分類文字」
  - select value:「下拉選單（1）」
- 商品名稱:
  - desktop/tablet: label + input 同列
  - mobile: label 獨立一列，input 下一列
  - placeholder:「placeholder」
- 右側操作:「清除」「查詢」
  - desktop/tablet: 與快篩 chips 同列右側
  - mobile: 換行靠右
  - 清除 click 清空輸入框；查詢 demo 無資料行為

### Quick Chips

- 單選快篩:「全部」「線上隨單加購」「僅後台加購」
- default「全部」active，active 背景 `Color/SubItem/Selected`
- click 只切換 active 樣式；資料篩選未定義

### Product Table

欄位:

| 欄位 | 內容 |
|---|---|
| 順序 | 1, 2, 3, 4, 5；此欄 bg `Color/Neutral/200` |
| 編號 | 22, 33, 44, 66, 1999 |
| 照片管理 | 有圖顯示縮圖；無圖顯示 `icons/image-empty` |
| 品名 | 房費折抵 / 退寵物入住保證金 / 火鍋 / 花瓶 / 金紙 |
| 類別 | 沖帳 / 特別費 / 嗚啦啦 + `icons/home` / 餐飲類 + `icons/thumbtack` / 餐飲服務 + `icons/thumbtack-slash` |
| 定價 | 58888 / 78888 / 555 / -100000 / 89898989 |
| 排序 | 1 |
| 上架 | 第一列 `icons/check-green`，其餘空白 |
| 管理 | 修改 / 複製 / 專案 / 停用 pill buttons；若該 row 沒有 `thumbtack` 或 `thumbtack-slash` 狀態，不顯示「專案」 |

Table 行為:
- 外層 `overflow-x-auto`
- table 使用固定欄寬與 `width` 觸發水平捲動，不使用 mobile unsafe `min-width`
- table 內容與 header 文字左右置中；管理按鈕群組在管理欄中置中
- mobile/tablet 截圖中的右側 action 裁切來自 table 容器水平 overflow，不是欄位壓縮
- row horizontal borders 使用 `Color/Text/800`
- default「啟用」狀態有 14 筆 rows；「停用」狀態有 5 筆 rows。狀態 tab count 由 JS 依當下資料 state 即時計算。
- 每一列都必須保留管理按鈕；不得用 demo data 旗標隱藏整欄 action。row 2、row 3 與後續 rows 的管理欄需正常渲染。

### Product Data Modal

產品設定「新增」modal:

- Header: `產品新增` + `icons/close`，不顯示 demo 副標
- Body: 兩欄 grid；mobile 改單欄
- 每個一般欄位維持「左 label / 右 input 或 control」佈局，不改成 label 在上、input 在下；label 與右側 control 需像房型 modal 一樣垂直置中
- 小尺寸 `<640px`：modal 滿版，box 貼齊 viewport，無外距、無圓角、無陰影，與房型 modal 行為一致
- 欄位順序:
  - 類別 select，default `[888]沖帳`
  - 產品描述：`住宿加購`、`線上隨單加購`
  - 產品編號 disabled input，value `12`
  - 品名 input，value `房費折抵`
  - 定價 input，value `2000`，hint `填0為免費`
  - 排序 input，value `14`
  - 數量限制 input，value `2000`，hint `訂購上限/筆`
  - 上架 iOS-style toggle，default off
  - 產品介紹文案 card：`尚未填寫` + `icons/edit`「編輯」
  - 品名文案 card：`尚未填寫` + `icons/edit`「編輯」
- Footer: 取消 / 儲存
- 修改 / 新增模式：欄位可編輯，產品編號維持 disabled；點「上架」toggle 後，panel 直接在 toggle button 下方長出，不使用 floating / absolute popup
- 上架 panel：內容依 UI layout，不加額外標題或 footer button；包含「設定開放日期」起迄日、`~`、calendar icons、「設定開放時段」toggle、起迄時段、`時` 與提示 `時間範圍：1～24。關閉開關時，為全天開放。`
- 上架 panel 小尺寸 `<768px`：設定開放日期的起日 / 迄日上下排列，`~` 置中，避免兩個日期控制橫向擠壓
- 查看模式：資料內容全部 disabled，包含 input / select / 上架 toggle / 文案編輯按鈕；footer 儲存隱藏，取消文案改「關閉」，且按鈕使用房型查看 modal 同款黑底反白樣式

### Project Modal

產品設定「專案」modal:

- Trigger: 只在產品 row 有 `thumbtack` 或 `thumbtack-slash` 狀態時顯示「專案」按鈕；click 開啟 `modalPurchaseAddonProjectBackdrop`
- Header: `專案設定` + `icons/close`
- Modal size: desktop 800px 寬、568px 高視覺；小尺寸 `<640px` 滿版，與其他加購商品 modal 一致
- Body:
  - 第一列兩欄：`產品代號` disabled input、`品名` disabled input
  - 第二列：
    - `專案分類` select，選項只有 `限定` / `不限`，default `不限`
    - `類別條件` select，選項只有 `不限` / `造飛機專案`，default `不限`
    - `專案分類` 為 `不限` 時，`類別條件` 不顯示
  - `專案清單列表`：
    - modal 初始狀態為 `全選` active，`取消全選` inactive，專案 chip 全部 selected
    - `專案分類 = 限定` 且 `類別條件 = 造飛機專案` 時，列表暫定只顯示 `[999] 飛天六人滿意` + `網` / `企` badge、`[89] 地勤很辛苦`、`[09] 空姐滿班`
    - `專案分類 = 不限` 時，即使隱藏中的 `類別條件` value 仍是 `造飛機專案`，列表也要恢復顯示全部 6 個 demo chips
    - `全選` / `取消全選` 為單選 active 狀態，active 判斷以目前可見 chips 為準；點 `全選` 時全部 demo chips selected，點 `取消全選` 時全部 demo chips unselected
    - 不論 `全選` 或 `取消全選` active，chips 仍可個別點擊切換 selected；當目前可見 chips selected 數量不再是全部或 0，`全選` / `取消全選` active 都要取消
    - `類別條件` 可見時，切換 `類別條件` 不會重置 `全選` / `取消全選` 與 chips selected 狀態
    - Demo 專案: `[999] 飛天六人滿意` + `網` / `企` badge、`[419] 不可告人優惠`、`[123] 劍湖山吃到飽`、`[443] 大利大吉` + `註` badge、`[89] 地勤很辛苦`、`[09] 空姐滿班`
- Footer: 取消 / 儲存

## 類別設定

### Controls

- 沿用商品 tabs、啟用 / 停用 tabs、全部顯示 / 分頁 toggle、住宿加購圖例
- 不顯示產品設定的搜尋列與 quick chips

### Category Table

欄位:

| 欄位 | 內容 |
|---|---|
| 順序 | 1, 2, 3, 4, 5；此欄 bg `Color/Neutral/200` |
| 代號 | 22, 33, 44, 66, 1999 |
| 館別 | 總部 / 本館 / 本館 / 總部 / 總部 |
| 品名 | 餐飲服務 + `icons/home` / 音樂服務 / 三加餐宵夜 / 大聯盟贊助 / PEACE |
| 型態 | 商品 |
| 設定數量 | 21 / 5 / 99 / 1 / 1；第一列 21 為藍色連結樣式 |
| 排序 | 1 |
| 管理 | 修改 / 複製 / 停用 pill buttons |

Table 行為:
- table 內容與 header 文字左右置中；管理按鈕群組在管理欄中置中
- 當 table 內容寬度未填滿橫向可用空間時，類別 table 外層 outline 需往內縮到 table 內容寬度；小尺寸仍保留水平 overflow

## Interaction

- Section header chevron: 展開 / 收合 section body
- 商品 tabs / 狀態 tabs / quick chips: 單選 active 樣式
- 重整: reload current page
- 清除: 清空產品設定輸入框
- 新增 / 修改 / 查看: 開啟 `modalPurchaseAddonDataBackdrop`；modal 標題依產品 / 類別與新增 / 修改 / 查看切換
- 照片管理: 點產品表格「照片管理」縮圖 / 空圖示開啟 `modalPurchaseAddonPhotoGalleryBackdrop`
- 停用 / 啟用: 同房型頁，以前端 in-memory state 切換 row 狀態，row 會從目前 tab 消失並出現在另一個 tab，count 即時更新
- 複製 / 查詢: Figma 未定義本輪行為，保留 button 樣式，不改資料
- 專案: 只在產品 row 有 `thumbtack` 或 `thumbtack-slash` 狀態時顯示；點擊開啟 `modalPurchaseAddonProjectBackdrop`，不可誤用產品資料 modal
- mobile: 商品分類列 input + select 同列，select 文字需 truncation；清除 / 查詢置中；管理 pill buttons 不可因容器擠壓變形

## 產出驗證重點

- `body[data-page="加購商品"]` 能讓 aside 加購商品 active
- `page-tabs.js` 有 `purchase-addon.html` ->「加購商品」
- `scripts/lint-partials.py` MANIFEST 登記本頁 partials / modules
- `app.css` import `purchase-addon.css`，且 `scripts/smoke-test.mjs` 的 CSS import check 同步更新
- Desktop 顯示 aside/topbar；767/375 使用 mobile shell，內容滿版
- 產品設定與類別設定 default 啟用狀態各有 14 筆資料，停用狀態各有 5 筆資料，table 水平 overflow 可用
- 產品設定與類別設定 default 啟用狀態各顯示 14 筆；切分頁後顯示 5 筆與 pagination
- 限定專案 icon 橘色填色
- data modal / photo modal 可開關，photo modal 有 5 個 slot
限定專案 icon 必須為橘色填色；實作使用 `thumbtack.svg` mask + `Color/Brand/Brand-400`。
