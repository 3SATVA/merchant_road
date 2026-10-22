# Shelved: drivable airships (World 2)

Status: **off** since Oct 21 2026, at Michael's request. We're working on the rest of World 2 first.

## What is shelved
In World 2 (the Skylands), all of this is switched off:
- the Airships shop tab in Skyhaven (Small / Medium / Large)
- boarding and mooring at docks, and the Sunspire dock
- piloting, hull damage, wrecks (limp back and lose 30% of the hold)
- the 30/60/100 airship cargo hold
- the mid-air leap from the airship onto the horse, plus the airship's buttons, hull bar and minimap marker

What still works: the World 1 scrap-pile airship build, the airship that carries you between World 1 and World 2 (with the first-arrival cutscene), and the Skyhaven dock's "World 1" button. In World 2 you cross the Air Wilds on the winged horse, which carries your backpack (5 goods).

## Where the code is
All of it is still in `index.html`, untouched, behind one flag near the World 2 constants:

```js
const FEATURE_DRIVABLE_AIRSHIPS=false;
```

The data is still there: `SHIPS`, `SORDER`, `SHIPURL`, `drawShip`, `drawShipD`, `drawSail`, `board`, `moor`, `hullHit`, `shipwreck`, `detachShip`, `attachShip`, `w2Tick`, `renderDock`, the `ships` town tab and the `buyship`/`useship` actions. While the flag is off, the gated entry points can't run:
- `board()` returns false
- `w2Tick` returns early
- `shipwreck` returns early
- the shop tab and its actions are gated
- `cap()` is the backpack in World 2
- only the Skyhaven dock is live (`liveDocks()`)
- the dock panel uses `renderDockHome()`

## Re-enable
1. Set `FEATURE_DRIVABLE_AIRSHIPS=true`.
2. Saves migrated while the feature was off just own the free Small Airship, which is moored at Skyhaven. Nothing else is needed.
3. Optional: the How to Play "Sky travel" paragraph swaps back to the airship text on its own (`#helpSky`).

## Save migration while off (`shelveShips` in `load()`)
- Anyone piloting, moored at Sunspire, or off an island lands at the Skyhaven dock.
- World 2 goods (active cargo, the parked ship hold, or `ws[1].hold` when you're in World 1) keep the 5 most valuable in the backpack. The rest is refunded at the price paid.
- Medium and Large airships are refunded at their full shop price ($6,000 / $20,000) into the World 2 wallet.
- A one-time toast tells the player how much was refunded.

## Note (Winged Cart)
World 2 `S.park` now holds the parked **Winged Cart** (`S.wcart`). If drivable airships are re-enabled, move the airship park to its own field (e.g. `S.shipPark`) instead of reusing `S.park`, and have `carriedH()` return the ship hold while sailing.
