/* ============================================================
   CV MEDIA — Global JavaScript
   Developer: Vincent Damaso | IT130L
   ============================================================ */

'use strict';

/* ── Navbar scroll effect ───────────────────────────────── */
(function() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile nav toggle ──────────────────────────────────── */
(function() {
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('mobileClose');
  const navBar = document.querySelector('.navbar');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.style.display = 'none';
    toggle.appendChild = closeBtn;
    navBar.style.display = 'none';
  });
  closeBtn?.addEventListener('click', closeMobile);
  function closeMobile() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    toggle.style.display = '';
    navBar.style.display = '';
  }
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
})();

/* ── Active nav link ────────────────────────────────────── */
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Fade-in on scroll (IntersectionObserver) ───────────── */
(function() {
  const els = document.querySelectorAll('.fade-up, .fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── Stagger children for grid reveals ─────────────────── */
(function() {
  document.querySelectorAll('[data-stagger]').forEach(container => {
    const children = container.querySelectorAll(':scope > *');
    children.forEach((child, i) => {
      child.classList.add('fade-up');
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });
})();

document.querySelectorAll('.fade-up').forEach(el => {
  setTimeout(() => {
    el.classList.add('visible');
  }, 100);
});

/* ── Process / roadmap accordion ───────────────────────── */
(function() {
  const steps = Array.from(document.querySelectorAll('.process-step'));
  if (!steps.length) return;

  const mq = window.matchMedia('(min-width: 992px)');

  const setStepState = (step, open) => {
    step.classList.toggle('active', open);

    const header = step.querySelector('.step-header');
    const body = step.querySelector('.step-body');

    if (header) header.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (body) body.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  const setAllClosed = () => {
    steps.forEach(step => setStepState(step, false));
  };

  const applyDefaultState = () => {
    setAllClosed();
    if (mq.matches) {
      // Desktop: open the first row as a pair
      if (steps[0]) setStepState(steps[0], true);
      if (steps[1]) setStepState(steps[1], true);
    } else {
      // Mobile: open only the first item
      if (steps[0]) setStepState(steps[0], true);
    }
  };

  const getPair = (step) => {
    const index = steps.indexOf(step);
    const pairStart = Math.floor(index / 2) * 2;
    return steps.slice(pairStart, pairStart + 2);
  };

  steps.forEach(step => {
    const header = step.querySelector('.step-header');
    header?.addEventListener('click', () => {
      const isOpen = step.classList.contains('active');

      if (mq.matches) {
        // Desktop: toggle the whole row pair
        const pair = getPair(step);
        pair.forEach(s => setStepState(s, !isOpen));
      } else {
        // Mobile: toggle only the clicked item
        setStepState(step, !isOpen);
      }
    });
  });

  applyDefaultState();
  mq.addEventListener?.('change', applyDefaultState);
})();

/* ── Calculator ─────────────────────────────────────────── */
(function() {
  const SERVICES = {
    editing:   { inhouseMin:3000, inhouseMax:8000, ourMin:1000, ourMax:2000 },
    thumbnail: { inhouseMin:3500, inhouseMax:6000, ourMin:500,  ourMax:1000 },
    script:    { inhouseMin:3000, inhouseMax:7000, ourMin:500,  ourMax:1000 },
    smm:       { inhouseMin:3500, inhouseMax:8000, ourMin:1000, ourMax:1500 },
    smgr:      { inhouseMin:3500, inhouseMax:6000, ourMin:500,  ourMax:1000 }
  };

  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  function fmt(n) { return '$' + n.toLocaleString(); }
  function calc() {
    let ihMin=0, ihMax=0, ourMin=0, ourMax=0;
    cards.forEach(card => {
      if (card.classList.contains('selected')) {
        const key = card.dataset.service;
        const s = SERVICES[key];
        if (s) { ihMin+=s.inhouseMin; ihMax+=s.inhouseMax; ourMin+=s.ourMin; ourMax+=s.ourMax; }
      }
    });

    const empty = document.getElementById('calcEmpty');
    const result = document.getElementById('calcResult');
    if (!ihMin) {
      if (empty) empty.style.display = 'block';
      if (result) result.style.display = 'none';
      return;
    }
    if (empty) empty.style.display = 'none';
    if (result) result.style.display = 'block';

    setText('calcIh', `${fmt(ihMin)} – ${fmt(ihMax)} / month`);
    setText('calcUs', `${fmt(ourMin)} – ${fmt(ourMax)} / month`);
    const savMin = ihMin - ourMax; const savMax = ihMax - ourMin;
    setText('calcSave', `${fmt(Math.max(0,savMin))} – ${fmt(Math.max(0,savMax))}`);
    setText('calcSaveBig', `${fmt(Math.max(0,savMin))} – ${fmt(Math.max(0,savMax))}`);
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const cb = card.querySelector('.service-checkbox');
      if (cb) cb.textContent = card.classList.contains('selected') ? '✓' : '';
      calc();
    });
  });
  calc();
})();

/* ── Segmentation buttons ───────────────────────────────── */
(function() {
  document.querySelectorAll('.segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      if (target) {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── FAQ accordion ──────────────────────────────────────── */
(function() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    q?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── Gallery lightbox ───────────────────────────────────── */
(function() {
  const overlay = document.getElementById('lightboxOverlay');
  if (!overlay) return;
  const imgWrap = overlay.querySelector('.lightbox-img-wrap');
  const caption = overlay.querySelector('.lightbox-caption');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn  = overlay.querySelector('.lightbox-prev');
  const nextBtn  = overlay.querySelector('.lightbox-next');
  const items    = Array.from(document.querySelectorAll('.gallery-item[data-lightbox]'));
  let current    = 0;

  function open(idx) {
    current = idx;
    const item = items[idx];
    if (!item) return;
    const src  = item.dataset.src  || '';
    const cap  = item.dataset.caption || '';
    if (src) {
      imgWrap.innerHTML = `<img src="${src}" alt="${cap}" class="lightbox-img">`;
    } else {
      const icon = item.dataset.icon || '🎬';
      const label = item.dataset.label || cap || 'Portfolio Item';
      imgWrap.innerHTML = `
        <div class="lightbox-placeholder">
          <span class="big-icon">${icon}</span>
          <p>${label}</p>
          <p style="font-size:0.8rem;color:#555;margin-top:8px">Upload your image to replace this placeholder</p>
        </div>`;
    }
    if (caption) caption.textContent = cap;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  function prev()  { open((current - 1 + items.length) % items.length); }
  function next()  { open((current + 1) % items.length); }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  /* ── Swipe support (mobile) ── */
  let touchStartX = 0;
  let touchEndX   = 0;

  overlay.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  overlay.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < 50) return; // ignore small swipes
    if (diff > 0) next(); // swipe left → next
    else prev();          // swipe right → prev
  });
})();

/* ── Growth section lightbox ───────────────────────────── */
(function() {
  const overlay = document.getElementById('growthLightboxOverlay');
  const triggers = document.querySelectorAll('[data-growth-lightbox-trigger]');

  if (!overlay || !triggers.length) return;

  const imgEl = overlay.querySelector('.growth-lightbox-img');
  const captionEl = overlay.querySelector('.growth-lightbox-caption');
  const counterEl = overlay.querySelector('.growth-lightbox-counter');
  const closeBtn = overlay.querySelector('.growth-lightbox-close');
  const prevBtn = overlay.querySelector('.growth-lightbox-prev');
  const nextBtn = overlay.querySelector('.growth-lightbox-next');

  let slides = [];
  let currentIndex = 0;

  /* ── Swipe state ── */
  let touchStartX = 0;
  let touchEndX = 0;

  function safeParseSlides(raw) {
    try {
      const parsed = JSON.parse(raw || '[]');
      return Array.isArray(parsed) ? parsed.filter(s => s && s.src) : [];
    } catch {
      return [];
    }
  }

  function updateSlide(index) {
    if (!slides.length) return;

    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];

    imgEl.src = slide.src;
    imgEl.alt = slide.alt || slide.caption || 'Growth screenshot';
    captionEl.innerHTML = (slide.caption || '').replace(/\n/g, "<br>");
    counterEl.textContent = `${currentIndex + 1} / ${slides.length}`;
  }

  function open(trigger, startIndex = 0) {
    slides = safeParseSlides(trigger.dataset.lightboxSlides);
    if (!slides.length) return;

    updateSlide(startIndex);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prev() {
    updateSlide(currentIndex - 1);
  }

  function next() {
    updateSlide(currentIndex + 1);
  }

  /* ── Fix stuck active state on mobile ── */
  function clearFocus() {
    prevBtn?.blur();
    nextBtn?.blur();
  }

  prevBtn?.addEventListener('click', () => {
    prev();
    clearFocus();
  });

  nextBtn?.addEventListener('click', () => {
    next();
    clearFocus();
  });

  closeBtn?.addEventListener('click', close);

  /* ── Open triggers ── */
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => open(trigger, 0));
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(trigger, 0);
      }
    });
  });

  /* ── Overlay click to close ── */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  /* ── Keyboard navigation ── */
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;

    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  /* ── Swipe support (mobile) ── */
  overlay.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  overlay.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) < 50) return; // ignore small swipes

    if (diff > 0) {
      next(); // swipe left → next
    } else {
      prev(); // swipe right → prev
    }
  }
})();

