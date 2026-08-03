# KTO Technology Solutions — portfolio site

A single-page site for Kayode Fashola / KTO Technology Solutions: instructional design and
e-learning development, London. No build step, no dependencies to install.

```
index.html
thanks.html            form confirmation page
404.html
robots.txt
sitemap.xml
assets/css/styles.css
assets/js/main.js
assets/img/            14 images, 760 KB (2 generated plates + 11 screenshots + og card)
assets/fonts/          6 woff2 cuts, 220 KB — Archivo variable + IBM Plex Mono
assets/vendor/         GSAP 3.12.5, ScrollTrigger, Lenis 1.1.18 — 128 KB
source-images/         full-resolution PNG masters — not deployed
tools-bake.py          re-bakes contrast safety into a new hero/band plate
tools-og-card.py       re-bakes the 1200x630 social sharing card
```

**Nothing loads from a third party.** Fonts and libraries are served from this repo. That is
deliberate: the organisations this site is addressed to — NHS trusts, universities, the big
four — are exactly the networks that block public CDNs, and a Google Fonts request sends the
visitor's IP to a third country, which is a live procurement question for those same
organisations. It is also faster: four fewer connections before the first paint.

`source-images/` is kept out of the deploy path deliberately. The originals total
11.6 MB; the WebP versions actually shipped total 569 KB.

## Run it

```sh
python3 -m http.server 8787   # then open http://localhost:8787
```

## Deploying

The repo is the site; there is no build step. `netlify.toml` sets `publish = "."`, the security
headers described below, and a week-long cache on images.

**Before every deploy, one command:**

```sh
python3 tools-csp-hash.py --check
```

It is the only pre-flight this site has, and it exists because the failure it catches is
invisible. See Security.

**GitHub** — pushed to
`github.com/Kdevelopment2026/KTO-Technology-Development-Solutions` on `main`.

**Netlify** — connect that repo once in the Netlify UI (Add new site → Import an existing
project → GitHub → pick the repo). It will read `netlify.toml`, need no build command, and
redeploy on every push. Nothing else to configure.

`source-images/` is git-ignored: it holds the ~12 MB of PNG masters, which are build input
rather than site output. Remove that line from `.gitignore` if you would rather they were
version-controlled.

---

## What this took from the current Wix site, and what it changed

**Kept, because it is the brand:**

- **Dark full-bleed imagery.** Behind the hero and the statement band, as on the current site
  — but generated rather than stock (see Design notes).
- **Wide-tracked uppercase.** The `KTO` wordmark, section labels, nav, buttons and the rail
  all run at `.16–.28em` tracking. This is the single most recognisable thing about the
  current site and it carries straight over.
- **Blue and green.** `#3D8BFF` and `#24D267`, sampled from the current KTO wordmark and the
  skill bars. Given strict roles here: **blue navigates** (brand, links, primary buttons),
  **green reports progress** (course progress bars, correct answers, outcome figures, the
  closing call to action). That semantic split is what stops two accents reading as noise.
- **Numbered sections.** The current site's `02 PORTFOLIO` device, extended: sections run
  `01`–`06` and the fixed left rail is a course menu that fills as you scroll. On an
  e-learning site, numbered modules with a progress indicator earn their place.
- **The deep navy closing panel** with a green action button.

**Changed, deliberately:**

- **Off-centre.** The current site centres almost everything, which flattens it. This is
  built on an asymmetric **storyboard spread** — a narrow mono spec column (Challenge /
  Role / Built with / Approach) beside a wide content column. That's the artefact this work
  is actually made from.
- **The imagery is readable, and it is yours.** The old plates were washed out to
  near-invisibility. These are generated to the brand — translucent interface panels in blue
  and green — and dark by origin, so they stay visible instead of being crushed under a scrim.
  Every text-over-image pair was measured against rendered pixels, not estimated.
- **It is no longer static after the hero.** Previously 70 elements shared one identical
  reveal. Now every section has its own choreography and the course screens demonstrate
  themselves — see Motion.
- **The work is the brightest thing on the page.** Course screens are white on a dark ground.
- **No skill-percentage bars.** "AI — 85%" is a number nobody can source, and the bars were
  not exposed to assistive technology. The evidence here is outcomes per project instead. If
  you want the bars back, base them on something checkable — years of use, projects shipped.

