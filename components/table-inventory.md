# Table — 庫存表

> 用於 [A] 空房與庫存查詢右側面板（Table instance）。

---

## 外框

`725 × 263`，fill `#ffffff`，stroke `#d1d1d1`，r:12，pad 12/16

## Header

Texts（md）「2026 / 02 / 15  四」，`#454545`；顯示選取日期 + 星期

## 表格區（Frame 117）

`693 × 188`，flex-row，7 欄並排

### 欄規格

| 欄 | Frame | 寬 | header fill | 說明 |
|---|---|---|---|---|
| 勾選 | Frame 110 | 46 | stroke `#3d3d3d` | checkbox 欄，header/footer 用 Rectangle |
| 房型 | Frame 111 | 151 | stroke `#3d3d3d` + fill same header | 「義大利麵房」「香蕉船房」「總計」 |
| 代號 | Frame 112 | 62 | stroke `#3d3d3d` | XYZ / XYZ / — |
| 庫存總數 | Frame 113 | 88 | stroke `#3d3d3d` | 99 / 99 / 200 |
| 可用庫存數 | Frame 114 | 104 | — | 88 / 88 / **200**（footer 值 `#e05216`） |
| 保留房數 | Frame 115 | 88 | — | 11 / 11 / 200 |
| 分配數 | Frame 116 | 72 | — | Input(sm) / Input(sm, disabled) / 100 |

### Row 高度

- Header: 38px
- 資料行: 38px（每欄各 2 資料行）
- Footer (總計): 38px，footer 欄高 181px（小 7px）

### Header / Footer 樣式

Header 行：stroke `#454545`（加粗邊框效果）  
Footer 行：stroke `#454545`

### 勾選欄

- Frame 100 / 101：各 46×38，內含 `Checkbox original`（14×14，@ x:12,y:12）
- Header 和 footer 為 Rectangle（填滿格）

### 分配數欄（Input 格）

- 可編輯：fill `#ffffff`，stroke `#d1d1d1`，r:6，帶 icons/down（32×32 格內）
- 唯讀：fill `#e1e1e0`，stroke `#d1d1d1`，r:6

## 數量分配列（Frame 119）

`725 × 62`，fill `#ffffff`，stroke `#d1d1d1`，r:12，緊接在 Table 下方（@ y:395）

| 元素 | 說明 |
|---|---|
| Range（562×35） | 水平滑桿（詳見 range.md），@ x:16 |
| Frame 102（111×38） | 「數量分配」label + icons/submit，@ x:598 |
