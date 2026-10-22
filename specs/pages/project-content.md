# 專案內容

> Current source: Figma `2724:116123`, `2724:117275`, `2584:119146`,
> `2582:114936`, `2577:104171`, `2578:110113`, `2724:118363`,
> `2588:124216`, `2589:124502`
> Read date: 2026-10-22
> Status: implemented preview, self-tested, pending user review

## 範圍與交接狀態

本頁是`產品設定 -> 專案內容`改版, 包含住宿 / GHA / desktop 與 mobile card,
以及住宿專案新增或修改的三步驟 modal。

2026-10-22 使用者逐張確認本次差異並授權實作。2026-10-01 規則只有在本檔
仍明確保留時才沿用; 舊 preview table 與歷史 Figma 不得作為 current source。
數量價格表改版另由 Session 162 管理, 本次不修改該頁實作。

## Current Figma contract

| 區塊 | Node | 尺寸 |
|---|---|---|
| 住宿 desktop | `2724:116123` `專案內容 desktop 1021 v.1.1` | 1440 x 2017 |
| GHA modal | `2724:117275` `Modal GHA` | 800 x 966 |
| 住宿 mobile card | `2584:119146` | 351 x 1166 |
| 住宿 Step 1 | `2582:114936` | 820 x 1276, modal 800 x 1256 |
| 住宿 Step 2 default | `2577:104171` | 1140 x 1297, modal 1120 x 1277 |
| 住宿 Step 2 reorder | `2578:110113` | 1140 x 1335, modal 1120 x 1315 |
| 住宿 Step 3 | `2724:118363` | modal 760 x 1431 |
| Mobile date offcanvas | `2588:124216` | 192 x 278 demo slot |
| Desktop date popover | `2589:124502` | 192 x 234 |

### Read coverage / children checklist

- Desktop root -> `2724:116124` FRAME 1400 x 1993; 新增列 / 住宿/串接頁籤 /
  狀態與條件列 / 4 張卡 / 儲存排序均已讀取。
- GHA root -> `I2724:117275;73:627` FRAME 800 x 908 + footer SLOT 800 x 58;
  content 包含 4 張卡與說明 accordion。
- Step 1 root -> `2582:115072` modal INSTANCE 800 x 1256 +
  `2582:115075` tooltip INSTANCE 66 x 20。
- Step 2 default/reorder roots 各有一個 modal INSTANCE:
  `2577:104172` 1120 x 1277 / `2578:110114` 1120 x 1315。
- Step 3 root -> `I2724:118363;73:627` FRAME 760 x 1373 + footer SLOT 760 x 58;
  body 依序為專案 / summary / 2 張房型卡 / 成人 / 孩童。
- Mobile card root 包含 content `2584:119147`, corner `2584:119224`,
  actions `2589:124558`; 已核對新加入的範本 label。
- Offcanvas root 包含 `2588:124217` Slot 與 JSON 的 Calendar demo;
  PNG 只有單日定義選項, 不渲染 JSON 中額外的 Calendar demo。
- Popover root 包含 Slot `I2589:124502;2589:124457` 與上方小角。
- 9 張 PNG 與 main/date/GHA SVG 存於 `specs/qa-screenshots/session-163/`。
  SVG 確認漸層; PNG 確認單邊框與可見內容。

## 頁面共用狀態

- 主分類 default 是 `住宿`, 頂部保留 `住宿` / `串接`。
- 移除頂部 GHA tab; GHA 由期限條件旁的綠色按鈕開啟獨立 modal。
- 住宿的狀態 filter default 是 `全部`。
- 期限 filter default 是 `未逾期`; `未逾期` 與 `已逾期` 可單擊切換, 彼此單選。
- 房型下拉選單 default 是 `全部`。
- `專案明細` 與 `專案設定` 是兩個獨立 accordion, default 都展開。
- Figma 的收合畫面是互動展示, 不是 default state。
- 同一列中的專案卡等高。

## 住宿專案卡

### 狀態分類

- `全部` 同時顯示上架與停用卡。
- 上架卡顯示 `修改` / `複製` / `停用` 三個操作。
- 停用卡顯示 `查看` / `啟用` 兩個操作。
- 點擊停用或啟用後, 卡片立即移到正確狀態分類並更新操作。
- `全部` / `上架` / `停用` 的數量由同一份專案卡資料即時計算,
  初始 sample 為 4 / 2 / 2。不得保留 Figma 示意數字 99 / 8 / 8。
