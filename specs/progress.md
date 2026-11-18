# Progress - 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。
> 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
> （歷史決策可能已被推翻，一律以本檔最新 session 為準）。
> 本檔超過 ~25 個 session 時，將最舊的 10 個搬進 archive。
> Session127 至 166 見 [歷史封存](progress-archive-s127-s166.md).
> Session167 至 176 見 [歷史封存](progress-archive-s167-s176.md).

---

## Session 199: 提交與推送四個登入狀態頁 (2026-11-18)

### 本輪改動與重要決定

- 使用者明確回覆可以 commit & push, 驗收 Session195 至 198 的
  login1 至 login4 四個獨立頁與後續政策 / Google hover,
  一併保存讀取紀錄、已確認 contract、tokens 與後端交付說明.
- 提交範圍為四個 HTML、共用 login-form partial / login.js /
  login.css、原始插圖 asset、app.css import / base token 和 effects,
  component / page specs、partial manifest / browser smoke 與 progress.
  不排除未曾提交的前幾輪讀取和確認紀錄, 不遺留孤兒規格.
- 固定高度 scroll、1024px 單雙欄切換、兩區預設收合、email-only
  客服、login3 Google 與 hover 均依已確認規格保存. 四頁只作
  backend 狀態示意; 真實 auth / Cloudflare / OAuth 接線仍交後端.
- 原始 Figma JSON / PNG / SVG、QA helper / 圖片與本機 variables
  export 依現有 ignore 規則保留本機; 對應 node ids、confirmed
  rules、strict color / effect 與完整交付對照已保存於版控來源.
- 本輪進入 commit/push flow, 實際 SHA 與遠端狀態以 git history 為準.

### 驗證與後續

- git fetch origin 成功, 提交前 main 與 origin/main ahead / behind
  為 0 / 0. 逐項核對所有 tracked / untracked 檔案均屬登入工作.
- 四項 lint / login.js 與 smoke syntax / whitespace checks exit 0;
  color mirror 94, partial manifest 18 頁 / 3 standalone.
- 沿用最後 Chrome smoke 18 頁 / 252 項, 36 組 viewport / state /
  keyboard / scroll probes, 24 組 tightened responsive assertions,
  33 組 pointer hover / leave 與 1 組日營收參考核對通過的結果.
  本輪只改驗收與交接 metadata, 未變更產品行為.
- Page spec 改為使用者驗收且授權提交的 current 狀態. Tokens.md
  已包含 LoginBackground 與兩個 effect, 無新增全域規則,
  start.md 不需修改. 較早 session 保留當時的歷史狀態.
- Staging 後核對 16 個預期檔案與 staged lint; 推送後核對
  git status 與 HEAD / origin/main, final 回報實際 commit SHA.

## Session 198: Login 政策與 Google 登入 hover (2026-11-18)

### 本輪改動與確認來源

- 使用者要求資安政策與 Google auth 加入 hover, 指定參考營業資訊
  日營收按鈕. 核對 landing.html 今日營收卡片的日營收 button,
  components/input.md attached-link hover 與既有 branch chip pattern.
- 共用 login-form partial 的資安政策 / 隱私條款及 Google 按鈕
  沿用 hover:bg-text-default / hover:text-text-inverse /
  transition-colors / duration-150: 深底 Text/800, 淺字 Text/100,
  Neutral/200 邊框與原尺寸保留. 四頁政策、前三頁 Google 一起生效.
- 政策 icon 的 mask-image 在 hover 改為既有 attached-link-moved.svg,
  以 currentColor 套 Text/100; 使用移動態 asset, 不只是原圖變色.
  Google 品牌 SVG / 四色保留, 不做濾鏡或換圖.
- 先更新 components/login.md 與 specs/pages/login.md 的確認規則,
  再改 partial / scoped CSS. 沒有修改 JS 接線或 disclosure / RWD /
  固定高度行為, 無新 token / icon / 全域規則, start.md 不需修改.

### 驗證與後續

- 四項 lint / git diff --check 通過, color mirror 94,
  partial manifest 18 頁 / 3 standalone; 最後完整 Chrome smoke
  18 頁 / 252 項通過, exit 0.
- 真實 pointer 在 360 / 768 / 1440 三尺寸核對四頁兩個政策按鈕與
  前三頁 Google, 共 33 組 hover / leave + 1 個日營收參考,
  34 / 34 cases 通過, runtime errors 0. 色彩 / 0.15s transition /
  移動態 mask / Google 品牌原圖 / 還原狀態正確, 邊框 / 按鈕尺寸 /
  卡片高度不變, 無水平溢出. 保存 22 張 hover PNG 與 JSON.
- 測試收尾發現子程序 pipe 保持引用, 以 active resource types 確認後
  釋放當輪殘留 pipe, 兩個 passing runner 皆正常 exit 0;
  smoke finally 同時補上 child stdout / stderr destroy, 不改測試斷言.
- QA artifacts 保存於本機 specs/qa-screenshots/session-198/.
  本輪 self-tested, 待使用者驗收; preview 8000 保持可連線.
  本輪屬已授權的單一視覺 pattern 小修, 採 Light Task 流程.

## Session 197: Login contract 確認與四個獨立頁實作 (2026-11-18)

### Current confirmed contract

- 使用者回答最後三項 checkpoint: or / contact us 分別控制 Google /
  客服, 預設都收合; 四頁客服僅 email; login3 也提供 Google,
  原稿未顯示是收合示意. 配合先前確認的固定高度 scroll / 1024px
  RWD / 背板 50%, 本輪進入 spec-first 實作, 不重複索取確認.
- components/login.md 與 specs/pages/login.md 保存 current source /
  user overrides / defaults / 差異 checkpoint / 後端四頁交付表與事件契約.
  四頁依序為一般帳密、帳密錯誤、Cloudflare 失敗、email 驗證碼.
- Reset 後 live reread 仍見舊 hidden 客服 reference 與 failure Google
  child 缺漏; 明確以使用者上述確認覆蓋, 採既有 simple email /
  Google source, 不再當成未解衝突或還原舊 QR / 電話資料.
- Desktop 固定 545 / 529, 單欄依 mobile page instance 751px,
  短 viewport 以可用高度扣上下各 16px 約束; 表單內原生 scroll.
  >=1024px 846px 雙欄 410 / 436; <1024px 隱藏右圖,
  表單 max410 置中、窄螢幕左右 12px, 兩區預設收合且獨立.

### 本輪改動

- 新增四個 HTML、login-form partial 與 login.css; CSS 匯入 app.css,
  沿用既有 Tailwind config / base.css, 不引入內頁 aside / topbar.
- 右側原圖由 Figma Vector `2838:123272` 匯出 2x PNG 至
  preview/assets/images/login-illustration.png. Logo / Google / eye /
  check / failure / attached-link / email / up icons 與 Cloudflare 圖片沿用既有庫.
- Base 增加兩個 Figma shadow effect 變數並同步 tokens.md;
  LoginBackground 仍為 strict token, alpha 1 + 背板 fill opacity 50%.
- 套用 frontend-design、Sites local-only 流程與 astra-orchestrator;
  Luna explorer 交回既有 partial / manifest / smoke 整合路徑,
  同一 Luna worker 交回 login.js / manifest / smoke checks.
  Root 負責 HTML / partial / CSS / assets / specs 及整合驗證,
  Astra reviewer 獨立 review; 所需 agents 均已回覆.
- Browser skill 已讀, 兩次工具發現均無 node_repl js;
  此環境改用 repo 既有 native Chrome CDP / smoke 流程做 QA,
  不假稱使用 in-app Browser. 本輪不建立 hosted Site.
- JS 僅提供 clear / password eye, 原生 details 獨立收合, 以及
  login:submit / google / policy / refresh 接線事件. Inactive fieldsets
  隱藏並 disabled, FormData 僅含當頁 active inputs; 無 auth API /
  OAuth / Cloudflare 請求、資料保存、倒數或自動跳轉.
- Spec pages/login.md 明列四個獨立頁對應四種狀態與後端接線事項,
  包含需以 HTTP 提供 shared partial / modules, Cloudflare 套既有模組.

### 驗證結果

- 四項 lint / JS 與 smoke syntax / git diff --check exit 0;
  token mirror 94, partial manifest 18 頁 / 3 standalone.
- 最後完整 Chrome smoke exit 0: 18 頁 / 252 項, 新登入頁 56 項,
  原有 14 頁均通過 app.css 新 import 與既有頁面行為檢查.
- 額外 36 / 36 Chrome QA cases 通過: 四頁各測 360x780 / 375x812 /
  410x783 / 768x1024 / 1023x900 / 1024x900 / 1440x900 /
  360x480 / 1440x480. 預設兩區收合, 1024 切換, 410 max width /
  12px gutter, 545 / 529 或短視窗約束高度, 50% 背板 / 圖檔載入,
  default error / challenge / active fields 均核對.
- Trusted pointer / Enter / Space 各自開關, Tab 到最後 email,
  End 與 touch / mouse 內捲到末端均通過. 展開後高度不變,
  無頁面或表單水平溢出, email 可達, 事件 payload / clear / eye /
  focus 正確, runtime errors 0. Source copy / assets / duplicate IDs /
  token / font-size / min-width 另做靜態核對.
- 24 張 default / expanded 手機 / 平板 / 桌面 / 短視窗 PNG 與
  login-qa-results.json、可重現 QA helper 保存於本機 session-197.
  首次 keyboard harness 未帶 Enter text event, 已修正並全量重跑;
  該失敗不是產品 bug, 最後 36 cases 全通過.
- Independent review 無產品 findings. Worker 修正 smoke 初版反向
  斷言, 加強 preventDefault / password payload / clientWidth checks,
  全站最後一輪通過. Root 另加 OTP hint 的 aria-describedby;
  最後將 gutter assertion 也收斂至 clientWidth, 直接重跑現行
  responsive smoke expressions 24 / 24 頁面 / 寬度 cases 通過,
  結果另存 login-responsive-smoke-results.json, 產品行為無改動.
- Preview 8000 持續運行, landing 與四個 login URL HTTP 200.
  本輪 self-tested, 待使用者驗收; 無新增全域規則,
  tokens.md 已同步新 effect / LoginBackground, start.md 不需修改.

### 下一步

- 使用者透過 http://localhost:8000/login1.html 至 login4.html 驗收;
  後端交付對照見 specs/pages/login.md. 依回饋修正,
  收到明確 commit / push 指示才進入提交流程.

## Session 196: Login variants 讀取與固定高度 / RWD 確認 (2026-11-18)

### 使用者已確認的 current 規則

- 延續 Session195 的 login1 至 login4 四個獨立頁與後端交付說明;
  Cloudflare 只示意, 不串真實資料. 登入頁背板統一使用
  Color/Surface/LoginBackground / fill opacity 50%, 不列為頁面差異.
- 使用者回答固定高度: 卡片不可隨內容展開而長高, 超出部分用 scroll.
  Desktop login1 / login2 / login3 沿用 545px, login4 沿用 529px.
  固定高度內原先被裁切的內容須能捲動到達, 不以改長卡片處理.
- 使用者確認 RWD: >=1024px 左右雙欄; <1024px 單欄隱藏右圖.
  單欄表單最大寬 410px 並置中, 窄螢幕扣除左右各 12px 後填滿.
  此確認取代 Session195 的 breakpoint 未定義紀錄與 pending 提案.
- 使用者提供 Login In variants, 要求先 figma-go 讀取.
  本輪仍在 Read / spec checkpoint, 未授權跳過未定義互動直接實作.

### Current Figma source / children checklist

- swift / components `1:2`, selection `222:10421` Login In,
  COMPONENT_SET 450 x 2458. 2026-11-18 live read.
