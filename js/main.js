// ==========================================================================
// Aperture & Field — shared front-end behaviour
// Mobile nav, gallery filtering, lightbox, and social feed tabs.
// No build step required; vanilla JS only.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGalleryFilter();
  initLightbox();
  initSocialTabs();
});

/* ---------------------------- Mobile nav ---------------------------- */

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.site-header');
  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  header.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => header.classList.remove('nav-open'));
  });
}

/* ---------------------------- Gallery filter ---------------------------- */

function initGalleryFilter() {
  const bar = document.querySelector('.filter-bar');
  const grid = document.querySelector('.gallery-grid');
  if (!bar || !grid) return;

  const items = Array.from(grid.querySelectorAll('.g-item'));
  const empty = grid.querySelector('.gallery-empty');

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    bar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.filter;
    let visibleCount = 0;

    items.forEach((item) => {
      const match = cat === 'all' || item.dataset.category === cat;
      item.style.display = match ? '' : 'none';
      if (match) visibleCount += 1;
    });

    if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';

    // Reflect the active filter in the URL hash without jumping the page.
    if (history.replaceState) {
      history.replaceState(null, '', cat === 'all' ? location.pathname : `${location.pathname}#${cat}`);
    }
  });

  // Respect a category hash on load, e.g. gallery.html#landscape
  const initial = location.hash ? location.hash.slice(1) : null;
  if (initial) {
    const match = bar.querySelector(`[data-filter="${initial}"]`);
    if (match) match.click();
  }
}

/* ---------------------------- Lightbox ---------------------------- */

function initLightbox() {
  const grid = document.querySelector('.gallery-grid');
  const lightbox = document.querySelector('.lightbox');
  if (!grid || !lightbox) return;

  const imgEl = lightbox.querySelector('img');
  const titleEl = lightbox.querySelector('.lb-title');
  const exifEl = lightbox.querySelector('.lb-exif');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let items = [];
  let currentIndex = 0;

  function refreshVisibleItems() {
    items = Array.from(grid.querySelectorAll('.g-item')).filter(
      (item) => item.style.display !== 'none'
    );
  }

  function openAt(index) {
    refreshVisibleItems();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const fullSrc = item.dataset.full || item.querySelector('img').src;
    imgEl.src = fullSrc;
    imgEl.alt = item.querySelector('img').alt || '';
    if (titleEl) titleEl.textContent = item.dataset.title || '';
    if (exifEl) exifEl.textContent = item.dataset.exif || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.g-item');
    if (!item) return;
    refreshVisibleItems();
    const idx = items.indexOf(item);
    openAt(idx === -1 ? 0 : idx);
  });

  closeBtn && closeBtn.addEventListener('click', close);
  prevBtn && prevBtn.addEventListener('click', () => openAt(currentIndex - 1));
  nextBtn && nextBtn.addEventListener('click', () => openAt(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') openAt(currentIndex + 1);
    if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
  });
}

/* ---------------------------- Social feed tabs ---------------------------- */

function initSocialTabs() {
  const tabs = document.querySelector('.platform-tabs');
  if (!tabs) return;

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.ptab');
    if (!btn) return;

    tabs.querySelectorAll('.ptab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.dataset.platform;
    document.querySelectorAll('.feed-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.platform === target);
    });
  });
}
