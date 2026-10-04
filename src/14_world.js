/* ===================== WORLD: skies, landmarks (base) ===================== */
function sunsetSky(W, H, top = 0) {
  vgrad(0, top, W, H, [[0, '#0b1240'], [.28, '#3a2575'], [.5, '#a2357f'], [.66, '#ec4f6e'], [.8, '#ff8a3d'], [.92, '#ffc260'], [1, '#ffe39a']]);
}
function paintedCloud(x, y, w, h, lit = '#ff9a8a', body = 'rgba(120,50,120,.55)', a = 1) {
  g.save(); g.globalAlpha = a;
  const s0 = seed; seed = Math.round(x * 7 + y * 3 + 11);
  const puffs = []; for (let i = 0; i < 9; i++) puffs.push([x + R(-.5, .5) * w, y + R(-.35, .25) * h, R(.18, .32) * w, R(.35, .6) * h]);
  g.fillStyle = body; g.beginPath(); for (const [px, py, rx, ry] of puffs) E(px, py, rx, ry); g.fill();
  g.save(); g.beginPath(); for (const [px, py, rx, ry] of puffs) E(px, py, rx, ry); g.clip();
  g.fillStyle = lit; g.globalAlpha = a * .9; g.beginPath(); for (const [px, py, rx, ry] of puffs) E(px, py + ry * .55, rx * .95, ry * .55); g.fill(); g.restore();
  seed = s0; g.restore();
}
function sunBurst(x, y, r, rays = 22, col = 'rgba(255,220,140,.18)') {
  g.save(); g.translate(x, y); g.fillStyle = col;
  for (let i = 0; i < rays; i++) { const a = i / rays * TAU; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a - .045) * r * 3, Math.sin(a - .045) * r * 3); g.lineTo(Math.cos(a + .045) * r * 3, Math.sin(a + .045) * r * 3); g.closePath(); g.fill(); }
  g.restore();
  glow(x, y, r * 2.2, 'rgba(255,214,120,.55)'); glow(x, y, r * 1.1, 'rgba(255,240,190,.9)');
  g.save(); g.beginPath(); C(x, y, r * .62); g.fillStyle = '#fff1c0'; g.fill(); g.restore();
}
// ---- landmark silhouettes: draw at base (x, y) with height h, flat fill with a lit top edge ----
function lm(shapes, fill, edge, ew = 2) { g.save(); g.beginPath(); shapes(); g.fillStyle = fill; g.fill(); if (edge) { g.clip(); g.translate(ew * .5, ew); g.beginPath(); g.rect(-5000, -5000, 10000, 10000); shapes(); g.fillStyle = edge; g.fill('evenodd'); } g.restore(); }
const LM = {
  obelisco: (x, y, h) => () => { const w = h * .09; P([[x - w, y], [x - w * .72, y - h * .86], [x, y - h], [x + w * .72, y - h * .86], [x + w, y]]); },
  macauTower: (x, y, h) => () => { const w = h * .045; P([[x - w * 1.6, y], [x - w, y - h * .62], [x - w * 3.4, y - h * .66], [x - w * 3.6, y - h * .72], [x - w * 1, y - h * .76], [x - w * .5, y - h * .97], [x, y - h * 1.05], [x + w * .5, y - h * .97], [x + w * 1, y - h * .76], [x + w * 3.6, y - h * .72], [x + w * 3.4, y - h * .66], [x + w, y - h * .62], [x + w * 1.6, y]]); },
  hallgrims: (x, y, h) => () => { const st = 7, w = h * .32; g.moveTo(x - w, y); for (let i = 0; i < st; i++) { const xx = x - w + i * (w * .55 / st), yy = y - h * .25 - i * h * .07; g.lineTo(xx, yy); g.lineTo(xx + w * .55 / st, yy); } g.lineTo(x - w * .1, y - h * .82); g.lineTo(x, y - h); g.lineTo(x + w * .1, y - h * .82); for (let i = st - 1; i >= 0; i--) { const xx = x + w - i * (w * .55 / st), yy = y - h * .25 - i * h * .07; g.lineTo(xx - w * .55 / st, yy); g.lineTo(xx, yy); } g.lineTo(x + w, y); g.closePath(); },
  koutoubia: (x, y, h) => () => { const w = h * .14; P([[x - w, y], [x - w, y - h * .78], [x - w * .5, y - h * .78], [x - w * .5, y - h * .92], [x - w * .12, y - h * .92], [x - w * .12, y - h], [x + w * .12, y - h], [x + w * .12, y - h * .92], [x + w * .5, y - h * .92], [x + w * .5, y - h * .78], [x + w, y - h * .78], [x + w, y]]); },
  angkor: (x, y, h) => () => { const bud = (bx, by, bh, bw) => { g.moveTo(bx - bw, by); g.bezierCurveTo(bx - bw, by - bh * .5, bx - bw * .3, by - bh * .8, bx, by - bh); g.bezierCurveTo(bx + bw * .3, by - bh * .8, bx + bw, by - bh * .5, bx + bw, by); g.closePath(); };
    P([[x - h * .9, y], [x - h * .9, y - h * .22], [x + h * .9, y - h * .22], [x + h * .9, y]]); bud(x, y - h * .2, h * .8, h * .14); bud(x - h * .42, y - h * .2, h * .55, h * .11); bud(x + h * .42, y - h * .2, h * .55, h * .11); bud(x - h * .75, y - h * .2, h * .38, h * .09); bud(x + h * .75, y - h * .2, h * .38, h * .09); },
  moai: (x, y, h) => () => { S([[x - h * .2, y], [x - h * .22, y - h * .55], [x - h * .26, y - h * .8], [x - h * .14, y - h], [x + h * .12, y - h], [x + h * .16, y - h * .82], [x + h * .26, y - h * .7], [x + h * .2, y - h * .55], [x + h * .18, y]], .3); },
  casino: (x, y, h) => () => { const w = h * .8; P([[x - w, y], [x - w, y - h * .45], [x - w * .78, y - h * .45], [x - w * .78, y - h * .82], [x - w * .7, y - h * .92], [x - w * .62, y - h * .82], [x - w * .62, y - h * .5], [x + w * .62, y - h * .5], [x + w * .62, y - h * .82], [x + w * .7, y - h * .92], [x + w * .78, y - h * .82], [x + w * .78, y - h * .45], [x + w, y - h * .45], [x + w, y]]); E(x, y - h * .5, w * .28, h * .26); },
  stPauls: (x, y, h) => () => { const w = h * .42; P([[x - w, y], [x - w, y - h * .62], [x - w * .7, y - h * .62], [x - w * .7, y - h * .82], [x - w * .3, y - h * .82], [x, y - h], [x + w * .3, y - h * .82], [x + w * .7, y - h * .82], [x + w * .7, y - h * .62], [x + w, y - h * .62], [x + w, y]]); },
  lighthouse: (x, y, h) => () => { const w = h * .12; P([[x - w * 2.6, y], [x - w * 1.6, y - h * .14], [x - w, y - h * .14], [x - w * .8, y - h * .8], [x - w * 1.1, y - h * .8], [x - w * .6, y - h], [x + w * .6, y - h], [x + w * 1.1, y - h * .8], [x + w * .8, y - h * .8], [x + w, y - h * .14], [x + w * 1.6, y - h * .14], [x + w * 2.6, y]]); },
  ger: (x, y, h) => () => { const w = h * 1.1; g.moveTo(x - w, y); g.lineTo(x - w, y - h * .55); g.quadraticCurveTo(x - w * .4, y - h * .95, x, y - h); g.quadraticCurveTo(x + w * .4, y - h * .95, x + w, y - h * .55); g.lineTo(x + w, y); g.closePath(); },
};
function skyline(list, fill, edge) { for (const [k, x, y, h] of list) lm(LM[k](x, y, h), fill, edge); }
function plane(x, y, s, rot = -.18, col = '#fff') {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = col; g.beginPath(); g.moveTo(-26, 0); g.quadraticCurveTo(-24, -3.4, -14, -3.4); g.lineTo(18, -3); g.quadraticCurveTo(26, -2, 28, 0); g.quadraticCurveTo(26, 2, 18, 3); g.lineTo(-14, 3.4); g.quadraticCurveTo(-24, 3.4, -26, 0); g.fill();
  g.beginPath(); g.moveTo(2, -2); g.lineTo(-8, -20); g.lineTo(-3, -20); g.lineTo(12, -2); g.fill(); g.beginPath(); g.moveTo(2, 2); g.lineTo(-6, 13); g.lineTo(-2, 13); g.lineTo(10, 2); g.fill();
  g.beginPath(); g.moveTo(-20, -2); g.lineTo(-27, -11); g.lineTo(-23, -11); g.lineTo(-15, -2); g.fill();
  g.restore();
}
function contrail(x0, y0, x1, y1, w = 3) { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, 'rgba(255,240,230,0)'); gr.addColorStop(1, 'rgba(255,240,230,.75)'); g.save(); g.strokeStyle = gr; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.restore(); }
// gold double-pig coin (the Spread's calling card)
function pigCoin(x, y, r, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(() => C(0, 0, r), '#f4c445', '#b5801a', { lw: Math.max(1, r * .1), sx: -r * .14, sy: -r * .1, rim: ['#fff1a8', r * .1] });
  g.strokeStyle = '#9a6a10'; g.lineWidth = r * .07; g.beginPath(); C(0, 0, r * .8); g.stroke();
  // two pig faces (snouts) mirrored
  for (const k of [-1, 1]) { g.save(); g.translate(k * r * .32, 0); g.fillStyle = '#c8901e'; g.beginPath(); E(0, 0, r * .26, r * .3); g.fill(); g.fillStyle = '#8a5a0c'; g.beginPath(); E(0, r * .06, r * .13, r * .09); g.fill(); g.fillStyle = '#f4c445'; g.beginPath(); C(-r * .05, r * .06, r * .03); C(r * .05, r * .06, r * .03); g.fill(); g.fillStyle = '#8a5a0c'; g.beginPath(); C(-r * .1, -r * .12, r * .035); C(r * .1, -r * .12, r * .035); g.fill(); g.restore(); }
  g.restore();
}

