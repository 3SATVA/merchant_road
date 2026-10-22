# Regression harness

Deterministic: `Math.random` is seeded, and `performance.now`, `Date.now`, `requestAnimationFrame` and `setTimeout` run on a virtual clock that the scripts step frame by frame (1/60 s). CSS animations are disabled while it runs. Two runs of the same build come out pixel-identical.

Requires `playwright-core`, Google Chrome at `/usr/bin/google-chrome`, Python 3 with Pillow and numpy.

```
# serve the reference build and the working copy
python3 -m http.server 8767 --directory /path/to/reference   # e.g. git show <commit>:index.html
python3 -m http.server 8766 --directory .
node tests/regression/reg.js http://localhost:8767/ /tmp/out_before
node tests/regression/reg.js http://localhost:8766/ /tmp/out_after
python3 tests/regression/cmp.py /tmp/out_before /tmp/out_after   # digest + pixel diff
```

- 21 scripted scenarios (World 1 walk/fight/long playthrough/horse/cart park, towns and every tab, inventory, witch, caves, Ashen Wastes, volcano, scrap pile, death + respawn, World 2 island/town/flight/crossing/dock, world switch), each at 390x844, 844x390 (touch) and 1280x800.
- `saves/live_*.json` were produced by the live build (59268d3) after each scenario; `saves/legacy_*.json` are hand-made older formats (pre-v2 accessory hat, pre-wallet World 2, airships owned, junk values). Each is loaded, the migrated state is compared, and the game is stepped and screenshotted.
- The digest compares the full save state, player, enemies, camera, open panels' HTML, HUD text and touch-button visibility; `cmp.py` reports any digest key that differs and any screenshot with pixels off by more than 8/255.
- `node reg.js <url> <out> capture` also rewrites `saves/` from that build.
- `prof.js <url> prof` prints JS ms/frame and the hottest functions; `cnt.js <url>` counts fillRect calls per frame by caller.