- 切換 tab 不影響其他 tab 的統計; 啟用或停用後三個數量同步更新,
  全部數量等於上架與停用數量之和, 包含分類結果為 0 的情況。
- 當目前 filter 不包含切換後狀態時, 該卡立即從目前清單消失。
- 互動與資料分類邏輯沿用房型頁, 但專案內容維持自己的資料與 JS state。

### 範本提示

- Step 2 使用範本的專案, desktop/mobile 外層卡片都顯示藍色 `範本` label。
- label 僅作提示, 不可點擊; 不增加操作或排序效果。
- 是否使用範本由後端資料決定; 本次 sample 第一張卡顯示 label。

### 照片

- 有照片時顯示小型照片按鈕; 空值顯示大型 placeholder。
- 兩種狀態都開啟相同版型的照片管理器。
- 沿用 `components/modal.md` photo-gallery 互動: desktop 原生拖放與手機觸控把手
  都可排序, 只改本輪 working state, 按上傳才保存, 取消還原。
- 版型與操作方式沿用房型頁, 但專案內容必須維持獨立資料與 JS state。

### 排序與設定 table

- 專案設定 table 保留內容固有寬度, 外層出現水平 scrollbar, 不壓縮欄位。
- table 後方的排序 input 對應該張卡片的排序值。
- `儲存排序` 一次儲存目前可編輯卡片的排序值。
- GHA 不顯示 `儲存排序`。
- `停用` filter 不顯示 `儲存排序`。
- `全部` filter 仍顯示 `儲存排序`, 但停用卡內的排序 input 必須 disabled;
  上架卡的排序 input 維持可編輯, 按鈕本身不可因停用卡存在而 disabled。

## GHA

- GHA 是由住宿頁 GHA 按鈕開啟的 modal, 不再是獨立主分類。
- modal 寬 800px, header `GHA` + close icon, footer 只有 `關閉`。
- header close / footer 關閉 / backdrop / Esc 沿用共用 modal controller。
- 不顯示新增 / 狀態 filter / 期限 filter / 房型 filter / 照片 / 管理操作與儲存排序。
- modal 內顯示兩欄置中 card grid; 每張 340 x 288, 欄距與列距 16。
- 四張卡與原版 `2588:121840` 的結構 / 文字 / 尺寸 / styles 相同; 說明位於卡片後 20px。
- 窄 viewport 依共用 modal 的流動寬度與內容換行, 不造成頁面水平溢出。
- 每張卡顯示左上角漸層色塊 / 專案名稱 / 開始日期 / 結束日期 / 上傳天數 /
  排序文字與 toggle。
- 排序僅顯示一般文字, 之後由後端帶入資料, 不提供 input。
- toggle 可點擊。toggle true 時左上角漸層為黃色; false 時同步改為灰色。
- `說明` 是可展開收合的 accordion, default 展開。
- Figma 的日期 / 天數 / 排序與說明文字都是 demo data。

## Responsive contract

### Page shell

- 既有 shell 的 mobile breakpoint 維持小於 768px。
- 小於 768px 移除 `rootWrap` 外層 padding, 沿用房型頁整襯型滿版規則;
  mobile top bar 自帶 12px 左右與上方內距, 內容寬度貼齊 viewport。
- 使用者確認只移除頁面外層留白, 日期 modal 面板內距保留。
- 375px 與 Figma 351px 都只是 QA 或參考寬度, 頁面不可寫死固定寬度。

### Card internal layout

- card 是 nested component, 結構切換使用 container query, 不直接使用 viewport
  media query。
- 2026-10-22 使用者再次確認沿用 640px 門檻: 1440px 圖面中的 522px 卡片也
  必須改成 mobile 結構; 此條是已確認的 Figma desktop 圖面例外。
- container 小於 640px 時採 mobile card; 640px 以上採 desktop card。
- mobile card 的圖片位於上方置中, 圖片區約 160 x 160。
- metadata 與 chips 置中排列, 放不下時允許 `flex-wrap`。
- `專案明細` 與 `專案設定` 改為垂直滿寬排列。
- 專案明細為單欄 9 個項目。
- 設定 table 保留約 635px 固有內容寬度, 由 card 內層水平捲動。
- 卡片底部操作使用 `flex-wrap` 並置中; 空間足夠時三顆同列, 更窄時自然換行。

## 新增或修改 modal

### Session 與共用行為