/* ---------- backdrop helpers (all relative to W,H) ---------- */
function sky(W, H, stops) { vgrad(0, 0, W, H, stops); }
function stars(W, H, n, sd = 3, a = 1) { const s0 = seed; seed = sd; g.save(); for (let i = 0; i < n; i++) { g.globalAlpha = a * R(.3, 1); g.fillStyle = '#fff'; const x = R(0, W), y = R(0, H), r = R(.4, 1.3); g.fillRect(x, y, r, r); } g.restore(); seed = s0; }
function moon(x, y, r, col = '#fff6dc') { glow(x, y, r * 4, 'rgba(255,240,200,.25)'); g.save(); g.beginPath(); C(x, y, r); g.fillStyle = col; g.fill(); g.fillStyle = 'rgba(180,170,150,.35)'; g.beginPath(); C(x - r * .3, y - r * .2, r * .22); C(x + r * .25, y + r * .3, r * .15); g.fill(); g.restore(); }
function aurora(W, y, h, a = 1, sd = 5) {
  const s0 = seed; seed = sd; g.save(); g.globalCompositeOperation = 'lighter';
  for (let b = 0; b < 3; b++) { const col = b === 1 ? '120,80,255' : '60,255,170'; const yy = y + b * h * .25; for (let x = -20; x < W + 20; x += 6) { const wv = Math.sin(x * .012 + b * 2) * h * .3 + Math.sin(x * .031 + b) * h * .12; const gr = g.createLinearGradient(0, yy + wv - h * .6, 0, yy + wv + h * .2); gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(.7, `rgba(${col},${.16 * a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x, yy + wv - h * .6, 6.5, h * .8); } }
  g.restore(); seed = s0;
}
function mountains(W, baseY, h, col, edge, sd = 1, n = 6, snow = null) {
  const s0 = seed; seed = sd; const pts = [[-10, baseY]]; const step = (W + 20) / n;
  for (let i = 0; i <= n; i++) { pts.push([-10 + i * step - step * .5 + R(-step * .2, step * .2), baseY - h * R(.45, 1)]); pts.push([-10 + i * step + R(-step * .1, step * .1), baseY - h * R(.15, .45)]); }
  pts.push([W + 10, baseY]); seed = s0;
  g.save(); g.beginPath(); P(pts); g.fillStyle = col; g.fill();
  if (snow) { g.clip(); for (let i = 1; i < pts.length - 1; i++) { const [x, y] = pts[i]; if (baseY - y > h * .55) { g.fillStyle = snow; g.beginPath(); g.moveTo(x, y); g.lineTo(x - h * .16, y + h * .2); g.lineTo(x - h * .05, y + h * .15); g.lineTo(x + h * .03, y + h * .22); g.lineTo(x + h * .15, y + h * .18); g.closePath(); g.fill(); } } }
  if (edge) { g.restore(); g.save(); g.beginPath(); for (let i = 1; i < pts.length - 1; i++) i === 1 ? g.moveTo(...pts[i]) : g.lineTo(...pts[i]); g.strokeStyle = edge; g.lineWidth = 1.5; g.stroke(); }
  g.restore();
}
function buildings(W, baseY, hmin, hmax, cols, win, sd = 2, o = {}) {
  const s0 = seed; seed = sd; let x = -10;
  while (x < W + 10) { const w = R(o.wmin || 18, o.wmax || 46), h = R(hmin, hmax), c = cols[Math.floor(rnd() * cols.length)];
    g.fillStyle = c; g.fillRect(x, baseY - h, w + 1, h);
    if (o.roof === 'tin') { g.fillStyle = darken(c.length === 7 ? c : '#888888', .3); g.beginPath(); g.moveTo(x - 2, baseY - h); g.lineTo(x + w / 2, baseY - h - w * .25); g.lineTo(x + w + 2, baseY - h); g.fill(); }
    if (o.roof === 'dome' && rnd() < .3) { g.fillStyle = c; g.beginPath(); g.arc(x + w / 2, baseY - h, w * .35, PI, 0); g.fill(); }
    if (win) for (let wy = baseY - h + 6; wy < baseY - 6; wy += 9) for (let wx = x + 4; wx < x + w - 4; wx += 7) if (rnd() < (o.lit || .45)) { g.fillStyle = typeof win === 'string' ? win : win[Math.floor(rnd() * win.length)]; g.fillRect(wx, wy, 3, 4); }
    if (o.stripes) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + w - 3, baseY - h, 3, h); }
    x += w + (o.gap || 0); }
  seed = s0;
}
function water(W, y, H, c1, c2, glints = '#ffd9a0', sd = 9) { vgrad(0, y, W, H - y, [[0, c1], [1, c2]]); const s0 = seed; seed = sd; g.save(); for (let i = 0; i < 70; i++) { g.globalAlpha = R(.15, .6); g.fillStyle = glints; const yy = y + Math.pow(rnd(), 1.6) * (H - y), w = R(4, 24) * (1 + (yy - y) / (H - y)); g.fillRect(R(0, W), yy, w, 1.2); } g.restore(); seed = s0; }
function palm(x, y, h, col = '#0e1a14', lean = .15) { g.save(); g.strokeStyle = col; g.lineWidth = h * .05; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + h * lean, y - h * .5, x + h * lean * 1.4, y - h); g.stroke(); const tx = x + h * lean * 1.4, ty = y - h; g.fillStyle = col; for (let i = 0; i < 7; i++) { const a = -PI / 2 + (i - 3) * .5; g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx + Math.cos(a) * h * .3, ty + Math.sin(a) * h * .3 - h * .05, tx + Math.cos(a) * h * .45, ty + Math.sin(a) * h * .3 + h * .12); g.quadraticCurveTo(tx + Math.cos(a) * h * .25, ty + Math.sin(a) * h * .2, tx, ty + 2); g.fill(); } g.restore(); }
function boatSil(x, y, s, col, sail) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.moveTo(-30, -8); g.lineTo(30, -8); g.lineTo(22, 4); g.lineTo(-24, 4); g.closePath(); g.fill(); if (sail === 'dhow') { g.beginPath(); g.moveTo(-2, -8); g.lineTo(0, -50); g.lineTo(26, -14); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-6, -46); g.lineTo(18, -60); g.lineWidth = 1.6; g.strokeStyle = col; g.stroke(); } else if (sail === 'yacht') { g.fillRect(-16, -16, 30, 8); g.fillRect(-8, -22, 16, 6); g.fillStyle = 'rgba(255,230,160,.9)'; for (let i = 0; i < 5; i++) g.fillRect(-14 + i * 6, -13, 3, 2); } else { g.fillRect(-4, -20, 14, 12); g.fillRect(0, -32, 2, 12); } g.restore(); }
function floorPersp(W, y, H, c1, c2, lines = '#00000022', n = 10) { vgrad(0, y, W, H - y, [[0, c1], [1, c2]]); g.save(); g.strokeStyle = lines; g.lineWidth = 1; for (let i = -n; i <= n; i++) { g.beginPath(); g.moveTo(W / 2 + i * 14, y); g.lineTo(W / 2 + i * W * .16, H); g.stroke(); } for (let k = 1; k < 7; k++) { const yy = y + (H - y) * Math.pow(k / 7, 1.7); g.beginPath(); g.moveTo(0, yy); g.lineTo(W, yy); g.stroke(); } g.restore(); }
function wallPanels(W, y0, y1, c1, c2, n = 12) { vgrad(0, y0, W, y1 - y0, [[0, c1], [1, c2]]); g.save(); for (let i = 0; i <= n; i++) { const x = i * W / n; g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x - 1, y0, 2, y1 - y0); g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(x + 1, y0, 2, y1 - y0); } g.restore(); }
function windowFrame(x, y, w, h, inner, frame = '#2a1a10') { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); inner(); g.restore(); g.save(); g.strokeStyle = frame; g.lineWidth = 6; g.strokeRect(x, y, w, h); g.lineWidth = 3; g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); g.moveTo(x, y + h / 2); g.lineTo(x + w, y + h / 2); g.stroke(); g.strokeStyle = INK; g.lineWidth = 1.5; g.strokeRect(x - 3, y - 3, w + 6, h + 6); g.restore(); }
function lampCone(x, y, w, h, col = 'rgba(255,200,120,.28)') { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(255,180,90,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 12, y); g.lineTo(x + 12, y); g.lineTo(x + w / 2, y + h); g.lineTo(x - w / 2, y + h); g.closePath(); g.fill(); g.restore(); }
function rain(W, H, t, a = .35) { g.save(); g.strokeStyle = `rgba(190,210,255,${a})`; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 70; i++) { const x = (i * 97.3 + t * 60) % (W + 40) - 20, y = (i * 53.7 + t * 620) % (H + 40) - 20; g.moveTo(x, y); g.lineTo(x - 4, y + 14); } g.stroke(); g.restore(); }
function snowfall(W, H, t, a = .8) { g.save(); g.fillStyle = `rgba(255,255,255,${a})`; for (let i = 0; i < 60; i++) { const x = (i * 71.3 + Math.sin(t + i) * 20 + t * 15) % W, y = (i * 43.7 + t * 40) % H; g.beginPath(); C(x, y, (i % 3) * .6 + .8); g.fill(); } g.restore(); }
function vignette(W, H, a = .55) { const gr = g.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .3, W / 2, H * .5, Math.max(W, H) * .75); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(5,3,10,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function grain(W, H, a = .05) { const s0 = seed; seed = 77; g.save(); g.fillStyle = `rgba(255,255,255,${a})`; for (let i = 0; i < W * H / 300; i++) g.fillRect(R(0, W), R(0, H), 1, 1); g.restore(); seed = s0; }