/* ── Bootstrap-style Carousel ──────────────────────────── */
(function() {
  const wraps = document.querySelectorAll('.carousel-wrap');
  wraps.forEach(wrap => {
    const slides   = wrap.querySelector('.carousel-slides');
    const slideEls = wrap.querySelectorAll('.carousel-slide');
    const dots     = wrap.querySelectorAll('.carousel-dot');
    const prev     = wrap.querySelector('.carousel-prev');
    const next     = wrap.querySelector('.carousel-next');
    if (!slides || !slideEls.length) return;
    let current = 0;
    let timer;

    function go(idx) {
      current = (idx + slideEls.length) % slideEls.length;
      slides.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d,i) => d.classList.toggle('active', i === current));
    }
    function autoplay() { timer = setInterval(() => go(current + 1), 5000); }
    function resetAuto() { clearInterval(timer); autoplay(); }

    prev?.addEventListener('click', () => { go(current - 1); resetAuto(); });
    next?.addEventListener('click', () => { go(current + 1); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); resetAuto(); }));
    go(0);
    autoplay();
  });
})();

/* ── World Map Case Study Modals ────────────────────────── */
(function() {
  const overlay = document.getElementById('caseModalOverlay');
  if (!overlay) return;
  const closeBtn = overlay.querySelector('.modal-close');
  const pins = document.querySelectorAll('.map-area-hotspot');
  const CASES = {
    usa: {
      flag: '🇺🇸', country: 'United States',
      title: 'Tech Creator → 15M Monthly Views',
      desc: 'We helped a US-based tech reviewer scale from 200K to 5M+ subscribers through strategic short-form content and thumbnail optimization.',
      views: '183M', subs: '+4.8M', growth: '340%'
    },
    uk: {
      flag: '🇬🇧', country: 'United Kingdom',
      title: 'Business Coach → Premium Brand',
      desc: 'Transformed a UK business coach\'s social presence with cinematic editing and authority-building content, tripling their course enrollments.',
      views: '42M', subs: '+1.2M', growth: '215%'
    },
    canada: {
      flag: '🇨🇦', country: 'Canada',
      title: 'Finance Creator → 50M+ Views',
      desc: 'Scripted, edited, and published 40 viral finance videos per month for a Canadian creator, achieving 50M total views in 6 months.',
      views: '50M', subs: '+2.1M', growth: '180%'
    },
    australia: {
      flag: '🇦🇺', country: 'Australia',
      title: 'Fitness Brand → 8-Figure Revenue',
      desc: 'Full content team replacement for an Australian fitness brand. Managed 5 platforms simultaneously with 99.8% on-time delivery.',
      views: '28M', subs: '+890K', growth: '290%'
    },
    ph: {
      flag: '🇵🇭', country: 'Philippines',
      title: 'Local Brand → Global Reach',
      desc: 'Took a Philippine lifestyle brand from 0 to 1M followers across TikTok and Instagram in just 4 months.',
      views: '35M', subs: '+1M', growth: '∞'
    }
  };

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      const key = pin.dataset.case;
      const data = CASES[key];
      if (!data) return;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      overlay.querySelector('.case-country-flag').textContent = data.flag;
      overlay.querySelector('.case-country-name').textContent = data.country;
      overlay.querySelector('.case-modal-title').textContent = data.title;
      overlay.querySelector('.case-desc').textContent  = data.desc;
      overlay.querySelector('.case-stat-views').textContent  = data.views;
      overlay.querySelector('.case-stat-subs').textContent   = data.subs;
      overlay.querySelector('.case-stat-growth').textContent = data.growth;
    });
  });
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  function close() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
})();

