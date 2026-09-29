import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "*";

const missionPayouts = [
  { id: "first-run", reward: 500, reputation: 30 },
  { id: "sector-courier", reward: 800, reputation: 45 },
  { id: "roundabout-run", reward: 1200, reputation: 65 },
];

const garageUpgrades = {
  engine: [
    { level: 1, cost: 700 },
    { level: 2, cost: 1100 },
    { level: 3, cost: 1600 },
  ],
  brakes: [
    { level: 1, cost: 550 },
    { level: 2, cost: 900 },
    { level: 3, cost: 1400 },
  ],
  steering: [
    { level: 1, cost: 600 },
    { level: 2, cost: 1000 },
    { level: 3, cost: 1500 },
  ],
  grip: [
    { level: 1, cost: 650 },
    { level: 2, cost: 1050 },
    { level: 3, cost: 1550 },
  ],
};

const reputationRanks = [
  { id: "rookie", name: "STREET ROOKIE", threshold: 0, payoutBonus: 0 },
  { id: "driver", name: "LICENSED DRIVER", threshold: 100, payoutBonus: 5 },
  { id: "courier", name: "TRUSTED COURIER", threshold: 250, payoutBonus: 10 },
  { id: "ace", name: "SECTOR ACE", threshold: 500, payoutBonus: 15 },
  { id: "legend", name: "CITY LEGEND", threshold: 900, payoutBonus: 20 },
];

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get("/", (_, res) => res.json({
  name: "CityRush 3D Server",
  status: "online",
  version: "0.9.0",
  phase: 9,
  city: "Chandigarh",
  systems: [
    "city",
    "player",
    "vehicle",
    "traffic",
    "pedestrians",
    "missions",
    "economy",
    "garage",
    "reputation",
  ],
}));

app.get("/economy", (_, res) => res.json({
  currency: "INR",
  starterCash: 1500,
  missionPayouts,
  persistence: "browser-localStorage",
}));

app.get("/garage", (_, res) => res.json({
  vehicle: {
    id: "chandigarh-cruiser",
    name: "Civic Cruiser",
    className: "CITY SEDAN",
  },
  upgradeLevels: 3,
  upgrades: garageUpgrades,
  persistence: "browser-localStorage",
}));

app.get("/reputation", (_, res) => res.json({
  storageKey: "cityrush-reputation-v1",
  missionBaseRep: missionPayouts.map(({ id, reputation }) => ({ id, reputation })),
  ranks: reputationRanks,
  speedBonus: 10,
  streakBonus: 5,
  persistence: "browser-localStorage",
}));

app.get("/health", (_, res) => res.json({
  ok: true,
  phase: 9,
  version: "0.9.0",
  city: "Chandigarh",
  vehicleSystem: "online",
  trafficSystem: "online",
  pedestrianSystem: "online",
  missionSystem: "online",
  economySystem: "online",
  garageSystem: "online",
  reputationSystem: "online",
  timestamp: new Date().toISOString(),
}));

const io = new Server(httpServer, {
  cors: {
    origin: clientOrigin,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("server:ready", {
    id: socket.id,
    version: "0.9.0",
    phase: 9,
    city: "Chandigarh",
    vehicleSystem: "online",
    missionSystem: "online",
    economySystem: "online",
    garageSystem: "online",
    reputationSystem: "online",
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("CityRush server listening on " + PORT);
});
