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
    if (!ctx) return { refresh() {}, activate() {}, pause() {}, newWeave() {}, preview() {}, depth() {}, reset() {}, rotate() {}, snapshot() {}, restore() {} };
    let width = 0, height = 0, frame = 0, last = 0, until = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0, phase = .25, targetPhase = phase, depth = 0, targetDepth = 0;
    let active = !expanded;
    let visible = !expanded;
    let pitch = -.32, yaw = .22, targetPitch = pitch, targetYaw = yaw;
    let drag = null, suppressClick = false, geometry = [], geometryKey = '';
    const interactive = 'button, a, .power-picker, .pattern-tools';
    surface.setAttribute('role', 'group');
    function syncSurface() {
      const landscape = !expanded && document.body.dataset.dream === 'true';
      surface.tabIndex = landscape ? -1 : 0;
      surface.setAttribute('aria-label', landscape ? 'Landscape artwork' : 'Rotate artwork');
      if (landscape) surface.removeAttribute('aria-description');
      else surface.setAttribute('aria-description', 'Drag to rotate. Arrow keys rotate; Home resets.');
    }
    syncSurface();
    surface.removeAttribute('aria-hidden');
    surface.classList.add('art-surface');
    function buildGeometry() {
      const strands = width < 600 ? 24 : 36;
      const key = `${power}:${phase}:${strands}`;
      if (key === geometryKey) return;
      geometryKey = key;
      geometry = [];
      const p = powers[power];
      for (let i = 0; i < strands; i++) {
        const strand = [];
        const v = i / strands * Math.PI * 2;
        for (let j = 0; j <= 160; j++) {
          const t = j / 160 * Math.PI * 2;
          const twist = 3 * t + phase;
          const r = .77 + Math.cos(twist) * (.19 + p.bend * .2) + Math.cos(v + t) * .075;
          strand.push([
            Math.cos(2 * t) * r,
            Math.sin(2 * t) * r,
            Math.sin(twist) * .3 + Math.sin(v + t) * .075,
          ]);
        }
        geometry.push(strand);
      }
    }
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
      buildGeometry();
      const radius = Math.min(width, height) * (expanded ? (width < 600 ? .41 : .34) : width < 600 ? .39 : .30) * (1 + depth * 1.1);
      const cx = width / 2, cy = height / 2 + (expanded ? -20 : 12);
      const ax = pitch + y * .08, ay = yaw + x * .12;
      const sx = Math.sin(ax), cxr = Math.cos(ax), sy = Math.sin(ay), cyr = Math.cos(ay);
      const buckets = Array.from({ length: 24 }, () => [[], []]);
      geometry.forEach((strand, i) => {
        let previous;
        strand.forEach(([px, py, pz]) => {
          const rx = px * cyr + pz * sy;
          const rz = -px * sy + pz * cyr;
          const ry = py * cxr - rz * sx;
          const z = py * sx + rz * cxr;
          const perspective = 3.5 / (3.5 - z);
          const point = [cx + rx * radius * perspective, cy + ry * radius * perspective, z];
          if (previous) {
            const bucket = Math.max(0, Math.min(23, Math.floor(((z + previous[2]) / 2 + 1.2) * 10)));
            buckets[bucket][i % 9 === 0 ? 1 : 0].push([previous, point]);
          }
          previous = point;
        });
      });
      ctx.lineCap = 'round';
      for (let i = 0; i < buckets.length; i++) {
        buckets[i].forEach((segments, brass) => {
          if (!segments.length) return;
          ctx.beginPath();
          segments.forEach(([a, b]) => { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); });
          ctx.globalAlpha = .12 + (i / 23) * .68;
          ctx.lineWidth = brass ? .9 : .65;
          ctx.strokeStyle = brass ? '#cabb98' : p.color;
          ctx.stroke();
        });
      }
      ctx.globalAlpha = 1;
    }
    function tick(time) {
      frame = 0;
      if (!active || !visible || document.hidden) return;
      const dt = Math.min(40, time - (last || time));
      last = time;
      const ease = 1 - Math.exp(-Math.max(1, dt) / 90);
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      pitch += (targetPitch - pitch) * ease;
      yaw += (targetYaw - yaw) * ease;
      phase += (targetPhase - phase) * ease;
      depth += (targetDepth - depth) * ease;
      draw(time);
      if (time < until && !reduced.matches) frame = requestAnimationFrame(tick);
    }
    function refresh() {
      if (!active || !visible || document.hidden || !width) return;
      if (reduced.matches) { x = y = depth = 0; pitch = targetPitch; yaw = targetYaw; phase = targetPhase; draw(performance.now()); return; }
      until = performance.now() + 900;
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
    function newWeave() { targetPhase += .8; refresh(); }
    function reset() { targetPitch = -.32; targetYaw = .22; targetX = targetY = 0; targetPhase = .25; refresh(); }
    surface.addEventListener('pointerdown', event => {
      if (!expanded && document.body.dataset.dream === 'true') return;
      if (!event.isPrimary || event.button !== 0 || event.target.closest?.(interactive)) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, pitch: targetPitch, yaw: targetYaw, moved: false };
      suppressClick = false;
    });
    surface.addEventListener('pointermove', event => {
      if (drag && drag.id === event.pointerId) {
        if (!(event.buttons & 1)) { release(event); return; }
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) < 6) return;
        if (!drag.moved) {
          drag.moved = true;
          surface.setPointerCapture(event.pointerId);
          surface.classList.add('is-rotating');
        }
        targetYaw = drag.yaw + dx * .009;
        targetPitch = drag.pitch - dy * .009;
        targetX = targetY = 0;
        refresh();
        return;
      }
      if (event.pointerType !== 'mouse' || reduced.matches || !width) return;
      const rect = canvas.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / height * 2 - 1));
      refresh();
    });
    function release(event) {
      if (!drag || drag.id !== event.pointerId) return;
      suppressClick = drag.moved;
      drag = null;
      surface.classList.remove('is-rotating');
      if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
      setTimeout(() => { suppressClick = false; }, 0);
    }
    surface.addEventListener('pointerup', release);
    surface.addEventListener('pointercancel', release);
    surface.addEventListener('lostpointercapture', release);
    surface.addEventListener('pointerleave', () => {
      if (drag && !drag.moved) drag = null;
      targetX = targetY = 0; refresh();
    });
    surface.addEventListener('keydown', event => {
      if (!expanded && document.body.dataset.dream === 'true') return;
      if (event.target !== surface || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') { reset(); return; }
      targetYaw += event.key === 'ArrowRight' ? .25 : event.key === 'ArrowLeft' ? -.25 : 0;
      targetPitch += event.key === 'ArrowUp' ? .25 : event.key === 'ArrowDown' ? -.25 : 0;
      refresh();
    });
    surface.addEventListener('click', event => {
      if (suppressClick || event.target.closest?.(interactive)) return;
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
      refresh, newWeave, reset, syncSurface,
      rotate() { targetYaw += .65; targetPitch += .18; refresh(); },
      preview(index) { targetPhase = .25 + index * .8; refresh(); },
      snapshot() { return { pitch: targetPitch, yaw: targetYaw, phase: targetPhase }; },
      restore(state) { if (!state) return; pitch = targetPitch = state.pitch; yaw = targetYaw = state.yaw; phase = targetPhase = state.phase; targetX = targetY = x = y = 0; },
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
      renderers.forEach(renderer => { renderer.syncSurface(); renderer.refresh(); });
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
  const rotateIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.1"><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)"/><ellipse cx="12" cy="12" rx="4" ry="9" transform="rotate(-30 12 12)"/><path d="m19 5 2 3 1-3"/></g></svg>';
  const rotate = document.createElement('button');
  rotate.type = 'button';
  rotate.className = 'pattern-action pattern-rotate';
  rotate.setAttribute('aria-label', 'Rotate artwork');
  rotate.title = 'Rotate artwork';
  rotate.innerHTML = rotateIcon;
  rotate.addEventListener('click', small.rotate);
  art.querySelector('.pattern-open').before(rotate);
  const icons = {
    expand: '<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>',
    shape: '<path d="M5 8a8 8 0 1 1-1 7M5 3v5h5"/>',
    reset: '<circle cx="12" cy="12" r="5"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/>',
    save: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
  };
  function control(button, icon, label) {
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${icons[icon] || ''}</svg><span class="control-label">${label}</span>`;
  }
  control(art.querySelector('.pattern-open'), 'expand', 'Expand');
  rotate.insertAdjacentHTML('beforeend', '<span class="control-label">Rotate</span>');

  const dialog = document.createElement('dialog');
  dialog.className = 'pattern-dialog';
  dialog.setAttribute('aria-label', 'Interactive artwork');
  dialog.innerHTML = '<canvas aria-hidden="true"></canvas><div class="pattern-dialog__header"><button class="pattern-dialog__close" type="button" aria-label="Close artwork" autofocus>×</button></div><div class="pattern-dialog__footer"><div class="power-picker" role="group" aria-label="Artwork color"></div><div class="pattern-dialog__actions"><button class="pattern-action pattern-rotate" type="button" aria-label="Rotate artwork" title="Rotate artwork">' + rotateIcon + '</button><button class="pattern-action pattern-again" type="button" aria-label="Change shape" title="Change shape">↻</button><button class="pattern-action pattern-reset" type="button" aria-label="Reset artwork" title="Reset artwork"><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.1"><circle cx="12" cy="12" r="5"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/></g></svg></button><button class="pattern-action pattern-save" type="button" aria-label="Save image" title="Save image">↓</button></div></div>';
  document.body.append(dialog);
  control(dialog.querySelector('.pattern-again'), 'shape', 'Reshape');
  control(dialog.querySelector('.pattern-reset'), 'reset', 'Reset');
  control(dialog.querySelector('.pattern-save'), 'save', 'Save');
  control(dialog.querySelector('.pattern-dialog__close'), 'close', 'Close');
  dialog.querySelector('.pattern-rotate').insertAdjacentHTML('beforeend', '<span class="control-label">Rotate</span>');
  addPicker(dialog.querySelector('.power-picker'));
  const large = makeWeave(dialog.querySelector('canvas'), dialog.querySelector('canvas'), true);
  art.querySelector('.pattern-open').addEventListener('click', () => {
    dialog.showModal();
    small.pause();
    large.restore(small.snapshot());
    large.activate();
  });
  dialog.querySelector('.pattern-dialog__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { large.pause(); small.restore(large.snapshot()); small.activate(); });
  dialog.querySelector('.pattern-again').addEventListener('click', large.newWeave);
  dialog.querySelector('.pattern-rotate').addEventListener('click', large.rotate);
  dialog.querySelector('.pattern-reset').addEventListener('click', large.reset);
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
