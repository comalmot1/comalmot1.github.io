export function filterAndSortTips(tips, keyword, sort) {
  const trimmed = keyword.trim().toLowerCase();
  const filtered = trimmed
    ? tips.filter((t) =>
        t.title.toLowerCase().includes(trimmed) ||
        t.summary.toLowerCase().includes(trimmed) ||
        t.tags.some((tag) => tag.toLowerCase().includes(trimmed))
      )
    : tips.slice();

  return filtered.sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title, 'ko');
    }
    return new Date(b.date) - new Date(a.date);
  });
}