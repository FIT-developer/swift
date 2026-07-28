# Component: 帳號 Accordion (account-accordion)

**Figma 來源 (current version, read date 2026-07-16)**:
- Desktop (1100 寬, 於頁面 frame `2087:94594` 內):
  - 關閉態: `2087:95021` Accordion 9 (1100x88)
  - 展開 1 修改: `2087:95137` Accordion 3 (1100x745)
  - 展開 2 紀錄: `2087:95298` Accordion 4 (1100x951)
  - 展開 3 刪除: `2087:95391` Accordion 5 (1100x717)
- Tablet 767 寬: `2087:96149` / `2087:96510` / `2087:96603` (展開 1/2/3)
- Mobile 340 寬: `2078:91740` Accordion 8 (展開 1, 單欄堆疊參考;
  2026-07-16 稿更新, 現位於 SECTION `2087:97114`, 修改面板表單列
  改為直向 label 上 / input 下, 已重讀比對)

**使用頁面**: specs/pages/account-permission.md (帳號及權限)
**狀態**: 2026-07-16 初版

> Figma 稿把 1 個關閉態 + 3 個展開態並列展示; 實際頁面只 render
> **一個** accordion, 開/關 + 三模式切換皆為前端互動。

## 使用者確認事項 (2026-07-16 拍板)

1. chevron 方向: 關閉 = up.svg(朝上), 展開 = down.svg(朝下), 全站慣例
   (room-booking-behaviors.js 同款), 照做
2. 高權限 badge / 總部 / 分館 pill: **全部 render**, 上線後由後端依帳號
   狀態控制顯示; demo 不做隱藏邏輯 (展開 3 稿少了高權限與總部 = 組合
   展示, 不是模式連動)
3. 紀錄 table 超出欄寬 = **橫向 scroll** (全站 table 慣例)
4. 清除(灰) / 修改(深色) footer 按鈕組 = 全站既有樣式
   (同 room-booking-modals 清除/修改)
5. 刪除確定鈕紅底 `#E12129` = 正常樣式 (Status-Negative)
6. 分館清單展開 bar: 分館 >= 3 間才顯示; 預設收合只示前 2 間 +
   「另外 n 間 +」(n = 總數 - 2); 點擊展開全部並變「收起 -」,
   再點收摺。1-2 間時無 bar
7. 模式按鈕列窄版超寬 = `flex-nowrap overflow-x-auto` 原生橫向 scroll
   (Figma 340 稿渲染圖即為裁切狀)
8. 密碼欄 eye: 照 html-conventions「密碼欄 eye toggle」慣例做完整互動,
   預設遮罩 + eye-close (Figma 畫 eye-open 屬單態示意)

## 容器與 Header (開/關共用)

- 容器: bg `Color/Neutral/75` (bg-surface-hover), border `Color/Neutral/200`
  (border-border-disabled), radius 12, padding 20
