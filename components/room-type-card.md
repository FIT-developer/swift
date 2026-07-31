# Component Specification: 房型卡片 (room-type-card)

**Figma Node ID**（desktop 6 張樣本卡，grid 容器 `2136:98793`，左到右/上到下順序）：

| # | 名稱 | Node ID | Ribbon | 狀態 | 照片 | 副標 | 代號 / 床型 / 間數 / 營運方式 |
|---|---|---|---|---|---|---|---|
| 1 | 四人房 | `2137:100860` | 199 | 啟用中（修改/複製/停用） | 有照片 | 有 | 雙人 / 超多床位 / 99999 / 非住宿 |
| 2 | 賽亞人房 | `2137:101050` | 888 | 啟用中 | 無照片 | 有 | DT / 二大床 / 22 / 住宿 |
| 3 | 賽亞人房 1 | `2137:101168` | 155 | 已停用（查看/啟用） | 無照片 | 有 | DT / 二大床 / 22 / 住宿 |
| 4 | 亞歷山大 | `2137:101228` | 72 | 已停用 | 無照片 | 有 | DT / 二大床 / 22 / 住宿 |
| 5 | 嗚啦啦 | `2137:101288` | 921 | 已停用 | 有照片 | 無（見下方「副標缺失」） | DT / 二大床 / 22 / 住宿 |
| 6 | 嘿吼嘿吼 | `2137:101348` | 878 | 已停用 | 無照片 | 有 | DT / 二大床 / 22 / 住宿 |

6 張裡 2 張啟用中、4 張已停用；2 張有照片（#1、#5）、4 張無照片（待上傳佔位）。

**2026-07-31 使用者拍板術語變更**：狀態名稱「使用中」改「啟用中」、「已刪除」改
「已停用」；按鈕「刪除」改「停用」、「還原」改「啟用」。語意不變（已停用 =
從啟用中移除，不是真的刪資料），只是用詞更準確：使用者點「停用」後，卡片的
狀態色（ribbon）與操作內容（按鈕組）會一起切換，不是只靠顏色判斷；即使沒注意
左上角 ribbon，也能從按鈕是「查看／啟用」立即知道目前是停用狀態。已停用只能
查看，不能修改或複製 - 要操作資料，先啟用；停用期間只允許檢視。
`preview/room-type.html` 卡片列表實作必須完整渲染這 6 張卡（順序、文字、狀態組合
一致），不可用「其他卡同上」省略或自行改動內容（start.md 禁區）。

同一組卡片內容在 3 個 RWD frame 重複出現，欄位、順序、文字完全一致，只有版面（3 欄 grid /
單欄滿寬）跟部分元素排列不同，見下方「RWD」。

**讀取日期**：2026-07-30（首次讀取，遺漏 #4、#6 兩張文字內容）／2026-07-31（figma-go
重讀補齊完整 6 卡資料，見上表）
**使用位置**：`specs/pages/room-type.md`「系統設定 -> 房型」頁卡片列表

---

## 概述

房型卡片顯示單一房型的摘要資訊，共兩種主要狀態：

- **啟用中**：功能按鈕為「修改 / 複製 / 停用」
- **已停用**：功能按鈕為「查看 / 啟用」；語意是「從啟用中移除」，不是真的刪除資料
  （2026-07-31 使用者拍板），既有照片等資料不受影響，正常顯示

圖片本身另有獨立的「有照片 / 無照片（待上傳佔位）」狀態，跟啟用中/已停用是兩個獨立維度，
可以任意組合（本次樣本 6 張卡中兩種狀態都各自出現過，例如「嗚啦啦」即為已停用 + 有照片，
見上方 node ID 列表）。

### 停用 / 啟用互動（2026-07-31 使用者拍板，新增交互行為）

點擊「停用」按鈕：卡片從啟用中切到已停用（按鈕組換成查看/啟用、ribbon 漸層換成
灰階）。點擊「啟用」按鈕：卡片從已停用切回啟用中（按鈕組換成修改/複製/停用、
ribbon 漸層換回橘階）。這是本輪新增的前端狀態切換，純前端 in-memory 狀態，
prototype 階段點擊後直接切換，尚未接後端 API。實作見
`preview/js/room-type.js` `initRoomType()` 的 delegated click handler
（`data-card-action="disable"` / `data-card-action="enable"` + `data-card-id`）。

---

## 卡片結構

```
房型卡片
- ribbon（左上角三角形色塊，白->Brand-100 漸層背景 + 數字，例如 199/888/155/72/921/878）
- 圓形圖片區（有照片/無照片皆可點擊，開啟照片管理 modal，見下方「圖片點擊行為」）
  - 有照片：實際照片 + 右下角小圓形「更換照片」icon 疊加
  - 無照片：灰色 icons/image-empty 佔位圖示
- 房型名稱（24px SemiBold）
- 副標「房價跟隨：XYZ !!! 222 XYZ」（部分卡片沒有這行，見下方「副標缺失」）
- 功能按鈕列（全部白->色漸層背景，見「Token/顏色」段漸層色標；已停用態的查看/啟用
  兩顆也是漸層，不是白底，2026-07-31 SVG 覆核訂正）
  - 啟用中：修改（icons/edit，橘框+橘漸層）+ 複製（icons/duplicate，藍框+藍漸層）+ 停用（icons/suspend-outline，粉框+粉漸層，icon+文字黑色，2026-07-31 訂正）
  - 已停用：查看（icons/preview-outline，灰框+灰漸層）+ 啟用（icons/video-play，綠框+綠漸層，icon+文字黑色，2026-07-31 訂正）
- 統計列（table）：代號 / 床型 / 間數 / 營運方式，四欄
```

