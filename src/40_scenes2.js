/* ===================== extra backdrops, title, Gigi, accusation, endings ===================== */
Object.assign(BG, {
  board(W, H) { vgrad(0, 0, W, H, [[0, '#8a5a32'], [1, '#6a4224']]); const s0 = seed; seed = 21; g.save(); for (let i = 0; i < W * H / 90; i++) { g.fillStyle = `rgba(${R(0, 1) > .5 ? '40,20,8' : '200,150,90'},${R(.08, .22)})`; g.fillRect(R(0, W), R(0, H), R(1, 3), R(1, 3)); } g.restore();
    for (let i = 0; i < 9; i++) { const x = R(20, W - 60), y = R(60, H - 80); paper(x, y, R(40, 70), R(40, 60), R(-.2, .2), R(0, 1) > .5 ? '#f2e8d2' : '#fff6a8'); }
    g.save(); g.strokeStyle = '#c0102a'; g.lineWidth = 2; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(R(0, W), R(40, H)); g.lineTo(R(0, W), R(40, H)); g.stroke(); } g.restore(); seed = s0; vignette(W, H, .5); },
  airport(W, H) { vgrad(0, 0, W, H, [[0, '#1a2038'], [1, '#0a0c18']]); windowFrame(0, H * .08, W, H * .42, () => { sky(W, H, DUSK); mountains(W, H * .44, 30, '#2a1a40', null, 3, 6); plane(W * .7, H * .3, 1.2, -.15, '#1c1428'); g.fillStyle = '#2a2436'; g.fillRect(0, H * .44, W, H); }, '#3a4258');
    for (let i = 0; i < 8; i++) { g.fillStyle = '#3a4258'; g.fillRect(i * W / 8, H * .08, 6, H * .42); } floorPersp(W, H * .5, H, '#3a3a4a', '#16161e', 'rgba(255,255,255,.06)'); },
  flight(W, H) { sky(W, H, DAY); paintedCloud(W * .25, H * .3, W * .6, H * .06, '#fff', 'rgba(150,180,220,.6)'); paintedCloud(W * .75, H * .55, W * .7, H * .07, '#fff', 'rgba(150,180,220,.6)'); paintedCloud(W * .4, H * .8, W * .9, H * .08, '#fff', 'rgba(150,180,220,.6)'); },
  credits(W, H) { BG.stadium(W, H); g.save(); g.fillStyle = 'rgba(4,4,14,.55)'; g.fillRect(0, 0, W, H); g.restore(); },
});
// Gigi's Siamese cats Ping & Pong (cream bodies, dark points) on the windowsill
function pingPong(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
  for (const k of [-1, 1]) { const cx = k * 22; cel(() => { E(cx, -16, 18, 16); }, '#f2e6d0', '#8a7a62', { lw: 1.8, sx: 0, sy: -2 }); cel(() => { C(cx, -38, 12); P([[cx - 11, -44], [cx - 9, -58], [cx - 2, -48]]); P([[cx + 11, -44], [cx + 9, -58], [cx + 2, -48]]); }, '#f2e6d0', '#8a7a62', { lw: 1.8, sx: 0, sy: -2 });
    g.fillStyle = '#4a3428'; g.beginPath(); E(cx, -34, 7, 6); g.fill(); P([[cx - 10, -45], [cx - 9, -55], [cx - 4, -48]]); g.fill(); P([[cx + 10, -45], [cx + 9, -55], [cx + 4, -48]]); g.fill(); g.fillStyle = '#5ab8ff'; g.beginPath(); C(cx - 4, -39, 2.2); C(cx + 4, -39, 2.2); g.fill();
    g.strokeStyle = '#4a3428'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx + k * 14, -6); g.quadraticCurveTo(cx + k * 34, -4, cx + k * 30, -28); g.stroke(); }
  g.strokeStyle = '#c8302a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-12, -24); g.quadraticCurveTo(0, -18, 12, -24); g.stroke(); // tied together with a bow (they're inseparable)
  g.fillStyle = '#c8302a'; g.beginPath(); C(0, -21, 3); g.fill(); g.restore(); }

