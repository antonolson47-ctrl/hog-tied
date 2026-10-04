/* ===================== CRIME SCENES: victims (graphic by default; Toned Down = sheet + chalk) ===================== */
function bloodPool(x, y, rx, ry, sd = 1, a = 1) {
  const s0 = seed; seed = sd; g.save(); g.globalAlpha = a; const pts = []; for (let i = 0; i < 16; i++) { const t = i / 16 * TAU, r = R(.7, 1.15); pts.push([x + Math.cos(t) * rx * r, y + Math.sin(t) * ry * r]); }
  g.beginPath(); S(pts, .8); const gr = g.createRadialGradient(x, y, 2, x, y, rx); gr.addColorStop(0, '#5a0008'); gr.addColorStop(.7, '#8a0a14'); gr.addColorStop(1, '#6a0610'); g.fillStyle = gr; g.fill();
  g.fillStyle = 'rgba(255,120,120,.35)'; g.beginPath(); E(x - rx * .3, y - ry * .3, rx * .3, ry * .12, -.2); g.fill(); seed = s0; g.restore();
}
function spatter(x, y, r, n, sd = 2, dir = 0) { const s0 = seed; seed = sd; g.save(); g.fillStyle = '#8a0a14'; for (let i = 0; i < n; i++) { const a = dir + R(-1.2, 1.2), d = R(0, r); const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * .6, s = R(.8, 3.4) * (1 - d / r * .6); g.beginPath(); E(px, py, s * 1.6, s, a); g.fill(); } seed = s0; g.restore(); }
function drip(x, y, len, w = 2.4) { g.save(); g.fillStyle = '#7a0810'; g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x + w / 2, y); g.lineTo(x + w * .4, y + len); g.arc(x, y + len, w * .7, 0, PI); g.closePath(); g.fill(); g.restore(); }
function sheetOver(x, y, w, h) { cel(() => { g.moveTo(x - w / 2, y); g.bezierCurveTo(x - w / 2, y - h, x - w * .2, y - h * 1.1, x, y - h * .9); g.bezierCurveTo(x + w * .3, y - h * 1.2, x + w / 2, y - h * .9, x + w / 2, y); g.closePath(); }, '#eef0f4', '#b8bccb', { lw: 2.4, sx: -6, sy: 0, tex: () => { line([[x - w * .2, y - h * .8], [x - w * .1, y - h * .2]], '#c8ccd8', 1.6); line([[x + w * .15, y - h * .9], [x + w * .2, y - h * .3]], '#c8ccd8', 1.6); } }); }
function chalk(x, y, w, h) { g.save(); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2.4; g.setLineDash([6, 3]); g.beginPath(); E(x - w * .38, y, h * .22, h * .2); g.moveTo(x - w * .25, y); g.lineTo(x + w * .3, y - h * .1); g.lineTo(x + w * .45, y - h * .25); g.moveTo(x + w * .3, y + h * .05); g.lineTo(x + w * .45, y + h * .2); g.moveTo(x - w * .05, y - h * .1); g.lineTo(x - w * .1, y - h * .35); g.moveTo(x, y + h * .08); g.lineTo(x - w * .05, y + h * .32); g.stroke(); g.restore(); }
// a lying human figure (top-down-ish 3/4), head at left. o: skin, hair, shirt, pants, face ('up'|'down'), wound
function corpse(x, y, s, o) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const sk = o.skin, skd = darken(sk, .25), sh = o.shirt || '#444', pa = o.pants || '#222';
  cel(() => { S([[20, -14], [90, -18], [120, -8], [124, 4], [90, 10], [20, 12]], .6); }, pa, darken(pa, .4), { lw: 2.2, sx: 0, sy: -3 }); // legs
  cel(() => { E(126, -10, 10, 6); E(128, 6, 10, 6); }, '#1a1a1a', '#000', { lw: 1.6, sx: 0, sy: 0 });
  cel(() => S([[-36, -26], [24, -24], [30, 0], [24, 22], [-36, 24], [-44, 0]], .7), sh, darken(sh, .4), { lw: 2.4, sx: 0, sy: -4, tex: o.shirtTex }); // torso
  cel(() => { S([[-30, -26], [10, -40], [24, -46], [28, -40], [12, -30], [-24, -18]], .6); S([[-30, 24], [-6, 40], [14, 48], [18, 42], [-2, 30], [-24, 16]], .6); }, sh, darken(sh, .4), { lw: 2, sx: 0, sy: -2 }); // arms
  cel(() => { C(28, -44, 6); C(18, 46, 6); }, sk, skd, { lw: 1.6, sx: 0, sy: -1 }); // hands
  // head
  cel(() => E(-60, 0, 20, 18), sk, skd, { lw: 2.2, sx: 0, sy: -3, hi: () => { if (o.boiled) hiBlob(-60, 0, 18, 14, .5, 0, '#ff5a4a'); if (o.pale) hiBlob(-60, 0, 18, 14, .35, 0, '#9ab0c0'); } });
  if (o.face !== 'down') { deadFace(o); }
  cel(() => { g.moveTo(-78, -12); g.quadraticCurveTo(-82, 0, -78, 12); g.quadraticCurveTo(-70, 18, -66, 14); g.quadraticCurveTo(-74, 0, -66, -14); g.quadraticCurveTo(-70, -18, -78, -12); g.closePath(); }, o.hair || '#1a1210', '#000', { lw: 1.8, sx: 0, sy: 0 });
  if (o.hat) o.hat();
  g.restore();
}
const VICTIM = {
  tito: (W, H, toned) => { const x = W * .5, y = H * .72, s = Math.min(W / 520, H / 400) * 1.6;
    if (toned) { chalk(x, y, 220 * s, 80 * s); sheetOver(x, y + 20 * s, 230 * s, 60 * s); return; }
    bloodPool(x - 30 * s, y + 18 * s, 120 * s, 34 * s, 4); spatter(x - 60 * s, y - 120 * s, 60 * s, 40, 5, -1.2);
    corpse(x - 40 * s, y, s, { skin: '#d9a27c', hair: '#1a1210', shirt: '#16161c', pants: '#16161c', coin: 1, shirtTex: () => { g.fillStyle = '#f2efe8'; g.fillRect(-36, -6, 50, 12); g.fillStyle = '#7a0810'; g.fillRect(-36, -8, 60, 16); } });
    g.save(); g.translate(x - 40 * s, y); g.scale(s, s); g.strokeStyle = '#5a0008'; g.lineWidth = 4; g.beginPath(); g.moveTo(-44, -8); g.quadraticCurveTo(-38, 0, -44, 8); g.stroke(); g.fillStyle = '#c81e28'; g.beginPath(); E(-42, 0, 4, 9); g.fill(); g.restore();
    drip(x - 74 * s, y + 6 * s, 20 * s); // bandoneon + cat
    cel(() => RR(x + 70 * s, y - 20 * s, 60 * s, 34 * s, 6), '#1a1a1a', '#000', { lw: 2, sx: 0, sy: -2, tex: () => { for (let i = 0; i < 6; i++) { g.fillStyle = '#c8c0a8'; g.fillRect(x + 76 * s + i * 9 * s, y - 16 * s, 5 * s, 26 * s); } } });
    cel(() => { E(x + 100 * s, y - 34 * s, 18 * s, 12 * s); C(x + 116 * s, y - 46 * s, 9 * s); P([[x + 110 * s, y - 52 * s], [x + 112 * s, y - 62 * s], [x + 116 * s, y - 54 * s]]); P([[x + 118 * s, y - 54 * s], [x + 122 * s, y - 62 * s], [x + 124 * s, y - 50 * s]]); }, '#2a2a30', '#14141a', { lw: 1.6, sx: -2, sy: 0, hi: () => { g.fillStyle = '#c8f040'; g.beginPath(); C(x + 113 * s, y - 47 * s, 1.6 * s); C(x + 119 * s, y - 47 * s, 1.6 * s); g.fill(); } }); },
  ringo: (W, H, toned) => { const x = W * .5, y = H * .46, w = Math.min(W * .84, 520), h = Math.min(H * .42, 280);
    g.save(); g.fillStyle = '#062a34'; g.fillRect(x - w / 2, y - h / 2, w, h); g.beginPath(); g.rect(x - w / 2, y - h / 2, w, h); g.clip();
    if (toned) { g.fillStyle = 'rgba(160,220,230,.5)'; g.fillRect(x - w / 2, y - h / 2, w, h); g.fillStyle = '#3a5a3a'; g.beginPath(); g.moveTo(x - w / 2, y - h / 2); g.lineTo(x + w / 2, y - h / 2); g.lineTo(x + w / 2, y + h * .1); g.quadraticCurveTo(x, y - h * .05, x - w / 2, y + h * .15); g.fill(); txt('TARP OVER THE TANK', x, y - h * .25, fa(16), '#d8e8d0', null); }
    else { g.fillStyle = 'rgba(140,10,20,.35)'; g.fillRect(x - w / 2, y - h / 2, w, h); const s = Math.min(h / 150, w / 250); corpse(x - 10 * s, y + 10 * s, s, { skin: '#6a5048', hair: '#141010', shirt: '#9d1c2a', pants: '#222', pale: 1, shirtTex: () => txt('7', -6, 0, fa(16), '#fff', null) });
      for (let i = 0; i < 9; i++) { const cx = x + (i * 61 % w) - w / 2 + 20, cy = y + ((i * 37) % (h * .5)) - h * .1; cel(() => { E(cx, cy, 12 * s, 8 * s); for (const k of [-1, 1]) { g.moveTo(cx + k * 10 * s, cy); g.lineTo(cx + k * 22 * s, cy - 8 * s); } }, '#c84a2a', '#8a2a14', { lw: 1.4, sx: -1, sy: -1 }); }
      spatter(x - 60 * s, y, 60 * s, 30, 7); g.fillStyle = 'rgba(90,0,10,.5)'; for (let i = 0; i < 6; i++) { g.beginPath(); E(x - 70 * s + i * 20 * s, y - 14 * s, 9 * s, 5 * s); g.fill(); } }
    for (let b = 0; b < 14; b++) { g.fillStyle = 'rgba(220,255,255,.45)'; g.beginPath(); C(x - w / 2 + (b * 47) % w, y + h / 2 - ((b * 29 + RT.t * 30) % h), 2.4); g.fill(); }
    g.restore(); g.save(); g.strokeStyle = '#8a9a9a'; g.lineWidth = 8; g.strokeRect(x - w / 2, y - h / 2, w, h); g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(x - w / 2 - 4, y - h / 2 - 4, w + 8, h + 8); g.restore(); },
  sandy: (W, H, toned) => { const x = W * .5, y = H * .62, w = Math.min(W * .78, 500), h = Math.min(H * .3, 170);
    cel(() => E(x, y, w / 2, h / 2), '#e8e2d8', '#b8b0a4', { lw: 3, sx: 0, sy: -4 }); g.save(); g.beginPath(); E(x, y, w / 2 - 14, h / 2 - 12); g.clip();
    vgrad(x - w / 2, y - h / 2, w, h, toned ? [[0, '#5ac8e8'], [1, '#2a7aa8']] : [[0, '#c83a4a'], [1, '#5a0814']]);
    for (let b = 0; b < 30; b++) { g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); C(x - w / 2 + (b * 53) % w, y - h / 2 + ((b * 31 + RT.t * 50) % h), 2 + b % 3); g.fill(); }
    const s = h / 120; if (toned) { sheetOver(x, y + 20 * s, 200 * s, 40 * s); } else { corpse(x, y, s * .95, { skin: '#f0c8ae', hair: '#c8642a', shirt: '#e8e2d0', pants: '#2a3a6a', face: 'down' }); g.fillStyle = 'rgba(120,0,10,.7)'; g.beginPath(); E(x - 58 * s, y - 4 * s, 16 * s, 12 * s); g.fill(); spatter(x - 60 * s, y, 70 * s, 26, 9); }
    g.restore(); txt(toned ? '' : '', x, y, fa(10), '#fff'); },
  bjarki: (W, H, toned) => { const x = W * .5, y = H * .66, w = Math.min(W * .78, 500), h = Math.min(H * .26, 150);
    g.fillStyle = '#2a2a30'; g.beginPath(); E(x, y, w / 2 + 16, h / 2 + 12); g.fill(); g.save(); g.beginPath(); E(x, y, w / 2, h / 2); g.clip(); vgrad(x - w / 2, y - h / 2, w, h, [[0, '#6ac8d8'], [1, '#2a6a8a']]);
    const s = h / 110; if (toned) sheetOver(x, y + 20 * s, 200 * s, 40 * s); else { corpse(x, y, s * .9, { skin: '#e88a7a', hair: '#e8cf8a', shirt: '#6a5a4a', pants: '#2a2a3a', boiled: 1, coin: 1, shirtTex: () => { g.fillStyle = '#e8e2d0'; for (let i = -3; i <= 3; i++) g.fillRect(-30 + i * 8, -20, 4, 4); } }); for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(255,240,230,.55)'; g.beginPath(); E(x - 30 * s + i * 14 * s, y - 20 * s + (i % 2) * 30 * s, 6 * s, 4 * s); g.fill(); } }
    cel(() => { E(x + w * .3, y - h * .1, 16, 10); C(x + w * .3, y - h * .1 - 12, 5); }, '#c8302a', '#80101a', { lw: 1.6, sx: -1, sy: 0 }); g.restore();
    g.save(); g.globalAlpha = .5; for (let i = 0; i < 9; i++) { g.fillStyle = '#fff'; g.beginPath(); E(x - w / 2 + i * w / 8, y - h * .5 - (RT.t * 20 + i * 30) % 120, 40, 18); g.fill(); } g.restore(); },
  chad: (W, H, toned) => { const x = W * .5, y = H * .78, s = Math.min(W / 520, H / 400) * 1.5;
    g.fillStyle = '#3a2a1a'; g.fillRect(x + 60 * s, y - 120 * s, 150 * s, 110 * s); g.fillStyle = '#5a3a24'; g.fillRect(x + 60 * s, y - 126 * s, 150 * s, 10 * s);
    if (toned) { chalk(x - 20 * s, y, 220 * s, 80 * s); sheetOver(x - 20 * s, y + 10 * s, 220 * s, 50 * s); cel(() => E(x - 110 * s, y - 20 * s, 18 * s, 12 * s), '#9d1c2a', '#5a0a14', { lw: 1.6, sx: 0, sy: -2 }); return; }
    bloodPool(x - 10 * s, y + 14 * s, 130 * s, 30 * s, 12); spatter(x + 20 * s, y - 120 * s, 90 * s, 60, 13, -1.6);
    corpse(x - 20 * s, y, s, { skin: '#f0c0a0', hair: '#f0d070', shirt: '#9d1c2a', pants: '#2a3a5a', shirtTex: () => { g.fillStyle = '#5a0008'; g.beginPath(); C(-4, -4, 7); g.fill(); g.fillStyle = '#200'; g.beginPath(); C(-4, -4, 2.6); g.fill(); } });
    cel(() => { E(x - 120 * s, y - 24 * s, 18 * s, 12 * s); E(x - 120 * s, y - 34 * s, 8 * s, 5 * s); }, '#9d1c2a', '#5a0a14', { lw: 1.6, sx: 0, sy: -2 }); cel(() => RR(x - 4 * s, y - 40 * s, 26 * s, 16 * s, 3 * s), '#1a1a1a', '#000', { lw: 1.4, sx: 0, sy: 0, tex: () => { g.fillStyle = '#ff2a2a'; g.beginPath(); C(x + 18 * s, y - 36 * s, 2 * s); g.fill(); } }); },
};
