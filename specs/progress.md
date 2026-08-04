# Progress - 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。
> 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
> （歷史決策可能已被推翻，一律以本檔最新 session 為準）。
> 本檔超過 ~25 個 session 時，將最舊的 10 個搬進 archive。

---

## Session 129：room-type 資料 modal 0804 房間數互動與欄位收斂 (2026-08-04)

使用者以 figma-go 分批讀取房型頁「新增 / 修改 / 查看」modal 0804 版本，
確認後要求先寫入 spec 再開始 coding。

### Figma 讀取

- 新增：`2147:109387` / `2147:109674` / `2147:110051`
  「Modal（新增）0804-1/2/3」
- 修改：`2147:110305` / `2147:110306` / `2147:110307`
  「Modal（資料修改）0804-1/2/3」
- 查看：`2147:110598` / `2147:110904` / `2147:111139`
  「Modal（僅查看）0804-1/2/3」
- 截圖：`specs/qa-screenshots/session-129/room-type-{new,edit,view}-modal-0804-*.png`

### 本輪改動

1. **spec 同步**：`components/modal.md` 的 `state=room-type` 改為 0804 confirmed
   source，記錄三個房間數狀態、差異文案、房數修改 toggle 與查看 disabled
   active 規則；`specs/pages/room-type.md` 更新 modal source pointer
2. **HTML 欄位收斂**：`preview/partials/room-type-modals.html` 移除舊版欄位：
   顯示分類、房價跟隨、銷售單位、參考價格、加人、加床；新增 / 修改改為
   房間數 number input + 條件式房數修改區塊
3. **互動行為**：`preview/js/room-type-modals.js` 新增房間數 baseline 14 邏輯；
   改成非 14 時顯示 `增加 n 間` / `減少 n 間`，展開房數修改，active 時提示
   改為 `同步更新房型庫存，至 2027-09-11`
4. **查看狀態**：查看 modal 使用 disabled number input、disabled active toggle，
   提示文字維持一般深色，不套新增 / 修改的橘色 active hint
5. **回歸測試**：`scripts/smoke-test.mjs` 新增 room count 互動與查看 disabled
   active toggle 檢查

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`room-type.html` 15 checks 通過

### 未解問題

（無）

---

## Session 128：toggle switch 新增 disabled 狀態 (2026-08-04)

使用者以 figma-go 指示讀取 toggle button，確認後新增 disabled 狀態按鈕。

### Figma 讀取

- Selection：`991:12452`「Toggle - Switch」component set
- Page：`components`
- Size：104 x 164
- Variants：`type=closure`、`type=open`、`type=disabled`
- 截圖：`specs/qa-screenshots/session-128/toggle-switch-component-set.png`

### 本輪改動

1. **spec 同步**：`specs/html-conventions.md` 的 iOS-style toggle switch
   pattern 補上 disabled variant 規則
2. **共用 CSS**：`preview/assets/css/modals.css` 補上
   `.member-data-switch` disabled 視覺，track 維持灰色，checked disabled 的
   knob 維持右側，不整顆降低 opacity
3. **preview**：`preview/toggle.html` 新增 Disabled 範例按鈕，並避免 disabled
   按鈕被 click handler 切換

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過
- `curl -I http://127.0.0.1:8000/toggle.html`：HTTP 200

### 未解問題

（無）

---

## Session 127：lodging-info 分館資料 modal 傳真文字調整 (2026-08-04)

使用者要求將分館資料 modal 的傳真欄位改為較短名稱，純文字異動後直接
commit & push。

### 本輪改動

1. **HTML 文案**：`preview/partials/lodging-info-modals.html` 的分館資料 modal
   傳真欄位 label 改為「傳真」
2. **spec 同步**：`components/lodging-branch-info-modal.md` 對應欄位表與文案
   card 清單同步改名
3. **歷史進度一致性**：本檔 Session 126 的新增欄位描述同步改為「傳真」，
   避免後續交接沿用舊文字

### 驗證

- 舊傳真欄位名全 repo 搜尋：無結果
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`lodging-info.html` 15 checks 通過

### 未解問題

（無）

---

## Session 126 補充：postoffice icon 改用正式 component 匯出 (2026-08-04)

使用者補充開啟 Figma selection 給正式 icon。

### 本輪改動

1. **Figma 讀取**：selection 為 `2146:107308`「icons/postoffice」component，
   24x24，子節點 `2146:107306`「postoffice」
2. **icon 替換**：`preview/assets/icons/postoffice.svg` 由先前 modal instance
   內匯出的暫用版本，改為正式 `icons/postoffice` component 匯出版本
3. **既有引用不變**：`specs/icons.md` 的 `postoffice` 登記與
   `preview/partials/lodging-info-modals.html` 地址標題旁引用維持同一路徑

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`lodging-info.html` 15 checks 通過

### 未解問題

（無）

---

## Session 126：lodging-info 分館資料 modal 0804 新欄位讀取與新增 (2026-08-04)

使用者要求 figma-go 讀取新版民宿資料「修改 / 設定」modal，列出差異後確認：
已完成功能不要動，只新增新版多出的區塊；飯店設施項目改右欄 card，但內容
與原本 selected 狀態維持不變。

### Figma 讀取

- Selection：`2146:107443`「Modal（有分資料設定與資料修改）0804」
- 內層 modal instance：`2146:107515`，modal 寬 800，內容高 2218
- 截圖：`specs/qa-screenshots/session-126/figma-branch-info-modal-0804.png`
- 標題規則沿用使用者確認：實作只顯示「資料修改」或「資料設定」其中一個，
  不顯示 Figma 示意文字「資料設定/資料修改」

### 本輪改動

1. **spec 同步**：`components/lodging-branch-info-modal.md` 新增 current Figma
   source `2146:107443`，欄位表新增第 7-9 列：
   飯店名稱 / 聯絡電話、傳真 / 地址、入住時間 / 飯店設施項目
2. **HTML 實作**：`preview/partials/lodging-info-modals.html` 新增 5 張靜態
   空狀態文案 card（飯店名稱、聯絡電話、傳真、地址、入住時間）；
   「飯店介紹文案」既有多語系 JS card 未回退
3. **設施項目位置**：飯店設施項目由原本滿版列改為第 9 列右欄 card；
   chip 文字與 selected 狀態維持原本內容：
   `設施一|設施二|設施三|設施五六七八九`，
   `true|true|true|false`
4. **icon 資產**：從 Figma `icons/postoffice` 匯出
   `preview/assets/icons/postoffice.svg`，並登記 `specs/icons.md`
5. **回歸測試**：`scripts/smoke-test.mjs` 新增檢查，驗證新增 card 存在、
   飯店設施項目位於入住時間右欄、chip 內容與 selected 狀態未變

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`lodging-info.html` 15 checks 通過
- Desktop 1440 截圖與 rect probe：
  - 飯店設施項目與入住時間 same row，left 729 > 341，兩者高度 150 / 150
  - 截圖：`specs/qa-screenshots/session-126/lodging-branch-info-new-fields-1440.png`

### 未解問題

（無）

---

## Session 125：lodging-info 分館資料 modal 文案卡同列高度拉齊 (2026-08-04)

使用者截圖覆核指出：系統設定 -> 民宿資料頁，分館/企業卡片下方「修改」
與「設定」按鈕開啟的分館資料 modal 中，「飯店設施文案」card 沒有垂直
填滿，與左欄「飯店介紹文案」高度不一致。

### 本輪改動

1. **規格補強**：`components/lodging-branch-info-modal.md`「文案卡片」段新增
   同列高度行為：同一列左右兩張文案卡需填滿 grid row；靜態空狀態內容
   在拉伸後的 card 內垂直置中
2. **HTML/CSS 修正**：`preview/partials/lodging-info-modals.html` 四個文案
   欄位加上共同 class / 測試錨點；`preview/assets/css/lodging-info.css`
   新增 `.lodging-branch-caption-*` 規則，讓同列 card 可被 grid row 拉齊，
   靜態空狀態卡 `justify-content: center`
3. **JS 同步**：`preview/js/lodging-branch-content-card.js` 產生的飯店介紹
   文案 card 改用同一個 `.lodging-branch-caption-card` class，避免 JS card
   和靜態 HTML card 分叉
4. **回歸測試**：`scripts/smoke-test.mjs` 新增 branch-info modal caption
   cards stretch 檢查，量測同列「飯店介紹文案」與「飯店設施文案」card
   rect 高度

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`lodging-info.html` 14 checks 通過
- 臨時 CDP viewport probe + 截圖：
  - 1440x1000：飯店介紹文案 / 飯店設施文案 same row，高度 178 / 178，diff 0
  - 768x1000：飯店介紹文案 / 飯店設施文案 same row，高度 178 / 178，diff 0
  - 375x900：單欄堆疊，不強制等高；截圖確認 card 不重疊
  - 截圖位置：`specs/qa-screenshots/session-125/lodging-caption-{desktop-1440,tablet-768,mobile-375}.png`

### 未解問題

（無）

---

## Session 124：lodging-info 分館資料 modal 電話欄位改名 (2026-08-04)

使用者要求：系統設定 -> 民宿資料頁，兩個企業卡片中的「修改」與「設定」
按鈕展開的 modal，原本欄位文字「市話」改為「聯絡電話」。

### 本輪改動

1. **component spec 同步**：`components/lodging-branch-info-modal.md` 內
   `state=branch-basic-info` 欄位清單、RWD 單欄欄位順序、placeholder
   欄位說明，全數由「市話」改為「聯絡電話」
2. **HTML 實作**：`preview/partials/lodging-info-modals.html` 分館資料
   modal 第 3 列左欄 label 改為「聯絡電話」；修改/設定兩個入口共用此
   modal body，所以兩者同步生效
3. **回歸測試**：`scripts/smoke-test.mjs` 的 branch-info modal 檢查新增
   「聯絡電話」存在且舊文字「市話」不出現在 modal textContent 的斷言

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`lodging-info.html` 13 checks 通過

### 未解問題

（無）

---

## Session 123：system-basic 預設加購訂金規則選項新增 (2026-08-04)

使用者要求：系統基本 -> 預設加購訂金規則 select 目前有「含加購」與
「不含加購」，需再新增「含加購依%數」項目。

### 本輪改動

1. **spec 同步**：`specs/pages/system-basic.md`「預設加購訂金規則」段落改為
   明確列出 select 選項，保留預設值「不含加購」
2. **HTML 實作**：`preview/system-basic.html` 對應 select 新增第三個
   `<option>含加購依%數</option>`

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`system-basic.html` 8 checks 通過

### 未解問題

（無）

---

## Session 122 二度補充：order status pill mobile/tablet triangle 間距加硬 (2026-08-03)

使用者截圖覆核指出：上一輪修正後，mobile ~ tablet 尺寸的訂單處理 table 內
訂單編號 dropdown pill 仍看起來像文字和倒三角擠在一起。

### 本輪處理

1. **遠端確認**：GitHub Pages 實際路徑
   `https://3qberlin.github.io/swift/preview/assets/css/order-processing.css`
   已含上一輪 `gap: 0` / triangle `margin-left: var(--spacing-6)` 等 CSS，
   所以問題不是單純沒有推上去；`/swift/assets/...` 和 root
   `/order-processing.html` 回 404，使用者畫面應是 `/swift/preview/...`
2. **根因修正**：上一輪文字到 triangle 仍是 `Spacing/6`，視覺上接近舊版
   flex `gap: 6px`，不足以解決使用者截圖中的「擠」；本輪把文字到 triangle
   固定間距加大到 `Spacing/12`
3. **抗壓縮處理**：`.op-status-pill` 增加 `flex: 0 0 auto` 與
   `min-width: max-content`；`.op-status-pill-triangle` 改成
   `flex: 0 0 16px`、`inline-size/block-size: 16px`、`max-width: 16px`、
   `object-fit: contain`，避免 mobile/tablet table 欄寬壓縮時把 icon 壓成窄片
4. **spec/test 同步**：`components/order-status-pill.md` 內部固定間距更新為
   dot -> text `Spacing/6`、text -> triangle `Spacing/12`；
   `scripts/smoke-test.mjs` 的回歸檢查同步改驗證 12px margin、triangle 16px
   寬度與不可 shrink

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`order-processing.html` 9 checks 通過

### 未解問題

（無）

---

## Session 122 補充：order status pill 文字與 triangle 固定間距 (2026-08-03)

使用者補充說明：最後一個改動的目標是訂單管理 > 訂單處理頁最下方
table 內的訂單編號 dropdown button；mobile ~ tablet 尺寸時，訂單編號文字
和倒三角 icon 會擠在一起，需要固定間距，讓所有尺寸一致。

### 本輪處理

1. **spec 補強**：`components/order-status-pill.md` Pill 視覺規格新增
   「內部固定間距」：狀態 dot 和文字之間、文字和 triangle 之間都固定
   `Spacing/6`
2. **CSS 修正**：`preview/assets/css/order-processing.css` 不再依賴整顆 pill 的
   flex `gap`；改成 dot `margin-right: var(--spacing-6)`、triangle
   `margin-left: var(--spacing-6)`，並讓文字 `flex: 0 0 auto`，避免表格在
   mobile/tablet 橫向捲動或欄寬壓縮時咬到 triangle
3. **回歸測試**：`scripts/smoke-test.mjs` 新增檢查，量測所有
   `.op-status-pill` 的文字右緣到 triangle 左緣距離，並驗證 triangle margin
   與文字 flex-shrink

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`order-processing.html` 9 checks 通過
- 曾嘗試用臨時 headless Chrome 腳本做 375/768 viewport 專項量測，但該臨時
  probe 在啟動 DevTools endpoint 前退出；正式 smoke runner 可正常啟動 Chrome
  並通過新增的 DOM rect spacing 檢查

### 未解問題

（無）

---

## Session 122：覆核最後 commit 並收斂 order pill dropdown spacing diff (2026-08-03)

使用者要求檢查最後一個 git commit `0a82608 Fix order pill dropdown spacing`，
並依 progress/spec 重新處理，必要時捨棄 commit 重新來過。

### 本輪處理

1. **commit 覆核**：最後 commit 只改 `preview/assets/css/order-processing.css`，
   意圖是修正訂單處理頁「訂單編號」pill 與下拉選單 spacing；但原 diff 同時
   混入多處無關空行與 gradient 排版重排
2. **重新對照 spec**：`components/order-status-pill.md` 定義 pill 內部順序、
   padding、desktop dropdown 136x44 / mobile offcanvas x44；現有選單項目 padding
   已符合規格，不需再改下拉選單本身
3. **CSS 收斂**：保留真正相關的 pill 修正：
   `.op-status-pill { white-space: nowrap; }`、
   `.op-status-pill-text { line-height: 1; }`、
   `.op-status-pill-triangle { flex-shrink: 0; display: block; }`；
   其餘格式 churn 還原
4. **commit 處理**：不需要 `git reset --hard` 或捨棄整個 commit；採用 amend 方式
   讓最後 commit 內容收斂成最小有效 diff

### 驗證

- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- `node scripts/smoke-test.mjs`：7 頁通過，`order-processing.html` 8 checks 通過
- `git diff HEAD~1 -- preview/assets/css/order-processing.css` 只剩 pill nowrap /
  line-height / triangle shrink 修正

### 未解問題

（無）

---

## Session 121 九度補充：mobile 外層 shell padding 修正 (2026-07-31)

使用者截圖覆核指出上一輪的「content 單層」訂正還不夠：`preview/
room-type.html` 的 `#rootWrap` 用了無條件 `p-3`，導致 mobile 版 content
外面多包一層 12px padding（content 應該滿版貼齊左右），mobile top bar
（logo/選單 icon）應該是自帶 `px-3 pt-3` 內距，不是靠外層 wrapper 給。

### 本輪改動

1. **根因**：房型頁屬於 `specs/page-architecture.md`「多 card 彼此整襯型」
   （跟 `lodging-info.html`/`account-permission.html` 同一類），應該用
   `rootWrap md:p-3` + mobile top bar 自帶 `px-3 pt-3`，先前落地時漏看
   這條既有規則，誤用了無條件 `p-3`
2. **修正**：`preview/room-type.html` `#rootWrap` 改 `md:p-3`；mobile top
   bar 那個 div 加 `px-3 pt-3`
3. **spec 更新**：`specs/page-architecture.md`「已判定案例」補上
   `room-type.html`；`specs/pages/room-type.md`「Shell」段新增這條 mobile
   padding 規則說明

### 驗證

- 375px 截圖確認 content 滿版貼齊左右、top bar 自帶內距；1440px 截圖確認
  desktop 版沒有受影響；`node scripts/smoke-test.mjs`（7 頁，room-type.html
  13 checks）+ conventions lint 都過

### 未解問題

（無）

---

## Session 121 八度補充：mobile~tablet/mobile frame content 單層訂正 (2026-07-31)

### 任務：figma-go 讀使用者修正過的 mobile~tablet/mobile frame

使用者發現自己原本的 Figma frame `content` 誤包兩層，導致畫面多一塊底色，
已在 Figma 端修正成單層 `content`，並要我重讀 + 補 spec + 視需要實作。

### 本輪改動

1. **figma-go 讀取**：新 frame `2140:106747`「房型資料 mobile ~ tablet
   0731」767x2974（取代舊 `2137:103071` 767x2956）、`2140:106898`「房型
   資料 mobile 0731」375x3182（取代舊 `2137:103890` 375x3164）。兩個都
   確認只有一層 `content`（直接子節點 = 頂部 logo/選單列 + 一個
   `content`），文字內容（啟用/停用 tab、數量後綴、6 卡片、按鈕列）都
   跟目前 desktop 版一致，沒有額外差異
2. **實作面確認（無需改動程式碼）**：`preview/room-type.html` 本來就只有
   一層內容容器（`<main>` 內單一個 `bg-surface-hover` div），沒有巢狀
   兩層的問題；767px 截圖覆核畫面正常，沒有多餘底色區塊
3. **spec 更新**：`specs/pages/room-type.md` 檔頭 Figma 來源改成新 node
   ID/尺寸 + 新增「content 單層結構訂正」說明段；
   `components/room-type-card.md` RWD 表同步更新 node ID/尺寸（卡片寬度
   數值也順便訂正：mobile~tablet 687px->727px、mobile 295px->335px，
   舊數字來自更早期的 frame 版本，跟目前 frame 實測值不符）

### 驗證

- 767px 截圖確認單層 content、無多餘底色；`./scripts/lint-conventions.sh`
  通過。未動到程式碼，未重跑 smoke test（純文件變更）

### 未解問題

（無）

---

## Session 121 七度補充：啟用/停用 tab 加動態數量後綴 (2026-07-31)

### 任務：figma-go 讀 tab button 數量後綴設計 + 實作動態統計

### 本輪改動

1. **figma-go 讀取**：node `2140:106117`（Frame 653 更新版），兩個 tab
   文案變成「啟用（2）」「停用（8）」，全形括號。screenshot 覆核（不只信
   JSON）確認：只有「啟用」label 本身 weight 600 + 底線，數量後綴
   「（2）」「（8）」兩個都是 weight 400，即使在 active 的「啟用」tab 上
   也不跟著粗體
2. **實作**：`preview/room-type.html` 兩個 tab 各自加一個 `<span
   class="font-normal">` 承載數量（`#roomTypeActiveCount` /
   `#roomTypeDeletedCount`），`font-normal` 蓋掉 active tab 從
   `.is-active` 繼承來的粗體。`preview/js/room-type.js` 新增
   `updateStatusFilterCounts()`，在 `renderCardList()` 每次呼叫時重新
   統計 `ROOM_TYPE_CARDS` 當下 active/deleted 數量並寫入這兩個 span -
   數字動態反映真實資料，不是照抄 Figma demo 的「2」「8」
3. **smoke test**：新增「tab count suffix reflects live data」check，
   驗證初始值（2）（4）、停用一張卡後變（1）（5）、還原後變回
   （2）（4）；13 checks 全過
4. **spec**：`specs/pages/room-type.md`「啟用/停用狀態篩選」段落下新增
   「數量後綴」子段

### 驗證

- console 手動觸發 disable/enable 驗證數字即時更新；`node scripts/
  smoke-test.mjs`（room-type.html 13 checks）+ 兩項 lint 過

### 未解問題

（無）

---

## Session 121 六度補充：文件澄清（「複製」按鈕無行為是刻意設計） (2026-07-31)

使用者針對 UI/UX review 澄清：「複製」按鈕沒有點擊行為不是漏做，是要交給
後端處理的邏輯（複製房型資料、產生新編號等），前端 prototype 階段不應該
自己模擬。已在 `components/room-type-card.md`「功能按鈕 disabled 判斷規則」
段落下補一小節記錄這個決定，避免之後被誤判成待修 bug。無程式碼變更。

同時使用者重申一個既有共識（已內化在 start.md 決策原則，這裡僅記錄對話
脈絡）：不會要求在 Figma 沒給的地方自行加東西 - 前一輪討論的「tab 旁加
卡片數量」因此先擱置（見上一則交接），等使用者想清楚呈現方式或補了
Figma 稿再繼續。

---

## Session 121 五度補充：篩選結果為空狀態文案 (2026-07-31)

### 任務：figma-go 讀「啟用/停用篩選無資料」的空狀態

### 本輪改動

1. **figma-go 讀取**：node `2139:105859`（Frame 427319059），卡片列表位置
   在篩選無資料時改顯示一行文字，20px、`Color/Neutral/800`、靠左，上下
   各 24px padding。文案「沒有任何啟用中的卡片」（啟用 tab 空）；使用者
   訊息直接給了「停用」版本文案「沒有任何停用中的卡片」，Figma 節點本身
   只示範了啟用版（同一元件替換文字，未另外進 Figma 核對停用版，文案
   直接採用使用者訊息原文）
2. **實作**：`preview/js/room-type.js` `renderCardList()` 篩選後陣列為空
   時提早 return，插入 `EMPTY_FILTER_MESSAGE[currentStatusFilter]` 文字
   （`col-span-full` 撐滿 grid 寬度，避免被擠在第一欄）
3. **smoke test**：新增「empty filter shows correct placeholder message」
   check，手動把兩個 tab 都清空驗證文案，再手動把 6 張卡復原成初始狀態
   （不用 `location.reload()`，會打斷同一個 page session 後續 check）；
   12 checks 全過
4. **spec**：`specs/pages/room-type.md`「啟用/停用狀態篩選」段落下新增
   「篩選結果為空狀態」子段

### 驗證

- 手動在 console 把兩個 tab 都清空過，1440px 截圖跟 Figma 節點視覺一致；
  `node scripts/smoke-test.mjs`（room-type.html 12 checks）+ 四項 lint 全過

### 未解問題

（無）

---

## Session 121 四度補充：房型頁新增「啟用/停用」狀態篩選 tab (2026-07-31)

### 任務：figma-go 讀新 UI 元件（狀態篩選 tab）+ 實作

### 本輪改動

1. **figma-go 讀取**：node `2139:105271`（Frame 653，120x38，位於操作列跟
   卡片列表之間，x:0 靠左），2 個文字 tab：「啟用」（weight 600 + 底線
   `stroke #f28b45`）/「停用」（weight 400 無底線）。比對後確認完全等同
   既有 `.member-data-filter-tab` / `.is-active` pattern（底線 active，
   `border-bottom-color: Brand-400`），不需要新 CSS
2. **實作**：`preview/room-type.html` 新增 `#roomTypeStatusFilter`（2 顆
   `.member-data-filter-tab` 按鈕，靠左，預設「啟用」選中）；
   `preview/js/room-type.js` 新增 `currentStatusFilter` + `initStatusFilterTabs()`，
   `renderCardList()` 改成先 filter `ROOM_TYPE_CARDS`（依 `card.state` 當下值）
   再渲染，不是渲染全部 6 張再用 CSS 隱藏
3. **跟既有停用/啟用互動串接**：篩選依據卡片「當下」狀態，卡片本身的
   停用/啟用按鈕改變 state 後，若不再符合目前 tab 會立刻從列表消失
   （例如在「啟用」tab 把某卡停用，該卡立刻不見；切到「停用」tab 才看得到）
4. **smoke test 更新**：`scripts/smoke-test.mjs` room-type.html 的
   `readyExpr` 改成預設只有 2 張卡（啟用 tab 預設值，不是 6 張）；新增
   「啟用/停用 filter tab 顯示正確子集」check；「disable/enable toggle」
   check 改寫成驗證卡片會在兩個 tab 之間移動（先前假設 toggle 只換按鈕組，
   沒考慮到現在會連動篩選把卡片整個移出列表）；「new/edit/view modal」
   check 補上切到「停用」tab 才能找到查看 modal 觸發器（查看按鈕只在
   停用態卡片上）。11 checks 全過
5. **spec 更新**：`specs/pages/room-type.md` 新增「啟用/停用狀態篩選」段，
   同時訂正檔頭已過期的「尚未開始/待實作」狀態說明（其實已完成好幾輪
   實作+迭代）

### 驗證

- `node scripts/smoke-test.mjs`（7 頁，room-type.html 11 checks）+ 四項
  lint 全過；1440px 截圖驗證兩個 tab 切換都渲染正確子集且按鈕組正確

### 未解問題

（無）

---

## Session 121 三度補充：房型卡片「刪除/還原」改「停用/啟用」+ 新增互動 (2026-07-31)

### 任務：figma-go 讀 2 個新 icon + 房型卡片術語變更

### 本輪改動

1. **新增 2 個 icon**（figma-go 讀取，node `2139:105141` icons/suspend-outline
   暫停符號、`2139:105147` icons/video-play 播放符號），匯出到
   `preview/assets/icons/`，登記進 `specs/icons.md`（含分類索引、icon 計數
   116->118）
2. **房型卡片術語變更（使用者拍板）**：狀態「使用中」->「啟用中」、
   「已刪除」->「已停用」；按鈕「刪除」->「停用」（icon 換
   `icons/suspend-outline`）、「還原」->「啟用」（icon 換 `icons/video-play`）。
   icon 與文字顏色從紅/綠改純黑 `#000000`；按鈕邊框與漸層終點色**不變**
   （停用維持粉 `#F3C2C4`，啟用維持綠 `#BBF7D0`）
3. **新增停用/啟用互動行為**（使用者明確要求，之前這兩顆按鈕是靜態的）：
   點「停用」卡片切到已停用（查看/啟用 + 灰階 ribbon）；點「啟用」切回
   啟用中（修改/複製/停用 + 橘階 ribbon）。純前端 in-memory 狀態，
   `preview/js/room-type.js` `initCardActionToggle()` delegated click ->
   改 `ROOM_TYPE_CARDS` 對應 card 的 `state` -> `renderCardList()` 整份重繪
4. **修正回歸 bug**：`room-type-photo-modal.js` 原本用
   `document.querySelectorAll("[data-room-type-photo-trigger]").forEach(...)`
   逐一 bind click，卡片重繪後新節點沒有這個 listener，照片 modal 會失效。
   改成 document 級 delegated click（`e.target.closest(...)`），重繪後仍正常
5. **spec 更新**：`components/room-type-card.md`（狀態/按鈕/顏色全面改名，
   新增「停用/啟用互動」段）、`specs/pages/room-type.md`（重整按鈕語意
   對照更新、清掉一則已解決的舊「Figma未定義」項目）、`specs/icons.md`
   （2 個新 icon 補實際用途）
6. **驗證**：`node scripts/smoke-test.mjs` 新增「disable/enable toggle 切換
   按鈕組」check（11 checks，含手動驗證重繪後照片 modal 仍正常），四項 lint
   全過

### 重要決定

- 按鈕邊框/漸層色刻意保留（停用=粉、啟用=綠），只有 icon+文字變黑，
  是使用者明確拍板的設計，不是我方推測
- 停用/啟用切換是純前端 demo 狀態（不接後端），刷新頁面會重置回初始 6 卡
  資料（`ROOM_TYPE_CARDS` 陣列的初始值），這是預期行為

### 未解問題

（無）

---

## Session 121 交接 (2026-07-31)

### 任務：房型頁 - 補齊卡片列表 6 卡完整資料 + 開始 preview/room-type.html 實作

Session 120 寫入 `components/room-type-card.md` 時只記錄了 6 張樣本卡中的 4 張
（四人房/賽亞人房/賽亞人房1/嗚啦啦），另外 2 張（#4 亞歷山大、#6 嘿吼嘿吼）的文字
內容在寫檔階段遺漏，沒有留下任何草稿或暫存紀錄（git history 也只有一個 commit）。
本輪 Figma 重連後，重讀 desktop 卡片 grid（`2136:98793`）補齊完整 6 卡資料。

### 本輪改動

1. **補齊 `components/room-type-card.md` 6 卡完整資料表**：node ID 列表改成含
   ribbon / 狀態 / 照片 / 副標 / 統計列四欄值的完整表格，取代原本只記 4 張的清單。
   確認：6 張裡 2 張使用中（四人房/賽亞人房）、4 張已刪除（賽亞人房1/亞歷山大/
   嗚啦啦/嘿吼嘿吼）；2 張有照片（四人房/嗚啦啦）、4 張無照片。嗚啦啦（已刪除+
   有照片）再次驗證 2026-07-31 稍早拍板的「已刪除只是從使用中移除，不是真的刪
   資料」規則。
2. **釐清「已刪除卡片是否可以有照片」**（本次對話稍早，figma 未重連前）：使用者
   拍板已刪除語意 = 從使用中移除，非真的刪除資料，既有照片等資料不受影響；
   已寫入 `components/room-type-card.md`「概述」段，「Figma 未定義」段對應項目
   已清空。

### 重要決定

- Figma 讀取遺漏的教訓：下次 figma-go read 多張同類卡片/列表項目時，讀完當下
  就要逐一核對「已讀 N 張中的第幾張」再寫 spec，不能只挑幾個代表樣本就假設涵蓋
  全部，尤其該次讀取時使用者已明確告知是「6 張卡各自不同佈局」

### 下一步應做

1. 開始實作 `preview/room-type.html`：頁面 shell（沿用既有 aside/topbar partial，
   aside 房型項目要從 inactive 佔位改真實連結 `./room-type.html`）+ 完整 6 卡片
   列表（用上表資料，不省略任何一張）+ 3 個資料 modal（新增/修改/查看）+ 照片
   管理 modal（獨立 JS，比照 `lodging-info-modals.js` pattern 但不共用檔案/state）
2. 統計列分隔線顏色要用渲染圖核對，不直接信 JSON 的 `#000000`/`#454545`
3. 新增頁面需登記：`js/page-tabs.js` TAB_PAGES、`scripts/lint-partials.py`
   MANIFEST（partials: aside/topbar/session-modals/topbar-modals/
   room-type-modals；modules: partials.js/page-shell.js/page-tabs.js/
   modal-controller.js/topbar-modals.js/room-type-modals.js/
   room-type-photo-modal.js）、`app.css` 加 `room-type.css` import
4. Modal 版面：3 個房型資料 modal（新增/修改/查看）採獨立 modal block（不是
   share 一顆動態切換），desktop max-width 800px（`modals.css` 仿
   `#modalBranchInfoBackdrop` 800px pattern）；照片管理 modal 沿用
   `state=photo-gallery` 版型但另建 `#modalRoomTypePhotoGalleryBackdrop`
   （不可重用 `modalPhotoGalleryBackdrop` id，避免跟民宿資料頁的既有慣例混淆：
   房型頁是獨立 document，id 不會碰撞，但沿用同 id 容易誤讓人以為兩頁共用
   同一顆 modal instance）
5. 房間介紹文案／房間名稱文案 caption 卡：modal.md 未定義多語言 tab，比照
   `lodging-branch-content-card.js` 但拿掉語言 tab / 翻譯列（單語言版），新增/
   修改預設「尚未填寫」+ 編輯按鈕開 SunEditor placeholder；查看模式移除編輯
   按鈕，房間介紹文案改示範已儲存內容（固定文字見 `components/modal.md`
   state=room-type「固定文字內容」表），房間名稱文案維持空狀態

### 未解問題

（無）

---

## Session 121 再補充：嗚啦啦卡片統計列對齊修正 (2026-07-31)

使用者截圖覆核發現：無副標的「嗚啦啦」卡片統計列（table）沒有貼齊卡片底部，
跟同一列其他卡片沒對齊。追查後發現先前記錄「無副標卡片變矮 446px->412px」是
錯的（`get_screenshot` 逐張像素量測，6 張卡總高度完全一致，皆 446px）。

**修正**：`preview/js/room-type.js` `buildCard()` 把「分隔線 + 統計列」包成
`bottomSection`（`flex flex-col gap-4 mt-auto`），靠 flex `mt-auto` 把它推到
卡片底部；卡片列表容器本身是 CSS grid，同一列卡片預設互相 stretch 等高，
這是 `mt-auto` 有多餘高度可吸收的前提。`components/room-type-card.md`「副標
缺失」段已訂正（標記 446px 統一 + mt-auto 實作方式，刪除錯誤的 412px 記錄）。
1440/768 兩個斷點截圖驗證：同一列卡片的統計列已對齊，`node scripts/
smoke-test.mjs` 與四項 lint 全數重跑通過。

---

## Session 121 補充：room-type.html 實作完成 (2026-07-31)

### 本輪改動（延續上面 Session 121 交接）

