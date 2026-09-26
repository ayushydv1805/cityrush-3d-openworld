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
  version: "0.6.0",
  phase: 6,
  city: "Chandigarh",
  systems: ["city", "player", "vehicle", "traffic", "pedestrians", "missions"],
}));

app.get("/health", (_, res) => res.json({
  ok: true,
  phase: 6,
  version: "0.6.0",
  city: "Chandigarh",
  vehicleSystem: "online",
  trafficSystem: "online",
  pedestrianSystem: "online",
  missionSystem: "online",
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
    version: "0.6.0",
    phase: 6,
    city: "Chandigarh",
    vehicleSystem: "online",
    missionSystem: "online",
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("CityRush server listening on " + PORT);
});
