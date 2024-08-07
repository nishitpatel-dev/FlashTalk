import express from "express";
import {
  addmembers,
  deleteChat,
  getChatDeatils,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachment,
} from "../controllers/chatController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { multerUploads } from "../middlewares/multer.js";
import {
  validateData,
  validateFormData,
  validateParams,
} from "../middlewares/validatorMiddleware.js";
import {
  addMembersValidator,
  chatIdValidator,
  groupChatValidator,
  leaveGroupValidator,
  removeMembersValidator,
  renameGroupValidator,
  sendAttachmentChatIdValidator,
  sendAttachmentValidator,
} from "../validators/chatValidator.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/newgroup").post(validateData(groupChatValidator), newGroupChat);
router.route("/mychats").get(getMyChats);
router.route("/mygroups").get(getMyGroups);
router
  .route("/mygroups/addmembers")
  .put(validateData(addMembersValidator), addmembers);
router
  .route("/mygroups/removemembers")
  .put(validateData(removeMembersValidator), removeMembers);
router
  .route("/leave/:id")
  .delete(validateParams(leaveGroupValidator), leaveGroup);

// Send attachment
router
  .route("/message")
  .post(
    multerUploads.array("files", 5),
    validateFormData(sendAttachmentChatIdValidator, sendAttachmentValidator),
    sendAttachment
  );

router.route("/message/:id").get(validateParams(chatIdValidator), getMessages);

// Get Messages

// Get Chat Details, rename, delete

router
  .route("/:id")
  .get(validateParams(chatIdValidator), getChatDeatils)
  .put(
    validateParams(chatIdValidator),
    validateData(renameGroupValidator),
    renameGroup
  )
  .delete(validateParams(chatIdValidator), deleteChat);

export default router;
