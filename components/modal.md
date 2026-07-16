# Component Specification: `Modal`

**Figma Node ID**: `73:576`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-05-05

---

## 概述

`Modal` 是全站對話框元件。基礎 component set 共有 **5 個 320px variants**（屬性 `state`），另有房型介紹用的 560px modal frame、訂房明細 edit icon 使用的房間編輯 modal，以及加購項目 modal。
共用結構：Header（標題 + 關閉）+ Content + Footer（取消/確定）。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=none content` | `73:575` | 320×109px | 無內容確認對話（登出確認） |
| `state=has content` | `73:626` | 320×277px | 有表單內容（帳號切換） |
| `state=password` | `149:6603` | 320×407px | 會員安全管理 — 修改密碼 |
| `state=nick name` | `258:12190` | 320×333px | 會員安全管理 — 修改暱稱 |
| `state=IP` | `258:12241` | 320×455px | 會員安全管理 — IP 登入紀錄 |
| `state=room intro` | `1272:27245` | 560×390px | 房型介紹；由訂房明細房型 info icon 開啟 |
| `state=room booking edit / min locked` | `1272:27402` | 375×1004px | 訂房明細 edit modal；預設狀態，lock + 已達最低間數 |
| `state=room booking edit / max locked` | `1272:27354` | 375×1004px | 訂房明細 edit modal；lock + 已達上限間數 |
| `state=room booking edit / max editable` | `1272:27306` | 375×1004px | 訂房明細 edit modal；unlock + 價格調整可編輯 |
| `state=purchase add-on / desktop` | `1392:17122` | 1194×893px | 加購 modal；desktop RWD reference |
| `state=purchase add-on / tablet` | `1393:18281` | 768×1959px | 加購 modal；tablet RWD reference |
| `state=purchase add-on / mobile` | `1393:19196` | 375×3139px | 加購 modal；mobile RWD reference |
| `state=order summary / default unpaid` | `1411:20866` | 1019×2911px | `產生訂單` 後顯示的預設訂單內容 modal；**另一觸發入口**：`訂單處理` 頁表格列狀態 pill 下拉選單「訂單」選項（同一 modal，內容逐字元一致，見 `specs/pages/order-processing.md`） |
| `state=order summary / paid` | `1437:44343` | 1019×2506px | 已付款交易狀態；目前不由 `產生訂單` 直接開啟 |
| `state=order summary / waitlist` | `1437:45408` | 1019×2506px | 候補單交易狀態；上方狀態與基本資訊付款狀態分離 |
| `state=order summary / transfer official` | `1437:46152` | 1019×2935px | 候補轉正式單交易狀態，含 `轉正式單` section action area |
| `state=sms / order summary` | `1436:43555` | 648×1161px | Order summary header `簡訊` action opens this SMS modal；**另一觸發入口**：`訂單處理` 頁表格列狀態 pill 下拉選單「簡訊」選項（同一 modal，見 `specs/pages/order-processing.md`） |
| `state=order edit` | `2032:81567`（一般會員版）/ 讀取合約會員版另一 instance | 1192x2474px（一般會員版；合約會員版因多一列高度略增） | `訂單處理` 頁表格列狀態 pill 下拉選單「修改」action 開啟；把房間預訂頁 [A]/[B]/[C]/[D]/[E] 全部區塊搬進 modal、預填該筆訂單資料供編輯。詳見 `components/order-edit-modal.md` |
| `state=arrival method` | `1106:19329` / `1109:19460` / `1110:19603` / `1121:16398` / `1124:17174` / `1135:16863` | 175–993 × 507/834 | 訂單條件 → 到店方式 button 觸發；4 個 chip 切 4 個 sub-state（自行到店 / 自駕 / 包車或專車 / 接送），State D 接送含並排 swiper card stack。詳見 `components/arrival-method-modal.md` |

---

## 全站 Backdrop（遮罩）規格

> **全站統一**：所有 Modal 共用同一 backdrop 設定，不因 Modal 內容不同而異。

| 屬性 | 值 | 說明 |
|---|---|---|
| HTML 實作 | `--effect-modal-backdrop` | 半透明黑色遮罩，全站統一；effect value 由 CSS variable 管理 |
| z-index | `--z-modal`（目前 60；高於 mobile sidebar 50） | — |
| 定位 | `position: fixed; inset: 0` | 全屏覆蓋 |
| 關閉行為 | 點擊 backdrop 關閉 Modal | — |

> **Figma 設計稿說明**：設計稿中以全屏 Neutral/200 矩形（Rectangle 3）+ `Subtract` Boolean Operation 表示遮罩示意，**純粹用於 UI 設計稿交付展示**，不對應 HTML 的實際色值，實作時以上方 `--effect-modal-backdrop` 為準。

## 共用 Interaction

| 行為 | 規格 |
|---|---|
| 開啟後 scroll | 每次 open 都將 backdrop、`.modal-box`、以及 modal 內所有 `.overflow-y-auto` scroller 重設為 top |
| 開啟後 focus | 不主動 focus modal 內表單、標題或第一個控制項；避免使用者瀏覽位置被自動移動 |
| 關閉後 focus | 還原到開啟 modal 的原觸發元素；若元素已移除或 disabled，則不還原 |
| 關閉方式 | header close、footer close action、backdrop click、Esc，依各 variant 定義 |

---

## 共用外框

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `320px` | — |
| Background | `Color/Neutral/0` / `bg-white` | `Color/Neutral/0` |
| Corner radius | `8px` | `Radius/8` |
| Border | `Color/Neutral/300` | `Color/Neutral/300` |

---

## 共用 Header（Frame 10）

```
Frame 10 (320×51px)
├── Texts md Bold → 標題文字  20px  SemiBold 600  Color/Text/800  (x:12, y:12)
└── icons/close (24×24, x:284, y:13.5)
```

| 屬性 | 值 | Token |
|---|---|---|
| 高度 | `51px` | — |
| Padding | `12px` all sides | `Spacing/12` |
| 下邊框 | `Color/Neutral/300` + `--effect-modal-header-shadow`（雙層） | `Color/Neutral/300` + Effect variable |
| 標題字號 | `20px` SemiBold 600 | — |
| 關閉 icon | `icons/close`，x:284（靠右） | — |

---

## 共用 Footer（Frame 11）

```
Frame 11 (320×58px, padding 12px)
├── Button Y/N cancel（取消） (56×34px, x:188)  → bg Color/Neutral/200
└── Button Y/N 確定 (56×34px, x:252)  → bg Color/Text/800
```

| 屬性 | 值 |
|---|---|
| 高度 | `58px` |
| Padding | `12px` all sides |
| 取消按鈕 x | `188px`（從右算：320-12-56-12-56-12 = 172，實為靠右對齊） |
| 確定按鈕 x | `252px` |

---

## 單側 Border Info Item 規則

適用於 Modal 內 icon + text 的資訊項目，例如房型介紹的「家庭房 / 一大床 / 間數 / 售價」。

### 結構

```html
<div class="inline-flex h-9 items-center rounded-md border-0 border-l-4 border-border-disabled bg-white">
  <div class="inline-flex items-center gap-2 px-3 py-1.5">
    <img src="./assets/icons/home.svg" alt="home" class="h-6 w-6" />
    <span class="text-base text-text-default">家庭房</span>
  </div>
