# Component Specification: 分館資料文案 SunEditor（`state=branch-basic-info` 文案卡片專用）

**Figma Node ID**（7 個示意 frame，同批讀取）：

| # | 狀態 | Node ID |
|---|---|---|
| 001 | 全無資料預設值 | `2129:79547` |
| 002 | 從 001 點編輯，僅繁中語系 | `2129:79576` |
| 003 | 002 完成編輯與成功儲存 | `2129:79664` |
| 004 | 複數語系時，tabs 與翻譯按鈕出現 | `2129:79756` |
| 005 | 004 完成編輯與成功儲存 | `2129:79859` |
| 006 | 多語系未有值時 | `2129:80016` |
| 007 | 繁中語系為空值時，翻譯按鈕 disabled + tips | `2129:80150` |

**讀取日期**：2026-07-29
**使用位置**：`components/lodging-branch-info-modal.md` 的 4 張文案卡片（飯店介紹文案 / 飯店設施文案 / 飯店提醒事項文案 / 飯店交通文案），結構與行為完全相同，本檔只用「飯店介紹文案」示意稿讀取，套用到其他 3 張卡片。

---

## 概述

這是分館資料編輯 modal 內文案卡片的「編輯」按鈕點擊後出現的 inline 富文本編輯元件（**不是 modal**，見 `components/lodging-branch-info-modal.md` 「編輯互動」段）。核心是 SunEditor（第三方富文本編輯器），疊加語言 tab + 翻譯按鈕的多語系編輯層。

本輪（2026-07-29）明確拍板：**不安裝、不串接真實 SunEditor**，用 `<textarea>` 佔位；但先把套件細節、按鈕清單、多語系行為規則完整定案，減少之後真正串接時的返工。

---

## 7 個狀態結構

### 001 - 全無資料預設值

```
Frame 277 (bg Color/Neutral/75, border Color/Border/Default, radius 12, padding 20)
- 空狀態顯示區 (Input 樣式, bg Color/Neutral/75, border Color/Neutral/200, radius 6)
  - "尚未填寫"（置中）
- 編輯 pill 按鈕
```

單一語言（尚未設定多語系）情境下的空狀態，無 tabs。

### 002 - 點擊編輯後開始編輯，僅繁中語系

```
Frame 277
- "繁體中文" 標籤（單語言時固定顯示，樣式等同多語系版的 active tab：文字 Color/Neutral/800 + 底線）
- SunEditor instance（見下方「SunEditor 工具列」段）
- 卡片內建 Footer："取消" / "儲存"
```

單一語言時不出現 tabs 列與翻譯按鈕，只有這行固定的語言標籤。

### 003 - 002 完成編輯與成功儲存

```
Frame 277
- 橘字 "已儲存內容" 標籤（Color/Brand/Brand-400）
- 唯讀顯示框（Input 樣式，bg Color/Neutral/75，渲染已儲存內容的 HTML，見下方「儲存後渲染」段）
- 編輯 pill 按鈕
```

### 004 - 複數語系時，tabs 與翻譯按鈕出現

```
Frame 277
- 語言 tabs 列："繁體中文" / "英文"(active 示意) / "韓文"
- 翻譯按鈕列（本例 active tab = 英文）："從繁中譯為英文" + 翻譯按鈕（enabled 態）
- SunEditor instance（顯示英文語系內容）
- 卡片內建 Footer："取消" / "全部儲存"
```

### 005 - 004 完成編輯與成功儲存

```
Frame 277
- 語言 tabs 列（維持顯示，active = 英文）
- 橘字 "已儲存內容" 標籤
- 唯讀顯示框（顯示目前 active tab 語言的已儲存內容）
- 單顆編輯按鈕
```

### 006 - 多語系未有值時

```
Frame 277
- 語言 tabs 列（繁體中文/英文/韓文，active = 英文）
- 空狀態顯示區 "尚未填寫"
- 編輯 pill 按鈕
```

證實：**tabs 是否顯示只跟「語言數量」有關，跟「內容是否填寫」無關**（2026-07-29 使用者確認，見下方「語言 tab 資料來源」段）。

### 007 - 繁中語系為空值時

```
Frame 277
- 語言 tabs 列（active = 英文，此例）
- 翻譯按鈕列："從繁中譯為英文" + 翻譯按鈕（disabled 態，繁中為空值）
- Tooltip（hover 觸發，非常駐）："請先填寫繁體中文"
- SunEditor instance
- 卡片內建 Footer："取消" / "全部儲存"
```

---

## SunEditor 工具列（icon 清單，本機已全數存在，不需補匯出）

```
Row 1: 復原(rotate-to-left) / 重做(rotate-to-right)
Row 1 續: Format 下拉(icons/down) / 粗體(bold) / 斜體(italics) / 底線(underline) / 刪除線(s-slash)
Row 2: 文字顏色(word-color) / 反白色(filled-A)
Row 2 續: 編號清單(number-list) / 減縮排(outdent) / 增縮排(indent)
Row 3: 對齊(ckeditor/align) / 分隔線(horizontal-line) / 引言(quote)
Row 3 續: 連結(ckeditor/link-bold)
Row 3 續: 清除格式(eraser)
Row 3 續: 原始碼檢視(SunEditor/code)
```

