/* ===================== MINIGAMES: chase, rhythm, shot, fog ===================== */
function gameStart(step, onDone) { RT.gm = { step, onDone, phase: 'intro', t: 0, k: step.kind }; gameBegin(); RT.gm.phase = 'intro'; RT.scene = 'game'; music(step.music || (step.kind === 'rhythm' ? 'dance' : 'chase')); }
function gameBegin() { const G = RT.gm, s = G.step; G.phase = 'play'; G.t = 0; G.hits = 0; G.score = 0; G.cash = 0;
  if (G.k === 'chase') { G.lane = 1; G.lx = 1; G.obs = []; G.spawn = 0; G.dur = s.dur || 32; G.inv = 0; G.prog = 0; }
  if (G.k === 'rhythm') { G.notes = []; const n = s.n || 14, bpm = s.bpm || 104, beat = 60 / bpm; for (let i = 0; i < n; i++) G.notes.push({ t: 2 + i * beat * (i % 4 === 3 ? 2 : 1.5) + (i > 8 ? -i * .05 : 0), d: s.swipe ? pick(['tap', 'left', 'right', 'up']) : 'tap', res: null }); G.end = G.notes[n - 1].t + 1.5; G.good = 0; G.fb = null; }
  if (G.k === 'shot') { G.ammo = s.ammo || 6; G.need = s.need || 3; G.tgt = null; G.tt = 0; G.hitsOn = 0; G.miss = 0; G.flashT = 0; G.next = .8; }
  if (G.k === 'fog') { G.fog = new Uint8Array(24 * 36).fill(1); G.tl = s.time || 25; G.found = false; G.pick = -1; }
}
function gameEnd(win) { const G = RT.gm; G.phase = win ? 'win' : 'lose'; G.t = 0; GS.flags['game_' + (G.step.id || G.step.kind)] = win ? 1 : 0; sfx(win ? 'win' : 'lose'); if (win && G.cash) { GS.cash += G.cash; } if (win && G.step.item) addItem(G.step.item); }
function gameFinish(skipped) { const G = RT.gm; if (skipped) { GS.hours = Math.max(0, GS.hours - 6); bumpFBI(-2); GS.flags['game_' + (G.step.id || G.step.kind)] = 0; } const f = G.onDone; RT.gm = null; f(skipped ? 'skip' : G.phase); }
function drawGame() {
  const G = RT.gm, s = G.step, W = L.W, H = L.H; G.t += DT;
  if (G.k === 'chase') drawChase(G, s); else if (G.k === 'rhythm') drawRhythm(G, s); else if (G.k === 'shot') drawShot(G, s); else if (G.k === 'fog') drawFog(G, s);
  if (G.phase === 'intro' || G.phase === 'win' || G.phase === 'lose') {
    g.save(); g.fillStyle = 'rgba(4,6,16,.35)'; g.fillRect(0, 0, W, H); g.restore(); addHit('gm_bg', 0, 0, W, H, () => {});
    // keep the modal off the characters: bottom in portrait, right side in landscape rhythm games
    const w = Math.min(W - 30, L.portrait ? 400 : (G.k === 'rhythm' ? W * .36 : 400)), h = Math.min(H - 70, L.portrait ? 250 : 290), x = L.portrait ? (W - w) / 2 : (G.k === 'rhythm' ? W - w - 12 : (W - w) / 2), y = L.portrait ? H - h - 14 : (H - h) / 2 + 18; panel(x, y, w, h, { edge: G.phase === 'lose' ? '#ff5a5a' : '#ffd23a', lw: 2.4 });
    if (G.phase === 'intro') { txt(tx(s.title).toUpperCase(), x + w / 2, y + 30, fa(22), '#ffd23a', INK, 4); fitText(tx(s.how), x + 20, y + 56, w - 40, h - 130, px => fo(px, 500), 15, '#fff', 'center'); btn('gm_go', x + w / 2 - 90, y + h - 66, 180, 50, 'GO!', gameBegin, { col: '#c0303a', px: 22 }); }
    else if (G.phase === 'win') { txt(tx(s.winT || 'NAILED IT'), x + w / 2, y + 34, fa(26), '#7aff9a', INK, 4); fitText(tx(s.win || 'Woo Pig! Moving on.'), x + 20, y + 62, w - 40, h - 140, px => fo(px, 500), 15, '#fff', 'center'); if (G.cash) txt('+' + fmt$(G.cash) + ' grabbed', x + w / 2, y + h - 86, fa(14), '#7aff9a', null); btn('gm_ok', x + w / 2 - 90, y + h - 66, 180, 50, 'CONTINUE ▸', () => gameFinish(false), { col: '#1a8a5a' }); }
    else { txt(tx(s.loseT || 'BUSTED'), x + w / 2, y + 34, fa(26), '#ff6a6a', INK, 4); fitText(tx(s.lose || 'That went sideways.'), x + 20, y + 62, w - 40, h - 140, px => fo(px, 500), 15, '#fff', 'center');
      btn('gm_retry', x + 14, y + h - 66, (w - 40) / 2, 50, 'RETRY', () => { G.phase = 'intro'; gameBegin(); }, { col: '#c0303a' }); btn('gm_skip', x + w / 2 + 6, y + h - 66, (w - 40) / 2, 50, 'SKIP', () => gameFinish(true), { col: '#3a4a7a', sub: '−6h, −2 FBI' }); }
  }
  drawHUD();
}
/* ---- chase: pseudo-3D 3-lane road ---- */
function chaseVehicle(kind, x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); const lean = o.lean || 0; g.rotate(lean * .12);
  const body = o.col || '#2266dd';
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); E(0, 4, 46, 8); g.fill();
  if (kind === 'bike') { cel(() => RR(-6, -34, 12, 38, 5), '#222', INK, { lw: 2 }); cel(() => RR(-22, -48, 44, 10, 4), '#888', INK, { lw: 2 }); cel(() => RR(-14, -70, 28, 28, 8), body, INK, { lw: 2.4 }); }
  else if (kind === 'cart') { cel(() => RR(-36, -40, 72, 40, 6), '#f4f0e6', INK, { lw: 2.4 }); cel(() => RR(-38, -82, 76, 8, 3), '#2a7a3a', INK, { lw: 2 }); g.fillStyle = INK; g.fillRect(-34, -76, 4, 36); g.fillRect(30, -76, 4, 36); cel(() => { RR(-40, -6, 14, 12, 3); RR(26, -6, 14, 12, 3); }, '#222', INK, { lw: 2 }); }
  else if (kind === 'sled') { cel(() => { g.moveTo(-34, -6); g.lineTo(34, -6); g.lineTo(26, -36); g.lineTo(-26, -36); g.closePath(); }, '#e8302a', INK, { lw: 2.4 }); cel(() => { RR(-40, -4, 20, 6, 3); RR(20, -4, 20, 6, 3); }, '#bbb', INK, { lw: 2 }); }
  else if (kind === 'boat') { cel(() => { g.moveTo(-40, -30); g.lineTo(40, -30); g.lineTo(28, 4); g.lineTo(-28, 4); g.closePath(); }, '#c8a070', INK, { lw: 2.4 }); cel(() => { g.moveTo(0, -30); g.lineTo(2, -120); g.lineTo(46, -40); g.closePath(); }, '#f2e8d2', INK, { lw: 2 }); }
  else if (kind === 'tuktuk') { cel(() => RR(-34, -70, 68, 70, 10), '#ffd23a', INK, { lw: 2.4 }); cel(() => RR(-28, -64, 56, 24, 6), '#1a2a3a', INK, { lw: 2 }); cel(() => { RR(-38, -8, 14, 12, 3); RR(24, -8, 14, 12, 3); }, '#222', INK, { lw: 2 }); }
  else { /* foot: legs */ const ph = Math.sin(RT.t * 18); cel(() => { RR(-12, -30, 9, 30 + ph * 4, 4); RR(3, -30, 9, 30 - ph * 4, 4); }, '#1a1a24', INK, { lw: 2 }); cel(() => RR(-18, -64, 36, 38, 10), body, INK, { lw: 2.4 }); }
  // rider head from behind: dark slicked bun (Kayleigh) + fedora in noir
  const hy = kind === 'cart' ? -56 : kind === 'boat' ? -48 : kind === 'sled' ? -58 : kind === 'tuktuk' ? -50 : -84;
  if (!o.noRider) { cel(() => RR(-15, hy + 6, 30, 26, 10), o.coat || (kayOutfit() === 'noir' ? NAVY : COBALT), INK, { lw: 2 });
    cel(() => C(0, hy - 6, 13), HAIR_K, INK, { lw: 2.2 }); cel(() => C(0, hy - 18, 7), HAIR_K, INK, { lw: 2 }); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(-6, hy - 14, 3, 10);
    if (kayOutfit() === 'noir') { cel(() => { E(0, hy - 14, 22, 5); RR(-11, hy - 30, 22, 16, 4); }, NAVYD, INK, { lw: 2 }); }
    if (o.kambree) { cel(() => C(26, hy - 2, 11), '#1d1517', INK, { lw: 2 }); cel(() => { E(28, hy - 16, 5, 11); }, '#1d1517', INK, { lw: 1.8 }); g.fillStyle = '#ff5aa8'; g.beginPath(); C(27, hy - 10, 3.5); g.fill(); } }
  g.restore();
}
function obstacle(kind, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); E(0, 2, 36, 7); g.fill();
  if (kind === 'car') { cel(() => RR(-36, -36, 72, 36, 8), '#c0303a', INK, { lw: 2.4 }); cel(() => RR(-26, -54, 52, 22, 6), '#c0303a', INK, { lw: 2 }); g.fillStyle = '#ffda6a'; g.fillRect(-30, -24, 10, 6); g.fillRect(20, -24, 10, 6); }
  else if (kind === 'barrel') { cel(() => RR(-18, -44, 36, 44, 6), '#3a6ad8', INK, { lw: 2.4 }); g.fillStyle = '#ffd23a'; g.fillRect(-18, -32, 36, 4); g.fillRect(-18, -14, 36, 4); }
  else if (kind === 'rock') { cel(() => S([[-34, 0], [-28, -26], [-6, -40], [18, -32], [34, -6], [28, 0]], .7), '#7a7068', INK, { lw: 2.4 }); }
  else if (kind === 'crate') { cel(() => RR(-24, -46, 48, 46, 3), '#b8803a', INK, { lw: 2.4 }); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(-24, -46); g.lineTo(24, 0); g.moveTo(24, -46); g.lineTo(-24, 0); g.stroke(); }
  else if (kind === 'cone') { cel(() => { g.moveTo(-16, 0); g.lineTo(0, -40); g.lineTo(16, 0); g.closePath(); }, '#ff7a1a', INK, { lw: 2.2 }); g.fillStyle = '#fff'; g.fillRect(-8, -20, 16, 5); }
  else if (kind === 'wave') { cel(() => { g.moveTo(-40, 0); g.quadraticCurveTo(-20, -40, 10, -36); g.quadraticCurveTo(-4, -26, 6, -16); g.quadraticCurveTo(24, -4, 40, 0); g.closePath(); }, '#3aa8d8', INK, { lw: 2.2 }); }
  else if (kind === 'goat' || kind === 'llama' || kind === 'cow' || kind === 'yak') { const c = kind === 'llama' ? '#f2e8d2' : kind === 'yak' ? '#3a2a20' : kind === 'cow' ? '#fff' : '#d8c8a8'; cel(() => { RR(-28, -36, 56, 24, 10); RR(-24, -14, 8, 14, 3); RR(16, -14, 8, 14, 3); }, c, INK, { lw: 2.2 }); cel(() => { RR(18, kind === 'llama' ? -70 : -48, 14, kind === 'llama' ? 40 : 18, 6); E(30, kind === 'llama' ? -70 : -48, 10, 8); }, c, INK, { lw: 2 }); }
  else if (kind === 'cash') { const b = Math.sin(RT.t * 6) * 3; cel(() => RR(-16, -30 + b, 32, 18, 3), '#6ab04a', '#1a3a10', { lw: 2 }); txt('$', 0, -21 + b, fa(12), '#1a3a10', null); }
  g.restore();
}
function drawChase(G, s) {
  const W = L.W, H = L.H, hz = H * (L.portrait ? .34 : .3), play = G.phase === 'play';
  drawBG(s.bg || 'black', W, H);
  // road
  const rc = s.road || '#3a3a44', sc = s.side || '#2a5a2a', bw = W * (L.portrait ? 1.1 : .9), tw = W * .06, cx = W / 2;
  g.save(); g.fillStyle = sc; g.fillRect(0, hz, W, H - hz); g.fillStyle = rc; g.beginPath(); g.moveTo(cx - tw, hz); g.lineTo(cx + tw, hz); g.lineTo(cx + bw / 2, H); g.lineTo(cx - bw / 2, H); g.closePath(); g.fill();
  const scroll = (G.t * (play ? 2.2 : .3)) % 1; g.fillStyle = s.stripe || '#f4f0e6';
  for (let i = 0; i < 14; i++) { const z0 = ((i + scroll) / 14), z1 = ((i + .45 + scroll) / 14); const y0 = hz + (H - hz) * z0 * z0, y1 = hz + (H - hz) * z1 * z1; for (const ln of [-1 / 6, 1 / 6]) { const xa = cx + ln * lerp(tw * 2, bw, z0 * z0), xb = cx + ln * lerp(tw * 2, bw, z1 * z1); g.beginPath(); g.moveTo(xa - 1 - z0 * 2, y0); g.lineTo(xa + 1 + z0 * 2, y0); g.lineTo(xb + 1 + z1 * 2, y1); g.lineTo(xb - 1 - z1 * 2, y1); g.fill(); } }
  g.restore();
  const laneX = (lane, z) => cx + (lane - 1) / 3 * lerp(tw * 2, bw, z * z) * 1.0, zY = z => hz + (H - hz) * z * z;
  // target ahead
  const prog = play ? clamp(G.t / G.dur, 0, 1) : G.phase === 'win' ? 1 : 0; const tz = lerp(.12, .62, prog * prog);
  chaseVehicle(s.targetV || s.vehicle, laneX(1 + Math.sin(G.t * 1.3) * .6, tz), zY(tz), lerp(.25, .9, tz) * (L.portrait ? 1 : .8), { col: s.targetCol || '#9d1c2a', noRider: false, coat: s.targetCol || '#9d1c2a' });
  if (s.target) txt(s.target, laneX(1 + Math.sin(G.t * 1.3) * .6, tz), zY(tz) - 130 * lerp(.25, .9, tz) * (L.portrait ? 1 : .8) - 8, fa(11), '#ffb0b0', INK, 3);
  if (play) {
    G.spawn -= DT; if (G.spawn <= 0 && G.t < G.dur - 2) { G.spawn = lerp(1.05, .6, prog); const lanes = shuffle([0, 1, 2]); const nObs = grnd() < .35 + prog * .3 ? 2 : 1; for (let i = 0; i < nObs; i++) G.obs.push({ lane: lanes[i], z: 0, k: pick(s.obs || ['car', 'barrel', 'cone']) }); if (grnd() < .35) G.obs.push({ lane: lanes[2], z: -.05, k: 'cash' }); }
    for (const o of G.obs) o.z += DT * (.55 + prog * .25);
    G.lx = lerp(G.lx, G.lane, 1 - Math.pow(.0001, DT)); G.inv = Math.max(0, G.inv - DT);
    for (const o of G.obs) if (!o.done && o.z > .86 && o.z < .97 && Math.abs(o.lane - G.lx) < .5) { o.done = 1; if (o.k === 'cash') { G.cash += 100; sfx('coin'); } else if (G.inv <= 0) { G.hits++; G.inv = 1.1; sfx('crash'); shake(10); if (G.hits >= 3) gameEnd(false); } }
    G.obs = G.obs.filter(o => o.z < 1.15);
    if (G.t >= G.dur && G.phase === 'play') gameEnd(true);
  }
  const sorted = G.obs.slice().sort((a, b) => a.z - b.z); for (const o of sorted) if (o.z > 0) obstacle(o.k, laneX(o.lane, o.z), zY(o.z), lerp(.15, 1.25, o.z * o.z) * (L.portrait ? 1 : .85));
  const py = H - 30; if (!(G.inv > 0 && Math.floor(G.t * 12) % 2)) chaseVehicle(s.vehicle, laneX(G.lx || 1, .93), py, L.portrait ? 1.05 : .95, { lean: (G.lane - (G.lx || 1)), kambree: GS.party.kambree && s.vehicle !== 'bike' && s.vehicle !== 'foot', col: s.col });
  // progress + hearts
  if (play || G.phase !== 'intro') { const pw = Math.min(W - 120, 300), px = (W - pw) / 2; rr(px, 50, pw, 14, 7, '#0a0e1c', '#2b3c70', 1.2); rr(px + 1, 51, (pw - 2) * prog, 12, 6, '#ffd23a'); txt(s.target ? 'CLOSING ON ' + s.target : 'DISTANCE', W / 2, 74, fa(10.5), '#ffd23a', INK, 3);
    for (let i = 0; i < 3; i++) txt(i < 3 - (G.hits || 0) ? '❤' : '♡', 18 + i * 20, 58, '16px sans-serif', '#ff3a5a', null); txt(fmt$(G.cash || 0), W - 16, 58, fa(13), '#7aff9a', INK, 3, 'right'); }
  if (play) { addHit('ch_l', 0, 40, W / 2, H - 40, () => { G.lane = Math.max(0, G.lane - 1); sfx('swish'); }, { down: 1 }); addHit('ch_r', W / 2, 40, W / 2, H - 40, () => { G.lane = Math.min(2, G.lane + 1); sfx('swish'); }, { down: 1 });
    if (G.t < 3) { txt('◀ TAP LEFT', W * .2, H * .55, fa(14), 'rgba(255,255,255,.8)', INK, 3); txt('TAP RIGHT ▶', W * .8, H * .55, fa(14), 'rgba(255,255,255,.8)', INK, 3); } }
}
function chaseKey(dir) { const G = RT.gm; if (!G || G.k !== 'chase' || G.phase !== 'play') return; G.lane = clamp(G.lane + dir, 0, 2); }
/* ---- rhythm ---- */
function drawRhythm(G, s) {
  const W = L.W, H = L.H, play = G.phase === 'play'; drawBG(s.bg || 'black', W, H);
  const trackH = 92; const lay = L.portrait ? { st: { x: 0, y: 84, w: W, h: H - 84 - trackH - 70 }, ty: H - trackH - 40 } : { st: { x: 0, y: 84, w: W * .62, h: H - 84 }, ty: H * .5 };
  const tx0 = L.portrait ? 0 : W * .62, tw = L.portrait ? W : W * .38;
  const beat = Math.abs(Math.sin(G.t * PI * (s.bpm || 104) / 60));
  const cast = (s.cast || ['kay']).map((id, i) => ({ id, ex: play ? (G.fb && G.fb.ok === false && id === 'kay' ? 'shock' : 'grin') : undefined }));
  g.save(); g.translate(0, -beat * 4); drawStage(lay.st, cast); g.restore();
  // track
  const ty = L.portrait ? lay.ty : lay.ty - trackH / 2; rr(tx0 + 8, ty, tw - 16, trackH, 14, 'rgba(6,8,20,.85)', '#ff5aa8', 2);
  const hitX = tx0 + 60, spd = 190; g.save(); g.strokeStyle = '#ffd23a'; g.lineWidth = 4; g.beginPath(); C(hitX, ty + trackH / 2, 30); g.stroke(); g.restore();
  txt('TAP', hitX, ty + trackH + 14, fa(10), '#ffd23a', null);
  if (play) { for (const n of G.notes) { if (!n.res && G.t - n.t > .22) { n.res = 'miss'; G.fb = { s: 'MISS', ok: false, t: 0 }; sfx('wrong'); } } if (G.t > G.end) gameEnd(G.good >= (s.need || Math.ceil(G.notes.length * .6))); }
  g.save(); g.beginPath(); g.rect(tx0 + 10, ty, tw - 20, trackH); g.clip();
  for (const n of G.notes) { if (n.res && n.res !== 'miss') continue; const x = hitX + (n.t - G.t) * spd; if (x > tx0 + tw + 40 || x < tx0 - 40) continue; const col = n.res === 'miss' ? '#555' : n.d === 'tap' ? '#ff5aa8' : '#5fe3ff'; g.beginPath(); C(x, ty + trackH / 2, 24); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 2.4; g.stroke(); txt(n.d === 'tap' ? (s.glyph || '♥') : n.d === 'left' ? '◀' : n.d === 'right' ? '▶' : '▲', x, ty + trackH / 2 + 1, fa(18), '#fff', INK, 3); }
  g.restore();
  if (G.fb) { G.fb.t += DT; if (G.fb.t < .7) txt(G.fb.s, hitX + 90, ty - 16 - G.fb.t * 20, fa(20), G.fb.ok ? '#7aff9a' : '#ff6a6a', INK, 4); }
  txt('SCORE ' + (G.good || 0) + ' / need ' + (s.need || Math.ceil((s.n || 14) * .6)), tx0 + tw / 2, ty - 14, fa(13), '#fff', INK, 3);
  if (play) addHit('rh_tap', 0, 40, W, H - 40, () => rhythmHit('tap'), { down: 1 });
}
function rhythmHit(dir) { const G = RT.gm; if (!G || G.k !== 'rhythm' || G.phase !== 'play') return; let best = null, bd = 9; for (const n of G.notes) if (!n.res) { const d = Math.abs(n.t - G.t); if (d < bd) { bd = d; best = n; } } if (!best || bd > .3) { return; } const ok = best.d === 'tap' || best.d === dir || dir === 'tap'; if (ok && bd < .1) { best.res = 'perfect'; G.good++; G.fb = { s: 'PERFECT', ok: true, t: 0 }; sfx('hit'); } else if (ok) { best.res = 'good'; G.good++; G.fb = { s: 'GOOD', ok: true, t: 0 }; sfx('hit'); } else { best.res = 'miss'; G.fb = { s: 'WRONG WAY', ok: false, t: 0 }; sfx('wrong'); } }
/* ---- shot / standoff ---- */
function drawShot(G, s) {
  const W = L.W, H = L.H, play = G.phase === 'play'; drawBG(s.bg || 'black', W, H);
  const cover = s.cover || [[.2, .62], [.5, .55], [.8, .64]]; const cw = Math.min(110, W * .22);
  if (play) { G.next -= DT; if (!G.tgt && G.next <= 0) { G.tgt = { i: gi(cover.length), t: 0, life: lerp(1.6, 1.0, G.hitsOn / G.need), bad: grnd() < (s.decoy ? .28 : 0) }; } if (G.tgt) { G.tgt.t += DT; if (G.tgt.t > G.tgt.life) { if (!G.tgt.bad) G.miss++; G.tgt = null; G.next = .5 + grnd() * .6; } } }
  // reticle sway
  const rx = W / 2 + Math.sin(G.t * 1.7) * W * .32 + Math.sin(G.t * 3.1) * W * .06, ry = H * .5 + Math.sin(G.t * 2.3) * H * .12;
  cover.forEach(([fx, fy], i) => { const x = W * fx, y = H * fy; if (G.tgt && G.tgt.i === i) { const up = clamp(Math.min(G.tgt.t * 6, (G.tgt.life - G.tgt.t) * 6), 0, 1); g.save(); g.beginPath(); g.rect(x - cw, y - 200, cw * 2, 200); g.clip(); drawCast(G.tgt.bad ? (s.decoyId || 'chad') : (s.tgtId || 'tank'), x, y + (1 - up) * 140 + 40, .45, { ex: G.tgt.bad ? 'scared' : 'angry' }); g.restore(); if (G.tgt.bad) txt('CIVILIAN', x, y - 120 * up, fa(11), '#7aff9a', INK, 3); }
    if (s.coverKind === 'mascot') coverMascot(x, y, cw); else coverCrate(x - cw / 2, y, cw, 46, s.coverCol || '#8a5a2e'); });
  if (G.flashT > 0) { G.flashT -= DT; g.save(); g.globalAlpha = G.flashT * 3; g.fillStyle = '#fff6c0'; g.fillRect(0, 0, W, H); g.restore(); }
  if (play || G.phase !== 'intro') { g.save(); g.strokeStyle = '#ff3a3a'; g.lineWidth = 2.4; g.beginPath(); C(rx, ry, 26); g.moveTo(rx - 38, ry); g.lineTo(rx - 10, ry); g.moveTo(rx + 10, ry); g.lineTo(rx + 38, ry); g.moveTo(rx, ry - 38); g.lineTo(rx, ry - 10); g.moveTo(rx, ry + 10); g.lineTo(rx, ry + 38); g.stroke(); g.restore();
    txt('AMMO ' + '▮'.repeat(G.ammo || 0), 16, 58, fa(13), '#ffd23a', INK, 3, 'left'); txt('HITS ' + (G.hitsOn || 0) + '/' + (G.need || 3), W - 16, 58, fa(13), '#7aff9a', INK, 3, 'right'); }
  if (play) { btn('fire', W / 2 - 70, H - 70, 140, 54, 'FIRE', () => { if (G.ammo <= 0) return; G.ammo--; G.flashT = .12; sfx('gun'); shake(6); let hit = false; if (G.tgt) { const [fx, fy] = cover[G.tgt.i]; const x = W * fx, y = H * fy - 50; if (Math.hypot(rx - x, ry - y) < 52) { hit = true; if (G.tgt.bad) { toast('THAT WAS A CIVILIAN. −10 FBI', '#ff6a6a'); bumpFBI(-10); } else { G.hitsOn++; burst(x, y, SETTINGS.toned ? 8 : 18, SETTINGS.toned ? ['#fff', '#ffd23a'] : ['#c0102a', '#8a0a14'], { kind: SETTINGS.toned ? 'dot' : 'blood' }); sfx('hit'); } G.tgt = null; G.next = .6; } }
      if (G.hitsOn >= G.need) gameEnd(true); else if (G.ammo <= 0 && !hit) gameEnd(false); else if (G.ammo <= 0 && G.hitsOn < G.need) gameEnd(false); }, { col: '#c0303a', px: 24 }); }
}
/* ---- fog stakeout ---- */
function drawFog(G, s) {
  const W = L.W, H = L.H, play = G.phase === 'play'; drawBG(s.bg || 'reykjavik', W, H);
  const n = 5, by = H * (L.portrait ? .7 : .86), sp = W / (n + 1), sus = s.sus || ['bjarki', 'krill', 'brock', 'sandy', 'chad'], ans = s.ans || 2;
  const order = s.order || [0, 1, 2, 3, 4];
  for (let i = 0; i < n; i++) { const x = sp * (i + 1); drawCast(sus[order[i]], x, by, L.portrait ? .3 : .42); if (order[i] === ans) { g.save(); g.fillStyle = '#9d1c2a'; g.beginPath(); RR(x - 22 * (L.portrait ? .6 : .85), by - 96 * (L.portrait ? .6 : .85) * (L.portrait ? 1 : 1), 44 * (L.portrait ? .6 : .85), 10, 4); g.fill(); g.restore(); } }
  // fog layer: grid of cells; swipe to wipe
  const gw = 24, gh = 36, cwid = W / gw, chei = (H - 40) / gh;
  if (G.fog) { if (!G.fogC) { G.fogC = document.createElement('canvas'); G.fogC.width = gw; G.fogC.height = gh; G.fogX = G.fogC.getContext('2d'); G.fogImg = G.fogX.createImageData(gw, gh); }
    const d = G.fogImg.data, tt = RT.t || 0; for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const k = (j * gw + i) * 4, on = G.fog[j * gw + i], n = Math.sin(i * .9 + tt * .6) * Math.cos(j * .7 - tt * .4); d[k] = 196 + n * 10; d[k + 1] = 210 + n * 10; d[k + 2] = 224 + n * 8; d[k + 3] = on ? 236 + n * 18 : 0; }
    G.fogX.putImageData(G.fogImg, 0, 0); g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(G.fogC, -cwid / 2, 40 - chei / 2, W + cwid, H - 40 + chei); g.restore(); }
  if (play) { G.tl -= DT; if (G.tl <= 0) gameEnd(false); txt('⏱ ' + Math.ceil(G.tl), W - 16, 58, fa(15), '#fff', INK, 3, 'right'); txt(tx(s.clue || 'Wipe the fog. Tap the one wearing the red hog scarf.'), W / 2, 76, fo(12, 600), '#fff', INK, 3);
    if (PTR.down) { const vx = PTR.x, vy = PTR.y; const ci = Math.floor(vx / cwid), cj = Math.floor((vy - 40) / chei); for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { const a = ci + di, b = cj + dj; if (a >= 0 && a < gw && b >= 0 && b < gh && di * di + dj * dj <= 5) G.fog[b * gw + a] = 0; } }
    for (let i = 0; i < n; i++) { const x = sp * (i + 1), s2 = L.portrait ? .3 : .42; addHit('fog' + i, x - 40, by - 300 * s2, 80, 300 * s2, () => { if (!PTR.moved) { if (order[i] === ans) { gameEnd(true); } else { toast(pick(['Wrong guy. That\'s just a cold man.', 'Nope. Innocent fog man.', 'That\'s a mannequin. Woof.']), '#ff9a9a'); G.tl -= 3; sfx('wrong'); } } }); }
    addHit('fog_wipe', 0, 40, W, H - 40, () => {}, {}); HITS.unshift(HITS.pop()); }
}

