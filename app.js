(() => {
  'use strict';
  const originals = new Map(Array.from(document.querySelectorAll('[data-i18n]'), el => [el, el.innerHTML]));
  const list = document.getElementById('publication-list');
  let language = 'en';
  let activeFilter = 'all';
  const groups = [
    {id:'first', en:'First- & co-first-author papers', zh:'第一 / 共同第一作者论文'},
    {id:'coauthor', en:'Co-authored papers', zh:'合作论文'}
  ];
  const resourceLabels = {
    en:{paper:'Paper',arxiv:'arXiv',code:'Code',project:'Project',dataset:'Data',model:'Model'},
    zh:{paper:'论文',arxiv:'arXiv',code:'代码',project:'项目',dataset:'数据',model:'模型'}
  };
  function renderPaper(p) {
    const links = Object.keys(resourceLabels.en).filter(key => p[key]).map(key => `<a href="${p[key]}" target="_blank" rel="noopener noreferrer">${resourceLabels[language][key]}</a>`).join('');
    const visual = p.image
      ? `<button class="publication-visual" type="button" data-figure="${p.imageFull || p.image}" data-figure-alt="${p.imageAlt}" aria-label="${language === 'zh' ? '放大论文图片' : 'Enlarge paper figure'}: ${p.title}"><img src="${p.image}" alt="${p.imageAlt}" loading="lazy" decoding="async" width="${p.imageWidth || 165}" height="${p.imageHeight || 110}"></button>`
      : '<div class="publication-visual empty-figure" aria-hidden="true"><!-- Add an image to this paper in content.js when available. --></div>';
    return `<article class="publication" id="paper-${p.id}" data-topic="${p.topic}">${visual}<div class="publication-body"><span class="venue">${p.venue}</span> <h4 class="publication-title"><a href="${p.paper}" target="_blank" rel="noopener noreferrer">${p.title}</a></h4><p class="paper-summary">${language === 'zh' ? p.summaryZh : p.summary}</p><div class="paper-links">${links}</div><p class="authors">${p.authors}</p></div></article>`;
  }
  function renderPapers() {
    list.innerHTML = groups.map(group => {
      const matching = window.PAPERS.filter(p => p.group === group.id && (activeFilter === 'all' || p.topic === activeFilter));
      if (!matching.length) return '';
      return `<div class="publication-group" aria-labelledby="group-${group.id}"><h3 class="publication-group-title" id="group-${group.id}">${group[language]} <span>${matching.length}</span></h3>${matching.map(renderPaper).join('')}</div>`;
    }).join('');
    updateStatus();
  }
  function updateStatus() {
    const count = window.PAPERS.filter(p => activeFilter === 'all' || p.topic === activeFilter).length;
    document.getElementById('filter-status').textContent = language === 'zh' ? `显示 ${count} 篇论文` : `Showing ${count} publications`;
  }
  function filterPapers(topic) {
    activeFilter = topic;
    document.querySelectorAll('[data-filter]').forEach(button => {
      const selected = button.dataset.filter === topic;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    renderPapers();
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filterPapers(button.dataset.filter)));
  document.querySelectorAll('[data-topic-link]').forEach(link => link.addEventListener('click', () => {
    filterPapers(link.dataset.topicLink);
  }));
  function setLanguage(lang) {
    language = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    originals.forEach((english, el) => { el.innerHTML = lang === 'zh' ? (window.TRANSLATIONS[el.dataset.i18n] || english) : english; });
    const toggle = document.getElementById('language-toggle');
    toggle.innerHTML = lang === 'zh' ? '<b>中</b> / EN' : '中 / <b>EN</b>';
    toggle.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
    document.title = lang === 'zh' ? 'Jie Sun · 学术主页' : 'Jie Sun · Academic Homepage';
    renderPapers();
    try { localStorage.setItem('jie-homepage-language', lang); } catch (_) { /* Storage may be disabled. */ }
  }
  document.getElementById('language-toggle').addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
  const menuToggle = document.getElementById('menu-toggle');
  const navigation = document.getElementById('navigation');
  function closeMenu() { navigation.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); }
  menuToggle.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
  const sectionLinks = Array.from(navigation.querySelectorAll('a'));
  const sections = Array.from(document.querySelectorAll('main > section'));
  let ticking = false;
  const updateNavigation = () => {
    let current = sections[0].id;
    for (const section of sections) { if(section.getBoundingClientRect().top <= 110) current = section.id; }
    sectionLinks.forEach(link => { const active = link.hash === '#' + current; link.classList.toggle('active', active); if(active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    ticking = false;
  };
  window.addEventListener('scroll', () => { if(!ticking) { requestAnimationFrame(updateNavigation); ticking = true; } }, {passive:true});
  const viewer = document.getElementById('figure-viewer');
  const viewerImage = viewer.querySelector('img');
  let lastFigureButton = null;
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-figure]');
    if (!button) return;
    lastFigureButton = button;
    viewerImage.src = button.dataset.figure;
    viewerImage.alt = button.dataset.figureAlt;
    viewer.showModal();
  });
  viewer.querySelector('.figure-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => { if(lastFigureButton?.isConnected) lastFigureButton.focus({preventScroll:true}); });
  document.getElementById('year').textContent = new Date().getFullYear();
  let saved = 'en';
  try { saved = localStorage.getItem('jie-homepage-language') || 'en'; } catch (_) { /* Fall back to English. */ }
  setLanguage(saved === 'zh' ? 'zh' : 'en');
  updateNavigation();
})();
