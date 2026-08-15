const ICONS = {
  bolt: '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function renderSidebar(el, categories, activeCategoryId) {
  el.innerHTML = `
    <div class="sidebar-logo"><strong>for 컴알못</strong></div>
    <nav class="sidebar-nav">
      <a href="#/" class="sidebar-link ${!activeCategoryId ? 'active' : ''}">전체</a>
      ${categories.map((c) => `
        <a href="#/category/${esc(c.id)}" class="sidebar-link ${c.id === activeCategoryId ? 'active' : ''}">
          ${ICONS[c.icon] || ''}<span>${esc(c.name)}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

export function tipCardHtml(tip) {
  return `
    <a class="tip-card" href="#/tip/${tip.id}">
      <img class="tip-card-thumb" src="${tip.thumbnail}" alt="${esc(tip.title)}">
      <div class="tip-card-body">
        <h3>${esc(tip.title)}</h3>
        <p>${esc(tip.summary)}</p>
      </div>
    </a>
  `;
}

export function renderTipGrid(el, tips) {
  el.innerHTML = `<div class="tip-grid">${tips.map(tipCardHtml).join('')}</div>`;
}

function renderBlock(block) {
  if (block.type === 'steps') {
    return `<ol class="tip-steps">${block.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ol>`;
  }
  if (block.type === 'image') {
    return `<figure class="tip-figure"><img src="${block.src}" alt="${esc(block.caption || '')}"><figcaption>${esc(block.caption || '')}</figcaption></figure>`;
  }
  return `<p>${esc(block.text)}</p>`;
}

export function renderTipDetail(el, tip, allTips) {
  const related = allTips.filter((t) => t.category === tip.category && t.id !== tip.id).slice(0, 3);
  // 스펙 7절: ad-in-article은 본문 초반부 직후, ad-bottom은 본문 끝에 온다.
  // 본문 블록 수가 콘텐츠마다 다르므로(문단/단계목록/이미지 혼합), 전체의 약 40% 지점에서
  // 블록 단위로 나눈다 — 블록 중간을 자르지 않고, 앞뒤 모두 최소 1개 블록은 남도록 보장한다.
  const splitIndex = Math.max(1, Math.min(tip.body.length - 1, Math.ceil(tip.body.length * 0.4)));
  const beforeAd = tip.body.slice(0, splitIndex).map(renderBlock).join('');
  const afterAd = tip.body.slice(splitIndex).map(renderBlock).join('');

  el.innerHTML = `
    <article class="tip-detail">
      <div class="tip-detail-main">
        <h2>${esc(tip.title)}</h2>
        <img class="tip-detail-hero" src="${tip.thumbnail}" alt="${esc(tip.title)}">
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
      <p>"${esc(keyword)}"에 대한 조건에 맞는 팁이 없어요</p>
      <button class="btn" id="reset-search-btn" type="button">검색어 초기화</button>
    </div>
  `;
  document.getElementById('reset-search-btn').addEventListener('click', onReset);
}
