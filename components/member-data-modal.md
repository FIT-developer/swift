# 會員資料 Modal

Figma source：
- Main modal（基本態）`Order condition` `1763:42341`，1140x1823，bg `#f6fafd`
- Main modal（多分館態）`Order condition` `1790:66210`，1140x1823，bg `#f6fafd`（**0528 實作採用本態作為 default content**）
- Sub modal（更換合約公司）`Modal` `1702:38552`，320x169，bg `#ffffff`

由 [D] 訂房資料「名稱 row」末端的 **Data exists button** 點擊觸發（詳見 [order-data.md section 0528 新增](order-data.md)）。

---

## 整體結構（1140x1823）

```
Order condition (1140x1823, bg #f6fafd, padding 20)
- container2 (1100x27)         # header bar
|   - Frame 451                # title "會員資料" 20px + 「最後修改日期 2026-02-02」12px
|   - icons/down               # collapse / close icon 24x24
- container (1100x1740, bg #ffffff, radius 12)
    - Frame 370 (1076x995)     # 主表單區（4 個 sub-card，2x2 grid）
    |   - Frame 412 a (518x466) @ 0,0       # 左上：帳號/密碼/名稱/證號/行動電話/生日/性別/會員備註
    |   - Frame 412 b (518x466) @ 558,0     # 右上：Email/市話/傳真/國籍/地址(3列)/狀態/類別/常用會員/訂閱電子報/會員等級
    |   - Frame 412 c (518x250) @ 0,498     # 左下：會員身份 + tabs(會員/一般/合約) + 合約內容
    |   - Frame 568   (518x497) @ 558,498   # 右下：（保留空間，待補）
    - Accordion (1076x627)     # 訂房記錄 sub-section（折疊；展開後是 table + filter chips）
    - Frame 568 (1076x46)      # 底部 footer: 清除 + 修改 buttons
```

---

## 主表單欄位（Frame 370）

### 左上 Frame 412 a - 基本資料

| 欄位 | 內容 |
|---|---|
| 帳號 | placeholder |
| 密碼 | placeholder |
| 名稱 | placeholder + Texts「先生 / 小姐」（隨性別 radio） |
| 證號 | placeholder |
| 行動電話 | placeholder |
| 生日 | calendar-simple `2026-02-27` |
| 性別 | radio 男 / 女 |
| 會員備註 | textarea (`???` 為 placeholder) |

### 右上 Frame 412 b - 聯絡 / 地址 / 屬性

| 欄位 | 內容 |
|---|---|
| Email | placeholder |
| 市話 | placeholder |
| 傳真 | placeholder |
| 國籍 | radio 臺灣 / 外籍 |
| 地址 縣/市 | select `台中` |
| 地址 行政區 | select `北屯區 / 406` |
| 地址 街道 | input placeholder |
| 狀態 | radio 正式 / 非正式 |
| 類別 | 靜態文字 `一般 / 實體 / B2B`（占位；未來改為擇一 select/radio） |
| 常用會員 | checkbox |
| 訂閱電子報 | checkbox |
| 會員等級 | select `宇宙金卡` |

### 左下 Frame 412 c - 會員身份

```
會員身份 (20px title)
- tabs: [會員] [一般] [合約]
- 內容區（**條件渲染**）
    - 一般 selected -> **空白**（按使用者規定）
    - 合約 selected -> 9 個欄位（label + 唯讀文字 王大頭）：
        - 公司名稱 + **edit 按鈕**（點擊 -> 觸發 sub modal）
        - 統編
        - 公司別
        - 聯絡電話一
        - 聯絡電話二
        - 傳真一
        - 傳真二
        - 備註
        - 地址
```

> **「一般」tab 規則（0528 使用者確認）**：選中時內容區**保持空白**，不渲染任何欄位。

---

## 訂房記錄 sub-section（Accordion 1076x627）

可折疊（icons/down 控制）。展開後內容：

### 頂部 summary chips（橫向排列）

| chip | 來源 | 字色 |
|---|---|---|
| 總消費 | `$ 199,299,399` | `#454545` 黑 |
| 旅宿 e 管家 | `$ 199,299,399` | `#2178cf` 藍 |
| **分館 2** | `$ 199,299,399` | `#2178cf` 藍（**multi-location 變體 #2 才有**） |
| **分館 3** | `$ 9,399` | `#2178cf` 藍（同上） |
| **分館 4** | `$ ...` | 同 |
| **分館 5** | `$ ...` | 同 |

