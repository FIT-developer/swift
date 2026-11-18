# Page: 會員管理 -> 會員資料 (member-data)

**狀態**: self-tested / user-authorized commit & push. 主頁桌面稿與 5 張 table 狀態已確認,
使用者於 2026-11-12 授權開始實作, 並確認沿用既有管理頁的頁殼 / RWD
及 demo 操作慣例. 尚未另讀的業務細節交後端, 不自行新增產品規則.
**讀取與確認日期**: 2026-11-12.

## Current source 與範圍

| 用途 | Node id | Node name | Frame size |
|---|---|---|---|
| 主頁桌面稿 | 2754:110881 | Content page - 會員資料 default 1106 v1.1 | 1440 x 1584 |
| 一般 table | 2772:110126 | table default | 2006 x 724 |
| 批次模式, 未選取 | 2770:106042 | table - lock button clicked | 2028 x 774 |
| 選取兩筆未鎖定 | 2770:106609 | table - selected two of them checkboxs, in all unlock status | 2028 x 774 |
| 混合選取 | 2772:108749 | table - selected two of them checkboxs, two unlocked, one locked button. | 2028 x 774 |
| 全選搜尋結果 | 2772:109157 | table - selected all | 2028 x 774 |

- 主頁內嵌 table 為 2772:109587 / 2772:109588, 與一般 table
  2772:110126 的結構, 文字, 尺寸及 styles 相同, 已交叉比對.
- 主頁截圖裁切右側欄位; 獨立一般 table 截圖已核對完整 15 欄.
- 五張 table 均已讀取 JSON, PNG, SVG.漸層, 單邊框與可見內容以渲染圖
  交叉核對, 不將 JSON 中未渲染的圖層當作可見內容.
- 混合選取 frame 名稱雖寫 two, 實際為 3 筆選取, 以畫面與使用者確認為準.
- 圖面選取狀態, 會員資料, 日期, 99 / 8 / 14 / 20 等數字均屬展示,
  不直接作為產品預設值或固定統計.
- 本輪使用者確認事項優先於上述圖面的展示狀態.
- 使用者明確指定名稱旁箭頭沿用房間預定底部王大頭先生旁的展開內容.
  該入口為 data-data-exists-trigger, 開啟既有會員資料 modal
  modalMemberDataBackdrop; 本次明確沿用範圍為
  [會員資料 modal](../../components/member-data-modal.md) 與其更換合約公司子 modal,
  包含現有的多分館展示內容與交互.

## Children checklist

主頁 root 的直接 children:

| Node id | Name | Type | Size |
|---|---|---|---|
| 2754:110103 | Frame 427319174 | FRAME | 1400 x 1560 |
| 2754:110382 | floatIcons/ai | INSTANCE | 40 x 70 |

2754:110382 已由使用者明確退役, 不施作本頁浮動 AI 客服 icon.
這是本頁範圍的更正, 不擴張為移除其他頁既有功能.

主頁結構: 2754:110103 -> 2754:110104 -> sidebar 2772:110626
與內容區 2754:110106.內容區依序:

| Node id | Name / 用途 | Type | Size |
|---|---|---|---|
| 2754:110107 | Frame 398 / 頁籤與功能列 | FRAME | 1140 x 36 |
| 2754:110112 | shirnk-model-1 / 查詢條件 | FRAME | 1140 x 526 |
| 2759:111770 | Frame 427319175 / 啟用, 停用 tabs | FRAME | 1140 x 46 |
| 2761:111895 | Frame 427319184 / 鎖定狀態篩選 | FRAME | 360 x 42 |
| 2762:105321 | Frame 427319185 / 顯示, 分頁, 下載 | FRAME | 544 x 42 |
| 2772:109587 | table default | FRAME | 2006 x 724 |

五張獨立 table root 均只有一個直接 child, type 均為 FRAME:

| Root | Child id | Child name | Size |
|---|---|---|---|
| 2772:110126 | 2772:110127 | Table desktop | 2006 x 724 |
| 2770:106042 | 2770:106043 | Table desktop | 2028 x 774 |
| 2770:106609 | 2770:106610 | Table desktop | 2028 x 774 |
| 2772:108749 | 2772:108750 | Table desktop | 2028 x 774 |
| 2772:109157 | 2772:109158 | Table desktop | 2028 x 774 |

一般 Table desktop child 為主表; 四張批次狀態均另有底部操作列.

## 桌面 layout 與樣式觀察

