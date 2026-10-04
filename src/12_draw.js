/* ===================== DRAW: ink + cel painter, shapes, text ===================== */
const INK = '#0b0a10'; let RIMK = 1;
// ---- subpath builders ----
function E(x, y, rx, ry, rot = 0) { g.moveTo(x + rx * Math.cos(rot), y + rx * Math.sin(rot)); g.ellipse(x, y, rx, ry, rot, 0, TAU); }
function C(x, y, r) { E(x, y, r, r); }
function RR(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function S(pts, t = 1) { // closed smooth curve
  const n = pts.length; g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    g.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6 * t, p1[1] + (p2[1] - p0[1]) / 6 * t, p2[0] - (p3[0] - p1[0]) / 6 * t, p2[1] - (p3[1] - p1[1]) / 6 * t, p2[0], p2[1]);
  }
  g.closePath();
}
function SO(pts, t = 1) { // open smooth curve
  const n = pts.length; g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    g.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6 * t, p1[1] + (p2[1] - p0[1]) / 6 * t, p2[0] - (p3[0] - p1[0]) / 6 * t, p2[1] - (p3[1] - p1[1]) / 6 * t, p2[0], p2[1]);
  }
}
function P(pts) { g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
// ---- the cel painter ----
// shapes(): adds subpaths. base/shade colors. opts: lw (ink half-width), sx/sy (light offset: shadow appears opposite),
// rim [color, width] (bright band on the shadow edge, right side), shade2(): extra hard shadow subpaths, tex(), hi()
function cel(shapes, base, shade, o = {}) {
  const lw = o.lw ?? 2.4, sx = o.sx ?? -4, sy = o.sy ?? -3;
  g.save();
  if (lw > 0) { g.beginPath(); shapes(); g.strokeStyle = o.ink || INK; g.lineWidth = lw * 2; g.stroke(); }
  g.beginPath(); shapes(); g.fillStyle = shade || base; g.fill();
  g.save(); g.beginPath(); shapes(); g.clip();
  if (o.rim) { g.fillStyle = o.rim[0]; g.fillRect(-5000, -5000, 10000, 10000); g.save(); const rw = (o.rim[1] || 3) * RIMK; g.translate(-rw, (o.rim[2] || 0)); g.beginPath(); shapes(); g.clip(); g.translate(rw, -(o.rim[2] || 0)); g.fillStyle = shade || base; g.fillRect(-5000, -5000, 10000, 10000); if (shade) { g.save(); g.translate(sx, sy); g.beginPath(); shapes(); g.fillStyle = base; g.fill(); g.restore(); } if (o.shade2) { g.beginPath(); o.shade2(); g.fillStyle = shade; g.fill(); } if (o.tex) o.tex(); if (o.hi) o.hi(); g.restore(); }
  else {
    if (shade) { g.save(); g.translate(sx, sy); g.beginPath(); shapes(); g.fillStyle = base; g.fill(); g.restore(); }
    if (o.shade2) { g.beginPath(); o.shade2(); g.fillStyle = shade; g.fill(); }
    if (o.tex) o.tex();
    if (o.hi) o.hi();
  }
  g.restore(); g.restore();
}
function fillP(shapes, col, a = 1) { g.save(); g.globalAlpha = a; g.beginPath(); shapes(); g.fillStyle = col; g.fill(); g.restore(); }
function strokeP(shapes, col = INK, lw = 2, a = 1) { g.save(); g.globalAlpha = a; g.beginPath(); shapes(); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); g.restore(); }
function line(pts, col = INK, lw = 2, a = 1) { g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); SO(pts); g.stroke(); g.restore(); }
function taper(pts, w0, w1, col = INK) { // tapered ink stroke (comic line weight)
  const n = 24; g.save(); g.fillStyle = col;
  const pt = t => { // sample along polyline-smoothed points (quadratic through midpoints)
    const k = (pts.length - 1) * t, i = Math.min(Math.floor(k), pts.length - 2), f = k - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; };
  const L = [], Rr = [];
  for (let j = 0; j <= n; j++) { const t = j / n, a = pt(Math.max(0, t - .01)), b = pt(Math.min(1, t + .01)); const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; const w = (w0 + (w1 - w0) * t) * Math.sin(Math.PI * Math.min(1, .15 + t * .85)) / 2 + .2; const c = pt(t); L.push([c[0] - dy / d * w, c[1] + dx / d * w]); Rr.push([c[0] + dy / d * w, c[1] - dx / d * w]); }
  g.beginPath(); g.moveTo(L[0][0], L[0][1]); for (const p of L) g.lineTo(p[0], p[1]); for (let j = Rr.length - 1; j >= 0; j--) g.lineTo(Rr[j][0], Rr[j][1]); g.closePath(); g.fill(); g.restore();
}
function lighten(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = n >> 8 & 255, b = n & 255; return `rgb(${Math.round(r + (255 - r) * k)},${Math.round(gg + (255 - gg) * k)},${Math.round(b + (255 - b) * k)})`; }
function darken(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = n >> 8 & 255, b = n & 255; return `rgb(${Math.round(r * (1 - k))},${Math.round(gg * (1 - k))},${Math.round(b * (1 - k))})`; }
function hiBlob(x, y, rx, ry, a = .45, rot = -.5, col = '#fff') { g.save(); g.globalAlpha = a; g.fillStyle = col; g.beginPath(); E(x, y, rx, ry, rot); g.fill(); g.restore(); }
function glow(x, y, r, col, a = 1) { g.save(); g.globalAlpha = a; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); }
function vgrad(x, y, w, h, stops) { const gr = g.createLinearGradient(x, y, x, y + h); stops.forEach(([t, c]) => gr.addColorStop(t, c)); g.fillStyle = gr; g.fillRect(x, y, w, h); }
function halftone(x, y, w, h, col, step = 5, rmax = 1.6, fall = 'down') { // dots grow along a direction
  g.save(); g.fillStyle = col;
  for (let j = 0; j <= h; j += step) for (let i = 0; i <= w; i += step) { const t = fall === 'down' ? j / h : fall === 'up' ? 1 - j / h : fall === 'left' ? 1 - i / w : i / w; const r = rmax * t; if (r < .25) continue; g.beginPath(); g.arc(x + i + ((j / step) % 2) * step / 2, y + j, r, 0, TAU); g.fill(); }
  g.restore();
}
function star5(x, y, r1, r2, rot = -Math.PI / 2) { const pts = []; for (let i = 0; i < 10; i++) { const a = rot + i * Math.PI / 5, r = i % 2 ? r2 : r1; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } P(pts); }
function sparkle(x, y, r, col = '#fff', a = 1) { g.save(); g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.moveTo(x, y - r * 2); g.quadraticCurveTo(x, y, x + r * 2, y); g.quadraticCurveTo(x, y, x, y + r * 2); g.quadraticCurveTo(x, y, x - r * 2, y); g.quadraticCurveTo(x, y, x, y - r * 2); g.fill(); g.restore(); }
function txt(s, x, y, font, fill, stroke, lw = 4, align = 'center', base = 'middle') { g.save(); g.font = font; g.textAlign = align; g.textBaseline = base; if (stroke) { g.lineWidth = lw; g.strokeStyle = stroke; g.lineJoin = 'round'; g.strokeText(s, x, y); } if (fill) { g.fillStyle = fill; g.fillText(s, x, y); } g.restore(); }
function wrapTxt(s, x, y, maxW, lh, font, col, align = 'left') { g.save(); g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'top'; const words = s.split(' '); let l = '', yy = y; for (const w of words) { const t = l ? l + ' ' + w : w; if (g.measureText(t).width > maxW && l) { g.fillText(l, x, yy); l = w; yy += lh; } else l = t; } if (l) g.fillText(l, x, yy); g.restore(); return yy + lh; }
function shadowOval(x, y, rx, ry, a = .35, col = '0,0,0') { g.save(); const gr = g.createRadialGradient(x, y, 1, x, y, rx); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.beginPath(); E(x, y, rx, ry); g.fill(); g.restore(); }
// rope band (for the logo) along a straight segment
function rope(x0, y0, x1, y1, w, col = '#c9933f', dark = '#7a5320') { const d = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0); g.save(); g.translate(x0, y0); g.rotate(a); g.beginPath(); RR(0, -w / 2, d, w, w / 2); g.fillStyle = INK; g.save(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke(); g.restore(); g.fillStyle = col; g.fill(); g.clip(); g.strokeStyle = dark; g.lineWidth = w * .28; for (let i = -w; i < d + w; i += w * .7) { g.beginPath(); g.moveTo(i, -w / 2); g.lineTo(i + w * .8, w / 2); g.stroke(); } g.strokeStyle = 'rgba(255,240,200,.55)'; g.lineWidth = w * .12; for (let i = -w; i < d + w; i += w * .7) { g.beginPath(); g.moveTo(i + w * .25, -w / 2); g.lineTo(i + w * .55, -w * .05); g.stroke(); } g.restore(); }