### Filter tab 列

`全部 / 未取消 / 正式單 / 未付款 / 取消單`（橫向，gap 12px、各 chip padding 4 8）。
- inactive：純文字，無 border、無 fill，`#454545` Regular 16px。
- active：底線 1px `#f28b45`（`--color-brand-400`）+ SemiBold；只有 border-bottom、無 fill、非四邊框。
- default active = 全部。

### 來源 filter（multi-location #2 variant only）

`旅宿 e 管家 / 分館 2 / 分館 3 / 分館 4 / 分館 5`（5 個藍字 chip，可勾選）

### Table 欄位（10 column x 5 row demo）

| 欄 | 範例 | 備註 |
|---|---|---|
| 訂單編號 | `133449` + 通路標記 chip（加/網/企）| 標記字色：加 `Color/Accent/celebration` (`#f44df4`) 紫紅、網 `Color/MenuItem/Default` (`#2178cf`) 藍、企 `Color/Accent/cart-button-active` (`#00c8b3`) 綠 |
| 來源 | 旅宿e管家 / 分館 2-5 | |
| 訂購日 | `2026-07-01\n15：33：41` | 雙行（日 + 時） |
| 入住日 | `2026-07-01` | |
| 退房日 | `2026-07-01` | |
| 天數 | `1` | |
| 間夜數 | `1` | |
| 房價 | `1` | |
| 加購價 | `1` | |
| 總金額 | `1` | |

### Footer

`共 61 筆 --- Pagination(1 2 ... 4 5)`

---

## Footer (Frame 568) - Modal 底部按鈕

`清除`（淺灰 disabled-look，`#454545` 字）+ `修改`（深底，`#e1e1e0` 字，submit button）

**行為（2026-06-01 使用者確認）：**
- `清除` - 不關 modal；reset 用（preview 階段 noop，待後端串接欄位 reset）
- `修改` - submit + **關閉 modal**（preview 階段直接 close；未來掛串接後仍關閉）

---

## Sub Modal: 更換合約公司（`1702:38552`）

由「公司名稱 row」右側 edit button 點擊觸發；上一層 main modal 不關。

### 結構

```
Modal (320x169, bg #ffffff, radius?)
- Frame 12 (320x111)
|   - Frame 10 (header 320x51): 「更換合約公司」標題 20px
|   - content swap (320x60): 內含 input/select
|       - Input/Select: `22224332`（統編）
|       - Texts: 「合約公司」
- Frame 11 (320x58, footer)
    - Button Y/N: 「取消」（#d1d1d1 灰底）
    - Button Y/N: 「確定」（#454545 深底 / 字色 #e1e1e0）
```

> 結構待 Figma 對位細節（input/select 樣式、間距）；目前 spec 級別。

---

## 行為（0528 實作）

1. **觸發**：[D] 訂房資料 名稱 row 末端的 Data exists button (`data-data-exists-trigger`) click -> 開啟此 modal
2. **內容 default**：採用「多分館態 #2」(`1790:66210`)，展示完整 chip 集合
3. **會員身份 tabs**：default 選「合約」；選「一般」內容區空白；選「會員」（待 spec）
4. **公司名稱 edit button**：click -> 開啟 sub modal `更換合約公司`，sub modal 不蓋掉 main modal
5. **close**：close icon / outside click / Esc（依專案 modal 慣例）
6. **footer 修改**：點擊 = 關閉 modal（preview 階段無 backend 串接；未來補 submit 邏輯後仍 close）
7. **footer 清除**：點擊不關 modal；reset 欄位（preview 階段 noop，待 form binding）

---

## 0528 未確認

- 「會員」tab（除一般 / 合約之外的第三 tab）內容？目前 Figma 兩態都顯示合約資料，沒有「會員」tab 內容示意 -> 暫時也保持空白與「一般」相同
- Sub modal「更換合約公司」內部詳細 layout（input vs select、placeholder 文字）

關聯：[[order-data]]（觸發按鈕來源）、[[modal]]、[[input]]、[[calendar-simple]]、[[checkbox]]、[[accordion]]、[[pagination]]
