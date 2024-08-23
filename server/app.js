import express from "express";
import dotenv from "dotenv";
import { mongoDB } from "./db.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { createFakeUser } from "./seed/user.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import { Server } from "socket.io";
import {
  CHAT_JOINED,
  CHAT_LEFT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./utils/helper.js";
import { Message } from "./models/messageModel.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { ErrorHandler } from "./utils/utility.js";
import jwt from "jsonwebtoken";
import { User } from "./models/userModel.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "Production";

mongoDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// createFakeUser(2);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(errorMiddleware);

const serverInstance = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} mode`);
});

const io = new Server(serverInstance, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

export const userScoketIDs = new Map();
export const onlineUsers = new Set();

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async () => {
    try {
      const authToken = socket.request.cookies["flashtalk-token"];

      if (!authToken) {
        return next(
          new ErrorHandler("Not authorized to access this route", 401)
        );
      }

      const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

      const user = await User.findById(decodedData.id);

      if (!user) {
        return next(
          new ErrorHandler("Not authorized to access this route", 401)
        );
      }

      socket.user = user;

      next();
    } catch (error) {
      return next(new ErrorHandler("Not authorized to access this route", 401));
    }
  });
});

io.on("connection", (socket) => {
  const user = socket.user;
  userScoketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chatId,
    };
    const membersSockets = getSockets(members);

    io.to(membersSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error.message, 500);
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);

    socket.to(membersSockets).emit(START_TYPING, {
      chatId,
    });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);

    socket.to(membersSockets).emit(STOP_TYPING, {
      chatId,
    });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEFT, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    userScoketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

export { envMode };
