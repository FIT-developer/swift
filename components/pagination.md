# Pagination

Status: current. User confirmed site-wide unification on 2026-11-18.
The user accepted the implementation and authorized commit and push on 2026-11-18.

## Source and precedence

The user explicitly selected the existing purchase-addon page as the current
reference: its product and category tables use centered circular pagination.
This instruction supersedes the old Figma98:974 /98:973 connected rectangular
pager, member main page right alignment and legacy modal pager examples.
No Figma reread is required for this user-directed correction.

## Shared structure and styles

- All table bottom pagers use nav.table-pagination with a descriptive aria-label.
- Three controls only: previous button, current page span, next button. Current
  page is a number with aria-current=page; do not list multiple page numbers.
- Both buttons use .table-pagination-nav and native disabled at the first/last
  page. The number uses .table-pagination-current.
- Shared source of appearance: preview/assets/css/pagination.css, imported by
  app.css. Page domains must not redefine pagination alignment or control styles.
- The row is horizontally centered within its table/card/footer, gap Spacing/8,
  padding-top Spacing/12. No right-aligned alternative.
- Controls are36 x36 circles: Spacing/36 for dimensions, Radius/36 clamped to
  half the dimensions by CSS; border1px Color/Neutral/200.
- Previous/next: Color/Bootstrap/focus-background. Current page: Color/Neutral/0.
  All text uses Color/Text/800, --font-size-base16px, weight400.
- Icons are the existing left.svg /right.svg,20px via Spacing/20, empty alt;
  native button aria-label gives the previous/next accessible name.
- Disabled nav opacity0.45 and disabled icon opacity0.45 match the purchase-addon
  reference. Keep native keyboard activation and global focus-visible styling.
- A shared [hidden] rule removes all-mode pagers from layout and tab order.
- Footers containing a record count use .table-pagination-footer and
  .table-pagination-count. The pager stays centered independently of the count,
  with fluid columns and no viewport overflow.
- If a footer's own available width is260px or less, a container query puts the
  count on its own row and keeps the pager centered below, with Spacing/8 row gap.
  Query rules target descendants; the footer never queries its own styles.

## Current consumers and audit

| Consumer | Source | Previous divergence | Result |
| --- | --- | --- | --- |
| Purchase product table | purchase-addon.js | Reference implementation | Shared styles, same appearance and data hooks |
| Purchase category table | purchase-addon.js | Reference implementation | Same shared styles |
| Member main table | member-data.html /member-data.css | Right aligned34px rounded-square buttons and unframed number | Centered36px circles, left/right icons20px |
| Member booking history | partials/member-data-modal.html | Right aligned connected seven-cell pager | Three circular controls, centered independently of record count |
| System announcement | partials/topbar-modals.html | Right aligned connected seven-cell pager | Same shared footer and three controls |

Top page tabs, project wizard previous/next steps and carousel controls represent
other navigation functions; they are outside table pagination.

## Behavior and backend boundary

- Preserve existing all /paged toggles, page sizes, records, sorting/filtering,
  selection preservation and first/last disabled logic on purchase/member pages.
- Purchase table data-pa-page-target and member data-member-page hooks remain.
  Legacy selector classes may remain as hooks, but have no independent CSS.
- Announcement and member-history pagination remain illustrative static backend
  surfaces, with current page2 and count61 retained. This visual unification
  does not invent unavailable records, networking or a new pagination engine.

## Verification and regression guard

- The partial lint audits all HTML/JS consumers for required shared pager classes,
  and rejects per-domain pager CSS and deprecated connected-pager styles.
- Browser checks compare computed centering, circle dimensions, colors, icons
  and source behavior across320 /375 /768 /1440 widths.
- All /paged toggles, first/last page boundaries, filtering, record selection,
  shared modal loading and OTA menu removal are included in verification.