---

## Read this before you publish

### The five things still waiting on you

Each one drops into a slot that is already built, styled and tested. Nothing else has to change.

| | What | Where |
|---|---|---|
| 1 | **The live URL.** Five files carry a placeholder host, `kto-technology.netlify.app`. A canonical pointing at the wrong host is worse than none at all. | `index.html` (canonical, `og:url`, `og:image`, JSON-LD), `robots.txt`, `sitemap.xml` |
| 2 | **Testimonials.** The section is built and commented out. Two or three quotes, each with a name, a role and an organisation. | search `TESTIMONIALS` in `index.html` |
| 3 | **`showreel.mp4` plus captions.** See "Adding the showreel". | `assets/video/` |
| 4 | **Form notifications.** One click, once: Netlify → Site → Forms → Notifications. Without it, enquiries sit unread in the dashboard. | Netlify UI |
| 5 | **CV PDF and headshot.** Both have slots waiting. LinkedIn is now live in the footer and in `sameAs`. | `index.html` footer, About spec column |

### The case studies

| # | Client | Project | Screens | Copy |
|---|---|---|---|---|
| 01 | NHS | DCS MEDITECH Expanse — electronic patient record (EPR) transformation | 3 | complete |
| 02 | The Open University | SAP Ariba indirect procurement process | 3 | complete |
| 03 | SecureMind | Security awareness | 2 | complete |
| 04 | EY | Writing for different formats | 3 | two rows, both verifiable |

**Section 03, "Video and AI", is the one place the copy is mine.** Everything else on the page
came from you or from your existing site. That section covers AI video content, UGC-style ads,
AI animation and post-production, and the tool chips list Veo 3.1 and Google Gemini 3 because
you named them as tools you use. Read it before launch and change anything that overstates
what you offer. It is marked `COPY REVIEW` in `index.html`.

**EY no longer says "to be supplied".** Three rows used to render as a muted "TO BE SUPPLIED",
which made a finished case look abandoned to anyone who scrolled that far — and it was the last
case before the statement band, so it was the note the work section ended on. The block now
carries two rows written from what the screenshots actually show: the writing formats visible
in the section menu, and the worked-example approach visible on screen three. The captions no
longer put a number on the formats, because the menu shows six items while five are named —
**tell me the sixth and I will name them all.** Nothing
in them overstates the work. **Add the development tool and a Process row when you can** —
copy the markup of any other `.spec__row`.

**The invented metrics are gone.** The previous draft carried figures like "94% completed
before go-live" and "38% fewer service-desk tickets". Those were tolerable against anonymised
sectors, but they now sit beside **named real clients** — NHS, The Open University, EY — and
unevidenced numbers attached to real organisations are a liability, not a selling point. They
have been removed. If you have figures you can actually stand behind, add them back and I can
restore the count-up treatment.

In their place, Case 01 carries a **scope strip** listing the eleven role-based packages from
your own copy. That is real, checkable, and more impressive than a percentage.

**The MEDITECH patient screen is published as-is**, at your instruction. It is the
`DAGEMC TEST` training domain, and it is the strongest single proof of the simulation work.

**LinkedIn is live**, at `linkedin.com/in/kayodefashola`. It sits in two places that must stay
in step: the footer link, which carries `rel="me"`, and `sameAs` on the `Person` node in the
JSON-LD. Together they are the machine-readable claim that the site and the profile are one
person. Change one, change the other — and re-run `tools-csp-hash.py` after touching the
JSON-LD.

**Still to add:** certification, which the current site has a page for.

---

## Who the page is talking to

It has two audiences and they want different things, so the page now serves both.

**A buyer** wants evidence and a way to start. They get four real case studies, a scope strip
they can check, a process they can hold you to, and an enquiry form that does not require them
to open a mail client — which a large share of corporate visitors, on webmail, effectively
cannot do from a `mailto:` link.

