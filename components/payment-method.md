# Payment method（棟別 / 類型 Filter Tabs）

> 用於 [A] 右側面板，做房型/棟別篩選。

---

## 外框

`541 × 42`，flex-row，無 padding

## 按鈕（dynamic button）

pill 形狀，r:28，高度 42px，寬度依文字自適應

| 狀態 | fill | stroke | text fill |
|---|---|---|---|
| 選中 | `#f7d275` | `#f7d275` | `#454545` |
| 未選中 | `#e1e1e0` | — | `#454545` |

## 預設項目（共 6 顆）

| 標籤 | 寬度 |
|---|---|
| 全部 | 64px |
| A 棟 | 63px |
| B 棟 | 63px |
| C 棟 | 63px |
| 營地風馬牛啦啦（示意，實際依資料） | 144px |
| 支票（示意） | 64px |

> 按鈕數量與文字由後端資料驅動（dynamic）。

## 文字

Texts（base），16px Regular，`#454545`

## HTML 實作

```html
<div class="flex gap-0">
  <button class="px-3 h-[42px] rounded-full bg-[#f7d275] text-[#454545] text-base">全部</button>
  <button class="px-3 h-[42px] rounded-full bg-[#e1e1e0] text-[#454545] text-base">A 棟</button>
  ...
</div>
```
