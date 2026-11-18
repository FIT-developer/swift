# Progress - 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。
> 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
> （歷史決策可能已被推翻，一律以本檔最新 session 為準）。
> 本檔超過 ~25 個 session 時，將最舊的 10 個搬進 archive。
> Session127 至 166 見 [歷史封存](progress-archive-s127-s166.md).
> Session167 至 176 見 [歷史封存](progress-archive-s167-s176.md).
Session177 至 186 見 [歷史封存](progress-archive-s177-s186.md).

---

## Session 204: 提交與推送共用分頁及 OTA 選單移除 (2026-11-18)

### 本輪改動與重要決定

- 使用者明確回覆 commit & push, 驗收 Session203 的五處置中圓形分頁
  與產品設定 OTA 選單移除, 本輪提交與推送至 main.
- 提交包含共用 pagination.css、app.css import、三個domain舊分頁CSS移除、
  加購商品render、會員主頁、兩個共用modal partial與aside.
- 一併提交 pagination /menu /member-data-modal /bulletin-administer
  components、三份頁面規格、html-conventions與start.md的lint登錄,
  以及lint-partials /smoke regression檢查與本次完整交接紀錄.
- 沒有新增或改動token, 沒有移除Dashboard的OTA通路統計.
  原本靜態的modal分頁仍維持後端交付邊界.

### 驗證與提交

- 沿用最終產品版本的22 pages /313 checks Chrome smoke、
  20 cases /117 dedicated checks及30張before /after截圖;
  本輪僅補驗收 /提交紀錄, 未在測試後更動產品行為.
- 提交前核對tracked /untracked與staged清單, 四項lint及diffcheck,
  保留本機8000驗收服務. QA原始截圖依repo規則留在本機.
- 本輪進入commit/push flow, 實際SHA與遠端同步狀態以git history及
  推送後status /ahead-behind核對為準.

## Session 203: 全站表格分頁統一與移除 OTA 選單 (2026-11-18)

### 使用者指示與本輪改動

- 使用者要求全部顯示 /分頁的底部控制統一參考加購商品:
  左右置中、圓形設計, 不允許各頁自行定義; 同時刪除產品設定的ota選單.
- 全域盤點五處table pagers:加購商品產品 /類別、會員資料主表、
  會員彈窗訂房紀錄、旅宿e管家系統公告. Top page tabs、wizard步驟與
  carousel為不同用途的控制, 不屬於table pagination.
- 先以既有加購商品HTML/CSS及Chrome375 /1440截圖核對reference,
  確認36px圓形、置中、gap8 /padding-top12、淡藍左右箭頭及白底頁碼.
- 先重寫components/pagination.md current contract, 再建立共用
  pagination.css並由app.css匯入. 五處都使用table-pagination /
  table-pagination-nav /table-pagination-current, 保留既有data事件hooks.
- 刪除purchase-addon.css /member-data.css /modals.css內的獨立分頁樣式,
  會員主表不再靠右或用34px方角; 兩個舊彈窗不再列出相連的七格頁碼.
  統一為上一頁 /當前頁 /下一頁, left.svg /right.svg皆20px.
- 含筆數的footer採三欄grid, pager不受左側筆數影響而偏離中心;
  footer可用寬度<=260時以container query把筆數與pager分兩行,
  維持置中與8px行距. CSS只query子元素, 不對container本身套用自身query.
- 保留每頁5筆、全部顯示、篩選、排序、選取與首末頁disabled狀態.
  原本靜態的公告 /訂房紀錄仍保留當前頁2與共61筆示意, 真實切頁由後端接手,
  不捏造新資料或API.
- 共用aside刪除OTA入口, 產品設定只留專案內容 /數量價格表.
  Dashboard統計的OTA通路資料不屬選單移除範圍, 保留原有內容.
- 同步menu /pagination /member-data-modal /bulletin-administer components,
  purchase-addon /member-data /project-content pages與html-conventions.
  start.md的lint checklist登錄共用分頁契約; tokens沒有新增或改值.

### 回溯 audit 與機器檢查

- 全部五處已回溯套用共用class與CSS. lint-partials新增掃描所有HTML/JS:
  舊hooks必須搭配共用class, pager必須為有aria-label的nav,
  禁止在控制上加入自訂對齊 /尺寸 /色彩等utility,
  並禁止頁面domain CSS重新定義pager或保留舊方形active樣式.
- Regression probes確認缺共用class、justify-end與div冒充nav皆會被攔截.
- Smoke新增共用computed-style檢查、五處跨四寬度的檢查,
  以及各authenticated page的產品設定精確兩個選單項目檢查.

