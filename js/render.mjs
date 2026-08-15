const ICONS = {
  bolt: '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
};

export function renderSidebar(el, categories, activeCategoryId) {
  el.innerHTML = `
    <div class="sidebar-logo"><strong>for 컴알못</strong></div>
    <nav class="sidebar-nav">
      <a href="#/" class="sidebar-link ${!activeCategoryId ? 'active' : ''}">전체</a>
      ${categories.map((c) => `
        <a href="#/category/${c.id}" class="sidebar-link ${c.id === activeCategoryId ? 'active' : ''}">
          ${ICONS[c.icon] || ''}<span>${c.name}</span>
        </a>
      `).join('')}
    </nav>
  `;
}
