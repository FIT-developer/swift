# DatePicker（訂房間數計數器）

> 用於 [B] 訂房資料 Grid「間數欄」（Frame 192）。

---

## 外框

`169 × 52`，pad 8/12

## Header（Frame 736:10402）

`145 × 22`，Texts「訂房間數」，16px，`Color/Neutral/800`

## 控制列（Frame 166）

`145 × 36`，bg `Color/Neutral/0`，stroke `Color/Neutral/200`，r:6，pad 4/12

內含 Frame 152（`121 × 28`）：

| 元素 | 尺寸 | x | 說明 |
|---|---|---|---|
| icons/outline-minus | 24 × 24 | 0 | 減號按鈕（Vector 14×2，`Color/Icon/Default`） |
| Input（數值） | 33 × 28 | 44 | bg `Color/Neutral/0`，r:6，pad 6/12，Texts sm「5」，12px，`Color/Neutral/800` |
| icons/outline-plus | 24 × 24 | 97 | 加號按鈕（Vector 14×14，`Color/Icon/Default`） |

## HTML 實作

```html
<div class="flex flex-col gap-2 px-3 py-2">
  <span class="text-base text-text-default">訂房間數</span>
  <div class="flex items-center border border-border-disabled rounded-[6px] px-3 py-1">
    <button class="w-6 h-6 flex items-center justify-center">
      <img src="./assets/icons/outline-minus.svg" class="w-6 h-6" />
    </button>
    <input type="number" value="5" class="w-8 text-center text-xs text-text-default border border-border-disabled rounded-[6px] mx-2" />
    <button class="w-6 h-6 flex items-center justify-center">
      <img src="./assets/icons/outline-plus.svg" class="w-6 h-6" />
    </button>
  </div>
</div>
```
