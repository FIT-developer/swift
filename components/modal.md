# Component Specification: `Modal`

**Figma Node ID**: `73:576`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Modal` 是全站對話框元件，共 **5 個 variants**（屬性 `state`）。  
全部寬度固定 **320px**，高度依內容變化。  
共用結構：Header（標題 + 關閉）+ Content + Footer（取消/確定）。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=none content` | `73:575` | 320×109px | 無內容確認對話（登出確認） |
| `state=has content` | `73:626` | 320×277px | 有表單內容（帳號切換） |
| `state=password` | `149:6603` | 320×407px | 會員安全管理 — 修改密碼 |
| `state=nick name` | `258:12190` | 320×333px | 會員安全管理 — 修改暱稱 |
| `state=IP` | `258:12241` | 320×455px | 會員安全管理 — IP 登入紀錄 |

---

## 全站 Backdrop（遮罩）規格

> **全站統一**：所有 Modal 共用同一 backdrop 設定，不因 Modal 內容不同而異。

| 屬性 | 值 | 說明 |
|---|---|---|
| HTML 實作 | `rgba(0, 0, 0, 0.4)` | 半透明黑色遮罩，全站統一 |
| z-index | `60`（高於 mobile sidebar `50`） | — |
| 定位 | `position: fixed; inset: 0` | 全屏覆蓋 |
| 關閉行為 | 點擊 backdrop 關閉 Modal | — |

> **Figma 設計稿說明**：設計稿中以全屏 `#d9d9d9` 矩形（Rectangle 3）+ `Subtract` Boolean Operation 表示遮罩示意，**純粹用於 UI 設計稿交付展示**，不對應 HTML 的實際色值，實作時以上方 `rgba(0, 0, 0, 0.4)` 為準。

---

## 共用外框

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `320px` | — |
| Background | `#ffffff` | `Color/Neutral/0` |
| Corner radius | `8px` | `Radius/8` |
| Border | `#b0b0b0` | `Color/Neutral/300` |

---

## 共用 Header（Frame 10）

```
Frame 10 (320×51px)
├── Texts md Bold → 標題文字  20px  SemiBold 600  #454545  (x:12, y:12)
└── icons/close (24×24, x:284, y:13.5)
```

| 屬性 | 值 | Token |
|---|---|---|
| 高度 | `51px` | — |
| Padding | `12px` all sides | `Spacing/12` |
| 下邊框 | `#b0b0b0` + `#00000033`（雙層） | `Color/Neutral/300` |
| 標題字號 | `20px` SemiBold 600 | — |
| 關閉 icon | `icons/close`，x:284（靠右） | — |

---

## 共用 Footer（Frame 11）

```
Frame 11 (320×58px, padding 12px)
├── Button Y/N cancel（取消） (56×34px, x:188)  → bg #d1d1d1
└── Button Y/N 確定 (56×34px, x:252)  → bg #454545
```

| 屬性 | 值 |
|---|---|
| 高度 | `58px` |
| Padding | `12px` all sides |
| 取消按鈕 x | `188px`（從右算：320-12-56-12-56-12 = 172，實為靠右對齊） |
| 確定按鈕 x | `252px` |

---

## state=none content（登出確認）

```
Modal (320×109px)
├── Header — "確定登出？"
├── Texts base 佔位（無實際內容顯示）
└── Footer
```

> 最簡單的確認對話框，無額外表單欄位。

---

## state=has content（帳號切換）

```
Modal (320×277px)
├── Header — "帳號切換"
├── Frame 15 — Content (padding 12px, border #d1d1d1)
│   ├── 暱稱 label (Texts base) + Select "帳號一"（下拉選單）
│   └── 密碼 label (Texts base) + Input "********" + icons/none
└── Footer
```

| 欄位 | 類型 | 示例值 |
|---|---|---|
| 暱稱 | `Select`（state=Default） | "帳號一" |
| 密碼 | `Input`（含 icons/none） | "********" |

---

## state=password（修改密碼）

