# Checkbox original

> 用於 [B] 表頭 checkbox 欄、庫存表列選取等。

---

## 尺寸

`14 × 14`

## 狀態

| 狀態 | fill（外框） | fill（勾選背景） | stroke |
|---|---|---|---|
| 未選中 | `Color/Neutral/0` | — | （需補讀） |
| 選中 | `Color/Neutral/0` | `Color/MenuItem/Default` | `Color/MenuItem/Default` |

選中狀態：內部 Rectangle（14×14）fill `Color/MenuItem/Default`，stroke `Color/MenuItem/Default`，r:4

## HTML 實作

```html
<!-- 選中 -->
<div class="w-3.5 h-3.5 bg-menu border border-menu rounded-[4px] flex items-center justify-center">
  <svg ...checkmark />
</div>
<!-- 未選中 -->
<div class="w-3.5 h-3.5 bg-white border border-border-disabled rounded-[4px]"></div>
```
