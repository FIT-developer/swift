# Location（地址欄位組）

> 用於 [D] 訂房資料表單。

---

## 外框

`272.5 × 250`，pad 0

## 結構

| 元素 | 尺寸 | x | y | 說明 |
|---|---|---|---|---|
| Texts「地址」 | 64 × 22 | 0 | 0 | label，16px `#454545` |
| Frame 291（欄位群） | 196.5 × 250 | 76 | 0 | 三個子區塊 |

### Frame 291 內部

**Frame 265（縣/市）**：196.5 × 64，@ y:0
- Texts「縣/市」label，`#454545`
- Select 196.5×36：fill `#d1d1d1`，stroke `#d1d1d1`，r:6
  - 顯示「台中」（placeholder text `#888888`）+ icons/down

**Frame 266（行政區）**：196.5 × 64，@ y:76
- Frame 274：label 群（Texts「行政區」+ Texts「406」並排）
- Select 196.5×36：fill `#d1d1d1`，stroke `#d1d1d1`，r:6
  - 顯示「北屯區」（`#888888`）+ icons/down

**Frame 267（街道）**：196.5 × 64，@ y:152
- Texts「街道」label
- Input 196.5×36：fill `#e1e1e0`，stroke `#d1d1d1`，r:6，placeholder

## Select 樣式

fill `#d1d1d1`（外框背景），stroke `#d1d1d1`；內部文字 `#888888`（placeholder 狀態）

## HTML 實作

```html
<div class="flex gap-3">
  <span class="text-base text-[#454545] w-16">地址</span>
  <div class="flex flex-col gap-4 flex-1">
    <!-- 縣/市 -->
    <div class="flex flex-col gap-1">
      <span class="text-base text-[#454545]">縣/市</span>
      <select class="border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 bg-[#d1d1d1] text-[#888888] text-base">
        <option>台中</option>
      </select>
    </div>
    <!-- 行政區 -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <span class="text-base text-[#454545]">行政區</span>
        <span class="text-base text-[#454545]">406</span>
      </div>
      <select class="border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 bg-[#d1d1d1] text-[#888888] text-base">
        <option>北屯區</option>
      </select>
    </div>
    <!-- 街道 -->
    <div class="flex flex-col gap-1">
      <span class="text-base text-[#454545]">街道</span>
      <input type="text" placeholder="placeholder"
        class="border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 bg-[#e1e1e0] text-base" />
    </div>
  </div>
</div>
```
