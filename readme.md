# Swift 前端交付與後端套用指南

本專案提供房間預訂系統後台的頁面、共用元件與互動示意。主要採用原生 HTML、Tailwind Play CDN 與原生 JavaScript ES modules，無框架與 build step。

後端套用時，請以各頁原始檔、共用模組及對應規格為依據。畫面上的範例資料與瀏覽器內互動用於展示操作方式，正式資料、權限、儲存、驗證與統計由後端依現有系統整合。

## 目錄

1. [目前架構、來源資料夾與頁面對照](#1-目前架構來源資料夾與頁面對照)
2. [複雜功能與共用示意](#2-複雜功能與共用示意)
3. [Login 登入狀態](#3-login-登入狀態)
4. [Status 狀態頁](#4-status-狀態頁)
5. [住房統計表與下方動態統計圖](#5-住房統計表與下方動態統計圖)

## 1. 目前架構、來源資料夾與頁面對照

### 頁面與公司檔案對照

「VS Code 檔名」欄連結至本專案的原始 HTML。公司資料夾與 PHP 對應如下，實際部署時由後端調整路由及資源路徑。

| 編號 | 中文頁面 | VS Code 檔名 | 公司資料夾／對應檔案 |
|---|---|---|---|
| 1 | 系統基本 | [system-basic.html](preview/system-basic.html) | `sys04/sys04_index.php` |
| 2 | 帳號及權限 | [account-permission.html](preview/account-permission.html) | `user01/user_index.php` |
| 3 | 民宿資料 | [lodging-info.html](preview/lodging-info.html) | `info01/info_index.php` |
| 4 | 房型 | [room-type.html](preview/room-type.html) | `info02/info_index.php` |
| 5 | 加購商品 | [purchase-addon.html](preview/purchase-addon.html) | `pr01/type_index.php` + `pr02/info_index.php` |
| 6 | 專案內容 | [project-content.html](preview/project-content.html) | `os03/os03_index.php` |
| 7 | 數量價格表 | [quantity-price-table.html](preview/quantity-price-table.html) | `os04/index.php` |
| 8 | 訂單處理 | [order-processing.html](preview/order-processing.html) | `rv01/rv01_index.php` |
| 9 | 房間預訂 | [room-booking.html](preview/room-booking.html) | `fp01/fp01_index.php` |
| 10 | 會員資料 | [member-data.html](preview/member-data.html) | `mem01/mem01_index.php` |
| 11 | 住房統計 | [housing-statistics.html](preview/housing-statistics.html) | `rp26/rp26_index.php` |
| 12 | 簡訊文本與發送 | [sms-text.html](preview/sms-text.html) | `ecard02/ecard02_index.php` |
| 13 | 排程發送 | [scheduled-send.html](preview/scheduled-send.html) | `ecard01/ecard01_index.php` |

補充入口: [landing.html](preview/landing.html) 為「今日總覽」。Login 與 Status 為獨立外層頁面，對照見第三、四部分。

加購商品的產品設定與類別設定在同一份 `purchase-addon.html` 中示範，對應公司既有的兩個 PHP 檔案，後端可依現有功能分別套用。

### 資料夾與用途

| 來源位置 | 內容 | 後端套用重點 |
|---|---|---|
| [preview/](preview/) | 各個獨立 HTML 頁面 | 依上表尋找頁面與主要 DOM 結構 |
| [preview/partials/](preview/partials/) | 側欄、頂部工具列、共用彈窗等 HTML 區塊 | 共用側欄為 `aside.html`，工具列為 `topbar.html`；各頁只載入需要的 partial |
| [preview/js/](preview/js/) | 頁面行為、共用元件、資料示例與狀態管理 | 從該 HTML 底部的 module imports 找到初始化入口 |
| [preview/assets/css/base.css](preview/assets/css/base.css) | 色彩、間距、字級等 CSS variables 與全域基礎樣式 | 與頁面樣式一併載入；色彩對應 Figma Variables |
| [preview/assets/css/app.css](preview/assets/css/app.css) | 共用 CSS 入口，以 `@import` 組合各領域樣式 | 保留 import 順序及其引用的 CSS 檔案 |
| [preview/assets/css/](preview/assets/css/) | 頁面及共用元件樣式 | 如 `modals.css`、`pagination.css`、`login.css`、`status.css` |
| [preview/assets/icons/](preview/assets/icons/) | 原始 SVG 圖示 | 保留檔案與引用路徑，避免另換近似圖示 |
| [preview/assets/images/](preview/assets/images/) | 插圖與其他靜態圖檔 | Login、Status 等頁面會引用此處素材 |
| [components/](components/) | 元件規格與共用行為 | 查詢彈窗、表單、分頁、編輯器等詳細規則 |
| [specs/pages/](specs/pages/) | 各頁的內容、互動與後端交付邊界 | 對應頁面實作的詳細說明 |
| [specs/assets/tokens.md](specs/assets/tokens.md) | 設計 token 定義 | 修改色彩、間距及字級前先核對來源 |
| [scripts/](scripts/) | Lint 與瀏覽器驗證腳本 | 使用方式見 [scripts/README.md](scripts/README.md) |

### 本機預覽

在專案根目錄執行:

```bash
python3 -m http.server 8000 --directory preview --bind 127.0.0.1
```

開啟 [今日總覽](http://localhost:8000/landing.html)，或將網址中的檔名換成上表的頁面，例如 [民宿資料](http://localhost:8000/lodging-info.html)。

原始檔連結可在 GitHub 查看程式碼；互動預覽請透過 HTTP 服務開啟。直接以 `file://` 開啟 HTML，會影響 `fetch` partial 與 ES modules 載入。現有頁面亦會使用 CDN 資源與 Google Fonts，預覽環境需能載入相關資源。

### PHP 套版與載入順序

1. 先選定上表的 HTML 與對應的 [頁面規格](specs/pages/)，再替換為公司既有資料與 PHP 模板。
2. 一併保留該頁引用的 CSS、JS、圖示、圖片與 partial。只複製 HTML，會缺少共用區塊或互動。
3. 現有 [partials.js](preview/js/partials.js) 會載入 `data-partial` 指定的區塊。先 `await loadPartials()`，再執行頁面及彈窗初始化。若改由 PHP include 輸出共用區塊，需避免重複輸出同一個 DOM，並保留初始化所需的結構。
4. CSS 透過 `base.css` 與 `app.css` 載入；既有 `class`、`id`、`data-*` 同時供樣式與事件使用，替換資料時需保留這些掛接點。
5. 公司 PHP 頁面分散於不同子資料夾，需同步處理選單連結、圖片、CSS、JS 與 partial 的路徑。`fetch` 的相對 URL 依頁面位置解析，module import 依模組檔位置解析，CSS `url()` 依 CSS 檔位置解析。
6. [page-tabs.js](preview/js/page-tabs.js) 目前以 HTML 檔名辨識頁籤，並用 `sessionStorage` 保存已開頁籤。改為 PHP 路由時需同步調整頁籤對照與導航；公司存在多個同名 `info_index.php`，應使用完整路徑或唯一頁面識別，避免混淆。

架構與實作慣例見 [頁面架構](specs/page-architecture.md)、[HTML 共用規範](specs/html-conventions.md)。維護本專案時請先閱讀 [start.md](start.md)。

## 2. 複雜功能與共用示意

部分複雜功能集中在代表頁面中示範，供後端依需求套用到其他頁面。多語系及編輯器文案內容修改，主要請參考 [民宿資料](preview/lodging-info.html)。

### 民宿資料的示範入口

| 功能 | 操作入口 | 示範內容與套用範圍 |
|---|---|---|
| 多語系狀態總覽 | 頁面上方「多語系狀態」按鈕 | 查看語言狀態、分類與列表的版型；內容為示例，正式狀態由後端提供 |
| 須知與聲明文案 | 各分館列的「須知與聲明」卡片，選擇分類後按「編輯」 | 分類與語言各自管理內容，示範空狀態、已儲存內容、編輯、取消、儲存與來源範本套用 |
| 分館介紹文案 | 分館基本資訊卡按「修改」或「設定」，在彈窗內找到「飯店介紹文案」，按「編輯」 | 示範彈窗內的多語系文案編輯；其他文案卡的靜態空狀態可依此模式延伸 |

### 編輯器與多語系的整合邊界

- 現階段使用 textarea 與 SunEditor 外觀的示意工具列。可輸入文案，但尚未載入真正的 SunEditor；格式工具列按鈕為 disabled，沒有實際富文本格式處理。
- 各語言內容分開暫存，編輯期間切換語言可保留草稿；「取消」捨棄本次編輯，「儲存 / 全部儲存」更新目前示範狀態。
- 須知與聲明的現有示例以目前分類為儲存範圍；「全部儲存」更新該分類的各語言，尚未實作四個分類一起提交的交易流程。正式跨分類儲存及取消需依 [須知與聲明規格](components/lodging-branch-notice-card.md) 整合，不能將示例直接視為完整的跨分類儲存實作。
- 此處的儲存位於頁面記憶體，重新整理後會回到初始示例。正式內容、語言清單、儲存結果與狀態需由後端資料驅動。
- 「多語系狀態」總覽的英文、韓文、日文、德文頁籤目前只切換選中外觀，共用同一份示例內容；正式版需依各語言資料呈現狀態。
- 「翻譯」按鈕目前只顯示尚未串接的提示。正式翻譯服務與翻譯結果寫回由後端整合。
- 正式接上富文本編輯器後，需整合各語言的內容讀寫及後端 HTML 內容過濾；目前的純文字示範不代表已具備正式富文本儲存流程。

| 來源檔案 | 用途 |
|---|---|
| [lodging-info-modals.html](preview/partials/lodging-info-modals.html) | 分館資料、照片管理與多語系相關彈窗結構 |
| [lodging-notice-card.js](preview/js/lodging-notice-card.js) | 須知與聲明卡的分類、語言、草稿、來源範本與儲存流程 |
| [lodging-branch-content-card.js](preview/js/lodging-branch-content-card.js) | 飯店介紹文案的編輯流程 |
| [suneditor-instance.js](preview/js/suneditor-instance.js) | 編輯器示意 instance 的共用建立與內容存取介面 |
| [lodging-info-modals.js](preview/js/lodging-info-modals.js) | 分館彈窗、多語系狀態頁籤與照片示例行為 |
| [lodging-info.css](preview/assets/css/lodging-info.css)、[toast.js](preview/js/toast.js) | 民宿資料頁樣式與操作提示 |
| [lodging-branch-suneditor.md](components/lodging-branch-suneditor.md) | 編輯器與多語系詳細規格及正式串接方向 |

### 其他共用部分

| 共用功能 | 參考來源 | 套用方式 |
|---|---|---|
| 側欄、頂部工具列及頁籤 | [aside.html](preview/partials/aside.html)、[topbar.html](preview/partials/topbar.html)、[page-shell.js](preview/js/page-shell.js)、[page-tabs.js](preview/js/page-tabs.js) | 沿用共用結構，依公司路由更新導航及頁面識別 |
| 彈窗與子彈窗 | [modal-controller.js](preview/js/modal-controller.js)、[modals.css](preview/assets/css/modals.css) | 沿用開關、疊層、關閉後焦點及頁面捲動鎖定機制 |
| 照片排序 | [photo-sort.js](preview/js/photo-sort.js) | 共用操作手勢，各頁維持自己的照片資料與儲存流程 |
| 全部顯示 / 分頁 | [pagination.css](preview/assets/css/pagination.css)、[pagination.md](components/pagination.md) | 統一使用置中的圓形上一頁 / 當前頁 / 下一頁，頁數與資料由各頁管理 |
| 日期快捷範圍 | [date-periods.js](preview/js/date-periods.js) | 參考既有日期範圍計算，各報表查詢結果仍由後端產生 |

各功能的詳細範圍請以對應頁面規格為準。部分示例使用瀏覽器記憶體或 storage 保存操作狀態，正式套用時需接回既有的資料與權限流程。

## 3. Login 登入狀態

Login 提供四個獨立 HTML，供後端依登入流程選用。這四頁展示各種狀態，頁面之間不會自行判斷驗證結果或自動跳轉。

| 連結名稱 | 獨立檔案 | 簡易描述 |
|---|---|---|
| Login 1 - 一般登入 | [login1.html](preview/login1.html) | 一般帳號與密碼登入畫面，含 Google 登入入口與 Cloudflare 示意區塊 |
| Login 2 - 帳號密碼錯誤 | [login2.html](preview/login2.html) | 登入表單顯示帳號密碼驗證失敗的提示，供後端在驗證不通過時套用 |
| Login 3 - Cloudflare 驗證失敗 | [login3.html](preview/login3.html) | 顯示 Cloudflare「失敗 / 版本過舊」狀態與重新整理入口，仍保留 Google 登入 |
| Login 4 - Email 驗證碼 | [login4.html](preview/login4.html) | 輸入寄送至 Email 的驗證碼，顯示驗證碼逾時無效提示 |

### 後端接點

- 帳密驗證、Google OAuth、驗證碼寄送與效期、登入後 session 及頁面選用，由後端整合。
- Cloudflare 區塊僅供版型示意，正式版請套用公司現有模組。
- Google 與聯絡資訊區塊預設收合；登入前三頁提供 Google 登入，驗證碼頁不顯示 Google 登入區塊。
- 安全政策與隱私權目的地由後端提供。聯絡資訊採 Email。

共用結構見 [login-form.html](preview/partials/login-form.html)，互動見 [login.js](preview/js/login.js)，樣式見 [login.css](preview/assets/css/login.css)。

| 事件名稱 | 用途 |
|---|---|
| `login:submit` | 取得目前頁面、狀態及有效欄位值，交由後端驗證 |
| `login:google` | Google 登入入口 |
| `login:policy` | 依 policy 值處理安全政策或隱私權連結 |
| `login:refresh` | Cloudflare 失敗頁的重新整理入口 |

上述事件會從表單向外冒泡，現有示意程式不會呼叫驗證 API。詳細介面見 [Login 頁面規格](specs/pages/login.md)。

## 4. Status 狀態頁

Status 提供四個獨立 HTML，由後端依實際情況決定顯示哪一頁，並設定對應的 HTTP 狀態及返回位置。

| 連結名稱 | 獨立檔案 | 簡易描述 |
|---|---|---|
| Status 1 - 網頁不存在 | [status1.html](preview/status1.html) | 顯示網頁不存在的標題、插圖及返回入口 |
| Status 2 - 拒絕非台灣 IP | [status2.html](preview/status2.html) | 顯示拒絕非台灣 IP 與「請聯繫系統商尋求協助」提示，含返回入口 |
| Status 3 - 其他錯誤 | [status3.html](preview/status3.html) | 顯示冰淇淋插圖與「有些地方出錯了」提示，含返回入口 |
| Status 4 - 網頁維護中 | [status4.html](preview/status4.html) | 顯示維護標題與插圖，沒有返回或其他操作按鈕 |

### 後端套用方式

- IP 判斷、錯誤分類、維護條件及實際 HTTP 狀態碼由後端決定；前端不進行 IP 偵測或自動分流。
- 前三頁共用 [status-return.html](preview/partials/status-return.html)。將 `[data-status-return]` 的 `href="#"` 改成該情境的實際目的地後，即採原生連結導航。
- 保留預設 `href="#"` 時，點擊只發送冒泡事件 `status:return`，其 `detail` 包含 `page` 與 `state`；不預設回上一頁、登入頁或總覽。
- 手機沿用相同排列，插圖依可用寬度等比縮小，圖文置中。

共用互動見 [status.js](preview/js/status.js)，樣式見 [status.css](preview/assets/css/status.css)，詳細說明見 [Status 頁面規格](specs/pages/status.md)。

## 5. 住房統計表與下方動態統計圖

參考頁面: [housing-statistics.html](preview/housing-statistics.html)。公司對應檔案: `rp26/rp26_index.php`。

**住房統計表下方的動態統計圖，由後端工程師依現有資料與既有統計邏輯套用。**

### 目前提供的內容

- 查詢條件、日期快捷範圍、去年同期比較與 NoShow 選項。
- 本期統計表與去年同期對照表的版型、欄位、橫向捲動及響應式排列。
- 統計說明與下載入口。
- 表內的筆數、間數、金額、人數、累計值、前期差異及成長率目前是示例快照，未接實際資料庫或進行正式統計計算。
- 下方動態統計圖屬於後端整合項目，目前交付頁面尚未加入該區的動態圖表渲染。

### 後端套用事項

1. 依公司既有資料來源與統計規則取得報表資料，處理日期、訂房來源、國籍、分類、去年同期比較與 NoShow 等查詢條件。
2. 依正式查詢結果填入表格，產生下方動態統計圖所需的資料序列；圖表指標、分組、時間粒度與計算方式依公司現有資料及需求決定。
3. 讓表格、去年同期對照與動態統計圖使用一致的查詢條件與統計口徑，並依查詢結果更新。
4. 接上既有的報表下載功能，依實際查詢結果產生檔案。

| 來源或接點 | 用途 |
|---|---|
| [housing-statistics.js](preview/js/housing-statistics.js) | 日期、查詢條件、比較區塊顯示與查詢 / 下載事件 |
| [housing-statistics-tables.js](preview/js/housing-statistics-tables.js) | 統計表版型產生與欄位呈現 |
| [housing-statistics-demo.js](preview/js/housing-statistics-demo.js) | 現有示例資料快照，正式套用時改接後端資料 |
| `housing-statistics:query` | 提交查詢時，從頁面冒泡發送目前查詢條件快照 |
| `housing-statistics:download` | 點擊下載時，發送最後已套用的查詢條件快照 |

現有查詢不會自動重算示例表格，下載入口也不會自行產生檔案。後端可使用上述接點整合既有查詢、下載與圖表更新流程。詳細規格見 [住房統計表](specs/pages/housing-statistics.md)。
