# Progress — 當前進度與決策紀錄

> 每次交接時更新此檔。格式：最新紀錄在最上方。

---

## Session 54 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 完成 order summary `未付款` modal 內 `轉正式單` accordion 的最新存檔：
  - layout 以 Figma latest selection `Accordion 10` 為來源：外層淡藍 `bg-surface-hover`、內層 white card、header 無灰底與 underline。
  - chip 順序為 `轉帳`, `傳真刷卡`, `票券`, `前台自付`, `信用交易`, `支票`, `訂金`, `紅利`。
  - default selected chip 已確認並修回第一個 `轉帳`；`resetOrderSummaryModal()` 重設為 `setOrderSummaryTransferPay("transfer")`。
  - `票券`只是用來讀取特規 layout 的 active selection，不是 default state；票券內容保留為兩個 input + inline `檢查` + `備註` single-line input。
- 補強 workflow 長期規則：
  - `start.md` 已新增 `figma-go` 後必須整理 implementation contract。
  - 實作前必須做「舊 HTML/spec vs Figma contract」差異 checkpoint。
  - Figma selection 的 active visual state 不可自動推論為 default；若可能只是為了讀取 variant/layout，必須先問使用者。
- `components/modal.md` 已同步記錄 `轉正式單` 的 layout、default chip、票券特規與最後一個 chip `紅利`。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 若繼續檢查此 modal，先用 browser / screenshot 做 desktop 視覺 QA，尤其是 `轉正式單` accordion 在 `未付款` modal 中的寬度、chip row、票券 two-input row 與底部 action 對齊。
- 後續任何 `figma-go` 實作都要先輸出 contract + 舊 HTML/spec 差異 checkpoint，再進入寫檔。

**重要決定**:
- 舊 HTML/spec 只能當既有實作參考；已確認 Figma contract 與使用者確認事項才是當輪實作來源。
- 目前 `轉正式單` default chip 是 `轉帳`，不可再因 Figma selection 顯示票券 active 而改成票券。

## Session 53 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 重新讀取 Figma 目前 selection `Accordion 10`（轉正式單 accordion），並以使用者確認後的 selection 作為來源修正 order summary `轉正式單` section：
  - 外層 section 改為 `bg-surface-hover` 淡藍底、`border-border-disabled`、`rounded-xl`、`p-5`。
  - header 移除灰底與 underline，改為 Figma 的 20px / 27px 文字列與右側 down icon。
  - 內層 content 改為 white card、`rounded-xl`、`p-5`。
  - chip gap 改為 16px；chip 順序確認為 `轉帳`, `傳真刷卡`, `票券`, `前台自付`, `信用交易`, `支票`, `訂金`, `紅利`。
  - default active chip 維持第一個 `轉帳`，`resetOrderSummaryModal()` 重設為 `transfer`。
  - `票券` 欄位改為 `支付金額` / `票券號碼` two inputs + inline `檢查` / `備註` single-line input。
- 已更新 `components/modal.md` 記錄 latest selection 規則，並註明最後一個 chip 是 `紅利`，Figma 先前 duplicate `傳真刷卡` 是誤植。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**重要決定**:
- 本輪以 2026-05-06 latest Figma selection `Accordion 10` 為準讀取 `轉正式單` layout；但 selection active 在 `票券` 是為了檢查票券特規 layout，不代表 default state。`轉正式單` default selected chip 仍為第一個 `轉帳`。
- 本輪發現風險：讀過 Figma 整頁後，如果沒有先固化 implementation contract，後續實作容易混用舊 HTML/spec 與最新 Figma selection，造成差異沒有被指出。已補入 `start.md` 長期規則：`figma-go` 後必須先列 contract，實作前做舊 HTML/spec vs Figma contract 差異 checkpoint；舊 HTML 只能當參考，不能覆蓋已確認的 Figma contract。
- 重要補充：Figma selection 的 currently selected / active visual state 不可自動推論為 default。若 active state 只是為了讀取某個 variant 或特規 layout，必須先列為疑點詢問使用者。

## Session 52 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 修正 order summary `轉正式單` section：
  - 從 static section title 改為 functional accordion button。
  - 加入 `aria-expanded="true"` / `aria-controls="orderSummaryTransferContent"`。
  - content 使用 `data-order-summary-accordion-content`，沿用既有 `setOrderSummaryAccordion()`。
  - icon 使用 `down.svg` / `up.svg`，開啟 order summary modal 時會 reset expanded。
- 修正 `轉正式單` 底部 action button 文字垂直偏下：
  - `清除` / `改為正式單` 都改為 `inline-flex h-auto min-h-[34px] items-center justify-center`。
- 已更新 `components/modal.md` 記錄 `轉正式單` 是 accordion section。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- 靜態檢查：`轉正式單` header 是 `button`，含 `aria-controls="orderSummaryTransferContent"` / `data-order-summary-accordion-toggle`；底部 `清除` / `改為正式單` 都含 `inline-flex h-auto min-h-[34px] items-center justify-center`。

**重要決定**:
- order summary 內凡有 down/up icon 的 section 都必須是真正 accordion；`轉正式單` 與 `訂房與入住人資訊` 使用同一套 accordion handler。

## Session 51 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 修正 order summary `轉正式單` section 初始 active chip：
  - 初始 selected 從 `票券` 改回第一個 chip `轉帳`。
  - 初始顯示 `轉帳` 欄位組：支付金額 / 收款帳號 / 客支付帳號。
  - `resetOrderSummaryModal()` 改為重設 `setOrderSummaryTransferPay("transfer")`。
  - `票券` 仍保留特規：點選後才顯示支付金額 / 票券號碼 / 備註 + inline `檢查`。
- 已更新 `components/modal.md` 記錄 default selected chip is `轉帳`。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- 靜態檢查：`轉帳` chip 有 `.rb-pay-active`；`transfer` 欄位組初始可見；`ticket` 欄位組初始 hidden；`resetOrderSummaryModal()` 呼叫 `setOrderSummaryTransferPay("transfer")`。

**重要決定**:
- `轉正式單` section 的初始 active chip 跟頁面右側 `[E] 正式單` panel 一致，使用第一個 chip `轉帳`；`票券` 只是點選後的 special case。

## Session 50 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 補完 order summary `轉正式單` section 的 chip 切換功能：
  - 新增 `data-order-summary-transfer-pay` / `data-order-summary-transfer-fields` contract。
  - 點擊 chip 會切換 `.rb-pay-active`，並顯示對應欄位組。
  - 8 種欄位沿用 `[E] 正式單` 已確認規則：
    - `轉帳`：支付金額 / 收款帳號 / 客支付帳號。
    - `傳真刷卡`：支付金額 / 卡號 / 授權碼。
    - `票券`：支付金額 / 票券號碼 / 備註，且保留 inline `檢查` 特規。
    - `前台自付` / `信用交易` / `支票`：支付金額 / 內容 / 備註。
    - `訂金`：訂金餘額 / 支付金額。
    - `紅利`：紅利餘額 / 支付金額。
  - `resetOrderSummaryModal()` 會重設 `轉正式單` section 為 `票券` active。
- 修正 `檢查` 按鈕文字偏下：
  - 改為 `inline-flex h-auto min-h-[34px] items-center justify-center`。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- 靜態檢查：`data-order-summary-transfer-pay` 共 8 個、`data-order-summary-transfer-fields` 共 8 個，key 皆為 `transfer,fax,ticket,frontdesk,credit,check,deposit,bonus`；`檢查` 按鈕含 `inline-flex h-auto min-h-[34px] items-center justify-center`。

**重要決定**:
- `轉正式單` section 的 payment fields 與頁面右側 `[E] 正式單` panel 使用相同欄位規則，但使用獨立 data attributes，避免共用 `#paymentChips` / `#paymentFields` id。

## Session 49 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 補上 order summary `未付款` modal 漏掉的 `轉正式單` section：
  - 放在 `付款與帳戶` 後、`訂單明細` 前。
  - 包含 8 個付款 chips：`轉帳` / `傳真刷卡` / `票券` / `前台自付` / `信用交易` / `支票` / `訂金` / `紅利`。
  - `票券` chip 預設 selected，使用既有 `.rb-pay-chip.rb-pay-active` / `Color/SubItem/Selected`。
  - 欄位包含 `支付金額`、`票券號碼`、`備註`。
  - `檢查` 按鈕放在 `票券號碼` input 同列右側，使用 `Color/Surface/Accent` / `bg-surface-accent`。
  - section actions 為 `清除` / `改為正式單`。
- `setOrderSummaryVariant()` 新增 `showTransferOfficial` 控制：
  - `unpaid` 顯示 `轉正式單`。
  - `paid` / `waitlist` 隱藏 `轉正式單`。
- 已更新 `components/modal.md` 記錄 `轉正式單` section 內容與顯示規則。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- 靜態檢查：`data-order-summary-transfer-section` 位於 `付款與帳戶` 後方；`showTransferOfficial` 只在 `unpaid` 為 true；`檢查` 使用 `bg-surface-accent`。

**重要決定**:
- `轉正式單` 是 order summary `未付款` variant 內容，不與 page 右側 `[E] 正式單與候補單` panel 共用 DOM；但 chip token 與欄位規則沿用已記錄的 Figma history。

## Session 48 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 修正 order summary `付款與帳戶` 的右側欄位流：
  - 右側序列改為 `應付訂金` → `已付金額` → `訂房總金額` → `尚欠金額` → `修改人員`。
  - `訂房總金額` 不再落到左側欄位；用 `.order-summary-grid-spacer` 補足左側空位，讓它顯示在 `已付金額` 下方的右側欄。
  - mobile 下 `.order-summary-grid-spacer` 隱藏，維持單欄 label/value 連續排列。
- 已更新 `components/modal.md` 記錄 `付款與帳戶` 右側欄位順序。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- 靜態檢查：`已付金額` 後方有 2 個 `.order-summary-grid-spacer`，接著是 `訂房總金額`；mobile media query 會隱藏 spacer。

**重要決定**:
- `付款與帳戶` 右側有空位時，用 DOM spacer 保持 grid 欄位語意，不把右側欄位移到左側補空。

## Session 47 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 修正上一輪對 `無設定` radio 的誤解：
  - 恢復 `無設定` radio 預設 `checked`。
  - 預設 `無設定` checked 時，點擊 `產生訂單` 會開啟 `未付款` modal。
  - 切換到 `正式單` / `候補單` 後，點擊 `產生訂單` 分別開啟 `已付款` / `候補單` variant。
- 修正 `產生訂單` 無法開 modal 的實際原因：
  - `data-order-summary-submit` button 位於 script 之後，原本用 `querySelectorAll` 綁定時 DOM 尚未存在。
  - 改為 document-level delegated click handler，與既有 generic modal open pattern 一致。
- 已更新 `components/modal.md`，移除 no-selection rule，記錄 `無設定` 是預設 checked 並映射到 default unpaid modal。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- 靜態檢查：`無設定` radio 保留 `checked`；`data-order-summary-submit` 由 document-level delegated handler 接住並呼叫 `openModal("modalOrderSummaryBackdrop")`。

**重要決定**:
- `無設定` 是預設選取狀態，並且是有效 submit 狀態；它會產生 `未付款` modal。

## Session 46 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 修正 `正式單與候補單` radio 未選取時的 submit 行為：
  - 移除 `無設定` radio 的預設 `checked`。
  - 沒有任何 `rb-order-type` radio 被選中時，`產生訂單` 不開啟 order summary modal。
  - `無設定` 必須由使用者實際選中，才會映射到 `未付款` modal。
  - 初始沒有選取時，`orderTypeContent` 內三個 panel 全部 hidden。
- 已更新 `components/modal.md` 記錄 no-selection submit 不開 modal 的規則。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- 靜態檢查：`rb-order-type value="none"` 已無 `checked`；`!checked` 時回傳空字串，submit 不呼叫 `openModal`。

**重要決定**:
- `無設定` 是 explicit radio value，不是沒有選取時的 fallback。

## Session 45 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 接上 `正式單與候補單` radio 與 `產生訂單` 的 order summary modal variant 分流：
  - `無設定` → 開啟目前完成的 `未付款` modal。
  - `正式單` → 開啟 `已付款` variant；top pill / copy / `基本資訊 > 訂單狀態` 顯示 `已付款`，使用 `Color/Surface/Status-Positive`。
  - `候補單` → 開啟 `候補單` variant；top pill 顯示 `候補單`，copy 顯示 `此訂單尚為候補單`，使用 `Color/Surface/Brand-Active`；`基本資訊 > 訂單狀態` 仍保持 payment status `未付款`。
- `產生訂單` button 從 generic `data-modal-open` 改為 `data-order-summary-submit`，避免直接跳過 variant 判斷。
- 已更新 `components/modal.md` 記錄 radio-to-modal variant mapping。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- 靜態檢查：`產生訂單` 已移除 `data-modal-open="modalOrderSummaryBackdrop"`，改用 `data-order-summary-submit`；variant mapping `none → unpaid`、`official → paid`、`substitute → waitlist` 存在。

**重要決定**:
- 三種 order summary 狀態先共用同一份 modal DOM，以 JS 更新狀態文字與 token class；不複製整份 modal markup。

## Session 44 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者指定修正 order summary head title + table 的上緣線：
  - 新增 `.order-summary-table--after-title` modifier。
  - `訂單明細` / `加購明細` / `訂單總額` 的 table 套用該 modifier，移除 `thead th` 的 top border。
  - 保留 `.order-summary-table thead th` 的預設 top border，供沒有 `.order-summary-section-title` 在上方的 table 使用。
- 已更新 `components/modal.md`，記錄 section title 後方 table 需使用 `.order-summary-table--after-title`，不可讓 `thead` top border 形成 title underline。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**重要決定**:
- head title + table 的 section title 不加 underline；緊接其後的 table 也不得用 `thead` top border 補出上緣線，只保留 `thead` bottom border。

## Session 43 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 修正 order summary section title underline：
  - 改為 opt-in class `.order-summary-section-title--underlined`，只套在 `基本資訊` 這類只有 head title row 的 section。
  - `訂單明細` / `加購明細` / `訂單總額` 這類 head title + table 的 section，不在 title 上加 underline。
- 修正 section title 與 table 相鄰時的邊線歸屬：
  - table `thead` top border 恢復顯示，作為設計稿中的 table 上緣線。
  - `訂單明細` / `加購明細` / `訂單總額` 的 table wrapper 需緊貼 head title，不加額外 top margin。
  - 避免 title bottom border 與 table top border 同時存在造成雙線；head title + table 的唯一邊界線由 table `thead` 提供。
- 修正 order summary tables 的 body row borderline：
  - 將 row separator 從 `.order-summary-table tbody tr` 改為 `.order-summary-table tbody td`。
  - 讓 `訂單明細` / `加購明細` / `訂單總額` 的 tbody 分隔線可靠顯示，符合 Figma table row border intent。
- 已更新 `components/modal.md` 記錄 table body row border 實作規則。

**驗證**:
- inline script parse：通過，`inline_scripts=6`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**重要決定**:
- Figma table row stroke 在 HTML table 內以 cell-level border 實作，避免瀏覽器對 `tr` border rendering 不一致。

## Session 42 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者規則修正 order summary accordion：
  - `訂房與入住人資訊` header 從 static div 改為 button。
  - 加入 `aria-expanded` / `aria-controls`。
  - 點擊 header 會 hide/show content。
  - icon 在 `down.svg` / `up.svg` 之間切換。
  - 開啟 `modalOrderSummaryBackdrop` 時重設為 expanded。
- 已更新 `components/modal.md`：
  - 凡 order summary section header 顯示 `icons/down` 或 `icons/up`，必須實作 accordion function，不可只是裝飾。
  - 記錄 `訂房與入住人資訊` accordion 行為。

**驗證**:
- inline script parse：通過，`inline_scripts=2`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 跑 CLI / HTTP 驗證。

**重要決定**:
- Down/up icon is treated as an interaction affordance in order summary modal.

## Session 41 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 修正 `訂單明細` table 的 `專案` 欄位副文字：
  - 新增 `.order-summary-project-subtitle`。
  - 副文字改為 `width: 100%` / `max-width: 100%` / `white-space: normal` / `overflow-wrap: anywhere`。
  - 避免 `我是專案介紹介紹介紹介介紹紹介紹介紹介紹` 這種無空格長字串撐開 table。
- 已更新 `components/modal.md` 記錄 `專案` 副文字需為 full-width wrapping block。

**驗證**:
- inline script parse：通過，`inline_scripts=2`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 跑 CLI / HTTP 驗證。

**重要決定**:
- `訂單明細` table 寬度被撐開時，先檢查 cell 內無空格長字串；副文字用 scoped class 約束在欄位內換行。

