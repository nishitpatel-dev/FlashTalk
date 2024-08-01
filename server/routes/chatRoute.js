import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat } from "../controllers/chatController.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/new").post(newGroupChat);

export default router;
