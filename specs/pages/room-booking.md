# 前台作業 — 房間預訂 (room-booking)

> Figma Section：`Content page - 房間預訂 default 0428`（`1456:27694`）  
> 版本：0428  
> 讀取日：2026-04-30

---

## 整體佈局

```
┌─────────────┬────────────────────────────────────────────────┐
│  aside menu │  main content (flex-1, 1140px)                │
│  240px      │  [top-bar]  36px                              │
│  expanded   │  [A] 空房與庫存查詢 accordion  619px           │
│             │  [B] 客戶類型 + 訂房資料       432px           │
│             │  [C] 訂單條件 accordion        425px           │
│             │  [D] 訂房資料 section (tab)    888px           │
│             │  [bottom] 產生訂單 button                      │
└─────────────┴────────────────────────────────────────────────┘
```

**頁面外框**
- 外層 Section 背景：`#ffffff`
- 外層 Frame 402：`1400 × 2567`，margin `20px` 左右、`12px` 上
- Frame 401（aside + main 排列）：`1400 × 2496`
  - Aside (menu instance)：`240px` wide @ x:0
  - Main (Frame 400)：`1140px` wide @ x:260（aside + 20px gap）
- **floatIcons/ai**：`40 × 70` @ x:1372, y:1058（固定右側浮動）
- **Button Y/N「產生訂單」**：`137 × 39` @ x:1263, y:2528（頁面右下角，state=yes，bg:`#454545`）

---

## Aside（menu component）

- **state**：`extend`（展開）
- **尺寸**：`240 × 1188px`
- **樣式**：bg `#ffffff`、border `#e1e1e0`、cornerRadius `8`、padding `12`
- **選中項目**：前台作業 → 房間預訂（sub-item selected 黃底）
- 其餘內容與 landing.html 一致

---

## Top Bar（Frame 398）

**尺寸**：`1140 × 36`

| 元素 | 尺寸 | 位置 | 樣式 |
|---|---|---|---|
| Input「房間預訂」 | 127 × 36 | x:0 | bg:`#f6fafd`（active 狀態），pad 6/12，帶 icons/close |
| Input「xxoo」 | 96 × 36 | x:139 | bg:`#ffffff`，pad 6/12，帶 icons/close |
| Function icons | 156 × 24 | x:984, y:6 | 4 icons 各 24×24，gap 20px |

**Function icons badge 顏色**：
- bulletin (99)、person-md (99+)、system (99+)：`#ef6f25`
- message (0)：`#d1d1d1`（零值用灰色）

---

## [A] 空房與庫存查詢 Accordion

**尺寸**：`1140 × 619`，bg:`#f6fafd`，padding `20`，@ y:60

### Header（Frame 99）

- 寬 `1100`，高 `27`，@ x:20, y:20
- 文字「空房與庫存查詢」：`md`（20px SemiBold）、`#454545`
- icons/up：24×24 @ x:1076（展開狀態用 up icon）

### 內容（Frame 224）

`1100 × 536`，@ x:20, y:63

**左側 Calendar**：`351 × 431`，bg:`#ffffff`，padding `12`
- Frame 120（選日控制列）：327 × 36，@y:12
  - 顯示「已選 0 天」與「今日 / 12」 input
- Frame 93（月份標題列）：327 × 40，@y:60
  - 文字「2026 年 01 月」，md
- Calendar content：327 × 307，@ y:112
  - 7欄（Mon–Sun）× 6 行，共顯示 01–31 + 跨月 01–04

**右側面板（Frame 223）**：`725 × 536`，@ x:375

| 子區塊 | 尺寸 | y 位置 | 說明 |
|---|---|---|---|
| Frame 97（操作按鈕） | 176 × 42 | y:0 | 「空房查詢」/「庫存表」兩個 Button |
| Payment method | 541 × 42 | y:58 | 棟別 filter tab（全部/A棟/B棟/C棟/…） |
| Table（庫存表） | 725 × 263 | y:116 | bg:#ffffff，pad 12/16/12/16 |
| Frame 119（數量分配） | 725 × 62 | y:395 | bg:#ffffff，pad 12/16/12/16，含時段 0–10 |
| Frame 11（底部按鈕） | 725 × 63 | y:473 | pad 12，「清除」/「加入訂單」Button Y/N |

**Table 欄位**（6欄）：

| 欄 | 內容 |
|---|---|
| 房型 | 義大利麵房 / 香蕉船房 / 總計 |
| 代號 | XYZ / XYZ / — |
| 庫存總數 | 99 / 99 / 200 |
| 可用庫存數 | 88 / 88 / 200 |
| 保留房數 | 11 / 11 / 200 |
| 分配數 | Input(sm) / Input(sm) / 100（唯讀） |

---

## [B] 客戶類型 + 訂房資料（Frame 230）

**尺寸**：`1140 × 432`，bg:`#f6fafd`，padding `20`，@ y:703

### 客戶類型按鈕（Frame 97）

`176 × 42`，@ x:20, y:20

| 按鈕 | 尺寸 | 背景 | 狀態 |
|---|---|---|---|
| 一般客戶 | 88 × 42 | `#005fcc`（藍，選中） | active |
| 合約客戶 | 88 × 42 | `#ffffff` | inactive |

### 頂部資料列（Frame 367）

`1100 × 36`，@ x:20, y:78

