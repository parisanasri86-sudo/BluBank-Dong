function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderText(value) {
  return escapeHtml(value).replaceAll('\n', '<br>');
}

export function sectionHeader(section) {
  return `
    <div class="section-header">
      <p class="eyebrow">${section.eyebrow}</p>
      <h2>${section.title}</h2>
      ${section.lead ? `<p class="section-lead">${section.lead}</p>` : ''}
    </div>
  `;
}

export function placeholder(content) {
  return `
    <div class="content-placeholder" role="note">
      <span>${content.label}</span>
      <strong>${content.title}</strong>
      ${content.body ? `<p>${content.body}</p>` : ''}
    </div>
  `;
}

export function assetSlot(content, className = '') {
  if (content.kind === 'media-set') {
    return mediaSet(content, className);
  }

  if (content.items) {
    return `
      <figure class="asset-slot asset-slot--composition ${className}">
        <div class="asset-composition">
          ${content.items.map((item) => `<img src="${item.src}" alt="${item.alt || ''}">`).join('')}
        </div>
        ${content.caption ? `<figcaption>${content.caption}</figcaption>` : ''}
      </figure>
    `;
  }

  if (content.src) {
    return `
      <figure class="asset-slot ${className}">
        <img src="${content.src}" alt="${content.alt || ''}">
        ${content.caption ? `<figcaption>${content.caption}</figcaption>` : ''}
      </figure>
    `;
  }

  return `
    <div class="asset-slot asset-slot--skeleton ${className}" role="img" aria-label="${content.title}">
      <span>${content.label}</span>
      <strong>${content.title}</strong>
      ${content.body ? `<p>${content.body}</p>` : ''}
    </div>
  `;
}

export function heroMedia(content) {
  return `
    <div class="hero-media" data-media-target="${content.target}">
      ${mediaSet(content.asset, 'media-set--hero')}
    </div>
  `;
}

export function deviceVideo({
  src,
  label = '',
  poster = '',
  autoplay = false,
  loop = false,
  controls = false,
  className = '',
}) {
  const behaviorAttrs = [
    autoplay ? 'autoplay' : '',
    'muted',
    loop ? 'loop' : '',
    'playsinline',
    'preload="metadata"',
    poster ? `poster="${poster}"` : '',
    label ? `aria-label="${label}"` : '',
  ].filter(Boolean).join(' ');

  return `
    <div class="device-video ${className}">
      <div class="device-video__screen">
        <video class="device-video__media" ${behaviorAttrs}>
          <source src="${src}" type="video/mp4">
        </video>
      </div>
      <img class="device-video__frame" src="./assets/figma-exports/iphone-14-frame.png" alt="" aria-hidden="true">
      ${controls ? '<button class="media-set__play" type="button" aria-label="Play video"><span class="media-set__icon" aria-hidden="true">▶</span></button>' : ''}
    </div>
  `;
}

