/* ===================== CHARACTERS: Kayleigh, KD, Cocoa, the Count (hand-built) ===================== */
const SKIN_K = '#efbe98', SKIN_KD = '#cf9170', HAIR_K = '#1d1517', HAIR_KD2 = '#0e0a0b';
const NAVY = '#1f3366', NAVYD = '#111c3c', COBALT = '#2266dd', COBALTD = '#163f94', BLK = '#22222b', BLKD = '#111117';
const RIM_C = '#5fe3ff', RIM_M = '#ff5aa8', RIM_O = '#ffb25a';

// ---------- shared face bits ----------
function tortoiseFrame(cx, cy, w, h, r) { // chunky tortoiseshell rim
  g.save();
  g.beginPath(); RR(cx - w / 2 - 2.6, cy - h / 2 - 2.6, w + 5.2, h + 5.2, r + 2.4); RR(cx - w / 2 + .6, cy - h / 2 + .6, w - 1.2, h - 1.2, r - .5);
  g.fillStyle = '#5a2c10'; g.fill('evenodd');
  g.clip('evenodd'); const s0 = seed; seed = Math.round(cx * 13 + 991);
  for (let i = 0; i < 26; i++) { g.fillStyle = rnd() < .55 ? '#b8682a' : (rnd() < .5 ? '#d89a48' : '#2a1206'); g.beginPath(); E(cx + R(-w / 2 - 3, w / 2 + 3), cy + R(-h / 2 - 3, h / 2 + 3), R(1.2, 3), R(.8, 2), R(0, 3)); g.fill(); }
  seed = s0; g.restore();
  g.save(); g.beginPath(); RR(cx - w / 2 - 2.6, cy - h / 2 - 2.6, w + 5.2, h + 5.2, r + 2.4); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke();
  g.beginPath(); RR(cx - w / 2 + .6, cy - h / 2 + .6, w - 1.2, h - 1.2, r - .5); g.lineWidth = 1.1; g.stroke(); g.restore();
  // glint on the frame
  g.save(); g.strokeStyle = 'rgba(255,235,200,.85)'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(cx - w / 2 + 1, cy - h / 2 - 1.2); g.lineTo(cx - w / 2 + w * .45, cy - h / 2 - 1.2); g.stroke(); g.restore();
}
function smileEye(x, y, s = 1, iris = '#3a2214', look = 0) {
  g.save();
  // happy, slightly squinted eye (big smile pushes lower lid up)
  g.beginPath(); g.moveTo(x - 5.6 * s, y + .6 * s); g.quadraticCurveTo(x, y - 5.2 * s, x + 5.6 * s, y + .4 * s); g.quadraticCurveTo(x, y + 2.6 * s, x - 5.6 * s, y + .6 * s); g.closePath();
  g.fillStyle = '#fffaf2'; g.fill(); g.clip();
  g.beginPath(); C(x + look * s, y - .8 * s, 3.3 * s); g.fillStyle = iris; g.fill();
  g.beginPath(); C(x + look * s, y - .8 * s, 1.6 * s); g.fillStyle = '#0c0606'; g.fill();
  g.beginPath(); C(x + look * s - 1.1 * s, y - 2 * s, 1 * s); g.fillStyle = '#fff'; g.fill();
  g.restore();
  g.save(); g.strokeStyle = INK; g.lineCap = 'round';
  g.lineWidth = 2 * s; g.beginPath(); g.moveTo(x - 6.4 * s, y + 1 * s); g.quadraticCurveTo(x, y - 6 * s, x + 6.2 * s, y - .2 * s); g.stroke(); // lash line
  g.lineWidth = 1.2 * s; g.beginPath(); g.moveTo(x + 5.6 * s, y - .8 * s); g.lineTo(x + 7.6 * s, y - 2.4 * s); g.stroke(); // wing lash
  g.lineWidth = .8 * s; g.globalAlpha = .7; g.beginPath(); g.moveTo(x - 4 * s, y + 2.6 * s); g.quadraticCurveTo(x, y + 4.2 * s, x + 4 * s, y + 2.4 * s); g.stroke(); // smile lid
  g.restore();
}
function freckles(pts, col = '#a8603e') { g.save(); g.fillStyle = col; g.globalAlpha = .75; for (const [x, y, r] of pts) { g.beginPath(); C(x, y, r || .7); g.fill(); } g.restore(); }