/* ---------- title ---------- */
function titleLogo(cx, cy, k = 1) {
  g.save(); g.translate(cx, cy); g.scale(k, k); const f = fa(86);
  g.font = f; const w1 = g.measureText('HOG').width, w2 = g.measureText('TIED').width, gap = 16, tot = w1 + gap + w2; const x1 = -tot / 2, x2 = x1 + w1 + gap;
  rope(x1 - 18, 22, x2 + w2 + 18, -8, 11);
  for (const [s, x, rot] of [['HOG', x1, -.05], ['TIED', x2, -.05]]) { g.save(); g.translate(x, 0); g.rotate(rot); g.font = f; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = '#0b0a10'; g.fillText(s, 5, 6); g.lineJoin = 'round'; g.lineWidth = 10; g.strokeStyle = '#0b0a10'; g.strokeText(s, 0, 0);
    const gr = g.createLinearGradient(0, -38, 0, 38); gr.addColorStop(0, '#d9ecff'); gr.addColorStop(.42, '#4d98ff'); gr.addColorStop(.5, '#1f4fc0'); gr.addColorStop(1, '#0c1c52'); g.fillStyle = gr; g.fillText(s, 0, 0); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.55)'; g.strokeText(s, -1, -1); g.restore(); }
  rope(x1 + w1 * .3, -30, x1 + w1 * .55, 36, 9); rope(x2 + w2 * .55, -34, x2 + w2 * .78, 32, 9); g.restore();
}
function keyArt(W, H, ax, aw) { // characters region: ax..ax+aw, anchored bottom
  const cs = Math.min(1.1, (H - (L.portrait ? 380 : 30)) / 560, aw / 380); const by = H - 14, cx = ax + aw / 2;
  sprite('keyart@' + Math.round(aw) + 'x' + Math.round(H) + kayOutfit(), 0, 0, 1, [ax, by - 620 * cs, aw, 640 * cs], () => { RIMK = .7; kayleighFull(cx + 2 * cs, by, cs, { fedora: true, rim: '#ff6fa0' }); cocoa(cx - 116 * cs, by + 16 * cs, .98 * cs, { rim: '#ff8fb8' }); kd(cx + 130 * cs, by + 20 * cs, .9 * cs, { rim: RIM_O }); });
  return by - 560 * cs;
}
function drawTitle() {
  const W = L.W, H = L.H; drawBG('title', W, H); RT.forceOutfit = 'noir';
  stars(W, H * .35, 50, 31, .7);
  const hasSave = !!loadGame(true);
  if (L.portrait) {
    const top = keyArt(W, H, 0, W);
    const k = Math.min(1, (W - 20) / 360); titleLogo(W / 2, 84, k);
    txt('A  KAYLEIGH  MYSTERY', W / 2, 148, ft(16), '#fff3d6', '#0b0a10', 4); pigCoin(46, 148, 12, -.3); pigCoin(W - 46, 148, 12, .3);
    txt('Heads they lose. Tails they lose.', W / 2, 172, `italic 600 13px ${F.osw}`, '#ffd9a8', '#0b0a10', 3.5);
    let y = 192; const bw = Math.min(170, (W - 36) / 2);
    if (hasSave) { btn('t_cont', W / 2 - bw - 4, y, bw, 46, 'CONTINUE', () => startGame(false), { col: '#2266dd' }); btn('t_new', W / 2 + 4, y, bw, 46, 'NEW CASE', () => startGame(true), { col: '#9d1c2a' }); }
    else btn('t_new', W / 2 - 100, y, 200, 48, '▶ NEW CASE', () => startGame(true), { col: '#9d1c2a', px: 20 });
    y += 56; btn('t_set', W / 2 - 60, y, 120, 34, 'SETTINGS', openSettings, { col: '#2b3c70', px: 13 });
    y += 42; ageBadge(W / 2, y, Math.min(W - 30, 360));
    if (GS.flags && GS.flags.closed) txt('★ CASE CLOSED ★', W / 2, y + 62, fa(13), '#ffd23a', INK, 3);
  } else {
    const aw = W * .44; keyArt(W, H, 0, aw); const rx = aw, rw = W - aw, cx = rx + rw / 2;
    titleLogo(cx, 70, Math.min(.9, (rw - 20) / 360)); txt('A  KAYLEIGH  MYSTERY', cx, 128, ft(16), '#fff3d6', '#0b0a10', 4); txt('Heads they lose. Tails they lose.', cx, 150, `italic 600 13px ${F.osw}`, '#ffd9a8', '#0b0a10', 3.5);
    let y = 168; const bw = Math.min(170, (rw - 36) / 2);
    if (hasSave) { btn('t_cont', cx - bw - 4, y, bw, 46, 'CONTINUE', () => startGame(false), { col: '#2266dd' }); btn('t_new', cx + 4, y, bw, 46, 'NEW CASE', () => startGame(true), { col: '#9d1c2a' }); }
    else btn('t_new', cx - 100, y, 200, 48, '▶ NEW CASE', () => startGame(true), { col: '#9d1c2a', px: 20 });
    btn('t_set', cx - 60, y + 56, 120, 34, 'SETTINGS', openSettings, { col: '#2b3c70', px: 13 });
    ageBadge(cx, y + 100, Math.min(rw - 30, 380));
    if (GS.flags && GS.flags.closed) txt('★ CASE CLOSED ★', cx, H - 16, fa(13), '#ffd23a', INK, 3);
  }
  if (RT.ageGate) drawAgeGate();
}
function ageBadge(cx, y, w) { rr(cx - w / 2, y, w, 52, 10, 'rgba(40,0,8,.82)', '#ff3a4a', 1.6); rr(cx - w / 2 + 8, y + 9, 40, 34, 8, '#c0102a'); txt('18+', cx - w / 2 + 28, y + 27, fa(17), '#fff', null);
  fitText('ADULTS ONLY. Graphic violence, gore, strong language & crude humor. Fiction: any resemblance is a coincidence. Toned Down mode is in Settings.', cx - w / 2 + 56, y + 7, w - 64, 40, px => fo(px, 500), 11, '#ffd6dc'); }
