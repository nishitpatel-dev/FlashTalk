import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addmembers,
  getMyChats,
  getMyGroups,
  newGroupChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/newgroup").post(newGroupChat);
router.route("/mychats").get(getMyChats);
router.route("/mygroups").get(getMyGroups);
router.route("/mygroups/addmembers").put(addmembers);

export default router;
