# Architecture

Static site, no build step. `index.html` is a thin shell (markup + help text) that loads one stylesheet and 46 classic `<script>` files in a fixed order. It works over `file://`, any static server, Vercel and Capacitor.

## Why classic scripts (not ES modules)
- Every top-level `const`/`let`/`function` in one classic script is visible to the scripts after it. The code moved over verbatim, with no import/export wiring across about 1,500 statements and no renames.
- ES modules don't load over `file://` (CORS), and they would need hundreds of explicit imports. A missed one only shows up at runtime.
- What to watch for: a function declaration hoists only inside its own file. Anything that **runs while loading** (building terrain, sprites, icons, the boot call) may only use files loaded before it, or its own file. The regression harness fails on any load-time `ReferenceError`.

## What lives where
| Folder | Contents |
|---|---|
| `core/` | engine and shared systems: `util` (math, RNG hash, rect batcher), `registry` (shared tables, `reg()`, `WORLDDEF`, current-world globals), `world` (terrain, pits, decor, `setWorld`), `wings`, `player`, `horse` (riding, lances, summon), `state` (save/load + migrations), `economy`, `cart` (hitch/park), `input`, `canvas`, `ui`, `town` (shop panels), `hud` (HUD, minimap), `play` (update loop, combat, spawning, `env` run timers), `render`, `scenery` (towns, decor), `worldswitch` (`leaveW`/`enterW`/`travelTo`), `loop`, `testhooks` (`window.MR`), plus `style.css` and `touchguard.js` |
| `inventory/` | things that carry between worlds: `data` (weapons, gear, sets, materials, drops, inn), `inventory` (panel, equip, HP), `forge` (recipes), `enchant` (enchants, curses), `enchanter` (enchanter panel) |
| `world1/` | the Road: `data` (goods, wagons, towns, biomes, enemies, spawn tables, caves, scrap pile, `WORLDDEF[0]`), `enemies` (ground foe AI + drawing), `caves`, `witch`, `wagon` (parked cart drawing), `scrap` (airship build), `weather` (blizzard, ash storm, falling rocks: `W1ENV`) |
| `world2/` | Skylands: `data` (sky goods, Winged Cart, ships, islands, docks, towns, biomes, sky foes, flag, `WORLDDEF[1]`), `art` (Winged Cart sprite), `islands`, `sky` (flight, bands, `W2ENV`), `skyfoes`, `wingcart`, `weather` (rain/updraft zones), `cutscene`, `dock`, `airships` (shelved), `skyisles` (sky islands between Skyhaven and Sunspire: island foes, unicorn bolts, storm clouds, rewards) |
| `assets/` | `icons` (gear/item pixel icons), `sprites` (weapon + hauler sprites), `ui-icons` (`ICO`, emoji-to-pixel glyphs), `portrait.js` (witch portrait data URI), `witch_portrait.png` (source of that portrait) |

## Load order (index.html)
`core/touchguard` (head), then:
core/util, core/registry, world1/data, world2/data, inventory/data, core/world, core/wings, world2/art, core/player, core/horse, assets/icons, assets/sprites, assets/ui-icons, assets/portrait, core/state, core/economy, core/cart, core/input, core/canvas, core/ui, core/town, core/hud, inventory/inventory, inventory/forge, inventory/enchant, inventory/enchanter, core/play, core/render, core/scenery, core/worldswitch, world1/enemies, world1/caves, world1/witch, world1/wagon, world1/scrap, world1/weather, world2/islands, world2/sky, world2/skyfoes, world2/wingcart, world2/weather, world2/cutscene, world2/dock, world2/airships, world2/skyisles, core/loop (boots the game), core/testhooks.

The data files load first because terrain, town biomes and sprite sheets are built at load. Gameplay files only run when called, so their position among themselves doesn't matter. Keep `core/loop.js` near the end.

## Registries and save safety
`ITEMS`, `TOWNS`, `BIOMES`, `BIOMEINFO` and `SPAWNS` are arrays, and **their indices are save data** (cargo item/origin, `lastTown`, `visited`, biome of a town). They are append-only: `reg(list, expectedIndex, [...])` throws if anything is registered out of order. Current layout:
- ITEMS: World 1 goods 0–5, World 2 goods 6–9
- TOWNS: World 1 0–5, World 2 6–7
- BIOMES, BIOMEINFO, SPAWNS: World 1 0–4, World 2 5–7