工具列每個按鈕群組是獨立小容器（bg `Color/Neutral/0`，border `Color/Border/Default`，radius 6），群組間有間距，符合 SunEditor 官方預設工具列的分組視覺。

### Format 下拉選單內容（2026-07-29 拍板）

**完全遵循 SunEditor 官方預設**，不客製：官方預設 Format 下拉是 `Paragraph` + `Heading 1`~`Heading 6`。文字大小、標題項目編號、顏色跟其他隨附功能全部照 SunEditor 原套件設定原封不動移植，不額外設計。

### 文字顏色 / 反白色色票（2026-07-29 拍板）

先套用 SunEditor 官方預設色票，不客製 tokens。驗收方式：正式串接後肉眼檢查色票視覺是否突兀、是否難以閱讀；差異可接受就不處理，只有明顯破壞整體介面時才回頭討論獨立 token。

### 連結按鈕（2026-07-29 拍板）

本輪佔位階段不實作（無此按鈕功能）。正式串接 SunEditor 時，直接沿用 SunEditor 原生的小型浮動輸入面板，不另外設計 Modal。

### 原始碼檢視按鈕（2026-07-29 拍板）

本輪 textarea 佔位階段不接行為。正式版保留並切換成 HTML 原始碼編輯模式（沿用舊系統既有功能）。**安全性要求**：前端僅作基本輸入限制，**後端儲存前必須再次過濾危險標籤、事件屬性（`onclick` 等）及不安全網址（如 `javascript:`）**，不可只信任前端檢查。

---

## 翻譯按鈕規則（2026-07-29 拍板，取代 Stage 1 讀取時的疑點）

| 條件 | 行為 |
|---|---|
| 目前 active tab = 繁體中文 | **完全不顯示翻譯按鈕**（不是 disabled，是整個隱藏）。理由：「從繁中翻譯成繁中」不是可執行行為，disabled 會讓使用者誤以為缺少某個條件 |
| 目前 active tab = 其他語言（英文/韓文/...） | 顯示翻譯按鈕，文案固定「從繁中譯為 [目前語言]」 |
| 繁體中文有內容 | 翻譯按鈕 enabled（bg `Color/Brand/Brand-100`，border `Color/Brand/Brand-300`） |
| 繁體中文無內容 | 翻譯按鈕 disabled（bg `Color/Brand/Brand-100` 50% 透明，border `Color/Brand/Brand-50`），hover 顯示 tooltip「請先填寫繁體中文」（bg `Color/Neutral/700`，白字，遵循 `start.md` 「Tooltip 視窗自適應」規則，開啟時夾取在螢幕內） |

### 翻譯按鈕點擊行為（本輪，2026-07-29 拍板）

**不接真正的翻譯 API**。點擊後：

1. 顯示 Toast「翻譯功能尚未串接」
2. 目前 tab 的內容維持不變（**不可**把繁體中文原文複製貼到目前語言欄位，使用者可能誤以為那是翻譯結果甚至直接儲存）

**Toast 元件**：專案目前沒有 toast pattern，本輪比照既有 tooltip 深底樣式新增最小可用版本：bg `Color/Neutral/700`，白字，置中或畫面下方短暫顯示後自動消失（~2-3 秒），不阻塞操作。之後若有其他頁面需要 toast，可直接複用這個 pattern，不必重新設計。

---

## 語言 tab 資料來源（2026-07-29 拍板）

語言 tab（繁體中文/英文/韓文...）**不是這張卡片自己管理的清單**，是由使用者在其他地方（多語系設定/申請多語系類型）決定要開啟哪些語系後才會出現。目前實作依 UI 示意稿的靜態範例渲染，實際語言清單由後端資料驅動，前端不寫死。

**語言數量（決定 tabs 顯示與否）跟「內容是否填寫」是兩組獨立資料**（2026-07-29 使用者確認）：tabs 顯示與否只看啟用語系數量；每個語系各自是否有內容填寫，不影響 tabs 是否出現（呼應 006 的驗證）。

---

## 全部儲存 / 取消行為（2026-07-29 使用者補充規則，重要）

因為多語系情境下 Footer 按鈕叫「全部儲存」而非逐語言各自儲存，必須實作以下跨 tab 暫存規則：

| 行為 | 規則 |
|---|---|
| 切換語言 tab | 目前 tab 已編輯但尚未送出的內容，保留在前端本地暫存（local state），不因切換到別的 tab 而遺失 |
| 「全部儲存」 | 一次把所有語系目前的本地暫存內容一起送出提交 |
| 「取消」 | 放棄本次編輯 session 內所有語系的修改，全部回復到上次已成功儲存的內容 |
| 單一語言情境 | 邏輯相同，只是只有一個語系需要暫存，Footer 文案用「儲存」不用「全部儲存」 |

---

## 儲存後渲染（2026-07-29 拍板）