- 主頁參考稿外側 padding: 上下 12, 左右 20.
- Sidebar 參考寬 240, 與主內容 gap 20; 主內容參考寬 1140.
- 主內容各區塊依序垂直排列, gap 24.
- 查詢區: padding 20, radius 12, fill Color/Neutral/75,
  stroke Color/Neutral/200.三個欄組參考寬各 340, 水平間距 40.
- 中, 右欄 label 寬 100, label 與控制項 gap 12, 欄位寬 228;
  數值區間的兩個 input 各 98.5.
- 一般 input / select: radius 6, 白底 Color/Neutral/0,
  border Color/Neutral/200, 內側水平 padding 12, 垂直 padding 6.
- 日期類型按鈕: 參考高 36, radius 28, padding 10 / 16,
  選中填色 Color/SubItem/Selected.
- 主頁標籤與 table 文字主要為 16px / 400; 日期類型與月 / 日單位為 12px.
  Figma 序列化 font family 為 Noto Sans, 實作仍須依
  [tokens](../assets/tokens.md) 的專案字體規則處理.
- Table: 白底 Color/Neutral/0, radius 12, stroke Color/Neutral/200,
  padding 上下 12, 左右 16; 表頭高 40, 展示資料列高 110.
- Table 分隔線為水平單邊 stroke Color/Neutral/800, 不做四邊格線.
- 一般 table 內部寬 1974; 批次內部寬 1996.批次底部操作列高 42,
  與主表間距 8, 整體較一般 table 增高 50.
- 上述為 Figma 桌面測量值, 不代表已定義 mobile / tablet 的固定寬度或斷點.
  使用者後續已授權沿用管理頁 shared shell / responsive constraints;
  相關沿用 / 覆蓋清單見下方實作 checkpoint.

## 查詢區

### 左欄

- 日期類型按鈕依序為: 帳號建立日, 訂房日, 住房日(入住人),
  入住日(訂房人), 生日.圖面括號為全形, 實作時依 Figma 文字來源保留.
- 使用者確認: 這組按鈕預設全部不選, 僅供單選; 圖中黃色帳號建立日是展示.
- 下方為起訖兩個日期欄位, 圖面均展示 2026-02-27.
- 2026-11-12 驗收更正: 月曆只保留原稿日期欄位與 calendar icon 的 UI layout,
  使用唯讀文字欄位顯示 YYYY-MM-DD, 不開啟瀏覽器原生 picker, 不接日期選擇套件.
  後續由後端搬入既有共用月曆樣式與程式碼; 本輪不實作月曆彈層.
- 日期快速控制有 今日 / 本週 / 本月 / 今年, 每組含左右切換圖示.
  先前確認的快捷日期填值與假資料查詢 / 清除示範保留.
- JSON 另含訂房間數文字, PNG 未顯示, 不列為可見欄位.

### 中欄

依序為: 館別, 國籍, 三方串接, 性別, 包含條件, 生日月日, 名稱, 證號.

- 三方串接展示選項: 不限 / Google / Line / Facebook.
- 性別展示選項: 不限 / 男 / 女 / 其他.
- 包含條件展示選項: 無 / Email / 行動電話 / 地址.
- a / b / c 類文字是 selection 選項示意, 不直接當成一個已選值.
- 包含條件為單選.
- 生日月日展示值依使用者更正為 1 月 1 日; 原 0 日是示意錯誤.
  使用者要求直接採用口述更正, 不重讀這一處.

### 右欄與 footer

- 依序為: 行動電話, Email, 地址, 備註, 消費額區間, 訂房次數區間,
  入住次數區間.
- 名稱, 證號, 行動電話的 label 在圖面使用 Color/Surface/Brand-Default,
  不由此推論為必填或驗證錯誤.
- Footer 右側為清除 / 查詢, gap 8; 參考尺寸各 56 x 34, radius 6.
- 清除為 Color/Neutral/200 灰底; 查詢為 Color/Neutral/800 深底.
- 使用者允許後續以假資料提供日期, 查詢, 清除, 筆數的基本連動,
  沿用其他管理頁的展示互動.
- 消費額是否對應 table 的訂房金額交給後端, 前端不自行定義業務對應.
- 使用者允許沿用既有管理頁 demo 慣例: 日期快速控制以目前日期為基準,
  左右按鈕依今日 / 本週 / 本月 / 今年移動對應區間, 清除重設表單及選取.
  日期類型重設為不選, 查詢字串及數值區間清空, 不改會員資料本身.
- Demo 的館別 / 國籍 / 三方串接 / 性別 / 包含條件使用圖面選項與假資料;
  真實後端選項及消費額 / 入住人 / 訂房人 / 生日的業務對應不在本次定義.

## Table 欄位與展示資料

