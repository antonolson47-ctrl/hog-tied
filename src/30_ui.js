/* ===================== UI: panels, buttons, text wrap, toasts, HUD, settings ===================== */
const WRAPC = new Map();
function wrapLines(s, maxW, font) {
  const key = font + '|' + maxW + '|' + s; let r = WRAPC.get(key); if (r) return r;
  g.save(); g.font = font; const out = [];
  for (const para of String(s).split('\n')) { const words = para.split(' '); let l = ''; for (const w of words) { const t = l ? l + ' ' + w : w; if (g.measureText(t).width > maxW && l) { out.push(l); l = w; } else l = t; } out.push(l); }
  g.restore(); if (WRAPC.size > 600) WRAPC.clear(); WRAPC.set(key, out); return out;
}
function textW(s, font) { g.save(); g.font = font; const w = g.measureText(s).width; g.restore(); return w; }
// draw wrapped text, shrinking font until it fits h. fontFn(px) -> font string. returns used px
function fitText(s, x, y, w, h, fontFn, px, col, align = 'left', lhK = 1.3, minPx = 9) {
  let lines, p = px; for (; p >= minPx; p -= .5) { lines = wrapLines(s, w, fontFn(p)); if (lines.length * p * lhK <= h) break; }
  g.save(); g.font = fontFn(p); g.fillStyle = col; g.textAlign = align; g.textBaseline = 'top';
  const ax = align === 'center' ? x + w / 2 : align === 'right' ? x + w : x;
  lines.forEach((l, i) => g.fillText(l, ax, y + i * p * lhK)); g.restore(); return { px: p, n: lines.length, h: lines.length * p * lhK };
}
function rr(x, y, w, h, r, fill, stroke, lw = 2) { g.beginPath(); RR(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
function panel(x, y, w, h, o = {}) {
  g.save(); g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); RR(x + 3, y + 4, w, h, o.r || 10); g.fill();
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, o.c1 || '#141a36'); gr.addColorStop(1, o.c2 || '#090c1c'); g.beginPath(); RR(x, y, w, h, o.r || 10); g.fillStyle = gr; g.fill();
  g.strokeStyle = o.edge || '#2b3c70'; g.lineWidth = o.lw || 1.6; g.stroke(); g.restore();
}
function paper(x, y, w, h, rot = 0, col = '#f2e8d2') { g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(-w / 2 + 3, -h / 2 + 4, w, h); g.fillStyle = col; g.fillRect(-w / 2, -h / 2, w, h); g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 1; g.strokeRect(-w / 2, -h / 2, w, h); g.restore(); }
// button: returns true if drawn enabled
function btn(id, x, y, w, h, label, fn, o = {}) {
  const dis = !!o.disabled, col = dis ? '#3a3f5a' : (o.col || '#2266dd'), pr = pressed(id) && !dis;
  g.save(); if (pr) g.translate(0, 2);
  g.fillStyle = INK; g.beginPath(); RR(x + 2, y + (pr ? 1 : 3), w, h, o.r || 10); g.fill();
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, lighten(col, .14)); gr.addColorStop(1, darken(col, .22));
  g.beginPath(); RR(x, y, w, h, o.r || 10); g.fillStyle = gr; g.fill(); g.strokeStyle = o.hot ? '#fff3a0' : INK; g.lineWidth = o.hot ? 2.4 : 2; g.stroke();
  g.save(); g.clip(); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x, y, w, h * .42); g.restore();
  const px = o.px || Math.min(18, h * .46); let tx = x + w / 2;
  if (o.icon) { txt(o.icon, x + (o.sub ? 20 : w / 2 - textW(label, fa(px)) / 2 - 10), y + h / 2 + 1, `${px}px sans-serif`, '#fff', null); if (!o.sub) tx += 10; }
  if (o.sub) { txt(label, o.icon ? x + 38 : x + 12, y + h * .36, fa(Math.min(px, h * .36)), dis ? '#9aa0b8' : '#fff', INK, 3, 'left'); g.save(); g.beginPath(); g.rect(x + 4, y, w - 8, h); g.clip(); txt(o.sub, o.icon ? x + 38 : x + 12, y + h * .72, fo(Math.min(11, h * .24), 600), dis ? '#8a90a8' : 'rgba(255,255,255,.88)', null, 0, 'left'); g.restore(); }
  else { let p = px; while (p > 9 && textW(label, fa(p)) > w - (o.icon ? 34 : 14)) p -= .5; txt(label, tx, y + h / 2 + 1, fa(p), dis ? '#9aa0b8' : '#fff', INK, 3); }
  if (o.chip) { const cw = textW(o.chip, fa(10)) + 12; rr(x + w - cw - 5, y + 4, cw, 15, 7, 'rgba(0,0,0,.5)'); txt(o.chip, x + w - cw / 2 - 5, y + 12, fa(10), o.chipCol || '#ffd23a', null); }
  g.restore();
  if (!dis) addHit(id, x, y, w, h, fn, { pad: o.pad || 0 }); else if (o.why) addHit(id, x, y, w, h, () => toast(o.why, '#ffb0b0'));
  return !dis;
}
function iconBtn(id, x, y, s, icon, fn, o = {}) { const pr = pressed(id); g.save(); if (pr) g.translate(0, 1.5); rr(x, y, s, s, s * .28, o.col || 'rgba(14,20,44,.86)', o.edge || '#5fe3ff', 1.6); txt(icon, x + s / 2, y + s / 2 + 1, o.font || `${s * .5}px sans-serif`, '#fff', null); if (o.label) txt(o.label, x + s / 2, y + s + 7, fo(8.5, 600), '#cfe0ff', 'rgba(0,0,0,.7)', 2.5); g.restore(); addHit(id, x, y, s, s, fn, { pad: 4 }); }