// wooden crate / hay-bale cover for the standoff
function coverCrate(x, y, w, h, col) {
  cel(() => RR(x, y, w, h, 4), col, INK, { lw: 2.4 });
  g.save(); g.beginPath(); RR(x, y, w, h, 4); g.clip(); g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 2;
  for (let k = 1; k < 3; k++) { g.beginPath(); g.moveTo(x, y + h * k / 3); g.lineTo(x + w, y + h * k / 3); g.stroke(); }
  g.strokeStyle = 'rgba(0,0,0,.34)'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 6, y + h - 4); g.lineTo(x + w - 6, y + 4); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(x, y, w, 5);
  g.strokeStyle = INK; g.lineWidth = 2.4; g.strokeRect(x + 3, y + 3, 8, h - 6); g.strokeRect(x + w - 11, y + 3, 8, h - 6);
  g.restore();
}

// Sooey Louie, the (original) foam hog mascot, used as cover in the finale
function coverMascot(x, y, cw) {
  const w = cw * 1.1, h = 64;
  cel(() => { g.beginPath(); g.ellipse(x, y + h * .55, w / 2, h * .62, 0, 0, Math.PI * 2); }, '#b3121f', INK, { lw: 2.6 });
  cel(() => { g.beginPath(); g.moveTo(x - w * .36, y + 2); g.lineTo(x - w * .22, y - 24); g.lineTo(x - w * .1, y + 4); g.closePath(); }, '#b3121f', INK, { lw: 2.4 });
  cel(() => { g.beginPath(); g.moveTo(x + w * .36, y + 2); g.lineTo(x + w * .22, y - 24); g.lineTo(x + w * .1, y + 4); g.closePath(); }, '#b3121f', INK, { lw: 2.4 });
  cel(() => { g.beginPath(); g.ellipse(x, y + h * .5, w * .17, h * .17, 0, 0, Math.PI * 2); }, '#f6a3b4', INK, { lw: 2.4 });
  g.fillStyle = INK; g.beginPath(); g.arc(x - w * .06, y + h * .5, 3, 0, 7); g.arc(x + w * .06, y + h * .5, 3, 0, 7); g.fill();
  g.beginPath(); g.arc(x - w * .2, y + h * .22, 4, 0, 7); g.arc(x + w * .2, y + h * .22, 4, 0, 7); g.fill();
}