儲存後的唯讀顯示框（狀態 003 / 005）**必須保留 SunEditor 的 HTML 格式渲染**（粗體、清單、對齊等），不能一律當純文字顯示。前端渲染這段後端回傳的 HTML 內容時，視為已通過後端過濾的可信內容（見上方「原始碼檢視按鈕」段的後端過濾要求），前端不需要另外重複做 sanitize，但也不應該對未知來源內容照單全收，如果之後這個顯示框有其他資料來源（非本卡片自己儲存），需要另外評估。

---

## SunEditor 套件研究（外部套件資訊，非 Figma 來源，實際串接前需重新核對官方文件）

2026-07-29 使用者拍板：本輪不安裝不串接，但先確認套件版本/引入方式/必要 plugins/輸入輸出格式，減少後續返工。以下基於套件公開資訊整理，**不是 Figma 讀取結果，實際串接時必須重新查證官方文件與當時最新版本號**：

| 項目 | 目前已知資訊 |
|---|---|
| 套件名稱 | `suneditor`（npm，作者 JiHong Lee，MIT license） |
| 引入方式 | 原生 vanilla JS UMD 版本，可用 `<script>` CDN 標籤引入（例如 jsdelivr/unpkg），不需要 bundler，掛載後產生全域 `SUNEDITOR` 物件；符合本專案「當前不要用需要 build step 的特性」的限制，跟 Tailwind Play CDN 並存可行 |
| CSS | 需另外引入對應的 `suneditor.min.css`，跟 JS 檔案版本必須配對一致 |
| 初始化 API | `SUNEDITOR.create(textareaElementOrId, optionsObject)`，直接把既有 `<textarea>` 升級成編輯器，回傳 editor instance |
| 輸出格式 | `.getContents()` 回傳目前內容的 HTML 字串 |
| 輸入格式 | 初始化時 textarea 的 value，或用 `.setContents(html)` 設定 |
| 工具列設定 | `buttonList` option 是陣列，可逐項對應本次示意稿讀到的按鈕分組：`['undo','redo']`, `['formatBlock']`, `['bold','underline','italic','strike']`, `['fontColor','hiliteColor']`, `['list','indent','outdent']`, `['align','horizontalRule','blockquote']`, `['link']`, `['removeFormat']`, `['codeView']`；這組排列跟示意稿工具列高度吻合，研判設計稿本身就是照這顆套件的預設工具列畫的 |
| Plugins | 示意稿讀到的按鈕都屬於 SunEditor 核心內建功能，不需要額外安裝圖片/影片/表格等進階 plugin 套件（這些示意稿都沒出現） |
| 版本 pin | 待實際串接時查證當下最新穩定版號並鎖定明確版本（不可用 `@latest` 這種浮動版號上生產），避免套件更新造成 UI 或行為無預警改變 |
| 取代 textarea 的實作範圍 | 屆時只需要把本檔「SunEditor instance」段落的 markup 換成 `SUNEDITOR.create()` 掛載結果，多語系 tab 切換、翻譯按鈕、全部儲存/取消的暫存邏輯不需要重寫，只是把每個語言各自對應的 editor instance 換成真正的 SunEditor（目前 textarea 佔位版本一樣是「每個語言一個獨立 instance」） |

---

## Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| 語言 tab active 文字 | 16px Regular | `Color/Neutral/800` |
| 語言 tab inactive 文字 | 16px Regular | `Color/Neutral/400` |
| 語言 tab active 底線 | - | `Color/Neutral/400` |
| 已儲存內容標籤 | 16px Regular | `Color/Brand/Brand-400` |
| 翻譯按鈕 enabled bg | - | `Color/Brand/Brand-100` |
| 翻譯按鈕 enabled border | - | `Color/Brand/Brand-300` |
| 翻譯按鈕 disabled bg | 50% 透明 | `Color/Brand/Brand-100` |
| 翻譯按鈕 disabled border | - | `Color/Brand/Brand-50` |
| 翻譯按鈕列外框 | - | `Color/Brand/Brand-200` |
| Tooltip / Toast bg | - | `Color/Neutral/700` |
| SunEditor 工具列群組 bg/border | - | `Color/Neutral/0` / `Color/Border/Default` |
| SunEditor 內容區 border | - | `Color/Neutral/200` |
| SunEditor placeholder demo 文字色 | - | `Color/Neutral/800` |

---

## Token gaps / unresolved

- 無。所有色值（`#fdebd7`、`#f7b57a`、`#fad4ae`、`#fef6ee`、`#4f4f4f`、`#262626`、`#f28b45` 等）皆已對照到 `tokens.md` 既有 token。

---

## 未讀取 / 待補項目

- 這顆卡片在 `state=branch-basic-info` 640~767px / <=639px RWD 版本下，SunEditor 工具列窄寬度換行行為未個別示意，暫定工具列群組用 `flex-wrap` 因應變窄，待有 RWD 示意稿再核對
- Toast 元件目前只有這裡定義的最小版本，尚未在其他頁面驗證過，之後若有其他 toast 使用情境需要一併檢視是否要收斂成正式共用元件
- 正式串接 SunEditor 的確切版本號、CDN URL、`buttonList` 完整設定值，待實際安裝時查證（見上方「SunEditor 套件研究」段）