/* ---------- toasts + particles ---------- */
function toast(s, col = '#fff', dur = 1.9) { RT.toasts.push({ s: tx(s), col, t: 0, dur }); if (RT.toasts.length > 6) RT.toasts.shift(); }
// one toast at a time, in a ticker strip right under the HUD (stages start below it, so it never covers a character)
function drawToasts() {
  const t = RT.toasts[0]; if (!t) return; const n = RT.toasts.length; t.t += DT * (n > 2 ? 1.6 : 1); const a = clamp(Math.min(t.t * 6, (t.dur - t.t) * 5), 0, 1);
  // drawn INSIDE the HUD bar (over the stat chips, left of the menu buttons) so it never covers characters or controls
  if (a > 0) { const title = RT.scene === 'title', y = title ? L.H - 40 : 0, w = title ? L.W : L.W - 84, h = title ? 30 : 40; g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(6,8,22,.97)'; g.fillRect(0, y, w, h); g.fillStyle = t.col; g.fillRect(0, y + h - 2, w, 2); fitTextLine(t.s, w / 2, y + h / 2 + .5, w - 16, fo(13, 600), t.col, 'center'); g.restore(); }
  if (t.t >= t.dur) RT.toasts.shift();
}
function burst(x, y, n, cols, o = {}) { for (let i = 0; i < n; i++) { const a = R(0, TAU), v = R(60, 220) * (o.v || 1); RT.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (o.up || 80), t: 0, life: R(.5, 1.1), c: cols[i % cols.length], r: R(2, 4.5), kind: o.kind || 'dot' }); } }
function drawParts() { for (const p of RT.parts) { p.t += DT; p.x += p.vx * DT; p.y += p.vy * DT; p.vy += 420 * DT; const a = 1 - p.t / p.life; if (a <= 0) continue; g.save(); g.globalAlpha = a; g.fillStyle = p.c; if (p.kind === 'blood') { g.beginPath(); E(p.x, p.y, p.r * 1.4, p.r, Math.atan2(p.vy, p.vx)); g.fill(); } else { g.beginPath(); C(p.x, p.y, p.r); g.fill(); } g.restore(); } RT.parts = RT.parts.filter(p => p.t < p.life); }

