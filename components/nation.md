# Nation（國籍 Radio）

> 用於 [D] 訂房資料表單「國籍」欄位。

---

## 外框

`272.5 × 22`，flex-row，pad 0

## 結構

| 元素 | 尺寸 | x | 說明 |
|---|---|---|---|
| Texts「國籍」 | 64 × 22 | 0 | label，16px `#454545` |
| 選項群（increasing content） | 144 × 22 | 76 | flex-row，兩個 radio 選項 |

## Radio 選項（Frame 253 / 254）

各 60 × 22，flex-row，gap 8px

| 選項 | radio fill | text |
|---|---|---|
| 臺灣（選中） | `#888888`（深色） + stroke `#d1d1d1 #b0b0b0` | 16px `#454545` |
| 外籍（未選中） | `#b0b0b0`（淺色） + stroke `#d1d1d1` | 16px `#454545` |

### Radio 元件（Input，20×20，r:36）

- 選中：fill `#888888`，stroke `#d1d1d1 #b0b0b0`（雙層邊框）
- 未選中：fill `#b0b0b0`，stroke `#d1d1d1`

## HTML 實作

```html
<div class="flex gap-3">
  <span class="text-base text-[#454545] w-16">國籍</span>
  <div class="flex gap-5">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="nation" value="tw" checked
        class="w-5 h-5 rounded-full accent-[#888888]" />
      <span class="text-base text-[#454545]">臺灣</span>
    </label>
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="nation" value="foreign"
        class="w-5 h-5 rounded-full" />
      <span class="text-base text-[#454545]">外籍</span>
    </label>
  </div>
</div>
```
