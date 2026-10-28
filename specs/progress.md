# Progress - 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。
> 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
> （歷史決策可能已被推翻，一律以本檔最新 session 為準）。
> 本檔超過 ~25 個 session 時，將最舊的 10 個搬進 archive。

---

## Session 176: 提交與推送數量價格表新版及驗收修正 (2026-10-28)

### 本輪改動與重要決定

- 使用者明確要求commit & push, 將Session171至175的數量價格表實作、
  最新contract與驗收修正一併納入, 不只提交最後的mobile滿版調整。
- 提交範圍共10個檔案: 頁面HTML、modal partial、domain CSS /JS、共用modal CSS、
  smoke、document-multiple-02.svg、icons registry、page spec與progress。
- 同步page spec的提交授權狀態; 最新Session175不再保留本輪禁止提交的過期敘述。
  更早session仍保留當時的凍結紀錄, 目前狀態以本筆交接為準。
- 本輪進入commit/push flow, 實際SHA與遠端狀態以git history為準。

### 驗證與後續

- 提交前git fetch origin成功, main與origin/main的ahead /behind為0 /0。
- 沿用Session175完整smoke通過10頁 /139項及多尺寸 /多狀態截圖證據;
  本輪只更新交接與授權metadata, 沒有再改產品行為。
- staging後執行fonts /conventions /tokens /partials lint與diff check,
  由pre-commit hook再次檢查; push後核對工作樹及HEAD與origin/main一致。
- 不新增token或開發規則, tokens.md與start.md無需改動。
- 展示資料、真實預設、篩選連動與儲存API仍由後端實作, 本次不擴充該範圍。

## Session 175: 數量價格表套用共用mobile滿版modal規則 (2026-10-28)

### 本輪改動

- 使用者要求確認既有小尺寸modal滿版規則, 若成立直接套用。
- components/modal.md的共用RWD段落已寫mobile滿版, modals.css既有
  fullscreen群組斷點為max-width639px; 本頁三個modal漏登記於該群組。
- 先補page spec, 再把群組編輯 /新增庫存 /細部編輯三個backdrop與modal-box
  加入原共用selector。沒有新增另一套斷點或覆寫全站modal規則。
- <640px無外側留白 /圓角 /外框, 寬高填滿使用100dvh的backdrop;
  ID層級規則亦覆蓋群組option2 /3的837px高度。>=640px保留原寬高限制。
- 更新既有庫存mobile smoke的舊留白寬度expectation, 增補群組三態 /
  detail與nested滿版幾何及關閉後父層scroll lock檢查。

### 驗證與下一步

- Chrome實測360x640 /375x812 /639x812的三類modal皆x=0 /y=0,
  寬高等於viewport, radius與外框為0; 沒有page-level水平溢出。
- 640 /768 /1440實測保留置中, 群組寬514px, 庫存分別616 /744 /1140px。
  群組option1自然高度與option2 /3的837px參考高度在>=640px維持。
- 360窄高情境三種Set儲存按鈕皆可經body垂直scroll捲達;
  庫存各尺寸皆可在local水平scroller捲到最右總房數。
  子modal關閉後父層仍開啟且body鎖定, 父層關閉後解鎖。
- 12張PNG存於specs/qa-screenshots/session-175/, 含mobile三態 /長內容底部 /
  detail /nested /庫存左右, 以及tablet /desktop代表圖; 已視覺核對。
- fonts /conventions /tokens /partials lint與diff whitespace exit0,
  token mirror92個raw值一致, partial manifest10頁 /3 standalone。
- 完整smoke首輪本頁20項通過, 專案內容頁switch與photo close兩項失敗;
  停止並行截圖後重跑完整測試通過10頁 /139項, 本頁20項,
  該兩項未重現; 未改動專案內容頁或其測試。
- quantity-price-table.html與landing.html的localhost:8000預覽皆HTTP200。
- 本輪沿用既有共用規範與tokens /icons /字級 /文案, start.md與tokens.md無新增變動。
- 本輪self-tested; 使用者後續已要求commit & push, 納入Session176提交範圍。

## Session 174: 依使用者設計稿更正移除option 1重複頻道 (2026-10-28)

### 本輪改動

- 使用者更正Session173判斷: 原Figma稿本身有重複頻道, 並非實作漏掉中間組。
  使用者會修改Figma, 明確要求移除一組重複頻道, 不需等待plugin重連。
- Option 1只保留ABC /XYZ與一組頻道1 /2, 共兩組清單;
  option 2 /3仍各三組, 保留各自全選雙向同步與重置 /清除行為。
- Option 1 modal高度隨內容伸縮, 移除重複清單後不留原795px空白;
  option 2 /3仍採837px參考高度與原viewport限制。
- 同步current spec並移除待重讀缺口, 修正既有smoke的option 1組數與內容期待。

### 驗證與下一步

- JS語法、fonts /conventions /tokens /partials lint與diff check exit0。
- 完整smoke通過10頁 /138項, 數量價格表19項; option 1既有檢查已改為兩組,
  仍驗證全選只作用自己內容、個別勾選同步、清除與重新開啟的重置行為。
- 375 /768 /1440實測均只有ABC /XYZ與一組頻道1 /2, 儲存按鈕位於可視範圍,
  無page-level水平溢出。Modal自然高度為mobile681px、tablet /desktop675px。
- 截圖位於specs/qa-screenshots/session-174/, 已視覺核對兩組內容與縮短後高度。
- 不新增token /全域規則, tokens.md /start.md無變動。
- 前述設計稿更正是本輪權威, Session173保留當時等待釐清的歷史紀錄。
- 本輪self-tested /pending user review; 數量價格表尚待使用者整體驗收, 不提交。

## Session 173: option 1重複頻道與中間清單待核對 (2026-10-28)

### 本輪處理

- 使用者指出option 1只應有一組頻道, 中間那組內容被漏掉。
- 核對GROUP_OPTIONS、page spec與smoke, 三者都保留重複的頻道1 /2;
  先前保存的2741:102808 PNG /JSON亦呈現重複內容, 不能由舊資料推測正確中間組。
- 已修正spec: 頻道僅一組, 中間組標記待重讀, 舊讀取結果不作為該組current source。
- 當前get_node /get_metadata皆回報plugin not connected, 沒有工具可代替使用者
  重新啟動Figma plugin連線。未改動實作或憑猜測替換 /刪除中間清單。

### 下一步與未解問題

- 重新連接figma-mcp-go並選取正確option 1 frame, 從當前selection讀取中間組。
- 釐清中間組的文字 /結構後, 一起更正spec、GROUP_OPTIONS與對應smoke expectation,
  確認只一組頻道、中間組完整且全選同步維持各自獨立, 再跑必要QA。
- 過去smoke通過不代表本次更正已覆蓋; 不得沿用重複頻道assertion當驗收依據。
- 本輪僅更新spec /交接, 未變更token /全域規則, 未提交。

## Session 172: 數量價格表房型篩選欄位左緣對齊 (2026-10-28)

### 本輪改動

- 使用者驗收指出房型label亦需固定寬, 堆疊時右側欄位需與平台 /專案切齊。
- 房型沿用既有qp-filter-field--wide-label, 三組label皆64px +gap12,
  不新增CSS /token; 各select相對欄位左緣偏移統一76px。
- 同步quantity-price-table spec, 以本次驗收更正覆蓋Figma原32px房型label。
- 本輪為單一HTML class修正, 不新增鏡射實作的測試; 使用既有smoke與實際
  375 /768 /1440量測 /截圖確認對齊與頁面無水平溢出。

### 驗證與下一步

- Chrome實測三組label皆64px, select相對欄位偏移皆76px;
  375時三個select左緣皆x=101, 768時皆x=361,
  1440橫排亦保持相同label寬與gap, 各尺寸無page-level水平溢出。
- 已檢視375 /768 /1440截圖, 存於specs/qa-screenshots/session-172/。
- node scripts/smoke-test.mjs exit0: 10頁 /138項, 本頁19項;
  fonts /conventions /tokens /partials lint與git diff whitespace exit0。
- 沿用既有tokens /icons /全域規則, tokens.md /start.md無新增變動。
- Session171尚待使用者整體驗收, 本次修正一併保留;
  本輪self-tested /pending user review, 不提交。

## Session 171: 數量價格表 1028 v1.1 contract 與改版實作 (2026-10-28)

### 本輪改動與確認

- 逐張讀取並對照新版主頁2741:102458、群組編輯三態2741:102808 /
  2742:103754 /2742:104942、庫存modal2742:105152的JSON與PNG。
- 使用者更正最初選到的2590:124601是舊稿, 不作為本輪新版來源。
- 重新整理specs/pages/quantity-price-table.md為current contract,
  退役舊群組accordion與12個月庫存規格, 明列沿用 / 覆蓋範圍。
- 主頁新增平台; 後端提供選項 / 真實預設 / 連動; 清除有預設回預設, 無則空白。
- 群組預設option1, 三種Set切換; To調整數量。
  最新指定重置為0、日期空白、星期與下方三組清單全不選;
  清除保留當前Set, 切換Set重置其他內容, 各組全選獨立雙向同步, 儲存後關閉。
- Standard Rate名稱格以新版Neutral/75淺藍底為準;
  細部群組入口串接option1子modal, 沿用既有疊層與scroll lock。
- 補查沿用detail source2590:125176的PNG /JSON; 群組icon實際為
  document-multiple-02, 已從當前Figma匯出SVG並登記icons.md, 不使用近似圖形。
- 庫存改14個月(2026-08至2027-09)、三房型、5+9年份span;
  超出原12月表頭淡橘底。任一房型當月不可用則批次disabled,
  可用房型仍能個別勾選; disabled涵蓋checkbox與整格範圍。
- 小尺寸庫存表在modal內水平scroll, 完整保留欄位, 不產生頁面溢出。
  資料範圍 / 開放狀態 / 實際儲存套用由後端提供, 預覽照Figma示意。

### 驗證與下一步

- Read-only audit確認現有HTML /JS /CSS原為舊版, 舊smoke亦保留過期預設。
- 本輪已修改quantity-price-table.html /專屬modal partial /domain CSS /JS,
  依序替換主頁、群組 /detail與庫存, 保留共用controller與已確認的14天表格功能。
- 補正無單量chip為當前Figma紅底白字 /Radius24 /16px,
  保留先前使用者確認的完整14天框線與合併格綠底。
- Smoke已替換過期預設與12個月檢查, 新增狀態轉換 /全選同步 /disabled /
  nested modal /預設還原或清空 /局部水平scroll等contract-specific檢查。
  首跑暴露測試日期排序與舊selector假設, 已由測試端修正後重跑。
- 沿用既有tokens, 沒有使用者要求同步Figma Variables, 不做全量同步。
- fonts /conventions /tokens /partials lint與diff whitespace均exit0;
  tokens strict mirror92個raw值一致, partial manifest10頁 /3 standalone。
- Chrome完整smoke exit0: 10頁 /138項, 數量價格表19項。
  涵蓋完整14天表格與inline、雙月曆、篩選預設 /無預設兩分支、三態切換重置 /
  清除保留Set /各組全選、儲存關閉 /nested鎖定、14月年份 /示意資料 /
  disabled範圍 /可用月同步、真實pointer點cell空白區與右側總房數可達性。
- 實作19張PNG於specs/qa-screenshots/session-171/, 另保留6張sourcePNG。
  主頁 /三種群組reset /nested涵蓋375 /768 /1440, 庫存涵蓋1440、
  768(含捲到右側)與375左右scroll。Mobile庫存截圖為真實viewport375x812,
  768截圖為768x1024; 避免full-page擷取把viewport外內容混入modal驗收圖。
- Mobile backdrop為375x812且與viewport一致; tablet page scrollWidth768,
  modal x=12..756, 表格只在local scroller溢出, 右側總房數可捲達。
  Root已視覺核對代表圖, 原生水平scrollbar保留。
- Astra獨立review未發現剩餘JS行為缺口; 無單量chip、庫存名稱置中與badge
  padding等視覺發現均已依當前PNG /JSON修正並核對。
- 日期選取互動沿用; 配合新版排版補上fixed popover定位與clientWidth夾取,
  未導入新日期UI或專案內容四月曆。
- 既有tokens與全域工作規則未新增 /修改, tokens.md /start.md無需變更。
- Preview localhost:8000的landing.html與quantity-price-table.html均HTTP200。
  本輪self-tested /pending user review, 驗收前不提交; 實際資料與API留給後端。

## Session 170: 提交紀錄與規格一併保存, 補入數量價格表 contract (2026-10-22)

### 使用者要求與本輪改動