/* ── Contact Form + Thank You Modal ────────────────────── */
(function() {
  const form     = document.getElementById('contactForm');
  const thankYou = document.getElementById('thankYouModal');
  if (!form || !thankYou) return;
  const closeBtn = thankYou.querySelector('.modal-close');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Basic validation feedback
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = 'var(--clr-red)';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    if (!valid) return;
    thankYou.classList.add('open');
    document.body.style.overflow = 'hidden';
    form.reset();
  });
  closeBtn?.addEventListener('click', () => { thankYou.classList.remove('open'); document.body.style.overflow = ''; });
  thankYou.addEventListener('click', e => {
    if (e.target === thankYou) { thankYou.classList.remove('open'); document.body.style.overflow = ''; }
  });
})();

/* ── Hero form ──────────────────────────────────────────── */
(function() {
  const form = document.getElementById('heroForm');
  const thankYou = document.getElementById('heroThankYou');
  if (!form || !thankYou) return;
  const closeBtn = thankYou.querySelector('.modal-close');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) { input.style.borderColor = 'var(--clr-red)'; valid = false; }
      else input.style.borderColor = '';
    });
    if (!valid) return;
    thankYou.classList.add('open');
    document.body.style.overflow = 'hidden';
    form.reset();
  });
  closeBtn?.addEventListener('click', () => { thankYou.classList.remove('open'); document.body.style.overflow = ''; });
  thankYou.addEventListener('click', e => {
    if (e.target === thankYou) { thankYou.classList.remove('open'); document.body.style.overflow = ''; }
  });
})();

/* ── Counter animation ──────────────────────────────────── */
(function() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ── Testimonials Slideshow ─────────────────────────────── */
(function () {
  const track   = document.getElementById('tsTrack');
  const dotsWrap = document.getElementById('tsDots');
  const prevBtn  = document.getElementById('tsPrev');
  const nextBtn  = document.getElementById('tsNext');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.ts-slide'));
  let current = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'ts-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.ts-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Pause on hover
  track.closest('.testimonials-slideshow').addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.closest('.testimonials-slideshow').addEventListener('mouseleave', resetAuto);

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetAuto();
})();
