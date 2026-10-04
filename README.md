# Hog Tied: A Kayleigh Mystery

A phone-first HTML5 noir murder mystery. Kayleigh (26, slicked-back bun, tortoiseshell glasses, navy trench and fedora) chases a stolen Arkansas hog and a trail of bodies around the world, with her baby sister **Agent Kambree** (a veteran federal agent, permanently pissed off, obsessed with her original cat mascot Mochi Meow) riding shotgun.

**Play:** https://antonolson47-ctrl.github.io/hog-tied/ (on iPhone: Safari → Share → Add to Home Screen to play fullscreen)

**Adults 18+.** The game has graphic murder scenes, gore and strong language. Settings has a **Toned Down** toggle that covers the bodies and bleeps the swearing. KD (Kamden, 6) and Cocoa the dog are never present for the gore. In Kayleigh-only cities they stay at Gigi's house for cookies and story time.

## The case (16 chapters)
XNA → Buenos Aires → Recoleta → Ushuaia → La Paz → Easter Island → Marrakech → Monaco → Tbilisi → Reykjavik → Svalbard → Zanzibar → Siem Reap → Macau → Ulaanbaatar → Homecoming at the stadium. Then the accusation, the triumphant ending, the credits and a post-credits sting.

## How to play
- **Story:** tap to advance, and choose your lines when choices appear.
- **Crime scenes:** tap hotspots to collect clues. AUTOPSY gives the coroner's read.
- **Interrogations:** pick an approach (Beat It Out, Bribe, Bluff, Threaten, Sweet-Talk, Send in Cocoa, or Unleash Kambree) then tap a piece of evidence to call BS on a lie.
- **Deduction board:** connect the clues to answer each of the case's questions.
- **Minigames:** chases (tap or swipe LEFT/RIGHT), rhythm (tap on the beat), standoffs (FIRE when the reticle is on target) and fog stakeouts (wipe the fog, then tap the suspect).
- **Clock, Heat and FBI standing:** you have 28 days until kickoff. Heat and FBI standing change what people tell you.
- **Accusation:** name the culprit and back it up with proof. A wrong guess gives you a "Wrong Hog" retry.

Keyboard: Space or Enter advances, arrows or A/D steer chases, and Esc closes overlays.

## Tech
- A single self-contained HTML file (`HogTied.html`, built by `./build.sh` from `src/`). All art is drawn procedurally on canvas, and the fonts are embedded.
- Audio is procedural WebAudio: original spy-jazz and noir music plus SFX. No sampled or copied melodies.
- Portrait and landscape layouts re-fit live on rotation, with safe-area insets.
- Progress auto-saves in localStorage.
- `make_pages.sh` builds the GitHub Pages site (index.html, a PWA manifest and icons).
- Tests (in `test/`, after `npm install`):
  - `node smoke.js webkit 3000` runs a full autoplay playthrough (add `land` for landscape).
  - `node shots.js chromium name:ch:step` takes targeted screenshots.

The characters, brands and mascots are original parody. The game uses no real celebrities' names or likenesses.

Fonts: Anton, Bebas Neue, Oswald, Permanent Marker and Special Elite (SIL Open Font License / Apache 2.0).