## Session 40 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 修正 order summary table 金額 / 小計對齊 specificity：
  - 新增 `.order-summary-table .order-summary-number`，覆蓋 `.order-summary-table th, td { text-align: left; }`。
  - 確保所有 table 內標記為 `order-summary-number` 的 `小計` header/cell 與金額 cell 都實際靠右對齊。

**驗證**:
- inline script parse：通過，`inline_scripts=2`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 跑 CLI / HTTP 驗證。

**重要決定**:
- order summary table 的右對齊不可只靠低 specificity utility class；需用 scoped table selector 覆蓋 base table cell alignment。

## Session 39 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者回饋與 Figma node re-read 修正 order summary table layout：
  - `加購明細` 與 `訂單總額` 改為同一個 row-direction container。
  - `加購明細` 使用 Figma 內容寬度約 615px，section 約 655px。
  - `訂單總額` 使用 Figma 內容寬度約 275.67px，section 約 315.67px。
  - 兩個 section 之間使用 24px gap；mobile 下改為垂直堆疊。
  - `訂單總額` section/header/table 改為 `Color/Brand/Brand-50` 背景，section title 使用 `Color/Surface/Action-Default`。
  - `加購明細` 的 `數量`、`單價`、`小計` header/cells 改為右對齊；`小計` 金額與 `加購總計` 金額右對齊。
- 已更新 `components/modal.md`，記錄 add-on / order-total row container、Figma widths、right-align 與 color rules。

**驗證**:
- inline script parse：通過，`inline_scripts=2`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 跑 CLI / HTTP 驗證。
- Browser visual / click smoke test 仍待補，特別是 desktop 下 `加購明細` + `訂單總額` 是否同列。

**重要決定**:
- 後續 table 設計若有不清楚處，先回 Figma node 或詢問使用者，不自行用 generic table style 補齊。

## Session 38 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者回饋修正 `modalOrderSummaryBackdrop` default unpaid modal：
  - `訂單明細` table 的 `間數`、`單價`、`小計` header/cell 改為 nowrap。
  - `入住日期` 兩個日期各自用獨立 `<span>` 包起來，並套 nowrap，避免日期文字斷行。
  - 金額顯示改為 `$` 與數字同一組 inline-flex，保持中間視覺 gap 並不可斷開。
  - 有金額數字的欄位改為預設向右對齊。
  - `飯店資料` 改回 Figma 結構：置中 `旅宿 e 管家 DEMO` band + 4 rows，每 row 2 組 `Title` / `Content`。
  - `訂房須知` 內容改為 textarea-like block，維持 `min-height: 199px`。
- 已更新 `components/modal.md` 的 order summary layout 規則，記錄 nowrap、金額對齊、飯店資料與訂房須知 textarea 規則。

**驗證**:
- inline script parse：通過，`inline_scripts=2`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 跑 CLI / HTTP 驗證。
- Browser visual / click smoke test 仍待補。

**重要決定**:
- 訂單 summary 的金額欄位用 `.order-summary-number` 統一右對齊與 nowrap。
- 金額 `$` 與數字使用 `.order-summary-money` 包成不可斷行的 inline group。

## Session 37 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者確認，將 `產生訂單` button 接上訂單內容 default modal：
  - 新增 `modalOrderSummaryBackdrop`。
  - 點擊 `產生訂單` 開啟 default unpaid 訂單內容 modal。
  - modal 支援 header/footer 固定、body scroll；mobile 滿版，長 table 保持水平 scroll。
- 依已讀 Figma frames 更新 `components/modal.md`：
  - `state=order summary / default unpaid`：`1411:20866`，1019×2911。
  - `state=order summary / paid`：`1437:44343`，1019×2506，文案記錄為使用者已修正的 `此訂單已付款`。
  - `state=order summary / waitlist`：`1437:45408`，1019×2506；top status `候補單` 與 payment status `未付款` 分離。
  - `state=order summary / transfer official`：`1437:46152`，1019×2935；`轉正式單` section 有自己的 `清除` / `改為正式單` action area。
- 匯出訂單內容 modal 使用的 Figma icons：
  - `preview/assets/icons/order-summary-message-share.svg`
  - `preview/assets/icons/order-summary-print.svg`
  - SVG fill/stroke 已改為 `currentColor`。
- 補上 token alias 記錄與 HTML 變數：
  - `Color/Surface/Accent` → `bg-surface-accent` / `--color-surface-accent`（`#42EBE9`）。
  - `Color/SubItem/Selected` → `bg-subitem-selected` / `--color-subitem-selected`（`#F7D275`，原本 HTML 已有變數，tokens alias 表補記錄）。

**驗證**:
- inline script parse：通過，`inline_scripts=2`。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- Browser visual / click smoke test 尚未執行：本輪只做 CLI / HTTP 結構檢查。

**下一步應做**:
- 在 browser 進入 room-booking template，點 `產生訂單`，檢查 default unpaid 訂單內容 modal：
  - header `訂單內容`、top title `訂單明細`、actions `簡訊` / `列印`。
  - top status `未付款`、copy `此訂單尚未付款`。
  - 各 section：`基本資訊`、`付款與帳戶`、`訂單明細`、`加購明細`、`訂單總額`、`飯店資料`、`訂房與入住人資訊`、`訂房須知`。
  - desktop / mobile scroll 與 table overflow。
- 使用者後續新增狀態按鈕後，再接 paid / waitlist / transfer official variants；production 由 backend transaction status 決定顯示內容。

**重要決定**:
- 目前 `產生訂單` 只開啟 default unpaid modal；paid / waitlist / transfer official 不在本輪直接開啟。
- `候補單` 是 transaction/order category status；`基本資訊 > 訂單狀態` 仍可保持 payment status `未付款`。
- `#42EBE9` 對應 `Color/Surface/Accent`，`#F7D275` 對應 `Color/SubItem/Selected`，不可當作未命名 hex 使用。

## Session 36 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者再次 `figma-go` 讀取 large-width `Frame 410`：
  - Node：`I1392:17122;73:678;1392:16946`
  - 尺寸：`571×760`
  - large card：`507×172`，內部是 3 欄水平排列 `140 / 140 / 155`，gap 20。
- 已將 add-on product card content layout 改為 3 種 style：
  - large：3 欄水平排列。
  - medium：2 欄上排 + 第三欄下排。
  - narrow：單欄垂直堆疊。
  - implementation 使用 `Frame 410` container query 控制，不固定外層 width。
- 修正 cost / quantity column：
  - 移除 `space-y-10`，改用 `h-[140px] flex flex-col justify-between` 對齊 Figma 第三欄高度。
  - 不額外渲染 `訂房間數` label，只保留 DatePicker/stepper visual。
- 依使用者修正 add-on calendar date text：
  - Add-on product card 內的 date `<span>` 使用 scoped `.purchase-addon-date-text { font-size: 14px; }`。
  - 原 16px 在 140px 欄寬內會溢出，此為 `state=purchase add-on` 的 special rule。
- 補正 calendar default date 規則：
  - 所有 calendar default date 都必須是 today，由 JS 使用 `dayjs().format("YYYY-MM-DD")` 初始化。
  - Figma 樣本文字 `2026-02-27` 不作為 implementation default。
- 依使用者 Figma Variables 更新，新增並實作 cart chip tokens：
  - `Color/Accent/cart-date` = `#BDFFF6`
  - `Color/Accent/cart-time` = `#EAFFC5`
  - 已寫入 `specs/assets/tokens.md`、`preview/landing.html` Tailwind aliases / CSS variables，並套用到 right cart date/time chips。
- 修正 add-on time picker 格式：
  - hour / minute select option 一律顯示兩位數，例如 `01`, `04`, `22`, `44`。
  - right cart time chip 也使用相同兩位數格式。
- 修正 add-on left menu accordion：
  - `分類` icon 只在 down / up 之間切換；collapsed 不再 rotate 成 right direction。
  - collapse 狀態改為同時設定 `hidden` attribute 與 `is-collapsed` class，避免只靠 class 導致收合未生效。
  - 開啟 add-on modal 時 reset 為 expanded。
- 修正 add-on middle content accordion：
  - `加購項目` header 改為獨立 button，控制 product list collapse / expand。
  - 狀態獨立於左側 `分類` accordion；只影響 middle product list，不影響 right cart。
  - icon 同樣只在 down / up 之間切換。
- 依使用者追加修正：
  - `Frame 410` implementation width 改為 100% 填滿 container，不再以 fixed 397px 限制寬度。
  - Add-on product card 日期欄位改為可開啟的 `Calendar simple` dropdown function，不再只是 static button。
  - 備註 textarea 改為 `resize-y` + min height，可由使用者拖曳高度。
  - Time toggle 為 false 時，右側 cart card 不顯示 `未啟用時間` 這類替代文字；直接省略 time chip。
- 依使用者 `figma-go` 重新讀取目前選取的 add-on content source：
  - Page：`components`
  - Node：`I1393:18281;73:678;1393:18099`
  - 名稱：`Frame 410`
  - 尺寸：`397×1143`
- 確認 `Frame 410` 是內部 content frame，尺寸不同於 outer modal RWD frames；不可拿它覆蓋外層 modal 寬高。
- `components/modal.md` 已更新 `state=purchase add-on` 規格：
  - `Frame 410` 改為完整 product card content。
  - 補上 title / sub-title 規則，明確不可用數量文字取代 sub-title。
  - 補上 notice textarea、date/calendar control、hour/minute selects、time toggle active/disabled、cost input、inventory、booking quantity stepper。
  - 補上 selected content source node 與 RWD source frame 的尺寸分工。
- `preview/landing.html` 已更新 `modalPurchaseAddonBackdrop` 的 middle `Frame 410`：
  - Header 固定顯示 `加購項目`。
  - Product card 改為 title + subtitle、備註 textarea、日期 control、時/分 selects、toggle、價格/庫存/費用 input、訂房間數 stepper。
  - Time toggle 會切換該卡片 hour/minute select 的 disabled / active status。
  - Cost input 會即時影響右側 cart total。
  - Right cart card 改為顯示 title + sub-title，不再顯示「0 個」這種數量副標。
  - Delete card 仍會同步將該商品訂房間數歸 0。

**驗證**:
- `node` inline script parse：通過，1 個 inline script 可解析。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。
- Browser visual / interaction smoke test 尚未執行：workspace 沒有可用的 Playwright / Puppeteer runtime。

**下一步應做**:
- 用 browser 做 visual / interaction smoke test：
  - 點 `purchase-item.svg` 開啟 `加購` modal。
  - 確認 middle `Frame 410` product cards 顯示 title / sub-title、備註、日期、時分、toggle、費用、庫存、訂房間數。
  - 測試 time toggle 是否讓 hour/minute selects disabled / active。
  - 測試 cost input 是否更新右側 total。
  - 測試 stepper 與 trash delete 是否同步右側 card。
  - 檢查 desktop / tablet / mobile 下 outer modal RWD 仍符合既有三個 RWD frame。

**重要決定**:
- `Frame 410` 的 397×1143 是 middle content source，不是 modal outer size；outer RWD 仍以 `1392:17122` / `1393:18281` / `1393:19196` 為準。
- Cart date/time chip colors are no longer token gaps after Figma Variables added `Color/Accent/cart-date` and `Color/Accent/cart-time`.
- Figma `#D9D9D9` toggle track 未在 tokens.md 內，implementation 使用 token-backed `Color/Neutral/200` / `bg-border-disabled`，不硬寫該 hex。

## Session 35 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者修正，重新對齊加購 modal 結構：
  - 左側是 menu list。
  - 預設 selected 第一個 list item「所有」。
  - menu list icon 本身保持透明，不使用帶背景的 `fill` icon。
  - 點擊左側 menu list item 會切換 selected / focus style。
  - 左側 `分類` 有 accordion collapse / expand 功能。
  - 中間是 `Frame 410` content，依左側 category button 顯示對應內容。
  - 右側是 result / cart，middle stepper click 後產生 brief transaction card。
  - 右側 card delete button 會刪除該 card，並同步 middle stepper 數量歸零。
  - cart details 未來與 backend 協作；目前 prototype 用前端 local state 呈現。
- `components/modal.md` 已更新 `state=purchase add-on` 規格：
  - 修正為 left / middle `Frame 410` / right 三區結構。
  - 補上 accordion、category selected/focus、stepper、delete card、backend collaboration 規則。
- `preview/landing.html` 已更新 `modalPurchaseAddonBackdrop`：
  - 三欄 responsive layout：desktop left/middle/right，tablet middle/right 依可用寬度重排，mobile 單欄。
  - 左側 category 全部改用 `menu-list-*-none-fill.svg`。
  - 新增 purchase add-on JS state：category switching、accordion、stepper、cart card render/delete。

**驗證**:
- `node` inline script parse：通過，2 個 inline scripts 可解析。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 做 browser visual / interaction smoke test：
  - 點 `purchase-item.svg` 開啟 `加購` modal。
  - 確認左側 icon 無背景色，selected style 只在被點擊的 category item 上。
  - 點 `分類` header 確認 menu list collapse / expand。
  - 點不同 category，確認中間 `Frame 410` content 切換。
  - 點 middle stepper plus/minus，確認右側 card 新增/更新。
  - 點右側 trash icon，確認 card 刪除且 middle stepper 數量回到 0。

**重要決定**:
- 右側 cart backend collaboration 尚未實作；目前只做 prototype local state，不建立資料提交流程。

---

## Session 34 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者分次 `figma-go` 指示讀取加購 modal 三個 RWD frame：
  - Desktop：`1392:17122`，`1194×893`
  - Tablet：`1393:18281`，`768×1959`
  - Mobile：`1393:19196`，`375×3139`
- 確認觸發來源：room-booking 訂房明細表「加購」欄位的 `purchase-item.svg` click。
- `components/modal.md` 已新增 `state=purchase add-on（加購項目）`：
  - 記錄三個 RWD source nodes。
  - 記錄 header / body / footer 結構。
  - 記錄 category list、menu-list icon set、cart summary、footer button。
  - 記錄 RWD 規則：desktop 並排、tablet 變高、mobile 單欄堆疊。
  - 記錄 token gap：Figma tag bg `#BDFFF6` / `#EAFFC5` 尚無 tokens，不可硬寫。
- `preview/landing.html` 已實作 `modalPurchaseAddonBackdrop`：
  - Header：`加購` + close icon。
  - Body：分類 panel + 加購項目 / 購物車內容。
  - Category item 使用 `menu-list-*` icons。
  - Footer：`取消` / `確定加購`。
  - Modal 加入既有 backdrop click、Esc、close button 關閉流程。
  - 第一列 `purchase-item.svg` button 已接上 `data-modal-open="modalPurchaseAddonBackdrop"`。
- 新增 `Color/Bootstrap/focus-background` 的 HTML alias：
  - `--color-bootstrap-focus-background`
  - Tailwind `bg-bootstrap-focus-background`

**驗證**:
- `node` inline script parse：通過，2 個 inline scripts 可解析。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 做 browser visual / interaction smoke test：
  - 進入「房間預定」sub-page。
  - 點第一列加購欄位的 `purchase-item.svg`。
  - 確認 `加購` modal 開啟。
  - 檢查 desktop / tablet / mobile 下 header / footer 固定、body 可 scroll、分類與內容 RWD 變化。
  - 測試 close、取消、確定加購、backdrop click、Esc 關閉。
- 若 Figma Variables 後續補上 `#BDFFF6` / `#EAFFC5` 對應 token，再回補 exact tag colors；目前 implementation 使用 token-backed placeholder colors，沒有硬寫這兩個 hex。

**重要決定**:
- `purchase-item.svg` 只開啟加購 modal；購物車刪除 icon 目前是 visual prototype，因 Figma 未定義刪除行為，不加 JS 行為。
- 375px 只作為 Figma mobile 參考，implementation 保持流動寬度與 mobile fullscreen modal 行為。

---

## Session 33 交接（2026-05-06）

### 本次進度交接

**已完成**:
- 依使用者 `figma-go` 指示讀取目前 Figma selection：
  - Page：`components`
  - Node：`1295:13763`
  - 名稱：`svg`
  - 類型：`FRAME`
  - 尺寸：`317×614`
- 確認此 selection 是稍後 menu list（非 aside）會使用的 icon library。
- 已從 Figma 匯出 12 組 menu list icon、共 24 個 SVG：
  - `menu-list-{name}-fill.svg`
  - `menu-list-{name}-none-fill.svg`
  - 存放位置：`preview/assets/icons/`
- 已將這批 SVG 的 `stroke="black"` 改為 `stroke="currentColor"`，讓後續可用 `Color/Icon/Default` / `text-icon-default` 控色。
- 已更新 `specs/icons.md`：
  - 新增 `Menu List Icon Set（非 aside）` 專區。
  - 記錄 Figma node 來源、用途、命名規則、fill / none-fill variant 規則。
  - 記錄狀態背景色對應 token：
    - `#D3EBFD` → `Color/Bootstrap/focus-background`
    - `#F6F6F6` → `Color/Neutral/50` / `Color/Surface/Default`

