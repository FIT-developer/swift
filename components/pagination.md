# Component Specification: `Pagination`

**Figma Node ID**: `98:974`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Pagination` 是分頁導覽元件，共 **1 個 variant**（`Property 1=Default`）。  
固定寬度 320px，由左右箭頭 + 頁碼按鈕橫向排列組成。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 |
|---|---|---|
| `Property 1=Default` | `98:973` | 320×46px |

---

## 結構

```
[COMPONENT] Pagination (320×46px, padding-top 12px)
├── icons/left  (34×34, x:0,   y:12)  ← 上一頁
├── Input "1"   (50.4×34, x:34,   y:12)  ← 頁碼（白底）
├── Input "2"   (50.4×34, x:84.4, y:12)  ← 頁碼（灰底 = 當前頁）
├── Input "..."  (50.4×34, x:134.8,y:12)  ← 省略
├── Input "4"   (50.4×34, x:185.2,y:12)  ← 頁碼
├── Input "5"   (50.4×34, x:235.6,y:12)  ← 頁碼
└── icons/right (34×34,   x:286,  y:12)  ← 下一頁
```

---

## 箭頭按鈕（icons/left / icons/right）

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `34×34px` | — |
| Background | `Color/Neutral/0` | `Color/Neutral/0` |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |
| Corner radius | `mixed`（圓角僅部分邊） | — |
| Icon fill | `Color/Icon/Default` | — |

---

## 頁碼按鈕（Input instances）

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `50.4×34px` | — |
| Padding | top/bottom `6px`、left/right `12px` | — |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |
| 文字對齊 | CENTER | — |
| 文字字號 | `16px` Regular | — |
| 文字色 | `Color/Neutral/800` | `Color/Neutral/800` |

### 頁碼狀態

| 狀態 | 背景 | Token |
|---|---|---|
| 一般頁碼 | `Color/Neutral/0` | `Color/Neutral/0` |
| 當前頁（active） | `Color/Neutral/300` | `Color/Neutral/300` |
| 省略符號 `...` | `Color/Neutral/0` | — |

---

## 示例排列

```
[←]  [1]  [2★]  [...]  [4]  [5]  [→]
```

★ 當前頁（fill `Color/Neutral/300`）

---

## 尺寸計算

| 元素 | 寬度 | 累計 x |
|---|---|---|
| icons/left | 34px | x:0 |
| 頁碼 ×5 | 50.4px × 5 = 252px | x:34 |
| icons/right | 34px | x:286 |
| 總計 | 34 + 252 + 34 = **320px** | — |

---

## 使用情境

| 元件 | 位置 |
|---|---|
| `Bulletin - vendor` | 頁尾右側，顯示共 61 筆 |
| `Bulletin - Administer` | 頁尾右側，顯示共 61 筆 |

---

## 實作

```html
<nav class="flex items-end pt-3">
  <!-- 上一頁 -->
  <button class="w-[34px] h-[34px] flex items-center justify-center bg-white border border-border-disabled rounded-l-md">
    <img src="../assets/icons/left.svg" class="w-4 h-2.5">
  </button>
  <!-- 頁碼 -->
  <button class="w-[50px] h-[34px] text-base text-center text-text-default bg-white border border-border-disabled">1</button>
  <button class="w-[50px] h-[34px] text-base text-center text-text-default bg-[Color/Neutral/300] border border-border-disabled">2</button>
  <button class="w-[50px] h-[34px] text-base text-center text-text-default bg-white border border-border-disabled">...</button>
  <button class="w-[50px] h-[34px] text-base text-center text-text-default bg-white border border-border-disabled">4</button>
  <button class="w-[50px] h-[34px] text-base text-center text-text-default bg-white border border-border-disabled">5</button>
  <!-- 下一頁 -->
  <button class="w-[34px] h-[34px] flex items-center justify-center bg-white border border-border-disabled rounded-r-md">
    <img src="../assets/icons/right.svg" class="w-4 h-2.5">
  </button>
</nav>
```

---

*Generated from Figma component set · Updated 2026-04-13*
