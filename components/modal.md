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

---

## 全站 Backdrop（遮罩）規格

> **全站統一**：所有 Modal 共用同一 backdrop 設定，不因 Modal 內容不同而異。

| 屬性 | 值 | 說明 |
|---|---|---|
| HTML 實作 | `rgba(0, 0, 0, 0.4)` | 半透明黑色遮罩，全站統一 |
| z-index | `60`（高於 mobile sidebar `50`） | — |
| 定位 | `position: fixed; inset: 0` | 全屏覆蓋 |
| 關閉行為 | 點擊 backdrop 關閉 Modal | — |

> **Figma 設計稿說明**：設計稿中以全屏 `#d9d9d9` 矩形（Rectangle 3）+ `Subtract` Boolean Operation 表示遮罩示意，**純粹用於 UI 設計稿交付展示**，不對應 HTML 的實際色值，實作時以上方 `rgba(0, 0, 0, 0.4)` 為準。

---

## 共用外框

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `320px` | — |
| Background | `#ffffff` | `Color/Neutral/0` |
| Corner radius | `8px` | `Radius/8` |
| Border | `#b0b0b0` | `Color/Neutral/300` |

---

## 共用 Header（Frame 10）

```
Frame 10 (320×51px)
├── Texts md Bold → 標題文字  20px  SemiBold 600  #454545  (x:12, y:12)
└── icons/close (24×24, x:284, y:13.5)
```

| 屬性 | 值 | Token |
|---|---|---|
| 高度 | `51px` | — |
| Padding | `12px` all sides | `Spacing/12` |
| 下邊框 | `#b0b0b0` + `#00000033`（雙層） | `Color/Neutral/300` |
| 標題字號 | `20px` SemiBold 600 | — |
| 關閉 icon | `icons/close`，x:284（靠右） | — |

---

## 共用 Footer（Frame 11）

