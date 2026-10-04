/* ===================== AUDIO: WebAudio synth, SFX ===================== */
let AC = null, master, musicBus, sfxBus, noiseBuf, verb;
function audioInit() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
  try { AC = new Ctx(); } catch (e) { return; }
  master = AC.createGain(); const comp = AC.createDynamicsCompressor(); comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 4; comp.attack.value = .004; comp.release.value = .2; master.connect(comp); comp.connect(AC.destination);
  musicBus = AC.createGain(); musicBus.connect(master); sfxBus = AC.createGain(); sfxBus.connect(master);
  const n = AC.sampleRate * 2; noiseBuf = AC.createBuffer(1, n, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  // tiny room reverb for music (feedback delay)
  verb = AC.createDelay(); verb.delayTime.value = .11; const fb = AC.createGain(); fb.gain.value = .32; const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200; verb.connect(lp); lp.connect(fb); fb.connect(verb); const wet = AC.createGain(); wet.gain.value = .35; lp.connect(wet); wet.connect(musicBus);
  applyVol(); if (MUS.want) { const w = MUS.want; MUS.cur = null; music(w); }
}
function applyVol() { if (!AC) return; master.gain.value = SETTINGS.muted ? 0 : 1; musicBus.gain.value = SETTINGS.music * .42; sfxBus.gain.value = SETTINGS.sfx * .8; }
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function tone(t, f, dur, o = {}) {
  if (!AC) return; const bus = o.bus || sfxBus, gv = o.g ?? .2, a = o.a ?? .005, rel = o.rel ?? Math.min(.08, dur * .5);
  const os = AC.createOscillator(); os.type = o.type || 'sine'; os.frequency.setValueAtTime(f, t); if (o.f2) os.frequency.exponentialRampToValueAtTime(Math.max(20, o.f2), t + (o.gl || dur)); if (o.det) os.detune.value = o.det;
  let node = os;
  if (o.vib) { const l = AC.createOscillator(), lg = AC.createGain(); l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1]; l.connect(lg); lg.connect(os.detune); l.start(t); l.stop(t + dur + rel + .05); }
  if (o.filt) { const fl = AC.createBiquadFilter(); fl.type = o.filt; fl.frequency.setValueAtTime(o.ff || 1000, t); if (o.ff2) fl.frequency.exponentialRampToValueAtTime(o.ff2, t + (o.ffT || dur)); fl.Q.value = o.q || 1; node.connect(fl); node = fl; }
  const gn = AC.createGain(); gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(gv, t + a);
  if (o.sus) { gn.gain.setValueAtTime(gv, t + dur); gn.gain.linearRampToValueAtTime(0, t + dur + rel); } else gn.gain.exponentialRampToValueAtTime(.0008, t + dur + rel);
  node.connect(gn); gn.connect(bus); if (o.wet && verb) gn.connect(verb); os.start(t); os.stop(t + dur + rel + .05);
}
function noiz(t, dur, o = {}) {
  if (!AC) return; const bus = o.bus || sfxBus, gv = o.g ?? .2, a = o.a ?? .002;
  const s = AC.createBufferSource(); s.buffer = noiseBuf; s.loop = true; const fl = AC.createBiquadFilter(); fl.type = o.type || 'bandpass'; fl.frequency.setValueAtTime(o.f || 2000, t); if (o.f2) fl.frequency.exponentialRampToValueAtTime(o.f2, t + dur); fl.Q.value = o.q || 1;
  const gn = AC.createGain(); gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(gv, t + a); gn.gain.exponentialRampToValueAtTime(.0008, t + dur);
  s.connect(fl); fl.connect(gn); gn.connect(bus); s.start(t, Math.random()); s.stop(t + dur + .05);
}
const SFX = {
  tap() { const t = AC.currentTime; tone(t, 900, .04, { type: 'triangle', f2: 420, g: .16 }); },
  blip() { const t = AC.currentTime; tone(t, 620 + Math.random() * 80, .03, { type: 'square', g: .03, filt: 'lowpass', ff: 2000 }); },
  page() { const t = AC.currentTime; noiz(t, .16, { f: 1800, f2: 5000, q: .8, g: .12, a: .03 }); },
  clue() { const t = AC.currentTime; [72, 76, 79, 84].forEach((m, i) => tone(t + i * .06, mtof(m), .22, { type: 'triangle', g: .12 })); },
  coin() { const t = AC.currentTime; tone(t, 1568, .07, { type: 'square', g: .04, filt: 'lowpass', ff: 6000 }); tone(t + .05, 2350, .25, { g: .1 }); },
  correct() { const t = AC.currentTime; tone(t, mtof(76), .1, { type: 'triangle', g: .14 }); tone(t + .09, mtof(83), .3, { type: 'triangle', g: .14 }); },
  wrong() { const t = AC.currentTime; tone(t, 180, .25, { type: 'sawtooth', f2: 120, g: .1, filt: 'lowpass', ff: 900 }); },
  punch() { const t = AC.currentTime; tone(t, 160, .14, { f2: 50, g: .5 }); noiz(t, .1, { type: 'lowpass', f: 1800, g: .4 }); },
  slap() { const t = AC.currentTime; noiz(t, .09, { type: 'highpass', f: 1800, g: .5 }); tone(t, 300, .05, { f2: 120, g: .2 }); },
  thud() { const t = AC.currentTime; tone(t, 90, .3, { f2: 40, g: .5 }); noiz(t, .12, { type: 'lowpass', f: 600, g: .3 }); },
  kiss() { const t = AC.currentTime; tone(t, 1400, .06, { f2: 2400, g: .12 }); noiz(t + .05, .03, { f: 4000, g: .1 }); },
  bark() { const t = AC.currentTime; for (const d of [0, .22]) { tone(t + d, 420, .12, { type: 'sawtooth', f2: 260, g: .14, filt: 'bandpass', ff: 900, q: 2 }); noiz(t + d, .1, { f: 1200, g: .12 }); } },
  sniff() { const t = AC.currentTime; for (let i = 0; i < 4; i++) noiz(t + i * .12, .07, { f: 3200, q: 3, g: .14 }); },
  bs() { const t = AC.currentTime; tone(t, 110, .5, { type: 'sawtooth', g: .18, filt: 'lowpass', ff: 1800 }); tone(t, 165, .5, { type: 'sawtooth', g: .14, filt: 'lowpass', ff: 1800 }); noiz(t, .25, { type: 'lowpass', f: 900, g: .3 }); tone(t + .02, 70, .3, { f2: 40, g: .5 }); },
  win() { const t = AC.currentTime; [67, 72, 76, 79, 84].forEach((m, i) => { tone(t + i * .08, mtof(m), .3, { type: 'square', g: .06, filt: 'lowpass', ff: 3000 }); tone(t + i * .08, mtof(m), .4, { type: 'triangle', g: .1 }); }); },
  lose() { const t = AC.currentTime; [64, 63, 62, 61].forEach((m, i) => tone(t + i * .22, mtof(m - 12), .3, { type: 'sawtooth', g: .1, filt: 'lowpass', ff: 900, vib: [6, 20] })); },
  gun() { const t = AC.currentTime; noiz(t, .35, { type: 'lowpass', f: 4000, f2: 300, g: .6 }); tone(t, 140, .2, { f2: 40, g: .6 }); },
  crash() { const t = AC.currentTime; noiz(t, .5, { type: 'lowpass', f: 2500, f2: 200, g: .5 }); tone(t, 80, .3, { f2: 35, g: .5 }); },
  swish() { const t = AC.currentTime; noiz(t, .14, { f: 600, f2: 3000, q: 2, g: .1, a: .03 }); },
  hit() { const t = AC.currentTime; tone(t, mtof(84), .08, { type: 'triangle', g: .12 }); noiz(t, .04, { f: 5000, g: .06 }); },
  jet() { const t = AC.currentTime; noiz(t, 2.2, { type: 'bandpass', f: 300, f2: 2400, q: .6, g: .25, a: .6 }); },
};
function sfx(k) { if (!AC || SETTINGS.muted || !SFX[k]) return; try { SFX[k](); } catch (e) {} }
function shake(n) { if (SETTINGS.shake) RT.shake = Math.max(RT.shake, n); if (navigator.vibrate && n >= 8) try { navigator.vibrate(30); } catch (e) {} }
