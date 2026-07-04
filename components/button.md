# Button（一般按鈕）

> 與 `Button Y/N` 不同。Button Y/N 用於確認/取消流程；Button 用於功能切換或操作觸發。

---

## 尺寸

`88 × 42`，成對使用時兩顆並排（total 176×42，無 gap）

## 狀態

| 狀態 | fill | stroke | text fill | radius |
|---|---|---|---|---|
| 選中 / active | `Color/Radio/Default` | `Color/Neutral/200` | `Color/Neutral/0` | mixed（左右兩顆不同角） |
| 未選中 / inactive | `Color/Neutral/0` | `Color/Neutral/200` | `Color/Neutral/800` | mixed |
| 禁用 / disabled | `Color/Neutral/100` | — | `Color/Neutral/100` | mixed |

**radius mixed**：成對時左顆左側圓角、右顆右側圓角（pill split），各約 r:28

## 文字

Texts（base），16px Regular，顏色依狀態

## 使用範例

- 空房查詢 / 庫存表（[A] 右側頂部）
- 一般客戶 / 合約客戶（[B] 頂部）
- 清除 / 加入訂單（[A] 底部 Frame 11）

## 底部按鈕群（Frame 11）

`725 × 63`，pad 12，flex-row；清除(Button inactive) + 加入訂單(Button disabled/enabled)

---

## Pill chip variants（Button component-set 416:3458）

主 component-set 包含多個 pill / chip 變體。常用 chip 變體：

| variant ID | 名稱 | radius | padding | fill | stroke | text | 用途 |
|---|---|---|---|---|---|---|---|
| 974:12453 | `circle-none-selected` | 28 | 10/16 | transparent | `Color/Neutral/200` | `Color/Neutral/800` | chip 未選中 |
| 1482:26085 | `circle-selected-yellow` | 28 | 10/16 | `Color/SubItem/Selected` | `Color/SubItem/Selected` | `Color/Neutral/800` | chip 選中（黃） |
| 824:9639 | `circle-one` | 28 | 10/12 | `Color/Radio/Default` | `Color/Neutral/200` | `Color/Neutral/0` | 單顆 pill 選中（藍）— [A] mode-toggle |
| 973:12214 | `circle-selected` | 28 | 10/16 | `Color/Radio/Default` | `Color/Neutral/200` | `Color/Neutral/0` | chip 選中（藍） |
| 973:12218 | `circle-disabled` | 28 | 10/16 | `Color/Neutral/200` | `Color/Neutral/200` | `Color/Neutral/400` | chip 停用 |
| 807:26254 | `focus`（不是 pill） | 8 | 10/12 | `Color/Bootstrap/focus-background` | `Color/Bootstrap/focus-background` | `Color/Neutral/800` | 全部 chip 焦點態 |

**藍 vs 黃**：

- **藍 `Color/Radio/Default`**：mode toggle、客戶類型 toggle 等「兩擇一切換頁面/狀態」場景
- **黃 `Color/SubItem/Selected`**：付款方式 chip（[E] 正式單 panel）、單顆狀態指示。**不要**把藍套到 chip 上，反之亦然。

樣本 HTML：

```html
<button class="rb-pay-chip">傳真刷卡</button>            <!-- inactive -->
<button class="rb-pay-chip rb-pay-active">轉帳</button>  <!-- active 黃 -->
```

CSS 對照 `preview/assets/css/room-booking.css` 的 `.rb-pay-chip` /
`.rb-pay-chip.rb-pay-active`。

---

## 2026-05-02 全域 chip 風格統一

使用者把 Figma 整份所有的 chip / pill 視覺都換成此 yellow variant，包括 [A] 空房查詢的 棟別 filter chips（`全部 / A 棟 / B 棟 / C 棟 / 營地風馬牛啦啦`）。

`.rb-filter-tab` 從原本的「`Color/Neutral/100` 灰底 / 無 border / `Color/SubItem/Selected` 黃 active」改成跟 `.rb-pay-chip` 同套樣式：

```css
.rb-filter-tab {
  height: 42px; padding: 10px 16px; border-radius: 28px;
  background: transparent; border: 1px solid Color/Neutral/200;
  font-size: 16px; color: Color/Neutral/800;
}
.rb-filter-tab:hover { background: Color/Neutral/75; }
.rb-filter-tab.rb-active { background: Color/SubItem/Selected; border-color: Color/SubItem/Selected; }
```

未來若有新 chip 群（例如 [E] 候補單 panel 內的選項），請沿用相同基底樣式，僅改 class name 區隔行為。