- 四個直接 children:
  1. `222:10420` state=success, COMPONENT 410 x 545;
  2. `287:18363` state=mobile, COMPONENT 410 x 739;
  3. `236:11311` state=message, COMPONENT 410 x 529;
  4. `230:11272` state=failure, COMPONENT 410 x 545.
- Python 遍歷 422 個唯一節點, 四 variant 各 128 / 91 / 66 / 136
  個節點, 逐一核對 PNG / SVG, 再與 Session195 的四頁 / mobile
  instance cross-check, 沒有漏讀. Component set 紫色 #9747FF stroke /
  radius 5 / padding 20 是 Figma 編輯器容器, 不屬於登入 UI.
- UI 維持表單 padding / 主要 gap 12, input / button Radius/6 /
  Neutral/200 border, 字級 24 / 20 / 16 / 12, Text/800,
  錯誤文字 Status-Negative, 白底. 共用 token / icon 沿用現有來源,
  尺寸與 layout 由本輪 page / variant contract 決定.
- Master success 本次顯示帳密錯誤, 但 login1 的 Show warning=false
  仍是其頁面 shown state; 不用 master 的展示狀態覆蓋 page instance.
  Mobile 顯示 Google / email, message 僅 email, failure 沒有 Google
  按鈕; 各 shown state 仍不自動視為開啟後的產品 defaults.
- 讀取 or / contact us 共八個列與八個 arrow 的 reactions, 16 筆
  均空; component set 的 dev annotations 也為空. 此組四 variants
  定義登入狀態 / mobile 結構, 未明確定義兩區開關點擊與初始狀態.

### 舊 spec / current Figma 差異 checkpoint 與未解事項

- 沿用: strict tokens、既有 logo / Google / eye / email / up / down /
  attached-link icons, 密碼眼睛完整 toggle 慣例, 四頁後端示意範圍.
- 以本次 Figma 覆蓋: 登入頁內容、20px input / button 文字、固定高度
  與 1024px responsive 結構, 不沿用內頁 aside / topbar shell.
- 衝突待使用者確認: success 的 Customers service `230:10889` 與
  failure 的 `230:11296` 仍引用退役的 `51:185` state=show, 定義
  含 QR code / 電話 / 傳真 / 區域客服, 高 395. 兩個 instance
  單獨匯出的 PNG 為透明, 不把原始舊節點當成目前可見內容;
  另讀取舊 definition 的 PNG 作 reference, 不提升為 current UI.
  Mobile / message 引用 `2056:71019` state=simple, 只顯示 email,
  與現行 components/customers-service.md 的 email-only 方向一致.
  不自行恢復舊客服資料或靜默替換衝突 instance.
- 互動待確認: or 是否只控制 Google、contact us 是否只控制客服,
  各頁初始展開 / 收合狀態, 以及 failure 頁是否也提供 Google.
  四 variants 沒有獨立 open / closed states, prototype 亦未定義.
- 原始 source JSON / 四 variant PNG / SVG / customer PNG /
  reactions JSON 保存在本機 session-195 的 login-variants-current-source,
  login-variant-*-source 與 login-variant-current-reactions 檔案;
  沿用同一登入工作批次目錄, 本輪沒有產品實作或全域規則變更.

### 驗證與下一步

- 本輪只更新交接, 執行 conventions lint / git diff --check.
  Token 與 CSS 沿用 Session195 的匯入及驗證結果, start.md 不需修改.
- 等使用者確認上述實際缺口後, 收斂 components/login.md /
  specs/pages/login.md current contract 與四頁交付對照, 再進入實作.
  不重問使用者已確認的固定高度 scroll 與 1024px RWD.

## Session 195: 登入頁桌面讀取與 LoginBackground variables 匯入 (2026-11-18)

### 本輪讀取與確認事項

- 使用者指定最外層登入頁交付 login1.html 至 login4.html 四個獨立頁,
  分別表示四種狀態; 交付說明須清楚列出對應關係給後端.
  Cloudflare 沿用後端現有模組, 此處只做示意, 不串真實資料.
- 本輪起始 git fetch origin 成功, main 與 origin/main ahead / behind
  為 0 / 0; 最新 commit 為 f7f417d. Figma swift / display `1:3`,
  selection `2838:123267` Login in page - default, 1246 x 900.
- 讀取四個桌面 section: `2838:123267` default, `300:19721`
  logining and validated failure, `300:19723` validated failure,
  `300:19724` verified message. 均為 1246 x 900;
  主卡片前三頁 846 x 545, 驗證碼頁 846 x 529, 左右欄 410 / 436.
  預備對應一般帳密 / 帳密錯誤 / Cloudflare 失敗 / email 驗證碼.
- 補讀同頁 `2838:123400` 410 x 783 手機稿, 以及 `239:11538`
  768 x 1001 / `239:11981` 375 x 449 reference. Python 逐一遍歷
  七個 root 的 767 個節點, 核對 children checklist 與 PNG / SVG;
  來源原始資料保存於本機 specs/qa-screenshots/session-195/.
- 桌面下方 Google / 客服內容部分被固定高度裁切, 手機稿有顯示;
  讀取四個 form 與六個分隔列的 prototype reactions 均為空.
  舊稿 QR code / 電話等客服資訊與現行 email-only spec 不符,
  不將這些內容提升為 current source.
- 使用者表示稍後提供 variants 與手機版; Google / contact us 的
  顯示、展開預設、互動與 RWD 仍待讀取. 先前提出的 <1024px
  隱藏右圖只是 checkpoint 提案, 尚未確認, 不作為實作規則.

### Variables 匯入

- 使用者明確要求比對後匯入新的 variables, 並表示會自行將
  LoginBackground 配色套用到 Figma background panel.
- 新 export 與本機匯出比較為 134 -> 135 個 variables,
  只新增 `Color/Surface/LoginBackground`, `#B6FA91`, alpha 1,
  VariableID:2839:123657, ALL_SCOPES. 原有 134 筆的 type / value /
  aliases / metadata 均相同, 無刪除或修改.
- 原始 export 匯入忽略版控的 specs/assets/figma-variables.json,
  tokens.md 與 base.css 新增 strict mirror
  `--color-surface-loginbackground`; 不拆寫 camel-case 為另一個 alias.
- 新 token 的 alpha 1 與舊背板讀到的 50% fill opacity 分開記錄;
  等使用者更新 Figma 後重讀 panel 的 binding / opacity 與畫面,
  不以舊圖推定新 panel 透明度, 不自行修改 Figma.
- 本輪只匯入 token 與保存交接, 登入 page/component spec 及四頁
  實作仍待後續 Figma variants / mobile 讀取和 spec checkpoint.
  無新增全域開發規則, start.md 不需修改.

### Background panel 重讀

- 使用者表示已調整透明度為 50%, 要求 figma-go 重讀.
  目前 selection 仍為 default `2838:123267`, 1246 x 900;
  children 為 Rectangle 9 `2838:123268` 846 x 545 與
  Frame 59 `2838:123269` 846 x 545, 結構未變.
- 當前背板 JSON fill 為 #B6FA91, SVG 的 path / ancestor group
  均無 opacity / fill-opacity; PNG 亦顯示全不透明綠色背板.
  Live VariableID:2839:123657 的 mode 17:0 alpha 仍為 1.
- 此次實際讀到的 50% 出現在 Cloudflare 成功勾選 Vector
  `I2838:123270;220:10336;228:10639;218:10390`, fill #2ACA18,
  paint opacity 0.5, SVG fill-opacity="0.5"; PNG 顯示勾選底色變淡.
  不把這次勾選 icon 的變更當成背景板透明度確認.
- 重讀 JSON / PNG / SVG 存於本機 session-195 的
  login-background-reread 與 login1-reread-source 檔案.
  此次 Token 與產品 code 沿用前輪匯入結果, 等待使用者調整目標.
- 使用者再次修正後重讀同一 selection: 背板 `2838:123268` JSON
  fill #B6FA9180, SVG fill #B6FA91 / fill-opacity="0.5", PNG
  核對呈現半透明淡綠. Token 的 live alpha 仍為 1, 50% 設在
  背板 fill, 不修改全域 token alpha. tokens.md 使用說明改為此現況.
  後續使用者確認登入頁背板統一 50%, 手動調整中的數值不列為頁面差異.
- 此次 Cloudflare 成功勾選 Vector 仍為 #2ACA18 / fill opacity 0.5,
  JSON / SVG / PNG 一致, 保留為當前觀察, 不自行還原.
  新來源檔名為 login-background-corrected 與 login1-corrected-source;
  共用 CSS 與產品 code 無新增變更.

### Login2 帳密錯誤頁 current selection 重讀

- 本次 figma-go selection 為 `300:19721` Login in page - logining
  and validated failure, SECTION 1246 x 900. Children checklist:
  1. `283:16865` Rectangle 9, RECTANGLE 846 x 545;
  2. `283:16863` Frame 56, FRAME 846 x 545, 內含
  `283:16993` Login In INSTANCE 410 x 545 與 `232:10733`
  Frame 24 FRAME 436 x 545. Python 遍歷 133 個唯一節點.
- 與 default 共用 mainComponent `222:10420` state=success,
  但 Show warning=true; 標題後顯示 16px Regular / Status-Negative
  的「登入資訊錯誤，請重新輸入」. 其後仍為帳號 xiaomi999 / 密碼
  ******** / IP 與政策 / Cloudflare 成功 / 清除與登入.
  輸入框與按鈕仍為 Radius/6、Neutral/200 邊框與 20px 文字,
  標題 24px / 600; 外卡片 Radius/12, 主要 gap / padding 12.
- 相對 default, 錯誤訊息增加 22px 文字與 12px gap,
  帳號 y=135 / 密碼 y=216 / Cloudflare y=337 / 按鈕組 y=470.
  Show Google sign in / Show Customers service 均 true,
  但 or y=545 / Google y=584 / contact us y=644 / 客服 y=683,
  超出表單 545px clipping; SVG clipPath 與 PNG 均核對,
  不把裁切結果當成 hidden defaults 或收合互動的定義.
- 使用者確認背板 #B6FA91 / fill opacity 50% 為統一規格,
  手動調整中的數值不列為頁面差異. Cloudflare 勾選為
  #2ACA18 / fill opacity 50%.
- Current JSON / PNG / SVG 為本機 session-195 的
  login2-current-source 檔案. Google / 客服 variants 與 mobile
  仍等後續 selection, 不提前寫登入 contract 或開始實作.

### Login3 Cloudflare 失敗頁 current selection 重讀

- 本次 figma-go selection 為 `300:19723` Login in page - validated
  failure, SECTION 1246 x 900. Children checklist:
  1. `293:18746` Rectangle 9, RECTANGLE 846 x 545;
  2. `293:18747` Frame 56, FRAME 846 x 545, 內含
  `293:18748` Login In INSTANCE 410 x 545 與 `293:18749`
  Frame 24 FRAME 436 x 545. Python 遍歷 141 個唯一節點.
- Login In mainComponent `230:11272` state=failure; 上方帳號 / 密碼 /
  IP / 政策列沿用同樣位置與樣式, 未顯示帳密錯誤紅字.
  Show warning 雖為 true, 當前 failure 結構與 PNG 都沒有該訊息,
  不因 property 名稱自行新增帳密錯誤文字.
- Cloudflare `I293:18748;230:11280` 高 77, 左側 71px slot 為
  紅色失敗圖示, 實際向量 53.25px; Status-Negative,
  文字「失敗 | 版本過舊」與有底線的「重新整理」皆 16px Regular.
  右側 Cloudflare 圖片 200 x 77. 依使用者原要求只作示意,
  不自行接服務、驗證規則或重新整理後的結果.