**A recruiter** wants to know who you are. Until recently the page never said. "KTO Technology
Solutions" is a company; a recruiter is matching a person to a CV and a LinkedIn profile, and
they could not do it from this site. Your name is now in the `<title>`, the About byline, the
About spec list, the footer, the JSON-LD `Person` block and the social card. The Availability
row is the line they will read first — **keep it current or delete it**, because a stale
availability date reads worse than none.

Two things would still help the recruiter case more than anything else on this list: a
**LinkedIn link** and a **CV as a PDF**. Both have slots waiting.

---

## The enquiry form

Netlify Forms. No backend, no JavaScript, nothing to maintain, free on the tier this site is
already on. Netlify finds the form by parsing the deployed HTML, so **three things must not
change** or submissions silently vanish:

1. `data-netlify="true"` and the `name` attribute on the `<form>`
2. the hidden `form-name` input, whose value matches that name
3. the honeypot field named in `data-netlify-honeypot`

The honeypot is a real field hidden from people with `clip-path`, not `display:none` — some
bots skip anything display-none. It is the whole spam defence: no reCAPTCHA, because that is a
third party watching your visitors and the volume here does not need it.

On submit, the browser posts to Netlify and lands on `thanks.html`, which is `noindex`.

**Local testing shows the markup only.** The POST needs a real deploy — use a deploy preview.

Contrast was measured, not assumed: labels 10.8:1, hints 7.5:1, input text 10.7:1, the send
button 9.5:1. The field border is `rgba(255,255,255,.42)` and not a shade quieter because the
border *is* the control's boundary, which WCAG 1.4.11 wants at 3:1 against the navy — the
first value tried measured 2.82:1 and failed.

**The send button is `.btn--send`, not `.btn--go`.** `.btn--go` carries the C5 progress-bar
reveal, driven by a ScrollTrigger that only ever finds the first `.btn--go` in the band. A
second one would sit clipped to nothing and the send button would be invisible.

---

## Sharing and search

- **The social card** at `assets/img/og-card.jpg` is what every LinkedIn, Slack or WhatsApp
  share of this site renders. It is baked by `tools-og-card.py` from the same hero plate, in
  the same two typefaces at the same widths, so the card and the page are one thing. Re-bake it
  if the headline or the name changes.
- **JSON-LD** describes a `ProfessionalService`, a `Person` — with `sameAs` pointing at the
  LinkedIn profile — and a `WebSite`, and links them by `@id`. This is what lets you show up as an entity rather than as a page. The service block
  carries an `OfferCatalog` listing the eight services, so the individual offerings are
  machine-readable rather than buried in list markup. **It is JSON: no comments inside the
  block.** Validate any edit at <https://validator.schema.org> before deploying — a syntax
  error there fails silently, and the whole block is then ignored.
- **The `<title>` and meta description are sized for the result page**, roughly 60 and 155
  characters. Google truncates past that and reads the rest anyway, so the point of the limit
  is the click, not the ranking. Both put the search terms — "e-learning developer",
  "instructional designer", "London" — in the first half.
- **`max-image-preview:large`** in the robots meta is what allows a large thumbnail beside the
  result instead of a favicon-sized one.
- `robots.txt`, a one-URL `sitemap.xml`, a canonical, Open Graph and Twitter card tags,
  including `image:alt` on both so the card is described to screen readers.
- **`thanks.html` and `404.html` are `noindex`.** A confirmation page has no business in search
  results.

Keep `<h1>` unique — there is exactly one, in the hero — and keep every section's heading an
`<h2>` with case and service headings below it as `<h3>`. The outline is currently clean, and it
is the cheapest structural signal on the page.

Not done, because it needs your decision: **analytics**. Plausible or Umami need no cookie
banner; GA4 does. Two lines either way.

---

## AI apps, agents and automation

Named as a service, with **no public demo link**. The service card says working demos are
available on request, the enquiry form carries "AI apps, agents or automation" as an option so
those enquiries arrive already labelled, and the toolkit lists agents, apps and workflow
automation.

That is deliberate. A live demo is the strongest proof there is, right up until a prospect
clicks it and finds it slow, rate-limited or down — at which point it is worse than having no
link at all. "Available on request" gets you the conversation without the risk, and it means
you show the app to someone who has already told you what they need.

