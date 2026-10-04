/* ===================== STAGE LAYOUT + STORY PLAYER ===================== */
// portrait: stage on top, panel at bottom. landscape: stage left, panel right. Panel NEVER overlaps character art.
function stageLayout(panelH = 200) {
  const W = L.W, H = L.H, top = 44;
  if (L.portrait) { const ph = clamp(panelH, 150, H * .5); const p = { x: 8, y: H - ph - 8, w: W - 16, h: ph }; return { stage: { x: 0, y: top, w: W, h: p.y - top - 4 }, panel: p }; }
  const pw = clamp(W * .46, 300, 420); const p = { x: W - pw - 8, y: top + 6, w: pw, h: H - top - 14 }; return { stage: { x: 0, y: top, w: p.x - 6, h: H - top }, panel: p };
}
// draw up to 3 characters standing on the stage floor. list: [{id, ex, flip, dim}]
function drawStage(st, list, o = {}) {
  const n = list.length; if (!n) return;
  const maxS = o.maxS || 1.12; let s = Math.min(maxS, (st.h - 6) / 318, st.w / (n === 1 ? 250 : n === 2 ? 400 : n === 3 ? 560 : 640));
  const by = st.y + st.h + (o.sink || 0);
  list.forEach((c, i) => {
    const fx = n === 1 ? .5 : n === 2 ? [.27, .73][i] : n === 3 ? [.18, .5, .82][i] : [.15, .42, .68, .88][i]; let x = st.x + st.w * fx;
    const ss = s * (c.id === 'kd' ? .78 : c.id === 'cocoa' ? .8 : c.id === 'hawke' ? .82 : 1);
    const bob = Math.sin(RT.t * 1.6 + i * 2) * 1.4 + (c.talk ? Math.abs(Math.sin(RT.t * 9)) * 1.2 : 0);
    g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); E(x, by - 2, 80 * ss, 10 * ss); g.fill(); g.restore();
    drawCast(c.id, x, by + bob, ss, { ex: c.ex, flip: c.flip, badge: c.badge, alpha: c.dim ? .78 : 1 });
    if (c.dim) { /* subtle dim */ }
    c._x = x; c._top = by - 312 * ss; c._s = ss;
  });
}