function drawAgeGate() {
  const W = L.W, H = L.H; g.save(); g.fillStyle = 'rgba(4,0,6,.9)'; g.fillRect(0, 0, W, H); g.restore(); addHit('ag_bg', 0, 0, W, H, () => {});
  const w = Math.min(W - 30, 380), h = 300, x = (W - w) / 2, y = (H - h) / 2; panel(x, y, w, h, { edge: '#ff3a4a', lw: 2.4 });
  txt('18+ ONLY', x + w / 2, y + 32, fa(28), '#ff5a6a', INK, 4);
  fitText('Hog Tied is an adult noir comedy. It has bloody murders with gory detail, swearing, and humor that would get you kicked out of church. KD (age 6) is kept kid-safe in the story, but this game is NOT for kids. Are you 18 or older?', x + 20, y + 58, w - 40, 140, px => fo(px, 500), 15, '#fff', 'center');
  btn('ag_yes', x + 14, y + h - 76, (w - 40) / 2, 52, "I'M 18+", () => { SETTINGS.adult = true; saveSettings(); RT.ageGate = false; startGame(true); }, { col: '#9d1c2a', px: 18 });
  btn('ag_no', x + w / 2 + 6, y + h - 76, (w - 40) / 2, 52, 'NOPE', () => { RT.ageGate = false; toast('Smart. Go play outside.', '#ffd23a'); }, { col: '#3a4a7a', px: 18 });
}