- Step 1 / 日期定義 / GHA 的 toggle 一律使用共用 `.member-data-switch` 結構與樣式,
  track 64x28, knob 24x24 圓形, checked 位移 36px, 不覆寫寬高或拉伸。
  disabled 保留 knob 位置, track 灰色, 不整顆降低 opacity。

- 三張頁面是同一次 modal session 的 Step 1 -> Step 2 -> Step 3。
- 從新增進入時三步 title 都是 `新增`; 從修改進入時三步 title 都是 `修改`。
- Step subtitle 依序是 `專案` / `日期` / `價格`。
- 切換步驟時保留同一次開啟期間的表單值。
- 每一步的 `清除` 只清除當前頁, 不清除其他步驟。
- Step 1 footer 是 `清除` / `下一頁`。
- Step 2 footer 左側是 `上一頁`, 右側是 `清除` / `下一頁`。
- Step 3 footer 左側是 `上一頁`, 右側是 `清除` / `儲存`。

### Step 1 專案

- 專案代號: readonly 灰底, sample `12`。
- 專案名稱: 文字 input。
- 專案類型: readonly 灰底, sample `住宿專案`; 實作時必須補上
  `專案類型` label。
- 計價方式: select, sample `間數`。
- 加人: toggle, sample off。
- 排序: input, sample `999`。
- 退款: toggle, sample off。這是新稿的獨立 UI, 不得沿用舊版
  `不可退款` checkbox。
- 含餐: select, sample `YES`, 右側是獨立的 info tooltip 按鈕, 不嵌入欄位內。
  2026-10-22 再讀 Step 1 `2582:114936`, 含餐列
  `I2582:115072;73:678;2582:114967` 寬 378px:
  label 64px / gap 12px / select 266px / gap 12px / info 24x24。
  icon 與欄位垂直置中; 窄尺寸僅讓欄位流動縮放, 保留 12px 間距與 24px icon。
  原白底、Neutral/200 邊框、Radius/6 與字級維持既有 tokens。
- 專案期間: 2026-02-10 至 2026-03-11。
- 上架期限: 2026-02-10 至 2026-03-11。
- 只保留加人右側的排序; 移除日期區塊後重複的第二組排序。
- 專案天數獨占整列, `等於` / `至少` 橫向單選, sample 是至少 1 夜。
- 專案房型: 全選 / 方案一 / 方案二 / 方案三與 `加` 按鈕。
- 提前訂位: sample 12 天與說明文字。
- 網路開放: sample 12 天與說明文字。
- 文案卡正確文字是 `專案名稱文案` 與 `專案介紹文案`; Figma 的
  `專案名稱案` 是 typo, 實作時必須更正。
- 兩張文案卡 default 都顯示 `尚未填寫` 與 `編輯`。

### Step 2 日期 default

- 頂列為兩個等寬欄位: readonly 專案 `xxx-yyy-zzz` 與 `範本` select。
- select 示意 option 照 Figma 顯示 `avcd001`; 僅渲染原生選單, 套用效果由後端處理。
  不實作覆蓋 / 合併或額外的未使用選項。
- desktop 左側面板 351px, 右側四個月份的 2 x 2 calendar grid。
- Calendar header 顯示起始月份, 左右每次移動 1 個月, 日期依實際月份生成。
- 面板名稱仍為 `日期樣本`; 提示仍為 `套用權重: 上方優先` /
  `單日個別設定優先於樣本` / `長按項目可拖曳排序` (畫面依 Figma 原文標點)。
- 下方提示改為 `點擊: 使用 / 取消使用定義`, 來源池改為 `日期定義`。
- 來源池是系統授權給該使用者的所有日期定義; 數量是系統可用總數, sample 15,
  不隨選入或移除變小。
- 上方 `已加入定義` 只顯示選入數量, 移除舊版的啟用數。sample 選入 d1/d3/d4 共 3 筆,
  顯示順位為 1/2/3。
- 點來源項目加入或取消使用; 加入時 toggle 一律 true。切為 false 即從已加入池移除,
  不保留停用項目。Figma default 還畫有 false 的第 2 筆, 以使用者明確口述規則覆蓋。
- 移除後單日可選清單也同步移除該定義; 不得留下可選的失效項目。
- 已加入項目顯示順位 / 名稱 / 適用星期或日期區間; 上方優先, 單日指定優先於定義。
- 順位由當前清單從上到下連續分配 1 至 N, 使用 Figma `number-0` 至 `number-9`
  SVG icons, 多位數由對應 digit icon 組合, 不用文字替代。順位不是日期定義的固定 ID。
