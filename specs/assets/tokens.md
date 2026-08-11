# Design Tokens

> 來源：Figma Variables（Collection: **Semantic**, Mode: **Mode 1**）  
> 本地匯出參考：`specs/assets/figma-variables.json`（不進版控，內容需如實轉換到本檔）
> Local Styles 全部為空，所有 token 皆來自 Variables。  
> 上次同步：2026-08-11（新增 Color/Surface/Status-Negative-light；本地
> `figma-variables.json` 同步為使用者貼上的 Figma Variables export）

## Token 使用規則（Strict Mirror）

- **base.css `:root` 嚴格鏡像 Figma Variables**：CSS variable 命名直接走 Figma 路徑（`Color/Group/Key` -> `--color-{group}-{key}` 全小寫 kebab）。實作時優先使用 strict 名稱，不再走「語意 alias」過渡層。
- 專案不允許套用非 Figma Variables 來源的顏色（`rgba(...)` / box-shadow / drop-shadow / modal backdrop 等 Effect 例外，但仍須命名 CSS var 管理）。
- HTML / CSS / JavaScript 中的顏色必須對應到 Figma Variable，再透過以下方式使用：
  - CSS：`var(--color-{group}-{key})`，名稱與 Figma 路徑 1:1 對應
  - Tailwind CDN `theme.extend.colors`：值必須指向 strict CSS var；class 名可保留語意 label（例 `text-text-default` -> `var(--color-text-800)`），便於 markup 不大改
  - JavaScript：`getComputedStyle(document.documentElement).getPropertyValue("--color-{group}-{key}")`
- 如果 Figma 視覺稿出現本檔沒有的顏色，先更新 Figma Variables 並同步 `figma-variables.json` + `base.css` + 本檔；不得直接寫 hex。
- 若舊實作仍有 `text-[#...]`、`bg-[#...]`、`border-[#...]`，只能在能 1:1 對應本檔 token 時替換；無對應者需列入未解問題。
- Figma key 拼字若有 typo（例如 `Color/Modal/Text-hightlight`）保留為 strict 鏡像，不在實作層修正。
- scrollbar 為 HTML/CSS 原生特規；實作使用既有中性色 token，不新增非 Figma Variables 色彩。

---

## Figma Variable 與 Tailwind class 對照（語意 label，僅供參考）

> 實作優先使用 strict CSS var（`--color-{group}-{key}`，與 Figma 路徑 1:1 對應）。
> 下表記錄專案歷史上既有的 Tailwind class label，方便 markup 閱讀；class **值** 一律指向 strict CSS var，不允許再導入新的 alias 命名。

