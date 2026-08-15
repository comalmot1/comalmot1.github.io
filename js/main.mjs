import { categories, tips } from './data.mjs';
import { renderSidebar, renderTipGrid } from './render.mjs';
import { onRouteChange, startRouter } from './router.mjs';

const sidebarEl = document.getElementById('sidebar');
const contentEl = document.getElementById('content-area');

function findCategory(id) {
  return categories.find((c) => c.id === id);
}
function findTip(id) {
  return tips.find((t) => t.id === id);
}

onRouteChange(/^\/$/, () => {
  renderSidebar(sidebarEl, categories, null);
  renderTipGrid(contentEl, tips);
});

onRouteChange(/^\/category\/(?<id>[^/]+)$/, ({ id }) => {
  const category = findCategory(id);
  if (!category) {
    location.hash = '#/';
    return;
  }
  renderSidebar(sidebarEl, categories, id);
  renderTipGrid(contentEl, tips.filter((t) => t.category === id));
});

onRouteChange(/^\/tip\/(?<id>[^/]+)$/, ({ id }) => {
  const tip = findTip(id);
  if (!tip) {
    location.hash = '#/';
    return;
  }
  renderSidebar(sidebarEl, categories, tip.category);
  contentEl.innerHTML = `<p>"${tip.title}" 상세 페이지 준비 중...</p>`;
});

startRouter();
