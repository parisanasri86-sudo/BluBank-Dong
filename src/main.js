import { en } from './content/en.js';
import { fa } from './content/fa.js';
import { caseNav, header } from './components/header.js';
import {
  cardGrid,
  competitiveAnalysis,
  artifactGrid,
  assetSlot,
  currentGapProposed,
  currentDongExperience,
  decisionCallout,
  designDecision,
  emotionalJourney,
  evidenceList,
  feedbackRows,
  finalShowcase,
  flowExploration,
  heuristicVisual,
  interviewEvidence,
  impactEffortMatrix,
  insightEditorial,
  iterationComparisons,
  journeySteps,
  measurementList,
  metadata,
  personaIntro,
  priorityHierarchy,
  quoteBlock,
  quickScan,
  reflectionGrid,
  sectionHeader,
  solutionPath,
  socialFriction,
  synthesisVisual,
  projectContext,
  productRelationship,
  reviewEvidence,
  closingComparison,
} from './components/sections.js';

const STORAGE_KEYS = {
  locale: 'blubank-dong-rebuild-locale',
  theme: 'blubank-dong-rebuild-theme',
};

const content = { en, fa };
const root = document.documentElement;
const app = document.querySelector('#app');
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersianDigits(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

function localizePersianText(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (/\d/.test(node.nodeValue)) node.nodeValue = toPersianDigits(node.nodeValue);
    node = walker.nextNode();
  }
}

const safeStorage = {
  get(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Preferences are progressive enhancement; the UI still works without storage.
    }
  },
};

const initialLocale = content[safeStorage.get(STORAGE_KEYS.locale, 'en')]
  ? safeStorage.get(STORAGE_KEYS.locale, 'en')
  : 'en';
const initialTheme = ['dark', 'light'].includes(safeStorage.get(STORAGE_KEYS.theme, 'dark'))
  ? safeStorage.get(STORAGE_KEYS.theme, 'dark')
  : 'dark';

let state = {
  locale: initialLocale,
  theme: initialTheme,
};

let revealObserver;
let coverflowTimer;

function applyDocumentState() {
  const activeContent = content[state.locale];
  root.lang = activeContent.meta.locale;
  root.dir = activeContent.meta.dir;
  root.dataset.theme = state.theme;
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.textContent = activeContent.controls.skipToMain;
}

function setActiveNav(id, navContent) {
  const index = navContent.items.findIndex((item) => item.id === id);
  const activeIndex = index >= 0 ? index : 0;
  const activeItem = navContent.items[activeIndex];

  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const isActive = link.dataset.navLink === activeItem.id;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const currentLabel = document.querySelector('[data-nav-current]');
  const currentCount = document.querySelector('[data-nav-count]');
  if (currentLabel) currentLabel.textContent = activeItem.label;
  if (currentCount) {
    const count = `${String(activeIndex + 1).padStart(2, '0')} / ${String(navContent.items.length).padStart(2, '0')}`;
    currentCount.textContent = state.locale === 'fa' ? toPersianDigits(count) : count;
  }
}

function updateProgress() {
  const progress = document.querySelector('[data-progress-bar]');
  if (!progress) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  progress.style.transform = `scaleX(${value})`;
}

function getNavOffset() {
  const nav = document.querySelector('.case-nav');
  if (!nav) return 96;

  const top = parseFloat(getComputedStyle(nav).top) || 0;
  return top + nav.offsetHeight + 24;
}

function updateActiveNavFromScroll(navContent) {
  const trigger = window.scrollY + getNavOffset();
  const anchors = navContent.items
    .map((item) => ({ ...item, element: document.getElementById(item.id) }))
    .filter((item) => item.element);

  const active = anchors.reduce((current, item) => {
    return item.element.offsetTop <= trigger ? item : current;
  }, anchors[0]);

  if (active) setActiveNav(active.id, navContent);
}

function closeMobileNav() {
  const nav = document.querySelector('.case-nav');
  const trigger = document.querySelector('[data-nav-toggle]');
  if (!nav || !trigger) return;

  nav.classList.remove('is-open');
  trigger.setAttribute('aria-expanded', 'false');
}

