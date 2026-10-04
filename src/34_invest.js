/* ===================== INVESTIGATION, CRIME SCENES, DEDUCTION BOARD, FLIGHT BOARD ===================== */
function clueIcon(kind, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s); g.lineJoin = 'round';
  const ol = (f, c = INK, lw = 2) => { g.fillStyle = f; g.fill(); g.strokeStyle = c; g.lineWidth = lw; g.stroke(); };
  switch (kind) {
    case 'note': g.rotate(-.12); g.beginPath(); g.rect(-14, -18, 28, 36); ol('#f2e8d2'); g.fillStyle = '#c0102a'; for (let i = 0; i < 4; i++) g.fillRect(-9, -11 + i * 7, i % 2 ? 14 : 18, 3); break;
    case 'coin': g.beginPath(); C(0, 0, 15); ol('#f4c445', '#5a3a08'); g.beginPath(); C(0, 0, 10); g.strokeStyle = '#a8801a'; g.lineWidth = 1.5; g.stroke(); txt('🐗', 0, 1, '12px sans-serif', '#000', null); break;
    case 'receipt': g.beginPath(); g.moveTo(-10, -18); g.lineTo(10, -18); g.lineTo(10, 16); for (let i = 0; i < 5; i++) g.lineTo(10 - i * 5 - 2.5, i % 2 ? 16 : 19); g.lineTo(-10, 16); g.closePath(); ol('#fafafa'); g.fillStyle = '#777'; for (let i = 0; i < 5; i++) g.fillRect(-7, -13 + i * 5, 14 - (i % 2) * 5, 2); break;
    case 'phone': g.beginPath(); RR(-10, -18, 20, 36, 4); ol('#1a1a24'); g.fillStyle = '#5fe3ff'; g.fillRect(-7, -14, 14, 24); g.fillStyle = '#fff'; g.fillRect(-4, -9, 8, 2); break;
    case 'key': g.beginPath(); C(-8, 0, 8); ol('#d8b040'); g.beginPath(); g.rect(0, -3, 18, 6); ol('#d8b040'); g.fillStyle = '#d8b040'; g.fillRect(12, 2, 3, 6); g.fillStyle = '#2a1a08'; g.beginPath(); C(-8, 0, 3); g.fill(); break;
    case 'photo': g.rotate(.1); g.beginPath(); g.rect(-15, -15, 30, 32); ol('#fff'); g.fillStyle = '#3a5a8a'; g.fillRect(-12, -12, 24, 20); g.fillStyle = '#f0c0a0'; g.beginPath(); C(0, -3, 5); g.fill(); break;
    case 'drive': g.beginPath(); RR(-7, -16, 14, 26, 3); ol('#2a6ad8'); g.beginPath(); g.rect(-5, 10, 10, 8); ol('#c8c8d0'); break;
    case 'tape': g.beginPath(); RR(-17, -11, 34, 22, 3); ol('#222'); g.fillStyle = '#e8e2d0'; g.fillRect(-13, -8, 26, 7); g.beginPath(); C(-7, 4, 4); C(7, 4, 4); ol('#888', INK, 1.2); break;
    case 'card': g.beginPath(); RR(-16, -10, 32, 20, 3); ol('#141418'); g.fillStyle = '#f4c445'; g.fillRect(-12, -5, 8, 6); txt('VIP', 6, 3, fa(8), '#f4c445', null); break;
    case 'print': g.fillStyle = 'rgba(30,20,10,.85)'; for (const [px, py, r] of [[0, 4, 7], [-8, -6, 3.4], [-3, -10, 3.4], [3, -10, 3.4], [8, -6, 3.4]]) { g.beginPath(); C(px, py, r); g.fill(); } break;
    case 'ticket': g.rotate(-.08); g.beginPath(); RR(-18, -9, 36, 18, 3); ol('#ffd23a'); g.setLineDash([2, 2]); g.beginPath(); g.moveTo(8, -8); g.lineTo(8, 8); g.strokeStyle = INK; g.stroke(); g.setLineDash([]); txt('✈', -4, 1, '11px sans-serif', INK, null); break;
    case 'glass': g.beginPath(); g.moveTo(-9, -16); g.lineTo(9, -16); g.lineTo(6, 4); g.lineTo(1, 6); g.lineTo(1, 14); g.lineTo(7, 16); g.lineTo(-7, 16); g.lineTo(-1, 14); g.lineTo(-1, 6); g.lineTo(-6, 4); g.closePath(); ol('rgba(220,240,255,.6)'); g.fillStyle = '#8a0a2a'; g.fillRect(-7, -8, 14, 8); g.fillStyle = '#c0405a'; g.beginPath(); E(-6, -14, 3, 2); g.fill(); break;
    case 'cigar': g.rotate(-.3); g.beginPath(); RR(-18, -4, 36, 8, 4); ol('#7a4a22'); g.fillStyle = '#c8302a'; g.fillRect(4, -4, 5, 8); g.fillStyle = '#ff8a3a'; g.beginPath(); C(-18, 0, 3); g.fill(); break;
    case 'feather': g.rotate(.5); g.beginPath(); g.moveTo(0, -18); g.quadraticCurveTo(10, -4, 0, 18); g.quadraticCurveTo(-10, -4, 0, -18); ol('#e8e2d0'); g.beginPath(); g.moveTo(0, -16); g.lineTo(0, 20); g.strokeStyle = '#8a7a5a'; g.stroke(); break;
    case 'ledger': g.beginPath(); RR(-14, -17, 28, 34, 2); ol('#6a1a1a'); g.fillStyle = '#f4c445'; g.fillRect(-10, -10, 20, 3); g.fillRect(-10, 6, 20, 2); break;
    case 'chip': g.beginPath(); C(0, 0, 14); ol('#c0102a'); g.setLineDash([4, 4]); g.beginPath(); C(0, 0, 11); g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke(); g.setLineDash([]); txt('$', 0, 1, fa(11), '#fff', null); break;
    case 'map': g.beginPath(); g.moveTo(-16, -12); g.lineTo(-5, -15); g.lineTo(5, -12); g.lineTo(16, -15); g.lineTo(16, 12); g.lineTo(5, 15); g.lineTo(-5, 12); g.lineTo(-16, 15); g.closePath(); ol('#e8dcb0'); g.strokeStyle = '#c0102a'; g.setLineDash([2, 2]); g.beginPath(); g.moveTo(-10, 8); g.quadraticCurveTo(0, -10, 10, 0); g.stroke(); g.setLineDash([]); txt('✕', 10, 0, fa(9), '#c0102a', null); break;
    case 'cane': g.rotate(.4); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 18); g.lineTo(0, -10); g.arc(-7, -10, 7, 0, PI, true); g.stroke(); g.strokeStyle = '#f4f0e6'; g.lineWidth = 3.4; g.stroke(); g.fillStyle = '#f4c445'; g.beginPath(); C(0, -10, 3.5); g.fill(); break;
    case 'tracker': g.beginPath(); RR(-12, -12, 24, 24, 6); ol('#9d1c2a'); txt('🐗', 0, 1, '12px sans-serif', '#000', null); g.fillStyle = '#3aff6a'; g.beginPath(); C(8, -8, 2.6 + Math.sin(RT.t * 6)); g.fill(); break;
    case 'drawing': g.rotate(-.06); g.beginPath(); g.rect(-17, -14, 34, 28); ol('#fff'); g.strokeStyle = '#2266dd'; g.lineWidth = 2; g.beginPath(); C(-6, -2, 5); g.moveTo(-6, 3); g.lineTo(-6, 10); g.stroke(); g.strokeStyle = '#c0102a'; g.beginPath(); C(7, 0, 5); g.stroke(); txt('KD', 10, -9, fm(7), '#ffb000', null); break;
    case 'blood': g.fillStyle = '#8a0a14'; g.beginPath(); E(0, 4, 14, 7); g.fill(); g.beginPath(); C(-12, -6, 3); C(10, -9, 2); C(4, -13, 1.6); g.fill(); break;
    case 'cash': g.rotate(-.1); g.beginPath(); RR(-17, -10, 34, 20, 2); ol('#6ab04a', '#1a3a10'); g.beginPath(); C(0, 0, 5); g.strokeStyle = '#1a3a10'; g.stroke(); break;
    case 'jewel': g.beginPath(); g.moveTo(-12, -4); g.lineTo(-6, -12); g.lineTo(6, -12); g.lineTo(12, -4); g.lineTo(0, 14); g.closePath(); ol('#5a4ae8', '#1a1050'); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.moveTo(-6, -10); g.lineTo(-2, -10); g.lineTo(-6, -4); g.fill(); break;
    case 'watch': g.fillStyle = '#3a2a1a'; g.fillRect(-5, -18, 10, 36); g.beginPath(); C(0, 0, 11); ol('#e8d090'); g.beginPath(); C(0, 0, 8); ol('#fff', '#999', 1); g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -6); g.moveTo(0, 0); g.lineTo(4, 2); g.stroke(); break;
    case 'bottle': g.beginPath(); g.moveTo(-4, -18); g.lineTo(4, -18); g.lineTo(4, -8); g.lineTo(9, -2); g.lineTo(9, 18); g.lineTo(-9, 18); g.lineTo(-9, -2); g.lineTo(-4, -8); g.closePath(); ol('#3a7a3a'); g.fillStyle = '#f2e8d2'; g.fillRect(-7, 2, 14, 9); break;
    case 'bullet': g.rotate(.6); g.beginPath(); g.moveTo(-4, 10); g.lineTo(-4, -4); g.quadraticCurveTo(0, -14, 4, -4); g.lineTo(4, 10); g.closePath(); ol('#c89a3a'); break;
    case 'tooth': g.beginPath(); g.moveTo(-8, -10); g.quadraticCurveTo(0, -14, 8, -10); g.lineTo(6, 4); g.lineTo(3, 12); g.lineTo(0, 4); g.lineTo(-3, 12); g.lineTo(-6, 4); g.closePath(); ol('#f8f4e0'); break;
    case 'scarf': g.beginPath(); g.moveTo(-16, -8); g.quadraticCurveTo(0, -16, 16, -8); g.lineTo(12, 14); g.lineTo(6, 2); g.quadraticCurveTo(0, -4, -6, 2); g.lineTo(-12, 14); g.closePath(); ol('#9d1c2a'); break;
    default: g.beginPath(); C(0, 0, 13); ol('#ffd23a'); txt('?', 0, 1, fa(14), INK, null);
  }
  g.restore();
}
function addClue(id) { if (!GS.clues.includes(id)) { GS.clues.push(id); const c = CLUES[id]; if (c) toast('CLUE BAGGED: ' + c.name, '#5fe3ff'); sfx('clue'); } }
function addItem(id) { GS.bag.push(id); const it = ITEMS[id]; if (it) toast('BAGGED: ' + it.name, '#ffd23a'); sfx('coin'); }
function bumpHeat(n) { const o = GS.heat; GS.heat = clamp(GS.heat + n, 0, 5); if (GS.heat > o) toast('HEAT ▲ ' + HEATN[GS.heat], '#ff8a5a'); }
function bumpFBI(n) { GS.fbi = clamp(GS.fbi + n, 0, 100); }