- 下方清除 / 登入兩顆等寬按鈕, 各 177 x 39, 20px 文字,
  Radius/6、Neutral/200 邊框; 按鈕組 y=392, or 分隔列 y=467,
  contact us 分隔列 y=506, 各 27px 高, 截圖中皆為向上箭頭.
  客服區 y=545 開始, 超出固定 545px 表單裁切範圍.
  原始結構另有 y=952 的 contact us 列, 不提升為可見頁面內容.
- Show Google sign in / Show Customers service 皆 true, 但當前
  failure 結構沒有 Google 按鈕且客服被裁切; 顯示與展開互動
  仍等後續 variants, 不從 Boolean 或箭頭方向推定 defaults.
  Cloudflare direction-left icon override visible=false, 不實作該圖示.
- 背板 #B6FA91 / fill opacity 50% 經 JSON / SVG / PNG 核對,
  依使用者澄清套用統一規格, 不再列作各頁差異.
  Current JSON / PNG / SVG 存於本機 session-195 的
  login3-current-source 檔案; 此輪產品實作無變更.

### Login4 email 驗證碼頁 current selection 重讀

- 本次 figma-go selection 為 `300:19724` Login in page - verified
  message, SECTION 1246 x 900. Children checklist:
  1. `299:19488` Rectangle 9, RECTANGLE 846 x 545;
  2. `299:19489` Frame 56, FRAME 846 x 529, 內含
  `299:19490` Login In INSTANCE 410 x 529 與 `299:19491`
  Frame 24 FRAME 436 x 529. Python 遍歷 71 個唯一節點.
- Login In mainComponent `236:11311`, state=message. 內容依序為
  Logo / 旅宿 e 管家, 驗證碼與同列右側提示
  「驗證碼發送至 email，逾時無效」, 輸入框, IP / 政策,
  Cloudflare 成功, 清除 / 登入, contact us, email 卡片.
  不含帳號 / 密碼欄、or 列或 Google 登入按鈕.
- 驗證碼 label 16px, 說明 12px, 輸入示意值仍為 xiaomi999、20px;
  輸入框高 39 / Radius/6 / Neutral/200 border, 白底.
  不從示意值推定驗證碼格式、長度、逾時秒數或重新寄送行為.
  標題 24px / 600, 主文 Text/800; 主要 padding / gap 12.
- IP / 政策列 y=182, Cloudflare y=222 高 121, 按鈕組 y=355
  高 63, contact us y=430 高 27, email 卡片 y=469 高 48;
  卡片僅 icons/email 與 service@bbnet.gmail.com, Radius/8 /
  Neutral/200 邊框. 客服標題列 override visible=false,
  PNG 不見客服標題, 不實作隱藏標題.
- Show warning / Google / Customers service 均 true, 仍依實際
  current structure / visibility 核對可見內容, 不從屬性臆造額外內容.
  Contact us 箭頭向下且 email 可見, 展開規則待 variants 核對.
  背板 50% 依已確認統一規格; Cloudflare 成功勾選於本頁為
  Status-Positive / 100%, 僅作 widget 示意來源記錄.
- Current JSON / PNG / SVG 存於本機 session-195 的
  login4-current-source 檔案. 四個桌面 selection 已逐一重讀;
  variants / mobile 仍待後續 selection, 此輪產品實作無變更.

### Mobile 帳密錯誤稿 current selection 重讀

- 使用者接著指定讀 mobile. 本次 selection 為 `2838:123400`
  Login in page ( mobile / logging and validated failure ),
  SECTION 410 x 783. Children checklist:
  1. `287:17474` Rectangle 9, RECTANGLE 422.49 x 545, x=-6 / y=119;
  2. `287:18489` Login In, INSTANCE 386 x 751, x=12 / y=16.
  Python 遍歷 93 個唯一節點, JSON / SVG / PNG 交叉核對.
- Current mainComponent `287:18363` state=mobile, component 本體
  410 x 739; 此頁 instance 為 386 x 751. Show warning / Google /
  Customers service 均 true, 顯示帳密錯誤、Cloudflare 成功、Google
  登入與 email 卡片. 這些是 shown state, 尚未確認為各頁 defaults.
- 手機單欄不含右側插圖, 外底色 Color/Neutral/75, 白色表單直角;
  外側左右 12 / 上下 16, 表單內 padding 12, 主要 gap 12,
  可用內容寬 362. 410px 是參考稿寬度, 不得寫為固定 viewport /
  fixed min-width. Desktop 保留雙欄, 實際切換 breakpoint 未標示,
  留待最後 spec checkpoint, 不自動採用先前 <1024px 提案.
- 標題 24px / 600, 錯誤訊息 16px / 400 / Status-Negative,
  錯誤在標題 group 內; Label 16px, 輸入文字 20px, IP / 政策 12px.
  輸入框高 39 / Radius/6 / Neutral/200 邊框 / 6px 與 12px 內距.
  帳號 xiaomi999、密碼 ********、IP 41.221.312.333 為示意內容.
- IP 與資安政策 / 隱私條款在同一列, 政策 pill 各 96 x 28 /
  Radius/56. Cloudflare 高 121, 左右 padding 16, 圖片 200 x 77,
  成功文字 24px. 依使用者範圍仍只示意 widget.
- 清除 / 登入並排等寬, 各 165 x 39, gap 8, 按鈕組 padding 12;
  or 列高 27, Google pill 362 x 48 / Radius/56,
  contact us 列高 27, email 卡片 362 x 48 / Radius/8.
  Google / email 都完整可見, 兩列箭頭向下; 客服標題 visible=false.
  不從箭頭方向推定收合規則, 等後續 variants.
- 背板使用 LoginBackground / 50%, 與使用者統一規格一致.
  背板略超出 section 邊界只是裝飾 geometry, 不應讓產品頁面產生
  水平捲動; 流動縮放細節留在 current contract 確認.
- 相較桌面, 採單欄、白底直角表單、完整 Google / email,
  不沿用 desktop 545px 固定表單高度造成的裁切.
  舊 768 / 375 reference 不取代本次 current 手機 selection.
- Current JSON / PNG / SVG 存於本機 session-195 的
  login-mobile-current-source.json 與 login-mobile-current-1-source
  檔案. 此輪只讀圖與更新交接, 登入 page/component spec 與實作
  仍等 variants 讀取及最終 spec checkpoint.

### 驗證與下一步

- 新 export 與附件 bytes / SHA-256 相同; 全部 135 個 variables 的
  color / alias / spacing / radius 與 CSS mirror 逐項一致.
- 四項 lint / git diff --check exit 0; token mirror 94 筆 raw hex
  一致, partial manifest 14 頁 / 3 standalone. 完整 Chrome smoke
  exit 0, 14 頁 / 196 項通過. 無頁面使用新 token, 此輪沒有 UI 變更.
- 下一步依使用者提供的 selection 讀取 variants 與手機版,
  再整理完整 current contract / 差異 checkpoint 與交付狀態說明.

## Session 194: 提交與推送住房統計頁 (2026-11-17)

### 本輪改動與重要決定

- 使用者明確授權 commit & push, 將 Session191 至 193 的讀取紀錄,
  current page / table / help contracts, 住房統計獨立頁與 responsive
  comparison controls 修正一併提交.
- 範圍包含 HTML / help partial / domain CSS, page / table renderer /
  全部 mock data / 共用日期 modules, 導航 / page-tabs / CSS imports,
  partial manifest / browser smoke, progress 與 Session167 至 176 封存.
  對應新檔全部納入, 不將待實作或歷史紀錄當成排除規格的理由.
- 去年同期只控制 2025 表格; <1024px comparison selection 獨佔下一列
  全寬, toggle 保留 64 x 28 原尺寸與 label 後位置. NoShow / 正式資料 /
  統計計算 / 下載仍保留後端接線, 不增加前端商業邏輯.
- 原始 Figma JSON / PNG / SVG 與 QA probes / 截圖依既有 ignore 規則
  保留本機 session-191 至 193; 來源 ids / 確認規則 / 完整假資料與
  驗證結論保存於版本化規格及實作中.
- 本輪進入 commit/push flow, 實際 SHA 與遠端狀態以 git history 為準.

### 驗證與後續

- git fetch origin 成功, main 與 origin/main ahead / behind 為 0 / 0.
- 沿用 Session193 最後完整 Chrome smoke exit 0: 14 頁 / 196 項,
  住房統計 17 項, 並有最後 14 組 on / off responsive controls 核對通過.
  Session192 額外 60 組來源 / layout / native scroll probes 通過.
- 本輪只更新交接與規格 metadata, 未變更產品行為; 提交前核對全部
  tracked / untracked 檔案與封存完整性, 執行四項 lint / JS syntax /
  whitespace checks, 並核對 staged 清單.
- 推送後核對工作樹及 HEAD / origin/main, 不遺留本次應提交來源檔案.
- 無新增 token / icon / 全域規則, tokens.md / start.md 不需修改.

## Session 193: 去年同期控制項在手機與平板上下排列 (2026-11-17)

### 本輪改動與確認事項

- 使用者指出平板含以下的去年同期選單太窄, 要求與 toggle 上下排列;
  隨後補充 toggle 維持原本大小, 只有 selection 可 width 100%.
- 先更新 housing-statistics page contract, 再於 <1024px 將 comparison
  select 放到 grid 的完整下一列. Label / switch 留在第一列,
  switch 保持原本 64 x 28 及 label 後的位置, 不拉寬或改為右對齊.
- 沿用原本 grid 欄寬與 Spacing/12 gap; >=1024px 保持原本並排.
  未更動 table 配置、toggle 邏輯、資料或其他表單欄位.
- 現有 smoke viewport cases 補上手機 / 平板 select 全寬、與 switch
  上下位置及 switch 64 x 28 的 regression checks, 不增加新的測試依賴.

### 驗證與下一步

- 360 / 375 / 768 / 900 / 1023 / 1024 / 1440 各核對 off / on,
  共 14 組通過. Switch 全部為 64 x 28; 375px select 為 311px,
  768px select 為 422px, 並驗證較長範例文字的可用顯示寬度.
- Page 無水平溢出, enabled / disabled selection 狀態符合原 contract,
  console error 0. JSON 與八張手機 / 平板 / 桌面截圖在 session-193.
- 四項 lint / smoke syntax / git diff --check exit 0.
  最後完整 browser smoke exit 0: 14 頁 / 196 項, 住房統計 17 項.
- 本輪 self-tested, 待使用者驗收. Preview 8000 可連線,
  http://localhost:8000/housing-statistics.html.
  無新增 token / icon / 全域規則, tokens.md / start.md 不需修改.

## Session 192: 住房統計規格確認與獨立頁實作 (2026-11-17)

### 本輪改動與確認事項

- 使用者回覆八項 checkpoint 後明確授權開始實作.
  去年同期 toggle 只切換右側 2025 表的出現與隱藏, 不改左側 2026 表的
  欄位 / 數值 / 前期差異 / 成長率; NoShow 業務邏輯與下載交後端.
- 日期預設及清除為 Asia/Taipei 今天至今天, 各選單全部, 兩開關關閉;
  按查詢才提交 draft filters, 不計算或刷新假資料.
- 表格各自欄位與分組依圖保留. 說明由 info + 說明按鈕開啟.
  使用者自行刪除重複間數列後, live reread `2836:109151` 為 745 x 404,
  已核對當前 JSON / PNG, 以此取代先前 442px 高的文案來源.
- 使用者另確認 RWD: <1024px 兩年度 table 上下排列, >=1024px 左右並排;
  表內仍可橫向捲動, 不是把欄位轉成直式卡片.
- 寫入 current page contract 與 table / help components, 記錄 current
  node ids / read date / confirmed defaults / 舊規格差異 checkpoint.
  第一批主頁 + on-state variant + 修正說明 + 同來源展開 table 合併使用.