export function mediaSet(content, className = '') {
  const slots = content.slots || [];
  const poster = slots.at(-1)?.src || slots[0]?.src || '';
  const videoSrc = content.video ? `./assets/figma-exports/${content.video}` : '';

  return `
    <figure class="media-set ${className} ${videoSrc ? 'media-set--video' : ''}" data-video-target="${content.video || ''}">
      <div class="media-set__stage">
        ${videoSrc ? `
          ${deviceVideo({
            src: videoSrc,
            label: content.caption || '',
            poster,
            controls: true,
            className: 'device-video--case',
          })}
        ` : ''}
        <div class="media-set__fallback" aria-hidden="${videoSrc ? 'true' : 'false'}">
          ${slots.map((slot, index) => `
            <div class="phone-slot ${slot.role ? `phone-slot--${slot.role}` : ''}" data-asset="${slot.file}" data-node="${slot.node || ''}">
              ${slot.src ? `<img src="${slot.src}" alt="${slot.alt || ''}">` : '<div class="phone-slot__skeleton" aria-hidden="true"></div>'}
              <span class="phone-slot__label">${String(index + 1).padStart(2, '0')}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ${content.caption ? `<figcaption>${content.caption}</figcaption>` : ''}
    </figure>
  `;
}

export function metadata(items) {
  return `
    <dl class="metadata-grid">
      ${items.map((item) => `
        <div class="metadata-item">
          <dt>${item.label}</dt>
          <dd>${item.value}</dd>
        </div>
      `).join('')}
    </dl>
  `;
}

export function projectContext(content) {
  return `
    <div class="project-context">
      <div class="project-context__header">
        <img src="./assets/blubank-logo.png" alt="" aria-hidden="true">
        <div>
          <p class="card-label">${content.kicker}</p>
          <h3>${content.title}</h3>
        </div>
      </div>
      ${metadata(content.items)}
      <p class="project-context__disclosure">${content.disclosure}</p>
    </div>
  `;
}

function relationshipIcon(icon) {
  const icons = {
    bank: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18M5 9v8m4-8v8m6-8v8m4-8v8M3 20h18M12 3 3 7h18Z"/></svg>',
    split: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M8.5 9.5c0-1.4 1.4-2.5 3.5-2.5s3.5 1 3.5 2.5-1.2 2.1-3.5 2.5-3.5 1-3.5 2.5S9.9 17 12 17s3.5-1.1 3.5-2.5"/></svg>',
    groups: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3.5 19c.5-3.2 2.3-5 5.5-5s5 1.8 5.5 5M14 15c3.8-.6 5.8.8 6.5 4"/></svg>',
  };
  return icons[icon] || icons.split;
}

export function productRelationship(content) {
  return `
    <div class="product-relationship" aria-label="${content.ariaLabel}">
      ${content.items.map((item, index) => `
        <div class="product-relationship__node">
          <span class="product-relationship__icon">${relationshipIcon(item.icon)}</span>
          <div>
            <strong>${item.title}</strong>
            <small>${item.caption}</small>
          </div>
        </div>
        ${index < content.items.length - 1 ? '<span class="product-relationship__arrow" aria-hidden="true">→</span>' : ''}
      `).join('')}
    </div>
  `;
}

export function quickScan(content) {
  return `
    <aside class="quick-scan" aria-labelledby="quick-scan-title">
      <div class="quick-scan__intro">
        <p class="card-label">${content.eyebrow}</p>
        <h2 id="quick-scan-title">${content.title}</h2>
        <p>${content.lead}</p>
      </div>
      <div class="quick-scan__grid">
        ${content.items.map((item, index) => `
          <a class="quick-scan__item" href="#${item.href}">
            <span class="quick-scan__marker" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
            <strong>${item.label}</strong>
            <p>${item.body}</p>
          </a>
        `).join('')}
      </div>
    </aside>
  `;
}

export function cardGrid(items, className = '') {
  return `
    <div class="card-grid ${className}">
      ${items.map((item) => `
        <article class="story-card ${item.tone ? `story-card--${item.tone}` : ''}">
          ${item.kicker ? `<p class="card-label">${item.kicker}</p>` : ''}
          <h3>${item.title}</h3>
          ${item.body ? `<p>${item.body}</p>` : ''}
          ${item.evidence ? `<p class="evidence-line"><span>${item.evidenceLabel}</span>${item.evidence}</p>` : ''}
          ${item.implication ? `<p class="implication-line"><span>${item.implicationLabel}</span>${item.implication}</p>` : ''}
        </article>
      `).join('')}
    </div>
  `;
}

export function reflectionGrid(content) {
  return `
    <div class="reflection-grid">
      <section class="reflection-column reflection-column--learned">
        <p class="card-label">${content.learnedLabel}</p>
        <div class="reflection-stack">
          ${content.learned.map((item, index) => `
            <article class="story-card story-card--reflection">
              <span class="reflection-number">${String(index + 1).padStart(2, '0')}</span>
              <div><h3>${item.title}</h3><p>${item.body}</p></div>
            </article>
          `).join('')}
        </div>
      </section>
      <section class="reflection-column reflection-column--next">
        <p class="card-label">${content.nextLabel}</p>
        <div class="reflection-roadmap">
          ${content.next.map((item, index) => `
            <article>
              <span>${String(index + 1).padStart(2, '0')}</span>
              <div><h3>${item.title}</h3><p>${item.body}</p></div>
            </article>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

export function evidenceList(items) {
  return `
    <div class="evidence-list">
      ${items.map((item, index) => `
        <article class="evidence-item">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

export function problemCausalFlow(content) {
  const icons = {
    product: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="11" r="3"/><circle cx="12" cy="3.5" r="1.8"/><circle cx="4.5" cy="18" r="1.8"/><circle cx="19.5" cy="18" r="1.8"/><path d="M12 5.3V8M9.7 13l-3.8 3.5M14.3 13l3.8 3.5"/></svg>',
    handoff: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="7" height="16" rx="2"/><circle cx="17" cy="7" r="2.5"/><path d="M12.5 20c.4-4 1.8-6 4.5-6s4.1 2 4.5 6M8 12.5h7m0 0-2.2-2.2m2.2 2.2-2.2 2.2"/></svg>',
    impact: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-3.4 7-10V5l-7-2-7 2v6c0 6.6 7 10 7 10Z"/><path d="M9 12h6M12 9v6"/></svg>',
  };

  return `
    <div class="workflow-handoff">
      <div class="workflow-handoff__heading">
        <span>${content.kicker}</span>
        <h3>${content.title}</h3>
      </div>
      <div class="workflow-handoff__flow" aria-label="${content.ariaLabel}">
        ${content.stages.map((stage, index) => `
          <article class="workflow-stage workflow-stage--${stage.tone}">
            <div class="workflow-stage__header">
              <span class="workflow-stage__icon">${icons[stage.icon]}</span>
              <div>
                <small>${stage.eyebrow}</small>
                <h4>${stage.title}</h4>
              </div>
            </div>
            <ul>
              ${stage.items.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </article>
          ${index < content.stages.length - 1 ? '<span class="workflow-handoff__arrow" aria-hidden="true">→</span>' : ''}
        `).join('')}
      </div>
    </div>
  `;
}

export function journeySteps(content) {
  return `
    <div class="journey-panel">
      ${assetSlot(content.asset, 'asset-slot--current')}
      <div class="journey-steps" aria-label="${content.label}">
        ${content.steps.map((step, index) => `
          <article>
            <span>${String(index + 1).padStart(2, '0')}</span>
            <h3>${step.title}</h3>
            <p>${step.body}</p>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

export function currentDongExperience(content) {
  return `
    <div class="current-dong-visual">
      <div class="current-screens">
        ${content.screens.map((screen) => `
          <figure class="current-screen">
            <div class="current-phone-frame">
              <img src="${screen.src}" alt="${screen.alt}">
            </div>
            <figcaption>${screen.caption}</figcaption>
          </figure>
        `).join('')}
      </div>
      <div class="current-flow" aria-label="${content.label}">
        ${content.steps.map((step, index) => `
          <article class="current-flow-step">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>${step.title}</h3>
              <p>${step.body}</p>
            </div>
          </article>
        `).join('')}
        <aside class="current-gap">
          <strong>${content.gap.label}</strong>
          <p>${content.gap.body}</p>
        </aside>
      </div>
      ${problemCausalFlow(content.summary)}
    </div>
  `;
}

export function currentGapProposed(items) {
  return `
    <div class="cgp-grid">
      ${items.map((item, index) => `
        <article class="cgp-card">
          <span class="flow-number">${String(index + 1).padStart(2, '0')}</span>
          <h3>${item.title}</h3>
          <div class="cgp-track">
            <div><p class="card-label">${item.currentLabel}</p><p>${item.current}</p></div>
            <div><p class="card-label">${item.gapLabel}</p><p>${item.gap}</p></div>
            <div><p class="card-label">${item.proposedLabel}</p><p>${item.proposed}</p></div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

export function socialFriction(content) {
  const arrow = '<i class="friction-arrow" aria-hidden="true">→</i>';

  return `
    <div class="social-friction">
      <div class="friction-flow">
        ${content.steps.map((step, index) => `
          <article>
            <span>${String(index + 1).padStart(2, '0')}</span>
            ${step.image ? `<div class="friction-illustration"><img src="${step.image.src}" alt="${step.image.alt}"></div>` : ''}
            <h3>${step.title}</h3>
            <p>${step.body}</p>
          </article>
        `).join(arrow)}
      </div>
      <p class="friction-source">${content.source}</p>
    </div>
  `;
}

export function personaIntro(content) {
  return `
    <div class="persona-intro">
      ${content.items.map((persona) => `
        <article class="persona-card-compact">
          <p class="persona-type">${persona.index} · ${persona.type}</p>
          <div class="persona-profile">
            <div class="persona-avatar"><img src="${persona.image.src}" alt="${persona.image.alt}"></div>
            <div class="persona-identity">
              <h3>${persona.name} <span>(${persona.role})</span></h3>
              <p>${persona.behavior}</p>
            </div>
          </div>
          <blockquote>${persona.quote}</blockquote>
          <div class="persona-goal">
            <p>${content.goalLabel}</p>
            <strong>${persona.goal}</strong>
            <span>${persona.goalDetail}</span>
          </div>
          <div class="persona-pains">
            <p>${content.painLabel}</p>
            <ol>
              ${persona.pains.map((pain) => `<li>${pain}</li>`).join('')}
            </ol>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

export function emotionalJourney(content) {
  return `
    <div class="emotional-journey emotional-journey--legacy">
      <div class="journey-personas">
        ${content.personas.map((persona) => `
          <div class="journey-persona">
            <img src="${persona.image.src}" alt="${persona.image.alt}">
            <div><strong>${persona.name}</strong><span>${persona.role}</span></div>
          </div>
        `).join('')}
      </div>
      <div class="legacy-journey-map">
        ${content.columns.map((column, index) => `
          <article>
            <h3>${column.title}</h3>
            <p><strong>${content.saraLabel}</strong>${column.sara}</p>
            <p><strong>${content.nickLabel}</strong>${column.nick}</p>
            <div class="legacy-pain">
              ${column.pains.map((pain) => `<span>${pain}</span>`).join('')}
            </div>
          </article>
        `).join('')}
      </div>
      <figure class="emotional-arc" role="img" aria-label="${content.arcLabel}">
        <figcaption>${content.caption}</figcaption>
        <div class="legacy-arc-stage">
          <svg viewBox="0 0 100 320" preserveAspectRatio="none" aria-hidden="true">
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#7EB3F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12.5 120 C 25 120 25 200 37.5 200"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#E05A7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M37.5 200 C 50 200 50 160 62.5 160"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#7EB3F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M62.5 160 C 75 160 75 40 81.5 40"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 5" opacity="0.45" d="M12.5 52 C 25 52 25 80 37.5 80"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#E05A7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M37.5 80 C 50 80 50 92 62.5 92"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M62.5 92 C 75 92 75 40 88.7 40"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#7EB3F5" stroke-width="2" stroke-linecap="round" d="M0 120 L12.5 120"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#7EB3F5" stroke-width="2" stroke-linecap="round" d="M81.5 40 L100 40"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" d="M0 52 L12.5 52"></path>
            <path vector-effect="non-scaling-stroke" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" d="M88.7 40 L100 40"></path>
        </svg>
          <span class="legacy-opportunity">${content.opportunityLabel}</span>
          <span class="legacy-opportunity-line" aria-hidden="true"></span>
          ${content.points.map((point) => `
            <div class="legacy-arc-point legacy-arc-point--${point.tone} ${point.opportunity ? 'is-opportunity' : ''}" style="--x:${point.x}%;--y:${point.y}px">
              <img src="${point.image.src}" alt="${point.image.alt}">
            </div>
          `).join('')}
          ${content.tooltips.map((tooltip) => `
            <div class="legacy-arc-tooltip" style="--x:${tooltip.x}%;--y:${tooltip.y}px">
              ${tooltip.rows.map((row) => `
                <span class="legacy-arc-row ${row.muted ? 'is-muted' : ''}">
                  <strong class="legacy-arc-name legacy-arc-name--${row.tone}">${row.name}</strong>
                  <em>${row.state}</em>
                </span>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div class="legacy-arc-legend" aria-hidden="true">
          ${content.legend.map((item) => `<span class="legacy-arc-legend__item legacy-arc-legend__item--${item.tone}">${item.label}</span>`).join('')}
        </div>
      </figure>
    </div>
  `;
}

export function synthesisVisual(content) {
  return `
    <div class="synthesis-visual">
      <div class="venn-summary" aria-label="${content.vennLabel}">
        <div class="venn-stage">
          ${content.sources.map((source, index) => `
            <span class="venn-circle venn-circle--${index + 1}">
              <span class="venn-source-value">${source.value}</span>
              <span class="venn-source-label">${source.label}</span>
            </span>
          `).join('')}
          <strong class="venn-core">${content.core}</strong>
        </div>
      </div>
      <div class="convergence-table">
        <div class="convergence-row convergence-row--head">
          ${content.headers.map((header) => `<span>${header}</span>`).join('')}
        </div>
        ${content.rows.map((row, index) => `
          <div class="convergence-row">
            <strong><span>${String(index + 1).padStart(2, '0')}</span>${row.problem}</strong>
            <span>${row.desk}</span>
            <span>${row.interviews}</span>
            <span>${row.heuristic}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function heuristicVisual(content) {
  return `
    <div class="heuristic-visual">
      <div class="module-heading heuristic-heading">
        <p class="card-label">${content.eyebrow}</p>
        <h3>${content.title}</h3>
        <p>${content.lead}</p>
      </div>
      <div class="heuristic-stats">
        ${content.stats.map((stat) => `<article><strong>${stat.value}</strong><span>${stat.label}</span></article>`).join('')}
      </div>
      <div class="chart-panel chart-panel--primary heuristic-priority">
        <div class="chart-heading">
          <h3>${content.chartTitle}</h3>
          <span>${content.chartCaption}</span>
        </div>
        <p>${content.chartNote}</p>
        ${content.bars.map((bar) => `
          <div class="chart-bar">
            <span>${bar.label}</span>
            <div class="chart-track" style="--value:${bar.value}%"><i class="tone-${bar.tone}"></i></div>
            <strong>${bar.score}</strong>
          </div>
        `).join('')}
      </div>
      <div class="chart-panel chart-panel--secondary heuristic-pass-rate">
        <div class="chart-heading">
          <h3>${content.passRate.title}</h3>
          <span>${content.passRate.caption}</span>
        </div>
        ${content.passRate.items.map((item) => `
          <div class="chart-bar">
            <span>${item.label}</span>
            <div class="chart-track" style="--value:${item.value}%"><i class="tone-${item.tone}"></i></div>
            <strong>${item.rate}</strong>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function reviewEvidence(content) {
  return `
    <div class="research-module review-evidence">
      <div class="module-heading">
        <p class="card-label">${content.kicker}</p>
        <h3>${content.title}</h3>
        <p>${content.lead}</p>
      </div>
      <div class="review-grid">
        ${content.items.map((item) => `
          <article>
            <span class="severity-pill severity-pill--${item.severityTone}">${item.severity}</span>
            <h4>${item.theme}</h4>
            <p><strong>${content.patternLabel}</strong>${item.pattern}</p>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

export function interviewEvidence(content) {
  return `
    <div class="research-module interview-evidence">
      <div class="module-heading">
        <p class="card-label">${content.kicker}</p>
        <h3>${content.title}</h3>
        <p>${content.lead}</p>
      </div>
      <div class="interview-grid">
        ${content.items.map((item) => `
          <article>
            <h4>${item.title}</h4>
            <p>${item.insight}</p>
            <div class="quote-evidence">
              <div class="quote-pair">
                ${item.quotes.map((quote) => `
                  <blockquote>
                    <img class="quote-avatar" src="./assets/users/user-${quote.avatar}.png" alt="${quote.source}">
                    <p>“${quote.text}”</p>
                  </blockquote>
                `).join('')}
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

export function competitiveAnalysis(content) {
  const logoMap = {
    Splitwise: 'logo-splitwise.png',
    Tricount: 'logo-tricount.png',
    Monzo: 'logo-monzo.png',
    Revolut: 'logo-revolut.png',
    Cino: 'logo-cino.png',
  };

  return `
    <div class="research-module competitive-analysis">
      <div class="module-heading">
        <p class="card-label">${content.kicker}</p>
        <h3>${content.title}</h3>
        <p>${content.lead}</p>
      </div>
      <div class="competitive-grid">
        ${content.items.map((item) => `
          <article>
            <h4>${item.title}</h4>
            <p>${item.observation}</p>
            <p class="implication-line"><span>${content.gapLabel}</span>${item.gap}</p>
            <div class="product-chip-row">
              ${item.products.map((product) => `
                <span class="product-chip">
                  ${logoMap[product] ? `<img src="./assets/figma-exports/${logoMap[product]}" alt="" onerror="this.remove()">` : ''}
                  <span>${product}</span>
                </span>
              `).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

export function impactEffortMatrix(content) {
  if (content.asset) {
    return `
      <div class="impact-effort impact-effort--asset">
        ${assetSlot(content.asset, 'asset-slot--matrix')}
        <div class="matrix-copy">
          <p class="card-label">${content.kicker}</p>
          <h3>${content.title}</h3>
          <p>${content.body}</p>
          <ul>${content.focus.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
      </div>
    `;
  }

  return `
    <div class="impact-effort">
      <div class="matrix">
        <span class="axis axis-y">${content.impactLabel}</span>
        <span class="axis axis-x">${content.effortLabel}</span>
        ${content.items.map((item) => `
          <article class="matrix-item matrix-item--${item.tone}" style="--x:${item.x}%;--y:${item.y}%">
            <span>${item.label}</span>
          </article>
        `).join('')}
      </div>
      <div class="matrix-copy">
        <p class="card-label">${content.kicker}</p>
        <h3>${content.title}</h3>
        <p>${content.body}</p>
        <ul>${content.focus.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
    </div>
  `;
}

export function methodStrip(items) {
  return `
    <div class="method-strip">
      ${items.map((item, index) => `
        <article class="method-item">
          <span class="method-number">${String(index + 1).padStart(2, '0')}</span>
          <div>
            <p class="card-label">${item.kicker}</p>
            <h3>${item.title}</h3>
            <p>${item.body}</p>
            <dl>
              <div><dt>${item.evidenceLabel}</dt><dd>${item.evidence}</dd></div>
              <div><dt>${item.implicationLabel}</dt><dd>${item.implication}</dd></div>
            </dl>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

export function researchSnapshot(content) {
  return `
    <div class="research-snapshot" aria-label="${content.ariaLabel || ''}">
      ${content.items.map((item) => `
        <article>
          <strong>${item.value}</strong>
          <span>${item.label}</span>
        </article>
      `).join('')}
    </div>
  `;
}

const insightIcons = {
  proof: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v18l-2-1.4L12 21l-3-1.4L7 21V3Z"/><path d="M10 8h4M10 12h2"/><path d="m13.5 15 1.2 1.2 2.3-2.5"/></svg>',
  flexibility: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h9a4 4 0 0 1 4 4v8"/><path d="m15 15 3 3 3-3"/><path d="M5 18h5M5 12h8"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
  reminder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h10l-1.4-2.1V10a3.6 3.6 0 0 0-7.2 0v4.9L7 17Z"/><path d="M10.5 20h3"/><path d="M4 8H2m20 0h-2"/><circle cx="4" cy="17" r="2"/><circle cx="20" cy="17" r="2"/></svg>',
  participation: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20v-2a5 5 0 0 1 10 0v2M14 20v-1.5a4 4 0 0 1 6.8-2.8"/><path d="m19 19 2 2 2-3"/></svg>',
};

export function insightEditorial(content) {
  return `
    <div class="insight-principles">
      ${content.items.map((item, index) => `
        <article class="insight-principle">
          <div class="insight-principle__top">
            <span class="insight-principle__icon">${insightIcons[item.icon] || ''}</span>
            <span class="insight-number">${String(index + 1).padStart(2, '0')}</span>
          </div>
          <p class="insight-evidence"><span>${content.evidenceLabel}</span>${item.evidence}</p>
          <h3>${item.title}</h3>
          <p class="insight-statement">${item.insight}</p>
          <div class="insight-principle__rule">
            <p><small>${content.principleLabel}</small>${item.principle}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

export function artifactGrid(items) {
  return `
    <div class="artifact-grid">
      ${items.map((item, index) => `
        <article class="artifact-card ${index === 0 ? 'is-dominant' : ''}">
          ${assetSlot(item.asset)}
          <div>
            <p class="card-label">${item.kicker}</p>
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

export function priorityHierarchy(items, label) {
  return `
    <div class="priority-summary">
      <p class="card-label">${label}</p>
      <div class="priority-summary__items">
      ${items.map((item, index) => `
        <span><i>${String(index + 1).padStart(2, '0')}</i>${item}</span>
      `).join('')}
      </div>
    </div>
  `;
}

export function decisionCallout(content) {
  return `
    <aside class="decision-callout">
      <p class="card-label">${content.kicker}</p>
      <h3>${content.title}</h3>
      <p>${content.body}</p>
    </aside>
  `;
}

export function solutionPath(items, aside) {
  return `
    <div class="solution-path">
      <div class="solution-chain">
        ${items.map((item, index) => `
          <article class="solution-step">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>${item.title}</h3>
              <p>${item.body}</p>
            </div>
          </article>
        `).join('')}
      </div>
      <aside class="solution-aside">
        <p class="card-label">${aside.kicker}</p>
        <h3>${aside.title}</h3>
        <p>${aside.body}</p>
      </aside>
    </div>
  `;
}

export function flowExploration(items) {
  return `
    <div class="flow-explorations">
      ${items.map((item, index) => `
        <article class="flow-exploration">
          <div class="flow-copy">
            <p class="card-label">FLOW ${String(index + 1).padStart(2, '0')}</p>
            <h3>${item.title}</h3>
            <p>${item.hypothesis}</p>
          </div>
          ${assetSlot(item.asset, 'asset-slot--strip')}
        </article>
      `).join('')}
    </div>
  `;
}

export function feedbackRows(items) {
  return `
    <div class="feedback-rows">
      ${items.map((item, index) => `
        <article class="feedback-row">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <div><p class="card-label">${item.feedbackLabel}</p><p>${item.feedback}</p></div>
          <div><p class="card-label">${item.learnedLabel}</p><p>${item.learned}</p></div>
          <div><p class="card-label">${item.responseLabel}</p><p>${item.response}</p></div>
        </article>
      `).join('')}
    </div>
  `;
}

export function iterationComparisons(content) {
  const items = Array.isArray(content) ? content : content.items;
  const beforeLabel = content.beforeLabel || 'Before';
  const afterLabel = content.afterLabel || 'After';

  return `
    <div class="iteration-grid">
      ${items.map((item, index) => `
        <article class="iteration-card">
          <div class="iteration-heading">
            <p class="card-label">ITERATION ${String(index + 1).padStart(2, '0')}</p>
            <h3>${item.title}</h3>
          </div>
          <div class="iteration-comparison">
            <div class="iteration-screen">
              <p class="card-label">${beforeLabel}</p>
              ${assetSlot(item.v1, 'asset-slot--compact')}
            </div>
            <div class="iteration-summary">
              <i aria-hidden="true">→</i>
              <dl>
                <div><dt>${item.issueLabel}</dt><dd>${item.issue}</dd></div>
                <div><dt>${item.changeLabel}</dt><dd>${item.change}</dd></div>
              </dl>
            </div>
            <div class="iteration-screen">
              <p class="card-label">${afterLabel}</p>
              ${assetSlot(item.v2, 'asset-slot--compact')}
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

export function finalShowcase(content) {
  const items = content.items;
  return `
    <div class="showcase-experience">
      <div class="showcase-tabs" role="tablist" aria-label="${content.ariaLabel}">
        ${items.map((item, index) => `
          <button
            id="flow-tab-${index}"
            type="button"
            role="tab"
            data-flow-tab="${index}"
            aria-controls="flow-panel-${index}"
            aria-selected="${index === 0}"
            tabindex="${index === 0 ? '0' : '-1'}"
          >
            <span>${String(index + 1).padStart(2, '0')}</span>
            <strong>${item.shortTitle || item.title}</strong>
          </button>
        `).join('')}
      </div>
      <div class="showcase-panels">
      ${items.map((item, index) => `
        <article
          id="flow-panel-${index}"
          class="showcase-panel"
          role="tabpanel"
          data-flow-panel="${index}"
          aria-labelledby="flow-tab-${index}"
          ${index === 0 ? '' : 'hidden'}
        >
          ${assetSlot(item.asset, 'asset-slot--showcase')}
          <div class="showcase-copy">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <h3>${item.title}</h3>
            <p>${item.outcome}</p>
            ${item.annotations?.length ? `
              <ul class="showcase-proof">
                ${item.annotations.map((annotation) => `<li>${annotation}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </article>
      `).join('')}
      </div>
    </div>
  `;
}

export function designDecision(content) {
  return `
    <div class="decision-layout">
      <div class="decision-coverflow" data-coverflow tabindex="0" role="region" aria-roledescription="carousel" aria-label="${content.carouselLabel}">
        <div class="decision-coverflow__stage">
          ${content.slides.map((slide, index) => `
            <figure class="decision-coverflow__slide" data-coverflow-slide="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}">
              <img src="${slide.src}" alt="${slide.alt}" draggable="false">
            </figure>
          `).join('')}
        </div>
        <div class="decision-coverflow__dots" aria-label="${content.carouselLabel}">
          ${content.slides.map((slide, index) => `
            <button type="button" data-coverflow-dot="${index}" aria-label="${slide.alt}" aria-current="${index === 0 ? 'true' : 'false'}"></button>
          `).join('')}
        </div>
      </div>
      <div class="decision-copy">
        <p class="card-label">${content.kicker}</p>
        <h3>${content.title}</h3>
        <p>${content.body}</p>
        <ol>
          ${content.points.map((point) => `<li>${point}</li>`).join('')}
        </ol>
      </div>
    </div>
  `;
}

export function closingComparison(content) {
  const pairs = content.before.map((before, index) => ({ before, after: content.after[index] }));
  return `
    <div class="closing-comparison">
      <div class="comparison-head"><span>${content.beforeLabel}</span><span></span><span>${content.afterLabel}</span></div>
      ${pairs.map((pair) => `
        <article class="comparison-row">
          <strong>${pair.before}</strong>
          <span aria-hidden="true">${content.arrow}</span>
          <strong>${pair.after}</strong>
        </article>
      `).join('')}
    </div>
  `;
}

export function measurementList(content) {
  return `
    <div class="measurement-list">
      ${content.items.map((item, index) => `
        <article>
          <span class="measurement-number">${String(index + 1).padStart(2, '0')}</span>
          <h3>${item.title}</h3>
          <dl>
            <div><dt>${content.signalLabel}</dt><dd>${item.signal}</dd></div>
            <div><dt>${content.methodLabel}</dt><dd>${item.method}</dd></div>
          </dl>
        </article>
      `).join('')}
    </div>
  `;
}

export function flowCards(items) {
  return `
    <div class="flow-grid">
      ${items.map((item, index) => `
        <article class="flow-card">
          <span class="flow-number">${String(index + 1).padStart(2, '0')}</span>
          <h3>${item.title}</h3>
          <dl>
            <div><dt>${item.problemLabel}</dt><dd>${item.problem}</dd></div>
            <div><dt>${item.actionLabel}</dt><dd>${item.action}</dd></div>
            <div><dt>${item.responseLabel}</dt><dd>${item.response}</dd></div>
            <div><dt>${item.decisionLabel}</dt><dd>${item.decision}</dd></div>
          </dl>
        </article>
      `).join('')}
    </div>
  `;
}

export function quoteBlock(content) {
  return `
    <figure class="quote-block">
      <blockquote>${renderText(content.quote)}</blockquote>
      ${content.caption ? `<figcaption>${content.caption}</figcaption>` : ''}
    </figure>
  `;
}
