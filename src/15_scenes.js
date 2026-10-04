/* ===================== SCENE BACKDROPS: one painter per location (cached per W×H) ===================== */
const NIGHT = [[0, '#05071a'], [.5, '#141a44'], [.8, '#2a2058'], [1, '#3a2a60']];
const DUSK = [[0, '#0b1240'], [.3, '#3a2575'], [.55, '#a2357f'], [.72, '#ec4f6e'], [.86, '#ff8a3d'], [1, '#ffc260']];
const DAY = [[0, '#2a7ad8'], [.6, '#7ab8f0'], [1, '#d8eef8']];
function lmDraw(k, x, y, h, fill, edge, lights) { lm(LM[k](x, y, h), fill, edge); if (lights) { const s0 = seed; seed = Math.round(x + h); g.save(); g.fillStyle = lights; for (let i = 0; i < h / 6; i++) g.fillRect(x + R(-h * .08, h * .08), y - R(0, h * .7), 1.6, 2); g.restore(); seed = s0; } }
Object.assign(LM, {
  tower: (x, y, h) => () => { const w = h * .06; P([[x - w, y], [x - w * .8, y - h * .78], [x - w * 2.6, y - h * .8], [x - w * 2.2, y - h * .95], [x + w * 2.2, y - h * .95], [x + w * 2.6, y - h * .8], [x + w * .8, y - h * .78], [x + w, y]]); g.rect(x - w * .2, y - h, w * .4, h * .06); },
  domes: (x, y, h) => () => { for (const [dx, r] of [[-h * .7, h * .32], [0, h * .42], [h * .7, h * .3], [h * 1.3, h * .24]]) { g.moveTo(x + dx - r, y); g.arc(x + dx, y, r, PI, 0); g.lineTo(x + dx + r, y); } },
  fortress: (x, y, h) => () => { const w = h * 2.2; g.moveTo(x - w, y); for (let i = 0; i <= 10; i++) { const xx = x - w + i * w / 5; const hh = h * (i % 3 === 0 ? 1 : .7); g.lineTo(xx, y - hh); g.lineTo(xx + w / 10, y - hh); } g.lineTo(x + w, y); g.closePath(); },
  vault: (x, y, h) => () => { P([[x - h * .3, y], [x - h * .2, y - h], [x + h * .2, y - h], [x + h * 1.6, y]]); },
  stadium: (x, y, h) => () => { const w = h * 2.6; g.moveTo(x - w, y); g.lineTo(x - w, y - h * .55); g.quadraticCurveTo(x, y - h * 1.05, x + w, y - h * .55); g.lineTo(x + w, y); g.closePath(); for (const dx of [-w * .9, -w * .3, w * .3, w * .9]) g.rect(x + dx - 2, y - h * 1.5, 4, h * 1.2); },
  cable: (x, y, h) => () => { g.rect(x - 6, y - h, 12, h); },
});
function cityGlow(W, y, col) { const gr = g.createLinearGradient(0, y - 80, 0, y); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, col); g.fillStyle = gr; g.fillRect(0, y - 80, W, 80); }
const BG = {
  title(W, H) { sky(W, H, DUSK); sunBurst(W * .62, H * .52, Math.min(W, H) * .12, 26); paintedCloud(W * .2, H * .22, W * .5, H * .06, '#ff8a6a', 'rgba(90,40,110,.6)'); paintedCloud(W * .8, H * .32, W * .45, H * .05, '#ffb27a', 'rgba(110,50,120,.5)');
    const hz = H * .7, u = Math.min(W, H) * .5; const sil = '#1a0f2e', ed = '#ff9a6a';
    skyline([['obelisco', W * .08, hz, u * .55], ['hallgrims', W * .2, hz, u * .5], ['koutoubia', W * .34, hz, u * .42], ['casino', W * .5, hz, u * .3], ['macauTower', W * .66, hz, u * .7], ['angkor', W * .82, hz, u * .32], ['moai', W * .95, hz, u * .3]], sil, ed);
    buildings(W, hz, 8, 30, ['#170c28', '#1e1034'], ['#ffcf7a', '#ff9a5a'], 4); g.fillStyle = '#0a0612'; g.fillRect(0, hz, W, H - hz);
    water(W, hz, H, '#2a1238', '#07040c', '#ff9a6a'); for (let i = 0; i < 9; i++) { glow(W * (i + .5) / 9, hz + 26, 10, 'rgba(255,220,120,.9)'); } },
  xna(W, H) { sky(W, H, DUSK); const hz = H * .56; sunBurst(W * .75, hz - 30, 34, 20);
    mountains(W, hz, 46, '#3a2050', null, 4, 5); g.fillStyle = '#3b3346'; g.fillRect(0, hz, W, H * .1); lmDraw('tower', W * .2, hz, 120, '#1c1428', '#ff9a6a'); plane(W * .6, hz - 70, 1.6, -.18, '#1c1428'); contrail(W * .2, hz - 10, W * .55, hz - 62, 3);
    for (let i = 0; i < 12; i++) glow(i * W / 11, hz + 18, 6, 'rgba(120,200,255,.9)');
    // gate interior frame: big windows + carpet
    g.fillStyle = '#20202c'; g.fillRect(0, 0, W, H * .08); for (let i = 0; i <= 6; i++) g.fillRect(i * W / 6 - 4, 0, 8, hz + H * .1);
    floorPersp(W, hz + H * .1, H, '#3a3f6a', '#1a1c34', 'rgba(255,255,255,.05)');
    g.fillStyle = '#14161f'; for (let i = 0; i < 5; i++) { const x = i * W / 4.5; g.fillRect(x, hz + H * .14, W / 6, 8); g.fillRect(x + 6, hz + H * .14 + 8, 4, 16); g.fillRect(x + W / 6 - 10, hz + H * .14 + 8, 4, 16); }
    g.fillStyle = '#0a0a10'; g.fillRect(W * .62, H * .1, W * .3, H * .1); g.fillStyle = '#4a7ad8'; g.fillRect(W * .63, H * .11, W * .28, H * .08); txt('B4  ORLANDO  ON TIME', W * .77, H * .15, fb(Math.min(18, W * .04)), '#ffe08a', null); },
  ba(W, H) { sky(W, H, [[0, '#1a3a8a'], [.6, '#ff9a6a'], [1, '#ffd88a']]); const hz = H * .62; lmDraw('obelisco', W * .78, hz - 20, H * .5, '#4a3050', '#ffc890');
    buildings(W, hz, 40, 120, ['#4a2a5a', '#3a2a50'], ['#ffe08a'], 6);
    const tin = ['#e84a3a', '#2a8ad8', '#f4c430', '#3ac06a', '#e86ab0', '#2ab0b0']; buildings(W, H * .8, 70, 140, tin, ['#1a1a2a', '#fff6c0'], 8, { roof: 'tin', wmin: 30, wmax: 60, lit: .35, stripes: 1 });
    g.fillStyle = '#4a3a3a'; g.fillRect(0, H * .8, W, H * .2); g.fillStyle = '#6a5a5a'; for (let x = 0; x < W; x += 24) g.fillRect(x, H * .8, 20, 3); },
  milonga(W, H) { wallPanels(W, 0, H * .66, '#5a1018', '#2a0608', 14); for (let i = 0; i < 6; i++) { const x = (i + .5) * W / 6; glow(x, H * .12, 40, 'rgba(255,200,120,.5)'); g.fillStyle = '#ffd88a'; g.beginPath(); C(x, H * .12, 5); g.fill(); }
    g.fillStyle = '#c9952e'; g.fillRect(0, H * .4, W, 4); floorPersp(W, H * .66, H, '#6a3a1a', '#2a1408', 'rgba(255,200,140,.1)'); lampCone(W * .5, H * .1, W * .7, H * .9, 'rgba(255,120,80,.18)');
    for (const x of [W * .1, W * .9]) { g.fillStyle = '#1a0a0a'; g.fillRect(x - 20, H * .3, 40, H * .36); g.fillStyle = '#e02040'; g.beginPath(); C(x, H * .34, 6); g.fill(); } },
  recoleta(W, H) { sky(W, H, NIGHT); stars(W, H * .5, 60); moon(W * .8, H * .14, 16); const hz = H * .7;
    for (let i = 0; i < 7; i++) { const x = (i + .5) * W / 7 + (i % 2) * 6, h = H * (.28 + (i % 3) * .07), w = W / 9; g.fillStyle = i % 2 ? '#2a2a3a' : '#33334a'; g.fillRect(x - w / 2, hz - h, w, h); g.beginPath(); g.moveTo(x - w * .6, hz - h); g.lineTo(x, hz - h - w * .5); g.lineTo(x + w * .6, hz - h); g.fill(); g.fillStyle = '#14141e'; g.fillRect(x - w * .2, hz - h * .5, w * .4, h * .5); // angel
      g.fillStyle = '#44445a'; g.beginPath(); C(x, hz - h - w * .7, 5); g.fill(); g.beginPath(); g.moveTo(x - 12, hz - h - w * .45); g.quadraticCurveTo(x, hz - h - w * .9, x + 12, hz - h - w * .45); g.fill(); }
    g.fillStyle = '#1a1a24'; g.fillRect(0, hz, W, H - hz); g.fillStyle = '#26263a'; for (let x = 0; x < W; x += 30) g.fillRect(x, hz, 28, 4); vignette(W, H, .7); },
  ushuaia(W, H) { sky(W, H, [[0, '#26345a'], [.6, '#8a7aa8'], [1, '#f0b890']]); const hz = H * .6; mountains(W, hz, H * .32, '#3a4a6a', '#c8d8f0', 11, 5, '#eef4ff'); mountains(W, hz, H * .16, '#2a3450', null, 12, 7);
    water(W, hz, H, '#3a5a7a', '#0e1a2a', '#ffd0a0'); lmDraw('lighthouse', W * .82, hz + 4, 70, '#c8302a', null); g.fillStyle = '#f4f0e6'; g.fillRect(W * .82 - 5, hz - 40, 10, 10);
    boatSil(W * .25, hz + 18, 1.2, '#1a2234'); boatSil(W * .5, hz + 26, .9, '#1a2234'); buildings(W, hz + 2, 10, 30, ['#c84a3a', '#f4c430', '#4a8ad8', '#e8e2d0'], null, 13, { roof: 'tin', wmin: 14, wmax: 26 }); },
  crabshack(W, H) { wallPanels(W, 0, H * .7, '#3a4a4a', '#1a2424', 9); floorPersp(W, H * .7, H, '#4a3a2a', '#1a140c');
    for (let i = 0; i < 3; i++) { const x = W * (.12 + i * .3), y = H * .28, w = W * .24, h = H * .3; g.fillStyle = '#0a3a4a'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(80,200,220,.25)'; g.fillRect(x, y, w, h); for (let b = 0; b < 8; b++) { g.fillStyle = 'rgba(200,255,255,.5)'; g.beginPath(); C(x + (b * 37 % w), y + h - ((b * 53 + RT.t * 0) % h), 2); g.fill(); } g.fillStyle = '#c84a2a'; for (let c = 0; c < 3; c++) { g.beginPath(); E(x + w * (.25 + c * .25), y + h - 12, 12, 7); g.fill(); } g.strokeStyle = '#8a9a9a'; g.lineWidth = 4; g.strokeRect(x, y, w, h); }
    g.fillStyle = '#ffe08a'; txt('CENTOLLA DEL FIN DEL MUNDO', W / 2, H * .2, fa(Math.min(20, W * .05)), '#ffd23a', INK, 3); glow(W / 2, H * .2, 90, 'rgba(255,210,90,.3)'); },
  lapaz(W, H) { sky(W, H, DAY); const hz = H * .62; mountains(W, hz - 40, H * .34, '#6a7a9a', null, 21, 3, '#ffffff'); mountains(W, hz, H * .2, '#8a6a5a', null, 22, 6);
    buildings(W, hz + 30, 10, 40, ['#b86a4a', '#c87a5a', '#a85a3a', '#d88a6a'], ['#3a2010'], 23, { wmin: 10, wmax: 20 }); buildings(W, H * .82, 20, 60, ['#a85a3a', '#c87a5a', '#8a4a2a'], ['#2a1408'], 24, { wmin: 14, wmax: 30 });
    g.strokeStyle = '#2a2a2a'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, H * .3); g.lineTo(W, H * .5); g.stroke(); for (let i = 0; i < 4; i++) { const x = W * (.15 + i * .24), y = H * .3 + (x / W) * H * .2; g.fillStyle = ['#e8302a', '#3ac06a', '#f4c430', '#2a8ad8'][i]; g.fillRect(x - 8, y + 3, 16, 12); } g.fillStyle = '#8a6a4a'; g.fillRect(0, H * .82, W, H * .18); },
  easter(W, H) { sky(W, H, DUSK); const hz = H * .62; sunBurst(W * .3, hz - 10, 30, 18); water(W, hz, H * .7, '#a2457f', '#3a1a4a', '#ffd88a'); g.fillStyle = '#2a4a2a'; g.beginPath(); g.moveTo(0, H * .7); g.quadraticCurveTo(W * .5, H * .62, W, H * .7); g.lineTo(W, H); g.lineTo(0, H); g.fill();
    g.fillStyle = '#5a5a4a'; g.fillRect(W * .15, H * .68, W * .7, 10); for (let i = 0; i < 7; i++) lmDraw('moai', W * (.2 + i * .1), H * .69, H * .15 + (i % 2) * 8, '#2a2420', '#ff9a6a'); },
  marrakech(W, H) { sky(W, H, DUSK); const hz = H * .64; lmDraw('koutoubia', W * .72, hz, H * .48, '#5a2a2a', '#ffb070', '#ffd88a'); buildings(W, hz, 20, 60, ['#c8603a', '#b8502a', '#d8704a'], ['#ffd88a'], 31, { roof: 'dome', lit: .2 });
    g.fillStyle = '#7a3a1a'; g.fillRect(0, hz, W, H - hz); for (let i = 0; i < 6; i++) { const x = i * W / 5; g.fillStyle = ['#e8302a', '#f4c430', '#2a8ad8', '#3ac06a', '#e86ab0', '#f48a3a'][i]; g.beginPath(); g.moveTo(x, H * .72); g.lineTo(x + W / 5, H * .72); g.lineTo(x + W / 5 - 10, H * .8); g.lineTo(x + 10, H * .8); g.fill(); }
    for (let i = 0; i < 10; i++) { glow(W * (i + .5) / 10, H * .86, 14, 'rgba(255,190,90,.8)'); } },
  monaco(W, H) { sky(W, H, NIGHT); stars(W, H * .4, 50); const hz = H * .6; mountains(W, hz - 20, H * .2, '#141a34', null, 41, 4); buildings(W, hz - 10, 20, 70, ['#24243a', '#2a2a44', '#1e1e30'], ['#ffe6a0', '#9fe8ff'], 42, { lit: .5 });
    lmDraw('casino', W * .5, hz, H * .2, '#e8d8a8', null); glow(W * .5, hz - H * .1, 120, 'rgba(255,220,140,.35)');
    water(W, hz, H, '#1a2a5a', '#04060f', '#ffe6a0'); for (let i = 0; i < 4; i++) boatSil(W * (.15 + i * .24), hz + 30 + (i % 2) * 14, 1.1, '#f4f0e6', 'yacht'); },
  yacht(W, H) { wallPanels(W, 0, H * .72, '#3a160e', '#1a0806', 14); g.fillStyle = '#b8862a'; g.fillRect(0, H * .42, W, 4);
    const px = W * .5, py = H * .26, pr = Math.min(W, H) * .1; g.save(); g.beginPath(); C(px, py, pr); g.clip(); sky(W, H, NIGHT); g.fillStyle = '#ffd98a'; g.fillRect(px - pr * .4, py, pr * .8, pr * .25); glow(px, py, pr, 'rgba(255,220,140,.4)'); g.restore(); g.save(); g.lineWidth = 8; g.strokeStyle = '#c9952e'; g.beginPath(); C(px, py, pr + 3); g.stroke(); g.restore();
    lampCone(px, 0, W * .8, H, 'rgba(255,190,90,.25)'); floorPersp(W, H * .72, H, '#4a2a1a', '#1a0a06', 'rgba(255,200,140,.08)'); },
  tbilisi(W, H) { sky(W, H, NIGHT); stars(W, H * .4, 40); const hz = H * .62; g.fillStyle = '#1e1a30'; g.beginPath(); g.moveTo(0, hz - H * .12); g.quadraticCurveTo(W * .5, hz - H * .3, W, hz - H * .1); g.lineTo(W, hz); g.lineTo(0, hz); g.fill();
    lmDraw('fortress', W * .55, hz - H * .2, H * .06, '#3a3048', '#ffc070'); glow(W * .55, hz - H * .22, 80, 'rgba(255,190,90,.3)'); buildings(W, hz, 20, 50, ['#2a2234', '#34283e'], ['#ffd88a'], 51, { lit: .5 });
    lm(LM.domes(W * .3, hz + 24, 30), '#6a4a3a', '#ffb070'); g.fillStyle = '#2a1e1a'; g.fillRect(0, hz + 24, W, H); water(W, H * .8, H, '#1a1a3a', '#05050c', '#ffc070'); },
  bath(W, H) { vgrad(0, 0, W, H, [[0, '#4a3020'], [1, '#1a0e08']]); g.save(); g.fillStyle = '#5a3a24'; g.beginPath(); g.arc(W / 2, H * .55, Math.max(W, H) * .6, PI, 0); g.fill(); g.strokeStyle = 'rgba(0,0,0,.25)'; for (let r = 40; r < Math.max(W, H); r += 18) { g.beginPath(); g.arc(W / 2, H * .55, r, PI, 0); g.stroke(); } g.restore();
    glow(W / 2, H * .08, 60, 'rgba(255,240,200,.8)'); g.fillStyle = '#2a6a7a'; g.fillRect(0, H * .72, W, H * .28); g.fillStyle = 'rgba(160,230,240,.25)'; g.fillRect(0, H * .72, W, 6);
    g.save(); g.globalAlpha = .35; for (let i = 0; i < 12; i++) { g.fillStyle = '#fff'; g.beginPath(); E((i * 97) % W, H * (.3 + (i % 5) * .1), 60, 20); g.fill(); } g.restore(); },
  reykjavik(W, H) { sky(W, H, [[0, '#040818'], [.5, '#0e1838'], [1, '#22305a']]); stars(W, H * .5, 70); aurora(W, H * .22, H * .25, 1.2); const hz = H * .68;
    mountains(W, hz - 20, H * .14, '#1a2440', '#9fb8e0', 61, 4, '#dfe8ff'); lmDraw('hallgrims', W * .5, hz, H * .4, '#c8ccd8', '#ffffff'); buildings(W, hz, 14, 40, ['#c8302a', '#2a6ad8', '#f4c430', '#e8e2d0', '#3a8a5a'], ['#ffe08a'], 62, { roof: 'tin', wmin: 16, wmax: 30, lit: .5 });
    g.fillStyle = '#1a2030'; g.fillRect(0, hz, W, H); water(W, H * .82, H, '#1a2a4a', '#04060f', '#9fffd0'); },
  svalbard(W, H) { sky(W, H, [[0, '#02040c'], [.6, '#0a1430'], [1, '#1a2a50']]); stars(W, H * .6, 90); aurora(W, H * .2, H * .3, 1.4, 7); const hz = H * .66;
    mountains(W, hz, H * .3, '#c8d4e8', '#ffffff', 71, 4, null); mountains(W, hz, H * .14, '#8a9ab8', null, 72, 6); lmDraw('vault', W * .7, hz + 6, H * .12, '#3a4458', '#9fd8ff'); glow(W * .7 + 10, hz - H * .08, 30, 'rgba(120,220,255,.6)');
    g.fillStyle = '#dfe8f4'; g.fillRect(0, hz, W, H - hz); g.fillStyle = '#b8c8dc'; for (let i = 0; i < 6; i++) { g.beginPath(); E(W * i / 5, hz + 30 + i % 2 * 20, 70, 10); g.fill(); } },
  mine(W, H) { g.fillStyle = '#0a0806'; g.fillRect(0, 0, W, H); g.save(); g.fillStyle = '#2a2018'; g.beginPath(); g.moveTo(W * .15, H); g.lineTo(W * .38, H * .3); g.lineTo(W * .62, H * .3); g.lineTo(W * .85, H); g.fill(); g.restore();
    for (let i = 0; i < 5; i++) { const k = i / 5, y = lerp(H * .32, H, k * k), w = lerp(W * .25, W * .9, k * k); g.fillStyle = '#5a3a1a'; g.fillRect(W / 2 - w / 2, y - 8, w, 8); g.fillRect(W / 2 - w / 2, y, 8, lerp(30, 200, k)); g.fillRect(W / 2 + w / 2 - 8, y, 8, lerp(30, 200, k)); }
    glow(W * .5, H * .36, 60, 'rgba(255,230,160,.25)'); g.fillStyle = '#3a3a3a'; for (let i = 0; i < 2; i++) { g.fillRect(W / 2 - 30 + i * 52, H * .32, 4, H); } },
  zanzibar(W, H) { sky(W, H, DUSK); const hz = H * .6; sunBurst(W * .6, hz, 36, 20); water(W, hz, H * .8, '#e86a5a', '#3a1a4a', '#ffe08a'); boatSil(W * .3, hz + 30, 1.4, '#1a0e1a', 'dhow'); boatSil(W * .75, hz + 18, .9, '#1a0e1a', 'dhow');
    g.fillStyle = '#e8c890'; g.beginPath(); g.moveTo(0, H * .8); g.quadraticCurveTo(W * .5, H * .74, W, H * .8); g.lineTo(W, H); g.lineTo(0, H); g.fill(); palm(W * .08, H * .84, H * .4, '#1a0e1a', .2); palm(W * .92, H * .86, H * .36, '#1a0e1a', -.25); },
  siemreap(W, H) { sky(W, H, [[0, '#3a3a8a'], [.5, '#ff8a6a'], [1, '#ffd890']]); const hz = H * .58; sunBurst(W * .5, hz - 50, 28, 20, 'rgba(255,220,160,.2)');
    lmDraw('angkor', W * .5, hz, H * .26, '#2a1a2a', '#ffb070'); g.fillStyle = '#1a1220'; g.fillRect(0, hz, W, H * .04); water(W, hz + H * .04, H * .85, '#c86a6a', '#3a1a3a', '#ffd890');
    g.save(); g.globalAlpha = .4; g.translate(0, (hz + H * .04) * 2); g.scale(1, -1); lmDraw('angkor', W * .5, hz + H * .04, H * .26, '#2a1a2a'); g.restore();
    g.fillStyle = '#1a2a1a'; g.fillRect(0, H * .85, W, H * .15); palm(W * .1, H * .9, H * .3, '#0e1a0e'); palm(W * .88, H * .9, H * .28, '#0e1a0e', -.2); },
  macau(W, H) { sky(W, H, [[0, '#0a0420'], [.6, '#2a0a4a'], [1, '#6a1a6a']]); stars(W, H * .3, 30); const hz = H * .66; lmDraw('macauTower', W * .7, hz, H * .62, '#1a1030', '#ff5aa8', '#ff9ad0');
    buildings(W, hz, 30, 140, ['#1a1030', '#24143a', '#2a1a44'], ['#ff5aa8', '#5fe3ff', '#ffd23a'], 81, { lit: .55, wmin: 20, wmax: 44 }); lmDraw('stPauls', W * .25, hz, H * .2, '#3a2a3a', '#ffb070');
    cityGlow(W, hz, 'rgba(255,90,168,.35)'); water(W, hz, H, '#3a0a4a', '#05020a', '#ff9ad0'); },
  ulaanbaatar(W, H) { sky(W, H, DAY); const hz = H * .62; mountains(W, hz, H * .16, '#6a8a5a', null, 91, 4); g.fillStyle = '#8ab05a'; g.fillRect(0, hz, W, H - hz);
    for (let i = 0; i < 5; i++) { const x = W * (.12 + i * .19), y = hz + 26 + (i % 2) * 14; lmDraw('ger', x, y, 34, '#f4f0e6', null); g.fillStyle = '#c8302a'; g.fillRect(x - 6, y - 12, 12, 12); g.strokeStyle = '#2a6ad8'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 36, y - 18); g.lineTo(x + 36, y - 18); g.stroke(); }
    for (let i = 0; i < 9; i++) { const x = W * i / 8; g.strokeStyle = '#4a3a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, H * .9); g.lineTo(x, H * .78); g.stroke(); g.fillStyle = ['#e8302a', '#2a6ad8', '#f4c430'][i % 3]; g.beginPath(); P([[x, H * .78], [x + 14, H * .8], [x, H * .82]]); g.fill(); } },
  stadium(W, H) { sky(W, H, NIGHT); stars(W, H * .3, 30); const hz = H * .62; g.fillStyle = '#141a2a'; g.beginPath(); g.moveTo(0, hz); g.quadraticCurveTo(W * .5, hz - H * .16, W, hz); g.lineTo(W, H); g.lineTo(0, H); g.fill();
    lmDraw('stadium', W * .5, hz - H * .02, H * .2, '#2a2a3a', '#ff6a6a'); for (const dx of [-.9, -.3, .3, .9]) { const x = W * .5 + dx * H * .2 * 2.6; glow(x, hz - H * .3, 50, 'rgba(255,255,230,.8)'); }
    glow(W * .5, hz - H * .1, W * .4, 'rgba(255,240,200,.18)'); g.fillStyle = '#2a7a3a'; g.fillRect(0, H * .82, W, H * .18); g.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 9; i++) g.fillRect(i * W / 8, H * .82, 2, H * .18); txt('HOMECOMING', W * .5, hz - H * .2, fa(Math.min(28, W * .07)), '#ff5a5a', INK, 4); },
  suite(W, H) { wallPanels(W, 0, H * .7, '#2a2a3a', '#14141e', 8); windowFrame(W * .1, H * .08, W * .8, H * .42, () => { sky(W, H, NIGHT); g.fillStyle = '#2a7a3a'; g.fillRect(W * .1, H * .3, W * .8, H * .2); for (let i = 0; i < 40; i++) { g.fillStyle = i % 2 ? '#c81e28' : '#fff'; g.fillRect(W * .1 + (i * 37) % (W * .8), H * .2 + (i * 13) % 30, 3, 3); } glow(W * .3, H * .1, 60, 'rgba(255,255,230,.6)'); glow(W * .7, H * .1, 60, 'rgba(255,255,230,.6)'); }, '#1a1a24');
    floorPersp(W, H * .7, H, '#6a1a24', '#2a0810', 'rgba(255,255,255,.04)'); g.fillStyle = '#3a2a1a'; g.fillRect(W * .02, H * .58, W * .3, H * .12); g.fillStyle = '#9d1c2a'; txt('HOG HEAVEN SUITE', W * .5, H * .62, fa(Math.min(16, W * .04)), '#f4c445', INK, 3); },
  gigi(W, H) { // cozy kitchen at Gigi's house, Fayetteville
    vgrad(0, 0, W, H * .7, [[0, '#f4d8a8'], [1, '#e8b880']]); g.save(); g.globalAlpha = .18; for (let x = 0; x < W; x += 22) for (let y = 0; y < H * .7; y += 22) { g.fillStyle = (x / 22 + y / 22) % 2 ? '#c84a5a' : '#fff'; g.beginPath(); C(x + 11, y + 11, 3); g.fill(); } g.restore();
    windowFrame(W * .36, H * .08, W * .28, H * .22, () => { sky(W, H, DAY); g.fillStyle = '#4a8a3a'; g.fillRect(0, H * .24, W, H); mountains(W, H * .26, 20, '#3a7a3a', null, 5, 4); }, '#f6f2ea');
    g.fillStyle = '#f6f2ea'; g.fillRect(W * .33, H * .3, W * .34, 8); g.fillStyle = '#c8302a'; for (let i = 0; i < 6; i++) { g.beginPath(); E(W * (.34 + i * .055), H * .07, 10, 20); g.fill(); }
    g.fillStyle = '#8a5a3a'; g.fillRect(0, H * .44, W, H * .26); g.fillStyle = '#6a4028'; for (let i = 0; i < 6; i++) g.fillRect(i * W / 6 + 4, H * .47, W / 6 - 8, H * .2); g.fillStyle = '#e8e2d8'; g.fillRect(0, H * .42, W, H * .03);
    g.fillStyle = '#f6f2ea'; g.fillRect(W * .04, H * .235, W * .2, 6); g.fillRect(W * .72, H * .222, W * .24, 6);
    // cookie jar + plate + books
    cel(() => { RR(W * .08, H * .135, W * .1, H * .1, 8); }, '#f6f2ea', '#c8c0b0', { lw: 1.6, sx: -2, sy: 0, tex: () => txt('COOKIES', W * .13, H * .185, fm(Math.min(9, W * .022)), '#c8302a', null) });
    for (let i = 0; i < 5; i++) { cel(() => C(W * (.76 + i * .03), H * .205 - (i % 2) * 5, 8), '#d8a050', '#a87028', { lw: 1.4, sx: -1, sy: -1, tex: () => { g.fillStyle = '#4a2a14'; g.beginPath(); C(W * (.76 + i * .03) - 2, H * .205 - (i % 2) * 5, 1.6); C(W * (.76 + i * .03) + 3, H * .205 - (i % 2) * 5 + 2, 1.4); g.fill(); } }); }
        pingPong(W * .5, H * .3, Math.min(W, H) / 700);
    floorPersp(W, H * .7, H, '#c89a6a', '#8a6040', 'rgba(0,0,0,.08)'); },
  hotel(W, H) { wallPanels(W, 0, H * .7, '#3a2a3a', '#1a1220', 10); windowFrame(W * .62, H * .1, W * .3, H * .3, () => { sky(W, H, NIGHT); stars(W, H, 40); buildings(W, H * .4, 10, 60, ['#141428'], ['#ffe08a'], 3, { lit: .4 }); }, '#2a1a10'); lampCone(W * .2, H * .2, W * .5, H * .8); floorPersp(W, H * .7, H, '#3a2a3a', '#140c14'); },
  interro(W, H) { wallPanels(W, 0, H * .7, '#2a2e3a', '#14161e', 6); g.fillStyle = '#0a0a10'; g.fillRect(W * .7, H * .1, W * .26, H * .2); g.fillStyle = 'rgba(160,200,255,.12)'; g.fillRect(W * .71, H * .11, W * .24, H * .18); lampCone(W * .5, 0, W * .9, H, 'rgba(255,240,200,.25)'); floorPersp(W, H * .7, H, '#2a2a30', '#0a0a10'); },
  black(W, H) { g.fillStyle = '#05040a'; g.fillRect(0, 0, W, H); },
  field(W, H) { sky(W, H, NIGHT); const hz = H * .42; g.fillStyle = '#1a1a2a'; g.fillRect(0, hz - 40, W, 40); for (let i = 0; i < 60; i++) { g.fillStyle = i % 3 ? '#9d1c2a' : '#fff'; g.fillRect((i * 37) % W, hz - 36 + (i * 11) % 30, 3, 3); } g.fillStyle = '#2a7a3a'; g.fillRect(0, hz, W, H - hz); for (let k = 0; k < 7; k++) { const y0 = hz + (H - hz) * Math.pow(k / 6, 1.6); g.fillStyle = k % 2 ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.04)'; g.fillRect(0, y0, W, (H - hz) / 6); } g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 3; g.beginPath(); for (let k = 1; k < 7; k++) { const y0 = hz + (H - hz) * Math.pow(k / 6, 1.6); g.moveTo(0, y0); g.lineTo(W, y0); } g.stroke(); txt('50', W * .2, hz + (H - hz) * .55, fa(28), 'rgba(255,255,255,.7)', null, 0); txt('50', W * .8, hz + (H - hz) * .55, fa(28), 'rgba(255,255,255,.7)', null, 0); glow(W * .2, hz - 80, 70, 'rgba(255,255,230,.8)'); glow(W * .8, hz - 80, 70, 'rgba(255,255,230,.8)'); },
};
function drawBG(id, W, H) {
  const p = BG[id] || BG.black;
  sprite('bg:' + id + ':' + Math.round(W) + 'x' + Math.round(H), 0, 0, 1, [0, 0, W, H], () => { seed = 3; p(W, H); grain(W, H, .035); });
}
