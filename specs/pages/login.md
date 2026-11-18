# Login pages

Status: current, 2026-11-18. User confirmed the implementation contract through
the Figma read / questions checkpoint. Implementation is self-tested; the user
accepted it and explicitly authorized commit and push on 2026-11-18.

## Source and final decisions

File swift, page display `1:3`; component set Login In `222:10421` on
components `1:2`, live reads 2026-11-18. Full component rules:
[Login](../../components/login.md).

| Delivery file | State | Current page source | Component |
| --- | --- | --- | --- |
| preview/login1.html | General credentials login | `2838:123267` default | `222:10420` success, warning false |
| preview/login2.html | Credentials error | `300:19721` logining and validated failure | `222:10420` success, warning true |
| preview/login3.html | Cloudflare failure | `300:19723` validated failure | `230:11272` failure |
| preview/login4.html | Email verification code | `300:19724` verified message | `236:11311` message |

All four page sections are 1246 x 900. Mobile source `2838:123400` is 410 x 783,
with form instance `287:18489` at 386 x 751, x=12 / y=16, component `287:18363`.
Older 768 / 375 Figma examples are references only.

User confirmations:

- Four independent URLs/files represent four states for backend handoff.
- Google and contact disclosures are independent and both default collapsed.
- All contact content is email-only. Login3 includes the same Google sign-in.
- Card height stays fixed; overflow is handled by scrolling, never by growing it.
- >=1024px: desktop two columns. <1024px: one column, illustration hidden,
  max form width 410px, horizontally centered, 12px gutters on narrow screens.
- Background panel uses Color/Surface/LoginBackground, fill opacity 50%.
- Cloudflare is a schematic placeholder for the existing backend module.
- User-requested hover for both policy buttons and Google sign-in reuses the
  existing 日營收 button: Text/800 background, Text/100 text, 150ms color
  transition, policy attached-link-moved asset, original Google brand colors.

## Page layout

- This is an outer login surface without the authenticated aside/topbar shell.
  Do not add login templates or logic to landing.html.
- Desktop card: 846px wide, columns 410 / 436; heights 545px for login1-3,
  529px for login4, Radius/12 and source shadow. Vertically/horizontally centered.
- Desktop background: vertical gradient Neutral/0 to Neutral/75. Right panel:
  Neutral/75, padding 12, 412 x 412 illustration centered in its available height.
- Illustration is the original Figma Vector `2838:123272`, exported as a 2x PNG
  in `preview/assets/images/login-illustration.png`, not regenerated artwork.
- Green decorative rectangle: source 846 x 545, Radius/12, 50% fill;
  desktop rotation about 2.942deg, derived from its exported SVG geometry.
  Login4 keeps the 545px backplate behind its 529px card.
- Single column: solid Neutral/75 outer background, 16px vertical gutters;
  white square-corner form. Panel is 751px tall capped by available viewport
  height. All vertical overflow stays inside the form.
- Mobile backplate is unrotated, height 545, y=119 relative to the outer section,
  source width 422.49 behind the 386px form; retain its proportional decorative
  overhang and clip decoration at the page boundary without clipping form content.
- Reuse existing source shadows as named effect variables. Do not hardcode
  product colors or add a new color alias for LoginBackground.

## HTML and module composition

- Four standalone documents with shared `partials/login-form.html`.
- Each head loads existing Tailwind CDN/config, Noto Sans TC, base.css, app.css.
  New domain stylesheet is login.css, imported from app.css.
- Inline ES module import order: `./js/partials.js`, then `./js/login.js`.
  Await loadPartials, then initialize the active page state once.
- Page state is declared on the body. Shared markup holds all source strings;
  inactive fieldsets are hidden and disabled so submission includes only the
  active credentials or verification code. No duplicated live IDs per document.
- Native details implement the disclosures; no framework, build step or extra
  dependency. Register all four pages in the partial manifest and browser smoke.

## Old spec / Figma contract checkpoint

