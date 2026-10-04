/* ===================== ORIGINAL PROCEDURAL MUSIC (all melodies generated from seeds; nothing copied) ===================== */
// chord = [rootMidi, quality] ; qualities: m7, 7, maj7, m, M, dim, sus
const QUAL = { m7: [0, 3, 7, 10], '7': [0, 4, 7, 10], maj7: [0, 4, 7, 11], m: [0, 3, 7, 12], M: [0, 4, 7, 12], dim: [0, 3, 6, 9], sus: [0, 5, 7, 10], m6: [0, 3, 7, 9] };
const TRACKS = {
  theme: { bpm: 112, swing: .62, prog: [[50, 'm7'], [50, 'm7'], [55, '7'], [55, '7'], [46, 'maj7'], [45, '7'], [50, 'm6'], [45, '7']], bass: 'walk', drums: 'brush', lead: 'trumpet', pad: 'vibes', seed: 1111, dens: .55 },
  noir: { bpm: 76, swing: .6, prog: [[45, 'm7'], [45, 'm7'], [50, 'm7'], [52, '7'], [45, 'm7'], [41, 'maj7'], [47, 'dim'], [52, '7']], bass: 'walk', drums: 'brush', lead: 'piano', pad: 'strings', seed: 2626, dens: .38 },
  interro: { bpm: 96, swing: .5, prog: [[40, 'm'], [40, 'm'], [41, 'M'], [40, 'm'], [40, 'm'], [43, 'M'], [41, 'M'], [39, 'dim']], bass: 'pulse', drums: 'tick', lead: 'bell', pad: 'drone', seed: 3141, dens: .22 },
  chase: { bpm: 158, swing: .5, prog: [[52, 'm'], [52, 'm'], [48, 'M'], [50, 'M'], [52, 'm'], [52, 'm'], [57, 'm'], [47, '7']], bass: 'root8', drums: 'rock', lead: 'surf', pad: 'none', seed: 4242, dens: .62 },
  dance: { bpm: 104, swing: .5, prog: [[45, 'm'], [45, 'm'], [52, '7'], [52, '7'], [50, 'm'], [45, 'm'], [52, '7'], [45, 'm']], bass: 'tango', drums: 'tango', lead: 'accordion', pad: 'none', seed: 5150, dens: .6 },
  gigi: { bpm: 92, swing: .5, prog: [[53, 'maj7'], [58, 'maj7'], [53, 'maj7'], [48, '7'], [53, 'maj7'], [50, 'm7'], [55, 'm7'], [48, '7']], bass: 'waltz', drums: 'none', lead: 'musicbox', pad: 'vibes', seed: 6006, dens: .5, beats: 3 },
  travel: { bpm: 124, swing: .5, prog: [[50, 'maj7'], [55, '7'], [50, 'maj7'], [47, 'm7'], [52, 'm7'], [45, '7'], [50, 'maj7'], [45, '7']], bass: 'bossa', drums: 'bossa', lead: 'flute', pad: 'vibes', seed: 7070, dens: .5 },
  tension: { bpm: 84, swing: .5, prog: [[38, 'm'], [38, 'm'], [39, 'M'], [38, 'm']], bass: 'heart', drums: 'none', lead: 'bell', pad: 'drone', seed: 8080, dens: .15 },
  victory: { bpm: 132, swing: .5, prog: [[48, 'M'], [53, 'M'], [55, 'M'], [48, 'M'], [45, 'm'], [53, 'M'], [55, '7'], [48, 'M']], bass: 'march', drums: 'march', lead: 'brass', pad: 'organ', seed: 9999, dens: .7 },
};
const MUS = { cur: null, want: null, step: 0, next: 0, mel: {} };
function music(id) { MUS.want = id; if (!AC) return; if (MUS.cur === id) return; MUS.cur = id; MUS.step = 0; MUS.next = AC.currentTime + .08; if (!MUS.mel[id]) MUS.mel[id] = composeMelody(TRACKS[id]); }
// seeded melody: 2-bar motif + answer phrase, chord-tone-aware random walk. 16 steps/bar.
function composeMelody(T) {
  let s = T.seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; const bars = T.prog.length, spb = T.beats === 3 ? 12 : 16; const out = new Array(bars * spb).fill(null);
  const scale = T.prog[0][1].startsWith('m') ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11]; const key = T.prog[0][0] % 12;
  const motif = []; let deg = 4; for (let i = 0; i < spb * 2; i++) { const strong = i % 4 === 0; if (r() < T.dens * (strong ? 1.4 : .7)) { deg = clamp(deg + Math.round((r() - .5) * 4), 0, 11); motif.push({ deg, len: r() < .3 ? 4 : r() < .5 ? 2 : 1 }); } else motif.push(null); }
  for (let b = 0; b < bars; b++) for (let i = 0; i < spb; i++) { const m = motif[(b % 2) * spb + i]; if (!m) continue; let d = m.deg + (b >= bars / 2 && b % 2 ? (b % 4 === 3 ? -2 : 1) : 0); const oct = Math.floor(d / 7), sd = ((d % 7) + 7) % 7;
    let note = 72 + key + scale[sd] + oct * 12 - 12; const ch = T.prog[b]; const tones = QUAL[ch[1]].map(x => (ch[0] + x) % 12); if (i % 4 === 0 && !tones.includes(note % 12)) { let best = note, bd = 9; for (const tn of tones) for (const o of [-12, 0, 12]) { const c = note - (note % 12) + tn + o; if (Math.abs(c - note) < bd) { bd = Math.abs(c - note); best = c; } } note = best; }
    out[b * spb + i] = { n: note, len: m.len }; }
  if (bars >= 4) out[bars * spb - spb] = { n: 72 + key - 12, len: 8 };
  return out;
}
function musicTick() {
  if (!AC || !MUS.cur || SETTINGS.music <= 0 || SETTINGS.muted) { if (AC) MUS.next = AC.currentTime + .05; return; }
  const T = TRACKS[MUS.cur], spb = T.beats === 3 ? 12 : 16, sd = 60 / T.bpm / 4, total = T.prog.length * spb, mel = MUS.mel[MUS.cur];
  while (MUS.next < AC.currentTime + .25) {
    const st = MUS.step % total, bar = Math.floor(st / spb), i = st % spb, ch = T.prog[bar], q = QUAL[ch[1]];
    let t = MUS.next; if (i % 2 === 1) t += sd * (T.swing - .5) * 2;
    playStep(T, t, i, bar, ch, q, sd, mel[st], spb);
    MUS.step++; MUS.next += sd;
  }
}
function playStep(T, t, i, bar, ch, q, sd, m, spb) {
  const B = musicBus, r = ch[0] - 12, beat = i % 4 === 0, bn = Math.floor(i / 4);
  // bass
  if (T.bass === 'walk' && beat) { const w = [0, q[1], q[2], bn === 3 ? 11 : q[3] % 12]; tone(t, mtof(r + w[bn]), sd * 3.6, { type: 'triangle', g: .3, bus: B, filt: 'lowpass', ff: 600 }); }
  if (T.bass === 'pulse' && i % 2 === 0) tone(t, mtof(r), sd * 1.5, { type: 'sawtooth', g: .12, bus: B, filt: 'lowpass', ff: 300 });
  if (T.bass === 'root8' && i % 2 === 0) tone(t, mtof(r + (i % 8 === 6 ? 7 : 0)), sd * 1.6, { type: 'sawtooth', g: .14, bus: B, filt: 'lowpass', ff: 700 });
  if (T.bass === 'tango' && [0, 3, 4, 6, 8, 11, 12, 14].includes(i)) tone(t, mtof(r + ([0, 4, 8, 12].includes(i) ? 0 : 7)), sd * 1.8, { type: 'triangle', g: .3, bus: B, filt: 'lowpass', ff: 700 });
  if (T.bass === 'waltz' && i % 4 === 0) { if (i === 0) tone(t, mtof(r), sd * 3, { type: 'triangle', g: .26, bus: B }); else q.slice(1, 3).forEach(x => tone(t, mtof(r + 12 + x), sd * 2, { type: 'sine', g: .06, bus: B })); }
  if (T.bass === 'bossa' && [0, 6, 8, 14].includes(i)) tone(t, mtof(r + (i >= 8 ? 7 : 0)), sd * 2.5, { type: 'triangle', g: .28, bus: B, filt: 'lowpass', ff: 600 });
  if (T.bass === 'heart' && (i === 0 || i === 3)) tone(t, 55, .18, { f2: 40, g: .35, bus: B });
  if (T.bass === 'march' && beat) tone(t, mtof(r + (bn % 2 ? 7 : 0)), sd * 2, { type: 'square', g: .1, bus: B, filt: 'lowpass', ff: 600 });
  // drums
  const D = T.drums;
  if (D === 'brush') { noiz(t, sd * 1.4, { type: 'highpass', f: 5000, g: i % 2 ? .03 : .05, bus: B }); if (i === 4 || i === 12) noiz(t, .18, { f: 1800, q: .7, g: .06, bus: B }); if (i === 0) tone(t, 70, .2, { f2: 45, g: .2, bus: B }); }
  if (D === 'tick' && i % 2 === 0) noiz(t, .03, { type: 'highpass', f: 7000, g: .05, bus: B });
  if (D === 'rock') { if (i % 2 === 0) noiz(t, .04, { type: 'highpass', f: 8000, g: .05, bus: B }); if (i === 0 || i === 8 || i === 10) tone(t, 90, .14, { f2: 45, g: .4, bus: B }); if (i === 4 || i === 12) { noiz(t, .14, { f: 1800, q: .6, g: .2, bus: B }); tone(t, 200, .07, { f2: 140, g: .1, bus: B }); } }
  if (D === 'tango' && [0, 3, 4, 6, 8, 12].includes(i)) noiz(t, .06, { f: i % 4 ? 2500 : 900, q: 1, g: .1, bus: B });
  if (D === 'bossa') { if (i % 2 === 0) noiz(t, .03, { type: 'highpass', f: 7000, g: .035, bus: B }); if ([0, 3, 6, 10, 12].includes(i)) noiz(t, .04, { f: 2800, q: 4, g: .07, bus: B }); }
  if (D === 'march') { if (beat) tone(t, 70, .2, { f2: 40, g: .35, bus: B }); if (i % 2 === 0) noiz(t, .07, { f: 2000, q: .7, g: i % 4 ? .05 : .12, bus: B }); }
  // pad / comp
  if (i === 0 || (T.pad === 'vibes' && i === 8)) { const P = T.pad, notes = q.map(x => ch[0] + 12 + x);
    if (P === 'vibes') notes.forEach(n => tone(t, mtof(n), sd * 6, { type: 'sine', g: .045, bus: B, vib: [5, 8], wet: 1 }));
    if (P === 'strings') notes.forEach(n => tone(t, mtof(n), sd * 15, { type: 'sawtooth', g: .02, bus: B, filt: 'lowpass', ff: 1200, a: .4, sus: 1, rel: .4, wet: 1 }));
    if (P === 'drone') tone(t, mtof(ch[0]), sd * 16, { type: 'sawtooth', g: .035, bus: B, filt: 'lowpass', ff: 500, a: .6, sus: 1, rel: .5, wet: 1 });
    if (P === 'organ') notes.forEach(n => tone(t, mtof(n), sd * 8, { type: 'square', g: .018, bus: B, filt: 'lowpass', ff: 1600, a: .02, sus: 1, rel: .2 })); }
  if (T.lead === 'accordion' && (i === 4 || i === 12)) q.slice(0, 3).forEach(x => tone(t, mtof(ch[0] + 12 + x), sd * 1.5, { type: 'sawtooth', g: .025, bus: B, filt: 'lowpass', ff: 1800 }));
  // lead
  if (m) { const L_ = T.lead, d = sd * m.len * .95;
    if (L_ === 'trumpet') tone(t, mtof(m.n), d, { type: 'square', g: .06, bus: B, filt: 'lowpass', ff: 1600, a: .02, vib: [5.5, 12], wet: 1 });
    else if (L_ === 'piano') { tone(t, mtof(m.n), d + .4, { type: 'triangle', g: .1, bus: B, wet: 1 }); tone(t, mtof(m.n + 12), d, { type: 'sine', g: .03, bus: B }); }
    else if (L_ === 'bell') tone(t, mtof(m.n + 12), .9, { type: 'sine', g: .06, bus: B, wet: 1 });
    else if (L_ === 'surf') tone(t, mtof(m.n - 12), d, { type: 'sawtooth', g: .05, bus: B, filt: 'lowpass', ff: 2200, vib: [7, 18], wet: 1 });
    else if (L_ === 'accordion') { tone(t, mtof(m.n), d, { type: 'sawtooth', g: .045, bus: B, filt: 'lowpass', ff: 2400, vib: [6, 10] }); tone(t, mtof(m.n), d, { type: 'square', g: .02, bus: B, det: 8, filt: 'lowpass', ff: 2000 }); }
    else if (L_ === 'musicbox') tone(t, mtof(m.n + 12), .6, { type: 'sine', g: .07, bus: B, wet: 1 });
    else if (L_ === 'flute') tone(t, mtof(m.n), d, { type: 'sine', g: .08, bus: B, vib: [5, 10], a: .03, wet: 1 });
    else if (L_ === 'brass') { tone(t, mtof(m.n), d, { type: 'sawtooth', g: .045, bus: B, filt: 'lowpass', ff: 2000, a: .02 }); tone(t, mtof(m.n - 5), d, { type: 'sawtooth', g: .025, bus: B, filt: 'lowpass', ff: 1500, a: .02 }); } }
}