- 使用者要求把本次紀錄與相關檔案一起包含並推送, 不再留下本機孤兒規格。
- `start.md` 已補入提交範圍核對、紀錄與對應 spec / contract 一起保存,
  以及 push 後檢查工作樹與遠端同步的必要步驟。
- 等待開工、待實作或不同任務不得作為排除已要求保存之規格的理由;
  保存規格不代表授權實作, UI 實作驗收要求維持既有規則。
- 本批一併納入 Session 162 的 `specs/pages/quantity-price-table.md`
  current contract, 補正 Session 169 只推送交接卻漏下對應規格的情況。
- Session 169 保留當時提交範圍的歷史紀錄, 其排除理由不作為後續流程依據。
  本輪不修改數量價格表 preview 實作, 後續仍依明確開工指示處理。

### 回溯核對與驗證

- 本輪開始時工作樹唯一改動為數量價格表 spec, 沒有其他遺留檔案。
  Session 162 的交接已在 `0680973` 隨 progress.md 提交, 對應 spec 尚未納入;
  本批將該 spec、start.md 與本次交接一起進入 commit/push flow。
- 相關流程以 start.md 為單一權威, AGENTS.md 保持入口引用, 不複製規則。
- 可用 Git status / staged diff 核對檔案清單; 檔案歸屬與使用者保存 / 排除指示
  需 review, 不新增無法準確判定語意範圍的 lint。
- 本輪僅修改規則與規格紀錄, 無 token 或 UI 實作改動, tokens.md 不需同步。
- 提交前執行 repo pre-commit 的 fonts / conventions / tokens / partials lint
  與 staged diff whitespace check; 推送後核對工作樹與 origin/main。
- 實際 SHA 與遠端狀態以 git history 與本輪推送後檢查為準。

## Session 169: 專案內容改版與驗收修正 commit/push 交接 (2026-10-22)

### 使用者驗收與提交範圍

- 使用者確認「可以了 commit & push」, 本批進入 commit/push flow,
  實際 SHA 與遠端狀態以 git history 為準。
- 提交 Session 163 至 168 的專案內容住宿卡片 / GHA modal / 三步驟 modal /
  日期定義排序與順位 icons / 狀態 tab 統計 / UI 對齊修正。
- 一併提交產品設定只保留 ota、專案內容、數量價格表的 menu 整理,
  以及四頁圖片 modal 的共用 mouse/touch 排序、取消保存與關閉修正。
- 相關 Figma 資產、tokens 24px 字級、component/page specs、partial manifest
  與 regression checks 均隨本批提交。
- `specs/pages/quantity-price-table.md` 是原有獨立待實作 contract,
  不屬於本批驗收, 排除本次 staging, 保留本機工作樹供該任務後續處理。

### 驗證與交接

- 最後程式變更後 `node scripts/smoke-test.mjs` 10 頁 exit 0,
  專案 23 項; 狀態統計、mobile 對齊、mouse/touch 排序與 modal 行為均涵蓋。
- 375 / 768 / 1440 視覺 QA 與 Figma 核對紀錄見 Session 163 至 168,
  截圖位於對應 session 的 `specs/qa-screenshots/` 子目錄。
- fonts / conventions / partials / tokens lint、untracked 新檔 conventions
  與 `git diff --check` 均通過, commit 時再執行 repo pre-commit hook。
- 上一輪確認 landing / project-content preview HTTP 200。
- 本批新增字級 token 已同步 `specs/assets/tokens.md` 與 base CSS;
  共用互動 pattern 已同步 `specs/html-conventions.md`, 未新增全域開發規則,
  `start.md` 維持原內容。
- 範本套用、日期定義授權、成人/孩童權限與真實 API 維持後端邊界。
- 後續數量價格表實作須另依使用者開工指示進行, 不從本批驗收推論授權。

## Session 168: 價格頁手機間數值與 input 左緣對齊 (2026-10-22)

### 本輪改動

- 使用者指出 Step 3 的間數 / 28 間應對齊上下 input, 要求核對。
- 再讀 Figma `2724:118363` JSON / PNG, 間數群組
  `I2724:118363;73:678;2724:118261` 為 64px label + 12px gap,
  值起點 x=76 與專案 input 外框起點一致。
- 實測 1440 / 768 原本已對齊; 375 的 summary label 仍為 64px,
  上下 `.pcw-field` 已切為 76px, 造成 28 間左偏 12px。
- 僅修正小於 640px 的 `.pcw-price-summary` label 欄寬為 76px,
  與既有欄位規則一致。桌面、平板排版與資料維持既有行為。
- 同步 `specs/pages/project-content.md` 與既有 smoke alignment assertions。

### 驗證與下一步

- Chrome 實測: 1440 的專案 input / 間數值左緣同為 x=429,
  768 同為 x=101; 375 修正前 100 / 88, 修正後專案 / 間數值 /
  計價 / 天數皆為 x=100。無水平溢出。
- Source、before / aligned 三個尺寸截圖在 `specs/qa-screenshots/session-168/`。
- `node scripts/smoke-test.mjs`: 10 頁 exit 0, 專案 23 項,
  包含 desktop / responsive 間數與 input 邊界對齊檢查。
- fonts / conventions / partials / tokens lint、untracked wizard CSS conventions
  與 `git diff --check` exit 0; preview landing / project-content HTTP 200。
- 沿用既有欄寬與 spacing tokens, 無新增 token 或全域開發規則,
  `tokens.md` / `start.md` 不需改動。
- self-tested / pending user review, 未 commit/push; 其餘未提交工作保留。

## Session 167: Step 1 含餐欄位與 info icon 分離 (2026-10-22)

### 本輪改動與來源

- 使用者指出第一頁含餐欄位的 info icon 應獨立放在欄位右側, 不可嵌入欄位。
- 重新讀取 Figma Step 1 `2582:114936` JSON 與 PNG,
  含餐列 `I2582:115072;73:678;2582:114967` 為 378x36:
  label 64px / gap 12px / Select 266x36 / gap 12px / info 24x24。
  Select sample 是 YES, 本輪保留既有下拉欄位, 只修正組合排版。
- info icon node `I2582:115072;73:678;2582:114970` 是欄位 sibling,
  其 x=354、y=6; source PNG 同時確認 info 在框外, tooltip 是浮動說明。
- `project-content-wizard.css` 移除按鈕 absolute/right 與欄位額外 40px padding,
  改為 flex 欄位 + 12px gap + 不縮放的 24px info button; icon 本身亦為 24px。
  tooltip 的 hover / focus 機制保留。
- 同步 `specs/pages/project-content.md` 與 smoke contract checks。

### 驗證與下一步

- Chrome 1440 / 768 / 375 測量 icon 24x24, 與欄位間距皆為 12px、垂直置中,
  欄位隨可用空間縮放, modal body 無水平溢出。
- Focus 可顯示 tooltip, 說明框維持於 viewport 內。
- Source 與實作 default / tooltip 截圖在 `specs/qa-screenshots/session-167/`。
- `node scripts/smoke-test.mjs`: 10 頁 exit 0, 專案內容 23 項,
  追加 desktop 與 responsive 欄位 / info 間距與尺寸檢查。
- fonts / conventions / partials / tokens lint、untracked wizard CSS conventions
  與 `git diff --check` exit 0。沿用既有 spacing / icon / 字級 tokens,
  無新增 token 或全域規則, `tokens.md` / `start.md` 不需改動。
- 狀態 self-tested / pending user review, 未 commit/push; 其他未提交工作保留。
- 驗收入口 `http://localhost:8000/project-content.html`,
  `http://localhost:8000/landing.html`。

## Session 166: 專案狀態 tab 數量與卡片同步 (2026-10-22)

### 本輪改動

- 使用者指出卡片分類已隨啟用 / 停用變動, 但 tab 仍保留 Figma 示意數量。
- 專案內容 `全部` / `上架` / `停用` 改由 `projectCards` 同一份資料統計,
  每次 render 同步更新三個後綴, 不以目前可見清單數量替代其他分類的統計。
- 預設 4 / 2 / 2; 停用一張後 4 / 1 / 3, 重新啟用恢復 4 / 2 / 2。
  所有卡停用或啟用亦可正確顯示 4 / 0 / 4 或 4 / 4 / 0。
- HTML 移除 99 / 8 / 8 示意值, 由具名 count 節點接收統計。
  沿用既有文字、括號、樣式、tokens 與 icons, 不更名 tab。
- 修改 `preview/project-content.html`, `preview/js/project-content.js`,
  `specs/pages/project-content.md` 與 smoke regression。

### 驗證與下一步

- `node scripts/smoke-test.mjs`: 10 頁 exit 0, 專案內容 23 項;
  包含初始數量、切換 tab、啟用停用、兩種零分類與還原狀態。
- fonts / conventions / partials / tokens lint 與 `git diff --check` exit 0。
- Chrome 1440 / 768 / 375 檢查初始、停用與零分類數量, 無水平溢出;
  截圖位於 `specs/qa-screenshots/session-166/`。
- localhost:8000 的 landing / project-content HTTP 200。
- 未新增 token 或全域開發規則, `tokens.md` / `start.md` 不需改動。
- 先前工作與數量價格表未提交 spec 保留。self-tested / pending user review,
  未 commit/push。

## Session 165: Toggle component 還原、長按 modal 修正與四頁圖片觸控排序 (2026-10-22)

### 本輪改動與使用者確認

- 使用者回報四項問題: toggle 失真、日期定義長按調整後 modal 關閉、手機版外層
  padding 未移除、圖片 modal 僅 desktop 可拖放。
- 使用者確認手機只移除頁面外層留白, 日期 modal 面板內距保留。
- Step 1 / 已加入定義改用 `.member-data-switch` 共用結構, 移除整組自訂
  `.pcw-toggle` CSS 與 GHA override。track 64x28, knob 24x24 圓形,
  checked 位移 36px。排序 disabled 使用共用灰 track, 不整顆降低 opacity。
- 實際重現 mouse 長按原地放開後 modal 關閉: capture target 是 backdrop,
  release 產生的 click 被當成點背景。改在不重排的 form 捕捉與處理 lost capture,
  不改共用 modal backdrop 關閉規則。
- 專案頁 `rootWrap` 改 `md:p-3`, 小於 768px 外層 padding 歸零;
  mobile top bar 自帶 `px-3 pt-3`, 其他內容與 modal 內距保留。
- 全 repo audit 發現 4 個照片管理器只有原生 drag/drop:
  專案內容 / 房型 / 民宿資料 / 加購商品, 本輪全部補上觸控排序。

### 圖片排序實作

- 新增 `preview/js/photo-sort.js`, 四頁只共用手勢, working/saved 資料仍各自獨立。
- dots-line 把手支援滑鼠 / touch / pen pointer 與方向鍵, 保留 desktop 卡片原生
  drag/drop。把手預設 touch-action none 與禁止圖片 callout, 卡片其他區域仍可滑動。
- 手勢在 grid 捕捉, 拖曳浮動卡片不攔截 hit target。靠近 photo body 上下邊緣時
  自動捲動, 放開套用 working 順序, pointer cancel 放棄此次拖動, 關閉會清除手勢。
- 只按上傳才保存, 取消還原; 重新渲染後編號與主圖 pill 維持依順位。
- 同步修正民宿與房型上傳後 body scroll lock 殘留; 三頁上傳按鈕一律走 shared
  modal controller, 移除頁面 JS 手動關 backdrop / 強制解鎖。專案頁原本已走共用關閉。
- Binding audit: 四頁原 dragstart / dragover / drop 搬到 shared helper,
  replace / delete / file change / upload commit 保留各頁; header / footer cancel /
  upload / backdrop / Esc 關閉責任由 shared modal controller 維持。

### 驗證

- `node scripts/smoke-test.mjs`: 10 頁 exit 0, 專案 22 項, 民宿 16 項,
  房型 17 項, 加購 14 項。
- 新增真實 Chrome stationary mouse/touch 長按後放開檢查, modal 保持開啟;
  原有雙邊自動捲動、首末交換與順位連動檢查仍通過。
- 每個圖片 modal 均以真實 touch 檢查正常滑動 / 把手排序 / pointer cancel /
  取消還原 / 上傳保存 / 首項拖至最末 / modal 與 body lock; 原生 drop 綁定與
  真實 desktop mouse 把手拖曳亦逐頁檢查。
- Switch checked / off / disabled 幾何與共用狀態檢查, 各尺寸量測 track 64x28,
  knob 24x24, 保持在 track 內。
- 375 / 768 / 1440 截圖含主頁、Step 1、日期定義 default/排序、GHA 與四頁圖片
  modal; 手機圖片另存 dragging / sorted 狀態。無 document 或日期 body 水平溢出。