**驗證**:
- Figma SVG export：24/24 成功。
- 已檢查匯出檔案色值；stroke 已改為 `currentColor`，fill variant 只保留 Figma 狀態背景參考色。

**下一步應做**:
- 使用者切到 menu list 對應 Figma frame 後，再用 `figma-go` 讀取 menu list 版型本身。
- 實作 menu list 時優先使用 `menu-list-*-none-fill.svg`，背景與狀態用 tokens.md 的 token 控制；不要直接使用硬寫背景色做 HTML/CSS 狀態。

**重要決定**:
- 這批 icon 使用 `menu-list-` 前綴，避免與既有共用 icon（如 `bed.svg`、`service.svg`）衝突。
- `fill` variant 保留作 Figma 匯出參考；實作首選是 `none-fill` icon + token 背景容器。

---

## 當前狀態

**階段**：實作進行中（specs ✅ → landing.html 🔄）

**當前任務**：`preview/landing.html` 持續修正中，桌面與行動版皆在同一檔案。

**Figma 當前頁面**：components（加購 modal RWD `1392:17122` / `1393:18281` / `1393:19196`；menu list icon frame `1295:13763`；訂房明細 edit Modal `1272:27402` / `1272:27354` / `1272:27306`）

---

## Session 32 交接（2026-05-05）

### 本次進度交接

**已完成**:
- 依使用者確認，更新 `start.md` 工作規則：
  - 375px 改為「目前 Figma mobile 參考稿寬度」，不代表產品最小支援寬度；實作需全響應式，QA viewport 依任務指定。
  - 新增 `figma-go` 三階段流程：Read → Spec checkpoint → Write + implement。
  - 明確規定「只讀 / 不寫 code / 還沒讀完」時不可寫 spec 或實作。
  - 新對話啟動由 `AGENTS.md` 控制簡化摘要，避免重複完整開工 checklist。
  - token 讀取改為 usage rules + 相關章節；只有使用者說 Figma Variables 變動時才全量同步。
  - `Claude` 文案改為通用 `AI agent / Codex`。
  - progress 同步規則改為新增 Session 交接格式。
  - 使用者提出的 HTML/CSS 方向若技術上不可靠，需先停下說明，不可硬做一版。
  - 新增 inline style / hard-coded design value 限制：例外需先報告、取得同意，並寫入 spec 或 progress。
  - 新增 Full Start Checklist / Light Task Checklist 分級，避免小修漏必要流程。

**進行中**:
- 房型介紹 modal static input-like 修正已完成但尚未 commit。
- `start.md` 規則更新已完成但尚未 commit。

**下一步應做**:
- 跑文件/HTML 基礎檢查。
- 若使用者同意，將本次 `start.md` 規則更新與房型介紹 modal 修正一起 commit，或拆成兩個 commit。

**重要決定**:
- `figma-go` 不再等同「讀完立刻寫檔」；預設需先 checkpoint，除非使用者明確要求直接實作。
- 小修不跑完整開工 checklist，但仍需查 spec、查相關 token、更新 progress、跑必要驗證。

---

## Session 31 交接（2026-05-05）

### 本次進度交接

**已完成**:
- 依使用者修正，房型介紹 modal（`info.svg` 開啟）內容區不再使用可編輯 textarea。
- `preview/landing.html` 已將 `modalRoomIntroBackdrop` 的內容區改為 static input-like display：
  - 使用白底、一般 border、12px 文字的 input 視覺。
  - 不可修改。
  - 不套 disabled 灰底樣式。
  - 保留多行文字與後端渲染空間。
- `components/modal.md` 已同步更新 `state=room intro`：
  - `Input textarea` 改為 `Static input content`。
  - 明確記錄內容區不可編輯、未來由後端資料渲染。

**下一步應做**:
- 做 browser smoke test，確認點 `info.svg` 開啟後內容區不可輸入，且視覺仍維持一般白底 input 樣式。

---

## Session 30 交接（2026-05-05）

### 本次進度交接

**已完成**:
- 依使用者最新修正，重新對齊訂房明細 edit modal：
  - info chips 不使用完整外框，也不使用 `::before` / `::after` 或 inner rail；一律用元素本身 `border-0 border-l-4 rounded-md`，只保留左側 4px border 並讓圓角自然裁切。
  - 入住日 / 退房日不是純 UI，已改為套用 `components/calendar-simple.md` default variant。
  - Calendar simple 日期 markup 不 hard-code 日期，開啟 edit modal 時由 JS 填入今日 `dayjs().format("YYYY-MM-DD")`。
  - 價格區不使用 grid/full cell border 模擬表格，改回語意 `<table>`，保留 table 自身 padding 與 row border 寫法。
  - 價格 table 的間距需求是 tbody cell 的垂直節奏：單列上下各 8px；多列第一列 top 8px、最後列 bottom 8px，列與列之間由 4px + 4px 組成 8px。
- `components/modal.md` 已補強 `state=room booking edit` 規格：
  - 明確要求 edit modal info chips 套用「單側 Border Info Item 規則」。
  - 明確要求入住日 / 退房日套用 Calendar simple default。
  - 明確禁止 hard-code 日期字串。
  - 明確要求價格表使用語意 table 與 table padding。
- `preview/landing.html` 已更新：
  - edit modal 9 個 info chips 全部改為 left-border-only。
  - 入住日 / 退房日改成 `.rb-cal-cell` / `.rb-cal-btn` / `.rb-cal-date` Calendar simple 結構。
  - Calendar simple 初始化支援 edit modal 內的日期欄位。
  - reset edit modal 時日期重設為今日。
  - 價格區改為 `<table>`，左右 padding 保留 `px-3`。
  - 移除 table 左右 `border-spacing` 與 `tr` 高度做法，新增 `.room-edit-price-table` CSS，以 `tbody tr:first-child / last-child / only-child td` 控制垂直 padding。

**驗證**:
- `node` inline script parse：通過，2 個 inline scripts 可解析。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**下一步應做**:
- 做 browser visual / interaction smoke test：
  - 點 `edit.svg` 開啟 edit modal。
  - 確認 9 個 info chips 只有左側 4px border，沒有完整外框或直線 rail。
  - 確認入住日 / 退房日預設顯示今日，並可開啟 Calendar simple dropdown。
  - 確認價格區是 table padding 視覺，不是 grid 格線。

---

## Session 29 交接（2026-05-05）

### 本次進度交接

**已完成**:
- 依使用者決策修正 `start.md`：
  - 375px 改為「最小支援 viewport / Figma mobile 參考寬度」。
  - 明確禁止將 UI 固定寫死為 375px，後續需全響應式實作。
- 透過 `figma-go` 讀完訂房明細 edit modal 三個 375px 狀態：
  - `1272:27402`：預設，lock + 數量 1 + `已達最低間數`。
  - `1272:27354`：lock + 數量 5 + `已達上限間數`。
  - `1272:27306`：unlock + 定價調整 input 可編輯。
- `components/modal.md` 已新增 `state=room booking edit` 規格，包含：
  - `edit.svg` trigger。
  - lock/unlock 只控制價格表「定價調整」input active / disabled，與訂房數量無關。
  - 訂房數量只控制 +/- 與最低/最高提示。
  - `最少須訂間數：28` 目前只渲染文字，不參與前端邏輯。
  - 清除只清除非 disabled 的定價調整 input value 與 textarea。
  - 375px 只作為最小參考，實作需全響應式。
- `specs/assets/tokens.md` 新增 `text-text-supporting` / `--color-text-supporting` alias，對應 `Color/Text/600 / Color/Neutral/600`，用於 `已達最低間數`。
- `preview/landing.html` 已新增 `modalRoomEditBackdrop`：
  - 預設開啟為 lock + 數量 1 + `已達最低間數`。
  - 三個訂房明細 row 的 `edit.svg` 都已接上 `data-modal-open="modalRoomEditBackdrop"`。
  - lock toggle 會切換 `lock.svg` / `unlock.svg`，並切換價格調整 input disabled / active。
  - stepper 支援 1 到 5，最低時 minus disabled，最高時 plus disabled。
  - 清除按鈕會清除 active 的價格調整 input 與 textarea；disabled input 保持不動。
  - modal body 可垂直 scroll，小螢幕滿版，desktop 使用響應式 max width。

**驗證**:
- `node` inline script parse：通過，2 個 inline scripts 可解析。
- duplicate id check：通過，`duplicate_id_count=0`。
- `git diff --check`：通過。
- `curl -I http://127.0.0.1:8000/landing.html`：回傳 200 OK。

**進行中**:
- 訂房明細 edit modal 目前為 prototype 靜態資料與前端 demo state；未接後端資料。

**下一步應做**:
- 做 browser visual / interaction smoke test：
  - 進入「房間預定」sub-page。
  - 點任一 row 的 `edit.svg`，確認 edit modal 開啟。
  - 確認預設為 lock + 數量 1 + `已達最低間數`。
  - 點 plus 到 5，確認 `已達上限間數` 與 plus disabled。
  - 點 lock icon 解鎖，確認定價調整 input 變 active；點清除確認 active input 與 textarea 清空。
  - 確認 close、backdrop click、Esc 關閉。
  - 檢查 375px / desktop 寬度下 modal body scroll 與 chips flex-wrap。

**重要決定**:
- `lock` 不等於整個 modal 或數量 lock；只控制定價調整 input active / disabled。
- `最少須訂間數：28` 是後端規則文字，目前前端只呈現，不參與 stepper min/max。
- `edit.svg` 預設打開 `lock + 已達最低間數 + 數量 1`。
- 375px 是最小支援 viewport 與 Figma mobile 參考寬度，不是固定 modal 寬度。

**未解問題**:
- edit modal 的資料來源、row 對應內容與真正 API 狀態尚未接入；目前依 Figma 靜態內容與使用者決策實作。

---

## Session 28 交接（2026-05-05）

### 本次進度交接

**已完成**:
- 透過 `figma-go` 確認目前選取的 Figma node 為 `components` 頁面的房型介紹 Modal（`1272:27245`，560×390）。
- `components/modal.md` 已補上 `state=room intro` 規格：
  - 標題「房型介紹」。
  - 房名「義大利麵專屬房」。
  - home / bed / door / price 四個 info pill。
  - textarea 內容區與 footer「關閉」按鈕。
  - desktop 560px 置中、mobile 滿版。
- `preview/landing.html` 已新增 `modalRoomIntroBackdrop`。
- room-booking template 的 3 個房型 `info.svg` 已改為可點擊 button，點擊開啟房型介紹 Modal。
- Modal open 行為改為事件委派，確保動態注入的 room-booking template 內容也能開啟 modal。
- 依使用者重新指定與 `figma-go` / SVG 匯出確認，房型介紹 Modal 已修正：
  - 四個 info item 維持 icon + text，但不再使用完整外框 border。
  - item 僅左側保留 4px border，top/right/bottom border 為 0，並跟隨 6px 圓角自然裁切。
  - item row 使用 `flex-wrap`，不使用 horizontal overflow。
  - 下方內容區改為真正可輸入的 `<textarea>`。

**進行中**:
- 房型介紹 Modal 目前使用 Figma prototype 靜態內容；未接後端資料。

**下一步應做**:
- 做 browser smoke test：
  - 進入「房間預定」sub-page。
  - 點任一房型 info icon，確認房型介紹 Modal 開啟。
  - 縮窄 viewport，確認四個 info item 會 wrap 而不是橫向捲動。
  - 確認 textarea 可輸入文字。
  - 測試 header close、footer「關閉」、backdrop click、Esc 關閉。
  - 檢查 desktop 560px 與 mobile 滿版顯示。

**重要決定**:
- `figma-go` 讀到的房型介紹 Modal 歸入既有 `components/modal.md`，不新增獨立 component spec。
- room-booking template 是 JS 動態注入，因此 modal open 需用事件委派，不使用只對初始 DOM 生效的一次性 listener。
- Modal 內相似的 icon + text info item 統一使用 `components/modal.md` 的「單側 Border Info Item 規則」：
  - 外層元素本身使用 `border-0 border-l-4 rounded-md`。
  - 不用 pseudo element 或額外 inner rail/span 模擬左線。
  - 讓 4px left border 跟隨 6px radius 自然裁切。

**未解問題**:
- 房型介紹 Modal 的資料來源與各房型對應內容未定；目前依 Figma 靜態內容呈現。

---

## Session 27 交接（2026-05-04）

### 本次進度交接

**已完成 / 使用者已確認**:
- 單一 sidebar DOM 實測通過：
  - desktop sidebar collapse / expand。
  - mobile sidebar open / close。
  - mobile sidebar 內 accordion、sub-item click。
  - logout / switch modal。
  - POS hover fill。
  - mobile drawer spacing 與原視覺一致。
- `preview/landing.html` 目前仍是單檔大型靜態 prototype；現階段會繼續長大，先列為提醒事項，不進行拆檔重構。
- Effect 類樣式維持特規：
  - Effect 不寫入 Figma Variables。
  - 後續遇到 shadow、backdrop、blur、component-specific rgba 等 Effect 時，需透過 `figma-go` 讀取當前 Figma frame / section / component，依設計如實渲染。
  - 此責任由使用者與執行 agent 共同注意；不得自行把 Effect 混入 `Color/*` token。
- chartjs-diverging / doughnut 目前以 `preview/landing.html` 內 JS + HTML/CSS 能配合目前 prototype 為準；未來會由後端提供真實資料渲染，不要求現階段產出正式 component spec。
- 部分 sub-page 仍為 placeholder 或待 Figma frame；未來資料內容會由後端渲染，現階段不由前端 prototype 補完。
- 語意 alias 對照表需嚴格維護：
  - 新增或使用 Tailwind / CSS alias 前，必須確認 `specs/assets/tokens.md` 已有 Figma Variable 對照。
  - `start.md`、`progress.md`、`tokens.md` 是 agent 執行前必讀與對照來源。
  - 不允許 agent 自行新增未記錄 alias 或跳過 token 對照。
- `preview/room-booking.html` 已納入同一套 token 規則：
  - 新增 Tailwind CDN `theme.extend.colors` semantic aliases。
  - 新增 `:root --color-*` token 定義，來源對應 `specs/assets/tokens.md`。
  - 將原本可見的 `text-[#...]`、`bg-[#...]`、`border-[#...]` 與 CSS hardcoded color 改為 semantic class / CSS variable。
  - `#e5e5e5`、`#f0f0f0` 舊 border 色改用 `Color/Border/Default`；`#e8f1fb` 舊 active 淡藍背景改用 `Color/Bootstrap/focus-background`。
  - 掃描結果：除 `:root` token 定義外，`room-booking.html` 已無 arbitrary hex color class 或裸 hex 色值。

**提醒事項**:
- `preview/landing.html` 單檔過大是已知維護風險；但在目前 prototype 快速增長階段，先不拆檔。
- 單檔過大未來可能影響：
  - 搜尋與局部修改成本。
  - CSS/JS side effect 追蹤。
  - component 重用與測試。
  - 與後端 template 整合時的拆分成本。

**歷史未解項補充說明**:
- `room-booking.html` token 遷移已於本 session 補上；後續維護時仍需遵守 `tokens.md` / Tailwind semantic alias 規則，避免新增非 Figma 來源顏色。
- Function icons 對照目前狀態：
  - `bulletin` 已對應 `components/bulletin-vendor.md`，目前開 `modalBulletinBackdrop`。
  - `message` 已對應 `components/bulletin-administer.md`，目前開 `modalAdministerBackdrop`。
  - `person-md` 已對應 `components/modal.md` 的會員安全管理 variants，目前開 `modalMemberBackdrop`。
  - `person-md` 依目前產品行為不顯示數字 badge；舊 Figma 規格中的 `99+` badge 視為規格誤差。
  - `system` 目前只有 function icon，尚未有對應內容，也不顯示數字 badge；使用者確認此功能屬於後續較晚階段，不在目前範圍。
  - 後續補 `system` 時需先讀對應 Figma frame / section / component，不得從其他 modal 推測。
- `components/function-icons.md` 已依使用者最新決策修正：
  - 只有 `bulletin` / `message` 這兩個公告類 icon 顯示 badge。
  - `message=0` 使用 empty badge（Neutral/200 背景、Text/800 文字）。
  - `person-md` / `system` 不顯示 badge。
- `preview/landing.html` 已同步修正：
  - desktop / mobile `message` badge 改為 empty badge。
  - mobile `person-md` / `system` badge 已移除。

