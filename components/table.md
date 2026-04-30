# Table（房間配置 / 庫存週表）

> 元件定義 486:4370（COMPONENT_SET）。  
> 兩個 variant：`type=allocate`（單日分配）和 `type=inventory`（多日庫存週表）。  
> 用於 [A] 空房與庫存查詢右側，依月曆模式切換顯示。

---

## Variant 1：type=allocate（486:4369）

`643 × 263`，單日分配檢視

### 標題列

`611 × 40`，Texts「2026 / 02 / 15 四」，md（20px），`#454545`

### Frame 117（主表 611×188）

7 欄，橫向排列，rows 高度皆 38px，表頭/表尾以 stroke `#454545` 標示

| Frame | 欄寬 | 欄名 | 資料範例 | 備注 |
|---|---|---|---|---|
| 110 | 46 | （checkbox） | — | 選中：fill `#2178cf`，stroke `#2178cf`，r:4；未選：stroke `#b0b0b0` |
| 111 | 151 | 房型 | 義大利麵房 / 香蕉船房 | header 行：「房型」；footer 行：「總計」 |
| 112 | 62 | 代號 | XYZ / XYZ | footer 行空白 |
| 113 | 88 | 庫存總數 | 99 / 99 | footer：200 |
| 114 | 104 | 可用庫存數 | 88 / 88 | footer：200，footer 數值色 `#e05216` |
| 115 | 88 | 保留房數 | 11 / 11 | footer：200 |
| 116 | 72 | 分配數 | Input 72×32 | 可編輯：fill `#ffffff`；停用：fill `#e1e1e0`；附 icons/down；footer：「100」 |

---

## Variant 2：type=inventory（486:4371）

`1203 × 303`，多日庫存週表（預設顯示 7 天 + 次週一）

### 標題列

Texts「2026 / 02」，md（20px），`#454545`（不含日期與星期）

### Frame 117（主表 1171×228）

#### 左固定區（Frame 126，477×228）

- 上方 2 行表頭（477px 橫跨）
- 4 個子欄（由左至右）：152px / 151px / 70px / 104px
  - 對應欄名：房型 / 代號 / 庫存總數 / 可用庫存數（或類似）

#### 右日期欄（每欄 100–109px）

共 8 欄（日期 11–17 + 次週一 11），每欄結構：

| 行 | 內容 | 備注 |
|---|---|---|
| 日期數字行 | 「11」「12」… | stroke `#454545` |
| 星期行 | 「一」「二」…「日」 | stroke `#454545` |
| 空白行 | — | — |
| Frame 130（資料列 1） | 3 個狀態 chip | |
| Frame 131（資料列 2） | 3 個狀態 chip | |
| Frame 132（footer 行） | 3 個狀態 chip | stroke `#454545` |

**週末欄（六、日）**：表頭儲存格 fill `#ffc0cb`（粉紅色）

#### 狀態 Chip 顏色（stroke）

| 顏色 | 語義 |
|---|---|
| `#2aca18`（綠） | 可用 / 正常 |
| `#86b7fe`（藍） | 保留 / 佔用 |
| `#f28b45`（橙） | 警示 / 超賣 |

---

## 切換邏輯

- 月曆模式 `room`（空房查詢）→ 顯示 `type=allocate` 表
- 月曆模式 `inventory`（庫存表）→ 顯示 `type=inventory` 表
- 切換按鈕（空房查詢 | 庫存表）位於右側面板表格上方，同時觸發 `setCalendarMode()`

---

## HTML 實作提示

```html
<!-- allocate 表（空房查詢模式） -->
<div id="tableAllocate" class="overflow-x-auto">
  <div class="text-xl text-[#454545] mb-2">2026 / 02 / 15 四</div>
  <table class="text-sm text-[#454545] border-collapse">
    <thead>
      <tr class="border-b border-[#454545]">
        <th class="w-[46px]"></th>
        <th class="w-[151px] text-left px-2">房型</th>
        <th class="w-[62px] text-left px-2">代號</th>
        <th class="w-[88px] text-right px-2">庫存總數</th>
        <th class="w-[104px] text-right px-2">可用庫存數</th>
        <th class="w-[88px] text-right px-2">保留房數</th>
        <th class="w-[72px] text-right px-2">分配數</th>
      </tr>
    </thead>
    <tbody>
      <tr class="h-[38px]">
        <td><input type="checkbox" class="w-4 h-4 accent-[#2178cf]" /></td>
        <td class="px-2">義大利麵房</td>
        <td class="px-2">XYZ</td>
        <td class="px-2 text-right">99</td>
        <td class="px-2 text-right">88</td>
        <td class="px-2 text-right">11</td>
        <td class="px-2 text-right">
          <input type="number" class="w-[72px] h-8 border border-[#d1d1d1] rounded px-1 bg-white text-right" />
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="h-[38px] border-t border-[#454545]">
        <td></td>
        <td class="px-2">總計</td>
        <td></td>
        <td class="px-2 text-right">200</td>
        <td class="px-2 text-right text-[#e05216]">200</td>
        <td class="px-2 text-right">200</td>
        <td class="px-2 text-right">100</td>
      </tr>
    </tfoot>
  </table>
</div>

<!-- inventory 表（庫存表模式） -->
<div id="tableInventory" class="hidden overflow-x-auto">
  <div class="text-xl text-[#454545] mb-2">2026 / 02</div>
  <!-- 週末欄表頭：bg-[#ffc0cb] -->
  <!-- chip：border border-[#2aca18] / border-[#86b7fe] / border-[#f28b45] -->
</div>
```