### 驗證與交接

- 四項lint /JS syntax /git diff --check exit0, token mirror96個raw hex一致,
  partial manifest22 pages /3 standalone.
- Root全站Chrome smoke:22 pages /313 checks pass.
  Worker曾在同時編輯中的版本遇到project switch disabled與photo close兩個
  assertions失敗, root於產品檔案固定後的完整run全部通過,
  未改動project產品檔案或略過檢查, 不將首次失敗宣稱為已證明的舊問題.
- 專用Chrome QA:五處x四寬度共20 cases,117 /117 checks pass,
  320 /375 /768 /1440, 包含圓形幾何 /置中 /色彩 /無水平溢出 /筆數不重疊,
  OTA選單移除、首末頁、原生Enter下一頁、實際pointer至最後頁與全部顯示還原.
- QA保留4張before與26張after /last-page截圖, 以及測量JSON,
  位於本機session-203; modal截圖等待全站200ms淡入結束才擷取.
- Astra獨立review找到container query自我套用不生效, root將row-gap放回
  base grid並移除無效self selector; 複核沒有剩餘可操作問題.
- 本輪待使用者驗收, 沒有收到本輪commit/push指示.
  本機8000預覽服務保留, 主要驗收頁為purchase-addon /member-data /landing.

## Session 202: 提交與推送四個 Status 狀態頁 (2026-11-18)

### 本輪改動與重要決定

- 使用者明確回覆 commit & push, 驗收四個獨立 status 頁面與
  Session201 的縮放置中、淡藍 hover、原始素材及兩個漸層 tokens.
- 提交包含 status1.html 至 status4.html、共用 partial / JS / CSS、
  四個原始 illustration assets、app.css入口、base.css tokens與字級、
  partial manifest / browser smoke、component / page specs與tokens文件.
- 一併保存 Session200 的四頁 Figma 讀取與確認紀錄及 Session201
  實作 / QA 交接, 不只提交 HTML 或單獨留下本機規格.
- 後端仍決定顯示哪頁並填入前三頁的返回href; 本輪沒有登入判斷、
  IP偵測、自動分流或HTTP狀態推斷. 詳細交付見 specs/pages/status.md.
- 最新紀錄新增後超過25 sessions, 按既有規則將最舊10筆
  Session177至186原文搬到progress-archive-s177-s186.md,
  不刪除任何spec檔案, 保留最近16筆紀錄與封存連結.

### 驗證與提交

- 沿用最終產品版本的四項lint、22 pages /291 checks Chrome smoke、
  118 /118 dedicated QA checks與38張截圖; 本輪僅更新驗收及交接文件,
  沒有在驗證後再改產品行為.
- 提交前核對所有tracked / untracked變更與staged檔案清單,
  由pre-commit再次執行必要lint. QA原始讀取 /截圖依repo規則留在本機.
- 本輪進入commit/push flow, 實際SHA與遠端同步狀態以git history及
  推送後的status / ahead-behind核對為準. 未變更start.md開發規則.

## Session 201: Status 四頁實作與 Variables 增量 (2026-11-18)

### 本輪改動與使用者確認

- 使用者回覆 Session200 四組問題: 前三頁返回連結由後端填入,
  hover 用淡藍色; mobile 沿用原排列縮放置中;
  status4 上下左右置中, 使用者也同步修正了原稿.
- 使用者提供兩個新 Figma Variables 的截圖並明確不要重新讀取:
  Color/Surface/Linger-start #D980ED / Color/Surface/Linger-End #376AE1.
  已直接登錄 tokens.md / base.css strict mirror, 原始 export JSON
  不偽造 variableId 或其他截圖沒有提供的 metadata.
- 新增字級 --font-size-3xl32px, 來源為四頁已讀取的 heading.
- 先寫 components/status-page.md / specs/pages/status.md,
  再建立 status1.html 至 status4.html, 共用 status-return partial,
  status.js 與 status.css, 由 app.css 匯入; 不掛 authenticated shell.
- 四頁依序為網頁不存在 / 拒絕非台灣 IP / 有些地方出錯了 /
  網頁維護中, 後端自行決定顯示哪一頁, 沒有 IP 偵測或自動分流.
- 前三頁返回為原生 anchor, 預設 href=# 只發送 bubbling status:return
  detail {page,state}, 後端填真實 href 後採正常瀏覽器跳轉.
  Hover 與鍵盤 focus 背景採既有 Color/Bootstrap/focus-background,
  保持原本 Text/800 字與 icon 色, 不沿用 login 的深色 hover.