</div>
```

### 規則

| 屬性 | 規格 | Token / 說明 |
|---|---|---|
| 外層 display | `inline-flex` | item 依內容寬度 hug |
| 高度 | 36px | `h-9` |
| 圓角 | 6px | `Radius/6`, `rounded-md` |
| 背景 | white | `Color/Neutral/0`, `bg-white` |
| Border | only left side, 4px | `border-0 border-l-4` |
| Border color | `Color/Neutral/200` | `Color/Neutral/200`, `border-border-disabled` |
| 內容 padding | 6px 12px | `Spacing/6`, `Spacing/12` |
| icon | 24×24 | 來自 `preview/assets/icons/` |
| icon/text gap | 8px | `Spacing/8` |
| 文字 | 16px Regular, `Color/Text/800` | `Color/Text/800` |

### 禁止寫法

- 不用 `::before` / `::after` 製作左側線條。
- 不用額外 inner rail/span 製作左側線條。
- 不加完整外框 border 後再覆蓋其他邊。
- 只使用元素本身的 `border-left`，讓 left border 被同一個 6px radius 自然裁切。

---

## state=none content（登出確認）

```
Modal (320×109px)
├── Header — "確定登出？"
├── Texts base 佔位（無實際內容顯示）
└── Footer
```

> 最簡單的確認對話框，無額外表單欄位。

---

## state=has content（帳號切換）

```
Modal (320×277px)
├── Header — "帳號切換"
├── Frame 15 — Content (padding 12px, border Color/Neutral/200)
│   ├── 暱稱 label (Texts base) + Select "帳號一"（下拉選單）
│   └── 密碼 label (Texts base) + Input "********" + icons/none
└── Footer
```

| 欄位 | 類型 | 示例值 |
|---|---|---|
| 暱稱 | `Select`（state=Default） | "帳號一" |
| 密碼 | `Input`（含 icons/none） | "********" |

---

## state=room intro（房型介紹）

**Figma Node ID**：`1272:27245`
**尺寸**：560×390px
**使用位置**：`preview/partials/room-booking-modals.html`；由 `room-booking.html`
的訂房明細表「房型」欄位，以及訂單修改 modal 注入的共用 [A]-[E] body 觸發。

```
Modal (560×390px)
├── Header Frame 10 (560×51px)
│   ├── Texts md — "房型介紹"
│   └── icons/close (24×24)
├── Frame 12 (560×142px)
│   ├── Texts md — "義大利麵專屬房"
│   └── Frame 156 — 4 個 icon + text item
│       ├── icons/home + "家庭房"
│       ├── icons/bed + "一大床"
│       ├── icons/door + "間數：28"
│       └── icons/price + "售價：9,500"
├── Frame 449 (560×190px)
│   └── Static input content (536×174px)
│       └── "我是 textarea\n- 內容\n- 內容"
└── Footer Frame 11 (560×58px)
    └── Button Y/N — "關閉"
