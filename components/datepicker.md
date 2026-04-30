# DatePicker（訂房間數計數器）

> 用於 [B] 訂房資料 Grid「間數欄」（Frame 192）。

---

## 外框

`169 × 52`，pad 8/12

## Header（Frame 736:10402）

`145 × 22`，Texts「訂房間數」，16px，`#454545`

## 控制列（Frame 166）

`145 × 36`，bg `#ffffff`，stroke `#d1d1d1`，r:6，pad 4/12

內含 Frame 152（`121 × 28`）：

| 元素 | 尺寸 | x | 說明 |
|---|---|---|---|
| icons/outline-minus | 24 × 24 | 0 | 減號按鈕（Vector 14×2，`#000000`） |
| Input（數值） | 33 × 28 | 44 | bg `#ffffff`，r:6，pad 6/12，Texts sm「5」，12px，`#454545` |
| icons/outline-plus | 24 × 24 | 97 | 加號按鈕（Vector 14×14，`#000000`） |

## HTML 實作

```html
<div class="flex flex-col gap-2 px-3 py-2">
  <span class="text-base text-[#454545]">訂房間數</span>
  <div class="flex items-center border border-[#d1d1d1] rounded-[6px] px-3 py-1">
    <button class="w-6 h-6 flex items-center justify-center">
      <img src="./assets/icons/outline-minus.svg" class="w-6 h-6" />
    </button>
    <input type="number" value="5" class="w-8 text-center text-xs text-[#454545] border border-[#d1d1d1] rounded-[6px] mx-2" />
    <button class="w-6 h-6 flex items-center justify-center">
      <img src="./assets/icons/outline-plus.svg" class="w-6 h-6" />
    </button>
  </div>
</div>
```