- 截圖: `specs/qa-screenshots/session-165/`。
- fonts / conventions / partials / tokens lint、untracked 新檔 conventions、
  `git diff --check` exit 0。全部沿用既有 tokens / icon / 字級。
- `components/modal.md` / `specs/html-conventions.md` / 四頁 spec 同步;
  沒有新增全域開發規則或 tokens, `start.md` / `tokens.md` 本輪維持原內容。
- 數量價格表原有未提交 spec 與先前改版工作保留, 本輪不改該頁實作。

### 下一步

- self-tested / pending user review, 未 commit/push。
- 驗收頁: `project-content.html`, `room-type.html`, `lodging-info.html`,
  `purchase-addon.html`, 以及 `landing.html`, 全部由 localhost:8000 提供。
- 手機拖曳從每張圖左上 dots-line 把手開始, 一般圖片區域仍保留垂直滑動。

## Session 164: 日期定義順位 number icons 與即時重編 (2026-10-22)

### 本輪改動與決策

- 使用者補充: 日期定義前方數字使用本批重讀的 Figma number icons,
  由上到下依當前順位分配; 原第 2、3 筆交換後, 原第 3 筆改為 2, 原第 2 筆改為 3。
- 移除日期定義固定 number 欄位, 改由清單 index 產生 1 至 N。
  拖曳、鍵盤調整及拖曳浮動項目立即同步編號; 加入或移除亦連續重編。
- 取消還原原順序與編號, 儲存後 Step 3 房型 / 成人 / 孩童價格列沿用相同順序。
  單日指定與價格資料仍依日期定義 ID 保存, 不因順位改變而交換資料。
- 再讀並直接匯出 `number-5` 至 `number-9` 與 `number-0`, 補齊 10 個 digit SVG。
  多位數由 digit icons 組合, 保留原 24x24 SVG 幾何與原始 glyph 大小;
  防止 Tailwind img max-width 將窄 digit slot 內的 SVG 縮小。
- 修正拖曳後 click suppression 可能殘留到下次 toggle 操作的狀態;
  放開後僅攔截緊接的 click, 重新開啟 modal 時清空。
- 同步 `specs/icons.md` 與 `specs/pages/project-content.md`。
  沿用原 token, 未新增全域開發規則, `tokens.md` / `start.md` 不需改動。

### 驗證

- Smoke: 10 頁通過, 專案內容 20 項。新增順位交換 / 取消 / 儲存 /
  加入移除 / 多位數 SVG / 原尺寸與價格、單日指定資料完整性檢查。
- 真實 Chrome mouse / touch 拖曳: 首項拖至最末時 list 與 ghost 都顯示新順位 15,
  拖回最前時 ghost 還原 1; 兩側自動捲動與放開停止保持有效。
- 1440 / 768 / 375 截圖核對 default / swapped / prices / double-digits,
  另含 1440 拖曳中的 ghost。已加入限高 264px, 來源 330px, 無水平溢出。
- 截圖路徑: `specs/qa-screenshots/session-164/`。
- fonts / conventions / partials / tokens lint 與 untracked 新檔 conventions 檢查通過。
- 本機 landing 與 project-content 預覽 HTTP 200。

### 下一步

- self-tested / pending user review, 未 commit/push。
- 驗收網址: `http://localhost:8000/project-content.html`,
  `http://localhost:8000/landing.html`。
- Session 163 其他改版與數量價格表原有未提交 spec 保留。

## Session 163: 專案內容 1021 改版與產品設定選單整理 (2026-10-22)

### 本次處理

- 使用者逐張確認本輪 Figma 差異, 並於 2026-10-22 授權實作。
- 9 個來源均已重新讀取 JSON/PNG, main/date/GHA 另讀 SVG 漸層。
  current source 與 children checklist 已收斂至 `specs/pages/project-content.md`。
- 實作範圍: 專案住宿卡片、GHA modal、三步驟新增/修改、單日選擇與照片管理。
- 產品設定選單只保留 `ota` / `專案內容` / `數量價格表`;
  ota 目前沒有實作頁面, 保留既有無連結入口, 不新增目的地。
- 數量價格表 Session 162 規格與既有未提交變更保留, 本輪不實作該頁改版。

### 本輪確認事項

- GHA 原主分類移除, 由期限條件旁按鈕開啟 modal; 卡片內容沿用。
- 有使用範本的專案顯示不可點擊的藍色範本 label。
- Step 1 移除重複排序, 專案天數獨占整列。
- Step 2 來源池為系統授權日期定義總數; 已加入數隨選取變動。
  加入預設 true, toggle false 就移除; 單日可選清單同步移除。
- Step 2 範本 select 僅顯示選項, 後端負責套用。
- 兩個清單各自限高並垂直捲動, 所有尺寸皆同。長按進排序;
  拖曳靠近上下邊緣持續自動捲動, 越近越快, 離開或放開停止。
  只捲已加入清單, 來源與 modal 不動; 不增加移至最上/最下按鈕。
- Step 3 每房型各一卡, 單一也一樣; 移除全部 toggle, 價格皆可編輯。
  成人/孩童區域照稿渲染, 顯示權限與價格套用方式交由後端決定。
- 使用者再次確認原 640px container query 門檻:
  即使 viewport 1440px, 每卡 522px 仍採 mobile 結構, 是本次 Figma 圖面例外。

### 實作與資產

- `preview/project-content.html` / `preview/js/project-content.js` / domain CSS 改為
  4 張住宿卡片, 狀態切換、獨立明細/設定 accordion、排序與範本提示。
- 三步驟獨立在 `project-content-wizard.js` / `project-content-wizard.css`,
  `project-content-modals.html`; GHA/照片外框在 `project-content-extras.html`。
- `project-content-photo.js` 採獨立 per-project saved/working state,
  取消不寫回、上傳後更新主圖, 不共用房型頁狀態。
- 從當前 Figma 匯出 7 個既有 SVG icon, 從來源 SVG 擷取 3 張原始 JPEG。
- `tokens.md` / `base.css` 補登 24px `--font-size-2xl`, 來源為當前專案/GHA
  card 標題; 所有顏色仍引用既有 Variables, 未全量重同步。
- menu spec、icons spec、page spec、partial manifest 與 CSS import chain 均已同步。

### 驗證

- `node scripts/smoke-test.mjs`: 10 頁 exit 0, 專案內容 19 項。
- 真實 Chrome mouse/touch 長按排序: 首項可拖至末項, 上下邊緣自動捲動,
  離開邊緣或放開後停止。來源池與父 modal scrollTop 維持不變。
- 排序捕捉改到不會重排的 modal, 並停用 joined list 的 scroll anchoring,
  修正 pointer capture 中斷及瀏覽器錨點抵銷向上捲動的問題。
- 單日 Popover 選取後維持單選, 立即更新 calendar/指定日期;
  改用事件 composedPath 判定點擊來源, 避免重建選項 DOM 後被誤判成外部點擊。
- Mobile Offcanvas 滿寬, backdrop/Esc 不關閉, close 後父 modal 仍鎖住 body scroll。
- 1440 / 768 / 375 無 document 水平溢出; 預設 joined list 264px、source 330px,
  排序 joined list 272px, 各尺寸一致。每卡小於 640px 保持 mobile 結構。
- Step 3 兩張房型卡、12 個可編輯價格欄、0 個 toggle; 清除只作用當前頁。
- 截圖在 `specs/qa-screenshots/session-163/`, 包含主頁、三步驟上下區域、
  GHA、拖曳與 mobile Offcanvas。規格與畫面差異以本 Session 的使用者確認為準。
- fonts/conventions/partials/tokens lint 與 `git diff --check` exit 0。
- 原有數量價格表 spec 與 Session 162 保留; 未修改該頁 preview 實作。
- 協作代理因 workspace credits 中止, root 接手其餘程式與驗證;
  不將代理中止前的部分工作當作本輪通過依據。

### 下一步與邊界

- 狀態為 self-tested / pending user review, 未 commit/push; 等使用者驗收。
- 驗收入口 `http://localhost:8000/project-content.html`, 同時保留 landing 預覽。
- ota 仍是既有未串接入口; 範本套用、成人/孩童權限、實際資料與 API 交由後端。
- 全部日期定義移除後的正式驗證規則、價格格式與 API 成功/失敗狀態仍未定義。
- 本輪沒有新增全域開發規則, `start.md` 維持原內容。

## Session 162: 數量價格表改版 Figma contract 與待開工交接 (2026-10-03)

本輪任務是「產品設定 -> 數量價格表」, 與 Session 161 的「專案內容」改版
分開管理。使用者要求先寫入交接, 等通知開工後才修改實作。兩個任務均有待實作
內容, 開工時依使用者指定的任務處理, 不可合併兩頁規格或順便修改另一頁。

### Figma current source

- Page: `1:2` `components`, file `swift`。
- 數量價格表 desktop: `2590:124601`, 1440 x 943.48。
- 主內容: `2590:124605`, 1140 x 569; 主卡片 `2590:124611`, 1140 x 509。
- 群組編輯 reference: `2590:124714`, 534 x 1081;
  modal `2590:124715`, 514 x 1061。
- 價格細部 modal: `2590:125176`, 514 x 297。
- 新增庫存 modal: `2592:128347`, 1044 x 367。
- 日期區間展開: `2590:124719`, 746 x 406。
- 雙月曆 default / 單選 / 區間: `2590:124819`, `2590:124914`, `2590:125009`。
- Read date: 2026-10-03。三個 group accordion 的按鈕名稱依使用者後續確認改為
  「清除」; 使用者已更新 Figma 並指示不用重新讀取。

### 已確認 contract

1. 完整 14 天 table 與 1216px 寬度沿用既有實作, 不跟隨 Figma 下方只畫
   5 個日期 cell 的縮短示意。三個價格列仍只顯示名稱, 第二、三列名稱欄為灰底。
2. 「快速新增庫存」改為「新增庫存」, 帶 plus icon, 移到主卡片右上方獨立列。
   第二操作列保留日期區間與帶 icon 的群組編輯, 右側改為清除與深灰底查詢。
3. 主頁「清除」只清除專案 select、房型 select 與日期區間, 不開啟 modal。
   對話中曾把「本頁不加入 modal」寫得太廣; 後續 selection 已明確提供三顆
   modal, 不得把前一句解讀為移除本頁所有 modal 功能。
4. 群組編輯包含可售數量、價格、房況三個獨立 accordion, 預設全部展開。
   星期、房況與其他示意值依本次 Figma 呈現, 例如星期一與四、關房、可售數量 12。
5. 三區「取消」是圖面誤植, 改為「清除」, 只清除目前 accordion 內容;
   不影響其他區或上方共用日期 / 星期。各區「儲存變更」也只作用於目前
   accordion, 不關閉 modal。這個規則不得擴張到 detail 或 inventory modal。
6. 「景觀房」是示意字, detail modal 實際資料從主頁 `Standard Rate 447`
   等被操作的 row / cell 帶入。
7. 新增庫存改為一張橫向月份 table, 2026 年 8 月至 2027 年 7 月, 共 12 個月。
   欄寬為房型 300px、每月 48px、總房數 144px; 三個示意房型 AAC / AZC / ZZO,
   總房數 input 均為 999, table 下方保留可見的取消與儲存變更。
8. 上方每月 checkbox 勾選 / 取消時同步操作該月份的所有房型。下方同一月份
   全部房型選滿時上方也選中, 任一取消時上方取消。使用者已確認「選滿一行」
   指同一月份的所有房型, 不是某房型的 12 個月份。
9. 上下所有月份 checkbox 的點擊範圍填滿各自 cell, 點空白處效果相同,
   單次操作只切換一次。這次需做前端同步互動, 不沿用舊版只有 UI 的規則。
10. 三顆 modal JSON 的 hidden `Slot 2` 含「清除 / 下一頁」, PNG 都不可見,
    不實作。Group accordion 的「清除」與 hidden footer 是不同範圍。
11. 雙月日期區間本輪只重新確認。四個新舊 frame 排除 ID / 畫布位置後,
    尺寸、結構、文字與 styles 相同, PNG 逐一相同; 沿用既有 spec / JS。
    不導入「專案內容」的四月曆、日期範本或 mobile Offcanvas。

### 本輪改動

- 更新 `specs/pages/quantity-price-table.md` 為本次 current contract, 包含來源、
  children checklist、confirmed defaults、互動範圍、沿用 / 覆蓋及未確認項目。
- 重寫過期 group / inventory 規則, 移除舊版星期二預設、三區取消關閉 modal、
  673px 庫存 modal、直向月份巢狀 table 與舊房型等 current 內文。
- 新增本 Session 交接; 保留 Session 161 原文與 `specs/pages/project-content.md`
  既有未提交內容。本輪不修改 preview、scripts、tokens 或 start.md。

