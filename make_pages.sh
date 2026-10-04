#!/bin/bash
# Assemble the GitHub Pages site into ../hog-tied-pages (index.html + PWA manifest + icons + sources)
set -e
cd "$(dirname "$0")"; ./build.sh
OUT=../hog-tied-pages; mkdir -p $OUT
sed 's#<!--PWA-LINKS-->#<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png"><link rel="manifest" href="manifest.webmanifest">#' HogTied.html > $OUT/index.html
grep -q 'manifest.webmanifest' $OUT/index.html
(cd test && node icons.js ../$OUT)
cat > $OUT/manifest.webmanifest <<'MAN'
{
  "name": "Hog Tied: A Kayleigh Mystery",
  "short_name": "Hog Tied",
  "description": "A globe-trotting noir murder mystery starring Kayleigh and her foul-mouthed baby sister, Agent Kambree. Adults 18+ (gore and strong language; Toned Down toggle in Settings).",
  "start_url": "./",
  "scope": "./",
  "display": "fullscreen",
  "orientation": "any",
  "background_color": "#070a18",
  "theme_color": "#070a18",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
MAN
touch $OUT/.nojekyll
rm -rf $OUT/src $OUT/test $OUT/screenshots $OUT/build_assets; mkdir -p $OUT/src $OUT/test $OUT/screenshots $OUT/build_assets
cp src/* $OUT/src/; cp build.sh make_pages.sh $OUT/; cp test/*.js test/package.json $OUT/test/
python3 - "$OUT/screenshots" <<'PYS'
# published screenshots are downscaled (max 1000px) + palette-quantized; source PNGs stay full-res
import sys, os, glob
from PIL import Image
out = sys.argv[1]
for f in sorted(glob.glob('screenshots/*.png')):
    d = os.path.join(out, os.path.basename(f))
    im = Image.open(f).convert('RGB'); s = 1000 / max(im.size)
    if s < 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    im.quantize(256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG).save(d, optimize=True)
PYS
cp build_assets/* $OUT/build_assets/
cp HogTied.html $OUT/HogTied.html; cp README.md PROGRESS.md $OUT/
printf 'node_modules/\ntest/tmp/\ntest/tmpL/\n' > $OUT/.gitignore
echo "pages assembled in $OUT"