- 新增 housing-statistics.html / domain CSS / page module / table renderer /
  完整 Figma 假資料 module / help partial. Aside 啟用住房統計真實連結,
  page-tabs 使用 Figma 住房統計表文字, 登記 partial manifest 與 CSS smoke.
- Native date inputs 保留鍵盤與 picker, 日曆圖示確實呼叫原生 picker;
  以 DOM 文字鏡像 ISO 值, 避免瀏覽器 locale 將閉合欄位改成斜線格式.
  今日 / 週 / 月 / 年區間的日期運算從 member-data 原樣抽成
  date-periods.js, 兩頁共用, 原會員頁其他行為不變.
- Query / download emit 本頁 CustomEvent 作後端接線邊界;
  不增加下載檔案、NoShow 篩選、真實統計、成功訊息或新 modal.
  只有全部的選單不自行增加未定義選項.
- 查詢區沿用 member-data container-query 模式, 本頁短欄位以 300px
  流動欄組需求反推 980 / 640px content thresholds, 兼顧 1440px scrollbar.
  不在同一元素疊加衝突的 Tailwind padding / grid class.
- 表格使用單一外框; 桌面共用橫捲, 小螢幕各自橫捲. 用 Figma source
  geometry 保留 1469 / 701px 表寬、38px 表頭、46px 明細列與合併分組.
  Inside stroke / border box 的內距差以現有 spacing token 減 border 校正.
- 說明使用 native auto popover, click / outside / Escape, 無 backdrop;
  保留深底 / 黃標題 / 左箭頭與修正後完整文案, 內容過高時內部捲動.
  17 個頁內 icon 以現有 SVG mask + Text/800 控色, 無新增 icon 或 token.

### 驗證與交接

- 本輪 self-tested, 待使用者驗收. 來源資料在 session-191, 本輪 live help 與
  viewport / state 截圖及 source probes 存於 session-192.
- 初次完整 smoke 的其他 13 頁通過; 住房頁新增 17 項檢查.
  Trusted click 曾命中切換 viewport 後仍在滑出的 sidebar,
  現改為確認目標未被覆蓋後再點擊, isolated 17 項 assertions 通過.
- 短版 isolated run 曾於 Chrome profile teardown 出現 ENOTEMPTY,
  已為自有暫存 profile 增加 bounded retry, 不改應用程式行為.
- 最後完整 Chrome smoke exit 0: 14 頁 / 196 項, 住房統計 17 項;
  包含 readonly mock report, switch 獨立狀態, query snapshot / clear,
  日期快速控制, help 原文 / viewport bounds, 原生 picker trusted click,
  說明 click / outside / Escape 與跨 1024px table 排列.
- Root 額外 60 / 60 probes 通過: 35 筆今年明細的 595 個 detail cells /
  去年 54 cells / 28 個欄名及修正後全部說明文案均與原始 Figma JSON
  逐格相同; 四種 switch 組合不改今年 DOM; 色彩與 16px / 400 字重核對.
- 360 / 375 / 768 / 900 / 1023 / 1024 / 1280 / 1440 及側欄收折無頁面
  水平溢出; 1469 x 1648 主表、38px 表頭、46px 明細列均符合來源.
  手機 touch 橫捲今年表時, 去年 scrollLeft 保持 0; 去年表 keyboard
  ArrowRight 可捲. 360 x 480 說明內部可捲且不超出 viewport.
- 最終截圖涵蓋六尺寸 default / comparison, 三尺寸說明,
  375 / 1440 雙 switch on, 桌面橫捲到去年表, tablet / desktop 側欄收折,
  及窄矮視窗說明捲動. 日期顯示 YYYY-MM-DD, 快速控制箭頭依 Figma
  為 24px 既有 SVG mask, 並非舊 member-data 的 16px 圖示尺寸.
- 四項 lint / 六個相關 JS module 與 smoke syntax / git diff --check
  exit 0; token mirror 仍 93, manifest 14 頁 / 3 standalone. Browser error 0.
- 依 progress 超過約 25 筆時的規則, 將 Session167 至 176 的 10 筆原文
  搬至 progress-archive-s167-s176.md, 搬移內容 SHA-256 核對一致;
  progress 保留最近 16 筆, archive audit JSON 在 session-192.
- 未新增 token / 全域規則, tokens.md / start.md 不需修改.
  使用 sites skill 的 local-only repo / preview 流程與原生 Chrome CDP,
  沒有建立 hosted Site. Preview server 8000 保持可連線,
  直接頁面 http://localhost:8000/housing-statistics.html.
  本輪待使用者驗收, 不自行 commit / push.

## Session 191: 住房統計桌面 frame 批次讀取 (2026-11-17)

### 本輪讀取與來源

- 使用者要求 figma-go 批次讀完最後一頁住房統計後再集中詢問;
  原則上所有統計數據均為假資料, 後續由後端套用.
- git fetch origin 成功, main 與 origin/main ahead / behind 為 0 / 0.
- 本輪工具清單未直接提供 figma-mcp-go, 透過本機既有 server 的
  stdio follower 進行 read-only 工具呼叫; 未變更 Figma 或產品檔案.
- 目前 Figma file swift / page components `1:2`, selection 僅有
  `2830:113734` 住房統計表 - 1117 v1.1, 1440 x 2182.
  完整逐節點 iterate 1808 個唯一節點, 並讀取去重 component definitions /
  properties / hidden overrides, 不是僅讀 root summary.
- Children checklist: wrapper `2830:112931` 1400 x 2158,
  shell `2830:112932` 1400 x 2134, menu `2830:113735` 240 x 895.48,
  body `2830:112934` 1140 x 2134, topbar `2830:112935` 1140 x 36,
  filter `2830:112940` 1140 x 320, results `2830:113026` 2210 x 1730.
- Filter 為三欄, 每欄 340px / 欄距 40px / padding 20 / radius 12;
  日期起訖示例皆 2026-02-27, 四組今日 / 本週 / 本月 / 今年 stepper,
  說明按鈕, 訂房來源 / 國籍 / 分類一 / 分類二皆為全部,
  去年同期與 NoShow 皆 closure, 去年選單為 disabled / 全部,
  底部清除 / 查詢. 上述是 shown state, 尚未確認為產品 defaults.
- 下載 `2834:107968` 96 x 42, table `2835:111475` JSON bounds
  2210 x 1672; 今年 group `2835:111476` 1469 x 1648, 含 19 欄 /
  當日至提前四日 5 組, 每組星期日至六 7 列; 去年 group
  `2835:112205` 701 x 772, 含 9 欄 / 5 組 / 合計列, 沒有星期欄.
- 本輪核對可見 PNG / SVG: 表格白底表頭, 16px Regular, 水平線而無
  垂直格線, 下降為 Color/Chart/green, 上升為
  Color/Surface/Status-Negative, 0 為 Color/Text/800.
  篩選底色 Neutral/75, 外框 Neutral/200; 本輪未新增 token.
- DatePicker 的 Title show 為 false, JSON 仍有訂房間數隱藏文字;
  topbar 也有 hidden icon / badge overrides, 不可照完整 JSON 全部呈現.
- 原始 JSON / PNG / SVG, 逐節點 inventory, component state inventory,
  待確認 read-report.json 皆保存於本機忽略的 qa-screenshots/session-191.
  未建立尚未確認的 page / component spec 或實作.
- 讀取 inventory 核對 1808 個 id 均唯一; 本輪僅修改交接文件,
  conventions lint 與 git diff --check exit 0, 未執行 UI smoke.

### 讀取限制與待確認事項

- 匯出 API 回報 table width 2210, 實際 PNG / SVG 寬僅 1140;
  今年 group 實際 PNG 寬 1124, 去年 group / 金額 / 入住人數個別匯出
  皆為 1 x 1 空圖. JSON 結構與文字已讀, 裁切外的視覺尚無可驗證來源;
  不因 JSON 有節點就判定它在當前狀態可見.
- 全頁 search_nodes 回報 Unknown node type; 不宣稱已枚舉未選取的
  sibling frames. 目前 selection 沒有 mobile / tablet 或說明彈窗來源.
- Page / filter / 說明 / 下載 / 兩個 toggle / disabled select 的
  prototype reactions 均為空, 不自行發明互動或資料計算規則.
- 待集中確認: 去年同期開關控制哪些表與比較欄, 選單選項;
  NoShow 為納入或僅顯示; 日期 defaults / 清除 reset;
  說明內容與呈現 / 下載格式及前後端分工; mobile / tablet 佈局及固定欄.
- 表格差異待確認: 今年沒有累計金額, 去年有; 去年有合計,
  今年沒有. 數值不做真實統計一致性要求, 但欄位結構不自行補齊.
- 舊規格差異 checkpoint: shell / 既有元件互動可列沿用候選;
  白底表頭 / regular 字重與共用 table 範例不同, DatePicker 舊 spec
  為間數計數器, 不可作為本頁來源. 確認後須記錄本頁 override / variant.
- 本輪依使用者要求及 start.md 的 figma-go checkpoint 停在 Read,
  等集中確認後再寫 spec; 不推定本輪已授權實作.

### 後續批次 02: 開關開啟的篩選狀態

- 使用者要求繼續讀其他 selection, 稍後才一起問; 原本六項問題先保留,
  不將新的 figma-go 解讀為進入 spec 或實作的授權.
- 本批 selection 為 `2835:114457` shirnk-model-1, 1140 x 320,
  共 148 個唯一節點. 完整讀取 JSON / component definitions / hidden
  overrides 並核對 PNG / SVG; 原始資料以 batch-02 前綴保存在 session-191,
  未覆寫第一批來源. batch-02-read-report.json 為未確認的讀取筆記.
- Children checklist: 日期與說明 `2835:114458` Frame 651, 340 x 218;
  四組選單 `2835:114473` Frame 650, 340 x 204;
  開關與去年選單 `2835:114491` Frame 635, 340 x 84;
  操作列 `2835:114501` Frame 653, 1100 x 62.
- 三欄 / 340px 欄寬 / 40px 欄距 / padding 20 / radius 12 與第一批相同.
  篩選底色 Neutral/75, border Neutral/200 / 1px, 字體 16px Regular;
  沒有新增 gradient 或 token.
- 本批差異: 去年同期 `2835:114495` 與 NoShow `2835:114500` 皆為
  type=open, PNG 確認綠色 track / knob 在右, 色值對應 Accent/Green.
  去年選單 `2836:109097` 為 state=Default, 白底 / Text/800 / 全部,
  與第一批 disabled 灰底不同. 查詢按鈕寬 56, 第一批為 50, 文字皆相同.
- 四個 stepper 的 Title show 仍為 false, 訂房間數為隱藏 title;
  原本日期與四組全部選單文字未變. 本批沒有 table, 不推定兩開關
  分別控制哪些欄位或資料, 也不把兩者同時 open 當成狀態連動.
- Root / 說明 / 兩個 toggle / 去年選單的 reactions 均為空.
  本批只是補充 on-state 視覺, 不取代第一批主頁, 不推定 default.
- 只更新交接與本機讀取資料, 疑點繼續累積, 等使用者提供其餘 frames
  並表示讀完後再集中詢問. 無 page / component spec 或產品實作改動.

### 後續批次 03: 說明 Tooltips 內容

- 本批 selection 為 `2836:109151` Tooltips, instance of `194:2195`,
  state=left, frame 745 x 442, 共 56 個唯一節點.
  PNG / SVG 實際寬為 753, 多出左側箭頭 8px; height 442.
