# Order condition（訂單條件）

> Section [C]，用於房間預訂頁面。

---

## 外框

`1140 × 425`，fill `#f6fafd`，stroke `#d1d1d1`，r:12，pad 20

## Header（Frame 369）

`1100 × 27`，flex-row justify-between

- Texts「訂單條件」，md（20px SemiBold），`#454545`
- icons/down（24×24），**預設收折**

## Container（body）

`1100 × 342`，fill `#ffffff`，r:12，pad 12

### Frame 370（三欄）

`1076 × 318`，flex-row；各欄寬 337px，欄間距 32px

---

## 欄 1（@ x:0）高 318px，6 rows

| Row | Frame | 欄位 | 控制元件 |
|---|---|---|---|
| 1 | Frame 321 | 人數大/小 | 2× Select（82×36 各）+ 分隔文字 |
| 2 | Frame 352 | 到店方式 | Select 225×36，選項「自行到店」 |
| 3 | Frame 322 | 發票 | Select 225×36，選項「不開發票」 |
| 4 | Frame 346 | 統編 | Input 225×34，fill `#e1e1e0`（disabled），placeholder |
| 5 | Frame 348 | 抬頭 | Input 225×34，fill `#e1e1e0`（disabled），placeholder |
| 6 | Frame 349 | 繳款期限 | Calendar simple 225×36（「3 天」+ 日期「2026-02-27」） |

---

## 欄 2（@ x:369）高 256px，5 rows

| Row | 欄位 | 控制元件 |
|---|---|---|
| 1 | 折扣 | Select 225×36，選項「無折扣」 |
| 2 | 總房價 | Input 225×34，fill `#ffffff`，值 1444 |
| 3 | 加購項目併單 | Select 225×36，選項「併單」 |
| 4 | 預付百分比 | Select 225×36，選項「100%」 |
| 5 | 預付 | Input 225×34，fill `#ffffff`，值 1444 |

---

## 欄 3（@ x:738）高 196px，2 rows

| Row | 欄位 | 控制元件 |
|---|---|---|
| 1 | 訂單備註 | Input 225×88（textarea），fill `#ffffff`，stroke `#d1d1d1` |
| 2 | 需求備註 | Input 225×88（textarea），fill `#ffffff`，值「需要瓦斯爐」 |

---

## Row 佈局規則

每 row：label（Texts 100×22，`#454545`）+ 控制元件（@ x:112）

收折版（collapsed aside）：三欄容器從 1076 → 1336px，各欄仍維持 label+control 佈局。