/* ---------- investigate scene ---------- */
function investStart(step, onDone) {
  RT.inv = { step, onDone, site: step.sites.length === 1 ? 0 : -1, card: null, sniff: 0, t: 0, found: {}, quip: null };
  RT.scene = 'invest'; if (step.music) music(step.music);
  if (step.crime) { GS.party._kdHide = 1; if (!SETTINGS.toned && !GS.flags.goreWarned) { GS.flags.goreWarned = 1; RT.inv.warn = 1; } }
}
function invFoundCount(step) { let n = 0, t = 0; for (const s of step.sites) for (const c of s.clues) { t++; if (GS.clues.includes(c.id)) n++; } return [n, t]; }
function invNeed(step) { const [n, t] = invFoundCount(step); return n >= (step.need || t); }
function drawInvest() {
  const I = RT.inv, st = I.step, W = L.W, H = L.H; I.t += DT; I.sniff = Math.max(0, I.sniff - DT);
  if (I.warn) { drawBG('black', W, H); const w = Math.min(W - 40, 360), h = 250, x = (W - w) / 2, y = (H - h) / 2; panel(x, y, w, h, { edge: '#ff3a3a', lw: 2.4 });
    txt('⚠ GRAPHIC CRIME SCENE', x + w / 2, y + 30, fa(18), '#ff5a5a', INK, 3); fitText('Blood, bodies and bad decisions ahead. Adults only. Want the gentle version? Turn on TONED DOWN: sheets, chalk outlines and no gore.', x + 20, y + 54, w - 40, 100, px => fo(px, 500), 15, '#fff', 'center');
    btn('warn_ok', x + 14, y + h - 62, (w - 40) / 2, 46, 'SHOW ME', () => { I.warn = 0; }, { col: '#9d1c2a' }); btn('warn_toned', x + w / 2 + 6, y + h - 62, (w - 40) / 2, 46, 'TONED DOWN', () => { SETTINGS.toned = true; saveSettings(); SPR.clear(); WRAPC.clear(); I.warn = 0; }, { col: '#1a8a5a', px: 14 }); drawHUD({ board: false }); return; }
  if (I.site < 0) return drawInvHub();
  const site = st.sites[I.site], bh = 62;
  drawBG(site.bg || st.bg, W, H);
  if (st.crime) { const key = 'vic:' + st.crime + ':' + (SETTINGS.toned ? 1 : 0) + ':' + Math.round(W) + 'x' + Math.round(H); sprite(key, 0, 0, 1, [0, 0, W, H], () => { seed = 11; VICTIM[st.crime](W, H - 76, SETTINGS.toned); }); }
  // title tag
  const tag = tx(site.name).toUpperCase(); const tw = Math.min(W - 20, textW(tag, fa(14)) + 30); rr(W / 2 - tw / 2, 48, tw, 26, 13, 'rgba(6,8,20,.85)', st.crime ? '#ff3a3a' : '#5fe3ff', 1.4); fitTextLine(tag, W / 2, 61.5, tw - 16, fa(14), '#fff', 'center');
  const area = { x: 16, y: 84, w: W - 32, h: H - 84 - bh - 30 };
  // jokes (decoy props)
  for (const j of (site.jokes || [])) { const jx = area.x + area.w * j.x, jy = area.y + area.h * j.y; clueIcon(j.icon, jx, jy, 1.05); addHit('joke' + j.icon + j.x, jx - 24, jy - 24, 48, 48, () => { I.quip = { who: j.who || 'kay', text: j.say, t: 0 }; sfx('tap'); }); }
  // clues
  site.clues.forEach((c, i) => { const got = GS.clues.includes(c.id); if (got) return; const cx = area.x + area.w * c.x, cy = area.y + area.h * c.y, cl = CLUES[c.id];
    const tw = (Math.sin(RT.t * 2.2 + i * 1.7) + 1) / 2; g.save(); g.globalAlpha = .82 + .18 * tw; clueIcon(cl.icon, cx, cy, 1.1); g.restore();
    if (tw > .92) sparkle(cx + 12, cy - 12, 5, '#fff');
    if (I.sniff > 0) { g.save(); g.strokeStyle = '#ffd23a'; g.lineWidth = 3; g.globalAlpha = .5 + .5 * Math.sin(RT.t * 10); g.beginPath(); C(cx, cy, 30); g.stroke(); g.restore(); }
    addHit('clue_' + c.id, cx - 26, cy - 26, 52, 52, () => { I.card = c.id; sfx('page'); }); });
  // quip bubble (bottom of area; drawn in a strip above toolbar, not over clues center)
  if (I.quip) { I.quip.t += DT; const q = I.quip, qh = 54, qy = H - bh - 16 - qh; if (q.t > 4) I.quip = null; else { panel(10, qy, W - 20, qh, { edge: CAST[q.who].col }); txt(CAST[q.who].name, 22, qy + 13, fa(11), CAST[q.who].col, null, 0, 'left'); fitText(tx(q.text), 22, qy + 22, W - 44, qh - 26, px => fo(px, 500), 13, '#fff'); } }
  // toolbar
  const ty = H - bh - 8; panel(8, ty, W - 16, bh, { edge: '#2b3c70' });
  const [n, t] = invFoundCount(st), done = invNeed(st);
  const sc = site.clues.filter(c => !GS.clues.includes(c.id)).length;
  const tools = []; if (GS.party.cocoa) tools.push(['SNIFF', '🐾', '#8a5a2a', () => { I.sniff = 3.2; sfx('sniff'); I.quip = { who: 'cocoa', text: pick(['*snff snff* WOOF. (Translation: it\'s right there, detective.)', '*sneeze* ...*points with entire body*', 'Cocoa does the butt-wiggle of truth.']), t: 0 }; }]);
  else if (GS.party.kambree) tools.push(['SHAKE DOWN', '👊', '#c0306a', () => { const c = site.clues.find(c => !GS.clues.includes(c.id)); if (c) { I.card = c.id; bumpHeat(1); I.quip = { who: 'kambree', text: pick([V('I asked nicely. Then I asked with my knee. Here.', 'I asked nicely. Then I asked with my knee. Here.'), V('Found it. Somebody\'s gonna need a new kneecap and an old lawyer.', 'Found it. Somebody needs a new kneecap.'), V('You\'re welcome, bitch. Write that down.', 'You\'re welcome. Write that down.')]), t: 0 }; sfx('punch'); shake(5); } }]);
  else tools.push(['GUT CHECK', '🔎', '#3a5a9a', () => { I.sniff = 1.6; sfx('tap'); }]);
  const bw = Math.min(140, (W - 40) / 3);
  tools.forEach(([lab, ic, col, fn], i) => btn('tool' + i, 16, ty + 9, bw, bh - 18, lab, fn, { icon: ic, col, px: 13 }));
  if (st.autopsy) { btn('autopsy', W / 2 - bw * .45, ty + 9, bw * .9, bh - 18, 'AUTOPSY', () => { I.card = '__autopsy'; sfx('page'); }, { col: '#7a1a2a', px: 12, icon: '🩻' }); txt('CLUES ' + n + '/' + (st.need || t), W / 2, ty - 10, fa(13), done ? '#7aff9a' : '#fff', INK, 3); }
  else txt('CLUES ' + n + '/' + (st.need || t), W / 2 + (L.portrait ? 6 : 0), ty + bh / 2, fa(14), done ? '#7aff9a' : '#fff', null);
  if (st.sites.length > 1) btn('inv_back', W - 16 - bw, ty + 9, bw, bh - 18, done ? 'CONTINUE ▸' : 'SITES', () => { if (done) investFinish(); else I.site = -1; }, { col: done ? '#1a8a5a' : '#3a4a7a', px: 13 });
  else btn('inv_done', W - 16 - bw, ty + 9, bw, bh - 18, done ? 'CONTINUE ▸' : (sc + ' LEFT'), investFinish, { col: '#1a8a5a', disabled: !done, why: 'Find the rest of the clues first.', px: 13 });
  if (I.card) drawClueCard(I);
  drawHUD();
}
function drawInvHub() {
  const I = RT.inv, st = I.step, W = L.W, H = L.H; drawBG(st.bg, W, H);
  g.save(); g.fillStyle = 'rgba(4,6,16,.45)'; g.fillRect(0, 0, W, H); g.restore();
  txt(tx(st.title || 'INVESTIGATE').toUpperCase(), W / 2, 66, fa(22), '#fff', INK, 4);
  if (st.intro) fitText(tx(st.intro), 24, 82, W - 48, 44, ft, 13, '#cfe0ff', 'center');
  const n = st.sites.length, cols = L.portrait ? 1 : Math.min(n, 3), rows = Math.ceil(n / cols), cw = L.portrait ? W - 40 : Math.min(260, (W - 40 - (cols - 1) * 12) / cols), ch = L.portrait ? Math.min(110, (H - 220) / rows - 12) : Math.min(150, (H - 210) / rows - 10);
  const x0 = (W - (cols * cw + (cols - 1) * 12)) / 2, y0 = 134;
  st.sites.forEach((s, i) => { const x = x0 + (i % cols) * (cw + 12), y = y0 + Math.floor(i / cols) * (ch + 12); const got = s.clues.filter(c => GS.clues.includes(c.id)).length, all = got >= s.clues.length;
    btn('site' + i, x, y, cw, ch, tx(s.name).toUpperCase(), () => { if (!I.visited) I.visited = {}; if (!I.visited[i]) { GS.hours = Math.max(0, GS.hours - (s.hours || 2)); I.visited[i] = 1; } I.site = i; sfx('page'); }, { col: all ? '#1a6a4a' : '#22305a', sub: (all ? '✔ SEARCHED · ' : '') + got + '/' + s.clues.length + ' clues · ' + (s.hours || 2) + 'h' + (s.desc ? ' · ' + tx(s.desc) : ''), icon: s.icon || '📍', px: 16 }); });
  const done = invNeed(st); btn('hub_done', W / 2 - 110, H - 70, 220, 50, done ? 'CONTINUE ▸' : 'FIND MORE CLUES', investFinish, { col: '#1a8a5a', disabled: !done, why: 'Search the remaining sites.' });
  drawHUD();
}
function drawClueCard(I) {
  const W = L.W, H = L.H; g.save(); g.fillStyle = 'rgba(0,0,0,.65)'; g.fillRect(0, 0, W, H); g.restore(); addHit('cc_bg', 0, 0, W, H, () => {});
  const isA = I.card === '__autopsy', cl = isA ? null : CLUES[I.card];
  const w = Math.min(W - 30, 380), h = Math.min(H - 70, isA ? 340 : 280), x = (W - w) / 2, y = (H - h) / 2;
  paper(x, y, w, h, 0, '#f2ead8'); g.fillStyle = '#9d1c2a'; g.fillRect(x, y, w, 30); txt(isA ? 'CORONER\'S NOTES' : 'EVIDENCE', x + w / 2, y + 15.5, fa(14), '#fff', null);
  if (isA) { fitText(tx(I.step.autopsy), x + 18, y + 42, w - 36, h - 100, ft, 15, '#2a1a10'); }
  else { clueIcon(cl.icon, x + 46, y + 78, 1.9); fitText(tx(cl.name).toUpperCase(), x + 86, y + 50, w - 100, 50, fa, 18, '#2a1a10'); fitText(tx(cl.desc), x + 18, y + 116, w - 36, h - 176, ft, 14, '#2a1a10'); }
  btn('cc_ok', x + w / 2 - 80, y + h - 54, 160, 42, isA ? 'GOT IT' : 'BAG IT', () => { if (!isA) addClue(I.card); I.card = null; }, { col: '#2266dd' });
}
function investFinish() { const I = RT.inv; GS.party._kdHide = 0; RT.inv = null; I.onDone(); }

