---
author: Claude CLI
role: round-1 independent analysis
model_family: Claude
source_files:
  - specs/agent-council/aside-system-icon-overlap/brief.md
---

# Round 1 - Claude independent analysis

## 查證過的事實（非推測）

在評估四個候選方案前，先核對 brief 引用的每個宣稱，避免從現有 markup 反推
產品意圖：

1. **`components/function-icons.md`**（Figma COMPONENT_SET `187:8227`，最後
   同步 2026-04-13）明文寫著 `system`：「後續功能，尚未有對應內容，不顯示
   數字 badge」。這是 Figma 來源的宣告，不是我方推測 - 這個 icon 從
   設計端就是一個保留位，不是已經定義好又被閒置的功能。
2. **`preview/partials/topbar.html`（桌機）** 與 **`preview/partials/aside.html`
   （mobile drawer）** 的 system icon 都確認是純 `<img>`，沒有 `<button>`
   包裹、沒有 `data-modal-open`，跟同一群組另外三顆（bulletin / message /
   person-md）不同 - 這三顆在 Session 97 都補上了真正可運作的 modal，
   只有 system 維持純視覺、零互動。
3. **`specs/icons.md`**（icon 語意對照表，全站權威來源）把 `system` 歸類在
   「系統 / 工具類」，語意標註為「**系統設定**（齒輪造型）」（icons.md:99）
   與「**system（齒輪設定）**」（icons.md:176）。這是關鍵發現：這個 icon
   的**官方語意標籤本身就是「系統設定」**，跟 aside 新父項的名稱逐字相同，
   不是我方主觀感受到的「像」，是已經寫在權威對照表裡的事實。
4. **額外查證（brief 未提及）**：aside.html 目前在「系統設定」這個父項之
   上，還有一層區塊標題「**系統操作**」（`preview/partials/aside.html:172`，
   就是「收合」按鈕那一排的標題）。也就是說目前 aside 左側已經有
   「系統操作」（區塊標題）> 「系統設定」（父項）兩層「系統」字樣，
   再加上右上角這顆語意也是「系統設定」的 icon，是三處而非兩處
   「系統」相關命名同時存在於同一個畫面。這讓語意重疊的範圍比 brief
   描述的更廣一點，值得一併納入判斷。

## 對四個候選方案的獨立評估

### 方案 A（保留現狀）
成立的理由是「這是 Figma 定義的 4 icon 元件，沒有人授權改動元件結構」，
這點站得住腳 - 貿然拿掉一個 COMPONENT_SET 裡的 icon 而不回頭改 Figma
本身就有問題。但這個方案沒有真的回答 brief 提出的問題：它只是延後決定，
沒有面對「這是不是真的語意衝突」這件事。而且我剛查到的事實（icons.md
的官方語意標籤就是「系統設定」）讓「保留現狀不用管」的立場更難單獨站住 -
這不是模糊的美學判斷，是文件裡白紙黑字的命名重複。

### 方案 B（移除）
邏輯上最乾脆：一個零互動、Figma 自己都說「尚未有對應內容」的 icon，
語意標籤又跟一個現在真的有內容的 aside 父項撞名，移除確實能解決重疊。
但風險評估我同意 brief 的判斷：這牽動一個 Figma COMPONENT_SET 的固定
結構（4 icon、44px 間距），不是我或 Codex 可以單方面拍板的事 - 這類
「動 Figma 定義元件的結構」的決定，依專案規則（`不確定時問我,不要猜`）
應該要嘛回 Figma 改元件定義、要嘛由使用者明確授權「這次不回 Figma、
直接以現況為準拿掉」。council 不能替代這個授權。

### 方案 C（重新定義語意）
我對這個方案比較保留。brief 自己也承認「沒有 Figma 或產品規格支撐新的
語意」，這正是專案規則反覆強調的「不要腦補」的典型情境 - 沒有來源就
發明一個新語意（工具/偏好/後台狀態），本質上是我們自己編故事讓一個
閒置 icon 看起來有存在理由，而不是真的解決問題。除非使用者自己已經有
明確的產品規劃（例如：這顆未來真的要做「系統狀態通知」），否則這個
方案目前沒有實質內容可以填。

### 方案 D（暫時保留視覺，標記待決）
這個方案的精神最貼近專案既有的決策文化：「Figma 沒有定義的狀態標記為
『未定義』，不要腦補」。跟方案 A 的差別在於，D 要求**明確寫下**
「這顆 icon 目前不是有效功能入口，不可被當成 current source」，而不是
放著不提- 這個差異對「防止未來 agent 誤判」很重要，跟這次案子的
起因（Session 84 的隱藏邏輯被後續 session 誤當成既定規格延續）是同一類
風險。方案 D 沒有解決使用者觀感上的疑惑（icon 還在那裡、還是看不出
在幹嘛），但至少不會讓錯誤認知擴散。

## 我的傾向（不是裁決，是提供判斷供 synthesizer 整理）

我認為**方案 B 的方向是對的，但執行時機需要綁定方案 D 的文件動作**：

- 短期（這次可以直接做的）：不管最終要不要拿掉這顆 icon，都應該先把
  「這顆 icon 目前是 Figma 保留位、零功能、語意與 aside『系統設定』重疊」
  這件事**明確寫進 `components/function-icons.md`**，避免後續任何 agent
  或人看到 markup 就假設它有作用或該保留。這是方案 D 的核心動作，成本低、
  沒有爭議，我認為不需要等使用者裁決就可以先做。
- 真正需要使用者裁決的，是「要不要真的拿掉這顆 icon（連動 Figma 元件
  結構變更）」，還是「先維持視覺、只更新文件」。這是產品層級的決定
  （這顆保留位未來到底要不要用），不是我或 Codex 能單方面判斷的事。

## 給 Needs User Decision 的具體問題（供 synthesizer 彙整）

1. 使用者是否同意「icons.md 官方語意標籤跟 aside 新父項撞名」構成需要
   處理的問題（而不是可接受的巧合）？
2. 如果要移除 system icon，使用者是否要同步回 Figma 更新
   `Function icons` COMPONENT_SET（從 4 icon 改 3 icon），還是接受
   「這次以 code 為準、之後找機會補 Figma」？
3. 如果暫不移除，是否同意先把「零功能 / 語意重疊 / 不可被當成有效入口」
   寫進 `components/function-icons.md` 當作最低限度的文件修正（我認為
   這步不需要等待對「要不要移除」的最終決定，可以先做）？