```

### Layout

| 區塊 | 尺寸 / 間距 | Token / 說明 |
|---|---|---|
| 外框 | 560×390px, radius 8, border `Color/Neutral/300` | `Radius/8`, `Color/Neutral/300` |
| Header | h 51px, padding 12px | `Spacing/12` |
| Header 下邊框 | `Color/Neutral/300` + `--effect-modal-header-shadow` | `Color/Neutral/300` + Effect variable |
| 房名列 | padding top 8, right 12, bottom 4, left 12 | `Spacing/8`, `Spacing/12`, `Spacing/4` |
| Info item row | padding 8px 12px, gap 20px, flex-wrap | `Spacing/8`, `Spacing/12`, 固定 20px gap；不使用 horizontal overflow |
| Info item | h 36px, radius 6, white bg, icon + text | `Radius/6`, `Color/Neutral/0` |
| Info item 左側 border | only left side, 4px；top/right/bottom border width = 0；跟隨 item `Radius/6` 自然裁切圓角 | `Spacing/4`, `Radius/6`, `Color/Neutral/200` |
| Static input frame | padding 8px 12px | `Spacing/8`, `Spacing/12` |
| Static input content | 536×174px, radius 6, padding 6px 12px, border `Color/Neutral/200`，白底一般狀態；不可編輯，不套 disabled 灰底樣式 | `Radius/6`, `Spacing/6`, `Spacing/12`, `Color/Neutral/200` |
| Footer | h 58px, padding 左右 20px / 上下 0，button right aligned | `Spacing/20` |

### Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| Header title | 20px SemiBold 600 | `Color/Text/800` |
| 房名 | 20px SemiBold 600 | `Color/Text/800` |
| Pill text | 16px Regular 400 | `Color/Text/800` |
| Static input text | 12px Regular 400 | `Color/Text/800` |
| Icon fill | black | `Color/Icon/Default` |
| Close button bg | `Color/Neutral/800` | `Color/Neutral/800` |
| Close button text | `Color/Text/100` | `Color/Text/100` |

### RWD / Interaction

- Desktop：置中顯示，寬度 560px，套用全站 modal backdrop。
- Mobile：與大型 bulletin modal 相同，採滿版 modal（100% width / 100% height），避免 560px 內容在 375px viewport 被壓縮。
- 點擊 `icons/info` 開啟；點 header close、footer「關閉」、backdrop 或 Esc 關閉。
- 四個 info item 保持 flex-wrap，不因 mobile 或窄寬度改成 horizontal overflow。
- 房型資料目前為 prototype 靜態內容；內容區為不可修改的靜態 input-like 區塊，未來由後端資料渲染。

---

## state=room booking edit（訂房明細編輯）

**使用位置**：`preview/partials/room-booking-modals.html`；由 `room-booking.html`
與訂單修改 modal 內共用的訂房明細表「操作」欄位 `icons/edit` 觸發。
**觸發**：點擊 `edit.svg` icon 開啟。
**Figma 讀取日期**：2026-05-05。

此 modal 以 375px 作為最小支援 viewport 的 Figma 參考寬度；實作不可固定寫死 375px，需全響應式。Desktop 可用較寬 modal 呈現同內容，小尺寸則依 375px 佈局垂直排列並讓 body 區域 scroll。

### Figma 狀態來源

| 狀態 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| 預設 | `1272:27402` | 375×1004px | `lock` + 訂房間數 `1` + `已達最低間數`（**0505 標稿**） |
| 上限 | `1272:27354` | 375×1004px | `lock` + 訂房間數 `5` + `已達上限間數`（**0505 標稿**） |
| 可編輯價格 | `1272:27306` | 375×1004px | `unlock` + 定價調整 input active（**0505 標稿**） |
| **↺ 0527 desktop 重整** | `1774:66050` | **646×724px** | 移除 date controller 整段；headline + metadata chips + price table + textarea + footer 四段；info chip 行可橫排 9 個（646 寬足夠 wrap） |

### 結構（**↺ 0527 重整：移除 date controller 整段**）

```
Modal (0527 reference: 646×724 desktop, 1774:66050)
├── Header Frame 10
│   ├── "我是專案名稱"
│   ├── status "鎖定"
│   └── icons/close
├── Frame 12
│   ├── "義大利麵專屬房"
│   └── 9 個 icon + text info chips（套用「單側 Border Info Item 規則」）
│   ── ↺ 0527 移除：Controller - date（入住日 + 退房日 calendar 對 + 訂房間數 stepper）
├── Table render - date list
│   ├── 價格
│   ├── semantic table：日期 / 定價調整 / 定價
│   └── 2 筆日期價格與總計
├── Input textarea
└── Footer
    ├── 清除
    └── 確定
