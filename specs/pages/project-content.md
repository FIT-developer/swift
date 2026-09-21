# 專案內容

> Current source: Figma `2530:90916`、`2424:92389`、`2424:92390`
> Read date: 2026-09-21
> Status: current

## 範圍

本頁是「產品設定 -> 專案內容」獨立頁，包含住宿／串接兩種專案清單，以及
共用的新增／修改三步驟 modal。頁面使用既有 multi-page shell、topbar、aside、
page tabs、session modals 與 topbar modals。

## Current Figma contract

| 區塊 | Node | 尺寸 |
|---|---|---|
| Desktop page | `2530:90916` `專案內容 desktop 2027 v.1.1` | 2548 x 1184 |
| 住宿 modal batch | `2424:92389` | 2588 x 1322 |
| 住宿 Step 1 | `2423:88883`，modal `2423:89025` | 820 x 1229，modal 800 x 1209 |
| 住宿 Step 2 | `2423:89029`，modal `2423:89312` | 820 x 1322，modal 800 x 1302 |
| 住宿 Step 3 | `2423:89313`，modal `2423:89464` | 820 x 1064，modal 800 x 1044 |
| 串接 modal batch | `2424:92390` | 2588 x 1322 |
| 串接 Step 1 | `2423:89465`，modal `2423:89585` | 820 x 1055，modal 800 x 1035 |
| 串接 Step 2 | `2423:89586`，modal `2423:89869` | 820 x 1322，modal 800 x 1302 |
| 串接 Step 3 | `2423:89870`，modal `2423:90021` | 820 x 1064，modal 800 x 1044 |

## 頁面

### 上方操作

- 頁面右上方有「新增」膠囊按鈕。
- 內容 tab 順序是「住宿」、「串接」。Figma 截圖顯示串接為選中展示狀態，
  preview 初始值沿用頁面內容最先出現的「住宿」。
- 狀態 filter 順序：全部（99）、上架（8）、下架（8）、過期（8）、刪除（8）。
- 狀態 filter active 使用 SemiBold 與 `Color/Brand/Brand-400` 下框。
- 「全部顯示（14 筆）」按鈕與 GHA chip 位於 table 上方。

### 專案 table

- table 外框使用 `Color/Neutral/200`、Radius/12、白底，內容可水平捲動。
- 欄位順序：編號、類別、照片管理、專案名稱、上架期限、專案期限、適用房型、
  已開至、已設至、價格、排序、管理、價格更新、最後更新時間。
- Figma sample row：編號 22、類別限時／BB／GHA、專案名稱「我是名稱」，並展示
  天數、付款日、最少訂購數、訂金預收、內含、最多人數、退款等次要資訊。
- 管理操作：修改、複製、下架、刪除、查看、上架。
- 管理欄依 Figma `2530:91078` 為 620px；六顆操作按鈕依序單列置中，單顆
  88 x 36，按鈕之間 16px，不得換行、重疊或伸出管理欄。
- 適用房型的搜尋按鈕開啟選單；Figma 的展開選單是互動展示，不是頁面初始狀態。
- 底部操作為「整批修改排序」與勾選後的「整批更新專案價格」。

## 新增／修改 modal

### Session 與標題

- 三張 frame 是同一個 modal session 的 Step 1 -> Step 2 -> Step 3，不是三個獨立 modal。
- 點頁面右上「新增」時，三步 title 都只顯示「新增」。
- 點 row「修改」時，三步 title 都只顯示「修改」。
- 切換步驟時保留同一次開啟期間的表單值。
- 關閉後再開啟會重設到 Step 1 與對應 trigger 的模式。
- shell 寬 800、白底、`Color/Neutral/300` border、Radius/8。
- header 高 92；title 20px SemiBold；提示文字 16px Regular。
- step 圓點 42 x 42；active `Color/Brand/Brand-200`，inactive `Color/Neutral/100`。
- footer 高 58；Step 1 為清除／下一頁，Step 2 為上一頁／清除／下一頁，
  Step 3 為上一頁／清除／儲存。

### Step 1 共用欄位

- 專案代號：灰底 readonly sample `12`。
- 專案名稱。
- 灰底 readonly 專案類型：`住宿專案`。
- 計價方式：sample `間數`。
- 加人：可／不可，sample 為不可。
- 排序：sample `999`。
- 不可退款：sample 未勾選。
- 含餐：sample `YES`，資訊 tooltip 只在 hover/focus 顯示，不預設展開。
- 第二組排序：sample `999`。
- 專案期間：2026-02-10 至 2026-03-11。
- 專案房型：全選、方案一、方案二、方案三、加。
- 專案天數：等於／至少，sample 為至少 1 夜。
- 專案名稱文案與專案介紹文案為兩張編輯卡，sample 為「尚未填寫」。

