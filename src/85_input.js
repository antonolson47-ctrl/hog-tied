/* ===================== INPUT ===================== */
let PID = null;
function vpos(e) { const r = cv.getBoundingClientRect(); return toV(e.clientX - r.left, e.clientY - r.top); }
function onDown(e) {
  if (PID != null && PID !== e.pointerId) return; PID = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (er) {}
  audioInit(); const [x, y] = vpos(e); const h = hitAt(x, y);
  Object.assign(PTR, { down: true, x, y, sx: x, sy: y, moved: false, id: h ? h.id : null, bs0: RT.boardScroll || 0 });
  if (h && h.o.down) { PTR.id = null; try { h.fn(); } catch (er) { console.error(er); } }
  e.preventDefault();
}
function onMove(e) { if (e.pointerId !== PID) return; const [x, y] = vpos(e); PTR.x = x; PTR.y = y; const dx = x - PTR.sx, dy = y - PTR.sy; if (Math.hypot(dx, dy) > 10) PTR.moved = true; if (RT.board && !RT.boardCard && Math.abs(dy) > 8) RT.boardScroll = Math.max(0, PTR.bs0 - dy); }
function onUp(e) {
  if (e.pointerId !== PID) return; PID = null; const [x, y] = vpos(e); const dx = x - PTR.sx, dy = y - PTR.sy; PTR.down = false;
  if (PTR.moved && Math.hypot(dx, dy) > 30) { // swipe
    if (RT.scene === 'game' && RT.gm && RT.gm.k === 'chase' && Math.abs(dx) > Math.abs(dy)) chaseKey(dx < 0 ? -1 : 1);
    PTR.id = null; return; }
  const h = hitAt(x, y); const id = PTR.id; PTR.id = null;
  if (h && h.id === id) { try { h.fn(); } catch (er) { console.error(er); ERRS.push(String(er && er.stack || er)); } }
}
cv.addEventListener('pointerdown', onDown); addEventListener('pointermove', onMove); addEventListener('pointerup', onUp);
addEventListener('pointercancel', e => { if (e.pointerId === PID) { PID = null; PTR.down = false; PTR.id = null; } });
['touchend', 'pointerup', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, () => { audioInit(); applyVol(); }, { capture: true, passive: true }));
document.addEventListener('gesturestart', e => e.preventDefault()); document.addEventListener('dblclick', e => e.preventDefault());
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('visibilitychange', () => { if (document.hidden) { saveGame(); if (AC && AC.state === 'running') AC.suspend(); } else if (AC) AC.resume(); });
addEventListener('pagehide', () => saveGame());
addEventListener('keydown', e => {
  audioInit(); const k = e.key;
  if (RT.scene === 'game' && RT.gm) { if (RT.gm.k === 'chase') { if (k === 'ArrowLeft' || k === 'a') chaseKey(-1); if (k === 'ArrowRight' || k === 'd') chaseKey(1); } if (RT.gm.k === 'rhythm' && (k === ' ' || k === 'Enter')) rhythmHit('tap'); }
  if (RT.scene === 'story' && (k === ' ' || k === 'Enter') && !RT.settings && !RT.board) storyTap();
  if (k === 'Escape') { if (RT.board) RT.board = false; else if (RT.settings) closeSettings(); }
});
let fitT = 0; function refit() { clearTimeout(fitT); fitT = setTimeout(() => { layout(); }, 60); }
addEventListener('resize', refit); addEventListener('orientationchange', () => { refit(); setTimeout(layout, 350); }); if (window.visualViewport) visualViewport.addEventListener('resize', refit);
