/* ===================== STATE, CHAPTER RUNNER, CASE BOARD, LOOP ===================== */
let DT = 0; const ERRS = [];
function freshState() { return { v: 1, ch: 0, step: 0, flags: {}, clues: [], bag: [], hours: 672, heat: 0, fbi: 50, street: 20, cash: 2500, swear: 0, party: { kd: 1, cocoa: 1, kambree: 0 }, outfitPref: 'default', suspects: {}, stats: {}, started: false, snap: null }; }
let GS = freshState();
function saveGame() { if (!GS.started) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify(GS)); } catch (e) {} }
function loadGame(peek) { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (!s || !s.started) return null; if (peek) return s; return Object.assign(freshState(), s); } catch (e) { return null; } }
function startGame(isNew) {
  if (isNew && !SETTINGS.adult) { RT.ageGate = true; return; }
  audioInit();
  if (isNew) { const closed = GS.flags && GS.flags.closed; GS = freshState(); GS.started = true; if (closed) GS.flags.everClosed = 1; startChapter(); }
  else { const s = loadGame(); if (!s) return startGame(true); GS = s; if (GS.snap && GS.step === 0) startChapter(); else { chapterCard(() => runStep()); } }
}
function toTitle() { RT.scene = 'title'; RT.story = RT.inv = RT.int = RT.gm = RT.fl = RT.ded = RT.acc = RT.cr = null; RT.board = false; music('theme'); }
function newGame() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} GS = freshState(); toTitle(); }
function restartChapter() { if (GS.snap) { const s = JSON.parse(GS.snap); GS = Object.assign(freshState(), s); GS.snap = JSON.stringify(s); } GS.step = 0; RT.story = RT.inv = RT.int = RT.gm = RT.fl = RT.ded = RT.acc = null; startChapter(); }
function chapterCard(then) { const ch = CH[GS.ch]; storyStart([{ card: { kind: 'chapter', n: ch.n, title: ch.title, city: ch.city, tag: ch.tag, solo: ch.solo } }], then, { bg: ch.bg }); music(ch.music || 'noir'); }
function startChapter() {
  const ch = CH[GS.ch]; GS.step = 0; GS.party = Object.assign({}, ch.party); GS.heat = Math.max(0, GS.heat - 1); RT.forceOutfit = null;
  const snap = Object.assign({}, GS); delete snap.snap; GS.snap = JSON.stringify(snap); saveGame();
  chapterCard(() => runStep());
}
function stepDone() { GS.step++; saveGame(); runStep(); }
function runStep() {
  const ch = CH[GS.ch]; RT.forceOutfit = null; RT.board = false;
  if (GS.step >= ch.steps.length) { if (GS.ch + 1 < CH.length) { GS.ch++; startChapter(); } else toTitle(); return; }
  const st = ch.steps[GS.step]; if (st.music) music(st.music);
  switch (st.t) {
    case 'story': music(ch.music || 'noir'); storyStart(st.s, stepDone, { bg: ch.bg }); break;
    case 'gigi': storyStart(gigiLines(st.mode), () => { music(ch.music || 'noir'); stepDone(); }, { bg: 'gigi' }); break;
    case 'invest': investStart(st, stepDone); if (st.crime) music('noir'); break;
    case 'interro': interroStart(st, () => stepDone()); break;
    case 'board': boardStart(st, stepDone); music('tension'); break;
    case 'game': gameStart(st, () => stepDone()); break;
    case 'flight': flightStart(st, stepDone); break;
    case 'accuse': { const h = (res) => { if (res === 'right') { GS.flags.accused = 1; stepDone(); } else storyStart(WRONG_HOG, () => accuseStart(st, h), { bg: 'suite' }); }; accuseStart(st, h); break; }
    case 'ending': storyStart(ENDING, () => creditsStart(() => storyStart(STING, () => { GS.flags.closed = 1; GS.ch = CH.length - 1; GS.step = CH[GS.ch].steps.length - 1; saveGame(); toTitle(); }, { bg: 'stadium' })), { bg: 'stadium' }); break;
    default: stepDone();
  }
}
/* ---------- case board overlay ---------- */
function drawCaseBoard() {
  const W = L.W, H = L.H; drawBG('board', W, H); g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, H); g.restore(); addHit('cb_bg', 0, 0, W, H, () => {});
  const sc = RT.boardScroll || 0; g.save(); g.beginPath(); g.rect(0, 40, W, H - 40); g.clip(); g.translate(0, -sc);
  let y = 54; const x0 = 12, w = W - 24;
  txt('CASE BOARD', W / 2, y + 12, fa(22), '#fff', INK, 4); y += 34;
  // who's where
  paper(x0, y, w, 92, -.005, '#f2e8d2'); const ch = CH[GS.ch];
  txt('WHO\'S WHERE', x0 + 12, y + 14, fa(13), '#9d1c2a', null, 0, 'left');
  const where = [['KAYLEIGH', ch.city], ['AGENT KAMBREE', GS.party.kambree ? 'With Kayleigh' : (GS.ch < 3 ? 'FBI legal attaché, Buenos Aires' : 'Away (Quantico / desk duty)')], ['KD & COCOA', GS.party.kd ? 'With Kayleigh' : (ch.solo || GS.flags.atGigi ? 'At Gigi\'s: cookies & story time' : 'With a trusted sitter, far from the scene')]];
  where.forEach(([a, b], i) => { txt(a, x0 + 12, y + 34 + i * 18, fa(11), '#2a1a10', null, 0, 'left'); fitTextLine(b, x0 + 130, y + 34 + i * 18, w - 140, fo(11, 500), '#2a1a10'); });
  y += 102;
  paper(x0, y, w, 56, .006, '#fff6a8'); txt('🫙 KD\'S SWEAR JAR', x0 + 12, y + 18, fa(13), '#2a1a10', null, 0, 'left'); txt(fmt$(GS.swear) + ' (' + GS.swear + ' words)', x0 + w - 12, y + 18, fa(15), '#1a6a2a', null, 0, 'right'); fitTextLine('$1 per bad word said in front of KD. He\'s keeping receipts.', x0 + 12, y + 40, w - 24, fo(10.5, 500), '#5a4a30');
  y += 66;
  txt('EVIDENCE (' + GS.clues.length + ')', x0 + 4, y + 10, fa(14), '#ffd23a', INK, 3, 'left'); y += 22;
  const cols = L.portrait ? 3 : 6, cw = (w - (cols - 1) * 8) / cols, chh = 78;
  GS.clues.forEach((id, i) => { const c = CLUES[id]; if (!c) return; const cx = x0 + (i % cols) * (cw + 8), cy = y + Math.floor(i / cols) * (chh + 8); paper(cx, cy, cw, chh, ((i * 7) % 5 - 2) * .01, '#f2ead8'); clueIcon(c.icon, cx + cw / 2, cy + 30, 1); fitText(c.short || c.name, cx + 4, cy + 52, cw - 8, 22, px => fo(px, 600), 11, '#2a1a10', 'center');
    if (cy - sc > 40 && cy - sc < H) addHit('cb_c' + id, cx, cy - sc, cw, chh, () => { RT.boardCard = id; sfx('page'); }); });
  y += Math.ceil(GS.clues.length / cols) * (chh + 8) + 8;
  txt('SUSPECTS', x0 + 4, y + 10, fa(14), '#ffd23a', INK, 3, 'left'); y += 22;
  const sus = Object.keys(GS.suspects); if (!sus.length) { txt('Nobody interrogated yet.', x0 + 8, y + 10, fo(12, 500), '#fff', null, 0, 'left'); y += 24; }
  sus.forEach((id, i) => { const cx = x0 + (i % cols) * (cw + 8), cy = y + Math.floor(i / cols) * (cw * 1.1 + 8); paper(cx, cy, cw, cw * 1.1, 0, '#fff'); g.save(); g.beginPath(); g.rect(cx + 4, cy + 4, cw - 8, cw * .8); g.fillStyle = '#1a2040'; g.fill(); g.clip(); drawCast(id, cx + cw / 2, cy + cw * 1.02, cw / 240 * 1.05); g.restore(); const stt = GS.suspects[id]; fitTextLine((CAST[id] || {}).name || id, cx + cw / 2, cy + cw * .93, cw - 6, fa(9.5), '#2a1a10', 'center'); txt(stt === 'cracked' ? 'CRACKED' : 'LAWYERED', cx + cw / 2, cy + cw * .45, fa(13), stt === 'cracked' ? 'rgba(20,140,60,.85)' : 'rgba(200,30,40,.85)', null); });
  y += Math.ceil(sus.length / cols) * (cw * 1.1 + 8);
  RT.boardMax = Math.max(0, y + 70 - H); if (RT.boardScroll > RT.boardMax) RT.boardScroll = RT.boardMax;
  g.restore();
  btn('cb_close', W / 2 - 70, H - 54, 140, 42, 'CLOSE', () => { RT.board = false; }, { col: '#2266dd' });
  if (RT.boardMax > 0) txt('drag to scroll', W - 14, H - 18, fo(10, 500), 'rgba(255,255,255,.7)', null, 0, 'right');
  if (RT.boardCard) { const I = { card: RT.boardCard, step: {} }; g.save(); drawClueCard(I); g.restore(); HITS = HITS.filter(h => h.id !== 'cc_ok'); const w2 = Math.min(W - 30, 380), h2 = Math.min(H - 70, 280); btn('cb_cc', W / 2 - 80, (H - h2) / 2 + h2 - 54, 160, 42, 'CLOSE', () => RT.boardCard = null, { col: '#2266dd' }); }
  drawHUD({ board: false });
}

