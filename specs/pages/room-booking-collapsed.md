# 訂單管理 - 房間預訂（aside 收摺版 / 滿版）

> Figma Section：`Content page - 房間預訂 default 滿版 0428`（`1456:27695`）  
> 版本：0428  
> 讀取日：2026-04-30

---

## 與展開版的差異摘要

| 項目 | 展開版 | 收摺版（本檔） |
|---|---|---|
| Aside | menu 240px 展開 | compact bar 240×48，只佔 top-bar 高度 |
| Top bar 高度 | 36px | 48px（含 compact menu） |
| Main content 寬度 | 1140px（Frame 400） | **1400px**（Frame 407 全寬） |
| Accordion 內右側面板 | 725px | **985px** |
| 訂房資料 Grid 寬度 | 1100px | **1360px** |
| [D] 左側表單寬度 | 685px | **951px** |

---

## 整體佈局

```
┌───────────────────────────────────────────────────────────────┐
│  compact menu bar (240×48) │  search inputs + func icons      │ ← top-bar 48px
├───────────────────────────────────────────────────────────────┤
│  [A] 空房與庫存查詢 accordion  1400px wide  619px              │
│  [B] 客戶類型 + 訂房資料       1400px wide  432px              │
│  [C] 訂單條件 accordion        1400px wide  425px              │
│  [D] 訂房資料 section          1400px wide  888px              │
│  footer: 產生訂單 button                                       │
└───────────────────────────────────────────────────────────────┘
```

**頁面外框**
- 外層 Frame 408：`1400 × 2563`，margin `20px` 左右、`12px` 上
- Frame 407（全寬主內容）：`1400 × 2500`，**無 aside 區塊**
- **floatIcons/ai**：`40 × 70` @ x:1372, y:1058
- **Button Y/N「產生訂單」**：`137 × 39` @ x:1263, y:2524（state=yes，bg:`Color/Neutral/800`）

---

## Top Bar（Frame 405）

**尺寸**：`1400 × 48`，@ y:0

### Compact Menu（menu instance，collapsed state）

`240 × 48`，@ x:0，bg:`Color/Neutral/0`，padding `12`

| 元素 | 說明 |
|---|---|
| Folder icon | 24×20，@ x:199（收折/展開按鈕） |
| Account | 127×24，@ x:57（使用者名稱） |
| Ul（全選單） | 216×494，收起不可見（`height: 0` 或 `overflow: hidden`） |

> **Compact bar 高度 = 48px**（非展開時的 1188px），僅顯示一列 icon + 帳號。

### 搜尋與功能區（Frame 404）

`1148 × 36`，@ x:252, y:6

| 元素 | 尺寸 | x 位置 | 說明 |
|---|---|---|---|
| Input × 2（Frame 220） | 235 × 36 | x:0 | 同展開版 |
| Function icons | 68 x 24 | x:1072 | 同展開版，message / person-md 兩顆 |

---

## [A] 空房與庫存查詢 Accordion

**尺寸**：`1400 × 619`，bg:`Color/Neutral/75`，padding `20`，@ y:70

### Header（Frame 99）

`1360 × 27`，@ x:20, y:20（較展開版寬 260px）

### 內容（Frame 224）

`1360 × 536`，@ x:20, y:63

| 子區塊 | 尺寸 | 說明 |
|---|---|---|
| Calendar | 351 × 431 | **同展開版**（月曆寬度不變） |
| Frame 223（右側） | **985 × 536** | 較展開版寬 260px（725→985） |

---

## [B] 客戶類型 + 訂房資料（Frame 230）

**尺寸**：`1400 × 432`，bg:`Color/Neutral/75`，padding `20`，@ y:711

### 頂部資料列（Frame 367）

`1360 × 36`，@ x:20, y:78

| 子區塊 | 尺寸 | 位置 |
|---|---|---|
| Frame 409（團體名稱 + 業務） | 851 × 36 | @ x:0 |
| Frame 368（checkboxes） | 204 × 22 | @ x:1156（較展開版右移） |

### 訂房資料 Grid（Frame 222）

`1360 × 282`，@ x:20, y:130，bg:`Color/Neutral/0`，padding 12

**容器 1360px，grid 內容 ≈ 1398px → 仍需 overflow-x: scroll**（欄位同展開版，位置不變）

---

## [C] 訂單條件 Accordion（Order condition）

**尺寸**：`1400 × 425`，bg:`Color/Neutral/75`，padding `20`，@ y:1165

### Header

`1360 × 27`，@ x:20, y:20

### 內容容器

`1360 × 342`，bg:`Color/Neutral/0`，padding `12`

Frame 370（三欄）：`1336 × 318`（較展開版 1076→1336，各欄寬隨之增大）

---

## [D] 訂房資料 Section（Frame 406）

**尺寸**：`1400 × 888`，@ y:1612

### 左側：訂房資料（Frame 349）

`951 × 888`，bg:`Color/Neutral/75`，padding `20`，@ x:0

| 子區塊 | 尺寸 | 說明 |
|---|---|---|
| Header（Frame 350） | 911 × 27 | 標題 + 操作按鈕 |
| Body（Frame 358） | 911 × 805 | Tab + 表單內容（同展開版） |

### 右側：正式單與候補單 Accordion

`425 × 888`，bg:`Color/Neutral/75`，padding `20`，@ x:975（與左側 gap = 24px）

**內容同展開版**，尺寸不變。

---

## 實作注意事項

- **Compact menu state**：menu component 切換為 collapsed 時，僅顯示 48px 高的 compact bar；主內容區塊全部改為 `w-full`（1400px 寬）
- Top bar 高度從 36px 變為 48px（compact bar 高度決定）
- Calendar 寬度 351px **不因 aside 狀態改變**
- Grid 容器從 1100 → 1360px，但 grid 內欄位定義相同，仍橫向捲動
- 訂單條件三欄容器從 1076 → 1336px，三欄可更均勻分配
