# Brief: bulletin-icon-removal

## 背景

使用者提出：「經最近的會議討論，function icons 中那個 bulletin 與其對應
的 modal，在這一次提供給客服的服務當中，不打算提供，所以應該整個拔除
比較好，還是隱藏就好」。

**現況查證**（動工前核對，不是假設）：

- 實際檔名是 `preview/assets/icons/bulletin.svg`（使用者原話寫
  `bulletin.png`，副檔名不同，指的應該是同一顆 icon；已在此標註以免
  誤會成不同資產）。
- 目前 function icons 群組是 3 顆（`system` 已於 2026-07-08 經前一輪
  council 拍板移除，`components/function-icons.md` 與 Figma 已同步為
  3 icon）：`bulletin`（公告）、`message`（訊息）、`person-md`（會員安全
  管理）。
- 桌機：`preview/partials/topbar.html` 的 `desktopBulletinBtn`，
  `aria-label="開啟公告"`，`data-modal-open="modalBulletinBackdrop"`，
  有數字 badge（公告數量）。
- Mobile drawer：`preview/partials/aside.html` 的 `mobileBulletinBtn`，
  同樣的 `data-modal-open="modalBulletinBackdrop"` 與 badge。
- Modal 本體：`preview/partials/topbar-modals.html` 裡的
  `modalBulletinBackdrop`（inline 註解標記為 "Modal C - Bulletin -
  vendor（管理訊息）"，這是 2026-07-08 抽出 partial 時沿用的舊命名，
  跟目前的「公告」語意不完全對齊，值得在本輪一併確認要不要正名）。
  三頁（landing / order-processing / room-booking）共用同一份 partial，
  Session 97 才把它從 landing-only 改成全站共用+可用。
- Modal 內部行為（tab 切換、公告列展開）在
  `preview/js/topbar-modals.js` 的 `bindTabGroup(".bulletin-tab", ...)`
  與 `bindBulletinRows()`，三頁各自呼叫 `initTopbarModals()` 時一併綁定。

這代表「公告」這個功能目前是**三頁都真的能用**的完整功能（不是像
`system` icon 那種零互動的保留位）。這輪要decide的是「業務上決定這次
不提供這個功能」之後，前端要怎麼處理這個目前完整存在的功能。

## 問題

業務決定這次交付的客服服務不包含「公告」功能。前端應該把 bulletin
icon + 其 modal 整個移除（含 markup、JS 綁定、partial 內容），還是只
做隱藏（icon 不顯示，但 modal 與相關程式碼保留）？

## 候選方案

### 方案 A：整個拔除
移除 `desktopBulletinBtn` / `mobileBulletinBtn` 的 markup、
`modalBulletinBackdrop` 在 `topbar-modals.html` 裡的內容、
`topbar-modals.js` 裡 `bindTabGroup(".bulletin-tab", ...)` 與
`bindBulletinRows()` 的呼叫與函式本身。**已查證**：`.bulletin-tab` 與
`data-bulletin-row-toggle` 只出現在 `modalBulletinBackdrop` 內，訊息
modal 用的是獨立的 `.administer-tab`（出現 9 次，跟 bulletin 完全不
共用）；因此這兩個函式可以連同呼叫一起整段移除，不會動到訊息/會員
安全管理 modal 的行為。

風險：這次不提供不代表未來永遠不提供；如果日後客戶要求恢復，需要重新
從舊 commit 找回實作，或重寫。也涉及 Figma `Function icons`
COMPONENT_SET 從 3 icon 變 2 icon 的結構變更，需要跟前一輪 `system`
icon 移除一樣走 Figma 同步流程。

### 方案 B：隱藏（保留程式碼與 markup，僅視覺不顯示）
Icon 與 modal 都保留在程式碼裡，用視覺隱藏方式讓使用者看不到入口
（例如加上統一的隱藏 class，三頁一致，不分頁面條件判斷 - 沿用前一輪
council 對 `system` icon 候選 3 的教訓：不可比照 Session 84-85 的
per-page 條件式隱藏）。

風險：程式碼與 modal 內容留在 repo 裡但沒有入口可以觸發，長期會變成
「看不到但存在」的死重量；如果之後真的確定永久不用，隱藏只是延後拔除
的時間點，沒有解決根本問題。優點是如果業務之後改變心意要恢復，只要
拿掉隱藏 class 即可，不需要重新實作。

## 禁止事項

- 不可只因為現有 code 已經是完整功能就假設「業務決定不提供」只是暫時的
  或只是誤傳；本輪以使用者這句話的字面意思為準（這次不提供），不要自行
  延伸解讀成「以後也不會提供」或「這次也可能還是要提供」。
- （已查證，見方案 A）`bindTabGroup`/`bindBulletinRows` 不與其他 modal
  共用；round-1 分析可以直接引用這個結論，不需要重複查證，但也不可
  在未來程式碼變動後，未經重新核對就繼續沿用這個結論。
- 不可在本輪直接修改 preview 實作；本輪先做 decision council，不進
  implementation（跟前一輪 `system` icon 題目同樣的分工）。
- 不可把 `consensus.md` 當成權威來源；使用者拍板後需依性質收斂回
  `components/function-icons.md`、`preview/partials/*.html`（若涉及
  markup 決定的記錄）、`specs/progress.md`。
- 不可假設 Figma 端會自動跟進；若方案 A（拔除）成立，是否同步改
  Figma COMPONENT_SET 需要跟前一輪 `system` icon 題目一樣明確詢問
  使用者。

## 需要裁決的問題

1. 這次「不提供公告功能」，前端要選方案 A（整個拔除）還是方案 B
   （隱藏）？
2. 如果選方案 A，Figma `Function icons` COMPONENT_SET 是否要同步改為
   2 icon，還是先以 code override 記錄、Figma 之後再補（比照前一輪
   `system` icon 題目的 1a 變體）？
3. `modalBulletinBackdrop` 內部標記的舊註解「Modal C - Bulletin -
   vendor（管理訊息）」是否要藉這次機會正名，還是維持原樣（不在本輪
   範圍內處理）？
