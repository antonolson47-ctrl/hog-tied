// accusation UX test: wrong picks explain + are rejected; starred key cards solve it first try. node accuse.js [webkit|chromium]
const { webkit, chromium, devices } = require('playwright'); const path = require('path');
const ENG = process.argv[2] || 'webkit';
(async () => { const b = await (ENG === 'webkit' ? webkit : chromium).launch(); let fail = 0;
  for (const land of [false, true]) { const dev = { ...devices[land ? 'iPhone 13 landscape' : 'iPhone 13'] }; if (ENG !== 'webkit') delete dev.defaultBrowserType;
    const ctx = await b.newContext(dev); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(process.argv[3] || ('file://' + path.resolve(__dirname, '../HogTied.html'))); await p.waitForTimeout(1200);
    const P = land ? 'L' : 'P', shot = n => p.screenshot({ path: path.join(__dirname, 'tmp', 'ACC_' + P + '_' + n + '.png') });
    const click = async id => { const ok = await p.evaluate(id => __HT.click(id), id); await p.waitForTimeout(160); if (!ok) { console.log('  missing hit', id); fail++; } };
    await p.evaluate(() => __HT.jump(15, CH[15].steps.findIndex(s => s.t === 'accuse'))); await p.waitForTimeout(500);
    const st = async () => p.evaluate(() => { const A = __HT.rt().acc; return A ? { pick: A.pick, msg: A.msg && A.msg.text, open: A.open } : { scene: __HT.rt().scene }; });
    await click('acc_order'); await click('ao_count'); let s = await st(); console.log(P, 'wrong order ->', s.pick.order, '|', s.msg); if (s.pick.order) fail++;
    await shot('order_wrong'); await click('ao_pettigrew');
    await click('acc_trig'); await click('ao_tank'); s = await st(); console.log(P, 'wrong trig ->', s.pick.trig, '|', s.msg); if (s.pick.trig) fail++; await click('ao_chad');
    await click('acc_why'); await click('ao_c'); s = await st(); console.log(P, 'wrong why ->', s.pick.why, '|', s.msg); await click('ao_a');
    await click('acc_proof'); await shot('proof_open');
    for (const d of ['crabchip', 'golfball', 'chadsticker']) { await click('ao_' + d); s = await st(); console.log(P, 'decoy', d, '->', JSON.stringify(s.pick.proof), '|', s.msg); if (s.pick.proof.length) fail++; }
    await shot('proof_wrong');
    for (const k of ['ledger', 'lautape', 'cane']) await click('ao_' + k);
    s = await st(); console.log(P, 'proof ->', JSON.stringify(s.pick.proof), '|', s.msg); await shot('proof_done');
    await click('acc_pdone'); await shot('ready'); await click('acc_go'); await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({ scene: __HT.rt().scene, step: __HT.gs().step, accused: __HT.gs().flags.accused }));
    console.log(P, 'after ACCUSE:', JSON.stringify(r), 'errors', errs.length); if (!r.accused || errs.length) fail++;
    await ctx.close(); }
  await b.close(); console.log(fail ? 'FAIL ' + fail : 'PASS'); })();
