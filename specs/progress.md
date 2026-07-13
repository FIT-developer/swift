# Progress - 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。
> 只保留最近約 15 個 session；更早的在 specs/progress-archive-*.md
> （歷史決策可能已被推翻，一律以本檔最新 session 為準）。
> 本檔超過 ~25 個 session 時，將最舊的 10 個搬進 archive。

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
