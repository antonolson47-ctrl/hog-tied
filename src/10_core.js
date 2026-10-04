/* ===================== CORE: utils, rng, settings, save, layout, sprite cache, hits ===================== */
const TAU = Math.PI * 2, PI = Math.PI;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t), easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; const R = (a, b) => a + rnd() * (b - a);
let gseed = (Date.now() % 2147483646) + 1; const grnd = () => (gseed = (gseed * 48271) % 2147483647) / 2147483647;
const gi = n => Math.floor(grnd() * n), pick = a => a[gi(a.length)];
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = gi(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const fmt$ = n => '$' + Math.round(n).toLocaleString('en-US');
const F = { anton: '"Anton", "Arial Black", Impact, sans-serif', osw: '"Oswald", "Arial Narrow", sans-serif', type: '"Special Elite", "Courier New", monospace', mark: '"Permanent Marker", "Comic Sans MS", cursive', bebas: '"Bebas Neue", "Anton", Impact, sans-serif' };
const fa = (px, w = 400) => `${w} ${px}px ${F.anton}`, fo = (px, w = 500) => `${w} ${px}px ${F.osw}`, ft = px => `400 ${px}px ${F.type}`, fm = px => `400 ${px}px ${F.mark}`, fb = px => `400 ${px}px ${F.bebas}`;

/* ---------- settings ---------- */
const SAVE_KEY = 'hog_tied_v1', SET_KEY = 'hog_tied_settings_v1';
const SETTINGS = Object.assign({ toned: false, music: .7, sfx: .85, muted: false, outfit: 'auto', adult: false, shake: true }, (() => { try { return JSON.parse(localStorage.getItem(SET_KEY)) || {}; } catch (e) { return {}; } })());
function saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(SETTINGS)); } catch (e) {} }
// V(full, toned): text that differs by the Toned Down toggle
const V = (r, c) => ({ r, c });
const SWEARS = [[/motherf\w*/gi, 'mother-trucker'], [/\bf+u+c+k+(ing|in'|er|ers|ed|s)?\b/gi, m => 'fudg' + (/ing|in'/i.test(m) ? 'ing' : /er/i.test(m) ? 'er' : /ed$/i.test(m) ? 'ed' : 'e')], [/\bshit(ty|s|show)?\b/gi, m => 'shoot' + (m.length > 4 ? m.slice(4).replace('ty', 'y') : '')], [/\bbullshit\b/gi, 'bull-honkey'], [/\bass(hole|holes|es)?\b/gi, m => 'butt' + (m.length > 3 ? (m.slice(3) === 'es' ? 's' : 'head' + (m.endsWith('s') ? 's' : '')) : '')], [/\bbitch(es|y|in')?\b/gi, 'witch'], [/\bdamn(ed|it)?\b/gi, 'dang'], [/\bdick(s|head)?\b/gi, 'jerk'], [/\bhell\b/gi, 'heck'], [/\bgoddamn\b/gi, 'gosh-dang'], [/\bpiss(ed)?\b/gi, m => m.length > 4 ? 'ticked' : 'tick'], [/\btits\b/gi, 'toots'], [/\bcock\b/gi, 'rooster'], [/\bbastard(s)?\b/gi, 'buzzard']];
const SWEAR_TEST = /\b(f+u+c+k\w*|motherf\w*|shit\w*|bullshit|ass|asshole\w*|bitch\w*|damn\w*|dick\w*|goddamn|piss\w*|bastard\w*|cock|tits)\b/i;
function clean(s) { if (!SETTINGS.toned) return s; for (const [re, rep] of SWEARS) s = s.replace(re, rep); return s; }
const tx = v => v == null ? '' : clean(typeof v === 'string' ? v : (SETTINGS.toned ? v.c : v.r));

/* ---------- canvas + layout ---------- */
const cv = document.getElementById('cv');
let g = cv.getContext('2d');
const L = { W: 390, H: 844, sc: 1, ox: 0, oy: 0, portrait: true, dpr: 1, safe: { t: 0, r: 0, b: 0, l: 0 } };
function readSafe() { const s = getComputedStyle(document.getElementById('safe')); L.safe = { t: parseFloat(s.paddingTop) || 0, r: parseFloat(s.paddingRight) || 0, b: parseFloat(s.paddingBottom) || 0, l: parseFloat(s.paddingLeft) || 0 }; }
function layout() {
  readSafe();
  const cw = window.innerWidth, ch = window.innerHeight;
  L.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  cv.width = Math.round(cw * L.dpr); cv.height = Math.round(ch * L.dpr);
  const uw = cw - L.safe.l - L.safe.r, uh = ch - L.safe.t - L.safe.b;
  L.portrait = uh >= uw;
  if (L.portrait) { L.W = 390; L.H = clamp(390 * uh / uw, 640, 900); } else { L.H = 390; L.W = clamp(390 * uw / uh, 640, 960); }
  L.sc = Math.min(uw / L.W, uh / L.H);
  L.ox = L.safe.l + (uw - L.W * L.sc) / 2; L.oy = L.safe.t + (uh - L.H * L.sc) / 2;
  L.cw = cw; L.ch = ch;
  SPR.clear();
}
const toV = (cx, cy) => [(cx - L.ox) / L.sc, (cy - L.oy) / L.sc];

/* ---------- sprite cache: render expensive art once per scale into offscreen canvases ---------- */
const SPR = new Map();
// draw fn in local coords; box = [x0, y0, w, h] in local units; drawn at (x,y) with scale s
function sprite(key, x, y, s, box, fn, alpha = 1) {
  const k = Math.max(.25, s * L.sc * L.dpr), kq = Math.round(k * 8) / 8, id = key + '@' + kq;
  let c = SPR.get(id);
  if (!c) {
    if (SPR.size > 140) { const it = SPR.keys(); for (let i = 0; i < 40; i++) SPR.delete(it.next().value); }
    c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(box[2] * kq)); c.height = Math.max(1, Math.ceil(box[3] * kq));
    const old = g, oseed = seed; g = c.getContext('2d'); g.setTransform(kq, 0, 0, kq, -box[0] * kq, -box[1] * kq); g.lineJoin = 'round'; g.lineCap = 'round';
    try { fn(); } catch (e) { console.error(e); } finally { g = old; seed = oseed; }
    c._kq = kq; SPR.set(id, c);
  }
  g.save(); if (alpha < 1) g.globalAlpha *= alpha; g.drawImage(c, x + box[0] * s, y + box[1] * s, box[2] * s, box[3] * s); g.restore();
}

/* ---------- hits (rebuilt every frame) ---------- */
let HITS = [];
const PTR = { down: false, x: 0, y: 0, sx: 0, sy: 0, id: null, moved: false, drag: null };
function addHit(id, x, y, w, h, fn, o = {}) { HITS.push({ id, x, y, w, h, fn, o }); }
const inR = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
function hitAt(x, y) { for (let i = HITS.length - 1; i >= 0; i--) { const h = HITS[i]; if (x >= h.x - (h.o.pad || 0) && x <= h.x + h.w + (h.o.pad || 0) && y >= h.y - (h.o.pad || 0) && y <= h.y + h.h + (h.o.pad || 0)) return h; } return null; }
const pressed = id => PTR.down && PTR.id === id;

/* ---------- runtime state ---------- */
const RT = { t: 0, scene: 'boot', story: null, step: null, toasts: [], parts: [], shake: 0, settings: false, modal: null, fade: 0, board: false, bag: false };
