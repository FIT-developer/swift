# Calendar simple（單行日期選擇器）

> 用於 [D] 訂房資料表單欄位、[C] 訂單條件「繳款期限」。

---

## 外框

`198.5 × 52`，fill `#ffffff`，pad 8/12

## 內容（Input）

`174.5 × 36`，bg `#ffffff`，stroke `#d1d1d1`，r:6，pad 6/12

| 元素 | 尺寸 | 說明 |
|---|---|---|
| Texts（日期） | 114.5 × 16 | 「2026-02-28」，16px，`#454545` |
| icons/calendar | 24 × 24 | 右側觸發圖示，黑色 Vector |

## HTML 實作

```html
<div class="flex items-center bg-white border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 gap-3 cursor-pointer">
  <span class="text-base text-[#454545] flex-1">2026-02-28</span>
  <img src="./assets/icons/calendar.svg" class="w-6 h-6" />
</div>
```