/* ---------- auto-play test hook: one sensible action per call ---------- */
function autoAct() {
  const S = RT.scene;
  const click = id => { const h = HITS.find(q => q.id === id); if (h) { h.fn(); return true; } return false; };
  if (RT.settings) return click('set_close');
  if (RT.board) return click('cb_close');
  if (S === 'title') { if (RT.ageGate) return click('ag_yes'); return click('t_new'); }
  if (S === 'story') { const st = RT.story; if (!st) return; if (st.choice) return storyChoose(st.choice[st.choice.length > 1 && st.choice[st.choice.length - 1].req ? st.choice.length - 1 : 0]); if (st.cur) st.typed = 9999; st.t = 9; storyTap(); return; }
  if (S === 'invest') { const I = RT.inv; if (!I) return; if (I.warn) { I.warn = 0; return; } if (I.card) { if (I.card !== '__autopsy') addClue(I.card); I.card = null; return; } if (invNeed(I.step)) return investFinish(); if (I.site < 0) { const i = I.step.sites.findIndex(s => s.clues.some(c => !GS.clues.includes(c.id))); I.site = i; return; } const s = I.step.sites[I.site]; const c = s.clues.find(c => !GS.clues.includes(c.id)); if (c) { I.card = c.id; return; } I.site = -1; return; }
  if (S === 'interro') { const I = RT.int; if (!I) return; if (I.end) return click('int_done'); if (I.pending) return intNext(); const cur = intCur(); if (cur.lie && GS.clues.includes(cur.lie)) return intAct('present', cur.lie); if (GS.party.kambree && !I.used.kambree) return intAct('kambree'); return intAct(I.tension > 60 ? 'sweet' : 'bluff'); }
  if (S === 'deduce') { const D = RT.ded; if (!D) return; if (D.ok) return click('ded_next'); return click('ded' + D.step.qs[D.qi].a); }
  if (S === 'game') { const G = RT.gm; if (!G) return; if (G.phase === 'intro') return gameBegin(); if (G.phase === 'play') return gameEnd(true); return click('gm_ok') || click('gm_skip'); }
  if (S === 'flight') { const F_ = RT.fl; if (!F_) return; if (F_.fly) { F_.fly = 3; return; } const i = F_.step.opts.findIndex(o => o.ok); return click('fl' + i); }
  if (S === 'accuse') { const A = RT.acc; if (!A) return; A.pick.order = 'pettigrew'; A.pick.trig = 'chad'; A.pick.why = 'a'; A.pick.proof = ACCUSE.proof.need.filter(c => GS.clues.includes(c)).slice(0, 3); return accuseResolve(); }
  if (S === 'credits') { const f = RT.cr.onDone; RT.cr = null; return f(); }
}
window.__HT = {
  state: () => ({ scene: RT.scene, ch: GS.ch, chId: CH[GS.ch] && CH[GS.ch].id, step: GS.step, stepT: CH[GS.ch] && CH[GS.ch].steps[GS.step] && CH[GS.ch].steps[GS.step].t, party: Object.assign({}, GS.party), clues: GS.clues.length, swear: GS.swear, closed: !!GS.flags.closed, W: L.W, H: L.H, portrait: L.portrait, story: RT.story ? { who: RT.story.cur && RT.story.cur.who, on: RT.story.on.map(c => c.id), bg: RT.story.bg, choice: !!RT.story.choice, card: !!RT.story.card } : null, gm: RT.gm ? RT.gm.phase : null, errs: ERRS.slice(-5), nErr: ERRS.length }),
  hits: () => HITS.map(h => ({ id: h.id, x: h.x, y: h.y, w: h.w, h: h.h })),
  click: id => { const h = HITS.find(q => q.id === id); if (h) { h.fn(); return true; } return false; },
  auto: autoAct,
  jump: (ch, step = 0) => { GS = Object.assign(freshState(), { started: true }); SETTINGS.adult = true; GS.ch = ch; for (let i = 0; i < ch; i++) for (const s of CH[i].steps) { if (s.t === 'invest') for (const si of s.sites) for (const c of si.clues) if (!GS.clues.includes(c.id)) GS.clues.push(c.id); } ['coin', 'drawing', 'ledger', 'tracker', 'lautape', 'cane'].forEach(c => { if (ch > ({ coin: 1, drawing: 9, ledger: 10, tracker: 11, lautape: 13, cane: 14 })[c] && !GS.clues.includes(c)) GS.clues.push(c); }); if (ch >= 3) GS.flags.noir = GS.flags.sworn = 1; GS.bag = ['cookies', 'malbec']; startChapter(); if (step) { RT.story = null; GS.step = step; runStep(); } },
  goStep: (step) => { RT.story = null; GS.step = step; runStep(); },
  set: o => Object.assign(SETTINGS, o),
  gs: () => GS, rt: () => RT,
  iconURL: n => iconURL(n),
};