**When you want to go further**, the version that actually sells is a fifth case study: two or
three screenshots of a real agent or app, treated exactly like the NHS and Open University
cases. Copy any `<article class="case">` block. That is a much stronger claim than a services
bullet, because it shows the thing working for a named purpose.

---

## Design notes

- **Type** — one variable family at two widths: **Archivo** at `wdth 118` for display and
  `wdth 100` for body, plus IBM Plex Mono for every tracked uppercase label. Width is the
  premium cue and it extends the wide-tracked KTO wordmark. Below 30rem the display width
  eases to 104%, because expanded type forces the hero's masked lines to wrap on a phone and
  a wrapped line breaks the per-line reveal.
- **Imagery** — the hero and statement plates are generated, not stock: translucent interface
  panels receding into dark space, lit in the brand blue and green. Contrast safety is
  **baked into the JPEGs** (an elliptical pool of darkness over where the copy sits) rather
  than applied with CSS scrims, so text legibility does not depend on getting a gradient
  right. Re-bake with `tools-bake.py` if you swap the plates.
- **Colour** — the palette has two halves. Dark tokens (`--ink`, `--text`, `--blue`,
  `--green`) for the page. Light tokens prefixed `--s-` (`--s-ink`, `--s-blue`, `--s-green`)
  for the white course screens, where the dark-mode accents would fail contrast. If you
  change an accent, change both halves and re-check.
- **The hero highlight** is green because the word it sits behind is "results".
- **Measure — read this before re-adding a `max-width` to any body copy.** Long-form text used
  to be capped at 62ch. On a 1440px screen the body column is about 900px, so the cap left a
  wide empty strip down the right of the About section, the note box, the captions and the
  section notes. The caps are gone, and where the copy is long enough to need it the text is
  **set in columns instead**: the About prose runs two columns above 62rem with the lead
  spanning both, and the "Working with your people" box runs three. That uses the whole width
  at about 45 characters a line. Re-adding a single-column cap brings back the empty strip;
  removing the columns without a cap gives you 105-character lines, which look full and read
  badly. The columns are the answer to both.
- **Columns are grids, not `column-count`.** A CSS multi-column paragraph splits mid-sentence
  across the gutter and its last column ends ragged. Grid columns keep each paragraph whole and
  let every one keep its own `[data-reveal]`, so the stagger still works. The note box paragraph
  was split into three paragraphs in the markup to suit — same words, one per audience.
- **`text-wrap:pretty`** is on the body copy. It stops a single short word being stranded on a
  line of its own, which is what put "in." alone at the end of the AI service card. Its
  counterpart `balance` is on the display headings. Neither is required for the page to work.
- **Sections are numbered 01 to 07** and the left rail mirrors them. Adding or reordering a
  section means updating three things: the `.modlabel__n` digits, the `.rail__list` entries,
  and the `SECTIONS` array in `main.js` that drives the current-section highlight.
- **Punctuation** — no em dashes anywhere in the prose; they were rewritten into full stops
  and commas. Where a dash was separating a label from its qualifier it became the middot the
  spec lists already use, as in "NHS · Digital Clinical System Training". Hyphens inside
  compound words stay, because "e-learning", "AI-assisted" and "role-based" are simply how
  those words are spelled.

## Adding a screenshot or a case

An earlier draft hand-built fake course screens in CSS — a branching scenario, a simulated
app, a before/after slider, a chatbot. All of that is deleted. Your delivered courses carry
their own player chrome, so wrapping them in a second invented one was both redundant and
dishonest. Screens are now presented as framed plates:

```html
<li class="gallery__slide" role="group"
    aria-roledescription="slide" aria-label="Screen 4 of 4">
  <figure class="shot">
    <div class="screen">
      <img src="assets/img/your-screen.webp" width="1500" height="880" loading="lazy"
           alt="What the screen actually shows. 'Screenshot' is not a description.">
    </div>
    <figcaption>One sentence on what this screen demonstrates.</figcaption>
  </figure>
</li>
```

Adding a slide means three edits in the same gallery: the `<li>` above, one more
`<li><button class="gallery__dot" data-go="N">` in `.gallery__dots`, and the total in
`.gallery__count`. Also bump every sibling slide's `aria-label` so the "of N" stays true.