- 拖曳或鍵盤交換項目時立即重編, 拖曳浮動項目同步顯示新順位;
  例如第 2 與第 3 筆交換後, 原第 3 筆顯示 2, 原第 2 筆顯示 3。
- 取消調整還原原順序與編號; 儲存後 Step 3 各價格區依同一順序顯示編號。
  加入或移除也重新連續編號, 日期指定與已輸入價格仍綁定日期定義 ID。
- 日期圖面的零星配色是示意, 不硬編成實際月曆資料。自動分配依第一個適用定義,
  因而每日定義在最上方時一般日期都套用每日; 移到其他定義上方會改變計算結果。
- 被移除定義的單日指定同步清除; 存在剩餘適用定義時按順序重新計算。
- 下方保留指定日期清單與 `將此日期設定儲存成樣本` checkbox。

### 限高與排序

- 已加入與來源是兩個獨立的垂直捲動區, 標題與數量位於清單外。
- 所有 viewport 尺寸皆限高, 不只 desktop; 項目增加不可無限制撐長面板。
- default 已加入含標題區高 302px, 項目範圍約 264px; reorder 含標題 310px,
  項目範圍 272px (outline 對應高度差)。來源項目區高 330px。
- `取消調整` / `儲存調整` 位於捲動清單外。
- 拖曳捕捉設於不會重排的 modal 內 form, 不捕捉到 backdrop;
  長按後原地放開、拖曳後放開或取消 pointer 都不可關閉 modal。
  已加入清單關閉 scroll anchoring,
  避免瀏覽器在移動 row 時抵銷向上或向下的自動捲動。
- 平常手勢用於滑動, 長按已加入項目才進排序模式。
- 排序模式顯示 `正在調整優先順序` / `拖曳項目改變排序, 越上方優先`,
  項目橘色 outline; toggle 與來源項目不可操作。
- 拖曳靠近清單上下邊緣並停留時自動往該方向捲動, 越近邊緣越快。
- 離開邊緣或放開就停止自動捲動; 只捲已加入清單, 來源池與 modal 保持原位。
- 不新增 `移至最上` / `移至最下` 按鈕。
- `取消調整` 放棄本輪順序; `儲存調整` 套用順序。

### 單日指定定義

- 可選內容只來自已加入定義池, 不從全部來源池取值。
- 每個已指定日期只選一個定義; 點目前選項維持選取, 只能改選。
- 選取後 calendar cell 與指定日期清單立即同步。
- desktop 使用 `2589:124502` Popover, 日期標題 / 已加入選項與綠色 check。
- mobile 使用 `2588:124216` 大尺寸 Offcanvas, 由底部向上展開。
- Offcanvas 沿用 `components/offcanvas.md`: viewport 滿寬 / content-fit / body lock /
  右上 close, 不把 192px demo slot 當實際寬度; 不套用 backdrop/Esc 關閉。
- Popover 開啟時量測夾取於 viewport 左右 12px 內, 以 clientWidth 為準。

### Step 3 價格

- modal max-width 760px; 頂部 readonly 專案與 summary `28 間` / `每間` / `1`。
- 間數值 `28 間` 的左緣與上方專案 input 外框左緣對齊。
  再讀 `2724:118363`, source 間數群組 `I2724:118363;73:678;2724:118261`
  使用 64px label + 12px gap, 值起點 x=76, 與專案 input 起點相同。
  小於 640px 時同步既有 `.pcw-field` 的 76px label 欄寬,
  使 `28 間` 也對齊下方計價與天數 input; 不保留造成左偏 12px 的 64px 欄。
- 房型可有複數, 每房型各自使用簡易卡片; 只有一個房型也用相同卡片。
- sample 卡片為 `威尼斯水怪房` / `蝶蝶飛來飛去房`, 垂直排列。
- 每張卡依 Step 2 已加入定義列出價格 input; sample 1/3/4, 值 `8888`。
- 移除 Step 3 全部 toggle 與各區獨立啟用/停用規則, 所有列出的價格皆可編輯。
- 房型卡: Color/Neutral/75 底 / Color/Neutral/200 邊框 / Radius/8 / Spacing/12 padding。
- 主要區塊與卡片 gap Spacing/20; 卡內標題及價格列 gap Spacing/16。
- 成人 / 孩童區域位於房型卡後, 本次只照稿渲染; 不推定為所有房型共用。
- 後端決定成人/孩童顯示兩個 / 其中一個或皆不顯示, 以及價格資料如何套用。
- Step 1 加人 toggle 不在 preview 額外串接這些區域。

