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
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./utils/helper.js";
import { Message } from "./models/messageModel.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "Production";

mongoDB();
// createFakeUser(2);
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(errorMiddleware);

const serverInstance = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} mode`);
});

const io = new Server(serverInstance, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
    credentials: true, //access-control-allow-credentials:true
  },
});

export const userScoketIDs = new Map();

io.use((socket, next) => {});

io.on("connection", (socket) => {
  const user = {
    _id: "asad",
    name: "Mohan",
  };
  userScoketIDs.set(user._id.toString(), socket.id);
  console.log("Socket connected", socket.id);
  console.log(userScoketIDs);

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
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    userScoketIDs.delete(user._id.toString());
    console.log("Socket disconnected", socket.id);
  });
});

export { envMode };
