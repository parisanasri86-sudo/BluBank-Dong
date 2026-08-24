import { deviceVideo } from './sections.js';

export function header(content) {
  return `
    <header class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">${content.eyebrow}</p>
        <img class="hero-logo" src="./assets/blubank-logo.png" alt="BluBank logo">
        <p class="hero-kicker">${content.productName}</p>
        <h1 id="page-title">${content.title}</h1>
        <p class="hero-lead">${content.subtitle}</p>
        <div class="hero-team" aria-label="${content.team.ariaLabel}">
          <div class="hero-team__portraits" aria-hidden="true">
            <div class="hero-team__designers">
              ${content.team.designers.map((person, index) => `
                <img src="${person.src}" alt="" style="--portrait-index: ${index}">
              `).join('')}
            </div>
            <span class="hero-team__plus">+</span>
            <span class="hero-team__mentor">
              <img src="${content.team.mentor.src}" alt="">
              <i aria-hidden="true">✦</i>
            </span>
          </div>
          <div class="hero-team__copy">
            <strong>${content.team.label}</strong>
            <span>${content.team.meta}</span>
          </div>
        </div>
        <div class="hero-actions" aria-label="${content.actionsLabel}">
          <a class="hero-action hero-action--primary" href="#overview">
            <span>${content.scrollLabel}</span>
            <i class="hero-action__icon hero-action__icon--down" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 5v14M7 14l5 5 5-5" />
              </svg>
            </i>
          </a>
          <a class="hero-action hero-action--secondary" href="#final">
            <span>${content.finalLabel}</span>
            <i class="hero-action__icon hero-action__icon--diagonal" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M6 6l12 12M9 18h9V9" />
              </svg>
            </i>
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <figure class="hero-product-frame">
          ${deviceVideo({
            src: content.media.video,
            label: content.media.alt,
            poster: content.media.poster.src,
            autoplay: true,
            loop: true,
            className: 'device-video--hero hero-video',
          })}
          <img class="hero-poster" src="${content.media.poster.src}" alt="${content.media.poster.alt}">
          <figcaption>${content.media.caption}</figcaption>
        </figure>
        <div class="hero-evidence" aria-label="${content.evidenceLabel}">
          ${content.badges.map((badge) => `<span>${badge.label}</span>`).join('')}
        </div>
      </div>
    </header>
  `;
}

export function caseNav(content) {
  return `
    <nav class="case-nav" aria-label="${content.ariaLabel}">
      <div class="case-nav__progress" aria-hidden="true"><span data-progress-bar></span></div>
      <button class="case-nav__mobile-trigger" type="button" data-nav-toggle aria-expanded="false" aria-controls="case-nav-list">
        <span data-nav-count>01 / ${String(content.items.length).padStart(2, '0')}</span>
        <strong data-nav-current>${content.items[0].label}</strong>
        <i aria-hidden="true">⌄</i>
      </button>
      <div class="case-nav__list" id="case-nav-list">
        ${content.items.map((item, index) => `
          <a href="#${item.id}" data-nav-link="${item.id}" class="${index === 0 ? 'is-active' : ''}">
            <span>${String(index + 1).padStart(2, '0')}</span>${item.label}
          </a>
        `).join('')}
      </div>
    </nav>
  `;
}
