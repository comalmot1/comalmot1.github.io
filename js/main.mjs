import { categories, tips } from './data.mjs';
import { renderSidebar, renderTipGrid, renderTipDetail, renderEmptyState } from './render.mjs';
import { onRouteChange, startRouter } from './router.mjs';
import { filterAndSortTips } from './search.mjs';

const sidebarEl = document.getElementById('sidebar');
const contentEl = document.getElementById('content-area');
const searchBarEl = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

const searchState = { keyword: '', sort: 'newest' };
let currentCategoryId = null;

function findCategory(id) {
  return categories.find((c) => c.id === id);
}
function findTip(id) {
  return tips.find((t) => t.id === id);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function showGrid(categoryId) {
  currentCategoryId = categoryId;
  searchBarEl.style.display = 'flex';
  const scoped = categoryId ? tips.filter((t) => t.category === categoryId) : tips;
  const result = filterAndSortTips(scoped, searchState.keyword, searchState.sort);
  if (result.length === 0) {
    renderEmptyState(contentEl, searchState.keyword, () => {
      searchInput.value = '';
      searchState.keyword = '';
      showGrid(currentCategoryId);
    });
  } else {
    renderTipGrid(contentEl, result);
  }
}

onRouteChange(/^\/$/, () => {
  renderSidebar(sidebarEl, categories, null);
  showGrid(null);
});

onRouteChange(/^\/category\/(?<id>[^/]+)$/, ({ id }) => {
  const category = findCategory(id);
  if (!category) {
    location.hash = '#/';
    return;
  }
  renderSidebar(sidebarEl, categories, id);
  showGrid(id);
});

onRouteChange(/^\/tip\/(?<id>[^/]+)$/, ({ id }) => {
  const tip = findTip(id);
  if (!tip) {
    location.hash = '#/';
    return;
  }
  searchBarEl.style.display = 'none';
  renderSidebar(sidebarEl, categories, tip.category);
  renderTipDetail(contentEl, tip, tips);
});

searchInput.addEventListener('input', debounce(() => {
  searchState.keyword = searchInput.value;
  showGrid(currentCategoryId);
}, 250));

sortSelect.addEventListener('change', () => {
  searchState.sort = sortSelect.value;
  showGrid(currentCategoryId);
});

startRouter();