1. **重掃 3 個 modal（新增/修改/查看）**：跟 Session 120 寫入 `components/modal.md`
   的紀錄逐欄位/逐顏色核對，完全一致，無落差，只補一句「disabled Input =
   Neutral/100（非 Select 的 Neutral/200）」的元件類型澄清
2. **發現並修正 JSON 不等於視覺 landmine（房型卡片按鈕 + ribbon）**：
   修改/複製/刪除/查看/還原 5 顆 pill 按鈕與左上角 ribbon 三角色塊的
   `get_selection`/`get_node` 完全沒有 `fills` 欄位（只有 `strokes`），
   照 JSON 字面會誤判成白底+純色邊框；改用 `save_screenshots(SVG)` 讀
   `<defs><linearGradient>` 才發現全部是白->對應色的漸層背景。`components/
   room-type-card.md` Token/顏色表已更正，5 個漸層色標全部已有既有 token
   （`Brand-100`/`Brand-200`/`linear-function-button-duplication`/
   `linear-function-button-delete`/`light-green`/`Border/Default`），
   不需新增。同時訂正「刪除」按鈕文字色（先前誤記 `Border/Plugin-Invalid`，
   實際是 `Surface/Status-Negative #E12129`；`Plugin-Invalid` 是 icon vector
   色）
3. **實作 `preview/room-type.html`**：頁面 shell（沿用 aside/topbar/
   session-modals/topbar-modals partial）+ 操作列（摘要文字 + 新增/重整
   按鈕，mobile 順序反轉）+ 6 張房型卡片完整渲染（`js/room-type.js`
   data-driven render，資料來自 `components/room-type-card.md` 完整 6 卡表）
4. **新增 `preview/js/room-type.js`**：卡片列表渲染（ribbon SVG、圓形照片
   trigger、功能按鈕列、統計列 table）+ 重整按鈕（`location.reload()`）。
   Ribbon 用 inline SVG 帶入 Figma 精確 path（`get_screenshot(SVG)` 匯出結果）
   還原圓角尖端，不用 clip-path 近似；8px 卡片邊距用 wrapper `top-2 left-2`
   還原（Figma bounds x:8,y:8，非貼齊 0,0，這是使用者截圖覆核發現的第二個
   落差）。Ribbon 漸層終點色跟卡片狀態連動：使用中（有「修改」按鈕）=
   `Brand-100` 淡橘，已刪除（有「查看」按鈕）= `Neutral-100` 淡灰（使用者
   訂正，SVG 覆核節點 `2137:101205` 已刪除卡片確認）
5. **新增 `preview/partials/room-type-modals.html`**：新增/修改/查看 3 個
   資料 modal（獨立 modal block，不共用動態切換）+ 照片管理 modal（版型
   沿用 `state=photo-gallery`，id 改成 `modalRoomTypePhotoGalleryBackdrop`
   不跟民宿資料頁共用 instance）
6. **新增 `preview/js/room-type-modals.js`**：房間介紹文案/房間名稱文案
   單語言版 caption card（modal.md 沒有語言 tab 維度，跟
   `lodging-branch-content-card.js` 3 語言版不同，獨立實作不 import）+
   facility chip 選中切換
7. **新增 `preview/js/room-type-photo-modal.js`**：比照
   `lodging-info-modals.js` pattern，依卡片 id（room-1~room-6）各自獨立
   5 張圖片 slot 狀態，JS 完全獨立不 import 民宿資料頁檔案
8. **CSS**：新增 `preview/assets/css/room-type.css`（按鈕漸層、facility chip
   選中態、統計列 table 樣式），登記進 `app.css` import 清單；`modals.css`
   新增 3 個資料 modal（800px，仿 `modalBranchInfoBackdrop`）+ 照片管理
   modal（1140px）的 `.modal-box` 寬度規則 + mobile fullscreen 群組
9. **頁面登記**：`partials/aside.html` 房型項目改真實連結、
   `js/page-tabs.js` TAB_PAGES 加 `room-type.html`、
   `scripts/lint-partials.py` MANIFEST 加 room-type.html 條目、
   `scripts/smoke-test.mjs` APP_CSS_LOADED_CHECK 加 `room-type.css` +
   新增 room-type.html 頁面 entry（10 項 check：6 卡渲染、
   active/deleted 按鈕數量、3 個資料 modal 開關、facility chip 切換、
   照片 modal 開關+獨立 slot 驗證）
10. **RWD 斷點澄清（使用者拍板）**：`components/room-type-card.md` 只定義
    767px 單欄跟 1440px 3 欄兩個斷點，768-1280px 中間帶（aside 已切桌面版
    但寬度不夠 3 欄）沒有 Figma 依據；問過使用者後，使用者實測目前
    `md:grid-cols-2 xl:grid-cols-3` 過渡效果可接受，維持現狀不改

### 驗證（self-tested，pending 使用者最終驗收）

- [x] **Token 檢查**：顏色全部引用 tokens.md 既有 token（無新增 hex）；
  漸層色標見上方「本輪改動」第 2 點
- [x] **Icon 檢查**：全部從 `preview/assets/icons/` 引用，無自畫 SVG
  （ribbon 用 inline SVG 但是精確複製 Figma path，非自創圖形）
- [x] **RWD 檢查**：375/768/1440 三個斷點截圖驗證 - mobile 卡片單欄 +
    按鈕換行（修改+複製一行/刪除置中另一行）+ 操作列順序反轉；768 aside
    桌面版 + 2 欄卡片（使用者拍板接受）；1440 3 欄 grid + 桌面操作列
- [x] **Font-size 檢查**：無 `text-[10px]` 等 < 12px 寫法
- [x] **min-width mobile-safe 檢查**：無 fixed `min-w-[Npx]` 未加 `md:` 前綴
- [x] **Lint 自檢**：`lint-fonts.sh`/`lint-conventions.sh`/`lint-partials.sh`/
  `lint-tokens.sh` 全數 exit 0
- [x] **Browser smoke test**：`node scripts/smoke-test.mjs` 7 頁全過
  （room-type.html 10 checks，含 6 卡渲染、3 資料 modal 開關、facility
  chip 切換、照片 modal 獨立 slot）
- [x] **狀態完整性**：使用中/已刪除按鈕組、disabled 欄位、chip 選中態、
  toggle 開關態、查看模式全disabled+關閉按鈕，全部依 modal.md/
  room-type-card.md 規格實作，人工截圖 + click 測試核對過
- [x] **文字內容**：6 張卡文字、modal 固定文字內容跟 Figma 一致

### 未解問題

（無）

---

## Session 120 交接 (2026-07-30)

### 任務：系統設定 -> 房型頁 figma-go read 階段（desktop/tablet~mobile/mobile 三個 RWD frame）

新頁面，目前還在 figma-go 的 Read 階段，尚未寫 `specs/pages/` 或
`components/` spec，也還沒開始實作。本輪處理 variants 同步、三個斷點 frame
讀取、icon 盤點同步。

### 本輪改動