### Ribbon 數字

左上角三角形色塊內的數字（199/888/155/72/921/878）是 Figma 佔位文字，版位刻對即可，
不用深究實際語意，之後由後端渲染真實資料（2026-07-30 使用者拍板）。

### 副標缺失

6 張樣本卡中「嗚啦啦」這張沒有「房價跟隨」副標，是刻意設計（2026-07-30 使用者拍板），
不是 Figma 內容缺漏。

**2026-07-31 使用者訂正**：先前記錄「無副標卡片變矮（446px -> 412px）」是錯的 -
用 `get_screenshot` 對 6 張卡逐張量測像素高度，全部卡片總高度完全一致（皆為
446px，不因缺副標而變矮）。實際規則是：統計列（分隔線 + table）永遠貼齊卡片
底部，缺副標騰出的空間由「按鈕列」跟「統計列」之間的空隙吸收（該空隙用
`mt-auto` 撐開），不是卡片整體變矮。實作見 `preview/js/room-type.js`
`buildCard()` 的 `bottomSection`（`flex flex-col gap-4 mt-auto`）。
卡片列表容器是 CSS grid（`grid-cols-*`），同一列卡片預設互相 stretch 等高，
這是 `mt-auto` 有多餘高度可以吸收的前提，不可拿掉 grid 的等高行為。

---

## Token / 顏色

| 元素 | Token | Hex |
|---|---|---|
| 修改按鈕邊框 | `Color/Brand/Brand-400` | `#F28B45` |
| 修改按鈕背景（漸層，見下方） | `Color/Neutral/0` -> `Color/Brand/Brand-200` | `#FFFFFF` -> `#FAD4AE` |
| 複製按鈕邊框 / 漸層終點 | `Color/Accent/linear-function-button-duplication`（2026-07-30 新增） | `#C6DDFE` |
| 複製按鈕背景（漸層） | `Color/Neutral/0` -> `Color/Accent/linear-function-button-duplication` | `#FFFFFF` -> `#C6DDFE` |
| 停用按鈕邊框 / 漸層終點（不變） | `Color/Accent/linear-function-button-delete`（2026-07-30 新增） | `#F3C2C4` |
| 停用按鈕背景（漸層，不變） | `Color/Neutral/0` -> `Color/Accent/linear-function-button-delete` | `#FFFFFF` -> `#F3C2C4` |
| 停用按鈕文字（2026-07-31 由紅改黑） | `Color/Neutral/800` | `#454545` |
| 停用按鈕 icon（2026-07-31 換成 `icons/suspend-outline`，由紅改黑） | 純黑（無語意 token，Figma 原生 `stroke="black"`） | `#000000` |
| 修改/複製按鈕文字、icon | `Color/Neutral/800` | `#454545` |
| 查看按鈕邊框 / 漸層終點 | `Color/Border/Default` | `#D1D1D1` |
| 查看按鈕背景（漸層） | `Color/Neutral/0` -> `Color/Border/Default` | `#FFFFFF` -> `#D1D1D1` |
| 啟用按鈕邊框 / 漸層終點（不變） | `Color/Accent/light-green` | `#BBF7D0` |
| 啟用按鈕背景（漸層，不變） | `Color/Neutral/0` -> `Color/Accent/light-green` | `#FFFFFF` -> `#BBF7D0` |
| 啟用按鈕文字 | `Color/Neutral/800` | `#454545` |
| 啟用按鈕 icon（2026-07-31 換成 `icons/video-play`，由綠改黑） | 純黑（無語意 token，Figma 原生 `fill="black"`） | `#000000` |
| Ribbon 背景（啟用中卡片，漸層見下方） | `Color/Neutral/0` -> `Color/Brand/Brand-100` | `#FFFFFF` -> `#FDEBD7` |
| Ribbon 背景（已停用卡片，漸層見下方） | `Color/Neutral/0` -> `Color/Neutral/100` | `#FFFFFF` -> `#E1E1E0` |
| 卡片外框 | `Color/Neutral/300` | `#B0B0B0` |
| 卡片下半部（統計列容器）底色 | `Color/Neutral/0`（白） | `#FFFFFF` |
| 圖片佔位 icon | `Color/Neutral/400` | `#888888` |