Always set `width`/`height` so the layout cannot shift, and keep `loading="lazy"` on
everything below the fold.

To add a case, copy any `<article class="case">` block. Give it a `data-case` name, a
`.case__sector` (the client), an `.h-case` (the project), and `.spec__row`s. Every case gets
its own gallery; nothing else needs configuring.

## Adding the testimonials

The section is **built and commented out** in `index.html` — search `TESTIMONIALS`. It is
commented out rather than filled with placeholder quotes because a portfolio that invents
testimonials is worse than one that has none, and placeholder text has a way of shipping.

Publishing it is three steps, and step two is the one that bites:

1. Delete the two comment markers and fill in the quote blocks.
2. **Renumber.** Sections run 01–07 and adding one at 02 pushes every later number along. Three
   places have to agree or the left rail stops matching the page: the `.modlabel__n` digits, the
   `.rail__list` entries, and the `SECTIONS` array in `main.js`. Also fix the cross-reference in
   Services — "Standalone and marketing video is covered in section 03" becomes section 04.
3. Add "Testimonials" to the header nav if you want it there too. It is worth it: a nav item
   saying testimonials is itself a signal.

A name, a role and an organisation are worth several times an anonymous quote. If a client will
only agree to "Programme Lead, an NHS trust", that still works. Never publish one you could not
evidence if you were asked to.

**Send them in this shape** and the section can go live in one pass — three is the number to
aim for, two is fine, one is better than none:

```
"The words they actually used, verbatim."
Their name · Their role · Their organisation
```

Verbatim matters. Tightening a client's sentence is how a real quote starts to read like a
written one, and a quote that reads written does the opposite of what a testimonial is for.

**Preparing images:** resize to 1500px wide and save as WebP at ~q82. The eleven screenshots
here went from 11.6 MB of PNG to 569 KB that way, with no visible loss. Keep the masters in
`source-images/`.

## Adding the showreel

Section 03 ends with a **placeholder**: a 16:9 poster frame badged "Showreel · in production".
It is marked `PLACEHOLDER` in `index.html`.

The decorative play mark that used to sit on this frame **has been removed**. It was not a
button, on the reasoning that a control that does nothing is worse than no control — but a
visitor does not know that. They see a play triangle on a video frame, click it, and nothing
happens, in the section selling your newest service. The frame now says what it is, and the
caption offers to send the current edit, which is a reason to make contact rather than a dead
end.

When the film exists, drop it in `assets/video/` and replace the whole `<figure>` with:

```html
<figure class="reel" data-reveal>
  <div class="screen reel__frame">
    <video poster="assets/img/showreel-poster.webp"
           controls preload="none" playsinline
           width="1600" height="900">
      <source src="assets/video/showreel.mp4" type="video/mp4">
      <track kind="captions" src="assets/video/showreel.vtt" srclang="en" label="English" default>
    </video>
  </div>
  <figcaption>A short reel of recent AI video, UGC and animation work.</figcaption>
</figure>
```

The badge and overlay go; the video's own controls replace them. `.reel__frame video` is
already styled to fill the frame at 16:9, so nothing in the CSS needs touching.

Three things worth getting right: keep `preload="none"` so a heavy file does not cost every
visitor bandwidth they did not ask for; ship **captions**, since the rest of the site is built
to WCAG 2.2 AA and an uncaptioned video would be the one thing that fails it; and encode as
H.264 MP4 for the broadest support, adding a WebM `<source>` above the MP4 if you want smaller
files for browsers that take it.

## Security

`netlify.toml` sets a full header block on `/*`. The one that needs explaining is the CSP.

**Content-Security-Policy.** Everything the page loads is same-origin — fonts, GSAP, Lenis,
CSS, images — which is the only reason a policy this tight is possible. `default-src 'self'`,
with `base-uri` and `object-src` set to `'none'`, and `form-action 'self'` so a script cannot
repoint the enquiry form at somewhere else.

**The inline script is allowed by hash, not by `'unsafe-inline'`.** There is exactly one: the
JSON-LD block in `<head>`. Allowing it by hash keeps the policy meaningful, at the cost of one
rule you have to remember:

> Edit the JSON-LD block — even by a single space — and the hash no longer matches. The browser
> then refuses to run the block, and your structured data disappears from search. **Nothing on
> the page looks wrong.** That is the whole danger.

So after any edit to it:

```sh
python3 tools-csp-hash.py           # prints the new hash to paste into netlify.toml
python3 tools-csp-hash.py --check   # exits 1 if netlify.toml is stale
```

**If you add analytics, the policy has to know.** Plausible, Umami, GA4 and Netlify's own Real
User Metrics all inject a script from another origin, and this policy blocks every one of them.
Add the origin to `script-src` and `connect-src` at the same time you add the tag, or you will
be debugging a tag that "just does not fire".

The rest, briefly: `Strict-Transport-Security` for a year **without `preload`** — preload is a
promise that every subdomain of the final domain is HTTPS forever, and it is painful to undo, so
make that call once the custom domain is settled. `Permissions-Policy` denies camera,
microphone, geolocation and the rest outright, leaving `fullscreen` open for the showreel.
`X-Frame-Options` sits beside `frame-ancestors` for older browsers. `X-Content-Type-Options`,
`Referrer-Policy` and `Cross-Origin-Opener-Policy` are the ordinary hardening.

After the first deploy, check it at <https://securityheaders.com>, and open the browser console
once — a policy that is too tight announces itself there with "Refused to…" and nowhere else.

The enquiry form's spam defence is the Netlify honeypot field, not a CAPTCHA. It costs the
visitor nothing and it does not send their behaviour to a third party. If spam ever becomes a
real problem, Netlify's built-in reCAPTCHA is one attribute — but do not add it pre-emptively.

---

## Motion

Everything is progressive. GSAP, ScrollTrigger and Lenis are served from `assets/vendor/` and
used only if they arrive. Verified in three degraded states — scripts blocked, JavaScript
disabled, and reduce-motion on — the page renders complete and static in all of them. **The
markup always holds the finished state; JS only ever rewinds it and plays forward.** That is
why the course screens can demonstrate themselves without a no-JS visitor losing the answer.

### The section entrance (G8)

Every section arrives the same way, which is what stops a long page reading as a pile of
separate effects.

- **The heading wipes up from its own baseline.** Same gesture as the hero lines and the contact
  headline, so there is one way of introducing a heading rather than three. Section headings are
  therefore excluded from the generic `settle` in `main.js` — leave them in both and two tweens
  drive the same opacity, which shows up as a stutter on a slow scroll.
- **The section drifts.** Its content sits 14px low coming in and 14px high going out, scrubbed
  against the section's own traversal. 28px across a whole screen of scrolling is felt rather
  than seen, and that is deliberate: at 40px it becomes an effect you notice, and it starts
  competing with the work.

Two implementation points, both load-bearing. The drift is applied to `.wrap`, **not** to the
section, because the section carries the background and a moving background shows its own edges.
And it sets `invalidateOnRefresh`, because that transform sits on an ancestor of every gallery
trigger inside the section, so start positions have to be measured again after a resize rather
than carried over from the first pass.

### The closing curtain, and why a scrub end must be reachable

The contact band is revealed by an ink curtain that retreats on scroll. It used to scrub from
`top bottom` to `top 55%` — and that end is **not reachable**. The band is the last thing in
the document, so its top can only rise as far as the remaining scroll allows. Above a viewport
of roughly 1550px the top never reaches 55%, the scrub never completes, and the curtain stays
down over the email address, the phone number, the CTA and the form. It was reproducible on a
large or rotated display and it hid the entire point of the page.

It now runs `top bottom` → `bottom bottom`. That distance — the band's own height — is the only
one guaranteed to be scrollable once the band appears, because the band's bottom *is* the end
of the page. The lift is placed in the first 65% of that range so the CTA is clear well before
the page bottom rather than exactly at it.

**The rule worth keeping:** any scrubbed animation whose end position depends on an element
reaching a fraction of the viewport can be made unreachable by a tall enough viewport. If the
element is the last thing in the document, only `bottom bottom` always resolves.

The reduced-motion block also resets `.band__curtain` now. It was the one piece of motion
scaffolding the belt-and-braces block missed, so anyone turning reduce-motion on *after* load
kept a navy panel over the contact details.

