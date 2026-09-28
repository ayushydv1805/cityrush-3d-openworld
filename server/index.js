import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "*";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get("/", (_, res) => res.json({
  name: "CityRush 3D Server",
  status: "online",
  version: "0.7.0",
  phase: 7,
  city: "Chandigarh",
  systems: ["city", "player", "vehicle", "traffic", "pedestrians", "missions", "economy"],
}));


app.get("/economy", (_, res) => res.json({
  currency: "INR",
  starterCash: 1500,
  missionPayouts: [
    { id: "first-run", reward: 500 },
    { id: "sector-courier", reward: 800 },
    { id: "roundabout-run", reward: 1200 },
  ],
  persistence: "browser-localStorage",
}));

app.get("/health", (_, res) => res.json({
  ok: true,
  phase: 7,
  version: "0.7.0",
  city: "Chandigarh",
  vehicleSystem: "online",
  trafficSystem: "online",
  pedestrianSystem: "online",
  missionSystem: "online",
  economySystem: "online",
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
    version: "0.7.0",
    phase: 7,
    city: "Chandigarh",
    vehicleSystem: "online",
    missionSystem: "online",
    economySystem: "online",
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("CityRush server listening on " + PORT);
});