| Figma Variable | 實作 alias | 使用情境 |
|---|---|---|
| Color/Neutral/0 | `white`, `bg-white`, `text-white`, `--color-white` | 白色表面、表格/輸入框底色、深色背景上的反白文字 |
| Color/Neutral/50 / Color/Surface/Default | `bg-surface-default`, `--color-surface-default` | 頁面背景、區塊底色 |
| Color/Neutral/75 / Color/Modal/Hover | `bg-surface-hover`, `hover:bg-surface-hover`, `--color-surface-hover` | hover 背景、選單 hover |
| Color/Text/800 / Color/Neutral/800 | `text-text-default`, `--color-text-default` | 主要文字 |
| Color/Text/100 | `text-text-inverse`, `--color-text-inverse` | 深色 tooltip / badge 上的反白文字；若視覺稿明確為純白，使用 `text-white` |
| Color/Text/600 / Color/Neutral/600 | `text-text-supporting`, `--color-text-supporting` | 次標題、低強度提示文字 |
| Color/Icon/Default | `text-icon-default`, `--color-icon-default` | 可用 `currentColor` 或 mask 控色的一般黑色 icon |
| Color/Surface/Brand-Default | `bg-brand-500`, `bg-surface-brand`, `--color-surface-brand` | 主品牌色、主按鈕、重要 badge |
| Color/Surface/Brand-Hover | `hover:bg-surface-brand-hover`, `--color-surface-brand-hover` | 主品牌 hover |
| Color/Surface/Accent | `bg-surface-accent`, `--color-surface-accent` | 訂單轉正式單區塊內的強調 action |
| Color/Border/Default | `border-border-default`, `--color-border-default` | 一般分隔線與邊框 |
| Color/Border/Plugin-Default | `border-border-plugin`, `--color-border-plugin` | 表單輸入框預設邊框 |
| Color/SubItem/Selected | `bg-subitem-selected`, `--color-subitem-selected` | 子項目 / payment chip selected |
| Color/Accent/* | `text-accent-*`, `bg-accent-*`, `--color-accent-*` | 節慶、POS 入口、浮動客服等點綴色 |

---

## 色彩 (Colors)

### Neutral（灰階）

| Variable 名稱 | Hex 值 | 語意用途 | Tailwind 對應建議 |
|---|---|---|---|
| Color/Neutral/0 | `#FFFFFF` | 純白，背景底色 | `white` |
| Color/Neutral/50 | `#F6F6F6` | 頁面背景、卡片底色 | `gray-100` |
| Color/Neutral/75 | `#F6FAFD` | 極淡藍白，hover 背景 | `sky-50` |
| Color/Neutral/100 | `#E1E1E0` | 分隔線、border default | `gray-200` |
| Color/Neutral/200 | `#D1D1D1` | 停用狀態邊框 | `gray-300` |
| Color/Neutral/300 | `#B0B0B0` | placeholder 文字、border focus | `gray-400` |
| Color/Neutral/400 | `#888888` | 次要說明文字 | `gray-500` |
| Color/Neutral/450 | `#6B6B6B` | 次要說明文字（深）- 有獨立元件使用 | `gray-500` |
| Color/Neutral/500 | `#6D6D6D` | 中性文字 - 有獨立元件使用 | `gray-500` |
| Color/Neutral/600 | `#5D5D5D` | 次標題 | `gray-600` |
| Color/Neutral/700 | `#4F4F4F` | 副標題文字 | `gray-700` |
| Color/Neutral/800 | `#454545` | 主要內文 | `gray-700` |
| Color/Neutral/900 | `#3D3D3D` | 強調內文 | `gray-800` |
| Color/Neutral/950 | `#262626` | 最深文字、heading | `gray-900` |

---

### Brand（主品牌橙色 scale）

> Figma 路徑：`Color/Brand/Brand-*`。語意層的 Default/Hover/Active 見 Surface 章節。

| Variable 名稱 | Hex 值 | Tailwind 對應建議 |
|---|---|---|
| Color/Brand/Brand-50 | `#FEF6EE` | `orange-50` |
| Color/Brand/Brand-100 | `#FDEBD7` | `orange-100` |
| Color/Brand/Brand-200 | `#FAD4AE` | `orange-200` |
| Color/Brand/Brand-300 | `#F7B57A` | `orange-300` |
| Color/Brand/Brand-400 | `#F28B45` | `orange-400` |
| Color/Brand/Brand-500 | `#EF6F25` | `orange-500` |
| Color/Brand/Brand-600 | `#E05216` | `orange-600` |
| Color/Brand/Brand-700 | `#BA3D14` | `orange-700` |
| Color/Brand/Brand-800 | `#943218` | `orange-800` |
| Color/Brand/Brand-900 | `#772B17` | `orange-900` |
| Color/Brand/Brand-950 | `#40140A` | `orange-950` |

---

### Surface（語意背景色）

| Variable 名稱 | 解析值 | 語意用途 | Tailwind 對應建議 |
|---|---|---|---|
| Color/Surface/Default | `#F6F6F6` -> Neutral/50 | 頁面預設背景 | `gray-100` |
| Color/Surface/Brand-Default | `#EF6F25` -> Brand-500 | **主品牌色 / 主按鈕預設** | `orange-500` |
| Color/Surface/Brand-Hover | `#F28B45` -> Brand-400 | 主按鈕 Hover | `orange-400` |
| Color/Surface/Brand-Active | `#E05216` -> Brand-600 | 主按鈕按下 / Active | `orange-600` |
| Color/Surface/Action-Default | `#005FCC` | 動作按鈕（藍色系）| `blue-600` |
| Color/Surface/Secondary | `#F9E616` | 輔助強調（鮮黃） | `yellow-400` |
| Color/Surface/Accent | `#42EBE9` | 強調色（青色） | `cyan-400` |
| Color/Surface/Status-Negative | `#E12129` | 錯誤/危險狀態 | `red-600` |
| Color/Surface/Status-Negative-light | `#F8A4A8` | 危險/停用類按鈕外框或淡色提示 | `red-300` |
| Color/Surface/Status-Positive | `#2ACA18` | 成功狀態 | `green-500` |

---

### Text（文字色）

> 數值與 `Color/Neutral/*` 高度重疊，兩組各有元件使用，維持獨立。  
> `Text/75`（`#F6FAFD`）與 `Text/450`（`#6B6B6B`）為 Text 系列的額外值。

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Text/50 | `#F6F6F6` | 反白文字（深色背景上） |
| Color/Text/75 | `#F6FAFD` | 極淡文字 |
| Color/Text/100 | `#E1E1E0` | 最淡可見文字 |
| Color/Text/200 | `#D1D1D1` | 停用狀態文字 |
| Color/Text/300 | `#B0B0B0` | Placeholder 文字 |
| Color/Text/400 | `#888888` | 說明文字 |
| Color/Text/450 | `#6B6B6B` | 說明文字（深） |
| Color/Text/500 | `#6D6D6D` | 中性文字 |
| Color/Text/600 | `#5D5D5D` | 次標題 |
| Color/Text/700 | `#4F4F4F` | 副標題 |
| Color/Text/800 | `#454545` | **主要內文（最常用）** |
| Color/Text/900 | `#3D3D3D` | 強調內文 |
| Color/Text/950 | `#262626` | 標題 / 最深 |

---

### Icon（圖示色）

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Icon/Default | `#000000` | 一般 icon 預設黑色；實作以 `currentColor` / mask 由 `text-icon-default` 控制 |

---

### Border（邊框）

| Variable 名稱 | 解析值 | 語意用途 |
|---|---|---|
| Color/Border/Default | `#E1E1E0` -> Neutral/100 | 一般元件邊框 |
| Color/Border/Focus | `#B0B0B0` -> Neutral/300 | Focus ring（淺） |
| Color/Border/Plugin-Default | `#6D6D6D` -> Neutral/500 | 輸入框預設邊框 |
| Color/Border/Plugin-Focus | `#EF6F25` -> Brand-500 | 輸入框 focus 邊框（品牌色） |
| Color/Border/Plugin-Invalid | `#D90000` | 驗證失敗邊框（紅） |

---

### Modal（選單/彈窗）

| Variable 名稱 | 解析值 | 語意用途 |
|---|---|---|
| Color/Modal/Default-Today | `#6D6D6D` -> Neutral/500 | 日曆「今天」預設標示 |
| Color/Modal/Text-hightlight | `#EF6F25` -> Brand-Default | 選單選中項目文字高亮 |
| Color/Modal/Hover | `#F6FAFD` -> Neutral/75 | 選單 hover 背景 |

---

### MenuItem / Radio / SubItem

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/MenuItem/Default | `#2178CF` | 側邊選單連結色（系統藍） |
| Color/Radio/Default | `#005FCC` | Radio/Checkbox 預設 |
| Color/Radio/Hover | `#3B78D5` | Radio/Checkbox Hover |
| Color/SubItem/Selected | `#F7D275` | 子選單選中（黃色標示） |

---

### Bootstrap（元件狀態色）

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Bootstrap/components/focus | `#86B7FE` | Focus ring（Bootstrap 藍） |
| Color/Bootstrap/focus-background | `#D3EBFD` | Focus 狀態背景 |
| Color/Bootstrap/aside/Notification | `#F44DF4` | 提示註解元件用色（洋紅） |

---

### Accent（點綴色）

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Accent/pink | `#FFC0CB` | 粉紅點綴 |
| Color/Accent/light-green | `#BBF7D0` | 淡綠點綴 |
| Color/Accent/Green | `#34C759` | 綠色標籤/chip（Input component Green variant） |
| Color/Accent/cart-date | `#FDEBD7` -> Brand-100 | 加購 cart date chip 背景 |
| Color/Accent/cart-time | `#E1E1E0` -> Neutral/100 | 加購 cart time chip 背景 |
| Color/Accent/cart-button-active | `#00C8B3` | cart / Title pill active green；例如「企」channel badge |
| Color/Accent/calc-result-background | `#2178CF` -> MenuItem/Default | calc result / inline amount 背景 |
| Color/Accent/celebration | `#F44DF4` | 節慶/特殊日期提示；同值來源：Color/Bootstrap/aside/Notification |
| Color/Accent/linear-pos-left | `#E376F9` | POS 入口外框漸層起點 |
| Color/Accent/linear-pos-right | `#FF7878` | POS 入口外框漸層終點 |
| Color/Accent/float-circle-mixed-1 | `#FFB624` | Floating customer service circle 漸層起點 |
| Color/Accent/float-circle-mixed-2 | `#3F930B` | Floating customer service circle 漸層終點 |
| Color/Accent/float-circle-filled-1 | `#F2BEFD` | POS 入口 hover fill 漸層起點 |
| Color/Accent/float-circle-filled-2 | `#FFB6B6` | POS 入口 hover fill 漸層終點 |
| Color/Accent/linear-small-badge | `#D7FFFB` | 小型 badge 點綴色（2026-07-29 新增，尚無對應實作） |
| Color/Accent/linear-function-button-delete | `#F3C2C4` | 表格列刪除功能按鈕點綴色（2026-07-30 新增，系統設定/房型頁面用，尚無對應實作） |
| Color/Accent/linear-function-button-duplication | `#C6DDFE` | 表格列複製功能按鈕點綴色（2026-07-30 新增，系統設定/房型頁面用，尚無對應實作） |

---

### Table（表格底色，多語系狀態 modal）

> 2026-07-29 新增，來源 Figma Variables 匯出。目前唯一使用者：
> `components/modal.md` `state=multilingual-status` 面板標題列／欄位表頭列底色。

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Table/Column1 | `#DDE9FB` | 表格區塊標題列底色（較深淡藍） |
| Color/Table/Column2 | `#EFF4FC` | 表格欄位表頭列底色（較淺淡藍） |

---

### Tab（分頁標籤）

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Tab/yellow | `#FFCC00` | 選中 tab 背景色（Bulletin 分類篩選） |

---

### Dots（狀態圓點 — 訂單處理頁）

> `訂單處理` 頁表格「訂單編號」欄 status pill 左側色點。5 個 token 全部是 alias，指向既有 Surface/Neutral/Tab/Chart 語意色，不是新的原始色值。經 `specs/order-processing-reading-notes.md` 讀取 11 的 tooltip 圖例截圖交叉驗證，中文標籤對照如下。

| Variable 名稱 | 解析值 | 語意用途（tooltip 圖例中文標籤） |
|---|---|---|
| Color/Dots/validated | `#2ACA18` -> Surface/Status-Positive | 正式單 |
| Color/Dots/unpaid | `#B0B0B0` -> Neutral/300 | 未付單 |
| Color/Dots/overdues | `#FFCC00` -> Tab/yellow | 逾期單 |
| Color/Dots/cancel | `#E12129` -> Surface/Status-Negative | 取消單 |
| Color/Dots/alternative | `#86B7FE` -> Chart/blue | 替代單 |

**注意**：篩選 tabs 用語（正式單/未付款/已過期/取消單/候補單）跟這組 tooltip 圖例用語（正式單/未付單/逾期單/取消單/替代單）有 3 處字面不同（未付款≠未付單、已過期≠逾期單、候補單≠替代單）。**已確認（2026-07-03）**：兩組用語對應不同顯示情境，差異是允許的設計決定，實作時兩套字串各自照字面顯示，不要合併成同一個。

---

### Chart（圖表資料色）

> 專用於圖表系列色，與其他語意 token 數值可能重疊，但語意獨立。

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Chart/blue | `#86B7FE` | 圖表藍色資料系列（與 Bootstrap/components/focus 同值，語意獨立） |
| Color/Chart/purpleRed | `#FF0BD6` | 圖表紫紅色資料系列（折線圖） |
| Color/Chart/green | `#34C759` | 圖表綠色資料系列（與 Accent/Green 同值，語意獨立） |

---

## 間距 (Spacing)

| Variable 名稱 | 值 | 用途 | Tailwind 對應 |
|---|---|---|---|
| Spacing/0 | `0px` | 無間距 | `p-0` / `gap-0` |
| Spacing/2 | `2px` | 極小 | `p-0.5` |
| Spacing/4 | `4px` | 超小 | `p-1` |
| Spacing/6 | `6px` | 小 | `p-1.5` |
| Spacing/8 | `8px` | 小 | `p-2` |
| Spacing/10 | `10px` | 特殊用途（非 4px 格線） | `p-2.5` |
| Spacing/12 | `12px` | 元件內 padding | `p-3` |
| Spacing/16 | `16px` | 預設間距 | `p-4` / `gap-4` |
| Spacing/17 | `17px` | 特殊用途（非 4px 格線） | `p-[17px]` |
| Spacing/18 | `18px` | 特殊用途（非 4px 格線） | - |
| Spacing/19 | `19px` | 特殊用途（非 4px 格線） | `p-[19px]` |
| Spacing/20 | `20px` | 元件外 padding | `p-5` |
| Spacing/24 | `24px` | Section 內間距 | `p-6` |
| Spacing/26 | `26px` | 特殊用途（非 4px 格線） | `p-[26px]` |
| Spacing/28 | `28px` | - | `p-7` |
| Spacing/32 | `32px` | 較大間距 | `p-8` |
| Spacing/36 | `36px` | - | `p-9` |
| Spacing/40 | `40px` | Section 間距 | `p-10` |
| Spacing/44 | `44px` | - | `p-11` |
| Spacing/56 | `56px` | 大間距 | `p-14` |
| Spacing/60 | `60px` | - | `p-[60px]` |
| Spacing/72 | `72px` | - | `p-18` |
| Spacing/76 | `76px` | 特殊用途（非 4px 格線） | `p-[76px]` |
| Spacing/80 | `80px` | 區塊最大 padding | `p-20` |
| Spacing/100 | `100px` | 大區塊間距 | `p-[100px]` |

---

## 圓角 (Radius)

> 所有 Radius token 為 Spacing 的 alias（數值相同），各有獨立元件使用，維持保留。

| Variable 名稱 | 值 | Tailwind 對應 |
|---|---|---|
| Radius/0 | `0px` | `rounded-none` |
| Radius/2 | `2px` | `rounded-sm` |
| Radius/4 | `4px` | `rounded` |
| Radius/6 | `6px` | `rounded-md` |
| Radius/8 | `8px` | `rounded-lg` |
| Radius/12 | `12px` | `rounded-xl` |
| Radius/16 | `16px` | `rounded-2xl` |
| Radius/20 | `20px` | `rounded-[20px]` |
| Radius/24 | `24px` | `rounded-3xl` |
| Radius/28 | `28px` | `rounded-[28px]` |
| Radius/32 | `32px` | `rounded-[32px]` |
| Radius/36 | `36px` | `rounded-[36px]` |
| Radius/40 | `40px` | `rounded-[40px]` |
| Radius/44 | `44px` | `rounded-[44px]` |
| Radius/56 | `56px` | `rounded-[56px]` |
| Radius/60 | `60px` | `rounded-full` *(近似)* |
| Radius/72 | `72px` | `rounded-full` |

---

## 字體 (Typography)

> 目前 **無正式 Text Style 定義**。以下為從元件節點觀察到的實際規格（推論值）。

| 觀察名稱 | 大小 | 推測行高 | 用途 |
|---|---|---|---|
| `sm` | ~14-16px | ~20px | 輔助說明、badge、日期 |
| `base` | ~20-22px | ~28px | 主要內文、選單項目 |
| `md` | ~24-27px | ~32px | Section 標題 |

### Font-size 規範

> **全域最小字體 = 12px (`text-xs`)**。**禁用** `text-[10px]` / `font-size: 10px` / 任何 < 12px 的字。
> 寫法：使用 Tailwind utility（`text-xs` / `text-sm` / `text-base` / `text-lg` / `text-xl`），或 CSS variable `var(--font-size-*)`。
> 變數定義在 `preview/assets/css/base.css` `:root`。

| Variable | 值 | Tailwind 對應 | 用途 |
|---|---|---|---|
| `--font-size-min`  | `12px` | `text-xs`   | 全域最小（chip badge、輔助 metadata） |
| `--font-size-sm`   | `14px` | `text-sm`   | 輔助說明、smaller body |
| `--font-size-base` | `16px` | `text-base` | **預設 body 字**、表格內文 |
| `--font-size-lg`   | `18px` | `text-lg`   | 強調 body |
| `--font-size-xl`   | `20px` | `text-xl`   | Section 標題 |

---

## 陰影 (Shadows)

> 目前 **無 Figma Effect Style 定義**。Effect 不進 `Color/*` Variables，固定元件效果依 component 規範與當前 Figma 視覺套用。

| Effect | 目前實作 | 規則 |
|---|---|---|
| Modal backdrop | `--effect-modal-backdrop` | 固定 modal 特規，見 `components/modal.md` / `progress.md` 決策 |
| Mobile sidebar backdrop | `--effect-mobile-sidebar-backdrop` | 固定 mobile overlay 特規 |
| Box shadow / drop-shadow | `--effect-*` CSS variables | 不轉成 color token；不得在 component CSS 中散落 raw `rgba(...)` |
| Chart translucent fill | `--effect-chart-purple-red-soft` | 由 chart color + opacity 形成，Chart.js 以 CSS variable 讀取 |
| Switch knob shadow | `--effect-switch-knob-shadow` | iOS switch knob elevation |
| Bottom sheet shadow | `--effect-bottom-sheet-shadow` | mobile offcanvas / bottom sheet elevation |
| Dropdown shadow | `--effect-dropdown-shadow` | desktop dropdown elevation |
| Scrollbar thumb | `--color-border-disabled` | 使用既有 neutral token alias，不新增 scrollbar color token |

---

## 系統色 (System Colors, 非 Figma Variables)

> Figma 元件直接從 iOS / Material 系統色匯出而非走 Variables 路徑的個案。需顯式記錄避免散落於 component CSS。

| CSS variable | 值 | 用途 | 來源 |
|---|---|---|---|
| `--color-switch-off-track` | `rgba(60, 60, 67, 0.3)` | iOS toggle switch off state track | Figma `Toggle - Switch` instance frame (`member-data-modal` 常用會員 / 訂閱電子報) |
| `--color-template-green` | `#BBF7D0` | 版型示意（系統基本頁）大圖/縮圖佔位底色 | Figma 0713 系統基本稿 node "Green"（2061:71222），客戶端訂房網縮影專用，不與產品 UI token 混用 |
| `--color-template-text` | `#000000` | 版型示意內文字 | 同上 |
| `--color-template-text-muted` | `rgba(0, 0, 0, 0.5)` | 版型示意 subtitle 半透明黑 | 同上（Figma `#00000080`） |
| `--color-template-divider` | `rgba(0, 0, 0, 0.1)` | 版型示意 article 分隔線 | 同上（Figma `#0000001a`） |
| `--color-template-thumb-tint` | `rgba(0, 0, 0, 0.05)` | 版型示意第二縮圖疊色 | 同上（Figma `#0000000d`） |

---

## 命名規範說明

1. **分組層級**：`Category/SubCategory/Scale`，以斜線分隔、大寫開頭
2. **色彩 Scale**：使用數字（50/100…950），對應 Tailwind shade 系統
3. **Brand vs Surface**：`Color/Brand/*` 為完整色階（50-950）；`Color/Surface/Brand-*` 只有 3 個語意 alias（Default/Hover/Active）
4. **Radius 對應 Spacing**：Radius token 全部 alias 同名 Spacing，各有元件使用故保留
5. **Text / Neutral 並存**：兩組色階數值高度重疊，但各有元件獨立綁定，維持拆分
6. **Bootstrap 子群組**：`Color/Bootstrap/` 前綴標示源自 Bootstrap 規範的互動狀態色

---

*Generated from Figma file Variables - 2026-04-21*
