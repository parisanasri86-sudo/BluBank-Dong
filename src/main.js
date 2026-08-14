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
  reflectionGrid,
  sectionHeader,
  solutionPath,
  socialFriction,
  synthesisVisual,
  projectContext,
  researchSnapshot,
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

function applyDocumentState() {
  const activeContent = content[state.locale];
  root.lang = activeContent.meta.locale;
  root.dir = activeContent.meta.dir;
  root.dataset.theme = state.theme;
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
  if (currentCount) currentCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(navContent.items.length).padStart(2, '0')}`;
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
  const video = document.querySelector('.hero-video');
  if (!video) return;

  video.addEventListener('canplay', () => {
    video.classList.add('is-ready');
  }, { once: true });
}

function setupCaseVideos() {
  const videos = [...document.querySelectorAll('.media-set__video')];
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

function renderControls(t) {
  const isEnglish = state.locale === 'en';
  const isLight = state.theme === 'light';

  return `
    <div class="control-panel" aria-label="Preview controls">
      <div class="segmented-control" role="group" aria-label="${t.controls.language}">
        <button type="button" class="control-button ${isEnglish ? 'is-active' : ''}" data-locale="en" aria-pressed="${isEnglish}" aria-label="${t.controls.switchToEnglish}">EN</button>
        <button type="button" class="control-button ${!isEnglish ? 'is-active' : ''}" data-locale="fa" aria-pressed="${!isEnglish}" aria-label="${t.controls.switchToPersian}">فا</button>
      </div>
      <button type="button" class="icon-button" data-theme-toggle aria-pressed="${isLight}" aria-label="${isLight ? t.controls.switchToDark : t.controls.switchToLight}">
        <span aria-hidden="true">${isLight ? '☾' : '☼'}</span>
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
      ${caseNav(t.nav)}

      <section id="overview" class="case-section section-band" data-nav-section="overview">
        ${sectionHeader(t.context)}
        <div class="context-layout">
          <div class="narrative-copy">
            <p>${t.context.body}</p>
          </div>
          ${projectContext(t.context.project)}
        </div>
      </section>

      <section class="case-section" data-nav-section="overview">
        ${sectionHeader(t.currentExperience)}
        ${currentDongExperience(t.currentExperience)}
      </section>

      <section class="case-section section-band" data-nav-section="overview">
        ${sectionHeader(t.problem)}
        ${quoteBlock(t.problem.statement)}
        ${evidenceList(t.problem.themes)}
      </section>

      <section id="research" class="case-section" data-nav-section="research">
        ${sectionHeader(t.research)}
        ${researchSnapshot(t.research.snapshot)}
        ${reviewEvidence(t.research.reviews)}
        ${interviewEvidence(t.research.interviews)}
        ${heuristicVisual(t.synthesis.heuristic)}
        ${competitiveAnalysis(t.research.competitive)}
      </section>

      <section class="case-section section-band" data-nav-section="research">
        ${sectionHeader(t.synthesis)}
        ${synthesisVisual(t.synthesis.visual)}
      </section>

      <section id="insights" class="case-section" data-nav-section="insights">
        ${sectionHeader(t.insights)}
        ${insightEditorial(t.insights.items)}
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
        ${priorityHierarchy(t.prioritization.items)}
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
        ${finalShowcase(t.finalExperience.items)}
      </section>

      <section class="case-section" data-nav-section="final">
        ${sectionHeader(t.comparison)}
        ${closingComparison(t.comparison)}
      </section>

      <section class="case-section section-band" data-nav-section="final">
        ${sectionHeader(t.measurement)}
        ${measurementList(t.measurement.items)}
      </section>

      <section class="case-section" data-nav-section="final">
        ${sectionHeader(t.reflection)}
        ${reflectionGrid(t.reflection)}
      </section>
    </main>
  `;

  setupCaseNav(t.nav);
  setupHeroVideo();
  setupCaseVideos();
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
  render();
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
  }
});

window.addEventListener('scroll', () => {
  updateProgress();
  updateActiveNavFromScroll(content[state.locale].nav);
}, { passive: true });
window.addEventListener('resize', () => {
  updateProgress();
  updateActiveNavFromScroll(content[state.locale].nav);
});

render();