/* ---------- HUD ---------- */
function hours2s(h) { h = Math.max(0, Math.round(h)); return Math.floor(h / 24) + 'd ' + (h % 24) + 'h'; }
const HEATN = ['COOL', 'WARM', 'SPICY', 'HOT', 'HOG ROAST', 'HOG ROAST'];
function drawHUD(o = {}) {
  const W = L.W, h = 40; g.save(); vgrad(0, 0, W, h, [[0, 'rgba(8,12,30,.96)'], [1, 'rgba(6,8,20,.92)']]); g.fillStyle = '#2b3c70'; g.fillRect(0, h - 2, W, 2); g.restore();
  const ch = CH[GS.ch] || CH[0]; let x = 8;
  const chip = (w, label, val, col) => { rr(x, 8, w, 24, 12, '#0a0e1c', '#2b3c70', 1.2); txt(label, x + 8, 20.5, fo(8.5, 600), 'rgba(220,230,255,.7)', null, 0, 'left'); txt(val, x + w - 8, 20.5, fa(12), col, null, 0, 'right'); x += w + 5; };
  chip(L.portrait ? 92 : 112, 'KICKOFF', hours2s(GS.hours), GS.hours < 72 ? '#ff6a6a' : '#5fe3ff');
  // heat dots
  rr(x, 8, L.portrait ? 74 : 120, 24, 12, '#0a0e1c', '#5a2a1a', 1.2); const hc = ['#ffd23a', '#ffa23a', '#ff6a3a', '#ff3a3a', '#d01a4a'];
  txt('HEAT', x + 7, 20.5, fa(9.5), '#ff8a5a', null, 0, 'left'); for (let i = 0; i < 5; i++) { rr(x + 34 + i * 7.5, 14, 6, 12, 2, i < GS.heat ? hc[i] : '#1c2240'); }
  if (!L.portrait) txt(HEATN[GS.heat], x + 114, 20.5, fa(9), '#ffb25a', null, 0, 'right'); x += (L.portrait ? 74 : 120) + 5;
  if (!L.portrait) { chip(74, 'FBI', String(GS.fbi), '#f4c445'); chip(84, 'CASH', fmt$(GS.cash), '#7aff9a'); }
  else chip(64, 'FBI', String(GS.fbi), '#f4c445');
  // right side: board + menu
  const bx = W - 8 - 30; iconBtn('menu', bx, 5, 30, '☰', openSettings, { font: fa(16) });
  if (o.board !== false && GS.started) iconBtn('board', bx - 36, 5, 30, '📌', () => { RT.board = true; RT.boardScroll = 0; sfx('page'); }, { font: '15px sans-serif' });
  if (!L.portrait && ch) { const lx = x + 4, mw = bx - 44 - lx; if (mw > 80) fitTextLine((ch.city || '').toUpperCase(), lx, 20.5, mw, fa(12), '#fff'); }
}
function fitTextLine(s, x, y, maxW, font, col, align = 'left') { let px = parseFloat(font.match(/(\d+(\.\d+)?)px/)[1]); let f = font; while (px > 8 && textW(s, f) > maxW) { px -= .5; f = font.replace(/\d+(\.\d+)?px/, px + 'px'); } txt(s, x, y, f, col, null, 0, align); }
function partyStrip(x, y) { // little portraits of who's with Kayleigh
  const list = [['kay', 1], ['kambree', GS.party.kambree], ['kd', GS.party.kd], ['cocoa', GS.party.cocoa]].filter(p => p[1]);
  list.forEach(([id], i) => { const cx = x + i * 30; g.save(); g.beginPath(); C(cx, y, 13); g.fillStyle = '#141a36'; g.fill(); g.strokeStyle = CAST[id].col; g.lineWidth = 2; g.stroke(); g.clip(); drawCast(id, cx, y + (id === 'kd' ? 46 : id === 'cocoa' ? 40 : 58), id === 'kd' ? .2 : id === 'cocoa' ? .2 : .26); g.restore(); });
}