/* ---------- Gigi drop-off / pick-up ---------- */
function gigiLines(mode) {
  const done = {}; const on = [{ id: 'kay' }, { id: 'gigi' }, { id: 'kd' }, { id: 'cocoa' }];
  const books = [['The Pig Who Solved It', V('"...and the pig said, I\'m not bacon, I\'m a DETECTIVE." KD laughs so hard milk comes out of his nose. There was no milk. Unclear where it came from.', '"...and the pig said, I\'m not bacon, I\'m a DETECTIVE." KD laughs so hard he hiccups.')], ['Goodnight, Moose', V('Gigi does all the moose voices. KD is asleep by page four. Cocoa is asleep by page two.', 'Gigi does all the moose voices. KD is asleep by page four. Cocoa by page two.')], ['Cocoa and the Missing Sock', V('Spoiler: Cocoa ate the sock. KD is outraged. Cocoa is not sorry.', 'Spoiler: Cocoa ate the sock. KD is outraged. Cocoa is not sorry.')]];
  const menu = () => ({ prompt: mode === 'drop' ? 'What happens at Gigi\'s before you fly out?' : 'Catch up with the crew at Gigi\'s:', who: 'n', choice: [
    !done.cookie && { t: '🍪 COOKIE TIME', sub: 'Gigi\'s famous chocolate chip', thenFn: () => { done.cookie = 1; return [['gigi', 'Fresh out of the oven. One for KD, one for Cocoa, two for the detective because she looks tired.', 'smile'], ['kd', 'Can I have five?', 'grin'], ['gigi', 'You can have three and a hug.', 'smile'], ['kd', 'DEAL.'], { toast: 'KD ate 3 cookies. Cocoa ate 1 (and a napkin).' }, menu()]; } },
    !done.book && { t: '📖 STORY TIME', sub: 'Pick a book for KD', thenFn: () => { done.book = 1; return [{ prompt: 'Which book?', who: 'gigi', choice: books.map(([b, line]) => ({ t: b, then: [['*', line], ['gigi', 'That\'s a good one. We\'ll read it twice.', 'smile']] })) }, menu()]; } },
    !done.cocoa && { t: '🐶 COCOA\'S CORNER', sub: 'Bed, bowl, belly rubs', thenFn: () => { done.cocoa = 1; return [['*', 'Cocoa inspects her bed by the window, under the Siamese cats Ping & Pong, who sit glued together like they share one spine.'], ['gigi', 'Ping and Pong are a package deal. Like you girls. Like Siamese twins, except they actually like each other.', 'smile'], ['kay', 'Kambree and I like each other. Mostly. On holidays.', 'smirk'], menu()]; } },
    { t: mode === 'drop' ? '✈ HEAD OUT' : '✈ BACK TO THE CASE', col: '#1a8a5a', req: () => Object.keys(done).length >= 1, then: mode === 'drop' ? [['kay', 'Be good for Gigi, okay? And Cocoa, no eating socks.', 'smile'], ['kd', 'Mommy, catch the bad guys. And bring me a magnet.', 'grin'], ['kay', 'Two magnets.'], ['gigi', 'Go. Be careful. Call me when you land. And wear a jacket.', 'smile'], { party: { kd: 0, cocoa: 0 } }, { toast: 'KD & COCOA ARE SAFE AT GIGI\'S' }] : [['kd', 'MOMMY! Gigi let me stay up till 8:15!', 'grin'], ['gigi', 'Eight-oh-five. Here, I packed you a cookie tin for the road. Share it with whoever needs sweetening up.', 'smile'], { item: 'cookies' }, ['kay', 'Gigi, you\'re a national treasure.', 'grin'], { party: { kd: 1, cocoa: 1 } }] },
  ].filter(Boolean) });
  return [{ bg: 'gigi', on, music: 'gigi' }, menu()];
}