/* --------- story runner --------- */
// a story is a flat array of lines/directives; nested choice/if branches are spliced in.
function storyStart(lines, onDone, o = {}) {
  RT.story = { q: lines.slice(), i: -1, cur: null, onDone, on: o.on || [], bg: o.bg || (CH[GS.ch] && CH[GS.ch].bg) || 'black', typed: 0, t: 0, choice: null, card: null, flash: 0 };
  RT.scene = 'story'; storyNext();
}
function storyApply(d) {
  const S = RT.story;
  if (d.on) S.on = d.on.map(c => typeof c === 'string' ? { id: c } : Object.assign({}, c));
  if (d.ex) for (const k in d.ex) { const c = S.on.find(c => c.id === k); if (c) c.ex = d.ex[k]; }
  if (d.bg) S.bg = d.bg;
  if (d.music) music(d.music);
  if (d.sfx) sfx(d.sfx);
  if (d.shake) shake(d.shake);
  if (d.flash) S.flash = 1, S.flashC = d.flash;
  if (d.set) Object.assign(GS.flags, d.set);
  if (d.party) Object.assign(GS.party, d.party);
  if (d.clue) addClue(d.clue);
  if (d.item) addItem(d.item);
  if (d.cash) { GS.cash = Math.max(0, GS.cash + d.cash); toast((d.cash > 0 ? '+' : '−') + fmt$(Math.abs(d.cash)), d.cash > 0 ? '#7aff9a' : '#ff9a9a'); }
  if (d.heat) bumpHeat(d.heat);
  if (d.fbi) bumpFBI(d.fbi);
  if (d.street) GS.street = clamp(GS.street + d.street, 0, 100);
  if (d.hours) GS.hours = Math.max(0, GS.hours + d.hours);
  if (d.outfit) { GS.outfitPref = d.outfit; SPR.clear(); }
  if (d.suspect) for (const k in d.suspect) GS.suspects[k] = d.suspect[k];
  if (d.toast) toast(d.toast, '#ffd23a');
  if (d.fn) d.fn();
}
function storyNext() {
  const S = RT.story; if (!S) return;
  while (true) {
    S.i++; const d = S.q[S.i];
    if (d === undefined) { const f = S.onDone; RT.story = null; if (f) f(); return; }
    if (Array.isArray(d)) { S.cur = { who: d[0], text: d[1], ex: d[2] }; S.typed = 0; S.t = 0;
      const raw = typeof d[1] === 'string' ? d[1] : d[1].r;
      if (d[2]) { const c = S.on.find(c => c.id === d[0]); if (c) c.ex = d[2]; }
      if (GS.party.kd && S.on.some(c => c.id === 'kd') && d[0] !== 'kd' && d[0] !== 'n' && SWEAR_TEST.test(raw)) { GS.swear++; S.swearPop = 1; sfx('coin'); }
      sfx('blip'); return; }
    if (d.choice) { S.choice = d.choice.filter(c => !c.req || c.req()); S.cur = d.prompt ? { who: d.who || 'n', text: d.prompt } : S.cur; S.typed = 999; return; }
    if (d.if !== undefined) { const ok = typeof d.if === 'function' ? d.if() : !!GS.flags[d.if]; const br = ok ? d.then : d.else; if (br) S.q.splice(S.i + 1, 0, ...br); continue; }
    if (d.card) { S.card = d.card; S.cur = null; S.t = 0; if (d.card.sfx) sfx(d.card.sfx); return; }
    storyApply(d);
    if (d.wait) { S.cur = null; S.waitT = d.wait; return; }
  }
}
function storyChoose(c) { const S = RT.story; S.choice = null; if (c.then) S.q.splice(S.i + 1, 0, ...c.then); if (c.thenFn) S.q.splice(S.i + 1, 0, ...c.thenFn()); storyApply(c); sfx('tap'); storyNext(); }
function storyTap() {
  const S = RT.story; if (!S || S.choice) return;
  if (S.card) { if (S.t < .35) return; S.card = null; storyNext(); return; }
  if (!S.cur) { storyNext(); return; }
  const full = tx(S.cur.text); if (S.typed < full.length) { S.typed = full.length; return; }
  storyNext();
}
function speakerName(who) { if (who === 'n') return 'KAYLEIGH (V.O.)'; if (who === '*') return ''; if (who === 'kay') return GS.flags.noir && kayOutfit() === 'noir' ? 'KAYLEIGH' : 'KAYLEIGH'; return (CAST[who] && CAST[who].name) || who.toUpperCase(); }
function drawStory() {
  const S = RT.story, W = L.W, H = L.H; S.t += DT; if (S.waitT) { S.waitT -= DT; if (S.waitT <= 0) { S.waitT = 0; storyNext(); } }
  const nCh = S.choice ? S.choice.length : 0;
  const lay = stageLayout(S.choice ? 96 + nCh * 50 : 196), st = lay.stage, p = lay.panel;
  drawBG(S.bg, W, H);
  if (S.card) { drawCard(S.card, S.t); addHit('story_card', 0, 0, W, H, storyTap); drawHUD(); return; }
  const list = S.on.map(c => Object.assign({}, c, { talk: S.cur && S.cur.who === c.id && S.typed < tx(S.cur.text).length, dim: S.cur && S.cur.who !== c.id && S.cur.who !== 'n' && S.cur.who !== '*' && S.on.length > 1 }));
  drawStage(st, list);
  // speaker marker (small triangle above head, never on the face)
  // panel
  addHit('story_tap', 0, 40, W, H - 40, storyTap);
  panel(p.x, p.y, p.w, p.h, { edge: S.cur && CAST[S.cur.who] ? CAST[S.cur.who].col : '#2b3c70', lw: 2 });
  let ty = p.y + 12;
  if (S.cur) {
    const nm = speakerName(S.cur.who), col = S.cur.who === 'n' ? '#9fd0ff' : (CAST[S.cur.who] && CAST[S.cur.who].col) || '#fff';
    if (nm) { const nw = textW(nm, fa(13)) + 22; rr(p.x + 10, ty - 2, nw, 22, 6, darken(col, .55), col, 1.4); txt(nm, p.x + 10 + nw / 2, ty + 9.5, fa(13), '#fff', null); ty += 28; }
    const full = tx(S.cur.text); S.typed = Math.min(full.length, S.typed + DT * 55); const shown = full.slice(0, Math.floor(S.typed));
    const isN = S.cur.who === 'n' || S.cur.who === '*';
    const fh = S.choice ? Math.max(36, p.h - 30 - nCh * 50 - (ty - p.y)) : p.h - (ty - p.y) - 26;
    const fF = isN ? (px => ft(px)) : (px => fo(px, 500));
    // measure with full text so layout doesn't jump while typing
    let px = L.portrait ? 16 : 15, lines; for (; px >= 10; px -= .5) { lines = wrapLines(full, p.w - 28, fF(px)); if (lines.length * px * 1.32 <= fh) break; }
    g.save(); g.font = fF(px); g.fillStyle = isN ? '#cfe0ff' : '#f4f6ff'; g.textBaseline = 'top'; let left = shown.length;
    lines.forEach((l, i) => { if (left <= 0) return; const part = l.slice(0, left); left -= l.length + 1; g.fillText(part, p.x + 14, ty + i * px * 1.32); }); g.restore();
    ty += lines.length * px * 1.32 + 8;
    if (!S.choice && S.typed >= full.length) { const a = .5 + .5 * Math.sin(RT.t * 5); txt('▼ TAP', p.x + p.w - 30, p.y + p.h - 13, fa(10), `rgba(255,210,58,${a})`, null); }
  }
  if (S.choice) {
    const bh = 42, gap = 8; let by = p.y + p.h - 10 - nCh * (bh + gap) + gap;
    S.choice.forEach((c, i) => { btn('ch' + i, p.x + 10, by, p.w - 20, bh, tx(c.t), () => storyChoose(c), { col: c.col || ['#2266dd', '#7a3aa8', '#b8402a', '#1a8a5a'][i % 4], px: 14, sub: c.sub ? tx(c.sub) : null }); by += bh + gap; });
  }
  if (S.swearPop) { S.swearPop -= DT * .6; const a = clamp(S.swearPop * 2, 0, 1); g.save(); g.globalAlpha = a; const sx = L.portrait ? W - 112 : st.w - 116, sy = 48; rr(sx, sy, 104, 40, 10, 'rgba(20,14,0,.9)', '#ffd23a', 1.6); txt('🫙', sx + 18, sy + 21, '18px sans-serif', '#fff', null); txt('SWEAR JAR', sx + 62, sy + 14, fa(10), '#ffd23a', null); txt('KD: "+$1!"', sx + 62, sy + 29, fo(10, 600), '#fff', null); g.restore(); }
  if (S.flash > 0) { S.flash -= DT * 2.5; g.save(); g.globalAlpha = clamp(S.flash, 0, 1); g.fillStyle = S.flashC === true ? '#fff' : S.flashC; g.fillRect(0, 0, W, H); g.restore(); }
  drawHUD();
}
// full-screen cards: chapter title, notes, postcards, texts
function drawCard(c, t) {
  const W = L.W, H = L.H; g.save(); g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, 0, W, H); g.restore();
  const a = easeOut(t * 3); g.save(); g.globalAlpha = a;
  if (c.kind === 'note' || c.kind === 'postcard' || c.kind === 'text') {
    const w = Math.min(W - 40, 360), h = Math.min(H - 120, c.h || 300), x = (W - w) / 2, y = (H - h) / 2 + 10;
    if (c.kind === 'text') { rr(x, y, w, h, 22, '#0e1020', '#4a5a90', 2); rr(x + 12, y + 12, w - 24, 30, 10, '#1a2040'); txt(c.from || 'UNKNOWN NUMBER', x + w / 2, y + 27, fo(12, 600), '#9fd0ff', null);
      fitText(tx(c.text), x + 22, y + 58, w - 44, h - 90, px => fo(px, 500), 16, '#fff'); }
    else { paper(x, y, w, h, c.rot || -.015, c.kind === 'postcard' ? '#fff6e0' : '#efe4c8');
      if (c.title) txt(tx(c.title), x + w / 2, y + 26, c.kind === 'postcard' ? fm(20) : fa(18), c.kind === 'postcard' ? '#c03a6a' : '#3a1a10', null);
      fitText(tx(c.text), x + 20, y + (c.title ? 50 : 22), w - 40, h - (c.title ? 74 : 46), c.font === 'marker' ? fm : c.font === 'type' ? ft : (px => fm(px)), c.px || 17, c.col || '#2a1a10', c.align || 'left');
      if (c.kind === 'postcard') { g.save(); g.translate(x + w - 46, y + h - 40); g.rotate(-.2); mochiMeow(0, 0, .5); g.restore(); } }
  } else if (c.kind === 'dossier') { drawDossier(c);
  } else if (c.kind === 'chapter') {
    vgrad(0, 0, W, H, [[0, 'rgba(5,7,26,.6)'], [.5, 'rgba(5,7,26,.9)'], [1, 'rgba(5,7,26,.6)']]);
    const cy = H * .42; txt('CHAPTER ' + c.n, W / 2, cy - 54, fa(18), '#5fe3ff', INK, 3);
    let px = 42; while (px > 18 && textW(tx(c.title).toUpperCase(), fa(px)) > W - 40) px -= 1; txt(tx(c.title).toUpperCase(), W / 2, cy, fa(px), '#fff', INK, 6);
    txt(c.city, W / 2, cy + 40, fo(16, 600), '#ffd23a', INK, 3);
    if (c.solo) { rr(W / 2 - 120, cy + 62, 240, 26, 13, 'rgba(255,90,168,.18)', '#ff5aa8', 1.4); txt('KAYLEIGH-ONLY CITY · KD & COCOA AT GIGI\'S', W / 2, cy + 75.5, fo(10, 600), '#ffb0d8', null); }
    if (c.tag) fitText(tx(c.tag), 30, cy + 100, W - 60, 60, ft, 14, '#cfe0ff', 'center');
  } else { // generic caption
    const w = Math.min(W - 40, 380); panel((W - w) / 2, H * .35, w, H * .3, { edge: '#ffd23a' }); fitText(tx(c.text), (W - w) / 2 + 20, H * .35 + 20, w - 40, H * .3 - 40, ft, 18, '#fff', 'center'); }
  g.restore();
  if (t > .5) { const al = .5 + .5 * Math.sin(RT.t * 5); txt('TAP TO CONTINUE', W / 2, H - 26, fa(12), `rgba(255,210,58,${al})`, null); }
}