- Reuse strict tokens, existing icons, global typography and input eye behavior.
- New layout and 20px input/button text use this source instead of authenticated
  app-shell defaults or generic component example typography.
- User-confirmed collapsed defaults take precedence over Figma demonstration
  content visible in mobile/message screenshots.
- User-confirmed email-only support supersedes legacy hidden 395px customer
  instances. Login3's collapsed Google content reuses the current Google source
  from success/mobile; its absence in one serialized tree is not an exclusion.
- There is no remaining product-intent conflict requiring another approval.

## Backend handoff

These are four separate pages, not a functioning authentication state machine.
Route and authentication orchestration are intentionally left to the backend.

| Page | Backend integration purpose |
| --- | --- |
| login1.html | Initial account/password sign-in surface |
| login2.html | Same form with server credentials-error message visible |
| login3.html | Same form with failed/outdated Cloudflare placeholder; Google remains available |
| login4.html | Verification code form after email code delivery |

Use the shared assets/partials/modules with all four HTML files. Serve over HTTP,
because native modules and fetched partials are used. No standalone file:// mode.

Local integration events originate from the form and bubble:

| Event | Meaning |
| --- | --- |
| login:submit | Submit active account/password or verification fields; detail contains page, state, fields |
| login:google | Request Google sign-in for login1-3; detail contains page/state |
| login:policy | Resolve security/privacy policy destination; detail also contains policy |
| login:refresh | Request the real Cloudflare module to refresh in login3 |

Replace Cloudflare illustration with the existing module. Provide real API / OAuth
handling, IP value, credentials validation, code delivery/expiry, policy URLs,
session management and navigation. The prototype sends no authentication data,
stores no secrets and does not invent these backend results.

## Acceptance

- Four independently loadable pages and correct message/widget/field states.
- All source text present; email only; Google in login1-3, none in login4.
- Initial closed disclosures, pointer/keyboard toggles independent, fixed-height
  local scroll reaches all actions, no page-level horizontal overflow.
- RWD boundary checks at 1023/1024 plus 360/375/768/1440 and short screens.
- Clear and password eye behave locally; integrations emit events only.
- Four lint checks, relevant JS syntax, full browser smoke, viewport/state PNGs,
  no unexpected console errors, and user preview URLs for all four pages.

## Self-test record, 2026-11-18

- Four lints, JS syntax and git diff --check exit 0; strict color mirror 94,
  partial manifest 18 pages / 3 standalone.
- Full Chrome smoke: 18 pages / 252 checks pass, including 56 login checks.
- After tightening the final mobile gutter assertion to clientWidth, reran the
  current responsive smoke expressions: 24 / 24 page/width cases pass.
- Dedicated Chrome QA: all four pages across 360x780, 375x812, 410x783,
  768x1024, 1023x900, 1024x900, 1440x900, 360x480 and 1440x480;
  36 cases pass with zero runtime errors, 24 default/expanded PNGs.
- Trusted pointer, Enter/Space disclosure controls, Tab to final email,
  keyboard End and touch/mouse scrolling at short heights all verified.
  Expansion preserves outer height, all content reachable, no page/form
  horizontal overflow or unintended navigation, correct active-field events.
- Independent Astra review found no product issues. Smoke assertion inversions,
  submit prevention/password coverage and overflow baselines were corrected
  before the final complete run. The initial dedicated QA keyboard injection
  was corrected to include native Enter/Space text events; no product change
  was needed for that harness issue.
- Browser source / screenshot evidence is local under
  specs/qa-screenshots/session-197/. Preview 8000 returns HTTP 200 for
  landing.html and login1.html through login4.html. User accepted 2026-11-18.
- Hover followup, Session198: both policy buttons and Google reuse the
  daily-revenue hover pattern. Real pointer hover/leave at 360/768/1440px:
  33 control cases + 1 reference pass, zero runtime errors, 22 PNGs under
  session-198. Colors, moved policy asset, original Google logo, 0.15s
  transition and stable geometry verified. Four lints and full 18-page /
  252-check Chrome smoke pass; fixed stale child pipes during runner cleanup.