- 完整讀取 selection / component definition 與 rendered PNG / SVG,
  來源使用 batch-03 前綴保存於 session-191, 無覆寫前兩批.
  去重 context 的 master Slot 仍是 sm (12) 佔位內容, 真實 rich text
  以完整 selection 與 PNG 為準, 不可誤套 master placeholder.
- Children checklist: Slot `I2836:109151;1907:71849` 721 x 426;
  箭頭 `I2836:109151;194:2197` 9.53 x 8.25, x=-8 / y=14.76.
  Slot 內 Frame 672 `I2836:109151;1907:71849;2836:109113`
  包含 10 個順序區塊: 篩選條件標題 / 訂房來源 / 欄位顯示依據標題 /
  筆數 / 間數 / 間數 / 金額 / 百分比 / 住房率 / RevPAR.
- 訂房來源完整原文已保存, 包含實體 / 網路 / 官網訂房系統 / 官網 /
  公共渠道 / 自設渠道及相關舉例; 不改寫來源名稱或文案.
- 欄位說明: 筆數為當日住房之訂單量; 兩列間數皆為當日住房之房間數;
  金額為當日個別房價總和; 百分比為該數據占全部日期之比例;
  住房率為預訂單占開放房間數量之比率; RevPAR 為客房收入除以
  可售客房總數, 或住房率乘平均房價. 此為 Figma 說明文案,
  不據此增加真實計算或將 glossary 項目自行加入 table.
- PNG / SVG 核對深底與箭頭為 Neutral/700, radius 6,
  padding 8 / 12, 區塊 gap 8; 兩標題為 SubItem/Selected /
  20px SemiBold, 內文與 label 為 Text/50 / 16px Regular / line box 22.
  Label 四側描邊 Neutral/100, padding 4 / 8, 與內文 gap 6.
  SVG 沒有 gradient; 未新增 token 或 icon.
- 讀過 parent components/tooltips.md; 舊 dark sm 範例為 12px /
  Neutral/100 / 垂直 padding 2, 不可覆蓋本批富文字 instance.
  確認後應以本頁 variant 記錄差異, 不修改其他 tooltip 的共用 baseline.
- Root reactions 為空, 前兩批說明按鈕也無 prototype link.
  現已補到說明文案與視覺, 原待確認項目不再要求使用者提供全部內容;
  觸發 / 關閉 / 小螢幕行為仍待確認. 重複間數列與 glossary 較廣的
  指標範圍先原樣保存, 不刪除或改字.
- 本輪僅保存讀取資料與交接, 疑點持續累積, 不在這批詢問或實作.
  56 個 id 唯一, conventions lint 與 git diff --check exit 0.

### 後續批次 04: 同來源展開表格與集中 checkpoint

- 使用者表示這是最後一個 frame, 用來補足第一張展開內容且為相同來源,
  讀完即可集中提問; 不需再要求使用者提供其餘 selection.
- 本批 root `2835:112966` Table desktop, 2210 x 1672,
  完整 iterate 1490 個唯一節點, 並核對完整 PNG / SVG 實際尺寸.
  本批實際圖片不再受第一張 1140px 內容區裁切, 金額 / 入住人數 /
  去年表格均有可視來源, 第一批的右側視覺讀取限制在此解除.
- Children checklist: 今年 `2835:112967` Frame 117, 1469 x 1648,
  x=16 / y=12, 19 欄 / 5 組提前天數 / 各 7 個星期列;
  去年 `2835:113696` Frame 675, 701 x 772, x=1493 / y=12,
  9 欄 / 5 組提前天數 / 合計. Group gap 8, table padding 12 / 16,
  radius 12; 年份與提前天數欄分別寬 61 / 120, 星期寬 56,
  數值 / 差異 / 成長率欄依來源分別為 56 或 88 / 88 / 72.
- 今年欄位順序: 年份 / 提前幾天訂房 / 星期 / 筆數 / 前期差異 /
  成長率 / 累計筆數 / 前期差異 / 成長率 / 間數 / 前期差異 / 成長率 /
  累計間數 / 前期差異 / 成長率 / 金額 / 前期差異 / 成長率 / 入住人數.
- 去年欄位順序: 年份 / 提前幾天訂房 / 筆數 / 累計筆數 / 間數 /
  累計間數 / 金額 / 累計金額 / 入住人數. 五組之後有合計列.
  今年沒有累計金額與合計, 去年沒有星期, 這些是欄位與結構差異,
  不是需要對假資料做算術一致性要求; 仍列入 checkpoint, 不自行補欄.
- 白底 / Neutral/200 外框 1px / Neutral/800 水平格線 / 無垂直格線,
  16px Regular 表頭與內文, 下跌 Chart/green / 上升 Status-Negative /
  zero Text/800 均與先前可見範圍一致. SVG 無 gradient.
- 與第一批 `2835:111475` 遞迴比對全部文字 / name / type / styles /
  bounds / children; 排除 node ids 與 root 畫布座標後, 結構 / 欄位 /
  文字 / 樣式一致. 唯一 150 筆差異皆為趨勢文字 measured bounds
  寬 23 變 28, 置中 x 32.5 變 30, cell bounds 與其他屬性均相同.
  視為使用者已確認的相同來源補充, 不當成另一個產品狀態或新版本.
- Root reactions 為空. 原始結果 / 完整 PNG / SVG / 全節點 inventory /
  crosscheck / 未確認 contract 存於本機 session-191 的 batch-04 系列,
  read-report.json 已合併四批來源、解除的限制與八組集中問題.
- 四批來源關係: 第一張為主頁, 第二張補開關 on / select Default,
  第三張補說明 Tooltips 內容, 第四張補第一張被裁切的表格視覺.
  均不把 Figma shown state 推定為產品 defaults; 無產品 spec 或實作改動.
- 差異 checkpoint: 共用 shell / 導航 / 元件互動列沿用候選;
  本頁白底 Regular 表頭 / 深色格線, 以及說明的 20px 標題 / 16px 內文 /
  padding 8, 應依本輪 Figma contract 覆蓋舊 generic 範例.
- 集中待確認: 去年同期開關控制右表及比較欄 / 選單選項與作用;
  NoShow 納入或僅顯示; 日期 defaults / clear reset / query 更新時機;
  兩年表格的不同欄位與分組是否依圖保留; 說明重複間數列處理;
  說明是否點擊開關及外側 / Escape 關閉; 下載保留後端或假資料匯出格式;
  mobile / tablet 篩選區排列與收合, table 橫捲與固定表頭 / 欄位.
- 使用者已定義數值為假資料、正式數據與計算留後端,
  不再詢問公式或要求範例累計 / 合計數字相符.
- 本輪僅保存讀取與交接; 1490 個 id 唯一,
  conventions lint / git diff --check exit 0, 未執行 UI smoke.

## Session 190: 提交與推送排程發送頁 (2026-11-14)

### 本輪改動與重要決定

- 使用者明確授權 commit & push, 將 Session188 / 189 的完整讀取紀錄,
  current page / modal contract, 獨立排程頁與新增 / 修改 / 查看 modal 一併提交.
- 提交範圍包含 HTML / partial, page / state / modal modules, 兩個 domain CSS,
  namespace 共用排序與 SMS wrapper, sidebar / page-tabs / app.css,
  partial manifest / browser smoke 及 progress. 本輪對應新檔全部納入.
- 範例保留後端接線, 卡片資訊唯讀, modal 提交既定五個表單欄位;
  usage 與 lifecycle 狀態獨立, 排序放開即存. 不增加實際發送排程邏輯.
- Figma 原始 JSON / PNG / SVG 與 QA 截圖 / probes 依既有 ignore 規則
  保留本機, 讀取來源 / 已確認規則 / 驗證結論保存於版本化 specs.
- 本輪進入 commit/push flow, 實際 SHA 與遠端狀態以 git history 為準.

### 驗證與後續

- git fetch origin 成功, main 與 origin/main ahead / behind 為 0 / 0.
- 沿用 Session189 最終完整 Chrome smoke exit 0: 13 頁 / 179 項,
  排程頁 14 項, 另 9 組 root interaction probes 與 18 組版面核對通過.
  本輪僅更新交接紀錄, 未變更產品行為.
- 提交前核對全部 tracked / untracked 檔案, 執行四項 lint,
  JS syntax 與 whitespace checks; commit hook 再次檢查.
- 推送後核對工作樹及 HEAD / origin/main 一致, 不遺留本次來源檔案.
- 無新增 token / icon / 全域規則, tokens.md / start.md 不需修改.

## Session 189: 排程發送頁與 modal 實作 (2026-11-13)

### 本輪改動與重要決定

- 使用者確認範例按鈕日後由後端提供內容並置入 textarea,
  本輪保留按鈕, 不自行填入範例文字或增加彈窗.
- 使用者確認卡片當中的資訊是唯讀結果, 修改集中在 modal
  新增 / 修改的表單內容. 不在卡片增加可編輯日期控制.
- 依使用者先前的讀完且釐清後直接實作授權, 先寫 current page /
  modal contract 與舊頁差異 checkpoint, 再建立獨立排程頁.
- 現行來源仍是 Session188 讀取的主頁 `2803:111821` 與 modal
  `2803:112567`; source PNG / SVG 在 session-188, 本輪 QA 在 session-189.
- 沿用已確認的 SMS lifecycle / usage 獨立狀態, 個別 toggle 存在,
  disabled lifecycle 可操作 usage, 即時排序 / clear / save / view 操作模式.
  共用排序抽成 namespace 可設定 module, SMS 保留原 API / selector / storage key.
- 對照實際 SMS module 與元件 spec, 語塊 / 預覽仍是後端插值前的
  示意邊界; 不發明語塊模板語法或將生日祝賀的入住日示例自行改字.
- 卡片四組資料保留各自 event / anchor / direction / permission metadata,
  modal 僅提交 title / category / days / hour / content.
  新增不推定 event label; 不計算實際發送時間 / 時區 / 通數.

### 驗證與下一步

- 2026-11-14 收尾驗證: 四項 lint / 五個相關 JS module 與 smoke syntax /
  git diff --check 均 exit 0. Token mirror 仍 93, manifest 13 頁 / 3 standalone.
- 完整 Chrome browser smoke exit 0: 13 頁 / 179 項, 排程頁 14 項,
  包含 lifecycle / usage 獨立狀態, 無 toggle 卡片篩選, 權限提示,
  new / edit / view / clear / save / discard, 範例 no-op, preview 開合,
  SMS 既有 11 項以及兩頁編號 / 標題的真實 mouse 中央落點拖曳.
- Root 額外 9 組 interaction probes 通過: keyboard preview / cancel /
  commit, reload order, touch body scroll, touch cancel / handle reorder,
  keyboard 排序中第一次真實 edit click, 新增資料回寫卡片.
- 375 / 768 / 1440 共 18 組列表 / modal state 核對,
  24 張 PNG 與 layout / interaction JSON 在 session-189.
  所有卡片內容唯讀, 日期欄等寬且與類別 input 左緣對齊,
  頁面 / modal 無水平溢出, console error 0.
- 視覺複核補正卡片資訊 strip 的 16px block gap / 8px icon gap /
  4px 單側框線內距; 權限提示依來源是 summary 下方的 22px sibling,
  獨立 147px textarea, 不套用一般操作列 36px 高度或填滿底部空隙.
- Independent review 發現 full-width modal 的 body 捲軸會讓內容寬度
  跌破原 775px query, 造成桌面首列提前轉單欄. 於 1440 x 800
  重現 6px gutter 後, 改查詢外層 modal 的穩定寬度;
  新增永久 smoke case 驗證捲動 body 仍維持雙欄.
- 瀏覽器 skill 的 in-app 執行工具未提供, 沿用專案原生 Chrome CDP
  驗證; 未宣稱使用 in-app Browser. Figma JSON / PNG / SVG 讀取來源
  另保留於本機忽略的 session-188.
