import express from "express";
import { login, registerUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/users").get(login);
router.route("/register").post(registerUser);

export default router;
