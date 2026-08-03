# KTO Technology Solutions — portfolio site

A single-page site for Kayode Fashola / KTO Technology Solutions: instructional design and
e-learning development, London. No build step, no dependencies to install.

```
index.html
privacy.html           what the enquiry form collects and who processes it
google76d48db…html     Google Search Console ownership proof — do not edit or delete
thanks.html            form confirmation page
__forms.html           bare form for Netlify to detect — noindex, linked from nowhere
404.html
robots.txt
sitemap.xml
site.webmanifest
favicon.ico
assets/css/styles.css
assets/js/main.js
assets/img/            14 images, 770 KB (2 plates + 11 screenshots + og card + video poster)
assets/video/          the 15-second explainer — 0.8 MB WebM, 1.1 MB MP4, captions
assets/fonts/          6 woff2 cuts, 220 KB — Archivo variable + IBM Plex Mono
assets/vendor/         GSAP 3.12.5, ScrollTrigger, Lenis 1.1.18 — 128 KB
source-images/         full-resolution PNG masters — not deployed
Vid/                   the delivered video master — not deployed
tools-bake.py          re-bakes contrast safety into a new hero/band plate
tools-og-card.py       re-bakes the 1200x630 social sharing card
tools-csp-hash.py      regenerates the CSP hash for the inline JSON-LD
tools-host.py          sets the site's hostname in all 15 places at once
tools-icons.py         re-bakes favicon.ico and the PNG icons from one geometry
tools-video.py         re-encodes the explainer from the master in Vid/
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

**The deploy gates itself.** `netlify.toml` runs this as its build command, and Netlify fails
the deploy on a non-zero exit:

```sh
python3 tools-csp-hash.py --check && python3 tools-host.py --check
```

Both guard failures that are completely invisible in a browser. A stale CSP hash silently stops
the structured data from running; a stale hostname points the canonical and the social card at a
host that 404s. Neither makes the page look wrong. **Until you run `tools-host.py --set`, every
deploy will fail on purpose** — see "The site URL" below.

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
  `01`–`09` and the fixed left rail is a course menu that fills as you scroll. On an
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
| 1 | **Enable form detection** in Netlify, then redeploy. Until then the enquiry form returns 404 on submit — confirmed against the live site. | Netlify UI |
| 2 | **Send one test enquiry from the live URL** once detection is on, and confirm it arrives by email — not just in the dashboard. | Netlify UI |
| 3 | **Full testimonial text.** LinkedIn truncates its previews at "Read more", so four quotes are cut to their last complete clause. | search `TESTIMONIALS` in `index.html` |
| 4 | **Form notifications.** One click, once: Netlify → Site → Forms → Notifications. Without it, enquiries sit unread in the dashboard. | Netlify UI |
| 5 | **CV PDF and headshot.** Both have slots waiting. LinkedIn and the three certifications are live. | `index.html` footer, About spec column |
| 6 | **Read `privacy.html` and confirm it is true.** The retention period and the response time are commitments — they describe what I understood, not what you have decided. | `privacy.html` |

### The site URL, and why the deploy stops for it

The site hard-codes its own address in **15 places**: the canonical link, `og:url`, `og:image`,
`twitter:image`, six JSON-LD `@id` and `url` fields, the `Sitemap:` line in `robots.txt`, and
`<loc>` in `sitemap.xml`. They must be absolute and they must all agree.

**This is now set** to `kto-technology-development-solutions.netlify.app`, the live site. The
placeholder it shipped with was unclaimed and Netlify returned 404 for it. Deploying with a
placeholder in place would have meant:

- the canonical tells Google to index a URL that does not exist;
- every LinkedIn, Slack and WhatsApp share renders with no card, because `og:image` 404s;
- `robots.txt` advertises a sitemap that 404s;
- and until somebody claims that subdomain, anyone can — and would inherit both.

Search engines and social scrapers cache the first response they get, so this is not a
fix-it-afterwards problem. **The Netlify build command fails the deploy while a placeholder is
in place.** If the address ever changes — a custom domain, a renamed site — one command:

```sh
python3 tools-host.py --set your-site.netlify.app   # or your custom domain
python3 tools-csp-hash.py                            # the JSON-LD changed; paste the new hash
```

`tools-host.py` reads the site's own host from `<link rel="canonical">` and rewrites only that
one. LinkedIn, the certificate verifiers and `schema.org` are never touched.

**You do not need a custom domain to go live.** `your-name.netlify.app` is free, permanent and
HTTPS. A domain is worth buying for a business site, but nothing here waits on it — set the
`.netlify.app` host now and re-run the same command later if you buy one.

### Case 05: Invoice Triage

The only self-directed case, and the only one that is a working application rather than a
course. It exists because section 05 sells agents and automation and otherwise showed nothing —
a section that describes capability sits below one that evidences it.

**The screens are the real app, run locally, on invented data.** Every supplier, amount and
reference is made up. No client's invoice has been near this site and none should be, which is
why the data is fake rather than redacted — a redaction is a claim that the real thing was there.

The extraction call was stubbed during capture, so nothing reached the Anthropic API and no key
was used. That matters for what the screenshots actually show: the flags in screen two are the
app's **own** duplicate-detection and missing-data checks running for real over those invented
records. The model's part was skipped; the judgement layer, which is the interesting part, was
not.

The account codes were set before processing rather than after. Left unmapped, every row carries
a "needs account code mapping" flag and the tool looks like it flags everything — which
misrepresents it. With a chart of accounts in place, two of five documents are flagged and both
are real findings.

A second app, UGC Script Studio, was considered and dropped: it names a third party in its
brief, and one unhedged case is worth more than two hedged ones.

### The outcome figures

They sit **inside the NHS case**, in the same column as the screens, rather than at the end of
the work section: **70+ SCORM-compliant modules** and **5,000+ learners** on Totara across
multiple NHS departments, counting up as they arrive.

That placement does two jobs. Both figures *are* the NHS work, so they belong to that case
rather than to the page as a whole. And the case's spec column ran 824px against the gallery's
672px, which left a 152px void under the carousel controls — the numbers fill it with the one
thing a reader wants next.

The note under them carries no number on purpose. "Reduced post-go-live support queries" is real
but unmeasured, and attaching an invented percentage would undo the point of having figures at
all. An earlier draft carried exactly that kind of number — "94% completed before go-live" — and
it was cut because it sat beside named clients.

A fourth line, "delivered for policing, regulatory, finance and enterprise organisations", was
dropped when the block moved: a note about policing has no business inside an NHS case study,
and the sectors are already listed in the hero spec and the statement band, both of which gained
**Policing** at the same time so they would not contradict it. Put it back anywhere outside this
case if you want it stated again.

**Every figure here has to survive being queried**, because it now sits directly beneath a named
NHS system. Change them only against something you can evidence.

### The case studies

| # | Client | Project | Screens | Copy |
|---|---|---|---|---|
| 01 | NHS | DCS MEDITECH Expanse — electronic patient record (EPR) transformation | 3 | complete |
| 02 | The Open University | SAP Ariba indirect procurement process | 3 | complete |
| 03 | SecureMind | Security awareness | 2 | complete |
| 04 | EY | Writing for different formats | 3 | complete |
| 05 | Own product | Invoice Triage — documents in, review queue out | 3 | complete |

**Sections 04 and 05, "Video and AI" and "AI agents", are the two places the copy is mine.** Everything else on the page
came from you or from your existing site. That section covers AI video content, UGC-style ads,
AI animation and post-production, and the tool chips list Veo 3.1 and Google Gemini 3 because
you named them as tools you use. Section 05 is written from what the services list and the
toolkit already claimed, plus the two Anthropic certifications. **Read both and cut anything
that promises more than you want to be held to.** Each is marked `COPY REVIEW` in `index.html`.

Section 05 also has the weakest evidence on the page: it describes capability where every other
section shows it. Two or three screenshots of a real agent or app, treated exactly like the four
case studies, would fix that — the markup of any `<article class="case">` block drops straight
in.

**EY is complete.** Three rows used to render as a muted "TO BE SUPPLIED", which made a finished
case look abandoned to anyone who scrolled that far — and it was the last case before the
statement band, so it was the note the work section ended on. It now carries the same four rows
as the other three cases: module, development tool (Adobe Captivate 8 and Creative Suite),
responsibilities and approach.

The Responsibilities row says plainly that this was **a freelance revision brief** — revising
existing content, building in new functionality, designing the quiz questions — rather than an
original build. That is worth keeping. A portfolio where every case is a ground-up build invites
the question of which ones really were, and answering it up front is what makes the NHS and Open
University cases read as true.

One open question: the section menu on screen two shows **six** items while five formats are
named anywhere. The captions therefore put no number on them. **Tell me the sixth and I will
name them all.**

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

**The certifications are live** in the About spec column, as a row rather than a gallery:

| Certificate | Body |
|---|---|
| Claude Code 101 | Anthropic |
| Introduction to Claude Cowork | Anthropic |
| Career Essentials in Generative AI | Microsoft and LinkedIn |

Each name links to its verification page, and that link is the point. A credential a buyer can
check in one click is worth more than three they have to take on trust — and these three are
what the phrase "AI learning specialist" is standing on, so they should be checkable. They are
mirrored as `hasCredential` on the `Person` node in the JSON-LD; **change one, change both, then
re-run `tools-csp-hash.py`.**

One row per certificate, each with its own awarding body. Run together on one line with middots
and the reader attaches "Anthropic" to the wrong certificate.

**No dates**, because none were supplied and a guessed year on a credential is worse than none.
These do not expire, so undated is defensible — but send me the years and they get stronger, and
the "AI learning specialist" claim gets a timeline.

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

### If it fails on Netlify

The markup is correct — `name`, `data-netlify`, the hidden `form-name` and the honeypot all
check out, and `__forms.html` gives Netlify a second, unambiguous copy to find. So if
submissions still fail, it is configuration, and there are exactly two causes.

**1. Form detection is opt-in now.** For sites created since roughly late 2024 Netlify no longer
detects forms automatically. Site configuration → Forms → **enable form detection**.

**2. Detection only runs at deploy time.** Enabling it does not retro-scan the deploy already
published, so **trigger a new deploy** afterwards. Nothing changes until a fresh one lands.

Then: the form should appear under Forms in the dashboard. Add an email notification, and send
one test enquiry from the live URL. If it is *not* listed after a fresh deploy with detection
on, nothing in this repo can fix that — it is an account or plan question for Netlify support.

`__forms.html` is the documented remedy for detection failures: a bare twenty-line copy of the
form, `noindex`, linked from nowhere. The real form sits inside 66 KB of markup and comments;
this one gives the parser something it cannot miss. **Its field names must match index.html
exactly** or submissions split across two form definitions and half of them look lost.

### Why it looked broken, and what changed

**Netlify Forms only exist on Netlify.** The interception happens at Netlify's edge: the browser
posts, Netlify catches the request, stores the submission and redirects to the `action`. Off
Netlify there is nothing to catch it, so the POST hits whatever is serving the files. A local
`python -m http.server` answers `501 Not Implemented`. Another host answers `405`. The browser
does what it is told and navigates, and the visitor ends up on a page that is not the one they
were on, having been told nothing, with their enquiry gone.

That is what "the form doesn't work, it just opens a page" is. **The markup was never wrong —
the site was not on Netlify yet.**

It is still not fixed by markup, so the form now submits through `fetch` instead, and the
plain-POST path stays as the no-JavaScript fallback. The difference is that the outcome becomes
knowable:

| | Before | Now |
|---|---|---|
| Success | navigates away to `thanks.html` | confirmation appears in place, form clears |
| Failure | navigates away, says nothing | stays put, explains, and offers a pre-filled email |
| No JavaScript | plain POST → `thanks.html` | unchanged |

**The failure state is a route, not an apology.** The form keeps everything the visitor typed —
it is deliberately not reset — and a button appears that opens their mail client with the name,
organisation, email, need, deadline and message already in the body. So even with Netlify Forms
entirely misconfigured, an enquiry still reaches you in one click. The body is trimmed to about
1,500 characters because mail clients start dropping it above ~2,000, and the trim is announced
in the message rather than silent.

It never redirects to `thanks.html` on failure. Saying thank you for something that did not
arrive is the one outcome worse than an error.

Implementation notes, in `enquiryForm()` in `main.js`: it posts urlencoded to `/`, which is
Netlify's documented AJAX endpoint, and `form-name` must be in that body — which is what the
hidden input is for on this path as well as the other one. `form.checkValidity()` runs first so
the browser's own validation still fires and stays wired to the labels. A filled honeypot gets
the success message: telling a bot it was caught only teaches whoever wrote it to fill the field
differently. The status region is `role="status"`, so a screen reader announces the outcome
without focus moving, and it is `:not(:empty)` in the CSS so it takes no space until it has
something to say.

**`thanks.html` is still needed.** It is where the no-JavaScript path lands, and it is `noindex`.

**You still cannot test this locally.** The POST needs a real deploy — use a deploy preview.
What you *can* test locally is the failure path, which is what a local server produces.

Contrast was measured, not assumed: labels 10.8:1, hints 7.5:1, input text 10.7:1, the send
button 9.5:1. The field border is `rgba(255,255,255,.42)` and not a shade quieter because the
border *is* the control's boundary, which WCAG 1.4.11 wants at 3:1 against the navy — the
first value tried measured 2.82:1 and failed.

**The send button is `.btn--send`, not `.btn--go`.** `.btn--go` carries the C5 progress-bar
reveal, driven by a ScrollTrigger that only ever finds the first `.btn--go` in the band. A
second one would sit clipped to nothing and the send button would be invisible.

---

## Search Console

The site is verified in Google Search Console by **HTML file**:
`google76d48db53d602c2d.html` in the repo root.

**Do not edit, rename or delete it.** Google re-checks the file periodically, and losing it
un-verifies the property — which silently stops the coverage and query reporting rather than
throwing an error. Its contents are one line of text and are not valid HTML; that is what Google
generates and what it expects to read back, so nothing should be added to it, including a
`noindex` tag.

It is deliberately not in `sitemap.xml`, and `robots.txt` disallows nothing, so Google can
always fetch it.

The sitemap is submitted as `sitemap.xml` under Sitemaps. `robots.txt` also declares it, which
is the discovery route that works without any account at all — Search Console is for the
reporting rather than for the crawling.

**A custom domain would need a new property.** Verification does not carry across hosts, and
neither does the index history.

---

## Privacy

`privacy.html` exists because this site sells to NHS trusts, universities and large
consultancies, and every one of them asks how enquiry data is handled before engaging a
supplier. It is linked from the footer, from the note under the form, and from `thanks.html`.

**It also fixed a claim that was not true.** The form note used to read "no mailing list, no
third parties". Netlify stores every submission, which makes it a third-party processor on US
infrastructure — so the unqualified version was one procurement question away from being a
problem. It now says what actually happens and links to the detail.

**Two things in it are commitments rather than descriptions**, and they should match what you
intend to do:

- enquiries that do not become work are deleted "once the conversation has clearly ended, and
  at the latest after twelve months";
- data requests are answered "within one month", which is what the UK GDPR allows.

The rest is factual: the six fields, what the honeypot is for, that Netlify processes it, that
there are no cookies and no analytics, and how to ask for deletion. **If analytics are ever
added, this page has to change before they go live** — it currently states plainly that there
are none.

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

## The testimonials

**Live as section 02**, immediately after the work — four LinkedIn recommendations, each with a
name, a role and an organisation. That placement is deliberate: the quotes land while the four
case studies are still in the reader's head, and they answer the question the work raises.

| Who | Where |
|---|---|
| Paul Banham | Organisational Development Manager, Croydon Council |
| Katie Giachardi | Head of Talent & Capability, dmg media |
| James Millis | Learning & Development Consultant, Croydon Council |
| Steve Motakef | IT Training Consultant, Day Group |

### They are truncated, and that needs fixing properly

LinkedIn's preview cuts every recommendation off at "Read more", so two arrived ending
mid-sentence: "…patient manner and his", "…obtained in the field that". **Each quote on the page
is cut back to the last complete clause its author wrote.** Nothing has been added, smoothed or
paraphrased — the alternative would have been to guess at an ending, and inventing half a
sentence for a named person is not a small thing.

Get the full text from your LinkedIn recommendations page and replace them. A longer quote in
the client's own words is worth more than a short one, and it settles any question about what
was cut.

### One was held back

A fifth arrived, from Sarah Slade, Instructional Designer at Thomson Reuters: *"I worked with
Kayode Fashola from 2010 to 2013. During that time, I found him to be a good designer and Flash
developer."*

It is not on the page, for two reasons worth stating plainly. It dates the work to 2010–2013 and
names **Flash**, a technology that has been dead since 2020, on a page whose newest section
sells AI video — the contrast does the opposite of what a testimonial is for. And "a good
designer" is faint praise sitting beside "highly proficient" and "a brilliant range of technical
skills"; the weakest quote in a set drags the others toward it.

Your call, not mine. If you want it, copy any `<figure class="quote">` block — the grid takes
five without changing, four sit as a 2×2 and five as 2+2+1.

### No `Review` schema, deliberately

Marking these up as `Review` or `AggregateRating` would be a policy breach: Google disallows
**self-serving reviews**, meaning a business publishing marked-up reviews of itself. The rich
result is not shown for that case, so it would risk a manual action in exchange for nothing.
They earn their keep as copy.

### If you add a fifth section later

Adding a section renumbers everything after it, and four places have to agree or the left rail
stops matching the page: the `.modlabel__n` digits, the `.rail__list` entries, the `SECTIONS`
array in `main.js`, and the header nav. Cross-references in the copy count too — Services points
at "section 04" for standalone video and "section 05" for agents and automation.

This has now been done twice, for Testimonials at 02 and AI agents at 05. Both times the trap
was the same: the numbers are hard-coded in four unrelated places and nothing checks that they
agree. If a third section is ever added, grep for `modlabel__n` and `rail__n` together and read
both lists side by side before trusting either.

**Preparing images:** resize to 1500px wide and save as WebP at ~q82. The eleven screenshots
here went from 11.6 MB of PNG to 569 KB that way, with no visible loss. Keep the masters in
`source-images/`.

## The video

Section 04 ends with a real film: **HealthConnect**, a 15-second AI-generated healthcare
explainer. 1280×720, H.264 + AAC, 6.5 MB, `assets/video/healthconnect.mp4`. The placeholder
frame and its "in production" badge are gone, along with the `.reel__badge` rule that styled it.

The poster at `assets/img/healthconnect-poster.webp` (25 KB) is a frame lifted from the film
itself at 12 seconds — the hub-and-spoke diagram, which is the shot the whole thing builds to.
A poster taken from anywhere else is a small lie about what the viewer is about to watch.

### Captions and transcript

`assets/video/healthconnect.en.vtt`, four cues, wired up with `<track kind="captions">`. This is
not optional polish: WCAG 2.2 requires captions for prerecorded synchronised media at level
**A** (SC 1.2.2) — not AA, A — and an uncaptioned film in the section selling accessible video
production would have been the one thing on the page that undercut everything else on it.

**How the cue timings were found.** Not by guessing at a reading rate. The MP4's audio was
decoded in the browser through `AudioContext.decodeAudioData`, reduced to an RMS envelope on
20 ms frames, and segmented on the quiet gaps between phrases. Four speech segments came out —
2.10 s, 3.15 s, 5.10 s and 9.55 s — and they line up one-to-one with the four sentences of the
script. The cues sit on those boundaries. Spot-check them once against the film; anything within
about half a second is imperceptible and these should be closer.

If the `.vtt` is ever moved or renamed, move the `src` with it. **A track pointing at a 404 is
worse than no track at all**: the viewer gets an empty captions menu, which reads as a broken
feature rather than an absent one.

**There is also a transcript**, in a `<details>` under the caption. Captions serve someone
watching with the sound off; a transcript serves someone who would rather read it in ten seconds
than watch it in fifteen. It needs no JavaScript, and it puts forty words of relevant copy on
the page where they can be indexed.

### The encode

The delivered master is 6.45 MB for fifteen seconds — about 3.6 Mbps, several times what
flat-vector animation needs. Both shipped files are re-encodes of it, and a visitor downloads
one of the two:

| File | Size | SSIM against the master |
|---|---|---|
| `healthconnect.webm` — VP9 CRF 30 | 0.80 MB | Y 0.9995 · U 0.9996 · V 0.9823 |
| `healthconnect.mp4` — H.264 CRF 24 | 1.09 MB | Y 0.9993 · U 0.9988 · V 0.9907 |

An 83% reduction with no visible difference — the headline text was compared frame to frame at
12 seconds and is indistinguishable. **CRF 24 rather than 28** for the MP4: at 28 the V channel,
the chroma carrying that purple, fell to 0.975 to save 0.4 MB. Not a trade worth making on a
video whose whole subject is one brand colour and a lot of small white text.

`tools-video.py` reproduces both and prints the SSIM. `--check` compares what is deployed
against the master. The MP4 carries `+faststart`, so the moov atom sits before the media data
and playback can begin before the download finishes.

Homebrew is not installed on this machine, so ffmpeg comes from the `imageio-ffmpeg` pip
package — a self-contained static binary, nothing added system-wide.

### When the fuller reel arrives

The caption already says a longer reel is being cut. Add it as a second `<figure class="reel">`
below this one — `.reel__frame video` is styled to fill the frame at 16:9, so no CSS changes are
needed. Keep `preload="none"` on both, and ship the captions with the file rather than after it.

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
- **The left rail carries no `opacity`.** It used to rest at `.65`, which multiplied everything
  underneath it: the labels measured 3.68:1 and the section numbers 1.43:1, both failing 1.4.3.
  Neither showed up in a contrast sweep that read computed colours without walking ancestor
  opacity — worth knowing if you ever audit this yourself. The quiet resting state is carried by
  colour alone now, at 7.04:1 and 4.74:1. **If the rail ever gets an opacity again, measure it
  afterwards.**
- **Target sizes meet WCAG 2.2 SC 2.5.8 (AA).** Every control measures at least 24x24: gallery
  dots 28x24, arrows 36x36, footer links 24 high with 24px gaps, rail links 24 high, the
  transcript disclosure 24 high. An audit found the footer at 13px with 20px gaps and the rail
  at 14px with 15px gaps — both failing — so if you restyle either, measure the box, not the
  glyphs. The certification links and the contact lines sit below 24 but qualify under the
  inline and spacing exceptions respectively.
- **Slide changes are announced.** `.gallery__count` is `role="status"`, so a screen-reader user
  who presses next hears "2 / 3" rather than nothing.
- **The copyright year is hard-coded**, in `index.html`, `404.html` and `thanks.html`. A
  script-written year is blank for anyone with JavaScript off, and a copyright line that
  disappears is worse than one that is a year out of date. Update it by hand each January.
  Its colour is not `--line-2`, which is a border colour and measures 1.82:1 against the ink —
  a 1.4.3 failure the moment it is used for text. Both footers measure just over 5:1.
- Every form field has a real `<label>`, native validation, and `aria-describedby` on the two
  that carry a hint. Field borders clear 3:1 against the navy, per WCAG 1.4.11. The submit
  outcome lands in a `role="status"` region, so it is announced without focus moving.
- **The video is captioned** (`<track kind="captions">`) and has a transcript beside it. WCAG
  2.2 SC 1.2.2 puts captions at level A, so this is the floor rather than the finish.
- The mobile menu is a real disclosure (`aria-expanded`, Escape to close, focus returned).
- No horizontal scroll from 320px up.

Galleries are keyboard-operable: the viewport is focusable and arrow-scrollable, the previous
and next buttons disable at each end, and the dots are 28x24 hit areas so they meet the WCAG
2.2 target size. Each slide is labelled "Screen N of M" and the counter is a live region.

### Measured, not assumed

Numbers here came from testing this build, not from intent:

| Check | Result |
|---|---|
| Horizontal overflow at 320/375/430/768/1024/1280/1440/1920 | 0 px at every width |
| Text contrast, 56 distinct styles against composited backgrounds | no failures |
| WCAG 1.4.12 text spacing, applied at 375px | no clipping, no overflow |
| Line length, every prose block | 49-72 characters |
| Cumulative layout shift, clean load | 0 |
| First contentful paint, localhost | ~100 ms |
| Heading outline | one `h1`, no skipped levels, 31 headings |
| ARIA idrefs and duplicate IDs | all resolve; none duplicated |

The two things most likely to break if you extend this are contrast on the accents and keyboard
access to custom controls. Check both. `--line-2` in particular is a **hairline colour for
dividers** — it measures 1.82:1 on the ink and fails the moment it is used for text or for a
control boundary. Two rules had to be corrected for exactly that reason.