**未解問題**:
- `system` function icon 點擊後內容尚未實作，列為後續未完成項目。
- 後續若 Figma 仍顯示 `person-md` / `system` badge，需以本 session 使用者決策為準，或由使用者重新變更產品規則。

---

## Session 26 交接（2026-05-04）

### 本次進度交接

**已完成**:
- 依使用者要求，將 sidebar 從「desktop source → mobile runtime clone」再收斂為真正單一 `<aside id="sidebar">`：
  - desktop 時 `#sidebar` 是左側 flow sidebar。
  - mobile 時同一個 `#sidebar` 透過 `mobile-open` class 變成 fixed drawer。
  - mobile header、close button、function icons row 已移進同一個 `#sidebar`，不再有第二個 `#mobileSidebarPanel`。
- mobile sidebar 內原本重複的帳號列、selects、系統操作 accordion、客服、檔案、POS 入口 HTML 已移除；目前靜態 DOM 只有一份 aside content。
- Sidebar sub-item selected / click selector 改為 `.menu-category .accordion-trigger + div > div`，不再依賴 `desk-acc-*` / `mob-acc-*` 兩套 id prefix。
- Accordion toggle / collapse-all 改用 `trigger.nextElementSibling` 找內容區；舊的 `desk-acc-*` / `mob-acc-*` id 與 `data-accordion-target` 已移除。
- Logout / switch shared content 改用 `data-modal-open` 綁 modal，避免 desktop/mobile id 分流。
- `node --check` 已通過兩個 inline script 的語法檢查。
- `git diff --check` 通過。
- 本次未保留 preview server；`curl -I http://127.0.0.1:8000/landing.html` 因本地 server 未啟動而無法連線。
- 以 Python `HTMLParser` 檢查靜態 HTML：目前 `id_count = 73`、`duplicate_id_count = 0`。
- `rg` 確認 `preview/landing.html` 已無 `desk-acc`、`mob-acc`、`data-accordion-target`、`[id^=...]` 舊 selector。
- `rg` 確認已無 `mobileSidebarPanel`、`mobileSidebarContent`、`data-sidebar-shared-source`、`cloneNode`。

**進行中**:
- Sidebar 已改成單一 DOM；尚未做 browser visual / interaction smoke test。

**下一步應做**:
- 做 browser visual / interaction smoke test：
  - desktop sidebar accordion 展開/收合、全收合。
  - mobile menu 開啟後，同一個 `#sidebar` drawer 是否顯示完整。
  - mobile sidebar accordion、sub-item click、role select、logout/switch modal。
  - desktop fold / compact expand 是否仍正常。
- 若 mobile drawer spacing 與原 mobile sidebar 視覺差距太大，再針對 `#sidebar` 的 mobile media query 加少量 override。

**重要決定**:
- 採用單一 `<aside id="sidebar">` 同時承擔 desktop flow 與 mobile drawer；這是目前可維護性最佳解。
- 允許 shell 視覺在同一個 aside 內以 `md:hidden` / `hidden md:*` 區分，但主要內容不再有第二份 DOM。

**未解問題**:
- 尚未做瀏覽器互動實測；目前完成靜態 diff、JS 語法檢查與靜態 HTML 結構檢查。

---

## Session 25 交接（2026-05-04）

### 本次進度交接

**已完成**:
- 依使用者決策，確認 `bg-white` / `text-white` 可作為 `Color/Neutral/0` 的 Tailwind 應用層 alias，不強制改成 `neutral-0` 命名。
- `specs/assets/tokens.md` 新增「Figma Variable 與 Tailwind 語意 alias 對照」：
  - 底層仍以 Figma Variables 為來源。
  - 實作可使用更好讀的 `white`、`bg-surface-default`、`text-text-default`、`text-icon-default` 等 alias。
  - alias 必須在 tokens.md 有對照，不允許 agent 自行新增未記錄名稱。
- 依使用者決策，Effect 不寫進 Figma Variables：
  - `rgba(...)`、box-shadow、drop-shadow、modal backdrop 保留為固定元件效果。
  - 這類效果依目前 Figma component 視覺與元件規範套用，不混入 `Color/*` token。
  - scrollbar 維持 HTML/CSS 原生特規，不建立 token。
- 依 icon 黑色處理建議，已在 Figma Semantic Variables 新增：
  - `Color/Icon/Default = #000000`
- `specs/assets/tokens.md` 已新增 `Color/Icon/Default` 與 `text-icon-default` / `--color-icon-default` 使用規則。
- `preview/landing.html` 已新增：
  - Tailwind alias：`text-icon-default`
  - CSS variable：`--color-icon-default`
  - `.icon-mask` utility，用 `currentColor` 控制 mask icon 顏色。
- POS 入口 desktop / mobile 兩處 icon 已從 `<img>` 改為 mask icon，套用 `text-icon-default`，避免 SVG 內硬寫 black 直接決定畫面顏色。
- `specs/icons.md` 已補充 icon 顏色規則：
  - 一般黑色 icon 使用 `Color/Icon/Default`。
  - 需要 CSS 控色時使用 `currentColor` 或 mask。
  - `pos.svg`、`attached-link.svg` 已列入建議改 `currentColor`，目前 landing.html 已用 mask 套用。
- 本地 ignored `specs/assets/figma-variables.json` 已同步補上 `Color/Icon/Default`，方便後續本機檢索對照。

**進行中**:
- 色彩來源規則已從「只看 hex 是否來自 Figma」推進為「Figma 底層 token + 實作語意 alias」雙層管理。

**下一步應做**:
- 做 browser visual smoke test：
  - POS 入口 default / hover icon 是否仍為 Figma 指定黑色。
  - POS hover fill 是否仍為 `#F2BEFD → #FFB6B6`。
  - sidebar / modal / room booking 中 `bg-white` / `text-white` 視覺是否未受影響。
- 後續若要繼續清 icon，優先把需要狀態變色的 SVG 改成 `currentColor` 或 mask；品牌/語意色 icon 保留原色。

**重要決定**:
- Tailwind 實作層可以用 `white` 這種更好讀的名稱，但必須能回查到 Figma Variable：`Color/Neutral/0`。
- Effect 不進 Figma Variables；只有固定元件效果紀錄在規範中。
- Scrollbar 是瀏覽器/DOM 原生特規，不建立 token。

**未解問題**:
- 尚未做瀏覽器視覺驗證。

---

## Session 24 交接（2026-05-04）

### 本次進度交接

**已完成**:
- 依使用者在 Figma Variables 的新增命名，同步新增：
  - `Color/Accent/float-circle-filled-1 = #F2BEFD`
  - `Color/Accent/float-circle-filled-2 = #FFB6B6`
- `specs/assets/tokens.md` 已新增上述兩個 Accent token，語意用途標為 POS 入口 hover fill 漸層起點/終點。
- `preview/landing.html` 已新增對應 Tailwind CDN aliases 與 `:root --color-*`：
  - `accent-float-circle-filled-1`
  - `accent-float-circle-filled-2`
- `.pos-entrance-btn:hover .pos-entrance-inner` 已從舊的 rgba 推定色，改為 Figma SVG 補讀出的 hover fill gradient：
  - `var(--color-accent-float-circle-filled-1)`
  - `var(--color-accent-float-circle-filled-2)`
- 本地 ignored `specs/assets/figma-variables.json` 已同步補上上述 keys，方便後續檢索。

**進行中**:
- POS entrance component 的 default stroke gradient 與 hover fill gradient 已完成 token 化。

**下一步應做**:
- 做 browser visual smoke test：hover POS 入口時，內層 fill 應呈現 `#F2BEFD → #FFB6B6`。
- 若要完全對齊 Figma SVG，另需確認 hover stroke `#FFFFFF`、文字 `#454545`、icon stroke `#000000` 是否都要改為 semantic aliases，而不是依 SVG/icon 檔自身顏色。

**重要決定**:
- 這次 hover fill token 來源不是 MCP 結構資料，而是 `save_screenshots(format: SVG)` 補讀 SVG `<defs>` 後確認。

**未解問題**:
- 尚未做瀏覽器視覺驗證。

---

## Session 23 交接（2026-05-04）

### 本次進度交接

**已完成**:
- 依使用者指定的新版 Figma Variables 命名，同步新增 Accent tokens：
  - `Color/Accent/celebration = #F44DF4`
  - `Color/Accent/linear-pos-left = #E376F9`
  - `Color/Accent/linear-pos-right = #FF7878`
  - `Color/Accent/float-circle-mixed-1 = #FFB624`
  - `Color/Accent/float-circle-mixed-2 = #3F930B`
- `Color/Accent/celebration` 已註明同值來源：`Color/Bootstrap/aside/Notification = #F44DF4`。
  - 前一輪沒有套用到「中秋連假」的原因：`tokens.md` 已有 Bootstrap token，但 `landing.html` 的 Tailwind semantic aliases 沒有建立可用 class，且該欄位當時使用的是 `#E91E63`，不是 Figma Variables 內的 `#F44DF4`。
- `preview/landing.html` 已新增對應 `:root --color-*` 與 Tailwind CDN aliases：
  - `accent-celebration`
  - `accent-linear-pos-left`
  - `accent-linear-pos-right`
  - `accent-float-circle-mixed-1`
  - `accent-float-circle-mixed-2`
- 已套用到實作：
  - 「中秋連假」：`text-[#e91e63]` → `text-accent-celebration`
  - POS 入口外框 gradient：改用 `var(--color-accent-linear-pos-left/right)`
  - Floating customer service circle gradient：改用 `var(--color-accent-float-circle-mixed-1/2)`
- 依使用者決策，scrollbar thumb 保持 HTML/CSS 特規，不給予 token 定義；已從 `tokens.md` 移除 `Color/Scrollbar/Default` 區塊。
- 本地 ignored `specs/assets/figma-variables.json` 也已補上上述 Accent keys，方便本機檢索對照；此檔仍不進版控。

**進行中**:
- `preview/landing.html` 顏色已基本收斂到 Figma Variables / tokens；剩餘 bare hex 主要是 `:root` token 定義、註解、以及 scrollbar 特規。

**下一步應做**:
- 做 browser visual smoke test：
  - 「中秋連假」文字是否使用 `#F44DF4`
  - POS 入口外框 gradient 是否維持 `#E376F9 → #FF7878`
  - Floating customer service circle 是否維持 `#FFB624 → #3F930B`
  - scrollbar thumb 仍維持特規 `#D9D9D9`
- 若要求連 `bg-white` / `text-white` 也不得使用 Tailwind built-in，後續再新增 semantic aliases 並批次替換。

**重要決定**:
- Bootstrap namespace 的 `Color/Bootstrap/aside/Notification` 仍保留於 tokens.md，但 UI 實作用 `Color/Accent/celebration` 這個更貼近用途的 semantic alias。
- Scrollbar thumb 不屬於設計 token 管理範圍，即使有實作色，也不新增 `Color/Scrollbar/*`。

**未解問題**:
- 尚未做瀏覽器視覺驗證。

---

## Session 22 交接（2026-05-04）

### 本次進度交接

**已完成**:
- 依使用者要求，將「顏色只能來自 Figma Variables」寫入規範：
  - `specs/assets/tokens.md` 新增 Token 使用規則，要求 HTML / CSS / JS 顏色必須先對應本檔 token。
  - `start.md` 新增禁區：不可套用非 Figma Variables 來源的顏色。
- 以 `specs/assets/figma-variables.json` 為來源校正 `specs/assets/tokens.md`：
  - `Color/Brand/Brand-950` 從 `#401406` 修正為 Figma 匯出的 `#40140A`。
  - 同步日期更新為 `2026-05-04`。
- `preview/landing.html` 補齊 `:root --color-*` 與 Tailwind CDN `theme.extend.colors` semantic aliases：
  - text-muted / text-subtitle / text-emphasis / text-inverse
  - surface-action / surface-brand / surface-brand-hover
  - border-focus / border-plugin / border-plugin-invalid
  - radio-hover / brand-500 / chart-green / chart-purple-red / tab-yellow
- 將 `preview/landing.html` 內約 930 個 Tailwind arbitrary hex class 轉成 semantic class；目前只剩 1 個未轉：
  - `text-[#e91e63]`（不在 Figma Variables，需使用者決定）
- Chart.js 顏色改為透過 `getComputedStyle(document.documentElement)` 讀取 `:root --color-*`，避免 JS 直接寫 Figma hex。
- 移除部分 Tailwind default gray 實作色：
  - calendar dropdown border / hover / header / disabled 文字改用 Figma token 對應的 CSS variable。
- `git diff --check` 通過。

**進行中**:
- `preview/landing.html` 的顏色 token 化正在收斂；大多數 class 已改為 semantic token，但仍有少數非 Figma 來源色需要決策。

**下一步應做**:
- 請使用者決定以下非 Figma Variables 顏色：
  - `#e91e63`：庫存表「中秋連假」文字色，目前是唯一剩餘 arbitrary hex class。
  - `#e376f9` / `#ff7878`：POS 入口外框 gradient，出現 2 次 inline style。
  - `#ffb624` / `#3f930b`：客服 floating button 外框 gradient。
  - `#d9d9d9`：scrollbar thumb；目前 `tokens.md` 標為 Color/Scrollbar/Default（非 Figma variable，歷史決策是 HTML 自動生成不需引用），但與新規則「不可用非 Figma 色」衝突，需重新決定是否進 Figma Variables。
- 決策後再把剩餘色補進 Figma Variables / tokens.md，或改用現有 Figma token。
- 需要做 browser visual smoke test，重點檢查：
  - aside / mobile menu 顏色是否維持一致
  - dashboard cards / modals / room-booking template
  - Chart.js 圖表色是否正確讀到 CSS variables

**重要決定**:
- 這輪不再將 `specs/assets/figma-variables.json` 視為「可直接引用的 runtime 檔案」；它是匯出輸入，必須如實轉換到 `specs/assets/tokens.md` 和 `landing.html` 的 `:root` / Tailwind config。
- 可 1:1 對應 Figma Variables 的顏色已直接替換；無 Figma 來源者不使用近似色硬改。

**未解問題**:
- 是否要把 `#e91e63`、兩組 gradient、`#d9d9d9` 加入 Figma Variables？
- `bg-white` / `text-white` 目前仍使用 Tailwind built-in white；數值等於 `Color/Neutral/0`，但若要求「所有顏色都必須是 semantic class」，後續可再統一改成 `bg-white` alias 以外的 `bg-surface-white` / `text-white-token` 命名。

---

## Session 21 交接（2026-05-04）

### 本次進度交接

**已完成**:
- 檢查 `specs/assets/figma-variables.json` 與 `specs/assets/tokens.md`，確認 `preview/landing.html` 的 `:root --color-*` 與 Tailwind CDN `theme.extend.colors` 對應主要設計來源：
  - Neutral/50、Neutral/75、Neutral/100、Neutral/200、Neutral/300、Neutral/400、Neutral/800
  - MenuItem/Default、Radio/Default、SubItem/Selected
  - Brand-50、Brand-400、Brand-600（以 `--color-brand-active` 使用）
  - Surface/Status-Positive、Surface/Status-Negative
  - Chart/blue、Accent/pink、Accent/light-green、Accent/Green
- `preview/landing.html` 新增 `brand-50` semantic token，供「系統操作」收合按鈕使用 `bg-brand-50`，避免新增裸 hex。
- 桌面與行動版側邊欄「系統操作」標題列新增「收合」按鈕：
  - `.menu-collapse-all` 點擊後收合所有 `.accordion-trigger` 對應內容
  - 同步移除 `.accordion-icon.open`
- `[D] 訂房資料` lock 狀態補 `aria-pressed`：
  - 初始 `aria-pressed="true"`
  - JS `apply()` 依 `data-locked` 同步更新 `aria-pressed`
- 更新 `.gitignore`，忽略本地 agent skill、Python 快取，以及本地 Figma variables 匯出檔：
  - `.agents/skills/`
  - `__pycache__/`
  - `*.pyc`
  - `specs/assets/figma-variables.json`
- 已建立 commit：`86bb91a Add 系統操作 collapse-all + lock aria state`

**進行中**:
- `preview/landing.html` 仍是主要實作檔，持續以 incremental 方式把碰到的顏色改成 semantic token / Tailwind theme color。

**下一步應做**:
- 對本次新增的「收合」按鈕做 browser smoke test：
  - 桌面側邊欄：展開多個 accordion → 點「收合」→ 全部內容 hidden、icon 回復未展開狀態
  - 行動側邊欄：開啟 mobile menu → 展開多個 accordion → 點「收合」→ 全部內容 hidden、icon 回復未展開狀態
- 對 `[D] 訂房資料` lock 做 a11y smoke test：點 lock 後確認 `aria-pressed` 與 unlocked/locked 狀態同步。
- 後續若繼續改 `landing.html`，需先讀 `start.md`、`specs/assets/tokens.md`、`specs/icons.md`，並在完成後更新本檔。