### 驗證

- 頁面與三顆 modal 讀取 selection tree / styles 並以 PNG 核對可見內容。
- 日曆新舊對照:
  `2590:124719` / `2387:103133`, `2590:124819` / `2387:104431`,
  `2590:124914` / `2387:103777`, `2590:125009` / `2387:104101`。
  四組結構比較均 0 差異, 1x PNG 輸出逐一相同。
- `git diff --check` 與 `./scripts/lint-conventions.sh` 均 exit 0。
- 309 個參考與實作檔案的 SHA-256 與寫入前相同, 包含 project-content spec、
  preview、scripts、tokens 與 start.md。本輪沒有 UI 實作,
  不把前次 smoke / QA 結果當作新版通過。
- 本輪沒有新增 token 或開發規則, tokens.md 與 start.md 不需修改。

### 未確認項目

- Detail modal 內層「群組編輯」是否串接巢狀 modal; 舊版只有外觀的決定
  不可自動沿用為新版需求。
- Detail / inventory 的儲存後 modal 開關行為與庫存總房數套用方式。
- 實際資料與 API 由後端提供; 未定義行為開工時先確認, 不從示意畫面推測。

### 下一次開工

1. 等使用者通知開工, 按指定任務處理。數量價格表只讀本 Session 與
   `specs/pages/quantity-price-table.md`; 專案內容改版另讀 Session 161 與其專屬 spec。
2. 數量價格表預計修改 `preview/quantity-price-table.html`、
   `preview/partials/quantity-price-modals.html`、`preview/assets/css/quantity-price-table.css`、
   `preview/js/quantity-price-table.js`, 並依需要調整 `scripts/smoke-test.mjs`。
3. 先做舊實作 vs current contract 差異 checkpoint, 保留 14 天 table、inline
   number / hotspot 與相同的雙月曆。一次不超過一個 section。
4. 驗證主頁 filters 清除、三區獨立收合 / 清除 / 儲存不關閉、上下月份同步與
   整格 checkbox 點擊; QA 至少 1440 / 768 / 375, 檢查內部水平捲動與日期區間。
5. 依 start.md 跑必要 lint / smoke、提供截圖與 preview URL, 待使用者驗收。

## Session 161：專案內容改版 Figma contract 與實作交接 (2026-10-01)

使用者以 figma-go 分批提供「產品設定 -> 專案內容」住宿、GHA、mobile card、
三步驟新增或修改 modal、日期 Popover 與 mobile Offcanvas，並完成需求問答。
本輪只整理 current spec 與交接，依使用者要求延後至下一次再實作。

### Figma current source

- 住宿 desktop：`2582:116671`，1440 x 2011。
- GHA desktop：`2588:121840`，1440 x 1059。
- 住宿 mobile card：`2584:119146`，351 x 1166。
- Step 1：`2582:114936`，820 x 1310。
- Step 2 default：`2577:104171`，1140 x 1295。
- Step 2 reorder：`2578:110113`，1140 x 1333。
- Step 3：`2582:113320`，780 x 1283。
- Mobile date Offcanvas：`2588:124216`。
- Desktop date Popover：`2589:124502`。

### 已確認 contract

1. 頁面 default 是住宿、全部、未逾期、房型全部；未逾期與已逾期單選。
2. 上架卡顯示修改、複製、停用；停用卡顯示查看、啟用，切換後立即重新分類。
3. 專案明細與專案設定是獨立 accordion，default 都展開；同列卡片等高。
4. 設定 table 以水平 scrollbar 保留固有寬度。GHA 與停用 filter 不顯示
   儲存排序；全部 filter 只 disabled 停用卡的排序 input。
5. GHA 只顯示卡片與說明 accordion；toggle true 或 false 同步控制左上角黃色或
   灰色漸層，排序是後端資料文字。
6. card 小於 640px 採 mobile 結構，nested card 使用 container query；操作按鈕
   空間不足時 flex-wrap。
7. Step 1 使用 `退款` toggle，不沿用歷史版本的 `不可退款` checkbox；補上
   `專案類型` label，並將 Figma typo 更正為 `專案名稱文案`。
8. Step 2 以日期範本、長按拖曳排序、四月曆與單日指定取代舊日期類型 table；
   月曆每次移動 1 個月。
9. 每個日期一定且只能選一個範本；目前選項不會取消，只能改選，並立即同步
   calendar 與指定日期清單。
10. desktop 日期選擇使用 Popover；mobile 使用從下往上展開的大尺寸 Offcanvas，
    沿用既有 Calendar Offcanvas 模式。
11. Step 3 的售價、成人與孩童三區 toggle 各自獨立；Step 1 加人 toggle 的正式
    連動交給後端，preview 依 Figma 直出。
12. 三步驟的清除只清除當前頁。

### 本輪改動

- 重寫 `specs/pages/project-content.md` 為 2026-10-01 current contract。
- 舊 Figma `2423:88883` 的 `不可退款` 與舊 table/modal 規則降為 historical
  reference，不得補入新實作。
- 沒有修改 `preview/`、測試或產品程式碼。

### 下一次開工

1. 先依 current contract 比對現有 project-content HTML、partial、CSS 與 JS，
   列出沿用、覆蓋與必須移除的舊結構。
2. 依 spec-driven 順序修改 preview，並補 smoke regression checks。
3. QA 至少覆蓋 1440、768、375，另驗證 card container 小於與大於 640px、
   table 內層水平捲動、mobile Offcanvas、日期範本排序與三區獨立 toggle。

## Session 160：Icons data 與 Input variant 更新寫入規格 (2026-10-01)

使用者以 figma-go 依序指定讀取 Icons data 與 Input component set 更新，並
寫入規格；本輪只更新 spec，不匯出 SVG，也不修改 preview 實作。

### Figma current source

- Page：`1:2` `components`。
- Icons selection：`25:93` `Icons`，402x945.01，共 163 個直屬 children。
- 與 `specs/icons.md` 交叉比對後，149 個已有記錄，14 個尚未登錄。
- Input selection：`20:34` `Input`，195x874，共 21 個 variants；新增
  `2578:105314` `status=icons leftside + 3 sub label`，98x60。

### 本輪改動

1. `specs/icons.md` 新增 2026-10-01 current source，登錄
   `lock-time-outline`、`options`、兩個 `data-usage` 與 `number-0` 至
   `number-9` 的 node id、尺寸、paint 與幾何摘要。
2. `#000000` 對應 `Color/Icon/Default`；`data-usage-32-regular` 的
   `#6D6D6D` 對應 `Color/Neutral/500`。
3. 明確標記 14 個 icon 尚未匯出正式 SVG，產品語意、使用頁面與互動狀態也
   尚未定義；實作前仍需完成匯出與用途確認。
4. 記錄 frame 內既有的 `icons/list`、`icons/restore`、`icons/check` 同名節點，
   本輪不自行合併或改名。
5. `components/input.md` 將 variant 數量由 20 更新為 21，Group G 新增三行文字
   variant 的 layout、spacing、typography、color token 與未定義行為。
6. 使用者確認 component set 外層 `#9747FF` 是 Figma 原生 selection 效果，
   與 variant 無關；規格明確排除該 stroke。
7. 使用者確認 `icons/close` 已設定 Alternative item，可任意替換 `icons/`
   開頭的 icon component；規格將此記為共用 icon slot 規則，不再列為疑點。

### 驗證

- Figma root children checklist：163 個直屬 children，逐項取得 id、名稱、類型
  與尺寸。
- 14 個新 component 以 `get_nodes_info` 逐一讀取 bounds、children、fills 與
  strokes，並用 selection PNG 交叉確認可見圖形。
- 本地 `preview/assets/icons/` 與 repo 全文搜尋確認沒有這 14 個正式資產或既有
  規格記錄。
- Input component set 的 21 個 child 已逐項取得 id、名稱、尺寸與 styles；新
  variant 另讀完整 node、3 個文字節點並以 3x PNG 交叉確認。

## Session 159：數量價格表移除價格列附加 UI (2026-09-23)

使用者以 figma-go 指定調整「數量價格表」下方 table，移除人數與設定操作及
`非 XML`，並確認依目前 Figma frame 實作。

### Figma current source

- Page：`2386:98257` `Frame 400`，1140 x 530。
- 下方 table：`2386:101801`，604 x 214。
- 價格 rows：`2386:101828`、`2386:101841`、`2386:101856`。

### 本輪改動

1. 三個價格 row 的 label cell 只保留專案名稱，移除 person icon、`設定`、
   `X2 編輯`，並從第二、三列移除 `非 XML`。
2. 依 Figma 補回第二、三列左側名稱欄的 Neutral/100 灰底；第一列與右側價格
   cell 維持原背景。
3. 清除主 table 已不再使用的 person icon 與 XML badge page CSS；modal 共用的
   `.qp-text-button` 保留。
4. 保留 Session 156 已確認的 14 天 table、價格 cell、inline number 與價格細部
   modal，不套用這次 Figma 縮短的示意日期欄。
5. smoke test 新增價格列內容與第二、三列灰底範圍的 regression checks。

### 驗證

- `git diff --check` exit 0
- `node --check scripts/smoke-test.mjs` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`10 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`92 raw hex tokens`)
- `node scripts/smoke-test.mjs` exit 0：10 pages 通過，`quantity-price-table.html`
  12 checks 通過。

## Session 158：適用房型選單縮減為兩個房型項目 (2026-09-22)

使用者確認「專案內容」table 的適用房型選單只需要保留原 UI layout 顯示的
前兩個房型項目，後續管理操作皆不需要。

### 本輪改動

1. 選單只保留 `（DS）啦啦啦` 與 `（GG）哦哦哦`，移除連結、簡訊、複製、取消。
2. `specs/pages/project-content.md` 明確限制選單內容與順序，避免再混入管理操作。
3. `scripts/smoke-test.mjs` 新增房型選項數量、內容與順序的 regression check。

### 驗證

- `git diff --check` exit 0
- `node --check scripts/smoke-test.mjs` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`10 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`92 raw hex tokens`)
- `node scripts/smoke-test.mjs` exit 0：10 pages 通過，`project-content.html`
  11 checks 通過。

## Session 157：專案內容適用房型選單 trigger 層級修正 (2026-09-22)

使用者指出「專案內容」table 的適用房型選單誤綁在資料列放大鏡，要求依目前
Figma selection 修正並提供預覽。

### Figma current source

- Page：`2351:99451` `Frame 400`，2276 x 1118。
- 適用房型欄：`2362:96112` `Frame 145`，176 x 738。
- Header trigger：`2362:96115` `icons/arrow-down-drop`，38 x 38。
- Row search action：`2362:96119` `icons/search`，24 x 24。

### 本輪改動

1. `specs/pages/project-content.md` 將選單 trigger 明確改為適用房型 header 右側
   箭頭；資料列放大鏡維持獨立 row action，不得控制選單。
2. `preview/project-content.html` 將既有選單移到 header control 下，新增
   `arrow-down-drop.svg` trigger，並移除放大鏡上的 toggle / ARIA 綁定。
3. `preview/assets/css/project-content.css` 依 Figma 實作 138 + 38 的 header
   結構、38 x 38 粉紅箭頭按鈕，選單從 header 下方展開。
4. `scripts/smoke-test.mjs` 新增 trigger 層級 regression checks，包含放大鏡
   不得開啟選單、header 箭頭可正確開關選單。

### 驗證

