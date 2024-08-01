import express from "express";
import userRoute from "./routes/userRoute.js";
import dotenv from "dotenv";
import { mongoDB } from "./db.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

mongoDB();
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