```

> **0527 重大變更**：原本中段「Controller - date」（入住日 calendar + 退房日 calendar + 訂房間數 stepper + 已達最低/上限間數 hint）整段**永久移除**。modal 從 metadata chips 直接接 Price table，省去日期挑選與數量調整。 Figma 標的高度從 1004 縮為 724（差 280，正好是被移除段落的視覺高度）。現行 `preview/partials/room-booking-modals.html` 的 `modalRoomEdit` 不得再放回 `Date controller` (`px-3 py-4`) 與 `訂房間數 stepper` 兩 block；對應 JS（`data-room-edit-step`, `data-room-edit-quantity`, `data-room-edit-quantity-hint`, calendar 初始化）也不應恢復。

### 固定文字內容

| 區塊 | 內容 |
|---|---|
| Header title | `我是專案名稱` |
| Header status | `鎖定` |
| 房型 | `義大利麵專屬房` |
| Info chips | `天數：1 夜`, `會員：金鑽以上`, `最少須訂間數：28`, `不可退款`, `訂金：100%`, `開放期間：2026-01-01 ~ 長期`, `熱賣期間：2026-01-01 ~ 2027-12-31`, `1 天內付款`, `可用庫存數：5` |
| 日期 | 入住日與退房日皆使用 `components/calendar-simple.md` default variant；markup 不 hard-code 日期字串，由 JS 填入今日 `dayjs().format("YYYY-MM-DD")` |
| 價格表 | `2026-03-01`, `2026-03-02`, 定價調整 `1999`, `1999`, 定價 `1000`, `1000`, 總計 `8888`, `9999` |
| Textarea | `我是 textarea\n- 內容\n- 內容` |
| Footer | `清除`, `確定` |

### 行為規則

| 行為 | 規則 |
|---|---|
| 開啟預設 | `edit.svg` click → 開啟（0527 起無 stepper，預設為 lock + 定價調整 disabled） |
| lock / unlock | 只控制價格表「定價調整」input 的 active / disabled，與訂房數量無關 |
| lock 狀態 | 顯示 `icons/lock`，定價調整 input disabled，背景 `Color/Neutral/100`，文字 `Color/Text/400` |
| unlock 狀態 | 顯示 `icons/unlock`，定價調整 input 可編輯，背景 `Color/Neutral/0`，文字 `Color/Text/800` |
| 清除 | 只清除目前非 disabled 的定價調整 input value 與 textarea；disabled input 不動 |
| 關閉 | 點 header close、backdrop、Esc 關閉 |

> **↺ 0527 移除以下規則**（因 date controller 整段已拿掉）：
> - 數量 stepper（不再存在）
> - 最低數量 / 最高數量（不再存在）
> - 「最少須訂間數：28」原為 stepper 區下方 hint，現該文字依然在 metadata chips 上方那行（`最少須訂間數：28` 仍是 info chip 之一），純顯示
> - 日期選擇（入住日 / 退房日 calendar 對不再存在；對應的 `data-room-edit-quantity*`、calendar 初始化 JS 應一併移除）

### Layout / RWD

| 區塊 | 規格 |
|---|---|
| Mobile reference | 375px 為最小支援 viewport / Figma 參考，不是固定寬 |
| Modal width | `width: 100%`，desktop 可設 `max-width`，mobile 滿版 |
| Modal height | content 高於 viewport 時，保留 header / footer，body 垂直 scroll |
| Info chips | `flex-wrap`，不使用 horizontal overflow；每個 item 必須套用「單側 Border Info Item 規則」，即元素本身 `border-0 border-l-4 rounded-md`，不可使用完整外框、pseudo element 或 inner rail |
| Date row | 375px 下兩欄平均寬度，欄位內使用 Calendar simple button：日期文字 + `calendar.svg` |
| Price table | 使用語意 `<table>`，保留 table 自身 padding 與 row border，不拆成卡片，也不使用 grid/full cell border 模擬表格；tbody cell 垂直節奏由 table 專用 CSS 控制：單列時 `td` 上下各 8px；多列時第一列 top 8px、最後列 bottom 8px，列與列之間由上一列 bottom 4px + 下一列 top 4px 組成 8px |
| Textarea | 可輸入，多行文字區 |

### Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| Header title / room name | 20px SemiBold 600 | `Color/Text/800` |
| Header status `鎖定` | 20px Regular | `Color/Brand/Brand-500` |
| Info chip text | 16px Regular | `Color/Text/800` |
| Date label / value | 16px Regular | `Color/Text/800` |
| Stepper hint min | 12px Regular | `Color/Text/600` |
| Stepper hint max | 12px Regular | `Color/Brand/Brand-600` |
| Disabled icon | — | `Color/Neutral/300` |
| Active stepper icon | — | `Color/Text/800` |
| Lock icon | — | `Color/Brand/Brand-600` |
| Disabled input bg | — | `Color/Neutral/100` |
| Disabled input text | — | `Color/Text/400` |

---

## state=purchase add-on（加購項目）

**使用位置**：`preview/partials/room-booking-modals.html`；由 `room-booking.html`
與訂單修改 modal 內共用的訂房明細表「加購」欄位 `icons/purchase-item` 觸發，
行為在 `preview/js/purchase-addon-modal.js`。
**觸發**：點擊 `purchase-item.svg` icon 開啟。
**Figma 讀取日期**：2026-05-06。

此 modal 以 375px 作為 Figma mobile 參考寬度；實作不可固定寫死 375px，需保持流動寬度。Desktop / tablet / mobile 皆保留 Header + scrollable body + Footer 結構。

### Figma RWD 來源

| 斷點參考 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| Desktop | `1392:17122` | 1194×893px | `left menu list + middle Frame 410` 為同一個 flex group；right result cart 是外側 sibling |
| Tablet | `1393:18281` | 768×1959px | 左側 menu list + middle `Frame 410` 的 flex group 改為 `flex-col`；right result cart 保持在可用寬度中的優先位置 |
| Mobile | `1393:19196` | 375×3139px | 單欄垂直堆疊：menu list → `Frame 410` content → result cart |
| Content frame | `I1393:18281;73:678;1393:18099` | 397×1143px | 內部 `Frame 410` content source；尺寸不同於外層 RWD modal frame，不可拿來覆蓋 outer modal 寬高 |

### 結構

```
Modal
├── Header Frame 10
│   ├── "加購"
│   └── icons/close
├── Body
│   ├── Main flex group（left + middle）
│   │   ├── Left: Category menu list
│   │   │   ├── Header "分類" + icons/down
│   │   │   └── 12 個 menu list category item（default selected = 第一項 "所有"）
│   │   └── Middle: Frame 410 content
│   │       ├── Header "加購項目" + icons/down
│   │       └── Product cards
│   │           ├── title + sub-title
│   │           ├── notice textarea
│   │           ├── date / calendar component
│   │           ├── hour + minute selects controlled by toggle
│   │           ├── original price + inventory + cost input
│   │           └── booking quantity stepper
│   └── Right: Result / cart panel
│       ├── middle stepper 產生的 brief transaction cards
│       └── 獨立白底購物車明細 block / 總價（未來與 backend 協作）
└── Footer
    ├── 取消
    └── 確定加購
