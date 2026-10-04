/* ===================== INTERROGATION ===================== */
const APPROACH = {
  beat: { lab: 'BEAT IT OUT', short: 'BEAT IT OUT', ic: '👊', col: '#b8402a' },
  bribe: { lab: 'BRIBE', ic: '💰', col: '#3a8a3a' },
  bluff: { lab: 'BLUFF', ic: '🃏', col: '#7a3aa8' },
  threaten: { lab: 'THREATEN', ic: '🔪', col: '#8a2a4a' },
  sweet: { lab: 'SWEET-TALK', short: 'SWEET TALK', ic: '💋', col: '#c0407a' },
  cocoa: { lab: 'SEND IN COCOA', short: 'COCOA', ic: '🐾', col: '#8a5a2a' },
  kambree: { lab: 'UNLEASH KAMBREE', short: 'KAMBREE!', ic: '😾', col: '#d0306a' },
};
const KQ = {
  beat: [V('Again. Do it again. I\'m filming it for my vision board.', 'Again. I\'m filming it for my vision board.'), V('Hit him in the face, Kay, not the soul. Okay, both.', 'Hit him in the face, Kay, not the soul. Okay, both.'), V('Oh my God, that was so hot. Sister goals. Do the other cheek.', 'Oh my God. Sister goals. Do the other cheek.')],
  bribe: [V('Paying a scumbag. Very on brand for Arkansas politics.', 'Paying a scumbag. Very on brand.'), V('If he takes that, I get to take his kidneys. Deal?', 'If he takes that, I get his lunch money. Deal?')],
  bluff: [V('She\'s lying. I can tell because her lips are moving and she\'s my sister.', 'She\'s lying. Her lips are moving and she\'s my sister.'), V('Wow. Poker face of a golden retriever. Nailed it.', 'Poker face of a golden retriever. Nailed it.')],
  threaten: [V('Tell him about the woodchipper, Kay. No, the OTHER woodchipper.', 'Tell him about the woodchipper. No, the OTHER one.'), V('I have a Hello Kitty taser and zero chill. Choose wisely, shitbird.', 'I have a Hello Kitty taser and zero chill. Choose wisely.')],
  sweet: [V('Ew. Flirting. I just threw up in my own mouth and swallowed it for the case.', 'Ew. Flirting. I just threw up a little for the case.'), V('This is the worst thing I\'ve ever witnessed and I\'ve worked in Little Rock.', 'Worst thing I\'ve witnessed, and I\'ve worked in Little Rock.')],
  cocoa: [V('Cocoa\'s doing more police work than the entire Miami field office.', 'Cocoa\'s doing more police work than the Miami field office.')],
  bs: [V('BOOM. Joined at the hip, Kay. Siamese twins of SHUT THE HELL UP.', 'BOOM. Joined at the hip, Kay. Siamese twins of SHUT IT.'), V('Caught lying. In front of me. In MY outfit? Unforgivable.', 'Caught lying. In front of me. Unforgivable.')],
  wrongbs: [V('That proves nothing, genius. That\'s a receipt for nachos.', 'That proves nothing, genius.'), V('Kay. Babe. Sweetie. That\'s not evidence, that\'s litter.', 'Kay. Babe. That\'s not evidence, that\'s litter.')],
};
function interroStart(step, onDone) {
  const D = INTERRO[step.id]; RT.int = { D, step, onDone, truth: 0, tension: D.tension0 || 10, li: 0, turn: 0, say: { who: D.who, text: D.lines[0].s }, quip: null, used: {}, menu: null, stamp: 0, hit: 0, ex: null, end: null, t: 0, scroll: 0 };
  RT.scene = 'interro'; music(D.music || 'interro');
}
function intCur() { const I = RT.int; return I.D.lines[I.li % I.D.lines.length]; }
function intAdvance() { const I = RT.int; I.li++; I.turn++; }
function intAct(kind, arg) {
  const I = RT.int, D = I.D, P = D.prof, cur = intCur(); if (I.end) return;
  let dt = 0, dx = 0, txt_ = null, ex = null, kq = null;
  const r = D.r || {};
  if (kind === 'beat') { dt = 12 + (5 - P.nerve) * 4; dx = 24; txt_ = r.beat; ex = 'scared'; bumpHeat(1); bumpFBI(-3); sfx('punch'); shake(10); I.hit = 1; RT.parts.length < 60 && burst(L.portrait ? L.W * .72 : L.W * .38, L.portrait ? 160 : 150, SETTINGS.toned ? 6 : 14, SETTINGS.toned ? ['#fff', '#ffd23a'] : ['#c0102a', '#8a0a14', '#fff'], { kind: SETTINGS.toned ? 'dot' : 'blood' }); kq = pick(KQ.beat); }
  else if (kind === 'bribe') { if (arg === 'cash') { if (GS.cash < 500) { toast('Not enough cash.', '#ff9a9a'); return; } GS.cash -= 500; dt = 10 + P.greed * 5; dx = -6; txt_ = r.bribe; ex = 'smug'; } else { const it = ITEMS[arg]; GS.bag.splice(GS.bag.indexOf(arg), 1); const good = (D.likes || []).some(t => it.tags.includes(t)); dt = good ? 45 : 12 + P.greed * 2; dx = -10; txt_ = good ? (r.bribeGood || r.bribe) : (r.bribeMeh || r.bribe); ex = good ? 'grin' : 'smug'; if (good) toast('THEY LOVE IT. ' + it.name, '#7aff9a'); } sfx('coin'); kq = pick(KQ.bribe); I.menu = null; }
  else if (kind === 'bluff') { const hasKey = (D.lines.some(l => l.lie && GS.clues.includes(l.lie))); const ch = .45 + (5 - P.nerve) * .07 + (hasKey ? .2 : 0); if (grnd() < ch) { dt = 26; dx = 6; txt_ = r.bluff; ex = 'scared'; sfx('correct'); } else { dt = 0; dx = 22; txt_ = r.bluffBad || 'Nice try, sweetheart. I wasn\'t born yesterday. I was born in a casino.'; ex = 'smug'; sfx('wrong'); } kq = pick(KQ.bluff); }
  else if (kind === 'threaten') { dt = P.fear * 7; dx = 20; txt_ = r.threaten; ex = 'scared'; bumpHeat(1); sfx('thud'); kq = pick(KQ.threaten); }
  else if (kind === 'sweet') { dt = P.vanity * 6; dx = -14; txt_ = r.sweet; ex = 'smile'; GS.hours = Math.max(0, GS.hours - 2); sfx('kiss'); kq = pick(KQ.sweet); }
  else if (kind === 'cocoa') { dt = 18; dx = -8; txt_ = r.cocoa || 'Is... is that dog judging me? Okay. OKAY. Fine.'; ex = 'sad'; I.used.cocoa = 1; sfx('bark'); kq = GS.party.kambree ? pick(KQ.cocoa) : null; }
  else if (kind === 'kambree') { dt = 30; dx = 28; txt_ = r.kambree; ex = 'scared'; I.used.kambree = 1; bumpHeat(1); bumpFBI(-2); sfx('slap'); shake(12); I.kamb = 1.4; }
  else if (kind === 'present') { const ok = cur.lie && cur.lie === arg; if (ok) { dt = 36; dx = -6; txt_ = cur.bs || r.caught || 'Okay... okay, maybe that\'s not exactly what happened.'; ex = 'scared'; I.stamp = 1.2; sfx('bs'); shake(8); kq = pick(KQ.bs); } else { dt = -4; dx = 15; txt_ = r.wrongbs || 'And? What\'s that supposed to prove?'; ex = 'smug'; sfx('wrong'); kq = pick(KQ.wrongbs); } }
  I.truth = clamp(I.truth + dt, 0, 100); I.tension = clamp(I.tension + dx, 0, 100); I.ex = ex;
  I.say = { who: D.who, text: txt_ || '...' }; I.quip = GS.party.kambree && kq && kind !== 'kambree' ? kq : null;
  if (kind === 'kambree') I.say2 = { who: 'kambree', text: r.kambreeDo || pick(KAMBREE_DO) }; else I.say2 = null;
  intAdvance(); I.pending = true;
  if (I.truth >= 100) intEnd('confess'); else if (I.tension >= 100) intEnd('clam'); else if (I.turn >= (D.maxTurns || 9)) intEnd(I.truth >= 55 ? 'confess' : 'clam');
}
const KAMBREE_DO = [V('Kambree flips the table, sits on it, and calmly removes one of his shoes. "Talk, or this goes somewhere you won\'t like."', 'Kambree flips the table, sits on it, and removes one of his shoes. "Talk, or this shoe goes in the ocean."'), V('Kambree slaps him with a laminated Hello Kitty calendar. "Every day you don\'t talk is a day I get to do this."', 'Kambree bonks him with a laminated Hello Kitty calendar. "Every day you don\'t talk, I do this."'), V('Kambree leans in so close he can smell her strawberry lip gloss. "I will skin you like a grape, bitch."', 'Kambree leans in, strawberry lip gloss and pure menace. "I will peel you like a grape."')];
function intEnd(res) { const I = RT.int; I.end = res; I.endT = 0; GS.flags['int_' + I.D.id] = res; if (res === 'confess') { sfx('win'); I.ex = 'sad'; if (I.D.reward) storyApplyQuiet(I.D.reward); } else { sfx('lose'); I.ex = 'shout'; bumpFBI(-4); } GS.suspects[I.D.who] = res === 'confess' ? 'cracked' : 'lawyered'; }
function storyApplyQuiet(d) { if (d.clue) addClue(d.clue); if (d.item) addItem(d.item); if (d.set) Object.assign(GS.flags, d.set); }
function intNext() { const I = RT.int; I.pending = false; I.say = { who: I.D.who, text: intCur().s }; I.quip = null; I.say2 = null; }
function drawInterro() {
  const I = RT.int, D = I.D, W = L.W, H = L.H; I.t += DT; I.stamp = Math.max(0, I.stamp - DT); I.hit = Math.max(0, I.hit - DT * 3); I.kamb = Math.max(0, (I.kamb || 0) - DT);
  let st, p;
  if (L.portrait) { const ph = clamp(H - 300, 350, 470); p = { x: 6, y: H - ph - 6, w: W - 12, h: ph }; st = { x: 0, y: 44, w: W, h: p.y - 48 }; }
  else { const pw = clamp(W * .54, 360, 500); p = { x: W - pw - 6, y: 46, w: pw, h: H - 52 }; st = { x: 0, y: 44, w: p.x - 4, h: H - 44 }; }
  drawBG(D.bg || 'interro', W, H);
  if (I.hit > 0) { g.save(); g.globalAlpha = I.hit * .35; g.fillStyle = SETTINGS.toned ? '#fff' : '#c0102a'; g.fillRect(st.x, st.y, st.w, st.h); g.restore(); }
  const left = [{ id: 'kay', ex: I.end === 'confess' ? 'grin' : I.end ? 'angry' : 'smirk', badge: !!GS.flags.sworn }]; if (GS.party.kambree) left.push({ id: 'kambree', ex: I.end === 'confess' ? 'grin' : 'angry' });
  const sus = { id: D.who, ex: I.ex || (I.tension > 70 ? 'angry' : I.truth > 60 ? 'scared' : undefined) };
  // suspect large on right, team smaller on left
  const n = left.length, sS = Math.min(1.12, (st.h - 4) / 318, st.w / (n > 1 ? 560 : 420)) * (D.who === 'hawke' ? .85 : 1), tS = sS * .82, by = st.y + st.h;
  const sx = st.x + st.w * (n > 1 ? .76 : .7) + (I.hit > 0 ? Math.sin(RT.t * 80) * 6 : 0);
  left.forEach((c, i) => { const x = st.x + st.w * (n > 1 ? [.17, .42][i] : .27) + (c.id === 'kambree' && I.kamb > 0 ? Math.sin(RT.t * 30) * 4 + 14 : 0); g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); E(x, by - 2, 70 * tS, 9 * tS); g.fill(); g.restore(); drawCast(c.id, x, by + Math.sin(RT.t * 1.5 + i) * 1.2, tS, c); });
  g.save(); g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); E(sx, by - 2, 90 * sS, 11 * sS); g.fill(); g.restore();
  drawCast(D.who, sx, by + Math.sin(RT.t * 1.3) * 1.2, sS, sus);
  if (I.stamp > 0) { g.save(); g.translate(sx, st.y + st.h * .25); g.rotate(-.2); const k = 1 + Math.max(0, I.stamp - .9) * 3; g.scale(k, k); g.globalAlpha = clamp(I.stamp * 2, 0, 1); rr(-70, -26, 140, 52, 8, 'rgba(255,255,255,.1)', '#ff2a3a', 5); txt('BS!', 0, 2, fa(40), '#ff2a3a', null); g.restore(); }
  // panel
  panel(p.x, p.y, p.w, p.h, { edge: CAST[D.who].col, lw: 2 });
  let y = p.y + 8; const nm = CAST[D.who].name; txt(nm, p.x + 12, y + 9, fa(14), CAST[D.who].col, null, 0, 'left'); txt('TURN ' + Math.min(I.turn + 1, D.maxTurns || 9) + '/' + (D.maxTurns || 9), p.x + p.w - 12, y + 9, fo(10, 600), '#8a98c8', null, 0, 'right'); y += 20;
  const lie = !I.pending && intCur().lie;
  const dh = L.portrait ? 86 : 70; rr(p.x + 8, y, p.w - 16, dh, 8, 'rgba(255,255,255,.06)', lie ? 'rgba(255,90,90,.6)' : 'rgba(255,255,255,.12)', 1.2);
  const lines = []; lines.push({ t: (I.say.who === D.who ? '“' + tx(I.say.text) + '”' : tx(I.say.text)), c: '#fff' }); if (I.say2) lines.push({ t: tx(I.say2.text), c: '#ffb0d8' }); if (I.quip) lines.push({ t: 'KAMBREE: ' + tx(I.quip), c: '#ff8ac8' });
  const full = lines.map(l => l.t).join('\n'); let px = 14.5, wl; for (; px > 9.5; px -= .5) { wl = lines.map(l => wrapLines(l.t, p.w - 36, fo(px, 500))); if (wl.flat().length * px * 1.28 <= dh - 12) break; }
  let yy = y + 7; g.save(); g.textBaseline = 'top'; g.font = fo(px, 500); wl.forEach((ls, i) => { g.fillStyle = lines[i].c; ls.forEach(l => { g.fillText(l, p.x + 18, yy); yy += px * 1.28; }); }); g.restore();
  if (lie && GS.flags.bsHint !== 2) txt('🚩 sounds shady', p.x + p.w - 16, y + dh - 10, fo(10, 600), '#ff8a8a', null, 0, 'right');
  y += dh + 8;
  // meters
  const mw = (p.w - 30) / 2; const meter = (mx, lab, v, col) => { txt(lab, mx, y + 6, fa(10.5), col, null, 0, 'left'); rr(mx, y + 14, mw, 12, 6, '#0a0e1c', '#2b3c70', 1); if (v > 1) rr(mx + 1, y + 15, (mw - 2) * v / 100, 10, 5, col); };
  meter(p.x + 10, 'TRUTH', I.truth, '#5fe3ff'); meter(p.x + 20 + mw, 'TENSION' + (I.tension > 75 ? ' · CALLING A LAWYER!' : ''), I.tension, I.tension > 75 ? '#ff3a3a' : '#ff8a3a'); y += 34;
  if (I.end) { drawIntEnd(p, y); drawHUD(); return; }
  if (I.pending) { btn('int_cont', p.x + 10, y + 4, p.w - 20, 44, 'NEXT QUESTION ▸', intNext, { col: '#2b3c70' }); y += 56; addHit('int_tapnext', st.x, st.y, st.w, st.h, intNext); }
  else {
    const acts = ['beat', 'bribe', 'bluff', 'threaten', 'sweet']; if (GS.party.cocoa) acts.push('cocoa'); if (GS.party.kambree) acts.push('kambree');
    const cols = L.portrait ? 3 : 4, gap = 6, bw = (p.w - 20 - gap * (cols - 1)) / cols, rows = Math.ceil(acts.length / cols), bh = L.portrait ? 40 : 34;
    acts.forEach((k, i) => { const a = APPROACH[k], bx = p.x + 10 + (i % cols) * (bw + gap), by2 = y + Math.floor(i / cols) * (bh + gap); const used = (k === 'cocoa' || k === 'kambree') && I.used[k];
      btn('ap_' + k, bx, by2, bw, bh, a.short || a.lab, () => k === 'bribe' ? (I.menu = 'bribe') : intAct(k), { col: a.col, icon: a.ic, px: 12.5, disabled: used, why: 'Once per interrogation.' }); });
    y += rows * (bh + gap) + 2;
  }
  // evidence tray: tap to present
  const th = p.y + p.h - y - 6; if (th > 40) {
    txt(I.pending ? 'EVIDENCE' : 'EVIDENCE · TAP TO CALL BS', p.x + 12, y + 7, fa(10.5), '#ffd23a', null, 0, 'left');
    const ev = intEvidence(), cw = 52, gap = 6, ty = y + 15, ch = Math.min(th - 18, 58), maxN = Math.floor((p.w - 20 + gap) / (cw + gap));
    if (!ev.length) txt('No evidence yet.', p.x + 12, ty + ch / 2, fo(11, 500), '#8a98c8', null, 0, 'left');
    ev.slice(I.scroll, I.scroll + maxN - (ev.length > maxN ? 1 : 0)).forEach((id, i) => { const cx = p.x + 10 + i * (cw + gap); rr(cx, ty, cw, ch, 6, '#f2ead8', '#8a7a5a', 1); clueIcon(CLUES[id].icon, cx + cw / 2, ty + ch * .42, Math.min(1, ch / 58)); fitTextLine(CLUES[id].short || CLUES[id].name, cx + cw / 2, ty + ch - 7, cw - 4, fo(8, 600), '#2a1a10', 'center');
      if (!I.pending) addHit('ev_' + id, cx, ty, cw, ch, () => intAct('present', id)); });
    if (ev.length > maxN) btn('ev_more', p.x + p.w - 10 - cw, ty, cw, ch, '▸', () => { I.scroll = (I.scroll + maxN - 1) >= ev.length ? 0 : I.scroll + maxN - 1; }, { col: '#3a4a7a' });
  }
  if (I.menu === 'bribe') drawBribeMenu();
  drawHUD();
}
function intEvidence() { const I = RT.int, D = I.D; const rel = D.lines.map(l => l.lie).filter(Boolean); const own = GS.clues.filter(c => CLUES[c]); const a = own.filter(c => rel.includes(c)), b = own.filter(c => !rel.includes(c)).reverse(); return a.concat(b).slice(0, 12).sort((x, y) => GS.clues.indexOf(y) - GS.clues.indexOf(x)); }
function drawBribeMenu() {
  const I = RT.int, W = L.W, H = L.H; g.save(); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, W, H); g.restore(); addHit('br_bg', 0, 0, W, H, () => I.menu = null);
  const items = [...new Set(GS.bag)], w = Math.min(W - 30, 380), h = Math.min(H - 60, 110 + (items.length + 1) * 50), x = (W - w) / 2, y = (H - h) / 2; panel(x, y, w, h, { edge: '#7aff9a' }); addHit('br_panel', x, y, w, h, () => {});
  txt('THE BAG', x + w / 2, y + 22, fa(18), '#7aff9a', INK, 3); txt('What they love: ' + tx(I.D.likesHint || '???'), x + w / 2, y + 44, fo(11, 600), '#cfe0ff', null);
  let by = y + 60; btn('br_cash', x + 12, by, w - 24, 42, 'CASH $500', () => intAct('bribe', 'cash'), { col: '#2a6a2a', icon: '💵', sub: 'You have ' + fmt$(GS.cash), disabled: GS.cash < 500, why: 'Not enough cash.' }); by += 50;
  items.forEach((id, i) => { if (by + 42 > y + h - 50) return; const it = ITEMS[id], cnt = GS.bag.filter(b => b === id).length; btn('br_' + id, x + 12, by, w - 24, 42, it.name + (cnt > 1 ? ' ×' + cnt : ''), () => intAct('bribe', id), { col: '#3a5a3a', icon: it.ic, sub: it.desc }); by += 50; });
  if (!items.length) txt('Your bag is empty. Grab valuables during chases & scenes.', x + w / 2, by + 10, fo(11, 500), '#8a98c8', null);
  btn('br_close', x + w / 2 - 70, y + h - 48, 140, 38, 'NEVERMIND', () => I.menu = null, { col: '#3a4a7a' });
}
function drawIntEnd(p, y) {
  const I = RT.int, D = I.D; I.endT += DT; const ok = I.end === 'confess';
  const lab = ok ? (D.fem ? 'SHE CRACKED' : 'HE CRACKED') : (D.fem ? 'SHE LAWYERED UP' : 'HE LAWYERED UP'); txt(D.who === 'hawke' ? (ok ? 'THEY CRACKED' : 'THEY LAWYERED UP') : lab, p.x + p.w / 2, y + 14, fa(22), ok ? '#7aff9a' : '#ff6a6a', INK, 4);
  const bh = 48, ah = p.y + p.h - y - 34 - bh - 10; rr(p.x + 10, y + 30, p.w - 20, ah, 8, 'rgba(255,255,255,.06)');
  fitText((ok ? '' : '') + tx(ok ? D.confess : (D.clam || 'I want my lawyer. And a sandwich. And for that woman to stop looking at me.')), p.x + 20, y + 38, p.w - 40, ah - 16, px => fo(px, 500), 15, ok ? '#fff' : '#ffd0d0');
  btn('int_done', p.x + 10, p.y + p.h - bh - 10, p.w - 20, bh, 'CONTINUE ▸', () => { const f = I.onDone; RT.int = null; f(I.end); }, { col: '#1a8a5a' });
}
