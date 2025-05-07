import { Server } from "socket.io";
import crypto from "crypto";
import ChatModel from "../models/chat.js";
import mongoose from "mongoose";
import { app } from "../app.js";

import ConnectionRequestModel from "../models/connectionRequest.js";
import userModel from "../models/user.js";

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  app.set("io", io);

  io.on("connection", (socket) => {
    socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      await userModel.findByIdAndUpdate(userId, { isOnline: true });
      console.log(firstName + " Joining Room " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text, time }) => {
        try {

            const fromUserId = new mongoose.Types.ObjectId(userId);
            const toUserId = new mongoose.Types.ObjectId(targetUserId);
          const connection = await ConnectionRequestModel.findOne({
            $or: [
              {
                fromUserId,
                toUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });
          if (!connection) {
            console.log("Connection not found or not accepted");
            socket.emit("notConnected", {
                message: "You are not connected to this user yet",
                });
            return;
          }

          const roomId = getSecretRoomId(userId, targetUserId);
          // console.log(firstName + " " + text);

          let chat = await ChatModel.findOne({
            participants: { $all: [userId, targetUserId] },
          })
          if (!chat) {
            chat = new ChatModel({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ sender: userId, text });
          const sender = await userModel.findById(userId).select("photoUrl");
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            time,
            photoUrl:sender?.photoUrl || null,
          });
        } catch (error) {
          console.log("Error in sending message", error);
        }
      }
    );

  
    socket.on("disconnect", async () => {
      console.log("User Disconnected");
      const userId = socket.userId;
      if (userId) {
        await userModel.findByIdAndUpdate(userId, { isOnline: false });
        io.emit("userOffline", userId);
      }
    });
  });
};

export default initializeSocket;
