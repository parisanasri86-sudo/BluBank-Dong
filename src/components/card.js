export function sampleCard(content) {
  return `
    <article class="sample-card">
      <p class="card-label">${content.label}</p>
      <h3>${content.title}</h3>
      <p>${content.body}</p>
    </article>
  `;
}
