// targeted screenshots: node shots.js [chromium|webkit] name:ch:step[:autoN[:js]] ...
const { webkit, chromium, devices } = require('playwright'); const path = require('path');
const ENG = process.argv[2] || 'chromium'; const specs = process.argv.slice(3);
(async () => {
  const b = await (ENG === 'webkit' ? webkit : chromium).launch();
  for (const land of [false, true]) {
    const dev = { ...devices[land ? 'iPhone 13 landscape' : 'iPhone 13'] }; if (ENG !== 'webkit') delete dev.defaultBrowserType;
    const ctx = await b.newContext(dev); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.resolve(__dirname, '../HogTied.html')); await p.waitForTimeout(1200);
    for (const sp of specs) {
      const [name, ch, step, n = 0, js = ''] = sp.split(':');
      if (ch !== '-') await p.evaluate(([c, s]) => { __HT.jump(+c, +s); }, [ch, step]);
      await p.waitForTimeout(300);
      for (let i = 0; i < +n; i++) { await p.evaluate(() => __HT.auto()); await p.waitForTimeout(60); }
      if (js) await p.evaluate(js);
      await p.waitForTimeout(900);
      await p.screenshot({ path: path.join(__dirname, 'tmp', 'S_' + (land ? 'L_' : 'P_') + name + '.png') });
      const s = await p.evaluate(() => __HT.state()); if (s.nErr) console.log(name, 'ERR', s.errs);
    }
    console.log(land ? 'landscape' : 'portrait', 'done', errs.slice(0, 5)); await ctx.close();
  }
  await b.close();
})();