// ---------- KAYLEIGH: head, local coords, face center (0,0); face ~46 wide, chin +31, crown -36 ----------
function kayleighHead(o = {}) {
  const sk = SKIN_K, skd = SKIN_KD;
  // bun (behind) unless hidden under a hat
  if (!o.fedora) {
    cel(() => C(-4, -44, 15), HAIR_K, '#0b0809', { lw: 2.2, sx: -3, sy: -3, rim: [o.rim || RIM_C, 2], hi: () => { line([[-14, -50], [-6, -56], [4, -52]], '#6c6a8a', 2.2, .8); line([[-12, -42], [-2, -46], [8, -40]], '#4a4860', 1.4, .7); } });
  } else {
    cel(() => C(-30, -15, 10.5), HAIR_K, '#0b0809', { lw: 2, sx: -2, sy: -2, hi: () => line([[-37, -18], [-31, -22], [-24, -20]], '#6c6a8a', 1.8, .8) });
  }
  // ears
  cel(() => { E(-23.5, 4, 4.5, 7.5); E(23.5, 4, 4.5, 7.5); }, sk, skd, { lw: 1.8, sx: 1, sy: 0 });
  // neck shadow handled by body; face
  const face = () => S([[0, -36], [17, -31], [23.5, -16], [24, 2], [21.5, 15], [14, 25.5], [3, 30.5], [-8, 28.5], [-18, 19.5], [-23, 5], [-23.5, -12], [-18, -30]], .95);
  cel(face, sk, skd, { lw: 2.3, sx: -3.5, sy: -1, rim: [o.rim ? lighten('#ffd2b0', .3) : '#ffe3c8', 1.6], shade2: () => { // hard under-cheek + temple shadow
      g.moveTo(24, -4); g.quadraticCurveTo(18, 6, 19.5, 16); g.lineTo(25, 16); g.closePath(); },
    hi: () => { hiBlob(-11, 11, 6, 3.4, .32, 0, '#ff8b7a'); hiBlob(12, 11, 6, 3.4, .32, 0, '#ff8b7a'); hiBlob(-7, -22, 7, 3, .25, -.2, '#fff6e8'); } });
  // slicked-back hair cap (sleek, glossy)
  const cap = () => { g.moveTo(-23.5, -6); g.bezierCurveTo(-25, -30, -12, -40, 1, -39.5); g.bezierCurveTo(15, -39, 25, -30, 23.5, -6); g.bezierCurveTo(21, -16, 16, -22, 9, -23.5); g.bezierCurveTo(3, -25, -4, -25, -10, -23.5); g.bezierCurveTo(-17, -21.5, -21.5, -15, -23.5, -6); g.closePath(); };
  cel(cap, HAIR_K, '#0b0809', { lw: 2.2, sx: -2.5, sy: -2, rim: [o.rim || RIM_C, 1.8], hi: () => { // sleek comb lines + gloss
      line([[-17, -22], [-11, -32], [-2, -36.5]], '#77748f', 2.4, .9); line([[-8, -24.5], [-2, -31], [7, -35]], '#5a5874', 1.4, .8); line([[6, -24], [12, -30], [18, -28]], '#5a5874', 1.2, .7); line([[13, -23], [19, -20], [22, -12]], '#3c3a50', 1, .7); } });
  // brows (dark, arched)
  g.save(); g.fillStyle = '#1a1112'; if (o.ex === 'angry') { g.translate(0, 2); }
  g.beginPath(); g.moveTo(-19, -12.2); g.quadraticCurveTo(-12, -18.5, -4, -14.6); g.lineTo(-4.4, -12.6); g.quadraticCurveTo(-11.5, -15.6, -18.6, -10.6); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(4, -14.6); g.quadraticCurveTo(12, -18.8, 19.2, -12.6); g.lineTo(18.8, -11); g.quadraticCurveTo(12, -15.8, 4.4, -12.6); g.closePath(); g.fill(); g.restore();
  // eyes (expression-aware)
  const kex = o.ex || 'smile';
  if (kex === 'smile' || kex === 'grin') { smileEye(-10.5, -3.2, 1.18, '#3d2414', .5); smileEye(10.5, -3.2, 1.18, '#3d2414', .5); }
  else eyePair({ skin: sk, iris: '#3d2414', lashes: 1, eyeY: -3.4, eyeW: 5.6 }, kex === 'shock' ? 'scared' : kex === 'smirk' ? 'smug' : kex);
  // nose
  g.save(); g.fillStyle = skd; g.beginPath(); g.moveTo(2, -4); g.quadraticCurveTo(5.5, 5, 4.5, 9); g.quadraticCurveTo(2, 10.5, -.5, 9.4); g.quadraticCurveTo(3, 6, 2, -4); g.fill();
  g.strokeStyle = '#7a3e2a'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(-3.6, 9.2); g.quadraticCurveTo(-1, 11.2, 1.5, 10); g.moveTo(3.4, 10); g.quadraticCurveTo(5.4, 10.2, 6, 8.6); g.stroke(); g.restore();
  // freckles
  freckles([[-15, 4], [-12.5, 6.2], [-9.5, 4.8], [-14, 7.6, .6], [-6.5, 6.4, .6], [-3, 4.2, .55], [3.6, 4.4, .55], [7, 6.4, .6], [10, 4.8], [12.6, 6.6], [15.2, 4.4], [13.6, 8.2, .6], [-1, 2.6, .5]]);
  if (kex === 'smile' || kex === 'grin') {
  // big warm smile (open, teeth)
  const mouth = () => { g.moveTo(-11.5, 15.2); g.quadraticCurveTo(0, 13.2, 12, 14.6); g.quadraticCurveTo(10, 24.5, 0.5, 25.2); g.quadraticCurveTo(-9.5, 24.5, -11.5, 15.2); g.closePath(); };
  cel(mouth, '#6a1c22', '#4a1016', { lw: 1.6, sx: 0, sy: 0, tex: () => {
      g.fillStyle = '#fffdf8'; g.beginPath(); g.moveTo(-11, 15); g.quadraticCurveTo(0, 13.4, 11.6, 14.6); g.lineTo(10.4, 18.2); g.quadraticCurveTo(0, 19.8, -10, 18.2); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(120,110,120,.35)'; g.lineWidth = .6; for (const tx of [-6, -2, 2, 6]) { g.beginPath(); g.moveTo(tx, 14.4); g.lineTo(tx, 18.6); g.stroke(); }
      g.fillStyle = '#d65a66'; g.beginPath(); E(1, 23.2, 6.5, 2.6); g.fill(); } });
  // lips
  g.save(); g.strokeStyle = '#a53c48'; g.lineWidth = 1.4; g.globalAlpha = .9; g.beginPath(); g.moveTo(-12.2, 14.6); g.quadraticCurveTo(-5, 12.2, 0, 13.4); g.quadraticCurveTo(5, 12, 12.6, 14); g.stroke();
  g.strokeStyle = '#d0566a'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-8, 25.4); g.quadraticCurveTo(1, 27.6, 9, 25); g.stroke(); g.restore();
  // smile creases
  line([[-14.5, 12], [-13.6, 16.5], [-11.8, 18.6]], '#8a4a34', 1.1, .7); line([[14.6, 11.6], [14, 16], [12.4, 18.2]], '#8a4a34', 1.1, .7);
  } else { mouthOf({ lips: '#c0566a', mouthY: 16 }, kex === 'shock' ? 'scared' : kex === 'smirk' ? 'smug' : kex === 'shout' ? 'shout' : kex); }
  // glasses (temples first)
  g.save(); g.strokeStyle = '#4a240c'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-19.5, -5); g.lineTo(-23.5, -3); g.moveTo(19.5, -5); g.lineTo(23.5, -3); g.stroke(); g.restore();
  // lens tint + glare
  g.save(); g.fillStyle = 'rgba(190,220,255,.16)'; g.beginPath(); RR(-19.6, -10.6, 18.2, 14.2, 4.2); RR(1.4, -10.6, 18.2, 14.2, 4.2); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(-17, 1); g.lineTo(-11, -8.6); g.moveTo(-14.5, 2.2); g.lineTo(-12.5, -.8); g.moveTo(4, 1); g.lineTo(10, -8.6); g.stroke(); g.restore();
  tortoiseFrame(-10.5, -3.5, 18.2, 14.2, 4.2); tortoiseFrame(10.5, -3.5, 18.2, 14.2, 4.2);
  // bridge
  g.save(); g.fillStyle = '#5a2c10'; g.strokeStyle = INK; g.lineWidth = 1.1; g.beginPath(); g.moveTo(-1.6, -6.6); g.quadraticCurveTo(0, -8.6, 1.6, -6.6); g.lineTo(1.6, -4.4); g.quadraticCurveTo(0, -6, -1.6, -4.4); g.closePath(); g.fill(); g.stroke(); g.restore();
  // gold studs
  for (const ex of [-24.6, 24.6]) { g.save(); g.beginPath(); C(ex, 10, 2.1); g.fillStyle = '#f2c34a'; g.fill(); g.strokeStyle = INK; g.lineWidth = .9; g.stroke(); g.beginPath(); C(ex - .6, 9.4, .7); g.fillStyle = '#fff7d0'; g.fill(); g.restore(); }
  if (o.fedora && !o.hatOnly) fedora(o);
}
function fedora(o = {}) {
  // black fedora, blue band, slight rakish tilt
  g.save(); g.translate(0, -7); g.rotate(-.12);
  const brimBack = () => { g.moveTo(-46, -24); g.bezierCurveTo(-40, -36, 40, -38, 48, -26); g.bezierCurveTo(30, -30, -30, -30, -46, -24); g.closePath(); };
  cel(brimBack, '#1b1b24', '#0c0c12', { lw: 2.2, sx: 0, sy: 2 });
  const crown = () => { g.moveTo(-27, -27); g.bezierCurveTo(-30, -48, -24, -66, -10, -66); g.quadraticCurveTo(0, -60, 10, -66); g.bezierCurveTo(25, -66, 31, -48, 28, -27); g.bezierCurveTo(10, -31, -10, -31, -27, -27); g.closePath(); };
  cel(crown, '#262633', '#13131b', { lw: 2.4, sx: -5, sy: 0, rim: [o.rim || RIM_C, 2.2], shade2: () => { g.moveTo(-2, -61); g.quadraticCurveTo(2, -45, 0, -30); g.lineTo(8, -30); g.quadraticCurveTo(9, -48, 4, -62); g.closePath(); },
    hi: () => line([[-20, -36], [-22, -50], [-15, -61]], 'rgba(160,170,220,.55)', 2.2) });
  // blue band
  cel(() => { g.moveTo(-27.6, -29); g.bezierCurveTo(-10, -33.4, 10, -33.4, 28.4, -29); g.lineTo(28.8, -37.5); g.bezierCurveTo(10, -41.5, -10, -41.5, -28.4, -37.5); g.closePath(); }, COBALT, COBALTD, { lw: 1.6, sx: -4, sy: 0, hi: () => line([[-24, -36.5], [-4, -39.6], [16, -38.6]], '#8fb8ff', 1.2, .8) });
  // brim front
  const brimF = () => { g.moveTo(-50, -25); g.bezierCurveTo(-38, -14, 36, -12, 52, -27); g.bezierCurveTo(44, -22, 34, -27, 28, -28); g.bezierCurveTo(10, -32, -12, -32, -28, -28); g.bezierCurveTo(-36, -27, -44, -24, -50, -25); g.closePath(); };
  cel(brimF, '#2a2a37', '#121219', { lw: 2.4, sx: 0, sy: -3, rim: [o.rim || RIM_C, 2], hi: () => line([[-40, -21.5], [-10, -17.8], [24, -19.5]], 'rgba(170,180,230,.45)', 1.6) });
  g.restore();
}

