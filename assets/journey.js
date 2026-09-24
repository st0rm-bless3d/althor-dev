(() => {
  'use strict';
  const path = location.pathname;
  if (path.startsWith('/offers/')) return;
  const servicePage = /^\/(packages|for|intake|checklist)(\/|$)/.test(path);
  if (servicePage) document.body.classList.add('journey-page');

  const ns = 'http://www.w3.org/2000/svg';
  const element = (name, attrs) => {
    const node = document.createElementNS(ns, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const etching = (index) => {
    const svg = element('svg', { viewBox: '0 0 1100 84', class: 'journey-etch', 'aria-hidden': 'true', preserveAspectRatio: 'xMidYMid slice' });
    const group = element('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': '.6' });
    // Offset arches echo the project illustrations without borrowing their content.
    for (let i = 0; i < 9; i += 1) {
      const y = 39 + i * 1.45;
      const x = 360 + (index % 3) * 150;
      group.append(element('path', { d: `M0 ${y} H${x - 70 - i * 7} Q${x - 12} ${y} ${x} ${14 + i * 3} Q${x + 12} ${y} ${x + 70 + i * 7} ${y} H1100`, opacity: String(.13 + i * .065) }));
    }
    group.append(element('path', { d: 'M0 66 H1100', class: 'etch-secondary', opacity: '.3' }));
    svg.append(group);
    return svg;
  };

  if (document.body.classList.contains('home-flow')) {
    ['writing', 'capabilities', 'about'].forEach((id, index) => {
      const section = document.getElementById(id);
      if (!section) return;
      section.classList.add('journey-section');
      section.prepend(etching(index));
    });
    const intro = document.querySelector('#capabilities .section-intro');
    if (intro) {
      const svg = element('svg', { viewBox: '0 0 320 220', class: 'service-architecture', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', 'stroke-width': '.8' });
      const inner = element('g', { class: 'arch-inner' });
      for (let i = 0; i < 13; i += 1) {
        const x = 65 + i * 6;
        inner.append(element('path', { d: `M${x} 193 V${125 - i * 3} Q${x} ${29 + i * 3} 160 ${18 + i * 6} Q${320 - x} ${29 + i * 3} ${320 - x} ${125 - i * 3} V193`, opacity: String(.16 + i * .055) }));
      }
      svg.append(inner, element('path', { d: 'M24 193H296 M61 201H259 M98 209H222', stroke: 'var(--brass)', opacity: '.6' }));
      intro.append(svg);
    }
  }

  if (!servicePage) return;
  const sections = [...document.querySelectorAll('.container > section, .container > main > section')];
  const entries = [];
  sections.forEach((section, index) => {
    const label = section.querySelector('.section__label');
    if (!label) return;
    section.classList.add('journey-section');
    section.prepend(etching(index));
    if (!section.id) {
      const base = `section-${label.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
      let id = base;
      let suffix = 2;
      while (document.getElementById(id)) id = `${base}-${suffix++}`;
      section.id = id;
    }
    const number = String(index + 1).padStart(2, '0');
    const marker = document.createElement('span');
    marker.className = 'journey-number';
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = number;
    label.before(marker);
    entries.push({ section, label: label.textContent.trim(), number });
  });
  if (entries.length < 3) return;
  const nav = document.createElement('nav');
  nav.className = 'journey-index';
  nav.setAttribute('aria-label', 'On this page');
  entries.forEach(({ section, label, number }) => {
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = label;
    link.dataset.number = number;
    nav.append(link);
  });
  entries[0].section.before(nav);
})();