**Foundations** — an ambient blue/green light field drifting behind everything on scroll; a
progress line in the header; and one recurring section signature (the module number counts up,
the label's tracking closes, the rule draws). Repeating a single deliberate device is what
makes the page read as composed rather than as a pile of effects.

**Per section** — the hero opens with a plate zoom, masked headline lines and a green wash
whose knocked-out text tracks the wipe edge. In Work, each module is a gallery the visitor
drives themselves, so no screen is ever missed. Services arrive on a diagonal with a
pointer-follow light; the process track fills and
completes each module in turn; the toolkit runs a boot sequence; the About lead lights word by
word with scroll; and the closing navy rises as a curtain before the CTA fills like a progress
bar reaching 100%.

**The tenure meter** in the Services column is twenty-five ticks, one per year, filling green
in sequence while the figure counts up — every fifth tick taller, like a ruler gradation. It is
a tick row rather than a percentage bar on purpose: twenty-five ticks for twenty-five years is
countable, whereas a bar would imply a scale nobody can source. Update the year by editing the
number in `.tenure__n` and the count of `<i>` elements in `.tenure__ticks` to match.

**Three things were cut on purpose.** Horizontal-scroll for the toolkit (scroll-hijacking
eleven tool names traps keyboard and touch users). A custom cursor (dated, and it hurts
usability). And scroll-pinned case studies, which were replaced by the galleries: a pin that
force-advances a carousel fights the person trying to drive it, and pinning fights touch
momentum on mobile besides. Say the word if you want the pinned sequence back on desktop.

Two constraints worth knowing if you extend this:

- **Never pin something taller than the viewport.** It crops at both ends. This is why the
  earlier pinned case study only ever pinned the screen, not the whole block.
- **Anything that hides content behind time or scroll costs visibility.** A cross-fading stack
  meant two of every three screenshots were glimpsed at best. A gallery the visitor controls
  does not have that problem, which is why the work section uses one.
- **Galleries are core behaviour, not decoration.** The controller lives *before* the
  reduced-motion gate in `main.js`. Put it after and the carousel dies for anyone with
  reduce-motion on or a blocked CDN.
- **GSAP `yPercent` does not replace a CSS percentage transform.** GSAP reads
  `translateY(105%)` out of the computed matrix as a pixel `y`, and `yPercent` is a separate
  channel, so a tween must state `y: 0` as well or the element settles a whole line low. This
  silently hid the hero headline until it was caught.

## Accessibility

Built to WCAG 2.2 AA:

- Every text-over-image pair is measured against the **actual rendered glyph pixels** at 1440px
  and 390px — the page is rendered twice, once with the text hidden, and only pixels that are
  genuinely part of a letterform are sampled. Bounding-box sampling over-reports badly, because
  a `<p>` is usually far wider than its text. Worst case on the page is 5.48:1.
- Skip link, semantic landmarks, one `h1`, ordered heading levels, `aria-current` on the
  active section.
- **The contact band is inside `<main>` and the footer is after it**, not nested inside the
  band. A `<footer>` inside a `<section>` is a section footer, not the page's `contentinfo`
  landmark, so the page previously had no `contentinfo` at all and the enquiry form sat outside
  every landmark. Because the footer no longer inherits the band's navy, `.foot` sets its own
  `background` and `color`, and its own green focus outline. If you ever move it back inside
  `.band`, delete those three declarations or the colour will be applied twice.
- Visible focus outlines, switched to the darker blue inside white course screens, and to green
  inside the navy contact band where the blue all but disappears.
- Every form field has a real `<label>`, native validation, and `aria-describedby` on the two
  that carry a hint. Field borders clear 3:1 against the navy, per WCAG 1.4.11.
- The mobile menu is a real disclosure (`aria-expanded`, Escape to close, focus returned).
- No horizontal scroll from 320px up.

Galleries are keyboard-operable: the viewport is focusable and arrow-scrollable, the previous
and next buttons disable at each end, and the dots are 28x24 hit areas so they meet the WCAG
2.2 target size. Each slide is labelled "Screen N of M" and the counter is a live region.

The two things most likely to break if you extend this are contrast on the accents and
keyboard access to custom controls. Check both.
