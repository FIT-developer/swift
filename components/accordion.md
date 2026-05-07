# Accordion（手風琴容器）

> 用於 [A] 空房與庫存查詢、[C] 訂單條件等大節。

---

## 外框

| 屬性 | 值 |
|---|---|
| 尺寸（展開版） | `1140 × 619`（高度依內容） |
| fill | `Color/Neutral/75` |
| stroke | `Color/Neutral/200` |
| cornerRadius | `12` |
| padding | `20` |

## Header（Frame 99）

`1100 × 27`，flex-row，justify-between

| 元素 | 說明 |
|---|---|
| Texts（md） | 標題文字，`Color/Neutral/800`，20px SemiBold |
| icons/up 或 icons/down | 24×24，展開用 up，收起用 down |

## Content 區

高度依內容，`@y:63`（header 27 + gap 16）

## 收折行為

- header click → 切換 `icons/up` ↔ `icons/down`
- content 區 `overflow: hidden; height: 0` ↔ 自然高度
