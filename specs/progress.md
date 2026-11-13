# Progress - 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。
> 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
> （歷史決策可能已被推翻，一律以本檔最新 session 為準）。
> 本檔超過 ~25 個 session 時，將最舊的 10 個搬進 archive。
> Session127 至 166 見 [歷史封存](progress-archive-s127-s166.md).

---

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