## 舊版與 current source 差異 checkpoint

### 以 current Figma 覆蓋

- 舊版住宿 table 改為住宿卡片; GHA 改為按鈕開啟 modal。
- 舊版 `全部 / 上架 / 下架 / 過期 / 刪除` filter 改為目前確認的狀態與期限 filter。
- 舊 Step 1 的 `不可退款` checkbox 改為 `退款` toggle。
- 舊 Step 2 的平日 / 假日 / 連續假日 table 改為日期範本面板 / 排序模式 /
  單日 Popover 或 Offcanvas 與四月曆。
- 舊 Step 3 固定日期類型與獨立 toggle 改為房型卡及已加入定義的可編輯價格列。

### 可沿用但不得改變語意

- shared page shell / topbar / aside / page tabs 與 shared modal controller。
- modal 的新增或修改 session / 步驟切換 / 關閉與 focus restore 基礎機制。
- 房型頁的卡片狀態分類與照片管理版型; 專案內容仍須建立獨立資料與 JS state。
- 共用 Offcanvas 從下往上展開的基礎元件行為。

### 歷史 reference, 不得實作

- Figma `2423:88883` 與 modal `2423:89025` 是 2026-09-22 舊版住宿 Step 1,
  其中使用 `不可退款` checkbox, 只供追溯, 不是 current source。
- 舊 source `2351:99451` / `2362:96112` / `2530:90916` / `2424:92389` /
  `2424:92390` 均不得拿來覆蓋本次 contract。

## 待後端或未定義

- 實際專案 / GHA / 日期範本 / 日期定義授權 / 日期指定 / 價格與排序資料來源。
- 全部定義移除後的驗證規則尚未定義; preview 不額外阻擋或生成後端定義。
- 刪除定義時已存在的單日指定不得保留失效 ID; 正式資料重算方式由後端決定。
- 新增或修改的驗證 / API payload / 成功 / 失敗與 loading state。
- Step 1 加人 toggle 與 Step 3 成人或孩童價格區域的正式資料連動。
- 價格欄位的數值範圍 / 格式 / 空值與 0 的驗證規則。
- tooltip 的正式說明文案由後端或產品資料提供; preview 使用 Figma sample。

## Implementation / verification (2026-10-22)

- 頁面: `preview/project-content.html`, page state 在 `preview/js/project-content.js`。
- 主卡 / GHA / 照片外框: `preview/assets/css/project-content.css`,
  `preview/partials/project-content-extras.html`。
- 三步驟: `preview/partials/project-content-modals.html`,
  `preview/js/project-content-wizard.js`, `preview/assets/css/project-content-wizard.css`。
- 照片狀態獨立在 `preview/js/project-content-photo.js`, 不共用房型頁資料。
- 範本 select 與成人/孩童資料套用保留後端邊界; 不新增實際 API。
- 日期授權 15 筆為 preview sample, 前 4 筆使用本次 Figma 內容, 其餘為名稱示意。
- Typography 補登 `--font-size-2xl` 24px, 來源為當前專案與 GHA 卡標題;
  未重新同步整份 Variables。
- Calendar 四色沿用 Brand/100, Chart/blue, Accent/cart-button-active, Tab/yellow。
- 新增與改版處的 icon 使用 `preview/assets/icons/`, 本輪匯出 13 個既有 Figma icon,
  包含完整 `number-0` 至 `number-9`。
- 瀏覽器以 Chrome 驗證 1440 / 768 / 375, 檢查主卡及三步驟內層 overflow。
- Session 164 順位重編檢查涵蓋交換 / 取消 / 儲存 / 加入移除 / 多位數 SVG,
  以及價格與單日指定資料仍綁定原日期定義; 真實 mouse/touch 拖曳同步更新 ghost 編號。
- Smoke regression 包含實際滑鼠與觸控長按、兩端自動捲動、離開邊緣及放開停止、
  首項移至末項、取消/儲存順序、單日選擇、父子 scroll lock、GHA/照片關閉。
- 產品設定的 ota 入口維持未串接頁面; 專案與數量價格表保留既有連結。
