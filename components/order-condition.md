# Order condition（訂單條件摘要卡）

> 元件定義 841:18596（COMPONENT_SET）。  
> ⚠️ 頁面上 Section [C] 是此元件的展開版實例（3 欄、1076px），此 spec 描述元件本體的緊湊單欄版本。

---

## 外框（component set）

`391 × 566`，pad 20，stroke `#9747ff`（Figma 元件框線，非頁面樣式）

## 唯一 variant（type=Default，841:18595）

`351 × 526`，r:12，fill `#f6fafd`，stroke `#d1d1d1`，pad 20

---

## Header（Frame 369）

`311 × 27`，@ y:20，flex-row justify-between

| 元素 | 說明 |
|---|---|
| Texts「訂單條件」 | md（20px），`#454545` |
| icons/down（24×24） | @ x:287，預設收折方向 |

---

## 主體（container 813:28134）

`311 × 443`，@ y:63，flex-col，三個子 Frame

---

### Frame 207（輸入區）

`311 × 202`，@ y:0，4 rows

每 row：label（Texts 100×22，`#454545`）+ 控制元件（@ x:112）

| y | Frame | 欄位 | 控制元件 | 值 |
|---|---|---|---|---|
| 0 | 204 | 折扣 | Select 199×36，r:6，fill `#ffffff`，stroke `#d1d1d1` | 無折扣 |
| 56 | 206 | 加購項目併單 | Select 199×36，r:6，fill `#ffffff`，stroke `#d1d1d1` | 不併單 |
| 112 | 205 | 預付百分比 | Select 199×36，r:6，fill `#ffffff`，stroke `#d1d1d1` | 100% |
| 168 | 209 | 預付金額 | Input 199×34，r:6，fill `#ffffff`，stroke `#d1d1d1` | 192229 |

---

### Frame 217（摘要區）

`311 × 162`，@ y:214，含上下 divider（`#888888`）

| 子 Frame | 欄位 | 右對齊值 |
|---|---|---|
| Frame 210 | 加購 | 88,778,877 |
| Frame 211 | 訂金 | 444,222 |
| Frame 212 | 房價 | 88,778,877 |

Row 格式：label（Texts 100×22，left）+ 數值（Texts right-aligned，@ x:229/231）

---

### Frame 216（總計區）

`311 × 55`，@ y:388

| 元素 | 尺寸 | x | y | 說明 |
|---|---|---|---|---|
| Chip「加購併單」 | 56 × 24 | 255 | 0 | fill `#bbf7d0`，r:mixed，12px `#3d3d3d`，pad 4 |
| Frame 213（總計列） | 311 × 27 | 0 | 28 | flex-row justify-between |
| ↳ Texts「總計」 | 100 × 27 | 0 | — | md（20px），`#454545` |
| ↳ Texts「$ 88,778,877」 | 119 × 27 | 192 | — | md（20px），`#454545` |

---

## HTML 實作

```html
<!-- Order condition card -->
<div class="rounded-xl bg-[#f6fafd] border border-[#d1d1d1] p-5">
  <!-- Header -->
  <div class="flex items-center justify-between mb-3">
    <span class="text-xl text-[#454545]">訂單條件</span>
    <img src="./assets/icons/down.svg" class="w-6 h-6" />
  </div>

  <!-- Input rows -->
  <div class="flex flex-col gap-3.5 mb-3">
    <div class="flex items-center">
      <span class="text-base text-[#454545] w-[100px] shrink-0">折扣</span>
      <select class="border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 bg-white text-[#454545] text-base flex-1">
        <option>無折扣</option>
      </select>
    </div>
    <div class="flex items-center">
      <span class="text-base text-[#454545] w-[100px] shrink-0">加購項目併單</span>
      <select class="border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 bg-white text-[#454545] text-base flex-1">
        <option>不併單</option>
      </select>
    </div>
    <div class="flex items-center">
      <span class="text-base text-[#454545] w-[100px] shrink-0">預付百分比</span>
      <select class="border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 bg-white text-[#454545] text-base flex-1">
        <option>100%</option>
      </select>
    </div>
    <div class="flex items-center">
      <span class="text-base text-[#454545] w-[100px] shrink-0">預付金額</span>
      <input type="text" value="192229"
        class="border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 bg-white text-[#454545] text-base flex-1" />
    </div>
  </div>

  <!-- Summary divider + rows -->
  <hr class="border-[#888888] mb-3" />
  <div class="flex flex-col gap-2.5 mb-3">
    <div class="flex justify-between">
      <span class="text-base text-[#454545]">加購</span>
      <span class="text-base text-[#454545]">88,778,877</span>
    </div>
    <div class="flex justify-between">
      <span class="text-base text-[#454545]">訂金</span>
      <span class="text-base text-[#454545]">444,222</span>
    </div>
    <div class="flex justify-between">
      <span class="text-base text-[#454545]">房價</span>
      <span class="text-base text-[#454545]">88,778,877</span>
    </div>
  </div>
  <hr class="border-[#888888] mb-3" />

  <!-- Total row -->
  <div class="relative">
    <span class="absolute right-0 top-0 inline-block bg-[#bbf7d0] text-[#3d3d3d] text-xs px-1 py-1 rounded">加購併單</span>
    <div class="flex justify-between items-center pt-7">
      <span class="text-xl text-[#454545]">總計</span>
      <span class="text-xl text-[#454545]">$ 88,778,877</span>
    </div>
  </div>
</div>
```
