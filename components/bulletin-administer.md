# Component Specification: `Bulletin - Administer`

**Figma Node ID**: `98:579`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`Bulletin - Administer` 是平台管理方（旅宿e管家）發布公告的閱讀面板，供旅宿業者查看系統通知。  
僅有 **1 個 variant**（`state=Default`），所有列預設展開顯示完整內文。  
寬度 836px，比 `Bulletin - vendor`（657px）更寬，欄位也有所不同。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 |
|---|---|---|
| `state=Default` | `98:578` | 836×491px |

---

## 外框

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `836×491px` | — |
| Padding | top `8px`，其餘 `12px` | — |
| Corner radius | `6px` | `Radius/6` |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |

---

## 結構

```
[COMPONENT] Bulletin - Administer (836×491px)
├── Frame 52 — 標題列 (812×39px)
│   ├── Input: icons/message + "旅宿e管家公告"（20px Regular）
│   └── icons/close (24×24, x:788)
├── Bulletin content — 主內容 (812×370px)
│   ├── Frame 18 — 分類篩選 tab 列 (812×34px，9 個 tab)
│   ├── Input — 搜尋列 (124×36px)
│   ├── Frame 1 — 表頭列 (812×34px)
│   ├── Frame 3 — Row 1（展開，含完整內文）(812×112px)
│   └── Frame 19 — Row 2（展開，含完整內文）(812×90px)
└── Frame 19 — 頁尾 (812×46px)
    ├── Texts "共 61 筆"
    └── Pagination
```

---

## 標題列（Frame 52）

| 元素 | 規格 |
|---|---|
| Icon | `icons/message`（24×24） |
| 文字 | `"旅宿e管家公告"`，20px Regular，`Color/Neutral/800` |
| 關閉 | `icons/close`（24×24，x:788） |

> 使用 `icons/message`（平台公告），而非 vendor 的 `icons/bulletin`（管理訊息）。

---

## 分類篩選 Tab 列（Frame 18）

9 個 Input instances 橫向排列，各寬 **90.22px**，文字**置中對齊**（CENTER）：

| # | Tab 文字 | 背景 | 說明 |
|---|---|---|---|
| 1 | `全部` | `Color/Neutral/0` | 未選中 |
| 2 | `一般` | `Color/Neutral/0` | 未選中 |
| 3 | `系統維護` | `Color/Tab/yellow` | **選中**（`Color/Tab/Yellow`） |
| 4 | `系統操作` | `Color/Neutral/0` | 未選中 |
| 5 | `功能調整` | `Color/Neutral/0` | 未選中 |
| 6 | `功能開放` | `Color/Neutral/0` | 未選中 |
| 7 | `功能申請` | `Color/Neutral/0` | 未選中 |
| 8 | `商業合作` | `Color/Neutral/0` | 未選中 |
| 9 | `推廣` | `Color/Neutral/0` | 未選中 |

> 與 `Bulletin - vendor` 差異：  
> - 共 9 個 tab（vendor 有 5 個）
> - 文字對齊：CENTER（vendor 為 LEFT）
> - 內容類別反映平台公告分類（系統維護、功能調整等）

---

## 搜尋列

| 屬性 | 值 |
|---|---|
| 尺寸 | 124×36px |
| Placeholder | `"主題搜尋"` |
| 右側 icon | `icons/search` |
| Background | `Color/Neutral/0` |
| Border | `Color/Neutral/200` |
| Corner radius | `6px` |

---

## 表頭列（Frame 1）

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `Color/Brand/Brand-50` | `Color/Surface/Brand-50` |
| Border | `Color/Neutral/400` | `Color/Neutral/400` |
| 文字字重 | SemiBold 600 | — |

欄位配置（與 vendor 不同，無「來源」欄）：

| 欄 | 群組 | 寬度 |
|---|---|---|
| # | Frame 2（152.5px） | 35px |
| 分類 | Frame 2（152.5px） | 56px |
| 主題 | Frame 3（659.5px） | 551.5px |
| 日期 | Frame 3（659.5px） | 108px |

---

## 資料列（預設全部展開）

每列由「列標題列 + 展開內文」組成，無收合狀態：

### Row 1（系統維護）

| 欄 | 內容 |
|---|---|
| # | `1` |
| 分類 | `系統維護` |
| 主題 | `系統維護與穩定性管理` |
| 日期 | `2026-01-01` |

展開內文：  
`「房況管理透過系統化方式統整每一間房屋的即時狀態，包含入住、空置、維修、清潔與預約資訊，讓管理者一眼掌握整體房源使用情形，減少溝通成本與人為錯誤，同時提升營運效率、服務品質與決策準確度，確保資源被妥善運用並維持良好管理秩序。」`

### Row 2（功能調整）

| 欄 | 內容 |
|---|---|
| # | `2` |
| 分類 | `功能調整` |
| 主題 | `系統功能調整與優化公告版` |
| 日期 | `2025-12-12` |

展開內文：  
`「本次功能調整著重於操作流程優化與系統穩定性提升，針對使用回饋進行介面簡化、效能改善與錯誤修正，讓使用者能更快速完成設定與管理作業，同時降低操作負擔，確保系統運行順暢並支援後續功能擴充需求。」`

### 展開內文樣式

| 屬性 | 值 | Token |
|---|---|---|
| 字號 | `16px` Regular | — |
| 文字色 | `Color/Neutral/800` | `Color/Neutral/800` |
| 對齊 | LEFT | — |
| Background | `Color/Neutral/0` | — |
| Border | `Color/Neutral/200` | `Color/Neutral/200` |
| Corner radius | `6px` | `Radius/6` |
| Padding | `6px` top/bottom，`12px` left/right | — |

---

## 頁尾（Frame 19）

| 元素 | 規格 |
|---|---|
| 筆數 | `"共 61 筆"`，base 16px，`Color/Neutral/800` |
| Pagination | 320×46px，與 vendor 相同結構 |

---

## Bulletin - vendor vs Bulletin - Administer 差異

| 項目 | vendor | Administer |
|---|---|---|
| 使用情境 | 旅宿業者讀內部公告 | 業者讀平台方公告 |
| 標題 icon | `icons/bulletin` | `icons/message` |
| 標題文字 | `"管理訊息"` | `"旅宿e管家公告"` |
| 寬度 | 657px | 836px |
| Variants | 3（Default/hover/collapse） | 1（Default） |
| Tab 數量 | 5 | 9 |
| Tab 對齊 | LEFT | CENTER |
| 欄位 | # / 分類 / 主題 / 來源 / 日期 | # / 分類 / 主題 / 日期 |
| 列展開 | 點擊展開（collapse variant） | 預設展開 |

---

*Generated from Figma component set · Updated 2026-04-13*