| 順序 | 欄名 | 一般欄寬 | 批次欄寬 | 排序圖示 |
|---|---|---:|---:|---|
| 1 | 類別 | 88 | 110 | 有 |
| 2 | 名稱 | 152 | 152 | 有 |
| 3 | 鎖定狀態 | 172 | 172 | 無, 有批次入口 |
| 4 | 性別 | 88 | 88 | 有 |
| 5 | 證號 | 121 | 121 | 有 |
| 6 | 生日 | 107 | 107 | 有 |
| 7 | 行動電話 / 市話 | 135 | 135 | 無 |
| 8 | 國籍 | 88 | 88 | 有 |
| 9 | 地址 | 219 | 219 | 無 |
| 10 | Email | 230 | 230 | 無 |
| 11 | 訂房金額 | 120 | 120 | 有 |
| 12 | 訂房次數 | 120 | 120 | 有 |
| 13 | 入住次數 | 120 | 120 | 有 |
| 14 | 帳號建立日 | 136 | 136 | 有 |
| 15 | 備註 | 78 | 78 | 無 |

- 類別有兩行文字.名稱欄包含姓名, 右側圖示按鈕, 啟用 / 停用操作,
  刪除個資操作.
- 展示姓名依序為 AlongNa, Frank, Lucy, Welson, Ebson, XYZ123.
  Lucy / Welson 展示已鎖定且操作文字為啟用; 其餘展示未鎖定且操作文字為停用.
  這些組合不代表啟用狀態與鎖定狀態綁定.
- 生日的 ** 為個資隱碼; 日期內容為西元年 / 月 / 日組合,
  圖面實際字串如 1911-**-**.
- 行動電話與市話分兩行, 市話展示 02-****-****.
- 空白資料保持空白, 不自行加入替代文案.

## 一般模式與啟用 / 停用

- 啟用 / 停用操作互換, 並依當下資料狀態分類列表與更新統計,
  沿用 [房型頁](room-type.md) 與 [加購商品頁](purchase-addon.md) 的邏輯.
- Figma 的混合 rows 與 99 / 8 等數量為示意; demo 統計由同一份假資料計算,
  不將圖面的數字固定寫死.
- 鎖定狀態篩選為全部 / 已鎖定 / 未鎖定; 圖中已鎖定黃色是展示.
  使用者授權沿用既有慣例後, demo 初始為啟用 tab / 全部鎖定狀態 / 全部顯示.
- 顯示控制是單一交換按鈕, 同一顆切換全部顯示 / 分頁, 旁邊另有下載.
  使用者更正: 圖面同時畫兩種狀態供示意, 實際不並排產生兩顆.
  按鈕文字與 all-pages / split-page icon 隨目前模式切換, 同加購商品頁.
  Demo 每頁 5 筆, 頁碼採既有上一頁 /
  當前頁 / 下一頁控制; 切換頁碼保留選取, 切換顯示模式只改可見範圍.
- 2026-11-18 使用者指定全站沿用加購商品分頁: 上一頁 / 頁碼 / 下一頁
  均為36px圓形且左右置中, 不再使用靠右34px方角版.
  使用共用 [Pagination](../../components/pagination.md), 保留每頁5筆與既有state.
- 共用分頁已在320 /375 /768 /1440寬度 self-tested, 包含鍵盤切頁、
  首末頁邊界、全部顯示切換、會員與公告共用彈窗的分頁置中.
- 排序依原始資料順序起始, 點有排序圖示的欄位切換升冪 / 降冪.
  下載匯出目前搜尋結果的 CSV, 不限當頁; 真實匯出 API 交後端.
- 一般模式每列以 toggle 表達鎖定狀態: 已鎖定為綠色 on,
  未鎖定為灰色 off; 改變的是該會員的鎖定狀態.
- 使用者最新確認: 會員已鎖定時, 啟用 / 停用操作與刪除個資操作均 disabled.
  包含圖中 Lucy 的啟用按鈕, 不只停用文字的那一態.
- 刪除個資將採 Yes / No 詢問; 該彈窗目前無設計, 正式刪除由後端實作.
  不自行定義彈窗文案, 資料清除算法或成功狀態.

## 批次模式 contract

### 進入與退出

- 一般模式表頭顯示藍框批次調整; 進入後改為藍底結束批次.
- 批次模式在類別欄加入表頭與逐列 checkbox, 一般欄寬 88 改為 110.
- 原逐列鎖定 toggle 改為鎖頭圖示與已鎖定 / 未鎖定文字,
  批次期間不能透過逐列控制調整鎖定.
