// quick smoke: load, title in portrait+landscape, autoplay N actions with screenshots at scene changes
const { webkit, chromium, devices } = require('playwright'); const path = require('path');
const ENG = process.argv[2] || 'chromium', N = +process.argv[3] || 400, LAND = process.argv[4] === 'land';
(async () => {
  const b = await (ENG === 'webkit' ? webkit : chromium).launch(); const dev = { ...devices[LAND ? 'iPhone 13 landscape' : 'iPhone 13'] }; if (ENG !== 'webkit') delete dev.defaultBrowserType;
  const ctx = await b.newContext(dev); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../HogTied.html')); await p.waitForTimeout(1500);
  const shot = n => p.screenshot({ path: path.join(__dirname, 'tmp', (LAND ? 'L_' : 'P_') + n + '.png') });
  await shot('000_title');
  let lastKey = ''; let k = 0;
  for (let i = 0; i < N; i++) {
    const s = await p.evaluate(() => __HT.state());
    const key = s.chId + ':' + s.step + ':' + s.scene;
    if (key !== lastKey) { await p.waitForTimeout(450); k++; await shot(String(k).padStart(3, '0') + '_' + s.chId + '_' + s.step + '_' + s.scene); lastKey = key; }
    if (s.nErr) { console.log('ERRS', s.errs); break; }
    if (s.closed && s.scene === 'title') { console.log('GAME COMPLETE at action', i); break; }
    await p.evaluate(() => __HT.auto()); await p.waitForTimeout(40);
  }
  const s = await p.evaluate(() => __HT.state()); console.log(JSON.stringify(s)); console.log('pageerrors', errs.slice(0, 10));
  await b.close();
})();