- `git diff --check` exit 0
- `node --check preview/js/project-content.js` exit 0
- `node --check scripts/smoke-test.mjs` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`10 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`92 raw hex tokens`)
- `node scripts/smoke-test.mjs` exit 0：10 pages 通過，`project-content.html`
  11 checks 通過。
- 視覺 QA：1440、768、375 viewport 均確認 row search 不開選單、header 箭頭
  展開選單、選單位於 header 下方、按鈕為 38 x 38，頁面無 viewport overflow。
  截圖位於 ignored `specs/qa-screenshots/session-157/`。

## Session 156：數量價格表、群組編輯與日期區間 (2026-09-21)

使用者完成數量價格表 desktop、群組編輯、快速新增庫存、雙月日期區間、inline
number 與價格細部 modal 的 Figma 讀取後，要求整理規格並實作。Figma 未提供
tablet/mobile，由使用者授權依既有設計手法自動編排。

### Figma current source

- Page：`2386:98253` `數量價格表`
- 群組編輯：`2386:99177`
- 快速新增庫存：`2387:105078`
- 雙月日期區間：`2387:103133`、`2387:104431`、`2387:103777`、`2387:104101`
- inline number：`2387:106298`
- 價格細部 modal：`2387:106427`

### 使用者拍板

1. `xxoo` 是假示意, 不建立頁籤；主 table 補足完整 14 天。
2. 群組編輯的日期與星期同時顯示；房型文字不是 tab；各區儲存只影響自己，
   任一取消均關閉 modal。
3. 快速新增庫存的月份全選、row 覆寫與套用房數本輪只呈現 UI, JS 與資料生成
   交由後端。
4. 日期範圍第二次選取後保持展開；第三次點擊重建起點；補位日期不可點；新增
   左右箭頭且一次移動一個月。
5. 價格點擊後帶入原值的 number input，Enter 回到純數字；input 上方空間開啟
   價格細部 modal。細部 modal 內的群組編輯本輪不串接。

### 本輪改動

- 新增 `specs/pages/quantity-price-table.md`。
- 新增獨立頁面 `preview/quantity-price-table.html`、page CSS、ES module 與 modal
  partial，並接入 aside、page tabs、app.css 與 partial manifest。
- table 實作 14 個日期欄與 42 個價格 cell；所有 row border 到 table 最右側。
- 日期 popover 實作 disabled/today/endpoint/interior/overflow 狀態與一個月導覽。
- tablet 依 page panel container width 改為兩欄篩選，mobile 改為單欄；寬表格
  與月份 grid 只在元件內水平捲動。
- smoke test 新增 12 項本頁 contract 檢查；全站 10 pages 通過。另完成 1440、
  768、375 viewport 與 calendar、group modal、mobile inventory modal 截圖檢視。
- Preview 回饋修正日期欄由約 48px 增至 64px，避免「無單量」超出 td；number
  input 明確設定 64px 最小寬。Modal action 恢復 Figma 的深灰儲存與淺灰取消，
  不沿用頁面橘色 primary。
- 快速新增庫存月份文字曾被共用 visually-hidden 樣式隱藏；依 Figma 恢復上方
  全選區與兩列房型各自的 2026 年 9 月至 2027 年 8 月，年份分組、直向月份與
  checkbox 均可見，仍不加入後端批次勾選行為。
- 2026-09-22 重新讀取快速新增庫存 `2387:105078`，將三個月份區由 absolute
  年份標籤與 CSS grid 改為 semantic nested table；`2026 年` 使用 colspan 4，
  `2027 年` 使用 colspan 8，月份文字受各自 td 約束，不再跨格或跑版。上方全選
  欄恢復 Figma 的 60px，月份區為 589px；房型列月份區為 301px。

### 驗證

- `./scripts/lint-fonts.sh`：exit 0
- `./scripts/lint-conventions.sh`：exit 0
- `./scripts/lint-partials.sh`：10 pages / 3 standalone, exit 0
- `node scripts/smoke-test.mjs`：10 pages pass, 本頁 12 checks
- 巢狀月份 table 修正後重跑：lint 與 10 pages smoke test 通過；1440、768、375
  viewport 截圖檢查年份合併欄、月份儲存格與 modal 內橫向捲動。

## Session 155：專案內容頁與住宿／串接三步驟 modal (2026-09-21)

使用者依序提供專案內容 desktop、住宿 modal 三步驟與串接 modal 三步驟，
確認新增／修改共用同一套三步驟 session，title 由觸發入口決定。

### Figma current source

- Page：`2530:90916` `專案內容 desktop 2027 v.1.1`
- 住宿 batch：`2424:92389`；modal `2423:89025`、`2423:89312`、`2423:89464`
- 串接 batch：`2424:92390`；modal `2423:89585`、`2423:89869`、`2423:90021`

### 使用者拍板

1. 上一批 modal 屬於「住宿」tab，下一批屬於「串接」tab。
2. 頁面右上「新增」開啟時，三步 title 都只顯示「新增」；row「修改」則都只
   顯示「修改」。Figma 的「新增 / 修改」是設計佔位文字。
3. 三張 modal 是同一個 session 的 Step 1 -> Step 2 -> Step 3，步驟間保留資料。
4. 串接 Step 1 新增「通路庫存 Booking」，並移除住宿版的上架期限、幾天前
   可訂、網路開放天數；Step 2 與 Step 3 共用。
5. Figma 未另提供 tablet／mobile frame；使用者授權依既有設計手法自動編排
   RWD，不需再逐項確認斷點配置。
6. Preview 驗收後回報管理欄按鈕跑版，以及 modal Step 2 日期類型 table 的內容
   超出但列線未延伸；依原 Figma 修正，不接受只裁切溢出文字的處理。

### 本輪改動

1. 新增 `specs/pages/project-content.md`，記錄 page、兩種 Step 1、共用 Step 2/3、
   title、footer、互動、responsive constraints 與後端未定義項。
2. 新增 `preview/project-content.html`、`partials/project-content-modals.html`、
   `js/project-content.js`、`assets/css/project-content.css`。
3. 專案 table 提供 14 欄、狀態 tabs、適用房型選單與管理操作；住宿／串接 tab
   決定 modal Step 1 variant。
4. modal 實作 title 模式、三步切換、步驟資料保存、當步清除、四個月份與三種
   日期色彩、售價／加人／加兒童設定。
5. aside「專案內容」改為真實連結，page tabs、partial manifest、app.css 與
   smoke test 登記新頁。
6. RWD 採 1024px desktop、768px tablet、479px small-mobile 分界：tablet 保留
   Step 1 雙欄與 Step 2 的 2 x 2 月曆；mobile 改單欄，寬 table 僅在自身容器
   水平捲動，modal header／footer 固定可見。
7. 管理欄依 Figma `2530:91078` 恢復 620px，六顆按鈕各 88 x 36、16px gap、
   單列垂直置中；日期類型 table 固定 490px 內容寬，窄 viewport 由外框捲動，
   讓 header／row 框線與內容使用同一個 table 寬度。

### 驗證

- `git diff --check` exit 0
- `node --check preview/js/project-content.js` exit 0
- `node --check scripts/smoke-test.mjs` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`9 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`92 raw hex tokens`)
- `node scripts/smoke-test.mjs` exit 0：9 pages 通過，`project-content.html`
  11 checks 通過
- 視覺 QA：1440 page、住宿 Step 1、串接 Step 1、Step 2、Step 3；768px page
  與三步 modal；375px page、住宿 Step 1、Step 2、Step 3、串接 Step 1。
  截圖位於 ignored `specs/qa-screenshots/session-155/`
- 修正後視覺 QA：1440px 管理欄、375px Step 2 日期 table 左／右捲動端點；
  實測管理欄 620px、操作列 608px、六顆按鈕 88 x 36，日期 table 490px 且
  `scrollWidth === clientWidth`，最末 cell 與 table 右緣一致。

## Session 154：UI 任務收尾直接提供 preview URL (2026-08-28)

使用者要求往後 UI 任務 self-test 後直接提供 landing page 預覽網址，讓使用者
自行點入驗收。

### 本輪改動

1. `start.md` 新增「Preview 驗收網址」規則：final 固定提供
   `http://localhost:8000/landing.html`；若修改其他獨立頁面，另提供該頁直接
   URL。
2. URL 提供前必須確認 port 8000 preview server 正在運行且頁面可連線；網址只
   代表 dev 端 self-test 通過，使用者驗收前仍不可 commit。
3. 回溯 audit：Session 153 的 final 只提供 QA 截圖路徑，沒有提供可點擊的本機
   preview URL；本輪立即補上並作為後續收尾固定流程。
4. 機器可判定性：HTTP 可連線狀態可自動檢查；final 是否包含 URL 無法由 repo
   pre-commit lint 判斷，因此保留在 `start.md` 收尾 checklist。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- preview server 與 URL HTTP 狀態於本輪 final 前驗證

## Session 153：房間預定三個 edit modal 版本分流與表頭對齊 (2026-08-28)

使用者澄清 0827 可加人更新只適用房間預定 table 第一列的 `edit.svg`；第二、
第三列必須維持 0527 原版 modal 內容。第一列新版價格 table 的表頭對齊規則為
「日期靠左，其餘四欄置中」。

### 本輪改動

1. `components/modal.md` 明確記錄三個 edit 入口的版本 mapping：第一列使用
   0827 新版，第二、第三列使用 0527 原版；同時登錄兩個 desktop 寬度與新版
   表頭對齊規則。
2. `preview/partials/room-booking-sections.html` 為三個入口加上穩定 variant hook：
   第一列 `current`，第二、第三列 `legacy`。
3. `preview/partials/room-booking-modals.html` 保留第一列五欄價格表，另恢復 0527
   三欄原版價格表；可加人 chip 與成人 / 孩童 stepper 只在 `current` 顯示。
4. `preview/js/order-modals.js` 依觸發入口切換 modal variant，並讓 lock、clear、
   reset 只對當前版本保持正確行為。
5. `preview/assets/css/modals.css` 將第一列 desktop modal 維持 800px，第二、
   第三列原版恢復 646px；768px table 最小寬只套用第一列新版。
6. `scripts/smoke-test.mjs` 新增三入口 mapping、current / legacy 內容隔離、
   五欄表頭對齊與兩種 desktop 寬度 regression checks。

### 驗證

- `git diff --check` exit 0
- `node --check preview/js/order-modals.js` exit 0
- `node --check scripts/smoke-test.mjs` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`92 raw hex tokens`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，`room-booking.html`
  13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄 `specs/qa-screenshots/session-153/`：
  - `room-edit-current-desktop-1440.png`
  - `room-edit-legacy-desktop-1440.png`
  - `room-edit-current-tablet-768.png`
  - `room-edit-current-mobile-375.png`
  - `room-edit-legacy-mobile-375.png`

## Session 152：房型 modal 新增加人 Select (2026-08-27)

使用者確認 `room-type.html` 的資料新增、資料修改、資料查看 modal 只新增一個
「加人」Select，其餘既有欄位、房間數互動與 modal 行為全部維持。

### Figma current source

- 新增／修改 section：`2308:85675`；modal instance `2308:85163`
- 僅查看 section：`2308:85677`；modal instance `2308:85438`

### 使用者拍板

1. 新增與修改提供 `不可加人 / 1 / 2` 三個可選 option，預設為 `不可加人`。
2. 查看固定顯示 `2`，Select 必須 disabled。
3. 欄位位於「網路訂購」下方、文案卡上方；desktop 橫跨兩欄，mobile 滿寬。
4. 三個 modal 的其餘設定完全沿用既有規格。

### 本輪改動

1. `components/modal.md` 登錄 0827 Figma nodes、欄位位置、options 與狀態規則。
2. `preview/partials/room-type-modals.html` 在新增／修改／查看三個 modal 加入
   對應 Select，並使用 `data-room-extra-people` 作為穩定 contract hook。
3. `scripts/smoke-test.mjs` 新增三個 modal 的 options、可操作性、disabled 與
   固定值 regression check。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0（8 pages, 3 standalone）
- `./scripts/lint-tokens.sh` exit 0（92 raw hex tokens）
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，`room-type.html`
  16 checks 通過

## Session 151：房間預定 modal 新增加人資訊 (2026-08-27)

使用者確認只更新房間預定 table 第一個 `edit.svg` 所使用的共用
`modalRoomEditBackdrop`。既有 lock、clear、textarea 與 modal 開關行為維持，
本輪新增加人資訊與價格表展示欄位。

### Figma current source

- Icons frame: `25:93` `Icons`
- Icon batch: `2178:124636` `icons/projects` 20x20、
  `2303:85281` `icons/adding-people` 20x20、
  `2303:85275` `icons/adding-bed` 24x24
- Modal: `2308:84584` `Modal（0827 新增 可加人）` 800x740

### 使用者拍板

1. 房型摘要新增 `adding-people` icon、`可加人`、`總人數限制 5` 雙行 chip。
2. 價格 table 新增 `多加成人 / +1,000` 與 `多加孩童 / +800` 兩欄，
   每個日期 row 各有一組 stepper。
3. Modal stepper 只實作設計稿外觀；不加前端運算、min / max、總人數限制、
   lock 或 clear 行為。實際資料與操作由後端處理。
4. 新 stepper 視覺沿用外層 table「間數」的 `.stepper`，但不掛
   `.rb-step-*` 行為 hooks。
5. 0527 已移除的 date controller / 訂房間數 stepper 不恢復。
6. Icons selection 視為整批交付：三顆都必須寫入 `specs/icons.md`、由原 Figma
   node 匯出成正式資產，再由 modal 取用；不可只為當前畫面臨時補單顆 SVG。

### 本輪改動