```

### 固定文字內容

| 區塊 | 內容 |
|---|---|
| Header title | `加購` |
| Category title | `分類` |
| Category items | `所有`, `餐飲`, `票券`, `飲品`, `設備租借`, `加床`, `優惠促銷`, `藍染`, `伴手禮`, `住宿`, `盥洗用品`, `會議服務` |
| Category count | prototype 一律顯示 `12` |
| Content frame title | `加購項目` |
| Product card 1 | title `早餐`、sub-title `套餐組合 a、b 、c` |
| Product card 2 | title `早餐`、sub-title `套餐組合 a、b 、c` |
| Product card 3 | title `嬰兒用品`、sub-title `餐具`, `安全椅` |
| Notice label | `備註`，textarea placeholder `placeholder` |
| Date label | `日期`，calendar/select control visual content `2026-02-27` |
| Time label | `時 / 分`，hour / minute select values always render as two digits (`01`, `04`, `22`, `44`)；toggle controls active / disabled state |
| Price / inventory / cost | original price `$ 1,999`、inventory `庫存：8`、cost input `9988` with `icons/dollar` |
| Quantity stepper | DatePicker/stepper visual value examples `2`, `1`；implementation 不額外渲染 `訂房間數` label |
| Cart title | `購物車明細` |
| Cart rows | prototype uses selected product cards and booking quantity; exact backend rows are not implemented |
| Total | `總價` / calculated from selected card cost × booking quantity |
| Footer | `取消`, `確定加購` |

### Layout / RWD

| 區塊 | 規格 |
|---|---|
| Header | h 51px, padding 12px，title left、close right |
| Footer | h 58px, padding 左右 20px / 上下 0，buttons right aligned |
| Modal desktop | max width follows 1194px reference; content may cap to viewport minus 24px |
| Modal body | content higher than viewport 時，body 垂直 scroll；header / footer 保持可見 |
| Desktop layout | body 內是兩個主要 sibling：`main group(left menu + Frame 410)` / `right result cart`；main group 內 left + middle 橫向 flex |
| Tablet layout | content swap 寬 744px 參考：main group 約 397px，right result 約 327px，中間 gap 20px；main group 內 left + middle 改為 `flex-col` |
| Mobile layout | 整體改單欄垂直堆疊；category panel 在上，`Frame 410` content 居中，result cart 在下 |
| Left menu accordion | `分類` header 可 collapse / expand 自身 menu list；collapse 不關閉 modal；icon 只在 down / up 之間切換，不使用 right direction |
| Middle content accordion | `加購項目` header 是獨立 accordion button，可 collapse / expand product list；icon 只在 down / up 之間切換，不影響左側 category list 或右側 cart |
| Category item | height 38px，icon 38×38，文字 16px SemiBold，count pill 24px high |
| Category default selected | 第一項 `所有` 預設 selected / focus style |
| Category focus style | click 後切換 selected style；只有被選取 item 有 focus/on 狀態 |
| Menu list icons | 一律使用 `specs/icons.md` 的 `menu-list-*-none-fill.svg`；icon 本身透明，不帶背景色 |
| Middle `Frame 410` | 依左側 category button 顯示對應加購項目；source node 是 internal 397×1143 content frame，不是 outer modal RWD frame；implementation width 為 100% 填滿其 container，不固定為 397px |
| Product card | white bg、radius 8、border `Color/Border/Default`、padding 16px；card content 有 3 種 responsive layout style |
| Product card / large | source `I1392:17122;73:678;1392:16946`，`Frame 410` 571×760；card 507×172，內部 3 欄水平排列：140 / 140 / 155，gap 20 |
| Product card / medium | source `I1393:18281;73:678;1393:18099`，`Frame 410` 397×1143；card 333×332，前兩欄 140 / 140 在上，第三欄 155 在下一列 |
| Product card / narrow | mobile content 寬度不足時，三欄改單欄垂直堆疊，保持各欄內容順序：title/notice → date/time → cost/quantity |
| Title / sub-title | 左上：title 16px、sub-title 12px；不可用數量文字取代 sub-title |
| Notice textarea | label `備註` + textarea-like Input，34px min height，placeholder `placeholder`，可輸入 prototype local state；height 可由使用者拖曳調整，不固定高度 |
| Date calendar | label `日期` + `Calendar simple` dropdown function；Figma 樣本文字 `2026-02-27` 不作為實作 default，所有 calendar default date 一律由 JS 初始化為 today (`dayjs().format("YYYY-MM-DD")`) |
| Date text special rule | Add-on product card date `<span>` 使用 14px；若套 16px 會在 140px 欄寬內溢出 |
| Time controls | label `時 / 分` + toggle；toggle on 時 hour/minute selects active，toggle off 時 hour/minute selects disabled and use disabled bg/text tokens；toggle off 時 cart card 不顯示時間 chip，也不顯示替代文案 |
| Time format | hour / minute values must be `padStart(2, "0")`; cart time chip follows the same two-digit format |
| Cost / inventory | original price + inventory on first row；below is cost input with `icons/dollar` and numeric value |
| Booking quantity | DatePicker/stepper visual：minus, selected number bg `Color/Tab/yellow`, plus；不額外顯示 `訂房間數` label |
| Right result panel | middle stepper click 後，上方產生 / 更新 brief transaction cards；delete button 刪除該 card |
| Cart detail block | right panel 下方的白底區塊；顯示 `購物車明細` rows、分隔線、總價；未來資料與 backend 協作 |
| Product/cart card | radius 8，border `Color/Border/Default`，white background，padding 16px |

### Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| Header / category title | 20px SemiBold 600 | `Color/Text/800` |
| Category label | 16px SemiBold 600 | `Color/Text/800` |
| Body text | 16px Regular | `Color/Text/800` |
| Sub-title / placeholder / inventory | 12px Regular | `Color/Text/800` / disabled uses `Color/Text/400` |
| Product price | 16px SemiBold 600 | `Color/Text/800` |
| Disabled time select | fill `Color/Neutral/200` + text `Color/Text/400` | `Color/Neutral/200`, `Color/Text/400` |
| Active time select | fill `Color/Neutral/0` + stroke `Color/Neutral/200` | `Color/Neutral/0`, `Color/Neutral/200` |
| Quantity active value bg | `Color/Tab/yellow` | `Color/Tab/yellow` |
| Cart date chip bg | `Color/Accent/cart-date` | `Color/Accent/cart-date` |
| Cart time chip bg | `Color/Accent/cart-time` | `Color/Accent/cart-time` |
| Count pill text | 12px Regular | `Color/Text/800` |
| Active category count bg | `Color/Bootstrap/focus-background` | `Color/Bootstrap/focus-background` |
| Modal body bg | `Color/Surface/Default` | `Color/Surface/Default` |
| Content panel bg | `Color/Modal/Hover` / `Color/Neutral/75` | `Color/Modal/Hover` / `Color/Neutral/75` |
| Card border | `Color/Border/Default` | `Color/Border/Default` |
| Footer cancel bg | `Color/Neutral/200` | `Color/Neutral/200` |
| Footer confirm bg | `Color/Text/800` | `Color/Text/800` |

### Token gaps / unresolved

- None for cart date/time chips as of 2026-05-06. `Color/Accent/cart-date` and `Color/Accent/cart-time` were added to Figma Variables and recorded in `specs/assets/tokens.md`.

### Interaction

| 行為 | 規則 |
|---|---|
| 開啟 | `purchase-item.svg` click → open `modalPurchaseAddonBackdrop` |
| 關閉 | header close、footer `取消`、backdrop、Esc 關閉 |
| 確定加購 | prototype 目前只關閉 modal；未接資料提交 |
| Category click | 左側 menu list item 切換 selected/focus style，並更新 middle `Frame 410` content |
| Category 展開/收合 | `分類` header click collapse / expand 左側 menu list |
| Middle stepper | plus / minus 改變該加購項目數量；數量 > 0 時於右側 result panel 顯示 brief transaction card |
| 刪除商品 | 右側 card trash click 刪除該 card，並同步 middle stepper 數量歸零 |
| Notice textarea | 可編輯 prototype local state；未接 backend |
| Date calendar | prototype default date = today；使用者選取後更新 local state，未接 backend |
| Time toggle | 點擊切換該 card 的 hour/minute selects disabled / active status；disabled 時 select 不可修改 |
| Cost input | 可編輯 prototype local state；right cart total 依目前 cost × quantity 計算 |
| Cart details | 購物車明細未來與 backend 協作；目前 prototype 由前端 local state 呈現 |

---

## state=order summary（訂單內容 / 訂單明細）

**使用位置**：`preview/partials/room-booking-modals.html`；由 `room-booking.html`
的 `產生訂單` 按鈕與 `order-processing.html` 狀態 pill 選單的「訂單」動作開啟。
**Figma 讀取日期**：2026-05-25（current source `1722:40127`，覆蓋早期 2026-05-06 contract）。
**目前 implementation 範圍**：3 個 variant (unpaid / paid / waitlist) 共用同一個 modal layout，pill + 基本資訊狀態文字由 `setOrderSummaryVariant` 切換；layout 來源為 `1722:40127`。

### Current Figma contract（2026-05-25, source `1722:40127`）

| 變動 | 原 spec | 新 spec |
|---|---|---|
| 移除 sections | `付款與帳戶` / `轉正式單` / `飯店資料` / `訂房須知` | 全數移除；付款金額類欄位併入 `基本資訊` |
| 訂房與入住人資訊 | 含 Email | 移除 Email，欄位順序：姓名 / ID / 電話 / 生日 / 性別 / 地址 / 手機 |
| 加購明細 + 訂單總額 | 既有 inline-row 並排（保留） | 同舊規 |
| Transfer (`轉正式單`) JS | `setOrderSummaryTransferPay` + chip 切換 fields | 已從現行實作移除 |
| 列印日期 | hardcode `2026-04-26 14：49` | 沿用（將來由後端填入） |

### Figma 狀態來源

| 狀態 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| Default unpaid | `1411:20866` | 1019×2911px | 預設訂單內容；top pill `未付款`，文案 `此訂單尚未付款` |
| Paid | `1437:44343` | 1019×2506px | top pill `已付款`；Figma 已由使用者修正文案為 `此訂單已付款` |
| Waitlist | `1437:45408` | 1019×2506px | top pill `候補單`，文案 `此訂單尚為候補單`；`基本資訊 > 訂單狀態` 仍顯示 `未付款` |
| Transfer official | `1437:46152` | 1019×2935px | 含 `轉正式單` accordion section，section 內有自己的 `清除` / `改為正式單` actions |

### Default unpaid 結構

```
Modal (1019px wide reference)
├── Header Frame 10
│   ├── "訂單內容"
│   └── icons/close
├── Content swap
│   ├── Title row: "訂單明細" + actions "簡訊" / "列印"
│   ├── Status row: pill "未付款" + "此訂單尚未付款" + print date
│   ├── 基本資訊 (7 KV pair grid，含付款金額欄位)
│   ├── 訂房明細
│   ├── 加購明細 + 訂單總額 (並排 inline-row)
│   └── 訂房與入住人資訊 (訂房人 / 住房人 各 7 欄)
└── Footer
    ├── 取消
    └── 確定
