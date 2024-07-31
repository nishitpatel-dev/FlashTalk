import express from "express";
import { login, registerUser } from "../controllers/userController.js";
import { multerUploads } from "../middlewares/multer.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(multerUploads.single("avatar"), registerUser);

export default router;
