// renders a cast sheet straight from src files (dev aid)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const src = ['10_core.js', '12_draw.js', '14_world.js', '16_chars.js', '17_bust.js', '20_cast.js'].map(f => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8')).join('\n');
  const fonts = fs.readFileSync(path.join(__dirname, '../build_assets/fonts.css'), 'utf8');
  const html = `<html><head><style>${fonts} body{margin:0;background:#333}</style></head><body><canvas id="cv"></canvas><div id="safe"></div><script>${src}
  var GS={flags:{}};
  document.fonts.ready.then(()=>{ const ids=Object.keys(CAST).filter(k=>k!=='narr'); const cols=7, cw=230, chh=330; cv.width=cols*cw; cv.height=Math.ceil((ids.length+3)/cols)*chh; L.sc=1; L.dpr=1; g=cv.getContext('2d'); g.fillStyle='#556'; g.fillRect(0,0,cv.width,cv.height);
  const list=ids.map(i=>[i,{}]).concat([['kay',{outfit:'noir',ex:'angry'}],['kay',{outfit:'parka',ex:'shock'}],['kambree',{ex:'shout'}]]);
  list.forEach(([id,o],n)=>{ const x=(n%cols)*cw+cw/2, y=Math.floor(n/cols)*chh+chh-20; const s= id==='hawke'?.62:.95; drawCast(id,x,y,s,o); txt(id,x,y+10,'14px Oswald','#fff'); });
  document.title='DONE'; });</script></body></html>`;
  fs.writeFileSync(path.join(__dirname, 'tmp/cast.html'), html);
  const b = await chromium.launch(); const p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CERR', m.text()); });
  await p.goto('file://' + path.join(__dirname, 'tmp/cast.html')); await p.waitForFunction(() => document.title === 'DONE', null, { timeout: 15000 });
  await (await p.$('canvas')).screenshot({ path: path.join(__dirname, 'tmp/cast.png') }); await b.close(); console.log('ok');
})();
