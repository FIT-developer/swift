# Progress archive - Session167 to Session176

Historical session text preserved verbatim. Current decisions belong to progress.md.

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
