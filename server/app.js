import express from "express";
import dotenv from "dotenv";
import { mongoDB } from "./db.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { createFakeUser } from "./seed/user.js";

import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

mongoDB();
// createFakeUser(2);
app.use(express.json());
app.use(cookieParser());


app.use("/user", userRoute);
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});



app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
