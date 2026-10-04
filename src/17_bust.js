/* ===================== CAST GENERATOR: parametric half-body busts in the same pulp-noir cel style ===================== */
// Coordinates match kayleighHalf: origin = bottom center of torso, torso top -150, head center (0,-206), face ~ r24.
function faceShape(kind) {
  if (kind === 'round') return [[0, -35], [19, -31], [27, -14], [27, 6], [21, 20], [9, 29], [-9, 29], [-21, 20], [-27, 6], [-27, -14], [-19, -31]];
  if (kind === 'long') return [[0, -38], [16, -34], [22, -16], [22, 8], [17, 24], [6, 34], [-6, 34], [-17, 24], [-22, 8], [-22, -16], [-16, -34]];
  if (kind === 'square') return [[0, -36], [20, -32], [25, -14], [25, 10], [22, 24], [10, 31], [-10, 31], [-22, 24], [-25, 10], [-25, -14], [-20, -32]];
  if (kind === 'heart') return [[0, -36], [19, -32], [25, -14], [23, 4], [16, 20], [5, 30], [-5, 30], [-16, 20], [-23, 4], [-25, -14], [-19, -32]];
  if (kind === 'kid') return [[0, -34], [22, -30], [30, -12], [29, 10], [21, 25], [0, 32], [-21, 25], [-29, 10], [-30, -12], [-22, -30]];
  return [[0, -36], [18, -32], [24, -15], [24, 4], [20, 18], [9, 29], [-9, 29], [-20, 18], [-24, 4], [-24, -15], [-18, -32]];
}
function eyePair(sp, ex) {
  const iris = sp.iris || '#3a2414', y = sp.eyeY || -4, w = sp.eyeW || 5.2;
  for (const x of [-10, 10]) {
    g.save();
    if (ex === 'dead') { g.strokeStyle = INK; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x - 4, y - 4); g.lineTo(x + 4, y + 4); g.moveTo(x + 4, y - 4); g.lineTo(x - 4, y + 4); g.stroke(); g.restore(); continue; }
    if (ex === 'smile' || ex === 'grin') { g.strokeStyle = INK; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x - w, y + 1); g.quadraticCurveTo(x, y - 5, x + w, y + 1); g.stroke(); g.restore(); continue; }
    const h = ex === 'scared' ? 5.4 : ex === 'smug' ? 2.6 : ex === 'angry' ? 3.6 : ex === 'sad' ? 3.8 : 4.2;
    g.beginPath(); E(x, y, w, h); g.fillStyle = '#fffaf2'; g.fill(); g.save(); g.clip();
    const lk = ex === 'smug' ? -1.4 : ex === 'scared' ? 0 : .4;
    g.beginPath(); C(x + lk, y + .3, ex === 'scared' ? 2.2 : 3); g.fillStyle = iris; g.fill(); g.beginPath(); C(x + lk, y + .3, ex === 'scared' ? 1.1 : 1.5); g.fillStyle = '#0a0606'; g.fill();
    g.beginPath(); C(x + lk - 1, y - 1, .9); g.fillStyle = '#fff'; g.fill();
    if (ex === 'smug' || ex === 'tired') { g.fillStyle = darken(sp.skin, .12); g.fillRect(x - 7, y - 8, 14, 6.4); }
    if (ex === 'angry') { g.fillStyle = darken(sp.skin, .12); g.beginPath(); g.moveTo(x - 7, y - 6); g.lineTo(x + 7, y - 6); g.lineTo(x + 7 * (x < 0 ? 1 : -1), y - 1); g.closePath(); g.fill(); }
    g.restore();
    g.strokeStyle = INK; g.lineWidth = 1.8; g.beginPath(); E(x, y, w, h); g.stroke();
    if (sp.lashes) { g.lineWidth = 1.4; g.beginPath(); g.moveTo(x + (x < 0 ? -w : w), y - 1); g.lineTo(x + (x < 0 ? -w - 2.6 : w + 2.6), y - 3.4); g.stroke(); }
    g.restore();
  }
}
function browPair(sp, ex) {
  const c = sp.brow || darken(sp.hair || '#222', .1), y = (sp.eyeY || -4) - 8, th = sp.browW || 2.6;
  const tilt = ex === 'angry' ? 4 : ex === 'scared' || ex === 'sad' ? -3 : ex === 'smug' ? 0 : 0;
  g.save(); g.strokeStyle = c; g.lineWidth = th; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-17, y + (ex === 'smug' ? -2 : 0) - tilt * .2); g.quadraticCurveTo(-10, y - 4 - (ex === 'scared' ? 2 : 0), -3, y + tilt);
  g.moveTo(3, y + tilt); g.quadraticCurveTo(10, y - 4 - (ex === 'scared' ? 2 : 0) - (ex === 'smug' ? 3 : 0), 17, y - tilt * .2); g.stroke(); g.restore();
}
function mouthOf(sp, ex) {
  const y = sp.mouthY || 15, lip = sp.lips;
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.9; g.lineCap = 'round';
  if (ex === 'smile' || ex === 'grin' || ex === 'shout' || ex === 'scared') {
    const open = ex === 'grin' ? 7 : ex === 'shout' ? 10 : ex === 'scared' ? 6 : 5, wd = ex === 'scared' ? 6 : ex === 'shout' ? 9 : 10;
    g.beginPath();
    if (ex === 'scared' || ex === 'shout') E(0, y + 3, wd, open * .6); else { g.moveTo(-wd, y - 1); g.quadraticCurveTo(0, y + 1, wd, y - 1); g.quadraticCurveTo(wd * .7, y + open + 2, 0, y + open + 2); g.quadraticCurveTo(-wd * .7, y + open + 2, -wd, y - 1); g.closePath(); }
    g.fillStyle = '#5a1a1e'; g.fill(); g.save(); g.clip(); g.fillStyle = sp.gold ? '#f4c445' : '#fffdf6'; g.fillRect(-12, y - 4, 24, ex === 'shout' ? 4 : 4.4); if (ex !== 'scared') { g.fillStyle = '#d65a66'; g.beginPath(); E(0, y + open + 1, 6, 3); g.fill(); } g.restore(); g.stroke();
  } else if (ex === 'smug') { g.beginPath(); g.moveTo(-8, y + 1); g.quadraticCurveTo(2, y + 3, 10, y - 2); g.stroke(); }
  else if (ex === 'angry') { g.beginPath(); g.moveTo(-8, y + 2); g.quadraticCurveTo(0, y - 2, 8, y + 2); g.stroke(); }
  else if (ex === 'sad') { g.beginPath(); g.moveTo(-7, y + 3); g.quadraticCurveTo(0, y - 1, 7, y + 3); g.stroke(); }
  else if (ex === 'dead') { g.beginPath(); g.moveTo(-7, y + 2); g.lineTo(7, y + 1); g.stroke(); g.fillStyle = '#ff7a9a'; g.beginPath(); E(3, y + 5, 3, 4); g.fill(); g.stroke(); }
  else { g.beginPath(); g.moveTo(-7, y); g.quadraticCurveTo(0, y + 2, 7, y); g.stroke(); }
  if (lip && ex !== 'shout' && ex !== 'scared') { g.strokeStyle = lip; g.lineWidth = 2.6; g.globalAlpha = .85; g.beginPath(); g.moveTo(-7, y + 3); g.quadraticCurveTo(0, y + 5.5, 7, y + 3); g.stroke(); }
  g.restore();
}
function hairBack(sp) {
  const H = sp.hair, HD = darken(H, .35), st = sp.hairStyle;
  const o = { lw: 2.2, sx: -3, sy: -2, rim: sp.rim ? [sp.rim, 1.8] : undefined };
  if (st === 'long' || st === 'lowbun' || st === 'veil') cel(() => S([[-28, -24], [-30, 10], [-26, 36], [-14, 44], [14, 44], [26, 36], [30, 10], [28, -24], [0, -40]], .7), H, HD, o);
  if (st === 'lowbun') cel(() => C(0, 30, 12), H, HD, o);
  if (st === 'ponytail') { cel(() => C(4, -46, 9), sp.scrunchie || '#ff5aa8', darken(sp.scrunchie || '#ff5aa8', .3), { lw: 1.8, sx: -1, sy: -1 }); cel(() => S([[0, -50], [18, -58], [34, -40], [36, -6], [28, 22], [22, 26], [24, -6], [16, -40]], .7), H, HD, o); cel(() => C(4, -46, 9), sp.scrunchie || '#ff5aa8', darken(sp.scrunchie || '#ff5aa8', .3), { lw: 1.8, sx: -1, sy: -1 }); }
  if (st === 'bob') cel(() => S([[-29, -22], [-30, 6], [-26, 22], [-12, 24], [12, 24], [26, 22], [30, 6], [29, -22], [0, -42]], .7), H, HD, o);
  if (st === 'afro' || st === 'curly') { const s0 = seed; seed = 4 + (sp.id || '').length * 7; const cs = []; const big = st === 'afro' ? 1.25 : 1; for (let i = 0; i < 24; i++) { const a = Math.PI * (.95 + i / 23 * 1.1); cs.push([Math.cos(a) * 30 * big, -6 + Math.sin(a) * 33 * big, R(6, 8.5) * big]); } for (let i = 0; i < 12; i++) cs.push([R(-22, 22) * big, R(-42, -24) * big, R(6, 8) * big]); seed = s0; cel(() => { for (const [x, y, r] of cs) C(x, y, r); }, H, HD, o); }
  if (st === 'wild') cel(() => S([[-30, -6], [-38, -30], [-22, -52], [0, -58], [24, -52], [38, -30], [30, -6], [20, -30], [-20, -30]], .8), H, HD, o);
}
function hairFront(sp) {
  const H = sp.hair, HD = darken(H, .35), st = sp.hairStyle, hl = lighten(H, .35);
  const o = { lw: 2.1, sx: -2.5, sy: -2, rim: sp.rim ? [sp.rim, 1.6] : undefined };
  const cap = (top = -40, side = -6) => { g.moveTo(-24.5, side); g.bezierCurveTo(-26, -30, -12, top, 1, top + .5); g.bezierCurveTo(15, top + 1, 26, -30, 24.5, side); g.bezierCurveTo(21, -16, 16, -22, 9, -23.5); g.bezierCurveTo(3, -25, -4, -25, -10, -23.5); g.bezierCurveTo(-17, -21.5, -21.5, -15, -24.5, side); g.closePath(); };
  switch (st) {
    case 'slick': case 'ponytail': case 'lowbun': cel(() => cap(), H, HD, Object.assign({}, o, { hi: () => { line([[-16, -24], [-10, -33], [0, -37]], hl, 2, .8); line([[6, -25], [12, -31], [18, -28]], hl, 1.2, .6); } })); break;
    case 'bob': cel(() => { g.moveTo(-28, -2); g.bezierCurveTo(-30, -34, -10, -44, 4, -42); g.bezierCurveTo(24, -40, 30, -24, 28, -2); g.bezierCurveTo(22, -14, 18, -22, 8, -20); g.lineTo(-14, -18); g.bezierCurveTo(-22, -16, -26, -8, -28, -2); g.closePath(); }, H, HD, Object.assign({}, o, { hi: () => { if (sp.streak) { g.fillStyle = sp.streak; g.beginPath(); g.moveTo(6, -41); g.quadraticCurveTo(14, -30, 12, -20); g.lineTo(17, -21); g.quadraticCurveTo(18, -32, 11, -41); g.closePath(); g.fill(); } line([[-18, -28], [-4, -38], [10, -38]], hl, 1.6, .7); } })); break;
    case 'long': cel(() => { g.moveTo(-26, 4); g.bezierCurveTo(-30, -34, -10, -44, 2, -42); g.bezierCurveTo(22, -42, 30, -26, 26, 4); g.bezierCurveTo(22, -14, 14, -24, 2, -26); g.bezierCurveTo(-10, -24, -22, -14, -26, 4); g.closePath(); }, H, HD, o); break;
    case 'veil': cel(() => cap(), H, HD, o); break;
    case 'pompadour': cel(() => { g.moveTo(-24, -6); g.bezierCurveTo(-30, -30, -18, -58, 8, -60); g.bezierCurveTo(30, -62, 40, -46, 30, -38); g.bezierCurveTo(28, -30, 26, -20, 24, -6); g.bezierCurveTo(20, -18, 12, -24, 2, -26); g.bezierCurveTo(-8, -26, -18, -20, -24, -6); g.closePath(); }, H, HD, Object.assign({}, o, { hi: () => line([[-16, -30], [-6, -48], [14, -54]], hl, 2.2, .9) })); break;
    case 'fade': cel(() => { g.moveTo(-24, -12); g.bezierCurveTo(-24, -34, -10, -42, 0, -42); g.bezierCurveTo(12, -42, 24, -34, 24, -12); g.bezierCurveTo(18, -24, 8, -28, 0, -28); g.bezierCurveTo(-8, -28, -18, -24, -24, -12); g.closePath(); }, H, HD, Object.assign({}, o, { hi: () => { g.fillStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 18; i++) { g.beginPath(); C(-16 + (i % 6) * 6.4, -38 + Math.floor(i / 6) * 4, .8); g.fill(); } } })); break;
    case 'buzz': cel(() => { g.moveTo(-24, -10); g.bezierCurveTo(-24, -32, -10, -38, 0, -38); g.bezierCurveTo(12, -38, 24, -32, 24, -10); g.bezierCurveTo(18, -22, 8, -26, 0, -26); g.bezierCurveTo(-8, -26, -18, -22, -24, -10); g.closePath(); }, H, HD, o); break;
    case 'frosted': cel(() => { g.moveTo(-25, -8); g.lineTo(-24, -30); g.lineTo(-16, -44); g.lineTo(-10, -36); g.lineTo(-4, -48); g.lineTo(2, -38); g.lineTo(8, -48); g.lineTo(13, -37); g.lineTo(20, -45); g.lineTo(23, -30); g.lineTo(25, -8); g.bezierCurveTo(18, -22, 8, -26, 0, -26); g.bezierCurveTo(-8, -26, -18, -22, -25, -8); g.closePath(); }, H, HD, Object.assign({}, o, { hi: () => { g.fillStyle = '#fff3b0'; for (const [x, y] of [[-16, -42], [-4, -46], [8, -46], [20, -43]]) { g.beginPath(); P([[x - 3, y + 6], [x, y], [x + 3, y + 6]]); g.fill(); } } })); break;
    case 'combover': cel(() => { g.moveTo(-24, -6); g.bezierCurveTo(-26, -24, -18, -36, 4, -37); g.bezierCurveTo(18, -37, 24, -26, 24, -6); g.lineTo(21, -10); g.bezierCurveTo(20, -24, 6, -30, -18, -24); g.lineTo(-22, -10); g.closePath(); }, H, HD, o); break;
    case 'bald': { g.save(); g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); E(-7, -27, 8, 3.5, -.3); g.fill(); g.restore(); if (sp.fringe) cel(() => { E(-23, -4, 4, 9); E(23, -4, 4, 9); }, H, HD, { lw: 1.4, sx: 0, sy: 0 }); break; }
    case 'wild': cel(() => { g.moveTo(-25, -6); g.bezierCurveTo(-28, -30, -12, -42, 2, -40); g.bezierCurveTo(16, -40, 28, -30, 25, -6); g.bezierCurveTo(16, -20, -16, -20, -25, -6); g.closePath(); }, H, HD, o); break;
    case 'curly': case 'afro': break;
    case 'gray': cel(() => cap(-38, -8), H, HD, o); break;
    case 'beehive': cel(() => { g.moveTo(-26, -6); g.bezierCurveTo(-34, -40, -20, -66, 0, -66); g.bezierCurveTo(20, -66, 34, -40, 26, -6); g.bezierCurveTo(20, -20, 10, -24, 0, -24); g.bezierCurveTo(-10, -24, -20, -20, -26, -6); g.closePath(); }, H, HD, Object.assign({}, o, { hi: () => { for (let i = 0; i < 5; i++) line([[-14 + i * 6, -60 + i], [-18 + i * 7, -30]], hl, 1, .5); } })); break;
  }
}
function facialHair(sp) {
  const c = sp.beardCol || sp.hair || '#222', cd = darken(c, .3);
  if (sp.beard === 'stubble') { g.save(); g.fillStyle = 'rgba(30,20,20,.22)'; g.beginPath(); g.moveTo(-22, 6); g.quadraticCurveTo(-18, 30, 0, 31); g.quadraticCurveTo(18, 30, 22, 6); g.quadraticCurveTo(10, 22, 0, 22); g.quadraticCurveTo(-10, 22, -22, 6); g.fill(); g.restore(); }
  if (sp.beard === 'full' || sp.beard === 'striped') { cel(() => S([[-25, -2], [-24, 22], [-14, 40], [0, 46], [14, 40], [24, 22], [25, -2], [16, 12], [6, 20], [-6, 20], [-16, 12]], .7), c, cd, { lw: 1.8, sx: -2, sy: 0, hi: () => { if (sp.beard === 'striped') { g.fillStyle = '#ece6da'; g.beginPath(); g.moveTo(-3, 20); g.lineTo(3, 20); g.lineTo(2.5, 45); g.lineTo(-2.5, 45); g.closePath(); g.fill(); } } }); }
  if (sp.beard === 'goatee') cel(() => S([[-7, 20], [7, 20], [6, 32], [0, 36], [-6, 32]], .7), c, cd, { lw: 1.6, sx: 0, sy: 0 });
  if (sp.stache === 'walrus') cel(() => S([[-15, 8], [0, 6], [15, 8], [17, 18], [8, 16], [0, 18], [-8, 16], [-17, 18]], .6), c, cd, { lw: 1.6, sx: 0, sy: -1 });
  if (sp.stache === 'thick') cel(() => S([[-12, 9], [0, 7], [12, 9], [13, 14], [0, 13], [-13, 14]], .6), c, cd, { lw: 1.6, sx: 0, sy: -1 });
  if (sp.stache === 'meringue') cel(() => { E(-8, 11, 9, 5, -.2); E(8, 11, 9, 5, .2); }, c, cd, { lw: 1.6, sx: 0, sy: -1 });
  if (sp.stache === 'pencil') line([[-9, 10], [0, 9], [9, 10]], c, 2);
}
function hatOf(sp) {
  const h = sp.hat; if (!h) return;
  const o = { lw: 2.2, sx: -4, sy: 0, rim: sp.rim ? [sp.rim, 1.8] : undefined };
  if (h === 'captain') { cel(() => { g.moveTo(-28, -26); g.bezierCurveTo(-30, -50, -16, -56, 0, -56); g.bezierCurveTo(16, -56, 30, -50, 28, -26); g.closePath(); }, '#f4f2ee', '#c8c4bc', o); cel(() => RR(-28, -32, 56, 8, 2), '#14141c', '#000', { lw: 1.6, sx: 0, sy: 0 }); cel(() => { g.moveTo(-26, -24); g.quadraticCurveTo(0, -12, 26, -24); g.lineTo(22, -28); g.quadraticCurveTo(0, -20, -22, -28); g.closePath(); }, '#14141c', '#000', { lw: 1.6, sx: 0, sy: 0 }); g.fillStyle = '#f4c445'; g.beginPath(); C(0, -40, 4); g.fill(); }
  if (h === 'snout') { cel(() => { g.moveTo(-27, -22); g.bezierCurveTo(-28, -52, -12, -58, 0, -58); g.bezierCurveTo(12, -58, 28, -52, 27, -22); g.closePath(); }, '#9d1c2a', '#5a0a14', o); cel(() => { E(-18, -54, 7, 8, -.4); E(18, -54, 7, 8, .4); }, '#9d1c2a', '#5a0a14', { lw: 1.8, sx: -1, sy: 0 }); cel(() => E(0, -36, 11, 8), '#f3a0b4', '#c86a84', { lw: 1.8, sx: -1, sy: 0 }); g.fillStyle = '#7a2a3a'; g.beginPath(); E(-4, -36, 2, 3); E(4, -36, 2, 3); g.fill(); }
  if (h === 'bowler') { cel(() => { g.moveTo(-34, -28); g.quadraticCurveTo(0, -20, 34, -28); g.lineTo(30, -32); g.quadraticCurveTo(0, -26, -30, -32); g.closePath(); }, sp.hatCol || '#2a1e18', '#140c08', o); cel(() => { g.moveTo(-18, -30); g.bezierCurveTo(-20, -60, 20, -60, 18, -30); g.closePath(); }, sp.hatCol || '#2a1e18', '#140c08', o); }
  if (h === 'beanie') cel(() => { g.moveTo(-27, -16); g.bezierCurveTo(-30, -50, 30, -50, 27, -16); g.closePath(); }, sp.hatCol || '#1a1a22', '#0a0a10', Object.assign({}, o, { hi: () => { g.fillStyle = 'rgba(255,255,255,.08)'; for (let i = -24; i < 26; i += 5) g.fillRect(i, -42, 2, 26); } }));
  if (h === 'cap') { cel(() => { g.moveTo(-26, -20); g.bezierCurveTo(-28, -50, 28, -50, 26, -20); g.closePath(); }, sp.hatCol || '#9d1c2a', darken(sp.hatCol || '#9d1c2a', .4), o); cel(() => { g.moveTo(-26, -22); g.quadraticCurveTo(-10, -14, 34, -18); g.lineTo(30, -24); g.quadraticCurveTo(0, -26, -26, -22); g.closePath(); }, darken(sp.hatCol || '#9d1c2a', .2), darken(sp.hatCol || '#9d1c2a', .5), { lw: 1.6, sx: 0, sy: 0 }); }
  if (h === 'mongol') { cel(() => { g.moveTo(-26, -20); g.bezierCurveTo(-24, -50, -6, -62, 0, -64); g.bezierCurveTo(6, -62, 24, -50, 26, -20); g.closePath(); }, '#c8202a', '#80101a', o); cel(() => RR(-30, -28, 60, 12, 5), '#3a2a1a', '#1a100a', { lw: 1.6, sx: 0, sy: 0 }); g.fillStyle = '#f4c445'; g.beginPath(); C(0, -64, 3); g.fill(); }
  if (h === 'hardhat') { cel(() => { g.moveTo(-30, -24); g.bezierCurveTo(-28, -56, 28, -56, 30, -24); g.closePath(); }, '#f2c230', '#b8861c', o); glow(0, -44, 18, 'rgba(255,250,200,.9)'); }
  if (h === 'cowboy') { cel(() => { g.moveTo(-44, -26); g.quadraticCurveTo(0, -12, 44, -26); g.quadraticCurveTo(30, -34, 20, -30); g.lineTo(-20, -30); g.quadraticCurveTo(-30, -34, -44, -26); g.closePath(); }, '#f4f0e6', '#c8c0aa', o); cel(() => { g.moveTo(-20, -28); g.bezierCurveTo(-22, -60, -6, -54, 0, -50); g.bezierCurveTo(6, -54, 22, -60, 20, -28); g.closePath(); }, '#f4f0e6', '#c8c0aa', o); }
}
function glassesOf(sp) {
  const gl = sp.glasses; if (!gl) return; const y = (sp.eyeY || -4);
  g.save(); g.lineWidth = 2; g.strokeStyle = INK;
  if (gl === 'round' || gl === 'reading') { g.fillStyle = 'rgba(220,240,255,.25)'; g.beginPath(); C(-10, y, gl === 'round' ? 7.5 : 6); C(10, y, gl === 'round' ? 7.5 : 6); g.fill(); g.strokeStyle = sp.glassCol || '#222'; g.lineWidth = 2.2; g.stroke(); g.beginPath(); g.moveTo(-2.5, y - 1); g.quadraticCurveTo(0, y - 3, 2.5, y - 1); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.2; g.beginPath(); g.arc(-10, y, 4.5, 3.6, 4.5); g.arc(10, y, 4.5, 3.6, 4.5); g.stroke(); if (sp.fog) { g.fillStyle = 'rgba(240,248,255,.6)'; g.beginPath(); C(-10, y, 7); C(10, y, 7); g.fill(); } if (gl === 'reading' && sp.chain) line([[-17, y + 2], [-24, 20], [-20, 44]], '#f4c445', 1.2); }
  if (gl === 'sun' || gl === 'aviator') { g.fillStyle = '#14141c'; g.beginPath(); if (gl === 'aviator') { E(-10, y + 1, 8, 6.4); E(10, y + 1, 8, 6.4); } else { RR(-19, y - 5, 17, 10, 3); RR(2, y - 5, 17, 10, 3); } g.fill(); g.strokeStyle = gl === 'aviator' ? '#d8c070' : INK; g.stroke(); g.beginPath(); g.moveTo(-2, y - 2); g.lineTo(2, y - 2); g.stroke(); g.strokeStyle = 'rgba(160,200,255,.6)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-15, y + 2); g.lineTo(-9, y - 3); g.moveTo(5, y + 2); g.lineTo(11, y - 3); g.stroke(); }
  if (gl === 'monocle') { g.beginPath(); C(10, y, 8.5); g.fillStyle = 'rgba(200,235,255,.18)'; g.fill(); g.lineWidth = 3.2; g.stroke(); g.lineWidth = 2; g.strokeStyle = '#f4c445'; g.stroke(); line([[17, y + 6], [24, 26], [20, 50]], '#f4c445', 1.3); }
  if (gl === 'onhead') { g.translate(0, -26); g.fillStyle = '#14141c'; g.beginPath(); E(-10, 0, 8, 5); E(10, 0, 8, 5); g.fill(); g.strokeStyle = '#d8c070'; g.stroke(); }
  g.restore();
}
function headOf(sp, ex) {
  const sk = sp.skin, skd = darken(sk, .2);
  if (!sp._hb) hairBack(sp);
  cel(() => { E(-sp.earX || -24.5, 3, 4.5, 7.5); E(sp.earX || 24.5, 3, 4.5, 7.5); }, sk, skd, { lw: 1.8, sx: 1, sy: 0 });
  if (sp.earrings) for (const x of [-25, 25]) { g.save(); g.beginPath(); if (sp.earrings === 'hoop') { g.arc(x, 14, 4, 0, TAU); g.strokeStyle = '#f4c445'; g.lineWidth = 1.6; g.stroke(); } else { C(x, 10, sp.earrings === 'pearl' ? 2.4 : 2); g.fillStyle = sp.earrings === 'jade' ? '#3ac08a' : sp.earrings === 'pearl' ? '#f6f2ea' : '#f2c34a'; g.fill(); g.strokeStyle = INK; g.lineWidth = .8; g.stroke(); } g.restore(); }
  const fs = faceShape(sp.face);
  cel(() => S(fs, .95), sk, skd, { lw: 2.3, sx: -3.5, sy: -1, rim: sp.rim ? [lighten(sk.length === 7 ? sk : '#ccaa88', .35), 1.6] : undefined, hi: () => { if (sp.blush !== false) { hiBlob(-12, 11, 5.5, 3.2, sp.blushA || .2, 0, '#ff8b7a'); hiBlob(12, 11, 5.5, 3.2, sp.blushA || .2, 0, '#ff8b7a'); } if (sp.wrinkles) { line([[-18, 2], [-15, 6]], skd, 1, .8); line([[18, 2], [15, 6]], skd, 1, .8); line([[-8, -22], [8, -22]], skd, 1, .6); line([[-6, -26], [6, -26]], skd, 1, .5); } if (sp.scar) { g.strokeStyle = '#b05050'; g.lineWidth = 1.6; g.beginPath(); for (let i = 0; i < 3; i++) { g.moveTo(10 + i * 3, 6); g.lineTo(14 + i * 3, 18); } g.stroke(); } if (sp.freckles) freckles([[-14, 4], [-11, 6], [-8, 4], [8, 4], [11, 6], [14, 4], [-12, 8, .6], [12, 8, .6]], sp.freckleCol || '#a8603e'); if (sp.sunburn) hiBlob(0, 4, 18, 6, .35, 0, '#ff5a4a'); } });
  browPair(sp, ex); eyePair(sp, ex);
  // nose
  g.save(); g.fillStyle = skd; const nz = sp.nose || 1;
  g.beginPath(); g.moveTo(1, -4); g.quadraticCurveTo(5 * nz, 6 * nz, 4.5 * nz, 9 * nz); g.quadraticCurveTo(2, 10.5 * nz, -1, 9.4 * nz); g.quadraticCurveTo(3, 6, 1, -4); g.fill();
  g.strokeStyle = darken(sk, .45); g.lineWidth = 1.2; g.beginPath(); g.moveTo(-3.5, 9 * nz); g.quadraticCurveTo(-1, 11 * nz, 1.5, 10 * nz); g.moveTo(3.4, 10 * nz); g.quadraticCurveTo(5.4, 10 * nz, 5.8, 8.4 * nz); g.stroke(); g.restore();
  facialHair(sp);
  if (!(sp.stache === 'walrus' && ex !== 'shout')) mouthOf(sp, ex);
  if (sp.cigar) { cel(() => { g.save(); g.translate(8, 18); g.rotate(.25); RR(0, -2.5, 18, 5, 2); g.restore(); }, '#7a4a2a', '#4a2a14', { lw: 1.2, sx: 0, sy: 0 }); }
  hairFront(sp);
  if (sp.hairStyle === 'veil') { g.save(); g.globalAlpha = .38; g.fillStyle = '#000'; g.beginPath(); g.moveTo(-30, -30); g.lineTo(30, -30); g.lineTo(32, 6); g.lineTo(-32, 6); g.fill(); g.restore(); }
  glassesOf(sp);
  if (sp.carnation) { cel(() => C(18, -24, 6.5), '#e02040', '#900a20', { lw: 1.4, sx: -1, sy: -1, hi: () => { g.strokeStyle = '#ff6a80'; g.lineWidth = .8; g.beginPath(); C(18, -24, 3); g.stroke(); } }); }
  hatOf(sp);
}
// outfit on the torso; bw = half width
function torsoOf(sp, bw) {
  const o = sp.outfit || {}, col = o.col || '#333', cd = darken(col, .4), rim = sp.rim ? [sp.rim, 2.4] : undefined;
  const body = () => S([[-bw + 4, -150], [bw - 4, -150], [bw + 8, -60], [bw + 10, 0], [-bw - 10, 0], [-bw - 8, -60]], .7);
  const t = o.type || 'tee';
  const shirt = o.shirt || '#f2efe8';
  if (t === 'dress' || t === 'tango') {
    cel(body, col, cd, { lw: 2.5, sx: -6, sy: 0, rim });
    cel(() => { g.moveTo(-18, -152); g.quadraticCurveTo(0, -112, 18, -152); g.closePath(); }, sp.skin, darken(sp.skin, .2), { lw: 2, sx: 0, sy: 0 });
    if (sp.pearls) for (let i = 0; i < 9; i++) { const a = PI * (.15 + i / 8 * .7); g.beginPath(); C(Math.cos(a) * 16, -152 + Math.sin(a) * 16, 2.2); g.fillStyle = '#f6f2ea'; g.fill(); g.strokeStyle = INK; g.lineWidth = .7; g.stroke(); }
  } else if (t === 'cheongsam') {
    cel(body, col, cd, { lw: 2.5, sx: -6, sy: 0, rim, tex: () => { g.strokeStyle = '#3ac08a'; g.lineWidth = 2; g.beginPath(); g.moveTo(-4, -150); g.quadraticCurveTo(10, -130, 22, -118); g.stroke(); for (const [x, y] of [[4, -142], [14, -128]]) { g.fillStyle = '#3ac08a'; g.beginPath(); C(x, y, 2.4); g.fill(); } } });
    cel(() => RR(-12, -160, 24, 12, 3), col, cd, { lw: 1.8, sx: -2, sy: 0 });
  } else {
    if (t !== 'tee' && t !== 'sweater' && t !== 'jersey' && t !== 'hawaiian' && t !== 'polo' && t !== 'deel' && t !== 'chokha') cel(body, shirt, darken(shirt, .18), { lw: 2.5, sx: -6, sy: 0 });
    if (t === 'tee' || t === 'jersey' || t === 'polo' || t === 'sweater' || t === 'hawaiian') cel(body, col, cd, { lw: 2.5, sx: -6, sy: 0, rim, tex: () => {
      if (t === 'jersey') { txt(o.num || '7', 0, -84, fa(40), '#fff', INK, 3); g.fillStyle = '#fff'; g.fillRect(-bw - 10, -122, 16, 6); g.fillRect(bw - 6, -122, 16, 6); }
      if (t === 'sweater') { g.fillStyle = o.col2 || '#e8e2d0'; for (let i = -3; i <= 3; i++) { g.beginPath(); P([[i * 12 - 5, -140], [i * 12, -130], [i * 12 + 5, -140]]); g.fill(); } g.fillRect(-bw, -126, bw * 2, 3); for (let i = -4; i <= 4; i++) { g.beginPath(); C(i * 10, -118, 2); g.fill(); } }
      if (t === 'hawaiian') { const s0 = seed; seed = 31; for (let i = 0; i < 16; i++) { const x = R(-bw, bw), y = R(-140, -10); g.fillStyle = rnd() < .5 ? '#ffd23a' : '#ff6a8a'; for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; g.beginPath(); C(x + Math.cos(a) * 3.4, y + Math.sin(a) * 3.4, 2.6); g.fill(); } g.fillStyle = '#fff'; g.beginPath(); C(x, y, 1.5); g.fill(); } seed = s0; }
      if (o.graphic) txt(o.graphic, 0, -80, fa(o.graphic.length > 10 ? 8 : 12), o.gcol || '#9fd0ff', null);
    } });
    if (t === 'polo') { cel(() => { P([[-16, -152], [0, -140], [-10, -132]]); P([[16, -152], [0, -140], [10, -132]]); }, lighten(col, .1), cd, { lw: 1.6, sx: 0, sy: 0 }); }
    if (t === 'suit' || t === 'jacket' || t === 'windbreaker' || t === 'blazer' || t === 'cardigan' || t === 'vest' || t === 'overalls' || t === 'trench' || t === 'parka') {
      if (o.tie === 'tie') cel(() => P([[-4, -146], [4, -146], [7, -80], [0, -70], [-7, -80]]), o.tieCol || '#9d1c2a', darken(o.tieCol || '#9d1c2a', .4), { lw: 1.6, sx: -1, sy: 0 });
      if (o.tie === 'bow') cel(() => { P([[0, -144], [-13, -152], [-13, -136]]); P([[0, -144], [13, -152], [13, -136]]); }, o.tieCol || '#9d1c2a', darken(o.tieCol || '#9d1c2a', .4), { lw: 1.6, sx: 0, sy: 0 });
      if (o.tie === 'ascot') cel(() => S([[-10, -150], [10, -150], [12, -128], [0, -112], [-12, -128]], .7), o.tieCol || '#e8b23a', darken(o.tieCol || '#e8b23a', .35), { lw: 1.6, sx: -1, sy: 0 });
      const open = t === 'overalls' ? 0 : t === 'vest' ? 16 : 20;
      if (t === 'overalls') cel(() => { RR(-bw + 2, -100, (bw - 2) * 2, 100, 6); RR(-bw + 6, -150, 10, 56, 3); RR(bw - 16, -150, 10, 56, 3); }, col, cd, { lw: 2.3, sx: -5, sy: 0, rim, tex: () => { g.fillStyle = '#f4c445'; g.beginPath(); C(-bw + 11, -98, 3); C(bw - 11, -98, 3); g.fill(); } });
      else cel(() => { S([[-bw + 4, -152], [-open, -150], [-open - 6, -100], [-open - 10, -40], [-open - 6, 0], [-bw - 10, 0], [-bw - 8, -70], [-bw - 6, -130]], .6); S([[bw - 4, -152], [open, -150], [open + 6, -100], [open + 10, -40], [open + 6, 0], [bw + 10, 0], [bw + 8, -70], [bw + 6, -130]], .6); }, col, cd, { lw: 2.5, sx: -7, sy: 0, rim, tex: () => {
        if (t === 'vest') { g.strokeStyle = darken(col, .25); g.lineWidth = 1.6; for (let y = -130; y < 0; y += 18) { g.beginPath(); g.moveTo(-bw - 10, y); g.lineTo(-open - 4, y + 2); g.moveTo(open + 4, y + 2); g.lineTo(bw + 10, y); g.stroke(); } }
        if (t === 'windbreaker') { txt('FBI', -bw + 14 + (open > 18 ? 0 : 0), -112, fa(11), '#ffd23a', null, 0, 'left'); }
        if (t === 'blazer') { g.fillStyle = 'rgba(255,255,255,.07)'; for (let x = -bw; x < bw; x += 4) for (let y = -150; y < 0; y += 4) if ((x + y) % 8 === 0) g.fillRect(x, y, 2, 2); }
        if (t === 'cardigan') { for (let y = -120; y < 0; y += 24) { g.fillStyle = '#f4f0e6'; g.beginPath(); C(-open - 4, y, 2.4); g.fill(); } }
        if (t === 'parka') { g.fillStyle = 'rgba(255,255,255,.1)'; for (let y = -130; y < 0; y += 20) g.fillRect(-bw - 10, y, bw * 2 + 20, 2); }
      } });
      if (t === 'suit' || t === 'blazer' || t === 'trench') cel(() => { P([[-open, -150], [-open - 12, -146], [-open - 4, -100]]); P([[open, -150], [open + 12, -146], [open + 4, -100]]); }, o.lapel || darken(col, .15), cd, { lw: 1.8, sx: -2, sy: 0 });
      if (t === 'parka') cel(() => S([[-bw, -158], [bw, -158], [bw + 4, -138], [-bw - 4, -138]], .5), '#e8e4dc', '#b8b0a4', { lw: 2, sx: 0, sy: -2 });
    }
    if (t === 'chokha' || t === 'deel') {
      cel(body, col, cd, { lw: 2.5, sx: -6, sy: 0, rim, tex: () => {
        if (t === 'chokha') { for (const sd of [-1, 1]) for (let i = 0; i < 6; i++) { g.fillStyle = '#d8c070'; g.fillRect(sd * (bw - 18) - 6, -128 + i * 9, 12, 5); g.fillStyle = darken(col, .5); g.fillRect(sd * (bw - 18) - 6, -128 + i * 9 + 5, 12, 2); } g.fillStyle = shirt; g.beginPath(); P([[-12, -150], [12, -150], [0, -110]]); g.fill(); }
        if (t === 'deel') { g.strokeStyle = o.col2 || '#f4c445'; g.lineWidth = 4; g.beginPath(); g.moveTo(-14, -152); g.quadraticCurveTo(10, -130, bw - 6, -110); g.stroke(); g.fillStyle = o.sash || '#f4c445'; g.fillRect(-bw - 8, -56, bw * 2 + 16, 12); }
      } });
    }
  }
  // arms hanging at the sides
  const sleeve = t === 'dress' || t === 'tango' ? sp.skin : (t === 'vest' || t === 'overalls') ? (o.shirt || shirt) : (t === 'tee' || t === 'jersey' || t === 'polo' || t === 'hawaiian') ? col : col;
  const scd = darken(sleeve.length === 7 ? sleeve : '#888888', .35);
  cel(() => { S([[-bw - 2, -146], [-bw + 10, -120], [-bw + 4, -40], [-bw - 2, 0], [-bw - 22, 0], [-bw - 20, -60], [-bw - 14, -130]], .6); S([[bw + 2, -146], [bw - 10, -120], [bw - 4, -40], [bw + 2, 0], [bw + 22, 0], [bw + 20, -60], [bw + 14, -130]], .6); }, sleeve, scd, { lw: 2.4, sx: -5, sy: 0, rim });
  if (sp.gloves) cel(() => { E(-bw - 12, -6, 8, 9); E(bw + 12, -6, 8, 9); }, '#141018', '#000', { lw: 1.6, sx: 0, sy: 0, tex: () => { g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = .7; for (let i = -18; i < 18; i += 4) { g.beginPath(); g.moveTo(-bw - 20 + i, -14); g.lineTo(-bw - 4 + i, 2); g.stroke(); } } });
}
function extrasOf(sp, bw) {
  const ex = sp.extras || [];
  if (ex.includes('chain')) { g.save(); g.strokeStyle = '#f4c445'; g.lineWidth = 3; g.beginPath(); g.arc(0, -150, 22, .3, PI - .3); g.stroke(); g.restore(); }
  if (ex.includes('pins')) for (const [x, y, c] of [[-bw + 6, -120, '#9d1c2a'], [-bw + 14, -100, '#fff'], [bw - 14, -118, '#f4c445'], [bw - 8, -96, '#9d1c2a'], [-bw + 8, -80, '#f4c445']]) { g.beginPath(); C(x, y, 4); g.fillStyle = c; g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke(); }
  if (ex.includes('camera')) { cel(() => RR(-12, -118, 24, 18, 3), '#1a1a1a', '#000', { lw: 1.6, sx: 0, sy: 0 }); g.fillStyle = '#6a8aff'; g.beginPath(); C(0, -109, 5); g.fill(); g.fillStyle = '#ff2a2a'; g.beginPath(); C(8, -114, 1.8); g.fill(); line([[-12, -116], [-30, -150]], '#222', 2); line([[12, -116], [30, -150]], '#222', 2); }
  if (ex.includes('badge')) { g.save(); g.translate(bw - 18, -110); cel(() => { g.moveTo(0, -9); g.lineTo(7, -6); g.lineTo(7, 2); g.quadraticCurveTo(7, 7, 0, 10); g.quadraticCurveTo(-7, 7, -7, 2); g.lineTo(-7, -6); g.closePath(); }, '#f6c645', '#b8841c', { lw: 1.2, sx: -1, sy: 0 }); g.restore(); }
  if (ex.includes('kitty')) { g.save(); g.translate(-bw + 12, -104); mochiMeow(0, 0, .42); g.restore(); }
  if (ex.includes('hogpin')) { g.save(); g.translate(-bw + 14, -118); cel(() => E(0, 0, 7, 5), '#9d1c2a', '#5a0a14', { lw: 1.2, sx: 0, sy: 0 }); g.restore(); }
  if (ex.includes('cleaver')) {}
  if (ex.includes('apron')) cel(() => { RR(-bw + 8, -110, (bw - 8) * 2, 110, 8); }, '#f6f2ea', '#d8d0c0', { lw: 2, sx: -3, sy: 0, tex: () => { g.fillStyle = '#ff9ab0'; for (let i = 0; i < 12; i++) { g.beginPath(); C(-bw + 18 + (i % 4) * ((bw - 14) / 2), -96 + Math.floor(i / 4) * 30, 3); g.fill(); } txt('#1 GIGI', 0, -60, fm(10), '#9d1c2a', null); } });
  if (ex.includes('flour')) { hiBlob(-10, -90, 10, 6, .5, .3, '#fff'); hiBlob(16, -40, 8, 5, .4, -.3, '#fff'); }
  if (ex.includes('bandage')) { cel(() => RR(-bw + 4, -128, bw * 2 - 8, 20, 4), '#f6f2ea', '#d8d0c0', { lw: 1.4, sx: 0, sy: 0 }); g.fillStyle = '#c0101a'; g.beginPath(); E(4, -118, 6, 5); g.fill(); }
}
// MOCHI MEOW: Kambree's ORIGINAL cute-cat mascot (round white cat, blue bow, little fish charm, has a smile)
function mochiMeow(x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  cel(() => { P([[-20, -10], [-16, -30], [-6, -18]]); P([[20, -10], [16, -30], [6, -18]]); }, '#ffffff', '#e2e4ee', { lw: 2, sx: 0, sy: 0 });
  g.fillStyle = '#ffb3c8'; g.beginPath(); P([[-16, -14], [-14, -24], [-9, -17]]); P([[16, -14], [14, -24], [9, -17]]); g.fill();
  cel(() => E(0, 0, 24, 19), '#ffffff', '#e2e4ee', { lw: 2.2, sx: -3, sy: -2 });
  g.fillStyle = INK; g.beginPath(); E(-8, 1, 2.6, 3.4); E(8, 1, 2.6, 3.4); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); C(-8.8, -.4, 1); C(7.2, -.4, 1); g.fill();
  g.fillStyle = '#ff8aa8'; g.beginPath(); E(0, 6, 2.4, 1.7); g.fill();
  g.strokeStyle = INK; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-3.4, 9); g.quadraticCurveTo(-1.6, 11.2, 0, 9); g.quadraticCurveTo(1.6, 11.2, 3.4, 9); g.stroke();
  g.lineWidth = 1; for (const k of [-1, 1]) { g.beginPath(); g.moveTo(k * 14, 5); g.lineTo(k * 24, 3); g.moveTo(k * 14, 8); g.lineTo(k * 24, 9); g.stroke(); }
  hiBlob(-13, 7, 4, 2.4, .5, 0, '#ff9ab0'); hiBlob(13, 7, 4, 2.4, .5, 0, '#ff9ab0');
  // blue bow (on the right ear, NOT a red left-ear bow) + fish charm
  cel(() => { P([[12, -18], [4, -26], [4, -12]]); P([[12, -18], [22, -28], [22, -10]]); }, '#2f7de1', '#1b52a8', { lw: 1.6, sx: 0, sy: 0 });
  cel(() => C(12, -18, 3.4), '#7fb8ff', '#2f7de1', { lw: 1.2, sx: 0, sy: 0 });
  g.restore();
}
function bust(sp, o = {}) {
  const ex = o.ex || sp.ex || 'neutral', bw = { thin: 44, avg: 52, big: 62, huge: 74 }[sp.build || 'avg'];
  seed = 100 + (sp.id || 'x').charCodeAt(0);
  if (sp.twin && !o.solo) { // conjoined twins: two torsos sharing the middle
    g.save(); g.translate(-38, 0); bust(Object.assign({}, sp, { twin: 0 }), Object.assign({}, o, { solo: 1, ex: o.ex2 || ex })); g.restore();
    g.save(); g.translate(38, 0); bust(Object.assign({}, sp, sp.twin), Object.assign({}, o, { solo: 1, ex })); g.restore();
    cel(() => RR(-30, -100, 60, 100, 10), sp.outfit.col, darken(sp.outfit.col, .4), { lw: 2.2, sx: -4, sy: 0, tex: () => { txt('×', 0, -50, fa(14), 'rgba(255,255,255,.25)', null); } });
    return;
  }
  if (['long', 'lowbun', 'veil', 'ponytail', 'bob'].includes(sp.hairStyle)) { g.save(); g.translate(0, -210); g.scale(1.15, 1.15); hairBack(sp); g.restore(); sp = Object.assign({}, sp, { _hb: 1 }); }
  torsoOf(sp, bw);
  cel(() => S([[-10, -178], [10, -178], [12, -150], [0, -146], [-12, -150]], .6), sp.skin, darken(sp.skin, .22), { lw: 2, sx: 3, sy: 0, shade2: () => { g.moveTo(-11, -178); g.lineTo(11, -178); g.lineTo(11, -166); g.quadraticCurveTo(0, -162, -11, -168); g.closePath(); } });
  extrasOf(sp, bw);
  if (sp.collarUp) cel(() => { P([[-12, -150], [-30, -146], [-34, -176], [-18, -170]]); P([[12, -150], [30, -146], [34, -176], [18, -170]]); }, lighten(sp.outfit.col, .1), darken(sp.outfit.col, .3), { lw: 2, sx: -2, sy: 0 });
  g.save(); g.translate(0, -210); g.rotate(o.tilt || sp.tilt || 0); g.scale(1.15, 1.15); headOf(sp, ex); g.restore();
  if ((sp.extras || []).includes('pom')) { g.save(); g.translate(0, -24); cel(() => { E(0, 0, 26, 18); }, '#f39a3a', '#c96a1c', { lw: 2, sx: -3, sy: -2 }); g.restore(); }
}