// ---------- KAYLEIGH full body, noir key-art pose (feet at origin, ~470 tall) ----------
function kayleighFull(x, y, s, o = {}) {
  seed = 2626; g.save(); g.translate(x, y); g.scale(s, s * .9);
  const rim = o.rim || RIM_C, TR = NAVY, TRD = NAVYD, TRL = '#2c4687';
  shadowOval(0, 0, 90, 12, .5);
  // trench back panel (behind legs)
  cel(() => S([[-56, -360], [56, -360], [70, -250], [86, -150], [60, -132], [30, -140], [0, -134], [-30, -140], [-62, -130], [-88, -148], [-70, -250]], .7), TR, TRD, { lw: 2.6, sx: -6, sy: 0, rim: [rim, 2.6] });
  // legs: black jeans
  const legL = () => S([[-40, -252], [-4, -252], [-8, -176], [-16, -110], [-24, -62], [-46, -62], [-44, -112], [-44, -178]], .75);
  const legR = () => S([[2, -252], [38, -252], [42, -176], [44, -112], [52, -62], [30, -62], [22, -112], [10, -176]], .75);
  cel(() => { legL(); legR(); }, BLK, BLKD, { lw: 2.5, sx: -6, sy: 0, rim: [rim, 2.4], tex: () => { line([[-30, -170], [-24, -150]], '#3a3a48', 1.2, .8); line([[-36, -120], [-28, -112]], '#3a3a48', 1.2, .8); line([[30, -168], [24, -146]], '#3a3a48', 1.2, .8); line([[38, -110], [30, -104]], '#3a3a48', 1.2, .8); } });
  // boots
  const bootL = () => S([[-48, -76], [-22, -76], [-20, -30], [-18, -10], [-20, 0], [-64, 0], [-66, -8], [-50, -22]], .55);
  const bootR = () => S([[28, -76], [54, -76], [52, -24], [68, -10], [68, 0], [22, 0], [20, -10], [26, -30]], .55);
  cel(() => { bootL(); bootR(); }, '#1a1a21', '#0a0a0e', { lw: 2.5, sx: -5, sy: 0, rim: [rim, 2.2], tex: () => { g.fillStyle = '#050507'; g.fillRect(-70, -6, 145, 7); line([[-60, -12], [-24, -13]], '#3d3d4d', 1.4, .9); line([[24, -13], [64, -12]], '#3d3d4d', 1.4, .9); hiBlob(-42, -54, 4, 12, .25, .1, '#8f9ad0'); hiBlob(34, -54, 4, 12, .25, .1, '#8f9ad0'); } });
  // tee (black, oversized) with original blue graphic
  const tee = () => S([[-40, -370], [40, -370], [44, -300], [44, -238], [0, -232], [-44, -238], [-44, -300]], .8);
  cel(tee, '#24242e', '#121218', { lw: 2.4, sx: -6, sy: 0, tex: () => {
      // graphic: blue flame burst + "TRUE CRIME"
      g.save(); g.translate(0, -300);
      g.fillStyle = '#2f7bff'; g.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, r = i % 2 ? 15 : 26; const px = Math.cos(a) * r * 1.05, py = Math.sin(a) * r * .9; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.fill();
      g.fillStyle = '#9fd0ff'; g.beginPath(); C(0, 0, 13); g.fill();
      txt('TRUE', 0, -4, '400 11px "Anton", sans-serif', '#0d1d48', null); txt('CRIME', 0, 7, '400 9px "Anton", sans-serif', '#0d1d48', null);
      g.restore();
      line([[-30, -260], [-18, -268], [-6, -262]], '#3b3b4a', 1.3, .8); line([[16, -252], [28, -258]], '#3b3b4a', 1.3, .8); } });
  // belt + holster (her right hip = viewer left)
  cel(() => RR(-44, -252, 88, 10, 2), '#14141a', '#08080b', { lw: 1.8, sx: 0, sy: -1, tex: () => { g.fillStyle = '#c9ccd8'; g.fillRect(-6, -250, 12, 6); } });
  cel(() => S([[-52, -250], [-34, -250], [-32, -214], [-46, -206], [-56, -220]], .5), '#101015', '#050507', { lw: 2, sx: -2, sy: 0, rim: [rim, 1.6] });
  cel(() => RR(-52, -268, 15, 20, 3), '#2c2c35', '#16161c', { lw: 1.8, sx: -2, sy: 0, tex: () => { for (let i = 0; i < 4; i++) line([[-50, -264 + i * 4], [-39, -264 + i * 4]], '#4b4b5a', .8); } }); // grip
  // trench front panels (open), lapels
  const panL = () => S([[-56, -364], [-26, -360], [-30, -318], [-44, -250], [-50, -150], [-62, -128], [-90, -146], [-76, -250], [-66, -330]], .65);
  const panR = () => S([[56, -364], [26, -360], [30, -318], [44, -250], [52, -150], [64, -128], [92, -146], [78, -250], [66, -330]], .65);
  cel(() => { panL(); panR(); }, TR, TRD, { lw: 2.6, sx: -7, sy: 0, rim: [rim, 3], tex: () => {
      line([[-62, -240], [-70, -170], [-74, -140]], '#162650', 2, .9); line([[66, -238], [74, -170], [78, -140]], '#162650', 2, .9);
      // buttons
      for (const [bx, by] of [[-40, -300], [-44, -270], [42, -300], [46, -270]]) { g.beginPath(); C(bx, by, 2.6); g.fillStyle = '#0d1530'; g.fill(); g.strokeStyle = '#4b63a8'; g.lineWidth = .8; g.stroke(); }
      halftone(-92, -230, 40, 100, 'rgba(5,8,25,.55)', 5, 1.6, 'down'); } });
  // trench belt loose ends
  cel(() => { RR(-78, -258, 30, 9, 3); RR(48, -258, 30, 9, 3); }, TRL, TRD, { lw: 1.8, sx: 0, sy: -2 });
  cel(() => { S([[-74, -250], [-66, -252], [-64, -190], [-72, -186]], .5); S([[66, -252], [74, -250], [74, -196], [66, -192]], .5); }, TRL, TRD, { lw: 1.8, sx: -2, sy: 0, tex: () => { g.fillStyle = '#c9a24a'; g.fillRect(-73, -252, 8, 4); } });
  // lapels
  cel(() => { P([[-26, -364], [-12, -372], [-22, -320], [-30, -316]]); P([[-26, -364], [-46, -362], [-38, -336], [-30, -316]]); P([[26, -364], [12, -372], [22, -320], [30, -316]]); P([[26, -364], [46, -362], [38, -336], [30, -316]]); }, TRL, NAVY, { lw: 2, sx: -3, sy: 0, rim: [rim, 1.6] });
  // neck
  cel(() => S([[-9, -392], [9, -392], [11, -366], [0, -360], [-11, -366]], .6), SKIN_K, SKIN_KD, { lw: 2, sx: 3, sy: 0, shade2: () => { g.moveTo(-10, -392); g.lineTo(10, -392); g.lineTo(10, -380); g.quadraticCurveTo(0, -376, -10, -382); g.closePath(); } });
  // tee collar
  line([[-12, -369], [0, -362], [12, -369]], '#3a3a4a', 2.2);
  // collar of trench, popped up behind neck
  cel(() => { P([[-12, -372], [-30, -366], [-34, -392], [-18, -388]]); P([[12, -372], [30, -366], [34, -392], [18, -388]]); }, TRL, NAVY, { lw: 2, sx: -2, sy: 0 });
  // arm: viewer-left, hand on hip
  const sleeveL = () => S([[-58, -362], [-44, -348], [-60, -300], [-52, -258], [-66, -252], [-84, -296], [-76, -346]], .65);
  cel(sleeveL, TR, TRD, { lw: 2.6, sx: -6, sy: 0, rim: [rim, 2.6], tex: () => line([[-70, -310], [-62, -300]], '#16244d', 1.6) });
  cel(() => S([[-62, -262], [-50, -262], [-44, -250], [-50, -240], [-62, -244]], .6), SKIN_K, SKIN_KD, { lw: 2, sx: 2, sy: 0 });
  cel(() => RR(-68, -268, 20, 10, 3), TRL, TRD, { lw: 1.8, sx: 0, sy: -1 }); // cuff
  // arm: viewer-right, raised, holding the badge
  const sleeveR = () => S([[56, -362], [78, -350], [100, -318], [98, -300], [84, -304], [64, -330]], .6);
  cel(sleeveR, TR, TRD, { lw: 2.6, sx: -6, sy: 0, rim: [rim, 2.6] });
  const fore = () => S([[84, -312], [100, -306], [96, -384], [82, -386]], .5);
  cel(fore, TR, TRD, { lw: 2.6, sx: -5, sy: 0, rim: [rim, 2.4] });
  cel(() => RR(78, -392, 22, 11, 3), TRL, TRD, { lw: 1.8, sx: 0, sy: -1 });
  // hand gripping the badge wallet
  g.save(); g.scale(1, 1 / .9); badgeWallet(90, -428 * .9 - 2, 1.12, o); g.restore();
  cel(() => S([[78, -404], [96, -404], [100, -394], [94, -386], [80, -388]], .6), SKIN_K, SKIN_KD, { lw: 2, sx: 2, sy: 0, tex: () => { line([[82, -398], [94, -398]], '#b07050', .9, .8); line([[82, -393], [94, -392]], '#b07050', .9, .8); } });
  // head (un-squashed, a little larger for readability)
  g.scale(1, 1 / .9); g.save(); g.translate(2, -422 * .9 - 6); g.rotate(-.06); g.scale(1.3, 1.3); kayleighHead({ fedora: o.fedora !== false, rim }); g.restore();
  g.restore();
}
function badgeWallet(cx, cy, s = 1, o = {}) {
  g.save(); g.translate(cx, cy); g.rotate(.08); g.scale(s, s);
  // leather fold-out (top: shield, bottom: ID)
  cel(() => RR(-20, -30, 40, 60, 4), '#16161c', '#0a0a0e', { lw: 2.2, sx: -2, sy: 0 });
  // ID card
  cel(() => RR(-17, 2, 34, 25, 2), '#eef1f6', '#c9d0dc', { lw: 1.2, sx: 0, sy: -1, tex: () => {
      g.fillStyle = COBALT; g.fillRect(-17, 2, 34, 6); txt('FBI', 0, 5.3, '400 5.4px "Anton", sans-serif', '#fff', null);
      g.fillStyle = '#c7a37a'; g.fillRect(-14, 10, 10, 13); g.fillStyle = HAIR_K; g.fillRect(-14, 10, 10, 4);
      for (let i = 0; i < 4; i++) { g.fillStyle = '#7a8296'; g.fillRect(-1, 11 + i * 3, 14 - i * 2, 1.2); } } });
  // gold shield (generic, original design)
  const shield = () => { g.moveTo(0, -27); g.bezierCurveTo(6, -24, 12, -24, 15, -26); g.lineTo(15, -12); g.bezierCurveTo(15, -4, 8, 0, 0, 3); g.bezierCurveTo(-8, 0, -15, -4, -15, -12); g.lineTo(-15, -26); g.bezierCurveTo(-12, -24, -6, -24, 0, -27); g.closePath(); };
  cel(shield, '#f6c645', '#b8841c', { lw: 1.6, sx: -2.5, sy: -1, rim: ['#fff2b0', 1.4], tex: () => {
      g.fillStyle = '#d29a26'; g.beginPath(); star5(0, -12, 7.5, 3.4); g.fill(); g.fillStyle = '#ffe58a'; g.beginPath(); star5(-.6, -12.6, 5.5, 2.4); g.fill();
      g.fillStyle = '#8a5d10'; g.fillRect(-11, -24, 22, 3); } });
  sparkle(12, -24, 2.4, '#fff', .95); sparkle(-11, -6, 1.4, '#fff', .8);
  g.restore();
}

