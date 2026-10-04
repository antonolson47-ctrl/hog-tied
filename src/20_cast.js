/* ===================== CAST: who's who + how to draw them ===================== */
// Kayleigh bust: outfits 'default' (black TRUE CRIME tee + cobalt jacket), 'noir' (navy trench + black fedora w/ blue band), 'parka'
function kayleighBust(o = {}) {
  const out = o.outfit || 'default';
  const sp = { id: 'kay', skin: SKIN_K, rim: o.rim, outfit: out === 'noir' ? { type: 'trench', col: NAVY, shirt: '#24242e', lapel: '#2c4687' } : out === 'parka' ? { type: 'parka', col: '#2266dd', shirt: '#24242e' } : { type: 'jacket', col: COBALT, shirt: '#24242e' } };
  torsoOf(sp, 50);
  // TRUE CRIME graphic on the black tee
  g.save(); g.translate(0, -78); g.fillStyle = '#2f7bff'; g.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU, r = i % 2 ? 11 : 18; const px = Math.cos(a) * r, py = Math.sin(a) * r * .9; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.fill(); g.fillStyle = '#9fd0ff'; g.beginPath(); C(0, 0, 9); g.fill(); txt('TRUE', 0, -2.5, fa(7.5), '#0d1d48', null); txt('CRIME', 0, 4.5, fa(5.6), '#0d1d48', null); g.restore();
  if (out === 'noir') { cel(() => { P([[-12, -150], [-30, -146], [-34, -178], [-18, -172]]); P([[12, -150], [30, -146], [34, -178], [18, -172]]); }, '#2c4687', NAVY, { lw: 2, sx: -2, sy: 0 }); cel(() => RR(-56, -66, 112, 9, 3), '#2c4687', NAVYD, { lw: 1.6, sx: 0, sy: -1 }); }
  if (o.badge) { g.save(); g.translate(40, -96); badgeWallet(0, 0, .8, {}); g.restore(); }
  cel(() => S([[-9, -176], [9, -176], [11, -150], [0, -146], [-11, -150]], .6), SKIN_K, SKIN_KD, { lw: 2, sx: 3, sy: 0, shade2: () => { g.moveTo(-10, -176); g.lineTo(10, -176); g.lineTo(10, -166); g.quadraticCurveTo(0, -162, -10, -168); g.closePath(); } });
  line([[-12, -152], [0, -146], [12, -152]], '#3a3a4a', 2.2);
  g.save(); g.translate(0, -210); g.rotate(o.tilt || -.04); g.scale(1.15, 1.15);
  if (out === 'parka') { kayleighHead({ fedora: true, hatOnly: true, rim: o.rim, ex: o.ex }); hatOf({ hat: 'beanie', hatCol: '#15151c' }); }
  else kayleighHead({ fedora: out === 'noir', rim: o.rim, ex: o.ex });
  g.restore();
}
// KAMBREE: Kayleigh's baby sister, veteran FBI agent. Black FBI windbreaker, pink tee, high ponytail with a pink scrunchie, aviators on her head, Mochi Meow everything
const KAMBREE = { id: 'kambree', skin: '#eab894', hair: '#1d1517', hairStyle: 'ponytail', scrunchie: '#ff5aa8', glasses: 'onhead', lashes: 1, lips: '#c0405a', earrings: 'hoop', face: 'heart', brow: '#140c0c', browW: 3,
  outfit: { type: 'windbreaker', col: '#1a1a24', shirt: '#ff7ab0' }, extras: ['kitty', 'badge'], ex: 'angry', freckles: 1, freckleCol: '#b06a48', iris: '#4a2a18' };
const GIGI = { id: 'gigi', skin: '#f2c8ac', hair: '#d8d6e2', hairStyle: 'curly', glasses: 'reading', chain: 1, earrings: 'pearl', pearls: 1, face: 'round', wrinkles: 1, lips: '#c06070', lashes: 1,
  outfit: { type: 'cardigan', col: '#4a6ad8', shirt: '#f6f0e6' }, extras: ['apron', 'flour'], ex: 'smile', build: 'big' };