1. `components/modal.md` 更新 0827 current contract。
2. `specs/icons.md` 完整登錄本批 `projects`、`adding-people`、`adding-bed` 的
   Figma node、尺寸、正式檔案與取用狀態；三顆均重新由原 node 匯出，僅將
   中性色正規化為 `currentColor`。本 modal 取用正式的 `adding-people.svg`，
   `adding-bed.svg` 同批入庫但不在本 modal 額外使用。
3. `preview/partials/room-booking-modals.html` 新增 summary chip、兩個價格欄位、
   四組純展示 stepper 與 footer totals。
4. `preview/assets/css/modals.css` 將 desktop modal 寬度改為 800px，價格表固定
   768px 並在窄 viewport 於 modal 內水平捲動。
5. `scripts/smoke-test.mjs` 新增 0827 contract regression checks。

### 驗證

- `xmllint --noout`：`projects.svg`、`adding-people.svg`、`adding-bed.svg`
  三顆正式資產皆通過，且無中性 `fill="black"` / `stroke="black"` 殘留
- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`92 raw hex tokens`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `room-booking.html` 12 checks 通過
- Chrome contract checks：desktop modal 800px、價格 table 768px；mobile modal
  375px，table 只在 modal wrapper 內水平捲動，無 page-level overflow

## Session 150：新對話直接同步 GitHub 規則 (2026-08-26)

使用者要求新對話啟動時若 remote commit 領先本地，agent 必須直接同步，
不可只做版本比對後停止；若同步產生 conflict，保留現場由使用者處理。

### 本輪改動

1. `start.md`：
   - 本地無 repo 時使用 `git clone`；已有 repo 時使用 `git pull`。
   - remote 領先時立即同步，不因未提交改動而預先跳過。
   - branch diverged 時採一般 merge-based pull。
   - Git 實際產生 conflict 或拒絕覆蓋時保留工作樹並回報，不自行 stash、
     discard、解 conflict、rebase 或 force。
2. 回溯 audit：原流程在本地 `start.md` 有未提交修改時只比對、不 pull，正是
   本次修正的違規情境；新規則套用後已直接同步。
3. 機器可判定性：此規則依賴 GitHub 連線、remote branch 與工作樹狀態，不能由
   pre-commit lint 完整判定，保留在新對話啟動流程執行。

### 驗證

- `git fetch origin` exit 0。
- 本地原為 `d4ab2f0`，`origin/main` 為 `1932684`，remote 領先 1 commit。
- `git pull --no-rebase origin main` exit 0，以 fast-forward 同步到 `1932684`。
- 本地未提交的 `start.md` 規則修改仍保留，未產生 conflict。
- `git diff --check` exit 0。
- `./scripts/lint-conventions.sh` exit 0。

## Session 149：加購商品 0818 批次更新 (2026-08-25)

使用者批次提供 0818 Figma frame，並確認本輪以 deployed 動態資料行為為
基線：移除商品類型分流 tabs 與限定 / 非限定 / 住宿加購 icons，新增產品
table 多語系狀態，調整專案按鈕填色，並更新產品 / 類別 data modal。

### Figma current source

- Page: `2275:84175`「加購商品 desktop 0818」1440x1718
- Product table: `2275:84177`「Limitation Table」1171x458
- Product edit modal: `2245:84443`「Modal（產品設定 - 修改 - 上架開啟）0818」800x788
- Category new modal: `2245:84164`「Modal（類別新增設定）0818」800x564
- Category edit modal: `2245:84205`「Modal（類別修改設定）0818」800x564

### 使用者拍板

1. Desktop 外層維持 shared shell 12px page padding 與 12px sidebar gap，不採
   Figma frame 外層 20px。
2. 啟用 / 停用 counts、14 / 5 rows、全部顯示 / 分頁與狀態移動維持 deployed
   動態資料行為，不把 Figma sample count 寫死。
3. 產品設定與類別設定的「所有商品 / 住宿加購 / 其他商品」tabs 全部移除。
4. 限定、非限定、住宿加購圖例與 row icons 全部移除。
5. Category 管理欄「複製」保留。
6. Product / Category data modal desktop shell 採 800px。

### 本輪改動

1. `specs/pages/purchase-addon.md`：
   - 更新 current Figma nodes、使用者拍板、table 欄位與 modal contract。
   - 修正舊 99 / 8 靜態狀態描述，改回 deployed 14 / 5 動態 state。
2. `preview/purchase-addon.html` / `preview/assets/css/purchase-addon.css`：
   - 移除兩區 type tabs、圖例與 row icons。
   - Product table 新增「多語系」欄，table shell 使用 Figma 12px / 16px
     padding 與固定欄寬；Category 保留複製按鈕。
   - limited project button 使用 `Color/Accent/light-green`；all-project button
     維持白底。
   - Product / Category data modal desktop 寬度改為 800px；control、文案卡、
     編輯按鈕與日期 panel 尺寸依 0818 Figma 調整。
3. `preview/js/purchase-addon.js`：
   - 多語系 badge 使用 row state 與 delegated click；各語系可獨立切換，
     支援同 row 多選。
   - Product / Category 共用 modal shell，依 kind 切換專屬 body 與 title。
   - 上架 panel 移除時段 toggle、起迄 hour 與時間提示，只保留全日日期範圍。
4. `preview/partials/purchase-addon-modals.html`：
   - Product 上架 panel 只保留日期。
   - 新增 Category 專屬新增 / 修改 body：排序、disabled 型態、品名、品名文案、
     備註文案；不顯示住宿加購 toggle。
5. `scripts/smoke-test.mjs`：
   - 補測 tabs / legends / row icons 不存在、多語系 multi-select、限定專案填色、
     Category 複製、800px modal、378px 日期 panel、日期不截字、Category body
     與移除的時間 / 住宿加購 controls。
6. 驗收 follow-up：產品 quick filters 文案由「全部 / 線上隨單加購 / 僅後台加購」
   改為「全部 / 網路可訂 / 只限現場」，單選互動不變，smoke test 鎖定新文案。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- Product fallback rows 每列 10 cells；Category fallback rows 每列 8 cells
- 視覺 QA 截圖輸出到 ignored 目錄 `specs/qa-screenshots/session-149/`：
  - `purchase-addon-desktop-1440.png`
  - `purchase-addon-tablet-767.png`
  - `purchase-addon-mobile-375.png`
  - `purchase-addon-product-edit-publish-1440.png`
  - `purchase-addon-category-new-1440.png`
  - `purchase-addon-category-edit-1440.png`
  - `purchase-addon-category-new-mobile-375.png`

## Session 148：加購商品停用專案按鈕與 readonly modal (2026-08-11)

使用者澄清產品設定 table 的「專案」按鈕顯示條件只跟產品是否有
`限定` / `非限定` 標籤有關，與啟用 / 停用狀態無關；停用 row 也要可開啟
project modal，但 modal 內容需 locked / disabled 不可操作。

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - 停用 demo 產品補上 project state：
     - `product-15` `舊版餐券` -> `limited`
     - `product-19` `舊版折抵` -> `nonLimited`
   - `renderActionButtons()` 停用 row 分支也依 `hasProjectState(row)` 顯示
     「專案」按鈕，並開啟 `modalPurchaseAddonProjectBackdrop`
   - project modal state 新增 `readonly`
   - 停用 row 開啟 project modal 時：
     - `專案分類` / `類別條件` disabled
     - `全選` / `取消全選` disabled
     - project chips disabled
     - footer 只顯示一個「關閉」按鈕，`儲存` 隱藏
     - click / change handler 對 readonly state 直接 return，不改 selection state
2. `preview/partials/purchase-addon-modals.html`：
   - project modal 儲存按鈕補 `data-pa-project-save`
3. `preview/assets/css/purchase-addon.css`：
   - project modal readonly controls 加 disabled cursor / opacity
4. `specs/pages/purchase-addon.md`：
   - 補記「專案」按鈕顯示與啟用 / 停用無關
   - 補記停用 row 開啟 project modal 後內容 disabled
5. `scripts/smoke-test.mjs`：
   - regression 補測停用 tab：
     - limited deleted row 有「專案」按鈕
     - 無 project state 的 deleted row 沒有「專案」按鈕
     - deleted project modal 可開啟並帶入產品代號 / 品名
     - select / list actions / chips 都 disabled
     - footer 顯示「關閉」且 `儲存` 隱藏
     - readonly chips click 不改 selected state

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-148/`
  - `purchase-addon-deleted-project-button-1440.png`
  - `purchase-addon-deleted-project-readonly-modal-1080.png`（已更新為 footer 只顯示
    `關閉`）

## Session 147：加購商品類別設定 home icon 欄位歸屬修正 (2026-08-11)

使用者要求依 Figma `類別設定` frame 修正 category table：住宿加購的
`icons/home` 應跟在 `型態` 欄 `商品` 後方，而不是接在 `品名` 後方。此 table
共用於分頁 1 / 2 / 3 與停用狀態，因此改 render 來源即可覆蓋多個狀態。

### Figma 讀取

- Current page: `components`
- Selection count: 1
- Frame: `2183:129503` `Accordion 11`
- Title: `類別設定`
- Table columns: `順序` / `代號` / `館別` / `品名` / `型態` / `設定數量` /
  `排序` / `管理`
- Contract:
  - `品名` 欄只放品名文字，例如 `餐飲服務`
  - `型態` 欄放 `商品`，住宿加購 row 的 `icons/home` 跟在此欄後方
  - 與產品設定 table 對齊：產品的住宿 icon 跟在 `類別` 欄，不接在商品名稱後方

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - category row 的 `品名` 欄改為只 render `row.name`
   - 新增 / 改用 `renderCategoryType(row)`，住宿加購 row 在 `型態` 欄渲染
     `row.type + icons/home`
2. `preview/purchase-addon.html`：
   - 同步靜態 fallback markup，避免 category table 初始 HTML 仍把 home icon
     放在 `品名` 欄
3. `specs/pages/purchase-addon.md`：
   - Category Table spec 改為 `品名` 無 icon、`型態` 欄接住宿加購 home icon
4. `scripts/smoke-test.mjs`：
   - regression 補測第一筆 category row：`品名` 欄不得有 `home.svg`，
     `型態` 欄必須有 `home.svg`

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-147/`
  - `purchase-addon-category-home-type-1440.png`

## Session 146：加購商品造飛機專案 chips 篩選 (2026-08-11)

使用者在 Figma 補充「專案設定」modal 中 `類別條件 = 造飛機專案`
時，專案 chips 暫定只有三個；`全選` / `取消全選` / chip selected
active 狀態維持目前 JS 邏輯，不依示意稿另外改狀態。

### Figma 讀取

- Current page: `components`
- Selection count: 1
- Frame: `2178:126955` `Modal（專案設定）`
- 示意狀態：
  - `專案分類 = 限定`
  - `類別條件 = 造飛機專案`
  - `專案清單列表` 顯示 `[999] 飛天六人滿意` + `網` / `企` badge、
    `[89] 地勤很辛苦`、`[09] 空姐滿班`

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - 新增 `FLIGHT_PROJECT_ITEM_IDS = ["999", "89", "09"]`
   - `renderProjectModal()` 改用 `visibleProjectItems()`
   - `類別條件 = flight` 時只渲染三個可見 chips
   - `專案分類 = 不限` 時不套用 hidden `類別條件 = flight` 的篩選，恢復
     顯示全部 6 個 chips
   - `全選` / `取消全選` 按鈕操作仍沿用完整 6 筆 demo 專案；active state
     改以目前可見 chips selected count 判斷，避免 `造飛機專案` 可見 3 顆全選
     時 `全選` 沒有 active
2. `specs/pages/purchase-addon.md`：
   - Project Modal spec 補記 `造飛機專案` 暫定三個 chips 與 state 不重置規則