**重要決定**:
- `specs/assets/figma-variables.json` 是設計來源匯出檔，但本 repo 已有正式權威文件 `specs/assets/tokens.md`；本輪決定將 JSON 匯出檔視為本地輔助輸入並加入 ignore，不進版控。
- `.agents/skills/` 是本地 Codex/agent 輔助資料，不納入此專案版本控制。
- 本次 commit 訊息沿用既有 Claude Code 語境：英文祈使句 + 必要中文區塊名。

**未解問題**:
- 本次尚未啟動 preview server 或瀏覽器實測；需在下一輪補做 smoke test。
- `preview/landing.html` 仍有大量既存 Tailwind arbitrary hex class，依 Session 20 決策維持 incremental 遷移，不一次大改。

---

## Session 20 交接（2026-05-04）

### 本次完成

#### 顏色 Token 化基礎建設（landing.html）
| 項目 | 說明 |
|---|---|
| `:root` CSS variables | 在 `<style>` 開頭新增 19 個 semantic token（對應 `specs/assets/tokens.md`）：white / surface-default / surface-hover / border-default / border-disabled / text-placeholder / text-secondary / text-default / menu / radio / subitem-selected / brand-400 / brand-active / status-positive / status-negative / chart-blue / accent-pink / accent-light-green / accent-green |
| Tailwind CDN config | 加 `tailwind.config.theme.extend.colors`，把 19 個 token 對到 `var(--color-*)`，未來可直接用 `text-text-default`、`bg-status-positive` 等 semantic class 而非 arbitrary hex |
| `<style>` 區塊 hex 全面遷移 | 用 `replace_all` 對 unique CSS rule patterns 做轉換（`color: #454545;` → `color: var(--color-text-default);` 等 17 種 pattern）；最終 143 個 var refs 在 file 裡 |
| Inline `style="..."` attr 遷移 | 11 個 inline style hex（`style="--c: #2aca18"`、`style="background: #005fcc"` 等）一併轉成 `var(--color-*)` |

剩餘 9 個 bare hex 在 `<style>` 內（保留有理由）：
- 1 個 scrollbar `#d9d9d9`（tokens.md 標明不需 tokenize）
- 4 個 chart cell 用的 Tailwind 預設灰（`#e5e7eb`、`#f3f4f6` × 2、`#374151`）— 非 Figma token
- 1 個純黑 `#000000`
- 4 個 Figma reference 註解內

剩餘 705 個 Tailwind class string 形式（`text-[#xxx]`、`bg-[#xxx]`、`border-[#xxx]`）— **未來 incremental 遷移目標**，每次動到 component 時順手換成 semantic class（`text-text-default` 等）。

#### 流程修正：tokens.md 強制綁定
| 行為改變 | 說明 |
|---|---|
| 承認違反 start.md | L131（Token 檢查）、L163-164（禁區：實作中寫死 hex）、L169-170（禁區：沒讀 tokens.md 就實作）三條規則從 session 14 之前到 session 19 都違反了；累積 705+ 處 Tailwind class string hex |
| 新增 memory `feedback_figma_color_must_lookup_token.md` | 規範：讀 Figma 顏色 → 先查 tokens.md → 用 token 名稱（var 或 semantic Tailwind class）寫；hex 不在 tokens.md 必停下來問使用者 |
| 新增 memory `feedback_color_via_css_var.md` | 規範：寫顏色前先看 `:root --color-*`；新顏色先問使用者命名/值再寫 |
| MEMORY.md 索引更新 | 兩條 memory 都加入索引；上游那條（讀 Figma 必先對照 token）放在前面 |

### 待觀察 / 後續
| 項目 | 說明 |
|---|---|
| 705 個 Tailwind class string hex | 不一次改，但每次動 component 時就近換掉。建議優先改高頻 `text-[#454545]`（378 處）、`text-[#2178CF]` 等 |
| 視覺回歸 | 本次大量 `replace_all`，應該是純色值 1:1 替換（CSS var 解析回原 hex），但 commit 後使用者要做一次 visual smoke test 確認沒有顏色跑掉 |
| `preview/room-booking.html` 未動 | 同樣含大量 hardcoded hex；建議下一個 session 套同一個 `:root` block + Tailwind config 做相同遷移 |
| 自我驗證 checklist 沒做 | start.md L130-136 要求每完成一個 HTML 跑 Token / Icon / RWD / 狀態 / 文字內容 5 項檢查，**從來沒執行過**。下次接手要把這個變成 component 完成 → 強制執行 |

---

## Session 19 交接（2026-05-04）

### 本次完成

#### Aside accordion
| 變更 | 說明 |
|---|---|
| 13 類別預設全部收合 | desk-acc-1 / mob-acc-1 原本帶 `open` icon + 內容無 `hidden`，現皆收合；toggle 行為不變 |

#### [D] 訂房資料：清除 button 連動 lock
| 變更 | 說明 |
|---|---|
| `#orderDataClear` 跟 `#orderDataLock` 連動 | lock red (locked) → button `disabled` + `opacity-40 cursor-not-allowed`；lock green (unlocked) → 可清除 active panel 內所有 input / textarea / checkbox |
| Click handler 內加 guard | `if (lock.dataset.locked === "true") return;` 即使外部強制觸發也不作用 |

#### [D]+[E] inputs 寬度自適應
| 變更 | 說明 |
|---|---|
| 全部 38 個 input / textarea 加 `min-w-0 w-full` | 原本 `flex-1` 因 input 預設 `size=20` 的 intrinsic min-width 無法 shrink；尤其 [E] 在 `xl:col-span-1` 容器內固定寬問題明顯。修完後皆隨容器伸縮 |

#### [E] 正式單與候補單
| 變更 | 說明 |
|---|---|
| 候補單 panel 內容 | 由 placeholder「候補單內容（待 Figma frame 補齊）」→ 純文字「設為候補單」（沿用 `text-xl text-[#454545]` 居中 style） |
| 產生訂單 submit button | 新增於 [D]+[E] grid 之後；`flex justify-end mt-5`，按鈕 `w-full lg:w-[137px] h-[39px] bg-[#454545]`；mobile/tablet 100% 寬，lg+ 為 137px 右對齊；非 fixed/non-sticky |

#### Chip rows：nowrap + 橫向 scroll
| 變更 | 說明 |
|---|---|
| `.rb-filter-tabs` 容器 | `flex gap-4 flex-wrap min-w-0` → `flex gap-4 flex-nowrap overflow-x-auto min-w-0` |
| `#paymentChips` 容器 | `flex flex-wrap gap-2 mb-5` → `flex flex-nowrap overflow-x-auto gap-2 mb-5 min-w-0` |
| `.rb-filter-tab` / `.rb-pay-chip` CSS | 加 `flex-shrink: 0`，避免在 nowrap 容器內被擠壓，確保 overflow-x-auto 真的 scroll |
| `#invMetricToggle` 抽出 | 原本與 chips 同在 `flex justify-between items-center gap-4` 內；現改為 chips row 之後的獨立 sibling block |

#### `#tableInventory` 字級調整
| 變更 | 說明 |
|---|---|
| 標題 `2026 / 02` | `text-base font-semibold` → `text-xl font-semibold`（20px）|
| Table base | `text-xs` (12px) → `text-base` (16px)；棟別/房型/代號/可用庫存數/日期/星期 全部 16px |
| 3-span 指標格子（訂/餘/保） | 保留原樣；inner span 已有 explicit `text-[10px]`，不受 table base 變更影響 |

### 待觀察
| 項目 | 說明 |
|---|---|
| `min-w-0 w-full` 全域影響 | 38 處改動含 [D] 與 [E] 兩 section；若 [D] 內某些短 input（如 6 碼、4 碼欄位）視覺上變太寬，再針對個別欄位加 `max-w-[...]` 收回 |
| 產生訂單 mobile UX | mobile 為 100% 寬時等於底部全寬主按鈕；如果使用者後續要 sticky-bottom，可改 `sticky bottom-0` 加底部安全距 padding |

---

## Session 18 交接（2026-05-03）

### 本次完成

#### UI/UX 審查驗證（封閉 audit）
| 動作 | 說明 |
|---|---|
| 驗證 #3 focus-visible | AI agent 已在 `landing.html:26-33` 與 `room-booking.html:18-26` 加上全域 `:focus-visible` outline（採用 audit 報告 Option A，主色 `#2178cf`）|
| 驗證 #4 prefers-reduced-motion | 全域 wildcard 區塊已加 `landing.html:36-45` 與 `room-booking.html:29-38`，把 animation/transition duration 壓到 `0.01ms !important` |
| 重跑 #1 / #2 / #5 | landing 122/122 imgs 有 alt；3/3 explicit `label[for]` 全部解析到 id；room-booking 14/14 label 接上、`button{cursor:pointer}` 全域 CSS 仍在 |
| 更新 `specs/ui-audit-2026-05-02.md` | header / #3 / #4 / status table 全改為 ✅ FIXED 2026-05-03，附驗證區塊 |
| 更新 memory `project_ui_audit_2026_05_02.md` | 從「5 項待修」改為「全數修完 (2026-05-03 verified)」，MEMORY.md 索引同步 |

> 註：使用者確認此 a11y baseline 階段任務結束，更深入的 a11y/ARIA/contrast 留到 backend 整合階段再做。

#### Landing.html 側邊 aside 文字尺寸統一
| 區塊 | 變更 |
|---|---|
| Section title（系統操作 / 客服 / 檔案） | `text-[13px]` 或 `text-sm font-semibold` → `text-xl font-semibold`（20px）；6 處 = 桌面 3 + 行動 3 |
| 13 類 accordion-trigger（前台作業…）| `text-xs` → `text-base`（16px）；26 處（13 × 2 sidebars）|
| 52 個 leaf 子項目（房間預定 / 自動對帳…）| `text-xs` → `text-base`（16px）|
| 客服 contact list 容器（電話 / 傳真 / 北客服…）| `text-sm` → `text-base`（16px）|
| 檔案 file name span（教育訓練手冊 / 套件）| `text-sm` → `text-base`（16px）|
| 維持 `text-xs`（12px）的 subtitle | 平日 09:00~18:00 / `service@bbnet.gmail.com` / `2018-09-06` / `1.0.13` |

> Tailwind `text-base` 預設即 16px（`1rem`，`<html>` 無 font-size override），無需自訂 token；用既有 utility 即可。

### 待觀察
| 項目 | 說明 |
|---|---|
| Aside 視覺密度 | 子項目從 12 → 16px，aside 整體變高；下次 review 時若使用者覺得太擠，選項：(a) `py-1` → `py-0.5`，(b) leaf items 退回 `text-sm` (14px) 保留 trigger 16px |

---

## Session 17 交接（2026-05-02）

### 本次完成

#### 規格檔
| 檔 | 說明 |
|---|---|
| `components/order-status.md` 補完 | [E] 正式單 panel 內容：付款方式 8-chip + 對應欄位組（依 active accordion `#f7d275` chip 比對）；含「修正歷史」明列三次錯誤 |
| `components/button.md` 補完 | Pill chip variants 表（包含 ID）；新增「2026-05-02 全域 chip 風格統一」區塊：所有 chip 改 transparent + stroke `#d1d1d1` (inactive)、`#f7d275` 黃 (active)，淘汰舊的 `#e1e1e0` 灰底版本 |

#### Memory（持久跨 session）
| 檔 | 摘要 |
|---|---|
| `feedback_check_figma_styles_dont_assume.md` | 讀 Figma 不能只 dump text，要同時抓 `styles.fills/strokes/cornerRadius`；不可從現有 `mode-btn` / `customer-btn` 等前例推顏色 |
| `feedback_chip_variants_yellow_vs_blue.md` | Pill chip 兩個選中 variant：黃 `#f7d275` (`circle-selected-yellow`) = 指示性 chip（付款方式、棟別 filter）；藍 `#005fcc` (`circle-selected`/`circle-one`) = mode/toggle 切換；不可混用 |

#### Landing.html 實作

| 區塊 | 變更 |
|---|---|
| [E] 正式單 panel | 從 placeholder 補完：8 顆付款方式 chip（轉帳/傳真刷卡/票券/前台自付/信用交易/支票/訂金/紅利）+ 各自欄位組 swap；chip 預設選 轉帳；JS toggle `[data-pay-fields]` `.hidden` |
| [E] 付款 chip 顏色 | `#005fcc` 藍 → `#f7d275` 黃（依 Figma `circle-selected-yellow` 1482:26085）；padding 8 → 10、bg `#ffffff` → `transparent`（與 Figma `circle-none-selected` 974:12453 一致） |
| [E] 欄位組對應修正 | 三輪修正：(1) 傳真刷卡 ↔ 信用交易 對調；(2) 票券去除多餘的「票券號碼 第二 input」與整列「授權碼」；(3) 訂金 / 紅利 去除「內容 / 備註」欄位（只留餘額 + 支付金額） |
| [A] 棟別 filter chip | `.rb-filter-tab` 從 `#e1e1e0` 灰底 / 無 border 改成跟 `.rb-pay-chip` 同套（transparent + `#d1d1d1` stroke / `#f7d275` 黃 active），響應使用者「全域 chip 統一」更新 |

### 切換邏輯總結

| UI 動作 | 影響 |
|---|---|
| 訂單類型 = 正式單 | 顯示 `paymentChips` + 對應 `[data-pay-fields]` panel |
| 付款 chip click | toggle `.rb-pay-active`；其他 chip 移除 active；切換對應欄位組顯示 |
| [A] 棟別 chip | 同為 yellow chip 樣式；既有 JS 邏輯（`.rb-active`）不變 |

### 反覆出錯的根因（必須記住）

1. **顏色推前例**：`mode-btn` 是藍 → 我把付款 chip 也預設成藍。修正：每個視覺元件都從 Figma `styles.fills` 取色
2. **跨 accordion 欄位污染**：8 個 accordion text 一起 dump 後，沒有按「哪個 chip 是黃 active」逐一綁定，導致 傳真刷卡 拿到 信用交易 的欄位、票券拿到不存在的「授權碼」、訂金/紅利硬塞「內容/備註」。修正：先抓 `fills == "#f7d275"` 鎖定 active chip，再讀同一 accordion 內後續 labels
3. **記憶斷層**：使用者前次交付的 reference code（calendar）/ 觀察（lock toggle / 客戶 toggle 連動 / 紅綠 lock 規則）我都沒存進 memory，導致使用者反覆糾正。修正：所有「使用者解釋過的規則」都立刻寫進 `~/.claude/projects/.../memory/feedback_*.md`，不論大小

### 尚未實作

| 項目 | 說明 |
|---|---|
| [E] 候補單 panel 內容 | 仍為 placeholder（需 Figma frame） |
| [D] 入住人同訂房人 checkbox 連動 | copy 訂房值 → 入住 + lock 入住 panel；目前 checkbox 無 handler |
| [D] 寄送訂房資訊 checkbox | 純 UI、無功能 |
| 訂房資料 → 訂單條件 整合驗證 | 各區塊獨立運作、未串資料流 |

---

## Session 16 交接（2026-05-01）

### 本次完成

#### 規格檔
| 檔 | 說明 |
|---|---|
| `components/order-data.md` 新增 | [D] 訂房資料 section：3 tabs（訂房 / 入住 / 合約）+ 4-quadrant form + lock toggle 行為 |
| `components/order-status.md` 新增 | [E] 正式單與候補單 accordion：訂單類型 radio（無設定/正式單/候補單）+ panel 切換邏輯；含 [D]+[E] 側欄佈局決策 |
| `components/calendar-simple.md` 改寫 | 兩變體：default vs `data-cal-variant="birthday"`；後者 header 換成 inline `<select>` year/month；disable 規則：default 擋過去、birthday 擋未來；預設值一律「今日」由 JS 注入 |
| `components/location.md` 補 | 國籍切換規則：臺灣 = 縣/市+行政區+街道；外籍 = 國家 select + 單一住所 input |

#### Memory（持久跨 session）
| 檔 | 摘要 |
|---|---|
| `feedback_lock_toggle_input_state.md` | 訂房資料 lock 是 toggle：紅 = inputs disabled、綠 = inputs active；只影響 訂房 / 入住 panels，不影響 合約（合約是 read-only 文字） |
| `feedback_customer_toggle_links_order_tab.md` | 一般/合約客戶按鈕連動 [D] 訂房資料 tab；合約客戶 → 顯示合約 tab + 切到合約 panel；一般客戶 → 隱藏合約 tab |
| `feedback_calendar_use_reference_code.md` | Calendar 元件須照 user 提供的 reference code，不可發明新 picker mode |

#### Landing.html 實作

