import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { GameManager } from "./GameManager.js";

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  }),
);
app.use(express.json());

const gameManager = new GameManager(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("analytics:update", gameManager.getAnalytics());

  gameManager.addUser(socket);

  socket.on("disconnect", () => {
    gameManager.removeUser(socket);
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (_req, res) => {
  res.json({ message: "Socket.IO server running" });
});

app.get("/analytics", (req, res) => {
  const analytics = gameManager.getAnalytics();
  res.json(analytics);
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