- 本輪 self-tested, 待使用者驗收. Preview server 8000 可連線,
  直接頁面 http://localhost:8000/scheduled-send.html.
- 無新增 token / icon / 全域規則, tokens.md / start.md 不需修改.

## Session 188: 排程發送完整讀取與待確認行為 (2026-11-13)

### 本輪讀取

- 使用者要求 figma-go 讀取排程發送, 資訊足夠便直接實作;
  遇到影響行為的問題則先停止並詢問.
- 完整讀取 current selection: 主頁 `2803:111821`
  排程發送 1113 v1.1 (1440 x 1160), modal `2803:112567`
  (800 x 926), 包含所有子節點, 並核對 PNG / SVG.
- 主頁呈現四張卡片: 入住提醒 / 入住感謝 / 生日祝賀 / 催款通知;
  包含事件日前後 / 日時資訊, 總部無調整權限提示,
  個別卡片有無使用 toggle, 查看 / 啟動與修改 / 停用兩組狀態.
- Modal 包含類別 / 文本標題, 日期的日 / 時欄位,
  範例按鈕, 簡訊內容 / 預覽 / 語塊, 清除 / 儲存.
  沒有簡訊文本 modal 的範本 / 條件 / 付款方式 / 排序欄.
- 讀取既有 SMS page / modal / state / sort 與 shell integration,
  將可沿用的操作模式和新的排程行為分開辨識.
  不將使用 toggle 與啟用 / 停用連動, 也不依卡片類別推定 toggle 存在.
- 原始 PNG / SVG 存於本機忽略的 qa-screenshots/session-188;
  本輪未修改產品檔案或建立尚未確認的排程 spec.

### 待確認與下一步

- 範例按鈕 `I2803:112567;73:678;2803:112906` 與 modal
  的 prototype reactions 均為空, 圖稿沒有定義點擊後的內容或動作.
- 日期欄位需要確認日 / 時的意義, 以及入住日前 / 退房日後等
  事件基準是否由類別帶入且不可修改. 不自行推定時數差或當天鐘點.
- 依使用者本輪指示先停在讀取階段; 待以上兩項釐清後,
  補 current page / modal contract, 再實作及驗證.

## Session 187: 提交與推送簡訊文本與發送頁 (2026-11-13)

### 本輪改動與重要決定

- 使用者明確授權 commit & push, 將 Session182 至 186 的讀取 contract,
  主頁 / full modal 實作, 使用 toggle 邏輯, 排序欄對齊,
  付款 label 圓角與拖曳中央落點修正一併提交.
- 提交範圍包含簡訊 page / modal specs, HTML / partial, 四個 JS modules,
  兩個 domain CSS, sidebar / page-tabs / app.css / modal registry,
  partial manifest / smoke 與 progress. 所有對應新檔一併納入.
- QA PNG / JSON / SVG 沿用 repo 的 qa-screenshots ignore 規則保留本機;
  current source / 規則與驗證結論記錄於版本化 spec / progress.
- 依交接檔超過約 25 筆時封存最舊 10 筆的規則分批整理,
  將 Session127 至 166 共 40 筆原文移至 progress-archive-s127-s166.md,
  progress 保留最近 21 筆; 搬移前後內容雜湊核對一致.
- 本輪進入 commit/push flow, 實際 SHA 與遠端狀態以 git history 為準.

### 驗證與後續

- git fetch origin 成功, main 與 origin/main ahead / behind 為 0 / 0.
- 沿用 Session186 最後完整 Chrome smoke exit 0: 12 頁 / 165 項,
  SMS 11 項; 本輪只更新交接 metadata, 未更動產品行為.
- 提交前核對全部 tracked / untracked 變更, 執行四項 lint,
  JS syntax 與 whitespace checks; commit hook 再次檢查.
- 推送後核對工作樹及 HEAD / origin/main 一致, 不遺留本次來源檔案.
- 未新增 token 或全域規則, tokens.md / start.md 不需修改.
- 正式資料 / 權限 / 範本插值 / 通數計算仍依既定範圍由後端接線.

## Session 186: 簡訊卡片拖曳中央落點無換位修正 (2026-11-13)

### 本輪改動與原因

- 使用者實測桌面從卡片標題 / 空白處及左上編號拖曳均未成功.
  不將問題歸因於操作起點; 先以 trusted mouse / touch 重現.
- Baseline 確認從編號 / 標題 / 空白處拖到下一張卡片中央皆維持原順序;
  拖超過後半部才換位. 舊 before/after half 判定雖有成功路徑,
  但對常見中央落點無效果, 先前僅測跨後半部未涵蓋此情境.
- 先更新 sms-text page spec, 再將 pointer target 判定改為移至命中卡片索引;
  進入另一張卡片即顯示換位, 不再要求越過後半部.
- 桌面保留編號 / 標題 / 非表單空白處起拖, 加 grab / grabbing 游標;
  textarea / 按鈕 / toggle 保留原互動, 手機仍從編號把手起拖,
  卡片其他區域維持垂直捲動. 沒有新增未定義的浮動 ghost 視覺.
- 保留可見 slots 排序, 放開即存, Escape / pointercancel / lost capture
  取消與篩選 / modal action 的 transaction 清理.
- 新增永久 smoke trusted mouse 回歸: 分別從編號及標題拖至目標中央,
  核對換位與 localStorage 中可見順序立即一致.

### 驗證與下一步

- 修正前後 8 組真實事件矩陣存於 session-186 drag-baseline.json /
  drag-after.json. mouse 編號 / 標題 / 空白中央落點, 以及 touch 把手中央
  均由不換位改為換位; 後半部成功路徑維持, textarea / touch card-body
  的原互動限制也維持.
- Root 既有 bounded probes 7 / 7 通過: click / Tab focus, mouse / touch,
  keyboard cancel, reload persistence, 8 viewport bounds; JSON 與最新手機圖
  存於 session-186, 360 至 1440 無水平溢出.
- Fonts / conventions / tokens / partials lint, JS / smoke syntax 與
  git diff --check exit 0; token mirror 93, manifest 12 頁 / 3 standalone.
- 最後完整 browser smoke exit 0: 12 頁 / 165 項, SMS 11 項,
  包含編號 / 標題中央落點的真實 mouse regression.
- 本輪 self-tested, 待使用者驗收. 桌面可按住編號或標題拖至另一張卡片,
  列表即時換位, 放開保存; localhost:8000/sms-text.html 供驗收.
- 無新增 token / icon / 全域規則, tokens.md / start.md 不需修改.

## Session 185: 簡訊 modal 排序欄對齊及卡片付款標籤圓角修正 (2026-11-13)

### 本輪改動與重要決定

- 使用者要求 modal 排序列的文字 / input 間距與相鄰欄位對齊.
  Chrome baseline 量測類別 / 範本的 label-to-input offset 為 80px,
  排序因專用覆寫為 48px + 20px = 68px, 向左偏 12px.
- 先補 components/sms-text-modal.md 的現行對齊規則,
  再移除 sms-text-modal.css 的 .sms-rank-field 欄寬 / gap 覆寫,
  使用共用 .sms-field 的 4em label + Spacing/16 gap.
- 使用者另要求比對圖片, 記錄並修正卡片轉帳 / 傳真刷卡等付款 label 圓角.
  session-183 selection 的 Status buttons `2786:110156` 至 `2786:110162`
  七顆皆 cornerRadius 2; 保留 PNG / SVG 的輪廓亦確認小圓角.
- 本輪 live MCP 回覆 plugin not connected, 未宣稱重新取得 live 來源;
  依同次保存的 Figma JSON / PNG / SVG 與使用者明確更正處理.
- 先補 specs/pages/sms-text.md 的 Radius/2 與來源, 再於
  .sms-text-payment-chip 加 border-radius: var(--radius-2).
  修改範圍是卡片標籤, modal payment chips 維持原有規格.

### 驗證與下一步

- Chrome 新增 / 修改 / 查看, 各於 375 / 768 / 1440 共 9 組核對:
  排序與類別 / 範本 input 左緣與相對 label 的 offset 均一致,
  modal body 無水平溢出, rank 仍 disabled.
- 卡片啟用 / 停用兩態各於 375 / 768 / 1440 核對所有付款 label,
  computed border-radius 皆 2px, 頁面無水平溢出.
- 已核對 375 / 768 / 1440 的 modal 與卡片截圖;
  baseline / 對齊 / 圓角量測 JSON 與 16 張 PNG 存於 session-185 QA 目錄.
- Fonts / conventions / tokens / partials lint 與 git diff --check exit 0,
  token mirror 93 raw 值, manifest 12 頁 / 3 standalone.
- 最後完整 browser smoke exit 0: 12 頁 / 164 項, SMS 10 項,
  涵蓋本輪排序對齊與付款 label 圓角修改後的頁面載入及既有行為.
- 本輪 self-tested, 待使用者驗收, 無新增 token / icon / 全域規則,
  tokens.md / start.md 不需修改.

## Session 184: 簡訊卡片使用 toggle 與生命週期解除錯誤連動 (2026-11-13)

### 本輪改動與重要決定

- 使用者指出使用 / 不使用 toggle 不受啟用 / 停用生命週期限制;
  先前將停用卡片的 toggle disabled 是 agent 誤加規則, 並非使用者要求.
- 先重寫 sms-text page spec, 移除錯誤的房型 disabled 類推;
  房型頁的全 disabled 規則只沿用於查看 modal, 不適用卡片 toggle.
- 移除 renderer 的 input.disabled = !card.enabled. hasUsageToggle 仍獨立
  決定有沒有 switch; 不綁定 automatic, 不擴增未提供 toggle 的卡片.
- 更正原 smoke 把停用卡片 toggle 當作 disabled 的錯誤斷言;
  改為測 false -> true -> false 與分類數量不變, 查看表單仍全 disabled.

### 驗證與下一步

- 獨立 read-only audit 核對 spec / renderer / smoke 三處錯誤連動;
  event handler 的 generic disabled guard 與 state used update 無生命週期條件.
- 修改前 Chrome baseline 重現停用卡片 toggle 被鎖住.
  修改後 trusted clicks 核對 false -> true -> false, usage 篩選即時更新,
  enabled / disabled counts 不變, 查看 modal controls 仍 disabled.
- 375 / 768 / 1440 的停用卡片截圖與 baseline / regression JSON 存於
  specs/qa-screenshots/session-184/.
- Fonts / conventions / tokens / partials lint, JS / smoke syntax 與
  git diff --check exit 0; token mirror 93, manifest 12 頁 / 3 standalone.
- 最後完整 browser smoke exit 0: 12 頁 / 164 項, SMS 10 項;
  保留原查看表單 disabled 檢查, 新增停用卡片使用切換回歸斷言.
- 本輪 self-tested, 待使用者驗收; 預覽 sms-text.html / landing.html.
- 無新增 token / icon / 全域規則, tokens.md / start.md 不需修改.

## Session 183: 簡訊主頁與 full modal 規則確認及實作 (2026-11-13)

### 使用者確認與來源

- 最新重讀主頁 FRAME `2780:106315` / 簡訊文本與發送 1111 v1.1 /
  1440 x 1160, 藍色按鈕與卡片 switch label 改為使用 / 不使用.
- 啟用 / 停用生命週期與查看行為參照房型頁: 即時分類與計數,
  停用卡片查看 modal 全 disabled, footer 單顆關閉.
- 一律使用 full modal INSTANCE `2797:111443` / 800 x 988,
  包含條件及付款方式; 舊無條件版 `2790:110652` 只作 reference.
- 使用者補充 toggle 是否出現依業務資料, 不與手動 / 自動綁定;
  enabled / used / automatic / hasUsageToggle 分開建模.
