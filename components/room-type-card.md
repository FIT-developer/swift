# Component Specification: 房型卡片 (room-type-card)

**Figma Node ID**（desktop 範例卡）：
- 使用中 + 有照片：`2137:100860`（"四人房"）
- 使用中 + 無照片：`2137:101050`（"賽亞人房"）
- 已刪除 + 無照片：`2137:101168`（"賽亞人房 1"）
- 已刪除 + 有照片 + 無副標：`2137:101288`（"嗚啦啦"）

同一組卡片內容在 3 個 RWD frame 重複出現，欄位、順序、文字完全一致，只有版面（3 欄 grid /
單欄滿寬）跟部分元素排列不同，見下方「RWD」。

**讀取日期**：2026-07-30
**使用位置**：`specs/pages/room-type.md`「系統設定 -> 房型」頁卡片列表

---

## 概述

房型卡片顯示單一房型的摘要資訊，共兩種主要狀態：

- **使用中**：功能按鈕為「修改 / 複製 / 刪除」
- **已刪除**：功能按鈕為「查看 / 還原」，圖片一律顯示待上傳佔位圖（本次讀取樣本皆如此，
  但語意上是否強制如此未經 Figma 明確定義為規則，之後若出現「已刪除但有照片」的樣本
  need 再確認）

圖片本身另有獨立的「有照片 / 無照片（待上傳佔位）」狀態，跟使用中/已刪除是兩個獨立維度，
可以任意組合（本次樣本 6 張卡中兩種狀態都各自出現過）。

---

## 卡片結構

```
房型卡片
- ribbon（左上角三角形色塊 + 數字，例如 199/888/155/72/921/878）
- 圓形圖片區（有照片/無照片皆可點擊，開啟照片管理 modal，見下方「圖片點擊行為」）
  - 有照片：實際照片 + 右下角小圓形「更換照片」icon 疊加
  - 無照片：灰色 icons/image-empty 佔位圖示
- 房型名稱（24px SemiBold）
- 副標「房價跟隨：XYZ !!! 222 XYZ」（部分卡片沒有這行，見下方「副標缺失」）
- 功能按鈕列
  - 使用中：修改（icons/edit，橘框）+ 複製（icons/duplicate，藍框）+ 刪除（icons/trash-can，紅框）
  - 已刪除：查看（icons/preview-outline，灰框）+ 還原（icons/restore-page-outline-rounded，綠框）
- 統計列（table）：代號 / 床型 / 間數 / 營運方式，四欄
```

### Ribbon 數字

左上角三角形色塊內的數字（199/888/155/72/921/878）是 Figma 佔位文字，版位刻對即可，
不用深究實際語意，之後由後端渲染真實資料（2026-07-30 使用者拍板）。

### 副標缺失

6 張樣本卡中「嗚啦啦」這張沒有「房價跟隨」副標，是刻意設計（2026-07-30 使用者拍板），
不是 Figma 內容缺漏。卡片高度會因為少這行文字而變矮（desktop 參考：有副標 446px，
無副標 412px），版面需要能容納兩種高度，不強制卡片等高。

---

## Token / 顏色

| 元素 | Token | Hex |
|---|---|---|
| 修改按鈕邊框 | `Color/Accent/pink`（品牌橘 `#F28B45`，實際對應 `Color/Brand/Brand-400`） | `#F28B45` |
| 複製按鈕邊框 | `Color/Accent/linear-function-button-duplication`（2026-07-30 新增） | `#C6DDFE` |
| 刪除按鈕邊框 | `Color/Accent/linear-function-button-delete`（2026-07-30 新增） | `#F3C2C4` |
| 刪除按鈕文字/icon | `Color/Border/Plugin-Invalid` | `#D90000` |
| 查看按鈕邊框 | `Color/Border/Default` | `#D1D1D1` |
| 還原按鈕邊框 | `Color/Accent/light-green` | `#BBF7D0` |
| 卡片外框 | `Color/Neutral/300` | `#B0B0B0` |
| 卡片下半部（統計列容器）底色 | `Color/Neutral/0`（白） | `#FFFFFF` |
| 圖片佔位 icon | `Color/Neutral/400` | `#888888` |

> 修改按鈕邊框色實測為 `#F28B45`，對照 tokens.md 為 `Color/Brand/Brand-400`，不是
> `Color/Accent/pink`（那個是 `#FFC0CB`，顏色不同），寫 spec 時以 `Color/Brand/Brand-400`
> 為準，上方誤植已更正。

