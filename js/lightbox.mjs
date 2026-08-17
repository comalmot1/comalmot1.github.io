let overlay;

export function initLightbox() {
  overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<div class="lightbox-inner"><img alt=""></div>';
  document.body.appendChild(overlay);

  overlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.tip-figure-img');
    if (img) openLightbox(img.src, img.alt);
  });
}

function openLightbox(src, alt) {
  const img = overlay.querySelector('img');
  img.src = src;
  img.alt = alt;
  overlay.classList.add('is-open');
}

function closeLightbox() {
  overlay.classList.remove('is-open');
}
