# Page: 報表資訊 / 住房統計

**Status**: self-tested / user-authorized commit & push on 2026-11-17.
**Read / confirmed**: 2026-11-17. Current source is the four selections below,
plus the user's confirmed behavior and responsive layout.

## Current implementation contract

| Source | Node id | Name | Frame size |
|---|---|---|---|
| Main page | 2830:113734 | 住房統計表 - 1117 v1.1 | 1440 x 2182 |
| Enabled filter variant | 2835:114457 | shirnk-model-1 | 1140 x 320 |
| Explanation | 2836:109151 | Tooltips, state=left | 745 x 404 |
| Expanded table | 2835:112966 | Table desktop | 2210 x 1672 |

- Explanation was reread after the user removed the duplicate room-count row.
  Its earlier 745 x 442 version is reference only.
- Expanded table supplements the embedded table 2835:111475 in the first page,
  as explicitly confirmed by the user. All columns, text, nested structure and
  styles match. Only measured trend text bounds differ; do not use glyph bounds
  as cell dimensions.
- Source JSON / PNG / SVG are local QA evidence in session-191; the corrected
  explanation and implementation QA are in session-192.
- Current defaults are confirmed behavior, not inferred from selected variants:
  today-to-today in Asia/Taipei, all selects at 全部, comparison and NoShow off,
  previous-year select disabled, 2025 table hidden, explanation closed.
- All source metrics, years, differences, growth and totals are mock data.
  Keep the 2026 and 2025 sample labels; changing dates does not recalculate or
  rename either report. Backend owns real data and report business logic.

## Layout and content order

1. Shared shell: aside, topbar and page tabs. Aside label is 住房統計; active
   page tab is 住房統計表 as shown in Figma.
2. Filter panel.
3. Download button.
4. Current-year table, then optional previous-year table.

Desktop source shell: horizontal padding 20, vertical padding 12, sidebar 240,
sidebar-to-main gap 20, main width 1140 and vertical content gaps 24.
Implement fluid constraints and the shared shell; do not hard-code a 1440 page.

Filter panel 2830:112940: fill Color/Neutral/75, border 1px
Color/Neutral/200, Radius/12, Spacing/20 padding. Three 340px reference groups
with Spacing/40 gaps. Reuse the member-data container-query pattern, with a
300px fluid group minimum derived from this page's shorter fields. Three
groups need 980px content, two need 640px; smaller content stacks groups.
This also accommodates the browser scrollbar at the 1440px reference width. No new
accordion state is introduced for the filter.

- First group: two 36px date fields, gap 12; four 42px quick-period controls
  今日 / 本週 / 本月 / 今年 in a two-column grid with gap 12; info + 說明
  pill below. Date row to period section gap 20, period section vertical
  padding 12. Calendar icons and arrows come from the existing icon library.
- Second group: 訂房來源 / 國籍 / 分類一 / 分類二, each showing 全部;
  label reference width 100, label-to-control gap 12, field gap 20,
  select height 36, Radius/6, padding 6 / 12.
- Third group: 去年同期 label + 64 x 28 shared switch + 156px reference
  select; NoShow label and switch below. At <1024px, label and switch stay
  on the first line; the switch keeps its original 64 x 28 size and position
  after the label, gap Spacing/12. Only the select occupies a
  full-width second line, gap Spacing/12. At >=1024px all three stay inline.
  This user correction supersedes shrinking the select into leftover space.
- Bottom actions are right aligned 清除 / 查詢, gap 8, top padding 20 and
  bottom padding 8. Use the common 56 x 34 Button Y/N geometry and text.
- Typography: project Noto Sans TC, 16px Regular / 22px line box, Text/800.
  Inputs white, border Neutral/200; disabled year select Neutral/200 fill /
  Text/400; clear Neutral/200 and query Neutral/800 with Text/100.
- Pill buttons: 96 x 42 source reference, Radius/28, padding 10 / 16,
  icon 24, icon-to-copy gap 8. Button copy is 說明 / 下載.

## Confirmed behavior and backend boundary

- Comparison switch immediately and only shows/hides the 2025 table. It also
  enables/disables its adjacent select using the supplied on/off visuals.
  The 2026 DOM, comparison columns, text and values stay unchanged.
- NoShow is a real independent switch, retained in form state for the backend;
  it does not filter or recalculate the mock report.
- All five select option lists currently contain only the supplied 全部 option.
  Backend will supply options; do not invent nationalities, categories or
  comparison scopes.
- Quick period centers reset to the named current period. Previous/next move
  by that period, using independent offsets. Weeks begin Monday, matching the
  existing member-data date controls. Dates use Asia/Taipei and UTC date math
  to avoid host timezone and daylight-saving offsets.
