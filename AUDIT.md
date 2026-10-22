# Code audit — Oct 21 2026 (baseline 59268d3)

Audit done on the single file `index.html`, before the module split (see below). Baseline 245,751 B / 1,697 lines (99.5 KB gzipped); after cleanup 234,306 B / 1,721 lines (89.6 KB gzipped). Lines went up slightly because of new helpers and comments; bytes went down.

## Module split — Oct 22 2026
The single file is now `index.html` (12 KB shell: markup and help text), `core/style.css`, and 46 classic scripts in `core/`, `inventory/`, `world1/`, `world2/`, `assets/`. See ARCHITECTURE.md for what lives where, the load order and how to add content. Code statements moved verbatim, and the total size is about the same (234 KB → 240 KB, 93 KB gzipped). Every step was gated on: an identical load-time global snapshot against the single-file build (f8edc95), no console errors or 404s, the full regression suite with 0 state and 0 pixel diffs, and a `file://` smoke test.
1. 261ce8c: CSS, touch guard and script pulled out of index.html.
2. 18f369b: data tables became append-only registries (`reg()` throws on out-of-order indices, since they are save data).
3. 59a0e77: statements distributed into folders.
4. 600bc7f: `WORLDDEF` per world. Every World 1/2 layout branch (`setWorld`, terrain formula, pits, decor, arrival) now reads the def.
5. f432910: per-world timers. World 1 storms and rocks are in `W1ENV`, World 2 timers in `W2ENV`; the shared `env` keeps run timers only.
6. c2afc75: each world owns its cart (`WORLDDEF.cart/leave/carry/autoHitch`). `S.park` stays the save field and is always the current world's parked cart.

The original single-file section map (pre-split) is in git history (f8edc95).

## Findings
- **Dead code:** very little. Only `jumpHeld()` and `HORSECALL` were unused (removed). `FLYALT`, `ISL1` and `enchCost` are only used by the `window.MR` test hooks (kept). The shelved airship code is behind `FEATURE_DRIVABLE_AIRSHIPS` (kept, restorable).
- **Duplication:** enemies already share AI through `ENEMY[t].base` (goblin/slime/golem kin in the Wastes), and items, haulers, weapons, towns, recipes and gear were already data tables. The real copies were the shop FOR SALE/YOURS lists (haulers and weapons), inn and potion prices written in two places each, the minimap markers (7 copies), and the E-prompt show/hide code (3 copies). All consolidated.
- **Magic numbers:** inn rest price, potion price/max/heal, air-wilds balance (damage %, max foes, pair chance, spawn gaps, pegasus re-dive), and the Winged Cart knock-loose rules were inline. They are now the `INN`, `SKY` and `WCART` tables. Many render-only numbers (sprite offsets, colours) stay inline on purpose: they are art, not tuning.
- **Per-frame hotspots:** about 1,800–2,300 `fillRect` calls a frame, mostly 1–2 px terrain and backdrop columns, each with its own `fillStyle`. There were also 16 regex colour parses a frame for the sky, 2 `getBoundingClientRect` layout reads a frame while flying, and DOM text/style writes plus prompt `innerHTML` every frame (each one also re-ran the emoji MutationObserver). Five `.filter()` re-allocations a frame for enemies, particles, projectiles, pickups and text.
- **Memory leaks:** none found. All listeners are registered once at top level, toasts are capped, and entity arrays are pruned. The new caches are bounded (one per cave, one per skull colour, one sky key).
- **Fragile global state (fixed by the split, see above):** `setWorld()` swaps `WORLD/BOUNDS/NB/WB/XMIN/XMAX/WT/DUNGEONS` globals, and `S.w` (save) must always match `WI` (runtime). `S.park` means "the World 1 wagon" or "the Winged Cart", depending on the world (it was also the airship hold; see SHELVED.md). Some `env.*` timers (`spawnD`, `next`, `bT`) survive a world switch. These are the most likely source of future cross-world bugs and the main reason to split into world modules later.
- **Naming:** a mix of one-letter globals (`S`, `P`, `X`, `FX`), abbreviations (`curH`/`carriedH`/`w2H`, `wal`, `shelf`, `moor`), and a storage key `merchantRoad.v1` that holds schema `v:2`. Left as is, because renaming the save fields would break saves.
- **Save cruft:** `load()` stacks about 12 implicit migrations in order: v2 hat slot, ench object to list, `offers`, wallet split (`wal`), ships/moor/hull, airship shelving (`shelf`, `shelfRf`), Winged Cart park, and so on. They work and are covered by the legacy saves in the harness. Recommendation: before cloud saves, turn them into an ordered `MIGRATIONS` list keyed by an integer schema version.
- **Embedded data:** there is one PNG (the witch portrait). Every other sprite is drawn in code at startup. The portrait was a 16 KB RGBA PNG with 79 colours. It is now an exact palette PNG of 6.1 KB, decoding to the same RGBA pixels.

## What changed (all pixel- and state-identical, verified)
1. `tests/regression/`: deterministic harness. It runs 22 scenarios plus 25 saves at 3 viewports and does pixel and full-state comparison.
2. Rect batcher `rb()/rbFlush()`: terrain, backdrops, cloud sea, rain curtain, cave walls and lava are queued per pass, merged into runs, and drawn with one `fillStyle` per run. Cave mounds and skulls are cached as sprites, and the sky gradient is computed once per biome blend.
3. HUD: `setTxt/setDisp` only write the DOM when something changed. The band-pip button rect is cached (it resets on resize and on mode or button visibility changes). `showPrompt()` is a single writer for the E prompt.
4. Config tables `INN`, `SKY`, `WCART`. Shared `shopLists()`, `mmPin()/mmDock()` and `prune()`.
5. Portrait recompressed.

Result (JS time per frame, desktop CPU, 390x844): plains 1.06 → 0.37 ms, snow 1.21 → 0.64, Wastes 1.18 → 0.53, volcano 1.12 → 0.54, sky flight 1.20 → 0.62, cave 0.37 → 0.31. `fillRect` calls per frame: plains 1,779 → 558, snow 2,263 → 931, Wastes 1,835 → 703, sky 2,032 → 1,041, cave 644 → 579.

## Deliberately left alone
- The order and logic of `load()` migrations. Any change risks old saves loading differently.
- Save field names and the localStorage key.
- The shelved airship code (restorable by flag).
- Sprite drawing for the player, horse and wings. These are 100–200 rects per frame, but caching them needs a per-frame sprite atlas. Still not done: the split was kept to zero visible change.
- Help text, emoji→pixel MutationObserver design, Google Fonts link (see readiness).