`ENEMY`, `HAULERS`, `COFF` and `HITCHR` are keyed objects (World 1 keys first, then World 2).
Save format, field names and the `merchantRoad.v1` key are unchanged. New fields are only ever added (and created lazily), e.g. `S.sky={r:{island:S.time taken},st:storm toast seen}` from the sky islands; a save without it loads as before. Never rename save fields or reorder `load()` migrations.

## Per-world state
- `WORLDDEF[n]` (in `worldN/data.js`) holds everything that used to be an `if(WI)` branch: length, biome bands, X limits, caves, terrain formula `rawH`, extra flat ground, pit builder, decor rule, arrival town/money/position, and the world's **cart** (`cart()`, `leave()`, `carry`, `autoHitch`, `parkIco`). `setWorld(n)` copies it into the current-world globals (`WORLD`, `BOUNDS`, `NB`, `WB`, `XMIN`, `XMAX`, `WT`, `DUNGEONS`).
- `S.park` is the parked cart of the **current** world only. On a world switch, `WORLDDEF[w].leave()` files it into `S.ws[w]` and `enterW` restores the other world's park. `curH()` asks the current world's def which cart it owns: the wagon in World 1, the Winged Cart in World 2.
- Timers: `env` (core/play.js) holds run timers shared by both worlds (biome, spawn distance, autosave, lift). World 1 storms and rocks live in `W1ENV` and only tick in World 1. World 2 weather and leap timers live in `W2ENV`. `travelTo` clears a running World 1 storm, as before.

