# Design Tokens

> 來源：Figma Variables（Collection: **Semantic**, Mode: **Mode 1**）  
> Local Styles 全部為空，所有 token 皆來自 Variables。  
> 上次同步：2026-04-13

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
| Color/Neutral/450 | `#6B6B6B` | 次要說明文字（深）— 有獨立元件使用 | `gray-500` |
| Color/Neutral/500 | `#6D6D6D` | 中性文字 — 有獨立元件使用 | `gray-500` |
| Color/Neutral/600 | `#5D5D5D` | 次標題 | `gray-600` |
| Color/Neutral/700 | `#4F4F4F` | 副標題文字 | `gray-700` |
| Color/Neutral/800 | `#454545` | 主要內文 | `gray-700` |
| Color/Neutral/900 | `#3D3D3D` | 強調內文 | `gray-800` |
| Color/Neutral/950 | `#262626` | 最深文字、heading | `gray-900` |

---

### Surface / Brand（主品牌橙色系）

| Variable 名稱 | Hex 值 | 語意用途 | Tailwind 對應建議 |
|---|---|---|---|
| Color/Surface/Brand-50 | `#FEF6EE` | 品牌極淡背景 | `orange-50` |
| Color/Surface/Brand-100 | `#FDEBD7` | 品牌淡背景 | `orange-100` |
| Color/Surface/Brand-200 | `#FAD4AE` | 品牌色階 | `orange-200` |
| Color/Surface/Brand-300 | `#F7B57A` | 品牌色階 | `orange-300` |
| Color/Surface/Brand-400-Hover | `#F28B45` | 主按鈕 Hover | `orange-400` |
| Color/Surface/Brand-500-Default | `#EF6F25` | **主品牌色 / 主按鈕預設** | `orange-500` |
| Color/Surface/Brand-600-Active | `#E05216` | 主按鈕按下 / Active | `orange-600` |
| Color/Surface/Brand-700 | `#BA3D14` | 深品牌色 | `orange-700` |
| Color/Surface/Brand-800 | `#943218` | 更深品牌色 | `orange-800` |
| Color/Surface/Brand-900 | `#772B17` | 深橙/棕 | `orange-900` |
| Color/Surface/Brand-950 | `#40140A` | 近黑橙 | `orange-950` |
| Color/Surface/Default | `#F6F6F6` | 頁面預設背景（= Neutral/50） | `gray-100` |
| Color/Surface/Secondary | `#F9E616` | 輔助強調（鮮黃）— 語意待確認 | `yellow-400` |
| Color/Surface/Accent | `#42EBE9` | 強調色（青色）— 語意待確認 | `cyan-400` |
| Color/Surface/Negative | `#E12129` | 錯誤/危險狀態 | `red-600` |
| Color/Surface/Positive | `#2ACA18` | 成功狀態 | `green-500` |

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

### Border（邊框）

| Variable 名稱 | 解析值 | 語意用途 |
|---|---|---|
| Color/Border/Default | `#E1E1E0` → Neutral/100 | 一般元件邊框 |
| Color/Border/Focus | `#B0B0B0` → Neutral/300 | Focus ring（淺） |
| Color/Border/Plugin-Default | `#6D6D6D` → Neutral/500 | 輸入框預設邊框 |
| Color/Border/Plugin-Focus | `#EF6F25` → Brand-500 | 輸入框 focus 邊框（品牌色） |
| Color/Border/Plugin-Invalid | `#D90000` | 驗證失敗邊框（紅） |

---

### Modal（選單/彈窗）

| Variable 名稱 | 解析值 | 語意用途 |
|---|---|---|
| Color/Modal/Default-Today | `#6D6D6D` → Neutral/500 | 日曆「今天」預設標示 |
| Color/Modal/Options-Selected | `#EF6F25` → Brand-500 | 選單選中項目 |
| Color/Modal/Hover | `#F6FAFD` → Neutral/75 | 選單 hover 背景 |

---

### MenuItem / Radio / SubItem

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/MenuItem/Default | `#2178CF` | 側邊選單連結色（系統藍）— 已修正拼字 |
| Color/Radio/Default | `#005FCC` | Radio/Checkbox 預設 |
| Color/Radio/Hover | `#3B78D5` | Radio/Checkbox Hover |
| Color/SubItem/Selected | `#F7D275` | 子選單選中（黃色標示） |

---

### Bootstrap（元件狀態色）

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Bootstrap/components/focus | `#86B7FE` | Focus ring（Bootstrap 藍） |
| Color/Bootstrap/focus-background | `#D3EBFD` | Focus 狀態背景 |
| Color/Bootstrap/aside/Notification | `#F44DF4` | 提示註解元件用色（洋紅）— 已從 `aside/hover` 改名 |

---

### Accent（點綴色）

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Accent/pink | `#FFC0CB` | 粉紅點綴 |
| Color/Accent/light-green | `#BBF7D0` | 淡綠點綴 |
| Color/Accent/Green | `#34C759` | 綠色標籤/chip（Input component Green variant） |

