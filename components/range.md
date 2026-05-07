# Range（水平時段滑桿）

> 用於 [A] Frame 119「數量分配」列中。

---

## 外框

`562 × 35`，fill `Color/Neutral/0`

## 結構

| 元素 | 尺寸 | x | 說明 |
|---|---|---|---|
| Line 21（軌道） | 388 × 0 | 14, y:16 | stroke `Color/Neutral/300`，水平線 |
| Input（滑桿 handle） | 14 × 14 | -1, y:9 | fill `Color/MenuItem/Default`，r:36（圓形） |
| Frame 107（時段顯示） | 54 × 35 | 508, y:0 | fill `Color/Neutral/0`，stroke `Color/Neutral/100`，r:12；內含時段數字列 |

## Frame 107 內容

`54 × 35`，Frame 103（19×22）內含多個 Texts（每個 19×22，顯示時段 0–10）

## 數量分配 button（Frame 102）

`111 × 38`，@ x:598，fill `Color/Neutral/0`，stroke `Color/Neutral/200`，r:12

| 元素 | 尺寸 | 說明 |
|---|---|---|
| Texts「數量分配」 | 64 × 22 | 16px，`Color/Neutral/800` |
| icons/submit | 15 × 16 | Vector fill `Color/MenuItem/Default`，確認提交 |

## HTML 實作

```html
<!-- Range slider with blue handle -->
<div class="range-slider">
  <div class="range-slider-track"></div>
  <div class="range-slider-handle"></div>
  <!-- time indicator box -->
  <div class="range-slider-time"></div>
</div>
```