const CAST = {
  kay: { name: 'KAYLEIGH', col: '#2f7de1' },
  kambree: { name: 'AGENT KAMBREE', col: '#ff5aa8', sp: KAMBREE },
  kd: { name: 'KD', col: '#ffd23a' },
  cocoa: { name: 'COCOA', col: '#c8a070' },
  gigi: { name: 'GIGI', col: '#8ab0ff', sp: GIGI },
  pettigrew: { name: 'BO PETTIGREW', col: '#e8e2d0', sp: { id: 'pettigrew', skin: '#f4cfb8', hair: '#f6f6f6', hairStyle: 'gray', stache: 'meringue', beardCol: '#ffffff', face: 'round', wrinkles: 1, build: 'big', outfit: { type: 'suit', col: '#f4f0e6', shirt: '#ffffff', tie: 'bow', tieCol: '#9d1c2a', lapel: '#e4ded0' }, extras: ['hogpin'], ex: 'smile', brow: '#e8e8e8' } },
  chad: { name: 'HOGWILDCHAD', col: '#ff6a3a', sp: { id: 'chad', skin: '#f0c0a0', hair: '#f0d070', hairStyle: 'frosted', hat: 'snout', outfit: { type: 'vest', col: '#9d1c2a', shirt: '#1a1a24' }, extras: ['pins', 'camera'], ex: 'grin', face: 'square' } },
  lau: { name: 'MADAME JADE LAU', col: '#3ac08a', sp: { id: 'lau', skin: '#efd2b4', hair: '#121014', hairStyle: 'bob', streak: '#c8c8d4', glasses: 'reading', chain: 1, earrings: 'jade', lips: '#a0102a', lashes: 1, face: 'heart', outfit: { type: 'cheongsam', col: '#141418' }, ex: 'smug' } },
  count: { name: 'COUNT DE VAUCLAIR', col: '#c87ad0' },
  zurab: { name: 'ZURAB "THE TAMADA"', col: '#e8a040', sp: { id: 'zurab', skin: '#dcae8a', hair: '#141010', hairStyle: 'buzz', beard: 'striped', stache: 'thick', face: 'round', build: 'huge', outfit: { type: 'chokha', col: '#3a2a22', shirt: '#14100e' }, ex: 'grin' } },
  viuda: { name: 'LA VIUDA', col: '#e02040', sp: { id: 'viuda', skin: '#eac2a4', hair: '#0e0a0c', hairStyle: 'lowbun', carnation: 1, lips: '#c0102a', lashes: 1, face: 'heart', gloves: 1, earrings: 'pearl', outfit: { type: 'tango', col: '#141018' }, ex: 'smug' } },
  crab: { name: 'CRAB DADDY IBARRA', col: '#f4a030', sp: { id: 'crab', skin: '#c88a64', hair: '#1a1210', hairStyle: 'buzz', hat: 'captain', stache: 'walrus', scar: 1, build: 'big', face: 'square', outfit: { type: 'overalls', col: '#e8a020', shirt: '#3a4a5a' }, extras: ['chain'], ex: 'smug' } },
  brock: { name: 'BROCK DUNLEAVY', col: '#3ae0a0', sp: { id: 'brock', skin: '#f0c0a0', sunburn: 1, hair: '#c8a060', hairStyle: 'buzz', glasses: 'onhead', face: 'square', build: 'big', outfit: { type: 'tee', col: '#1fbf8a', graphic: 'DEATH ROAD BROS', gcol: '#0a2a1a' }, ex: 'scared' } },
  krill: { name: 'DR. THADDEUS KRILL', col: '#d8c070', sp: { id: 'krill', skin: '#f0d0b8', hair: '#c8c8cc', hairStyle: 'wild', glasses: 'round', stache: 'pencil', beardCol: '#9a9aa0', face: 'long', build: 'thin', outfit: { type: 'vest', col: '#a89060', shirt: '#e8e0c8' }, ex: 'smug' } },
  zohra: { name: 'ZOHRA "SAFFRON QUEEN"', col: '#f4a020', sp: { id: 'zohra', skin: '#c8906a', hair: '#141010', hairStyle: 'long', earrings: 'hoop', lips: '#9a2030', lashes: 1, face: 'heart', outfit: { type: 'dress', col: '#c8302a' }, pearls: 1, ex: 'smug' } },
  bjarki: { name: 'BJARKI THORVALDSSON', col: '#9fd0ff', sp: { id: 'bjarki', skin: '#f2cdb4', hair: '#e8cf8a', hairStyle: 'slick', glasses: 'round', fog: 1, build: 'thin', outfit: { type: 'sweater', col: '#6a5a4a', col2: '#e8e2d0' }, ex: 'scared' } },
  tank: { name: 'TANK DOBBINS', col: '#2ab0d8', sp: { id: 'tank', skin: '#7a4a30', hair: '#141010', hairStyle: 'buzz', glasses: 'sun', build: 'huge', face: 'square', outfit: { type: 'hawaiian', col: '#2a8aa8' }, extras: ['chain'], ex: 'angry' } },
  hawke: { name: 'THE PROFESSORS HAWKE', col: '#c8a070', sp: { id: 'hawke', skin: '#f2d2bc', hair: '#b8b8c0', hairStyle: 'combover', glasses: 'round', face: 'long', build: 'thin', wrinkles: 1, outfit: { type: 'blazer', col: '#7a5a3a', shirt: '#f2efe8', tie: 'bow', tieCol: '#2a6a3a' }, ex: 'smug',
    twin: { id: 'winston', hairStyle: 'bald', fringe: 1, glasses: 'reading', outfit: { type: 'blazer', col: '#7a5a3a', shirt: '#f2efe8', tie: 'bow', tieCol: '#9d1c2a' } } } },
  batzorig: { name: 'BATZORIG "GOLDEN EAGLE"', col: '#f4c445', sp: { id: 'batzorig', skin: '#c89a6a', hair: '#141010', hairStyle: 'buzz', hat: 'mongol', build: 'huge', face: 'round', outfit: { type: 'deel', col: '#2a4ab0', col2: '#f4c445', sash: '#e8302a' }, ex: 'angry' } },
  ringo: { name: 'RINGO JONES', col: '#e04040', sp: { id: 'ringo', skin: '#7a4a30', hair: '#141010', hairStyle: 'fade', face: 'square', build: 'big', outfit: { type: 'jersey', col: '#9d1c2a', num: '7' }, ex: 'grin' } },
  tito: { name: 'TITO FERRARO', col: '#c0a080', sp: { id: 'tito', skin: '#d9a27c', hair: '#1a1210', hairStyle: 'slick', stache: 'pencil', face: 'long', build: 'thin', outfit: { type: 'suit', col: '#16161c', shirt: '#f2efe8', tie: 'tie', tieCol: '#c81e28' }, ex: 'sad' } },
  sandy: { name: 'SANDY McFEELEY', col: '#f0a060', sp: { id: 'sandy', skin: '#f0c8ae', hair: '#c8642a', hairStyle: 'buzz', freckles: 1, face: 'round', outfit: { type: 'polo', col: '#e8e2d0' }, ex: 'scared' } },
  biscuit: { name: 'MARCUS "BISCUIT" TOOMBS', col: '#e04040', sp: { id: 'biscuit', skin: '#5a3a28', hair: '#0e0a0a', hairStyle: 'fade', face: 'round', build: 'big', outfit: { type: 'jersey', col: '#9d1c2a', num: '12' }, ex: 'neutral' } },
  barlow: { name: 'COACH DUKE BARLOW', col: '#e04040', sp: { id: 'barlow', skin: '#f0b898', hair: '#8a8a90', hairStyle: 'buzz', hat: 'cap', hatCol: '#9d1c2a', face: 'square', wrinkles: 1, build: 'big', outfit: { type: 'polo', col: '#9d1c2a' }, ex: 'angry' } },
  tormenta: { name: 'LA TORMENTA DORADA', col: '#f4c445', sp: { id: 'tormenta', skin: '#b07a54', hair: '#141010', hairStyle: 'long', hat: 'bowler', hatCol: '#3a2a1e', earrings: 'hoop', lips: '#a0303a', lashes: 1, face: 'round', build: 'big', outfit: { type: 'dress', col: '#e8b830' }, ex: 'grin' } },
  loretta: { name: 'MISS LORETTA', col: '#c87ad0', sp: { id: 'loretta', skin: '#6a4028', hair: '#3a3036', hairStyle: 'curly', face: 'round', earrings: 'pearl', lips: '#80303a', lashes: 1, build: 'big', outfit: { type: 'cardigan', col: '#7a3a9a', shirt: '#f2efe8' }, pearls: 1, ex: 'sad' } },
  sarge: { name: 'SGT. PRUITT (XNA POLICE)', col: '#8ab0ff', sp: { id: 'sarge', skin: '#f0c0a0', hair: '#5a4030', hairStyle: 'buzz', hat: 'cap', hatCol: '#1f3366', stache: 'thick', face: 'round', build: 'big', outfit: { type: 'polo', col: '#1f3366' }, extras: ['badge'], ex: 'neutral' } },
  narr: { name: '' },
};
// draw a cast member, bottom-anchored at (x,y), scale s. Cached as a sprite.
function castBox(id) { return id === 'hawke' ? [-170, -310, 340, 320] : id === 'cocoa' ? [-110, -260, 220, 270] : id === 'kd' ? [-80, -270, 160, 280] : [-120, -312, 240, 322]; }
function drawCast(id, x, y, s, o = {}) {
  const ex = o.ex || '', out = id === 'kay' ? (o.outfit || kayOutfit()) : '';
  const key = 'cast:' + id + ':' + ex + ':' + out + ':' + (o.flip ? 1 : 0) + ':' + (o.badge ? 1 : 0);
  sprite(key, x, y, s, castBox(id), () => {
    if (o.flip) g.scale(-1, 1);
    RIMK = .8;
    if (id === 'kay') kayleighBust({ outfit: out, ex: ex || 'smile', rim: '#ffb25a', badge: o.badge });
    else if (id === 'kd') { kd(0, 0, 1.05, { rim: '#ffb25a' }); }
    else if (id === 'cocoa') cocoa(0, 0, 1.15, { flip: true });
    else if (id === 'count') countHalf(0, 0, 1.06, { rim: '#5fe3ff' });
    else if (CAST[id] && CAST[id].sp) bust(CAST[id].sp, { ex: ex || undefined });
  }, o.alpha);
}
function kayOutfit() { if (SETTINGS.outfit === 'default') return 'default'; if (SETTINGS.outfit === 'noir' && GS.flags.noir) return 'noir'; if (RT.forceOutfit) return RT.forceOutfit; return (GS.flags.noir && GS.outfitPref === 'noir') ? 'noir' : 'default'; }
