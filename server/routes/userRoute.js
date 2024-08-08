import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logoutUser,
  registerUser,
  searchUser,
  sendFriendRequest
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { multerUploads } from "../middlewares/multer.js";
import { validateData } from "../middlewares/validatorMiddleware.js";
import { acceptRequestValidator, loginSchema, sendFriendRequestValidator, signupSchema } from "../validators/userValidator.js";

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
router.route("/sendrequest").put(validateData(sendFriendRequestValidator), sendFriendRequest);
router.route("/acceptrequest").put(validateData(acceptRequestValidator), acceptFriendRequest);
router.route("/notifications").get(getMyNotifications);
router.route("/friends").get(getMyFriends);


export default router;
