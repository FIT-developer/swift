# Login

Status: current, 2026-11-18. Source: live Figma + user confirmations.

## Current source

- Component set `222:10421` Login In, 450 x 2458, read 2026-11-18.
- Children: `222:10420` success 410 x 545; `287:18363` mobile
  410 x 739; `236:11311` message 410 x 529; `230:11272` failure 410 x 545.
- Page instances and confirmed RWD: [login page contract](../specs/pages/login.md).
- Purple component-set border / padding / radius are editor metadata, excluded.
- Latest user confirmations override legacy hidden content in Figma JSON:
  Google and email each have independent disclosure controls, initially closed;
  login3 also has Google sign-in; support contains email only.

## Structure and text

One shared `preview/partials/login-form.html`, instantiated once per document.
All visible copy remains in HTML text nodes.

1. Logo 24 x 24, title `旅宿 e 管家`.
2. Optional credentials error: `登入資訊錯誤，請重新輸入`.
3. Credentials: `帳號` / `密碼`, or verification: `驗證碼` with
   `驗證碼發送至 email，逾時無效` on the same label row.
4. `IP：41.221.312.333`, `資安政策`, `隱私條款`.
5. Cloudflare success or failure illustration.
6. Equal-width `清除` / `登入` buttons.
7. `or` disclosure with `Sign in with google` for login1 / login2 / login3.
8. `contact us` disclosure with email icon and `service@bbnet.gmail.com`.

Demo account and verification values are `xiaomi999`; password starts masked
with eight demonstration characters. These values and the displayed IP are
static source examples, not data fetched or validated by this prototype.

## Typography and colors

- Reuse global Noto Sans TC. Title: font-size-2xl 24px / 33px / 600.
- Input and primary button text: font-size-xl 20px / 27px / 400.
- Labels, error, Google label, failure copy: font-size-base 16px / 22px / 400.
- IP / policies / email / verification hint: font-size-min 12px / 16px / 400.
- Main text and ordinary icons: Color/Text/800; white surface: Color/Neutral/0.
- Input / button / policy / email border: 1px, Color/Neutral/200.
- Error and failure icon: Color/Surface/Status-Negative.
- Success icon: Color/Surface/Status-Positive; Cloudflare is a static schematic.
- Clear: Neutral/200 background, Text/800. Login: Neutral/800 background,
  Text/100. No invented disabled / validation color variants.
- Existing logo / Google SVG preserve original brand colors; other icons use
  existing assets and Text/800 through masks where required.

### Policy and Google hover, user confirmed 2026-11-18

- The user requested the existing 今日營收 / 日營收 button hover pattern from
  landing.html. Apply it to both policy buttons and Google sign-in.
- Default remains white / Text/800. Hover uses Color/Text/800 background,
  Color/Text/100 text, the same Neutral/200 border and unchanged geometry.
- Policy icon switches from attached-link.svg to attached-link-moved.svg;
  this is the moved asset, not only a recolor of the default icon. The existing
  mask inherits Text/100 from its button. Google preserves its multicolor SVG.
- Reuse transition-colors / duration-150, matching the reference button.
  Existing keyboard focus indicators and click integration events remain intact.

## Layout

- Form padding and main vertical gaps: Spacing/12.
- Logo/title gap: Spacing/8; brand top padding: Spacing/12.
- Desktop error gap from title: Spacing/12; mobile error gap: Spacing/8,
  matching the mobile variant's grouped header.
- Field group: 22px label, Spacing/8 gap, 39px input. Field groups gap 12.
- Input radius: Radius/6, inside-stroke-adjusted padding based on Spacing/6
  vertically and Spacing/12 horizontally. Password eye slot: 24px.
- Metadata row: IP flexes, policy pills 96 x 28 / Radius/56, Spacing/12 gap.
  At narrow widths IP text can wrap inside its flexible slot, without overlap.
- Cloudflare success area: 121px high; failure: 77px. Horizontal padding 16.
  Reuse `assets/images/image4.png` and existing 71px icon slots. As explicitly
  permitted by the user, this is a simple static widget illustration; the logo
  may shrink at narrow widths to preserve readable status text and avoid overflow.
- Actions: padding 12, gap 8, equal-width buttons 39px high / Radius/6.
- Disclosure summary: 27px high, 20px text, horizontal padding 4, gap 12,
  two 1px Text/800 separators and a 24px arrow.
- Google button: full available width, 48px high / Radius/56, 24px brand icon,
  Spacing/6 icon/text gap, padding 12 adjusted for the inside stroke.
- Email card: full available width, 48px high / Radius/8, padding 12,
  24px email icon and Spacing/4 gap. No support heading, QR, phone, fax or staff.

## Fixed height and scrolling

- The entire form column is its own native vertical scroll region. Title,
  fields, actions and disclosures belong to that region; no pinned footer.
- Desktop dimensions: 410 x 545 for login1 / login2 / login3; 410 x 529 for login4.
- Single-column reference: page instance `287:18489` is 386 x 751 in a
  410 x 783 section. Use 751px as the single-column panel height, constrained
  by available viewport height after the 16px top / bottom gutters.
  The master 739px is reference geometry, not a replacement for this page instance.
- Short viewports constrain the panel height to the available viewport. Content
  scrolls inside it; opening disclosures never increases its outer height.
- No horizontal page or form scrolling. The decorative panel cannot enlarge
  document scroll width. Keep native scrollbars and keyboard / touch scrolling.

## Interactions and confirmed defaults

- Use independent native `details` / `summary` disclosures, both without `open`.
  `or` controls Google only; `contact us` controls email only.
- Collapsed arrow is `up.svg`; expanded arrow is `down.svg`, as shown by the
  failure closed state and mobile open state. Native summary supports keyboard
  activation, with a visible focus indicator inherited from base.css.
- The user explicitly confirmed Google exists in failure even when its raw
  serialized tree omits the hidden child. Reuse the same Google content/style.
- Password eye uses the existing full toggle convention: password/eye-close
  initially; text/eye-open when revealed. Labels describe the available action.
- Clear empties the active fields, masks password again and focuses the first
  active field. It preserves this page's static state and disclosure positions.
- Form submission prevents navigation and emits `login:submit` with page, state
  and active fields. Google emits `login:google`; policy buttons emit
  `login:policy` with the requested policy; refresh emits `login:refresh`.
- No network requests for authentication / IP / CAPTCHA / OAuth / email;
  no secret persistence, countdown, resend flow, success modal or automatic
  transition between the four pages. Backend owns these production behaviors.
- Policy URLs are not supplied. Render accessible text buttons with integration
  events rather than invented destinations. Email is a normal mailto link.

## Reference and cleanup checkpoint

- Reuse existing input/button foundations and icons, but this contract's
  20px text and page geometry override generic 12px/16px component examples.
- Desktop customer instances referring to `51:185` are legacy references.
  The user's email-only confirmation and current simple source `2056:71019`
  supersede those nested old rows; do not restore removed content.
- Master success displays warning for inspection. Login1 remains warning-free;
  login2 shows the warning. A master or selected variant is not a product default.

## Verification

Check all four pages at 360 / 375 / 768 / 1023 / 1024 / 1440px and a short
viewport. Assert both disclosures start closed, toggle independently with
pointer and keyboard, preserve fixed panel height, and allow scrolling to all
content. Verify login3 Google, email-only contact, eye/clear, active-field
submission events, no navigation/API calls, no duplicate IDs or console errors.
