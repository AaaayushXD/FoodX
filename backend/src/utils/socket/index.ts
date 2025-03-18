import { createServer } from "http";
import { Server } from "socket.io";
import type { Express } from "express";
import { verifySocketUser } from "../../middlewares/socket/socket.middlewares.js";

export const userSocketMap: Record<string, string> = {};

export const initializeSocket = (app: Express) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_URL,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    path: "/socket.io",
  });

  io.use(verifySocketUser);

  io.on("connection", (socket) => {
    const user = socket.user;
    if (!user) {
      console.error("Socket connection failed: User not authenticated");
      socket.disconnect();
      return;
    }

    const userId = user.uid;
    userSocketMap[userId] = socket.id;

    if (user.role === "chef") {
      socket.join("chef");
    }

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      socket.disconnect();
    });
  });

  return { io, server };
};