```

### 固定文字內容（default unpaid）

| 區塊 | 內容 |
|---|---|
| Header title | `訂單內容` |
| Main title | `訂單明細` |
| Header actions | `簡訊`, `列印`，使用 `order-summary-message-share.svg` / `order-summary-print.svg` |
| Top status | `未付款`, `此訂單尚未付款`, `列印日期：2026-04-26 14：49`（hardcode，後端接入時改成 dynamic） |
| 基本資訊 | KV grid（desktop ≥769px 2 pair / row, mobile+tablet ≤768px 1 pair / row）；desktop 列序：`訂單編號 BBBXXXYYY12345` \| `訂單狀態 未付款` ;; `訂購日期 2031-01-31 14：25：25` \| `繳款期限 2031-01-31 14：25：25` ;; `付款資料 xyz 123` \| `對帳單號 BBBXXXYYY12345` ;; `訂單人員 Money` \| `修改人員 Punchi` ;; `其他需求 xyz 123` \| `應付訂金 $ 10,000` ;; `處理備註 xyz 123` \| `已付訂金 $ 10,000` ;; (spacer) \| `尚欠金額 $ 999` |
| 訂房明細 | table columns `#`, `房型`, `專案`, `入住日期`, `間數`, `單價`, `小計`；prototype 2 rows + `訂單總計 $ 888,011` |
| 加購明細 | table columns `#`, `加購項目`, `備註`, `數量`, `單價`, `小計`；prototype 2 rows + `加購總計 $ 888,011` |
| 訂單總額 | `訂房明細 888`, `加購明細 888`, `訂單總計 $ 888,011` |
| 訂房與入住人資訊 | `訂房人` / `住房人` groups with `姓名`, `ID`, `電話`, `生日`, `性別`, `地址`, `手機`（無 Email） |
| Footer | `取消`, `確定` |

### Variant rules

| Variant | 規則 |
|---|---|
| Default unpaid | `正式單與候補單` radio = `無設定` 時，點擊 `產生訂單` 開啟；top pill `未付款` (`bg-status-negative`); `基本資訊 > 訂單狀態` 顯示 `未付款` (`text-status-negative`) |
| Paid | `正式單與候補單` radio = `正式單` 時，點擊 `產生訂單` 開啟；top pill `已付款` (`bg-status-positive`); 文案 `此訂單已付款`; `基本資訊 > 訂單狀態` 顯示 `已付款` (`text-status-positive`) |
| Waitlist | `正式單與候補單` radio = `候補單` 時，點擊 `產生訂單` 開啟；top pill `候補單` (`bg-brand-active`); 文案 `此訂單尚為候補單`; `基本資訊 > 訂單狀態` 仍顯示 `未付款` (`text-status-negative`)，因為「候補」本質仍是 unpaid 狀態 |
| Transfer official | **2026-05-25 移除**：原 `轉正式單` accordion 不再屬於此 modal；setOrderSummaryTransferPay JS、`data-order-summary-transfer-*` markup 與相關付款方式 chip group 一併移除 |

### Layout / RWD