| 區塊 | 變更 |
|---|---|
| [B] 訂房明細表 | 新增 `日期 / 星期` 兩列 thead（colspan 4 + 置中）、`棟別 / 房型 / 代號 / 可用庫存數` 四欄 + `中秋連假` 註記、`總計` 列 200 改為 `sum(rb-alloc-cap)` 動態計算（borderless 顯示） |
| [B] 訂房明細表 | 退房日欄寬 198→240px；`5 夜` 文字改放 button 旁；calendar dropdown 改 `position: fixed` + getBoundingClientRect 定位以避開 overflow-x-auto 截斷 |
| [B] 訂單明細 footer | 總計列 間數 cell 由左對齊改置中（與 stepper 視覺對齊） |
| [A] 空房查詢/庫存表 清除按鈕 | 加 `#rbAllocClear`，點擊清空所有 `.rb-alloc-input` 並 recalc 總計 |
| [A] 庫存表 可用庫存數 總計 | hardcode 200 改為 sum(rb-alloc-cap)；空房查詢 總計列同樣改為 column-wise sum，分配數隨 input event 即時更新 |
| [B] 客戶 toggle | 客戶類型按鈕同時切 `#contractFields` + 訂房資料 tab；合約客戶按鈕點擊才顯示合約 tab |
| [B] 訂單條件 繳款期限 | 改用 `.rb-cal-cell + .rb-cal-btn + .rb-cal-date` 結構，掛上既有 calendar dropdown |
| [B] 合約專屬群組 | 新的訂房人 從 button → `<select>`（沿用 `.input-group` merged border 樣式） |
| [D] 訂房資料 整段重建 | header（title + lock + 清除 + 兩 checkbox）+ 3 tabs + 4-quadrant form。訂房/入住 為實體 form；合約是 read-only `.contract-display` 底線文字 |
| [D] 國籍 radio | 切換臺灣/外籍：外籍多一列國家 select + 地址簡化為單一「住所」placeholder。兩變體用相同 outer flex（`pt-1.5` 對齊 label）以避免切換時垂直跳動 |
| [D] Calendar simple | 寫死日期清空，由 JS 預設今日；新增 birthday 變體（inline year/month select、現年→1920 遞減；不擋過去、擋未來）；dropdown 加 viewport clamp（`position: fixed` + `getBoundingClientRect` + 邊界 fallback 上方開啟） |
| [D] 性別 radio | accent-color 從 `#888888` 改 `#2178cf`，男/女選中色一致 |
| [D] Lock | 紅 lock = 整 panel inputs/selects/textareas 變灰 disabled、radios/checkboxes 也 `disabled = true`（因 `<label>` 點擊預設會觸發 radio，光 pointer-events:none 不夠）；綠 lock = 全部恢復可編輯。合約 panel 不受影響 |
| [E] 正式單與候補單（新增 accordion） | 訂單類型 radio（無設定 / 正式單 / 候補單）+ 對應內容 panel 切換；無設定 panel 顯示「未設定」置中；正式單 / 候補單 panel 待 Figma frame 補齊 |
| [D]+[E] 側欄佈局 | wrapped in `grid grid-cols-1 xl:grid-cols-3 gap-5`；`<xl` 上下堆疊、`≥xl` 並排（D = `xl:col-span-2`、E = `xl:col-span-1`）。合約 panel 內部 3-col 從 `xl:` 推到 `2xl:` 以避開側欄擠壓 |
| RWD 整體 | 4 個 section wrapper `p-5 → p-3 md:p-5`；訂房資料 white card 同；tabs `gap-7 → gap-3 md:gap-7 + flex-wrap`；input-group `max-width: 100%` + 480px 以下子元素 `flex: 1 1 0`；`.order-panel > * { min-width: 0 }` 讓 grid cell 可縮；訂房 / 入住 panel 由 `md:grid-cols-2` 改 `lg:grid-cols-2`（避免 950px 時 inputs 爆出） |

### 切換邏輯總結

| UI 動作 | 影響 |
|---|---|
| 客戶類型 = 合約客戶 | 顯示 #contractFields + 顯示 合約 tab + 切到合約 panel |
| 客戶類型 = 一般客戶 | 隱藏 #contractFields + 隱藏 合約 tab + 切到訂房 panel |
| 點 lock（紅↔綠） | 訂房 / 入住 panel 內 inputs/selects/textareas/radios/checkboxes/calendar 全部切 disabled；合約 panel 不變 |
| 國籍 = 外籍 | 顯示國家 select + 切到單一「住所」input；同 panel 內 |
| 訂單類型 radio | 切換 [E] 內 `[data-order-type-panel]` panel |
| 生日 calendar | header 為 inline year/month select；過去日 OK，今天 OK，未來 disabled |
| 入住日 / 退房日 / 繳款期限 calendar | header 為純文字月份；過去日 disabled、未來 OK |

### 尚未實作

| 項目 | 說明 |
|---|---|
| [E] 正式單 / 候補單 panel 內容 | 預期使用者後續送 Figma frame，現為 placeholder |
| [D] 入住人同訂房人 checkbox 連動 | 應 copy 訂房 panel 值到入住 panel + lock 入住 inputs；目前 checkbox 無 handler |
| [D] 寄送訂房資訊 checkbox | 純 UI，無功能 |
| 訂房資料 → 訂單條件 整合驗證 | 各區塊獨立運作，未串聯資料流 |

---

## Session 15 交接（2026-04-30）

### 本次完成

#### 規格檔
| 項目 | 說明 |
|---|---|
| `components/table.md` 新增 | 從 Table 元件（486:4370）讀取兩個 variant，寫入完整規格 |
| `type=allocate` 規格 | 643×263，7 欄（checkbox/房型/代號/庫存總數/可用庫存數/保留房數/分配數），rows 38px，footer 可用庫存數 `#e05216`，分配數 Input 可編輯/停用兩態 |
| `type=inventory` 規格 | 1203×303，左固定區（房型/代號）+ 7 日期欄，週末欄 `#ffc0cb` header，資料格 3 色 chip（綠 `#2aca18` / 藍 `#86b7fe` / 橙 `#f28b45`） |
| `components/table-inventory.md` 補 | 新增「訂 / 餘 / 保 metric toggle」區塊，從 Figma `Frame 346` 讀到實際按鈕標籤；`table.md` 早期推測（可用/保留/警示）保留為歷史紀錄 |
| `components/calendar.md` 補 | 新增 RWD 行為（封頂 351 + 等比縮）、`<900px` column 排版說明 |

#### Landing.html 實作
| 項目 | 說明 |
|---|---|
| 兩表切換 | `id="tableAllocate"` / `id="tableInventory"`（後者預設 `hidden`）；`setMode()` 依模式 toggle `.hidden` |
| Allocate row checkbox 互動 | 勾選 → 該列分配數 input 可編輯（`bg-white`）；取消 → 停用（`bg-[#e1e1e0]`） |
| 數量分配 range + button | range max = `Σ` 各列可用庫存數；按鈕點擊 → 把 range value 平均分配到 checked 列，依各列可用庫存數封頂、餘額遞補 |
| 訂/餘/保 metric toggle | Frame 346 三顆按鈕（36×36，r:4，border + active fill 用 `--c` 變數）；點擊 toggle 對應 metric chip 的 `display`；僅庫存表模式顯示 |
| 棟別 chip gap 修正 | `gap-0` → `gap-4`（16px），符合 chip_button_spec |
| `rb-interval-select` CSS 修正 | 基底改為 `bg-white`；`:disabled` 才套 `bg-[#e1e1e0]`（原本反了） |
| 月曆星期標頭移除 | 刪除 HTML 的 `.rb-grid-header` 列（一二三四五六日）及其 CSS；星期縮寫由格內上方文字保留 |
| Calendar 響應式 | grid 由 `repeat(7, 42px)` → `repeat(7, minmax(0, 1fr))`；`.rb-cal-wrap` 加 `max-width: 100%`；day cell 移除固定 `width: 42px`，高度仍 55px |
| `[A]` 區 RWD | `<900px` viewport 切 column（calendar 上、查詢下，`mx-auto`）；右側面板加 `max-[899px]:w-full` |
| Mode toggle 按鈕等寬 | JS 量測「空房查詢 / 庫存表」兩按鈕 rendered width，取 max 套用兩者，避免文字長度不同造成左右視覺不平衡 |

### 切換邏輯總結

| 按鈕 | 月曆模式 | intervalSelect | 表格 | 訂餘保 toggle |
|---|---|---|---|---|
| 空房查詢 | room（拖曳自由選） | disabled → `#e1e1e0` 背景 | tableAllocate 顯示 | 隱藏 |
| 庫存表 | inventory（固定區間） | enabled → 白色背景 | tableInventory 顯示 | 顯示 |

### 尚未實作

| 項目 | 說明 |
|---|---|
| 外層 padding 修正 | rootWrap 仍 `p-3`（12px），應改為 `px-5 pt-3`（左右 20px） |
| Section [B] 訂房資料 Grid | datepicker / checkbox 欄位規格尚未讀取 Figma |
| 其他 sub-page 內容 | 訂單處理等仍為佔位 |

---

## Session 14 交接（2026-04-30）

### 本次完成

| 項目 | 說明 |
|---|---|
| Calendar 元件整合至 [A] 空房查詢 | 取代舊左側 panel（日期輸入 + 間數計數器），改為 Figma 規格月曆（351px 固定寬，r:12，pad 12） |
| Calendar HTML 結構 | 控制列（已選N天 + 今日按鈕 56×34 + interval select 79×36 背景 #e1e1e0）+ 月份導覽列（←40×40 r:4 #b0b0b0 / 2026年01月 md / →）+ 星期標頭 + grid |
| Calendar CSS（Figma 規格） | cell 42×55 r:12；sel-start/end `#2178cf`；sel-mid `#e1e1e0`；today `#ffc0cb`；outside border `#e1e1e0`；全部 scoped `.rb-cal-wrap .day` |
| Grid 間距 | `column-gap: 5px`（Figma：橫向 5px）、`row-gap: 8px`（縱向 8px）；欄 `repeat(7, 42px)` 固定 |
| 模式切換按鈕位置 | 移至右側面板頂端（filter tabs 上方），不放在月曆內 — 與 Figma 示意一致 |
| .mode-toggle CSS | r:28 pill split，active `#005fcc` 白字，inactive 白底 `#454545` |
| initCalendar() JS | 參考 JS 邏輯完全相同（arrow fn → var fn，template literal → 字串拼接）；封裝於函式中防止多次注入衝突；由 `initSubPageBehaviors()` 在 innerHTML 注入後呼叫 |
| dayjs CDN | `<head>` 加入 dayjs@1 + isoWeek plugin |

### Calendar 狀態顏色對照（Figma → 實作）

| 狀態 | Figma | 實作 |
|---|---|---|
| 選中起/終 | — | `#2178cf` fill，白色文字 |
| 選中範圍 | `#e1e1e0` fill | `#e1e1e0` fill |
| 今日 | 特殊日 `#ffc0cb` | `#ffc0cb` fill |
| 跨月 | stroke `#e1e1e0` | border `#e1e1e0`，文字 `#b0b0b0` |
| 預設 | stroke `#d1d1d1` | border `#d1d1d1` |

### 架構規則補充

- `initCalendar()` 內 `window.setCalendarMode = setMode` 仍導出全域，讓右側 btnRoom/btnInventory 切換時改變月曆 mode
- 月曆切換 room ↔ inventory 會改變 intervalSelect disabled 狀態、selStart/selEnd 計算、及 grid 是否追加週列
- `initCalendar()` 開頭有 `if (!document.getElementById('calGrid')) return` 守衛，非房間預定頁不執行

### 尚未實作

| 項目 | 說明 |
|---|---|
| 外層 padding 修正 | rootWrap 仍 `p-3`（12px），應改為 `px-5 pt-3`（左右 20px） |
| Section [B] 訂房資料 Grid | datepicker / checkbox 欄位規格尚未讀取 Figma |
| 其他 sub-page 內容 | 訂單處理等仍為佔位 |

---

## Session 13 交接（2026-04-30）

### 本次完成

| 項目 | 說明 |
|---|---|
| `order-condition.md` 更新 | 重讀元件定義（841:18596）；更新為緊湊單欄版（351×526）：折扣/加購/預付百分比/預付金額輸入區 + 加購/訂金/房價摘要列 + 加購併單 chip + 總計列 |
| 房間預定 sub-page 實裝 | `openPage('房間預定')` 改從 `#tpl-room-booking` 取 HTML；包含 [A] 空房庫存查詢、[C] 訂單條件、[D] 訂房資料三個 section |
| Section [A] 空房與庫存查詢 | Accordion（預設展開）；左：toggle 按鈕組（空房查詢/庫存表）+ 入住/退房日期 + 訂房間數；右：棟別 filter tabs + 庫存表格（7 欄）+ 數量分配 range + 清除/加入訂單按鈕 |
| Section [C] 訂單條件 | Accordion（預設收折）；3 欄：欄 1（人數/到店/發票/統編/抬頭/繳款期限）、欄 2（折扣/總房價/加購/預付百分比/預付）、欄 3（訂單備註/需求備註 textarea） |
| Section [D] 訂房資料 | 靜態表單：國籍 radio（臺灣/外籍）+ 地址（縣市/行政區/街道） |
| sub-page JS 互動初始化 | `initSubPageBehaviors(root)` 在 `showSubPage` 後呼叫；處理 accordion toggle、toggle 按鈕組、filter tabs、訂房間數 ±、range display 同步 |
| PAGE_TEMPLATES 映射 | `var PAGE_TEMPLATES = { '房間預定': 'tpl-room-booking' }`；其他 sub-page 仍顯示佔位文字 |

### 架構規則（新增）

- 每個 sub-page 的互動元件 class 名稱前綴 `rb-`，避免與全域樣式衝突
- 新增 CSS：`.rb-toggle-btn`、`.rb-toggle-btn.rb-active`、`.rb-filter-tab`、`.rb-filter-tab.rb-active`、`.rb-accordion-content.rb-hidden`
- 新 sub-page 的 template：加 `<div id="tpl-xxx" style="display:none">` → 登記到 `PAGE_TEMPLATES` → `initSubPageBehaviors` 補對應行為

### 尚未實作

| 項目 | 說明 |
|---|---|
| 外層 padding 修正 | rootWrap 仍 `p-3`（12px），應改為 `px-5 pt-3`（左右 20px） |
| Section [B] 訂房資料 Grid | datepicker/checkbox 等欄位的第二個 section，規格尚未從 Figma 讀取 |
| 房間預定 calendar popup | 點擊日期輸入欄後的全月曆元件（calendar.md 已有規格，但尚未接 UI） |
| 其他 sub-page 內容 | 訂單處理、各設定類別等仍為佔位 |

---

## Session 12 交接（2026-04-30）

### 本次完成

| 項目 | 說明 |
|---|---|
| 多 tab 支援 | `pageTabsInline` 支援複數 chip 同時存在；點擊各 chip 切換對應 main 內容 |
| Chip 樣式對齊 Figma | 讀取 Frame 220（`1437:47023`）：active = `#f6fafd` + `#86b7fe` 藍邊；inactive = `#ffffff` + `#d1d1d1` 灰邊；radius 6px，padding 6/12 |
| Chip hover | `.page-tab:hover` 加 `#f6fafd` 背景，與 active 同色 |
| Close icon | 改用 `assets/icons/close.svg`（24×24，Figma 規範） |
| 同名頁面去重 | 同一子項目重複點擊不新增 chip，直接切換 active |
| 關閉行為 | 關閉 active tab → 自動切換至相鄰 tab；最後一個關閉 → 回 landing |
| Menu selected 去黃 | `.sub-item-selected` 從 `#f7d275`（黃）改為 `#f6fafd`（與 hover 同）；HTML 預設 class 移除，完全由 JS 控制 |
| `pageTabsInline` 右間距 | `#desktopTopRow` 加 `gap-5`，確保 chip overflow 時不緊貼 function buttons |
| 左 border 細化 | 全部 26 個 `desk-acc-` / `mob-acc-` children 容器從 `border-l-2`（2px）改為 `border-l`（1px） |

### Chip 狀態規則（已實作）

```
pages = [{name, html}]   // 有序陣列
activePage = string|null

openPage(name)       → 不存在則新增，activatePage
activatePage(name)   → 更新 activePage、renderChips、setMenuSelected、showSubPage
closePageByName(name)→ 移除，若是 active 則切至相鄰；若全部關閉回 landing
renderChips()        → 全部重建，active chip 加 .active class
```

### Chip HTML 結構（Figma 對齊）

```
div.page-tab[.active]
  span(pageName)
  button.page-tab-close
    img(icons/close.svg, w-6 h-6)
```

### 尚未實作