- 批次期間名稱右側圖示, 啟用 / 停用, 刪除個資均 disabled.
- 排序, 查詢, 切換篩選與分頁仍可操作.
- 清除選取: 取消所有勾選, 維持批次模式.
- 結束批次: 取消所有勾選, 回到一般模式.

### 選取範圍與保留規則

- 表頭全選跨分頁, 包含目前搜尋結果的全部資料, 不限畫面可見 rows.
- 換頁與排序保留選取.
- 重新查詢或切換篩選清空選取, 仍留在批次模式.
- 執行底部批次鎖定 / 解鎖後保留選取, 保持批次模式.
  不清空勾選, 不自動結束批次.
- Checkbox 有未選, 部分選取, 全選三態.未選白底灰框,
  部分選取為灰色橫線, 選中為 Color/MenuItem/Default 藍底.
- Checkbox 參考尺寸 14 x 14, radius 4.選取列的全部 15 欄
  使用 Color/Neutral/50 淺灰底.

### 底部操作與即時統計

- 底部順序為選取筆數文字, 鎖定 N 筆, 解鎖 N 筆, 清除選取.
- 鎖定 N 筆的 N = 已選取且目前未鎖定的會員數量.
- 解鎖 N 筆的 N = 已選取且目前已鎖定的會員數量.
- 鎖定只將選中未鎖定項目改為 true; 解鎖只將選中已鎖定項目改為 false.
  另一狀態的項目維持原值, 不將混合選取全部反轉.
- 操作後選取集合保留, 兩個 N 依更新後的鎖定狀態即時重算.
- N 為 0 的操作呈灰底 disabled 外觀; 有對應項目時, 鎖定使用
  Color/Brand/Brand-200 淡橘底與邊框, 解鎖使用
  Color/Accent/light-green 淡綠底與邊框.
- 批次 pill: radius 28, padding 上下 10, 左右 16, height 42.
  文字寬度依筆數伸縮, 不固定寫死 130.
- 混合選取範例: 選中 3 筆, 未鎖定 2 / 已鎖定 1.
  點鎖定後仍選 3 筆, 顯示鎖定 0 / 解鎖 3;
  點解鎖後仍選 3 筆, 顯示鎖定 3 / 解鎖 0.
- 全選範例文案為已全選搜尋結果共 20 筆資料, 鎖定 18 / 解鎖 2.
  20 是整個搜尋結果的展示總數; 畫面只畫 6 筆不代表統計錯誤,
  demo 必須依實際假資料總數計算.

## 顏色, 漸層與 token