// ---------- KAYLEIGH half body (interrogation): blue jacket, black tee, leaning on a table ----------
function kayleighHalf(x, y, s, o = {}) {
  seed = 3131; g.save(); g.translate(x, y); g.scale(s, s);
  const rim = o.rim || RIM_O;
  // torso (black tee), leaning forward; origin = table edge center under her
  cel(() => S([[-46, -150], [42, -150], [54, -60], [58, 0], [-58, 0], [-54, -60]], .7), '#24242e', '#121218', { lw: 2.5, sx: -6, sy: 0, tex: () => {
      g.save(); g.translate(-4, -70); g.fillStyle = '#2f7bff'; g.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, r = i % 2 ? 13 : 22; const px = Math.cos(a) * r, py = Math.sin(a) * r * .9; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.fill(); g.fillStyle = '#9fd0ff'; g.beginPath(); C(0, 0, 11); g.fill(); txt('TRUE', 0, -3, '400 9px "Anton", sans-serif', '#0d1d48', null); txt('CRIME', 0, 6, '400 7px "Anton", sans-serif', '#0d1d48', null); g.restore(); } });
  // cobalt jacket (open) panels + sleeves
  cel(() => { S([[-48, -152], [-22, -150], [-28, -100], [-34, -40], [-30, 0], [-64, 0], [-62, -70], [-60, -130]], .6); S([[44, -152], [20, -150], [26, -100], [32, -40], [28, 0], [62, 0], [60, -70], [58, -130]], .6); }, COBALT, COBALTD, { lw: 2.5, sx: -7, sy: 0, rim: [rim, 2.6], tex: () => { line([[-52, -70], [-44, -40]], '#123a88', 1.6); line([[50, -70], [42, -40]], '#123a88', 1.6); } });
  cel(() => { P([[-22, -150], [-8, -160], [-22, -112], [-30, -108]]); P([[20, -150], [6, -160], [20, -112], [28, -108]]); }, '#3a7cf0', COBALTD, { lw: 1.8, sx: -2, sy: 0 });
  // arms down to the table, hands clasped forward (forearms on the table)
  cel(() => { S([[-60, -140], [-40, -120], [-30, -40], [-6, -16], [-14, 0], [-62, -6], [-74, -70]], .6); S([[56, -140], [36, -120], [28, -40], [6, -16], [14, 0], [62, -6], [72, -70]], .6); }, COBALT, COBALTD, { lw: 2.5, sx: -6, sy: 0, rim: [rim, 2.4] });
  // hands
  cel(() => { S([[-14, -20], [4, -22], [10, -10], [2, -2], [-14, -4]], .6); S([[16, -22], [-2, -20], [-6, -8], [6, 0], [18, -6]], .6); }, SKIN_K, SKIN_KD, { lw: 2, sx: 2, sy: 0 });
  // neck + head
  cel(() => S([[-9, -176], [9, -176], [11, -150], [0, -146], [-11, -150]], .6), SKIN_K, SKIN_KD, { lw: 2, sx: 3, sy: 0, shade2: () => { g.moveTo(-10, -176); g.lineTo(10, -176); g.lineTo(10, -166); g.quadraticCurveTo(0, -162, -10, -168); g.closePath(); } });
  line([[-12, -152], [0, -146], [12, -152]], '#3a3a4a', 2.2);
  g.save(); g.translate(0, -206); g.rotate(-.05); kayleighHead({ fedora: !!o.fedora, rim: o.headRim || RIM_O }); g.restore();
  g.restore();
}