/* ---------- main loop ---------- */
let last = performance.now();
function frame(ts) {
  DT = clamp((ts - last) / 1000, 0, .05); last = ts; RT.t += DT; HITS = [];
  try {
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#05040a'; g.fillRect(0, 0, cv.width, cv.height);
    let sx = 0, sy = 0; if (RT.shake > 0) { sx = (Math.random() - .5) * RT.shake; sy = (Math.random() - .5) * RT.shake; RT.shake = Math.max(0, RT.shake - DT * 40); }
    const k = L.sc * L.dpr; g.setTransform(k, 0, 0, k, L.ox * L.dpr + sx * k, L.oy * L.dpr + sy * k); g.lineJoin = 'round'; g.lineCap = 'round';
    g.save(); g.beginPath(); g.rect(0, 0, L.W, L.H); g.clip();
    switch (RT.scene) {
      case 'title': drawTitle(); break;
      case 'story': if (RT.story) drawStory(); break;
      case 'invest': if (RT.inv) drawInvest(); break;
      case 'interro': if (RT.int) drawInterro(); break;
      case 'deduce': if (RT.ded) drawDeduce(); break;
      case 'game': if (RT.gm) drawGame(); break;
      case 'flight': if (RT.fl) drawFlight(); break;
      case 'accuse': if (RT.acc) drawAccuse(); break;
      case 'credits': if (RT.cr) drawCredits(); break;
      default: drawBG('black', L.W, L.H); txt('LOADING…', L.W / 2, L.H / 2, fa(18), '#fff', null);
    }
    if (RT.board && RT.scene !== 'title') { HITS = HITS.filter(h => h.id === 'menu'); drawCaseBoard(); }
    drawParts(); drawToasts();
    if (RT.settings) { HITS = []; drawSettings(); }
    g.restore();
  } catch (e) { if (ERRS.length < 50) ERRS.push(String(e && e.stack || e)); console.error(e); try { g.restore(); } catch (e2) {} }
  try { musicTick(); } catch (e) {}
  requestAnimationFrame(frame);
}
function boot() { layout(); RT.scene = 'title'; MUS.want = 'theme'; requestAnimationFrame(frame); }
if (document.fonts && document.fonts.load) Promise.all(['Anton', 'Oswald', 'Special Elite', 'Permanent Marker', 'Bebas Neue'].map(f => document.fonts.load(`20px "${f}"`))).then(boot, boot); else boot();

// app icon drawn in code (Kayleigh in her fedora + a hog coin)
function iconURL(n) {
  const c = document.createElement('canvas'); c.width = c.height = n; const old = g; g = c.getContext('2d'); g.lineJoin = g.lineCap = 'round';
  const k = n / 128; g.scale(k, k);
  const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, '#1b2a5c'); gr.addColorStop(1, '#070a18'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  g.fillStyle = 'rgba(80,140,255,.22)'; g.beginPath(); g.arc(64, 58, 50, 0, 7); g.fill();
  g.save(); g.translate(58, 76); g.scale(.82, .82); g.rotate(-.05); kayleighHead({ fedora: true, rim: RIM_O }); g.restore();
  pigCoin(100, 100, 17, -.2);
  g = old; return c.toDataURL('image/png');
}
