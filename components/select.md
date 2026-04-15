# Component Specification: `Select`

**Figma Node ID**: `25:95`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Select` 是下拉選單元件，共 **5 個 variants**（屬性 `state`）。  
包含觸發列（Trigger bar）與展開後的選項列表（Select content show）。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=Default` | `25:94` | 266×36px | 預設關閉狀態 |
| `state=disabled` | `881:10045` | 266×36px | 停用狀態 |
| `state=twice section` | `837:14390` | 266×34px | 雙欄位（左數值 + 右下拉） |
| `state=focus` | `25:154` | 266×42px | 展開中（2 個選項） |
| `state=multiple 3` | `765:21972` | 266×42px | 展開中（3 個選項） |

---

## Trigger bar 結構（Default / disabled / focus 共用）

```
Frame 1 (242×24px, x:12, y:6)
├── Texts — base (213×22px, x:0)    ← 已選值或 placeholder
│   └── TEXT  16px  Regular  #454545
└── icons/down (24×24, x:218)       ← 展開箭頭
    └── Vector  fills #000000
```

| 屬性 | 值 | Token |
|---|---|---|
| 外框高度 | `36px` | — |
| Padding | top/bottom `6px`、left/right `12px` | `Spacing/6`、`Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| 文字 variant | `Texts / base (16px Regular)` | — |
| icons/down 位置 | x:218（最右） | — |

---

## Variant 詳細

### state=Default

| 屬性 | 值 | Token |
|---|---|---|
| Background | `#ffffff` | `Color/Neutral/0` |
| Border | `#d1d1d1` | `Color/Neutral/200` |
| 文字色 | `#454545` | `Color/Neutral/800` |

---

### state=disabled

| 屬性 | 值 | Token |
|---|---|---|
| Background | `#d1d1d1` | `Color/Neutral/200` |
| Border | `#d1d1d1` | `Color/Neutral/200` |
| 文字色 | `#888888` | `Color/Neutral/400` |

---

### state=twice section

雙欄位 Select，左側顯示數值欄位，右側為下拉觸發器。

```
[COMPONENT] Select — state=twice section (266×34px)
└── Frame 227 (242×34px, x:12)
    ├── Texts (92×34px, x:4)        ← 左側數值欄（含 top/bottom padding 6px, border #d1d1d1）
    │   └── TEXT "99113322"  16px  Regular  #454545
    └── Frame 1 (140×34px, x:102)  ← 右側下拉觸發器
        ├── Texts (107×22px, x:4)
        └── icons/down (24×24, x:116)
```

| 屬性 | 值 |
|---|---|
| Background | `#ffffff` |
| Border | `#d1d1d1` |
| 左欄寬度 | `92px`，border 分隔 |
| 右欄寬度 | `140px` |
| 使用情境 | 日期範圍、代號 + 名稱組合選擇 |

---

### state=focus（展開，2 選項）

```
[COMPONENT] Select — state=focus (266×42px)
├── Frame 1 (Trigger bar，同 Default)
└── Select content show (261×84px, x:12, y:36)
    ├── cornerRadius 8, fills #ffffff, padding 10px
    ├── Select content — 未選中（30×241px, y:10）  → bg #ffffff
    └── Select content — 已選中（30×241px, y:44）  → bg #86b7fe
```

| 屬性 | 值 | Token |
|---|---|---|
| Border（focus 狀態） | `#86b7fe` | `Color/Bootstrap/components/focus` |
| 下拉面板 background | `#ffffff` | `Color/Neutral/0` |
| 下拉面板 cornerRadius | `8px` | `Radius/8` |
| 下拉面板 padding | `10px` | `Spacing/8`（近似） |
| 選項間距 | y:10 → y:44，gap `4px` | — |

---

### state=multiple 3（展開，3 選項）

```
[COMPONENT] Select — state=multiple 3 (266×42px)
├── Frame 1 (Trigger bar，同 Default)
└── Select content show (261×118px, x:12, y:36)
    ├── Select content (y:10)  → 未選中 #ffffff
    ├── Select content (y:44)  → 未選中 #ffffff
    └── Select content (y:78)  → 已選中 #86b7fe
```

> 高度隨選項數量增加。`multiple 3` 為 3 個選項的示意 variant。

---

## Select content 選項列規格

每個 `Select content` instance（30×241px，cornerRadius 8，padding 4px）：

| 狀態 | 背景 | icons/check 填色 | 文字色 |
|---|---|---|---|
| 未選中 | `#ffffff` | `#ffffff`（不可見） | `#454545` |
| 已選中 | `#86b7fe` | `#f6f6f6` | `#f6f6f6` |

```
Select content (30×241px)
├── icons/check (16×16, x:4)   ← 勾選 icon（未選中時隱形）
└── Texts — base (213×22, x:24)
    └── TEXT "199) 地球村美日語太平洋旅店"  16px  Regular
```

> 完整 `Select content` 規格見 `components/select-content-Specification.md`。

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| Default border | `#d1d1d1` | `Color/Neutral/200` |
| Focus border | `#86b7fe` | `Color/Bootstrap/components/focus` |
| Disabled background | `#d1d1d1` | `Color/Neutral/200` |
| 選中項背景 | `#86b7fe` | `Color/Bootstrap/components/focus` |
| Default 文字 | `#454545` | `Color/Neutral/800` |
| Disabled 文字 | `#888888` | `Color/Neutral/400` |
| 選中項文字 | `#f6f6f6` | `Color/Neutral/50` |

---

## 實作注意事項

1. **展開後高度**：下拉面板使用 `absolute` 定位，不影響文件流高度
2. **icons/down**：展開時可旋轉 180deg（`rotate-180` transition）
3. **twice section**：左欄可為純顯示（readonly input），右欄為實際 select 觸發
4. **選項 icon**：`icons/check` 在未選中時 `opacity-0` 或 `visibility: hidden`

---

*Generated from Figma component set · Updated 2026-04-13*
