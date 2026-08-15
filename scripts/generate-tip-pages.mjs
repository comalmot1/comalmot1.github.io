// 개별 팁마다 실제 정적 HTML 페이지(/tip/<id>/index.html)를 생성한다.
//
// 왜 필요한가: 사이트 본체는 해시 라우팅(#/tip/:id) SPA라서, 검색엔진은
// #/tip/gamer-tips-1 과 #/tip/gamer-tips-2 를 전부 같은 페이지(/)로 취급하고
// 절대 개별 색인하지 않는다. 그래서 팁마다 진짜 URL·title·설명을 가진
// 별도 HTML 파일을 미리 만들어서, 검색엔진과 공유 링크가 이 정적 페이지로
// 직접 들어올 수 있게 한다. 사이트 안에서 검색·정렬하며 둘러보는 실제
// 사용자 경험은 기존 SPA(index.html) 그대로 유지한다 — 이 페이지들은
// SPA를 대체하는 게 아니라 "검색엔진·공유용 진입점"을 추가하는 것이다.
//
// data.mjs를 수정한 뒤에는 이 스크립트를 다시 실행해야 한다:
//   node scripts/generate-tip-pages.mjs
//
// 배포 도메인이 정해지면 아래 BASE_URL을 실제 GitHub Pages 주소로 바꾸고
// 다시 실행할 것 (sitemap.xml의 URL이 이 값을 기준으로 만들어진다).
const BASE_URL = 'https://REPLACE-WITH-YOUR-GITHUB-PAGES-URL';

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { categories, tips } from '../js/data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// render.mjs의 renderBlock/renderTipDetail과 같은 로직을 정적 HTML용으로
// 다시 구현한 것 — render.mjs는 브라우저의 el.innerHTML에 직접 쓰는 함수라
// Node에서 그대로 재사용할 수 없어서, 문자열만 반환하도록 따로 둔다.
// render.mjs의 블록 렌더링 방식을 바꾸면 여기도 같이 맞춰야 한다.
function renderBlock(block) {
  if (block.type === 'steps') {
    return `<ol class="tip-steps">${block.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ol>`;
  }
  if (block.type === 'image') {
    // block.src is either a data: URI (generated placeholder, used as-is) or a
    // relative path like images/tips/foo.png (needs ../../ since pages live 2 levels deep).
    const src = block.src.startsWith('data:') ? block.src : `../../${block.src}`;
    return `<figure class="tip-figure"><img src="${src}" alt="${esc(block.caption || '')}"><figcaption>${esc(block.caption || '')}</figcaption></figure>`;
  }
  if (block.type === 'code') {
    return `<pre class="tip-code">${esc(block.text)}</pre>`;
  }
  return `<p>${esc(block.text)}</p>`;
}

function relatedCardHtml(tip) {
  return `
    <a class="tip-card" href="../${tip.id}/">
      <img class="tip-card-thumb" src="${tip.thumbnail}" alt="${esc(tip.title)}">
      <div class="tip-card-body">
        <h3>${esc(tip.title)}</h3>
        <p>${esc(tip.summary)}</p>
      </div>
    </a>
  `;
}

function sidebarHtml(activeCategoryId) {
  const ICON_BOLT = '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>';
  return `
    <div class="sidebar-logo"><strong>for 컴알못</strong></div>
    <nav class="sidebar-nav">
      <a href="../../#/" class="sidebar-link">전체</a>
      ${categories.map((c) => `
        <a href="../../#/category/${esc(c.id)}" class="sidebar-link ${c.id === activeCategoryId ? 'active' : ''}">
          ${ICON_BOLT}<span>${esc(c.name)}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

function pageHtml(tip) {
  const related = tips.filter((t) => t.category === tip.category && t.id !== tip.id).slice(0, 3);
  const splitIndex = Math.max(1, Math.min(tip.body.length - 1, Math.ceil(tip.body.length * 0.4)));
  const beforeAd = tip.body.slice(0, splitIndex).map(renderBlock).join('');
  const afterAd = tip.body.slice(splitIndex).map(renderBlock).join('');
  const category = categories.find((c) => c.id === tip.category);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(tip.title)} — for 컴알못</title>
  <meta name="description" content="${esc(tip.summary)}">
  <link rel="canonical" href="${BASE_URL}/tip/${tip.id}/">
  <meta property="og:title" content="${esc(tip.title)}">
  <meta property="og:description" content="${esc(tip.summary)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${BASE_URL}/tip/${tip.id}/">
  <link rel="stylesheet" href="../../css/tokens.css">
  <link rel="stylesheet" href="../../css/layout.css">
  <link rel="stylesheet" href="../../css/components.css">
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">${sidebarHtml(tip.category)}</aside>
    <main class="main-content">
      <article class="tip-detail">
        <div class="tip-detail-main">
          <p class="label" style="margin-bottom:8px"><a href="../../#/category/${esc(tip.category)}">${esc(category ? category.name : '')}</a></p>
          <h2>${esc(tip.title)}</h2>
          <img class="tip-detail-hero" src="${tip.thumbnail}" alt="${esc(tip.title)}">
          ${beforeAd}
          <div class="ad-slot" id="ad-in-article">광고 영역 (in-article)</div>
          ${afterAd}
          <div class="ad-slot" id="ad-bottom">광고 영역 (bottom)</div>
          <section class="related-tips">
            <h3>관련 팁</h3>
            <div class="tip-grid">${related.map(relatedCardHtml).join('')}</div>
          </section>
          <p style="margin-top:32px"><a href="../../#/">← 전체 팁 목록 보기 (검색·정렬 가능)</a></p>
        </div>
        <aside class="tip-detail-aside">
          <div class="ad-slot ad-slot-sticky" id="ad-sidebar-sticky">광고 영역 (sidebar sticky)</div>
        </aside>
      </article>
    </main>
  </div>
</body>
</html>
`;
}

function sitemapXml() {
  const urls = [BASE_URL + '/', ...tips.map((t) => `${BASE_URL}/tip/${t.id}/`)];
  const entries = urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function robotsTxt() {
  return `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`;
}

for (const tip of tips) {
  const dir = join(ROOT, 'tip', tip.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), pageHtml(tip), 'utf8');
}
writeFileSync(join(ROOT, 'sitemap.xml'), sitemapXml(), 'utf8');
writeFileSync(join(ROOT, 'robots.txt'), robotsTxt(), 'utf8');

console.log(`generated ${tips.length} static tip pages + sitemap.xml + robots.txt`);
if (BASE_URL.includes('REPLACE-WITH')) {
  console.log('⚠ BASE_URL is still a placeholder — update it in this script once the GitHub Pages URL is known, then re-run.');
}
