import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addmembers,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMembers,
  sendAttachment,
} from "../controllers/chatController.js";
import { multerUploads } from "../middlewares/multer.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/newgroup").post(newGroupChat);
router.route("/mychats").get(getMyChats);
router.route("/mygroups").get(getMyGroups);
router.route("/mygroups/addmembers").put(addmembers);
router.route("/mygroups/removemembers").put(removeMembers);
router.route("/leave/:id").delete(leaveGroup);

export default router;
