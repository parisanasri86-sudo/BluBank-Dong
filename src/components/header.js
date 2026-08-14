export function header(content) {
  return `
    <header class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">${content.eyebrow}</p>
        <img class="hero-logo" src="./assets/blubank-logo.png" alt="BluBank logo">
        <p class="hero-kicker">${content.productName}</p>
        <h1 id="page-title">${content.title}</h1>
        <p class="hero-lead">${content.subtitle}</p>
        <p class="hero-meta">${content.meta}</p>
        <a class="hero-scroll-cue" href="#research" aria-label="${content.scrollLabel}">
          <span>${content.scrollLabel}</span>
          <i aria-hidden="true">↓</i>
        </a>
      </div>
      <div class="hero-visual">
        <figure class="hero-product-frame">
          <video class="hero-video" autoplay muted loop playsinline preload="metadata" poster="${content.media.poster.src}" aria-label="${content.media.alt}">
            <source src="${content.media.video}" type="video/mp4">
          </video>
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
