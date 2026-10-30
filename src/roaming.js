/* Optional dashboard trips. Uses the existing canvas; never intercepts input. */
let activeLumoRoamer = null;
function createLumoRoamer(owner, options) {
  const canvas = options.canvas, homeButton = options.homeButton;
  let portal = null, bubble = null, animation = null, timer = null;
  let state = 'home', epoch = 0, destroyed = false, nextTrip = performance.now() + 6500;
  let target = null, route = [], anchor = null, width = 150, visits = 0, legStart = 0, direction = 0;
  let restUntil = 0, sourcePath = location.pathname, oldHeight = '', oldVisibility = '';
  const listeners = [];
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const visible = el => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(el).visibility !== 'hidden'; };
  function ancestors() {
    const result = []; let el = owner;
    while (el) { result.push(el); el = el.parentElement || (el.getRootNode && el.getRootNode().host); }
    return result;
  }
  function scope() { return ancestors().find(el => el.matches('hui-view,hui-sections-view,hui-masonry-view,hui-panel-view,[data-lumo-scope]')); }
  function blocked() {
    const parents = ancestors();
    if (parents.some(el => /DIALOG|EDIT-MODE|CARD-PREVIEW/.test(el.tagName))) return true;
    const roots = new Set(parents.map(el => el.getRootNode()));
    for (const root of roots) {
      for (const dialog of root.querySelectorAll('ha-dialog,ha-more-info-dialog,hui-dialog-edit-card,hui-dialog-edit-view,hui-dialog-edit-dashboard,[role="dialog"],dialog[open]')) {
        if (visible(dialog)) return true;
        if (dialog.shadowRoot && Array.from(dialog.shadowRoot.querySelectorAll('dialog[open],ha-dialog[open],[role="dialog"]')).some(visible)) return true;
      }
    }
    return false;
  }
  function allowed() {
    const c = options.config();
    return !destroyed && owner.isConnected && c.roaming && !options.reduced() && !document.hidden &&
      location.pathname === sourcePath && !!scope() && visible(owner) && !blocked();
  }
  function idleDelay() {
    return ({relaxed: 75000, normal: 40000, often: 20000}[options.config().roaming_frequency]) * (.85 + Math.random() * .3);
  }
  function updateLabel() { options.onChange(state !== 'home'); }
  function home() {
    epoch++; if (animation) animation.cancel(); animation = null;
    if (portal) {
      homeButton.appendChild(canvas); homeButton.style.height = oldHeight;
      homeButton.style.visibility = oldVisibility; homeButton.disabled = false;
      portal.remove(); portal = null; bubble = null;
    }
    if (activeLumoRoamer === api) activeLumoRoamer = null;
    state = 'home'; target = null; route = []; direction = 0;
    nextTrip = performance.now() + idleDelay(); updateLabel();
  }
  function targets(view) {
    // Inspect geometry only, never read another card's data or private state.
    const rects = [], roots = [view.shadowRoot || view]; let budget = 3000;
    while (roots.length && budget > 0) {
      for (const el of roots.pop().querySelectorAll('*')) {
        if (--budget < 0) break;
        if (el === owner || el === portal) continue;
        if (el.matches('ha-card,lumo-status-card') && visible(el)) {
          const r = el.getBoundingClientRect();
          if (r.width > 80 && r.height > 70 && r.bottom > 90 && r.top < innerHeight - 80 && !owner.contains(el)) rects.push(r);
        }
        if (el.shadowRoot && !el.matches('lumo-companion-card')) roots.push(el.shadowRoot);
      }
    }
    return rects;
  }
  function plan(view) {
    const box = view.getBoundingClientRect();
    const left = Math.max(8, box.left + 6), right = Math.min(innerWidth - width - 8, box.right - width - 6);
    const top = Math.max(72, box.top + 6), bottom = Math.min(innerHeight - width - 64, box.bottom - width - 64);
    if (right < left || bottom < top) return [];
    const point = (x, y) => ({x: clamp(x, left, right), y: clamp(y, top, bottom), scale: 1});
    const cards = targets(view);
    const occupied = cards.concat(Array.from(owner.shadowRoot.querySelectorAll('.heading,.speech,.note,.roam-control')).filter(visible).map(el => el.getBoundingClientRect()));
    let points = [point(right, bottom), point(left, bottom), point(right, top), point(left, top)];
    if (options.config().roaming_area === 'cards') {
      points = cards.flatMap(r => [point(r.right - width, r.bottom + 8), point(r.right + 8, r.top),
        point(r.left - width - 8, r.top), point(r.left, r.top - width - 64)]).concat(points);
    }
    points.push(point(anchor.right - width, anchor.top), point(anchor.left, anchor.bottom - width - 56), point(anchor.right - width, anchor.bottom - width - 56));
    const home = {x: anchor.left, y: anchor.top};
    points = points.filter((p, i, all) => Math.hypot(p.x - home.x, p.y - home.y) > 100 &&
      all.findIndex(q => Math.hypot(p.x - q.x, p.y - q.y) < 50) === i);
    if (!points.length) return [];
    const ownerBox = owner.getBoundingClientRect();
    const outsideHome = points.filter(p => p.x + width * .5 > ownerBox.right + 5 || p.x + width * .5 < ownerBox.left - 5 ||
      p.y + width * .5 > ownerBox.bottom + 5 || p.y + width * .5 < ownerBox.top - 5);
    if (outsideHome.length) points = outsideHome;
    // Prefer empty space beside/below cards. Dense layouts may still be crossed briefly.
    for (const p of points) p.overlap = occupied.reduce((sum, r) => sum +
      Math.max(0, Math.min(p.x + width, r.right - 14) - Math.max(p.x, r.left + 14)) *
      Math.max(0, Math.min(p.y + width + 56, r.bottom - 14) - Math.max(p.y, r.top + 14)), 0);
    points.sort((a, b) => a.overlap - b.overlap);
    const best = points[0].overlap;
    points = points.filter(p => p.overlap <= best + width * width * .08);
    const first = visits++ % Math.min(3, points.length);
    const chosen = [points[first]], second = points.find((p, i) => i !== first && Math.hypot(p.x - chosen[0].x, p.y - chosen[0].y) > 130);
    if (second) chosen.push(second);
    chosen.push({x: anchor.left, y: anchor.top, scale: anchor.width / width, home: true});
    return chosen;
  }
  function transform(p, angle) { return 'translate3d(' + p.x + 'px,' + p.y + 'px,0) scale(' + p.scale + ') rotate(' + angle + 'deg)'; }
  function fly(from, to) {
    state = to.home ? 'returning' : 'flying'; target = to; legStart = performance.now();
    direction = Math.sign(to.x - from.x); updateLabel();
    bubble.hidden = true; portal.dataset.state = state;
    const currentEpoch = epoch, distance = Math.hypot(to.x - from.x, to.y - from.y);
    const duration = clamp(distance / 70 * 1000, 6000, 10500), frames = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60, smooth = t * t * (3 - 2 * t);
      const p = {x: from.x + (to.x - from.x) * smooth,
        y: from.y + (to.y - from.y) * smooth - Math.sin(Math.PI * t) * Math.min(28, Math.max(0, from.y - 74), Math.max(0, to.y - 74)),
        scale: from.scale + (to.scale - from.scale) * smooth};
      frames.push({transform: transform(p, Math.sin(Math.PI * t) * direction * 6), offset: t});
    }
    animation = portal.animate(frames, {duration, fill: 'forwards', easing: 'linear'});
    animation.onfinish = () => {
      if (destroyed || epoch !== currentEpoch || !portal) return;
      portal.style.transform = transform(to, 0); animation.cancel(); animation = null;
      if (to.home) { home(); return; }
      state = 'visiting'; portal.dataset.state = state; updateLabel();
      bubble.textContent = options.text().slice(0, 100); bubble.hidden = !options.config().show_bubble || to.overlap > width * width * .1;
      restUntil = performance.now() + (to.overlap > width * width * .1 ? 2500 : 7000 + Math.random() * 3000);
    };
  }
  function start() {
    if (state !== 'home' || !allowed()) return false;
    const r = canvas.getBoundingClientRect();
    if (r.width < 20 || r.left < 0 || r.top < 65 || r.right > innerWidth || r.bottom > innerHeight - 8) return false;
    if (activeLumoRoamer && activeLumoRoamer !== api) activeLumoRoamer.home();
    anchor = r; width = Math.min(innerWidth < 600 ? 108 : ({small: 110, medium: 135, large: 150}[options.config().size]), innerWidth * .35);
    route = plan(scope()); if (!route.length || !canvas.animate) return false;
    activeLumoRoamer = api; epoch++;
    portal = document.createElement('lumo-flight-overlay'); portal.setAttribute('aria-hidden', 'true'); portal.dataset.lumoFlight = '';
    portal.style.cssText = 'position:fixed;left:0;top:0;width:' + width + 'px;z-index:5;pointer-events:none!important;transform-origin:top left;contain:layout style;';
    const shadow = portal.attachShadow({mode: 'open'});
    shadow.innerHTML = '<style>:host,*{pointer-events:none!important}canvas{display:block;width:100%;height:auto}.bubble{box-sizing:border-box;max-height:56px;overflow:hidden;padding:7px 10px;border:1px solid #8bd7d0;border-radius:12px;background:#10232bef;color:#eefaff;font:11px/1.5 sans-serif;overflow-wrap:anywhere}[hidden]{display:none!important}</style><div class="bubble" hidden></div>';
    bubble = shadow.querySelector('.bubble');
    oldHeight = homeButton.style.height; oldVisibility = homeButton.style.visibility;
    homeButton.style.height = r.height + 'px'; homeButton.style.visibility = 'hidden'; homeButton.disabled = true;
    shadow.insertBefore(canvas, bubble); document.body.appendChild(portal);
    fly({x: r.left, y: r.top, scale: r.width / width}, route.shift());
    return true;
  }
  function interaction(event) {
    const activatingControl = event.type === 'pointerdown' || event.type === 'keydown' && ['Enter', ' '].includes(event.key);
    if (activatingControl && event.composedPath().some(el => el.classList && el.classList.contains('roam-control') && owner.shadowRoot.contains(el))) return;
    home(); nextTrip = performance.now() + Math.max(18000, idleDelay());
  }
  function listen(el, name, handler, capture = false) { el.addEventListener(name, handler, {capture, passive: true}); listeners.push([el, name, handler, capture]); }
  function tick() {
    if (destroyed) return;
    const now = performance.now();
    if (state !== 'home') {
      const current = homeButton.getBoundingClientRect();
      if (!allowed() || Math.abs(current.left - anchor.left) > 20 || Math.abs(current.top - anchor.top) > 20) home();
      else if (state === 'visiting' && now >= restUntil) fly(target, route.shift());
    } else if (allowed() && now >= nextTrip) { if (!start()) nextTrip = now + 7000; }
    timer = setTimeout(tick, 750);
  }
  listen(document, 'pointerdown', interaction, true); listen(document, 'keydown', interaction, true);
  listen(document, 'scroll', interaction, true); listen(window, 'resize', interaction);
  listen(document, 'visibilitychange', () => { if (document.hidden) home(); });
  listen(window, 'popstate', interaction); listen(window, 'hashchange', interaction);
  listen(document, 'pointermove', e => {
    if (!portal) return; const r = portal.getBoundingClientRect();
    if (e.clientX > r.left - 35 && e.clientX < r.right + 35 && e.clientY > r.top - 35 && e.clientY < r.bottom + 35) interaction(e);
  }, true);
  const api = {
    start, home,
    refresh() { if (bubble) { bubble.textContent = options.text().slice(0, 100); bubble.hidden = state !== 'visiting' || !options.config().show_bubble || target.overlap > width * width * .1; } },
    pose: () => ({lookX: state === 'home' ? 0 : direction * 3, lookY: state === 'visiting' ? 2 : 0}),
    inspect: () => ({state, overlay: !!portal, visits, width, pendingAnimation: !!animation}),
    destroy() { destroyed = true; clearTimeout(timer); home(); listeners.forEach(([el, name, fn, capture]) => el.removeEventListener(name, fn, capture)); }
  };
  timer = setTimeout(tick, 750); return api;
}