/* ---------- deduction board ---------- */
function boardStart(step, onDone) { RT.ded = { step, onDone, qi: 0, wrong: null, ok: null, t: 0 }; RT.scene = 'deduce'; }
function drawDeduce() {
  const D = RT.ded, st = D.step, W = L.W, H = L.H, q = st.qs[D.qi]; D.t += DT;
  drawBG('board', W, H);
  txt(tx(st.title || 'CONNECT THE DOTS'), W / 2, 66, fa(22), '#fff', INK, 4);
  txt('QUESTION ' + (D.qi + 1) + ' / ' + st.qs.length, W / 2, 90, fo(12, 600), '#ffd23a', INK, 3);
  const w = Math.min(W - 30, 560), x = (W - w) / 2; let y = 104;
  paper(x, y, w, L.portrait ? 92 : 70, -.01); fitText(tx(q.q), x + 16, y + 12, w - 32, (L.portrait ? 92 : 70) - 22, fm, 19, '#2a1a10', 'center'); y += (L.portrait ? 92 : 70) + 14;
  const n = q.opts.length, cols = L.portrait ? 1 : 2, bh = L.portrait ? 50 : 46, gap = 10;
  q.opts.forEach((o, i) => { const bx = x + (i % cols) * (w / cols + (cols > 1 ? 5 : 0)), bw = w / cols - (cols > 1 ? 5 : 0), by = y + Math.floor(i / cols) * (bh + gap);
    btn('ded' + i, bx, by, bw, bh, tx(o), () => { if (D.ok) return; if (i === q.a) { D.ok = { text: q.yes || 'Click. That\'s the one.' }; sfx('correct'); burst(W / 2, by, 24, ['#ffd23a', '#5fe3ff', '#fff']); } else { D.wrong = { text: q.no || pick(KAMBREE_WRONG), t: 0 }; GS.hours = Math.max(0, GS.hours - 3); sfx('wrong'); shake(4); } }, { col: D.wrong && D.wrong.i === i ? '#5a2a2a' : '#22305a', px: 15 }); });
  y += Math.ceil(n / cols) * (bh + gap) + 6;
  const msg = D.ok || D.wrong; if (msg) { const mh = Math.min(110, H - y - 70); panel(x, y, w, mh, { edge: D.ok ? '#7aff9a' : '#ff5aa8' }); const who = D.ok ? 'kay' : (GS.party.kambree ? 'kambree' : 'kay'); txt(CAST[who].name, x + 12, y + 14, fa(12), CAST[who].col, null, 0, 'left'); fitText(tx(msg.text), x + 12, y + 26, w - 24, mh - 32, px => fo(px, 500), 14, '#fff'); }
  if (D.ok) btn('ded_next', W / 2 - 100, H - 62, 200, 48, D.qi + 1 < st.qs.length ? 'NEXT ▸' : 'CASE CLOSER ▸', () => { D.ok = null; D.wrong = null; D.qi++; if (D.qi >= st.qs.length) { RT.ded = null; D.onDone(); } });
  drawHUD();
}
const KAMBREE_WRONG = [V('Wrong. Jesus Christ, Kay, did you get your badge out of a cereal box?', 'Wrong. Did you get your badge out of a cereal box?'), V('Nope. That answer is dumber than a bag of hammers wearing a fanny pack.', 'Nope. Dumber than a bag of hammers wearing a fanny pack.'), V('Try again, Sherlock Holmes-schooled. Clock\'s ticking and so is my eye.', 'Try again, Sherlock. Clock\'s ticking and so is my eye.'), V('I\'m telling Mom you guessed. GUESSED. Like an animal.', 'I\'m telling Mom you guessed. Like an animal.')];

