# CITY RUSH — 3D Open World

**Your City. Your Ride. Your Run.**

## Phase 7 — Money + Economy

Phase 7 makes successful driving missions pay real in-game cash. The wallet, total earnings, paid mission count and best payout persist in browser local storage and appear on the menu and in-game HUD.

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
- Total earned, paid mission count and best payout tracking
- Mission payout toast and completion credit UI
- Economy stats on the main menu and controls panel
- Backend /economy metadata route
- Phase 7 economy server status

### Phase 7 Missions & Payouts
- First Run: 4 checkpoints, 90 seconds → ₹500
- Sector Courier: 4 checkpoints, 85 seconds → ₹800
- Roundabout Run: 6 checkpoints, 110 seconds → ₹1,200

### Economy Rules
Cash is earned only when a mission reaches the success state. Failed or aborted missions give no payout. Phase 8 will use this wallet for the garage and vehicle upgrades.

### Controls
- W: accelerate / move forward
- S: brake, reverse or move backward
- A / D: steer or move
- Shift: sprint on foot
- Space: jump / vehicle handbrake
- E: enter / exit vehicle
- Mouse: camera
- Mission Board: click START on a mission card

### Stack
React + Vite, Three.js, React Three Fiber, React Three Drei, Node.js, Express and Socket.IO.

### Cities planned
Chandigarh, Rewari, Gurugram, Delhi.

### Roadmap
Foundation → Player/Camera → First City → Vehicles → Traffic/NPCs → Missions → Money/Economy → Garage → Reputation → Police/Heat → Day/Night → Weather → Hidden Locations → Collectibles → Story → Social → Advanced Missions → Dynamic Events → Advanced Driving → Multiplayer → Profiles/Leaderboards → Audio → Graphics/UI polish → Save → Optimization → Testing → Production.