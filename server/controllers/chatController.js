import { Chat } from "../models/chatModel";
import { ErrorHandler } from "../utils/utility";

const newGroupChat = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    if (members.length < 2) {
      return next(
        new ErrorHandler("Group chat must have at least 2 members", 400)
      );
    }

    const allMembers = [...members, req.user];

    await Chat.create({
      chatName: name,
      isGroupChat: true,
      creator: req.user,
      members: allMembers,
    });
  } catch (error) {
    next(error);
  }
};

export { newGroupChat };
