/* ==========================================================================
   KTO Technology Solutions — behaviour and choreography

   Everything is progressive. GSAP, ScrollTrigger and Lenis load from a CDN and
   are used only if they arrive. If they are blocked, JavaScript is off, or the
   visitor prefers reduced motion, the page renders complete and static — the
   markup already holds every finished state, and JS only ever rewinds it.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('has-js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var animate = hasGsap && !reduced;

  function q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ==================================================================
     PART 1 — behaviour that must work with or without motion
     ================================================================== */

  var head = q('#head');
  var toggle = q('.navtoggle', head);
  var nav = q('#sitenav');

  function setStuck() { head.classList.toggle('is-stuck', window.scrollY > 8); }
  setStuck();
  window.addEventListener('scroll', setStuck, { passive: true });

  function closeMenu() {
    head.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = head.dataset.open === 'true';
    head.dataset.open = open ? 'false' : 'true';
    toggle.setAttribute('aria-expanded', String(!open));
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && head.dataset.open === 'true') { closeMenu(); toggle.focus(); }
  });

  /* ---- smooth scrolling ---- */
  var lenis = null;
  if (typeof window.Lenis !== 'undefined' && !reduced) {
    // lerp rather than duration: heavier, more deliberate glide
    lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var target = q(id);
    if (!target) return;
    e.preventDefault();
    var offset = -(head.offsetHeight + 16);
    if (lenis) lenis.scrollTo(target, { offset: offset });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset,
                           behavior: reduced ? 'auto' : 'smooth' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---- Module galleries ------------------------------------------------
     Native scroll-snap does the moving; this only drives the controls and
     keeps them in step with wherever the visitor has scrolled to, whether
     that was a button, a swipe, or the keyboard. */
  qa('[data-gallery]').forEach(function (gal) {
    var view = q('.gallery__viewport', gal);
    var slides = qa('.gallery__slide', gal);
    var dots = qa('.gallery__dot', gal);
    var prev = q('.gallery__nav[data-dir="-1"]', gal);
    var next = q('.gallery__nav[data-dir="1"]', gal);
    var now = q('[data-count-now]', gal);
    if (!view || slides.length < 2) return;

    var index = 0;
    var origin = slides[0].offsetLeft;

    function sync() {
      var best = 0, bestGap = Infinity;
      slides.forEach(function (s, i) {
        var gap = Math.abs((s.offsetLeft - origin) - view.scrollLeft);
        if (gap < bestGap) { bestGap = gap; best = i; }
      });
      if (best !== index || now.textContent !== String(best + 1)) {
        index = best;
        if (now) now.textContent = String(index + 1);
        dots.forEach(function (d, i) {
          if (i === index) d.setAttribute('aria-current', 'true');
          else d.removeAttribute('aria-current');
        });
      }
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }

    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      view.scrollTo({ left: slides[i].offsetLeft - origin,
                      behavior: reduced ? 'auto' : 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { go(parseInt(d.dataset.go, 10)); });
    });

    var tick;
    view.addEventListener('scroll', function () {
      clearTimeout(tick);
      tick = setTimeout(sync, 70);
    }, { passive: true });

    window.addEventListener('resize', function () {
      origin = slides[0].offsetLeft;
      sync();
    });

    /* A lazy image that is only off-screen *horizontally* is not reliably
       loaded by the browser, so advancing to slide 3 can show a blank frame.
       Once the gallery itself is near the viewport, promote the rest. */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (!entries.some(function (e) { return e.isIntersecting; })) return;
        qa('img[loading="lazy"]', gal).forEach(function (img) { img.loading = 'eager'; });
        io.disconnect();
      }, { rootMargin: '400px' });
      io.observe(gal);
    } else {
      qa('img[loading="lazy"]', gal).forEach(function (img) { img.loading = 'eager'; });
    }

    sync();
    gal.dataset.galleryReady = 'true';
  });

  /* ---- current section ---- */
  var SECTIONS = ['work', 'services', 'video', 'process', 'toolkit', 'about', 'contact'];
  function markCurrent(id) {
    qa('.rail__list a, .nav__list a').forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  if (hasGsap) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      window.ScrollTrigger.create({
        trigger: el, start: 'top 45%', end: 'bottom 45%',
        onToggle: function (s) { if (s.isActive) markCurrent(id); }
      });
    });
  }

  /* ==================================================================
     PART 2 — choreography
     ================================================================== */
  if (!animate) return;

  root.classList.add('has-motion');
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var mm = gsap.matchMedia();

  window.addEventListener('load', function () { ST.refresh(); });

  /* ---------------- G2 · ambient light field ---------------- */
  (function ambient() {
    var a = q('.ambient__a'), b = q('.ambient__b');
    if (!a || !b) return;
    gsap.to(a, {
      yPercent: 42, xPercent: 16, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
    });
    gsap.to(b, {
      yPercent: -38, xPercent: -14, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
    });
  })();

  /* ---------------- G3 · header progress ---------------- */
  (function headerProgress() {
    var bar = q('.headprog i');
    if (!bar) return;
    gsap.to(bar, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.25 }
    });
  })();

  /* ---------------- rail fill ---------------- */
  (function railFill() {
    var fill = q('.rail__fill');
    if (!fill) return;
    gsap.to(fill, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });
  })();

  /* ---------------- G5 · the recurring section signature ----------------
     Every module label performs the same move: the number counts up, the
     word's tracking closes, the rule draws. One deliberate device repeated
     is what makes a page read as composed rather than as a pile of effects. */
  qa('.modlabel').forEach(function (label) {
    var num = q('.modlabel__n', label);
    var rule = q('.modlabel__rule', label);
    var tl = gsap.timeline({
      scrollTrigger: { trigger: label, start: 'top 88%', once: true }
    });

    tl.fromTo(label, { letterSpacing: '0.46em' },
      { letterSpacing: '0.28em', duration: 1.1, ease: 'power3.out' }, 0);

    if (num) {
      var target = parseInt(num.textContent, 10);
      var box = { v: 0 };
      tl.to(box, {
        v: target, duration: 0.9, ease: 'power2.out',
        onUpdate: function () {
          num.textContent = String(Math.round(box.v)).padStart(2, '0');
        }
      }, 0);
    }
    if (rule) tl.to(rule, { scaleX: 1, duration: 0.9, ease: 'power3.out' }, 0.15);
  });

  /* ---------------- G7 · reveal primitives ---------------- */

  // settle — copy
  function settle(items, trigger, start) {
    if (!items.length) return null;
    return gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: trigger, start: start || 'top 84%', once: true }
    });
  }

  // screen-on — course screens wipe up like a display powering on
  function screenOn(el, delay) {
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)', y: 0,
      duration: 1.05, delay: delay || 0, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true }
    });
  }

  var HERO = q('.section--hero');

  qa('.gallery[data-reveal], .reel[data-reveal]').forEach(function (el) { screenOn(el); });

  // Groups with bespoke choreography opt out of the generic settle, or they
  // would be animated twice.
  var BESPOKE = '.svc, .steps, .tools';

  qa('[data-reveal-group]').forEach(function (group) {
    if (HERO && HERO.contains(group)) return;
    if (group.matches(BESPOKE)) return;
    var items = qa('[data-reveal]', group).filter(function (el) {
      return !el.matches('.gallery, .reel');
    });
    settle(items, group, 'top 82%');
  });

  qa('[data-reveal]').forEach(function (el) {
    if (el.closest('[data-reveal-group]')) return;
    if (HERO && HERO.contains(el)) return;
    if (el.matches('.gallery, .reel')) return;
    settle([el], el, 'top 88%');
  });

  /* ---------------- G6 · scroll-velocity skew ----------------
     Kept to ±1.2deg. Any more and it reads as a broken page rather than as
     weight. Pointer devices only. */
  mm.add('(hover: hover) and (pointer: fine)', function () {
    var targets = qa('.screen');
    if (!targets.length) return;
    var setters = targets.map(function (el) {
      return gsap.quickTo(el, 'skewY', { duration: 0.55, ease: 'power3' });
    });
    var reset = gsap.delayedCall(0.18, function () { setters.forEach(function (s) { s(0); }); }).pause();
    ST.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom',
      onUpdate: function (self) {
        var v = clamp(self.getVelocity() / -900, -1.2, 1.2);
        setters.forEach(function (s) { s(v); });
        reset.restart(true);
      }
    });
  });

  /* ==================================================================
     HERO
     ================================================================== */
  (function hero() {
    if (!HERO) return;
    var plate = q('.heromedia img', HERO);
    var cue = q('.scrollcue', HERO);
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });

    if (plate) tl.fromTo(plate, { scale: 1.12 }, { scale: 1, duration: 1.9, ease: 'power2.out' }, 0);

    tl.to(qa('.spread__spec [data-reveal]', HERO), { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.25)
      .to(q('.herobrand', HERO), { opacity: 1, y: 0, duration: 0.6 }, 0.1)
      // y:0 must be stated explicitly. GSAP reads the CSS translateY(105%)
      // out of the computed matrix as a pixel `y`, and yPercent is a separate
      // channel — without this the lines settle a whole line-height low and
      // stay hidden behind the mask.
      .fromTo(qa('.h-display .line__in', HERO),
        { yPercent: 105, y: 0, filter: 'blur(9px)' },
        { yPercent: 0, y: 0, filter: 'blur(0px)', duration: 1.05, stagger: 0.08, ease: 'power4.out' }, 0.2);

    // The wash and the knocked-out text must move together, or the words sit
    // invisible until the green arrives.
    var wash = q('.hl__wash', HERO);
    var knock = q('.hl__text--knock', HERO);
    if (wash) tl.to(wash, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, '-=0.35');
    if (knock) tl.to(knock, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.inOut' }, '<');

    tl.to(qa('.lead, .actions', HERO), { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.4');
    if (cue) tl.to(cue, { opacity: 1, duration: 0.6 }, '-=0.2');

    // the dot travelling the cue line
    var dot = q('.scrollcue__line i', HERO);
    if (dot) {
      gsap.fromTo(dot, { xPercent: -110 }, {
        xPercent: 370, duration: 1.9, ease: 'power2.inOut',
        repeat: -1, repeatDelay: 0.5
      });
    }

    // plate parallax + the hero receding as you leave it
    if (plate) {
      gsap.to(plate, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: HERO, start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }
    gsap.to(q('.spread--hero', HERO), {
      yPercent: -7, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: HERO, start: 'center center', end: 'bottom top', scrub: 0.5 }
    });
    if (cue) {
      gsap.to(cue, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: HERO, start: 'top top', end: '+=240', scrub: true }
      });
    }
  })();

  /* ==================================================================
     01 · WORK
     ================================================================== */

  /* sector labels open their tracking as they arrive */
  qa('.case__sector').forEach(function (el) {
    gsap.fromTo(el, { letterSpacing: '0.40em' },
      { letterSpacing: '0.26em', duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* case titles wipe up */
  qa('.h-case[data-reveal]').forEach(function (el) {
    gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* ==================================================================
     STATEMENT BAND
     ================================================================== */
  (function statement() {
    var band = q('.statement');
    if (!band) return;
    var img = q('.statement__media img', band);
    var quote = q('.statement__q', band);
    var by = q('.statement__by', band);

    if (img) {
      gsap.fromTo(img, { yPercent: -9, scale: 1.1 }, {
        yPercent: 9, scale: 1, ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
      });
    }
    if (quote) {
      gsap.fromTo(quote, { clipPath: 'inset(0 0 100% 0)', y: 24 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: band, start: 'top 72%', once: true } });
      var em = q('em', quote);
      if (em) gsap.fromTo(em, { opacity: 0.25 }, {
        opacity: 1, duration: 0.8, delay: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: band, start: 'top 72%', once: true }
      });
    }
    if (by) {
      gsap.fromTo(by, { letterSpacing: '0.16em', opacity: 0 },
        { letterSpacing: '0.26em', opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: band, start: 'top 70%', once: true } });
    }
  })();

  /* ==================================================================
     02 · SERVICES
     ================================================================== */
  /* The tenure meter fills a year at a time while the figure counts with it. */
  (function tenure() {
    var block = q('.tenure');
    if (!block) return;
    var ticks = qa('.tenure__ticks i', block);
    var num = q('.tenure__n', block);
    if (!num) return;
    var years = parseInt(num.textContent, 10);

    var tl = gsap.timeline({
      scrollTrigger: { trigger: block, start: 'top 84%', once: true }
    });

    tl.to(ticks, {
      scaleY: 1, duration: 0.3, ease: 'power2.out',
      stagger: { each: 0.9 / Math.max(ticks.length, 1) }
    }, 0);

    var box = { v: 0 };
    tl.to(box, {
      v: years, duration: 0.9, ease: 'none',
      onUpdate: function () { num.textContent = String(Math.round(box.v)); }
    }, 0);
  })();

  qa('.svc').forEach(function (grid) {
    var items = qa('.svc__item', grid);
    if (!items.length) return;
    // two columns, so the rows follow from however many items the grid holds
    var wave = { each: 0.06, grid: [Math.ceil(items.length / 2), 2], from: 'start' };

    // diagonal wave rather than a flat list stagger
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      stagger: wave,
      scrollTrigger: { trigger: grid, start: 'top 82%', once: true }
    });
    // the blue dash draws out from nothing, on the same diagonal
    gsap.to(qa('.svc__item h3', grid), {
      '--dash': 1, duration: 0.55, ease: 'power2.out',
      stagger: wave,
      scrollTrigger: { trigger: grid, start: 'top 80%', once: true }
    });

    // V3 · pointer-follow light
    mm.add('(hover: hover) and (pointer: fine)', function () {
      var glow = document.createElement('span');
      glow.className = 'svc__glow';
      glow.setAttribute('aria-hidden', 'true');
      grid.appendChild(glow);
      var xTo = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power3' });
      var yTo = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power3' });
      function move(e) {
        var r = grid.getBoundingClientRect();
        xTo(e.clientX - r.left); yTo(e.clientY - r.top);
      }
      grid.addEventListener('pointermove', move);
      return function () { grid.removeEventListener('pointermove', move); glow.remove(); };
    });
  });

  /* ==================================================================
     03 · PROCESS — the track is the spine; modules complete in sequence
     ================================================================== */
  (function process() {
    var steps = q('.steps');
    var draw = q('.steps__draw');
    if (!steps || !draw) return;
    var cells = qa('.steps__item', steps);

    gsap.to(draw, {
      scaleX: 1, ease: 'none',
      scrollTrigger: {
        trigger: steps, start: 'top 78%', end: 'bottom 62%', scrub: 0.45,
        onUpdate: function (self) {
          var reached = self.progress * cells.length;
          cells.forEach(function (c, i) { c.classList.toggle('is-complete', i < reached); });
        }
      }
    });

    gsap.to(cells, {
      opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
      stagger: { each: 0.06, grid: [2, 3], from: 'start' },
      scrollTrigger: { trigger: steps, start: 'top 84%', once: true }
    });

    var note = q('.notebox');
    if (note) {
      gsap.to(note, {
        clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: note, start: 'top 86%', once: true }
      });
    }
  })();

  /* ==================================================================
     04 · TOOLKIT — a systems check, deliberately mechanical
     ================================================================== */
  (function toolkit() {
    var tools = q('.tools');
    if (!tools) return;
    gsap.to(qa('.tools__group', tools), {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: tools, start: 'top 84%', once: true }
    });
    qa('.tools__group', tools).forEach(function (group, gi) {
      var items = qa('li', group);
      gsap.set(items, { opacity: 0, x: -8 });
      gsap.to(items, {
        opacity: 1, x: 0, duration: 0.3, ease: 'power1.out',
        stagger: 0.035, delay: gi * 0.12,
        scrollTrigger: { trigger: tools, start: 'top 82%', once: true }
      });
    });
  })();

  /* ==================================================================
     05 · ABOUT — the lead paragraph lights word by word with scroll
     ================================================================== */
  (function about() {
    var lead = q('.prose__lead');
    if (!lead) return;
    var words = lead.textContent.trim().split(/\s+/);
    lead.textContent = '';
    var spans = words.map(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = w + (i < words.length - 1 ? ' ' : '');
      lead.appendChild(s);
      return s;
    });
    ST.create({
      trigger: lead, start: 'top 78%', end: 'bottom 58%', scrub: true,
      onUpdate: function (self) {
        var lit = self.progress * spans.length * 1.15;
        spans.forEach(function (s, i) { s.classList.toggle('is-lit', i < lit); });
      }
    });
  })();

  /* ==================================================================
     06 · CONTACT — the navy rises, then the button completes
     ================================================================== */
  (function contact() {
    var band = q('.band');
    if (!band) return;
    var curtain = q('.band__curtain', band);
    var headline = q('.h-display--sm', band);
    var cta = q('.btn--go', band);

    if (curtain) {
      gsap.to(curtain, {
        scaleY: 0, ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'top 55%', scrub: 0.5 }
      });
    }
    if (headline) {
      gsap.fromTo(headline, { clipPath: 'inset(0 0 100% 0)', y: 20 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headline, start: 'top 84%', once: true } });
    }
    if (cta) {
      // the button fills like a progress bar reaching 100%
      gsap.to(cta, {
        clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power3.inOut',
        scrollTrigger: { trigger: cta, start: 'top 90%', once: true }
      });
    }
  })();

})();