- 總部 / 分館權限與資料, 真實範本插值 / 通數計算由後端接線;
  現階段照示意畫面, 不再逐項詢問既有清除 / 儲存關閉慣例.
- 拖曳放開立即保存排序, modal 排序欄唯讀; 清除重置當前表單,
  儲存關閉. 使用者授權自適應 RWD.

### 本輪改動

- 新增 specs/pages/sms-text.md 與 components/sms-text-modal.md 的 current
  source / children checklist / contract / confirmed interactions / 差異 checkpoint.
- 沿用共用 shell / controller 與房型 lifecycle / view; 內容與視覺用最新 Figma.
  舊啟用 / 未啟用藍色文案不得作 current source.
- 新增 preview/sms-text.html, sms-text-modal partial, page / state / sort /
  modal 四個原生 JS modules 與兩個 scoped CSS domains;
  sidebar / page-tabs / manifest / app.css / smoke 依新頁接線.
- Enabled / usage 各自篩選, counts 由四筆 demo 即時算為 2 / 2;
  hasUsageToggle 獨立於 automatic, 不提供 toggle 的卡片不推定其使用狀態.
- 新增 / 修改以同一 full form 處理, 查看全 disabled + 單顆關閉;
  新增 rank 為下一個序號, 修改 / 查看使用目前排序, 一律不可編輯.
  清除只重置 draft, 儲存更新本頁示範資料後關閉.
- 排序放開立即保存 localStorage order; 鍵盤方向鍵預覽, Enter 保存,
  Escape / pointercancel / lost capture 或切換篩選取消未確認的排序.
  過濾後排序只調整可見項目的對應 slots, 保留其他項目相對順序.
- 修正獨立 review 發現的排序 transaction 殘留, 並以 trusted click / Tab
  重現 focusout 過早 render 導致第一次修改點擊失效 / 焦點遺失.
  最後以 relatedTarget 提前識別有自身取消 handler 的控制項,
  延至 action handler 取消, 保留 pressed target; 實際重測通過.
- 卡片自身容器寬 <=420px 時 summary top padding 改 Spacing/40,
  避免編號 ribbon 蓋住標題. 共用 shell 採房型頁的 12px 慣例.
- Full modal placeholder 使用當前 Figma Neutral/400; 藍色使用控制
  使用 MenuItem/Default, 不以近似 Action-Default 代替.
- Figma 證據存於 specs/qa-screenshots/session-183/,
  modal 讀取證據沿用 session-182 的 PNG / SVG / 完整 selection.

### 驗證與下一步

- 房型參考路徑與 disabled footer 由獨立探索核對; independent review 的
  sorting P2 已修正並經 code review 與實際 Chrome 重測.
- State 暫存 Node checks 覆蓋資料 clone 隔離, independent capability,
  filtered slots 排序, 儲存重載, 過期 / 重複 storage IDs 與新增紀錄.
- Chrome focused QA 核對預設 / used 篩選 / enabled counts 獨立,
  full New / Edit 的 7 顆付款與 16 顆語塊, 固定 1 / 52 展示,
  clear / save / discard, View 全 disabled 及 header / footer / backdrop / Escape.
- Root bounded Chrome probes 7 項通過: 排序中 trusted Edit 首次點擊,
  Tab 焦點保留, 真實 mouse / touch 拖曳, Escape 回復,
  touch 排序保存重載, 最後 8 個 viewport 的數值 bounds.
  後者為 360 / 375 / 600 / 768 / 900 / 1024 / 1200 / 1440,
  document scrollWidth == clientWidth, card bounds 均在 viewport 內.
- 375 / 768 / 1440 的啟用 / 停用列表與 New / Edit / View 上下捲動狀態
  共 29 張 PNG (含 Figma reference) 存於 session-183;
  手機標題留白修正後以 sms-enabled-final-375.png 為準.
  sms-focused-qa.json 明確區分 tester 的 pass / harness 未驗證項,
  root 最終數值與互動證據見 sms-root-interactions.json.
- 新增 JS / smoke syntax, 新檔 whitespace check, fonts / conventions /
  tokens / partials lint 與 git diff --check exit 0;
  token mirror 93 raw 值, manifest 12 頁 / 3 standalone.
- 最後完整 browser smoke exit 0: 12 頁 / 164 項, SMS 10 項.
  初次只有 CSS import expected list 漏登記兩個 domain; 已補正,
  保留完整檢查並重跑通過, 未放寬任何既有產品檢查.
- 本輪 self-tested, 待使用者驗收. 預覽 sms-text.html / landing.html.
- 正式 API / 總部與分館權限 / 業務類別 / 模板插值 / 通數計費仍交後端;
  當前 form 與 counter 僅沿用稿面示範, 不新增未確認業務規則.
- 無新增 token 或全域開發規則, tokens.md / start.md 不需新增內容.

## Session 182: 簡訊文本與發送主頁讀取及選單更名 (2026-11-13)

### 本輪改動與重要決定

- 使用者要求 figma-go 讀取簡訊頁, 並明確指定 menu 名稱由
  `簡訊文本與發送設定` 改為 `簡訊文本與發送`.
- 先同步檢查 FIT-developer/swift, git fetch origin 後 main 與 origin/main
  ahead / behind 為 0 / 0; 工作樹原為乾淨.
- 先更新 components/menu.md 的簡訊子選單名稱, 再修改共用 aside partial.
  子選單順序為簡訊文本與發送 / 排程發送, 目前仍為 inactive.
- 當前 Figma file swift / page components, selection 為
  `2780:106315` / 簡訊文本與發送 1111 v1.1 / 1440 x 1160.
  本輪為 Read + 待確認 checkpoint, 未建立簡訊 page spec 或產品頁實作.
- 完整解析 selection 459 個節點, 核對主頁 PNG 與 content SVG.
  root child `2780:106316` 為 1400 x 1136 FRAME;
  menu `2780:106319` 為 240 x 895.48 INSTANCE;
  topbar `2780:106322` 為 1140 x 36 FRAME;
  content `2786:110115` 為 1140 x 1052 FRAME.
- Content 五個 direct children 皆為 FRAME:
  `2786:110116` / Frame 427318959 / 1100 x 54, 通數說明與新增;
  `2786:110131` / Frame 622 / 1100 x 36, 類別;
  `2786:110134` / Frame 653 / 336 x 46, 啟停用及啟用狀態控制;
  `2786:110494` / Frame 427319036 / 320 x 32, 拖曳排序提示;
  `2786:110147` / Frame 427318960 / 1100 x 796, 四張卡片.
- 四張卡片為 FRAME, 各 544 x 392, 2 x 2 / gap 12:
  `2786:110149` / Frame 427319047 / 001 訂房成功(預訂單), 總部 + 自動,
  switch on, 修改 / 停用;
  `2786:110174` / Frame 427319054 / 002 繳款成功(已繳款單), 分館 + 自動,
  switch off, 查看 / 啟動;
  `2786:110365` / Frame 427319056 / 003 取消訂單(取消單), 分館 + 自動,
  switch off, 查看 / 啟動;
  `2786:110304` / Frame 427319055 / 004 自設文本(手動觸發), 分館,
  修改 / 停用, 畫面沒有自動 badge / 付款方式 / switch.
  各標題自定義樣本名稱(1) 至 (4), 內容均為我是簡訊內容.
- 001 至 003 皆列轉帳 / 傳真刷卡 / 票券 / 前台自付 / 信用交易 / 支票 / 訂金.
  上方展示剩餘通數 0, 總部所有分館適用 / 分館只適用該分館,
  類別全部, 啟用(2) / 停用(8), 另有啟用 / 未啟用控制.
  當前畫面顯示啟用分頁橙色底線與啟用藍底, 不推定為產品 default.
- 視覺觀察: content padding 20 / radius 12 / Neutral/75 底 / Neutral/200 框;
  card padding 16 / radius 12 / Neutral/0 底 / Neutral/300 框,
  卡片標題 24px / 600, 內文 16px / 400, 編號 20px / 400.
  PNG / SVG 確認通數說明只有左邊框, 分頁只有 active 底線;
  編號與操作按鈕漸層在 selection JSON 被省略, 以 SVG 為讀取證據.
  共用 topbar 的隱藏 badge 99 / 99+ 不當作額外可見內容.

### 驗證與下一步

- Fonts / conventions / tokens / partials lint 與 git diff --check exit 0;
  token mirror 93 raw 值, manifest 11 頁 / 3 standalone.
- 全站 Chrome smoke exit 0: 11 頁 / 154 項.
- Chrome 375 / 768 / 1440 核對簡訊管理展開後新文字可見, 字體 16px,
  inactive 狀態保留, 點擊分類可收合, 頁面水平溢出為 0.
  三張 PNG / probes 與 Figma selection JSON / PNG / SVG 存於
  specs/qa-screenshots/session-182/; mobile 量測在抽屜動畫結束後記錄.
- 內嵌 browser 的執行工具未提供, 依 skill troubleshooting 查找後,
  改以專案既有 Chrome CDP 流程執行驗證; 不改 smoke 產品檢查.
- localhost:8000/landing.html HTTP 200, 本輪選單更名 self-tested, 待驗收.
- 待使用者確認上方兩組啟用狀態的語意與 default, 類別選項,
  新增 / 修改 / 查看 / 啟動 / 停用 / switch 的行為及後續畫面,
  拖曳排序範圍與保存方式, mobile / tablet 版面.
  計數與卡片展示不推定為一致資料集, 先等使用者說明.
- 尚無既有簡訊主頁 spec / HTML 可交叉比對. 後續實作前需確認共用 shell
  沿用範圍; Figma sidebar 佔位字及 xxoo 不直接取代現行產品導航.
- 本輪不新增 token 或全域規則, tokens.md / start.md 不需修改.

## Session 181: 提交與推送會員資料頁及月曆展示調整 (2026-11-12)

### 本輪改動與重要決定

- 使用者明確要求 commit & push, 將 Session178 至 180 的讀取 contract,
  會員資料頁實作, 驗收更正與交接紀錄一併納入.
- 提交範圍包含新頁 HTML / domain CSS / state / demo / DOM modules,
  共用會員資料 modal partial 與原房間預定 / 訂單處理掛載點,
  navigation / page-tabs, sort-alt-2.svg, Libraries Danger token,
  lint / smoke, 元件規格 / page spec / token 與 icon registry / progress.
- 月曆維持 readonly 日期欄位與原稿 icon / layout, 不接原生 picker 或日期套件;
  共用月曆程式與正式會員 API / 業務查詢仍由後端接線.
- 本輪進入 commit/push flow, 實際 SHA 與遠端狀態以 git history 為準.

### 驗證與後續

- 提交前 git fetch origin 成功, main 與 origin/main ahead / behind 為 0 / 0.
- 沿用 Session180 最新完整 Chrome smoke exit 0: 11 頁 / 154 項,
  會員資料 15 項, 以及 375 / 768 / 1440 月曆展示截圖與操作驗證.
  本輪只更新提交授權與交接 metadata, 未再修改產品行為.
- 提交範圍經 staged diff 核對, 提交前執行四項 lint 與 whitespace check,
  pre-commit hook 再次檢查; 推送後核對工作樹與 origin/main 一致.
- tokens.md 已包含本次 Libraries 單筆來源; 無新增全域規則, start.md 不需修改.
- 後續依使用者指定進行下一個畫面, 未定義的後端流程維持原確認範圍.

## Session 180: 會員資料月曆保留 UI layout, 共用程式交後端 (2026-11-12)

### 本輪改動與重要決定

- 使用者回饋其餘內容大致核對一致, 月曆先不接日期程式,
  後續由後端搬入既有共用月曆樣式與程式碼.