| 區塊 | 規格 |
|---|---|
| Modal width | desktop max follows 1019px reference; viewport narrower than reference uses `calc(100vw - 24px)` |
| Modal height | content taller than viewport 時，header / footer fixed，body scroll |
| Mobile | modal fills viewport width / height，body scroll；tables keep horizontal scroll instead of forcing columns to collapse |
| Basic info | desktop (≥769px) uses two label/value pairs per row; mobile+tablet (≤768px) stacks to one label/value pair per row |
| Tail-row reorder rule | 在 ≤768px 用 CSS `order` 把 5 個 tail 欄位推到 `基本資訊` grid 最末，順序固定為 `應付訂金`(order 1) → `已付訂金`(order 2) → `尚欠金額`(order 3) → `其他需求`(order 4) → `處理備註`(order 5)。理由：`其他需求` / `處理備註` 文字長度不可控，且 3 筆付款金額在 desktop 已視覺相鄰（右側欄 5/6/7 列），mobile 也維持「金額三連 → 文字欄位」的閱讀順序 |
| Empty grid cell | desktop 第 7 列左側為 spacer（讓 `尚欠金額` 落在右側欄與 `應付訂金`/`已付訂金` 相鄰）；mobile+tablet 隱藏 spacer |
| Section title underline | if a section has only a head title row, such as `基本資訊`, the title uses a single solid underline with `Color/Text/800` |
| Head title + table border | if a section title is followed by a table, the title has no underline; the table uses the `order-summary-table--after-title` modifier so `thead` has no top border and only keeps its bottom border |
| Long tables | semantic `<table>` with `min-width` and overflow-x wrapper |
| Add-on / order-total row | `加購明細` and `訂單總額` are siblings in one row-direction container; Figma widths are approximately 655px / 315.67px with 24px gap |
| Add-on table | table width follows Figma 615px content area; `數量` / `單價` / `小計` values right aligned; `小計` amount and `加購總計` amount right aligned |
| Order total table | table width follows Figma 275.67px content area; container/header/table use `Color/Brand/Brand-50`; section title uses `Color/Surface/Action-Default` |
| Table row borders | body row separators must render with `Color/Neutral/200` / `border-border-disabled`; implement the HTML table border on `tbody td` so the Figma row line is visible across the row |
| Date cells | `入住日期` 的兩個日期必須各自包在獨立 `<span>`，並保持 nowrap，不可讓 `2026-04-24（四）` 斷行 |
| Project subtitle | `專案` 欄位副文字需為 full-width wrapping block，避免無空格長字串撐開 `訂房明細` table |
| Count / price / subtotal cells | `間數`、`單價`、`小計` header/cells must be nowrap |
| Amount alignment | 有金額數字的欄位預設向右對齊；`$` 與數字需作為同一組 inline content，不可斷開，但 `$` 與數字之間保留視覺 gap |
| Hotel data | follows Figma table structure: section title, centered hotel name band, then 4 bordered rows with two title/content pairs per row |
| Booking rules content | `訂房須知` content uses textarea-like block with minimum height matching Figma content area |
| Down/up icon sections | Any order summary section header that displays `icons/down` or `icons/up` must be implemented as a functional accordion, not static decoration |

### Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| Header title | 20px SemiBold 600 | `Color/Text/800` |
| Main title | 24px SemiBold 600 | `Color/Text/800` |
| Action buttons bg | `Color/Brand/Brand-100` | `Color/Brand/Brand-100` |
| Default unpaid pill | `Color/Surface/Status-Negative` | `Color/Surface/Status-Negative` |
| Paid pill | `Color/Surface/Status-Positive` | `Color/Surface/Status-Positive` |
| Waitlist pill | `Color/Surface/Brand-Active` | `Color/Surface/Brand-Active` |
| Section header bg | `Color/Surface/Default` | `Color/Surface/Default` |
| Section panel bg | `Color/Neutral/0` | `Color/Neutral/0` |
| Section border | `Color/Neutral/200` | `Color/Neutral/200` |

### Interaction

| 行為 | 規則 |
|---|---|
| 開啟 | `產生訂單` click -> read `rb-order-type` radio and open `modalOrderSummaryBackdrop` with mapped variant: `無設定` -> default unpaid, `正式單` -> paid, `候補單` -> waitlist；every modal open resets scrollable body position to top。**另一開啟路徑**：`訂單處理` 頁（`specs/pages/order-processing.md`）表格列狀態 pill 下拉選單「訂單」項目點擊，同樣開啟 `modalOrderSummaryBackdrop`，variant 由該筆訂單實際狀態決定（backend 資料驅動，前端不需另寫開啟邏輯） |
| 關閉 | header close、footer `取消` / `確定`、backdrop、Esc 關閉 |
| Header actions | `簡訊` opens `state=sms / order summary`; `列印` remains visual prototype，尚未接後端或瀏覽器 print API |
| Accordion sections | `訂房與入住人資訊` header toggles its content open/closed; icon switches between `down.svg` and `up.svg`; modal open resets to expanded |
| Other status details | 尚未接入；使用者會後續建立狀態按鈕，production 由 backend transaction status 決定 |

---

## state=sms / order summary（簡訊）

**使用位置**：`preview/partials/room-booking-modals.html`；由訂單明細 modal header
action `簡訊` 與 `order-processing.html` 狀態 pill 選單的「簡訊」動作開啟。
**Figma 讀取日期**：2026-05-07。
**Figma source**：selected node `1436:43555`，648×1161px，main component `73:626 / state=has content`。

### Implementation contract

| 項目 | 規則 |
|---|---|
| Open trigger | order summary header `簡訊` button opens `modalSmsBackdrop`。**另一開啟路徑**：`訂單處理` 頁（`specs/pages/order-processing.md`）表格列狀態 pill 下拉選單「簡訊」項目點擊，同樣開啟 `modalSmsBackdrop` |
| Modal size | desktop max width follows 648px reference; viewport narrower than reference uses `calc(100vw - 24px)` |
| Header | title `簡訊`, close icon `icons/close` |
| 發送號碼 | section label `發送號碼`; first radio is default checked; first option select text `0999111222`; second radio label `自行設定` with single input placeholder |
| 訂單內容 | section label `訂單內容`; fields: `訂單編號`, `飯店名稱`, `銀行`, `虛擬帳號`, `入住日`, `訂單總額`, `應付訂金`, `已付金額`, `訂房人`, `入住人`, `訂房人生日`, `繳款期限`, `取消日期`, `入住夜數`; data is backend-rendered in production；these 14 fields are **writable inputs** (front-desk staff can type into them) and are **independent from the 發送內容 textarea below** - editing a field here does NOT insert/change the textarea content（使用者 2026-07-03 確認） |
| 發送內容 | section label `發送內容`; stats card contains `字數統計 25` and `簡訊通數 1` separated by a vertical divider; sample select label `樣本` with value `sample`; textarea placeholder; textarea 是獨立輸入區，供前台人員套用 `樣本` 模版或自行輸入文字，跟上方「訂單內容」欄位不連動 |
| 歷史紀錄 | card title `歷史紀錄`; table columns `#`, `登錄類別`, `登錄日期`, `登錄號碼`, `登錄內容`; prototype rows use placeholder and `111` |
| Footer | `取消`, `確定`; both close modal in preview |
| Active-state caveat | first radio default was confirmed by user; do not infer other active/default states from visual selection alone |

