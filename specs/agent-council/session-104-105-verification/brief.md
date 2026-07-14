# Brief: session-104-105-verification

## 背景

使用者要求（原文）：「ai-chat 互相驗證 session 104 ~ 105 是不是有落實完成」。

Session 104 與 105（2026-07-13, 同日）由 Claude CLI 完成並自評
self-tested，交接寫在 `specs/progress.md` 最上方兩段。對應 commits：

- `bddbd3f` Restore multi-tab page chips with sessionStorage state
  （Session 104）
- `79b6ab2` Add system-basic page; remove switch-account, AI float,
  POS entrance（Session 105 主體）
- `5f24b3a` Wire stepper icon clicks; add hidden-native-control convention
  （Session 105 追加）

本題是 audit / cross-verification，不是架構取捨：由 Codex 與 Claude
各自獨立比對「交接宣稱」vs「repo 實際狀態」，互相補漏。前例：
Session 103 曾對 Session 99-102 的產出做同型獨立驗證。

**Session 104 宣稱清單**（驗證對象）：

1. `preview/js/page-tabs.js`：sessionStorage（key `swift-open-page-tabs`）
   多 tab 共存 + 關閉行為（關當前頁跳最近剩餘 tab、全關回 landing、
   landing 只 render 不自成 tab）
2. landing / room-booking / order-processing 三頁接線 `initPageTabs()`，
   並移除各頁原本的單顆靜態 chip 程式碼
3. `shell.css` 新增 `.page-tab-link`
4. `scripts/lint-partials.py` MANIFEST 三頁 modules 補 `./js/page-tabs.js`
5. `specs/page-architecture.md`：「導航（current）」改寫為多 tab 規格；
   2026-07-04「chips 降級為導航列」歷史決策段加註已推翻（原文不改寫）

**Session 105 宣稱清單**（驗證對象）：

1. 新頁：`specs/pages/system-basic.md` + `preview/system-basic.html` +
   `preview/assets/css/system-basic.css` + `preview/js/system-basic.js`；
   欄數 <640 單欄 / 640-767 兩欄 / >=768 desktop
2. tokens：base.css + tokens.md 同步新增 5 個 `--color-template-*`
   （green / text / text-muted / divider / thumb-tint）
3. 全域移除（共用 partial，四頁生效）：
   - 快速切換帳號：aside switch icon、topbar `compactSwitchBtn`、
     session-modals 帳號切換 modal、page-shell.js 接線；確定登出保留
   - aside 客服區僅留 Email（LINE QR / 電話 / 傳真 / 北西東 / 營業時間移除）
   - AI bot float 按鈕（room-booking-modals 區塊 + shell.css
     `.float-service-frame`；ai.svg 與 tokens 保留未用）
   - aside POS 入口（markup + shell.css `.pos-entrance-*` /
     `.icon-mask-pos` / `.icon-mask-attached-link`）
4. 決策記錄收斂：components/float-icons-ai.md / customers-service.md /
   account.md / menu.md 檔頭標記；page-architecture.md 導航段 + 目標結構
5. 登記：page-tabs.js TAB_PAGES 加 system-basic；aside「系統設定 >
   系統基本」真實連結；lint-partials.py MANIFEST 登記 system-basic.html
6. smoke-test.mjs：4 頁、app.css expected 清單含 system-basic.css、
   移除 switch-account modal 檢查
7. lint-conventions.py：base.css 自訂屬性定義行豁免 hex/rgba
8. 當日網路訂房：toggle off -> input disabled + 灰底；input flex-1 填滿；
   stepper icon 可點（上半 +1 / 下半 -1、clamp 1~24、disabled 不動作）
9. `specs/html-conventions.md` 新增「藏原生控件必接替代行為（強制）」段

## 問題

Session 104-105 交接宣稱的上述各項，是否全部真實落實於 repo 現況
（code / spec / lint / manifest / 決策記錄一致），有無遺漏、殘留引用、
或宣稱與實際不符之處？

## 候選方案

本題為 audit，無方案取捨。驗證方法建議（兩個 agent 各自獨立執行，
不可只讀 progress.md 就採信）：

- grep 殘留引用：`modalSwitchBackdrop` / `compactSwitchBtn` / `switch.svg`
  / `float-service-frame` / `ai.svg` / `pos-entrance` / `icon-mask-pos`
  / `service_line` 等應只剩決策記錄文字或未用資產
- 實際重跑 4 個 lint（fonts / conventions / partials / tokens）與
  `node scripts/smoke-test.mjs`
- 對照 spec 宣稱與 html 實作（token 引用、欄數斷點、stepper 行為 JS）
- 檢查 TAB_PAGES / MANIFEST / app.css import / aside 連結四處登記一致
- git show 三個 commit 的實際 diff 與交接描述比對

## 禁止事項

- 不可在本輪修改任何實作或 spec 權威檔案；只做驗證與回報（發現問題列
  清單，修正另開任務）
- 不可把 progress.md 交接或本 brief 的宣稱清單當作已證實；每一項都要
  獨立以 repo 現況（grep / 執行 lint / 讀檔）核對
- 不可回溯改寫舊 session 交接（progress.md 規則）
- 不可把 consensus.md 當權威來源；驗證結論最終收斂回 specs/progress.md

## 需要裁決的問題

1. Session 104 宣稱 1-5 各項：落實 / 未落實 / 部分落實（附證據）？
2. Session 105 宣稱 1-9 各項：落實 / 未落實 / 部分落實（附證據）？
3. 是否發現交接未提及的回歸或殘留（例如共用 partial 改動對 landing /
   order-processing / room-booking 的意外影響）？
4. 若有缺漏，哪些需要開修正任務、優先序為何？
