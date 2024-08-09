import express from "express";
import {
  adminLogin,
  adminLogout,
  adminVerify,
  getAllChats,
  getAllMessages,
  getAllUsers,
  getDashboardStats,
} from "../controllers/adminController.js";
import { validateData } from "../middlewares/validatorMiddleware.js";
import { adminLoginValidator } from "../validators/userValidator.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/verify").post(validateData(adminLoginValidator), adminLogin);
router.route("/logout").get(adminLogout);

router.use(isAdminAuthenticated);

router.route("/").get(adminVerify);
router.route("/users").get(getAllUsers);
router.route("/chats").get(getAllChats);
router.route("/messages").get(getAllMessages);
router.route("/stats").get(getDashboardStats);


export default router;
