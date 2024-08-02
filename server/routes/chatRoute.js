import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChats, newGroupChat } from "../controllers/chatController.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/newgroup").post(newGroupChat);
router.route("/mychats").get(getMyChats);

export default router;
