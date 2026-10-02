/* Research Studio — shared site behaviour: theme, nav, experiment filters, hero figure. */
(function () {
  'use strict';

  var root = document.documentElement;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
    return value;
  }

  /* ---------- Theme ---------- */

  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function effectiveTheme() {
    return root.getAttribute('data-theme') || (darkQuery && darkQuery.matches ? 'dark' : 'light');
  }

  function syncThemeButtons() {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      btn.title = 'Switch to ' + next + ' theme';
    });
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    if (root.hasAttribute('data-theme-lock')) {
      btn.hidden = true;
      return;
    }
    btn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('rs-theme', next);
      syncThemeButtons();
    });
  });
  if (darkQuery && darkQuery.addEventListener) darkQuery.addEventListener('change', syncThemeButtons);
  syncThemeButtons();

  /* ---------- Mobile nav ---------- */

  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('[data-nav-toggle]');

  function setNav(open) {
    if (!header || !navToggle) return;
    header.setAttribute('data-open', String(open));
    navToggle.setAttribute('aria-expanded', String(open));
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(header.getAttribute('data-open') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.getAttribute('data-open') === 'true') {
        setNav(false);
        navToggle.focus();
      }
    });
    header.querySelectorAll('.site-nav a').forEach(function (link) {
      link.addEventListener('click', function () { setNav(false); });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setNav(false);
    });
  }

  /* ---------- Experiment filters ---------- */

  var filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) initFilters(filterRoot);

  function initFilters(scope) {
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.card[data-track]'));
    var search = scope.querySelector('[data-filter-search]');
    var status = scope.querySelector('[data-filter-status]');
    var empty = scope.querySelector('[data-filter-empty]');
    var reset = scope.querySelector('[data-filter-reset]');
    var trackButtons = scope.querySelectorAll('[data-filter-track]');
    var kindButtons = scope.querySelectorAll('[data-filter-kind]');

    var params = new URLSearchParams(window.location.search);
    var state = {
      track: params.get('track') || 'all',
      kind: params.get('kind') || 'all',
      q: params.get('q') || ''
    };
    if (search) search.value = state.q;

    function press(buttons, attr, value) {
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute(attr) === value));
      });
    }

    function writeUrl() {
      var next = new URLSearchParams();
      if (state.track !== 'all') next.set('track', state.track);
      if (state.kind !== 'all') next.set('kind', state.kind);
      if (state.q) next.set('q', state.q);
      var qs = next.toString();
      history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
    }

    function apply() {
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = card.getAttribute('data-search') || '';
        var ok = (state.track === 'all' || card.getAttribute('data-track') === state.track) &&
          (state.kind === 'all' || card.getAttribute('data-kind') === state.kind) &&
          terms.every(function (t) { return haystack.indexOf(t) !== -1; });
        card.hidden = !ok;
        if (ok) shown += 1;
      });
      press(trackButtons, 'data-filter-track', state.track);
      press(kindButtons, 'data-filter-kind', state.kind);
      if (status) status.textContent = 'Showing ' + shown + ' of ' + cards.length + ' experiments';
      if (empty) empty.hidden = shown !== 0;
      writeUrl();
    }

    trackButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-filter-track');
        state.track = state.track === value && value !== 'all' ? 'all' : value;
        apply();
      });
    });
    kindButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-filter-kind');
        state.kind = state.kind === value && value !== 'all' ? 'all' : value;
        apply();
      });
    });
    if (search) {
      search.addEventListener('input', function () {
        state.q = search.value.trim();
        apply();
      });
    }
    if (reset) {
      reset.addEventListener('click', function () {
        state = { track: 'all', kind: 'all', q: '' };
        if (search) search.value = '';
        apply();
      });
    }
    apply();
  }

  /* ---------- Hero figure: the studio as a terrain ---------- */

  var terrain = document.querySelector('[data-terrain]');
  var terrainData = document.getElementById('terrain-data');
  if (terrain && terrainData) {
    try {
      drawTerrain(terrain, JSON.parse(terrainData.textContent));
    } catch (e) {
      /* The figure is decorative; the same links exist in the page body. */
    }
  }

  function drawTerrain(svg, data) {
    var NS = 'http://www.w3.org/2000/svg';
    var W = 600;
    var H = 420;
    var STEP = 10;
    var CENTERS = {
      spatial: [150, 135],
      math: [392, 262],
      language: [482, 104],
      tools: [170, 322]
    };

    var maxCount = Math.max.apply(null, data.tracks.map(function (t) { return t.count; }).concat([1]));
    var hills = data.tracks.filter(function (t) { return CENTERS[t.id]; }).map(function (t) {
      return {
        id: t.id,
        label: t.code + ' · ' + t.short,
        count: t.count,
        x: CENTERS[t.id][0],
        y: CENTERS[t.id][1],
        amp: 0.35 + 0.65 * (t.count / maxCount),
        sigma: 46 + 13 * Math.sqrt(t.count)
      };
    });

    function field(x, y) {
      var v = 0.05 * Math.sin(x / 47) * Math.cos(y / 39) + 0.03 * Math.sin((x + y) / 23);
      for (var i = 0; i < hills.length; i++) {
        var h = hills[i];
        var dx = x - h.x;
        var dy = y - h.y;
        v += h.amp * Math.exp(-(dx * dx + dy * dy) / (2 * h.sigma * h.sigma));
      }
      return v;
    }

    var cols = W / STEP + 1;
    var rows = H / STEP + 1;
    var grid = new Array(cols * rows);
    var min = Infinity;
    var max = -Infinity;
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var v = field(i * STEP, j * STEP);
        grid[j * cols + i] = v;
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }

    // Marching squares. Corner bits: tl = 8, tr = 4, br = 2, bl = 1.
    var CASES = {
      1: [['l', 'b']], 2: [['b', 'r']], 3: [['l', 'r']], 4: [['t', 'r']],
      5: [['l', 't'], ['b', 'r']], 6: [['t', 'b']], 7: [['l', 't']], 8: [['l', 't']],
      9: [['t', 'b']], 10: [['t', 'r'], ['l', 'b']], 11: [['t', 'r']], 12: [['l', 'r']],
      13: [['b', 'r']], 14: [['l', 'b']]
    };

    function lerp(a, b, level) {
      return b === a ? 0.5 : (level - a) / (b - a);
    }

    function contour(level) {
      var d = [];
      for (var j = 0; j < rows - 1; j++) {
        for (var i = 0; i < cols - 1; i++) {
          var tl = grid[j * cols + i];
          var tr = grid[j * cols + i + 1];
          var br = grid[(j + 1) * cols + i + 1];
          var bl = grid[(j + 1) * cols + i];
          var idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
          var segs = CASES[idx];
          if (!segs) continue;
          var x0 = i * STEP;
          var y0 = j * STEP;
          var pts = {
            t: [x0 + lerp(tl, tr, level) * STEP, y0],
            r: [x0 + STEP, y0 + lerp(tr, br, level) * STEP],
            b: [x0 + lerp(bl, br, level) * STEP, y0 + STEP],
            l: [x0, y0 + lerp(tl, bl, level) * STEP]
          };
          for (var s = 0; s < segs.length; s++) {
            var a = pts[segs[s][0]];
            var b = pts[segs[s][1]];
            d.push('M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1));
          }
        }
      }
      return d.join('');
    }

    function el(name, attrs, parent) {
      var node = document.createElementNS(NS, name);
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
      if (parent) parent.appendChild(node);
      return node;
    }

    var LEVELS = 12;
    var lines = el('g', { 'class': 'terrain__lines', fill: 'none', 'stroke-linecap': 'round' }, svg);
    for (var n = 1; n <= LEVELS; n++) {
      var level = min + (max - min) * (n / (LEVELS + 1));
      el('path', { d: contour(level), 'class': n % 4 === 0 ? 'terrain__index' : 'terrain__line' }, lines);
    }

    // Plot frame ticks, like a figure in a paper.
    var ticks = el('g', { 'class': 'terrain__ticks' }, svg);
    var tickPath = [];
    for (var x = 50; x < W; x += 50) tickPath.push('M' + x + ' 0v6M' + x + ' ' + H + 'v-6');
    for (var y = 50; y < H; y += 50) tickPath.push('M0 ' + y + 'h6M' + W + ' ' + y + 'h-6');
    el('path', { d: tickPath.join('') }, ticks);

    var labels = el('g', { 'class': 'terrain__labels' }, svg);
    var dots = el('g', { 'class': 'terrain__dots' }, svg);
    hills.forEach(function (h, hIndex) {
      var members = data.experiments.filter(function (e) { return e.track === h.id; });
      var spread = h.sigma * 0.36;
      var lowestY = h.y;
      members.forEach(function (exp, k) {
        var r = spread * Math.sqrt(k + 0.5);
        var theta = k * 2.399963 + hIndex * 1.3;
        var cx = Math.max(16, Math.min(W - 16, h.x + r * Math.cos(theta)));
        var cy = Math.max(16, Math.min(H - 16, h.y + r * Math.sin(theta)));
        lowestY = Math.min(lowestY, cy);
        var link = el('a', { href: exp.url, 'class': 'track-' + h.id, tabindex: '-1' }, dots);
        el('circle', { cx: cx.toFixed(1), cy: cy.toFixed(1), r: 6 }, link);
        el('title', {}, link).textContent = exp.title;
      });
      var text = el('text', { x: h.x, y: Math.max(18, lowestY - 16), 'text-anchor': 'middle' }, labels);
      text.textContent = h.label + ' (' + h.count + ')';
    });
  }
})();
