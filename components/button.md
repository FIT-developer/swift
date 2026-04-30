# Button（一般按鈕）

> 與 `Button Y/N` 不同。Button Y/N 用於確認/取消流程；Button 用於功能切換或操作觸發。

---

## 尺寸

`88 × 42`，成對使用時兩顆並排（total 176×42，無 gap）

## 狀態

| 狀態 | fill | stroke | text fill | radius |
|---|---|---|---|---|
| 選中 / active | `#005fcc` | `#d1d1d1` | `#ffffff` | mixed（左右兩顆不同角） |
| 未選中 / inactive | `#ffffff` | `#d1d1d1` | `#454545` | mixed |
| 禁用 / disabled | `#e1e1e0` | — | `#e1e1e0` | mixed |

**radius mixed**：成對時左顆左側圓角、右顆右側圓角（pill split），各約 r:28

## 文字

Texts（base），16px Regular，顏色依狀態

## 使用範例

- 空房查詢 / 庫存表（[A] 右側頂部）
- 一般客戶 / 合約客戶（[B] 頂部）
- 清除 / 加入訂單（[A] 底部 Frame 11）

## 底部按鈕群（Frame 11）

`725 × 63`，pad 12，flex-row；清除(Button inactive) + 加入訂單(Button disabled/enabled)
