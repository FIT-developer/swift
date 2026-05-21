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
| icons/up 或 icons/down | 24×24，**展開（內容顯示）用 down、收起（內容隱藏）用 up** |

## Content 區

高度依內容，`@y:63`（header 27 + gap 16）

## 收折行為

- header click → 切換箭頭方向：
  - 內容**展開**（顯示）→ `icons/down`（箭頭朝下）
  - 內容**收起**（隱藏）→ `icons/up`（箭頭朝上）
- content 區 `overflow: hidden; height: 0` ↔ 自然高度

> **箭頭方向來源**（Figma Component Set `Accordion` `418:3834`，2026-05-21 以 `figma-go` 讀取）：
> - `type=accordion none collapsed`（`418:3835`，只有 header、無 content）= 收起態 → `icons/up`
> - `type=accordion collapsed`（`957:16417`，含 `flexible content`）= 展開態 → `icons/down`
> - `type=extend N`（含 content）= 展開態 → `icons/down`
> - ⚠️ Figma variant 命名與實際狀態相反（「none collapsed」其實是收起、「collapsed」其實是展開），以**是否含 content child** 判定狀態，勿被名稱誤導。