/* ---------- flight board ---------- */
function flightStart(step, onDone) { RT.fl = { step, onDone, msg: null, fly: 0, t: 0 }; RT.scene = 'flight'; music('travel'); }
function drawFlight() {
  const F_ = RT.fl, st = F_.step, W = L.W, H = L.H; F_.t += DT;
  if (F_.fly > 0) { F_.fly += DT; drawBG('flight', W, H); const p = clamp(F_.fly / 2.6, 0, 1); const px = lerp(-80, W + 80, easeOut(p)), py = lerp(H * .62, H * .2, p);
    contrail(lerp(-80, px, .1), lerp(H * .62, py, .1), px - 30, py + 6, 10); plane(px, py, L.portrait ? .9 : 1.1, -.25);
    txt('NEXT STOP', W / 2, H * .74, fa(18), '#5fe3ff', INK, 3); let pz = 40; while (pz > 16 && textW(st.dest, fa(pz)) > W - 30) pz--; txt(st.dest, W / 2, H * .74 + 40, fa(pz), '#fff', INK, 5);
    if (F_.fly > 2.8) { const f = F_.onDone; RT.fl = null; f(); } drawHUD(); return; }
  drawBG('airport', W, H);
  const w = Math.min(W - 20, 600), x = (W - w) / 2, y = 52; rr(x, y, w, 40, 8, '#141418', '#3a3a44', 2); txt('✈ DEPARTURES', x + 14, y + 20.5, fa(18), '#ffd23a', null, 0, 'left'); txt(tx(st.from || ''), x + w - 14, y + 20.5, fo(12, 600), '#aab', null, 0, 'right');
  const qh = L.portrait ? 70 : 52; panel(x, y + 48, w, qh, { edge: '#5fe3ff' }); fitText(tx(st.q), x + 12, y + 56, w - 24, qh - 16, px => fo(px, 600), 15, '#fff', 'center');
  let by = y + 48 + qh + 10; const rh = L.portrait ? 50 : 44, avail = H - by - (F_.msg ? 100 : 46), gap = 8; const rhh = Math.min(rh, (avail - gap * (st.opts.length - 1)) / st.opts.length);
  st.opts.forEach((o, i) => { const pr = pressed('fl' + i); g.save(); if (pr) g.translate(0, 2); rr(x, by, w, rhh, 6, '#0c0c10', o._bad ? '#5a2020' : '#2a2a34', 2);
    const flap = (s, fx, fw, col) => { rr(fx, by + 6, fw, rhh - 12, 3, '#1c1c22'); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(fx, by + rhh / 2 - .5, fw, 1); fitTextLine(s, fx + 6, by + rhh / 2 + 1, fw - 12, fa(Math.min(18, rhh * .42)), col, 'left'); };
    flap(o.code, x + 8, 56, '#ffd23a'); flap(tx(o.city).toUpperCase(), x + 70, w - 70 - 108, '#fff'); flap(o._bad ? 'NOPE' : 'BOARD', x + w - 100, 92, o._bad ? '#ff5a5a' : '#7aff9a'); g.restore();
    addHit('fl' + i, x, by, w, rhh, () => { if (o.ok) { sfx('jet'); F_.fly = .01; } else { o._bad = 1; GS.hours = Math.max(0, GS.hours - 6); F_.msg = { who: o.who || (GS.party.kambree ? 'kambree' : 'kay'), text: o.no || 'Wrong gate. Six hours of standby later...' }; sfx('wrong'); } }); by += rhh + gap; });
  if (F_.msg) { const mh = 84, my = H - mh - 10; panel(x, my, w, mh, { edge: CAST[F_.msg.who].col }); txt(CAST[F_.msg.who].name, x + 12, my + 14, fa(12), CAST[F_.msg.who].col, null, 0, 'left'); fitText(tx(F_.msg.text), x + 12, my + 26, w - 24, mh - 32, px => fo(px, 500), 14, '#fff'); }
  else if (st.hint) { fitText('Hint: ' + tx(st.hint), x + 10, H - 40, w - 20, 30, ft, 12, '#9fb0d8', 'center'); }
  drawHUD();
}