```
Frame 11 (320×58px, padding 12px)
├── Button Y/N cancel（取消） (56×34px, x:188)  → bg #d1d1d1
└── Button Y/N 確定 (56×34px, x:252)  → bg #454545
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
| Border color | `#d1d1d1` | `Color/Neutral/200`, `border-border-disabled` |
| 內容 padding | 6px 12px | `Spacing/6`, `Spacing/12` |
| icon | 24×24 | 來自 `preview/assets/icons/` |
| icon/text gap | 8px | `Spacing/8` |
| 文字 | 16px Regular, `#454545` | `Color/Text/800` |

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
├── Frame 15 — Content (padding 12px, border #d1d1d1)
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
**使用位置**：`preview/landing.html` 的 room-booking template，訂房明細表「房型」欄位旁的 `icons/info`。

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
| 外框 | 560×390px, radius 8, border `#b0b0b0` | `Radius/8`, `Color/Neutral/300` |
| Header | h 51px, padding 12px | `Spacing/12` |
| Header 下邊框 | `#b0b0b0` + `#00000033` | `Color/Neutral/300` + 固定 effect |
| 房名列 | padding top 8, right 12, bottom 4, left 12 | `Spacing/8`, `Spacing/12`, `Spacing/4` |
| Info item row | padding 8px 12px, gap 20px, flex-wrap | `Spacing/8`, `Spacing/12`, 固定 20px gap；不使用 horizontal overflow |
| Info item | h 36px, radius 6, white bg, icon + text | `Radius/6`, `Color/Neutral/0` |
| Info item 左側 border | only left side, 4px；top/right/bottom border width = 0；跟隨 item `Radius/6` 自然裁切圓角 | `Spacing/4`, `Radius/6`, `Color/Neutral/200` |
| Static input frame | padding 8px 12px | `Spacing/8`, `Spacing/12` |
| Static input content | 536×174px, radius 6, padding 6px 12px, border `#d1d1d1`，白底一般狀態；不可編輯，不套 disabled 灰底樣式 | `Radius/6`, `Spacing/6`, `Spacing/12`, `Color/Neutral/200` |
| Footer | h 58px, padding 12px, button right aligned | `Spacing/12` |

### Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| Header title | 20px SemiBold 600 | `Color/Text/800` |
| 房名 | 20px SemiBold 600 | `Color/Text/800` |
| Pill text | 16px Regular 400 | `Color/Text/800` |
| Static input text | 12px Regular 400 | `Color/Text/800` |
| Icon fill | black | `Color/Icon/Default` |
| Close button bg | `#454545` | `Color/Neutral/800` |
| Close button text | `#e1e1e0` | `Color/Text/100` |

### RWD / Interaction

- Desktop：置中顯示，寬度 560px，套用全站 modal backdrop。
- Mobile：與大型 bulletin modal 相同，採滿版 modal（100% width / 100% height），避免 560px 內容在 375px viewport 被壓縮。
- 點擊 `icons/info` 開啟；點 header close、footer「關閉」、backdrop 或 Esc 關閉。
- 四個 info item 保持 flex-wrap，不因 mobile 或窄寬度改成 horizontal overflow。
- 房型資料目前為 prototype 靜態內容；內容區為不可修改的靜態 input-like 區塊，未來由後端資料渲染。

---

## state=room booking edit（訂房明細編輯）

**使用位置**：`preview/landing.html` 的 room-booking template，訂房明細表「操作」欄位的 `icons/edit`。
**觸發**：點擊 `edit.svg` icon 開啟。
**Figma 讀取日期**：2026-05-05。

此 modal 以 375px 作為最小支援 viewport 的 Figma 參考寬度；實作不可固定寫死 375px，需全響應式。Desktop 可用較寬 modal 呈現同內容，小尺寸則依 375px 佈局垂直排列並讓 body 區域 scroll。

### Figma 狀態來源

| 狀態 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| 預設 | `1272:27402` | 375×1004px | `lock` + 訂房間數 `1` + `已達最低間數` |
| 上限 | `1272:27354` | 375×1004px | `lock` + 訂房間數 `5` + `已達上限間數` |
| 可編輯價格 | `1272:27306` | 375×1004px | `unlock` + 定價調整 input active |

### 結構

```
Modal (375×1004px reference)
├── Header Frame 10
│   ├── "我是專案名稱"
│   ├── status "鎖定"
│   └── icons/close
├── Frame 12
│   ├── "義大利麵專屬房"
│   └── 9 個 icon + text info chips（套用「單側 Border Info Item 規則」）
├── Controller - date
│   ├── 入住日：Calendar simple default
│   ├── 退房日：Calendar simple default
│   └── 訂房間數 stepper + min/max hint
├── Table render - date list
│   ├── 價格
│   ├── semantic table：日期 / 定價調整 / 定價
│   └── 2 筆日期價格與總計
├── Input textarea
└── Footer
    ├── 清除
    └── 確定
```

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
| 開啟預設 | `edit.svg` click → 開啟 `lock + 已達最低間數 + 數量 1` |
| lock / unlock | 只控制價格表「定價調整」input 的 active / disabled，與訂房數量無關 |
| lock 狀態 | 顯示 `icons/lock`，定價調整 input disabled，背景 `Color/Neutral/100`，文字 `Color/Text/400` |
| unlock 狀態 | 顯示 `icons/unlock`，定價調整 input 可編輯，背景 `Color/Neutral/0`，文字 `Color/Text/800` |
| 數量 stepper | 只控制訂房間數顯示與 +/- 狀態，不處理 `最少須訂間數：28` 的業務規則 |
| 最低數量 | value `1`，minus disabled `Color/Neutral/300`，plus active `Color/Text/800`，顯示 `已達最低間數` |
| 最高數量 | value `5`，plus disabled `Color/Neutral/300`，minus active `Color/Text/800`，顯示 `已達上限間數` |
| `最少須訂間數：28` | 僅渲染文字；後端之後處理，不參與目前前端 stepper 邏輯 |
| 清除 | 只清除目前非 disabled 的定價調整 input value 與 textarea；disabled input 不動 |
| 關閉 | 點 header close、backdrop、Esc 關閉 |
| 日期選擇 | 入住日 / 退房日皆套用 Calendar simple default 行為：預設今日、開啟 dropdown、今日 `.today`、選取 `.selected`、過去日期 disabled |

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

**使用位置**：`preview/landing.html` 的 room-booking template，訂房明細表「加購」欄位的 `icons/purchase-item`。
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
| Footer | h 58px, padding 12px，buttons right aligned |
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
| Disabled time select | fill `#D1D1D1` + text `#888888` | `Color/Neutral/200`, `Color/Text/400` |
| Active time select | fill `#FFFFFF` + stroke `#D1D1D1` | `Color/Neutral/0`, `Color/Neutral/200` |
| Quantity active value bg | `#FFCC00` | `Color/Tab/yellow` |
| Cart date chip bg | `#BDFFF6` | `Color/Accent/cart-date` |
| Cart time chip bg | `#EAFFC5` | `Color/Accent/cart-time` |
| Count pill text | 12px Regular | `Color/Text/800` |
| Active category count bg | `#D3EBFD` | `Color/Bootstrap/focus-background` |
| Modal body bg | `#F6F6F6` | `Color/Surface/Default` |
| Content panel bg | `#F6FAFD` | `Color/Modal/Hover` / `Color/Neutral/75` |
| Card border | `#E1E1E0` | `Color/Border/Default` |
| Footer cancel bg | `#D1D1D1` | `Color/Neutral/200` |
| Footer confirm bg | `#454545` | `Color/Text/800` |

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

## state=password（修改密碼）

```
Modal (320×407px)
├── Header — "會員安全管理"
├── Frame 15 — Tab + Content (padding 12px, border #d1d1d1)
│   ├── Tab 列（Frame 61）: 密碼[選中] | 暱稱 | IP 紀錄
│   ├── 新密碼 label + Input (password) + icons/eye-open
│   ├── 新密碼確認 label + Input (password) + icons/eye-open
└── Frame 63 — 原密碼區 (padding 12px, border #d1d1d1)
    ├── 原密碼 label + 說明 "作用於修改密碼與暱稱" (sm)
    └── Input "92!xD2aB" + icons/eye-open
└── Footer
```

### Tab 列規格

**確認日期**：2026-04-16

3 個 Input instance 橫排，`gap: 12px`，**全部無外框（無 strokes）**：

| Tab | Figma 寬度 | HTML class | 選中狀態 | 未選中狀態 |
|---|---|---|---|---|
| 密碼 | 44px | `w-11` | `bg-[#e1e1e0]` | `bg-white`（無底色差異） |
| 暱稱 | 44px | `w-11` | `bg-[#e1e1e0]` | `bg-white` |
| IP 紀錄 | 63px | `w-[63px]` | `bg-[#e1e1e0]` | `bg-white` |

- Padding：`py-1.5 px-3`（6px/12px）
- 字型：`text-base`（16px）`text-[#454545]`
- **不加 border**：選中只有 `bg-[#e1e1e0]`，未選中看起來無框無底色

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
| 近期（4 天前） | `#2178cf` | `Color/MenuItem/Default` |
| 中期（10 天前） | `#ef6f25` | `Color/Surface/Brand-500-Default` |
| 過久（90 天前） | `#e12129` | `Color/Surface/Negative` |

> 密碼 "90天" 未更換的警示也使用 `#e12129`（紅色）。

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| Modal 邊框 | `#b0b0b0` | `Color/Neutral/300` |
| Header 下邊框 | `#b0b0b0` | `Color/Neutral/300` |
| 標題文字 | `#454545` | `Color/Neutral/800` |
| Content 區邊框 | `#d1d1d1` | `Color/Neutral/200` |
| 選中 Tab 背景 | `#e1e1e0` | `Color/Neutral/100` |
| 確定按鈕 bg | `#454545` | `Color/Neutral/800` |
| 取消按鈕 bg | `#d1d1d1` | `Color/Neutral/200` |

---

## 實作注意事項

1. **Overlay**：全站統一使用 `rgba(0, 0, 0, 0.4)` 半透明黑色遮罩（見「全站 Backdrop 規格」）
2. **置中**：`position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`
3. **關閉**：點 icons/close 或遮罩關閉 Modal
4. **Tab 切換**：password / nick name / IP 共用同一 Modal，tab 控制顯示內容
5. **密碼 toggle**：`icons/eye-open` 點擊後切換顯示/隱藏（Figma 未定義 eye-closed icon）

---

*Generated from Figma component set · Updated 2026-04-13 · Backdrop 規格補充 2026-04-15*
