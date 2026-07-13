# Component Specification: `floatIcons/ai`

**Figma Node ID**: `266:13224`（COMPONENT）  
**最後同步**: 2026-04-16
**狀態**: removed（2026-07-13 使用者訂正：AI bot 服務與隨附功能全站移除。
實作已自 `partials/room-booking-modals.html` 與 `shell.css` 刪除；
`ai.svg` 檔案與 tokens（float-circle-mixed / effect-float-shadow）保留未用。
Figma 0713 系統基本 mobile 稿中此 instance 亦為隱藏圖層。
本檔以下內容為歷史規格，不作為實作依據。）

---

## 概述

`floatIcons/ai` 是全站固定在右下角的 AI 客服浮動按鈕，常駐於所有頁面。

---

## 外觀規格

| 屬性 | 值 |
|---|---|
| 整體尺寸 | 40×70px |
| 定位 | `position: fixed; bottom: 24px; right: 24px`（`bottom-6 right-6`） |
| z-index | `50` |
| 排列 | 文字在上、圓形按鈕在下，`flex-col items-center gap-1.5` |

### 文字標籤

| 屬性 | 值 |
|---|---|
| 文字 | 客服 |
| 字號 | `16px`（`text-base`） |
| 色彩 | `Color/Neutral/800` |
| 換行 | `whitespace-nowrap` |

### 圓形 Icon Frame（Frame 78）

| 屬性 | 值 |
|---|---|
| 尺寸 | 48×48px（`w-12 h-12`） |
| 形狀 | 全圓（`cornerRadius: 56`，`rounded-full`） |
| 背景 | `Color/Neutral/75` |
| **外框** | linear-gradient stroke 3px，`Color/Accent/float-circle-mixed-1`（頂）→ `Color/Accent/float-circle-mixed-2`（底） |
| **陰影** | `drop-shadow(0 2px 2px rgba(0,0,0,0.25))` |
| Icon | `icons/ai`，24×24px，色彩 `Color/Icon/Default` |
| Padding | 6px（icon 居中） |

### HTML 漸層外框實作方式

漸層外框無法用 `border` 直接實現，改用雙層包裹：
- 外層：`p-[3px] rounded-full`，使用 `.float-ai-gradient-border` 套用 `Color/Accent/float-circle-mixed-1` → `Color/Accent/float-circle-mixed-2` 與 `--effect-float-shadow`
- 內層：`w-[42px] h-[42px] rounded-full bg-surface-hover`（48 - 3×2 = 42px）

---

## HTML 實作

```html
<div class="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5">
  <span class="text-base text-text-default whitespace-nowrap">客服</span>
  <div class="float-ai-gradient-border rounded-full p-[3px]">
    <button class="w-[42px] h-[42px] rounded-full bg-surface-hover flex items-center justify-center">
      <img src="./assets/icons/ai.svg" class="w-6 h-6" />
    </button>
  </div>
</div>
```

---

## 互動行為

**點擊**：待補充（目前靜態）

---

*Generated from Figma · Updated 2026-04-16*