// ---------- KD (6): curls, gap-tooth grin, blue hoodie, light-up sneakers, magnifier ----------
function kdHead(o = {}) {
  const sk = '#8d5a3b', skd = '#6a3f27';
  cel(() => { E(-31, 4, 6, 9); E(31, 4, 6, 9); }, sk, skd, { lw: 2, sx: 1, sy: 0 });
  const face = () => S([[0, -34], [22, -30], [31, -12], [30, 10], [22, 26], [0, 34], [-22, 26], [-30, 10], [-31, -12], [-22, -30]], .9);
  cel(face, sk, skd, { lw: 2.4, sx: -4, sy: -1, rim: ['#ffc58f', 1.6], hi: () => { hiBlob(-17, 12, 7, 4, .28, 0, '#ff7a6a'); hiBlob(18, 12, 7, 4, .28, 0, '#ff7a6a'); hiBlob(-8, -20, 9, 4, .2, -.2, '#fff'); } });
  // curly hair: clustered curls
  const s0 = seed; seed = 515; const curls = [];
  for (let i = 0; i < 26; i++) { const a = Math.PI * (1.02 + i / 25 * .96); const rr = 31 + R(-1, 3); curls.push([Math.cos(a) * rr * 1.02, -6 + Math.sin(a) * rr * 1.05, R(5.2, 7)]); }
  for (let i = 0; i < 16; i++) curls.push([R(-24, 24), R(-38, -22), R(5, 7)]);
  seed = s0;
  cel(() => { for (const [cx, cy, r] of curls) C(cx, cy, r); }, '#1c1416', '#0b0809', { lw: 2, sx: -2, sy: -2, tex: () => { for (const [cx, cy, r] of curls) { g.save(); g.strokeStyle = 'rgba(120,110,150,.7)'; g.lineWidth = 1.1; g.beginPath(); g.arc(cx - r * .15, cy - r * .1, r * .55, 3.5, 4.9); g.stroke(); g.restore(); } } });
  // brows: high and excited
  g.save(); g.strokeStyle = '#140c0c'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(-19, -15); g.quadraticCurveTo(-12, -22, -5, -17); g.moveTo(5, -17); g.quadraticCurveTo(12, -23, 20, -16); g.stroke(); g.restore();
  // eyes: big, sparkly
  for (const [ex, mag] of [[-11.5, o.magL], [11.5, o.magR]]) {
    const r = mag ? 10 : 6.4;
    g.save(); g.beginPath(); E(ex, -4, r * .9, r); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.8; g.stroke(); g.clip();
    g.beginPath(); C(ex + 1, -3, r * .6); g.fillStyle = '#3a2416'; g.fill(); g.beginPath(); C(ex + 1, -3, r * .32); g.fillStyle = '#0a0504'; g.fill();
    g.beginPath(); C(ex - r * .15, -r * .55 - 3, r * .22); g.fillStyle = '#fff'; g.fill(); g.beginPath(); C(ex + r * .35, r * .1 - 2, r * .1); g.fill(); g.restore();
  }
  // nose
  g.save(); g.strokeStyle = '#4a2716'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-4, 7); g.quadraticCurveTo(0, 10, 4, 7); g.stroke(); g.restore();
  // HUGE goofy grin with missing baby teeth
  const mouth = () => { g.moveTo(-17, 12); g.quadraticCurveTo(0, 15, 17, 11); g.quadraticCurveTo(14, 29, 0, 29.5); g.quadraticCurveTo(-14, 29, -17, 12); g.closePath(); };
  cel(mouth, '#5a1a1c', '#3c0e12', { lw: 2, sx: 0, sy: 0, tex: () => {
      // top teeth with gaps
      g.fillStyle = '#fffdf6';
      const teeth = [[-14, 4.8], [-9.6, 4.6], [-2.4, 0], [1.6, 0], [5.2, 5.2], [10, 4.6]]; // [x, w]; w=0 is a gap
      for (const [tx, tw] of teeth) if (tw) { g.beginPath(); RR(tx, 12.6, tw - .6, 5.6, 1.4); g.fill(); }
      g.fillStyle = '#e8606a'; g.beginPath(); E(0, 25.5, 9, 3.6); g.fill();
      g.fillStyle = '#fffdf6'; for (const tx of [-7, 3]) { g.beginPath(); RR(tx, 22, 4.4, 3.4, 1); g.fill(); } } });
  line([[-18.5, 10], [-16, 13.5]], '#4a2716', 1.4); line([[18.5, 9.4], [16, 13]], '#4a2716', 1.4);
}
function kd(x, y, s, o = {}) {
  seed = 777; g.save(); g.translate(x, y); g.scale(s * (o.flip ? -1 : 1), s);
  const rim = o.rim || RIM_O, HD = '#2f7de1', HDD = '#1b52a8';
  shadowOval(0, 0, 54, 9, .45);
  // legs: black joggers
  cel(() => { S([[-24, -96], [-2, -96], [-6, -40], [-8, -18], [-26, -18], [-26, -50]], .7); S([[2, -96], [24, -96], [26, -50], [28, -18], [10, -18], [6, -40]], .7); }, '#2a2a34', '#15151b', { lw: 2.2, sx: -4, sy: 0, rim: [rim, 1.8] });
  // light-up sneakers
  const shoes = () => { S([[-28, -24], [-6, -24], [-4, -6], [-4, 0], [-40, 0], [-40, -8]], .5); S([[6, -24], [28, -24], [40, -8], [40, 0], [4, 0], [4, -6]], .5); };
  cel(shoes, '#f6f7fb', '#c4cbe0', { lw: 2.2, sx: -3, sy: 0, tex: () => { g.fillStyle = '#2f7de1'; g.fillRect(-42, -7, 84, 3); } });
  glow(-22, -3, 16, 'rgba(80,200,255,.9)', .9); glow(22, -3, 16, 'rgba(255,80,160,.9)', .9);
  g.save(); g.fillStyle = '#7fe8ff'; g.fillRect(-40, -4, 36, 3); g.fillStyle = '#ff7ac0'; g.fillRect(4, -4, 36, 3); g.restore();
  // hoodie body
  cel(() => S([[-34, -170], [34, -170], [40, -130], [40, -90], [0, -86], [-40, -90], [-40, -130]], .8), HD, HDD, { lw: 2.4, sx: -6, sy: 0, rim: [rim, 2.4], tex: () => {
      cel(() => RR(-22, -122, 44, 22, 8), lighten(HD, .08), HDD, { lw: 1.4, sx: 0, sy: -2 }); // pocket
      g.fillStyle = '#fff'; g.beginPath(); C(-3, -146, 2); C(6, -146, 2); g.fill();
      line([[-6, -168], [-8, -150]], '#e8eefc', 1.6); line([[6, -168], [8, -150]], '#e8eefc', 1.6);
      // junior badge sticker
      g.save(); g.translate(18, -148); g.rotate(.2); g.fillStyle = '#f6c645'; g.beginPath(); star5(0, 0, 7, 3.4); g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke(); g.restore(); } });
  // hood behind neck
  cel(() => S([[-26, -176], [26, -176], [20, -164], [-20, -164]], .6), HDD, '#123c80', { lw: 2, sx: 0, sy: 0 });
  // arms: viewer-left holds magnifier up to his eye; viewer-right juice box
  cel(() => S([[-34, -166], [-24, -150], [-30, -128], [-22, -196], [-34, -198], [-46, -140]], .6), HD, HDD, { lw: 2.4, sx: -4, sy: 0, rim: [rim, 2] });
  cel(() => S([[34, -166], [46, -140], [44, -112], [32, -110], [26, -150]], .6), HD, HDD, { lw: 2.4, sx: -4, sy: 0, rim: [rim, 2] });
  // juice box
  cel(() => RR(30, -126, 16, 22, 2), '#ffb43a', '#d88a1c', { lw: 1.8, sx: -2, sy: 0, tex: () => { g.fillStyle = '#ff5a5a'; g.beginPath(); C(38, -114, 4); g.fill(); } }); line([[42, -126], [44, -136]], '#ff7aa8', 2);
  cel(() => C(38, -110, 6.5), '#8d5a3b', '#6a3f27', { lw: 1.8, sx: 1, sy: 0 });
  // head
  g.save(); g.translate(0, -214); kdHead({ magL: true }); g.restore();
  // magnifier over his (viewer-left) eye
  g.save(); g.translate(-11.5, -218);
  g.beginPath(); C(0, 0, 15); g.fillStyle = 'rgba(200,235,255,.2)'; g.fill();
  g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); g.lineWidth = 3; g.strokeStyle = '#e04a3a'; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.6; g.beginPath(); g.arc(0, 0, 10, 3.6, 4.5); g.stroke();
  cel(() => { g.moveTo(-9, 11); g.lineTo(-13, 13); g.lineTo(-20, 36); g.lineTo(-14, 38); g.lineTo(-7, 15); g.closePath(); }, '#e04a3a', '#a42a20', { lw: 1.8, sx: 0, sy: 0 });
  g.restore();
  cel(() => C(-20, -184, 7), '#8d5a3b', '#6a3f27', { lw: 1.8, sx: 1, sy: 0 }); // hand on handle
  g.restore();
}