- Header 高 48, 整條可點擊 toggle 開關:
  - avatar: 48x48 圓形 (radius-full), bg `Color/Surface/Action-Default`
    (#005fcc), 內為帳號名首字白色 20px, 置中
  - 帳號名稱: 20px semibold `Color/Text/800`, 與 avatar gap 12
  - chevron: 24x24 靠右; 關閉 = `icons/up.svg`, 展開 = `icons/down.svg`
- 關閉態總高 88 (padding 20x2 + header 48), 無內容區
- 展開時內容區與 header gap 16

## 內容區 (展開時)

- 白底卡: bg white, radius 12, padding 10
- 內部左右兩欄: 各 50%, gap 10
- RWD (2026-07-16 拍板, 欄數以「內容可用寬度」為準, 因 Figma 只有
  767 無-aside 稿與 1440 稿, 768-1023 有 aside 時 content 僅
  ~430-685px 會擠爆兩欄):
  - `<640` 單欄直疊, 順序 = 資訊區在上, 模式區在下 (Figma 340 稿)
  - `640-767 (sm)` 兩欄 (mobile shell 滿版)
  - `768-1023 (md)` 回單欄 (desktop shell aside 佔 240px)
  - `>=1024 (lg)` 兩欄 (content ~700px = Figma 767 稿欄寬)
  - 實作: `flex-col sm:flex-row md:flex-col lg:flex-row` +
    欄 `sm:w-1/2 md:w-full lg:w-1/2`

### 左欄: 帳號資訊區 (padding 12)

由上而下, 區塊間 gap 16:

1. 名稱列: 帳號名稱 20px regular `Color/Text/800` + 高權限 badge
   - badge: bg `Color/Brand/Brand-100` (#fdebd7), radius-full (pill),
     padding 2px 10px, 文字 16px `Color/Brand/Brand-500` (#ef6f25)
   - 下行帳號 ID (Lin 001): 16px `Color/Text/800`, 與名稱列 gap 4
2. 身分 pill 列: 總部 / 分館, gap 12
   - pill: bg `Color/Bootstrap/components/focus` (#86b7fe,
     `--color-bootstrap-components-focus`; 注意不是 focus-background
     #d3ebfd), radius 8, padding 4px 6px, 文字 16px 白色
   - 高權限 badge 與總部/分館 pill 皆可能單獨或組合出現 (後端控制),
     demo 全上
3. 分館清單卡: border `Color/Neutral/300` (#b0b0b0, border-border-focus),
   radius 12, padding 12
   - 分館列: 編號 + 名稱 16px `Color/Text/800`, 列間 gap 12,
     每列 border-bottom `Color/Neutral/300` + padding-bottom 8
     (最後一列如後面接展開 bar 也保留底線, 照 Figma)
   - 分館列下方**沒有子列內容**(2026-07-28 拍板全數移除, 不分斷點):
     舊版曾有「資料」「介紹」label + 語系 chip(EN/EU/简)、以及
     「未設定多語系」特例文案, 現已整段移除, 分館列只顯示
     「編號 名稱」一行, desktop / mobile~tablet 兩者皆同; 舊內容見
     git history(account-accordion.md 本段落 2026-07-28 前版本)
   - 展開 bar (>= 3 間才有, 規則見確認事項 6, 不受本次調整影響): 整寬,
     bg `Color/Neutral/500` (#6d6d6d), radius 16, padding 6px 8px;
     文字 12px `Color/Text/100` (#e1e1e0); 右側 icon 20x20 白色圓形
     (radius-full) 內 plus/minus 線條 `Color/Text/100`
     - 收合態: 「另外 n 間」 + `icons/outline-plus.svg`
     - 展開態: 「收起」 + `icons/outline-minus.svg`
4. 基本資料表單 (padding 12, 唯讀展示):
   - 列: label 16px `Color/Text/800` (寬 4em, top 對齊) + 值 16px,
     值欄僅 border-bottom `Color/Neutral/200` (#d1d1d1)
     (Figma JSON strokes 為單邊線, 已用渲染圖驗證只有底線)
   - 欄位順序: 顯示名稱 / Email / 行動電話 / 帳號說明 (多行)
   - 列間 gap 20

### 右欄: 模式區

1. 模式按鈕列 (高 42, gap 20): 修改 / 紀錄 / 刪除
   - 按鈕: 96x42, radius 28 (pill), padding 10px 16px,
     icon 24x24 + 文字 16px `Color/Text/800`, gap 8
   - icon: 修改 = `edit.svg`, 紀錄 = `document.svg`,
     刪除 = `trash-can.svg`
   - active: bg + border `Color/SubItem/Selected` (#f7d275)
   - inactive: bg white, border `Color/Neutral/200` (#d1d1d1)
   - 一次僅一顆 active; 點擊切換下方面板
   - 容器 `flex-nowrap overflow-x-auto`, 按鈕 `flex-shrink-0`
     (窄版原生橫向 scroll, 確認事項 7)
2. 模式面板: bg `Color/Brand/Brand-50` (#fef6ee), padding 12,
   與按鈕列 gap 10; 內容依 active 模式三選一:

#### 面板 A: 修改 (預設 active)

- 表單列: label 16px (寬 6.25em, top 對齊) + 方框 input
  (bg white, border `Color/Neutral/200`, radius 6, padding 6px 12px,
  文字 16px), 列間 gap 20
- 表單列 RWD (2026-07-16 使用者拍板, 同日 Figma mobile 稿 2078:91740
  已更新為此佈局): `<640` 改直向 (label 在上, input 滿寬在下,
  label-input 直向 gap 12, 原始密碼列含「確認身份」副標同樣處理),
  因外層多層卡框讓 input 可用寬不足; `>=640` 維持橫向。列間 gap 20
  兩種佈局相同。左欄基本資料唯讀區**不**跟進, 維持橫向自然流動
  (不需編輯, 窄了可接受; 更新後 mobile 稿亦維持橫向)
- 欄位: 顯示名稱 / Email / 行動電話 / 帳號說明 (textarea 多行) /
  原始密碼
- 原始密碼列: label 主文字 16px + 副標「確認身份」12px
  `Color/Text/800` 直疊; 值 = 密碼 input + eye toggle
  - wrapper: border `Color/Neutral/200` radius 6, 內含無框 input +
    eye icon 24x24 靠右 (padding-right 8)
  - 互動照 html-conventions 密碼欄 eye toggle 慣例 (確認事項 8)
- footer (右對齊, gap 8): 清除 + 修改
  - 清除: bg `Color/Neutral/200` (#d1d1d1), 文字 16px
    `Color/Text/800`, radius 6, padding 6px 12px
  - 修改: bg `Color/Text/800` (#454545), 文字 16px
    `Color/Text/100` (text-text-inverse), radius 6, padding 6px 12px
  - demo 行為: 清除 = 清空面板 inputs; 修改 = 無後端, 不動作

#### 面板 B: 紀錄

- 白卡: bg white, border `Color/Neutral/200`, radius 12,
  padding 12px 16px
- 卡內 table (Figma 原寬 611 > 欄寬): 外層 `overflow-x-auto`,
  table 本體維持自然寬 (確認事項 3)
- 欄: 編號 / 日期 / IP / 期間 / 裝置, header 16px `Color/Text/800`,
  header 下緣分隔線
- 示意資料 (照 Figma):
  - 1 | 2026-07-01 15:33:41 (換行) 2026-07-01 16:33:41 |
    199.100.99.01 [TW] | 15 分 21 秒 | Web
  - 2 | 2026-07-01 15:33:41 (換行) 操作逾時, 系統登出 |
    200.100.99.01 [JP] | 22 時 3 分 0 秒 | iOS
- 列間分隔線, 文字 16px `Color/Text/800`

#### 面板 C: 刪除

- 面板內容垂直水平置中: 「確定刪除以下帳號？」20px
  `Color/Text/800`; 下方帳號名稱 20px + 帳號 ID 16px, 皆
  `Color/MenuItem/Default` (#2178cf), 置中直疊
- 面板右下角: 確定鈕, bg `Color/Surface/Status-Negative` (#e12129),
  文字 16px `Color/Text/100`, radius 6, padding 6px 12px
- demo 行為: 確定 = 無後端, 不動作

## 互動總表

| 觸發 | 行為 |
|---|---|
| 點 header | 切換 accordion 開/關, chevron up/down 互換 |
| 點 修改/紀錄/刪除 | 切換 active 樣式 + 面板 A/B/C |
| 點 另外 n 間 + | 展開全部分館列, bar 變「收起 -」 |
| 點 收起 - | 收摺回前 2 間, bar 變「另外 n 間 +」 |
| 點 eye icon | 密碼明碼/遮罩切換, icon 反映當前狀態 |
| 點 清除 | 清空修改面板 inputs |
| 修改(深)/刪除確定(紅) | 後端範疇, demo 不動作 |

## Figma 未定義 / 決策記錄

- 展開後預設 active 模式 = 修改 (2026-07-16 使用者確認)
- 頁面初始 = 關閉態 (2026-07-16 使用者確認)
- hover / focus 樣式 Figma 未定義, 僅按鈕 `hover:opacity-80`
  (沿用全站深色鈕慣例), 不另畫
- 紀錄 table 分頁 / 更多筆數行為未定義, demo 只放兩筆示意