- 先更新 member-data page spec, 再將兩個日期欄位改為 readonly text,
  保留原稿 YYYY-MM-DD 展示, calendar.svg, 欄位與快捷控制的 layout.
  移除 showPicker / input.click 的原生 picker handler 及不再使用的 indicator CSS.
- 先前確認的快捷日期填值, 日期類型單選, 假資料查詢及清除示範保留.
  其他 table 狀態與批次行為未變動; 不新增月曆彈層或日期套件.
- 無新增 token, icon 或全域開發規則, tokens.md / start.md 不需新增內容.

### 驗證與下一步

- Chrome 375 / 768 / 1440 實測兩個日期欄位皆為 readonly text / 高 36px,
  trusted click 兩個月曆圖示均未呼叫 picker, 日期與圖示排版保留.
  快捷今日填入 ISO 日期, 清除回 2026-02-27 / 20 筆結果, 頁面水平溢出為 0.
- 3 張 PNG 與 calendar-layout-probes.json 存於
  specs/qa-screenshots/session-180/, 已核對 mobile / tablet / desktop.
- JS syntax, fonts / conventions / tokens / partials lint 與 git diff --check exit 0,
  token mirror 93 個 raw 值, manifest 11 頁 / 3 standalone.
- 完整 browser smoke exit 0: 11 頁 / 154 項, 會員資料 15 項.
  member-data.html 與 landing.html 的 localhost:8000 預覽皆 HTTP 200.
- 本輪 self-tested, 下一步為本次月曆展示調整驗收;
  正式月曆接線與共用樣式由後端處理.

## Session 179: 會員資料主頁實作與共用會員資料彈窗接線 (2026-11-12)

### 本輪改動與重要決定

- 使用者明確授權開始實作, 並同意沿用既有管理頁的 shared shell / RWD /
  demo 預設, 分頁, 排序與清除慣例. 查詢依容器可用寬度堆疊,
  table 原生水平捲動; 頁殼採共用 12px padding / gap.
- 名稱旁入口依使用者指定, 沿用房間預定王大頭先生旁按鈕的會員資料內容.
  將會員資料與更換合約公司 HTML 抽為 member-data-modal.html,
  掛回房間預定 / 訂單處理並用於會員資料新頁, 保留 IDs 與所有原有 bindings.
- 新增會員資料原生 state / demo / DOM modules; demo 為 20 筆啟用,
  2 筆停用, 啟用資料含 18 筆未鎖定 / 2 筆已鎖定, 便於測跨分頁全選.
- 新增精確 sort-alt-2.svg 匯出及 registry; 單筆補同步 Libraries
  Background/Danger/Default -> --background-danger-default, 不替換近似色.
  Token mirror lint 納入 Background 路徑, 原有 Color 檢查保留.
- 新增獨立 member-data.html 與 domain CSS, 接至 page-tabs / sidebar,
  並登記 partial manifest 與 smoke. 不新增全域開發規則, start.md 維持原樣.
- 使用者驗看中更正顯示控制: 全部顯示 / 分頁為同一顆交換按鈕的兩種狀態,
  圖面是示意, 不得並排兩顆. 同步改為單一 DOM button, icon / 文案 /
  aria-pressed 隨模式更新; 交換後仍保留跨頁選取.

### 驗證與下一步

- State module 暫存 Node 檢查涵蓋跨頁選取, 混合鎖定, 鎖定後保留勾選與重算,
  查詢 / 篩選清除選取及 disabled mutation guard.
- Token lint 93 個 raw token 一致, 並測正確映射 / 缺值 / 錯值 / alias 四個 fixture.
- Fonts / conventions / tokens / partials lint 與 git diff --check exit 0;
  partial manifest 11 頁 / 3 standalone. 新增 JS modules syntax 檢查通過.
- Chrome 完整 smoke 最後串行執行 exit 0: 11 頁 / 154 項, 會員資料 15 項.
  覆蓋單顆顯示交換按鈕, enabled / locked 獨立狀態, disabled guards,
  跨頁選取與三態 checkbox, 混合鎖定重算, 查詢 / 篩選及共用 modal.
- 曾出現歷史 Session175 同樣的專案內容 switch / photo close 兩項間歇失敗.
  保留原檢查, 依相同前置操作作獨立量測: baseline 與 disabled track 皆為
  rgba(60, 60, 67, 0.3), checked 為 rgb(52, 199, 89), 未重現.
  最後全站串行檢查通過原有 23 項專案內容測試; 未修改該頁產品或測試邏輯.
- 360 / 375 / 600 / 768 / 900 / 1024 / 1200 / 1440 寬度頁面水平溢出皆為 0.
  量測 table 1974 寬, header 40 / row 110 高, 字體 16px, 日期按鈕 36 高 / 12px.
  375 / 768 / 1440 核對一般, 批次五態, 鎖定後保留選取, table 右側,
  footer 操作及父子 modal; 36 張 PNG 與量測 JSON 存於
  specs/qa-screenshots/session-179/.
- 實際 Chrome 操作驗證日期 picker, 今日 / 本週 / 本月 / 今年,
  帳號建立日查詢 1 筆與清除回 20 筆, keyboard focus-visible,
  刪除確認 cancel / accept, 分頁 5 筆時 CSV 仍輸出全部搜尋結果 20 筆.
- 搬移 modal 的每顆 header / footer 按鈕逐一檢查; 子層關閉後父層保持開啟,
  body scroll 保持鎖定. 父層小於 640px 沿用共用滿版規則,
  子層仍置中 320px. 修正 spec 舊 outside / Escape 關閉文字以符合 data-no-dismiss.
- 獨立 review 後補強 disabled 箭頭的 delegated click guard, switch keyboard
  focus ring, 狀態篩選 role=group / aria-pressed; 不使用未實作 keyboard 的 tablist.
- member-data.html 與 landing.html 的 localhost:8000 預覽均 HTTP 200.
  本輪 self-tested, 待使用者驗收. 下一步先收使用者對本頁的回饋.
- 正式後端會員讀寫 / 刪除與未定義業務查詢仍待串接;
  名稱入口依指定複用既有 demo modal, 尚未綁定各列真實會員資料.

## Session 178: 會員資料主頁與五張 table 狀態讀取及交互確認 (2026-11-12)

### 本輪改動與重要決定

- 新增 specs/pages/member-data.md, 保存主頁 2754:110881 與五張 table
  2772:110126 / 2770:106042 / 2770:106609 / 2772:108749 / 2772:109157
  的來源, 尺寸, children checklist, 桌面結構, 視覺與已確認交互.
  狀態為 reading-in-progress / partial-confirmed, 尚未開始產品實作.
- 日期類型按鈕預設全部不選, 單選; 查詢生日展示值改為 1 月 1 日,
  使用者明確要求這一處直接採口述更正, 不重讀.日期 / 查詢 / 清除 / 統計
  之後可用假資料做基本操作; 消費額與訂房金額的業務對應交給後端.
- 啟用 / 停用操作互換, 依即時資料分類與統計, 同其他管理頁.
  已鎖定會員的啟用 / 停用及刪除個資操作都 disabled, 含 Lucy 的啟用態.
- 批次模式加入 checkbox, 將逐列 toggle 換成狀態圖示;
  名稱旁入口, 啟用 / 停用與刪除個資全部 disabled.
  排序, 查詢, 篩選與分頁仍可操作.
- 全選跨分頁並包含所有搜尋結果; 換頁 / 排序保留勾選,
  重新查詢 / 切換篩選清空勾選, 維持批次模式.
- 底部鎖定 / 解鎖只改變已選項目的鎖定狀態, 操作後保留勾選及批次模式,
  兩個 N 依選取集合目前的未鎖定 / 已鎖定數即時更新.
  使用者否決操作後清空勾選的建議, 不得沿用該建議.
- 清除選取只取消勾選; 結束批次取消勾選並回一般模式.
  刪除個資未設計專用彈窗, 後續採 Yes / No 詢問, 正式刪除由後端實作.
- 會員資料頁浮動 AI 客服 icon 2754:110382 已棄用, 使用者要求不施作.
- Libraries 截圖確認刪除個資綁定 Background/Danger/Default;
  當前節點與 SVG 的渲染值為 #EC221F / 100%, 本地 token 尚缺.
  不需為單筆整批重匯, 不改成近似 #E12129, 實作前補同步這筆來源.

### 驗證與下一步

- 主頁讀取 JSON / PNG, table 五態另核對完整 PNG / SVG;
  主頁內嵌表與獨立一般表結構, 文字, styles 相同,
  後者補足主頁被裁切的右側欄位視覺.
- 已核對部分選取的表頭橫線, 全選藍底, 15 欄整列反灰,
  操作灰底及 0 / 2 / 3 / 20 筆展示下的鎖定 / 解鎖計數.
  全選 20 筆的範圍超過畫面 6 筆, 不將展示總數誤判為矛盾.
- 本輪只保存已確認讀取 contract 與交接, 沒有修改 HTML / CSS / JS,
  不將文件檢查當作產品 self-test. tokens.md / start.md 未修改.
- 文件檢查: conventions lint 與 whitespace diff exit 0;
  新增內容 ASCII 標點檢查通過, 6 個來源的 id / 名稱 / 尺寸與讀取資料一致,
  本地 Markdown 連結均可解析. 未執行產品 browser smoke.
- 下一步依使用者指定繼續讀取會員資料頁其他畫面.
  名稱旁入口目的, mobile / tablet, 查詢細節, 排序 / 分頁 / 下載及
  未定義狀態保留待續; 實作前須做舊規格 / HTML 差異 checkpoint.

## Session 177: 數量價格表日期區間端點 hover 底色修正 (2026-10-28)

### 本輪改動與原因

- 使用者以 iPhone 截圖回報區間第二次點選後端點底色變淡、白字難辨。
- Chrome 實際滑鼠反向選取 2/19 -> 2/4 重現相同畫面: 2/4 仍有藍框白字,
  底色卻被 Neutral/75 的 hover 規則覆蓋。原 hover specificity 為 0-3-0,
  高於 is-range-endpoint / is-range-middle / is-today 的 0-2-0。
- 先補 page spec: hover 維持既有日期狀態底色與文字對比; CSS 使用
  :where(:hover:not(:disabled)) 將 hover 規則降至 0-1-0, 讓狀態樣式優先。
- 沿用既有 Bootstrap/components/focus、Accent/light-green、Accent/pink、
  Neutral/75 與文字 token; 不新增設計值或全域規則, tokens.md / start.md 無變動。

### 驗證與下一步

- Chrome 在 375x812 模擬觸控、768x1024 / 1440x1000 實際滑鼠輸入驗證:
  正向 / 反向、相鄰日期、今天作端點、跨月與第三次點擊重設均通過;
  端點維持藍底白字, 中段 hover 維持綠底, 今日 hover 維持粉底。
- 三個尺寸 popover 均位於 viewport 內, 頁面無水平溢出。
- 11 張 PNG 存於 specs/qa-screenshots/session-177/, 含 1 張修正前重現圖;
  已視覺核對 mobile / tablet / desktop 與今日端點、跨月代表圖。
- fonts / conventions / tokens / partials lint 與 git diff --check exit 0;
  token mirror 92 個 raw 值一致, partial manifest 10 頁 / 3 standalone。
- 完整 browser smoke exit 0: 10 頁 / 139 項, 數量價格表 20 項通過。
- localhost:8000 的 quantity-price-table.html 與 landing.html 均 HTTP 200。
- 本輪 self-tested; 使用者後續明確要求 commit & push, 將 CSS 修正、page spec
  與本筆交接一併提交。本輪進入 commit/push flow, 實際 SHA 與遠端狀態以
  git history 為準。尚未在實機 iPhone Safari 驗證, 不將 Chrome QA 視為實機驗證。