// ---------- COCOA: big black dog, white chin patch, red collar, K-9 vest ----------
function cocoa(x, y, s, o = {}) {
  seed = 99; g.save(); g.translate(x, y); g.scale(s * (o.flip ? -1 : 1), s);
  const B = '#1e1c26', BD = '#0b0a10', rim = o.rim || '#6d8fe0';
  shadowOval(0, 0, 70, 10, .45);
  // tail
  cel(() => S([[48, -26], [74, -40], [92, -70], [86, -74], [70, -50], [46, -36]], .6), B, BD, { lw: 2.2, sx: -3, sy: 0, rim: [rim, 2] });
  // haunch + body (sitting)
  cel(() => S([[-26, -110], [26, -112], [54, -70], [58, -18], [40, 0], [-6, 0], [-30, -30]], .7), B, BD, { lw: 2.6, sx: -6, sy: 0, rim: [rim, 3], hi: () => { line([[-10, -100], [10, -104], [30, -96]], 'rgba(120,140,220,.5)', 2.2); line([[36, -60], [44, -40]], 'rgba(120,140,220,.45)', 2); } });
  // vest
  cel(() => S([[-24, -108], [26, -110], [46, -80], [44, -54], [-4, -50], [-28, -70]], .6), NAVY, NAVYD, { lw: 2, sx: -4, sy: 0, rim: [RIM_C, 1.6], tex: () => { g.save(); if (o.flip) { g.translate(32, 0); g.scale(-1, 1); } txt('K-9', 16, -88, '400 13px "Anton", sans-serif', '#ffd23a', null); txt('CONSULTANT', 16, -73, '400 6.4px "Anton", sans-serif', '#ffd23a', null);  g.restore();} });
  // front legs
  cel(() => { S([[-24, -64], [-2, -64], [-2, -14], [4, -4], [2, 2], [-28, 2], [-26, -14]], .6); S([[2, -64], [22, -64], [22, -14], [30, -4], [28, 2], [0, 2], [0, -14]], .6); }, B, BD, { lw: 2.4, sx: -4, sy: 0, rim: [rim, 2.2], tex: () => { line([[-16, -2], [-14, -6]], '#3a3850', 1); line([[4, -2], [6, -6]], '#3a3850', 1); } });
  // chest + neck
  cel(() => S([[-30, -150], [8, -156], [18, -110], [6, -66], [-22, -62], [-34, -100]], .7), B, BD, { lw: 2.4, sx: -5, sy: 0, rim: [rim, 2.4] });
  // collar
  cel(() => S([[-32, -132], [12, -138], [14, -126], [-30, -118]], .5), '#d8333a', '#9a1e26', { lw: 1.8, sx: 0, sy: -2 });
  cel(() => C(-8, -116, 5), '#f6c645', '#b8841c', { lw: 1.4, sx: -1, sy: -1 });
  // head (3/4 left)
  g.save(); g.translate(-14, -176);
  cel(() => S([[-20, -26], [-4, -34], [0, -24], [-14, -18]], .6), '#17151e', BD, { lw: 2, sx: -1, sy: 0, rim: [rim, 1.4] }); // far ear peeking
  cel(() => S([[-26, -26], [10, -32], [30, -14], [30, 14], [16, 30], [-10, 30], [-26, 14]], .8), B, BD, { lw: 2.5, sx: -4, sy: 0, rim: [rim, 2.6], hi: () => { line([[-14, -24], [6, -28]], 'rgba(130,150,230,.55)', 2.4); } });
  // muzzle
  cel(() => S([[-26, 2], [-8, -4], [4, 10], [0, 26], [-20, 30], [-44, 22], [-48, 10]], .7), '#24222e', BD, { lw: 2.3, sx: -2, sy: 0, rim: [rim, 1.6] });
  // white chin patch
  cel(() => S([[-36, 24], [-16, 22], [-6, 32], [-20, 40], [-34, 36]], .7), '#f4f2f6', '#c8c6d4', { lw: 1.8, sx: 0, sy: -1 });
  // tongue
  cel(() => S([[-26, 26], [-14, 26], [-12, 42], [-20, 48], [-28, 42]], .7), '#ff7a9a', '#d84a72', { lw: 1.8, sx: 1, sy: 0, tex: () => line([[-20, 28], [-20, 42]], '#c03a60', 1) });
  // nose
  cel(() => S([[-52, 4], [-40, 2], [-38, 12], [-48, 14]], .7), '#0a090d', '#000', { lw: 1.6, sx: 0, sy: 0, hi: () => hiBlob(-47, 6, 3, 1.6, .7, -.3, '#9aa0d0') });
  line([[-44, 16], [-34, 22], [-24, 22]], '#000', 1.6);
  // eyes
  for (const [ex, ey] of [[-16, -6], [8, -8]]) { g.save(); g.beginPath(); E(ex, ey, 5.4, 6); g.fillStyle = '#6a3a1a'; g.fill(); g.strokeStyle = '#000'; g.lineWidth = 1.6; g.stroke(); g.beginPath(); C(ex - .6, ey + .4, 3); g.fillStyle = '#120804'; g.fill(); g.beginPath(); C(ex - 2, ey - 2, 1.6); g.fillStyle = '#fff'; g.fill(); g.restore(); }
  g.save(); g.strokeStyle = 'rgba(140,160,230,.6)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-22, -16); g.quadraticCurveTo(-16, -20, -10, -16); g.moveTo(2, -18); g.quadraticCurveTo(8, -22, 14, -18); g.stroke(); g.restore();
  // front ear (floppy)
  cel(() => S([[12, -30], [28, -24], [34, 4], [28, 26], [18, 20], [14, -6]], .6), '#17151e', BD, { lw: 2.2, sx: -2, sy: 0, rim: [rim, 1.8], hi: () => line([[18, -22], [26, -10]], 'rgba(130,150,230,.5)', 1.6) });
  g.restore();
  g.restore();
}

