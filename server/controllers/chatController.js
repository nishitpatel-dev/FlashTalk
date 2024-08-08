import {
  ALERT,
  NEW_ATTCHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { deleteFilesFromCloudniary, emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

const newGroupChat = async (req, res, next) => {
  try {
    const { chatName, members } = req.body;

    if (members.length < 2) {
      return next(
        new ErrorHandler("Group chat must have at least 2 members", 400)
      );
    }

    const allMembers = [...members, req.user];

    await Chat.create({
      chatName,
      isGroupChat: true,
      creator: req.user,
      members: allMembers,
    });

    emitEvent(req, ALERT, allMembers, `Welcome to ${chatName} group`);
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMyChats = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groupChats = await Chat.find({
      members: req.user,
      isGroupChat: true,
      creator: req.user,
    }).populate("members", "name avatar");

    const transformedGroupChat = groupChats.map(
      ({ _id, chatName, members, isGroupChat }) => ({
        _id,
        chatName,
        isGroupChat,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
      })
    );

    return res.status(200).json({
      success: true,
      groupChats: transformedGroupChat,
    });
  } catch (error) {
    next(error);
  }
};

const addmembers = async (req, res, next) => {
  try {
    const { chatId, members } = req.body;

    if (!members || members.length < 1) {
      return next(new ErrorHandler("Please provide members to add", 400));
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    if (!chat.isGroupChat) {
      return next(new ErrorHandler("This is not a group chat", 400));
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("You are not authorized to add members", 403)
      );
    }

    const allNewMembersPromise = members.map((i) => User.findById(i));

    const allMembers = await Promise.all(allNewMembersPromise);

    // console.log(...allMembers);
    // console.log([...allMembers]);

    const uniqueMembers = allMembers
      .filter((i) => !chat.members.includes(i._id.toString()))
      .map((i) => i._id);

    console.log(uniqueMembers);

    if (uniqueMembers.length < 1) {
      return next(new ErrorHandler("Members already added", 400));
    }

    chat.members.push(...uniqueMembers);

    if (chat.members.length > 100) {
      return next(new ErrorHandler("Group chat members limit exceeded", 400));
    }

    await chat.save();

    const allNewUsername = allMembers.map((i) => i.name).join(", ");

    // console.log(allNewUsername);

    emitEvent(req, ALERT, chat.members, `${allNewUsername} added to the group`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Members added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const removeMembers = async (req, res, next) => {
  try {
    const { userId, chatId } = req.body;

    const [chat, userThatWillBeRemoved] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, "name"),
    ]);

    // console.log(chat, userThatWillBeRemoved);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    if (!chat.isGroupChat) {
      return next(new ErrorHandler("This is not a group chat", 400));
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("You are not authorized to remove members", 403)
      );
    }

    if (chat.members.length <= 1) {
      return next(new ErrorHandler("You can't remove yourself", 400));
    }

    chat.members = chat.members.filter(
      (i) => i.toString() !== userId.toString()
    );

    await chat.save();

    emitEvent(
      req,
      ALERT,
      chat.members,
      `${userThatWillBeRemoved.name} removed from the group`
    );
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    // console.log(req.params);

    const chat = await Chat.findById(id);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    if (!chat.isGroupChat) {
      return next(new ErrorHandler("This is not a group chat", 400));
    }

    const present = chat.members.includes(req.user.toString());

    if (!present) {
      return next(new ErrorHandler("You are not a member of this group", 400));
    }

    const remainingMembers = chat.members.filter(
      (i) => i.toString() !== req.user.toString()
    );

    if (remainingMembers.length <= 1) {
      return next(new ErrorHandler("You can't leave the group", 400));
    }

    if (chat.creator.toString() === req.user.toString()) {
      const randomNumber = Math.floor(Math.random() * remainingMembers.length);

      const newCreator = remainingMembers[randomNumber];

      chat.creator = newCreator;
    }

    chat.members = remainingMembers;

    const user = await User.findById(req.user, "name");
    await chat.save();

    emitEvent(req, ALERT, chat.members, `${user.name} left the group`);

    return res.status(200).json({
      success: true,
      message: "You left the group successfully",
    });
  } catch (error) {
    next(error);
  }
};

const sendAttachment = async (req, res, next) => {
  try {
    const { chatId } = req.body;

    const [chat, me] = await Promise.all([
      Chat.findById(chatId),
      User.findById(req.user, "name"),
    ]);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    const files = req.files || [];

    if (files.length < 1) {
      return next(new ErrorHandler("Please provide files to send", 400));
    }

    //Upload files here
    const attachments = [];

    const messageForDB = {
      content: "",
      attachments,
      sender: req.user,
      chatId,
    };

    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: me._id,
        name: me.name,
      },
    };

    const message = await Message.create(messageForDB);

    emitEvent(req, NEW_ATTCHMENT, chat.members, {
      message: messageForRealTime,
      chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
      chatId,
    });

    return res.status(200).json({
      success: true,
      message: "Attachment sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getChatDeatils = async (req, res, next) => {
  try {
    if (req.query.populate == "true") {
      const chat = await Chat.findById(req.params.id)
        .populate("members", "name avatar")
        .lean();

      if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
      }

      chat.members = chat.members.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
      }));

      return res.status(200).json({
        success: true,
        chat,
      });
    } else {
      const chat = await Chat.findById(req.params.id);

      if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
      }

      return res.status(200).json({
        success: true,
        chat,
      });
    }
  } catch (error) {
    next(error);
  }
};

const renameGroup = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { name } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    if (!chat.isGroupChat) {
      return next(new ErrorHandler("This is not a group chat", 400));
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("You are not authorized to rename the group", 403)
      );
    }

    chat.chatName = name;

    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    res.status(200).json({
      success: true,
      message: "Group renamed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    const members = chat.members;

    if (chat.isGroupChat && chat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("You are not allowed to delete the chat", 403)
      );
    }

    if (!chat.isGroupChat && !chat.members.includes(req.user.toString())) {
      return next(
        new ErrorHandler("You are not allowed to delete the chat", 403)
      );
    }

    // We have to delete all the messages, attachments and files from the cloudniary here

    const messagesWithAttachments = await Message.find({
      chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const public_ids = [];

    messagesWithAttachments.forEach(({ attachments }) => {
      attachments.forEach(({ public_id }) => {
        public_ids.push(public_id);
      });
    });

    await Promise.all([
      deleteFilesFromCloudniary(public_ids),
      chat.deleteOne(),
      Message.deleteMany({ chatId }),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;

    const { page = 1 } = req.query;

    const limit = 20;
    const skip = (page - 1) * limit;

    const [messages, totalMessages] = await Promise.all([
      Message.find({ chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "name")
        .lean(),
      Message.countDocuments({ chatId }),
    ]);

    const totalPages = Math.ceil(totalMessages / limit);

    return res.status(200).json({
      success: true,
      messages,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addmembers,
  removeMembers,
  leaveGroup,
  sendAttachment,
  getChatDeatils,
  renameGroup,
  deleteChat,
  getMessages,
};