// FBI file card with a mugshot (used to introduce Tank Dobbins)
function drawDossier(c) {
  const W = L.W, H = L.H, wide = !L.portrait, w = Math.min(W - 32, wide ? 640 : 380), h = Math.min(H - 84, c.h || 420), x = (W - w) / 2, y = (H - h) / 2 + 8;
  paper(x, y, w, h, -.01, '#efe4c8');
  g.save(); g.fillStyle = '#9d1c2a'; g.fillRect(x + 14, y + 12, w - 28, 26); g.restore();
  txt(tx(c.title), x + w / 2, y + 25, fa(wide ? 17 : 15), '#fff', null);
  const pw = wide ? 150 : 124, ph = wide ? h - 70 : 140, px = x + 18, py = y + 48;
  g.save(); g.fillStyle = '#c9ccd2'; g.fillRect(px, py, pw, ph); g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1; for (let k = 1; k < 7; k++) { const ly = py + ph * k / 7; g.beginPath(); g.moveTo(px, ly); g.lineTo(px + pw, ly); g.stroke(); }
  g.beginPath(); g.rect(px, py, pw, ph); g.clip(); const s = Math.min(pw / 150, ph / 150); drawCast(c.who, px + pw / 2, py + 256 * s, s, { ex: "tired" }); g.restore();
  g.save(); g.strokeStyle = INK; g.lineWidth = 2.5; g.strokeRect(px, py, pw, ph); g.restore();
  g.save(); g.translate(px + pw - 26, py + ph - 18); g.rotate(-.25); g.strokeStyle = '#c0102a'; g.lineWidth = 2.5; g.strokeRect(-34, -11, 68, 22); txt('WITNESS?', 0, 1, fa(12), '#c0102a', null); g.restore();
  if (wide) fitText(tx(c.text), px + pw + 16, py, w - pw - 52, h - 66, ft, 15, '#2a1a10', 'left');
  else { const name = (CAST[c.who] && CAST[c.who].name) || ''; txt(name, px + pw + (w - pw - 36) / 2 + 8, py + ph / 2 - 8, fa(18), '#3a1a10', null); txt('KNOWN AS: TRANSPORT', px + pw + (w - pw - 36) / 2 + 8, py + ph / 2 + 14, fo(11, 600), '#9d1c2a', null);
    fitText(tx(c.text), x + 18, py + ph + 12, w - 36, h - ph - 70, ft, 14, '#2a1a10', 'left'); }
}
