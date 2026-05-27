# Offcanvas — 底部滑入面板

Figma source：`COMPONENT_SET Offcanvas` (`1774:50139`)，1477 × 537；目前只有 `type=Default` (`1774:50138`) 一個變體。

---

## Container（type=Default）

| 屬性 | 值 | 來源 |
|---|---|---|
| 寬 | full viewport 寬 | Figma 1437（component frame 內距 20 後內容）|
| 高 | content-fit | Figma 497；隨 body 內容變動 |
| bg | `Color/Neutral/0` (`#ffffff`) | |
| padding | top 12 / left 12 / right 12 / bottom 20 | |
| radius | top 12（下方貼螢幕底） | （慣例，Figma 未獨立標示）|
| 出現位置 | viewport bottom，往上展出 | 行為描述 |

---

## Header（Frame 589）

`1413 × 24` @ x:12, y:12，內含兩元件：

| 元件 | 位置 | 內容 |
|---|---|---|
| Title `Texts/base` | x:0, y:1 | 文字 16px，`Color/Neutral/800`（範例：`月曆`）|
| `icons/close` | 右上 x:1389, y:0 | 24×24，關閉按鈕，點擊→ dismiss offcanvas |

> Title 為**呼叫端決定**的字串，元件本身不綁定特定文案。

---

## Body

Header 與 body 之間沒有 divider line（Figma 標示為單一 24h header bar，下方直接接 body）。

body 內容由呼叫端 slot 進去（範例：Calendar `1773:49925`，351 × 431）。

**2026-05-27 對位 `Content page - 房間預訂 default 0527-a2` `1775:54840` 確認**：
- Offcanvas instance `1776:51484` 在頁面 x=1 y=1043（Figma 標示位置；實際 runtime 是 viewport 底部往上 slide-in）。
- Calendar 在 offcanvas 內 **水平置中**：calendar x=543, w=351 → 居中於 1437 寬 container（(1437-351)/2 ≈ 543）。
- Calendar 與 offcanvas header 間 gap：calendar y=46，header y=12 + h=24 = 36，→ gap 10px。

---

## 行為

- **觸發**：呼叫端 button click → offcanvas 從 viewport 下緣往上 slide-in。
- **dismiss（0527 鎖定，使用者明確規定「有二」）**：
  1. 點右上 `icons/close`（**通用**）
  2. **slot content 內部事件可觸發 dismiss**（context-specific；目前只有 [A] 庫存表 mode 的 calendar day click，見下方段落）
- **不**支援其他 dismiss 路徑：**不**點 backdrop 關、**不**按 Esc 關、**不**滑動關。
- **scroll lock**：開啟時 body scroll 鎖（同 modal 慣例 `[[modal]]`）。
- **slot content**：body 高度跟著內容（calendar 351×431 範例 → container 約 497 高），不固定高度。

### [A] 庫存表 mode 內 calendar 的特殊規則（**↺ 0527 新增**）

當此 offcanvas 由 [A] 空房與庫存查詢「庫存表」mode 的「月曆」button 觸發、body slot 嵌入 Calendar (`1773:49925`) 時：

- Calendar 本身**日期選擇行為不變**（套用 `calendar-simple` 規則：選日 → `.selected`、`.today` 等 highlight）
- **額外**：使用者點擊**任何一個日期格**後，**自動關閉 offcanvas**
  - 即 onDayClick → 完成日期 state 寫入 → 觸發 offcanvas dismiss
  - 不需要使用者再點 close 才能收起

> 此規則**僅**綁定 [A] 庫存表 mode 的這個 offcanvas instance。其他 offcanvas 使用情境（未來若有）不繼承此「auto-close on day click」行為，除非個別指定。

---

## Variant 規畫

目前 Figma 只給 `type=Default`。未來可能增加 variant（例如 `type=full-height`、`type=tray`），需另讀 Figma 才寫進來。

---

## 引用點

- [pages/room-booking.md](../specs/pages/room-booking.md) [A] 0527 — 庫存表 mode 月曆 button 點擊後開啟此 offcanvas。

關聯：[[calendar-simple]]、[[modal]]、[[arrival-method-modal]]（同類 overlay 行為）。
