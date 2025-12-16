# Stickers & Party Tracker 🎉

This module powers the "Party Tracker" live dashboard and interactive NFC experiences.

## 🚀 Quick Start
*   **Party URL**: https://stickerface.vercel.app/party
*   **Admin Panel**: https://stickerface.vercel.app/party/admin (PIN: `1234`)

---

## 🏷️ NFC Tag Mappings
Guests interact with the party via NFC tags. Point your tags to these URLs:

| Station | Function | URL |
| :--- | :--- | :--- |
| **MAIN HUB** | Join Party / Dashboard | `https://stickerface.vercel.app/party` |
| **WATER** | +1 Water (Hydration) | `.../party/track?metric=water` |
| **DRINKS** | +1 Drink (Leaderboard) | `.../party/track?metric=drinks` |
| **BOTTLES** | +1 Bottle Finished | `.../party/track?metric=bottles` |
| **GAMES** | +1 Game Played | `.../party/track?metric=games` |
| **BOWLS** | +1 Bowls Done | `.../party/track?metric=bowls` |

> **Note:** Replace `https://stickerface.vercel.app` with your local IP (e.g., `http://192.168.1.5:3000`) if testing locally.

---

## 📱 App Functionality

### 1. **Guest Dashboard** (`/party`)
*   **Leaderboards**: Live ranking of who has had the most Drinks and Water.
*   **Prop Bets**: Guests can vote OVER/UNDER on questions like "Total Bottles?".
    *   **Locking:** Guests can "Lock" their bets to prevent further changes. Locked bets show a 🔒 icon in the Admin panel.
*   **Aggregated Stats:** The top "Ticker" displays the **TOTAL SUM** of Bottles, Games, and Bowls from *all* guests combined.

### 2. **Admin Panel** (`/party/admin`)
*   **Guest List**: View all guests, their stats, and lock status (🔒).
*   **Live Edit**: Manually increment/decrement any stat for any user.
*   **Manage Questions**: Create new betting lines or edit existing ones.
*   **Totals**: "Global Counters" section shows the aggregated totals for the party.

### 3. **Smart Session Logic** (`party-utils.ts`)
*   The party "day" runs from **8:00 AM to 7:59 AM** the next day.
*   This ensures that drinking until 3 AM counts towards the *same* party night, not the next calendar day.
*   *Test verified in `src/lib/__tests__/party-utils.test.ts`.*

---

## 🧪 Running Tests
We use **Jest** to test the core logic.

### How to Run
```bash
npm test
```

### What is Tested?
1.  **Party Session Logic**: Ensures the "Party Day" rollover happens correctly at 8 AM.
2.  **Betting Logic**: Verifies that OVER/UNDER logic correctly identifies winners based on the "Line".
3.  **Component Rendering**: Basic snapshot tests for UI components (if applicable).


> **Developer Note:** If you change the betting logic or session timing, please run `npm test` to verify no regressions.

---

## 🤖 Architecture for AI Agents

Hello, future agent! Here is the critical context you need to understand the data flow.

### 1. Data Model (Single Source of Truth)
We do **not** use relational tables for individual actions (e.g., a "drinks" table). Instead, we use `JSONB` columns on the `party_guests` table for speed and simplicity in this MVP.
*   **`party_guests.stats`**: `{ "drinks": 5, "water": 2, "bottles": 0, ... }`
*   **`party_guests.my_bets`**: `{ "question_id_123": "OVER", "question_id_456": "UNDER" }`

### 2. Aggregation Logic
*   **Dashboard (`/party`)**: Subscribes to `party_guests` via Supabase Realtime. It calculates Global Totals (Bottles/Games) by performing a `.reduce()` on the guest list client-side.
*   **Results (`/party/results`)**: Does the exact same thing (client-side aggregation) to ensure numbers match the dashboard 100%.

### 3. Legacy Code (Do Not Use)
*   **`party_actions` table**: We moved away from logging individual actions to just incrementing the JSONB counters. This table is deprecated.
*   **`settleBetsForSession` (in `party-utils.ts`)**: This function relies on `party_actions`. **Do not use it.** Use the aggregation logic found in `party/results/page.tsx` instead.

---

## 🛠 Technical Debt / TODOs
*   [ ] **Cleanup**: Remove `party_actions` table and related unused RPCs.
*   [ ] **Refactor**: Move the client-side aggregation logic (currently duplicated in Dashboard and Results) into a shared utility function in `party-utils.ts`.
*   [ ] **Auth**: Currently "Auth" is just selecting a User ID. In the future, implement a real PIN or session cookie for guests to prevent spoofing.