function setupCaseNav(navContent) {
  updateActiveNavFromScroll(navContent);
  updateProgress();
}

function setupHeroVideo() {
  const frame = document.querySelector('.hero-video');
  const video = frame?.querySelector('.device-video__media');
  if (!frame || !video) return;

  video.addEventListener('canplay', () => {
    frame.classList.add('is-ready');
  }, { once: true });
}

function setupDecisionCoverflow() {
  window.clearInterval(coverflowTimer);
  const carousel = document.querySelector('[data-coverflow]');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('[data-coverflow-slide]')];
  const dots = [...carousel.querySelectorAll('[data-coverflow-dot]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let paused = false;

  const show = (next) => {
    active = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      let relative = index - active;
      if (relative > slides.length / 2) relative -= slides.length;
      if (relative < -slides.length / 2) relative += slides.length;
      const distance = Math.abs(relative);
      slide.style.setProperty('--coverflow-x', String(relative));
      slide.style.setProperty('--coverflow-distance', String(distance));
      slide.style.zIndex = String(10 - distance);
      slide.classList.toggle('is-active', relative === 0);
      slide.setAttribute('aria-hidden', String(relative !== 0));
    });
    dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === active)));
  };

  const start = () => {
    window.clearInterval(coverflowTimer);
    if (reduceMotion) return;
    coverflowTimer = window.setInterval(() => {
      if (!paused && !document.hidden) show(active + 1);
    }, 3800);
  };

  slides.forEach((slide, index) => slide.addEventListener('click', () => show(index)));
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    show(index);
    start();
  }));
  carousel.addEventListener('mouseenter', () => { paused = true; });
  carousel.addEventListener('mouseleave', () => { paused = false; });
  carousel.addEventListener('focusin', () => { paused = true; });
  carousel.addEventListener('focusout', () => { paused = false; });
  carousel.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    show(active + (root.dir === 'rtl' ? -direction : direction));
    start();
  });

  show(0);
  start();
}

function setupCaseVideos() {
  const videos = [...document.querySelectorAll('.media-set--video .device-video__media')];
  if (!videos.length) return;

  videos.forEach((video) => {
    const frame = video.closest('.media-set--video');
    const button = frame?.querySelector('.media-set__play');
    if (!button) return;

    const setVideoState = (isPlaying) => {
      const icon = button.querySelector('.media-set__icon');
      frame.classList.toggle('is-playing', isPlaying);
      button.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
      icon.classList.toggle('is-pause', isPlaying);
      icon.textContent = isPlaying ? '' : '▶';
    };

    video.pause();
    video.currentTime = 0;
    setVideoState(false);

    const toggleVideo = () => {
      if (video.paused) {
        video.play().then(() => {
          setVideoState(true);
        }).catch(() => {});
      } else {
        video.pause();
        setVideoState(false);
      }
    };

    button.addEventListener('click', toggleVideo);
    video.addEventListener('click', toggleVideo);

    video.addEventListener('play', () => {
      setVideoState(true);
    });

    video.addEventListener('pause', () => {
      if (!video.ended) setVideoState(false);
    });

    video.addEventListener('ended', () => {
      video.pause();
      video.currentTime = 0;
      requestAnimationFrame(() => {
        setVideoState(false);
      });
    });
  });
}

function activateFlowTab(index, moveFocus = false) {
  const tabs = [...document.querySelectorAll('[data-flow-tab]')];
  const panels = [...document.querySelectorAll('[data-flow-panel]')];
  if (!tabs.length || !panels[index]) return;

  tabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === index;
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel, panelIndex) => {
    panel.hidden = panelIndex !== index;
    if (panelIndex !== index) {
      panel.querySelectorAll('video').forEach((video) => video.pause());
    }
  });

  if (moveFocus) tabs[index].focus();
}

function setupFinalShowcase() {
  activateFlowTab(0);
}

function setupReveal() {
  revealObserver?.disconnect();

  const targets = [...document.querySelectorAll('.quick-scan, .case-section')];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  root.classList.add('reveal-ready');
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  targets.forEach((target) => revealObserver.observe(target));
}

function updateBackToTop() {
  const button = document.querySelector('[data-back-to-top]');
  if (!button) return;
  button.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
}