### Layout / RWD

| 區塊 | 規格 |
|---|---|
| Shell | uses shared modal header/footer with fixed header/footer and scrollable body |
| Content slot | body content has `Color/Neutral/200` border and 12px padding, matching Figma content swap |
| Form rows | desktop uses 80px left section label + 32px gap + flexible right content; mobile stacks section label above content |
| Order fields | desktop order fields use 3-column grid; first row `飯店名稱` spans 2 columns; mobile stacks to one column |
| History table | table keeps horizontal scroll on narrow viewports |

---

## state=password（修改密碼）

```
Modal (320×407px)
├── Header — "會員安全管理"
├── Frame 15 — Tab + Content (padding 12px, border Color/Neutral/200)
│   ├── Tab 列（Frame 61）: 密碼[選中] | 暱稱 | IP 紀錄
│   ├── 新密碼 label + Input (password) + icons/eye-open
│   ├── 新密碼確認 label + Input (password) + icons/eye-open
└── Frame 63 — 原密碼區 (padding 12px, border Color/Neutral/200)
    ├── 原密碼 label + 說明 "作用於修改密碼與暱稱" (sm)
    └── Input "92!xD2aB" + icons/eye-open
└── Footer
```

### Tab 列規格

**確認日期**：2026-04-16

3 個 Input instance 橫排，`gap: 12px`，**全部無外框（無 strokes）**：

| Tab | Figma 寬度 | HTML class | 選中狀態 | 未選中狀態 |
|---|---|---|---|---|
| 密碼 | 44px | `w-11` | `bg-border-default` | `bg-white`（無底色差異） |
| 暱稱 | 44px | `w-11` | `bg-border-default` | `bg-white` |
| IP 紀錄 | 63px | `w-[63px]` | `bg-border-default` | `bg-white` |

- Padding：`py-1.5 px-3`（6px/12px）
- 字型：`text-base`（16px）`text-text-default`
- **不加 border**：選中只有 `bg-border-default`，未選中看起來無框無底色

### 密碼欄位

| 欄位 | 右側 icon |
|---|---|
| 新密碼 | `icons/eye-open` |
| 新密碼確認 | `icons/eye-open` |
| 原密碼 | `icons/eye-open` |

---

## state=nick name（修改暱稱）

```
Modal (320×333px)
├── Header — "會員安全管理"
├── Frame 15 — Tab + Content
│   ├── Tab 列: 密碼 | 暱稱[選中] | IP 紀錄
│   └── 暱稱 label + Input "xiaomi987" + icons/none
├── Frame 63 — 原密碼區（同 password variant）
└── Footer
```

---

## state=IP（IP 登入紀錄）

```
Modal (320×455px)
├── Header — "會員安全管理"
├── Frame 15 — Tab + Content
│   ├── Tab 列: 密碼 | 暱稱 | IP 紀錄[選中]
│   ├── 本次登入區
│   │   ├── 密碼 [90天] 未更換，請定期更新（sm）
│   │   └── IP 61.333.222.19 [TW]（sm）
│   └── 歷史登出入區（3 筆紀錄）
│       ├── 4 天前  2026-12-31 15:15:15 / IP... / 00:11:22
│       ├── 10 天前 2026-12-15 15:15:15 / IP... / 00:11:22
│       └── 90 天前 2026-12-01 15:15:15 / IP... / 00:11:22
└── Footer
```

### IP 紀錄時間色彩

| 時間範圍 | 顏色 | Token |
|---|---|---|
| 近期（4 天前） | `Color/MenuItem/Default` | `Color/MenuItem/Default` |
| 中期（10 天前） | `Color/Surface/Brand-500-Default` | `Color/Surface/Brand-500-Default` |
| 過久（90 天前） | `Color/Surface/Negative` | `Color/Surface/Negative` |

> 密碼 "90天" 未更換的警示也使用 `Color/Surface/Negative`。

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| Modal 邊框 | `Color/Neutral/300` | `Color/Neutral/300` |
| Header 下邊框 | `Color/Neutral/300` | `Color/Neutral/300` |
| 標題文字 | `Color/Neutral/800` | `Color/Neutral/800` |
| Content 區邊框 | `Color/Neutral/200` | `Color/Neutral/200` |
| 選中 Tab 背景 | `Color/Neutral/100` | `Color/Neutral/100` |
| 確定按鈕 bg | `Color/Neutral/800` | `Color/Neutral/800` |
| 取消按鈕 bg | `Color/Neutral/200` | `Color/Neutral/200` |

---

## 實作注意事項

1. **Overlay**：全站統一使用 `--effect-modal-backdrop` 半透明黑色遮罩（見「全站 Backdrop 規格」）
2. **置中**：`position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`
3. **關閉**：點 icons/close 或遮罩關閉 Modal
4. **Tab 切換**：password / nick name / IP 共用同一 Modal，tab 控制顯示內容
5. **密碼 toggle**（2026-07-16 使用者拍板補行為, Figma 原稿只畫單一態）：
   點擊切換 input 顯示/隱藏, icon 反映**當前狀態** -
   `icons/eye-open` = 資料顯示中, `icons/eye-close` = 資料隱藏中（預設）。
   實作: `js/topbar-modals.js` eye-toggle handler

---

*Generated from Figma component set · Updated 2026-04-13 · Backdrop 規格補充 2026-04-15*