---

### Tab（分頁標籤）

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Tab/Yellow | `#ffcc00` | 選中 tab 背景色（Bulletin 分類篩選） |

---

### Chart（圖表資料色）

> 專用於圖表系列色，與其他語意 token 數值可能重疊，但語意獨立。

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/Chart/blue | `#86B7FE` | 圖表藍色資料系列（與 Bootstrap/components/focus 同值，語意獨立） |
| Color/Chart/purpleRed | `#FF0BD6` | 圖表紫紅色資料系列（折線圖） |
| Color/Chart/green | `#34C759` | 圖表綠色資料系列（與 Accent/Green 同值，語意獨立） |

---

### Scrollbar（捲動條）

> 此色值出現於 Figma 視覺稿，但 HTML 捲動條由瀏覽器自動生成，實作時**不需直接引用**。  
> 記錄於此供設計稿對照。

| 名稱（非 Figma variable） | Hex 值 | 語意用途 |
|---|---|---|
| Color/Scrollbar/Default | `#D9D9D9` | 捲動條指示器顏色（Figma 視覺稿用） |

---

### SubItem

| Variable 名稱 | Hex 值 | 語意用途 |
|---|---|---|
| Color/SubItem/Selected | `#F7D275` | 子項目選中狀態（黃） |

---

## 間距 (Spacing)

| Variable 名稱 | 值 | 用途 | Tailwind 對應 |
|---|---|---|---|
| Spacing/0 | `0px` | 無間距 | `p-0` / `gap-0` |
| Spacing/2 | `2px` | 極小 | `p-0.5` |
| Spacing/4 | `4px` | 超小 | `p-1` |
| Spacing/6 | `6px` | 小 | `p-1.5` |
| Spacing/8 | `8px` | 小 | `p-2` |
| Spacing/12 | `12px` | 元件內 padding | `p-3` |
| Spacing/16 | `16px` | 預設間距 | `p-4` / `gap-4` |
| Spacing/18 | `18px` | 特殊用途（非 4px 格線） | — |
| Spacing/20 | `20px` | 元件外 padding | `p-5` |
| Spacing/24 | `24px` | Section 內間距 | `p-6` |
| Spacing/28 | `28px` | — | `p-7` |
| Spacing/32 | `32px` | 較大間距 | `p-8` |
| Spacing/36 | `36px` | — | `p-9` |
| Spacing/40 | `40px` | Section 間距 | `p-10` |
| Spacing/44 | `44px` | — | `p-11` |
| Spacing/56 | `56px` | 大間距 | `p-14` |
| Spacing/60 | `60px` | — | `p-[60px]` |
| Spacing/72 | `72px` | — | `p-18` |
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
> 說明：Typography Token 是把字體大小、行高、字重等打包成有名字的設計變數。  
> 有了它，修改全站字體規格只需改一個地方；沒有的話，每個元件節點都要逐一手調。  
> **現階段不做不影響運作，但若未來要換字體或做多語版本，補上會省很多力氣。**

| 觀察名稱 | 大小 | 推測行高 | 用途 |
|---|---|---|---|
| `sm` | ~14–16px | ~20px | 輔助說明、badge、日期 |
| `base` | ~20–22px | ~28px | 主要內文、選單項目 |
| `md` | ~24–27px | ~32px | Section 標題 |

---

## 陰影 (Shadows)

> 目前 **無 Effect Style（陰影）定義**，元件無陰影 token。  
> 若有陰影需求建議後續補充 `shadow-sm`（卡片）與 `shadow-md`（彈窗）兩個層級。

---

## 命名規範說明

1. **分組層級**：`Category/SubCategory/Scale`，以斜線分隔、大寫開頭
2. **色彩 Scale**：使用數字（50/100…950），對應 Tailwind shade 系統
3. **語意後綴**：狀態直接接在 scale 後，如 `Brand-500-Default`、`Brand-600-Active`
4. **Radius 對應 Spacing**：Radius token 全部 alias 同名 Spacing，各有元件使用故保留
5. **Text / Neutral 並存**：兩組色階數值高度重疊，但各有元件獨立綁定，維持拆分
6. **Bootstrap 子群組**：`Color/Bootstrap/` 前綴標示源自 Bootstrap 規範的互動狀態色

---

## 待辦事項

> 以下需在 **Figma 端手動操作**（MCP 工具無 rename variable 功能）：

| 狀態 | 項目 |
|---|---|
| ✅ 已完成 | `Color/MenuItem/Default` — 拼字已修正（verified 2026-04-13） |
| ✅ 已完成 | `Color/Bootstrap/aside/Notification` — 已改名（verified 2026-04-13） |
| ✅ 已完成 | 刪除孤兒 token `Number = 80` |

---

*Generated from Figma file Variables · 2026-04-13*
