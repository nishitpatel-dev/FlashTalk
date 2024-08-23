import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { cookieOption } from "../utils/features.js";

const adminLogin = async (req, res, next) => {
  try {
    const { secretKey } = req.body;

    const isMatch = secretKey === process.env.ADMIN_SECRET_KEY;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Secret Key",
      });
    }

    const token = jwt.sign(
      process.env.ADMIN_SECRET_KEY,
      process.env.JWT_SECRET
    );

    return res
      .status(200)
      .cookie("flashTalk-admin-token", token, {
        ...cookieOption,
        maxAge: 1000 * 60 * 15,
      })
      .json({
        success: true,
        message: "Admin Logged In Successfully",
      });
  } catch (error) {
    next(error);
  }
};

const adminLogout = async (req, res, next) => {
  try {
    return res.status(200).clearCookie("flashTalk-admin-token").json({
      success: true,
      message: "Admin Logged Out Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const adminVerify = async (req, res, next) => {
  try {
    return res.status(200).json({
      admin: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    const transformedUsers = await Promise.all(
      users.map(async ({ name, username, avatar, _id }) => {
        const [groups, friends] = await Promise.all([
          Chat.countDocuments({ isGroupChat: true, members: _id }),
          Chat.countDocuments({ isGroupChat: false, members: _id }),
        ]);

        return {
          name,
          username,
          avatar: avatar.url,
          _id,
          groups,
          friends,
        };
      })
    );

    return res.status(200).json({
      success: true,
      users: transformedUsers,
    });
  } catch (error) {
    next(error);
  }
};

const getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({})
      .populate("members", "name avatar")
      .populate("creator", "name avatar");

    const transformedChats = await Promise.all(
      chats.map(async ({ chatName, creator, members, isGroupChat, _id }) => {
        const totalMessages = await Message.countDocuments({ chatId: _id });

        return {
          _id,
          isGroupChat,
          name: chatName,
          avatar: members.slice(0, 3).map((member) => member.avatar.url),
          members: members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
          })),
          creator: {
            name: creator?.name || "None",
            avatar: creator?.avatar?.url || "",
          },
          totalMembers: members.length,
          totalMessages,
        };
      })
    );

    return res.status(200).json({
      success: true,
      chats: transformedChats,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({})
      .populate("sender", "name avatar")
      .populate("chatId", "isGroupChat");

    const transformMessages = messages.map(
      ({ content, attachments, _id, sender, createdAt, chatId }) => ({
        _id,
        attachments,
        content,
        createdAt,

        chatId: chatId?._id,
        isGroupChat: chatId?.isGroupChat,
        sender: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar.url,
        },
      })
    );

    return res.status(200).json({
      success: true,
      messages: transformMessages,
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const [groupsCount, userCount, messagesCount, totalChatCount] =
      await Promise.all([
        Chat.countDocuments({ isGroupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
      ]);

    const singleChatCount = totalChatCount - groupsCount;

    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await Message.find({
      createdAt: {
        $gte: last7Days,
        $lte: today,
      },
    }).select("createdAt");

    const messages = new Array(7).fill(0);

    last7DaysMessages.forEach((message) => {
      const index = today.getDate() - message.createdAt.getDate();
      messages[6 - index]++;
    });

    const stats = {
      groupsCount,
      singleChatCount,
      userCount,
      messagesCount,
      totalChatCount,
      messagesChart: messages,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllUsers,
  getAllChats,
  getAllMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  adminVerify,
};
