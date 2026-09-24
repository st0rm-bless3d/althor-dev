(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const powers = [
    { name: 'Pale blue', color: '#b8d6e2', bend: .12, waves: 2 },
    { name: 'Teal', color: '#77cfc9', bend: .23, waves: 3 },
    { name: 'Ochre', color: '#c1ac7e', bend: .08, waves: 7 },
    { name: 'Copper', color: '#db957b', bend: .3, waves: 5 },
    { name: 'Lilac', color: '#c3b4dc', bend: .18, waves: 7 },
  ];
  let power = 1;
  const renderers = [];
  const pickers = [];
  const svgNS = 'http://www.w3.org/2000/svg';
  function svg(markup, className, viewBox) {
    const el = document.createElementNS(svgNS, 'svg');
    el.setAttribute('viewBox', viewBox);
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('focusable', 'false');
    el.classList.add(className);
    el.innerHTML = markup;
    return el;
  }
  function choosePower(index) {
    power = index;
    document.documentElement.style.setProperty('--thread', powers[power].color);
    pickers.forEach(picker => [...picker.children].forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === power));
    }));
    renderers.forEach(renderer => renderer.refresh());
  }
  function addPicker(container) {
    powers.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'power-choice';
      button.setAttribute('aria-label', item.name);
      button.setAttribute('aria-pressed', String(index === power));
      button.style.setProperty('--power', item.color);
      button.addEventListener('click', () => choosePower(index));
      container.append(button);
    });
    pickers.push(container);
  }

  // Finite, input-driven rendering. No idle animation loop or network requests.
  function makeWeave(canvas, surface, expanded = false) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return { refresh() {}, activate() {}, pause() {}, newWeave() {} };
    let width = 0, height = 0, frame = 0, last = 0, until = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0, phase = .25, depth = 0, targetDepth = 0;
    let active = !expanded;
    let visible = !expanded;
    let pulse = -10000;
    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      const p = powers[power];
      if (!expanded && document.body.dataset.dream === 'true') {
        const peakX = width * .53 + x * 5;
        const peakY = height * .29 + y * 3;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = .7;
        for (let i = 0; i < 12; i++) {
          ctx.globalAlpha = .1 + i * .025;
          ctx.beginPath();
          ctx.moveTo(width * .04, height * .76 + i * 2);
          ctx.bezierCurveTo(width * .31, height * .8, peakX - 40 + i * 2, peakY + 58, peakX - 8 + i * .65, peakY);
          ctx.lineTo(peakX + 3 + i * .45, peakY + 5);
          ctx.lineTo(peakX + 12 + i * .5, peakY + 1);
          ctx.bezierCurveTo(peakX + 35, peakY + 75, width * .78, height * .85, width * .98, height * .82 + i * 2);
          ctx.stroke();
        }
        ctx.strokeStyle = '#c3b4dc';
        ctx.globalAlpha = .6;
        ctx.beginPath();
        ctx.arc(width * .69 - x * 6, height * .19 - y * 6, 12, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 23; i++) {
          ctx.globalAlpha = .25 + (i % 4) * .15;
          ctx.fillStyle = '#c3b4dc';
          ctx.beginPath();
          ctx.arc((i * 61.7 + 17) % width, (i * 39.3 + 11) % (height * .45), .7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        return;
      }
      const radius = Math.min(width, height) * (expanded ? .31 : .36) * (1 + depth * 1.8);
      const cx = width / 2, cy = height / 2 - (expanded ? 20 : 6);
      const rings = expanded ? 46 : 28;
      const age = (time - pulse) / 1400;
      for (let i = 0; i < rings; i++) {
        const layer = i / (rings - 1);
        ctx.beginPath();
        const steps = power === 2 ? 28 : 128;
        for (let j = 0; j <= steps; j++) {
          const t = j / steps * Math.PI * 2;
          const warp = Math.sin(t * p.waves + phase + layer * 4) * p.bend;
          const r = radius * (.66 + layer * .55 + warp * Math.sin(layer * Math.PI));
          const attraction = Math.cos(t - Math.atan2(y, x)) * Math.hypot(x, y) * 16;
          let px = Math.cos(t) * (r + attraction);
          let py = Math.sin(t) * r * (.75 + layer * .25);
          px += Math.sin(t * 2 + layer * 3 + phase) * radius * .12;
          py += Math.cos(t * 3 - phase) * radius * .045;
          if (age > 0 && age < 1 && !reduced.matches) {
            const wave = Math.sin(layer * 12 - age * 9) * (1 - age) * 8;
            px += Math.cos(t) * wave;
            py += Math.sin(t) * wave;
          }
          if (!j) ctx.moveTo(cx + px, cy + py); else ctx.lineTo(cx + px, cy + py);
        }
        ctx.closePath();
        ctx.strokeStyle = i % 6 === 0 ? '#b4a889' : p.color;
        ctx.globalAlpha = (expanded ? .2 : .13) + (i % 6 === 0 ? .23 : .07);
        ctx.lineWidth = i % 6 === 0 ? .8 : .55;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    function tick(time) {
      frame = 0;
      if (!active || !visible || document.hidden) return;
      const dt = Math.min(32, time - (last || time));
      last = time;
      x += (targetX - x) * .12;
      y += (targetY - y) * .12;
      depth += (targetDepth - depth) * .12;
      phase += dt * .00008;
      draw(time);
      if (time < until && !reduced.matches) frame = requestAnimationFrame(tick);
    }
    function refresh() {
      if (!active || !visible || document.hidden || !width) return;
      if (reduced.matches) { x = targetX; y = targetY; depth = 0; draw(performance.now()); return; }
      until = performance.now() + 1500;
      if (!frame) { last = 0; frame = requestAnimationFrame(tick); }
    }
    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (width && active && visible) draw(performance.now());
    }
    function newWeave() { phase += .8; pulse = performance.now(); refresh(); }
    surface.addEventListener('pointermove', event => {
      const rect = canvas.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / height * 2 - 1));
      refresh();
    });
    surface.addEventListener('pointerleave', () => { targetX = targetY = 0; refresh(); });
    surface.addEventListener('click', event => {
      if (event.target.closest?.('.power-picker, .pattern-open, a')) return;
      newWeave();
    });
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) refresh(); else { cancelAnimationFrame(frame); frame = 0; }
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else refresh();
    });
    reduced.addEventListener('change', () => { cancelAnimationFrame(frame); frame = 0; refresh(); });
    const renderer = {
      refresh, newWeave,
      preview(index) { phase = .25 + index * .8; refresh(); },
      depth(value) { if (reduced.matches) return; targetDepth = Math.max(0, Math.min(1, value)); refresh(); },
      activate() { active = visible = true; resize(); refresh(); },
      pause() { active = false; cancelAnimationFrame(frame); frame = 0; },
    };
    renderers.push(renderer);
    resize();
    return renderer;
  }

  const brand = document.querySelector('.brand');
  if (brand) {
    const dream = document.createElement('button');
    dream.type = 'button';
    dream.className = 'dream-toggle';
    dream.setAttribute('aria-label', 'Alternate appearance');
    dream.title = 'Change appearance';
    dream.append(svg('<path d="M12 2 14 9 21 12 14 14 12 22 10 14 3 12 10 9Z" fill="none" stroke="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/>', 'dream-symbol', '0 0 24 24'));
    let dreaming = false;
    try { dreaming = localStorage.getItem('althor-dream') === 'true'; } catch { /* Optional preference storage. */ }
    function setDream() {
      document.body.dataset.dream = String(dreaming);
      dream.setAttribute('aria-pressed', String(dreaming));
      renderers.forEach(renderer => renderer.refresh());
    }
    dream.addEventListener('click', () => {
      dreaming = !dreaming;
      setDream();
      try { localStorage.setItem('althor-dream', String(dreaming)); } catch { /* Private browsing can disallow storage. */ }
    });
    setDream();
    brand.append(dream);
    let stars = '';
    for (let i = 0; i < 65; i++) {
      stars += `<circle cx="${(i * 173.7 + 37) % 1440}" cy="${(i * 97.3 + 13) % 1000}" r="${i % 9 === 0 ? 1.2 : .6}" fill="#bfc8e1" opacity="${.2 + (i % 4) * .15}"/>`;
    }
    const sky = svg(stars, 'dream-sky', '0 0 1440 1000');
    sky.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    document.body.prepend(sky);
  }

  const progress = document.createElement('div');
  progress.className = 'reading-thread';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);
  const sections = [...document.querySelectorAll('.home-section, .home .contact-panel')];
  let chapters;
  if (sections.length) {
    chapters = document.createElement('nav');
    chapters.className = 'chapter-nav';
    chapters.setAttribute('aria-label', 'On this page');
    sections.forEach(section => {
      const heading = section.querySelector('h2');
      const link = document.createElement('a');
      link.href = '#' + section.id;
      link.setAttribute('aria-label', heading.textContent);
      chapters.append(link);
      section.tabIndex = -1;
      let threads = '';
      for (let i = 0; i < 3; i++) threads += `<path d="M0 13 C180 ${11 + i * 4} 225 ${3 + i * 5} 290 13 S440 ${20 - i * 5} 520 13 S800 ${8 + i * 3} 1000 13"/>`;
      const divider = svg(`<g fill="none" stroke="currentColor" stroke-width=".7">${threads}</g>`, 'thread-divider', '0 0 1000 26');
      divider.setAttribute('preserveAspectRatio', 'none');
      section.prepend(divider);
    });
    document.body.append(chapters);
  }
  let scrollFrame = 0;
  function readPosition() {
    scrollFrame = 0;
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0})`;
    if (!chapters) return;
    let current = -1;
    sections.forEach((section, index) => { if (section.getBoundingClientRect().top < Math.min(160, innerHeight * .25)) current = index; });
    if (total > 0 && scrollY >= total - 2) current = sections.length - 1;
    sections.forEach((section, index) => {
      section.dataset.current = String(current === index);
      if (current === index) chapters.children[index].setAttribute('aria-current', 'true');
      else chapters.children[index].removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(readPosition); }, { passive: true });
  addEventListener('resize', readPosition);
  readPosition();

  document.querySelectorAll('.proof-card').forEach((card, index) => {
    let paths = '';
    for (let i = 0; i < 7; i++) {
      const d = index === 0
        ? `M${15 + i * 10} 15 C${35 + i * 12} 90 ${170 - i * 12} 0 ${195 - i * 10} 85`
        : index === 1
          ? `M${35 + i * 5} 85 Q${10 + i * 6} 20 105 ${12 + i * 3} Q${200 - i * 6} 20 ${175 - i * 5} 85`
          : `M${20 + i * 6} 85 L${100 + i * 2} ${8 + i * 3} L${190 - i * 6} 85`;
      paths += `<path d="${d}" opacity="${.22 + i * .065}"/>`;
      if (i === 3) paths += `<path d="${d}" class="weave-trace"/>`;
    }
    if (index === 1) paths += '<g class="gate-leaf gate-left"><path d="M103 25 Q57 30 71 73 Q104 75 103 25Z M103 25 71 73" stroke="#b4a889"/></g><g class="gate-leaf gate-right"><path d="M107 25 Q153 30 139 73 Q106 75 107 25Z M107 25 139 73" stroke="#b4a889"/></g>';
    card.prepend(svg(`<g fill="none" stroke="currentColor" stroke-width=".8">${paths}</g>`, 'card-weave', '0 0 210 100'));
    card.addEventListener('pointermove', event => {
      if (reduced.matches) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    });
  });

  const footer = document.querySelector('footer');
  if (footer) {
    const landscape = document.createElement('div');
    landscape.className = 'landscape';
    landscape.setAttribute('aria-hidden', 'true');
    landscape.append(svg('<defs><linearGradient id="horizon-fade"><stop stop-color="#77cfc9" stop-opacity="0"/><stop offset=".42" stop-color="#77cfc9" stop-opacity=".4"/><stop offset=".58" stop-color="#b4a889" stop-opacity=".7"/><stop offset="1" stop-color="#b4a889" stop-opacity="0"/></linearGradient></defs><g fill="none" stroke="url(#horizon-fade)" stroke-width=".8"><path d="M0 145 180 138 310 147 430 130 510 137 576 113 620 84 654 31 666 41 675 29 688 51 735 114 800 132 910 127 1070 145 1440 133"/><path d="M0 158 Q200 126 430 153 T830 150 T1440 156 M0 168 Q330 145 530 166 T1000 164 T1440 171 M576 113 625 108 654 31 M625 108 666 41 680 85 735 114 M654 31 648 20 673 18 675 29"/></g>', 'dragonmount', '0 0 1440 180'));
    footer.after(landscape);
  }

  const art = document.querySelector('.pattern-art');
  if (!art) return;
  const small = makeWeave(art.querySelector('canvas'), art);
  document.addEventListener('althor:preview', event => small.preview(event.detail));
  document.addEventListener('althor:depth', event => small.depth(event.detail));
  addPicker(art.querySelector('.power-picker'));
  art.querySelector('.pattern-tools').hidden = false;

  const dialog = document.createElement('dialog');
  dialog.className = 'pattern-dialog';
  dialog.setAttribute('aria-label', 'Interactive artwork');
  dialog.innerHTML = '<canvas aria-hidden="true"></canvas><div class="pattern-dialog__header"><button class="pattern-dialog__close" type="button" aria-label="Close artwork" autofocus>×</button></div><div class="pattern-dialog__footer"><div class="power-picker" role="group" aria-label="Artwork color"></div><div class="pattern-dialog__actions"><button class="pattern-action pattern-again" type="button" aria-label="Change shape" title="Change shape">↻</button><button class="pattern-action pattern-save" type="button" aria-label="Save image" title="Save image">↓</button></div></div>';
  document.body.append(dialog);
  addPicker(dialog.querySelector('.power-picker'));
  const large = makeWeave(dialog.querySelector('canvas'), dialog.querySelector('canvas'), true);
  art.querySelector('.pattern-open').addEventListener('click', () => {
    dialog.showModal();
    small.pause();
    large.activate();
  });
  dialog.querySelector('.pattern-dialog__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { large.pause(); small.activate(); });
  dialog.querySelector('.pattern-again').addEventListener('click', large.newWeave);
  dialog.querySelector('.pattern-save').addEventListener('click', () => {
    const source = dialog.querySelector('canvas');
    const output = document.createElement('canvas');
    output.width = source.width; output.height = source.height;
    const context = output.getContext('2d');
    if (!context) return;
    context.fillStyle = '#0b1017'; context.fillRect(0, 0, output.width, output.height);
    context.drawImage(source, 0, 0);
    output.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'althor-artwork.png';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  });
})();