- 素材沿用 Session200 SVG, 其中 status1 由已保存的 section SVG
  抽出原始兩個 artwork 子樹與引用 defs, 不含 heading 或 return.
  IP / maintenance illustration 與已保存的原始 SVG byte-identical.
  冰淇淋 SVG 在瀏覽器會暴露原稿 PNG 中被遮罩的深褐色線條,
  視覺 QA 改用已保存的原始 PNG, byte-identical, 保留339 x 336 canvas
  與338.41 x 335.58顯示比例, 不修改插圖配色.
  IP 插圖保留 slot 上方72.55px與右側55.8px可見溢出,
  窄寬時連同溢出一起等比縮小, 不裁風箏.
- 原稿未重新讀取. 舊 status4 位移由本次明確置中指示覆蓋.

### 驗證與交接

- fonts / conventions / tokens lint 與 git diff --check exit0,
  strict color mirror96個 raw hex tokens 一致.
- Luna explorer 首次遇服務額度錯誤, 使用者要求繼續後同一 agent
  重試成功並交回 token / QA 路徑, 後續負責 manifest/smoke整合.
  Manifest22 pages /3 standalone, 新增39個 status smoke checks.
- 獨立 Astra scoped review 與 PNG 替換後複核均未找到可操作問題.
- 內建 Browser 的執行工具未提供, 已依 skill discovery 確認,
  使用專案原生 Chrome CDP 跑本機截圖與互動驗證.
- Chrome QA 第一輪 reduced-motion assertion 要求0s,
  實際全站 base.css 強制0.01ms, 已改為驗證無可感動畫的時長門檻;
  同時等待 Chrome 關閉後再清理自己的暫存目錄, 不修改產品迴避測試.
- 替換 PNG 後重新執行專用 Chrome QA:118 /118 checks pass,
  四頁各8個viewport共32 cases, 320x640 /360x780 /375x812 /
  768x1024 /1024x900 /1440x957 /360x320 /1440x480.
  包含字色 / 漸層 / source幾何 / 圖片完整與比例 / 置中 / 無水平溢出,
  短畫面可捲至末端, 三頁各3種寬度的真實pointer hover/leave與Tab/Enter,
  idempotent init、reduced motion、真實href原生跳轉, runtime errors0.
- 保存38張default / hover / keyboard focus PNG與測試JSON於本機
  session-201. Headings仍為HTML, 原始插圖未嵌入標題或操作文字.
- Root review 修正 smoke probe:真實href在最後bubbling listener先觀測
  defaultPrevented再取消導航, 避免capture提前cancel而失去驗證意義;
  pointer hover/leave等待150ms transition結束後再驗證.
- 全站 Chrome smoke:22 pages /291 checks pass, 包含39個status檢查.
  四項lint / JS parse / diffcheck exit0. 未變更 start.md 開發規則;
  新增 token /字級均同步於 tokens.md及base.css.
- 本機8000 preview server保留供驗收, landing與status1至4皆HTTP200.
  Status 本輪尚未收到 commit/push 指示.

## Session 200: Status 四個獨立狀態頁讀取, 待共用規則確認 (2026-11-18)

### 任務與交付範圍

- Login 已依使用者授權提交推送至 main, commit b40e21f,
  推送後工作樹乾淨且 HEAD / origin/main ahead / behind 0 / 0.
- 使用者接著要讀數個狀態頁, 未來命名 status1.html 至 statusN.html;
  由後端決定套用哪個給使用者, 不建立前端判斷 / 路由切換邏輯.
  此輪 figma-go 只讀取當前 selection 與記錄, 未寫 status spec 或實作.

### 第一頁 current source / children checklist

- swift / display `1:3`, selection `328:15233` Status page - page not
  found, SECTION 1440 x 957, read 2026-11-18. 暫列 status1.
- Root child 1: `328:14855` Error page, INSTANCE 622 x 762,
  x=409 / y=98, mainComponent `351:19015`, type=not found.
  Python 遍歷 13 個唯一節點, JSON / PNG / SVG 已核對.
- Child 1 / heading: `I328:14855;351:19016` Texts, INSTANCE 160 x 44,
  x=231 / y=159.85. Text `I328:14855;351:19016;5:81` 為
  「網頁不存在」, Noto Sans Display SemiBold 600 / 32px.
- Child 2 / illustration: `I328:14855;351:19017` Group 7,
  GROUP 360.55 x 371.3, x=130.73 / y=203.85, 內含 rectangle
  Brown Illustrated Cat Desktop Wallpaper (1) 1 與 vector
  Business Presentation 1. 渲染為地球 / 坐著使用電腦的人物插圖.
  圖片透明留白屬原始 asset bounds, 不把看見的空白另猜成 CSS gap.