```
Modal (320×407px)
├── Header — "會員安全管理"
├── Frame 15 — Tab + Content (padding 12px, border #d1d1d1)
│   ├── Tab 列（Frame 61）: 密碼[選中] | 暱稱 | IP 紀錄
│   ├── 新密碼 label + Input (password) + icons/eye-open
│   ├── 新密碼確認 label + Input (password) + icons/eye-open
└── Frame 63 — 原密碼區 (padding 12px, border #d1d1d1)
    ├── 原密碼 label + 說明 "作用於修改密碼與暱稱" (sm)
    └── Input "92!xD2aB" + icons/eye-open
└── Footer
```

### Tab 列規格

**確認日期**：2026-04-16

3 個 Input instance 橫排，`gap: 12px`，**全部無外框（無 strokes）**：

| Tab | Figma 寬度 | HTML class | 選中狀態 | 未選中狀態 |
|---|---|---|---|---|
| 密碼 | 44px | `w-11` | `bg-[#e1e1e0]` | `bg-white`（無底色差異） |
| 暱稱 | 44px | `w-11` | `bg-[#e1e1e0]` | `bg-white` |
| IP 紀錄 | 63px | `w-[63px]` | `bg-[#e1e1e0]` | `bg-white` |

- Padding：`py-1.5 px-3`（6px/12px）
- 字型：`text-base`（16px）`text-[#454545]`
- **不加 border**：選中只有 `bg-[#e1e1e0]`，未選中看起來無框無底色

### 密碼欄位

| 欄位 | 右側 icon |
|---|---|
| 新密碼 | `icons/eye-open` |
| 新密碼確認 | `icons/eye-open` |
| 原密碼 | `icons/eye-open` |

---

## state=nick name（修改暱稱）

```
Modal (320×333px)
├── Header — "會員安全管理"
├── Frame 15 — Tab + Content
│   ├── Tab 列: 密碼 | 暱稱[選中] | IP 紀錄
│   └── 暱稱 label + Input "xiaomi987" + icons/none
├── Frame 63 — 原密碼區（同 password variant）
└── Footer
```

---

## state=IP（IP 登入紀錄）

```
Modal (320×455px)
├── Header — "會員安全管理"
├── Frame 15 — Tab + Content
│   ├── Tab 列: 密碼 | 暱稱 | IP 紀錄[選中]
│   ├── 本次登入區
│   │   ├── 密碼 [90天] 未更換，請定期更新（sm）
│   │   └── IP 61.333.222.19 [TW]（sm）
│   └── 歷史登出入區（3 筆紀錄）
│       ├── 4 天前  2026-12-31 15:15:15 / IP... / 00:11:22
│       ├── 10 天前 2026-12-15 15:15:15 / IP... / 00:11:22
│       └── 90 天前 2026-12-01 15:15:15 / IP... / 00:11:22
└── Footer
```

### IP 紀錄時間色彩

| 時間範圍 | 顏色 | Token |
|---|---|---|
| 近期（4 天前） | `#2178cf` | `Color/MenuItem/Default` |
| 中期（10 天前） | `#ef6f25` | `Color/Surface/Brand-500-Default` |
| 過久（90 天前） | `#e12129` | `Color/Surface/Negative` |

> 密碼 "90天" 未更換的警示也使用 `#e12129`（紅色）。

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| Modal 邊框 | `#b0b0b0` | `Color/Neutral/300` |
| Header 下邊框 | `#b0b0b0` | `Color/Neutral/300` |
| 標題文字 | `#454545` | `Color/Neutral/800` |
| Content 區邊框 | `#d1d1d1` | `Color/Neutral/200` |
| 選中 Tab 背景 | `#e1e1e0` | `Color/Neutral/100` |
| 確定按鈕 bg | `#454545` | `Color/Neutral/800` |
| 取消按鈕 bg | `#d1d1d1` | `Color/Neutral/200` |

---

## 實作注意事項

1. **Overlay**：全站統一使用 `rgba(0, 0, 0, 0.4)` 半透明黑色遮罩（見「全站 Backdrop 規格」）
2. **置中**：`position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`
3. **關閉**：點 icons/close 或遮罩關閉 Modal
4. **Tab 切換**：password / nick name / IP 共用同一 Modal，tab 控制顯示內容
5. **密碼 toggle**：`icons/eye-open` 點擊後切換顯示/隱藏（Figma 未定義 eye-closed icon）

---

*Generated from Figma component set · Updated 2026-04-13 · Backdrop 規格補充 2026-04-15*
