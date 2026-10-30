const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..'), output = path.join(root, 'test-results');
fs.mkdirSync(output, {recursive: true});
(async () => {
  let browser; try { browser = await chromium.launch({headless: true, channel: 'chrome'}); } catch (_) { browser = await chromium.launch({headless: true}); }
  const checks = [], errors = [], external = [];
  const pass = name => checks.push(name);
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => {
      const u = new URL(route.request().url());
      if (u.origin !== 'http://lumo.test') { external.push(u.href); return route.abort(); }
      if (u.pathname === '/lumo-cards.js') return route.fulfill({path: path.join(root, 'dist/lumo-cards.js'), contentType: 'text/javascript'});
      return route.fulfill({contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:80px 24px 24px;background:#101820;color:#eefaff;font-family:Arial}hui-sections-view{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;min-height:800px}#rooms{display:grid;gap:18px}ha-card{display:block}button#under{position:fixed;z-index:1;background:#263e4b;color:white;padding:15px;border:1px solid #8bd7d0}@media(max-width:600px){body{padding:80px 12px 12px}hui-sections-view{grid-template-columns:1fr}}</style><hui-sections-view></hui-sections-view><script src="/lumo-cards.js"></script>'});
    });
    await page.goto('http://lumo.test/home');
    await page.evaluate(() => {
      window.calls = []; window.clicks = 0;
      window.fixture = {language: 'en', connected: true, user: {id: 'sample'}, states: {
        'sensor.sample': {state: '21.7', attributes: {friendly_name: 'Living room', unit_of_measurement: '°C'}},
        'media_player.sample': {state: 'playing', attributes: {media_title: 'Midnight Orbit', media_artist: 'Sample music'}}
      }, callService: () => calls.push('service')};
      window.make = (config = {}) => { const c = document.createElement('lumo-companion-card'); c.setConfig({type: 'custom:lumo-companion-card', name: 'Lumo', entity: 'media_player.sample', ...config}); c.hass = fixture; document.querySelector('hui-sections-view').prepend(c); return c; };
      window.robot = make(); window.originalCanvas = robot.shadowRoot.querySelector('canvas');
      for (let i = 0; i < 4; i++) { const c = document.createElement('lumo-status-card'); c.setConfig({type: 'custom:lumo-status-card', kind: 'sensor', entity: 'sensor.sample', name: ['Living room', 'Energy', 'Weather', 'Kitchen'][i]}); c.hass = fixture; document.querySelector('hui-sections-view').append(c); }
    });
    await page.waitForFunction(() => robot.inspect().renderer.ready);
    assert.equal(await page.locator('lumo-flight-overlay').count(), 0);
    assert.equal(await page.locator('lumo-companion-card .roam-control').isVisible(), false);
    pass('Existing configurations remain card-bound by default');
    await page.evaluate(() => { robot.setConfig({type: 'custom:lumo-companion-card', roaming: true, entity: 'media_player.sample', greeting: 'Your home. Your companion.'}); window.before = robot.getBoundingClientRect().height; });
    await page.locator('lumo-companion-card .roam-control').click();
    assert.equal(await page.locator('lumo-flight-overlay').count(), 1);
    assert.equal(await page.evaluate(() => document.querySelector('lumo-flight-overlay').shadowRoot.querySelector('canvas') === originalCanvas), true);
    assert.equal(await page.evaluate(() => Math.abs(robot.getBoundingClientRect().height - before) < 1), true);
    assert.equal(await page.evaluate(() => robot.inspect().playing), true);
    pass('Trip uses the original dancing canvas without duplicating the renderer or shifting cards');
    const first = await page.locator('lumo-flight-overlay').getAttribute('style');
    await page.waitForTimeout(900);
    const moved = await page.evaluate(() => { const el = document.querySelector('lumo-flight-overlay'), a = el.getAnimations()[0]; return {frames: a.effect.getKeyframes().length, duration: a.effect.getTiming().duration, now: a.currentTime, rect: el.getBoundingClientRect().toJSON()}; });
    assert.equal(moved.frames, 61); assert.ok(moved.duration >= 6000 && moved.duration <= 10500); assert.ok(moved.now > 500);
    assert.ok(moved.rect.left >= 0 && moved.rect.right <= 1441 && moved.rect.top >= 65);
    pass('Slow multi-frame flight is running and remains inside the visible viewport');
    await page.waitForFunction(() => robot.inspect().roaming.state === 'visiting', {timeout: 14000});
    const hit = await page.evaluate(() => { const el = document.querySelector('lumo-flight-overlay'), r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; return {pointer: getComputedStyle(el).pointerEvents, hit: document.elementFromPoint(x, y) !== el, state: robot.inspect().roaming.state}; });
    assert.equal(hit.pointer, 'none'); assert.equal(hit.hit, true);
    assert.equal(await page.evaluate(() => { const p = document.querySelector('lumo-flight-overlay').getBoundingClientRect(), r = robot.getBoundingClientRect(); const x = p.left + p.width / 2, y = p.top + p.width / 2; return x < r.left || x > r.right || y < r.top || y > r.bottom; }), true);
    await page.screenshot({path: path.join(output, 'roaming-desktop.png'), fullPage: false});
    pass('Character reaches a card visit and the overlay cannot receive pointer input');
    await page.evaluate(() => { fixture.states = {}; fixture.user.id = 'new-sample-user'; robot.hass = fixture; });
    assert.match(await page.locator('lumo-flight-overlay .bubble').textContent(), /missing/);
    pass('A withdrawn entity immediately clears old song text from the floating bubble');
    await page.evaluate(() => { const d = document.createElement('div'); d.setAttribute('role', 'dialog'); d.style.cssText = 'position:fixed;inset:100px;background:#234;z-index:20'; d.id = 'sample-dialog'; document.body.append(d); });
    await page.waitForFunction(() => !robot.inspect().roaming.overlay);
    assert.equal(await page.evaluate(() => robot.shadowRoot.querySelector('canvas') === originalCanvas), true);
    await page.evaluate(() => document.getElementById('sample-dialog').remove());
    pass('Opening a dialog restores the original canvas to its card');
    await page.locator('lumo-companion-card .roam-control').click();
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('lumo-flight-overlay').count(), 0);
    await page.waitForTimeout(1000); assert.equal(await page.locator('lumo-flight-overlay').count(), 0);
    pass('Keyboard interaction returns Lumo home and prevents immediate relaunch');
    await page.locator('lumo-companion-card .roam-control').click();
    await page.evaluate(() => document.dispatchEvent(new Event('scroll', {bubbles: true})));
    assert.equal(await page.locator('lumo-flight-overlay').count(), 0);
    pass('Scrolling immediately yields the screen');
    await page.locator('lumo-companion-card .roam-control').click();
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.waitForFunction(() => !robot.inspect().roaming.overlay);
    assert.equal(await page.evaluate(() => robot._roamer.start()), false);
    await page.emulateMedia({reducedMotion: 'no-preference'});
    pass('System reduced-motion disables dashboard flight, including an active trip');
    await page.evaluate(() => { window.second = make({roaming: true}); robot._roamer.start(); second._roamer.start(); });
    assert.equal(await page.locator('lumo-flight-overlay').count(), 1);
    assert.equal(await page.evaluate(() => robot.inspect().roaming.overlay), false);
    assert.equal(await page.evaluate(() => second.inspect().roaming.overlay), true);
    await page.evaluate(() => second.remove()); assert.equal(await page.locator('lumo-flight-overlay').count(), 0);
    pass('Multiple cards coordinate one traveler; deleting its owner removes the overlay');
    await page.evaluate(() => { robot._roamer.start(); history.pushState({}, '', '/different-dashboard'); });
    await page.waitForFunction(() => !robot.inspect().roaming.overlay);
    assert.equal(await page.evaluate(() => robot._roamer.start()), false);
    await page.evaluate(() => history.replaceState({}, '', '/home'));
    pass('Navigation cannot leave a traveler on another dashboard');
    await page.evaluate(() => { const wrap = document.createElement('hui-card-edit-mode'); robot.replaceWith(wrap); wrap.append(robot); });
    assert.equal(await page.evaluate(() => robot._roamer.start()), false);
    await page.evaluate(() => { const wrap = robot.parentElement; wrap.replaceWith(robot); });
    pass('Edit-mode wrappers keep the character in its card');
    await page.setViewportSize({width: 390, height: 844});
    await page.evaluate(() => { fixture.states['media_player.sample'] = {state: 'playing', attributes: {media_title: 'Midnight Orbit'}}; robot.hass = fixture; window.scrollTo(0, 0); });
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => robot._roamer.start()), true, 'Mobile trip starts after viewport settles');
    await page.waitForFunction(() => robot.inspect().roaming.state === 'visiting', {timeout: 14000});
    const mobile = await page.locator('lumo-flight-overlay').evaluate(el => el.getBoundingClientRect().toJSON());
    assert.ok(mobile.left >= 0 && mobile.right <= 391 && mobile.top >= 72 && mobile.bottom <= 844);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await page.screenshot({path: path.join(output, 'roaming-phone.png'), fullPage: false});
    pass('Phone trips stay within bounds without horizontal overflow');
    await page.evaluate(() => { window.oldRenderer = robot._frame; robot.remove(); window.stoppedFrames = oldRenderer.inspect().frames; });
    await page.waitForTimeout(1000);
    assert.equal(await page.locator('lumo-flight-overlay').count(), 0);
    assert.equal(await page.evaluate(() => oldRenderer.inspect().frames), await page.evaluate(() => stoppedFrames));
    pass('Removing a traveling card cancels its animation, timer and renderer');
    await page.evaluate(() => { window.automatic = make({roaming: true, roaming_area: 'edges', roaming_frequency: 'relaxed'}); });
    await page.waitForFunction(() => automatic.inspect().roaming.overlay);
    await page.setViewportSize({width: 400, height: 844});
    await page.waitForFunction(() => !automatic.inspect().roaming.overlay);
    await page.evaluate(() => automatic.remove());
    pass('Automatic trips launch without a click; resizing yields immediately');
    assert.deepEqual(await page.evaluate(() => calls), []); assert.deepEqual(errors, []); assert.deepEqual(external, []);
    pass('No script errors, external requests or device calls');
    fs.writeFileSync(path.join(output, 'roaming-results.json'), JSON.stringify({checks, errors, external}, null, 2));
    console.log(JSON.stringify({roamingPassed: checks.length, errors: errors.length, external: external.length}));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
