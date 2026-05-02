# Order condition（訂單條件摘要卡）

> 元件定義 841:18596（COMPONENT_SET）。  
> ⚠️ 頁面上 Section [C] 是此元件的展開版實例（3 欄、1076px），此 spec 描述元件本體的緊湊單欄版本。  
> **展開版（用於 landing.html [C] 區）的完整規格在本檔最下方「Section [C] 展開版」**。

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

---

## Section [C] 展開版（landing.html 實際使用） — `1449:25447`

> 來源：Figma `Order condition` 單一元件 instance，房間預定 sub-page [C] 區。  
> 與緊湊版差異：3 欄佈局、欄位更多（人數 / 到店方式 / 發票 / 統編 / 抬頭 / 繳款期限 / 折扣 / 總房價 / 加購併單 / 預付百分比 / 預付 / 訂單備註 / 需求備註）。

### 外層

`1140 × 425`，fills `#f6fafd`，stroke `#d1d1d1`，r:12，padding 20

### Header（Frame 369）

`1100 × 27`，flex 兩端對齊
- 「訂單條件」md 20px Regular，fills `#454545`
- `icons/down` 24×24

### Content container

`1100 × 342`，fills `#ffffff`，r:12，padding 12，header → content top gap 16

### Grid — 3 columns

容器內 `Frame 370`：1076×318，三欄 `Frame 412`，**欄寬 337.33，欄距 32**（x=0 / 369.33 / 738.67）。

### 共通 row 規格

- **row 縱向間距 20px**（不是 14px）
- **label column 寬 100px**，font 16px Regular `#454545`，垂直置中（特例：繳款期限）
- **label → input 間距 12px**（label 結束 x=100，input 開始 x=112）
- **input/select 共用樣式**：bg `#ffffff`，stroke `#d1d1d1`，r:6，padding `6 12 6 12`，font 16px `#454545`
- **disabled input**：bg 換 `#e1e1e0`

### Column 1（x=0，6 rows）

| Row | y | h | 內容 |
|---|---|---|---|
| 人數 | 0 | 36 | label `人數` + Select 82.67×36「1」+ `大`(sm 12) + Select 82.67×36「0」+ `小`(sm 12)，元素間距 **12px** |
| 到店方式 | 56 | 36 | label + Select 225.33（內容「自行到店」+ `icons/road` 24×24） |
| 發票 | 112 | 36 | label + Select 225.33（內容「不開發票」） |
| 統編 | 168 | 34 | label + Input 225.33（placeholder，**bg `#e1e1e0` 停用**） |
| 抬頭 | 222 | 34 | label + Input 225.33（placeholder，**停用**） |
| 繳款期限 | 276 | 42 | **label 直排堆疊** + Calendar simple Input 225.33×36 |

#### 人數 row（重點 — 修正項）

```
[「人數」 100px] · 12 · [Select 82.67×36] · 12 · [大 sm 12] · 12 · [Select 82.67×36] · 12 · [小 sm 12]
```

- 兩個 select 為**獨立計數**：第一個 = 大人數，第二個 = 小孩數
- 「大」「小」為 **sm 12px** 後綴文字，**不是 select 的選項或欄位 label 的一部分**
- ❌ 錯誤實作：`人數大/小` label + select(大/小) + / + select(1/2/3)
- ✅ 正確實作：`人數` label + select(0-N) + 大 + select(0-N) + 小

#### 繳款期限 row

```
[label-col 100px:           ] · 12 · [Calendar Input 225.33×36]
  繳款期限 (16px)                      「2026-02-27」+ icons/calendar 24×24
  3 天     (sm 12px)
```

- label column 高 42（label + sm 直排）
- 「繳款期限」y=0，「3 天」y=26（sm 12px）

### Column 2（x=369.33，5 rows）

| Row | y | h | 內容 |
|---|---|---|---|
| 折扣 | 0 | 36 | Select 225.33「無折扣」 |
| 總房價 | 56 | 34 | Input 225.33「1444」 |
| 加購項目併單 | 110 | 36 | Select 225.33「併單」 |
| 預付百分比 | 166 | 36 | Select 225.33「100%」 |
| 預付 | 222 | 34 | Input 225.33「1444」 |

### Column 3（x=738.67，2 rows）

| Row | y | h | 內容 |
|---|---|---|---|
| 訂單備註 | 0 | 88 | Input 225.33×88（textarea，placeholder「???」） |
| 需求備註 | 108 | 88 | Input 225.33×88（textarea，預設「需要瓦斯爐」） |

label 在 row 內**頂端對齊**（y=0），高 19px。

### Tailwind 對照

| Figma | Tailwind |
|---|---|
| 欄距 32px | `gap-8` |
| row gap 20px | `gap-5` |
| label/元素間距 12px | `gap-3` |
| label 寬 100px | `w-[100px] shrink-0` |
| 16px Regular | `text-base` |
| sm 12px | `text-xs` |
| input/select 樣式 | `border border-[#d1d1d1] rounded-[6px] px-3 py-1.5 bg-white text-base text-[#454545]` |
| disabled input | + `bg-[#e1e1e0]` |
| Select 82.67px | `w-[82.67px]`（或近似 `w-20`） |
