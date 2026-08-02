# KTO Technology Solutions — portfolio site

A single-page site for Kayode Fashola / KTO Technology Solutions: instructional design and
e-learning development, London. No build step, no dependencies to install.

```
index.html
assets/css/styles.css
assets/js/main.js
assets/img/            13 images, 680 KB total (2 generated plates + 11 screenshots)
source-images/         full-resolution PNG masters — not deployed
tools-bake.py          re-bakes contrast safety into a new hero/band plate
```

`source-images/` is kept out of the deploy path deliberately. The originals total
11.6 MB; the WebP versions actually shipped total 569 KB.

## Run it

```sh
python3 -m http.server 8787   # then open http://localhost:8787
```

Deploy by dragging the folder onto Netlify, Cloudflare Pages, or GitHub Pages.

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

**All four case studies are now real**, built from your own screenshots and your own copy:

| # | Client | Project | Screens | Copy |
|---|---|---|---|---|
| 01 | NHS | DCS Meditech Expanse — EPR Transformation | 3 | complete |
| 02 | The Open University | SAP Ariba indirect procurement process | 3 | complete |
| 03 | SecureMind | Security awareness | 2 | complete |
| 04 | EY | Writing for different formats | 3 | **three rows pending** |

**EY needs finishing.** Only the project title is verifiable from the screens, so Module,
Development tool and Process render as a muted "TO BE SUPPLIED". Fill those three `<dd>`s in
`index.html` and delete the `spec__row--pending` class from each. Search for
`AWAITING COPY` to find the block.

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

**Still to add:** a LinkedIn URL — the current site links one, but the icon carried no href I
could read, so I left it out rather than ship a dead link. Add it to `.contactlines` and
`.foot__links`. Certification is not covered either; the current site has a page for it.

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

**Preparing images:** resize to 1500px wide and save as WebP at ~q82. The eleven screenshots
here went from 11.6 MB of PNG to 569 KB that way, with no visible loss. Keep the masters in
`source-images/`.

## Motion

Everything is progressive. GSAP, ScrollTrigger and Lenis load from a CDN and are used only if
they arrive. Verified in three degraded states — CDN blocked, JavaScript disabled, and
reduce-motion on — the page renders complete and static in all of them. **The markup always
holds the finished state; JS only ever rewinds it and plays forward.** That is why the course
screens can demonstrate themselves without a no-JS visitor losing the answer.

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
- Visible focus outlines, switched to the darker blue inside white course screens.
- The mobile menu is a real disclosure (`aria-expanded`, Escape to close, focus returned).
- No horizontal scroll from 320px up.

Galleries are keyboard-operable: the viewport is focusable and arrow-scrollable, the previous
and next buttons disable at each end, and the dots are 28x24 hit areas so they meet the WCAG
2.2 target size. Each slide is labelled "Screen N of M" and the counter is a live region.

The two things most likely to break if you extend this are contrast on the accents and
keyboard access to custom controls. Check both.
