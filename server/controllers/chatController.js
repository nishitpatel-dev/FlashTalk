import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { Chat } from "../models/chatModel.js";
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

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

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMyChats = async (req, res) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const transformedChat = chats.map(
    ({ _id, chatName, members, isGroupChat }) => {
      return {
        _id,
        isGroupChat,
        avatar: isGroupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [members[0].avatar.url],
        chatName: isGroupChat ? chatName : members[0].name,
        members: members.reduce((acc, curr) => {
          if (curr._id.toString() !== req.user.toString()) {
            acc.push(curr._id);
          }

          return acc;
        }, []),
      };
    }
  );

  return res.status(200).json({
    success: true,
    chats: transformedChat,
  });
};

export { newGroupChat, getMyChats };