function renderControls(t) {
  const isEnglish = state.locale === 'en';
  const isDark = state.theme === 'dark';

  return `
    <div class="control-panel" aria-label="Preview controls">
      <div class="segmented-control" role="group" aria-label="${t.controls.language}">
        <button type="button" class="control-button ${isEnglish ? 'is-active' : ''}" data-locale="en" aria-pressed="${isEnglish}" aria-label="${t.controls.switchToEnglish}">EN</button>
        <button type="button" class="control-button ${!isEnglish ? 'is-active' : ''}" data-locale="fa" aria-pressed="${!isEnglish}" aria-label="${t.controls.switchToPersian}">فا</button>
      </div>
      <button
        type="button"
        class="theme-switch ${isDark ? 'is-dark' : ''}"
        data-theme-toggle
        role="switch"
        aria-checked="${isDark}"
        aria-label="${isDark ? t.controls.switchToLight : t.controls.switchToDark}"
      >
        <span class="theme-switch__thumb" aria-hidden="true">
          <svg class="theme-switch__icon theme-switch__icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
          <svg class="theme-switch__icon theme-switch__icon--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z"></path>
          </svg>
        </span>
      </button>
    </div>
  `;
}

function render() {
  const t = content[state.locale];
  applyDocumentState();

  app.dataset.state = 'ready';
  app.innerHTML = `
    ${renderControls(t)}
    <main id="main" class="page-shell">
      ${header(t.hero)}
      ${quickScan(t.quickScan)}
      ${caseNav(t.nav)}

      <section id="overview" class="case-section section-band" data-nav-section="overview">
        ${sectionHeader(t.context)}
        <div class="context-layout">
          <div class="narrative-copy">
            ${productRelationship(t.context.relationship)}
            <p class="context-bridge">${t.context.bridge}</p>
          </div>
          ${projectContext(t.context.project)}
        </div>
      </section>

      <section class="case-section" data-nav-section="overview">
        ${sectionHeader(t.currentExperience)}
        ${currentDongExperience(t.currentExperience)}
      </section>

      <section id="research" class="case-section" data-nav-section="research">
        ${sectionHeader(t.research)}
        ${synthesisVisual(t.synthesis.visual)}
        ${reviewEvidence(t.research.reviews)}
        ${interviewEvidence(t.research.interviews)}
        ${heuristicVisual(t.synthesis.heuristic)}
        ${competitiveAnalysis(t.research.competitive)}
      </section>

      <section id="insights" class="case-section" data-nav-section="insights">
        ${sectionHeader(t.insights)}
        ${insightEditorial(t.insights)}
      </section>

      <section class="case-section" data-nav-section="insights">
        ${sectionHeader(t.personas)}
        ${personaIntro(t.personas)}
      </section>

      <section class="case-section" data-nav-section="insights">
        ${sectionHeader(t.journey)}
        ${emotionalJourney(t.journey)}
      </section>

      <section class="case-section section-band" data-nav-section="insights">
        ${sectionHeader(t.socialFriction)}
        ${socialFriction(t.socialFriction)}
      </section>

      <section class="case-section" data-nav-section="insights">
        ${sectionHeader(t.opportunity)}
        <div class="opportunity-card">
          <p class="card-label">${t.opportunity.label}</p>
          <h3>${t.opportunity.question}</h3>
          <p>${t.opportunity.body}</p>
        </div>
        ${impactEffortMatrix(t.prioritization.matrix)}
        ${priorityHierarchy(t.prioritization.selected, t.prioritization.selectedLabel)}
        ${decisionCallout(t.prioritization.nonBluDecision)}
      </section>

      <section id="design" class="case-section" data-nav-section="design">
        ${sectionHeader(t.productDirection)}
        ${currentGapProposed(t.productDirection.items)}
      </section>

      <section class="case-section section-band" data-nav-section="design">
        ${sectionHeader(t.firstDesign)}
        ${flowExploration(t.firstDesign.flows)}
      </section>

      <section id="iteration" class="case-section" data-nav-section="iteration">
        ${sectionHeader(t.feedback)}
        ${feedbackRows(t.feedback.items)}
      </section>

      <section class="case-section section-band" data-nav-section="iteration">
        ${sectionHeader(t.iteration)}
        ${iterationComparisons(t.iteration)}
      </section>

      <section class="case-section" data-nav-section="iteration">
        ${sectionHeader(t.ocrDecision)}
        ${designDecision(t.ocrDecision)}
      </section>

      <section id="final" class="case-section section-band" data-nav-section="final">
        ${sectionHeader(t.finalExperience)}
        ${finalShowcase(t.finalExperience)}
      </section>

      <section class="case-section" data-nav-section="final">
        ${sectionHeader(t.comparison)}
        ${closingComparison(t.comparison)}
      </section>

      <section class="case-section section-band" data-nav-section="final">
        ${sectionHeader(t.measurement)}
        ${measurementList(t.measurement)}
      </section>

      <section class="case-section" data-nav-section="final">
        ${sectionHeader(t.reflection)}
        ${reflectionGrid(t.reflection)}
      </section>
    </main>
    <button class="back-to-top" type="button" data-back-to-top aria-label="${t.controls.backToTop}">
      <span aria-hidden="true">↑</span>
    </button>
  `;

  if (state.locale === 'fa') localizePersianText(app);

  setupCaseNav(t.nav);
  setupHeroVideo();
  setupCaseVideos();
  setupFinalShowcase();
  setupDecisionCoverflow();
  setupReveal();
  updateBackToTop();
}

