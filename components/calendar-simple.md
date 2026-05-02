# Calendar simple — 單行日期選擇器

兩種變體，差別只在 **dropdown header**：

| variant | 用於 | header |
| --- | --- | --- |
| default | [B] 入住日 / 退房日、[C] 繳款期限 | `<` `2026年 02月` `>`（純標籤） |
| `data-cal-variant="birthday"` | [D] 訂房資料 → 生日（訂房 + 入住 panel） | `<` `<select>year</select> <select>month</select>` `>` |

兩者共用：
- 預設值 = 今日（markup 留空，JS 填 `dayjs().format('YYYY-MM-DD')`）
- 開啟時 dropdown 重置 viewingDate 到目前選取日期
- 今日格子加 `.today`（藍色邊框 1.5px）
- 選中格子加 `.selected`（藍底白字 `#005fcc`）
- 週末標題列粉底（`.title-highlight` `#ffc0cb`）
- 點外部關閉、`window.activeSimpleCalendar` 互斥

**Disable 規則：**

| variant | 過去 | 今日 | 未來 |
| --- | --- | --- | --- |
| default | ❌ disabled | ✅ 可選 | ✅ 可選 |
| birthday | ✅ 可選 | ✅ 可選 | ❌ disabled |

birthday 同時 **允許過去** 又 **禁止未來**：生日不會是明天或之後。最晚可選 = 今日。

---

## Birthday variant 細節（依使用者提供的 reference code）

Header center 換成兩個 `<select>`：

```html
<div class="flex gap-1">
  <select class="year-select calendar-header-select"></select>
  <select class="month-select calendar-header-select"></select>
</div>
```

- 年份：今年 ➜ 1920，遞減填入 (`for y = currentYear; y >= 1920; y--`)
- 月份：1 月 ~ 12 月，`value` 用 `m - 1`（dayjs `.month()` 0-indexed）
- `change` event：`viewingDate = viewingDate.year(yearSelect.value).month(monthSelect.value); render();`
- `click` 都要 `stopPropagation` 避免冒泡關掉 dropdown

`render()` 開頭把兩個 select 的 value 同步到 `viewingDate`，這樣前後月按鈕也會更新 select。

CSS：

```css
.calendar-header-select {
  border: none; background: transparent; font-weight: bold;
  color: #374151; cursor: pointer; padding: 2px 4px; border-radius: 4px;
}
.calendar-header-select:hover { background-color: #f3f4f6; }
.calendar-header-select:focus { outline: 2px solid #005fcc; }
```

---

## HTML 實作

Default：

```html
<div class="rb-cal-cell flex-1">
  <button type="button" class="rb-cal-btn flex items-center w-full bg-white border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 gap-2 cursor-pointer">
    <span class="rb-cal-date flex-1 text-left text-base text-[#454545]"></span>
    <img src="./assets/icons/calendar.svg" class="w-6 h-6" />
  </button>
</div>
```

Birthday：在 wrapper 加 `data-cal-variant="birthday"`：

```html
<div class="rb-cal-cell flex-1" data-cal-variant="birthday">
  <button type="button" class="rb-cal-btn ...">
    <span class="rb-cal-date ..."></span>
    <img src="./assets/icons/calendar.svg" class="w-6 h-6" />
  </button>
</div>
```

JS 在 `initSubPageBehaviors` 內依 `cell.dataset.calVariant === 'birthday'` 切兩個變體的 header。

---

## 不可
- 不可 hard-code 日期字串到 `<span class="rb-cal-date">`（要由 JS 填今日）
- 不可自行發明「年/月切換器另開 picker mode」這類設計（reference 是 inline `<select>`，請照規格）
