# Range（水平時段滑桿）

> 用於 [A] Frame 119「數量分配」列中。

---

## 外框

`562 × 35`，fill `#ffffff`

## 結構

| 元素 | 尺寸 | x | 說明 |
|---|---|---|---|
| Line 21（軌道） | 388 × 0 | 14, y:16 | stroke `#b0b0b0`，水平線 |
| Input（滑桿 handle） | 14 × 14 | -1, y:9 | fill `#2178cf`，r:36（圓形） |
| Frame 107（時段顯示） | 54 × 35 | 508, y:0 | fill `#ffffff`，stroke `#e1e1e0`，r:12；內含時段數字列 |

## Frame 107 內容

`54 × 35`，Frame 103（19×22）內含多個 Texts（每個 19×22，顯示時段 0–10）

## 數量分配 button（Frame 102）

`111 × 38`，@ x:598，fill `#ffffff`，stroke `#d1d1d1`，r:12

| 元素 | 尺寸 | 說明 |
|---|---|---|
| Texts「數量分配」 | 64 × 22 | 16px，`#454545` |
| icons/submit | 15 × 16 | Vector fill `#2178cf`，確認提交 |

## HTML 實作

```html
<!-- Range slider with blue handle -->
<div class="relative flex items-center" style="width:562px; height:35px">
  <div class="absolute h-px bg-[#b0b0b0]" style="left:14px; width:388px; top:16px"></div>
  <div class="absolute w-3.5 h-3.5 rounded-full bg-[#2178cf] cursor-pointer" style="left:0; top:10px"></div>
  <!-- time indicator box -->
  <div class="absolute border border-[#e1e1e0] rounded-xl" style="left:508px; width:54px; height:35px"></div>
</div>
```