// ---------- COUNT LUCIEN DE VAUCLAIR (seated, half body; origin = table edge center) ----------
function countHalf(x, y, s, o = {}) {
  seed = 4040; g.save(); g.translate(x, y); g.scale(s, s);
  const rim = o.rim || RIM_C, PL = '#6b2a6e', PLD = '#3e1440', SK = '#f0c8ae', SKD = '#cf9a80';
  // torso: plum velvet smoking jacket
  cel(() => S([[-56, -140], [56, -140], [68, -70], [70, 0], [-70, 0], [-68, -70]], .7), PL, PLD, { lw: 2.5, sx: -7, sy: 0, rim: [rim, 2.4], tex: () => { halftone(20, -130, 50, 130, 'rgba(20,0,25,.35)', 5, 1.5, 'right'); } });
  // shirt + gold ascot
  cel(() => P([[-20, -142], [20, -142], [10, -70], [-10, -70]]), '#f6f2ea', '#d6cfc0', { lw: 2, sx: -2, sy: 0 });
  cel(() => S([[-12, -140], [12, -140], [16, -118], [6, -96], [-6, -96], [-16, -118]], .7), '#e8b23a', '#b07a16', { lw: 1.8, sx: -2, sy: 0, tex: () => { g.fillStyle = '#8a4a10'; for (const [px, py] of [[-6, -128], [5, -122], [-2, -110], [6, -104], [-7, -116]]) { g.beginPath(); E(px, py, 2.2, 1.4, .6); g.fill(); } } });
  // black satin shawl lapels
  cel(() => { S([[-22, -142], [-40, -136], [-30, -60], [-12, -64]], .6); S([[22, -142], [40, -136], [30, -60], [12, -64]], .6); }, '#1c1420', '#0c080e', { lw: 2, sx: -3, sy: 0, hi: () => { line([[-32, -128], [-24, -80]], 'rgba(220,180,255,.4)', 2); line([[34, -128], [26, -80]], 'rgba(220,180,255,.25)', 2); } });
  // pocket square
  cel(() => P([[34, -110], [50, -112], [46, -100], [40, -104], [36, -98]]), '#e8b23a', '#b07a16', { lw: 1.4, sx: 0, sy: 0 });
  // arms resting forward, hands holding Bijou
  cel(() => { S([[-56, -132], [-70, -60], [-56, -14], [-20, -10], [-24, -30], [-46, -40], [-44, -100]], .6); S([[56, -132], [70, -60], [56, -14], [20, -10], [24, -30], [46, -40], [44, -100]], .6); }, PL, PLD, { lw: 2.5, sx: -5, sy: 0, rim: [rim, 2.2] });
  // BIJOU the Pomeranian (orange fluff ball)
  g.save(); g.translate(0, -26);
  const s0 = seed; seed = 88; const fl = []; for (let i = 0; i < 22; i++) { const a = i / 22 * TAU; fl.push([Math.cos(a) * 26, Math.sin(a) * 18, R(7, 10)]); } seed = s0;
  cel(() => { E(0, 0, 26, 18); for (const [fx, fy, r] of fl) C(fx, fy, r); }, '#f39a3a', '#c96a1c', { lw: 2, sx: -3, sy: -2, rim: ['#ffd9a0', 1.6] });
  cel(() => S([[-14, -8], [14, -8], [16, 8], [0, 16], [-16, 8]], .8), '#f8b45a', '#d47a26', { lw: 1.6, sx: -2, sy: 0 });
  cel(() => { P([[-14, -10], [-10, -26], [-4, -12]]); P([[14, -10], [10, -26], [4, -12]]); }, '#f39a3a', '#c96a1c', { lw: 1.6, sx: 0, sy: 0 });
  for (const ex of [-6, 6]) { g.beginPath(); C(ex, 0, 2.6); g.fillStyle = '#120806'; g.fill(); g.beginPath(); C(ex - .8, -.8, .9); g.fillStyle = '#fff'; g.fill(); }
  g.beginPath(); E(0, 7, 2.6, 1.8); g.fillStyle = '#120806'; g.fill();
  // tiny diamond collar
  g.strokeStyle = '#d7f3ff'; g.lineWidth = 2; g.beginPath(); g.arc(0, 4, 13, .3, Math.PI - .3); g.stroke(); sparkle(8, 14, 1.6, '#fff', .9);
  g.restore();
  // hands
  cel(() => { E(-24, -16, 9, 7, .3); E(24, -16, 9, 7, -.3); }, SK, SKD, { lw: 1.8, sx: 2, sy: 0 });
  g.fillStyle = '#f4c445'; g.beginPath(); C(-28, -20, 2.4); g.fill(); g.strokeStyle = INK; g.lineWidth = .8; g.stroke(); // signet ring
  // neck + head
  cel(() => S([[-10, -168], [10, -168], [12, -140], [-12, -140]], .6), SK, SKD, { lw: 2, sx: 3, sy: 0 });
  g.save(); g.translate(0, -196); g.rotate(.05);
  cel(() => { E(-23, 2, 4.5, 7.5); E(23, 2, 4.5, 7.5); }, SK, SKD, { lw: 1.8, sx: 1, sy: 0 });
  cel(() => S([[0, -32], [18, -28], [23, -12], [22, 8], [16, 22], [4, 30], [-6, 30], [-17, 21], [-22, 6], [-23, -12], [-18, -28]], .9), SK, SKD, { lw: 2.3, sx: -4, sy: -1, rim: ['#cfefff', 1.6], hi: () => { hiBlob(-12, 10, 5, 3, .25, 0, '#ff8b7a'); hiBlob(12, 10, 5, 3, .25, 0, '#ff8b7a'); } });
  // silver pompadour (tall swoosh)
  cel(() => { g.moveTo(-23, -6); g.bezierCurveTo(-30, -30, -18, -58, 8, -60); g.bezierCurveTo(30, -62, 40, -46, 30, -38); g.bezierCurveTo(28, -30, 26, -20, 23, -6); g.bezierCurveTo(20, -18, 12, -24, 2, -26); g.bezierCurveTo(-8, -26, -18, -20, -23, -6); g.closePath(); }, '#d9dde8', '#9aa0b4', { lw: 2.3, sx: -4, sy: -2, rim: [rim, 2], hi: () => { line([[-16, -30], [-6, -48], [14, -54]], '#ffffff', 2.4, .9); line([[-10, -26], [2, -40], [22, -46]], '#b8bfd2', 1.6, .9); line([[10, -28], [22, -38], [30, -40]], '#b8bfd2', 1.4, .8); } });
  // sideburns
  cel(() => { RR(-24, -12, 5, 14, 2); RR(19, -12, 5, 14, 2); }, '#c8ccd8', '#9aa0b4', { lw: 1.2, sx: 0, sy: 0 });
  // brows: one raised, smug
  g.save(); g.strokeStyle = '#8a8fa0'; g.lineWidth = 3; g.beginPath(); g.moveTo(-17, -12); g.quadraticCurveTo(-10, -20, -3, -15); g.moveTo(4, -12); g.quadraticCurveTo(11, -11, 18, -9); g.stroke(); g.restore();
  // eyes: half-lidded, smug
  for (const [ex, lid] of [[-10, .55], [10, .45]]) { g.save(); g.beginPath(); E(ex, -4, 5.4, 4.2); g.fillStyle = '#fff'; g.fill(); g.clip(); g.beginPath(); C(ex - 1.6, -3.4, 2.8); g.fillStyle = '#4a6a8a'; g.fill(); g.beginPath(); C(ex - 1.6, -3.4, 1.3); g.fillStyle = '#0a0a10'; g.fill(); g.fillStyle = SKD; g.fillRect(ex - 7, -10, 14, 6 * lid + 1.5); g.restore(); g.save(); g.strokeStyle = INK; g.lineWidth = 1.8; g.beginPath(); g.moveTo(ex - 6, -8.4 + 6 * lid); g.lineTo(ex + 6, -8.4 + 6 * lid); g.stroke(); g.restore(); }
  // monocle on his (viewer-right) eye + chain
  g.save(); g.beginPath(); C(10, -4, 8.5); g.fillStyle = 'rgba(200,235,255,.18)'; g.fill(); g.lineWidth = 3.4; g.strokeStyle = INK; g.stroke(); g.lineWidth = 2; g.strokeStyle = '#f4c445'; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.2; g.beginPath(); g.arc(10, -4, 5.6, 3.7, 4.6); g.stroke(); g.restore();
  line([[17, 2], [24, 22], [20, 50], [30, 62]], '#f4c445', 1.4);
  // long nose
  g.save(); g.fillStyle = SKD; g.beginPath(); g.moveTo(1, -6); g.quadraticCurveTo(7, 6, 5, 11); g.quadraticCurveTo(1, 12, -2, 10.5); g.quadraticCurveTo(3, 6, 1, -6); g.fill(); g.strokeStyle = '#7a4a3a'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-3, 10.6); g.quadraticCurveTo(1, 12.8, 5, 11); g.stroke(); g.restore();
  // waxed mustache + smirk
  cel(() => { g.moveTo(0, 14); g.bezierCurveTo(-6, 11, -14, 12, -18, 8); g.bezierCurveTo(-20, 6, -22, 8, -20, 10); g.bezierCurveTo(-16, 17, -6, 17, 0, 16); g.bezierCurveTo(6, 17, 16, 17, 20, 10); g.bezierCurveTo(22, 8, 20, 6, 18, 8); g.bezierCurveTo(14, 12, 6, 11, 0, 14); g.closePath(); }, '#d9dde8', '#9aa0b4', { lw: 1.4, sx: 0, sy: -1 });
  g.save(); g.strokeStyle = INK; g.lineWidth = 1.8; g.beginPath(); g.moveTo(-7, 20); g.quadraticCurveTo(2, 23, 10, 18); g.stroke(); g.restore();
  g.restore();
  g.restore();
}
