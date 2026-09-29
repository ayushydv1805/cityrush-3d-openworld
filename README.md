# CITY RUSH — 3D Open World

**Your City. Your Ride. Your Run.**

## Phase 9 — Reputation + Ranks

Phase 9 gives the player a persistent reputation profile. Successful missions award reputation, fast completions can earn a speed bonus, consecutive successful missions build a streak bonus, and higher city ranks unlock larger cash payout bonuses for future missions.

### Included
- Living Chandigarh sector-style city
- 16 playable sectors with 36-sector expansion plan
- Player movement, sprint, jump and third-person camera
- Drivable Civic Cruiser with steering, collision and driving HUD
- 14 moving traffic vehicles and 12 pedestrian NPCs
- 3 timed driving missions with 14 sequential checkpoints
- Live mission timer and progress
- Mission success, timeout, retry and abort states
- ₹1,500 starting cash
- Mission payouts: ₹500, ₹800 and ₹1,200
- Persistent wallet using browser local storage
- Phase 8 garage with Civic Cruiser performance tuning
- Engine, brakes, steering and grip upgrades
- Three upgrade levels per component
- Upgrade purchases immediately change vehicle handling
- Garage tier visuals on the 3D vehicle
- Phase 9 reputation profile and rank progression
- Persistent reputation score, successful streak and best streak
- Speed and streak reputation bonuses
- Higher reputation ranks add future mission payout bonuses
- Reputation dashboard and in-game rank badge
- Backend /economy, /garage and /reputation metadata routes
- Phase 9 reputation server status

### Reputation Ranks
- 0 REP — Street Rookie — +0% future mission payout
- 100 REP — Licensed Driver — +5% future mission payout
- 250 REP — Trusted Courier — +10% future mission payout
- 500 REP — Sector Ace — +15% future mission payout
- 900 REP — City Legend — +20% future mission payout

### Reputation Rules
- Successful missions award their configured base reputation.
- A fast completion with at least 35% of the mission time remaining adds +10 REP.
- A successful streak of 2 or more adds +5 REP.
- A failed mission resets the successful streak to zero.
- Rank bonuses apply to future mission cash payouts and are calculated when a mission starts.
- Wallet, garage progress and reputation persist in browser local storage.

### Garage
- Engine: higher top speed + acceleration
- Brakes: stronger braking response
- Steering: quicker steering input
- Grip: improved corner stability
- Three levels per component, with increasing purchase cost
- Purchases are blocked when the wallet cannot cover the next level
- Upgrades persist in browser local storage

### Controls
- W: accelerate / move forward
- S: brake, reverse or move backward
- A / D: steer or move
- Shift: sprint on foot
- Space: jump / vehicle handbrake
- E: enter / exit vehicle
- Mouse: camera
- Mission Board: click START on a mission card
- Garage: open from the main menu
- Reputation: open from the main menu

### Stack
React + Vite, Three.js, React Three Fiber, React Three Drei, Node.js, Express and Socket.IO.

### Cities planned
Chandigarh, Rewari, Gurugram, Delhi.

### Roadmap
Foundation → Player/Camera → First City → Vehicles → Traffic/NPCs → Missions → Money/Economy → Garage → Reputation → Police/Heat → Day/Night → Weather → Hidden Locations → Collectibles → Story → Social → Advanced Missions → Dynamic Events → Advanced Driving → Multiplayer → Profiles/Leaderboards → Audio → Graphics/UI polish → Save → Optimization → Testing → Production.
