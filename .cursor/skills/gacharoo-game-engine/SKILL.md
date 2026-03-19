---
name: gacharoo-game-engine
description: Gacharoo game economy rules, pack RNG algorithm, rarity weights, battle formulas, pity system, and two-phase pack economy. Use when implementing pack opening, rarity calculations, battle resolution, trading logic, bot players, or any game mechanic.
---

# Gacharoo Game Engine Rules

All numbers in this file are the authoritative source. If code contradicts this file, fix the code.

## Rarity System

| Tier | Pack Weight | Border Color | Symbol | Holo Chance |
|---|---|---|---|---|
| Standard | N/A (friend circles only) | Silver | -- | 2% |
| Common | 60% | Gray | Circle | 2% |
| Uncommon | 25% | Green | Diamond | 5% |
| Rare | 10% | Blue | Star | 10% |
| Epic | 4% | Purple | Double Star | 25% |
| Legendary | 1% | Gold | Crown | 50% |

**Variant types**: Normal, Holographic (rainbow shimmer), Full Art (0.5% of any pull), Secret (0.1%).

## Card Pool Split (60/20/20)

Every sealed set divides its cards into three pools:
- **Normal pool (60%)**: Available in regular packs
- **Golden pool (20%)**: Only in Golden Packs
- **Trade-only pool (20%)**: Never in any pack. Trading or Wonder Pick only.

## Pack RNG Algorithm (Server-Side Only)

Pack opening MUST run as a server-side API route. Never client-side.

```
function openPack(userId, setId):
  1. Get user's pack state (packs_opened_total, pity_counters, owned_cards)
  2. Determine pack size (adaptive: 3 for tiny sets, 4 for medium, 5 for large)
  3. Determine pack type (normal or golden based on counter)
  4. For each card slot:
     a. Roll rarity using weights (60/25/10/4/1) modified by pity
     b. Guarantee: at least 1 Uncommon+ per pack
     c. Select a random card template from the appropriate pool at that rarity
     d. Apply soft pity per card: if user owns 3+ copies, halve drop weight; 5+ copies, halve again
     e. Roll holo chance based on rarity tier
  5. Update pity counters
  6. Insert pulled cards into user_cards
  7. Update packs_opened_total, check pack cap
  8. Return pulled cards array
```

## Pity System

- **Epic pity**: After 20 packs without an Epic, next pack guarantees one
- **Legendary pity**: After 50 packs without a Legendary, next pack guarantees one
- **Soft pity per card**: Drop weight halves after 3 copies, halves again after 5 copies

Pity counters reset when the guaranteed pull occurs.

## Adaptive Set Parameters

| Set Size | Cards/Pack | Packs/4h | Golden Every | Pack Cap | Phase 2 |
|---|---|---|---|---|---|
| Tiny (10-25) | 3 | 2 | 5th | ~40 | Shimmer Packs |
| Medium (26-75) | 4 | 2 | 7th | ~80 | Shimmer Packs |
| Large (76-150) | 5 | 3 | 10th | ~150 | Shimmer Packs |
| Huge (150+) | 5 | 3 | 10th | None | Standard |

## Two-Phase Pack Economy

**Phase 1 (Collection)**: Normal packs regenerate on timer. Standard economy.

**Phase 2 (Holo Hunt)**: Triggered when `packs_opened_total >= pack_cap`. Normal timer stops. Sources:
- Shimmer Packs (ad-funded): Contains owned cards at ~25% holo chance. Max 5/day.
- Battle Run Shimmer Pull: First 3 daily wins grant one Shimmer Pull (25% holo).
- Wonder Pick and Trading continue.

## Small Set Variants (Superlatives)

For sets with <25 base cards, the Superlatives system generates variant cards:
- 8 Uncommon superlatives
- 5 Rare superlatives
- 2 Epic superlatives
- 1 Legendary superlative
= ~16 variant cards from the question pool, each assigned to one base person.

Variant cards have modified stats (e.g., "Party Sleeper Tom": +Charm, -Speed).

## Battle System

### Stats
Every card has 4 stats (1-100 scale): ATK, DEF, SPD, HP.

### Element Auto-Assignment
Based on dominant stat ratio:
- Highest ATK → **Blitz**
- Highest DEF → **Fortress**
- Highest SPD → **Swift**

Element triangle: Blitz > Swift > Fortress > Blitz (1.3x damage multiplier).

### Single Round Resolution

```
function resolveRound(attacker, defender):
  // Higher SPD goes first
  first = attacker.SPD >= defender.SPD ? attacker : defender
  second = other

  // Damage formula
  damage = first.ATK - (second.DEF / 2)
  damage *= elementMultiplier(first.element, second.element)  // 1.0 or 1.3
  damage = max(damage, 1)  // minimum 1 damage

  second.HP -= damage

  if second.HP > 0:
    // Counter-attack
    counterDamage = second.ATK - (first.DEF / 2)
    counterDamage *= elementMultiplier(second.element, first.element)
    counterDamage = max(counterDamage, 1)
    first.HP -= counterDamage

  return { first, second, knockout: first.HP <= 0 || second.HP <= 0 }
```

### Battle Run (Gauntlet)

- Start: 5 cards, 5 hearts
- Each round: front cards fight (see above). Loser's card is knocked out, winner's card keeps remaining HP.
- Win round = +1 trophy, Lose round = -1 heart
- Between rounds: pick 1 of 3 options (Heal 50%, Buff +10 ATK/DEF, Swap in fresh card)
- Options scale: rounds 1-3 basic, 4-6 stronger, 7-10 major
- Victory: 10 trophies. Defeat: 0 hearts.
- Ad continue: once per run, revive with 1 heart.

### Ghost Snapshots

When a player sets their battle team, save a snapshot to `ghost_snapshots` table. Opponents fight the snapshot, not the live player. Update snapshot whenever the player changes their team.

## Bot Players

Auto-generated on set creation. 2-3 bots per set.

```
function generateBot(setId):
  1. Give bot a random subset of the set's cards (~40-60%)
  2. Mark some cards as duplicates (for trading)
  3. Create a ghost team from their best 5 cards
  4. Save to bot_players table with display_name "GachaBot Alpha" etc.

Bot trade logic:
  - Accept any trade where: bot gives a card they have 2+ of AND receives a card they have 0 of
  - Process on trade proposal (server-side, instant response)
```

## Wonder Pick

When a user opens a pack, the 3-5 pulled cards become available as Wonder Picks for other set members.
- Picking costs 1 Wonder Stamina (regenerates 1 per 2 hours, max 5)
- Picker sees 3-5 face-down cards, picks one blindly (1-in-N chance)
- The picked card is a COPY -- the original opener keeps their card too
- Wonder Picks expire after 24 hours

## Daily Missions

5 missions per day, each rewards +2 packs:
1. Open 5 packs
2. Pull a Rare+ card
3. Win a battle run round (any)
4. Complete a trade
5. Share a card (social share)

## Session Awareness

Track per session (Zustand store, reset on app close):
- `packsOpenedToday`: increment on each open, display in UI
- `sessionStartTime`: set on first interaction, display elapsed time
- Cool-down interstitial triggers at `packsOpenedToday >= 10`