function setLocale(locale) {
  if (!content[locale] || locale === state.locale) return;
  state = { ...state, locale };
  safeStorage.set(STORAGE_KEYS.locale, locale);
  render();
}

function toggleTheme() {
  const theme = state.theme === 'dark' ? 'light' : 'dark';
  state = { ...state, theme };
  safeStorage.set(STORAGE_KEYS.theme, theme);
  root.dataset.theme = theme;

  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;

  const isDark = theme === 'dark';
  const t = content[state.locale];
  button.classList.toggle('is-dark', isDark);
  button.setAttribute('aria-checked', String(isDark));
  button.setAttribute('aria-label', isDark ? t.controls.switchToLight : t.controls.switchToDark);
}

app.addEventListener('click', (event) => {
  const navToggle = event.target.closest('[data-nav-toggle]');
  if (navToggle) {
    const nav = navToggle.closest('.case-nav');
    const isOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    return;
  }

  const navLink = event.target.closest('[data-nav-link]');
  if (navLink) {
    event.preventDefault();
    const target = document.getElementById(navLink.dataset.navLink);
    if (target) {
      setActiveNav(navLink.dataset.navLink, content[state.locale].nav);
      window.scrollTo({
        top: Math.max(0, target.offsetTop - getNavOffset()),
        behavior: 'smooth',
      });
    }
    closeMobileNav();
    return;
  }

  const localeButton = event.target.closest('[data-locale]');
  if (localeButton) {
    setLocale(localeButton.dataset.locale);
    return;
  }

  if (event.target.closest('[data-theme-toggle]')) {
    toggleTheme();
    return;
  }

  const flowTab = event.target.closest('[data-flow-tab]');
  if (flowTab) {
    activateFlowTab(Number(flowTab.dataset.flowTab));
    return;
  }

  if (event.target.closest('[data-back-to-top]')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

app.addEventListener('keydown', (event) => {
  const tab = event.target.closest('[data-flow-tab]');
  if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

  const tabs = [...document.querySelectorAll('[data-flow-tab]')];
  const currentIndex = tabs.indexOf(tab);
  const direction = root.dir === 'rtl' ? -1 : 1;
  let nextIndex = currentIndex;

  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = tabs.length - 1;
  if (event.key === 'ArrowRight') nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
  if (event.key === 'ArrowLeft') nextIndex = (currentIndex - direction + tabs.length) % tabs.length;

  event.preventDefault();
  activateFlowTab(nextIndex, true);
});

window.addEventListener('scroll', () => {
  updateProgress();
  updateActiveNavFromScroll(content[state.locale].nav);
  updateBackToTop();
}, { passive: true });
window.addEventListener('resize', () => {
  updateProgress();
  updateActiveNavFromScroll(content[state.locale].nav);
});

render();
