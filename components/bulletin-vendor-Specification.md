# Component Specification: `Bulletin - vendor`

**Figma Node ID**:（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Bulletin - vendor` 是廠商訊息公告面板，顯示系統公告列表（含篩選分類、搜尋、表格、分頁）。  
共 **3 個 variants**（屬性 `status`）。

---

## Variants

| Variant 名稱 | 尺寸 | 說明 |
|---|---|---|
| `status=Default` | 681×379px | 預設，列表收合 |
| `status=hover` | 681×357px | 第一列 hover（顯示游標） |
| `status=collapse` | 681×413px | 第一列展開，顯示完整內文 |

---

## 外框

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `681×379px`（Default） | — |
| Padding | top `8px`，其餘 `12px` | — |
| Corner radius | `8px` | `Radius/8` |
| Border | `#d1d1d1` | `Color/Neutral/200` |
| Background | 無（透明） | — |

---

## 結構

```
[COMPONENT] Bulletin - vendor (681×379px)
├── Frame 49 — 標題列 (657×39px)
│   ├── Input instance — icons/bulletin + "管理訊息"（20px Regular）
│   └── icons/close (24×24)
├── Bulletin content — 主內容 (657×varies)
│   ├── Group 1 — 分類篩選 tab 列 (657×34px)
│   │   ├── Input "全部"（165.23px）
│   │   ├── Input "全部"（165.23px）
│   │   ├── Input "提醒"（165.23px，fill #ffcc00 = 選中）
│   │   ├── Input "總部訊息"（165.23px）
│   │   └── Input "交班訊息"（165.23px）
│   ├── Input — 搜尋列（124×36px）："主題搜尋" + icons/search
│   ├── Frame 1 — 表頭列 (657×34px)
│   ├── Frame 3 — 資料列 1 (657×34px，hover 時展開為 90px)
│   └── Frame 4 — 資料列 2 (657×34px)
└── Frame 19 — 頁尾 (657×46px)
    ├── Texts base "共 61 筆"
    └── Pagination instance
```

---

## 標題列（Frame 49）

| 元素 | 規格 |
|---|---|
| Icon | `icons/bulletin`（24×24） |
| 文字 | `"管理訊息"`，20px Regular，`#454545` |
| 關閉 | `icons/close`（24×24，右側） |

> 標題使用 **Regular 400**（非 SemiBold），與其他 section Title 不同。

---

## 分類篩選 Tab 列（Group 1）

5 個 Input instances 橫向排列，各寬 **165.23px**：

| Tab | 文字 | 背景 | 說明 |
|---|---|---|---|
| 1 | `"全部"` | `#ffffff` | Default 狀態 |
| 2 | `"全部"` | `#ffffff` | Hover 狀態（同一 tab 的兩種狀態並排展示） |
| 3 | `"提醒"` | `#ffcc00` | **選中狀態**（黃底） |
| 4 | `"總部訊息"` | `#ffffff` | 未選中 |
| 5 | `"交班訊息"` | `#ffffff` | 未選中 |

> Tab 1 與 Tab 2 均為「全部」tab，分別代表 default 與 hover 兩種狀態，為 component set 並排展示慣例。  
> ⚠️ 各 tab 之間存在因 padding 造成的間距斷層，為已知設計問題，暫不處理。

---

## 搜尋列

| 屬性 | 值 |
|---|---|
| 尺寸 | 124×36px |
| placeholder | `"主題搜尋"` |
| 右側 icon | `icons/search` |
| Background | `#ffffff` |
| Border | `#d1d1d1` |
| Corner radius | `6px` |

---

## 表頭列（Frame 1）

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `#fef6ee` | `Color/Surface/Brand-50` |
| Border | `#888888` | `Color/Neutral/400` |
| 文字字重 | **SemiBold 600** | — |

欄位配置：

| 欄 | 寬度 | 文字 |
|---|---|---|
| # | ~35px | `"#"` |
| 分類 | ~56–88px | `"分類"` |
| 主題 | 288.5px | `"主題"` |
| 來源 | 108px | `"來源"` |
| 日期 | 108px | `"日期"` |

左群組（Frame 2，152.5px）：# + 分類  
右群組（Frame 3，504.5px）：主題 + 來源 + 日期

---

## 資料列

每列 657×34px，Regular 400，`#454545`：

| 列 | # | 分類 | 主題 | 來源 | 日期 |
|---|---|---|---|---|---|
| Row 1 | `1` | `提醒` | `2026 年春節假期訂房規則` | `總部` | `2026-01-01` |
| Row 2 | `2` | `交班訊息` | `夜間稽核要做` | `分館` | `2026-01-01` |

---

## status=hover（第一列 hover）

與 Default 相同，差異：
- 第一列（Frame 3）背景色變為 `#e1e1e0`（`Color/Neutral/100`）— 補上的色差
- 疊加 `icons/cursor`（24×24）於第一列上

---

## status=collapse（第一列展開）

第一列展開，Frame 3 從 34px 增高至 **90px**，顯示完整內文：

```
展開內容（第一列）:
「即時掌握房屋狀態，整合入住、退房、維修與清潔資訊，
清楚呈現空房與使用情形，提升管理效率與營運透明度。」
16px  Regular  #454545
```

---

## 頁尾（Frame 19）

| 元素 | 規格 |
|---|---|
| 筆數文字 | `"共 61 筆"`，base 16px，`#454545` |
| Pagination | 320×46px instance，見 `components/pagination-Specification.md` |

### Pagination 預覽（內嵌）

icons/left → `1` → `2`（current，bg `#b0b0b0`）→ `...` → `4` → `5` → icons/right  
各頁碼 Input 50.4×34px，current page fill `#b0b0b0`

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| 表頭背景 | `#fef6ee` | `Color/Surface/Brand-50` |
| 表頭邊框 | `#888888` | `Color/Neutral/400` |
| 選中 Tab 背景 | `#ffcc00` | `Color/Tab/Yellow` |
| Current page | `#b0b0b0` | `Color/Neutral/300` |
| 文字 | `#454545` | `Color/Neutral/800` |
| 邊框 | `#d1d1d1` | `Color/Neutral/200` |

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| Tab 間距斷層（padding 問題） | ⬜ 已知，暫不處理 |
| 第三列及以上的資料列 | Figma 僅示意 2 列 |

---

*Generated from Figma component set · Updated 2026-04-13*