3. `scripts/smoke-test.mjs`：
   - regression 補測切到 `限定` + `造飛機專案` 後只顯示三個 chips
   - 補測切 condition 不重置 `全選` active state
   - 補測切回 `不限` 後恢復 6 個 chips
   - 補測手動選中 `造飛機專案` 可見三個 chips 後 `全選` active
   - 補測 hidden condition 仍是 `造飛機專案` 時切 `專案分類 = 不限` 會顯示
     6 個 chips

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-146/`
  - `purchase-addon-project-flight-1080.png`
  - `purchase-addon-project-flight-manual-all-1080.png`
  - `purchase-addon-project-unlimited-after-flight-1080.png`

## Session 145：加購商品專案設定 chips 單點狀態同步 (2026-08-11)

使用者要求「專案設定」modal 開啟時 `專案分類` 預設為 `不限`，
且在 `全選` / `取消全選` 任一 active 狀態下，下面 chips 仍可個別點擊；
chips 的 selected 數量必須反向影響兩個 label button 的 active 狀態。

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - project modal 初始 state 改為 `mode = none`
   - open modal 時固定帶入 `不限`、`類別條件 = 不限`、`全選` active、
     6 個 chips selected
   - chip click 在 `不限` / `限定` 都可個別切換 selected
   - 新增 selected count 判斷：
     - selected 數量等於全部：`全選` active
     - selected 數量為 0：`取消全選` active
     - selected 數量介於中間：兩者都 inactive
2. `preview/partials/purchase-addon-modals.html`：
   - 靜態 markup 預設同步為 `專案分類 = 不限`、`全選` active
3. `scripts/smoke-test.mjs`：
   - regression 補測預設 `不限` 時隱藏類別條件
   - 補測 `全選` active 後單點 chip 會取消 active 並保留 5 個 selected
   - 補測 `取消全選` active 後單點 chip 會取消 active 並保留 1 個 selected
   - 補測切換 `類別條件` 不重置目前 chips 狀態
4. `specs/pages/purchase-addon.md`：
   - Project Modal spec 補明 chips 可單點，且單點後依 selected count 同步
     `全選` / `取消全選` active 狀態

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-145/`
  - `purchase-addon-project-default-unlimited-1080.png`
  - `purchase-addon-project-chip-custom-1080.png`

## Session 144：加購商品專案分類不限隱藏類別條件修正 (2026-08-11)

使用者澄清 Session 143 的口述只是補充原 frame 互動，原本
`專案分類 = 不限` 時下方 `類別條件` 不顯示的邏輯仍不變。

### 本輪改動

1. `preview/js/purchase-addon.js`：
   - `專案分類` 切到 `不限` 時，`類別條件` row 恢復 hidden
   - 隱藏類別條件時不重置 `全選` / `取消全選` 與 chips selected state
2. `scripts/smoke-test.mjs`：
   - project modal regression 補測 `專案分類 = 不限` 時類別條件 hidden
   - 同時確認切換到不限後仍保留全選 active 與 6 個 chips selected
3. `specs/pages/purchase-addon.md`：
   - 補記 `專案分類 = 不限` 時 `類別條件` 不顯示
   - 將 `類別條件` 切換不重置 state 的規則限定在類別條件可見時

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-143/`
  - `purchase-addon-project-unlimited-hide-condition-1080.png`

## Session 143：加購商品專案設定 modal select 與全選狀態修正 (2026-08-11)

使用者確認專案設定 modal 的互動規則：專案分類只保留 `限定` / `不限`，
類別條件只保留 `不限` / `造飛機專案` 且 default 為 `不限`；類別條件切換
不得重置 `全選` / `取消全選` 與 chips selected 狀態。

### 本輪改動

1. `preview/partials/purchase-addon-modals.html`：
   - `專案分類` options 改為 `限定` / `不限`
   - `類別條件` options 改為 `不限` / `造飛機專案`，default `不限`
2. `preview/js/purchase-addon.js`：
   - project modal state 拆成 `mode`、`condition`、`selectionMode`、
     `selectedIds`
   - modal 初始開啟時 `全選` active，全部 chips selected
   - `全選` / `取消全選` 改為單選 active 狀態
   - 切換 `類別條件` 只更新 condition，不重置 chips selection
   - 手動切 chip 後依選取數量同步 selection mode：all / none / custom
3. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke 補測 options 數量、類別條件 default、全選 active、chips all
     selected、condition change 不重置 all / none state
   - page spec 同步本輪正式互動規則

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-142/`
  - `purchase-addon-project-modal-state-1080.png`

## Session 142：加購商品專案設定 modal 修正 (2026-08-11)

使用者指出「專案設定」按鈕目前誤植成其他 modal，要求重新 `figma-go`
讀取四個 frame 並完成實作。

### Figma 讀取

- 目前 selection count: 4
- Current page: `components`
- Frame:
  - `2178:125444` `Modal（專案設定）`
  - `2178:126644` `Modal（專案設定）`
  - `2178:126779` `Modal（專案設定）`
  - `2178:126955` `Modal（專案設定）`
- Contract:
  - modal title 為 `專案設定`
  - body 上方有 `產品代號` disabled input、`品名` disabled input
  - `專案分類` select 有 `不限` / `限定` / `非限定`
  - `限定` / `非限定` 狀態顯示 `類別條件` select，default `造飛機專案`
  - `不限` 狀態隱藏類別條件並顯示 `已全選`
  - `專案清單列表` 使用淡藍底 panel 與專案 chips，demo 專案包含
    `[999] 飛天六人滿意`、`[419] 不可告人優惠`、`[123] 劍湖山吃到飽`、
    `[443] 大利大吉`、`[89] 地勤很辛苦`、`[09] 空姐滿班`

### 本輪改動

1. `preview/partials/purchase-addon-modals.html`：
   - 新增獨立 `modalPurchaseAddonProjectBackdrop`
   - footer 維持取消 / 儲存，header 為 `專案設定`
2. `preview/assets/css/purchase-addon.css`：
   - 新增 project modal 800px layout、左 label / 右 control row、專案列表
     panel、全選控制、project chips 與 status tags
   - `<640px` project modal 納入滿版規則
   - 修正 selected chip 使用 `--color-menuitem-default`，避免誤用不存在的
     `--color-menu`
3. `preview/js/purchase-addon.js`：
   - 「專案」按鈕改開 `modalPurchaseAddonProjectBackdrop`
   - 依產品 row 的 `limited` / `nonLimited` 初始化 `專案分類`
   - `專案分類` 切到 `不限` 時隱藏類別條件並標示已全選
   - project chips、全選、取消全選可在 modal 內切換 demo state
   - data modal title handler 限定只處理 `modalPurchaseAddonDataBackdrop`
4. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke 補測 project modal id、title、產品代號 / 品名、限定狀態、
     類別條件顯示 / 隱藏、6 個 project chips、selected chip 藍底
   - mobile 滿版 regression 納入 project modal
   - page spec 補正式 Project Modal 規格，移除先前「暫開共用資料 modal」
     的過渡描述

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-142/`
  - `purchase-addon-project-modal-1080.png`

## Session 141：加購商品類別 table outline 內縮修正 (2026-08-11)

使用者要求類別設定下方 table 若內容未填滿橫向空間，外層 outline
需往內縮，不要整條撐滿父容器。

### 本輪改動

1. `preview/purchase-addon.html`：
   - 類別設定 table shell 補上 `pa-category-table-shell` 專用 class
2. `preview/assets/css/purchase-addon.css`：
   - `.pa-category-table-shell` 改為 `width: fit-content`
   - 保留 `max-width: 100%` 與既有 `overflow-x: auto`，小尺寸仍可水平捲動
   - 產品設定 table shell 不變，仍維持滿版
3. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - 補記與補測 desktop 1440 viewport 下，類別 table outline 需比父容器內縮
   - 同時確認產品 table outline 仍維持滿版

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過

## Session 140：加購商品查看 modal 關閉按鈕顏色修正 (2026-08-11)

使用者回報停用狀態下開啟查看 modal 時，footer「關閉」按鈕應比照
房型查看 modal 使用黑底反白，而不是灰色取消按鈕樣式。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - `.pa-data-modal-readonly [data-pa-data-cancel]` 覆蓋為
     `--color-text-800` 黑底與 `--color-text-100` 反白文字
   - 新增 / 修改模式仍維持原本取消灰色、儲存黑色
2. `scripts/smoke-test.mjs`：
   - 在停用 tab 的查看 modal regression 中補查 footer 關閉按鈕背景色，
     確認它等於房型使用的深色 token
3. `specs/pages/purchase-addon.md`：
   - 補記查看模式 footer「關閉」需使用房型查看 modal 同款黑底反白樣式

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過

## Session 139：加購商品資料 modal 欄位垂直置中修正 (2026-08-11)

使用者回報資料 modal 中左側欄位文字偏靠上，要求比對房型 modal，
讓左 label 與右側 input / control 垂直置中。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - `.pa-data-modal-field` 從 `align-items: start` 改為
     `align-items: center`
   - 上架列在 inline panel 展開時維持 `align-items: start`，避免 label
     被推到整個展開區塊中間
2. `scripts/smoke-test.mjs`：
   - 加購商品資料 modal smoke 補測第一列 label 與右側 control 的
     vertical center 差距，避免回歸成靠上對齊
3. `specs/pages/purchase-addon.md`：
   - 補記一般欄位需維持左 label / 右 control，且兩側需像房型 modal
     一樣垂直置中

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-139/`
  - `purchase-addon-data-modal-field-center-1080.png`

## Session 138：加購商品 mobile 上架日期排列修正 (2026-08-11)

使用者回報上架 toggle 展開 panel 後，小尺寸的日期控制橫向排列過擠，
要求月曆欄位上下排列。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - `<768px` 時 `.pa-publish-date-row` 改為 column
   - 起日 / 迄日各自佔滿一列，`~` 置中
   - 時段 row 維持原本橫向排列
2. `preview/js/purchase-addon.js`：
   - 修正資料 modal 重開時，上架 toggle 若已是 checked，inline panel
     會跟著顯示，不會出現 toggle 已開但 panel 收起的狀態
3. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - mobile 滿版 modal regression 加測 375px 上架 panel 日期控制上下排列
   - page spec 補記 `<768px` 起日 / 迄日上下排列

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-138/`
  - `purchase-addon-mobile-publish-dates-stacked-375.png`

---

## Session 137：加購商品 mobile modal 滿版修正 (2026-08-11)

使用者要求確認先前已說過 modal 小尺寸需滿版，指出加購商品目前不是滿版。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - 對 `#modalPurchaseAddonDataBackdrop` 與
     `#modalPurchaseAddonPhotoGalleryBackdrop` 補上 `<640px` 滿版規則
   - small viewport 下 backdrop 改 stretch、padding 0
   - modal-box 改 `width: 100%`、`height: 100%`、`margin: 0`、
     `border-radius: 0`、`border: none`、`box-shadow: none`
2. `scripts/smoke-test.mjs`：
   - 加購商品 smoke checks 從 12 項增為 13 項
   - 新增 375px viewport regression：開資料 modal 與照片 modal，
     檢查 modal-box left/top、width、height、border-radius 是否符合滿版
3. `specs/pages/purchase-addon.md`：
   - 補記小尺寸 `<640px` modal 滿版規格，與房型 modal 行為一致

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 13 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-137/`
  - `purchase-addon-mobile-data-modal-fullscreen-375.png`

---

## Session 136：加購商品頁第四輪問題回報修正 (2026-08-11)

使用者回報 pagination 按鈕形狀 / 底色、上架 panel 不應 floating、
上架 panel 需依 UI layout 顯示起迄日 / 起迄時段、專案按鈕失效，以及
modal 欄位需維持左文右 input 佈局。

### 本輪改動

1. `preview/assets/css/purchase-addon.css`：
   - pagination 上一頁 / 下一頁改為全圓角淡藍底
   - disabled pagination 按鈕維持淡化
   - 移除 mobile 下資料 modal 欄位改垂直的覆蓋，維持左 label / 右 control
2. `preview/partials/purchase-addon-modals.html` / `preview/js/purchase-addon.js`：
   - 上架 panel 改為 inline normal-flow 區塊，checked 後直接在 toggle
     下方長出，不再 absolute floating
   - panel 內容改為 UI layout：`設定開放日期` 起迄日、`設定開放時段`
     toggle、起迄時段與提示文字；移除前一版自行加入的 panel 標題 /
     取消 / 儲存
   - 上架 panel 長出後會撐高同一 grid row，左側數量限制 row 跟著變高
3. `preview/js/purchase-addon.js`：
   - 「專案」按鈕接回共用資料 modal，點擊不再無反應；現階段 title
     顯示 `產品專案`，待專案專用 modal layout 補圖後再拆分
4. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke test 覆蓋 pagination 圓角、上架 panel inline、起迄日 / 起迄時段、
     panel 不含舊 popup 文案，以及專案按鈕可開 modal
   - page spec 同步本輪規格

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 12 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-136/`
  - `purchase-addon-pagination-rounded-1080.png`
  - `purchase-addon-edit-inline-publish-panel-1080.png`

---

## Session 135：加購商品頁第三輪問題回報修正 (2026-08-11)

使用者回報分頁文案 / pagination 樣式、產品資料修改上架控制視窗、
停用狀態查看 modal disabled，以及 table 內容左右置中問題。

### 本輪改動

1. `preview/js/purchase-addon.js` / `purchase-addon.css`：
   - 分頁狀態的 toggle label 改為 `分頁（N 頁 / M 筆）`
   - 底部 pagination 改為上一頁 / 當前頁 / 下一頁三段式
   - 第一頁上一頁 disabled，最後一頁下一頁 disabled，disabled 按鈕淡化