| 子區塊 | 尺寸 | 內容 |
|---|---|---|
| Frame 321 | 302 × 34 | 「團體名稱」label + Input（placeholder） |
| Frame 228 | 266 × 36 | 「業務」Select |
| Frame 349 | 102 × 22 @ x:896 | checkbox「使用保留房」 |
| Frame 350 | 86 × 22 @ x:998 | checkbox「自加庫存」 |

### 訂房資料 Grid（Frame 222）

`1100 × 282`，@ x:20, y:130，bg:`#ffffff`，padding 12

**總內容寬度 ≈ 1398px → 超出容器 1100px，需 overflow-x: scroll**

欄寬（各 Column Frame 高度皆 258px）：

| # | Frame | 寬度 | x 起點 | 行內容（上到下） |
|---|---|---|---|---|
| Label 欄 | Frame 188 | 198 | 12 | 各列 label（入住日/退房日/房型/專案/間數/單價/小計/加購/操作） |
| 資料欄 1 | Frame 189 | 198 | 210 | 日期 + 夜數 + Input(sm) × 6列 |
| 資料欄 2 | Frame 191 | 198 | 409 | 同上 |
| 資料欄 3 | Frame 194 | 198 | 608 | 同上 |
| 間數欄 | Frame 192 | 169 | 806 | DatePicker（訂房間數）+ 總計列 |
| 單價欄 | Frame 196 | 123 | 975 | Input(sm) + 合計 |
| 小計欄 | Frame 197 | 111 | 1098 | Input(sm) + 合計 |
| 加購欄 | Frame 198 | 59 | 1209 | 合計只 |
| 操作欄 | Frame 195 | 144 | 1268 | 操作按鈕 |

**每 cell 行高**：52px（pad 8/12/8/12 或 8/8/8/0）  
**Header 列高**：38px（pad 8/12/8/12）  
**Footer 列高**：32px（pad 8/12/8/12）  
**交替背景**：偶數資料行 bg:`#f6fafd`，奇數 bg:`#ffffff` 或無填色

---

## [C] 訂單條件 Accordion（Order condition）

**尺寸**：`1140 × 425`，bg:`#f6fafd`，padding `20`，@ y:1159

### Header

`1100 × 27`，@ x:20, y:20  
文字「訂單條件」md、icons/down（展開狀態）

### 內容容器

`1100 × 342`，bg:`#ffffff`，padding `12`

**三欄排列（Frame 370）**：`1076 × 318`，各欄寬 337px，欄間距 ≈ 32px

| 欄位群 | 欄 | 高度 |
|---|---|---|
| 欄 1（@ x:0） | 人數大/小、到店方式、發票、統編、抬頭、繳款期限、訂單備註、需求備註 | 318px |
| 欄 2（@ x:369） | 折扣、總房價、加購項目併單、預付百分比、預付 | 256px |
| 欄 3（@ x:739） | (剩餘條件) | 196px |

---

## [D] 訂房資料 Section（Frame 399）

**尺寸**：`1140 × 888`，@ y:1608

### 左側：訂房資料（Frame 348）

`685 × 888`，bg:`#f6fafd`，padding `20`，@ x:0

**Header 列（Frame 350）**：645 × 27
- 標題「訂房資料」（Frame 246：116×27）
- 按鈕群（Frame 353：529×22）：「清除」/「入住人同訂房人」/「寄送訂房資訊」

**Body（Frame 358）**：`645 × 805`，@ y:63

- **Tab 列（Frame 356）**：184 × 42，pad 0/12/0/12
  - `訂房`（選中）/ `入住`
- **表單內容（Frame 277）**：645 × 763，bg:`#ffffff`，pad 20/0/20/0

**訂房 Tab 表單欄位**（內容見文字提取段落）：
- 名稱、身份證號、護照號碼、生日（Calendar simple）、行動電話
- 國籍：Radio「臺灣」/「外籍」
- 地址：縣/市 Select + 行政區代碼 + 行政區 Select + 街道 Input
- 性別：Radio「男」/「女」
- Email、市話、傳真、會員備註

**會員資訊（唯讀，右側小區塊）**：
訂金保留 / 累積消費 / 住房次數 / 最新住宿日（各顯示 XYZ placeholder）

**旅客習慣**：消費方式「信用卡」/ 車位「必須」/ 住房安靜「要求高」

### 右側：正式單與候補單 Accordion（Frame 1437:47168）

`425 × 888`，bg:`#f6fafd`，padding `20`，@ x:709（與左側 gap = 24px）

**Header**：385 × 27，「正式單與候補單」+ icons/down（**收起**狀態）

**Content**：385 × 805，bg:`#ffffff`，padding `20`
- Payment method：訂單類型 Radio「無設定」/「正式單」/「候補單」（預設：無設定）
- flexible content：顯示文字「未設定」

---

## 顏色速查

| 用途 | 值 |
|---|---|
| Accordion / section bg | `#f6fafd` |
| Card / white bg | `#ffffff` |
| 一般客戶按鈕（選中） | `#005fcc` |
| 副標題文字 | `#454545` |
| badge（有值） | `#ef6f25` |
| badge（零值） | `#d1d1d1` |
| 選中 sub-item 底色 | `#f7d275` |

---

## 注意事項

- **訂房資料 Grid 橫向捲動**：grid 實際寬度 ≈ 1398px > 容器 1100px，需 `overflow-x: scroll`
- **Calendar** 與 **Calendar simple** 是不同元件：前者含完整月曆 grid；後者為單行帶 icons/calendar 的 Input
- **DatePicker** component 在間數欄使用，含 header「訂房間數」
- aside 版型後需讀取 `room-booking-collapsed.md`（aside 收摺版）
