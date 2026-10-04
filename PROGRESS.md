# Hog Tied: build progress

## Done
- Engine (src/): core/layout, drawing, world and backdrops, cast (Kayleigh, Kambree, Gigi, KD, Cocoa and suspects), bust generator, gore (pass 1 and 2), UI, story player, investigation and crime scenes, deduction board, flight board, interrogation, minigames (chase, rhythm, shot, fog), title with 18+ notice and age gate, Gigi drop-off and pick-up, accusation, credits, original procedural audio and music, input, main loop, save, `window.__HT` test hooks.
- Content: all 16 chapters, 12 interrogations, about 33 clues, items, the Wrong Hog retry, the triumphant ending and the post-credits sting.
- Tests:
  - `test/smoke.js`: an autoplay full playthrough passes in Chromium in portrait and landscape (0 errors).
  - `test/shots.js`: targeted screenshots.
- Layout fixes:
  - toasts now draw inside the HUD bar
  - interrogation layout is compact
  - autopsy button moved into the toolbar
  - the Gigi kitchen has decor and Ping & Pong
  - stages hold up to 4 characters
  - no mirrored shirt text
  - Cocoa's vest text is no longer mirrored
  - the flight-board hint no longer overlaps

- Polish pass (Oct 4, 2:20 PM CT):
  - fog now renders as soft fog instead of a tile grid
  - standoff cover drawn as wooden crates
  - an original foam-hog mascot for the finale
  - yard lines on the stadium field
  - Tito's blood spray kept on the tombs
  - code-drawn app icon (`__HT.iconURL`)
- Tests (latest build, 0 errors in each):
  - full autoplay playthroughs in WebKit iPhone 13 portrait and landscape, and Chromium portrait
  - minigames shot mid-play in both orientations
- `make_pages.sh` builds `../hog-tied-pages` (index.html, PWA manifest, icons, .nojekyll and sources).
- Final screenshots are in `screenshots/`.

## Publishing
- Repo: https://github.com/antonolson47-ctrl/hog-tied (the Pages site deploys from `main` at `/`)
- Live: https://antonolson47-ctrl.github.io/hog-tied/

## Known gaps
- The autoplay tests exercise the winning path. The losing branches of minigames and interrogations are covered by code paths and spot checks, not by a full playthrough.
- Audio can't be verified headless. It is procedural WebAudio and unlocks on the first tap.
- Not tested on a physical device, only in Playwright emulation of iPhone 13 (WebKit) and Chromium.