2. `preview/partials/purchase-addon-modals.html` / `purchase-addon.js`：
   - 產品資料修改 modal 的「上架」toggle 點擊後開啟上架設定 panel
   - panel 內含日期、時間（時 / 分）、取消與儲存
   - 停用狀態「查看」modal 會切 readonly mode：input / select /
     上架 toggle / 文案編輯按鈕全部 disabled，footer 隱藏儲存並顯示關閉
3. `preview/assets/css/purchase-addon.css`：
   - 產品 / 類別 table header 與 body 內容改為左右置中
   - 管理按鈕群組改為管理欄內置中
4. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke test 覆蓋分頁文案、pagination disabled/next-page 行為、
     上架 panel 日期時間欄位、查看 disabled 與 table center
   - page spec 同步本輪規格

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 12 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-135/`
  - `purchase-addon-pagination-1080.png`
  - `purchase-addon-edit-publish-panel-1080.png`
  - `purchase-addon-view-disabled-1080.png`

---

## Session 134：加購商品頁第二輪問題回報修正 (2026-08-11)

使用者回報全部顯示 / 分頁 icon UI、產品新增 modal 內容、產品 table
管理按鈕消失、專案按鈕條件與類別設定 mobile 管理按鈕問題。

### 本輪改動

1. `preview/purchase-addon.html` / `preview/js/purchase-addon.js`：
   - 全部顯示 toggle 改為 icon button，all mode 使用 `all-pages.svg`，
     paged mode 使用 `split-page.svg`
   - 移除 demo data 的 action 隱藏旗標，產品 row 2、row 3 與後續 rows
     不再遺失管理按鈕
   - 「專案」按鈕改為只依 `limited` / `nonLimited` 狀態顯示；沒有
     `thumbtack` / `thumbtack-slash` 的 row 不顯示「專案」
2. `preview/partials/purchase-addon-modals.html` / `purchase-addon.css`：
   - 產品資料 modal 由占位外殼改為使用者補圖中的產品新增欄位結構
   - 移除 `demo` 副標，補類別、產品描述、產品編號、品名、定價、
     排序、數量限制、上架 toggle、產品介紹文案與品名文案卡
   - modal 寬度放大到產品新增 layout 需要的 980px 上限，mobile 改單欄
3. `preview/assets/css/purchase-addon.css`：
   - 類別 table 寬度調整，mobile 橫向 overflow 下保留完整管理欄
   - 文案卡背景改用現有 `--color-modal-hover` token
4. `scripts/smoke-test.mjs` / `specs/pages/purchase-addon.md`：
   - smoke test 改查 icon button 切換、modal 欄位、專案按鈕條件、
     row 2 / row 3 / 類別管理按鈕存在
   - page spec 同步本輪互動與產品資料 modal 規格

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 12 checks 通過
- 視覺 QA 截圖輸出到 ignored 目錄：
  `specs/qa-screenshots/session-134/`
  - `purchase-addon-product-new-modal-1080.png`
  - `purchase-addon-mobile-375.png`
  - `purchase-addon-mobile-product-actions-right-375.png`
  - `purchase-addon-mobile-category-actions-right-375.png`

---

## Session 133：加購商品頁問題回報修正 (2026-08-11)

使用者回報 q1-q8，要求先參考 `room-type.html` / `room-type.js` /
`room-type.css` 與既有 UI layout 再修正。

### 本輪改動

1. `preview/js/purchase-addon.js` 改為 state-driven render：
   - 產品 / 類別各自有 14 筆啟用 rows + 5 筆停用 rows
   - 啟用 / 停用 tab count 依當下 state 即時計算
   - 停用 / 啟用 row 會像房型頁一樣移到另一個 tab
   - 全部顯示 checked 時列出目前 tab 全部 rows；unchecked 時 label 改「分頁」，
     每頁 5 筆並顯示 pagination
2. `preview/partials/purchase-addon-modals.html` 新增：
   - `modalPurchaseAddonDataBackdrop`：新增 / 修改 / 查看共用資料 modal 外殼
   - `modalPurchaseAddonPhotoGalleryBackdrop`：沿用房型照片管理 modal 版型，
     但 id 與 JS state 獨立
3. `preview/assets/css/purchase-addon.css` 修正：
   - 修改 / 複製 / 停用 / 查看 / 啟用按鈕取消漸層，保留白底與各自邊框色
   - 限定專案 icon 改成 orange-filled mask
   - mobile 商品分類 select 支援 truncation
   - mobile 清除 / 查詢置中
   - table 管理按鈕固定不 shrink，避免四顆按鈕被容器擠壓變形
4. `preview/purchase-addon.html` 補上：
   - 狀態 tab / count / display toggle / pagination / table body 掛點
   - 新增按鈕與資料 modal 連線
   - 加購商品專屬 modal partial
5. `scripts/lint-partials.py` / `scripts/smoke-test.mjs` 更新：
   - manifest 登記 `purchase-addon-modals`
   - smoke test 覆蓋 14 筆 rows、分頁切換、狀態 count、停用 / 啟用、
     新增 / 修改 data modal、照片 modal 5 slots
6. 視覺 QA 截圖輸出到 ignored 目錄：
   `specs/qa-screenshots/session-133/`
   - `purchase-addon-mobile-375.png`
   - `purchase-addon-mobile-actions-right-375.png`
   - 另保留 desktop/tablet 截圖供對照

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 12 checks 通過

## Session 132：system-basic 加購商品頁列表層實作 (2026-08-11)

使用者要求「開始實作，加購商品」。依 Session 131 已確認的 Figma contract 與
使用者拍板事項，先寫 page spec，再實作「系統操作 -> 加購商品」獨立頁。

### 本輪改動

1. 新增 page spec：`specs/pages/purchase-addon.md`
2. 新增獨立頁：`preview/purchase-addon.html`
   - 兩個 section：「產品設定」「類別設定」
   - 商品 tabs default「所有商品」白底 selected
   - 啟用 / 停用狀態 tabs、全顯 checkbox、圖例、產品 / 類別 table
   - 產品設定含商品分類 / 商品名稱篩選列與 quick chips
3. 新增頁面 JS：`preview/js/purchase-addon.js`
   - section 展開 / 收合
   - 商品 tabs、狀態 tabs、quick chips 單選 active 樣式
   - 清除輸入、重整 current page
4. 新增 domain CSS：`preview/assets/css/purchase-addon.css`
   - table layout / overflow、tabs、chips、checkbox、圖例、管理 pill buttons
   - 停用按鈕使用 `var(--color-surface-status-negative-light)`
   - desktop 產品表格 100% 寬；<1200 固定 table width 觸發橫向 overflow
5. 串接共用架構：
   - `partials/aside.html` 將「加購商品」改成 `purchase-addon.html` 真實連結
   - `js/page-tabs.js` 登記 `purchase-addon.html` ->「加購商品」
   - `assets/css/app.css` import `purchase-addon.css`
   - `scripts/lint-partials.py` 登記本頁 partial / module manifest
   - `scripts/smoke-test.mjs` 更新 app.css import check 並加入
     `purchase-addon.html` smoke coverage
6. 視覺 QA 截圖輸出到 ignored 目錄：
   `specs/qa-screenshots/session-132/`
   - `purchase-addon-desktop-1440.png`
   - `purchase-addon-tablet-767.png`
   - `purchase-addon-mobile-375.png`

### 範圍決定

- 本輪只做列表層 UI；新增 / 修改 / 複製 / 停用 / 專案等 modal 仍待後續 Figma
  補互動 modal 後再接。
- 查詢 button demo 不改資料；清除 button 只清空產品設定文字輸入。
- Table 資料為 Figma demo rows；後續由後端渲染真實資料。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-partials.sh` exit 0 (`8 pages, 3 standalone`)
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)
- `node scripts/smoke-test.mjs` exit 0：8 pages 通過，
  `purchase-addon.html` 9 checks 通過

### 下一步應做

- 等後續 Figma modal contract：新增 / 修改 / 複製 / 停用 / 專案相關 modal
  內容與互動，再補 spec 並接行為。

## Session 131：system-basic 加購商品頁 icons 預讀 (2026-08-11)

使用者要求讀 `start.md` / `progress.md` 後進行 figma-go 讀取；接下來會做
「系統操作 -> 加購商品」頁，先更新 icons，再依序讀 mobile / tablet /
desktop 三個 RWD layout template。

### Figma 讀取

- Figma file：`swift`
- Page：`components`
- Selection：`25:93`「Icons」frame，402 x 857.01
- 本輪從 selection 中確認新增 icon：
  `icons/projects`、`icons/thumbtack-slash`、`icons/split-page`、
  `icons/all-pages`
- RWD layout templates：
  - `2183:132622`「加購商品 mobile 0811」375 x 2186
  - `2183:130916`「加購商品 mobile ~ tablet 0811」767 x 1884
  - `2183:129489`「加購商品 desktop 0811」1440 x 1786

### 本輪改動

1. 匯出 4 個 SVG 到 `preview/assets/icons/`
2. `specs/icons.md` 新增上述 4 顆 icon 的主清單、分類索引、尺寸備註與
   currentColor 待處理記錄
3. 保存三個 RWD layout 截圖到 `specs/qa-screenshots/session-131/`
4. 使用者補充 Figma Variables export 後，同步本地 ignored
   `specs/assets/figma-variables.json`，並在 tracked source 補上
   `Color/Surface/Status-Negative-light`：
   `specs/assets/tokens.md` 與 `preview/assets/css/base.css`

### 重要決定

- 使用者確認：tablet 尺寸下 table 因設計佈局有限高，管理按鈕實作時使用
  `flex-nowrap`；Figma 設計稿不另行處理此 nowrap 視覺。
- 使用者確認：商品 tabs 為單選 tab button；default 是「所有商品」，
  selected 狀態是白底，灰底是未選中。不得把目前畫面中灰底的
  「住宿加購」誤判為 default selected。
- 使用者確認：desktop sidebar 沿用現有真實系統選單；本頁只變化上方
  `加購商品 x` page tab/button 與其下方內容。
- 使用者確認：table 管理按鈕 desktop ~ tablet 採 flex auto 自然流動；
  mobile 嚴格限制 `flex-nowrap`。若 tablet 實作跑版，也維持
  `flex-nowrap`。這幾個管理按鈕橫向鋪在自身容器中，原則上不需要
  button-level scroll。
- 使用者確認：本輪只做目前這一層 UI；新增 / 修改 / 複製 / 停用 / 專案
  modal 內容等後續 Figma 補互動 modal 後再接。
- 使用者補充的 Figma Variables export 顯示：
  `Color/Surface/Status-Negative-light = #F8A4A8` 是正式 token。後續
  加購商品 table 的停用 / 負向淡紅按鈕外框與相關淡色提示，優先使用
  `var(--color-surface-status-negative-light)`，不要再借用
  `Color/Accent/linear-function-button-delete`。

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-tokens.sh` exit 0 (`token mirror ok`)

### 下一步應做

1. 等使用者確認三個 RWD layout 的 implementation contract 與疑點
2. 使用者確認後，寫入 page spec / 必要 component spec
3. 實作「系統操作 -> 加購商品」獨立頁與必要 partial / JS / CSS；使用者確認前
   不寫 page spec、不實作 HTML

### 未解問題

- 三個 RWD layout 已讀；default tab、sidebar、table 管理按鈕與後續 modal
  範圍已由使用者確認。下一步仍需進入 spec checkpoint 後再寫 spec / 實作

---

## Session 130：GitHub Pages root demo redirect (2026-08-11)

使用者將 repo 推送到新 GitHub 帳號 `FIT-developer/swift`，GitHub Pages 顯示
deploy 成功但 root URL 尚未出現產品畫面。檢查後確認 Pages source 為
`main / (root)`，而專案入口實際位於 `preview/landing.html`。

### 本輪改動

1. **GitHub Pages 入口**：新增 repo root `index.html`，使用 meta refresh 與
   `window.location.replace` 導向 `./preview/landing.html`
2. **既有 preview 不變**：未修改 `preview/landing.html` 或其他 preview asset；
   目前 demo root 只作為 GitHub Pages 的入口橋接

### 驗證

- `git diff --check` exit 0
- `./scripts/lint-fonts.sh` exit 0
- `./scripts/lint-conventions.sh` exit 0
- `./scripts/lint-partials.sh` exit 0
- 本機檢查 root `index.html` 含 meta refresh、canonical link、fallback link
  與 JS `window.location.replace("./preview/landing.html")`

### 未解問題

- 若未來希望 `https://fit-developer.github.io/swift/` 不顯示 `/preview/` 路徑，
  需另行規劃正式發布目錄或 GitHub Pages source。

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
