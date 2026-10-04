/* ===================== GORE PASS 2: dead eyes, wounds, smears, flies (skipped entirely in Toned Down) ===================== */
function deadFace(o) { // head lies at (-60,0) in corpse-local space, face up
  for (const ey of [-6.5, 6.5]) { g.fillStyle = '#f4efe6'; g.beginPath(); E(-62, ey, 3.8, 2.8, 0); g.fill(); g.strokeStyle = 'rgba(160,30,40,.8)'; g.lineWidth = .9; g.stroke(); g.fillStyle = o.boiled ? '#e8e8e0' : '#6a6a70'; g.beginPath(); C(-61.2, ey + .3, 1.3); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-65.5, ey - 2.4); g.quadraticCurveTo(-62, ey - 4, -58.5, ey - 2.4); g.stroke(); }
  g.fillStyle = '#2a0408'; g.beginPath(); E(-47.5, 0, 3, 4.6); g.fill(); // slack mouth
  if (o.coin) pigCoin(-47, 0, 5.2, 1.5);
  g.fillStyle = '#8a0a14'; g.beginPath(); g.moveTo(-46, 3); g.quadraticCurveTo(-41, 8, -38, 16); g.lineTo(-36, 15); g.quadraticCurveTo(-39, 7, -45, 1); g.fill(); // blood from the mouth
  g.beginPath(); g.moveTo(-52, -2); g.quadraticCurveTo(-48, -6, -44, -10); g.lineTo(-43, -9); g.quadraticCurveTo(-47, -5, -51, -1); g.fill(); // nosebleed
}
function handprint(x, y, s, rot = 0, a = .85) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = a; g.fillStyle = '#7a0810'; g.beginPath(); E(0, 0, 7, 8); g.fill(); for (const [fx, fy, l] of [[-6, -9, 8], [-2, -12, 10], [2, -12, 10], [6, -10, 9], [9, -2, 7]]) { g.beginPath(); g.ellipse(fx, fy - l / 2 + 2, 1.9, l / 2, (fx * .04), 0, TAU); g.fill(); } g.restore(); }
function smear(x0, y0, x1, y1, w, a = .7) { g.save(); g.globalAlpha = a; const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, '#6a0610'); gr.addColorStop(1, 'rgba(106,6,16,0)'); g.strokeStyle = gr; g.lineCap = 'round'; for (let i = -1; i <= 1; i++) { g.lineWidth = w * (i ? .35 : .6); g.beginPath(); g.moveTo(x0, y0 + i * w * .35); g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + i * w * .5, x1, y1 + i * w * .3); g.stroke(); } g.restore(); }
function arcSpray(x, y, r, a0, a1, n, sd) { const s0 = seed; seed = sd; g.save(); g.fillStyle = '#8a0a14'; for (let i = 0; i < n; i++) { const t = i / n, a = lerp(a0, a1, t), rr_ = r * R(.85, 1.1); const px = x + Math.cos(a) * rr_, py = y + Math.sin(a) * rr_; const sz = R(1, 3.6) * (1 - t * .5); g.beginPath(); E(px, py, sz * 1.8, sz, a); g.fill(); if (R(0, 1) > .7) drip(px, py, R(6, 22), sz * .9); } g.restore(); seed = s0; }
function flies(x, y, r, n, sd) { const s0 = seed; seed = sd; for (let i = 0; i < n; i++) { const fx = x + R(-r, r), fy = y + R(-r * .6, r * .4); g.fillStyle = '#0a0a0a'; g.beginPath(); E(fx, fy, 2, 1.4); g.fill(); g.fillStyle = 'rgba(200,220,255,.6)'; g.beginPath(); E(fx - 1.6, fy - 1.6, 1.8, 1, -.6); E(fx + 1.6, fy - 1.6, 1.8, 1, .6); g.fill(); } seed = s0; }
function gash(x, y, w, h, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = '#3a0006'; g.beginPath(); g.moveTo(-w / 2, 0); g.quadraticCurveTo(0, -h, w / 2, 0); g.quadraticCurveTo(0, h, -w / 2, 0); g.fill(); g.fillStyle = '#b01a28'; g.beginPath(); g.moveTo(-w * .42, 0); g.quadraticCurveTo(0, -h * .45, w * .42, 0); g.quadraticCurveTo(0, h * .3, -w * .42, 0); g.fill(); g.fillStyle = 'rgba(255,170,170,.6)'; g.fillRect(-w * .2, -h * .18, w * .3, h * .12); g.restore(); }
(function () {
  const T = VICTIM.tito, Rg = VICTIM.ringo, Sa = VICTIM.sandy, Bj = VICTIM.bjarki, Ch = VICTIM.chad;
  VICTIM.tito = (W, H, toned) => { if (toned) return T(W, H, toned); const x = W * .5, y = H * .72, s = Math.min(W / 520, H / 400) * 1.6;
    arcSpray(x - 100 * s, y - 6 * s, 80 * s, -2.9, -1.5, 46, 31); smear(x - 110 * s, y + 10 * s, x - 260 * s, y + 40 * s, 22 * s); handprint(x - 150 * s, y + 30 * s, s * 1.1, -.4); handprint(x + 40 * s, y - 30 * s, s, .3, .6);
    T(W, H, toned); gash(x - 92 * s, y + 1 * s, 16 * s, 7 * s, Math.PI / 2); flies(x - 100 * s, y - 16 * s, 26 * s, 7, 5); bloodPool(x + 96 * s, y + 6 * s, 30 * s, 8 * s, 8, .9); };
  VICTIM.ringo = (W, H, toned) => { Rg(W, H, toned); if (toned) return; const x = W * .5, y = H * .46, w = Math.min(W * .84, 520), h = Math.min(H * .42, 280);
    g.save(); g.beginPath(); g.rect(x - w / 2, y - h / 2, w, h); g.clip(); const s0 = seed; seed = 41; for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(150,0,16,${R(.12, .3)})`; g.beginPath(); E(x + R(-w * .4, w * .2), y + R(-h * .4, h * .1), R(20, 60), R(12, 30)); g.fill(); } seed = s0; g.restore(); };
  VICTIM.sandy = (W, H, toned) => { Sa(W, H, toned); if (toned) return; const x = W * .5, y = H * .62, w = Math.min(W * .78, 500), h = Math.min(H * .3, 170);
    handprint(x - w * .42, y - h * .38, 1.1, -.5); handprint(x - w * .34, y - h * .46, 1, -.2, .7); smear(x - w * .4, y - h * .4, x - w * .55, y - h * .2, 10);
    g.save(); g.strokeStyle = '#aab'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + w * .18, y + h * .22); g.lineTo(x + w * .36, y - h * .1); g.stroke(); g.fillStyle = '#ccd'; g.beginPath(); E(x + w * .37, y - h * .12, 7, 4, -.8); g.fill(); g.restore();
    arcSpray(x - w * .2, y - h * .5, 40, -2.8, -.4, 26, 17); };
  VICTIM.bjarki = (W, H, toned) => { Bj(W, H, toned); if (toned) return; const x = W * .5, y = H * .66, h = Math.min(H * .26, 150), s = h / 110 * .9;
    const s0 = seed; seed = 23; for (let i = 0; i < 16; i++) { g.fillStyle = 'rgba(255,236,210,.85)'; g.strokeStyle = 'rgba(160,40,30,.7)'; g.lineWidth = 1; g.beginPath(); C(x + R(-70, 100) * s, y + R(-30, 30) * s, R(2, 4.5) * s); g.fill(); g.stroke(); } seed = s0;
    g.save(); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - 30 * s, y - 50 * s); g.lineTo(x - 20 * s, y - 40 * s); g.moveTo(x - 60 * s, y + 46 * s); g.lineTo(x - 70 * s, y + 52 * s); g.stroke(); g.restore(); };
  VICTIM.chad = (W, H, toned) => { if (toned) return Ch(W, H, toned); const x = W * .5, y = H * .78, s = Math.min(W / 520, H / 400) * 1.5;
    Ch(W, H, toned);
    // exit wound: pool behind the head + skull fragments + spatter up the window
    bloodPool(x - 108 * s, y + 6 * s, 50 * s, 14 * s, 19); const s0 = seed; seed = 29; for (let i = 0; i < 9; i++) { g.fillStyle = i % 3 ? '#d8a8a0' : '#f0e8e0'; g.beginPath(); E(x - 140 * s + R(-30, 30) * s, y + R(-6, 16) * s, R(2, 5) * s, R(1.4, 3) * s, R(0, 3)); g.fill(); } seed = s0;
    arcSpray(x - 80 * s, y - 40 * s, Math.min(H * .38, 260), -2.1, -1.0, 70, 37); handprint(x + 70 * s, y - 60 * s, s * 1.2, .2);
    g.save(); g.fillStyle = '#6a0610'; g.beginPath(); E(x - 81 * s, y - 6 * s, 3.2 * s, 2.6 * s); g.fill(); g.restore(); flies(x - 100 * s, y - 20 * s, 30 * s, 6, 9); };
})();