- 停用操作漸層: Color/Accent/linear-function-button-delete
  (#F3C2C4) -> Color/Neutral/50 (#F6F6F6).
- 啟用操作漸層: Color/Accent/light-green
  (#BBF7D0) -> Color/Neutral/50 (#F6F6F6).
- Toggle on: Color/Accent/Green; off: 既有 --color-switch-off-track;
  knob: Color/Neutral/0.參考既有 member-data-switch pattern,
  實作前仍須核對本頁尺寸與 current component instance.
- Batch 的鎖頭圖示使用 Color/Surface/Brand-Active 表達已鎖定,
  未鎖定圖示為 Color/Neutral/800.
- 刪除個資: 使用者 Libraries 截圖確認綁定 Background/Danger/Default;
  node 2772:109611 的 JSON / PNG / SVG 確認目前渲染值 #EC221F,
  不透明度 100%, 白字 Color/Neutral/0, radius 4, padding 2 / 6.
- 這筆 Libraries token 已按使用者截圖與當前 node / SVG 的確認來源,
  單筆補入 tokens.md 與 base.css, 鏡像為 --background-danger-default.
  本地 figma-variables.json / MCP local definitions 只含 Semantic,
  不合併捏造的 Libraries export / ID, 不改動 Figma Variables.
- Strict mirror lint 已擴充檢查 Background/... 與既有 Color/...,
  這筆不改名為虛構 Color 路徑, 也不替換為近似的 Status-Negative.

## 實作 checkpoint (2026-11-12)

- 沿用: 獨立 member-data.html + partials + 原生 ES modules; 現有 aside,
  topbar, session / topbar modals, page-tabs 導覽, Noto Sans TC 字體.
- 沿用: 管理頁 shell 的 12px 外側 padding / 12px aside-main 間距.
  使用者已授權共用頁殼, 不再採 Figma placeholder sidebar 或根框左右 20px.
- 沿用: 小尺寸查詢欄位依可用容器寬度堆疊, table 在自己的容器水平捲動,
  tabs / pills 超寬時保持單列並原生水平捲動, 不讓頁面水平溢出.
  查詢區本身的 padding 20 / radius 12 / 三欄順序仍依本次稿.
- 沿用: 既有會員資料 / 更換合約公司 modal 的 markup, initMemberDataModal,
  createModalController 及原有國籍 / 稱謂 / 身份 / chip / filter 交互.
  抽為共用 partial 並掛回原先使用頁, 保持原 IDs 與關閉行為.
  展示內容沿用原本假資料, 不新增真實會員資料綁定.
- 會員資料大型父 modal 在小於 640px 時套用既有共用滿版規則;
  更換合約公司小型子 modal 保留原本置中的 320px 上限.
- 以本次 Figma 覆蓋: Table 白色表頭, 16px 字, 15 欄順序 / 寬度,
  水平分隔線, checkbox 三態, 批次操作 / 鎖定 disabled 規則.
  不複製其他 table 歷史範例的橘色表頭, 也不混入其他頁的操作按鈕.
- 以使用者確認覆蓋: 日期類型預設不選, 生日展示 1 月 1 日,
  批次動作保留勾選, 全選跨頁, 鎖定時連啟用按鈕一併 disabled,
  本頁不產生浮動 AI 客服 icon, 顯示模式只產生一顆交換按鈕.
- 資產: 新增精確 Figma icons/sort-alt-2 匯出, 不以 up-and-down 近似替代;
  Background/Danger/Default 補進本地 token 規格 / CSS 鏡像及 lint 檢查.
- 刪除個資只使用 Yes / No 確認, 正式刪除交後端; demo 不自行編造資料刪除結果.
- 日期類型生日與月日選單的業務查詢聯動仍交後端, 1 月 1 日只確定展示值.
  本次不新增 query 收合, 不自行展開其他未指定的 Figma frame.

## 實作與驗證 (2026-11-12)

- 最新月曆展示調整在 Chrome 375 / 768 / 1440 實測:
  兩個日期欄位皆為 readonly text, 保留 36px 高與 YYYY-MM-DD 格式;
  點擊 calendar icon 不開 picker. 快捷日期填值與清除仍可操作,
  頁面水平溢出為 0. 三張 PNG 與量測存於 specs/qa-screenshots/session-180/.
- 獨立頁 member-data.html, domain CSS member-data.css, 原生 state / demo /
  DOM modules, 共用 member-data-modal.html 已接至 page-tabs 與 sidebar.
  房間預定 / 訂單處理改用相同 modal partial, 原有 IDs 與交互保留.
- Demo 為 22 筆: 啟用 20 / 停用 2. 啟用結果內未鎖定 18 / 已鎖定 2,
  分頁每頁 5 筆. 所有統計依當下資料計算, 不寫死圖面數字.
- Chrome 完整 smoke exit 0: 11 頁 / 154 項, 會員資料 15 項.
  涵蓋單顆顯示交換按鈕, 跨頁全選, 排序 / 換頁保留選取,
  查詢 / 篩選清除選取但保留批次模式, 混合鎖定計數及 disabled guards.
- 逐一驗證父 modal header close / footer modify / footer clear,
  子 modal header close / cancel / confirm; 子層關閉後父層保持開啟與 scroll lock.
  兩層 data-no-dismiss 的 backdrop / Escape 行為維持既有規則.
- 360 / 375 / 600 / 768 / 900 / 1024 / 1200 / 1440 寬度量測頁面水平溢出為 0.
  Table 內寬 1974, 表頭 40, 資料列 110, 字體 16px;
  日期類型按鈕高 36, 字體 12px. 375 / 768 / 1440 多狀態視覺核對,
  36 張 PNG 與 geometry / interaction probes 存於
  specs/qa-screenshots/session-179/.
- 實際 Chrome 輸入驗證四種快捷日期區間,
  帳號建立日查詢及清除, keyboard focus-visible, Yes / No 確認兩條路徑,
  分頁模式 CSV 仍輸出全部 20 筆搜尋結果.
- Fonts / conventions / tokens / partials lint 與 git diff --check exit 0;
  strict token mirror 93 個 raw 值一致, partial manifest 11 頁 / 3 standalone.
- 正式會員讀寫, 個資刪除, 真實查詢選項, 生日 / 訂房人 / 入住人日期與
  消費額的業務對應仍交後端. 本次沿用的會員資料 modal 展示內容未綁定各列真實資料.
- member-data.html 與 landing.html 在 localhost:8000 均 HTTP 200.
  使用者核對後要求月曆保留 UI layout, 調整後於 2026-11-12 明確要求 commit & push.
