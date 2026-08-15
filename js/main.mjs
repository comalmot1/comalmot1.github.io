import { categories, tips } from './data.mjs';
import { renderSidebar, renderTipGrid } from './render.mjs';

const sidebarEl = document.getElementById('sidebar');
const contentEl = document.getElementById('content-area');

renderSidebar(sidebarEl, categories, null);
renderTipGrid(contentEl, tips);
