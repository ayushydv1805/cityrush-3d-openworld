# CITY RUSH — 3D Open World

**Your City. Your Ride. Your Run.**

## Phase 8 — Garage + Vehicle Upgrades

Phase 8 closes the first economy loop: finish driving missions, earn in-game rupees, then spend that cash on permanent Civic Cruiser upgrades. Wallet and garage progress persist in browser local storage.

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
- Garage and controls panels with responsive UI
- Backend /economy and /garage metadata routes
- Phase 8 garage server status

### Phase 8 Upgrade Bay
- Engine: higher top speed + acceleration
- Brakes: stronger braking response
- Steering: quicker steering input
- Grip: improved corner stability
- Three levels per component, with increasing purchase cost
- Purchases are blocked when the wallet cannot cover the next level
- Upgrades persist in browser local storage

### Economy + Garage Rules
Cash is earned only when a mission reaches the success state. Failed or aborted missions give no payout. Garage purchases spend cash immediately and cannot reduce the wallet below zero. Upgrades persist for the same browser save.

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

### Stack
React + Vite, Three.js, React Three Fiber, React Three Drei, Node.js, Express and Socket.IO.

### Cities planned
Chandigarh, Rewari, Gurugram, Delhi.

### Roadmap
Foundation → Player/Camera → First City → Vehicles → Traffic/NPCs → Missions → Money/Economy → Garage → Reputation → Police/Heat → Day/Night → Weather → Hidden Locations → Collectibles → Story → Social → Advanced Missions → Dynamic Events → Advanced Driving → Multiplayer → Profiles/Leaderboards → Audio → Graphics/UI polish → Save → Optimization → Testing → Production.