- Child 3 / return: `I328:14855;351:19020` Title, INSTANCE 72 x 27,
  x=275 / y=575.15. 24px icons/return + Spacing/8 + 「返回」,
  20px / 600 / Text/800. 現有 return.svg 為 16px viewBox,
  放大至24的路徑與當前 Figma geometry 對應, 可沿用 mask 控色.
- 白底 Color/Neutral/0; Error page 上下 padding 60,
  內容整體置中, title / illustration / return 的 bounds 緊接排列;
  無獨立卡片底色、邊框或圓角. 尚不外推手機與短視窗行為.

### 第二頁 current source / children checklist

- 本次 selection `328:15234` Status page - IP error, SECTION
  1440 x 957, swift / display `1:3`, 暫列 status2.
- Root child 1: `328:15032` Error page, INSTANCE 697 x 890,
  x=371.5 / y=34; mainComponent `328:14886`, type=link error.
  以當前頁面文字「拒絕非台灣 IP」作為狀態語意, 不從 variant 名
  link error 改寫成其他錯誤. Python 遍歷 69 個唯一節點.
- Child 1: `I328:15032;353:21775` Frame 90, FRAME 199 x 70,
  x=249 / y=239.99. 標題「拒絕非台灣 IP」32px / 600 / 44px bounds;
  下方 Spacing/4 間距與「請聯繫系統商尋求協助」16px / 400 /
  Text/800 / 22px bounds, 水平置中.
- Child 2: `I328:15032;328:14888` Frame 88, FRAME 229.2 x 257.01,
  x=233.9 / y=337.99. 原始向量插圖為人物放風箏, Person / Kite
  group 皆讀取. Kite 有負 y 子節點, 可見內容延伸超過 frame bounds,
  不可僅據 JSON 的 229.2 x 257.01 裁切或推定整幅插圖尺寸.
  單獨 PNG / SVG 實際 canvas 為285 x 330, 沒有 clipPath,
  已核對保留當前圖案的可見溢出.
- Child 3: `I328:15032;328:14944` Title, INSTANCE 72 x 27,
  x=312.5 / y=623.01; 24px return icon + Spacing/8 + 「返回」,
  20px / 600 / Text/800. Main instance padding 0, header 至插圖
  frame 與插圖 frame 至 return 的 bounds gap 皆約28px,
  對應現有 Spacing/28 / --spacing-28; 綁定來源仍於最終 contract 核對.
- 白底 / 無獨立卡片框線. 標題 SVG 同樣為水平 #D980ED -> #376AE1
  漸層, UI token 待補項與第一頁共用. 插圖本身的原始 asset 配色
  保留來源, 不把插圖的每一個顏色提升成產品 UI token.
- Dev annotations 與返回 Title 的 prototype reactions 皆空;
  返回目的地、hover、mobile RWD 仍累積待確認. 此頁純展示非台灣
  IP 被拒絕狀態, 真實 IP 判斷與選用哪頁均由後端負責.
- JSON / PNG / SVG 為本機 session-200/status2-current-source*,
  單獨插圖為 status2-illustration-source*. 仍僅讀圖與記錄,
  沒有 status spec / HTML / CSS / JS 實作.

### 第三頁 current source / children checklist

- 使用者說最後兩頁, 本次同時選取兩個 section. 第三頁 `328:15235`
  Status page - other errors, SECTION 1440 x 957, swift / display
  `1:3`, read 2026-11-18, 暫列 status3.
- Root child 1: `328:15109` Error page, INSTANCE 551 x 706,
  x=444.5 / y=126, mainComponent `328:14954`, type=other errors.
  Python 完整遍歷61個唯一節點, PNG / SVG / JSON 交叉核對.
- Child 1: `I328:15109;328:14955` Artwork, GROUP 338.41 x 335.58,
  x=106.3 / y=121.71, 為掉落融化冰淇淋與飛蟲軌跡插圖.
  Ice Cream / Fly 及全部子節點皆遍歷; 原始 asset 的透明留白保留,
  不把 group 內 transformed bounds 直接相加推論可見尺寸.
  單獨 PNG / SVG canvas 339 x 336, 已檢視原始插圖.
- Child 2: `I328:15109;328:15017` Texts, INSTANCE 251 x 44,
  x=150 / y=485.29. 文案為 `有些地方出錯了\u2026`, 末尾 U+2026
  是原始 Figma 文案, 實作不可擅改成三個句點.
  Noto Sans Display SemiBold / 32px / 600, 水平漸層同前兩頁.
