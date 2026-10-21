/* A House Divided — engine. Vanilla, no build step. Mirrors the Cold War flow:
   pick a perspective, take eight decisions, watch the map recolor, reach an ending. */
(function () {
  'use strict';
  const S = window.AH_SCENARIO, R0 = window.AH_REGIONS, FGN = window.AH_FOREIGN,
        ENDINGS = window.AH_ENDINGS, loyaltyColor = window.AH_loyaltyColor;

  const PIN = {
    FREEDOM: { e: '🟡', name: 'Freedom / USCT' }, RADICAL: { e: '🔴', name: 'Radical Republicans' },
    COPPERHEAD: { e: '🟠', name: 'Copperheads' }, FIRE_EATER: { e: '⬛', name: 'Fire-eaters' },
    BORDER_UNIONIST: { e: '🔵', name: 'Border Unionists' }, NATIVE: { e: '🟤', name: 'Native nations' },
    IMMIGRANT: { e: '🟢', name: 'Immigrant communities' }, BRITISH: { e: '🟥', name: 'British' },
    FRENCH: { e: '🟣', name: 'French' }, MEXICAN: { e: '🟩', name: 'Mexican republic' }
  };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  const clamp = (v) => Math.max(0, Math.min(100, v));

  /* ---------- sound (tiny WebAudio blips) ---------- */
  const Snd = (() => {
    let ctx, on = true;
    const ensure = () => { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ctx && ctx.state === 'suspended') ctx.resume(); };
    const blip = (freq, dur, type, vol) => {
      if (!on) return; ensure(); if (!ctx) return;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.value = 0; o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime;
      g.gain.linearRampToValueAtTime(vol || 0.06, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.15));
      o.start(t); o.stop(t + (dur || 0.15) + 0.02);
    };
    return {
      toggle() { on = !on; return on; }, isOn() { return on; }, unlock: ensure,
      tick() { blip(520, 0.05, 'square', 0.03); },
      good() { blip(523, 0.12, 'triangle', 0.06); setTimeout(() => blip(784, 0.16, 'triangle', 0.05), 90); },
      bad() { blip(180, 0.22, 'sawtooth', 0.05); },
      pop() { blip(660, 0.07, 'sine', 0.04); },
      choose() { blip(392, 0.09, 'triangle', 0.05); },
      win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.2, 'triangle', 0.06), i * 120)); },
      lose() { [330, 262, 196].forEach((f, i) => setTimeout(() => blip(f, 0.3, 'sawtooth', 0.05), i * 160)); }
    };
  })();

  /* ---------- state ---------- */
  let G = null;
  function newGame(factionId) {
    const f = S.factions.find(x => x.id === factionId);
    const regions = {};
    for (const [k, v] of Object.entries(R0)) regions[k] = Object.assign({ pins: [] }, JSON.parse(JSON.stringify(v)));
    const foreign = {};
    for (const [k, v] of Object.entries(FGN)) foreign[k] = Object.assign({ pins: [], loyalty: 50 }, JSON.parse(JSON.stringify(v)));
    const nodes = S.nodes[factionId] || [];
    const meters = Object.assign({ UNION: 60, FREEDOM: 8 }, (nodes[0] && nodes[0].startMeters) || {});
    G = {
      faction: f, nodes, regions, foreign, meters,
      stats: Object.assign({}, f.stats), flags: new Set(),
      turn: 0, historical: 0, decisions: 0, results: [], albumPins: 0,
      phase: 'situation', pendingFlash: null, ended: null
    };
    return G;
  }

  function applyRecolor(list) {
    if (!list) return;
    for (const rc of list) {
      const reg = G.regions[rc.r] || G.foreign[rc.r];
      if (!reg) continue;
      if (rc.setl != null) reg.loyalty = clamp(rc.setl);
      if (rc.dl != null) reg.loyalty = clamp((reg.loyalty || 0) + rc.dl);
      if (rc.sl) reg.slavery = rc.sl;
      if ('occ' in rc) reg.occupier = rc.occ || null;
      if (rc.rmpin) reg.pins = reg.pins.filter(p => p.group !== rc.rmpin);
      if (rc.pin) { reg.pins = reg.pins.filter(p => p.group !== rc.pin); reg.pins.push({ group: rc.pin, size: rc.size || 1 }); if ((rc.size || 1) >= 3) G.albumPins++; }
    }
  }

  function applyChoice(choice) {
    G.decisions++;
    if (choice.historical) G.historical++;
    if (choice.meterDelta) for (const [k, v] of Object.entries(choice.meterDelta)) G.meters[k] = clamp((G.meters[k] || 0) + v);
    if (choice.meterSet) for (const [k, v] of Object.entries(choice.meterSet)) G.meters[k] = clamp(v);
    if (choice.statDelta) for (const [k, v] of Object.entries(choice.statDelta)) G.stats[k] = clamp((G.stats[k] || 0) + v);
    if (choice.flags) choice.flags.forEach(f => G.flags.add(f));
    // choice-level recolor first
    applyChoice._effRecolors = [];
    if (choice.recolor) applyRecolor(choice.recolor);
    // rolls
    (choice.effects || []).forEach(e => { if (e.roll && Math.random() * 100 < e.roll.pct) G.flags.add(e.roll.flag); });
    if (choice.roll && Math.random() * 100 < choice.roll.pct) G.flags.add(choice.roll.flag);
    G.results.push({ node: G.nodes[G.turn].id, choice: choice.id, historical: !!choice.historical });
  }

  /* ---------- condition resolver ---------- */
  function test(c) {
    if (!c) return false;
    if (c.any) return c.any.some(test);
    if (c.all) return c.all.every(test);
    if (c.flag) return c.not ? !G.flags.has(c.flag) : G.flags.has(c.flag);
    if (c.faction) return G.faction.id === c.faction;
    if (c.meter) { const v = G.meters[c.meter] || 0; return cmp(v, c.op, c.value); }
    if (c.historicalPct) { const p = G.decisions ? (G.historical / G.decisions * 100) : 0; return cmp(p, c.historicalPct.op, c.historicalPct.value); }
    return false;
  }
  function cmp(a, op, b) { return op === '>=' ? a >= b : op === '<=' ? a <= b : op === '>' ? a > b : op === '<' ? a < b : a === b; }
  function resolveEnding() {
    const sorted = ENDINGS.slice().sort((a, b) => b.priority - a.priority);
    for (const e of sorted) if (test(e.cond)) return e;
    return ENDINGS.find(e => e.id === 'E20');
  }

  /* =====================================================================
     RENDER
     ===================================================================== */
  const root = () => document.getElementById('app');

  function switcher() {
    return `<div class="switcher"><span class="sw-ico">☷</span>
      <select id="scenario-switch" aria-label="Switch game">
        <option value="hd" selected>A House Divided · 1850</option>
        <option value="cw">The Cold War · 1947</option>
      </select></div>`;
  }

  function topbar() {
    return `<header class="topbar">
      <a class="brand" href="../../">ar.</a>
      <div class="brand-mid"><span class="bf">BUTTERFLY</span><span class="sub">AN ITIHAS GAME</span></div>
      <div class="top-right">
        <button class="ghost-btn" id="btn-help">How to play</button>
        <button class="ghost-btn" id="btn-sound" aria-label="Sound">${Snd.isOn() ? '🔊' : '🔇'}</button>
        ${switcher()}
      </div></header>`;
  }

  function renderLanding() {
    const cards = S.factions.map((f, i) => `
      <button class="persp ${f.locked ? 'locked' : ''}" data-faction="${f.id}" ${f.locked ? 'disabled' : ''}>
        <span class="persp-emoji" style="--fc:${f.color}">${f.emoji}</span>
        <span class="persp-body">
          <span class="persp-n"><b>${String(i + 1).padStart(2, '0')}</b> ${f.name}</span>
          <span class="persp-seat">${f.seat}</span>
          <span class="persp-tag">${f.tagline}</span>
        </span>
        <span class="persp-go">${f.locked ? 'soon' : '↗'}</span>
      </button>`).join('');
    root().innerHTML = topbar() + `
      <main class="landing">
        <div class="scenario-head">
          <span class="scenario-eyebrow">SCENARIO 02 / A HOUSE DIVIDED</span>
          <span class="scenario-era">${S.era}</span>
          <span class="scenario-meta">${S.meta}</span>
        </div>
        <h1 class="hero-title">One decision.<br><em>A house divided.</em></h1>
        <p class="hero-lede">History happened once. It could have happened differently. Take a faction through the road to civil war and Reconstruction. Make the call. Watch the Union recolor around you.</p>
        <div class="hero-stats"><span><b>6</b> PERSPECTIVES</span><span><b>8</b> DECISIONS</span><span><b>20</b> ENDINGS</span></div>
        <div class="persp-head">01 · CHOOSE YOUR PERSPECTIVE</div>
        <div class="persp-list">${cards}</div>
      </main>
      ${footer()}`;
    wireCommon();
    $$('.persp:not(.locked)').forEach(b => b.addEventListener('click', () => { Snd.unlock(); Snd.choose(); startGame(b.dataset.faction); }));
  }

  function footer() {
    return `<div class="credit">Conceptualized &amp; developed by <strong>Ethan Pianko</strong></div>`;
  }

  /* ---------- state-shape map ---------- */
  function boardHTML() {
    const states = (window.AH_STATE_SHAPES || []).map(state => `
      <g class="state-group" data-region="${state.id}">
        <path class="state-shape${G.regions[state.id] ? '' : ' unrepresented'}" data-region="${state.id}" d="${state.path}" aria-label="${state.name}"><title>${state.name}</title></path>
        <text class="state-label" data-region="${state.id}" x="${state.x}" y="${state.y}">${state.id}</text>
        <text class="state-pins" data-region="${state.id}" x="${state.x}" y="${state.y + 17}"></text>
      </g>`).join('');
    const chips = Object.entries(G.foreign).map(([id, f]) =>
      `<div class="fchip ${f.side}" data-region="${id}" style="--tint:${f.tint}"><span>${f.name}</span></div>`).join('');
    const boardStats = S.stats.map(st => `<div class="map-stat"><div><span>${st.label}</span><b id="map-sv-${st.id}">${Math.round(G.stats[st.id] || 0)}</b></div><div class="map-stat-track"><i id="map-sb-${st.id}" style="width:${Math.max(0, Math.min(100, G.stats[st.id] || 0))}%;background:${G.faction.color}"></i></div></div>`).join('');
    return `<div class="board-wrap">
      <div class="board-map-row"><div class="state-map-wrap">
        <svg class="state-map" viewBox="270 10 835 540" role="img" aria-label="United States state map colored by Union, contested, and Confederate bloc">
          <title>United States bloc map</title>${states}
        </svg>
        <div class="map-source">Present-day outlines from the <a href="https://www.census.gov/geographies/mapping-files/2025/geo/carto-boundary-file.html" target="_blank" rel="noreferrer">U.S. Census Bureau</a> · blocs shift as you play</div>
      </div><aside class="map-health" aria-label="Faction map health">${boardStats}</aside></div>
      <div class="foreign-row">${chips}</div>
      <div class="headlines" id="headlines"></div>
    </div>`;
  }

  function paintBoard() {
    for (const [id, r] of Object.entries(G.regions)) {
      const shape = $(`.state-shape[data-region="${id}"]`);
      const label = $(`.state-label[data-region="${id}"]`);
      const pins = $(`.state-pins[data-region="${id}"]`);
      if (!shape) continue;
      const ghost = r.tier === 'ghost';
      const bloc = ghost ? 'not yet a state' : r.loyalty >= 65 ? 'Union' : r.loyalty >= 40 ? 'contested' : 'Confederate';
      shape.style.fill = ghost ? '#d6d1c5' : loyaltyColor(r.loyalty);
      shape.style.opacity = ghost ? '0.58' : (r.tier === 'terr' ? '0.88' : '1');
      shape.setAttribute('aria-label', `${shape.querySelector('title')?.textContent || id}: ${bloc}`);
      shape.classList.toggle('bloc-union', !ghost && r.loyalty >= 65);
      shape.classList.toggle('bloc-contested', !ghost && r.loyalty >= 40 && r.loyalty < 65);
      shape.classList.toggle('bloc-confederate', !ghost && r.loyalty < 40);
      shape.classList.toggle('bloc-ghost', ghost);
      shape.classList.toggle('slave', r.slavery === 'SLAVE');
      shape.classList.toggle('emancip', r.slavery === 'SELF_EMANCIPATING');
      shape.classList.toggle('abolished', r.slavery === 'ABOLISHED');
      shape.classList.toggle('occ-usa', r.occupier === 'USA');
      shape.classList.toggle('occ-csa', r.occupier === 'CSA');
      shape.classList.toggle('nation', r.tier === 'nation');
      if (label) label.style.fill = r.loyalty < 40 && !ghost ? '#fffdf7' : '#1a1712';
      if (pins) pins.textContent = r.pins.map(pin => PIN[pin.group] ? PIN[pin.group].e : '').join(' ');
    }
    for (const [id, f] of Object.entries(G.foreign)) {
      const c = $(`.fchip[data-region="${id}"]`); if (!c) continue;
      c.querySelector('span').innerHTML = f.name + (f.pins.length ? ' ' + f.pins.map(p => PIN[p.group] ? PIN[p.group].e : '').join('') : '');
    }
  }

  /* ---------- meters + stats ---------- */
  function pixelBar(v, color) {
    const cells = 20, filled = Math.round(v / 100 * cells);
    let s = '';
    for (let i = 0; i < cells; i++) s += `<i class="${i < filled ? 'on' : ''}" style="--bc:${color}"></i>`;
    return `<span class="pbar">${s}</span>`;
  }
  function sidebarHTML() {
    const m = S.meters.map(mt => `
      <div class="meter" data-help="${mt.help.replace(/"/g, '&quot;')}">
        <div class="meter-top"><span>${mt.label}</span><span class="mv" id="mv-${mt.id}">${Math.round(G.meters[mt.id] || 0)}</span></div>
        ${pixelBar(G.meters[mt.id] || 0, mt.id === 'FREEDOM' ? '#f2b134' : '#4f83c2')}
        <button class="i" data-tip="${mt.help.replace(/"/g, '&quot;')}">i</button>
      </div>`).join('');
    const st = S.stats.map(s => `
      <div class="stat" data-help="${s.help.replace(/"/g, '&quot;')}">
        <div class="stat-top"><span>${s.emoji} ${s.label}</span><span class="sv" id="sv-${s.id}">${Math.round(G.stats[s.id] || 0)}</span>
          <button class="i" data-tip="${s.help.replace(/"/g, '&quot;')}">i</button></div>
        ${pixelBar(G.stats[s.id] || 0, G.faction.color)}
      </div>`).join('');
    return `<aside class="sidebar">
      <div class="faction-badge" style="--fc:${G.faction.color}"><span class="fb-e">${G.faction.emoji}</span>
        <span><b>${G.faction.name}</b><small>${G.faction.seat}</small></span></div>
      <div class="meters">${m}</div>
      <div class="legend-h">CONDITION</div>
      <div class="stats">${st}</div>
      <div class="legend">
        <div class="legend-h">MAP</div>
        <div class="lg"><span class="sw" style="background:${loyaltyColor(90)}"></span>Union</div>
        <div class="lg"><span class="sw" style="background:${loyaltyColor(50)}"></span>Contested</div>
        <div class="lg"><span class="sw" style="background:${loyaltyColor(8)}"></span>Confederate</div>
        <div class="lg"><span class="sw" style="background:#cbc6b8"></span>Not in scenario</div>
        <div class="lg"><span class="sw gold"></span>Emancipation</div>
      </div>
    </aside>`;
  }
  function refreshBars() {
    S.meters.forEach(mt => { const v = Math.round(G.meters[mt.id] || 0); const e = $('#mv-' + mt.id); if (e) e.textContent = v; });
    S.stats.forEach(s => { const v = Math.round(G.stats[s.id] || 0); const e = $('#sv-' + s.id); if (e) e.textContent = v; const me = $('#map-sv-' + s.id); if (me) me.textContent = v; const mb = $('#map-sb-' + s.id); if (mb) { mb.style.width = Math.max(0, Math.min(100, v)) + '%'; mb.style.background = G.faction.color; } });
    // rebuild bars
    $$('.meter').forEach((node, i) => { const mt = S.meters[i]; const bar = node.querySelector('.pbar'); if (bar) bar.outerHTML = pixelBar(G.meters[mt.id] || 0, mt.id === 'FREEDOM' ? '#f2b134' : '#4f83c2'); });
    $$('.stat').forEach((node, i) => { const s = S.stats[i]; const bar = node.querySelector('.pbar'); if (bar) bar.outerHTML = pixelBar(G.stats[s.id] || 0, G.faction.color); });
  }
  function bumpMeter(id) { const e = $('#mv-' + id); if (e) { e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); } }

  /* ---------- game screen ---------- */
  function renderGame() {
    root().innerHTML = topbar() + `<main class="game">
      ${sidebarHTML()}
      <section class="stage">
        ${boardHTML()}
        <div class="turn-rail" id="turn-rail"></div>
        <div class="panel" id="panel"></div>
      </section>
    </main>` + footer();
    wireCommon();
    paintBoard();
    renderTurnRail();
    renderSituation();
  }

  function renderTurnRail() {
    const total = G.nodes.length;
    let s = '';
    for (let i = 0; i < total; i++) s += `<span class="trail-dot ${i < G.turn ? 'done' : i === G.turn ? 'now' : ''}">${i + 1}</span>`;
    const rail = $('#turn-rail'); if (rail) rail.innerHTML = `<span class="trail-label">TURN</span>${s}`;
  }

  // check whether a choice is available given current stats and flags
  function lockReason(c) {
    const r = c.requires || {};
    if (r.ECON != null && G.stats.ECON < r.ECON) return `Needs Economy ≥ ${r.ECON} (you have ${Math.round(G.stats.ECON)})`;
    if (r.ARMS != null && G.stats.ARMS < r.ARMS) return `Needs Arms ≥ ${r.ARMS} (you have ${Math.round(G.stats.ARMS)})`;
    if (r.POWER != null && G.stats.POWER < r.POWER) return `Needs Power ≥ ${r.POWER} (you have ${Math.round(G.stats.POWER)})`;
    if (r.UNION != null && G.meters.UNION < r.UNION) return `Needs Union ≥ ${r.UNION}`;
    if (r.FREEDOM != null && G.meters.FREEDOM < r.FREEDOM) return `Needs Freedom ≥ ${r.FREEDOM}`;
    if (r.flags && !r.flags.every(f => G.flags.has(f))) return `Needs an earlier choice: ${r.flags.join(', ')}`;
    if (r.notFlags && r.notFlags.some(f => G.flags.has(f))) return `Closed off by an earlier choice: ${r.notFlags.filter(f => G.flags.has(f)).join(', ')}`;
    return null;
  }

  function renderSituation() {
    G.phase = 'situation';
    const node = G.nodes[G.turn];
    const p = $('#panel');
    const allChoices = [...node.choices, ...(node.lockedChoices || [])];
    const emojiFor = (c) => c.historical ? '🏛️' : (c.id === 'B' ? '🔀' : c.id === 'C' ? '⚡' : c.emoji || '✦');
    const tagFor = (c) => c.historical ? 'HISTORICAL' : (c.counterfactual || 'ROAD NOT TAKEN');
    p.innerHTML = `
      <div class="node-head"><span class="node-year">${node.year}</span><h2>${node.title}</h2></div>
      ${node.intro && G.turn === 0 ? `<p class="node-intro">${node.intro}</p>` : ''}
      <p class="node-sit">${node.situation}</p>
      <div class="choices">${allChoices.map(c => {
        const lock = lockReason(c);
        return `
        <button class="choice${lock ? ' locked' : ''}" data-choice="${c.id}"${lock ? ' aria-disabled="true" title="' + lock.replace(/"/g, '&quot;') + '"' : ''}>
          <span class="choice-k" aria-hidden="true">${lock ? '🔒' : emojiFor(c)}</span>
          <span class="choice-b"><b>${c.label}</b><small>${c.summary}</small><em class="choice-tag">${tagFor(c)}</em>${lock ? '<em class="lock-reason">🔒 ' + lock + '</em>' : ''}</span>
        </button>`;
      }).join('')}</div>`;
    p.classList.remove('ripple'); p.classList.add('enter');
    $$('.choice', p).forEach(b => b.addEventListener('click', () => {
      if (b.classList.contains('locked')) return;
      Snd.unlock();
      onChoose(allChoices.find(c => c.id === b.dataset.choice));
    }));
  }

  function onChoose(choice) {
    Snd.choose();
    const before = { UNION: G.meters.UNION, FREEDOM: G.meters.FREEDOM };
    applyChoice(choice);
    // animate map
    paintBoard();
    $$('.state-shape').forEach(t => { t.classList.remove('flash'); });
    (choice.recolor || []).forEach(rc => { const t = $(`.state-shape[data-region="${rc.r}"]`) || $(`.fchip[data-region="${rc.r}"]`); if (t) { t.classList.add('flash'); } });
    refreshBars();
    bumpMeter('UNION'); bumpMeter('FREEDOM');
    if (G.meters.FREEDOM > before.FREEDOM) Snd.good(); else if (G.meters.UNION < before.UNION - 8) Snd.bad();
    // ripple phase: headlines over the map
    G.phase = 'ripple';
    showRipple(choice);
  }

  function showRipple(choice) {
    const p = $('#panel');
    p.innerHTML = `<div class="ripple-head"><span class="chosen">📜 You chose <b>${choice.label}</b></span></div>
      <div class="ripple-list" id="ripple-list"></div>
      <button class="next-btn" id="next-btn" disabled>Revealing consequences…</button>`;
    p.classList.remove('enter'); p.classList.add('ripple');
    const list = $('#ripple-list'); const board = $('#headlines'); board.innerHTML = '';
    const effs = choice.effects || [];
    let i = 0;
    const reveal = () => {
      if (i >= effs.length) {
        const nb = $('#next-btn'); nb.disabled = false; nb.textContent = hasNext() ? 'Next →' : 'See how it ends →';
        nb.addEventListener('click', advance);
        return;
      }
      const e = effs[i];
      Snd.pop();
      // ripple list row — insight hidden behind a "Why did this happen?" toggle
      const row = el('div', 'ripple-row');
      const insightId = `rr-why-${i}`;
      row.innerHTML = `<span class="rr-place">${e.place}</span>` +
        `<span class="rr-text">${e.text}</span>` +
        (e.insight ? `<button type="button" class="rr-insight-toggle" aria-expanded="false" aria-controls="${insightId}">＋ Why did this happen?</button>` +
                     `<div id="${insightId}" class="rr-why">${e.insight}</div>` : '');
      list.appendChild(row); requestAnimationFrame(() => row.classList.add('in'));
      const toggle = row.querySelector('.rr-insight-toggle');
      if (toggle) {
        toggle.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const why = row.querySelector('.rr-why');
          const open = why.classList.toggle('open');
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          toggle.textContent = (open ? '−' : '＋') + ' Why did this happen?';
        });
      }
      // headline over the region
      placeHeadline(e);
      i++;
      setTimeout(reveal, 780);
    };
    reveal();
  }

  function placeHeadline(e) {
    const board = $('#headlines');
    const tile = $(`.state-shape[data-region="${e.region}"]`) || $(`.fchip[data-region="${e.region}"]`);
    const wrap = $('.board-wrap');
    const h = el('div', 'headline');
    h.innerHTML = `<b>${e.place}</b>${e.text}`;
    board.appendChild(h);
    if (tile && wrap) {
      const tr = tile.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
      let left = Math.max(8, Math.min(wr.width - 8, tr.left - wr.left + tr.width / 2));
      let top = Math.max(4, tr.top - wr.top - 6);
      h.style.left = left + 'px';
      h.style.top = top + 'px';
      // measure and nudge downward to avoid overlapping earlier headlines
      // box (after translate(-50%,-100%)): x=[left-hw/2,left+hw/2], y=[t-hh,t]
      const hw = h.offsetWidth, hh = h.offsetHeight;
      const others = $$('.headline', board).filter(o => o !== h);
      const overlaps = (t) => others.some(o => {
        const ol = o.offsetLeft, ot = o.offsetTop, ow = o.offsetWidth, oh = o.offsetHeight;
        const xo = Math.abs(left - ol) < (hw + ow) / 2 - 4;
        const yo = (t - hh) < (ot + 4) && (ot - oh) < (t + 4);
        return xo && yo;
      });
      let guard = 0;
      while (overlaps(top) && guard++ < 14) top += hh + 6;
      h.style.top = Math.min(top, wr.height - 4) + 'px';
      tile.classList.add('event-dot');
    } else { h.classList.add('float'); }
    requestAnimationFrame(() => h.classList.add('in'));
  }

  function hasNext() {
    return flashAfter(G.turn) || (G.turn + 1 < G.nodes.length);
  }
  function flashAfter(turnIdx) {
    return (S.flashpoints || []).find(f => f.after === G.nodes[turnIdx].turn && !f._done);
  }

  // flags that logically end the scenario before the next war-centered turn
  // (if you averted war in 1861, 1862's "Bloodiest Day" should never arrive)
  const EARLY_END = {
    4: ['PEACEFUL_SEPARATION', 'CRITTENDEN', 'COLD_PEACE', 'NEUTRAL_RECOGNITION'],
    5: ['ARMISTICE_1862'],
    6: ['ARMISTICE_1863'],
    7: ['MCCLELLAN_1864']
  };
  function shouldEndNow() {
    const nodeTurn = G.nodes[G.turn] && G.nodes[G.turn].turn;
    const terminators = EARLY_END[nodeTurn] || [];
    return terminators.some(f => G.flags.has(f));
  }

  function advance() {
    // clear headlines
    $('#headlines').innerHTML = ''; $$('.state-shape.event-dot').forEach(t => t.classList.remove('event-dot'));
    // hard stop
    if (G.meters.UNION <= 15) return endGame();
    // logical cohesion: if the player averted or ended the war, skip remaining war turns
    if (shouldEndNow()) return endGame();
    const fp = flashAfter(G.turn);
    if (fp) { fp._done = true; return renderFlashpoint(fp); }
    G.turn++;
    renderTurnRail();
    if (G.turn >= G.nodes.length) return endGame();
    renderSituation();
  }

  function renderFlashpoint(fp) {
    G.phase = 'flash';
    const p = $('#panel');
    if (fp.cutscene) {
      if (fp.meterDelta) for (const [k, v] of Object.entries(fp.meterDelta)) G.meters[k] = clamp((G.meters[k] || 0) + v);
      if (fp.recolor) applyRecolor(fp.recolor);
      paintBoard(); refreshBars();
      p.innerHTML = `<div class="flash-tag">FLASHPOINT · ${fp.year}</div>
        <h2 class="flash-title">${fp.title}</h2><p class="node-sit">${fp.note || ''}</p>
        <button class="next-btn" id="next-btn">${G.turn + 1 < G.nodes.length ? 'Next →' : 'See how it ends →'}</button>`;
      const e = { place: fp.title.split(':')[0], region: fp.region, text: fp.note || fp.title };
      $('#headlines').innerHTML = ''; placeHeadline(e);
      $('#next-btn').addEventListener('click', () => { $('#headlines').innerHTML = ''; G.turn++; renderTurnRail(); (G.turn >= G.nodes.length) ? endGame() : renderSituation(); });
      return;
    }
    p.innerHTML = `<div class="flash-tag">FLASHPOINT · ${fp.year}</div>
      <h2 class="flash-title">${fp.title}</h2>
      <div class="choices">${fp.options.map((o, k) => `<button class="choice" data-k="${k}"><span class="choice-k">${k + 1}</span><span class="choice-b"><b>${o.label}</b><small>${o.note || ''}</small></span></button>`).join('')}</div>`;
    $$('.choice', p).forEach(b => b.addEventListener('click', () => {
      const o = fp.options[+b.dataset.k]; Snd.choose();
      if (o.meterDelta) for (const [k, v] of Object.entries(o.meterDelta)) G.meters[k] = clamp((G.meters[k] || 0) + v);
      if (o.statDelta) for (const [k, v] of Object.entries(o.statDelta)) G.stats[k] = clamp((G.stats[k] || 0) + v);
      if (o.flags) o.flags.forEach(f => G.flags.add(f));
      if (o.roll && Math.random() * 100 < o.roll.pct) G.flags.add(o.roll.flag);
      if (o.recolor) applyRecolor(o.recolor);
      paintBoard(); refreshBars();
      const e = { place: fp.title.split(':')[0], region: fp.region, text: o.note || o.label };
      $('#headlines').innerHTML = ''; placeHeadline(e);
      p.innerHTML = `<div class="flash-tag">FLASHPOINT · ${fp.year}</div><h2 class="flash-title">${fp.title}</h2>
        <p class="node-sit"><b>${o.label}.</b> ${o.note || ''}</p>
        <button class="next-btn" id="next-btn">${G.turn + 1 < G.nodes.length ? 'Next →' : 'See how it ends →'}</button>`;
      $('#next-btn').addEventListener('click', () => { $('#headlines').innerHTML = ''; G.turn++; renderTurnRail(); (G.turn >= G.nodes.length) ? endGame() : renderSituation(); });
    }));
  }

  /* ---------- ending ---------- */
  function endGame() {
    const e = resolveEnding();
    const cleared = G.meters.UNION > 15;
    (cleared && G.meters.FREEDOM >= 55) ? Snd.win() : Snd.lose();
    const histPct = G.decisions ? Math.round(G.historical / G.decisions * 100) : 0;
    root().innerHTML = topbar() + `<main class="ending">
      <div class="end-card">
        <span class="end-eyebrow">YOUR WORLD · ${G.faction.name}</span>
        <h1 class="end-title">${e.title}</h1>
        <p class="end-body">${e.card}</p>
        <div class="end-meters">
          <div>Union <b>${Math.round(G.meters.UNION)}</b></div>
          <div>Freedom <b>${Math.round(G.meters.FREEDOM)}</b></div>
          <div>Matched history <b>${histPct}%</b></div>
        </div>
        <div class="end-reality"><span class="er-tag">History</span>${e.reality}</div>
        <div class="end-discuss"><span class="er-tag">FAQs</span><ul>${e.discuss.map(d => `<li>${d}</li>`).join('')}</ul></div>
        <div class="end-actions">
          <button class="cta" id="again">Play again</button>
          <button class="ghost-btn" id="switch-cw">Try the Cold War →</button>
        </div>
      </div>
    </main>` + footer();
    wireCommon();
    $('#again').addEventListener('click', renderLanding);
    $('#switch-cw').addEventListener('click', () => location.href = '../');
  }

  function startGame(fid) { newGame(fid); renderGame(); }

  /* ---------- shared wiring ---------- */
  function wireCommon() {
    const sw = $('#scenario-switch');
    if (sw) sw.addEventListener('change', () => { if (sw.value === 'cw') location.href = '../'; });
    const help = $('#btn-help'); if (help) help.addEventListener('click', openHelp);
    const snd = $('#btn-sound'); if (snd) snd.addEventListener('click', () => { const on = Snd.toggle(); snd.textContent = on ? '🔊' : '🔇'; if (on) Snd.tick(); });
    // tooltips
    $$('[data-tip]').forEach(b => {
      b.addEventListener('click', (ev) => { ev.stopPropagation(); showTip(b, b.dataset.tip); });
    });
  }
  function showTip(anchor, text) {
    $$('.tip').forEach(t => t.remove());
    const t = el('div', 'tip', text); document.body.appendChild(t);
    const r = anchor.getBoundingClientRect();
    t.style.left = Math.min(window.innerWidth - 240, r.left) + 'px';
    t.style.top = (r.bottom + 6) + 'px';
    setTimeout(() => document.addEventListener('click', function h() { t.remove(); document.removeEventListener('click', h); }), 0);
  }

  function openHelp() {
    const v = el('div', 'modal-veil');
    v.innerHTML = `<div class="modal">
      <button class="modal-x" aria-label="Close">×</button>
      <h2>How to play</h2>
      <ol class="help-steps">
        <li><b>Pick a perspective.</b> You lead one faction through the road to civil war and Reconstruction, 1850 to 1877.</li>
        <li><b>Read the situation, make one call.</b> Choice <b>A</b> is what actually happened. <b>B</b> and <b>C</b> are roads not taken.</li>
        <li><b>Watch the map.</b> States recolor by loyalty — <span style="color:${loyaltyColor(90)}">Union blue</span> through <span style="color:#bb9b54">contested gold</span> to <span style="color:#a75145">Confederate red</span>. Gold marks emancipation. Dots are movements on the ground.</li>
        <li><b>Mind your meters.</b> <b>Union</b> and <b>Freedom</b> decide your ending; Economy, Arms and Power shape what your choices can do.</li>
        <li><b>Eight decisions, then history judges.</b> One of twenty endings, with what really happened beside it.</li>
      </ol>
      <p class="help-disclaimer">Choice A on each decision is historical; branches B and C are plausible counterfactuals, not facts, and the debrief says which is which. Advisor voices, where they appear, are fictional composites, not quotations.</p>
    </div>`;
    document.body.appendChild(v);
    const close = () => v.remove();
    $('.modal-x', v).addEventListener('click', close);
    v.addEventListener('click', e => { if (e.target === v) close(); });
  }

  // reposition headlines on resize
  window.addEventListener('resize', () => { if (G && G.phase === 'ripple') { /* headlines are transient; skip */ } });

  document.addEventListener('DOMContentLoaded', renderLanding);
})();
