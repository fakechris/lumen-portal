(() => {
  'use strict';
  const language = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  function closeMenu(restoreFocus = false) {
    if (!menuButton || !menu) return;
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', language === 'zh' ? '打开导航' : 'Open navigation');
    if (restoreFocus) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', language === 'zh' ? (opening ? '关闭导航' : '打开导航') : (opening ? 'Close navigation' : 'Open navigation'));
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  window.matchMedia('(min-width:601px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  const cards = [...document.querySelectorAll('.catalog .product-card')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#product-search');
  let activeCategory = 'all';
  function applyFilters() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let count = 0;
    cards.forEach(card => {
      const show = (activeCategory === 'all' || card.dataset.category === activeCategory) && card.dataset.search.toLocaleLowerCase().includes(query);
      card.hidden = !show;
      if (show) count++;
    });
    filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeCategory)));
    const empty = document.querySelector('.no-results');
    if (empty) empty.hidden = count !== 0;
    const status = document.querySelector('#filter-status');
    if (status) status.textContent = language === 'zh' ? `显示 ${count} 个产品` : `${count} products shown`;
  }
  filterButtons.forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.filter; applyFilters(); }));
  document.querySelectorAll('[data-category-link]').forEach(link => link.addEventListener('click', () => { activeCategory = link.dataset.categoryLink; if (search) search.value = ''; applyFilters(); }));
  search?.addEventListener('input', applyFilters);
  const motionButton = document.querySelector('.motion-toggle');
  const heroVideo = document.querySelector('.hero-loop');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  function setPaused(paused) {
    paused = media.matches || paused;
    if (motionButton) motionButton.disabled = media.matches;
    document.body.classList.toggle('motion-paused', paused);
    if (heroVideo) {
      if (paused || document.hidden || navigator.connection?.saveData) heroVideo.pause();
      else { if (!heroVideo.getAttribute('src')) heroVideo.src = heroVideo.dataset.src; heroVideo.play().catch(() => {}); }
    }
    motionButton?.setAttribute('aria-pressed', String(paused));
    if (motionButton) motionButton.textContent = media.matches ? (language === 'zh' ? '已减少动效' : 'Reduced motion') : (paused ? motionButton.dataset.resume : motionButton.dataset.pause) + (paused ? ' ▷' : ' Ⅱ');
  }
  setPaused(media.matches);
  motionButton?.addEventListener('click', () => setPaused(!document.body.classList.contains('motion-paused')));
  media.addEventListener('change', event => setPaused(event.matches));
  heroVideo?.addEventListener('playing', () => heroVideo.classList.add('is-playing'));
  document.addEventListener('visibilitychange', () => setPaused(document.body.classList.contains('motion-paused')));
})();
