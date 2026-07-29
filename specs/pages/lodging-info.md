# Page: 民宿資料 (lodging-info)

**Figma 來源 (read date 2026-07-29, Session 114)**:
- Desktop: FRAME `2119:78284`，1440x943.48
- Mobile~tablet: FRAME `2126:76269`，767x1646
- Mobile: FRAME `2126:76796`，375x2162

**實作**: 尚未開始（本檔為 spec-only，`preview/lodging-info.html` 尚未產出）
**狀態**: 分館卡片區 3 張卡 + 相關 modal / 元件、頁面容器層級（外層 padding、
卡片間 gap、頂部工具列、3 斷點精確寬度）皆已讀取定案（Session 118，
2026-07-29）。規格已齊全，可以開始實作 `preview/lodging-info.html`。

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
6. headquarters 那一筆跟各分館筆數的視覺區分：**沒有**額外標記或拖曳排序
   UI，兩種筆數的卡片結構完全相同；唯一差異是「排序」數字（截圖示例
   1/2）與「修改/設定」按鈕文字（後者由「是否已填過資料」state 驅動，
   跟 headquarters 身份無關，同決策 2）（Session 118）
7. 「須知與聲明」卡「已儲存內容」狀態：內容區顯示橘字「已儲存內容」
   標籤（`Color/Brand/Brand-400`）+ 唯讀全文 + 置中「編輯」按鈕，4 個
   分類各自獨立判斷顯示空狀態或已儲存狀態，互不影響（Session 118，見
   `components/lodging-branch-notice-card.md` 「006」）
8. 工具列「多語系狀態」/「重整」按鈕水平間距：Figma 讀值桌面 20px、
   平板與手機 24px 不一致，使用者拍板三斷點統一採用 24px（Session 118）

---

## 佈局

### Shell

沿用 `account-permission.html` / `system-basic.html` 相同的 shell
partial 組合（`aside.html` + `topbar.html` + `session-modals.html` +
`topbar-modals.html`，aside 路徑「系統設定 > 民宿資料」）。**已於
Session 118 核對確認**：

- Desktop（>=768px）：aside 240px 寬 + 20px gap + 內容欄，跟既有頁面數值
  一致；aside 上方的 topbar 麵包屑列（`民宿資料` 已選中 chip + 佔位
  chip、右側 function icon 群）是既有 `partials/topbar.html` 通用結構，
  非本頁專屬，不需重寫
- Mobile/Tablet（<768px）：頂部收合列（logo + `folder.svg` 選單按鈕）
  逐字比對 `preview/system-basic.html`（`account-permission.html` /
  `room-booking.html` / `order-processing.html` / `landing.html` 皆同）
  第 22-33 行既有 markup，**完全一致**，直接沿用既有 mobile top bar +
  `mobileMenuBtn` 開關邏輯，不需重新定義

### 頁面容器（"content"，Session 118 讀取確認，三斷點數值一致）

```
頁面容器
- fill: Color/Neutral/75 (#f6fafd)
- border: Color/Neutral/200 (#d1d1d1)
- radius: 12
- padding: 20（四邊）
```

跟 `system-basic.html` 既有 class `rounded-xl border border-border-disabled
bg-surface-hover p-5` 完全對應，可直接沿用同一組 class，不需另建 CSS。

### 頂部工具列（Session 118 讀取確認）

- 「多語系狀態」按鈕：`icons/translation` + 文字，開啟
  `state=multilingual-status` modal
- 「重整」按鈕：`icons/restore`（非 `refresh`，本機檔名確認）+ 文字
- 兩顆按鈕共用樣式：白底 (`Color/Neutral/0`)、border `Color/Neutral/200`、
  radius 28（pill）、padding `10px 16px`、icon 24x24 + 8px gap + 文字
  (16px Regular, `Color/Neutral/800`)
- 兩顆按鈕靠右對齊頁面容器右邊界（三斷點皆同）
- 兩顆按鈕水平間距：Figma 讀值桌面 20px、平板/手機 24px 不一致，**使用者
  拍板統一採用 24px**（見「使用者確認事項」8）
- 工具列與下方「分館列」列表垂直間距：12px（三斷點一致）

### 分館列（每筆 headquarters/分館各自一列，Session 118 讀取確認）

每一列本身是獨立的白底卡片，**不是單純排版 frame**：

```
分館列
- fill: Color/Neutral/0 (#ffffff)
- border: Color/Neutral/300 (#b0b0b0)
- radius: 12
- padding: 16（四邊）
```

列與列垂直間距：24px（三斷點一致）。headquarters 那一筆跟分館筆數
**沒有**額外視覺區分，見「使用者確認事項」6。

### RWD - 分館列內 3 張卡排列（Session 118 讀取確認，含實際像素）

| 斷點 | 排列方式 | 卡片寬度 (列內 padding 16 後的可用寬度) | 卡片間 gap |
|---|---|---|---|
| >=768px（desktop 1440 ref，列寬 1100） | 3 卡橫排 | 基本資訊卡 348px / 須知與聲明卡 348px / 網域安全卡 351px（3px 差異判斷為 Figma 量測雜訊，實作建議 3 卡等寬 flex，不需刻意重現 3px 差異） | 12px |
| 640~767px（tablet ref 767，列寬 695） | 3 卡直排（上下堆疊），卡片各自滿版列寬 | 695px（3 卡皆同寬） | 24px |
| <=639px（mobile ref 375，列寬 303） | 3 卡直排，卡片各自滿版列寬 | 303px（3 卡皆同寬） | 24px |

補充（Session 118 讀取確認，卡片內部佈局細節）：
- 640~767px：卡片內部（基本資訊卡的照片+標題區塊）維持並排，尺寸與
  桌面版相同（309x194 子區塊不隨卡片變寬而拉伸，靠左對齊，卡片其餘寬度
  留白）
- <=639px：卡片內部照片+標題也改上下堆疊、水平置中；企業官網/訂房網/
  自助報到 3 個連結 chip 改成 2 排、置中對齊，chip 間水平/垂直 gap 皆
  16px（這是 wrap+center 佈局，跟既有「橫向 scroll 不加 fade」的 tab/chip
  慣例 (nowrap+overflow-x-auto) 不同，不要混用）
- 手機版「須知與聲明」卡的分類 tab（訂房/成為會員/團體訂房/不退款聲明）
  截圖確認會溢出卡片右邊界並被裁切，屬既有 nowrap+overflow-x-auto 慣例
  (`specs/html-conventions.md` Folder-tab pattern)下的正常行為，不是新
  問題，不需額外處理

---

## Figma 未定義 / 待補讀取

容器層級細節已於 Session 118 全數讀取確認（見上方「佈局」）。以下為
仍待處理的非容器項目，不影響開始實作：

- 系統範本 / 總部範本的實際固定示意文字內容，待你提供或由開發階段先寫
  一段合理 placeholder（不影響規格判讀，見
  `components/lodging-branch-notice-card.md`）
- 「須知與聲明」卡「已儲存內容」狀態已補讀（Session 118，見
  `components/lodging-branch-notice-card.md` 「006」），但沒有「同一分館
  內 4 個分類部分有資料部分沒資料」同時並存的示意圖；判斷為每個分類各自
  獨立套用 001(空) 或 006(已儲存) 兩種容器內容其中之一即可，如發現例外
  情況再回來補

## Partial / module manifest（lint-partials.py 登記）

尚未實作，實作階段才登記（比照 `account-permission.md` 慣例）。