---

## 圖片點擊行為（2026-07-30 使用者拍板）

卡片中間的圓形圖片（有照片跟無照片兩種狀態都算），點擊後開啟跟「系統設定 -> 民宿資料」
頁圓形照片觸發器**共用同一個版型**的照片管理 modal，即 `components/modal.md`
`state=photo-gallery`（Figma node `2125:75472`，1140x1134px，5 張圖片管理）。

- **版型（HTML/CSS 結構）共用**：不重新設計，直接沿用 `state=photo-gallery` 既有規格
- **JS 各自獨立**：房型頁不得 import 或共用 `preview/js/lodging-info-modals.js`；
  比照該檔案的既有 pattern（`data-modal-open="modalPhotoGalleryBackdrop"` 觸發、
  同一份 modal partial markup），另外新增房型頁專屬的 JS 檔案（例如
  `preview/js/room-type-modals.js`）處理這顆 modal 的開關與圖片管理行為，兩頁
  的 JS 執行時彼此獨立，不共用 state（2026-07-30 使用者明確要求：「js 請獨立
  作業，不要混在一起」）
- 觸發器沿用民宿資料頁同款圓形照片 trigger 的既有行為（有圖/無圖兩態共用同一
  modal，點擊都開同一顆）

---

## 統計列（Table 實作方式，2026-07-30 使用者拍板）

統計列（代號/床型/間數/營運方式）當作語意 `<table>` 做，不分斷點另外設計版面：

- 外層 `overflow-x-auto` 包住 `<table>`；因為這段本來就在卡片下半部白底圓角區塊內，
  不需要再包一層 border/bg（跟 `account-permission.html` 的 `.ap-records-table`
  外層需要額外包白底 border 不同）
- `th` / `td` 都設 `white-space: nowrap`，讓內容天生撐開才觸發橫向捲動，
  **不寫死固定寬度**（比照 `order-processing.html` 386 行 `.op-table` 的做法，
  不是每欄硬性設一個 88px 的最小寬度）
- `text-align: center`（Figma 量到 label 跟值都是置中，不是像 `.ap-records-table`
  那樣靠左）
- 新的 scoped class 名稱：`.room-type-stat-table`
- 表頭字級 20px（`text-xl` / `var(--font-size-xl)`），值字級 16px（`text-base`），
  顏色都是 `Color/Neutral/800`（`#454545`）
- 表頭跟值之間的分隔線顏色：Figma JSON 給的是可疑的 `#000000`（表頭列）跟 `#454545`
  （值列），跟專案「JSON 不等於視覺」的已知陷阱吻合，**實作時要對照渲染圖確認實際顏色**，
  不要照 JSON 黑色直接套用
- 三個斷點（375/768/1440）共用同一份 markup/CSS，不寫條件式規則

---

## 功能按鈕 disabled 判斷規則

沿用 `components/modal.md` 的「state=room-type」段同一套規則：白底 = 可操作，
變色（灰底）= disabled。房型卡片本身的按鈕（修改/複製/刪除/查看/還原）沒有
disabled 態樣本，維持一般 pill 按鈕實作即可。

---

## RWD

| 斷點 | Figma Node ID | 尺寸 | 版面 |
|---|---|---|---|
| Desktop | `2137:101408`（頁面 frame，卡片為其子節點） | 1440x1130 | 卡片 3 欄 grid，每欄 350px 寬 |
| Mobile~tablet | `2137:103071` | 767x2956 | 卡片單欄滿寬（687px），內容置中同 desktop |
| Mobile | `2137:103890` | 375x3164 | 卡片單欄滿寬（295px）；按鈕 3 顆時換行：修改+複製一行，刪除置中另一行；
統計列超寬時交給 `overflow-x-auto` 處理，不特別為 mobile 改版面 |

- 卡片內部（圖片/名稱/副標/按鈕）在三個斷點都是置中對齊，只有卡片外層寬度跟著
  斷點變化，卡片本身的比例配置不變
- 按鈕列：desktop/tablet 都是一行 3 顆（或 2 顆）；mobile 3 顆按鈕會換行成
  「修改+複製」一行 +「刪除」置中另一行，2 顆按鈕（查看+還原）維持一行不換行

---

## Figma 未定義 / 待確認

- 「已刪除」狀態卡片是否強制不能有照片（本次樣本全部如此，但只有 3 張已刪除卡的
  樣本，未看過「已刪除 + 有照片」的組合，需要之後樣本更多時再確認）