## Sky islands (world2/skyisles.js)
- `SKYISLES` in `world2/data.js` (`x0,x1,h` surface height, `top` 0 aqua / 1 lilac grass, `storm`, reward `rw` chest/wool/crystal at `rx` from the centre, `foes`). `UNI` holds the unicorn bolt numbers (and `gap` between burst bolts), `SKYI` the reward cooldowns and amounts, `STORMIN` how far inside the island the storm starts.
- They are ordinary World 2 ground: `onIsle(x)` covers `ISLES` plus `skyAt(x)`, `WORLDDEF[1].rawH` gives them their height, and `isleTh` their thickness, so landing, walking, horse summon and `groundAt` need nothing new. `islAt` stays town islands only, so decor, docks, the Winged Cart park and `onIsleX` (save migrations, death respawn) ignore sky islands.
- Foes with `isle:1` (`unicorn`, `dreadUni`, `bigSlime`, `isleSlime` = the big slime's halves) are `air:1` enemies, so `updAir`/`drawAir` route them to `updIsle`/`drawIsleFoe`. `skyTick` (called from `w2Tick`) spawns them when an island comes near and despawns them when it is far, and the flier cull and `spawnAir` count skip them. In flight their hits go through `airHit`/`cartHit` like other sky foes.
- Storms: `stormAt(x)`; `canFly()` is false there, so `updSky` drops you onto the island (`stormDrop`, toast once) and you take off again past the cloud's edge.
- Drawing hooks: `drawClouds` calls `drawSkyProps` (grass, roots, crystals, rewards), `drawWeather` calls `drawStorms` and `drawBolts`. Plain clouds overlapping an island are skipped (`c.isl`).
- To add an island: append to `SKYISLES` (keep it between town islands, at least ~150px from the WX zone edges looks best). Existing save `S.sky.r` keys are island indices, so append only.

## World 2 winged horse on land (world2/data.js HLAND)
- On any World 2 island (Skyhaven, Sunspire, sky islands) the mounted winged horse moves at `HLAND` (1/3) of on-foot walking: 92 -> ~30.7px/s (x spdMul, x hitched-cart drag), vs 138 riding in World 1 and 69 flying. The hook is one ternary in `updWorld` (core/play.js: `WI?HLAND:RIDE`); flying speed (world2/sky.js) is untouched.
- Animation: `horsePlod()` (world2/sky.js) gates a slow heavy plod in `drawHorse` / `drawRider` (core/horse.js, `PLODF`, `plodBob`): slow leg cycle, body and head dip on each footfall, slow tail, wings folded. Everything is behind `WI===1`, so World 1 renders pixel-identically.
- The horse stays where you dismount; the horse button summons it anywhere (including inside a storm); jump while mounted on the ground still takes off. One-time toast, flag `S.sky.ld`.

## World 2 difficulty (world2/data.js)
- World 2 is tuned for a player arriving with end-game World 1 gear, not a fresh character. Foe base stats in `ENEMY` read like World 1 numbers; `W2T` (`hp` 4.5, `dmg` 4, `coin` 3) multiplies every sky foe's hp, dmg and coins once at load (pegasus, skySlime, unicorn, dreadUni, bigSlime, isleSlime), and `UNI.bolt` too. `SKY.dmg` (.85) scales flier contact hits on top of that. Turn one knob, not every stat.
- `ENEMY.uni` marks the unicorn behaviour (telegraph, bolt). `burst` is how many bolts it fires per telegraph (`UNI.gap` s apart, same aim, short re-glow before each). `elite` uses the dark-gold palette. `gem` is the chance of dropping a Sky Crystal on death. `dreadUni` is the elite: 3-bolt burst, more hp, essence .7.
- Every hit stays telegraphed and dodgeable: bolts by band change or jump, pegasus dives by changing band during the dive, big slimes by spacing. Storm islands make you cross on foot, so most of the guaranteed fighting happens there.
- Balance profiles live in `tests/regression/reg.js` (`BALPROF.max`: all W1 weapons, Obsidian Blade Sharp III/Crit II/Berserk II, Magma Lance Sharp III/Bloodthirst II, Stone set with Guarded III+Hardy III / Hardy II+Regen I / Guarded II+Thorns II, 170 max HP, 5 potions; `BALPROF.mid`). `BALRUN(profile, 'c'|'r')` is a careful or careless Skyhaven to Sunspire bot. Its result is stored under `<vp>_bal_*_run` in the digest. Targets: careful max arrives at 25-50% HP after at least 1 potion, careless max dies about half the time across seeds, and mid gear is not meant to make it.

## How to add…
**An enemy to World 2:** add it to `Object.assign(ENEMY,{...})` in `world2/data.js` (use `base:'slime'|'goblin'|'golem'|'witch'` to reuse a ground foe's AI and art, or `air:1` for a flier). Put it in the biome's row of `reg(SPAWNS,5,...)`. A new flier needs its look in `drawAir` (`world2/skyfoes.js`). Same pattern for World 1 in `world1/data.js` (`world1/enemies.js` for new art/AI).

**An item (trade good):** World 2: append `reg(ITEMS,10,[{id,name,base,col}])` after the existing World 2 goods block, then add its index to a town's `sells`. World 1 goods added now also take the next free index (10+), registered from a file loaded **after** `world2/data.js` (for example a new `world1/data2.js` with its script tag right after `world2/data.js`), because indices 6–9 are already World 2's. Its pixel icon comes from `col`, or add one in `assets/icons.js`. Weapons and gear (carry between worlds) go in `inventory/data.js`.

**A town:** World 2: `reg(TOWNS,8,[{name,x,w:1,sells:[...],weapons:[],haulers:[]}])` in `world2/data.js`. `x` must be on an island (`ISLES`). A town's biome is set in `core/world.js` from its x. A World 1 town follows the same next-index rule as items (8+, file loaded after `world2/data.js`, `w:0`).

**A new world:** add `worldN/data.js` with `WORLDDEF[N]` and its registrations at the next free indices. `travelTo`/`setWorld` currently assume two worlds (`n?1:0`); widen those first.

## Restoring the drivable airships
All the code is in `world2/airships.js`, `world2/dock.js`, `world2/islands.js` (`drawShipD`, `liveDocks`) and `core/town.js` (Airships tab), plus `SHIPS`/`SORDER` in `world2/data.js`. Set `FEATURE_DRIVABLE_AIRSHIPS=true` in `world2/data.js`. Before you ship that, give the airship hold its own save field (e.g. `S.shipPark`), because `detachShip`/`attachShip` still use `S.park`, which World 2 now uses for the Winged Cart (see SHELVED.md).

## Testing
`tests/regression/` (excluded from deploy): deterministic harness with its scenarios (including `isle_*` sky island ones) plus 25 saves × 3 viewports, pixel and state compare. See its README.
