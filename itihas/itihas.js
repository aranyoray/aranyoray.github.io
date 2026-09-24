/* ═══════════════════════════════════════════════════════════════
   ITIHAS — game logic
   Place each event into the correct gap on a growing timeline.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const EVENTS = window.ITIHAS_EVENTS || [];
  const MAX_LIVES = 3;
  const STORE = { best: 'itihas.best', games: 'itihas.games' };
  const ERA_LABEL = {
    'ancient': 'Ancient', 'classical': 'Classical', 'medieval': 'Medieval',
    'early-modern': 'Early modern', 'colonial': 'Colonial', 'republic': 'Republic'
  };

  const $ = (id) => document.getElementById(id);
  const el = {
    intro: $('screen-intro'), game: $('screen-game'), veil: $('veil'),
    barStats: $('bar-stats'), lives: $('lives'), score: $('score'),
    timelineWrap: $('timeline-wrap'), timeline: $('timeline'),
    hint: $('hint'), draw: $('draw'), drawEra: $('draw-era'), drawTitle: $('draw-title'),
    drawBlurb: $('draw-blurb'), drawCount: $('draw-count'),
    btnDaily: $('btn-daily'), btnRandom: $('btn-random'), dailyDate: $('daily-date'),
    statBest: $('stat-best'), statGames: $('stat-games'), statDeck: $('stat-deck'),
    endEyebrow: $('end-eyebrow'), endScore: $('end-score'), endSub: $('end-sub'), endStrip: $('end-strip'),
    btnShare: $('btn-share'), btnAgain: $('btn-again'), btnReview: $('btn-review'),
    toast: $('toast'), fx: $('fx')
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── helpers ─────────────────────────────────────────── */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function fmtYear(e) {
    const c = e.approx ? 'c. ' : '';
    if (e.year < 0) return `${c}${-e.year} BCE`;
    if (e.year < 1000) return `${c}${e.year} CE`;
    return `${c}${e.year}`;
  }
  function todayKey() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function todayLabel() {
    return new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (_) { return null; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch])); }
  function toast(msg) {
    el.toast.textContent = msg; el.toast.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => el.toast.classList.remove('show'), 1800);
  }

  /* ── particles ───────────────────────────────────────── */
  const fx = (() => {
    const c = el.fx, ctx = c.getContext('2d');
    let parts = [], raf = 0, dpr = 1;
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    }
    size(); addEventListener('resize', size);
    function tick() {
      ctx.clearRect(0, 0, c.width, c.height);
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.985; p.life -= 0.018; p.r += 0.05;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.col;
        ctx.save(); ctx.translate(p.x * dpr, p.y * dpr); ctx.rotate(p.r);
        ctx.fillRect(-p.s * dpr / 2, -p.s * dpr / 2, p.s * dpr, p.s * dpr * 0.6);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      if (parts.length) raf = requestAnimationFrame(tick); else { raf = 0; ctx.clearRect(0, 0, c.width, c.height); }
    }
    return {
      burst(x, y, n, cols) {
        if (reduceMotion) return;
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 4.5;
          parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, s: 3 + Math.random() * 4, r: Math.random() * 6, life: 0.9 + Math.random() * 0.4, col: cols[i % cols.length] });
        }
        if (!raf) raf = requestAnimationFrame(tick);
      }
    };
  })();

  /* ── state ───────────────────────────────────────────── */
  const S = {
    mode: 'random', seed: 0, deck: [], placed: [], current: null,
    lives: MAX_LIVES, score: 0, results: [], active: 0, busy: false, over: false, total: 0
  };

  /* ── intro ───────────────────────────────────────────── */
  function refreshIntroStats() {
    const best = store(STORE.best), games = store(STORE.games);
    el.statBest.textContent = best ? best : '—';
    el.statGames.textContent = games ? games : '0';
    el.statDeck.textContent = `${EVENTS.length} moments`;
    el.dailyDate.textContent = todayLabel();
  }

  function start(mode) {
    S.mode = mode;
    S.seed = mode === 'daily' ? todayKey() : (Math.random() * 2 ** 31) | 0;
    const rnd = mulberry32(S.seed);
    const order = shuffle(EVENTS, rnd);
    S.placed = [{ ...order[0], seed: true }];
    S.deck = order.slice(1);
    S.total = order.length;
    S.current = null; S.lives = MAX_LIVES; S.score = 0; S.results = []; S.busy = false; S.over = false;

    el.intro.hidden = true; el.game.hidden = false; el.veil.hidden = true; el.veil.classList.remove('peek');
    el.barStats.hidden = false;
    renderLives(); renderScore(false);
    S.active = 1; // to the right of the seed card
    renderTimeline();
    nextCard(true);
    setHint('Tap a gap on the timeline, or drag the card into place.', '');
  }

  /* ── render ──────────────────────────────────────────── */
  function cardHTML(e, extraClass) {
    return `<div class="tcard ${extraClass || ''}" data-era="${e.era}" role="listitem" data-year="${e.year}">
      <div class="tcard-year"><span class="era-dot"></span>${fmtYear(e)}</div>
      <div class="tcard-title">${esc(e.title)}</div>
    </div>`;
  }
  function renderTimeline(opts) {
    opts = opts || {};
    const parts = [];
    S.placed.forEach((e, i) => {
      parts.push(slotHTML(i));
      let cls = e.seed ? 'seed' : (e.miss ? 'miss' : 'hit');
      if (opts.newIndex === i) cls += ' in';
      parts.push(cardHTML(e, cls));
    });
    parts.push(slotHTML(S.placed.length));
    el.timeline.innerHTML = parts.join('');
    setActive(S.active, false);
    if (opts.newIndex !== undefined) {
      const card = el.timeline.querySelectorAll('.tcard')[opts.newIndex];
      if (card) centerOn(card);
    }
  }
  function slotHTML(i) {
    return `<button class="slot" type="button" data-i="${i}" aria-label="Place before position ${i + 1}"></button>`;
  }
  function slots() { return el.timeline.querySelectorAll('.slot'); }
  function setActive(i, scroll) {
    const list = slots();
    S.active = Math.max(0, Math.min(list.length - 1, i));
    list.forEach((s, k) => s.classList.toggle('is-active', k === S.active));
    if (scroll !== false) centerOn(list[S.active]);
  }
  function centerOn(node) {
    if (!node) return;
    const tl = el.timeline;
    const target = node.offsetLeft + node.offsetWidth / 2 - tl.clientWidth / 2;
    tl.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function renderLives() {
    el.lives.querySelectorAll('.life').forEach((l, i) => l.classList.toggle('out', i >= S.lives));
  }
  function renderScore(bump) {
    el.score.textContent = S.score;
    if (bump) { el.score.classList.remove('bump'); void el.score.offsetWidth; el.score.classList.add('bump'); }
  }
  function setHint(text, tone) {
    el.hint.textContent = text;
    el.hint.className = 'hint' + (tone ? ' ' + tone : '');
  }

  function nextCard(first) {
    if (!S.deck.length) return;
    S.current = S.deck.shift();
    const e = S.current;
    const fill = () => {
      el.draw.dataset.era = e.era;
      el.drawEra.textContent = ERA_LABEL[e.era] || e.era;
      el.drawTitle.textContent = e.title;
      el.drawBlurb.textContent = e.blurb;
      el.drawCount.textContent = `card ${S.total - S.deck.length - 1} of ${S.total - 1}`;
      el.draw.classList.remove('out'); el.draw.classList.remove('in');
      void el.draw.offsetWidth; el.draw.classList.add('in');
      S.busy = false;
    };
    if (first || reduceMotion) fill(); else { el.draw.classList.add('out'); setTimeout(fill, 260); }
  }

  /* ── placement ───────────────────────────────────────── */
  function place(i) {
    if (S.busy || S.over || !S.current) return;
    S.busy = true;
    const e = S.current;
    const correct = S.placed.filter((p) => p.year < e.year).length;
    const hit = i === correct;
    const left = S.placed[correct - 1], right = S.placed[correct];

    S.results.push(hit ? 'h' : 'm');
    if (hit) {
      S.score++;
      S.placed.splice(correct, 0, { ...e });
      S.active = correct + 1;
      renderTimeline({ newIndex: correct });
      renderScore(true);
      const card = el.timeline.querySelectorAll('.tcard')[correct];
      setTimeout(() => {
        const r = card.getBoundingClientRect();
        fx.burst(r.left + r.width / 2, r.top + r.height / 2, 26, ['#f1d38a', '#d9a94a', '#f3e9d6', '#b98a2c']);
      }, 220);
      const streak = trailingStreak();
      setHint(`${fmtYear(e)} · ${streak >= 3 ? `${streak} in a row.` : 'Exactly right.'}`, 'good');
    } else {
      S.lives--;
      renderLives();
      // show it where they put it, shake, then slide it home
      S.placed.splice(i, 0, { ...e, miss: true });
      renderTimeline({ newIndex: i });
      const between = left && right ? `between ${fmtYear(left)} and ${fmtYear(right)}`
        : left ? `after ${fmtYear(left)}` : `before ${fmtYear(right)}`;
      setHint(`That was ${fmtYear(e)} — it belongs ${between}.`, 'bad');
      setTimeout(() => {
        S.placed.splice(i, 1);
        S.placed.splice(correct, 0, { ...e, miss: true });
        S.active = correct + 1;
        renderTimeline({ newIndex: correct });
      }, reduceMotion ? 50 : 900);
    }

    const delay = hit ? 420 : (reduceMotion ? 300 : 1500);
    setTimeout(() => {
      if (S.lives <= 0 || !S.deck.length) { finish(); return; }
      nextCard(false);
    }, delay);
  }
  function trailingStreak() {
    let n = 0;
    for (let k = S.results.length - 1; k >= 0 && S.results[k] === 'h'; k--) n++;
    return n;
  }

  /* ── finish ──────────────────────────────────────────── */
  function finish() {
    S.over = true; S.busy = true;
    const games = (parseInt(store(STORE.games) || '0', 10) || 0) + 1;
    store(STORE.games, games);
    const prevBest = parseInt(store(STORE.best) || '0', 10) || 0;
    const isBest = S.score > prevBest;
    if (isBest) store(STORE.best, S.score);

    const cleared = S.lives > 0;
    el.endEyebrow.textContent = cleared ? 'Every card placed' : (S.mode === 'daily' ? `Today’s deck · ${todayLabel()}` : 'The deck closes');
    el.endScore.textContent = S.score;
    el.endSub.textContent = cleared
      ? `You worked through the whole deck with ${S.lives} ${S.lives === 1 ? 'life' : 'lives'} to spare.`
      : isBest ? (prevBest ? `A new best. Your previous record was ${prevBest}.` : 'A first run on the record.')
      : prevBest ? `Your best run is ${prevBest}.` : `${S.placed.length} moments now sit on your timeline.`;
    el.endStrip.innerHTML = S.results.map((r, i) => `<i class="${r}" style="--i:${i}"></i>`).join('');
    el.veil.classList.remove('peek');
    el.veil.hidden = false;
    el.draw.classList.add('out');
    if (cleared) setTimeout(() => fx.burst(innerWidth / 2, innerHeight * 0.35, 90, ['#f1d38a', '#d9a94a', '#f3e9d6', '#58b58b']), 300);
  }

  function shareText() {
    const head = S.mode === 'daily' ? `Itihas · ${todayLabel()}` : 'Itihas';
    const pips = S.results.map((r) => (r === 'h' ? '🟨' : '🟥')).join('');
    return `${head}\n${pips}\n${S.score} placed · ${S.lives > 0 ? 'deck cleared' : `${MAX_LIVES - S.lives} misses`}\naranyoing.com/itihas`;
  }
  async function share() {
    const text = shareText();
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
    } catch (_) { /* fall through to clipboard */ }
    try { await navigator.clipboard.writeText(text); toast('Copied to clipboard'); }
    catch (_) { toast('Could not copy'); }
  }

  /* ── input: tap, keys ────────────────────────────────── */
  el.timeline.addEventListener('click', (ev) => {
    const s = ev.target.closest('.slot');
    if (!s) return;
    setActive(+s.dataset.i, false);
    place(S.active);
  });
  el.draw.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); place(S.active); }
  });
  document.addEventListener('keydown', (ev) => {
    if (el.game.hidden || S.over) return;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); setActive(S.active - 1); }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); setActive(S.active + 1); }
    else if (ev.key === 'Home') { ev.preventDefault(); setActive(0); }
    else if (ev.key === 'End') { ev.preventDefault(); setActive(9999); }
    else if ((ev.key === 'Enter' || ev.key === ' ') && document.activeElement !== el.draw && !ev.target.closest('button')) { ev.preventDefault(); place(S.active); }
  });

  /* ── input: drag ─────────────────────────────────────── */
  (function drag() {
    let ghost = null, startX = 0, startY = 0, lifted = false, over = null, pid = null, autoScroll = 0;
    function overSlot(x, y) {
      const n = document.elementFromPoint(x, y);
      return n ? n.closest('.slot') : null;
    }
    function setOver(s) {
      if (over === s) return;
      if (over) over.classList.remove('is-over');
      over = s;
      if (over) { over.classList.add('is-over'); setActive(+over.dataset.i, false); }
    }
    function edgeScroll(x) {
      const r = el.timelineWrap.getBoundingClientRect();
      const m = 70;
      autoScroll = x < r.left + m ? -(r.left + m - x) / m * 14 : x > r.right - m ? (x - (r.right - m)) / m * 14 : 0;
    }
    function loop() {
      if (!lifted) return;
      if (autoScroll) el.timeline.scrollLeft += autoScroll;
      requestAnimationFrame(loop);
    }
    el.draw.addEventListener('pointerdown', (ev) => {
      if (S.busy || S.over || ev.button > 0) return;
      pid = ev.pointerId; startX = ev.clientX; startY = ev.clientY; lifted = false;
      el.draw.setPointerCapture(pid);
    });
    el.draw.addEventListener('pointermove', (ev) => {
      if (pid !== ev.pointerId) return;
      if (!lifted) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < 8) return;
        lifted = true;
        ghost = document.createElement('div');
        ghost.className = 'ghost'; ghost.dataset.era = S.current.era;
        ghost.innerHTML = `<div class="tcard-year"><span class="era-dot"></span>? ? ? ?</div><div class="tcard-title">${esc(S.current.title)}</div>`;
        document.body.appendChild(ghost);
        el.draw.classList.add('lifted'); el.timeline.classList.add('dragging');
        el.timeline.style.scrollBehavior = 'auto';
        requestAnimationFrame(loop);
      }
      ghost.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px) translate(-50%,-50%) rotate(-2deg)`;
      setOver(overSlot(ev.clientX, ev.clientY));
      edgeScroll(ev.clientX);
    });
    function release(ev) {
      if (pid !== ev.pointerId) return;
      pid = null;
      if (!lifted) { if (ev.type === 'pointerup') place(S.active); return; }
      const target = over;
      setOver(null);
      lifted = false; autoScroll = 0;
      if (ghost) { ghost.remove(); ghost = null; }
      el.draw.classList.remove('lifted'); el.timeline.classList.remove('dragging');
      el.timeline.style.scrollBehavior = '';
      if (target && ev.type === 'pointerup') place(+target.dataset.i);
    }
    el.draw.addEventListener('pointerup', release);
    el.draw.addEventListener('pointercancel', release);
  })();

  /* ── buttons ─────────────────────────────────────────── */
  el.btnDaily.addEventListener('click', () => start('daily'));
  el.btnRandom.addEventListener('click', () => start('random'));
  el.btnShare.addEventListener('click', share);
  el.btnAgain.addEventListener('click', () => {
    el.veil.hidden = true; el.game.hidden = true; el.barStats.hidden = true;
    el.intro.hidden = false; refreshIntroStats();
    el.intro.querySelectorAll('.reveal').forEach((n) => { n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; });
  });
  el.btnReview.addEventListener('click', () => {
    const peek = el.veil.classList.toggle('peek');
    el.btnReview.textContent = peek ? 'Back to results' : 'Review the timeline';
  });

  refreshIntroStats();
})();