| 項目 | 說明 |
|---|---|
| 各子頁面實際內容 | sub-page 仍為佔位文字，room-booking 等尚未實作 |
| 外層 padding 修正 | rootWrap 仍 `p-3`（12px），應改為 `px-5 pt-3`（左右 20px） |

---

## Session 11 交接（2026-04-30）

### 本次完成

| 項目 | 說明 |
|---|---|
| Page tab chip 移至 function icons 同列 | `#pageTabsInline` 插入 `#desktopTopRow`，flex-1 吸收剩餘空間，chip 與 function icons 在同一橫列 |
| 頁面佈局根本重構 | `#desktopTopRow` 從 `rootWrap` 直接子元素移入新增的 `#mainColumn`（詳見下方） |
| `#pageTabs`（main 內舊佔位）移除 | chip 現在只活在 `#pageTabsInline`，`<main>` 不再有獨立 tab bar |

### 佈局重構說明

**原結構（錯誤）**：
```
rootWrap (flex-col)
  ├── mobile top bar
  ├── desktopTopRow   ← 橫跨全寬，aside 與 function icons 不同高
  └── bodyArea
        ├── aside
        └── main
```

**新結構（對齊設計稿）**：
```
rootWrap (flex-col)
  ├── mobile top bar
  └── bodyArea (flex-row)
        ├── aside         ← 移除 self-start，與 mainColumn 等高
        └── mainColumn (flex-col)
              ├── desktopTopRow   ← aside 與 function icons 同起點
              └── main
```

設計稿規範：展開時 aside 與 function icons 同一起始高度；收摺時 compact bar 出現在 desktopTopRow 左端，與 function icons 同列。新結構完全對齊此規範。

### 收摺行為（確認正確）

| 狀態 | 結構 |
|---|---|
| aside 展開 | aside（240px）+ mainColumn（desktopTopRow 只有 function icons + main） |
| aside 收摺 | aside 隱藏（md-collapsed）+ mainColumn（desktopTopRow 左端出現 sidebarCompact，與 function icons 同列） |

### Mobile 不受影響

- Mobile sidebar 仍為 overlay drawer（`#mobileSidebarPanel`，`md:hidden`）
- `#desktopTopRow` 本身已有 `hidden md:flex`，mobile 完全不顯示
- Mobile top bar（logo + hamburger）結構不變

### 尚未實作

| 項目 | 說明 |
|---|---|
| 各子頁面實際內容 | 目前 sub-page 仍為佔位文字，room-booking 等頁面尚未實作 |
| 外層 padding 修正 | rootWrap 目前仍 `p-3`（12px），應改為左右 `px-5`（20px），上 `pt-3` |
| 其餘 function icons | `icons/system` 對應 modal 尚未讀取 |

---

## Session 10 交接（2026-04-30）

### 本次完成

| 項目 | 說明 |
|---|---|
| Aside menu 真實內容替換 | 將 desktop + mobile sidebar 的假資料（主項目一～六）全數替換為 13 個真實類別 |
| 角色過濾邏輯 | 第一個 select 選「總部」時，自動隱藏飯店限定項目；切換回館名則全部顯示 |
| 父層文字中性色 | 父層 accordion trigger 由藍色改為 `#454545`，符合設計稿規範 |
| 子層文字藍色 + 垂直線 | 子層 items 改為 `#2178CF` 藍色；children container 加 `border-l-2 border-[#2178CF]` 垂直藍線 |
| 垂直線縮排調整 | `ml-4`（16px）讓線條縮排在父層文字以內，呈現清楚的階層感 |

### 角色過濾規則

| 類別 | 飯店限定項目 |
|---|---|
| 基本資料設定 | 房型資料設定 |
| 訂房資料設定 | 房間數量設定、專案價格數量設定、數量價格表、通路庫存設定 |
| 財務專區 | 整個類別（總部無此項） |
| 對應設定 | 整個類別（總部無此項） |
| 多國語設定 | 房型設定、套裝設定 |

### HTML 規則補充

- 飯店限定項目：在 sub-item div 或 category div 加 `data-role="hotel"`
- 整類隱藏：在 `.menu-category` div 本身加 `data-role="hotel"`
- 判斷依據：第一個 `[data-role-select]` select 的 option text 含「總部」→ hq 模式
- Desktop / mobile select 切換時互相同步 selectedIndex

### 尚未實作

| 項目 | 說明 |
|---|---|
| Sub-item 點擊切換 selected state | 目前僅靜態 CSS（房間預定預設選中） |
| 其餘 function icons | `icons/system` 對應 modal 尚未讀取 |
| Logo click | 回後台首頁行為 |

---

---

## 待處理問題清單（2026-04-16 整理）

> 以下問題經 .md 全面掃描整理，需逐一確認或補讀 Figma 後解決。

### 二、互動行為未定義

| # | 問題 | 來源 |
|---|---|---|
| I1 | Folder icon 點擊後展開 menu 的樣式（桌面版收折後怎麼再展開） | `sections/mobile-top.md`, `components/folder.md` |
| I2 | Logo 點擊後導航目標 | `sections/mobile-top.md` |
| I3 | Function icons（bulletin / message / person / system）點擊行為 | `layouts/desktop.md` |
| I4 | floatIcons/ai 點擊行為（開啟客服視窗？） | `components/float-icons-ai.md`, `sections/mobile-float-ai.md` |
| I5 | Order badge 的 hover / click / 展開互動 | `components/order.md` |
| I6 | Card link chip 點擊後的導航目標 | `components/card.md`, `components/revenue-trends.md` |
| I7 | `icons/switch`（帳號切換）點擊後的畫面 | `components/account.md` |

### 三、Component 狀態未定義

| # | 問題 | 來源 |
|---|---|---|
| S1 | `input` — number variant 的 +/- 互動行為 | `components/input.md` |
| S2 | `input` — text area 最大高度 / 展開行為 | `components/input.md` |
| S3 | `input` — range（radio selected）觸發方式 | `components/input.md` |
| S4 | `input` — 行動版佈局 | `components/input.md` |
| S5 | `modal` — `icons/eye-closed` icon 尚未定義（密碼 toggle 只有 eye-open） | `components/modal.md` |
| S6 | `system-notifications` — 捲動行為、空狀態、hover/click | `components/system-notifications.md` |
| S7 | `statistics` 各圖表 hover / tooltip | `components/statistics.md` |
| S8 | `folder` — active / 展開狀態外觀 | `components/folder.md` |

### 四、Token 問題

| # | 問題 | 來源 |
|---|---|---|
| T1 | `#D9D9D9`（system-notifications Rectangle 15）不在 tokens.md，與 `Neutral/200 = #D1D1D1` 數值不符，是獨立 token 還是 Figma 誤差？ | `components/system-notifications.md` |

### 五、數值待確認（推測值）

| # | 問題 | 來源 |
|---|---|---|
| V1 | `statistics` 2×2 grid gap：觀測約水平 80px、垂直 20px，未從 Figma 讀取精確值 | `components/statistics.md` |
| V2 | `revenue-trends` Trend details card 間距：推測 16px | `components/revenue-trends.md` |
| V3 | `mobile-float-ai` 的 fixed bottom 值：推測 `bottom-16 right-[65px]` | `sections/mobile-float-ai.md` |

### 六、待補讀 Components（被引用但規格不完整）

| # | 問題 | 來源 |
|---|---|---|
| R1 | `Tooltip` 深色 variant（bg `#4f4f4f`）樣式未確認 | `components/menu.md` |
| R2 | `Modal A`（確定登出）、`Modal B`（帳號切換）兩個 variant 樣式確認 | `components/menu.md` |
| R3 | `Button Y/N` 兩種 variant 色彩規格確認 | `components/menu.md` |
| R4 | `Dropdown aside` sub-item selected/hover 狀態 | `components/menu.md` |
| R5 | `folder` component set 尚未直接從 Figma 讀取（目前是 instance 觀測） | `components/folder.md` |

---

## Session 9 交接（2026-04-16）

### 本次完成

| 項目 | 說明 |
|---|---|
| POS entrance 位置修正 | 從系統操作下方移到客服＋檔案區之後（最底部），桌面與 mobile 同步 |
| POS entrance 文字置中修正 | 原 `flex justify-between` 導致文字偏左；改為 `grid grid-cols-3`，左 icon / 中文字 `text-center` / 右 icon，真正置中 |
| Mobile POS 修正漏失說明 | `replace_all` 因縮排不同未替換到 mobile 段落，已手動補修 |

### 已知問題 / 規則記錄

- **兩套 menu HTML**：桌面 `aside#sidebar`（`hidden md:flex`）與 mobile `aside#mobileSidebarPanel`（`md:hidden`）分開維護，改動重複區塊時必須同步兩處
- **三欄置中佈局**：左 icon + 中央文字 + 右 icon 結構一律用 `grid grid-cols-3`，不用 `flex justify-between`

### 尚未實作

| 項目 | 說明 |
|---|---|
| 其餘 function icons | `icons/system` 對應 modal 尚未讀取 |
| Sidebar sub-item 選中切換 | 目前僅靜態 CSS |
| Logo click | 回後台首頁行為 |
| Main nav hover state | 視覺反饋 |

---

## Session 7 交接（2026-04-16）

### 本次完成

| 項目 | 說明 |
|---|---|
| Figma MCP plugin 重建 | 下載 plugin.zip 解壓到 `~/Code/plugins/plugin/`，重新 import manifest，連線恢復 |
| Modal E — 會員安全管理 tab 樣式修正 | 從 Figma 直接讀取，確認 tab 無外框（strokes 為空），選中僅 `bg-[#e1e1e0]`，未選中 `bg-white` 無任何框線 |
| Tab 寬度修正 | 密碼/暱稱 `w-11`（44px），IP紀錄 `w-[63px]`（63px），字型改 `text-base`（16px） |
| Tab whitespace-nowrap + overflow | 外層 `overflow-x-auto`，內層 `w-max flex gap-3`，標題不換行，過長可水平滑動 |
| `components/modal.md` Tab 列規格更新 | 加入確認日期、正確寬度、無外框說明 |

### 尚未實作

| 項目 | 說明 |
|---|---|
| 其餘 function icons | `icons/system` 對應 modal 尚未讀取 |
| Sidebar sub-item 選中切換 | 目前僅靜態 CSS |
| Logo click | 回後台首頁行為 |
| Main nav hover state | 視覺反饋 |

### 重要規則提醒

- **任何 modal 實作前**：詢問 mobile 滿版或原設計大小
- **Member modal tab**：無外框，選中 `bg-[#e1e1e0]`，未選中 `bg-white`，`whitespace-nowrap` + `overflow-x-auto`
- **全站 HTML 規範**：見 `specs/html-conventions.md`

---

## Session 6 交接（2026-04-15）

### 本次完成

| 項目 | 說明 |
|---|---|
| Modal C — Bulletin vendor JS 補完 | 開啟觸發、tab 切換、row 展開/收合 |
| Modal D — Bulletin Administer 新增 | `icons/message` 觸發，9 tabs，4 欄表格，雙列預設展開，mobile 滿版 |
| Modal A/B mobile 尺寸確認 | 原設計大小置中（不滿版） |
| Table 格線規範 | 僅行間水平線，無垂直線，最後一行無底線，header 保留 `bg-[#fef6ee]` |
| Tab / 控制按鈕列規範 | `whitespace-nowrap` + `w-max` + `overflow-x-auto` 包層 |
| Modal 內 Search Input 規範 | mobile `flex-col` / `w-full`，sm+ 並排 `w-[124px]` |
| 展開內文規範 | div row group，data 行各自 `overflow-x-auto`，展開內文在外側自然填滿 |
| `specs/html-conventions.md` 新建並持續更新 | 全站 HTML 實作規範文件 |

### 尚未實作

| 項目 | 說明 |
|---|---|
| 其餘 function icons | `icons/person-md`、`icons/system` 對應 modal 尚未讀取 |
| Sidebar sub-item 選中切換 | 目前僅靜態 CSS |
| Logo click | 回後台首頁行為 |
| Main nav hover state | 視覺反饋 |

### 重要規則提醒

- **任何 modal 實作前**：詢問 mobile 滿版或原設計大小
- **展開內文**：div row group，不放進 `min-w-max` 表格
- **全站 HTML 規範**：見 `specs/html-conventions.md`

---

## 已完成

| 項目 | 檔案 | 完成日期 |
|---|---|---|
| Design Tokens | `specs/assets/tokens.md` | 2026-04-13 |
| Icon System（87 個） | `specs/icons.md` + `preview/assets/icons/*.svg` | 2026-04-13 |
| menu component | `components/menu.md` | 2026-04-13 |
| 開發規則 | `start.md` | 2026-04-13 |
| Order component | `components/order.md` | 2026-04-13 |
| System notifications component | `components/system-notifications.md` | 2026-04-13 |
| Revenue trends section | `components/revenue-trends.md` | 2026-04-13 |
| Card component | `components/card.md` | 2026-04-13 |
| Input component | `components/input.md` | 2026-04-13 |
| Statistics section | `components/statistics.md` | 2026-04-13 |
| Folder component | `components/folder.md` | 2026-04-13 |
| Mobile layout | `layouts/mobile.md` | 2026-04-13 |
| Mobile top section（Frame 25） | `sections/mobile-top.md` | 2026-04-13 |
| Mobile System notifications section | `sections/mobile-system-notifications.md` | 2026-04-13 |
| Mobile Revenue trends section | `sections/mobile-revenue-trends.md` | 2026-04-13 |
| Mobile Statistics section | `sections/mobile-statistics.md` | 2026-04-13 |
| Mobile floatIcons/ai section | `sections/mobile-float-ai.md` | 2026-04-13 |
| chartjs - diverging preview HTML | `preview/chartjs-diverging.html` | 2026-04-14 |
| chartjs - doughnut preview HTML | `preview/chartjs-doughnut.html` | 2026-04-14 |
| Desktop layout spec | `layouts/desktop.md` | 2026-04-14 |
| Desktop Order status section spec | `sections/desktop-order-status.md` | 2026-04-14 |
| Desktop System notifications section spec | `sections/desktop-system-notifications.md` | 2026-04-14 |
| Desktop Revenue trends section spec | `sections/desktop-revenue-trends.md` | 2026-04-14 |
| Desktop Statistics section spec | `sections/desktop-statistics.md` | 2026-04-14 |
| start.md 修正（Figma 讀取後必須立刻寫檔、交接寫入 progress.md） | `start.md` | 2026-04-14 |
| Texts component | `components/texts.md` | 2026-04-13 |
| Title component | `components/title.md` | 2026-04-13 |
| Logo component | `components/logo.md` | 2026-04-13 |
| Select component | `components/select.md` | 2026-04-13 |
| Select content component | `components/select-content.md` | 2026-04-13 |
| Dropdown aside component | `components/dropdown-aside.md` | 2026-04-13 |
| Function icons component | `components/function-icons.md` | 2026-04-13 |
| Customers service component | `components/customers-service.md` | 2026-04-13 |
| Account component | `components/account.md` | 2026-04-13 |
| Tooltips component | `components/tooltips.md` | 2026-04-13 |
| Button Y/N component | `components/button-yn.md` | 2026-04-13 |
| Modal component | `components/modal.md` | 2026-04-13 |
| Bulletin - vendor component | `components/bulletin-vendor.md` | 2026-04-13 |
| Bulletin - Administer component | `components/bulletin-administer.md` | 2026-04-13 |
| Pagination component | `components/pagination.md` | 2026-04-13 |
| Color/Tab/Yellow token | `specs/assets/tokens.md` | 2026-04-13 |
| 資料夾結構正規化 + spec 檔案 rename | 全部 `*-Specification.md` → `*.md`；`section/`→`sections/`；`layout/`→`layouts/` | 2026-04-15 |

---

## 進行中

| 項目 | 狀態 | 備註 |
|---|---|---|
| HTML 實作 | ⬜ 未開始 | 所有 spec 已就緒，待指示開始 |

---

## 重要決定紀錄