/* ---------- accusation ---------- */
const ACCUSE = {
  order: { q: 'WHO ORDERED IT?', opts: [['pettigrew', 'Bo Pettigrew'], ['lau', 'Madame Jade Lau'], ['count', 'Count de Vauclair'], ['barlow', 'Coach Duke Barlow'], ['zurab', 'Zurab'], ['tank', 'Tank Dobbins']], a: 'pettigrew' },
  trig: { q: 'WHO KILLED RINGO?', opts: [['tank', 'Tank Dobbins'], ['batzorig', 'Batzorig'], ['krill', 'Dr. Krill'], ['chad', 'HogWildChad'], ['crab', 'Crab Daddy'], ['kambree', 'Agent Kambree (she has an alibi and a bladder)']], a: 'chad' },
  why: { q: 'WHY?', opts: [['a', 'Twenty years of betting against his own team, with the debts finally due'], ['b', 'Jealousy: Ringo was dating his niece'], ['c', 'Revenge for a losing season'], ['d', 'A plan to build a hog-themed casino in Macau']], a: 'a' },
  proof: { q: 'PROOF (PICK 3)', need: ['ledger', 'cane', 'tracker', 'tankphoto', 'lautape', 'drawing', 'casing'] },
};
function accuseStart(step, onDone) { RT.acc = { step, onDone, pick: { order: null, trig: null, why: null, proof: [] }, open: null, res: null, t: 0 }; RT.scene = 'accuse'; music('tension'); }
function drawAccuse() {
  const A = RT.acc, W = L.W, H = L.H; A.t += DT; drawBG('board', W, H);
  txt('THE ACCUSATION', W / 2, 64, fa(24), '#fff', INK, 4); txt('Get it right. The whole stadium is watching.', W / 2, 88, fo(12, 600), '#ffd23a', INK, 3);
  const w = Math.min(W - 24, 620), x = (W - w) / 2; let y = 102; const rh = L.portrait ? 64 : 52, gap = 8;
  const rows = [['order', A.pick.order ? CAST[A.pick.order].name : 'TAP TO CHOOSE'], ['trig', A.pick.trig ? CAST[A.pick.trig].name : 'TAP TO CHOOSE'], ['why', A.pick.why ? ACCUSE.why.opts.find(o => o[0] === A.pick.why)[1] : 'TAP TO CHOOSE'], ['proof', A.pick.proof.length ? A.pick.proof.map(c => CLUES[c].short || CLUES[c].name).join(' · ') : 'TAP TO CHOOSE 3 CARDS']];
  const cols = L.portrait ? 1 : 2, bw = (w - (cols - 1) * gap) / cols;
  rows.forEach(([k, val], i) => { const bx = x + (i % cols) * (bw + gap), by = y + Math.floor(i / cols) * (rh + gap); const set = k === 'proof' ? A.pick.proof.length === 3 : !!A.pick[k];
    btn('acc_' + k, bx, by, bw, rh, ACCUSE[k].q, () => { A.open = k; sfx('page'); }, { col: set ? '#22305a' : '#3a2a4a', sub: val, icon: k === 'order' ? '👑' : k === 'trig' ? '🔪' : k === 'why' ? '❓' : '📁', hot: !set }); });
  y += Math.ceil(rows.length / cols) * (rh + gap) + 4;
  const ready = A.pick.order && A.pick.trig && A.pick.why && A.pick.proof.length === 3;
  btn('acc_go', W / 2 - 110, Math.min(H - 70, y + 6), 220, 54, 'ACCUSE!', accuseResolve, { col: '#c0102a', px: 24, disabled: !ready, why: 'Fill in all four.' });
  // portraits of picks
  if (A.open) drawAccuseChooser();
  drawHUD({ board: true });
}
function drawAccuseChooser() {
  const A = RT.acc, W = L.W, H = L.H, k = A.open, def = ACCUSE[k]; g.save(); g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(0, 0, W, H); g.restore(); addHit('acc_bg', 0, 0, W, H, () => A.open = null);
  const w = Math.min(W - 24, 560), h = H - 70, x = (W - w) / 2, y = 52; panel(x, y, w, h, { edge: '#ffd23a' }); addHit('acc_panel', x, y, w, h, () => {});
  txt(def.q, x + w / 2, y + 22, fa(18), '#ffd23a', INK, 3);
  let opts; const DECOY = ['coin', 'crabchip', 'golfball', 'toast', 'hawkecontract', 'chadsticker', 'nilcontract', 'yachttape', 'saffron']; if (k === 'proof') opts = GS.clues.filter(c => CLUES[c] && (CLUES[c].proof || DECOY.includes(c))).map(c => [c, CLUES[c].name]); else opts = def.opts;
  const cols = k === 'why' ? 1 : k === 'proof' ? (L.portrait ? 2 : 3) : (L.portrait ? 1 : 2), gap = 6, bw = (w - 24 - gap * (cols - 1)) / cols, bh = Math.min(k === 'why' ? 52 : 44, (h - 100 - gap * Math.ceil(opts.length / cols)) / Math.ceil(opts.length / cols));
  opts.forEach(([id, name], i) => { const bx = x + 12 + (i % cols) * (bw + gap), by = y + 42 + Math.floor(i / cols) * (bh + gap); const sel = k === 'proof' ? A.pick.proof.includes(id) : A.pick[k] === id;
    btn('ao_' + id, bx, by, bw, bh, name, () => { if (k === 'proof') { const p = A.pick.proof; if (sel) p.splice(p.indexOf(id), 1); else if (p.length < 3) p.push(id); else toast('Only 3 cards. Pick your best.', '#ffd23a'); sfx('tap'); } else { A.pick[k] = id; A.open = null; sfx('tap'); } }, { col: sel ? '#1a8a5a' : '#22305a', px: 13, icon: k === 'proof' ? '' : null }); });
  if (k === 'proof') btn('acc_pdone', x + w / 2 - 80, y + h - 52, 160, 42, 'DONE (' + A.pick.proof.length + '/3)', () => A.open = null, { col: '#2266dd' });
}
function accuseResolve() {
  const A = RT.acc, p = A.pick; const okProof = p.proof.filter(c => ACCUSE.proof.need.includes(c)).length >= 3;
  const ok = p.order === ACCUSE.order.a && p.trig === ACCUSE.trig.a && p.why === ACCUSE.why.a && okProof;
  GS.stats.accuse = (GS.stats.accuse || 0) + 1;
  const f = A.onDone; RT.acc = null; f(ok ? 'right' : 'wrong', p);
}
/* ---------- celebration + credits ---------- */
function creditsStart(onDone) { RT.cr = { t: 0, onDone, fw: [] }; RT.scene = 'credits'; music('victory'); }
const CREDITS = ['HOG TIED', 'A KAYLEIGH MYSTERY', '', 'Starring', 'KAYLEIGH as Herself', 'AGENT KAMBREE as the Baby Sister With a Badge', 'KD as the Junior Detective', 'COCOA as the Very Good Girl', 'GIGI as Gigi (and the cookies)', '', 'Ping & Pong as the Inseparable Siamese Cats', '', 'Written for one true-crime queen', 'All music: original', 'All characters: fictional', 'Any resemblance to real hogs, living or dead,', 'is purely coincidental.', '', 'No pigs were harmed.', 'Several boosters were.', '', 'WOO PIG JUSTICE'];
function drawCredits() {
  const C_ = RT.cr, W = L.W, H = L.H; C_.t += DT; drawBG('credits', W, H);
  if (grnd() < DT * 2.2) C_.fw.push({ x: R(.1, .9) * W, y: R(.12, .45) * H, t: 0, c: pick(['#ff3a5a', '#ffd23a', '#5fe3ff', '#ff5aa8', '#fff']) });
  for (const f of C_.fw) { f.t += DT; const r = f.t * 90, a = 1 - f.t / 1.4; if (a <= 0) continue; g.save(); g.globalAlpha = a; g.fillStyle = f.c; for (let i = 0; i < 16; i++) { const an = i / 16 * TAU; g.beginPath(); C(f.x + Math.cos(an) * r, f.y + Math.sin(an) * r + f.t * f.t * 20, 2.4); g.fill(); } g.restore(); }
  C_.fw = C_.fw.filter(f => f.t < 1.4);
  const sy = H + 20 - C_.t * 38; CREDITS.forEach((l, i) => { const y = sy + i * 34; if (y < 40 || y > H + 20) return; txt(l, W / 2, y, i < 2 || l === 'WOO PIG JUSTICE' ? fa(i === 0 ? 34 : 22) : l === 'Starring' ? ft(16) : fo(15, 600), i < 2 || l === 'WOO PIG JUSTICE' ? '#ffd23a' : '#fff', INK, 4); });
  const end = sy + CREDITS.length * 34; if (end < H * .5 || C_.t > 22) { const f = C_.onDone; RT.cr = null; f(); return; }
  btn('cr_skip', W - 96, H - 50, 84, 36, 'SKIP ▸', () => { const f = C_.onDone; RT.cr = null; f(); }, { col: '#2b3c70', px: 13 });
}