1. **Variants 同步**（使用者貼 Figma Variables 匯出 JSON，比對後只有 2 筆
   真正新增）：`specs/assets/figma-variables.json` + `specs/assets/tokens.md`
   Accent 表新增 `linear-function-button-delete` (#F3C2C4)、
   `linear-function-button-duplication` (#C6DDFE)；`preview/assets/css/base.css`
   對應補 2 個 CSS variable。`lastSyncedAt` 更新為 2026-07-30。
   `./scripts/lint-tokens.sh` verified 通過。
2. **讀完 3 個 RWD frame**（各自截圖 + get_selection JSON 交叉核對）：
   - desktop `2137:101408`（1440x1130）：aside 選單 + topbar breadcrumb
     chips/function icons + 房型卡片 3 欄 grid（6 張卡）
   - mobile~tablet `2137:103071`（767x2956）：aside/breadcrumb/function
     icons 整排消失，topbar 只剩 logo + 選單開關 icon；卡片改單欄滿寬
   - mobile `2137:103890`（375x3164）：同上但操作列順序反過來（新增/重整
     按鈕在上，摘要文字在下）；卡片按鈕 3 顆時換行（修改+複製一行,
     刪除置中另一行）
   - 房型卡片共同結構：左上角 ribbon 數字、圓形圖片（實照或
     `to be uploaded` 佔位）、名稱、副標「房價跟隨」、功能按鈕兩態
     （修改/複製/刪除 或 查看/還原）、統計列（代號/床型/間數/營運方式）
3. **Icon 盤點同步**（使用者說這版用了新 icon，要求全部讀一次）：跨 3 個
   frame 收集全部 `icons/*` 實際使用清單，跟 `preview/assets/icons/` +
   `specs/icons.md` 比對，真正新增只有 2 個：`preview-outline`（查看按鈕）、
   `restore-page-outline-rounded`（還原按鈕，語意跟既有 `restore` 不同,
   已在 icons.md 加註不要混用）。SVG 已用 `save_screenshots(SVG)` 匯出到
   `preview/assets/icons/`，`specs/icons.md` 清單 + 分類索引都補上（含補
   `restore` 原本漏列在分類索引的舊缺口）。其餘 icon（bulletin/close/
   cursor/down/download/duplicate/edit/email/image/image-empty/logo/
   logout/message/operation-system/outline-plus/person-md/restore/right/
   service/switch/system/trash-can）皆已存在，沿用。topbar 選單開關用的
   `Folder` instance（雙矩形）比對現有 `folder.svg` 结构一致，非新 icon。
4. **讀完 3 個 modal**（新增 `2137:101712` / 修改 `2137:104312` / 查看
   `2137:104757`，各自截圖 + JSON 核對）：修改比新增多 3 個欄位（人數/
   加人/加床/房數修改 toggle），版面整段重排；營運型態/顯示分類/房價跟隨
   在修改模式從 Select 變成 disabled Input；房型類別在修改模式從 Select
   變成白底可編輯 Input。查看 = 修改的全欄位 disabled 版本，兩個文案卡
   移除「編輯」按鈕，facilities chip 全部統一灰色不保留選中藍色，footer
   只留一顆「關閉」按鈕（不是取消+儲存）。
5. **寫入 spec**（本輪完成，figma-go read 階段結束）：
   - `components/modal.md` 新增 `state=room-type` 段（新增/修改/查看
     modal 完整規格，含 disabled 判斷規則、欄位差異表、固定文字內容、
     toggle 沿用既有 `.member-data-switch` pattern）
   - 新檔 `components/room-type-card.md`（卡片 anatomy、狀態、統計列
     table 實作規格、圖片點擊開照片管理 modal 的規則）
   - 新檔 `specs/pages/room-type.md`（頁面佈局、操作列斷點差異、shell
     沿用規則、modal 開啟入口彙整）
   - 三份 lint（conventions/fonts/tokens/partials）皆 verified 通過

### 重要決定（使用者拍板）

- ribbon 數字、缺副標的卡片（"嗚啦啦"）：都是佔位/刻意設計，渲染文字對了
  就好，不用深究真實語意，之後接後端
- 「僅 住宿類型」旁沒有 toggle/checkbox，純說明文字
- 「重整」按鈕（icons/restore + 文字「重整」）= 重新整理當前頁，同元件
  同位置以後不用再問（已寫入記憶 `feedback_refresh_button_semantics`）
- aside 選單佔位標籤沿用既有規則，不跟 Figma（既有記憶
  `feedback_menu_list_source`）
- mobile/tablet 消失的 breadcrumb chips + function icons：沿用既有 shell
  pattern，不是頁面專屬規格 - 對照 `preview/lodging-info.html` +
  `preview/partials/topbar.html`/`aside.html` 確認：`#desktopTopRow`
  只在 `md:flex` 顯示；`<768` 用獨立 mobile top bar（logo +
  `#mobileMenuBtn` 開 `folder.svg`），chips/function icons 收進 aside
  抽屜（`mobile-sidebar-header`），三個 Figma frame 的行為完全對得上
- 統計列（代號/床型/間數/營運方式）決定當 table 做，不分斷點：外層
  `overflow-x-auto`，`th`/`td` 用 `white-space: nowrap` 讓內容天然撐開觸發
  橫向捲動，不寫死固定寬度，三個斷點共用同一份 markup/CSS。已對齊
  `account-permission.html` 的 `.ap-records-table`（CSS 在該檔案
  head 28-44 行，markup 448-488 行）跟 `order-processing.html` 386 行
  `.op-table md:min-w-[1080px]` 兩個既有 table 前例，使用者拍板照這個
  說明先做，做出來再視覺調整（新 scoped class 定案 `.room-type-stat-table`，
  text-align: center）
- Modal disabled 規則：白底 = 可編輯，只要容器變色（灰底）就是 disabled，
  沒有例外；這條規則同時適用於 Input 跟 Select
- 查看 modal facilities chip 全部 disabled 灰色是刻意設計，不保留選中藍色
  （查看模式沒有操作權限，不需要區分選中狀態）
- 查看 modal footer 原本 Figma 貼了取消+儲存兩顆按鈕是使用者貼稿疏漏，
  拍板改成只留一顆「關閉」按鈕
- 卡片圓形圖片點擊開啟的照片管理 modal，跟「系統設定 -> 民宿資料」頁共用
  同一版型（`components/modal.md` `state=photo-gallery`），但 JS 要各自
  獨立實作，不共用 `lodging-info-modals.js`（使用者明確要求 js 不要混在
  一起）

### 下一步應做

1. 開始實作 `preview/room-type.html`：頁面 shell（沿用既有 aside/topbar
   partial）+ 房型卡片列表 + 3 個資料 modal + 照片管理 modal（獨立 JS）
2. 統計列分隔線顏色（表頭跟值之間）Figma JSON 給的是 `#000000`/`#454545`，
   實作時要對照渲染圖確認實際 token，不要照 JSON 可疑黑色直接套
3. 統計列 table 做出來後可能需要視覺微調（使用者拍板先做再看）
4. 房型頁 3 個 JS module（`room-type.js` / `room-type-modals.js` /
   `room-type-photo-modal.js`）完成後記得登記進
   `scripts/lint-partials.py` MANIFEST

### 未解問題

- 「已刪除」狀態卡片是否強制不能有照片，樣本不足（見
  `components/room-type-card.md`「Figma 未定義」段），實作時先照現有樣本
  處理，之後有更多樣本再確認

---

## Session 119 交接 (2026-07-30)

### 任務：lodging-info.html 實作 task 8 - 須知與聲明卡完整編輯流程

延續 Session 118 交接的 task 1-7，本輪完成 task 8（剩餘 task 裡最複雜的
一個）。開工前先讀過 `components/lodging-branch-suneditor.md`「實際串接
時的架構原則」段確認拍板內容才動手。

### 本輪改動

1. 新增 `preview/js/suneditor-instance.js`：共用「建立/掛載單一 SunEditor
   placeholder instance」helper，`mountSunEditorPlaceholder(container,
   {value, placeholder, onInput})` -> `{getValue, setValue, destroy,
   focus}`。內建 SunEditor 官方預設工具列 9 個按鈕群組（依 spec icon
   清單），本輪按鈕全部裝飾用不接行為，只有 textarea 本身可輸入。之後
   真正串接 SunEditor 時只需把 mount 內部換成 `SUNEDITOR.create()`，
   呼叫端介面不用改。
2. 新增 `preview/js/toast.js`：最小可用 toast（`showToast(message)`），
   bg Neutral/700 白字，2.5 秒自動消失，目前只有翻譯按鈕使用，之後其他
   頁面需要可直接複用。
3. 新增 `preview/js/lodging-notice-card.js`：須知與聲明卡完整狀態機，
   涵蓋 `components/lodging-branch-notice-card.md` 001-006 + `lodging-
   branch-suneditor.md` 001-007 全部狀態：
   - 分類 tab（訂房/成為會員/團體訂房/不退款聲明）x 語言（依 row 各自
     啟用語系數）兩維度 state，DOM 完全由 `render()` 重建（同照片管理
     modal 的 render pattern），HTML 只留容器 id
     `lodgingNoticeCard-{rowKey}`
   - 來源按鈕（僅 zh tab 顯示，直接覆蓋不跳確認）+ 左側色條提示
   - 翻譯按鈕（僅非 zh tab 顯示，依 zh 草稿內容 enabled/disabled）+
     disabled 時 hover tooltip（沿用 start.md「Tooltip 視窗自適應」
     clamp 邏輯，marginLeft + documentElement.clientWidth 基準）+ 點擊
     顯示 toast、內容不變
   - 跨分類、跨語言本地暫存：每個分類各自獨立 `edit` session（含
     draft），切換分類/語言 tab 不遺失未儲存內容；「取消」捨棄整個
     session 回復到上次儲存值；單語言「儲存」/多語言「全部儲存」一次
     寫入該分類所有語系
   - Demo 資料：row1（headquarters）示範單語系全空狀態；row2（分館）
     訂房分類示範多語系（繁中已儲存/英韓未填寫），涵蓋 tabs 顯示、翻譯
     按鈕 enabled（英韓，因為 zh 有內容）情境；其餘 3 分類维持全空
4. 修改 `preview/lodging-info.html`：row1/row2 須知與聲明卡的分類 tab
   列 + 內容區靜態 markup 移除，改成單一空容器交給
   `initLodgingNoticeCards()` render；inline module script 補 import
5. 修改 `preview/assets/css/lodging-info.css`：新增語言 tab 底線 active
   樣式、翻譯按鈕 enabled/disabled（disabled 用
   `color-mix(in srgb, var(--color-brand-100) 50%, transparent)`
   模擬「Brand-100 50% 透明」，非硬編碼 hex/rgba）、tooltip、SunEditor
   佔位工具列/textarea、toast 共 8 個新 class 區塊
6. `scripts/lint-partials.py` MANIFEST 補上 `lodging-info.html` 新增的
   `./js/lodging-notice-card.js` import 順序項目

### 首版產出後的視覺訂正（同輪，使用者對照 Figma 即時糾錯）

首版完成並截圖驗收後，使用者對照 Figma 指出 4 處跟原始 spec 文字記錄不符
的視覺細節，已修正並回寫對應 component spec（`lodging-branch-suneditor.md`
`lodging-branch-notice-card.md`）：

1. 「內容來自[來源]範本，儲存後為本館自訂」色條提示，跟「取消/儲存」
   Footer 是**同一列**（左提示右按鈕），不是提示獨立一行在 Footer 上方。
   footer 用 `flex-wrap` 因應窄卡片：放不下時按鈕整組換到下一行，不擠壓
   按鈕文字換行
2. 單語言時固定顯示的「繁體中文」標籤是**粗體**（先前 spec 誤記「同
   active tab 樣式 + 底線」，已訂正並移除底線描述）
3. 翻譯按鈕本身**沒有列外框**（先前 spec 誤記「翻譯按鈕列外框 Brand-200」
   已從 Typography 表移除），「從繁中譯為[語言]」label 是純文字
4. 翻譯按鈕是 **icon-only**（`icons/translation.svg` + `aria-label`
   無障礙標示），不是純文字「翻譯」

### 驗證

- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0
- `node .claude/skills/run-swift/driver.mjs smoke`：5 頁全 PASS
  （lodging-info.html 本身仍未登記進 smoke 頁面清單，維持 task 10 範圍）
- 用 driver `eval`/`shot` + chrome-devtools MCP 逐項函式測試（非僅截圖
  肉眼）：分類 tab 切換、語言 tab 切換（view/edit 兩種模式）、編輯進入/
  取消（回復儲存值）/儲存（單語言與多語言全部儲存）、來源按鈕（載入
  範本內容 + hint bar 文字）、翻譯按鈕 enabled/disabled 判斷、翻譯點擊
  -> toast 顯示且內容不變、tooltip hover 顯示 + clamp 邏輯（用
  `Object.defineProperty` 模擬窄視窗驗證 marginLeft 位移方向正確）、
  跨分類 mid-edit 暫存不遺失（訂房分類編輯中途切到團體訂房再切回，草稿
  仍在）
- chrome-devtools MCP 檢查 console：互動序列後只有既有 Tailwind CDN
  production 警告與網站既存的 favicon.ico 404（跟本輪改動無關），無新增
  error/warn
- 截圖：1440 桌面（row1 編輯態含來源按鈕/工具列、row2 多語系英文 tab
  編輯態）、375 手機（版面堆疊 + 編輯態工具列 flex-wrap 換行）皆
  self-tested 正常，未落地存檔到 `specs/qa-screenshots/`（僅開發中核對
  用途，非正式 QA 截圖批次，待 task 10 全頁驗證時再一併產出）

### 重要決定

- 系統範本/總部範本示意文字沿用同一組固定文案套用到 4 個分類（spec
  本身標記內容不影響規格判讀），非 Figma 來源，純 demo placeholder
- 「來源提示 hint 何時消失」spec 未明定細節：本輪實作為切換語言 tab 或
  結束編輯 session（儲存/取消）時清除，重新進 zh tab 才會再顯示（除非
  再次點來源按鈕）；如果之後這點有唯一定義的 Figma 依據要回來核對調整
- 分館資料編輯 modal 內 4 張文案卡片（飯店介紹/設施/提醒/交通）**不在
  本輪範圍**，維持 task 7 完成的靜態空狀態；`suneditor-instance.js` /
  `toast.js` 之後接上那 4 張卡時可直接複用，不需要重寫

### 未解問題

- 無（task 8 範圍內功能與規格已核對一致）

### 外層 shell padding 規則訂正 + lodging-info.html 套用（同輪）

使用者指出 mobile/tablet 外層 padding 移除、mobile top bar 自帶 `px-3
pt-3` 這件事在 lodging-info.html 上「失效」。查證後這不是 regression：
Session 112（account-permission）當時把這個改動記錄成「本頁專屬調整，不
是全站頁殼慣例」，其他頁（含後來新增的 lodging-info）從未套用過。

跟使用者對齊後訂正判準（已寫入 `specs/page-architecture.md`「Mobile/
tablet 外層 shell padding」新節，取代 Session 112 那則容易被誤讀成「二選
一」的舊表述）：**不是全站規則、也不是單頁 hack，是依當時讀取的 Figma
frame 佈局性質逐頁判斷**：上下多 section 堆疊型（section 間本身需要呼吸
空間）保留 `rootWrap p-3`；多 card 彼此整襯型（card 間貼齊、card 自己的
border/bg 就是視覺邊界，如 account-permission 跟 lodging-info 的分館列白
底卡片）則 mobile/tablet 移除外層 padding、mobile top bar 自帶 12px。

**本輪套用**：`preview/lodging-info.html` `#rootWrap` 改 `md:p-3`
（`<768` 歸零），mobile top bar 那一行加 `px-3 pt-3`，跟
account-permission 實作方式一致；`<main>` 內既有的「content」容器（bg
Neutral/75、padding 20，Session 118 讀取時三斷點固定值）不受影響、原樣
保留。

驗證：375/768/1440 三寬度截圖確認 mobile 外層貼齊螢幕邊緣、top bar 保留
12px 左/上 padding，768 以上（`md:`）恢復原本 12px shell padding 與桌面版
外觀不變；4 lint + `driver.mjs smoke`（5 頁）全過。

**未套用範圍**：landing / room-booking / order-processing / system-basic
四頁維持 `rootWrap p-3` 不動，這幾頁尚未依這次訂正的判準重新檢視過
Figma frame 佈局性質，不是判定為「堆疊型」故意排除，之後個別碰到這幾頁
再各自判斷，不要批次套用。

### Task 9 完成：多語系狀態總覽 modal（同輪接續）

`components/modal.md` `state=multilingual-status` 早有完整 Implementation
contract（Session 之前讀取），本輪開工前先用 `get_node` + `save_screenshots`
對節點 `2129:81569` 重新核對一次（新元件、非小修，依規則要先驗證），抓到
2 處跟舊文字記錄不符：

1. **語系 tab active 不是四邊框，是底線樣式**：JSON 對 active tab 的
   `Texts` instance 回報 `strokes:["#f28b45"]`，一開始以為是四邊框；
   `save_screenshots` 渲染核對後其實是 `border-bottom` 底線（跟
   `components/member-data-modal.md` filter tab 同一個 Figma 元件，同節點
   名 "Frame 606"）。直接複用既有 `.member-data-filter-tab` CSS class，
   不用另外寫
2. **body 外層「content swap」節點的 `strokes:["#d1d1d1"]` 沒有實際渲染**：
   套用本輪稍早訂正的新原則（`feedback_figma_hidden_layer_serialized`：
   JSON 有、渲染沒有 = 視覺為準，不用做），沒有加這層 body 邊框

新增檔案/改動：
- `preview/partials/lodging-info-modals.html`：新增
  `#modalMultilingualStatusBackdrop`（header 標題+副標、語系 tab、狀態
  圖例、4 面板表格、footer 單一「關閉」按鈕）
- `preview/js/lodging-info-modals.js`：新增 `initMultilingualStatusModal()`
  （純 tab active class 切換，4 語言共用同一份 demo 資料，不重渲染內容）
- `preview/assets/css/modals.css`：新增 `.lodging-ml-*` 系列 class（面板/
  表頭/列/狀態欄）+ `#modalMultilingualStatusBackdrop .modal-box`
  948px + 註冊進「大型內容 modal mobile 全螢幕」群組（跟 photo-gallery/
  branch-info 同一組）
- `preview/js/tailwind-config.js`：新增 `bg-table-column1` /
  `bg-table-column2` utility class
- `preview/lodging-info.html`：`lodgingMultilingualStatusBtn` 補上
  `data-modal-open="modalMultilingualStatusBackdrop"`
- `components/modal.md`：訂正上述 2 處 + 補實作位置索引

### 驗證（Task 9）

- 4 lint 全 exit 0；`driver.mjs smoke` 5 頁全 PASS
- chrome-devtools MCP：開啟/header 關閉/footer 關閉三種方式都測過，
  console 互動後無新增 error/warn（只有既有 Tailwind CDN 警告）
- 截圖：1440（桌面 4 面板橫排）/768（`calc(100vw-24px)`，面板橫向
  scroll）/375（mobile 全螢幕，面板橫向 scroll）皆 self-tested 正常，
  跟 Figma 截圖比對視覺一致
- 語言 tab 切換用 eval 驗證：4 個 tab 互斥，僅 1 個 `is-active`

### 使用者驗收 Task 9 時的兩處修正（同輪）

1. **多語系狀態 modal 表格 icon 對齊**：面板內容區（`.lodging-ml-panel-
   body`）原本用不對稱 padding（左8/右20，本來想幫捲軸預留空間）導致
   狀態 icon 欄位比表頭「狀態/名稱/介紹」文字整體左移 6-8px。改成跟表頭
   一致的 12px/12px 對稱 padding，4 個面板的 icon 欄位現在都跟表頭精確
   對齊（座標量測驗證，4 個面板 header/row 中心點完全一致）。
2. **照片管理「主圖」pill 規則反轉**：使用者訂正 Session 118 當時「只有
   排序第1位同時有圖片才顯示 pill」的規則，改回「**永遠顯示在排序第1位，
   不論該格有沒有圖片**」。理由：無圖時不顯示的話，使用者從外層（主頁
   預覽）看不出「這格還沒選圖」，容易漏設定；永遠顯示才能一眼看出目前
   排序第1位有沒有圖。用 chrome-devtools MCP 實際上傳第 2 張圖 + 原生
   drag 測試過：pill 固定跟著「排序第1位」這個位置走（不是綁定特定
   照片），拖曳後正確换到新占據第1位的card上，行為驗證通過。
   已更新 `preview/js/lodging-info-modals.js`（`buildCard` 拿掉
   `slot.hasImage` 判斷）與 `components/modal.md` 對應 3 處文字
   （主圖 pill 出現條件、有圖 card 結構註記、刪除行為的 pill 轉移邏輯）。

驗證：4 lint 全 exit 0、`driver.mjs smoke` 5 頁全 PASS、chrome-devtools
截圖 + 座標量測 + 原生 drag/upload 測試皆 self-tested 通過。

### Task 10 完成：全頁驗證（lodging-info.html 全部 10 個 task 收尾）

`scripts/smoke-test.mjs` 新增 `lodging-info.html` 頁面登記（先前一直只在
`APP_CSS_LOADED_CHECK` 的 domain CSS 清單裡出現，頁面本身沒被跑過），
12 個 checks，涵蓋：
- 分館列/基本資訊卡渲染數量
- 須知與聲明卡分類/語言 tabs 數量（row1 單語系 4 分類 tab、row2 多語系
  3 語言 tab）
- 照片管理 modal 開關 + 主圖 pill 永遠顯示在空的排序第 1 位
- 分館資料編輯 modal 開關 + header 標題依觸發按鈕正確切換「資料修改」/
  「資料設定」
- 多語系狀態 modal 開關 + 語言 tab 切換互斥
- 須知與聲明卡完整編輯/儲存/取消 round-trip（輸入內容 -> 儲存 -> 驗證
  唯讀顯示 -> 再次編輯改別的內容 -> 取消 -> 驗證回復到儲存值，不是改後
  的內容）
- 沿用共用 `SHELL_CHECKS`（aside accordion / 收合全部 / mobile drawer）
  跟 `SESSION_MODAL_CHECKS`（登出 modal 開關 + ESC）

### 驗證（Task 10，全頁最終驗收）

- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0
- `node .claude/skills/run-swift/driver.mjs smoke`：**6 頁全 PASS**
  （`lodging-info.html` 12 checks，含上述互動流程，非僅存在性檢查）
- 正式 QA 截圖存 `specs/qa-screenshots/session-119/`（8 張）：
  - `lodging-info-overview-{1440,768,375}.png`：全頁三斷點總覽
  - `lodging-info-photo-modal-mainpill-1440.png`：照片管理 modal + 主圖
    pill 在空格的驗收畫面
  - `lodging-info-branch-info-modal-1440.png`：分館資料編輯 modal
  - `lodging-info-multilingual-modal-{1440,375}.png`：多語系狀態 modal
    桌面/手機全螢幕
  - `lodging-info-notice-edit-multilang-1440.png`：須知與聲明卡多語系
    編輯態（翻譯按鈕/語言 tabs）
- 全部截圖肉眼核對跟預期一致，無跑版或缺漏

### Task 10 驗收後追加：分館資料編輯 modal「飯店介紹文案」補上完整 SunEditor UI

使用者驗收時發現分館資料編輯 modal（`state=branch-basic-info`）的 4 張
文案卡片一直維持靜態空狀態（task 7 範圍），沒有套用
`components/lodging-branch-suneditor.md` 的完整 SunEditor UI（跟主頁
須知與聲明卡本應共用同一套規格）。使用者確認**只需要補「飯店介紹文案」
這一張**，其餘 3 張（設施/提醒事項/交通）維持現狀不動。

新增 `preview/js/lodging-branch-content-card.js`
（`initLodgingBranchContentCard()`）：跟 `lodging-notice-card.js` 同一套
語言 tabs/翻譯按鈕/SunEditor 佔位/全部儲存-取消邏輯，複用
`suneditor-instance.js` / `toast.js`，也直接複用了
`.lodging-notice-lang-tab` / `.lodging-notice-translate-btn` /
`.lodging-notice-tooltip(-wrap)` 既有 CSS class 與全域 tooltip hover
delegation（不用重寫）。**跟須知與聲明卡的唯一差異**：沒有「來源/範本」
按鈕 -- 這是這個元件的基礎規格本來就沒有的功能（`lodging-branch-
suneditor.md` 001-007 狀態本身沒有來源按鈕，來源按鈕是 notice-card 額外
加的），不是拿掉。Demo 語系設為 3 語言（繁中/英/韓），初始空狀態。

修改檔案：
- `preview/partials/lodging-info-modals.html`：飯店介紹文案卡片內容區
  改成空容器 `#lodgingBranchIntroCard` 交給 JS render
- `preview/lodging-info.html`：inline script 補 import + init 呼叫
- `scripts/lint-partials.py`：MANIFEST 補新 module
- `scripts/smoke-test.mjs`：`lodging-info.html` 補一項 check（多語言
  tabs 數量、確認無來源按鈕、edit-save round trip），變成 13 checks
- `components/lodging-branch-info-modal.md` / `lodging-branch-
  suneditor.md`：補「實作範圍」說明（只有介紹文案套用，其餘 3 張維持
  靜態，且注記無來源按鈕是規格本來就沒有，非拿掉）

驗證：4 lint 全 exit 0、`driver.mjs smoke` 6 頁全 PASS（lodging-info.html
13 checks）、chrome-devtools MCP 手動測試多語言 tab 切換 + 各語言各自
儲存 + 翻譯按鈕 enabled/disabled + toast，console 無新增錯誤。

### 驗收後再追加：翻譯列左側橘色細線

使用者對照 Figma 發現「從繁中譯為英文」翻譯列左側少了一條橘色細線。
figma-go 重讀 + `save_screenshots` 像素量測確認：這條線實際只有 **2px
寬**、`Color/Brand/Brand-200`（`#fad4ae`），是左側細線不是四邊外框（跟
先前拿掉的「翻譯列四邊外框」是兩件不同的事，不要混淆）。

新增 CSS class `.lodging-notice-translate-row { border-left: 2px solid
var(--color-brand-200); }`（`preview/assets/css/lodging-info.css`），
套用到 `preview/js/lodging-notice-card.js` 與
`preview/js/lodging-branch-content-card.js` 兩處翻譯列（須知與聲明卡 +
分館資料編輯 modal 飯店介紹文案，兩處共用同一套翻譯列元件）。已更新
`components/lodging-branch-suneditor.md` 對應規格文字。

驗證：4 lint 全 exit 0、`driver.mjs smoke` 6 頁全 PASS、chrome-devtools
截圖確認兩處都正確顯示左側細線。

### 驗收後再追加：基本資訊卡照片+標題並排時的 CSS bug（非 Figma 落差）

使用者回報：大螢幕（實測是 768~1039px 單欄 row 寬版面，卡片本身變寬）下
基本資訊卡右側「總部名稱」等欄位看起來像 `space-between`、沒有貼著左邊
照片。**這不是 Figma 落差，是實作本身的 CSS bug**：`.lodging-photo-
trigger` 在堆疊態（container <340px）用 `margin-left: auto` +
`margin-right: auto` 讓圓形照片置中；切到並排態（container >=340px）的
container query 只把 `margin-left` 歸零，漏了同時歸零
`margin-right`，導致殘留的 `margin-right: auto` 在 flex row 裡把後面的
`.lodging-title-column` 推到最右側，視覺上就是照片靠左、標題欄位貼右側
的「space-between」假象。

修正：`preview/assets/css/lodging-info.css` 的 `@container (min-width:
340px)` 區塊內 `.lodging-photo-trigger` 補上 `margin-right: 0`。

驗證：375（堆疊置中不受影響）/768/1000/1440（並排態，照片與標題欄位
貼近）四個寬度截圖確認正常；4 lint 全 exit 0、`driver.mjs smoke` 6 頁
全 PASS。

### 驗收後再追加：SunEditor placeholder 外觀補齊（拍板：這輪不會真的串接，佔位版也要照設計稿刻）

前面「已知落差」段記錄的 3 處 SunEditor 佔位版外觀落差，原本判斷「待
正式串接 SunEditor 套件時再一併調整」，使用者這輪明確拍板：**這個版本
確定不會真的串接 SunEditor，所以佔位版本本身就要照設計稿刻好**，不能
拖到真正串接才修。已全數修正（`preview/assets/css/lodging-info.css`）：

1. `.lodging-suneditor-toolbar` 補上直角外框（`border: 1px solid
   var(--color-neutral-200)` + `border-radius: 0`）+ padding 12px/6px，
   工具列跟文字內容區共用同一個外觀
2. 工具列跟 textarea 之間改成「緊鄰兩個 box、共用同一條分隔線」：
   toolbar 保留完整 4 邊 border，textarea 用 `border-top: none` 避免
   在接縫處疊出 2px 粗線
3. `.lodging-suneditor-textarea` 的 `border-radius` 從 `8px` 改成 `0`
   （直角，跟工具列外框一致）

`components/lodging-branch-suneditor.md` 對應段落已從「已知落差，暫不
修正」改寫成「已全數修正」，並註記：這是本輪手刻 CSS 照 Figma 刻出來的
效果，不是套件本身樣式，之後真的串接 SunEditor 套件時可能需要拿掉這幾
條規則、改用套件官方預設渲染，不是永久保留的樣式決策。

驗證：4 lint 全 exit 0、`driver.mjs smoke` 6 頁全 PASS、chrome-devtools
截圖確認須知與聲明卡（主頁）+ 分館資料編輯 modal 飯店介紹文案（兩處共用
同一套 `suneditor-instance.js`）都正確套用新外觀，桌面/mobile 兩個寬度
都測過，console 無新增錯誤。

### lodging-info.html 頁面狀態

**task 1-10 全部完成**（Session 118 起跑 task 1-7、Session 119 完成
task 8-10），加上驗收後追加的「飯店介紹文案」SunEditor UI 補充、翻譯列
左側細線訂正、基本資訊卡並排態 margin-right 殘留 bug 修正、SunEditor
placeholder 外觀（直角外框/分隔線/textarea 直角）全數補齊。這頁的實作、
規格訂正、視覺覆核、自動化 smoke coverage、正式 QA 截圖皆已收斂，等待
使用者最終驗收；若之後有新的視覺/行為回饋，沿用本頁既有
`preview/js/lodging-notice-card.js` / `lodging-branch-content-card.js` /
`lodging-info-modals.js` / `suneditor-instance.js` / `toast.js` 模組
架構修改，不需要重新拆分。

### 下一步應做

- 無待辦（lodging-info.html 頁面本身已完成，含飯店介紹文案補充、翻譯列
  細線訂正、基本資訊卡並排態 CSS bug 修正、SunEditor placeholder 外觀
  補齊）；下一個工作項目待使用者
  指派新任務（例如下一頁的 Figma 讀取，或既有頁面的其他回饋）

---

## Session 118 交接 (2026-07-29)

### 任務: 系統設定 -> 民宿資料頁面容器層級 figma-go 補讀 + 補一個遺漏的
「須知與聲明」有資料 state，完成 `specs/pages/lodging-info.md` 定案

延續 Session 117 標記的「待補讀取」，針對頁面容器本身（非卡片內容）
重新 figma-go 讀取，並補讀一個先前 5 輪都漏掉的狀態。

### Figma 讀取記錄 (current version, read 2026-07-29)
- 桌面 `2119:78284`(1440x943.48) / 平板 `2126:76269`(767x1646) /
  手機 `2126:76796`(375x2162) 三個 frame 的容器層級結構，全部截圖交叉
  核對過
- 頁面容器（"content"）：`fill #f6fafd`(Neutral/75) / `stroke #d1d1d1`
  (Neutral/200) / `radius 12` / `padding 20`，三斷點一致，且跟
  `preview/system-basic.html` 既有 class `rounded-xl border
  border-border-disabled bg-surface-hover p-5` 完全對應
- 分館列（新發現，之前沒讀到）：每一列本身是獨立白底卡片
  `fill #ffffff` / `stroke #b0b0b0`(Neutral/300) / `radius 12` /
  `padding 16`，不是單純排版 frame；列間垂直 gap 24px（三斷點一致）
- 頂部工具列兩顆按鈕（多語系狀態/重整）：白底 pill radius28、
  padding 10/16、icon+8gap+文字，靠右對齊；重整按鈕 icon 是
  `icons/restore`（非 refresh）；兩鈕間距桌面讀 20px、平板/手機讀 24px
  不一致（Figma 端本身的量測落差）
- headquarters 那一筆跟分館筆數：截圖 + JSON 交叉核對，**沒有**額外視覺
  標記或拖曳排序 UI，只有「排序」數字與「修改/設定」按鈕文字不同
- 3 斷點卡片排列取得實際像素：桌面 3 卡橫排(348/348/351px, gap12)、
  平板/手機皆改 3 卡直排(695px / 303px 滿版, gap24)；平板卡片內部
  照片+標題維持並排、手機連卡片內部也改直排置中、連結 chip 在手機版
  wrap 成 2 排置中(非既有 nowrap+scroll pattern)
- 補讀先前 5 輪都遺漏的「須知與聲明」卡「已儲存內容」state（node
  `2132:97812`，"006 - 003 完成編輯時畫面"）：內容區顯示橘字「已儲存
  內容」標籤(`Color/Brand/Brand-400` #f28b45) + 唯讀全文 + 置中「編輯」
  按鈕，容器樣式跟空狀態/編輯狀態共用同一個 padding/border/radius

### 本輪處理
1. 用 `AskUserQuestion` 請使用者拍板兩件事：
   - 工具列按鈕間距 20/24px 不一致 -> 統一採用 24px
   - 是否要等資料全齊再寫 spec -> 使用者選「全部補齊再寫」，因此先補
     讀「須知與聲明」有資料 state 才動筆
2. 使用者一開始以為「須知與聲明有資料」state 之前已經讀過，經比對
   Session 116 的 5 個示意 frame 後確認那 5 個都是編輯流程畫面，不是
   本輪要的「未編輯、卡片靜態顯示已儲存內容」畫面；使用者確認 Figma
   裡原本漏畫，即席補畫後再次 `figma-go` 才讀到
3. 更新 `components/lodging-branch-notice-card.md`：新增「006 -
   完成編輯時畫面」狀態記錄、Typography 表補「已儲存內容」標籤 token、
   Token gaps 補 `#f28b45`、未讀取待補項目調整
4. 改寫 `specs/pages/lodging-info.md`：
   - 「使用者確認事項」補 4 條（6-8：headquarters 無區分、須知與聲明
     已儲存狀態摘要、工具列間距拍板）
   - 「佈局」段落從「文字敘述+推測沿用」全面改寫成「已讀取確認的實際
     像素值」：Shell（含 mobile top bar 逐字比對既有 5 個頁面通過）、
     頁面容器、頂部工具列、分館列、3 斷點卡片排列表格
   - 「Figma 未定義」段落大幅縮減，只剩非容器的次要項目（範本示意文字
     內容、多分類部分有資料部分無資料的示意圖未提供，皆不影響開始實作）
   - 檔頭「狀態」改為「規格已齊全，可以開始實作」

### 驗證
- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0
- 截圖驗證：`.scratch/desktop.png` / `tablet.png` / `mobile.png` /
  `notice-filled.png`，核對完畢已刪除（讀取階段核對用，非正式 QA 截圖）
- 尚未跑 `run-swift` smoke test：本輪只完成 spec 定案，
  `preview/lodging-info.html` 尚未產出

### 重要決定（spec 定案階段）
- 分館列容器本身也是白底卡片（bg Neutral/0 + border Neutral/300），跟
  頁面外層容器（bg Neutral/75 + border Neutral/200）是兩層不同的卡片
  樣式疊在一起，實作時不要合併成一層
- 工具列按鈕間距三斷點統一 24px 是使用者明確拍板的值，不是 Figma 原始
  讀值（桌面原始讀值其實是 20px），如果之後有人回頭比對 Figma 發現桌面
  是 20px 不要當成本次實作有誤，這是刻意的統一決策
- 桌面 3 卡橫排時網域安全卡比另外兩卡寬 3px，判斷為 Figma 量測雜訊，
  實作採 3 卡等寬 flex，不重現這個 3px 差異
- 手機版連結 chip 換行置中（wrap+center）跟既有 tab/chip 橫向 scroll
  慣例（nowrap+overflow-x-auto）是兩種不同 pattern，不要混用；本頁連結
  chip 明確是前者

---

## 本 session 後續：開始實作 preview/lodging-info.html（task 1-6/10 完成）

spec 定案後同一個 session 內接續開始實作，依「粒度原則」拆成 10 個
task 逐一做完 + 截圖驗收 + 使用者確認才進下一步。以下是 task 1-7 的
交接記錄（task 8-10 尚未開始：須知與聲明編輯完整流程 / 多語系狀態
modal / 全頁驗證）。

### 已完成 task
1. 頁面骨架：shell partial 組合 + 頁面容器 + 頂部工具列。註冊進
   `scripts/lint-partials.py` MANIFEST、`preview/js/page-tabs.js`
   TAB_PAGES、`preview/partials/aside.html`「民宿資料」改真連結
2. 分館列 1（headquarters，有照片，"修改 4-1"）+ 基本資訊卡
3. 須知與聲明卡（folder-tab 分類頁籤 + 空狀態）
4. 網域安全卡（有效態）
5. 分館列 2（分館名稱一，無照片，"設定"，須知與聲明示範「已儲存內容」
   狀態，網域安全示範失效態）- 兩列合起來涵蓋須知與聲明卡的兩種狀態
6. 照片管理 modal（`state=photo-gallery`）：5 卡 grid、完整拖曳排序/
   上傳/刪除/取消/儲存邏輯（不是純外觀），row1/row2 各自獨立圖片資料
7. 分館資料編輯 modal（`state=branch-basic-info`）：標題依「修改
   4-1」/「設定」動態切換「資料修改」/「資料設定」、全部欄位（代號+
   排序/飯店名稱/英文名稱/Email/市話/傳真/地址(`Location`元件)/企業
   官網/4 張文案卡片空狀態/飯店設施項目 chip 多選可切換選中態）

### 過程中發現並修正的問題（供後續 task 參考，避免重複踩雷）

**1. Figma 漸層 fill 被 JSON 靜默省略**：「修改/設定」pill 按鈕背景其實
是白->Brand-200 垂直漸層，`get_selection` 只回報邊框色。SVG export 覆核
才抓到。CSS 實作在 `preview/assets/css/lodging-info.css`
`.lodging-branch-edit-btn`。

**2. Figma 給的 stroke 可能是停用的裝飾屬性，不代表真的有邊框**：須知
與聲明卡「尚未填寫」placeholder，JSON 回報 `strokes:["#d1d1d1"]`，但 SVG
export 顯示完全沒有邊框 path。截圖比對後拿掉了邊框。

**3. 標題區塊 padding/gap 讀漏**：`get_node` 全樹核對後才發現 Title 區塊
本身有 12px 上下 padding、兩個名稱行之間是 12px（不是 4px）、三大段之間
是 20px（不是 12px）。已更新 `components/lodging-branch-basic-card.md`。

**4. RWD 嚴重跑版 - viewport 斷點 vs 巢狀容器實際寬度**：分館列 3 卡
橫排、照片 modal 的卡片 grid，原本都用 Tailwind viewport 斷點
（`md:`/`min-[640px]:`），但這些元素巢狀在 240px aside 側欄或 modal 的
grid 欄位裡，導致 768-1391px viewport 之間嚴重擠壓跑版。**全面改用
CSS container query**（`container-type: inline-size` + `@container
(min-width: Npx)`，跟既有 `.purchase-addon-frame410` 同一套
convention），斷點門檻依「元素自己實際需要多少 px」重新反推，不能沿用
原本 viewport 斷點的數字。詳細規則、算法、已知陷阱（Tailwind utility
class 跟自訂 class 控制同屬性時的 specificity/source-order 衝突）已寫進
`specs/html-conventions.md`「巢狀多欄佈局必須用 container query」。
**這是本輪最大的教訓，下一個 session 如果要做任何巢狀在 aside 側欄裡的
多欄佈局，一定要先讀這段，不要重蹈覆轍。**

**5. 照片管理 modal header 文字**：使用者訂正為主標題「照片管理」+
副標「demo」（垂直堆疊），推翻了先前「desktop 版 Modal（照片）優先」的
錯誤判斷（已更新 `components/modal.md`）。

**6. 主圖 pill 邏輯 bug（自動化測試抓到）**：原本寫成「永遠顯示在第 1
格」，正確應該是「只有第 1 格同時有圖片時才顯示」。用模擬 drag/drop
事件測過拖曳後 pill 正確跟隨/消失。

**7. 照片卡按鈕列缺 flex-wrap**：`.lodging-photo-actions` 在 container
寬度剛好卡在「還沒到達直排門檻(480px)、但兩顆按鈕橫排也擠不太下」的
邊界（約 1036px viewport 附近）會被壓縮破版。加上 `flex-wrap: wrap`
當安全網，掃過 950-1440 全範圍確認不再破版。

**（誤報，非 bug）按鈕垂直置中一度懷疑失效**：使用者用瀏覽器 devtools
檢視時一度回報「按鈕永遠垂直置中，不對」，後來確認是**使用者自己
devtools 分頁視窗寬度不夠**，不是 code 問題；另外過程中我自己第一次
用 eval 快速量測也一度誤判成沒置中，原因是 Tailwind CDN 動態產生
`h-[185px]` 這類 CSS 規則有非同步延遲，沒等它跑完就量測會拿到錯誤的
84px（而非 185px）高度。**下次若又覺得「置中沒生效」，先確認是不是
量測時機太早（Tailwind CDN 非同步）或觀察視窗太窄，不要急著改 code。**

**8. 分館資料編輯 modal 欄位漏讀 + 版型誤判（task 7，使用者發現）**：
一開始沒重讀 Figma、只憑 spec 文字表格實作，結果：(a) 第 1 列左欄漏了
「排序」欄位，spec 表格只寫「代號」，實際 Figma 是「代號+排序」兩個
mini-field 並排；(b) 誤判成全部欄位「label 在上、input 在下」堆疊，
實際除了 4 張文案卡片外，其餘欄位都是「label 固定寬 64px 在左、
input 在右」。用 `get_node` 重讀整棵樹（node `2129:79343`）才抓到正確
結構，已更新 `components/lodging-branch-info-modal.md`。**教訓：這類
「有明確 spec 文字表格」的欄位，仍然可能是表格本身寫漏/寫錯，不能因為
spec 已經有文字描述就跳過重新核對實際 pixel 結構，尤其是欄位排列方向
這種一眼看不出來的細節。**

**9. 代號+排序固定寬度在手機版溢出（task 7，自己抓到）**：原本用
`w-[101px]` 固定寬度模擬 Figma 桌面量到的 101px，在 375px 手機版會
把整列擠出 modal 邊界被裁切。改用 `flex-1 min-w-0` 彈性寬度後修好，
兩個 mini-field 平分可用空間。**跟 Session 118 稍早的 RWD 教訓同一個
根因類別：桌面像素量到的固定寬度，不能直接當作所有斷點的固定值，
窄螢幕一定要換算成彈性寬度或重新驗證。**

### 驗證
- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0（過程中也順手修正了
  `scripts/lint-conventions.py` 對 `@container (min-width:...)` 誤判成
  「未 gate 的 min-width」的 false positive）
- 截圖：`specs/qa-screenshots/session-118/` 下大量截圖，含 8+ 個寬度
  （320~1440）的 RWD 掃描，以及 task 7 分館資料編輯 modal 的 1440/700/375
  三斷點截圖（`branch-info-modal-*.png` / `branch-info-modal-fixed-*.png`）
- 無 console 錯誤（task 6/7 皆用 headless Chrome eval 檢查過）
- 尚未跑 `scripts/smoke-test.mjs` 的完整頁面清單登記（該 script 的
  APP_CSS_LOADED_CHECK 已補上 `lodging-info.css`，但 lodging-info.html
  本身尚未加進 smoke test 的頁面清單，留給 task 10）

### 下一步應做（下一個 session 從這裡接續，task 1-7 皆已完成）
- **Task 8**（下一步，剩餘 task 裡最複雜的一個）：須知與聲明卡完整
  編輯流程 - SunEditor 工具列外殼（本輪仍不裝真 SunEditor library，
  textarea 佔位即可）+ 分類 tab 切換 + 來源按鈕（從系統範本/從總部範本
  建立）+ 多語系 tabs + 翻譯按鈕 + 跨分類/跨語言本地暫存邏輯。開始前
  務必先讀 `components/lodging-branch-suneditor.md`「實際串接時的架構
  原則」段（2026-07-30 使用者拍板：CDN-only 不客製化 + JS 要拆分成
  共用 instance helper + 各卡片/modal 各自的呼叫端，比照
  `preview/js/order-modals.js` 的 4 模組拆法，不要塞進一個大檔案）
- Task 9：多語系狀態總覽 modal（頂部工具列按鈕開啟）
- Task 10：全頁驗證（4 lint + smoke test 頁面登記 + 多角度截圖 + 更新
  progress.md）

### 重要決定（實作階段新增）
- 「修改/設定」pill 按鈕寬度依內容 hug，不用固定寬度數值（Figma 兩態
  寬度差異純粹是文字長度不同）
- 分館列容器（`.lodging-branch-row`）與各卡片（`.lodging-branch-card`、
  `.lodging-photo-card`）都是獨立的 container query context，兩層各自
  獨立判斷斷點，不要混用同一個門檻數字
- 連結 chip（企業官網/訂房網/自助報到）補了 Figma 未定義的 hover 態
  （使用者指定沿用 `landing.html`「日營收」按鈕的 `attached-link`
  default/hover pattern），非腦補，已記錄在
  `components/lodging-branch-basic-card.md`
- 分館資料編輯 modal 欄位排列：label 固定寬 64px 在左、input 在右
  （文案卡片例外，label 在上），這是全 modal 通用版型，不是個別欄位
  各自的設計，task 8 若有新欄位要沿用同一套版型
- SunEditor 只用 CDN UMD 版、不客製化；多顆獨立 instance 的 JS 要拆成
  共用 helper + 各自呼叫端，比照 `order-modals.js` 4 模組拆法（見
  `components/lodging-branch-suneditor.md`「實際串接時的架構原則」）

### 未解問題
- 無（本輪範圍內的問題都已解決；task 8-10 待下一個 session 接續處理）
- （spec 定案階段遺留，非阻塞）範本示意文字內容、部分分類有資料部分
  無資料的示意圖，皆屬次要項目，已在 spec 內明確標記不影響實作

## Session 117 交接 (2026-07-29)

### 任務: 寫 specs/pages/lodging-info.md 頁面 spec（分館卡片區 3 張卡讀完後
的統整），為銜接新對話做交接準備

使用者要求在結束這輪長對話、開新對話前，先把 `specs/pages/lodging-info.md`
寫出來（趁還有本輪讀取記憶時）。

### 本輪處理
- 新增 `specs/pages/lodging-info.md`：
  - 「Component 規格」表彙整本輪(Session 115/116)產出的所有 component
    檔案指標（basic-card / notice-card / domain-security-card /
    branch-basic-info modal / photo-gallery modal / suneditor /
    multilingual-status modal / folder-tab pattern）
  - 「使用者確認事項」彙整散落各 component 檔的重大決策索引（含出處
    session 編號）
  - 「佈局」段落只寫入**確實有記錄依據**的內容：Session 114 讀取的
    3 個 RWD frame 摘要（頂部工具列 + 分館列 x 3 張卡的結構、3 個斷點
    收合方式的文字敘述）
  - **刻意不捏造**頁面容器層級的精確數值（外層 padding、卡片間 gap、
    頂部工具列精確佈局、3 斷點卡片確切寬度）：這些數值 Session 114
    只留下文字敘述沒有像素紀錄，本輪(Session 115-117)全程都是針對個別
    元件孤立讀取，沒有重新讀過頁面容器本身；逐一列在「Figma 未定義 /
    待補讀取」段，明確標記「不可用其他頁面數值或 component 孤立尺寸
    拼湊」，避免下一個對話的 AI agent 誤把這些當已確認數值
  - Shell 段落標記為「推測沿用」account-permission/system-basic 的
    shell pattern，同樣未實際核對，不當作確認事實

### 驗證
- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0
- 尚未跑 `run-swift` smoke test：本頁還沒有 HTML 實作可測

### 下一步應做
- 開新對話前的交接到此為止；新對話開始時讀 `start.md` + 本檔即可接續
- 下一步應該是針對 `lodging-info.md` 「Figma 未定義」段列出的頁面容器
  層級項目（外層 padding、gap、頂部工具列細節、3 斷點確切寬度）重新
  figma-go 讀取，讀完才能真正開始實作 `preview/lodging-info.html`
- 「須知與聲明」卡「有資料」state 示意圖仍待使用者提供（多輪未完成項）

### 重要決定
- 頁面 spec 允許在元件級細節都齊全、但容器級數值缺漏的狀態下先落筆，
  只要缺漏的部分明確標記「未定義」且說明不可拼湊替代；不必等容器級
  細節也讀完才動筆，避免這輪讀取成果失去銜接文件
- 「Figma 未定義」段落的措辭刻意加了「不可用其他頁面數值或
  component 孤立尺寸拼湊」這類提醒，是因為下一個對話的 agent 沒有
  這輪對話的完整脈絡，容易把「個別元件都量過」誤判成「頁面佈局也量
  過」，需要在 spec 裡明講避免誤用

### 未解問題
- 無（頁面容器級 Figma 讀取待下次 session 進行）

## Session 116 交接 (2026-07-29)

### 任務: 系統設定 -> 民宿資料頁面 figma-go 讀取(續) - 須知與聲明卡 +
基本資訊卡（企業官網/訂房網/自助報到）+ 網域安全卡

延續 Session 115，讀取分館卡片區第 2 張卡「須知與聲明」的完整編輯流程，
補齊 Session 114 標記的未完成項（「須知與聲明」卡「有資料」state）。同一輪
內接著補完第 1 張卡（基本資訊卡）最後未讀的部分，以及第 3 張卡（網域安全
卡）的完整樣式，至此分館卡片區 3 張卡全部讀取完畢。

### Figma 讀取記錄 (current version, read 2026-07-29)
- 5 個示意 frame（`2118:76180` ~ `2119:76924`）：全無資料預設值 / 點編輯
  開始編輯(僅繁中) / 點擊來源按鈕 / 多語系 tabs / 多語系繁中空值切換
- 核心 SunEditor 編輯行為與 `components/lodging-branch-suneditor.md`
  完全相同，差異是多一層「分類 tab」（訂房/成為會員/團體訂房/不退款
  聲明，folder-tab 樣式：選中白底頂部圓角蓋住內容區、未選中灰底位置
  略低）+「來源」功能（從系統範本建立/從總部範本建立兩顆按鈕）
- 用 `save_screenshots` 截圖交叉核對，抓到一處 JSON 陷阱：frame 005
  JSON 裡有文字「已匯入總部範本，可進行編輯。」，但渲染截圖完全沒有
  這段文字，判定是 Figma 端隱藏圖層殘留，不採用；另外 JSON 裡一顆來源
  按鈕的 `fills` key 曾消失，截圖確認視覺上兩顆按鈕點擊前後其實沒有
  差異，屬 MCP 序列化雜訊，不是真實設計差異

### 本輪處理
1. **6 點疑點確認**（使用者已回覆）：
   - 來源按鈕只在繁體中文 tab 顯示，其他語言 tab 顯示翻譯按鈕（互斥，
     依目前 active 語言 tab 切換顯示哪一組按鈕）
   - 點擊來源按鈕直接覆蓋繁中編輯區內容，不跳確認
   - 內容區白底(`#ffffff`) vs 文案卡片家族淡藍底(`#f6fafd`)是刻意設計
     差異，用來區分「整個須知與聲明模組」跟「目前選取分類的內容區域」
   - 分類切換與語言切換的暫存規則相同：兩個維度都不遺失未儲存內容，
     只有「全部儲存」才一次送出 4 分類 x 所有語系，「取消」放棄本次
     編輯 session 全部修改
   - 來源按鈕本輪先做行為佔位，範本內容用前端固定示意資料，不接真實
     範本 API
   - 範本資料模型說明（系統範本/總部範本/本館自訂三層，來源按鈕本質是
     複製不是持續連動）記錄供後端理解，非本輪實作範圍
2. **新增 `components/lodging-branch-notice-card.md`**：完整 Implementation
   contract，SunEditor 核心行為以引用 `lodging-branch-suneditor.md` 方式
   避免重複記錄，只記兩個差異點（分類 tab 外殼 + 來源按鈕）
3. **`specs/html-conventions.md` 新增「Folder-tab 分類頁籤」可復用
   pattern**：登記選中/未選中樣式、跟既有 Pill chip button（全圓角）、
   翻譯按鈕（radius 6 方形）的幾何差異，避免下次重新發明
4. **確認「基本資訊卡」名稱疑義**：使用者原本不確定我說的「基本資訊卡」
   指什麼，釐清後確認是分館卡片區第 1 張卡（總部/分館名稱 + 圓形照片
   觸發器 + 修改/設定 pill，已在 Session 115 讀完寫進
   `components/modal.md` 與 `components/lodging-branch-info-modal.md`），
   唯一還沒讀的是卡片內「企業官網/訂房網/自助報到」三個連結 chip
5. **讀取並確認網域安全卡 + 基本資訊卡剩餘部分**：
   - 網域安全卡（`2119:78165` 有效態 / `2131:97217`~`2131:97222` 失效態）：
     憑證到期日 label+值、有效(綠 `icons/check`)/失效(紅 `icons/failure`，
     本機檔名 `failure-red.svg`) 狀態、查詢網域期限/更新網域期限 2 顆
     按鈕；使用者確認**沒有下一層**，2 顆按鈕各自行為交給後端，前端只需
     正確渲染版位與元件外觀
   - 企業官網/訂房網/自助報到 三個連結 chip（`2119:78436`~`2119:78439`，
     其實資料早在 Session 115 讀圓形照片觸發器時已一併抓到，本輪只是
     確認用途並正式寫進 spec）：使用者確認同樣**沒有下一層**，chip 本質
     是按鈕，實際導轉行為留給後端，前端只需正確渲染
6. **新增 `components/lodging-branch-basic-card.md`**：統整「基本資訊卡」
   3 個部分（照片觸發器/修改-設定按鈕 用指向既有檔案的方式引用，避免
   重複記錄；三個連結 chip 完整寫在本檔）
7. **新增 `components/lodging-branch-domain-security-card.md`**：網域安全
   卡完整 Implementation contract

### 驗證
- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0（conventions 第一輪因新檔用了全形乘號
  `x`(U+00D7) 被擋下，已改用 ASCII `x` 後過）
- 尚未跑 `run-swift` smoke test：本輪只寫 spec，尚未產出 HTML/JS 實作，
  無新頁面/partial 可測
- 截圖驗證用 `save_screenshots` 存到專案內 `.scratch/`（非
  `specs/qa-screenshots/`，屬讀取階段的視覺核對，非正式 QA 截圖），
  分析完畢後已刪除，不留在 working tree

### 下一步應做
- 依 `components/lodging-branch-notice-card.md` spec 實作分類 tab +
  來源按鈕行為佔位（含跨分類/跨語言的本地暫存邏輯）
- 依 `components/lodging-branch-basic-card.md` / 
  `components/lodging-branch-domain-security-card.md` 實作連結 chip 與
  網域安全按鈕（純版位/外觀，無前端行為邏輯）
- 系統範本/總部範本的固定示意文字內容，待使用者提供或開發階段自行
  先寫一段合理 placeholder（不影響規格判讀）
- 分館卡片區 3 張卡在 lodging-info 頁面上的 RWD 斷點行為皆尚未個別
  讀取，待補
- 分館卡片區 3 張卡（基本資訊卡/須知與聲明卡/網域安全卡）內容至此全部
  讀取完畢，`specs/pages/lodging-info.md` 頁面 spec 可以開始統整寫檔
  （仍需頁面層級的 RWD 佈局細節，非本輪範圍）

### 重要決定
- 「須知與聲明」卡是 lodging-info 頁面分館卡片區的第 2 張獨立卡片，
  跟 `state=branch-basic-info` modal 是平行關係，不是巢狀在該 modal 內
- Folder-tab 分類頁籤是繼 Pill chip button / 翻譯按鈕(radius 6) 之後
  第三種 pill 幾何規則，三者不可互換使用
- 讀取階段的視覺核對截圖一律存專案內暫存路徑、核對完就刪，不當作
  正式 QA 截圖保留（正式 QA 截圖才進 `specs/qa-screenshots/session-N/`）
- 「基本資訊卡」是我方沿用的口語代稱（分館卡片區第 1 張卡），不是
  Figma 節點上的正式命名；下次交接或跟使用者對話時若用這類自訂代稱，
  最好附上對應 node id 或既有 spec 檔名避免對方混淆（本輪使用者就
  反問了這個代稱指什麼）
- 網域安全卡、基本資訊卡的連結 chip，兩者都是「有元件外觀、無前端
  互動邏輯」的按鈕，行為完全交給後端；這類「純版位」需求不用比照
  其他複雜 modal 走完整 Interaction 表，用一段簡短說明「行為交給
  後端」即可，避免過度規格化不存在的前端邏輯

### 未解問題
- 無（範本示意文字內容、頁面 RWD 斷點待後續 session 處理；分館卡片區
  3 張卡內容已全部讀完）

## Session 115 交接 (2026-07-29)

### 任務: 系統設定 -> 民宿資料頁面 figma-go 讀取(續) - 照片管理 modal + 圓形照片觸發器 +
分館資料編輯 modal（修改/設定 pill 觸發）

延續 Session 114 進度，讀取「總部名稱」/「分館名稱一」左側圓形照片觸發器
與其開啟的 5 張圖片管理 modal，走完整 Read -> Spec checkpoint -> Write 流程。

### Figma 讀取記錄 (current version, read 2026-07-29)
- `Modal（照片）` (`2125:75472`, 1140x1134): Header + 說明 banner(4 段提示) +
  拖曳排序提示列 + 5 張 Card 2 欄佈局(有圖 card 帶「主圖」pill 只在第 1 張 /
  無圖 card 空框佔位 + 上傳按鈕) + Footer(取消/上傳，按上傳才批次送出並關閉)
- 圓形照片觸發器：從 desktop frame `2119:78284` 用 `scan_text_nodes` 定位
  「總部名稱」文字節點，往上追蹤找到觸發器結構（不是「總部名稱」旁的
  `icons/headquarters` 小圖示，那只是欄位標籤圖示）：
  - 有圖態 `2119:78149`：160x160 圓形照片容器 + 右下角 44x44 overlay badge
    (`icons/image`)
  - 無圖態 `2119:78426`("to be uploaded")：160x160 空心圓框，置中
    `icons/image-empty`
  - 使用者確認：兩態的整個圓形區域(含有圖態右下角小 icon)都是同一個
    click target，開啟同一顆 modal；實際資料由後端決定要渲染哪一態，前端
    固定實作兩態視覺示意
- 照片管理 modal 的另外 2 個 RWD node（同一 session 續讀）：
  - 640~767px：`2125:75209`，640x1722，header title 節點文字「照片管理」
  - <=639px (mobile)：`2131:97352`，375x2215.93，header title 節點文字同樣
    「照片管理」
  - 使用者拍板：兩個斷點名稱統一採用 desktop 版文案「Modal（照片）」，
    tablet/mobile 節點上的「照片管理」視為 Figma 端文案未同步，不採用
  - 三個斷點 card 內部佈局並非單純等比縮放，是結構性差異：
    - >=768px：圖片固定 280px 左欄，與按鈕欄同列並排；按鈕垂直堆疊滿寬
    - 640~767px：圖片仍固定 280px 左欄並排；按鈕改水平並排(120+88px)
    - <=639px：圖片改滿版寬度，移到按鈕列**上方**（不再並排）；按鈕维持
      水平並排
  - 說明 banner：>=640px 橫排 + 垂直分隔線；<=639px 改垂直堆疊 + 短橫線
    分隔

### 本輪處理
1. **3 點範圍確認**（使用者已回覆）：
   - 觸發物 = 圓形照片(含小 icon) / empty-image 整個範圍，兩態共用同一 modal
   - Footer「上傳」按鈕文字色偏淺是正常樣式，非 disabled，pass
   - 「上傳」按下後才批次送出修改並關閉 modal（非即時上傳）
2. **3 點實作範圍拍板**（AskUserQuestion 確認）：
   - 拖曳排序：本輪做**完整可拖曳排序功能**（非僅視覺）
   - 上傳/更換圖片按鈕：接真的 `input[type=file]` + 本地預覽
     (`URL.createObjectURL`)
   - 新 modal variant 命名：`state=photo-gallery`
3. **`components/modal.md` 新增 `state=photo-gallery` 段落**：完整
   Implementation contract(含 Open trigger 兩態結構)、結構圖(改用 ASCII
   縮排清單，非 box-drawing，符合 lint)、固定文字內容、Layout/RWD、
   Interaction（含拖曳排序/上傳/更換/刪除/取消/footer 上傳的完整行為
   規則）、Typography/Colors
4. **Token 對照修正**：初稿誤寫了不存在的 token 名
   (`Color/Brand/Brand-500`、`Color/Status/Negative`、
   `Color/Accent/info-banner`)，回頭用 `grep tokens.md` 逐一核對 hex 後
   改為實際存在的 token：
   - `#2178cf`(更換圖片/上傳圖片 border/text) -> `Color/MenuItem/Default`
   - `#e12129`(刪除 border/text) -> `Color/Surface/Status-Negative`
   - `#d3ebfd`(說明 banner bg) -> `Color/Bootstrap/focus-background`
   - `#86b7fe`(主圖 pill bg) -> `Color/Bootstrap/components/focus`
     (與 `Color/Chart/blue`／`Color/Dots/alternative` 同值，沿用既有
     token，未新增)
   - `#3f930b`(說明 banner icon) -> `Color/Accent/float-circle-mixed-2`
5. **補上 3 個 RWD 斷點的完整 Layout/RWD 規格**（同一輪內先寫單一 desktop
   版 spec，使用者接著補了另外 2 個尺寸，回頭把 `state=photo-gallery` 的
   Layout/RWD 表格從「單一 desktop 值 + 未提供小尺寸 reference」改寫成
   三段斷點表；新增「Figma RWD 來源」表 + 「Card 內部佈局差異」表，記錄
   >=768px / 640~767px / <=639px 三種結構

### Figma 讀取記錄（分館資料編輯 modal，同一輪續讀）
- `Modal（有分資料設定與資料修改 title）` (`2129:79343`, 800x1534)：由
  headquarters/分館卡「修改 4-1」/「設定 4-2」pill 按鈕開啟；使用者確認
  內容完全相同，只有 header 標題依觸發按鈕切換「資料修改」/「資料設定」
- 欄位：代號(唯讀灰底)/飯店名稱、英文名稱/Email、市話/傳真、
  地址(Location 元件)/企業官網、4 張文案卡片(飯店介紹文案/飯店設施文案/
  飯店提醒事項文案/飯店交通文案，各自「尚未填寫」+「編輯」按鈕)、
  飯店設施項目(chip 多選，滿版)
- 中途發現初讀時「飯店設施」卡片跟底部「飯店設施項目」chip 列名稱太像，
  疑似重複；使用者在 Figma 上把 4 張卡片標題改成「XX文案」
  (飯店介紹文案/飯店設施文案/飯店提醒事項文案/飯店交通文案) 後重讀確認：
  兩者是不同欄位，卡片是文字內容欄位、底部 chip 是 tag 式設施多選

### 本輪處理（分館資料編輯 modal）
1. **3 點行為確認**（使用者回覆）：
   - 4 張文案卡片「編輯」按鈕觸發 SunEditor，但**不是 modal**，是在原本
     卡片自己的 container 內 inline 編輯
   - 所有 `placeholder` 字面文字欄位一律照字面渲染 `placeholder` 字串
     （給後端看欄位長相，之後由後端替換真實內容），不當 HTML placeholder
     屬性處理
   - 「設施五六七八九」是佔位文案，照實渲染，不試圖拆解成多顆
2. **2 點實作範圍拍板**（AskUserQuestion 確認）：
   - 獨立新檔 `components/lodging-branch-info-modal.md`（比照
     order-edit-modal.md / arrival-method-modal.md 的複雜度慣例，不塞進
     `components/modal.md` variant 列表）
   - SunEditor 本輪先做行為佔位（editable textarea inline 切換），不接
     真實 SunEditor library；等使用者提供 SunEditor 示意圖後再換真實元件
3. **新增 `components/lodging-branch-info-modal.md`**：完整 Implementation
   contract（欄位表、代號唯讀規則、placeholder 字面渲染規則、文案卡片
   editor 佔位互動、飯店設施項目 chip 多選第三種色彩語意、Typography/
   Colors）；`components/modal.md` Variants 表新增一行指向此檔
4. **Token 對照**：`#f6fafd`->`Color/Neutral/75`、
   `#e1e1e0`->`Color/Neutral/100`/`Color/Border/Default`、
   `#2178cf`->`Color/MenuItem/Default`（用於 chip 選中態，記錄為第三種
   pill 色彩語意，跟既有黃/藍語意不同不可混用）
5. **補上分館資料編輯 modal 的 640~767px RWD 版本**（`2129:80387`，
   767x1534）：結構跟 desktop 800px 版完全一致，純內容寬度等比縮窄
   （2 欄 grid 各欄 378px->361.5px），不是像 `state=photo-gallery` 那種
   結構性改版；使用者確認此斷點對應同一套 >=768/640~767/<=639 劃分。
   `components/lodging-branch-info-modal.md` 新增「Figma RWD 來源」表，
   Layout/RWD 表格改寫成三段斷點（<=639px 當時標記待補）
6. **補上分館資料編輯 modal 的 <=639px (mobile) RWD 版本**（`2129:80629`，
   640x2432，使用者確認畫布寬雖標 640 但就是 <=639px 這一層）：**結構性
   改版**，不是等比縮放，原本 2 欄並排的欄位(代號/排序/飯店名稱/英文
   名稱/Email/市話/傳真/地址/企業官網)全部改成單欄堆疊各自滿版，4 張
   文案卡片與飯店設施項目 chip 列因為本來就是滿版區塊不受影響；整體高度
   因此從 1534px 暴增到 2432px。`components/lodging-branch-info-modal.md`
   「Figma RWD 來源」表補上第三層，Layout/RWD 表格三段斷點填滿，
   「未讀取/待補項目」移除已解決的 RWD 待補項；至此
   `state=branch-basic-info` 三個斷點全部讀取完畢
7. **讀取 4 張文案卡片的 SunEditor 完整流程示意稿**（7 個 frame，
   `2129:79547` ~ `2129:80150`，飯店介紹文案示意，套用到設施/提醒事項/
   交通 3 張卡片）：涵蓋空狀態/單語言編輯/單語言已儲存/多語系 tabs+翻譯
   按鈕/多語系已儲存/多語系無值/繁中空值翻譯按鈕 disabled 共 7 態，含
   SunEditor 完整工具列 icon 清單（16 顆按鈕，本機 icon 全數已存在）。
   讀完後列出 10 點待確認問題，使用者逐一回覆後新增獨立檔
   `components/lodging-branch-suneditor.md`，重點拍板：
   - 翻譯按鈕：繁中 tab 完全隱藏(不顯示 disabled)；其他語言 tab 依繁中
     是否有內容顯示 enabled/disabled；disabled 時 hover tooltip「請先
     填寫繁體中文」
   - 翻譯按鈕點擊本輪只顯示 Toast「翻譯功能尚未串接」+ 內容不變，不可
     把繁中原文複製到目標語言（避免使用者誤以為是翻譯結果並儲存）；
     專案目前無 toast pattern，本輪新增最小可用版本（沿用 tooltip 深底
     token）
   - 語言 tab 清單由後端多語系設定驅動，不是這張卡片自己管理；tabs
     顯示與否跟各語系是否有內容是兩組獨立資料
   - SunEditor 本輪不安裝不串接，但完整研究套件版本/引入方式/plugins/
     輸入輸出格式並記錄，減少後續真正串接時的返工（研究內容明確標記
     為外部套件資訊，非 Figma 來源）
   - Format 下拉、文字/反白色色票、清單/縮排/對齊等全部照 SunEditor
     官方預設，不客製；色票只有明顯破版才回頭討論獨立 token
   - 連結按鈕本輪不做；正式串接時沿用 SunEditor 原生浮動面板
   - 原始碼檢視按鈕本輪不接，正式版接原生 code view，但後端儲存前必須
     過濾危險標籤/事件屬性/不安全網址，前端檢查不可作為唯一防線
   - 儲存後顯示框必須渲染 HTML 格式（不能永遠顯示純文字）
   - 使用者主動補充「全部儲存」語意：切換語言 tab 時各語系未儲存內容
     保留在前端本地暫存，按「全部儲存」才一次送出所有語系，按「取消」
     放棄本次所有語系修改
   - `components/lodging-branch-info-modal.md` 「文案卡片」段改寫成
     只保留外殼結構，完整規格指向新檔

### 驗證
- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0（conventions 第一輪因新檔用了全形破折號
  `-`(U+2014) 被擋下，已改用 ASCII `,` 或拆句後過）
- 尚未跑 `run-swift` smoke test：本輪只寫 spec，尚未產出 HTML/JS 實作，
  無新頁面/partial 可測

### 下一步應做
- 依 `components/modal.md` `state=photo-gallery` spec 實作
  `modalPhotoGallery`（含拖曳排序、file input 本地預覽邏輯）
- 依 `components/lodging-branch-info-modal.md` spec 實作
  `modalBranchBasicInfo`（含 textarea 佔位互動、chip 多選）
- 圓形照片觸發器與「修改/設定」pill 觸發器目前只記錄在各自 modal 檔的
  「Open trigger」/「觸發來源」小節；完整頁面 spec
  `specs/pages/lodging-info.md` 仍待卡片 2/3(須知與聲明「有資料」state)
  補齊後才一次寫檔，觸發器結構屆時直接引用本輪記錄
- 依 `components/lodging-branch-suneditor.md` spec 實作 4 張文案卡片的
  textarea 佔位版本（含語言 tab 切換、翻譯按鈕 disabled/Toast、全部
  儲存/取消跨語言暫存邏輯）
- 正式串接真實 SunEditor 的時機：待該檔「SunEditor 套件研究」段列出的
  版本號/CDN URL 實際查證後才進行，目前只是研究記錄不是安裝
- 等使用者補「須知與聲明」卡「有資料」state 的圖（同 Session 114 未完成
  項，尚未提供）

### 重要決定
- `state=photo-gallery` modal 由 headquarters 卡與各分館卡共用，不因
  「有圖/無圖」觸發態不同而拆成兩顆 modal
- 拖曳排序與檔案上傳本地預覽本輪明確拍板要做完整功能，不是視覺佔位
- Token 命名務必先 grep tokens.md 核對 hex 是否已有對應項，不可憑印象
  現編 token 路徑名稱（本輪初稿犯了這個錯，已修正，記錄避免下次重演）
- 分館資料編輯 modal 的「編輯」按鈕觸發 inline SunEditor，不是巢狀 modal；
  `start.md` 的「巢狀 modal 規則」不適用於這個按鈕
- `placeholder` 字面文字欄位刻意保留原樣渲染（給後端看欄位），不要自作主
  張改成空值或改成看起來更「正常」的示例文字
- SunEditor 相關的 Format/色票/清單/縮排/對齊等全部照官方預設不客製，
  是使用者明確拍板「不用花時間在這」，之後不要主動提議客製化這些細節
- 翻譯按鈕點擊不可把繁中原文複製到目標語言當作假翻譯結果，這是使用者
  特別強調的風險點（使用者可能誤存假翻譯），只能顯示 Toast 提示未串接
- 富文本原始碼檢視功能前端檢查不是唯一防線，後端儲存前必須再過濾危險
  標籤/事件屬性/不安全網址，兩層防護缺一不可

### 未解問題
- 無（模組化實作與頁面 spec 整合待後續 session 進行；SunEditor 真實元件
  與 <768px RWD 版本待使用者後續提供）

## Session 114 交接 (2026-07-29)

### 任務: 系統設定 -> 民宿資料頁面 figma-go 讀取(進行中)+ 多語系狀態 modal
spec 定案 + modal max-width 規則修正 + Figma Variables 同步

### Figma 讀取記錄 (current version, read 2026-07-29)
- 「民宿資料」頁 3 個 RWD frame 已讀:desktop `2119:78284`(1440x943.48)、
  mobile~tablet `2126:76269`(767x1646)、mobile `2126:76796`(375x2162)。
  結構一致:頂部工具列(多語系狀態 + 重整)+ 2 個分館列 x 3 張卡(基本資訊
  卡 / 須知與聲明卡 / 網域安全卡)。三個尺寸的收合方式不同:1440 三欄橫
  排;767 收成單欄但卡片內部(照片+標題)仍並排;375 連卡片內部也上下堆疊
- 「多語系狀態」modal 已讀(`2129:81569`,948x552),讀取記錄與 spec 見下方
- 讀 icon 庫時抓到一個先前(Session 113)漏掉的 icon:`icons/image-empty`
  (id `2100:97539`,Figma 裡是 INSTANCE 不是 COMPONENT,上次比對 script
  只抓 COMPONENT 所以漏掉),已補匯出 + 登記進 `icons.md`

### 本輪處理
1. **民宿資料頁面疑點確認**(3 點,使用者已回覆,尚未寫入頁面 spec,因為
   卡片 2/3「有資料」state 與編輯 modal 使用者稍後才補圖):
   - 分館名稱重複「分館名稱一」= 佔位文字示意,將來後端渲染,正常
   - 分館基本資訊卡橘框 pill 文字「修改」vs「設定」不是示意不一致,是
     刻意設計:對應不同 modal(不同 title);使用者已填過資料 -> 「修改」
     (搭配已上傳照片);使用者從未填過資料、首次使用 -> 「設定」(搭配
     `icons/image-empty` 尚未上傳狀態);兩者是同一個「有無填過資料」
     state 同時驅動照片顯示方式與按鈕文字,不是兩條獨立規則
   - 「須知與聲明」卡「有資料」state 稍後補圖,是一系列操作,會用
     SunEditor(呼應 Session 113 同步的 SunEditor icon set);「編輯」
     按鈕開的 modal 也稍後批次補上
2. **`components/modal.md` 共用 Desktop Max-width 規則修正**:2026-07-28
   寫的規則原意是「新 modal 沒有 Figma reference 時預設 1140px」,但
   使用者這輪明確拍板:**1140px 是上限(cap),不是每顆新 modal 的固定
   值**。新 modal 一律先用自己 Figma 實測的內容寬度,只有超過 1140 才
   收斂封頂。規則段落已改寫,不留舊的「預設 1140」措辭
3. **新增 `state=multilingual-status`(多語系狀態) modal spec**:
   Variants 表新增一列 + 完整 Implementation contract / Layout RWD 段落
   - modal size 948px(不封頂,因為 948 < 1140)
   - 4 個並排面板(資料設定/須知與聲明/房間資料/專案設定),面板 1/2 單
     狀態欄、面板 3/4 雙狀態欄(名稱+介紹)雙欄不對稱經使用者確認是刻意
     設計(房型/專案本身有兩種可翻譯欄位)
   - 小尺寸橫向 scroll(`overflow-x-auto`)經使用者確認,因為內容是
     table 形式,比照既有長 table 慣例不改堆疊
   - 定位為共用 modal(不是頁面專屬),因為未來其他多語系頁面可能複用
4. **Figma Variables 同步**:使用者貼了完整 Variables JSON,程式化 diff
   出跟舊版 `specs/assets/figma-variables.json` 的差異,真正新增只有 3
   個(diff 過程一度誤判出一堆假的 Spacing/Radius 新增,是 script bug
   不是真的變動,已修正 script 邏輯重跑確認):
   - `Color/Table/Column1` = `#DDE9FB`、`Color/Table/Column2` = `#EFF4FC`
     (剛好解掉上一步驟 multilingual-status modal 的 token gap)
   - `Color/Accent/linear-small-badge` = `#D7FFFB`(目前未使用,先收錄)
   - 已更新 `specs/assets/figma-variables.json`(完整覆蓋)、`tokens.md`
     (新增 Table 段落 + Accent 補一行)、`base.css`(對應 CSS 變數)、
     `components/modal.md` 的 token gap 段落(改成已解決,引用真實 token)

### 驗證
- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh`
  (89 raw hex tokens 一致)/ `lint-partials.sh` 全 exit 0
- `node .claude/skills/run-swift/driver.mjs smoke` 5 頁全 PASS

### 下一步應做
- 等使用者補「須知與聲明」卡「有資料」state 的圖(會用 SunEditor)+
  分館基本資訊卡「修改/設定」pill 對應的編輯 modal 畫面
- 民宿資料頁面本身的 `specs/pages/lodging-info.md` 尚未寫檔(目前只在
  `components/modal.md` 寫了共用的多語系 modal;頁面 spec 要等卡片
  2/3 細節補齊、確認完整頁面範圍後才一次寫,避免中途多次改版造成規格
  污染)

### 重要決定
- modal max-width 的「1140px」定位是上限,不是預設固定值;新 modal 一
  律先用自己 Figma 實測寬度,超過才封頂
- 「多語系狀態」modal 是共用元件,登記在 `components/modal.md`,不是
  民宿資料頁面專屬 spec

### 未解問題
- 無(卡片 2/3 細節與編輯 modal 待使用者後續提供,不算未解問題,是待補
  輸入)

## Session 113 交接 (2026-07-29)

### 任務: figma-go 同步 icons variants(系統設定 -> 民宿資料頁面開工前置作業)

### Figma 讀取記錄 (current version, read 2026-07-29)
- FRAME `25:93`「Icons」402x805,components page 既有 icon 庫,共 137 個
  component/instance
- 跟現有 `specs/icons.md` + `preview/assets/icons/`(122 檔)交叉比對後,
  找出 40 個 Figma 有、本地沒有的新 icon variants

### 本輪處理
- 匯出 40 個新 icon SVG 到 `preview/assets/icons/`(`save_screenshots`
  SVG format,逐一核對 node id 後批次匯出,並用截圖網格肉眼驗證 40 顆都
  正常渲染、無破圖空圖)
- `specs/icons.md` 更新:
  - 主表新增 21 個一般 icon(archive, checkmark-filled-error, dash-16,
    decision-solid, dots-line, empty-image, headquarters,
    health-worker-form-outline, image-ai-line, info-circle-off,
    message-share, new-brand, office, print, process, security,
    single-symbol-warning, star, translation, upload, upload-outline)
  - 新增「SunEditor / ckeditor Icon Set」段落,收錄 17 個 SunEditor +
    2 個 ckeditor 命名空間 icon(`suneditor-*` / `ckeditor-*` 前綴);
    目前專案未整合任何富文本編輯器,純粹存檔,不預設用途
  - 色彩語意表補 `checkmark-filled-error`(`#FFB6B6`,對應既有 token
    `Color/Accent/float-circle-filled-2`)、`single-symbol-warning`
    (`#EF6F25`+`#FDEBD7`,對應既有 `Brand-500`/`Brand-100`)
  - 非標準尺寸表補 `info-circle-off`(26x26)、`star`/
    `suneditor-rotate-to-left/right`(20x20)、`suneditor-s-slash`(24x27)
  - 頁尾統計數字更新為現況

### 驗證
- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0(conventions 第一輪因新增行用了 `x` 全形
  乘號與色彩 emoji 被擋下,已改用 ASCII `x` 與文字描述修正後過)
- `node .claude/skills/run-swift/driver.mjs smoke` 5 頁全 PASS

### 重要決定
- 40 個新 icon 全數先同步進 spec + 匯出 SVG,即使目前用不到也記錄起來
  (使用者拍板「看之前怎麼做就怎麼做,不一定用到的也沒關係」)
- SunEditor/ckeditor 這批不預先假設用途,哪個元件會用、用哪一顆,等實際
  需要時再確認

### 未解問題
- 既有 `icons/language`(`language.svg`)這次在 Figma 找不到同名節點,但
  多了一個新的 `icons/translation`,視覺語意接近,懷疑是 Figma 端改名;
  已當作獨立新 icon 收錄,未動 `language.svg` 或改寫舊條目,是否要汰換
  待使用者確認

## Session 112 交接 (2026-07-28)

### 任務: figma-go 讀 account-permission mobile~tablet frame,調整 <768 外層
padding 架構 + 移除分館子列(資料/介紹/語系 chip/未設定多語系)

### Figma 讀取記錄 (current version, read 2026-07-28)
- FRAME `2126:77592`「cp- 帳號及權限 mobile ~ tablet default 0716」
  375x1555,root 下 2 個直接子節點:
  1. `2126:77593` Frame 427319026(375x36,mobile top bar,logo + 選單鈕,
     padding top12/left12/right12/bottom0),對應現有 code 53-64 行的
     mobile top bar,非 Figma 畫布裝飾(先前讀取時誤判為視窗外框,已用
     code 交叉確認排除此疑點)
  2. `2126:77864` Frame 427318911(375x1507):內含 Accordion 9(收合態,
     icons/up = 收合示意,空 flexible content,示意用)+「content」
     frame(2126:77863,內含 Accordion 8 展開態,帳號卡片本體)
- 文字內容(「琳龍滿目滿目滿目」「BBBBBAAAA」等)確認為佔位假字,真實
  資料由後端渲染
- `icons/eye-open` 確認比照既有慣例(單態示意, 直接實作 open/close 互換,
  見 [[feedback_eye_icon_implies_toggle]])

### 本輪處理
1. **`<768` 外層 padding 架構調整**(只 account-permission 這頁,`md:`
   以上不動):
   - `#rootWrap`(`preview/account-permission.html`)`p-3` 改
     `md:p-3`,<768 時整層 padding 歸零
   - mobile top bar 那一行自帶 `px-3 pt-3`(對應 Figma 量到的
     top12/left12/right12/bottom0)
   - 淺藍色 accordion 卡片、aside、其餘內容不用額外補 padding(aside
     是獨立元件自帶 `p-3`+border,mobile 收成 drawer 不受影響)
2. **分館子列(資料/介紹/語系 chip EN/EU/简/未設定多語系)全數移除**
   (原本先討論成「只 mobile~tablet 移除,桌面保留」,使用者後續更正為
   **不分斷點,全部移除**):
   - `preview/account-permission.html`:直接刪除 5 個分館項目(麥當勞/
     Mos/漢堡王/星巴克/人力銀行)底下的子列 markup,不是加
     `hidden`/`md:` class 隱藏
   - `components/account-accordion.md` 79-99 行依 start.md 移除記錄
     格式改寫成 tombstone(分館列只剩「編號 名稱」一行,舊內容註明查
     git history);展開/收起 bar 不受影響維持原樣
   - `specs/pages/account-permission.md` 確認事項 7 + RWD 段落同步

### 驗證
- 截圖比對 375px(mobile)與 1024px(桌面 `md:` 以上): 兩個寬度分館列
  都只剩「99 麥當勞」「29 Mos」單行,無資料/介紹/語系 chip;mobile
  外層貼齊螢幕邊緣、top bar 保留 12px 左右上 padding；桌面版外層
  12px padding 與改動前一致
- `./scripts/lint-conventions.sh` / `lint-fonts.sh` / `lint-tokens.sh` /
  `lint-partials.sh` 全 exit 0
- `node .claude/skills/run-swift/driver.mjs smoke` 5 頁全 PASS

### 重要決定
- account-permission 的 `#rootWrap` 外層 padding <768 歸零、改由各
  區塊自行撐開,是**本頁專屬**調整,不是新的全站頁殼慣例;
  room-booking / order-processing / system-basic 的 `rootWrap p-3`
  維持不動
- 分館子列(資料/介紹/語系 chip/未設定多語系)是**整組移除**,不是
  RWD 斷點差異顯示;舊規格細節只留在 git history,不留在 spec 內文

### 未解問題
- 無

## Session 111 交接 (2026-07-28)

### 任務: 新 modal desktop max-width 規則拍板；加購項目 modal 1194px 定調為特規

### 本輪處理
- 使用者拍板：**新增**大型內容 modal（Figma 沒有自己 reference width 時）
  desktop max-width 統一採用 1140px；既有 modal（member-data 1140、order
  summary 1019、sms 648 等）維持原 Figma 尺寸不受影響。
- 加購項目（purchase add-on）modal 曾嘗試收斂至 1140px（過程見下方「本輪
  嘗試過程」），最終使用者拍板：**維持原 Figma reference 1194px，列為特規
  例外，不套用 1140px 統一值**。相關實作（`preview/assets/css/modals.css`）
  已還原為 1194px / 分類欄 240px / 購物車欄 327px，與 Figma reference 一致，
  沒有殘留任何本輪測試用的中間值。
- `components/modal.md`「共用 Desktop Max-width」段落記錄此規則，並明講
  1194px 例外是「試過收斂可行但使用者選擇維持特規」，不是「做不到」。

### 本輪嘗試過程（僅供參考，不是現行狀態）
- 依序測試：1140px 不動欄寬（中間 3 欄 grid 跑版）-> 1140px + 分類欄縮到
  200px（grid 恢復，但分類欄文字/count pill 太擠）-> 1140px + 分類欄 230px
  + 購物車欄 304px（互相挪讓，grid 與兩側欄位都不擠）。
- 最後一版驗證通過（lint 全 exit 0、smoke 5 頁 PASS、375px mobile 不受
  影響），證明「加購項目 modal 技術上可以收斂到 1140px」，但使用者最終
  判斷這顆 modal 內容本來就比其他 modal 寬，不需要為了套用統一值犧牲欄寬，
  拍板維持 1194px 特規。

### 驗證
- CSS 三個值（max-width / 分類欄 / 購物車欄）確認已還原為 1194px / 240px /
  327px，與變更前一致
- `components/modal.md` 已無殘留 1140px / 230px / 304px 之類的已推翻數值

### 下一步應做
- 無待辦；本項已定案

### 重要決定
- 新 modal desktop max-width 預設 1140px，已有 Figma reference 的既有
  modal 不受影響，只有明確拍板要收斂的才動
- 加購項目 modal 1194px 正式列為特規例外，不受共用 1140px 規則約束

### 未解問題
- 無

## Session 110 交接 (2026-07-16)

### 任務: Session 109 帳號及權限頁與 eye-toggle 修正交接 commit/push

### 本輪處理
- 依 commit/push flow 複核目前工作樹, 主要內容為 Session 109 的
  `account-permission` 新頁、account accordion spec、aside/topbar tab
  登記、partials manifest 與 smoke test checks。
- 本輪未新增產品規格或開發規則; `specs/assets/tokens.md` 與 `start.md`
  無需同步修改。
- 本輪進入 commit/push flow, 實際 SHA 與遠端狀態以 git history 為準。

### 驗證
- `git diff --check` 無 whitespace 錯誤。
- 新檔逐一跑 `git diff --no-index --check /dev/null <file>` 無 whitespace
  錯誤輸出。
- `./scripts/lint-fonts.sh`, `./scripts/lint-conventions.sh`,
  `./scripts/lint-partials.sh`, `./scripts/lint-tokens.sh` 全 exit 0。
- `node scripts/smoke-test.mjs` exit 0: landing / order-processing /
  system-basic / account-permission / room-booking 5 頁 PASS。

### 未解問題
- 無。

## Session 109 交接 (2026-07-16)

### 任務: 新頁「帳號及權限」(account-permission) figma-go 讀取 + spec + 實作

### Figma 讀取記錄 (current version, read 2026-07-16)
- Desktop 頁面 frame `2087:94594`「cp- 帳號及權限 desktop default 0716」
  1440x2799: 內含 accordion 關閉態 (2087:95021) + 展開 1 修改
  (2087:95137) + 展開 2 紀錄 (2087:95298) + 展開 3 刪除 (2087:95391)
- Tablet 767 寬三展開態: 2087:96149 / 2087:96510 / 2087:96603
- Mobile 340 寬單欄: 2078:91740
- 稿上多狀態並列 = 展示; 實頁只 render 一個 accordion

### 使用者拍板 (實作依據, 詳見兩份 spec)
- chevron 關=up/開=down (全站慣例, 已 verify 三處既有實作一致)
- 高權限/總部/分館 badge 全 render, 後端控顯示
- 分館 bar: >=3 間才顯示「另外 n 間 +」/「收起 -」, 點擊展開/收摺;
  1-2 間無 bar
- 紀錄 table 與模式按鈕列窄版 = 原生橫向 scroll
- 展開預設模式 = 修改; 頁面初始 = 關閉
- 刪除確定紅 = `#E12129` Status-Negative (從 JSON verify, 非 pixel 誤差)
- #86B7FE 的 token 是 `Color/Bootstrap/components/focus`
  (`--color-bootstrap-components-focus`), 不是 focus-background #D3EBFD

### 本輪改動
- 新 spec: `components/account-accordion.md`,
  `specs/pages/account-permission.md`
- 新實作: `preview/account-permission.html`,
  `preview/js/account-permission.js`
- 登記: `scripts/lint-partials.py` MANIFEST, `js/page-tabs.js`
  TAB_PAGES, aside「帳號及權限」改真實連結,
  `scripts/smoke-test.mjs` 新增本頁 10 checks (accordion 開關/模式
  切換/分館展開/eye toggle 皆實測)

### 驗證
- lint-fonts / lint-conventions / lint-partials / lint-tokens 全 exit 0
- smoke test 5 頁全 PASS
- QA 截圖 `specs/qa-screenshots/session-109/` (closed/edit/records+
  branches/delete @1440, edit @375/640/768, closed @360), 狀態 =
  self-tested, 待使用者驗收

### RWD 補充拍板 (2026-07-16, 原未解問題已結案)
- **768-1023 兩欄擠壓**: Figma 只給 767 (無 aside) 與 1440 稿,
  768-1023 desktop shell aside 佔 240px 造成兩欄擠爆。使用者拍板採
  「欄數以內容可用寬度為準」: <640 單欄 / 640-767 兩欄 / 768-1023
  回單欄 / >=1024 兩欄 (`flex-col sm:flex-row md:flex-col
  lg:flex-row`)。已改實作 + 兩份 spec, smoke 5 頁重跑 PASS,
  補拍 edit-768 (單欄) 與 edit-1024 (兩欄) 截圖


### 任務: 會員安全管理 modal 密碼 eye-toggle icon 切換

使用者詢問 eye-open/eye-close 沒有互換是漏要求還是沒示意。查證結論:
**Figma 原稿只畫 eye-open**（components/modal.md 2026-04-13 讀取記錄
即註明「Figma 未定義 eye-closed icon」）, 當時實作只切 input
password/text, icon 不動。本輪使用者拍板補行為。

### 本輪改動

- `js/topbar-modals.js` eye-toggle handler: icon 隨狀態切換。初版做成
  「icon = 下一步動作」, 使用者預覽後訂正為「**icon = 當前狀態**」:
  eye-open = 資料顯示中, eye-close = 資料隱藏中（預設）; markup 預設
  icon 同步改為 eye-close, alt 同步
- `components/modal.md` 密碼 toggle 條目改寫為拍板後行為規格
- 影響範圍: 全站僅會員安全管理 modal 的 3 顆 eye-toggle（grep 確認
  無其他使用處）, 單一 handler, 三頁共用
- 新慣例（使用者 2026-07-16 明示）: 密碼欄 Figma 只會示意 eye-open 或
  eye-close 其中一態, 完整 toggle 互動永遠是預期行為, 之後直接實作
  不列疑點; 已登記 specs/html-conventions.md「密碼欄 eye toggle」段

### 驗證（self-tested, pending review）

- 3 個欄位機器實測（訂正後映射）: 預設 type=password + eye-close;
  點擊 -> type=text + eye-open; 再點 -> 回 password + eye-close, 全過
- lint-fonts / conventions / partials 全 exit 0
- 截圖: specs/qa-screenshots/session-108/
  member-security-eye-state-mapping-1280.png（第一欄顯示中 = eye-open,
  其餘隱藏中 = eye-close）
- 注意: partial 是 fetch 載入, 驗證時瀏覽器快取會吃到舊 markup,
  需 hard reload（本輪實測時遇到, 非程式問題）

### 未解問題

- 無

---

## Session 107 交接 (2026-07-14)

### 任務: 系統基本頁 0714 改版（figma-go 重讀三稿 -> 對齊 -> 實作）

Figma 重讀三個 section: desktop `2061:72550`（更新版）、768 稿
`2061:72551`（更新版）、**375 稿 `2061:72552`（新增, 補上先前未定義的
375 單欄參考）**。與使用者對齊後實作。

### 本輪改動

- 卡 1 改名「網路訂房」->「白名單設定」,「僅下列 IP 允許登入系統」
  移到標題下第二行（左對齊, 間距 8）
- 卡 2 改名「網路訂房」->「網路訂房設定」（內容不變）
- 新增「簡訊設定」卡（上排第 3 卡）: 總部簡訊功能=check-green 啟用、
  分館簡訊功能=failure-red 未啟用、總部剩餘通數=8 通
- 上排 grid 改 `sm:grid-cols-2 md:grid-cols-3`（獨立於下排）; 下排
  維持兩欄, 上下排間距 32
- 白名單卡 footer 按鈕加 `ml-auto`（窄版換行時維持右對齊, 375 稿畫法）
- spec 更新: 卡片重新編號 1-8、三斷點佈局、確認事項 11-12

### 重要決定（使用者對齊說明, 寫給接手者）

- **簡訊設定卡三稿值差異是「狀態展示」不是不一致**: 分館簡訊功能有
  啟用/未啟用兩態（後端渲染）; 通數列 label 隨組合連動 - 總部+分館
  **皆啟用** ->「**共用**剩餘通數」（375 稿 2061:72552 即此狀態參考
  畫面）, 分館未啟用 ->「**總部**剩餘通數」（desktop/768 稿狀態）。
  demo 一律套 desktop 狀態、不做切換互動; 其他組合（如總部未啟用）
  Figma 未畫, 標未定義。詳見 specs/pages/system-basic.md 簡訊設定卡節
- 上排高度行為: >=768 三卡等高（簡訊卡拉伸）; <768 簡訊卡自然高度
- 佈局斷點不變: <640 單欄 / 640-767 兩欄 wrap / >=768 desktop（三欄）

### 驗證（self-tested, pending review）

- lint-fonts / conventions / partials 全 exit 0; smoke test 4 頁 PASS
- Chrome 實測: 1440 三卡並排等高; 767 簡訊卡第二列左欄自然高、右欄留空;
  375 emulated 單欄無溢出（scrollWidth=clientWidth）、footer 按鈕換行
  右對齊（機器驗證 btnRightAligned=true）
- 截圖: specs/qa-screenshots/session-107/system-basic-v2-{1440,767,640,375}.png

### 未解問題

- 無; 使用者驗收後指示 commit & push

---

## Session 106 交接 (2026-07-14)

### 任務: ai-chat council 交叉驗證 Session 104-105 是否落實

使用者觸發 `ai-chat 互相驗證 session 104 ~ 105 是不是有落實完成`。
建立 `specs/agent-council/session-104-105-verification/brief.md`
（列 104 宣稱 5 項 + 105 宣稱 9 項為驗證對象），跑完整 council 5 輪
（round-1/2 x codex/claude + consensus）。

### Council 結論 + 本輪獨立核實

- consensus 判定: Session 104 全 5 項落實; Session 105 除宣稱 3 外落實,
  並列 3 個待確認發現（F1/F2/F3）, 要求補 runtime 驗證後才可 close
- 本輪對 3 個發現逐一獨立核實, **全部為誤報**:
  - F1「room-booking.js:211-215 殘留 AI float dead wiring」: 該檔不存在
    （實為 room-booking-behaviors.js）, 該行號是庫存加總 code; 全庫 grep
    floatIcons/icons\/ai/float-service 僅剩 partial 內的移除決策註解
  - F2「app.css 重複 import order-processing.css」: 實檔 6 個 import
    各一次, 無重複
  - F3「lint-partials.py 檔尾不完整」: 檔尾完整, 實際執行 exit 0
  - 誤報來源: council round-1 的檔案讀取 artifact（agent 幻覺行號/檔名）,
    屬 council tooling 異常, 記於此供未來 council 參考
- Runtime 驗證（consensus 行動計畫 2/3/5）: 4 lint 全 exit 0、smoke test
  4 頁 PASS、動態抽測 stepper 上半+1/下半-1、關非當前 tab 原地移除、
  關最後一個 tab 回 landing, 全過

### 最終判定

Session 104 宣稱 1-5、Session 105 宣稱 1-9: **全部落實**（verified）。
無需修正任務。

### 使用者裁決兩項（2026-07-14, 已落地）

1. **移除記錄格式 = B（每次重寫內文）**: 元件移除/縮減時 spec 內文必須
   重寫成現況, 不可只加檔頭註記留過期內文; 歷史交給 git history。
   - 規則寫入 start.md 檔案地圖 components 段
   - 回溯 audit + 重寫 5 檔: float-icons-ai.md（tombstone）、
     customers-service.md（現行=僅 Email）、account.md（現行=僅登出）、
     menu.md（4 variants, POS/switch 段移除）、bulletin-vendor.md
     （tombstone - audit 抓到的漏網: 功能早在 99-103 移除但 spec 無標記）
   - function-icons.md 已符合（內文即現況）; bulletin-administer.md 為
     保留功能不需動
   - 機器可判定性: 無法 lint（需語意判斷）, 靠規則 + review
2. **agent-council.md 加「引用必須可重現」規則**: round 產出中 repo
   現況級指控必須附可重現證據（指令+輸出）, 無證據引用由 synthesizer
   降級為 unverified, 不可進 Decision Candidates; 已寫入「角色與流程」
   段, 附本次 3 個幻覺發現的教訓

### 未解問題

- 無

---

## Session 105 交接 (2026-07-13)

### 任務: 系統基本 新頁實作 + 全域調整（figma-go 三階段流程）

Figma 來源: SECTION 2061:72550（desktop 1440）+ 2061:72551
（mobile ~ tablet 768, 代表 767 以下）。實作前使用者拍板事項全記錄在
`specs/pages/system-basic.md`「使用者確認事項」段（10 條）。

### 本輪改動

- 新增 `specs/pages/system-basic.md`（頁面規格 + 確認事項）
- 新增 `preview/system-basic.html`：6 卡片 + footer；shell 沿用共用
  partial；modal 開關用 `createModalController()`（不需 order-modals 的
  訂單接線）；欄數 <640 單欄 / 640-767 兩欄 / >=768 desktop
- 新增 `preview/assets/css/system-basic.css`（.sb-* scoped：版型示意色、
  stepper spinner 隱藏）；`app.css` 補 import
- base.css + tokens.md 新增 `--color-template-*` 5 個版型示意專用 token
  （demo 專用, 不與產品 UI token 混用）
- 全域移除（共用 partial, 四頁生效）:
  - 快速切換帳號: aside switch icon、topbar compactSwitchBtn、
    session-modals 帳號切換 modal、page-shell.js 接線（binding audit 4 處
    全列, 無遺漏; 確定登出保留）
  - aside 客服區僅留 Email（LINE QR/電話/傳真/北西東/營業時間移除）
  - AI bot float 按鈕: room-booking-modals partial 區塊 + shell.css
    `.float-service-frame`（無 JS binding; ai.svg 與 tokens 保留未用）
  - 「客戶公告系統」（bulletin/target icon 組）Session 99-103 已移除,
    本輪無改動; icons/message 的系統公告保留（使用者確認）
- 決策記錄: components/float-icons-ai.md / customers-service.md /
  account.md 檔頭標記; page-architecture.md 導航段 + 目標結構更新
- aside「系統設定 > 系統基本」接真實連結; page-tabs.js TAB_PAGES 登記
- lint-partials.py MANIFEST 登記 system-basic.html
- smoke-test.mjs: app.css expected 清單 +system-basic.css; 移除
  switch-account modal 檢查（功能退役）; 新增 system-basic 頁（8 checks）
- lint-conventions.py 修正: base.css 自訂屬性定義行豁免 hex/rgba 檢查
  （與檔頭聲明意圖一致; --color-switch-off-track rgba 前例早於 lint）
- 追加（使用者訂正: 點 stepper icon 數字要會動）: up-and-down icon 改為
  可點按鈕, 上半 +1 / 下半 -1, stepUp/stepDown clamp 1~24, disabled 時
  不動作; 實測 up/down/clamp/disabled 四情境全過（79b6ab2 之後的追加,
  實際 SHA 以 git history 為準）
- 新規則（使用者定調「只有裝飾沒功能 = 大 bug」）: 藏原生控件必接替代
  行為, 已登記 html-conventions.md「藏原生控件必接替代行為」段; 回溯
  audit 全庫 appearance:none 僅另有兩處且都是 select（功能未斷）, 無
  其他違規; 規則無法 grep 判定, 靠 review + 實測 checklist
- 追加（使用者驗收時新增需求）: aside POS 入口整組移除 - markup +
  shell.css `.pos-entrance-*` / `.icon-mask-pos` / `.icon-mask-attached-link`
  （無 JS binding; pos.svg 與 linear-pos tokens 保留未用）; 決策記錄在
  components/menu.md 檔頭, POS variants 標為歷史規格
- 追加（使用者驗收時新增需求）: 當日網路訂房 toggle 連動 - off 時終止
  時間 input disabled + 灰底 bg-border-default（room-booking lock toggle
  慣例）, input 寬度改 flex-1 填滿剩餘寬度（設計稿意圖, Figma 232px 即
  當時剩餘寬度）。新增 `js/system-basic.js` initSystemBasic(), MANIFEST
  同步登記, spec 卡 4 段更新

### 重要決定

- Figma「mobile ~ tablet」768 畫布代表 767 以下階段; 768 以上 = desktop
  不變（使用者 Q2/Q3 拍板, 之後 tablet 稿會改設 767）
- mobile 階段 content page 上方只有 logo + 收合鈕; function icons 在
  drawer 內（既有實作已符合, 無斷點變更）
- 版型示意區英文假文案套 Noto Sans 不翻譯; Figma 的 U+2022 圓點分隔符
  依 ASCII-only 規則改 "-"
- 版型卡 radius 16 是刻意設計（其他卡 12）

### 驗證（self-tested, pending review）

- 4 個 lint 全 exit 0; smoke-test 4 頁全 PASS
- Chrome 實測: 1440/767/640 各欄數正確; 375 emulated 單欄無橫向溢出
  （scrollWidth 375=375）; drawer 內 message+person icons、客服僅 Email、
  帳號列僅登出; member modal 開關正常; 多 tab 與系統基本互通
  （系統基本+房間預定 chips 共存）; textarea 曾在單欄被 flex-1 壓縮,
  已改 min-h-[118px] 修正
- 截圖: specs/qa-screenshots/session-105/system-basic-*.png
  （1440/767/640/375/drawer/sameday-off）
- toggle 連動實測: off -> disabled + rgb(225,225,224); on -> 白底可輸入;
  input 寬 356/row 432 = 填滿 label 外剩餘寬度

### 未解問題

- 無; 使用者驗收後追加 toggle 連動與 POS 移除兩項需求, 均已實作並
  再驗收, 指示 commit & push

---

## Session 104 交接 (2026-07-13)

### 任務: 修復 topbar page tab chips 只剩單一 tab 的問題

使用者回報：過去點房間預定與訂單處理會各生成一個 tab（複數共存），
現在 #pageTabsInline 只剩單一 tab，要求修正。

### 根因分析

- 舊 SPA（commit 7cdb6d7）在 landing 內有 pages[] state machine
  （openPage / renderChips / closePageByName），tab 可複數、可關閉
- 2026-07-04 拆頁時 page-architecture.md 明文決策「chips 降級為導航列，
  多開 + 關閉語意不在 demo 重現」，各頁只 append 自己的靜態 chip，
  跨頁無 state 保存，所以永遠單一 tab
- 本輪使用者訂正推翻該決策，恢復多 tab 行為

### 本輪改動

- 新增 `preview/js/page-tabs.js`：`initPageTabs()`，sessionStorage
  （key `swift-open-page-tabs`）保存已開頁面清單；chip = div.page-tab
  （label anchor `.page-tab-link` + 關閉鈕 `.page-tab-close`）；
  關閉當前頁跳最近剩餘 tab（優先右、退回左），全關回 landing；
  landing 只 render 清單不自成 tab。新 tab 頁上線要登記 TAB_PAGES
- 三頁 inline script 接線 initPageTabs()（initPageShell 之後）；
  移除 room-booking / order-processing 原本的單顆靜態 chip 程式碼
- `shell.css` 新增 `.page-tab-link`（color inherit + no underline）
- `scripts/lint-partials.py` MANIFEST 三頁 modules 補 `./js/page-tabs.js`
- `specs/page-architecture.md`：「導航（current）」改寫 chips 段為
  多 tab 現行規格；2026-07-04 歷史決策段加註已被推翻（不改寫原文）

### 驗證（self-tested, pending review）

- lint-fonts / lint-conventions / lint-partials 全 exit 0
- `node scripts/smoke-test.mjs` 三頁 PASS
- Chrome 實測（isolated context, 1440/768/375）：
  - rb -> op：兩 chip 共存，op active、rb inactive，順序照開啟序
  - 點 rb chip 跳回 rb，active 正確跟隨當前頁
  - 關閉非當前 tab：原地移除不跳頁
  - 關閉當前 tab：跳剩餘 tab；關最後一個回 landing，storage 清空
  - landing render 既有 tab（皆 inactive）
  - mobile 375 不顯示 chips 列為既有設計（#desktopTopRow hidden md:flex），
    非 regression
- 截圖：specs/qa-screenshots/session-104/（1440 / 768 / 375 / landing）

### 重要決定

- 2026-07-04「chips 降級為導航列」決策被使用者訂正推翻；現行權威規格
  在 page-architecture.md「導航（current）」topbar page chips 段
- tab 狀態用 sessionStorage（分頁工作階段語意，關瀏覽器 tab 重置），
  不用 localStorage

### 未解問題

- 無；使用者已在本機預覽驗收後指示 commit & push

---

## Session 103 交接 (2026-07-08)

### 任務: 獨立驗證 Session 99-102 的產出，準備 commit & push

Session 99-102 這段期間（`scripts/agent-council.mjs` 實作、`ai-chat`
觸發詞補強、`aside-system-icon-overlap` 與 `bulletin-icon-removal` 兩個
council topic 完整跑完並落地實作）發生在這個對話串看不到的地方
（Codex CLI / 腳本自動執行）。使用者要求「交接 commit & push」，本輪的
工作是**獨立驗證**這些已宣稱 self-tested 的產出，不直接照單全收。

### 驗證（本輪自己重跑，不是引用 Session 102 的宣稱）

- `desktopBulletinBtn` / `mobileBulletinBtn` / `modalBulletinBackdrop` /
  `.bulletin-tab` / `data-bulletin-row-toggle` / `bindBulletinRows` /
  `bulletin.svg`：對 `preview/`、`components/`、`specs/pages/` 做 grep
  復查，只剩 `components/function-icons.md` 與 `specs/pages/room-booking.md`
  裡的決策記錄文字（正確 - Decision Convergence 要求的收斂記錄），
  沒有殘留任何實作引用
- 4 個既有 lint 全部重新獨立跑過：`lint-conventions.sh` /
  `lint-fonts.sh` / `lint-tokens.sh`（86 raw hex tokens 一致）/
  `lint-partials.sh`（3 pages, 3 standalone）全 pass
- `node --check scripts/smoke-test.mjs` pass；`node scripts/smoke-test.mjs`
  重新獨立執行，三頁 10/9/9/10 checks 全 PASS（landing 從 11 降到 10，
  對應拿掉的 bulletin modal 檢查項，跟 Session 102 的敘述一致）
- 用 `run-swift` driver 對 landing.html / order-processing.html 各截一張
  topbar 桌機圖，肉眼確認只剩 2 個 function icon（訊息/會員安全管理），
  無殘留 bulletin icon、無版面塌陷或異常間距
- 額外用 `eval` 實測 order-processing.html 的 `desktopMessageBtn` 開關
  `modalAdministerBackdrop` 仍正常（backdrop 開/關皆正常），確認移除
  bulletin 沒有連帶弄壞同群組另一顆還在用的 icon
- `git diff --check` pass

### 重要決定

- 沒有回頭改寫 Session 99-102 的既有交接內容（沿用本專案「只修最新一筆，
  不回溯改寫歷史記錄」原則，見 Session 93）；本輪只新增一筆獨立驗證記錄
- 兩個 council topic（`aside-system-icon-overlap` 的 system icon 移除、
  `bulletin-icon-removal` 的 bulletin icon 移除）皆確認 user-decision.md
  存在且明確記錄拍板內容與 Decision Convergence 收斂範圍，符合
  `specs/agent-council.md` 的治理要求

### 下一步

- 依使用者指示進入 commit & push

### 未解問題

- 無

---

## Session 102 交接 (2026-07-08)

### 任務: ai-chat 第二次流程驗證 - bulletin icon removal council

使用者在 Claude CLI 以 `ai-chat` 發起 `bulletin-icon-removal` topic。Claude
建立 `specs/agent-council/bulletin-icon-removal/brief.md`，但單純寫入檔案不會
喚醒目前 Codex 對話；Codex 這邊接手執行
`node scripts/agent-council.mjs run specs/agent-council/bulletin-icon-removal/brief.md`。

### 本輪改動

1. `specs/agent-council/bulletin-icon-removal/`（新 topic）：
   - `brief.md`
   - `round-1-codex.md`
   - `round-1-claude.md`
   - `round-2-codex-review.md`
   - `round-2-claude-review.md`
   - `consensus.md`
   - `user-decision.md`
2. council consensus 收斂到同一建議：
   - 方案 A：整個拔除公告 function icon 與 `modalBulletinBackdrop`。
   - 不建議只隱藏，除非使用者明確要保留 dormant feature。
3. 使用者拍板：
   - 選擇方案 A：拔除。
   - 本輪主要目的為驗證 Codex / Claude CLI 可透過 repo 檔案與
     `scripts/agent-council.mjs` 溝通。
   - 使用者補充：拍板後可以直接修改產品實作，不需要延遲。
4. 依方案 A 進入 scoped implementation：
   - `preview/partials/topbar.html`：移除 desktop `desktopBulletinBtn`，
     `topWrap` 改為 `message` / `person-md` 兩顆。
   - `preview/partials/aside.html`：移除 mobile `mobileBulletinBtn`，
     mobile function row 改為 `message` / `person-md` 兩顆。
   - `preview/partials/topbar-modals.html`：移除 `modalBulletinBackdrop` 整段，
     保留 `modalAdministerBackdrop` 系統商公告與 `modalMemberBackdrop`。
   - `preview/js/topbar-modals.js`：移除 `.bulletin-tab` 綁定與
     `bindBulletinRows()`。
   - `preview/assets/css/modals.css`：移除 `modalBulletinBackdrop` 與
     `.bulletin-tab` 專用樣式。
   - `components/function-icons.md`、`components/menu.md`、
     `specs/pages/order-processing.md`、`specs/pages/room-booking.md`、
     `specs/pages/room-booking-collapsed.md`：function icons 規格收斂為
     `message` / `person-md` 兩顆。
   - `scripts/smoke-test.mjs`：移除已不存在的 bulletin modal smoke check。

### 驗證（self-tested）

- `node scripts/agent-council.mjs run specs/agent-council/bulletin-icon-removal/brief.md` pass
- 產出完整 round-1 / round-2 / consensus 檔案
- `rg` implementation audit：`desktopBulletinBtn` / `mobileBulletinBtn` /
  `modalBulletinBackdrop` / `.bulletin-tab` / `data-bulletin-row-toggle` /
  `bindBulletinRows()` / `bulletin.svg` 在 `preview/`、`components/`、
  `specs/pages/`、`scripts/` 只剩「已移除」決策註記，無產品實作引用
- `node --check scripts/smoke-test.mjs` pass
- `git diff --check` pass
- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-partials.sh` pass（3 pages, 3 standalone）
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `node scripts/smoke-test.mjs` pass：landing 10 checks、order-processing 9
  checks、room-booking 10 checks

### 重要決定

- Claude CLI 寫入 `brief.md` 不會自動喚醒 Codex 對話；目前沒有 file watcher
  或背景 daemon。要啟動討論，仍需由任一 CLI 主動執行
  `scripts/agent-council.mjs run <brief.md>`。
- 此次流程驗證結果：腳本可成功呼叫 Codex 與 Claude CLI，並完成 cross-review
  與 draft consensus。
- 使用者已拍板 bulletin 採方案 A：整個拔除；本輪已依新指示直接落實 repo
  implementation。

### 下一步

- 使用者確認後再依指示 commit / push。

### 未解問題

- Figma `Function icons` 是否同步改為 2 icons 屬外部設計檔操作，repo 本輪
  不處理。

---

## Session 101 交接 (2026-07-08)

### 任務: 補強 ai-chat 一句話觸發規則

使用者指出 Session 100 的自動化仍要求使用者輸入過長提示詞，期待是只要對任
一 CLI 說 `ai-chat ...`，當前 agent 就自動建立 topic / brief，並呼叫另一個
agent 進入 council 流程。

### 本輪改動

1. `start.md`：
   - 在重大分歧決策段落明確定義 `ai-chat` 是執行觸發詞。
   - 任一 CLI agent 收到足夠明確的 `ai-chat ...` 後，應直接建立
     `specs/agent-council/{topic}/brief.md` 並執行
     `node scripts/agent-council.mjs run <brief.md>`。
   - 使用者不需要再輸入「請建立 brief 並執行腳本」。
   - 只有題目不足、會立刻改產品實作、或需要不可推測的 Figma/產品意圖時，
     才先停下詢問。
2. `specs/agent-council.md`：
   - 將「一句問題先建 brief 草稿並等確認」改成「一句 `ai-chat` 問題足夠
     明確時，直接建 brief 並跑腳本」。
   - 補上 agent 執行步驟：摘要 topic、建立 brief、寫入原始問題與 repo
     constraints、呼叫 `scripts/agent-council.mjs run`。

### 驗證（self-tested）

- `git diff --check` pass
- `./scripts/lint-conventions.sh` pass

### 重要決定

- `ai-chat` 的正確使用者介面是一句自然語言問題，不是要求使用者背誦
  `brief.md` 路徑與腳本命令。
- 此規則是跨 CLI workflow rule，因此寫入 `start.md`；細節仍由
  `specs/agent-council.md` 管理。

### 下一步

- 使用者確認後再依指示 commit / push。

### 未解問題

- 無

---

## Session 100 交接 (2026-07-08)

### 任務: 實作 ai-chat 自動化腳本

使用者在 Session 99 完成首次 ai-chat 實戰後，要求把手動切 Codex / Claude
CLI 的流程自動化：實作 `scripts/agent-council.mjs`，讓既有 `ai-chat`
流程可以自動呼叫 `claude -p` 與 `codex exec`，省掉手動切 CLI。

### 本輪改動

1. `scripts/agent-council.mjs`（新）：
   - `run <brief.md>`：依序產出 `round-1-codex.md`、
     `round-1-claude.md`、`round-2-codex-review.md`、
     `round-2-claude-review.md`、`consensus.md`
   - `smoke`：用固定字串測試 Codex / Claude CLI 是否可被腳本呼叫
   - `--dry-run`：只列出將執行的步驟，不呼叫 CLI、不寫 round 輸出
   - `--only <step>`：只跑單一步驟，方便中斷後接續
   - `--force`：覆寫既有 round/review/consensus 檔；預設保留既有檔案並
     skip，支援 resume
   - `--synthesizer codex|claude`：指定 consensus 由哪個 CLI 產出
   - `--timeout-ms <n>`：設定每個 CLI 呼叫 timeout
   - nested agent 只輸出 markdown body；腳本負責寫檔、加 author header、
     source_files，避免 nested agent 直接改 repo
   - 某一步失敗時不刪除既有檔案，錯誤寫到 `<target>.error.md`
2. `specs/agent-council.md`：
   - 「執行工具現狀」改成「自動化腳本」
   - 補 `run` / `smoke` / `--dry-run` / `--only` / `--force` /
     `--synthesizer` 用法
   - 記錄在受限 sandbox 中，CLI 可能需要讀寫本機 auth/state（例如
     `~/.codex` 或 Claude auth），因此 smoke / run 可能需要使用者批准
     升級權限
   - 手動觸發 Claude 的指令保留為 fallback

### 驗證（self-tested）

- `node --check scripts/agent-council.mjs` pass
- `node scripts/agent-council.mjs --help` pass
- `node scripts/agent-council.mjs run specs/agent-council/aside-system-icon-overlap/brief.md --dry-run --force` pass，列出 5 個預期步驟
- `node scripts/agent-council.mjs smoke --agent codex --timeout-ms 120000` pass
- `node scripts/agent-council.mjs smoke --agent claude --timeout-ms 120000` pass
- 第一次 smoke：
  - Claude 在 sandbox 內先回 `Not logged in`，升級權限後通過
  - Codex 在 sandbox 內因 `~/.codex/state_5.sqlite` readonly / app-server
    EPERM 失敗，升級權限後通過

### 重要決定

- 腳本採「CLI 產生 markdown，腳本寫檔」架構，避免兩個 nested agent 直接
  編輯 repo 檔案，降低權限與覆寫風險。
- 預設 skip existing files 而不是覆寫，讓中途失敗可 resume；需要覆寫時
  明確加 `--force`。
- 目前不做「一句問題自動生成 brief」；仍由 agent 先依 template 建 brief
  草稿、使用者確認後，再把 brief path 丟給腳本。

### 下一步

- 使用者驗收自動化腳本
- 驗收後依指示 commit / push

### 未解問題

- 無

---

## Session 99 交接 (2026-07-08)

### 任務: ai-chat 首次實戰 - 移除 function icons 的 system icon

使用者用 `ai-chat` 練習 Codex/Claude repo-file-mediated council 流程，討論
aside「系統設定」父項與 topbar/mobile drawer 的 `system` function icon
是否語意衝突。Claude 與 Codex round-1 / round-2 都收斂到同一方向：
`system` icon 目前零互動，且 `specs/icons.md` 將 `system` 語意標成
「系統設定 / 齒輪設定」，與 aside「系統設定」構成真實語意重疊，不應繼續
當作有效入口或未定義佔位露出。

使用者拍板選 **候選 1**：移除 topbar/mobile drawer 的 `system` icon，讓
aside「系統設定」成為目前唯一設定入口。使用者補充：會到 Figma 把原版
function icons 裡的 `system` icon 移除，只保留三個 function icons，所以
這次不是 code-only override，Figma 也會同步。

### 本輪改動

1. `specs/agent-council.md`：補強 ai-chat 流程：
   - round / review / consensus 檔案必須具名 author header
   - consensus 的候選方案必須標 `source`
   - 自動化腳本未完成前，Claude CLI 不會自動被喚醒，需使用者手動叫 Claude
     讀同一份 brief
   - 使用者拍板 comment 固定包含「拍板：選擇候選版本」與「補充說明」
   - 拍板 comment 若影響執行，先記到 topic 的 `user-decision.md`，再收斂
     到權威檔案
2. `specs/agent-council/aside-system-icon-overlap/`（新 topic）：
   - `brief.md`
   - `round-1-codex.md`
   - `round-1-claude.md`
   - `round-2-codex-review.md`
   - `round-2-claude-review.md`
   - `consensus.md`
   - `user-decision.md`
3. `components/function-icons.md`：current function icons 由 4 顆改為 3 顆：
   bulletin / message / person-md。移除 `system` 列與 HTML 範例，並記錄
   2026-07-08 使用者拍板：`system` 與 aside「系統設定」語意重疊、無對應
   內容，topbar/mobile drawer 移除，Figma 也會同步三顆 icon。
4. `preview/partials/topbar.html`：移除 desktop topbar 的 `system.svg`
   靜態 `<img>`，保留公告 / 訊息 / 會員安全管理三個 button。
5. `preview/partials/aside.html`：移除 mobile drawer function icons row 的
   `system.svg`，保留公告 / 訊息 / 會員安全管理三個 button。
6. `specs/pages/order-processing.md`：desktop top toolbar 從 function icons
   x4 改成 x3；頂部工具列表格改為 bulletin/message/person，並寫明
   `system` 已由 2026-07-08 使用者拍板移除，設定入口收斂到 aside。
7. `specs/pages/room-booking.md`：Top Bar function icons 尺寸從 156x24 改為
   112x24，描述改為 3 icons x 24；移除 person/system badge 舊描述，補
   `system` 已移除且 Figma 會同步三顆 icon 的決策註記。

### 驗證（self-tested）

- `rg` 檢查受影響 current source 後，`system.svg` 只剩
  `operation-system.svg` 這個 aside 區塊標題 icon，不是被移除的 function
  icon
- `git diff --check` pass
- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-partials.sh` pass（3 pages, 3 standalone）
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `node scripts/smoke-test.mjs` pass：landing 11 checks、order-processing 9
  checks、room-booking 10 checks
- `run-swift` driver eval：
  - order-processing desktop `#topWrap img` = bulletin / message / person-md
  - room-booking mobile drawer function row = bulletin / message / person-md
    （另有 logo，屬 drawer header，不是 function icon）
- 視覺截圖：
  - `specs/qa-screenshots/session-99/order-processing-desktop-topbar.png`
    顯示右上只剩三顆 function icons，無 system 齒輪
  - `specs/qa-screenshots/session-99/room-booking-mobile-drawer-open.png`
    顯示 mobile drawer function row 只剩公告 / 訊息 / 會員三顆，無 system
    齒輪

### 重要決定

- `system` function icon 移除是使用者拍板後的正式決策，不是 council draft
  自動升格；後續實作以 `components/function-icons.md` 與頁面 spec 為
  current source，不以 `consensus.md` 為 current source。
- 這次不用 `start.md`：本決策是元件/頁面行為，不是跨任務 workflow rule。
- Figma 會同步移除原版 `system` icon，只保留三個 function icons；本輪不是
  code-only override。

### 下一步

- 使用者已驗收通過
- 本輪依指示 commit / push

### 未解問題

- 無

---

## Session 98 交接 (2026-07-08)

### 任務: 建立 agent council 流程規格（Codex/Claude 雙 agent 決策協作）

使用者提出「不要讓 Codex 和 Claude 直接在 chat UI 互聊，改用 repo 檔案當
第三方協調器」的構想，經過三輪來回定案：synthesizer（非 moderator）+
consensus.md 強制 draft 標記 + 拍板後必須收斂回既有權威檔案（Decision
Convergence）。本輪只做規格與文件，不做腳本（使用者已決定 CLI smoke
test 要先於 orchestration 腳本）。

### 本輪改動

1. `specs/agent-council.md`（新）：完整流程規格，含：
   - 跑 council 的門檻（有真實 trade-off 才跑，單一 spec 核對/小修正不跑）
   - 檔案結構：`specs/agent-council/{topic}/` 底下 brief.md +
     round-1-codex.md + round-1-claude.md + round-2-codex-review.md +
     round-2-claude-review.md + consensus.md
   - 角色流程：兩方各自獨立 round-1 -> 交叉 review round-2 -> 其中一方當
     **synthesizer** 整理（不裁決，只整理共識/分歧/風險/建議方案/待裁決
     問題）
   - `consensus.md` 固定格式，強制標記 draft / pending user decision
   - 觸發關鍵字定為 `ai-chat`；沒有既有 brief 時先建立 brief 草稿給
     使用者確認，有既有 brief 時可直接指定路徑
   - **Decision Convergence** 段（使用者原文照錄）：拍板後必須依決策性質
     寫回 `progress.md`（一般決策）/ `start.md`（跨任務規則）/
     `components/{name}.md`（元件規格）/ `specs/pages/{name}.md`（頁面
     規格）/ `specs/html-conventions.md`（實作慣例）；council 目錄本身
     只是歷史記錄，沒收斂進權威檔案前不可被當成 current source
   - 失敗處理：中途失敗不可刪除/回滾已產出檔案；執行工具需支援 resume
   - 明確記錄 `scripts/agent-council.mjs` 尚未實作，先決條件是對
     `claude -p` 與 `codex exec` 做 CLI smoke test（stdin/stdout 格式、
     cwd 繼承、permission mode、timeout、失敗 exit code、JSON 穩定性）
2. `specs/agent-council/_template.md`（新）：brief 模板（背景/問題/候選
   方案/禁止事項/需要裁決的問題）
3. `start.md`：檔案地圖段落補一行索引「重大分歧決策可用
   `specs/agent-council.md` 流程」，不搬入規則細節本身，避免變成第二份
   workflow 憲法（跟 html-conventions.md 當初搬遷用的是同一個「單一入口
   不稀釋」原則）

### 驗證

- 4 個既有 lint 全 pass（`lint-conventions.sh` 檢查新增行 ASCII-only 等）
- `git diff --check` pass
- 本輪未動 preview/ 底下任何檔案，純文件工作，不需要跑 smoke-test.mjs

### 重要決定

- synthesizer 不是 moderator：只整理雙方意見成 draft，不裁決對錯，避免
  誰當 synthesizer 誰就有最後話語權的偏頗風險
- consensus.md 永遠是 draft；沒有被使用者拍板並寫回對應權威檔案之前，
  任何後續工作都不可以把它當成 current source 引用 - 這是為了避免它變成
  跟這次 aside icon 回歸同一類的「規格污染」（舊決策被誤當規格延續）
- 腳本化順序刻意延後：先 spec、再 template、最後才是
  `scripts/agent-council.mjs`，且腳本本身要先做 CLI smoke test 才寫
  orchestration 邏輯，避免卡在 CLI 行為細節（stdin/stdout/cwd/exit
  code/JSON 穩定性這些沒人事先驗證過）

### 下一步

- 使用者驗收本輪規格文件
- 驗收後由 agent 對 `claude -p` / `codex exec` 做 CLI smoke test
- smoke test 通過後才進入 `scripts/agent-council.mjs` 實作

### 未解問題

- 無

---

## Session 97 交接 (2026-07-08)

### 任務: 修正 function icons（公告/訊息/會員安全管理）在新頁被隱藏的回歸

使用者回報右上角 function icons 在 order-processing.html / room-booking.html
消失，且手機版 aside drawer 裡的同組 icon 也消失。我一開始誤判成「這是
Stage 2 刻意設計，避免死按鈕」，被使用者當場糾正：**這組 icon 一直都是
全頁固定顯示的既定規格**，過去也一直是這樣說明/設計/實作的；「看起來能
點、實際點了沒反應」在這個專案裡不是問題（aside 選單本來就允許 inert
項目留著），不可以拿這個當理由隱藏。

### 查證（找根因，不只信自己上一輪的判斷）

- `git log -S` 定位到隱藏邏輯的引入點：commit `a2e0614`
  "Complete stages 1d-2"（Session 84-85，2026-07-04），`page-shell.js`
  新增時就帶了這段「Hide controls whose target modals are landing-only」
- 對照拆頁前的單檔 `landing.html`（commit `5cf5af7`，Stage 1a-1c 完成後、
  page-shell.js 誕生前）：三個 icon 的 JS 只有 desktop/mobile 雙 id 綁定
  開 modal，**沒有任何隱藏邏輯**。確認這組隱藏行為是 Stage 2 重構時新加的
  判斷，不是延續舊規格，是我方（AI）自己的臆測被誤當成設計決策一路延續
  到現在
- 使用者指出手機版也消失後，才發現 `mobileBulletinBtn`/`mobileMessageBtn`/
  `mobileMemberBtn`（在 `partials/aside.html` 的「Mobile function icons
  row」）套用同一段隱藏邏輯，跟桌機版同根因，不是兩個獨立問題

### 本輪改動

`preview/js/page-shell.js`：刪除 `initPageShell()` 內「Hide controls whose
target modals are landing-only」整段 forEach（6 組 id/modal 對照表 +
`classList.add("hidden")`）。檔頭註解同步更正：function icons 三頁一律
固定顯示，不因該頁沒有對應 modal 就隱藏；點擊在 op/rb 頁沒反應是允許狀態。

### 驗證（self-tested）

- 用 `run-swift` driver `eval` 逐一檢查 6 個 icon id
  （desktop/mobile x bulletin/message/member）在 landing / order-processing /
  room-booking 三頁的 `hidden` class 狀態：修正前 op/rb 兩頁 6 個全部
  `hidden=true`，修正後三頁全部 `hidden=false`
- 桌機截圖：order-processing.html 右上角 4 個 icon（含系統齒輪）跟 landing
  一致
- 手機 390 寬 drawer 截圖：room-booking.html 頂部 4 個 icon 完整顯示
- 4 個既有 lint 全 pass、smoke test 三頁 11/9/10 checks 全 PASS、
  `git diff --check` pass

### 重要決定

- 這個回歸的根本問題不是程式碼本身，是**我把 AI 自己在前一輪重構時的
  假設，誤判成使用者的既有規格**，還在被問到時繼續辯護（「避免死按鈕」）
  而不是先查證。之後遇到「這是不是故意的」這類問題，要先查 git history/
  對照重構前版本，不能只憑目前程式碼裡的註解就當作規格來源 - 註解也可能
  是同一個誤判寫出來的
- 不回頭修 Session 85 那筆舊交接記錄裡「避免 visible dead controls」的
  描述文字（`specs/progress.md` 舊段落），沿用本專案「只修最新一筆，不
  回溯改寫歷史記錄」的原則（見 Session 93）；該筆歷史記錄本身就是這次
  要修正的錯誤判斷的第一手證據，保留原文更有價值

### 追加修正（同一輪，使用者二次糾正）

上面「只讓 icon 顯示，op/rb 頁點了沒反應是允許狀態」的說法，被使用者當場
推翻：**同一組 icon 在不同頁行為不一致（landing 能開 modal、op/rb 只留
死 icon）本身就是不正常，不是「跟 aside inert 選單同類可接受」**。這個
判斷比第一次的隱藏 bug 更根本 - 只讓 icon 露臉不夠，modal 本體要三頁都能
真的用。

**追加改動**：
1. `preview/landing.html`：抽出公告(Modal D/`modalAdministerBackdrop`)、
   管理訊息(Modal C/`modalBulletinBackdrop`)、會員安全管理
   (Modal E/`modalMemberBackdrop`) 三個 modal 完整 HTML（665 行），
   改為 `<div data-partial="topbar-modals"></div>`；搬移時順手清掉
   box-drawing 分隔線與全形破折號（區塊本來就有裝飾符號違規，搬進新檔
   全算新增行，必須清）
2. `preview/partials/topbar-modals.html`（新）：上述三個 modal 的全站
   共用單一來源
3. `preview/js/topbar-modals.js`（新）：`initTopbarModals()`，內容是
   原 `landing-modals.js` 的 `bindTabGroup`（公告/管理訊息 tab）、
   `bindMemberSecurityModal`（會員 tab + eye-toggle）、`bindBulletinRows`
   （公告列展開）原樣搬出，供三頁各自呼叫一次
4. `preview/js/landing-modals.js`：瘦身到只剩
   `createModalController()`（landing 沒有 order-modals.js，仍需要自己
   建一個 controller 實例給 session-modals + topbar-modals 用）
5. `preview/partials/topbar.html`：三個桌機按鈕補靜態
   `data-modal-open="modal{Bulletin,Administer,Member}Backdrop"`
   （原本靠 `landing-modals.js` 的 `setModalOpen()` 動態加、只在
   landing 執行；現在寫死在 markup，三頁共用同一份 topbar.html 自然
   三頁都有）
6. `preview/partials/aside.html`：三個手機按鈕比照補相同的靜態
   `data-modal-open`
7. `preview/order-processing.html`、`preview/room-booking.html`：新增
   `data-partial="topbar-modals"` 掛載 + import/呼叫 `initTopbarModals()`
   （不需要另建 modal controller，這兩頁既有的 `order-modals.js` 的
   controller 是全頁通用的 delegated handler，modal 只要存在於 DOM 就會
   被接住）
8. `scripts/lint-partials.py`：三頁 MANIFEST 補 `topbar-modals` partial
   與 `./js/topbar-modals.js` module（依三頁各自實際 import 順序）
9. `specs/page-architecture.md`：補 `partials/topbar-modals.html` 說明

**驗證（self-tested，重點是真的點得開，不只是 icon 可見）**：
- `run-swift` driver `eval`：三頁的 desktopBulletinBtn/desktopMessageBtn/
  desktopMemberBtn 逐一 click 開啟 -> 確認 `classList.contains("open")`
  -> backdrop click 關閉 -> 確認關閉，三頁三個 modal 全部 `OK (open+close)`
  （含 landing 自身回歸測試，開關依然正常，不是只圖 op/rb 能動而壞了
  landing）
- 額外驗證 modal 內部行為在新頁真的生效：order-processing.html 點會員
  安全管理 -> 切到「IP 紀錄」tab -> 確認 tab 高亮切換、原密碼欄位正確
  隱藏、IP 紀錄面板正確顯示（不是外殼會開但內容行為沒接上）
- 桌機截圖：order-processing.html 開啟會員安全管理 modal，視覺與 landing
  上的版本一致（置中、樣式、內容排版）
- 4 個既有 lint 全 pass（`lint-partials.sh` 含新 partial/module 的
  duplicate id / modal target 檢查）、smoke test 三頁 11/9/10 checks
  全 PASS、`git diff --check` pass

**重要決定（追加）**：
- 三頁不各自建一個新的 modal controller 實例；op/rb 頁沿用
  `order-modals.js` 已建立的 controller（本來就是全頁 generic 的
  delegated click/backdrop/ESC handler，不挑 modal id），只要
  topbar-modals 的 HTML 存在於 DOM，既有 controller 自然接得住，不需要
  重複呼叫 `createModalController()`（重複呼叫會產生重複的全域
  listener，這裡刻意避免）

### 下一步

- 使用者驗收本輪修正（含追加修正）
- 驗收後依指示 commit / push

### 未解問題

- 無

---

## Session 96 交接 (2026-07-08)

### 任務: aside menu list 依使用者新內容整體重整（13 個父分類 -> 6 個）

使用者直接提供完整新 menu 內容（# 父項 / - 子項格式）。因為新內容只有 6
個父項，而舊結構有 13 個，且多個舊分類（財務專區、對應設定、多國語設定、
系統商服務）與部分子項（自動對帳紀錄查詢、須知設定等）完全沒出現在新內容
裡，動工前先問使用者這是完整取代還是新增/合併，確認為**完整取代**。

### 本輪改動

1. `preview/partials/aside.html`：13 個父分類 -> 6 個父分類，依序為
   系統設定 / 產品設定 / 訂單管理 / 會員管理 / 報表資訊 / 簡訊管理。
   - 系統設定：系統基本、帳號及權限、民宿資料、房型、加購商品（5 子項，
     皆 inactive）
   - 產品設定：OTA、通路庫存、平日定義、房間與數量、專案內容、數量價格表
     （6 子項，皆 inactive；使用者註記 OTA/通路庫存現階段預設顯示，未來
     由後端控制，本輪不加對應前端邏輯）
   - 訂單管理：訂單處理（真實連結 order-processing.html）、房間預定
     （真實連結 room-booking.html），原本「前台作業」「訂單處理作業」
     兩個父項合併為此
   - 會員管理：會員資訊（1 子項，inactive；原子項「會員資料查詢」改名）
   - 報表資訊：住房統計（1 子項，inactive；父項原名「報表」、子項原名
     「住房統計表」皆改名）
   - 簡訊管理：簡訊文本與發送設定、排程發送（2 子項，inactive；原子項
     「訂單簡訊及樣本管理」「定時簡訊管理」改名）
   - 消失：財務專區（訂金處理）、對應設定（OTA串接設定）、多國語設定
     （飯店基本設定/規約設定/房型設定/套裝設定）、系統商服務（線上授權單/
     請款紀錄查詢）、以及舊「訂單處理作業」的「自動對帳紀錄查詢」、舊
     「基本資料設定」的「須知設定」「房型資料設定」、舊「訂房資料設定」
     的其餘子項、舊「其他消費設定」整個分類
   - 新分類/子項一律不加 `data-role="hotel"`（使用者新內容未提及飯店限定
     區分，不腦補）
2. `specs/pages/room-booking.md`、`specs/pages/room-booking-collapsed.md`、
   `specs/pages/order-processing.md`、`specs/order-processing-reading-notes.md`：
   H1 標題裡的舊父分類名稱（前台作業、訂單處理作業）改成新名稱「訂單管理」，
   避免規格污染（標題仍在但分類已不存在會誤導後續讀者）
3. `.claude/skills/run-swift/driver.mjs` + `SKILL.md`：驗證過程中發現
   `withPage()` 沒有等 `Page.loadEventFired` 就開始輪詢 `[data-partial]`，
   會對還沒 navigate 完成的 `about:blank` 誤判為「已就緒」（`eval` 回傳
   `asideExists: false` + `readyState: "loading"` 才抓到）。修法：`Page.navigate`
   前先掛 `Page.loadEventFired` listener 再 await，跟 `scripts/smoke-test.mjs`
   已驗證過的作法一致。修完後連續跑 3 次確認不是巧合過關。SKILL.md 補上
   這個 gotcha 與教訓。

### 驗證（self-tested）

- HTML div 開合數量對稱（68/68）、`menu-category`/`accordion-trigger`
  各 6 個
- 4 個既有 lint 全 pass；`node scripts/smoke-test.mjs` 三頁 11/9/10 checks
  全 PASS（含 aside accordion/收合全部/mobile drawer 檢查）
- 用修好的 `run-swift` driver 逐項肉眼+程式化驗證：
  - 桌機截圖：展開「系統設定」子項順序、文字、藍色皆正確
  - 「訂單管理」展開後兩個子項是 `<a>` 且 href 正確指向
    order-processing.html / room-booking.html
  - order-processing.html / room-booking.html 的 `.sub-item-selected`
    正確落在巢狀後的「訂單處理」「房間預定」上（`partials.js` 的
    active-page selector 對合併後的結構依然生效）
  - 該 active 項所屬的「訂單管理」父分類自動展開（`submenuHidden: false`,
    `iconOpen: true`）
  - 手機 390 寬 drawer 截圖：6 個分類完整顯示、無水平溢出

### 重要決定

- 完整取代 vs 新增合併：使用者明確選「完整取代」，四個舊父分類與多個舊
  子項確認整個消失，不是遺漏
- 新分類/子項不加 `data-role="hotel"`：Figma/使用者都沒提到飯店限定區分，
  不腦補
- run-swift driver 的 race condition 修復＋教訓寫回 SKILL.md，不是只默默
  修掉，下次改動這個 driver 的人會看到為什麼要在 navigate 後 await
  loadEventFired

### 下一步

- 使用者驗收本輪 aside 重整
- 驗收後依指示 commit / push

### 未解問題

- 無

---

## Session 95 交接 (2026-07-05)

### 任務: 新增 `figma-read` skill

使用者確認要做第二個 skill（同一對話延續 run-swift）。設計決定：**不搬
start.md 內容**，figma-go 三階段流程 / JSON 不等於視覺限制 / 選 selection
防漏三動作等硬規則維持只存在於 start.md（透過 CLAUDE.md 的 `@start.md`
每次對話強制載入），因為 skill 的自動觸發不保證每次都命中，把安全性規則
搬進去風險比留在 start.md 高。skill 只做 start.md 目前沒有的部分：
`scripts/figma-read.py` 的操作文件，內容用指回 start.md 對應章節、不重複
貼規則。

### 本輪改動

`.claude/skills/figma-read/SKILL.md`（新）：開頭先講清楚這份 skill 不取代
start.md；列出六個 `figma-read.py` 子指令（`tree`/`texts`/`node`/
`screenshot`/`crop`/`pixel`）的用法，每個都在本輪實測過；Gotchas 段記錄
實測抓到的行為。沒有新的 driver 程式碼，`scripts/figma-read.py` 本身不動。

### 驗證（self-tested，過程中修正一個猜測錯的 gotcha）

- 沒有真實 Figma session 或既有 tool-result 檔可測，建構合成測試資料
  （模擬 `get_selection` 陣列格式與 `get_screenshot` 的
  `{"exports":[{"base64":...}]}` 格式）
- 6 個子指令全部對合成資料實測過一輪，含兩條錯誤路徑：`node` 給不存在
  的 id -> `node id 99:99 not found` + exit 1；`screenshot --index`
  超出範圍 -> 印出實際 export 數 + exit 1
- `crop`/`pixel` 對真實 PNG（`specs/qa-screenshots/session-90/` 裡既有的
  截圖）實測，肉眼確認裁切圖正確
- **草稿階段猜錯一個 gotcha**：一開始寫「餵它裸物件而非陣列會靜默找不到
  或對 list 丟例外」，實際測了才發現真正的錯誤是
  `for root in roots` 會疊代 dict 的 key（字串），`print_tree` 對字串呼叫
  `.get()` 直接 crash 成 `AttributeError: 'str' object has no attribute
  'get'`，不是我猜的那種。已改成寫實測到的真實錯誤訊息，不是憑讀 code
  推測的行為
- 照 SKILL.md 逐行重跑一次 fresh pass，6 個子指令全部再過一次
- 4 個既有 lint 全 pass；temp 測試檔清乾淨

### 重要決定

- `scripts/figma-read.py` 本身沒有改動（沒發現需要修的 bug，只有文件補
  齊），跟 run-swift 那輪「順手修 driver 兩個 bug」不同
- Figma 讀取的硬規則單一來源仍是 `start.md`；此 skill 只是操作文件補完，
  不是規則的第二份拷貝

### 下一步

- 使用者驗收本輪 skill
- 若確認留用，下次 commit/push 一併帶上（本輪未進入 commit/push flow）

### 未解問題

- 無

---

## Session 94 交接 (2026-07-05)

### 任務: 用 `/run-skill-generator` 產出 `run-swift` skill

使用者打 `/run-skill-generator`。這個 repo 是單一專案（git remote
`3qberlin/swift.git`，即專案名 `swift`），沒有既有的 run skill 或 legacy
`.claude/run.md`，從頭做。

### 本輪改動

1. `.claude/skills/run-swift/driver.mjs`（新）：CLI driver，把這整個對話裡
   反覆手刻的 scratchpad CDP script（css-bug-shot.mjs、aside-verify.mjs、
   variant-shots.mjs、modal-audit.mjs 等）收斂成一支可重用工具。4 個子指令：
   - `shot <page> [--out] [--viewport] [--wait] [--click]` - 截圖，可選等待
     JS 條件、點擊後再截
   - `eval <page> "<js>" [--wait]` - 在頁面內跑任意 JS 印出結果
   - `serve [port]` - 前景跑 `python3 -m http.server --directory preview`
     供人工瀏覽
   - `smoke` - 直接呼叫既有 `scripts/smoke-test.mjs`
   零依賴（Node >=22 原生 WebSocket + 系統 Chrome headless CDP），`CHROME_BIN`
   可覆蓋路徑。
2. `.claude/skills/run-swift/SKILL.md`（新）：agent-facing 操作說明，含
   verified 過的指令、Gotchas、Troubleshooting。

### 驗證（self-tested，過程中抓到兩個真實 bug 並修正）

- `shot landing.html`：第一次截圖圖表區塊是空的（沒等 Chart.js 畫完）；補
  `--wait 'window.Chart && Chart.getChart(...)'` 後截圖正確 - 這個坑寫進
  SKILL.md Gotchas
- `eval room-booking.html 'document.querySelectorAll("#calGrid .day").length'`：
  沒帶 `--wait` 時回傳 0（driver 只等 partial 掛載，沒等頁面自己的 JS 初始化
  跑完）；補 `--wait` 後回傳 42。發現 `eval` 子指令原本沒有 `--wait` 選項，
  順手補上
  - `--click` 選項第一次跑就炸：`SyntaxError: missing ) after argument list`。
    根因是 selector 字串（含雙引號，如 `[data-modal-open="..."]`）被原樣塞進
    錯誤訊息的字串字面值，提早把字串結束掉。修正：改用同一個
    `JSON.stringify` 過的字串在兩處重複使用
- 4 個子指令全部實測過：`shot`（含 `--wait`+`--click` 開 modal 截圖，肉眼
  確認置中/backdrop/樣式正確）、`eval`（回傳值正確）、`serve`（curl 驗證
  200）、`smoke`（delegate 到既有 smoke-test.mjs，三頁 11/9/10 checks 全過）
- 全部驗證後跑 fresh pass：照 SKILL.md 逐行重跑一次不做任何即興調整，全部
  通過；順便驗證 Troubleshooting 表格的 `pgrep -fl "Google Chrome.*headless"`
  真的能抓到 stray process、跑完後也真的清空
- 4 個既有 lint 全 pass；temp 截圖與程序都清乾淨，`pgrep` 確認無殘留

### 重要決定

- 環境誠實標記為 macOS（Darwin），不照搬 skill generator 範本預設的
  headless Linux 假設；SKILL.md 明講「只驗證過 macOS，Linux 未測」，不假裝
  驗證過沒驗證的東西
- driver 不改 `scripts/smoke-test.mjs`（`smoke` 子指令直接呼叫既有檔案），
  避免為了共用 CDP 樣板去動已經穩定、經過多輪驗證的既有腳本

### 下一步

- 使用者驗收本輪 skill
- 若確認要留用，下次 commit/push 一併帶上（本輪未進入 commit/push flow）

### 未解問題

- 無

---

## Session 93 交接 (2026-07-04)

### 任務: 收斂 Session 92 分析出的三個 smoke test 缺口

使用者要求驗證 Session 92 完成度並分析潛在未完善之處。分析過程中另外用
負向測試找出 `APP_CSS_LOADED_CHECK`（Session 92 收緊版）沒測到的三個
缺口，使用者確認後合併成一次改動修復。

### 發現的缺口（Session 92 沒測到）

Session 92 把檢查從「至少 import 且非空」收緊為「missing/unexpected 雙向
集合比對」，但集合比對本身有盲區，實測證實：
1. 反轉全部 5 個 `@import` 順序 -> smoke test 依然全過（集合比對不管順序）
2. 重複 `@import url("./shell.css")` -> 依然全過（集合比對不管出現次數）
3. `expected` 陣列旁沒有維護提示，未來加第 6 個 domain 檔的人不知道要
   同步改這裡

第 1 點目前無實際視覺風險（另外驗證過 5 個 domain 檔之間 selector 零重疊，
順序打亂不影響 cascade 結果），但屬於「安全是巧合、不是機制保證」。

### 本輪改動

`scripts/smoke-test.mjs`：`APP_CSS_LOADED_CHECK` 的 missing/unexpected
雙向集合比對，改成單一的**有序陣列相等比對**
（`importedNames.join(",") !== expected.join(",")`）。CSSImportRule 在
`cssRules` 裡本來就照 document 順序排列，這一個比對就同時涵蓋順序錯、
重複 import、missing、unexpected 四種錯法，程式碼比雙向集合比對更短。
`expected` 陣列正上方補使用者提供的維護註解（英文，緊貼陣列本體）：
`Keep this list in the same order as preview/assets/css/app.css. / When
adding, removing, renaming, or reordering domain CSS files, update both.`
（外層原有的中文說明段落維持不動，兩者不重複，只是一近一遠兩層提示）。

`start.md`：「commit & push flow」段新增一條規則，見下方「重要決定」。

### 驗證

- 4 個負向測試逐一實測，確認新邏輯抓得到全部四種錯法（此輪新增的第
  1/2 項是 Session 92 測不到的，第 3/4 項沿用 Session 91/92 就有的
  missing/unexpected 覆蓋範圍，改寫後沒有退化）：
  - 反轉全部 import 順序 -> 三頁 FAIL，訊息印出 expected 與 actual 的完整
    順序供比對
  - 重複 import `shell.css` -> 三頁 FAIL
  - 拿掉 `modals.css` -> 三頁 FAIL
  - 加一個不在清單內的 `nonexistent-extra.css` -> 三頁 FAIL
- 每次負向測試後還原 app.css，確認正向案例（未改動的當前檔案）依然
  三頁全 PASS（11/9/10 checks），沒有引入新的誤判
- 4 個 lint 全 pass、`git diff --check` pass

### 重要決定

- 順序驗證訂為嚴格規則（陣列必須完全相等，不只是集合相等）：這不是
  新加的限制，`page-architecture.md` 已經明文記錄 domain CSS 的 cascade
  順序（shell -> dashboard -> modals -> room-booking -> order-processing）
  是既定決策，這次只是把既有決策變成機器可判定
- 沒有另外處理「順序打亂目前無害（zero selector 重疊）」這件事本身要
  不要留檔；判斷是機制上鎖死順序比另外去維護一份 selector 重疊白名單
  更簡單，不需要額外機制
- **使用者明確裁決**：Session 92 只修 Session 91 的 stale「下一步」、沒有
  回頭改 Session 89 同樣的舊句型，這個做法是對的，不要做全面回溯改寫。
  歷史 session 是凍結記錄，全面洗會降低時間線可信度。此原則已寫入
  `start.md` 的「commit & push flow」段（新增一條：發現舊 session 有同類
  stale 寫法時只修最新一筆，不回溯改寫），後續以 start.md 為準，不引用
  repo 外、不可驗證的 memory 系統當交接證據。

### 下一步

- 本輪進入 commit/push flow；實際 SHA 與遠端狀態以 git history 為準

### 未解問題

- 無

---

## Session 92 交接 (2026-07-04)

### 任務: 收緊 Session 91 後續防線與 commit/push 交接規則

使用者指出多 agent 協作時，先在 progress 寫「未 commit / 未 push」或
「驗收後 commit / push」，但同一輪後續又真的 commit/push，會讓下一輪
讀 progress 時多一個判讀誤會點。使用者裁決：修 review 提到的 1/2/3。

### 本輪改動

1. `scripts/smoke-test.mjs`：`APP_CSS_LOADED_CHECK` 由「至少有 import 且
   imported stylesheet 非空」收緊為 exact expected imports。`app.css` 必須
   import 且只 import `shell.css`、`dashboard.css`、`modals.css`、
   `room-booking.css`、`order-processing.css`，並且每個 domain CSS 的
   `cssRules.length > 0`。
2. `start.md`：Browser smoke test 規則補上 CSS entrypoint / domain CSS import
   結構變更；commit & push flow 補規則：不要在 progress.md 留下同一個
   commit/push flow 內會立刻失效的 git 狀態句，例如「本輪未 commit / 未 push」
   或「驗收後再 commit / push」。
3. `specs/progress.md`：修正 Session 91 的 stale 下一步，改記 `a9c64dc` 已
   commit/push；避免最新交接讓下一輪誤以為還有待推送工作。

### 驗證

- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-tokens.sh` exit 0（token mirror ok）
- `./scripts/lint-partials.sh` exit 0（3 pages, 3 standalone）
- `git diff --check` exit 0
- `node scripts/smoke-test.mjs` exit 0：landing 11 checks、
  order-processing 9 checks、room-booking 10 checks

### 待你驗收

- 本輪變更待使用者驗收；若後續進入 commit/push flow，實際 SHA 與遠端狀態以
  git history 為準。

---

## Session 91 交接 (2026-07-04)

### 任務: 修復 Session 90 app.css 斷頭註解回歸 + 補 smoke test 防線

使用者要求分析 Session 90 完成度與優缺點；分析過程中發現嚴重 bug（見下），
使用者確認後修復並補上機器可判定的回歸檢查。

### 發現的問題

`preview/assets/css/app.css`（Session 90 e53d08f 產出的 8 行 entrypoint）
頭兩行各自開了 `/*` 卻整份檔案沒有任何 `*/`：

```css
/* App CSS entrypoint - keep this file linked by every preview page.
/* Actual styles are split by domain to keep future diffs scoped.
```

CSS 註解不巢狀，第一行沒關閉導致從檔首到檔尾（含全部 5 個 `@import`）都被
吞進同一個未閉合註解。瀏覽器實測 `document.styleSheets` 顯示 app.css
`cssRules.length === 0` - `shell.css`/`dashboard.css`/`modals.css`/
`room-booking.css`/`order-processing.css` 五個分域檔全部沒有載入，三頁皆同。

視覺上 landing dashboard 乍看正常（多數版面是 Tailwind utility class），但
room-booking 日曆整個沒有格線佈局（純文字堆疊）、modal 沒有置中與 backdrop
遮罩。截圖：`specs/qa-screenshots/session-90/app-css-broken-*.png`（壞掉）
與 `app-css-fixed-*.png`（修復後對照）。

**為什麼所有既有驗證都沒攔到**：`lint-conventions.sh` 只 regex 檢查逐行
pattern，不驗證 CSS 語法／註解是否閉合；`smoke-test.mjs` 只檢查 JS 驅動的
state（console 錯誤、chart 資料、classList 開關），modal 的
`classList.add("open")` 不依賴 CSS 有沒有載入，測不出視覺回歸；Session 90
自己的「文字內容比對」（舊 app.css vs 新 5 檔合併）只證明搬移沒漏內容，
沒驗證 entrypoint 實際上有沒有成功 import 進去 - 這是這次才補上的驗證缺口。

### 本輪改動

1. `preview/assets/css/app.css`：頭兩行合併成一個正確閉合的多行註解。
2. `scripts/smoke-test.mjs`：新增 `APP_CSS_LOADED_CHECK`（前置到三頁
   checks 陣列最前面）。直接讀瀏覽器解析出的 CSSOM：app.css 至少要有
   1 條規則（`@import` 本身是一條 `CSSImportRule`），且每個 `@import`
   進來的分域檔案自己的 `cssRules.length > 0`；兩者缺一即 FAIL 並印出
   哪個 stylesheet 是空的。

### 驗證

- 負向測試：把 app.css 還原成斷頭註解版本重跑 smoke test，三頁皆準確
  FAIL 在新檢查項（`app.css has 0 rules`），確認新檢查真的抓得到這個
  bug，不是虛設
- 修復後：4 個 lint 全 pass、smoke test 三頁 PASS（11/9/10 checks，比
  Session 90 版多了新的 CSS 檢查項）、`git diff --check` pass
- 瀏覽器截圖確認 room-booking 日曆格線與 modal 置中/backdrop 皆恢復正常

### 重要決定

- 這個 bug 屬於「site-wide 視覺回歸但所有既有機器化驗證都測不出來」的
  類型，值得記一筆：純文字/宣告集合比對（source diff）不能替代「實際在
  瀏覽器解析後 CSSOM 有沒有東西」這一步；往後改動 CSS entrypoint / 拆檔 /
  改 `@import` 結構時，跑 smoke test 就會連帶測到這層
- Session 90 的 progress.md 交接寫「本輪未 commit / 未 push」但實際上已
  commit（`e53d08f`）；這次沒有另外修正該筆歷史記錄（歷史 session 段落
  維持原文，不回頭改），只在這裡點名這個落差供後續參考

### 下一步

- 本輪已 commit/push：`a9c64dc`。待使用者驗收修復結果；日曆與 modal 視覺
  應與 Session 89 之前等價。

### 未解問題

- 無

---

## Session 90 交接 (2026-07-04)

### 任務: app.css 分域拆分與 demo data 決策

使用者裁決：
- Runtime 功能先觀察下一個需求碰到哪塊，不主動重構。
- `app.css` 可以直接拆分，降低後續樣式協作衝突。
- `purchase-addon-modal.js` 暫不再拆；加購商業邏輯將來由後端實作，目前只需維持
  demo 互動效果。
- Smoke test 擴成深流程與 demo data 抽離都不急；同樣基於將來後端會接手商業
  邏輯，現階段不要把 demo 做成假正式架構。

### 本輪改動

1. `preview/assets/css/app.css` 改成 8 行 CSS entrypoint，只保留 import 順序：
   `shell.css` -> `dashboard.css` -> `modals.css` -> `room-booking.css` ->
   `order-processing.css`。三個 HTML 仍只 link `app.css`，不分散載入順序。
2. 新增分域樣式檔：
   - `shell.css`：aside / topbar / page tabs / mobile drawer / shell utilities
   - `dashboard.css`：landing dashboard chart wrappers 與 legend swatches
   - `modals.css`：共用 modal sizing、member-data、order-summary、sms、
     purchase-addon、arrival-method 等 modal 樣式
   - `room-booking.css`：room-booking [A]-[E]、inventory、order-data、
     booking-detail table、calendar
   - `order-processing.css`：op table、status pill、badges、row menu、
     accordion gradient
3. `scripts/lint-conventions.py` / `.sh`：raw hex / rgb 檢查由只看 `app.css`
   擴成所有 `preview/assets/css/*.css`，避免拆檔後規則退化。
4. `start.md`、`specs/page-architecture.md`、`scripts/README.md` 與相關
   component/page spec：更新 CSS 分域來源與協作規則；樣式引用指到實際分域檔。

### 驗證

- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-tokens.sh` exit 0（token mirror ok）
- `./scripts/lint-partials.sh` exit 0（3 pages, 3 standalone）
- `git diff --check` exit 0
- `node scripts/smoke-test.mjs` exit 0：landing 10 checks、
  order-processing 8 checks、room-booking 9 checks

### 待你驗收

- 本輪未 commit / 未 push。
- CSS 拆分是檔案結構調整；沒有改 HTML stylesheet contract、沒有改互動邏輯。
- Demo data 暫不抽離；除非後續資料重複阻礙維護或需要作為 test fixture，再另議。

---

## Session 89 交接 (2026-07-04)

### 任務: Session 87-88 後的規格去舊架構誤導

使用者要求檢查 `start.md` 與相關 `.md` 是否仍寫舊架構，避免下一輪 AI
agent 誤把已退役的 landing SPA / placeholder / landing.css 規則當 current
source。

### 本輪改動

1. `start.md`：頁面架構改成 `landing.html = dashboard-only`；房間預定與
   訂單處理明確為獨立頁；專案結構補 `app.css`；tooltip 參考實作改指
   `preview/js/order-processing.js`；巢狀 modal 規則標明 `orderEdit_` clone
   為舊 SPA 歷史做法；HTML 驗證來源改為 `components/` + `specs/pages/`，
   `sections/` / `layouts/` 只作 frozen-reference。
2. `specs/page-architecture.md`：導航與遷移策略改為 current；aside 未拆頁項目
   明確維持 inactive、不開 placeholder、不新增空白頁；Stage 4 產出改標
   Session 88；Stage 0-4 表格改為 landed/self-tested；Stage 1 細節改標歷史
   執行要點，不作 current 指令。
3. `components/modal.md`、`components/order-condition.md`、
   `components/order-edit-modal.md`、`components/button.md`、
   `components/title.md`、`components/arrival-method-modal.md`、
   `specs/pages/order-processing.md`、`specs/html-conventions.md`、
   `specs/order-processing-reading-notes.md`：把仍指向 `preview/landing.html`
   或舊 SPA tab 的現在式文案改成 current partial / ES module / app.css 來源；
   移除容易和 inline style 禁令混淆的「inline 價」說法。

### 驗證

- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-tokens.sh` exit 0（token mirror ok）
- `./scripts/lint-partials.sh` exit 0（3 pages, 3 standalone）
- `git diff --check` exit 0

### 待你驗收

- 本輪只改文件與規格，不改 preview runtime。
- 2026-05 的歷史 audit 檔仍保留原文；它們不是 current source。
- 本輪未 commit / 未 push。

---

## Session 88 交接 (2026-07-04)

### 任務: order-modals.js 拆小（Stage 4，Session 87 排定的第 6 項）

同一對話接續 Session 87：使用者驗收 5 項改善後指示先交接 commit
（9e51417），再進行 order-modals.js 拆分。走 start.md「JS 搬移/略搬 audit」
規則：先列全部 bindings 與 disposition，再搬，再逐顆按鈕實測。

### 本輪改動

1. `preview/js/order-edit-modal.js`（新，68 行）：`initOrderEditModal()` ->
   `{ build }`。訂單修改 body fetch `partials/room-booking-sections.html` +
   四項差異（[A] 標題「庫存」、移除 customer-toggle、訂單編號列、[D] 還原鈕）
   + `initRoomBookingBehaviors(body)` + 切庫存模式。原樣搬移，無邏輯變更。
2. `preview/js/purchase-addon-modal.js`（新，893 行）：`initPurchaseAddonModal()`
   -> `{ reset }`。12 產品資料 + 分類 label + editor/cart state + 渲染
   （products/cart/page-cart）+ simple calendar（portal to body）+ 全部
   modal-scope 與 page-scope event binding。`window.renderPurchaseAddonCart`
   對外介面保留（order-edit-modal.js 注入後 rehydrate 用）。
3. `preview/js/member-data-modal.js`（新，142 行）：`initMemberDataModal(modalApi)`。
   委派 trigger（`data-data-exists-trigger` / `data-change-contract-company-trigger`）
   + nation-group / honorific / 會員身份 radio / Title chip / filter tab，
   全部 IIFE 原樣搬入。
4. `preview/js/order-summary-modal.js`（新，123 行）：`initOrderSummaryModal(modalApi)`
   -> `{ reset, setVariant }`。variant（未付款/已付款/候補單）+ accordion +
   `[data-order-summary-submit]` 委派開啟（原與 op-menu 合併在同一
   document listener，拆開後兩者 closest 目標互斥，行為不變）。
5. `preview/js/order-modals.js`（1314 -> 124 行，orchestrator）：保留
   `setRoomEditLocked/resetRoomEditModal`、modalApi 組裝（`beforeOpen` 依 id
   分派到子 module 的 `reset()`）、op 選單接線（訂單/簡訊/修改）、到店
   「確定」關閉、訂房明細編輯 lock/clear IIFE。對頁面介面不變：
   `initOrderModals()` 仍回傳 `{ openModal, closeModal }`（rb 頁餵給
   `initArrivalMethodModal`）。四個新 module 皆 import 進 orchestrator 並在
   `initOrderModals()` 內呼叫初始化；HTML 的 `<script type="module">` import
   與 MANIFEST 不變（頁面只 import `order-modals.js`，未新增/減少 import）。
6. `components/order-edit-modal.md`：實作備註更新，body build 邏輯來源改標
   `order-edit-modal.js`（觸發鏈仍在 orchestrator）。
7. `specs/page-architecture.md`：新增 Stage 4（非原始計畫項，本次追加），
   記錄 4 module + orchestrator 的職責切分。

### 驗證（self-tested）

- 5 個 module 全數 `node --check` 語法通過
- 靜態 scope 檢查：purchase-addon-modal.js 不引用 openModal/closeModal/其他
  子 module 內部函式；orchestrator 不殘留任何子 module 的內部函式定義
- 四 lint 全 pass（conventions/fonts/tokens/partials）；smoke test 三頁 PASS
- **自寫 CDP 逐按鈕 audit**（scratchpad，未入 repo）：38 項 check 全 PASS，涵蓋
  房型介紹/訂房明細編輯（lock/clear/reset)/加購（12 產品/stepper/cart/
  page-cart/分類/收合/simple-calendar/reopen-reset）/訂單明細（variant/
  accordion）/到店方式（確定關閉）/會員資料（nation/honorific/身份/chips/
  filter-tab）/合約公司（三層巢狀 z-index + 疊層 scroll-lock），每個 modal
  的每顆 close-btn 逐一開關測試，op 頁另測 `[data-op-menu-action]` 三分支
  + 三層巢狀（修改 -> 會員資料 -> 合約公司，z-index 遞增驗證）+ [E] 送出
  巢狀開啟 + 收尾無殘留開啟 modal / body scroll 正確解鎖
- **回歸比對**：同一份 audit script 對 commit 9e51417（拆分前）跑一次作
  baseline，同樣 38/38 PASS，證明拆分前後行為等價，不是「audit 本身寫鬆」
- 過程中抓到並修正 audit script 自身的兩個誤判（非產品 bug）：
  `closeButtons` helper 早期版本回傳 button 數量導致誤判「數量不符」，改回傳
  true/string；reopen 用 async IIFE + microtask tick 前同步檢查誤判「未重開」

### 重要決定

- orchestrator 保持是頁面 import 的唯一入口，不讓四個新 module 各自被
  HTML `<script type="module">` import - 避免 MANIFEST 與 bootstrap 順序
  跟著變動、風險外溢到 partial dependency 這層
- `beforeOpen` 對子 module reset 用 late-bind 變數（`purchaseAddon`/
  `orderSummary` 先宣告後賦值）：`createModalController` 建立時 reset 尚未
  存在，但只在使用者實際觸發 open 時才呼叫，順序安全

### 下一步

- 使用者驗收 Stage 4（純內部重構，頁面行為應與 Session 87 commit 前完全
  一致；無新視覺差異，不需新截圖）
- 驗收後依指示 commit / push

### 未解問題

- 無

---

## Session 87 交接 (2026-07-04)

### 任務: Stage 3 驗收後的基建改善批次（使用者核准的合併優先序 1-5）

背景：使用者驗證 Session 86 Stage 3 重構後，提出 6 項改善並與 AI 觀察合併排序。
本輪執行前 5 項；第 6 項（order-modals.js 拆小）獨立 session 再做。

### 本輪改動

1. `scripts/smoke-test.mjs`（新）：browser smoke test。零依賴（Node >= 22 原生
   WebSocket + 系統 Chrome headless CDP + python3 http.server，無 npm 套件）。
   三頁載入 console 無 error、landing 4 chart 實例化且 dataset 非空、aside
   accordion/收合全部/mobile drawer、session modals（backdrop 關 + close-btn 關
   + ESC 關 + body scroll lock 驗證）、landing 3 topbar modal、op 列表與 modal
   partial 掛載、rb calendar 42 格。不進 pre-commit hook（需 Chrome、秒數級），
   改頁面/partial/module 後手動跑 `node scripts/smoke-test.mjs`。
2. `scripts/lint-partials.py` + `.sh`（新）：partial dependency manifest 機器檢查。
   MANIFEST 權威登記每頁必載 partials 與 JS module import 順序；檢查未登記頁面、
   漏載/多載 partial、module 順序、組合後 duplicate id、data-modal-open 與
   modal-close-btn data-modal 目標存在性。已加入 pre-commit hook
   （scripts/git-hooks/pre-commit 與 .git/hooks 同步更新）。
3. `preview/assets/css/landing.css` 改名 `app.css`（git mv）：更新三頁 link、
   lint-conventions.py/.sh 規則路徑、scripts/README.md、page-architecture.md、
   3 個 spec 提及處；檔頭加 6 大區段索引（shell / topbar modals / order-edit
   member-data / op-* / room-booking / arrival）。歷史交接（progress archive）
   內的 landing.css 字樣依規則不改。
4. aside 收斂（`preview/partials/aside.html` + `app.css`）：
   - markup class 修正為與 dropdown-aside.md 一致：13 個父分類 text-menu ->
     text-text-default（Neutral/800）、24 子項 div 與 2 個 anchor
     text-text-default -> text-menu（MenuItem/Default）
   - 移除 app.css 的 .menu-category 顏色覆蓋規則兩條（Session 85 遺留的
     「markup 與渲染相反」誤導源，markup 現在是單一來源）
   - 24 個未拆頁子項加 data-nav-state="inactive" + cursor-default + 移除
     hover:bg-surface-hover（真實連結的 2 個 anchor 保持 pointer + hover）
5. `specs/page-architecture.md`：新增「Partial dependency manifest」段、
   「CDN dependency matrix」表（Tailwind 全站 / chart.js 只 landing / dayjs+isoWeek
   op+rb / swiper 只 rb）；CSS 歸屬段當時記錄 app.css 改名決策與中期拆分方向
   （分域拆分已於 Session 90 執行）。
6. `start.md`：產出驗證新增 lint-partials 與 browser smoke test 兩個 checklist 項。
7. progress.md 歸檔：Session 63-72 搬到 `specs/progress-archive-s63-s72.md`
   （新檔），本檔剩 Session 73-87。
8. `components/arrival-method-modal.md`：本輪 touched 行順帶清 U+2212 減號為
   ASCII "-"（lint 對修改行強制）。

### 驗證（self-tested）

- 四 lint 全 pass（conventions / fonts / tokens / partials）
- smoke test 三頁全 PASS（10 + 8 + 9 checks）；負向測試 x2 驗證會抓真的壞：
  弄壞 chart id -> landing FAIL、移除 landing session-modals partial ->
  lint-partials 同時抓到漏載與 modalLogout/Switch 死按鈕
- aside computed style 瀏覽器實測：父 rgb(69,69,69)、子與 anchor
  rgb(33,120,207)、inactive cursor=default、24 個標記齊
- 截圖 specs/qa-screenshots/session-87/（desktop-1440、mobile-drawer-390）
- pre-commit hook 手動執行 pass

### 重要決定

- **推翻 page-architecture.md 舊決策「landing.css 沿用不動」**：使用者指出
  multi-page 後檔名誤導影響範圍，裁決改名 app.css；中期拆分（shell/modals/
  dashboard/rb/op）時機未定
- smoke test 不進 pre-commit（需 Chrome、秒數級），定位為手動 QA 步驟；
  靜態組裝檢查（lint-partials）進 hook
- aside 未啟用項不建 placeholder 頁（維持 Session 85 裁決），改用
  data-nav-state="inactive" 語意標記；同時移除其 cursor-pointer 與 hover 效果
  （AI 判斷延伸，Figma 未定義 inactive 態，使用者驗收時可否決）
- 新頁面上線 checklist 變更：必須登記 `scripts/lint-partials.py` MANIFEST，
  否則 pre-commit 擋下

### 下一步

- 使用者已於 localhost 驗收 5 項（含 aside inactive 維持低調版的裁決），
  指示交接 commit（不 push）
- commit 後同對話接續：order-modals.js 拆小（order-edit / purchase-addon /
  member-data / order-summary 各自成 module；對頁面保持 initOrderModals()
  單一入口不變，MANIFEST 免改），走 JS binding disposition audit +
  modal 按鈕逐顆實測

### 未解問題

- smoke test 依賴系統 Chrome 路徑（可用 CHROME_BIN 環境變數覆蓋），CI 環境
  若無 Chrome 需另處理（目前無 CI，不急）

（已裁決：aside inactive 項維持「cursor default + 無 hover」低調版，不加
灰字/透明度等可見樣式；使用者確認目前不重要，Figma 補 inactive variant
之前不再動）

---

## Session 86 交接 (2026-07-04)

### 任務: 交接 commit 後執行 Stage 3 - landing dashboard-only + JS 去重

### 前置交接 commit

- 先依使用者指示提交 Session 85 review 修正與 inline style / color token 回歸：
  `c48a3c7 Fix preview shell regressions and token styles`

### 本輪改動

1. `preview/landing.html`：清成 dashboard-only（4906 -> 1204 行）。移除 `subPageContent`、PAGE_TEMPLATES placeholder SPA、`initSubPageBehaviors` / `initCalendar` / op-* / room-booking / arrival / purchase-addon / order-summary 殘留 JS；移除 dayjs / Swiper CDN；landing 不再同步 XHR 注入 aside/topbar/session modal，改走 `data-partial` + `loadPartials()`。
2. `preview/js/modal-controller.js`（新）：抽出共用 modal open / close / backdrop / ESC / focus return / dynamic z-index，供 landing 與 order/room 兩頁共用。
3. `preview/js/landing-modals.js`（新）：只保留 landing dashboard 需要的三個 topbar modal（管理訊息 / 旅宿e管家公告 / 會員安全管理）、session modal trigger、member tab、eye toggle、bulletin/administer tabs、bulletin row toggle。
4. `preview/js/landing-charts.js`（新）：四張 dashboard Chart.js 圖表自 inline script 搬成 module。
5. `preview/js/order-modals.js`：改用 `modal-controller.js`，移除重複的 generic modal open / close / backdrop / ESC listener；保留 order/room 專屬 modal reset 與資料行為。
6. `preview/js/page-shell.js` / `partials.js` / `room-booking-behaviors.js` / `order-processing.js` / `arrival-method-modal.js` / `partials/session-modals.html`：更新 Stage 3 後的註解，移除 landing inline / sync XHR 過渡描述。
7. `specs/page-architecture.md`：更新 current architecture：landing = dashboard only；所有頁面都使用 `js/partials.js` async partial；Stage 3 標為 self-tested。

### 驗證（self-tested）

- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `git diff --check` pass
- `preview/`（排除 SVG asset/temp）`style=` 搜尋無結果
- landing 殘留搜尋無結果：`dayjs` / `Swiper` / `subPageContent` / `PAGE_TEMPLATES` / `initSubPageBehaviors` / `XMLHttpRequest` / `onclick=` / room/order/arrival/purchase modal selectors
- JS syntax pass：`partials.js`、`page-shell.js`、`modal-controller.js`、`landing-modals.js`、`landing-charts.js`、`order-modals.js`、`order-processing.js`、`room-booking-behaviors.js`、`arrival-method-modal.js`
- partial 組合檢查：landing / order-processing / room-booking duplicate id = 0；modal-open target missing = 0
- HTTP HEAD：`landing.html` / `order-processing.html` / `room-booking.html` 皆 200

### 重要決定

- aside 其餘未拆頁選單項在 landing 也不再開 placeholder SPA；和兩個新頁一致，未來有真實頁面再接真實連結。未新增空白 placeholder html。
- landing 專屬 modal 暫留在 `landing.html`，未再拆 partial；目前只有該頁使用，先避免為單頁專屬內容增加額外 partial。

### 下一步

- 使用者驗收 Stage 3；若通過，再依指示 commit / push。

---

## Session 85 交接 (2026-07-04)

### 任務: Stage 2 - 拆房間預定 -> room-booking.html（同一對話接續 Session 84；使用者驗收 1d 後指示直接開工）

### 本輪改動

1. `preview/room-booking.html`（覆蓋 superseded 舊檔，103 行）：獨立房間預定頁。內容 = `data-partial="room-booking-sections"`（與訂單修改 modal body 同一來源）+ aside/topbar/room-booking-modals/session-modals partials。頁面 module 順序：loadPartials -> initPageShell -> initRoomBookingBehaviors(#rbPageContent) -> initOrderModals()（回傳 modalApi）-> initArrivalMethodModal(modalApi)。head 補 Swiper CDN + CSS（接送卡片依賴）。
2. `preview/js/arrival-method-modal.js`（新，420 行）：landing arrival IIFE 全量搬出 - 13 個 event bindings 逐一 disposition **全搬無略過**（依 start.md「JS 搬移/略搬 audit」規則）：chip 切換、開啟時 label->chip 同步、確定 commit label + 關閉（closeModal 走 initOrderModals 回傳的 modalApi，單一來源）、車輛 stepper、接送雙 swiper（新增/刪除/箭頭/dots/lazy init）、生效日 simple calendar。order-processing.html **不載入**本 module（使用者同意該頁到店維持靜態 + 開關）。
3. `preview/js/page-shell.js`（新，69 行）：aside accordion 收合 / 「收合」全部 / mobile drawer 開關，自 landing 對應 IIFE 搬出；room-booking 與 order-processing 兩頁共用。`partials.js` markActivePage 補 accordion icon open 態同步。
4. `preview/partials/session-modals.html`（新，125 行）：確定登出（A）/ 帳號切換（B）自 landing 抽出 - aside 的 登出/更換帳號 icon 用 data-modal-open 觸發，aside 是全站 partial，這兩個 modal 必須全站存在。landing 以 sessionModalsMount sync 注入；兩個新頁 data-partial async 注入。
5. `preview/js/order-modals.js`：會員資料 modal 的 nation-group 改為自行綁定（room-booking 頁沒有 initOrderProcessing 可依賴），以 `data-nation-init` guard 防重複；order-processing.js 與 room-booking-behaviors.js 的 nation-group 綁定套同一 guard。initOrderModals() 改回傳 `{ openModal, closeModal }` 供其他 module 使用。
6. `preview/partials/aside.html`：房間預定 -> `<a href="./room-booking.html">`（同 訂單處理 pattern）；desktop logo 包 `<a href="./landing.html">`（logo = 回今日總覽 全站慣例）。兩個新頁 mobile top bar 的 logo 也包同連結。
7. `preview/landing.html`（5028 -> 4912 行）：tpl-room-booking（含 roomBookingSectionsMount sync 注入）移除；Modal A/B 改 sessionModalsMount 注入；PAGE_TEMPLATES 清空（雙頁皆真實連結，其餘選單項維持 placeholder SPA 頁）。

### 驗證（self-tested）

- 三 lint pass、`git diff --check` pass、三頁 inline scripts parse OK（5/1/1）、三頁組合 duplicate id 均無
- room-booking.html（1440）：console 無錯誤；[A] calendar 42 格渲染 + 庫存模式 + 月曆 offcanvas teleport/日期關閉；[B] 加購 12 產品 + stepper 連動頁面 cart（3 行）；[D] 會員資料 modal 國籍外籍連動（新綁定）+ 合約公司疊層 60/65 + customer toggle 連動（合約欄位顯示 + 合約 tab 自動 active）+ lock toggle；[E] 產生訂單 variant 對應（official -> 已付款）
- 到店方式完整互動：chip 切換 panel、stepper 0->1、接送 swiper 卡片 1->2、確定 commit「包車或專車」寫回 [D] label + 關閉
- footer/header 按鈕逐顆實測（rb 頁 10 個 modal、28 顆）：全部 closes、無殘留開啟
- aside（page-shell）：accordion 展開/收合、收合全部、mobile drawer（menu 鈕開 / backdrop 關 / X 關）、登出與帳號切換 modal 確定/取消 closes
- mobile 390：無水平溢出、drawer 正常、加購 modal 貼齊視窗
- order-processing 回歸：console 無錯誤、session modals 生效、accordion 生效、房間預定連結、修改 modal body 4 區塊、nation guard 單次綁定且外籍連動正常
- landing 回歸：console 無錯誤、dashboard 4 charts、compact/aside 登出與帳號切換（經新 partial）、雙頁連結、placeholder SPA 頁開關與返回 dashboard、aside logo 連結、tpl 已除
- 截圖 specs/qa-screenshots/session-85/（room-booking 1440/390、到店接送 swiper）

### 重要決定

- 返回 landing 的導航裁決：**logo = 回今日總覽（landing.html）**，aside desktop logo 與兩個新頁 mobile logo 都包連結；原 open question 的「landing.html 帶 hash 開子頁」已無必要（兩個子頁皆獨立頁）
- Modal A/B 抽成 session-modals partial 納入 Stage 2 範圍：aside 是全站 partial，其 登出/更換帳號 觸發的 modal 不能只存在 landing（否則新頁上是死按鈕，與 Session 84 使用者連續抓到的死按鈕同類）
- op 頁到店方式維持靜態 + 開關（使用者 Session 84 同意），不載 arrival module；rb 頁載入完整互動版
- nation-group 統一 `data-nation-init` guard 慣例（三個 module 同 guard，先跑者生效）
- 使用者粗測通過後裁決：Stage 3 對 aside 其餘選單項維持現況即可（landing 保留既有 placeholder SPA 頁；兩個新頁不額外新增空白 placeholder 頁），未來有對應頁面再展開。

### 使用者回報修正（commit a2e0614 後）

- aside 選單顏色：使用者指出 房間預定/訂單處理 兩個子項變黑（其餘子項藍）。根因：`landing.css` 的 `.menu-category .accordion-trigger + div > div`（子項藍色規則）不匹配 Stage 1d/2 改成的 `<a>`，兩個連結掉回 markup class 的深色。修正：selector 改 `> :is(div, a)`。瀏覽器驗證三態：父 rgb(69,69,69) 深、全部子項含兩個 anchor rgb(33,120,207) 藍；截圖 aside-menu-colors-fixed-1440.png
- **分析更正**：我先前判斷「markup class 從第一天就把父/子顏色寫反」時漏看了 landing.css 這層覆蓋 - 實際渲染一直符合 dropdown-aside.md 規格（父 Neutral/800、子 MenuItem/Default）。教訓：查顏色問題必須看 computed style，不能只讀 markup class（cascade 有多層來源）
- 遺留（Stage 3 順手項）：aside markup 的 Tailwind class 與渲染結果相反（父 text-menu / 子 text-text-default，被 landing.css 蓋掉），易誤導，收斂時應把 markup class 改正並移除覆蓋規則其一

### Review 修正（Session 79-85 對照後）

- `page-shell.js` 補新頁 desktop aside 收折/展開、role filter（飯店/總部）與 compact 登出/更換帳號入口；新頁沒有公告/訊息/會員安全管理 modal，因此對應 function icons 於新頁隱藏，避免 visible dead controls。
- 清理已退役的 `orderEdit_` runtime CSS：移除 `#orderEdit_*` modal selector、`.modal-layer-2` 與 `--z-modal-layer-2`。現行 multi-page 疊層由 `order-modals.js` 動態 z-index（60 + N*5）處理。
- `components/order-edit-modal.md` 改成 current implementation notes：body 來源為 `partials/room-booking-sections.html`，巢狀 modal 不再使用 `orderEdit_` clone；`specs/page-architecture.md` Stage 3 描述改為 topbar/aside 行為模組化與 JS 去重。
- Inline style / color token 回歸：使用者指出 start.md 早已禁止任意 inline style 與 hard-coded color。追溯確認兩個近期來源：POS 入口 inline style 來自 `b9722a8c`（Session 77 抽 aside），訂單處理 status dots inline style 來自 `5cf5af7d`（Session 81-83 commit）。另有更早 landing chart、toggle、room-booking partial inline style 因 lint 只檢查新增行而未被攔。修正：`preview/`（排除 SVG asset/temp）所有 HTML `style=` 清零；顏色/effect 改 class + CSS variable；新增 `--effect-switch-knob-shadow` / `--effect-bottom-sheet-shadow` / `--effect-dropdown-shadow`；`scripts/lint-conventions.py` 補新增行禁止 `style=` 與 landing.css raw rgb/rgba。

### 下一步

Stage 3：landing 清理只剩 dashboard（移除 inert 的 initSubPageBehaviors/initCalendar/op-* 綁定、modal 系統與新 module 收斂去重、page-tab chips 機制依上方裁決維持現況）、topbar/aside 行為與 partial 邊界收斂、C/D/E modal 是否抽 partial 待定。

### 未解問題

- landing 內大量 inert code（initSubPageBehaviors 全部 + modal 系統中 rb 專屬分支）待 Stage 3 清理；目前無害但佔 ~2500 行

---

## Session 84 交接 (2026-07-04)

### 任務: Stage 1d - 搬 modal 並退役 orderEdit_ clone（landing 拆頁重構 Stage 1 收尾）

### 本輪改動

1. `preview/partials/room-booking-modals.html`（新，2009 行）：自 landing.html 抽出 8 個共用 modal + 庫存月曆 offcanvas（房型介紹 / 訂房明細編輯 / 加購 / 訂單明細 / 簡訊 / 到店方式 / 會員資料 / 更換合約公司 / invCalendarOffcanvas）。landing 以 sync XHR 注入（`roomBookingModalsMount`，同 aside 模式，位置在原 Modal F 處、主 script 之前）；新頁以 `data-partial` async 注入。
2. `preview/js/room-booking-behaviors.js`（新，1348 行）：landing 的 `initSubPageBehaviors` + `initCalendar` 原樣搬出（root-scoped），export `initRoomBookingBehaviors`。唯一調整：offcanvas 解析固定用單一 `invCalendarOffcanvas`（新頁獨立 document，無副本分流）。
3. `preview/js/order-modals.js`（新，1372 行）：modal 開關核心（動態 z-index 60+N*5、疊層感知 scroll lock、delegated close/backdrop/ESC + data-no-dismiss）、op 選單接線（訂單 / 簡訊 / 修改）、`buildOrderEditModalBody` 改為 fetch `partials/room-booking-sections.html` 注入 + 四項差異（[A] 標題「庫存」、移除 customer-toggle、訂單編號列、[D] 還原鈕）+ `initRoomBookingBehaviors(body)` + btnInventory 切庫存模式、加購渲染系統整包（產品資料 + render + cart + 互動）、訂單明細 variant/accordion、訂房明細編輯 lock/clear、會員資料 honorific/身份/chips/tabs、會員資料與合約公司 delegated triggers。
4. `preview/order-processing.html`（740 -> 812 行）：加 modal partial mount + 訂單修改外殼 markup + `initOrderModals()`。
5. `preview/landing.html`（7910 -> 5028 行）：移除 `tpl-order-processing`、訂單修改外殼、`ensureOrderEditModalClone` / `buildOrderEditModalBody` / `resolveScopedModalId` / `window.initSubPageBehaviors` export、PAGE_TEMPLATES 的訂單處理項；[E] 送出與會員資料 / 合約公司 trigger 改直開原 instance；initCalendar 的 offcanvas 分流簡化為單一 id。
6. `preview/partials/aside.html`：訂單處理改 `<a href="./order-processing.html">`（landing SPA click 綁定 selector 只認 div，anchor 自然走原生導航）。`preview/js/partials.js`：markActivePage selector 改 `:is(div, a)`，並展開 active 項所屬分類（新頁無 accordion JS，收合會看不到 active）。
7. lint 修正：新增行 min-w 全部 md: gate（記錄表 1000px / count pill 38px / 數量 badge 33px / price table 343px，皆在 overflow 容器內或有 padding 撐底，mobile 視覺不受影響）；裝飾性 Unicode 全數 ASCII 化。
8. 使用者回報修正：到店方式 modal footer「確定」在新頁沒有關閉效果。全面 audit 後確認全 repo 只有這一顆按鈕靠 landing 的 arrival IIFE handler 關閉（`data-am-action="confirm"` -> commit + closeModal），其餘所有 modal 的 確定/取消/確定加購/修改 都是 `.modal-close-btn` + `data-modal`（delegated close 已涵蓋）。order-modals.js 補 delegated handler：confirm -> closeModal（commit 寫回 label 的部分不搬 - 本頁 chips 不可切換，commit 無實質意義且可能覆寫 [D] label）。

9. 使用者回報修正（第二輪）：landing 的 登出（modalLogoutBackdrop）/ 帳號切換（modalSwitchBackdrop）/ 會員安全管理（modalMemberBackdrop）三顆 footer「確定」也沒有關閉效果。git 溯源：三顆自各自誕生的 commit（dec65b4 / 5c6cc93）就沒有 modal-close-btn 也沒有 JS handler，一路到 1d 前的 HEAD 都是死按鈕 - 既存 bug，非 1d 引入。依 landing 凍結例外（bug 修正 + 使用者指名）補上 `modal-close-btn` + `data-modal`。隨後把關閉語意按鈕掃描擴大到全 repo 三個檔案的所有 modal（含 aria-label、送出/儲存/完成 等字樣）：除到店「確定」為 handler-based（兩頁皆已接線）外，其餘全數有關閉機制。瀏覽器實測三顆 確定 + 三顆 取消 全部 closes。
   - **定性更正（使用者質疑後查證）**：我曾在對話中推測這三顆是「當初被當成後端動作所以前端沒做關閉」- 全 repo 與 git log 查無任何此類指令，使用者從未下過這個命令，該推測撤回。實際上 `components/modal.md` 明文相反：共用 Interaction 的關閉方式含 footer close action、訂單明細規格寫「footer 取消/確定 關閉」、簡訊規格寫「both close modal in preview」，A/B/E variant 段無任何覆寫。正確定性：**實作違反 modal.md 既有慣例的疏漏**，本次修正是讓實作回歸規格。

### 檢討與 binding-level retro audit（使用者指出驗證方法有洞後補做）

失誤根因（記錄供之後 stage 避免重蹈）：
- 決定略搬 arrival IIFE 時，沒有列出該 IIFE 的全部 event bindings 逐一標 disposition，confirm 的關閉行為被靜默丟掉
- 回歸測試「到店方式（開關）」是自選 `.modal-close-btn` 一條會過的路徑，不是逐顆按鈕實測
- 對策已寫入 start.md「JS 搬移/略搬 audit」段；footer/header 按鈕逐顆實測已補做（見上方驗證段）

Arrival IIFE 13 個 bindings 的完整 disposition（retro audit 結果）：
- confirm 關閉 -> 本輪已補
- 開啟時 label->chip 同步、確定 commit label -> 不搬：chips 固定 + [D] 預設 label「自行到店」= 預設 chip（general），皆為 no-op
- chip 切換 -> 使用者同意範圍外（現況即可）
- stepper / swiper dots / 接送卡片增刪與箭頭 / 生效日 calendar / transfer lazy init -> 全部位於 hidden panels（self-drive/charter/transfer），無 chip 切換即不可達；general panel 經實測 0 個互動元素，無其他死按鈕
- 其他 landing 全域綁定 vs partial 內容交叉檢查：`.eye-toggle`（partial 無此按鈕）、`.member-tab` / `.administer-tab`（對應 modal 不在新頁）、會員資料生日欄（兩邊都是純 text input）-> 均無落差

同類「markup 在、綁定不在」的既知缺口（1b 起既有，非 1d 引入，Stage 3 範圍）：
- 新頁 topbar 三顆 function icon（公告/訊息/會員）與 compact 登出/帳號切換 present-unbound，其 target modal（A/B/C/D/E）不在新頁
- 新頁 mobileMenuBtn drawer、aside accordion 收合、role filter 無 JS

### 驗證（self-tested）

- 三 lint pass（conventions / fonts / tokens）、`git diff --check` pass、6 個 inline script parse OK、兩頁組合 duplicate id 均無
- 瀏覽器實測（chrome-devtools，截圖 specs/qa-screenshots/session-84/）：
  - 新頁三條鏈：訂單（variant 未付款 + accordion + 內部簡訊 trigger 疊 z65）、簡訊、修改（body 4 區塊注入 + 四項差異 + 庫存模式 + 月曆 offcanvas teleport/日期關閉）
  - 三層疊層：修改 60 / 會員資料 65 / 合約公司 70；ESC 只關最上層且 data-no-dismiss 生效；關子層 body scroll 維持鎖定
  - 巢狀 modal：加購（12 產品渲染、stepper 更新 cart 與 [B] 頁面 cart）、房型介紹、訂房明細編輯（lock 預設鎖定、解鎖可輸入）、到店方式（開關）
  - mobile 390：無水平溢出、pill 選單 bottom sheet、修改 modal 貼齊視窗、會員資料疊層正常
  - footer 按鈕逐顆實測（瀏覽器）：到店 取消/確定、訂房明細編輯 確定、加購 取消/確定加購、房型介紹 關閉、會員資料 修改、合約公司 取消/確定、訂單明細 取消/確定、簡訊 取消/確定、修改 modal X/取消/確定 - 全部 closes；會員資料/訂房明細編輯的「清除」與 body 區塊內容自帶的「取消」按鈕在 landing 同樣不關閉，等價
  - landing 回歸：console 無錯誤、dashboard 正常、房間預定 SPA（加購 / 會員資料->合約公司 / 到店 chip 切換 / [E] 送出 -> 訂單明細 / 庫存月曆 offcanvas）全過、topbar 公告 / 會員 modal 正常、aside 訂單處理連結實際跳頁成功

### 重要決定

- 到店方式 modal 在新頁為「靜態 + 開關」：與 landing 時期 orderEdit_ 副本等價保真（副本本來就不接互動 JS）；chip 切換 / swiper 卡片屬房間預定頁情境，Stage 2 再模組化（新頁未載 Swiper CDN）
- 加購 modal 是 JS 渲染空殼，靜態 partial 會開出空 modal，故加購系統整包搬入 order-modals.js（保真度高於舊副本，且 Stage 2 房間預定頁可直接複用）
- 「產生訂單」按鈕位於 sections partial 的 wrapper 之外（頁面層），modal body 只取 wrapper children，故新頁修改 modal 內沒有該鈕 - 與 landing 舊行為等價，非漏搬
- landing 的 op-* 行為（快篩 / pill 選單 / tooltip 等）留在 initSubPageBehaviors 內成 inert code（tpl 已移除、selector 找不到目標），Stage 3 收斂時再清
- 過渡性 JS 複製（room-booking-behaviors / order-modals vs landing inline 版）為計畫內重複，Stage 3 去重

### 下一步

1. Stage 2：拆房間預定 -> room-booking.html（直接用 room-booking-sections + room-booking-modals partials；JS 可複用 room-booking-behaviors.js，需補頁面層 產生訂單 / 加購 cart / customer-toggle 等頁面情境行為與到店方式互動 JS 模組化）
2. Stage 3：landing 清理只剩 dashboard、殘餘共用 JS 模組化、去重

### 未解問題

- 新頁 aside 只有訂單處理是真實連結，其他選單項（含返回 landing 三頁）仍是無行為的 div；返回導航規則（landing.html + hash?）待 Stage 2 定義
- 新頁 aside 的 accordion 收合 JS 尚未有（partials.js 只展開 active 分類），其他分類點擊無反應 - 1b 起既有狀態，Stage 2/3 一併處理

---

## Session 83 交接 (2026-07-04)

### 任務: 1a/1b 瀏覽器驗收補齊 + Stage 1c（訂單處理 JS module）

1. **1a/1b 瀏覽器驗證補齊**（Session 81/82 的環境起不了 server，只做了 lint/結構檢查）：
   - landing 回歸全過：aside/topbar 注入、房間預定（[A]-[E] partial 4 區塊）、訂單處理 SPA、訂單修改 modal build（標題「庫存」）
   - order-processing.html 獨立載入全過：aside async + active 標示、topbar + 導航 chip（真實 link）、內容完整、1440/390 無溢出；截圖 specs/qa-screenshots/session-83/
2. **Stage 1c 完成**：`preview/js/order-processing.js`（新，~425 行）：
   - 自 landing 的 initSubPageBehaviors 逐塊搬出（原樣 root-scoped）：accordion、op 快篩、op pill 選單（開/關/定位）、op tabs、op tooltip（含視窗夾取）、op 專案 toggle、simple calendar（rb-cal-cell）、nation-group
   - 頁面 module `initOrderProcessing(document)` 於 loadPartials 後呼叫
   - 頁面補 dayjs CDN（simple calendar 依賴；漏載會讓 init 中途 throw、後續塊全不綁 - 已踩過並修正）
   - 快速區間鍵（今日/本週等）實測無 JS handler（靜態 markup，後端行為），無需搬移
   - 選單項目點擊僅收合（modal 接線 = Stage 1d）
3. 互動回歸全過：快篩單選/取消、tabs、pill 選單開關、tooltip 開/夾取/外部關、專案 toggle 文案、calendar popup（.calendar-dropdown 33 日期鈕）、國籍連動、mobile accordion/bottom sheet/無溢出；console 無錯誤

### 下一步

**Stage 1d**（給下個 session）：搬 modal（訂單明細/簡訊/修改外殼 + 巢狀組）至新頁或 partial、修改 body 改用 room-booking-sections partial、orderEdit_ clone 退役、aside 連結切 href、landing SPA 入口移除、三條鏈回歸。要點見 page-architecture.md。

未 push commits：5 個（至 c6aa3f2）+ 本輪未 commit 改動。

---

## Session 82 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 1b（order-processing.html 靜態頁 + topbar partial）

延續 Session 81；本輪仍不讀 Figma，照既有 spec/html 拆頁。Stage 1b 只要求新頁獨立載入、顯示、RWD 不爆版，先不接互動。

### 本輪改動

1. `preview/partials/topbar.html`（新）：自 `landing.html` 抽出 desktop top row（`desktopTopRow` / `sidebarCompact` / `pageTabsInline` / function icons）。Mobile logo/menu bar 保留在 page shell，因為它在 `bodyArea` 外層；若和 desktop row 放同一 partial 會改變 landing 或新頁的 DOM hierarchy。
2. `preview/landing.html`：desktop top row 改同步 XHR 注入 `./partials/topbar.html`，讓既有 load-time handlers 仍可在主 script 執行前找到 `desktopBulletinBtn` / `desktopMessageBtn` / `desktopMemberBtn` / `expandBtn` / `pageTabsInline`。
3. `preview/order-processing.html`（新）：建立訂單處理靜態頁骨架，使用 `data-partial="aside"` 與 `data-partial="topbar"` async 載入共用 partials；頁面內容自 `tpl-order-processing` 搬出。`body[data-page="訂單處理"]` 供 `partials.js` 標示 aside active。
4. 新頁 module：`await loadPartials()` 後在 `pageTabsInline` render 一顆 active `訂單處理` navigation chip（真實 link，無 close button，符合 tab chips 降級為導航列的決策）。
5. `preview/assets/css/landing.css`：`.page-tab` 補 `text-decoration: none;`，讓新頁 anchor chip 不出現瀏覽器預設底線；landing 既有 div chip 視覺不變。
6. 新頁 static display 補值：`data-op-date-from` / `data-op-date-to` 先填 `2026-07-01` / `2026-07-02`，避免 Stage 1c 前沒有 calendar JS 時日期欄空白。

### 驗證

- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `git diff --check` pass
- 結構檢查 pass：
  - `order-processing.html` 含 `data-partial="aside"` / `data-partial="topbar"`
  - `order-processing.html` 含 `op-filter-panel` / `op-row-menu`
  - 新頁日期靜態值存在
  - 新頁 module 會 render `page-tab active` 的 `訂單處理`
  - `topbar.html` 含 `pageTabsInline` 與三個 desktop function icon trigger
  - `landing.html` 含 `topbarMount` 與 `./partials/topbar.html` 同步注入
- HTTP server 檢查：另開 8010 server 後，外部 `curl` 仍回 `connection refused`（同 Session 81 的 8000/8002 問題）。已關閉本輪啟動的 8010 session；本輪以 lint + 本地結構檢查作為 Stage 1b 驗證。

### 下一步

1. Stage 1c：建立 `preview/js/order-processing.js`，搬入 op-* 行為（pill menu、filter tabs、quick filter、tooltip clamp、project toggle）。
2. 視需要建立共用 module 給新頁使用：`rb-accordion` / `nation-group` / `rb-cal-cell` 等；landing inline 版暫留，Stage 3 再收斂去重。
3. Stage 1c 後再做新頁互動回歸；Stage 1d 才搬 modal 與退役 `orderEdit_` clone。

### 重要決定

- 1b 期間 aside 的「訂單處理」href 仍不切；新頁先用直接網址驗收，避免 landing SPA 入口在 1c/1d 前中斷。
- `landing.html` 內的 `tpl-order-processing` 凍結待刪；後續訂單處理頁視覺調整應改 `preview/order-processing.html`。

### 未解問題

- 本機 HTTP server 在目前執行環境下仍不可靠，後續若要瀏覽器截圖驗證，需先排除 port/listener 問題或改用可穩定控制的 browser tooling。

## Session 81 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 1a（room-booking sections partial）

使用者已將 Stage 1 細分 1a-1d 寫入 `specs/page-architecture.md`，並明確指示本輪不用 Figma，照既有 spec/html 開工。Figma MCP checklist 視為不適用；未同步 tokens（沒有新 Figma Variables 或新設計值）。

### 本輪改動

1. `preview/partials/room-booking-sections.html`（新）：自 `preview/landing.html` 的 `tpl-room-booking` 抽出 [A]-[E] wrapper 內容，作為房間預定頁與訂單修改 modal 後續共用來源。
2. `preview/landing.html`：`tpl-room-booking` 內改成同步 XHR 注入 `./partials/room-booking-sections.html`，模式同現有 aside 同步注入；目標是讓 `openPage()` 的 `tpl.innerHTML` clone 與 `buildOrderEditModalBody()` 的 `tpl.firstElementChild.children` 行為維持不變。
3. 新 partial 變成新增檔後，清理新增行 lint 會擋的歷史內容：註解中的裝飾性 Unicode 改 ASCII、stepper minus glyph 改 `&minus;` 保持畫面、兩個 mobile-unsafe `min-w` 改為 `md:min-w-[580px]` / `w-[54px]`。

### 驗證

- `./scripts/lint-conventions.sh` pass
- `./scripts/lint-fonts.sh` pass
- `./scripts/lint-tokens.sh` pass（86 raw hex tokens 一致）
- `git diff --check` pass
- Inline script parse check pass（3 個 inline scripts）
- 本地結構檢查 pass：模擬同步注入後 `tpl-room-booking` 第一個元素仍為 `<div class="flex flex-col gap-4">`，且包含 `data-order-summary-submit` / `id="btnInventory"` / `data-data-exists-trigger`
- 訂單修改 modal 依賴 selector 檢查 pass：`invCalendarLeft` / `tableInventory` / `data-inventory-date-modal` / `customer-toggle` / `orderDataClear` / 加購與到店 modal trigger 皆仍在 partial
- HTTP 檢查：`landing.html` 曾回 200；partial curl 驗證受本機 server/port listener 狀態干擾（8000/8002 皆出現 first request 後連線不穩，8000 上 lsof 看到多個 Python listener），本輪改以本地結構檢查替代，未做瀏覽器截圖。

### 下一步

1. Stage 1b：建立 `preview/order-processing.html` 靜態頁，頁內容自 `tpl-order-processing` 搬出。
2. 同步抽 `preview/partials/topbar.html`（partial 只含容器 markup，landing 與新頁各自 render chips）。
3. 1b 期間 aside 的「訂單處理」href 先不切，避免 landing SPA 入口斷掉；新頁先用直接網址驗收。

### 重要決定

- 本輪只做 Stage 1a，不退役 `orderEdit_` clone；clone 機制留到 Stage 1d 搬 modal 時處理。
- `preview/room-booking.html` 仍是 superseded 舊檔，不作為拆分來源。

### 未解問題

- 需要後續用穩定 server 或 browser tooling 做 Stage 1b/1c/1d 的視覺回歸截圖；本輪沒有新增視覺設計，只做 template partial 抽離。

## Session 80 交接 (2026-07-04)

### 任務: landing.html 拆頁重構 Stage 0（使用者核准整個分階段計畫）

使用者決定將 landing.html 依 content 拆成獨立 html（房間預定/訂單處理各自一頁，landing 剩 dashboard）。完整計畫與決策記錄在 **specs/page-architecture.md「landing.html 拆頁重構計畫」段**（含 tab chips 降級為導航列的決策、四個 stage、Stage 1 執行要點）。

### 本輪產出（Stage 0）

1. 拆頁計畫寫入 page-architecture.md（每 stage 一個 session、中間態皆可用）
2. `js/tailwind-config.js`：landing 的 inline tailwind.config（63 行）抽出共用，landing 改外部引用；回歸：config 自訂色正常渲染

### 下一步（下個 session 開場直接做）

**Stage 1：拆訂單處理 -> order-processing.html**，執行要點見 page-architecture.md 該段（先抽 [A]-[E] partial -> 頁骨架 -> 頁內容搬移 -> JS 抽 modules -> aside 連結改真實 href -> 三 lint + 全回歸）。Stage 1 完成後 orderEdit_ clone 機制可整組退役。

其他遺留：使用者操作驗收訂單處理頁（截圖 session-78/）；未 push commits x5（ee06dfb/b9722a8/26fedd1/f6deac1/本輪）。

---

## Session 79 交接 (2026-07-04)

### 任務: B3 start.md 瘦身 + 驗收材料 + 三層 modal 疊層修正

1. **B3**：start.md「元件 conventions」「可復用 UI patterns」兩段（60 行，無界增長區）整段移至 specs/html-conventions.md（現 229 行），start.md 留指標段（450 -> 396 行）；memory 的行號引用改段落名引用
2. **驗收材料**：11 張多角度截圖存 specs/qa-screenshots/session-78/（accept-01~11：1440 篩選/表格/dropdown/修改 modal 三區塊/tooltip + 390 頁面/bottom sheet/modal/月曆 offcanvas），等使用者實際操作驗收
3. **三層 modal 疊層修正**（使用者回報：會員資料內「公司名稱 edit」開出的 modal 層級不對）：
   - 根因：orderEdit_ 副本 append 在 body 不在 #modalOrderEditBackdrop 內，副本內 delegated trigger 過不了 scope 檢查，開到原版（z60）壓在副本（z65）下
   - 修正：scope 檢查改 `closest('#modalOrderEditBackdrop, [id^="orderEdit_"]')`；z 改動態疊層（openModal 依已開數 N 給 60+N*5，任意深度）；Esc 只認 computed z 最上層、最上層 no-dismiss 則不動作（修掉穿透關底層的衍生 bug）；data-order-summary-submit 加防禦性分流
   - 驗證：三層鏈 60/65/70、原版全程未動、Esc/按鈕逐層關、房間預定頁原路徑回歸全過
   - spec：order-edit-modal.md 巢狀規則段更新為動態疊層版

### 下一步

1. 使用者操作驗收訂單處理頁（截圖組在 session-78/）
2. 未 push commits：ee06dfb / b9722a8 / 26fedd1 / 本輪
3. audit 項目全數完成（B1-B4 + 5 項止血）

---

## Session 78 交接 (2026-07-03)

### 任務: audit B2 + B4（B3 start.md 瘦身留待下個 session）

1. **B4 token mirror drift check**：新增 `scripts/lint-tokens.py` / `.sh`，比對 tokens.md 的 Color raw hex 定義與 base.css `--color-*`（含 var() alias 鏈遞迴解析），掛進 pre-commit hook（第三個 lint）。首跑 86 個 token 全數一致零 drift
2. **B2 progress.md archive**：Session 6-62 搬 `specs/progress-archive-s06-s62.md`（2684 行），本檔留最近 15 個 session（822 行）；檔頭與 start.md 檔案地圖加「archive 決策可能已被推翻，以本檔最新為準」規則；lint-conventions 豁免 progress-archive 檔（歷史內容依 start.md 本就豁免）
3. 修 lint-conventions worktree 模式在前一輪已補的 untracked 掃描於本輪實戰生效

### 下一步

1. **B3 start.md 瘦身**（唯一剩餘 audit 項）：元件 conventions + UI patterns 段搬 specs/html-conventions.md，目標 ~250 行；搬完掃 memory 檔的行號引用
2. 訂單處理頁最終驗收；未 push commits：ee06dfb + b9722a8 + 本輪

---

## Session 77 交接 (2026-07-03)

### 任務: B1 頁面架構調整（landing.html 凍結 + multi-page 架構 + aside 單一化）

背景：公司要求原生技術（無框架），單檔會持續膨脹（使用者原話「將來還會恐怖的大包」），故執行 audit B1。核心論點：**原生不等於單檔** - ES modules 與 fetch partial 都是瀏覽器原生能力。

### 本輪產出

1. **前置實測（全過）**：Tailwind Play CDN 的 MutationObserver 對 runtime 注入內容完整生成樣式（arbitrary value / CSS var arbitrary / config 自訂色三種都驗證）；原生 ES modules 經 python http.server 直接可用
2. **`specs/page-architecture.md`**（新 spec）：目標結構（`preview/{page}.html` + `partials/` + `js/`）、新頁面固定骨架、partial 載入機制、id 命名空間（跨頁無碰撞 = 核心收益）、CSS 歸屬、遷移策略
3. **start.md 凍結規則**：landing.html 不再新增頁面 template / modal / 大段 JS；新頁面一律走新架構
4. **aside 單一化（使用者裁決選 b 單一事實來源）**：
   - `preview/partials/aside.html`（新）：全站唯一 aside，668 行自 landing.html 抽出，純 markup
   - landing.html 改 `asideMount` + **sync XHR 同步注入**：sidebar 綁定散佈於 load-time 多個 IIFE，async 注入會全部落空；同步注入讓主 script 一行不動。代價 = console 1 筆 deprecation warning（已知且接受，記錄於注入點註解）
   - `preview/js/partials.js`（新）：新頁面用的 async `loadPartials()`（掃 `[data-partial]`、標 aside active 態依 `body[data-page]`、dispatch `partials:loaded`）
5. landing.html 11583 -> 10931 行（-652），且從此凍結

### 回歸驗證（全過）

aside 注入（26 選單項目）、選單導航（開訂單處理）、accordion 收合、收合全部、mobile drawer 開關、backdrop 關閉；JS parse check、雙 lint。console 無錯誤（既有 CDN warning + 已知 1 筆 deprecation）。

### lint 加強（commit 時 hook 攔截後順手修）

- aside.html 的 mobile 關閉鈕 `\u2715` glyph 改 HTML entity `&#x2715;`（source 變 ASCII、渲染完全相同，瀏覽器驗證過）
- **lint-conventions worktree 模式盲點修補**：`git diff HEAD` 不含 untracked 新檔（partials/ js/ 曾因此漏掃），改為另以 `git diff --no-index /dev/null` 產生偽 diff 一併餵入

### 未完成 / 下一步

1. **audit 剩餘中型項目**：B2 progress.md archive（本檔即將 3600 行，建議下次做）、B3 start.md 瘦身（conventions 段搬 html-conventions.md）、B4 token drift check script
2. 下一個新頁面實作時：照 page-architecture.md 骨架 + 建 `js/tailwind-config.js` + aside 選單加新頁連結（只改 partials/aside.html 一份）+ landing 舊三頁連結機制（hash 指定，屆時定義）
3. 訂單處理頁 Batch 1-6 完成，等使用者最終驗收
4. 未 push 的 commit：ee06dfb（repo hygiene）+ 本輪

---

## Session 76 交接 (2026-07-03)

### 任務: repo 結構體檢（Fable agent audit）+ 5 項止血執行

使用者要求用最強模型對檔案結構與工作流做全面體檢（好壞都分析）。audit 完整報告已在對話中呈給使用者；本輪執行了報告中 5 項「極小/小成本」止血項，中型項目待逐項確認。

### Audit 結論摘要（完整版本見對話記錄）

- 做得好（保留）：規則帶 why、lint 落地機制、token strict mirror、Figma MCP 陷阱知識庫、交接格式、components/ 平鋪
- 兩顆定時炸彈：landing.html 單檔增量（11583 行，91 個 modal id，orderEdit_ clone 那套工程的根因）、自稱權威的過期檔案（design-system/MASTER.md 為最，navy/gold 調色盤與實際品牌橘完全不符）
- 明確不動：landing.html 存量、start.md 單檔形態、progress.md 格式、components/ 平鋪、tokens typo 鏡像、memory 與 start.md 的雙層重複

### 本輪執行（5 項止血）

1. **刪 `design-system/`**（錯誤調色盤污染源，agent 搜 "color palette" 會撞到且自稱權威）
2. **刪 12 個未使用 agent-tool 目錄**（.agent/.cursor/.codex/.windsurf 等 + .github/prompts/ui-ux-pro-max，共 400+ 檔 ~7.6MB，skill installer 灑的複本；.claude/ 保留；.gitignore 加防再生清單）
3. **stale 檔標注**：preview/room-booking.html 標 superseded-by landing.html#tpl-room-booking；sections/ 9 檔 + layouts/ 2 檔標 frozen-reference
4. **order* 命名陷阱檔頭警告**（order.md = dashboard widget / order-status.md = 房間預定 [E] / order-status-pill.md = 訂單處理 pill，三檔互相指路）
5. **AGENTS.md 降為純指標**（15 行，重複段移除，規則本體只在 start.md）

配套：start.md 三處同步（專案結構樹標 frozen + 補列 specs/pages 與 html-conventions.md、檔案地圖重排 specs/pages 升第 4 順位、分層順序宣告 5 層改現行 3 層 tokens -> icons -> components -> specs/pages -> 實作）

### 未完成 / 下一步（audit 中型項目，待使用者逐項確認）

1. **B1（最重要）**：立規則「新頁面不再進 landing.html」+ 新頁獨立 html + fetch 共用 partial 方案（要先實測 Tailwind Play CDN 對 runtime 注入內容的 class 掃描）
2. **B2**：progress.md archive 機制（留最近 10-15 session，其餘搬 specs/progress-archive-*.md）
3. **B3**：start.md 瘦身（元件 conventions + UI patterns 段搬 specs/html-conventions.md，目標 ~250 行；CLAUDE.md 每 session 自動載入後其長度是固定 context 稅）
4. **B4**：token mirror drift check script（比對 tokens.md hex 與 base.css 值，掛進 lint-conventions）
5. 訂單處理頁 Batch 1-6 全部完成，等使用者最終驗收（延續 Session 75）

---

## Session 75 交接 (2026-07-03)

### 任務: 最近兩個 commit code review 後修正 + 規範補強 + commit/push

使用者要求檢查最近兩個 commit 後，將需要寫入規範的內容寫入規範，並交接、commit、push。本輪針對 review finding 做修正與 guardrail 補強。

### 本輪處理

1. `preview/landing.html`:
   - `initCalendar(root)` 改為 root-scoped 查找，不再用 `document.getElementById` 抓 hidden `tpl-room-booking` 或已建立的 `modalOrderEditBackdrop` clone。
   - 無 calendar 的 subpage 直接 skip，避免切到「訂單處理」時誤初始化 hidden template。
   - Backdrop click / Escape 改 delegated 通用機制，自動涵蓋 `modalOrderEditBackdrop` 與 runtime `orderEdit_` 副本。
   - `modalMemberDataBackdrop` / `modalChangeContractCompanyBackdrop` 加 `data-no-dismiss`，保留原本不吃 backdrop/Escape 關閉的既有行為；cloneNode 產生的 `orderEdit_` 副本也繼承此行為。
   - 訂單處理篩選面板 3 欄斷點從 `lg` 改 `xl`，避免 1024-1279 + sidebar 時 col3 國籍 radio nowrap 爆版。
2. `components/order-edit-modal.md`:
   - 補記 `initCalendar(root)` root-scoped 行為、modal delegated 關閉規則、`data-no-dismiss` 例外。
3. `specs/pages/order-processing.md`:
   - 補記篩選面板斷點裁決：`>=1280px` 才進 3 欄，`<1280px` 用單欄 + accordion；下拉選單 dropdown/offcanvas 仍維持 1024。
   - 補關閉 desktop 篩選面板外殼漸層待確認：PNG 取樣為純色 `#f6fafd`。
4. `start.md` / scripts:
   - Lint 自檢規則補 `./scripts/lint-conventions.sh`。
   - 新增「新規則寫入時的兩個必做動作」：回溯 audit 與機器可判定性評估。
   - 新增 `scripts/lint-conventions.py` / `.sh`，pre-commit hook 同步跑 conventions lint，攔新增行的 decorative Unicode、mobile-unsafe min-width、HTML arbitrary hex、landing.css hardcoded hex。
5. ASCII cleanup:
   - 清掉本輪 touched/new lines 的 decorative arrows / box-drawing / em dash。
   - `components/order-status-pill.md` 的 badge 順序改用 `->`。

### 驗證

- `git diff --check`
- `./scripts/lint-fonts.sh`
- `./scripts/lint-conventions.sh`
- HTML script parse check
- 待 commit 前再跑 staged hook 等同檢查

### 更正 + Batch 6 完成記錄（本 entry 初版誤記 Batch 6 為待辦，實際已完成）

**Batch 6 RWD 收尾已完成**（在 review 修正之前做的，xl 斷點與 body min-width 移除都是 Batch 6 的產出）：

1. 掃描 6 個 viewport（360/375/768/1024/1280/1440），檢查橫向溢出 + 版面模式 + 修改 modal，全數通過
2. **移除 base.css 全域 `body { min-width: 375px }`**（2026-04-14 initial commit 就存在，與 start.md RWD 規則矛盾；360 裝置全站右緣裁切 15px。使用者裁決移除；已回歸抽查房間預定頁 360 表現正常）
3. **篩選面板 3 欄斷點 lg -> xl**（1024-1279 帶 sidebar 時 col3 塞不下國籍 nowrap 列；Figma 未定義此區間，使用者裁決 1280 才進 3 欄）- 即上方「本輪處理」第 1 點所列同一件事，起因是 Batch 6 掃描發現
4. QA 截圖 9 張存 `specs/qa-screenshots/session-74/`（目錄 gitignored，本地驗收材料）
5. 各寬度結果：360/375/768 accordion + bottom sheet + modal 全螢幕（768 視窗化 744px）；1024 accordion + dropdown；1280/1440 三欄 + dropdown，modal 1192px 內部無溢出

**訂單處理頁 Batch 1-6 全部完成**（self-tested + code review 修正完畢，等使用者最終驗收）。

### 下一步

1. 訂單處理頁無剩餘批次；等使用者驗收回饋
2. `CLAUDE.md`（使用者新建，`@start.md` import）下個 session 生效，start.md 將自動載入 context

---

## Session 74 交接 (2026-07-03)

### 任務: 訂單處理 Batch 5（modal 接線 + 訂單修改 modal）+ icons 補充 + tooltip 修正

延續 Session 73（同日）。進度：**Batch 5 完成（self-tested，使用者已逐項回饋修正），僅剩 Batch 6 RWD 系統性收尾**。

### 本輪產出

1. **Batch 5a 下拉選單接線**（preview/landing.html）：
   - 「訂單」-> 既有 `modalOrderSummaryBackdrop`（demo 固定 unpaid variant，實際對應留給後端）；「簡訊」-> 既有 `modalSmsBackdrop`；連結/複製/取消維持只收合（後端）
   - 踩雷：op-row-menu 原本的 `stopPropagation` 擋掉 document 層 delegated handler，改為 closest 檢查式 outside-close
2. **Batch 5b 訂單修改 modal**（`modalOrderEditBackdrop`）：
   - 外殼靜態 HTML（header 訂單修改+還原+close / footer 取消/確定，desktop 1192 / <768 全螢幕）
   - body = `buildOrderEditModalBody()` runtime clone tpl-room-booking [A]-[E]（避免 ~2900 行靜態複製），clone 後 `initSubPageBehaviors(body)` 重綁（已曝露到 window）
   - 差異調整：[A] 標題改「庫存」+ 程式切庫存模式、移除 customer-toggle、cart 頂部插訂單編號列、[D] 插「還原」
3. **[A] 庫存模式鎖定**（使用者指正 spec 初讀「無差異」是錯的）：
   - 無 空房/庫存 切換、無 Excel、無棟別 chips、只剩 訂/餘/保 + 庫存表；月曆按鈕觸發 bottom offcanvas
   - mode toggle/Excel/chips 用 CSS 隱藏（`[data-order-edit-body]` scope）**不可移除 DOM**：共用 calendar JS 用 document.getElementById 解析，移除會 fallback 到 template 副本、污染日後開的房間預定頁
4. **巢狀 modal 權重 + 實例隔離**（使用者要求，已寫入 start.md 規則 + memory）：
   - 子 modal 一律 `orderEdit_` 前綴副本（`ensureOrderEditModalClone()`），不共用房間預定 instance；z 用新 token `--z-modal-layer-2: 65`
   - 配套修正：closeModal/offcanvas close 疊層感知（下層還開著就維持 body scroll 鎖定）、`.modal-close-btn` 改 delegated、動態渲染 modal（加購/房型編輯）clone 前先 reset/render、per-ID modal-box CSS 補 `#orderEdit_` selector（9 條）
   - 庫存月曆 offcanvas 也有專屬副本 `orderEditInvCalendarOffcanvas`，calendar JS 依 grid scope 自動分流
5. **icons 補充**（使用者以 figma-go 提供 Icons master frame）：
   - 匯出 7 顆真缺口：`triangle`（狀態 pill 正牌三角，已替換 arrow-down-drop 代用品）、`order`/`link`/`file-work-history`/`phone`/`yes`/`thumbtack`（**先入庫存著不接**，2026-07-03 使用者確認）
   - `specs/icons.md` 補 8 列（含前批漏登記的 `restore`）
6. **tooltip 視窗夾取**：兩顆 info tooltip 開啟時量測平移、不超出螢幕（手機版 390 驗證）；基準用 `documentElement.clientWidth`（innerWidth 在 mobile 會跟 content overflow 浮動，不可靠）
7. **規則/memory**：start.md 新增「Tooltip 視窗自適應」「Modal 開子 modal」兩段強制規則；memory 新增 `feedback_tooltip_clamp_viewport`、`feedback_nested_modal_scoping`
8. 已補驗關閉：desktop 篩選面板外殼 = 純色 `#f6fafd` 無漸層（PNG 網格取樣）；日期狀態 tooltip 文案 pass 歸後端

### 未完成 / 下一步

1. **Batch 6：RWD 系統性收尾** - 多 viewport 掃 訂單處理 全頁（含修改 modal 內各區塊），唯一剩餘工作
2. 驗收：全部 self-tested，等使用者最終過一輪
3. 已知 demo 限制（記錄於 order-edit-modal.md）：orderEdit_ 副本不接原 id-based 互動 JS（視覺示意 + 原生表單）；訂單明細 unpaid variant 對應留給後端

---

## Session 73 交接 (2026-07-03)

### 任務: 訂單處理 頁面分批實作 Batch 1-4（篩選面板 / tabs+快篩 / 表格+pill / footer 統計）

延續 Session 72 的 spec，開始 HTML 實作。進度：**Batch 1-4 完成（self-tested，待使用者最終驗收），Batch 5-6 未動**。

### 本輪產出

1. `preview/landing.html`：
   - `PAGE_TEMPLATES` 新增 `訂單處理: "tpl-order-processing"`，新 template 塊（搜 `tpl-order-processing`）
   - Batch 1 篩選面板：desktop 3 欄（col1 固定 340px + col2/col3 均分）、mobile(<1024) 收合為「更多條件」accordion（`.op-accordion-gradient` 漸層外殼）；日期狀態 tooltip、國籍外籍連動國家 select（沿用 `.nation-group` 既有機制）
   - Batch 2 tabs+快篩：狀態 tabs 沿用 `.member-data-filter-tab`；快篩 5 顆沿用 `.rb-filter-tab`（circle-selected-yellow 黃底選中），預設不選中、單選、再點取消選取，緊接 tabs 右邊不用 justify-between
   - Batch 3 表格：`.op-table` 全欄位垂直水平置中、9 欄 6 列（含 5-1/5-2 rowspan 子訂單，5-1 不畫底線）、狀態 pill（`.op-status-pill`）+ 下拉選單（`.op-row-menu`，desktop dropdown / mobile offcanvas 同一份 DOM breakpoint 切換）、訂單狀態圖例 tooltip、入住人欄姓名純文字不帶 link（訂購人欄才有 link）
   - Batch 4 footer 統計列：統計 label + 2間/3夜 chips + 加購/房價/總計，三組間大間距 `lg:gap-x-24`
   - JS 皆掛在 `initSubPageBehaviors` 內：quick-filter 切換、op tabs、tooltip click/outside、row menu 開關定位、專案 toggle 文案
2. `preview/assets/css/landing.css`：新增 `.op-table`/`.op-status-pill`/`.op-status-dot`/`.op-badge`/`.op-badge-source`/`.op-row-menu` 系列 + `.op-accordion-gradient`；`.rb-filter-tab` 補 inline-flex 置中（共用 class，棟別 chips 一併受惠）
3. `components/order-status-pill.md`：補 get_node 覆核後的精確數值（pill radius 44/padding 4 10/邊框 Neutral-50；兩種 badge 完整對照表）、badge 垂直順序（pill -> 來源 -> 分類）、rowspan 不畫分隔線規則、來源 badge 讀取陷阱
4. `specs/pages/order-processing.md`：footer 段補精確規格 + 隱藏 timestamp 圖層警告
5. `start.md`：「漸層限制」段擴充為「JSON 不等於視覺」限制（新增 fills key 消失/單邊 stroke/隱藏圖層 3 個模式）；新增「實作前每元素三步驟門檻」（渲染截圖 ground truth -> 查 notes 未驗證標記 -> JSON 只信結構文字）
6. Memory 新增：`feedback_figma_hidden_layer_serialized`（隱藏圖層照樣序列化）、`feedback_implement_screenshot_first`（三步驟門檻）

### 本輪踩雷記錄（全部是使用者發現後修正，檢討見 start.md 新規則）

- 快篩 chips 圓角憑感覺寫 6px，實際是 circle-selected-yellow pill（28px、黃底選中態）
- 表格欄位對齊猜左對齊，實際全部置中；badge 順序（pill/來源/分類垂直排列）也漏了
- 來源 badge（Booking/Agoda）：`strokes:["#f28b45"]` 實際是**只有左邊 2px**（SVG 其餘三邊是零面積退化路徑）；fills key 整個消失，實際是白->Brand-200 對角漸層。SVG export 覆核抓出
- footer 把 Figma **隱藏圖層** timestamp 做出來（get_node 對 visible:false 節點照樣序列化無標記）；PNG 渲染圖比對抓出
- 分類 badge 字級是 16px 不是 12px；來源 badge radius 6 不是全圓角

### 未完成 / 下一步

1. **Batch 5：modal 接線**（最大塊）- 下拉選單「訂單」「簡訊」接既有 `modalOrderSummaryBackdrop`/`modalSmsBackdrop`；「修改」新建訂單修改大 modal（spec: `components/order-edit-modal.md`，只做一般會員版）
2. **Batch 6：RWD 收尾** - 系統性多 viewport 掃全頁
3. ~~待補驗：desktop 篩選面板外殼是否有漸層~~ -> **已補驗（2026-07-03）**：PNG 渲染圖 25x25 網格取樣，背景均勻純色 `#f6fafd` 無漸層，現有實作正確（外殼 = 查詢區大圓角容器，Figma node `shirnk-model-1` 2026:64181）
4. ~~日期狀態 tooltip 9 條說明文字~~ -> **pass（2026-07-03 使用者確認）**：佔位文案維持現狀，真實文案將來由後端實作，前端不再追蹤
5. Batch 5 開工前先對本批元素過 start.md 新的三步驟門檻