- Child 3: `I328:15109;328:15007` Title, INSTANCE 72 x 27,
  x=239.5 / y=557.29. 24px return icon + Spacing/8 + 返回,
  20px / 600 / Text/800. Artwork 至 heading 與 heading 至 return
  bounds gap 皆28px, 對應現有 Spacing/28.
- 內容順序特別為插圖 -> 標題 -> 返回, 不套用前兩頁的標題在上版型.
  白底, main instance padding0, 無獨立卡片 / 邊框 / 圓角.
  Section 內 instance 水平正中, 垂直中心比 section 中心多0.5px.
  Annotations 與返回 Title 的 prototype reactions 均空.

### 第四頁 current source / children checklist

- Selection `351:20754` Status page - maintenance, SECTION
  1440 x 957, swift / display `1:3`, read 2026-11-18, 暫列 status4.
- Root child 1: `351:20755` Error page, INSTANCE 622 x 762,
  x=444.5 / y=126, mainComponent `328:14867`, type=maintenance.
  Python 完整遍歷867個唯一節點, 其中856個 VECTOR,
  並非僅讀 root 或截斷的 MCP 摘要.
- Child 1: `I351:20755;328:14868` Texts, INSTANCE 160 x 44,
  x=231 / y=180.37. 文案網頁維護中, Noto Sans Display SemiBold /
  32px / 600, 水平漸層同其餘三頁.
- Child 2: `I351:20755;351:19027` maintenance, GROUP
  452.64 x 337.27, x=84.68 / y=244.37. 原始插圖包含施工人員、
  網頁畫面、工具、交通錐與背景. 全部子節點皆遍歷,
  單獨 PNG / SVG canvas 453 x 338, 已核對完整保留原始圖案.
- 只有標題 -> 插圖, 沒有返回或其他操作按鈕, PNG 與 JSON 一致.
  Heading 至 illustration bounds gap20px, 對應 Spacing/20;
  main instance 上下 padding60 / 左右0. 白底, 無卡片 / 邊框 / 圓角.
- 當前 instance 中心相對 section 中心偏右35.5px / 偏下28.5px.
  前三頁約置中, 此處需使用者確認是否統一置中, 不自行把位移當產品規則.
  Root dev annotations 為空.
- 兩頁原始 JSON / PNG / SVG 位於本機
  session-200/status3-current-source* / status4-current-source*,
  單獨插圖為 status3-illustration-source* / status4-illustration-source*.

### 最終 checkpoint / 待使用者確認

- 依讀取順序暫列四個獨立頁:
  status1 網頁不存在 / status2 拒絕非台灣 IP /
  status3 有些地方出錯了 / status4 網頁維護中.
  後端決定顯示哪頁, 不新增前端 IP 偵測、HTTP 狀態推斷、登入判斷或自動分流.
- 舊 spec / HTML cross-check: 目前沒有 status 頁或 Error page component
  spec / HTML. 可沿用既有 neutral / text / spacing tokens、Title 的
  default icon + text 結構與 return.svg; 不沿用舊 Title spec 的示例色值
  或 pill variants. 頁面內容順序、插圖、漸層、32px標題與layout均以
  本輪四個 Figma current source 為準, 沒有既有 status 頁要覆蓋.

- Heading fills 在 JSON 缺失, 透過當前 override 與 SVG defs 確認為
  左至右線性漸層 #D980ED -> #376AE1, alpha 1. 兩個 stop 在現行
  tokens.md 無對應, override boundVariables 為空;
  實作前需依 Figma Variables 取得正式 tokens, 不用近似色替換.
- 四頁標題的 override gradientStops.boundVariables 均空,
  SVG 確認同一組水平漸層, 插圖自身配色則留在原始 asset.
  現有字級 scale 最高24, 32px需在實作前依來源補上對應字級.
- 前三頁返回的目的地 / 點擊行為與 hover 未定義;
  手機版 / 短視窗版型與 status4 的中心位移需使用者確認.
  不自行決定 history back / login / landing fallback 或 HTTP 狀態碼.
- 原始 JSON / PNG / SVG 位於本機 session-200/status1-current-source*
  至 status4-current-source*. 四頁 section 匯出都帶40px外圍效果留白,
  SVG canvas1520 x 1037, 不能把它當成1440 x 957頁面layout尺寸.
  Current status spec 尚無既有版本; 可沿用 tokens / Title 文字與
  return icon 基礎, 頁面 layout / gradient 以本輪來源與後續確認為準.
- 此輪僅更新交接, conventions lint / git diff --check 驗證,
  無產品檔案、token 或全域開發規則變更.

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
