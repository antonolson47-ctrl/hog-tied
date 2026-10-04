// live-site check: node live.js [webkit|chromium] [url]
const { webkit, chromium, devices } = require('playwright'); const path = require('path');
const ENG = process.argv[2] || 'webkit', URL = process.argv[3] || 'https://antonolson47-ctrl.github.io/hog-tied/';
(async () => { const b = await (ENG === 'webkit' ? webkit : chromium).launch();
  for (const land of [false, true]) { const dev = { ...devices[land ? 'iPhone 13 landscape' : 'iPhone 13'] }; if (ENG !== 'webkit') delete dev.defaultBrowserType;
    const ctx = await b.newContext(dev); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL); await p.waitForTimeout(2000); await p.screenshot({ path: path.join(__dirname, 'tmp', 'LIVE_' + (land ? 'L' : 'P') + '_title.png') });
    for (let i = 0; i < 80; i++) { await p.evaluate(() => __HT.auto()); await p.waitForTimeout(40); }
    await p.waitForTimeout(400); await p.screenshot({ path: path.join(__dirname, 'tmp', 'LIVE_' + (land ? 'L' : 'P') + '_after80.png') });
    const s = await p.evaluate(() => __HT.state()); console.log(land ? 'landscape' : 'portrait', s.chId, s.step, s.scene, 'nErr', s.nErr, 'pageerrors', errs.length); await ctx.close(); }
  await b.close(); })();
