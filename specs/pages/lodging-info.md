# Page: 民宿資料 (lodging-info)

**Figma 來源 (read date 2026-07-29, Session 114)**:
- Desktop: FRAME `2119:78284`，1440x943.48
- Mobile~tablet: FRAME `2126:76269`，767x1646
- Mobile: FRAME `2126:76796`，375x2162

**實作**: 尚未開始（本檔為 spec-only，`preview/lodging-info.html` 尚未產出）
**狀態**: 分館卡片區 3 張卡 + 相關 modal / 元件已全數讀取定案（見下方
「Component 規格」），頁面容器本身（外層 padding、卡片間 gap、頂部工具列
精確佈局）尚未針對容器單獨讀取，見下方「Figma 未定義」。

---

## Component 規格（本頁大量依賴以下已定案的獨立元件檔，不重複記錄）

| 區塊 | 規格位置 |
|---|---|
| 分館卡片區 - 基本資訊卡 | `components/lodging-branch-basic-card.md` |
| 分館卡片區 - 須知與聲明卡 | `components/lodging-branch-notice-card.md` |
| 分館卡片區 - 網域安全卡 | `components/lodging-branch-domain-security-card.md` |
| 「修改/設定」pill 開啟的分館資料編輯 modal | `components/modal.md` `state=branch-basic-info` -> `components/lodging-branch-info-modal.md` |
| 圓形照片觸發器開啟的照片管理 modal | `components/modal.md` `state=photo-gallery` |
| 文案卡片 / 須知與聲明卡內的富文本編輯 | `components/lodging-branch-suneditor.md` |
| 頁面右上角「多語系狀態」按鈕開啟的總覽 modal | `components/modal.md` `state=multilingual-status` |
| 須知與聲明卡的分類 folder-tab pattern | `specs/html-conventions.md` 「Folder-tab 分類頁籤」 |

---

## 使用者確認事項（散落各 component 檔的重大決策彙整索引）

1. 分館名稱重複「分館名稱一」是佔位文字示意，將來後端渲染（Session 114）
2. 分館基本資訊卡「修改」vs「設定」pill 文字不是示意不一致，是刻意設計：
   對應同一顆 modal 的兩種標題（`資料修改`/`資料設定`），由「是否已填過
   資料」這個 state 同時驅動照片顯示方式與按鈕文字（Session 114/115）
3. 「須知與聲明」卡是獨立卡片，跟 `state=branch-basic-info` modal 是
   平行關係，不是巢狀在該 modal 內（Session 116）
4. 基本資訊卡的企業官網/訂房網/自助報到 chip、網域安全卡的 2 顆按鈕，
   皆無前端互動邏輯，行為交給後端，前端只需正確渲染版位與外觀
   （Session 116）
5. `placeholder` 字面文字欄位（分館資料編輯 modal 內多數欄位）刻意保留
   原樣渲染，給後端看欄位長相，不當空值處理（Session 115）

---

## 佈局

### Shell

推測沿用跟 `account-permission.html` / `system-basic.html` 相同的 shell
partial 組合（`aside.html` + `topbar.html` + `session-modals.html` +
`topbar-modals.html`，aside 路徑「系統設定 > 民宿資料」），**但這點本頁
尚未實際核對過**，實作前需確認 aside 選單項目與 topbar tab 登記方式。

### Content（現有讀取記錄摘要，2026-07-29 Session 114）

- 頁面頂部工具列：「多語系狀態」按鈕（`icons/translation`，開啟
  `state=multilingual-status` modal）+ 「重整」按鈕
- 主體是「分館卡片區」列表：每筆（headquarters 一筆 + 各分館各一筆）
  各自渲染一組 3 張卡（基本資訊卡 / 須知與聲明卡 / 網域安全卡，並排），
  目前 Figma demo 呈現 2 組（總部 + 分館名稱一 x1，`排序` 值分別為
  1/2，`修改 4-1`/`設定 4-2` 對應不同「有無填過資料」state 示意）

### RWD（三個斷點的收合方式，2026-07-29 Session 114 記錄）

| 斷點 | 收合方式 |
|---|---|
| >=768px（desktop 1440 ref） | 每組 3 張卡三欄橫排 |
| 640~767px（mobile~tablet ref 767） | 收成單欄（3 張卡上下堆疊），但**卡片內部**（照片+標題）仍維持並排 |
| <=639px（mobile ref 375） | 連卡片內部（照片+標題）也上下堆疊 |

---

## Figma 未定義 / 待補讀取

以下項目尚未針對頁面容器本身做過精確讀取，**不可用其他頁面的數值或
component 各自孤立量到的尺寸拼湊出來**，下次 figma-go 需專門針對這些
項目重新讀取容器層級的節點：

- 頁面外層容器的 padding / 背景 / border token（是否跟 `account-permission`
  的 `system-basic` pattern 一致，即 `Color/Neutral/75` 底、
  `Color/Neutral/200` 框、radius 12、padding 20，尚未核對）
- 「分館列」之間的垂直 gap，以及同一列內 3 張卡之間的水平 gap（各卡片
  的孤立尺寸已知，但容器層級的實際排列 gap 未讀）
- 頂部工具列（多語系狀態 + 重整）的精確佈局、間距、按鈕樣式細節
- 3 個斷點下，「分館列」與卡片本身確切寬度數值（目前只有 Session 114
  記錄的收合方式文字敘述，沒有像素數值）
- 「須知與聲明」卡「有資料」state 的實際示意圖尚未提供（同
  Session 114/115/116 未完成項，目前只有空狀態與編輯流程，缺已儲存後
  卡片本體在頁面上如何顯示已有內容的摘要視圖）
- headquarters 那一筆跟各分館筆數的視覺區分（例如是否有額外標示、
  headquarters 是否固定在最上方不可排序）未讀取確認

## Partial / module manifest（lint-partials.py 登記）

尚未實作，實作階段才登記（比照 `account-permission.md` 慣例）。