### Step 1 住宿特有

- 上架期限：2026-02-10 至 2026-03-11。
- 幾天前可訂：sample 12 天。
- 網路開放天數：sample 12 天。
- 實際 modal 高 1209。

### Step 1 串接特有

- 在第一列基本資料下方新增滿寬「通路庫存」select，sample 為 Booking。
- 不顯示上架期限、幾天前可訂、網路開放天數。
- Figma 仍顯示 readonly `住宿專案`，current implementation 不自行改名。
- 實際 modal 高 1035。

### Step 2 日期設定

- readonly 專案 sample `xxx-yyy-zzz`。
- 日期類型 table 順序：平日、假日、連續假日；每列有排序、名稱色塊與詳細。
- 日期類型 table 的實際內容寬維持 490px；窄 viewport 由外層容器水平捲動，
  table 的 header／row 上下框線必須延伸到完整內容寬，不得只畫到可視區寬度。
- 四個月份以 2 x 2 排列：2026 年 03 月至 2026 年 06 月。
- sample 指定日期：2026-03-02 平日、2026-04-03 假日、2026-06-05 連續假日。
- 提供「將此日期設定儲存成樣本」checkbox。

### Step 3 價格設定

- 摘要：專案 `xxx-yyy-zzz`、計價每間、天數 1、名稱 28 間。
- 售價 table：平日、假日、連續假日；sample 為不開放與 8888。
- 加人及加兒童 table：sample 為開啟與 8888。
- 日期色彩：平日 `Color/Brand/Brand-300`、假日 `Color/Chart/purplered`、
  連續假日 `Color/Accent/float-circle-mixed-1`。

## 互動

- 住宿／串接 tab 切換清單語意，也決定新增／修改 modal 的 Step 1 variant。
- 狀態 filter 只切 active 樣式；sample data 不模擬後端篩選結果。
- table 的修改按鈕以目前 tab 開啟 title「修改」；新增按鈕以目前 tab 開啟 title「新增」。
- 上一頁／下一頁切換步驟；step indicator 同步更新。
- 清除只重設當前步驟的 preview 表單，不執行跨步驟或後端刪除。
- 儲存關閉 modal；preview 不送出 API。
- Close、backdrop、Escape 沿用 shared modal controller，並還原觸發按鈕 focus。

## Responsive constraints

Figma current source 只有 desktop。2026-09-21 使用者授權依本專案既有設計手法
自動編排 tablet 與 mobile RWD，以下規則為 current contract，不再列為待確認：

### Desktop：1024px 以上

- 依 Figma desktop contract；modal 封頂 800px。
- Step 1 表單與文案卡為兩欄；Step 2 月曆為 2 x 2。
- 14 欄專案 table 在自身外框水平捲動，不擴張 document。

### Tablet：768px 至 1023px

- 沿用 shared desktop shell 與 sidebar，不另建 tablet 導航 variant。
- 頁面 panel、content card 縮小 padding，但內容順序不變。
- modal 寬度為 viewport 扣除左右 12px backdrop padding，封頂 800px。
- Step 1 維持兩欄但縮小欄距；日期區間與表單 control 不得溢出欄寬。
- Step 2 月曆維持 2 x 2，減少 grid 外側 padding；Step 3 table 不應在 768px
  出現不必要的 scrollbar。

### Mobile：767px 以下

- 沿用 shared mobile drawer；頁面保留 `rootWrap` 12px 外距。
- 上方操作列與 batch actions 可垂直排列；狀態 tabs 維持單列水平捲動。
- 頁面 table 只在 `.pc-table-shell` 內水平捲動，document 不得水平溢出。
- modal 寬度不超過 viewport，body 垂直捲動，header 與 footer 保持可見。
- Step 1 表單與文案卡改單欄；文案卡縮短為適合 mobile 的高度。
- Step 2 日期說明改直向排列，月曆改單欄；日期類型 table 可在自身外框捲動。
- Step 3 摘要改單欄；價格 table 保留 desktop 欄寬並在自身外框水平捲動。

### Small mobile：479px 以下

- inline field 的 label 與 control 改上下排列。
- radio、checkbox、房型 options 允許換行，不縮小文字與點擊區。

375px 是 QA viewport，不是固定最小寬；所有斷點只調整排列，不新增或移除產品
功能與欄位。

## 未定義／待後端

- 通路庫存除 Booking 外的 option 與資料來源。
- 新增／修改驗證、API payload、儲存錯誤狀態。
- 清除的正式跨步驟範圍。
- 刪除、上下架、複製、查看、整批更新的後端行為。
- Figma placeholder「我是提示文字」與「專案名稱案」是否為最終文案。
