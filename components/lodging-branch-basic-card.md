# Component Specification: 分館基本資訊卡

**Figma Node ID**（分館 1 範例，desktop `2119:78284` 底下）：`2119:78148`（"Frame 427318994"，含以下各部分）
**讀取日期**：2026-07-29（跨多個 session 分批讀取，見下方各部分來源）
**使用位置**：`specs/pages/lodging-info.md`（尚未寫檔）headquarters/分館卡片區的第 1 張卡（跟「須知與聲明卡」`components/lodging-branch-notice-card.md`、「網域安全卡」`components/lodging-branch-domain-security-card.md` 並列）。

---

## 概述

這張卡是分館列表裡結構最複雜的一張，內容分 3 個部分，各自的完整規格已分散寫在不同檔案，本檔統整並補上最後一塊（企業官網/訂房網/自助報到 三個連結 chip）：

| 部分 | 規格位置 |
|---|---|
| 左側圓形照片觸發器（有圖/無圖兩態，點擊開啟照片管理 modal） | `components/modal.md` `state=photo-gallery` 段落「Open trigger」小節 |
| 總部/分館名稱、間數、排序、「修改/設定」pill 按鈕 + 開啟的編輯 modal | `components/lodging-branch-info-modal.md`（`state=branch-basic-info`） |
| 企業官網 / 訂房網 / 自助報到 三個連結 chip | 本檔，見下方 |

---

## 企業官網 / 訂房網 / 自助報到（連結 chip 列）

```
Frame 427318995（chip 列，gap 16px）
- Input chip："企業官網" + icons/attached-link
- Input chip："訂房網" + icons/attached-link
- Input chip："自助報到" + icons/attached-link
```

| 屬性 | 值 | Token |
|---|---|---|
| Chip 背景 | 白底 | `Color/Neutral/0` |
| Chip 邊框 | - | `Color/Neutral/200` |
| Chip radius | 6px | - |
| Chip padding | `4px 8px` | - |
| Chip 間距 | 16px | - |
| 文字 | 16px Regular | `Color/Neutral/800` |
| Icon | `icons/attached-link`，24x24 | `Color/Neutral/800` |

### 行為（2026-07-29 使用者拍板）

這三個 chip **本質是按鈕**，各自的點擊行為（例如導向企業官網網址、訂房網網址、開啟自助報到頁面）**由後端決定與提供實際連結/行為**，前端本輪**只需要正確渲染版位與元件外觀**，不需要實作點擊後的實際導轉邏輯，也沒有下一層 modal 或頁面需要跟著讀取。

### Hover 態（Figma 未定義，Session 118 使用者指定沿用既有 pattern）

Figma 沒有畫這三個 chip 的 hover 態，使用者要求沿用 `landing.html`「今日營收」卡片內「日營收」按鈕的既有 hover pattern（`attached-link` 元件的 default/hover 雙態）：

| 狀態 | 背景 | 文字 | Icon |
|---|---|---|---|
| Default | `Color/Neutral/0`（白） | `Color/Text/800` | `icons/attached-link` |
| Hover | `Color/Text/800`（深） | `Color/Text/100`（反白） | `icons/attached-link-moved`（icon 換成移動態變體，非同一張圖用 CSS 變色） |

實作：`<button>` 加 `group` class，兩張 icon 各自用 `group-hover:hidden` / `hidden group-hover:block` 切換顯示，`hover:bg-text-default hover:text-text-inverse transition-colors duration-150`。跟 `preview/landing.html` 的「日營收」按鈕逐一對照一致，不要另外發明新樣式。

---

## 標題區塊（總部/分館名稱 + 間數/排序 + 修改/設定 pill 按鈕，Session 118 補記）

```
Title 區塊（>=640px 跟照片並排時，本區塊上下各有 12px padding，
用來對齊照片的視覺高度；<640px 堆疊態不套用此 padding）
- icons/headquarters + "總部名稱" (24px SemiBold, Color/Neutral/800)
  與 icons/new-brand + "分館名稱X" (20px Regular) 兩行之間 gap 12px
- 上面兩行的區塊 跟 "間數：N 排序：N" 跟 pill 按鈕，三段之間各 gap 20px
- "間數：N"  "排序：N" (16px Regular, Color/Neutral/800)
- pill 按鈕："修改 4-1"（已有資料）或 "設定"（尚未設定過，不帶編號，
  Session 118 使用者訂正：全無資料就不該帶編號）（icons/edit + 文字）
```

**Padding 修正（Session 118 使用者截圖比對抓到）**：一開始的實作漏了
Title 區塊本身的 12px 上下 padding，也把兩個名稱行之間的 gap 誤植為 4px
（實際 12px）、三大段之間的 gap 誤植為 12px（實際 20px）。重新用
`get_node` 讀 `2119:78148` 全樹核對，`Frame 427318993`（Title 區塊本身）
的 `styles.padding` 明確是 `{top:12, bottom:12}`，不是用位置反推的猜測。

「修改/設定」pill 按鈕樣式（跟其他頁面白底灰框 pill 不同，是本卡專屬的橘框樣式；
按鈕寬度依文字內容 hug，不用固定寬度數值，Figma 兩態的實際量測寬度不同純粹是
因為文字長度不同）：

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | **linear 漸層**：白（下）-> `Color/Brand/Brand-200`（`#fad4ae`，上），垂直方向 | `Color/Neutral/0` -> `Color/Brand/Brand-200` |
| 邊框 | 實心橘色（非漸層） | `Color/Brand/Brand-400` (#f28b45) |
| Radius | 60（pill） | - |
| Padding | `6px 12px` | - |
| icon/文字顏色 | 灰（非橘） | `Color/Neutral/800` (#454545) |
| icon | `icons/edit`，24x24 | - |

**讀取陷阱（Session 118 使用者截圖比對抓到）**：`get_selection` 對這顆按鈕
node 只回報 `strokes:["#f28b45"]`，完全沒有 `fills` key - 背景漸層被靜默
省略（`start.md`「JSON 不等於視覺」已知陷阱，跟 `components/order-status-pill.md`
來源 badge 同一類陷阱，但這次是漸層 fill 消失、不是佔位符 `"s1"`）。
`save_screenshots(format: SVG)` 覆核 `<defs>` 才抓到真正的
`linearGradient`（`x1=70.5,y1=36 -> x2=70.5,y2=0`，`stop-color white` ->
`offset=1 stop-color #FAD4AE`，垂直方向、非對角線，跟來源 badge 的對角線
漸層方向不同，不可假設所有漸層 pill 都同一個方向）。CSS 實作於
`preview/assets/css/lodging-info.css` 的 `.lodging-branch-edit-btn`。

點擊開啟 `components/lodging-branch-info-modal.md` 的 `state=branch-basic-info` modal，標題依按鈕文字切換「資料修改」/「資料設定」。

## Typography / Colors

見上表；其餘欄位（照片觸發器）的 Typography/Colors 已在對應檔案記錄，不重複列出。

---

## Token gaps / unresolved

- 無。

---

## 未讀取 / 待補項目

- 此卡在 `specs/pages/lodging-info.md` 頁面上的 RWD 斷點行為尚未個別示意，待補
