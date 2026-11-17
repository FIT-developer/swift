# Housing statistics annual tables

**Current**: 2835:112966 Table desktop, 2210 x 1672, read 2026-11-17.
User confirmed this supplements the same source in main page 2830:113734,
and explicitly authorized preserving its different annual column structures.

## Parent conventions and page-specific differences

Use semantic tables and the existing horizontal-scroll convention from
[HTML conventions](../specs/html-conventions.md). The old allocation/inventory
variants in table.md do not describe this report.

- Outer frame: white Neutral/0, 1px Neutral/200, Radius/12, padding 12 / 16.
- Internal year groups: current 1469 x 1648, previous 701 x 772; gap 8.
- White header, all 16px Regular with Text/800, 22px line box. No brand header
  fill, semibold heading, hover row state or vertical grid lines.
- Header height 38; horizontal rules 1px Neutral/800; current data rows 46.
- Separate borders with zero border spacing preserve exact row geometry;
  only horizontal edges are drawn, so no doubled separators occur.
- The first two current-year columns span each seven-row group and center
  vertically. At group boundaries the horizontal line crosses every column;
  within a group it starts at the weekday column.
- Declines use Chart/green, increases Status-Negative, zeros Text/800.
  Trend markers are source text characters, not the line-chart trend icons.
  Preserve their source text; do not substitute a different icon.
- Column widths and table dimensions are source geometry, not new spacing
  tokens. Cell padding and typography still use existing tokens.

## Current year

Group id 2835:112967, 19 columns in this exact order:

| Column | Width |
|---|---|
| 2026 | 61 |
| 提前幾天訂房 | 120 |
| 星期 | 56 |
| 筆數 | 56 |
| 前期差異 | 88 |
| 成長率 | 72 |
| 累計筆數 | 88 |
| 前期差異 | 88 |
| 成長率 | 72 |
| 間數 | 56 |
| 前期差異 | 88 |
| 成長率 | 72 |
| 累計間數 | 88 |
| 前期差異 | 88 |
| 成長率 | 72 |
| 金額 | 56 |
| 前期差異 | 88 |
| 成長率 | 72 |
| 入住人數 | 88 |

Five groups: 1 / 當日, 2 / 提前一日, 3 / 提前二日,
4 / 提前三日, 5 / 提前四日. Each contains 星期日 through 星期六.
No cumulative amount column and no total row are added.
Preserve all 35 rows, sample values, signs and comma-separated amounts.

## Previous year

Group id 2835:113696, nine columns:

| Column | Width |
|---|---|
| 2025 | 61 |
| 提前幾天訂房 | 120 |
| 筆數 | 56 |
| 累計筆數 | 88 |
| 間數 | 56 |
| 累計間數 | 88 |
| 金額 | 56 |
| 累計金額 | 88 |
| 入住人數 | 88 |

Rows: 1 / 當日, 2 / 提前一日, 3 / 提前二日, 4 / 提前三日,
5 / 提前四日, 合計. Reference row heights are 136 / 132 / 136 / 110 / 110 / 110.
Metric samples are 22 / 5 / 9 / 2 / 4 / 101 respectively in every metric
column. These intentionally remain independent mock values.

## Visibility and responsive behavior

The previous table defaults hidden. Its switch only controls this table;
the current table stays byte-for-byte stable. At <1024 the annual tables
stack with independent horizontal scrolling; >=1024 they share a horizontal
scroll region and are side by side. See the page contract for backend state.
