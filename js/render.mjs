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

export function tipCardHtml(tip) {
  return `
    <a class="tip-card" href="#/tip/${tip.id}">
      <img class="tip-card-thumb" src="${tip.thumbnail}" alt="${tip.title}">
      <div class="tip-card-body">
        <h3>${tip.title}</h3>
        <p>${tip.summary}</p>
      </div>
    </a>
  `;
}

export function renderTipGrid(el, tips) {
  el.innerHTML = `<div class="tip-grid">${tips.map(tipCardHtml).join('')}</div>`;
}

export function renderTipDetail(el, tip, allTips) {
  const related = allTips.filter((t) => t.category === tip.category && t.id !== tip.id).slice(0, 3);
  // 스펙 7절: ad-in-article은 2~3번째 문단 "직후"에 오고, 그 뒤에 나머지 본문이 이어진 다음 ad-bottom이 온다.
  // 더미 데이터는 문단이 3개뿐이므로 2문단 후에 자르고, 남은 1문단을 "나머지 본문"으로 둔다.
  const beforeAd = tip.body.slice(0, 2).map((block) => `<p>${block.text}</p>`).join('');
  const afterAd = tip.body.slice(2).map((block) => `<p>${block.text}</p>`).join('');

  el.innerHTML = `
    <article class="tip-detail">
      <div class="tip-detail-main">
        <h2>${tip.title}</h2>
        <img class="tip-detail-hero" src="${tip.thumbnail}" alt="${tip.title}">
        ${beforeAd}
        <div class="ad-slot" id="ad-in-article">광고 영역 (in-article)</div>
        ${afterAd}
        <div class="ad-slot" id="ad-bottom">광고 영역 (bottom)</div>
        <section class="related-tips">
          <h3>관련 팁</h3>
          <div class="tip-grid">${related.map(tipCardHtml).join('')}</div>
        </section>
      </div>
      <aside class="tip-detail-aside">
        <div class="ad-slot ad-slot-sticky" id="ad-sidebar-sticky">광고 영역 (sidebar sticky)</div>
      </aside>
    </article>
  `;
}

export function renderEmptyState(el, keyword, onReset) {
  el.innerHTML = `
    <div class="empty-state">
      <p>"${keyword}"에 대한 조건에 맞는 팁이 없어요</p>
      <button class="btn" id="reset-search-btn" type="button">검색어 초기화</button>
    </div>
  `;
  document.getElementById('reset-search-btn').addEventListener('click', onReset);
}
