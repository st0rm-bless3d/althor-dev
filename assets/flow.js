(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const shapeIndex = { spire: 0, extraction: 1, governance: 2 };
  const svgNS = 'http://www.w3.org/2000/svg';

  document.querySelectorAll('.project-figure').forEach(figure => {
    const kind = figure.dataset.shape;
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 600 500');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    let lines = '';
    for (let i = 0; i < 30; i++) {
      const q = i / 29;
      let d;
      if (kind === 'spire') {
        const edge = 85 + i * 5.3;
        d = `M${edge} 425 C${180 + i * 2} ${385 - i * 2} ${270 - i * .8} ${140 + i * 2} 296 ${66 + i * 1.9} L${309 + i * .3} ${76 + i * 2} C${326 + i * .6} ${170 + i * 2} ${405 - i * 2} 395 ${520 - i * 5.3} 425`;
      } else if (kind === 'extraction') {
        const y = 85 + i * 11;
        d = `M45 ${y} C210 ${30 + i * 6} 200 ${470 - i * 6} 300 250 S420 ${15 + i * 10} 555 ${425 - i * 11}`;
      } else {
        const left = 80 + i * 5.3, right = 520 - i * 5.3;
        d = `M${left} 425 L${left} 245 C${left} ${110 + i * 2} ${240 - i * .5} ${60 + i * 3.5} 300 ${55 + i * 3.5} C${360 + i * .5} ${60 + i * 3.5} ${right} ${110 + i * 2} ${right} 245 L${right} 425`;
      }
      lines += `<path d="${d}" opacity="${.17 + q * .45}"${i % 7 === 0 ? ' class="portal-brass"' : ''}/>`;
    }
    const detail = kind === 'governance'
      ? '<g class="portal-detail portal-brass"><path d="M300 178 C234 196 218 248 248 284 C282 271 300 230 300 178Z M300 178 C366 196 382 248 352 284 C318 271 300 230 300 178Z M248 284 300 178 352 284"/></g>'
      : kind === 'extraction'
        ? '<g class="portal-detail portal-brass"><ellipse cx="300" cy="250" rx="57" ry="82"/><ellipse cx="300" cy="250" rx="66" ry="90" opacity=".4"/></g>'
        : '<g class="portal-detail portal-brass"><circle cx="420" cy="106" r="18"/><path d="M420 81V77 M420 135V131 M395 106H391 M449 106H445"/></g>';
    svg.innerHTML = `<g class="portal-lines" fill="none" stroke="currentColor" stroke-width=".8">${lines}${detail}<path d="M60 440 Q300 420 540 440" opacity=".15"/></g>`;
    figure.append(svg);
    let frame = 0, pointerX = 0, pointerY = 0;
    function tilt() {
      frame = 0;
      figure.style.setProperty('--tilt-x', `${pointerX * 7}deg`);
      figure.style.setProperty('--tilt-y', `${pointerY * -5}deg`);
    }
    figure.addEventListener('pointermove', event => {
      if (reduced.matches || event.pointerType === 'touch') return;
      const rect = figure.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tilt);
    });
    figure.addEventListener('pointerleave', () => { pointerX = pointerY = 0; if (!frame) frame = requestAnimationFrame(tilt); });
  });

  const art = document.querySelector('.pattern-art');
  document.querySelectorAll('a[data-project]').forEach(link => {
    function preview() {
      document.dispatchEvent(new CustomEvent('althor:preview', { detail: shapeIndex[link.dataset.project] || 0 }));
    }
    if (link.classList.contains('entry-link')) {
      link.addEventListener('pointerenter', preview);
      link.addEventListener('focus', preview);
    }
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced.matches) return;
      document.querySelectorAll('[data-transition-source]').forEach(node => {
        node.style.viewTransitionName = 'none';
        delete node.dataset.transitionSource;
      });
      const caseFigure = document.querySelector('.case-figure');
      if (caseFigure) caseFigure.style.viewTransitionName = 'none';
      const source = link.querySelector('.project-figure') || art?.querySelector('canvas');
      if (source) {
        source.style.viewTransitionName = 'project-image';
        source.dataset.transitionSource = 'true';
      }
    });
  });
  function restoreCaseFigure() {
    const figure = document.querySelector('.case-figure');
    if (!figure) return;
    document.querySelectorAll('[data-transition-source]').forEach(node => {
      node.style.viewTransitionName = 'none';
      delete node.dataset.transitionSource;
    });
    figure.style.viewTransitionName = reduced.matches ? 'none' : 'project-image';
  }
  restoreCaseFigure();
  addEventListener('pageshow', restoreCaseFigure);
  addEventListener('pagereveal', restoreCaseFigure);
  reduced.addEventListener('change', restoreCaseFigure);

  const rail = document.querySelector('.project-rail');
  if (rail) {
    const slides = [...rail.querySelectorAll('.project-slide')];
    const controls = document.querySelector('.gallery-controls');
    const counter = controls.querySelector('.gallery-count');
    let current = 0, scrollFrame = 0;
    function update() {
      scrollFrame = 0;
      current = slides.reduce((closest, slide, index) => Math.abs(slide.offsetLeft - slides[0].offsetLeft - rail.scrollLeft) < Math.abs(slides[closest].offsetLeft - slides[0].offsetLeft - rail.scrollLeft) ? index : closest, 0);
      const label = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (counter.textContent !== label) counter.textContent = label;
      controls.querySelector('[data-step="-1"]').disabled = current === 0;
      controls.querySelector('[data-step="1"]').disabled = current === slides.length - 1;
    }
    function go(index) {
      const next = Math.max(0, Math.min(slides.length - 1, index));
      rail.scrollTo({ left: slides[next].offsetLeft - slides[0].offsetLeft, behavior: reduced.matches ? 'instant' : 'smooth' });
    }
    controls.hidden = false;
    controls.querySelectorAll('button').forEach(button => button.addEventListener('click', () => go(current + Number(button.dataset.step))));
    rail.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(update); }, { passive: true });
    rail.addEventListener('keydown', event => {
      if (event.target !== rail || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      go(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    let drag = null, suppressClick = false;
    rail.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, scroll: rail.scrollLeft, moved: false };
    });
    rail.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return;
      if (!(event.buttons & 1)) { drag = null; return; }
      const distance = event.clientX - drag.x;
      if (!drag.moved && Math.abs(distance) < 8) return;
      if (!drag.moved) {
        drag.moved = true;
        rail.setPointerCapture(event.pointerId);
        rail.style.scrollSnapType = 'none';
        rail.classList.add('is-dragging');
      }
      event.preventDefault();
      rail.scrollLeft = drag.scroll - distance;
    });
    function release(event) {
      if (!drag || drag.id !== event.pointerId) return;
      suppressClick = drag.moved;
      if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      rail.style.scrollSnapType = '';
      rail.classList.remove('is-dragging');
      drag = null;
      setTimeout(() => { suppressClick = false; }, 0);
    }
    rail.addEventListener('pointerup', release);
    rail.addEventListener('pointercancel', release);
    rail.addEventListener('pointerleave', () => { if (drag && !drag.moved) drag = null; });
    rail.addEventListener('lostpointercapture', () => { drag = null; rail.style.scrollSnapType = ''; rail.classList.remove('is-dragging'); });
    rail.addEventListener('click', event => { if (suppressClick) { event.preventDefault(); event.stopPropagation(); } }, true);
    rail.addEventListener('dragstart', event => event.preventDefault());
    new ResizeObserver(update).observe(rail);
    update();
  }

  const filters = document.querySelector('.writing-filters');
  if (filters) {
    const items = [...document.querySelectorAll('.writing-list__item[data-topic]')];
    const status = document.createElement('span');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    filters.after(status);
    filters.hidden = false;
    filters.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.querySelectorAll('button').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      items.forEach(item => { item.hidden = filter !== 'all' && item.dataset.topic !== filter; });
      status.textContent = `${items.filter(item => !item.hidden).length} articles`;
    }));
  }

  const headings = [...document.querySelectorAll('.prose > h2')];
  const notes = [
    ['/writing/entra-workload-identities/', 'Entra ID workload identities for agent systems'],
    ['/writing/agent-security-review/', 'Making agent deployments pass security review'],
    ['/writing/mcp-server-boundaries/', 'Drawing the right boundaries for an MCP server'],
    ['/writing/mcp-copilot-studio/', 'Adding MCP servers to Copilot Studio in regulated environments'],
  ];
  const note = notes.findIndex(([path]) => path === location.pathname);
  if (note !== -1) {
    const next = notes[(note + 1) % notes.length];
    const nav = document.createElement('nav');
    nav.className = 'reading-next';
    nav.setAttribute('aria-label', 'Next article');
    const caption = document.createElement('span');
    caption.textContent = 'Next';
    const link = document.createElement('a');
    link.href = next[0];
    link.textContent = next[1];
    nav.append(caption, link);
    document.querySelector('.container').append(nav);
  }
  let readingNav;
  if (headings.length > 2) {
    readingNav = document.createElement('nav');
    readingNav.className = 'reading-nav';
    readingNav.setAttribute('aria-label', 'On this page');
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      heading.tabIndex = -1;
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      const label = document.createElement('span');
      label.textContent = heading.textContent;
      link.append(label);
      readingNav.append(link);
    });
    document.body.append(readingNav);
  }
  let frame = 0;
  function scroll() {
    frame = 0;
    if (art && !reduced.matches) {
      const rect = art.getBoundingClientRect();
      if (rect.bottom > 0) document.dispatchEvent(new CustomEvent('althor:depth', { detail: Math.max(0, -rect.top / rect.height) }));
    }
    if (readingNav) {
      let current = -1;
      headings.forEach((heading, index) => { if (heading.getBoundingClientRect().top < 180) current = index; });
      [...readingNav.children].forEach((link, index) => {
        if (index === current) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
    }
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(scroll); }, { passive: true });
  scroll();
})();