> **2026-07-31 修正（JSON 不等於視覺landmine 命中）**：修改/複製/停用三顆按鈕與
> ribbon 三角色塊，`get_selection`/`get_node` 的 `styles` 完全沒有 `fills` 欄位
> （只有 `strokes`），照 JSON 字面會誤判成「白底/透明底 + 純色邊框」。改用
> `save_screenshots(format: SVG)` 讀 `<defs><linearGradient>` 後才發現三顆按鈕跟
> ribbon 其實都是**垂直/對角線性漸層背景**，不是純色。這解釋了 Session 120
> 新增的 `linear-function-button-delete` / `linear-function-button-duplication`
> 命名裡的「linear」二字，原本就是指漸層，不是單純的邊框點綴色，先前版本把
> 這兩個 token 誤記成單純邊框色是錯的。
>
> **2026-07-31 再訂正（術語 + 顏色語意變更，見上方「停用/啟用互動」段）**：
> 「刪除」按鈕改名「停用」、圖示改 `icons/suspend-outline`，文字/icon 顏色從紅
> （`Status-Negative #E12129` 文字 + `Border/Plugin-Invalid #D90000` icon）改成
> 純黑 `#000000`；「還原」按鈕改名「啟用」、圖示改 `icons/video-play`，icon 顏色
> 從綠改純黑 `#000000`（文字本來就是黑 `#454545`，沒變）。**邊框色跟漸層終點色
> 不受這次變更影響，維持原本的粉/綠**（用色階區分「這顆按鈕語意上仍是負向/正向
> 操作」，只是 icon+文字不再用強調色搶視覺）。
>
> 漸層方向與色標（SVG `<defs>` 實測）：
> - 修改按鈕：`linear-gradient(to top, #FFFFFF 0%, #FAD4AE 100%)`（垂直，下白上橘）
> - 複製按鈕：`linear-gradient(to top, #FFFFFF 0%, #C6DDFE 100%)`（垂直，下白上藍）
> - 停用按鈕：`linear-gradient(to top, #FFFFFF 0%, #F3C2C4 100%)`（垂直，下白上粉，不變）
> - 查看按鈕：`linear-gradient(to top, #FFFFFF 0%, #D1D1D1 100%)`（垂直，下白上灰）
> - 啟用按鈕：`linear-gradient(to top, #FFFFFF 0%, #BBF7D0 100%)`（垂直，下白上綠，不變）
> - Ribbon（啟用中卡片）：`linear-gradient(to left, #FFFFFF 0%, #FDEBD7 100%)`（沿
>   三角形寬邊方向，靠外側寬邊為淡橘 `Brand-100`，往內側尖角褪成白）
> - Ribbon（已停用卡片）：`linear-gradient(to left, #FFFFFF 0%, #E1E1E0 100%)`（同方向，
>   淡橘換成 `Neutral/100` 淡灰；ribbon 顏色跟隨卡片狀態，不是固定橘色 - 啟用中=橘、
>   已停用=灰，判斷依據跟卡片按鈕列一致（有「修改」按鈕=啟用中=橘 ribbon；有
>   「查看」按鈕=已停用=灰 ribbon）
> - 三顆按鈕的邊框色與漸層終點色數值相同（複製/停用完全同色；修改例外，邊框
>   是 `Brand-400 #F28B45`，漸層終點卻是 `Brand-200 #FAD4AE`，兩個不同 token）
> - 色標全部已有對應 token（`Brand-100`/`Brand-200`/
>   `linear-function-button-duplication`/`linear-function-button-delete`/
>   `light-green`），不需要新增 hardcoded hex；停用/啟用 icon 的純黑
>   `#000000` 沒有語意 token（就是 Figma 原生黑線稿），不用勉強套色彩 token

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
變色（灰底）= disabled。房型卡片本身的按鈕（修改/複製/停用/查看/啟用）沒有
disabled 態樣本，維持一般 pill 按鈕實作即可。

---

## RWD

| 斷點 | Figma Node ID | 尺寸 | 版面 |
|---|---|---|---|
| Desktop | `2137:101408`（頁面 frame，卡片為其子節點） | 1440x1130 | 卡片 3 欄 grid，每欄 350px 寬 |
| Mobile~tablet | `2137:103071` | 767x2956 | 卡片單欄滿寬（687px），內容置中同 desktop |
| Mobile | `2137:103890` | 375x3164 | 卡片單欄滿寬（295px）；按鈕 3 顆時換行：修改+複製一行，停用置中另一行；
統計列超寬時交給 `overflow-x-auto` 處理，不特別為 mobile 改版面 |

- 卡片內部（圖片/名稱/副標/按鈕）在三個斷點都是置中對齊，只有卡片外層寬度跟著
  斷點變化，卡片本身的比例配置不變
- 按鈕列：desktop/tablet 都是一行 3 顆（或 2 顆）；mobile 3 顆按鈕會換行成
  「修改+複製」一行 +「停用」置中另一行，2 顆按鈕（查看+啟用）維持一行不換行

---

## Figma 未定義 / 待確認

（目前無待確認項目；原「已刪除狀態卡片是否強制不能有照片」已於 2026-07-31 由使用者
拍板釐清語意並解決，見上方「概述」段）
