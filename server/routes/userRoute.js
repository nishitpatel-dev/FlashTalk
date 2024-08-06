import express from "express";
import {
  getMyProfile,
  login,
  logoutUser,
  registerUser,
  searchUser,
} from "../controllers/userController.js";
import { multerUploads } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { validateData } from "../middlewares/validatorMiddleware.js";
import { loginSchema, signupSchema } from "../validators/userValidator.js";

const router = express.Router();

router
  .route("/register")
  .post(
    multerUploads.single("avatar"),
    validateData(signupSchema),
    registerUser
  );
router.route("/login").post(validateData(loginSchema), login);

router.use(isAuthenticated);

router.route("/me").get(getMyProfile);
router.route("/logout").get(logoutUser);
router.route("/search").get(searchUser);

export default router;