/* ---------- settings overlay ---------- */
function openSettings() { RT.settings = true; RT.confirm = null; sfx('page'); }
function closeSettings() { RT.settings = false; saveSettings(); SPR.clear(); }
function drawSettings() {
  const W = L.W, H = L.H; g.save(); g.fillStyle = 'rgba(4,4,12,.86)'; g.fillRect(0, 0, W, H); g.restore(); addHit('set_bg', 0, 0, W, H, () => {});
  const pw = Math.min(360, W - 24), ph = Math.min(H - 30, 470), x = (W - pw) / 2, y = (H - ph) / 2; panel(x, y, pw, ph, { edge: '#5fe3ff' });
  txt('SETTINGS', x + pw / 2, y + 24, fa(20), '#fff', INK, 3);
  let yy = y + 48; const rowH = Math.min(46, (ph - 120) / 7);
  const row = (label, sub, val, fn, col) => { txt(label, x + 16, yy + rowH * .38, fa(13), '#fff', null, 0, 'left'); if (sub) txt(sub, x + 16, yy + rowH * .74, fo(9.5, 500), '#9aa8d0', null, 0, 'left'); btn('set_' + label, x + pw - 118, yy + 5, 102, rowH - 10, val, fn, { col: col || '#2b3c70', px: 13 }); yy += rowH; };
  row('TONED DOWN', 'No gore, softer swearing', SETTINGS.toned ? 'ON' : 'OFF', () => { SETTINGS.toned = !SETTINGS.toned; WRAPC.clear(); SPR.clear(); saveSettings(); sfx('tap'); }, SETTINGS.toned ? '#1a8a5a' : '#8a1a2a');
  row('MUSIC', '', Math.round(SETTINGS.music * 100) + '%', () => { SETTINGS.music = SETTINGS.music >= 1 ? 0 : Math.round((SETTINGS.music + .25) * 100) / 100; applyVol(); sfx('tap'); });
  row('SOUND FX', '', Math.round(SETTINGS.sfx * 100) + '%', () => { SETTINGS.sfx = SETTINGS.sfx >= 1 ? 0 : Math.round((SETTINGS.sfx + .25) * 100) / 100; applyVol(); sfx('tap'); });
  row('MUTE ALL', '', SETTINGS.muted ? 'MUTED' : 'SOUND ON', () => { SETTINGS.muted = !SETTINGS.muted; applyVol(); });
  row('OUTFIT', GS.flags.noir ? 'Kayleigh\'s look' : 'Noir unlocks in Ch. 4', ({ auto: 'AUTO', default: 'BLUE JACKET', noir: 'NOIR TRENCH' })[SETTINGS.outfit], () => { const o = ['auto', 'default', 'noir']; SETTINGS.outfit = o[(o.indexOf(SETTINGS.outfit) + 1) % 3]; SPR.clear(); sfx('tap'); });
  row('SCREEN SHAKE', '', SETTINGS.shake ? 'ON' : 'OFF', () => { SETTINGS.shake = !SETTINGS.shake; });
  const by = y + ph - 58, bw = (pw - 40) / 3;
  if (RT.confirm) { txt(RT.confirm === 'new' ? 'Erase your case and start over?' : 'Restart this chapter?', x + pw / 2, by - 10, fo(12, 600), '#ffb0b0', null); btn('cf_yes', x + 14, by, (pw - 40) / 2, 40, 'YES', () => { if (RT.confirm === 'new') { newGame(); } else restartChapter(); RT.confirm = null; closeSettings(); }, { col: '#c0303a' }); btn('cf_no', x + pw / 2 + 6, by, (pw - 40) / 2, 40, 'NO', () => RT.confirm = null, { col: '#2b3c70' }); }
  else { if (GS.started && RT.scene !== 'title') { btn('set_restart', x + 12, by, bw, 40, 'RESTART CH.', () => RT.confirm = 'restart', { col: '#5a3a8a', px: 12 }); btn('set_title', x + 20 + bw, by, bw, 40, 'TITLE', () => { closeSettings(); toTitle(); }, { col: '#3a4a7a', px: 12 }); }
    btn('set_close', x + pw - bw - 12, by, bw, 40, 'CLOSE', closeSettings, { col: '#2266dd' }); }
  txt('Hog Tied: A Kayleigh Mystery · adults 18+ · v1.0', x + pw / 2, y + ph - 10, fo(8.5, 500), '#6a78a8', null);
}