| 日期 | 決定 | 原因 |
|---|---|---|
| 2026-04-13 | 技術棧：HTML + Tailwind CDN + 原生 JS，禁止 build step | 現階段簡單可維護 |
| 2026-04-13 | 主色用 `Color/Surface/Brand-500-Default` token 引用，不寫死 hex | 主色未定案，滾動調整 |
| 2026-04-13 | Color/Text/* 與 Color/Neutral/* 維持拆分 | 各有元件綁定，合併風險高 |
| 2026-04-13 | Radius/* 維持保留 | 各有元件使用 |
| 2026-04-13 | 不做 Typography Token | 已用 Texts component nest 達到同等效果 |
| 2026-04-13 | icons 命名：rase→eraser、person2→person-md、system(方形圓圈)→operation-system、during→duration、helps→help、point→cursor | 語意更明確 |
| 2026-04-13 | Title 元件字重統一為 SemiBold 600 | Figma 舊版為 400，0116 版已統一，以新版為準 |
| 2026-04-13 | Order 寬度為 fill（w-full），非舊版固定 172px | 舊版容器較窄所致，實作用 w-full |
| 2026-04-13 | Card variant 命名 "tend up" 為拼字錯誤，應為 "trend up" | Figma 端建議修正，不影響實作 |
| 2026-04-13 | Input attached-link 的 icon slot 在 component 定義中是 icons/close 佔位，實際 swap 使用 | MCP 回傳 resolved 值，需對照 instance 實際使用情境 |
| 2026-04-13 | Chart 圖表色從 Bootstrap token 分離，建立獨立 Color/Chart/* group | 語意獨立，避免混用 |
| 2026-04-13 | Color/Scrollbar/Default = #D9D9D9，非 Figma variable，HTML 自動生成不需引用 | 捲動條由瀏覽器渲染，Figma 視覺稿用 |
| 2026-04-13 | Mobile 範圍：375px–768px；desktop：769px+ | 最小寬度 375px，無更小尺寸 |
| 2026-04-15 | Modal backdrop 全站統一 `rgba(0,0,0,0.4)`，z-index 60；Figma 的 #d9d9d9 Subtract 僅為設計稿交付示意，不對應 HTML 色值 | 見 `components/modal.md` |
| 2026-04-15 | Modal mobile 尺寸規則：個別設定，施作前詢問；Bulletin modal mobile 滿版，Modal A/B 原設計大小置中 | 見 `specs/html-conventions.md` |
| 2026-04-15 | Table 格線規範：僅行間水平線，無垂直分隔，最後一行不加底線（下方有 border-t 元素時）；header 保留 `bg-[#fef6ee]` | 見 `specs/html-conventions.md` |
| 2026-04-15 | 展開內文用 div row group + 各自 overflow-x-auto；不放進 min-w-max 表格；文字自然向下流動 | 見 `specs/html-conventions.md` |
| 2026-04-15 | Tab 列：whitespace-nowrap + w-max + overflow-x-auto；Search input：mobile w-full / sm+ w-[124px] | 見 `specs/html-conventions.md` |

---

## 新增的 Tokens（本輪）

| Token | Hex | 說明 |
|---|---|---|
| Color/Accent/Green | `#34C759` | 綠色 chip（Input Green variant） |
| Color/Chart/blue | `#86B7FE` | 圖表藍色系列 |
| Color/Chart/purpleRed | `#FF0BD6` | 圖表紫紅色系列（折線） |
| Color/Chart/green | `#34C759` | 圖表綠色系列 |
| Color/Scrollbar/Default | `#D9D9D9` | 捲動條（視覺稿用，HTML 自動） |

---

## 待辦（依 start.md 分層順序）

### Components 層 ✅ 全部完成
- [x] menu、Order、System notifications、Card、Input、Folder
- [x] Texts、Logo、Select、Select content、Dropdown aside、Title
- [x] Customers service、Account、Tooltips、Button Y/N、Modal
- [x] Bulletin - vendor、Bulletin - Administer、Pagination、Function icons
- [x] chartjs - bar、chartjs - line（spec md 完成）
- [x] chartjs - diverging、chartjs - doughnut（preview HTML 完成，spec md 待補）

### Sections 層 ✅ 全部完成
- [x] Mobile：mobile-top、mobile-system-notifications、mobile-revenue-trends、mobile-statistics、mobile-float-ai
- [x] Desktop：desktop-order-status、desktop-system-notifications、desktop-revenue-trends、desktop-statistics

### Layout 層 ✅ 全部完成
- [x] `layout/mobile-Specification.md`
- [x] `layout/desktop-Specification.md`

### 實作層 ⬜ 未開始
- [ ] desktop layout HTML（`preview/desktop.html`）
- [ ] mobile layout HTML（`preview/mobile.html`）

---

## 未解問題

| 問題 | 狀態 |
|---|---|
| `Color/Surface/Secondary`（#F9E616 鮮黃）語意未確認 | ⬜ 待問 |
| `Color/Surface/Accent`（#42EBE9 青色）語意未確認 | ⬜ 待問 |
| `Spacing/18`、`Spacing/76` 非 4px 格線，用途未說明 | ⬜ 待問 |
| doughnut 官網圖例（#2ACA18）vs 扇形（#34C759）不一致 | ✅ 已對應不同 token，設計端未修正 |
| chartjs - line 圖例框（#F44DF4）vs 折線（#FF0BD6）同系不同值 | ✅ 各有獨立 token |

---

## 交接筆記區

### 本次進度交接（2026-04-15 session 5）

**已完成**：
- 讀取 Figma `Menu states - Interactions`（`194:3863`）：
  - 解析 3 個 menu 互動狀態：hover tooltip、登出 modal flow、帳號切換 modal flow
  - 解析 7 個 Tooltip 標注（確認 md 系列為設計稿專用，不實作）
  - 解析 2 個 Modal instance（確定登出 / 帳號切換）
- 更新規格文件：
  - `components/menu.md`：新增「## Interactions」完整互動規格區段
  - `components/tooltips.md`：新增 md 系列設計稿標注說明，明確標示不實作到 HTML
  - `components/dropdown-aside.md`：修正子項目文字色（`#454545` → `#2178cf`）、選中背景（`#e1e1e0` → 透明顯示 `#f7d275`）
- 確認 `components/modal.md`、`components/button-yn.md` 已完整，不需重讀
- `preview/landing.html` 實作兩個 modal 互動：
  - Desktop sidebar / compact bar / mobile panel 的 logout、switch icon 加 ID
  - Desktop sidebar logout icon 加 hover tooltip（dark `#4f4f4f`，箭頭向下）
  - Modal A「確定登出？」：header + body + 取消/確定 footer，水平垂直置中
  - Modal B「帳號切換」：header + 暱稱 Select + 密碼 Input + 取消/確定 footer
  - 關閉方式：close button、取消按鈕、backdrop click、Escape 鍵
- 資料夾正規化（session 4 已完成，本次確認無遺漏）

**進行中**：
- landing.html 互動功能持續補齊，對應 Menu states - Interactions 規格

**下一步應做**：
1. 讀取 Account component（`components/account.md` 可能需補充 hover / tooltip 狀態）
2. 讀取 Dropdown aside 互動規格（sub-item click → selected state 切換邏輯）
3. 確認 landing.html 的 sub-item 點擊是否實作 selected state 切換（目前只有靜態 CSS）
4. 繼續補齊其他按鈕互動（logo click、主項目 hover state）
5. chartjs-diverging / chartjs-doughnut component spec md 補齊

**重要決定**：
- Tooltips `md` 系列（md up/down/left/right）確認為設計稿標注用，不實作到 HTML
- Modal 置中：`position: fixed; inset: 0; display: flex; align-items: center; justify-content: center`
- 三個觸發點（desktop sidebar / compact bar / mobile panel）共用同一 modal，用 ID 統一管理

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- desktop 版 floatIcons/ai 是否也應顯示
- logo click 是否需要實際連結（目前純視覺）

---

### 本次進度交接（2026-04-15 session 4）

**已完成**：
- `preview/landing.html` 補齊 mobile sidebar modal function icons：
  - 新增 `Function icons` 列（bulletin / message / person-md / system），位於 modal header 與 account row 之間
  - badge 值依 Figma "Landing page (mobile) - 0414 menu modal"：bulletin=99、message=0、person-md=99+、system=99+
  - 四圖示 `justify-around`，橙色 `#EF6F25` badge，底部 border 分隔 account 區
- 資料夾結構正規化（依 start.md 規範）：
  - 所有 `*-Specification.md` → `*.md`（移除多餘後綴）
  - `section/` → `sections/`（改為複數，符合 start.md 專案結構）
  - `layout/` → `layouts/`（改為複數，符合 start.md 專案結構）
  - 舊的空資料夾 `section/`、`layout/` 已刪除
- `specs/progress.md` 所有檔案路徑已同步更新

**進行中**：
- landing.html 視覺細節持續對齊 Figma

**下一步應做**：
1. 瀏覽器測試 desktop sidebar collapse/expand + mobile modal 行為
2. 確認 mobile AI 浮動按鈕是否在 desktop 也需顯示（目前 `md:hidden`）
3. chartjs-diverging / chartjs-doughnut component spec md 補齊
4. 確認 Color/Surface/Secondary (#F9E616)、Color/Surface/Accent (#42EBE9) 語意

**重要決定**：
- spec 檔案命名：一律不加 `-Specification` 後綴，資料夾分層已足夠說明語意
- 資料夾使用複數：`sections/`、`layouts/`（與 start.md 專案結構一致）

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- desktop 版 floatIcons/ai 是否也應顯示

---

### 本次進度交接（2026-04-14 session 3）

**已完成**：
- `preview/landing.html` 佈局重構與功能實裝：
  - **Select 實裝**：兩個 `<button>` 改為真正的 `<select>` 元素（desktop sidebar + mobile panel），各有 3 個假字選項
  - **Accordion 實裝**：系統操作中有 `down.svg` 的項目（主項目二、三、五）改為真正展開/收起 accordion，圖示旋轉 180° 回饋；主項目一、四、六 維持 `right.svg` 連結
  - **客服 / 檔案**：維持靜態顯示（確認不做 accordion）
  - **Layout 結構重構**：
    - `rootWrap` 改為 `flex flex-col gap-3 p-3`（移除 `absolute` 定位 aside，12px 邊距自然由 flex 提供）
    - `aside` 改為 flow 中的 flex item（`hidden md:flex w-[240px]`），不再 absolute
    - `bodyArea`（`flex flex-col md:flex-row gap-3`）讓 aside 與 main 間有 12px gap
    - `desktopTopRow`（`hidden md:flex items-center`）內 `sidebarCompact`（左）+ `topWrap ml-auto`（右），實現收折後自然 flex-between
    - Mobile topbar 改為 `flex justify-between`（logo 左、menu 按鈕右）
  - **Sidebar 收折 bug 修正**：
    - 舊版 `expand()` 直接 `remove('hidden')` 導致 mobile 寬度下 sidebar 殘留
    - 改為 `@media (min-width:768px) { #sidebar.md-collapsed { display: none !important } }`
    - JS 只操作 `md-collapsed` class，`hidden` 永遠保留（保護 mobile 隱藏）
  - **Mobile panel** 補齊客服 / 檔案區塊

**進行中**：
- landing.html 視覺細節持續對齊 Figma

**下一步應做**：
1. 瀏覽器測試 desktop sidebar collapse/expand 行為
2. 確認 mobile AI 浮動按鈕是否在 desktop 也需顯示（目前 `md:hidden`）
3. chartjs-diverging / chartjs-doughnut component spec md 補齊
4. 確認 Color/Surface/Secondary (#F9E616)、Color/Surface/Accent (#42EBE9) 語意

**重要決定**：
- Compact bar（收折後頂部列）不顯示 select，只保留 logo / elaon999 / 登出 / 切換 / 展開按鈕
- Sidebar 的 mobile/desktop 可見性分離：`hidden` 管 mobile，`md-collapsed` 管 desktop 收折

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- desktop 版 floatIcons/ai 是否也應顯示

---

### 本次進度交接（2026-04-14 session 2）

**已完成**：
- `preview/landing.html` 產出（desktop + mobile 單一檔案，Chart.js 4 動態圖表）
- Component 修正同步（從 Figma 讀取）：
  - `folder.svg` 建立（原缺失）
  - Customers service：icon 改 `service.svg`、layout 改垂直（QR 上、資訊下）、字體 16px、email 修正為 `service@bbnet.gmail.com`、人名 紅彤林→紅樹林
  - File download：icon 改 `download.svg`、字體 16px、日期 2018-09-06、layout 修正
  - Float icons/ai：內部 icon 尺寸 `w-5→w-6`
- Title icon 全面替換（從 desktop/mobile canvas 讀取）：
  - 訂單快覽 → `order-info.svg`
  - 營業資訊 → `dashboard.svg`
  - 統計圖表 → `chart.svg`
  - 客服 → `service.svg`（已含上述）、檔案 → `download.svg`
- 客服 QR Code 圖片：`assets/images/service_line.png` 儲存，HTML 已替換
- Revenue trends Card 4 更新（0414 frame）：今日超賣 → 平均客房收益，值 170，trend-down-green
- Card 1 Input 文字：「昨日比較」→「日營收」
- Account icon gap 修正：`gap-1(4px)` → `gap-3(12px)`
- Sidebar collapse 功能實作：
  - fold 按鈕點擊 → sidebar 變橫向 compact bar（logo / 使用者名稱 / 登出 / 切換 / Folder）
  - root wrapper 切換為 `flex-col`，main content 自動全寬展開
  - compact bar 右端 folder 按鈕可展開回原始 240px 側欄

**進行中**：
- landing.html 視覺細節持續對齊 Figma

**下一步應做**：
1. 瀏覽器測試 sidebar collapse 行為（desktop）
2. 確認 mobile AI 浮動按鈕是否需在 desktop 也顯示（Figma desktop frame 中有 floatIcons/ai at x:1372）
3. chartjs-diverging / chartjs-doughnut component spec md 補齊（目前只有 preview HTML）
4. 確認 Color/Surface/Secondary (#F9E616)、Color/Surface/Accent (#42EBE9) 語意
5. 確認 Spacing/18、Spacing/76 用途

**重要決定**：
- desktop + mobile 合併在 `preview/landing.html` 單一檔案，使用 `md:` breakpoint 區分
- Sidebar collapse 為橫向 compact bar（非隱藏）：保留外框與關鍵元素
- Chart.js 4 動態渲染，非靜態圖片

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- desktop 版 floatIcons/ai 是否也應顯示（目前 `md:hidden`）

---

### 本次進度交接（2026-04-14）

**已完成**：
- 讀取 chartjs-diverging、chartjs-doughnut，產出 preview HTML（`preview/chartjs-diverging.html`、`preview/chartjs-doughnut.html`）
- 讀取 Desktop Landing page - 0116，完整解析結構、token、間距
- 產出 `layout/desktop-Specification.md`
- 產出 desktop section specs × 4（order-status、system-notifications、revenue-trends、statistics）
- 確認 mobile sections × 5 昨天已完成，無需重做
- 修正 `start.md`：新增「Figma 讀取後必須立刻寫檔」規則 + 交接改為直接寫入 progress.md（不再依賴使用者手動貼上）
- 建立記憶系統（`MEMORY.md` + 3 個 memory 檔案），修補跨 session 記憶漏失問題

**進行中**：
- 無

**下一步應做**：
1. 開新 session，讀取 `start.md` 跑開工 checklist
2. 讀 `layout/desktop-Specification.md` + 所有 `section/desktop-*` + 相關 component specs
3. 實作 `preview/desktop.html`（desktop 完整版型）
4. 實作 `preview/mobile.html`（mobile 完整版型）
5. 補齊 `components/chartjs-diverging-Specification.md` 與 `components/chartjs-doughnut-Specification.md`（目前只有 preview HTML）

**重要決定**：
- `start.md` 已更新：Figma 讀取後必須立刻寫入 `.md`，不允許只顯示在對話中
- 交接筆記改為 Claude 直接寫入 `progress.md`，不再依賴使用者貼上
- Memory 系統已建立，下個 session 開始時會自動載入專案背景

**未解問題**：
- `Color/Surface/Secondary`（#F9E616）、`Color/Surface/Accent`（#42EBE9）語意未確認
- `Spacing/18`、`Spacing/76` 用途未說明
- chartjs-diverging / chartjs-doughnut 的 component spec md 尚未正式產出（只有 preview HTML）
- desktop Statistics 右下角 doughnut 旁的留白是否為預留空間？設計意圖未確認

---

### 本次進度交接（2026-04-13）

**已完成**：
- tokens.md 新增 Color/Accent/Green、Color/Chart/* × 3、Color/Scrollbar/Default
- 完成 components：Order、System notifications、Revenue trends（FRAME）、Card、Input、Statistics（FRAME）
- 確認 Title 字重統一為 SemiBold 600
- 確認 Mobile 斷點：375–768px

**進行中**：
- Mobile 佈局 frame 讀取（Figma 已選取，MCP 回傳資料超過 token 上限，正在分段讀取）

**下一步應做**：
1. 分段讀取 mobile 佈局 frame（用 Bash + jq 從暫存檔解析）
2. 產出 `layout/mobile-Specification.md`
3. 進入 sections 層：讀取各 section 組合，產出 `section/*.md`
4. 最終產出 HTML 預覽

**重要決定**：
- Mobile 最小寬度 375px，無更小尺寸
- 769px+ 為 desktop，稍後另行處理
- 內容與 desktop 相同，差異在佈局

**未解問題**：
- Mobile 佈局資料過大，讀取中
