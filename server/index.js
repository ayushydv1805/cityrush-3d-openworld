import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "*";

const missionPayouts = [
  { id: "first-run", reward: 500 },
  { id: "sector-courier", reward: 800 },
  { id: "roundabout-run", reward: 1200 },
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

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get("/", (_, res) => res.json({
  name: "CityRush 3D Server",
  status: "online",
  version: "0.8.0",
  phase: 8,
  city: "Chandigarh",
  systems: ["city", "player", "vehicle", "traffic", "pedestrians", "missions", "economy", "garage"],
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

app.get("/health", (_, res) => res.json({
  ok: true,
  phase: 8,
  version: "0.8.0",
  city: "Chandigarh",
  vehicleSystem: "online",
  trafficSystem: "online",
  pedestrianSystem: "online",
  missionSystem: "online",
  economySystem: "online",
  garageSystem: "online",
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
    version: "0.8.0",
    phase: 8,
    city: "Chandigarh",
    vehicleSystem: "online",
    missionSystem: "online",
    economySystem: "online",
    garageSystem: "online",
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("CityRush server listening on " + PORT);
});
