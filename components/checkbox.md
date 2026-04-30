# Checkbox original

> 用於 [B] 表頭 checkbox 欄、庫存表列選取等。

---

## 尺寸

`14 × 14`

## 狀態

| 狀態 | fill（外框） | fill（勾選背景） | stroke |
|---|---|---|---|
| 未選中 | `#ffffff` | — | （需補讀） |
| 選中 | `#ffffff` | `#2178cf` | `#2178cf` |

選中狀態：內部 Rectangle（14×14）fill `#2178cf`，stroke `#2178cf`，r:4

## HTML 實作

```html
<!-- 選中 -->
<div class="w-3.5 h-3.5 bg-[#2178cf] border border-[#2178cf] rounded-[4px] flex items-center justify-center">
  <svg ...checkmark />
</div>
<!-- 未選中 -->
<div class="w-3.5 h-3.5 bg-white border border-[#d1d1d1] rounded-[4px]"></div>
```