- Date inputs use the browser's native date picker with the Figma closed-field
  appearance. Past dates are allowed for historical reporting; do not copy
  booking-calendar rules which disable past dates. Calendar icon invokes the
  picker; keyboard entry remains available. A real DOM text overlay mirrors
  the native input value as YYYY-MM-DD, preserving the source format across
  browser locales. It is aria-hidden; the underlying date input keeps its
  label and native keyboard semantics, with a visible wrapper focus ring.
- Only query submits draft filters. Prevent page navigation, preserve the
  sample table, and emit `housing-statistics:query` with a snapshot of filters.
  No fabricated success message, report loading state or calculation.
- Clear immediately restores today-to-today / 全部 / switches off, disables
  the comparison select, hides the previous table and resets period offsets.
  Applied query state also returns to defaults.
- Download provides UI only. It can emit `housing-statistics:download` for
  backend wiring, but produces no CSV, file, network call, toast or dialog.
- Explanation opens from the info + 說明 button. Reuse click / outside / Escape
  behavior from the order-processing help pattern. Use a native nonmodal
  popover for light dismissal, top-layer rendering and focus handling. Its
  viewport-contained placement does not claim an absolute canvas position.

## Responsive contract

User explicitly confirmed: below 1024px the two annual tables stack, and at
1024px and above they sit side by side. Internal columns remain horizontal
and scrollable at every viewport. This is not a card or transposed-column view.

- Large view: one shared horizontal scroll region contains both tables, with
  the reference 8px gap and one outer frame. Preserve their different heights
  and row groupings. Do not align previous-year aggregate rows to weekdays.
- Small/tablet view: each table has its own horizontal scroll region, with
  current year above previous year, in the same outer frame. Hidden previous
  year consumes no space. Keep each scroll surface keyboard focusable.
- No sticky header or sticky column is added: none is defined by current source.
- Comparison controls stack below 1024px independently of the filter grid's
  container column count, so tablet option text retains the full group width.
- Check 360 / 375 / 768 / 1023 / 1024 / 1440 and expanded/collapsed sidebar.
- Tooltip text wraps and its content scrolls if needed, staying at least 12px
  inside the viewport. No page-level horizontal overflow.

## Old HTML/spec versus current Figma checkpoint

| Disposition | Scope and reason |
|---|---|
| Reuse | Shared shell/navigation/topbar modals; existing native select and switch patterns; member-data date period math and query container pattern |
| Figma overrides | White Regular table header and Neutral/800 horizontal lines replace generic table.md brand header examples for this page only |
| Figma overrides | Rich explanation uses 20px headings / 16px body / padding 8, rather than generic tooltips.md 12px / padding 2 |
| Figma overrides | DatePicker instance is state=stepper with Title show=false; never render serialized 訂房間數 or use room-count +/- controls |
| User overrides | Today defaults, backend boundaries, duplicate explanation removal, comparison-only visibility and 1024px annual-table arrangement |
| Reference only | Placeholder sidebar labels, xxoo tab, hidden topbar nodes, old tooltip slot placeholder and archived page/section specs |

No unresolved visual source conflicts remain in the implemented scope.
See [table contract](../../components/housing-statistics-table.md) and
[explanation contract](../../components/housing-statistics-help.md).

## Verification requirements

- Assert 19 current-year columns, five seven-row groups, seven weekday labels
  per group; nine previous-year columns with five groups plus total.
- Compare current table markup before/after both switches and query/clear.
- Check only comparison affects previous-table visibility; NoShow remains independent.
- Check query snapshots, default/reset dates, all quick periods and native
  calendar trigger behavior; no download or report calculation.
- Verify exact explanation copy, one 間數 definition and dismissal paths.
- Four lints, JS syntax, complete browser smoke, responsive screenshots and
  viewport/tooltip bounds checks. Keep preview server 8000 available for review.

## Current verification

- Four lints / six related JS syntax checks / whitespace checks pass.
- Full Chrome smoke: 14 pages / 196 checks; housing page has 17 checks.
- Additional 60 source / interaction / layout probes pass. All source report
  cells and corrected explanation strings match exactly. No runtime errors.
- Source geometry: current table 1469 x 1648, header 38, detail rows 46.
- Tested 360 / 375 / 768 / 900 / 1023 / 1024 / 1280 / 1440, comparison on/off,
  independent switches, collapsed sidebar, help and a short 360 x 480 viewport.
- Native touch scroll of one annual table leaves the other unchanged; keyboard
  horizontal scrolling and native date picker buttons were exercised.
- QA artifacts: specs/qa-screenshots/session-192, including probes-final.json.
- Follow-up comparison controls: 14 on/off viewport cases verified in session-193.
  At <1024px only the select spans the next row; toggle remains 64 x 28.
- Preview: http://localhost:8000/housing-statistics.html.
