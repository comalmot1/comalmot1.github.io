import { categories } from './data.mjs';
import { renderSidebar } from './render.mjs';

renderSidebar(document.getElementById('sidebar'), categories, null);
