# Status pages

Status: current, user-confirmed 2026-11-18; implementation self-tested.
The user accepted it and explicitly authorized commit and push on 2026-11-18.

## Delivery mapping

Four independent outer pages. Backend decides which one to render for the user.
Shared component and exact source geometry: [Status page](../../components/status-page.md).

| Delivery file | State | Heading | Source section |
| --- | --- | --- | --- |
| preview/status1.html | not-found | 網頁不存在 | `328:15233` |
| preview/status2.html | ip-error | 拒絕非台灣 IP | `328:15234` |
| preview/status3.html | other-error | 有些地方出錯了, followed by source U+2026 | `328:15235` |
| preview/status4.html | maintenance | 網頁維護中 | `351:20754` |

## Final confirmed contract

- Four1440 x 957 Figma sections, all white; group centered on both axes.
- Third page puts its ice-cream illustration above its heading. Fourth page
  has no action. First/second retain their separate heading-first compositions.
- Mobile reuses the composition with proportional illustration shrinking.
  Maintenance centering correction is explicit user instruction and supersedes
  the old x/y offset; the user says the original has also been corrected.
- Backend fills the return destination on the first three pages. Return hover
  is light blue, using existing Color/Bootstrap/focus-background.
- Two new Variables are supplied directly by user screenshot:
  Color/Surface/Linger-start and Color/Surface/Linger-End. Update tokens.md
  and base.css without querying Figma or inventing raw-export metadata.
- Heading32px / 600; supporting line16px / 400 on status2; return20px / 600
  with24px existing return.svg. Project font remains Noto Sans TC.

## Old spec / HTML checkpoint

- No existing status documents or Error page implementation to migrate.
- Reuse strict color/spacing tokens, existing return.svg, native partial loader,
  and global typography/focus styles. The old Title default structure is a
  reference; its pill variants and example colors do not define this surface.
- Current Figma source and user corrections define all page content, artwork,
  order, geometry, gradient and mobile behavior. Do not reuse login card/layout.
- The four question groups have been answered; no unresolved contract conflict.

## Files and composition

- status1.html through status4.html contain real per-page heading and image DOM.
- Shared partials/status-return.html appears only in the first three pages.
- All four load native modules partials.js then status.js, await loadPartials,
  then call initStatus. No authenticated shell, menus, session modals or login JS.
- status.css is scoped to the status page and imported last by app.css.
- Original artwork files in assets/images: status-not-found.svg,
  status-ip-error.svg, status-other-error.png, status-maintenance.svg.
- Asset extraction uses the source snapshots read in Session200. Original
  illustrations remain unchanged; no extra Figma reread or regenerated artwork.
  Status3 uses the original PNG because the exported SVG's cone mask does not
  match Figma's rendered pale illustration. Headings remain native HTML text.
- Register all four pages and module order in the partial manifest and browser
  smoke. Status4 has an empty partial list, with the same initialization modules.

## Backend handoff

Serve the four HTML files with shared assets, partials and ES modules over HTTP.
They are four visual states, not a client state machine. The server owns status
selection, actual HTTP status, IP rules, maintenance policy and return URLs.

Replace href=# on [data-status-return] with the destination for that request.
Native navigation then works without changing status.js. If a backend integrates
through events instead, the placeholder emits bubbling status:return with
detail.page (status1..3) and detail.state. It sends no request and stores no data.

## Acceptance

- Independently loadable URLs, correct source strings and order; status2 has
  supporting text, status4 has no return, and all illustrations are complete.
- Centered composition on desktop/tablet/mobile; source max image sizes,
  proportional narrow-screen scaling, no horizontal scroll, short-screen access.
- Gradient uses the two exact new strict tokens; all other UI styles use existing
  tokens; source art retains original embedded colors and transparency.
- Trusted pointer hover turns return light blue and restores on leave; keyboard
  focus visible; Enter on placeholder causes no navigation; real href is honored.
- Four lints, full browser smoke, contract viewport/state screenshots, no runtime
  errors, and preview links for all four pages. The user accepted the result and
  authorized commit and push on 2026-11-18.

## Self-test record, 2026-11-18

- Four lints pass,96 raw hex color tokens match base.css, partial manifest
  includes22 pages /3 standalone. Native module syntax and git diff --check pass.
- Full Chrome smoke passes22 pages /291 checks, including39 status checks.
- Dedicated Chrome QA after final PNG replacement:118 /118 checks across
  four pages and eight viewports (32 cases), with38 saved screenshots.
- Widths320 /360 /375 /768 /1024 /1440 and short heights320 /480 verified.
  Source desktop geometry, centered responsive layout, full illustration bounds,
  gradient tokens, no horizontal overflow, short-page scroll access all pass.
- Three return anchors across360 /768 /1440 widths: native pointer hover/leave,
  Tab focus and Enter on placeholder pass. Reinitialization does not duplicate
  events; reduced motion is negligible per the global setting. Real backend href
  navigation is verified with an actual trusted click on each return anchor.
- Runtime errors0. Independent Astra review and PNG adjustment review report
  no actionable findings. Evidence is local under specs/qa-screenshots/session-201.
- Local8000 service returns HTTP200 for landing and all four status pages.
