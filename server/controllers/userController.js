import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
import { Request } from "../models/requestModel.js";
import {
  cookieOption,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // console.log(username, password);

    const user = await User.findOne({ username }).select("+password");
    // console.log(user);

    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 404));
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials"));
    }

    sendToken(user, 200, `Welcome Back ${user.name}`, res);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, bio, username, password } = req.body;

    const file = req.file;

    if (!file) {
      return next(new ErrorHandler("Please upload an image", 400));
    }

    const result = await uploadFilesToCloudinary([file]);

    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const user = await User.create({
      name,
      bio,
      username,
      password,
      avatar,
    });

    sendToken(user, 201, "User registered successfully", res);
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res) => {
  res
    .status(200)
    .cookie("flashtalk-token", "", { ...cookieOption, maxAge: 0 })
    .json({ success: true, message: "Logged out successfully" });
};

const searchUser = async (req, res, next) => {
  try {
    const { name = "" } = req.query;

    const myChats = await Chat.find({ isGroupChat: false, members: req.user });

    const allUsersFromMyChats = myChats
      .flatMap((chat) => chat.members)
      .concat([req.user]);

    const allUsersExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersFromMyChats },
      name: { $regex: name, $options: "i" },
    });

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const sendFriendRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.body;

    const request = await Request.findOne({
      $or: [
        { sender: req.user, receiver: receiverId },
        { sender: receiverId, receiver: req.user },
      ],
    });

    if (request) {
      return next(new ErrorHandler("Request already sent", 400));
    }

    await Request.create({
      sender: req.user,
      receiver: receiverId,
    });

    emitEvent(req, NEW_REQUEST, [receiverId]);

    return res
      .status(200)
      .json({ success: true, message: "Friend Request sent" });
  } catch (error) {
    next(error);
  }
};

const acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!request) {
      return next(new ErrorHandler("Request not found", 404));
    }

    if (request.receiver._id.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("You are not authorized to accept this request", 401)
      );
    }

    if (!accept) {
      await request.deleteOne();

      return res
        .status(200)
        .json({ success: true, message: "Freind Request Rejected" });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      Chat.create({
        members,
        chatName: `${request.sender.name} - ${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Freind Request Accepted",
      senderId: request.sender._id,
    });
  } catch (error) {
    next(error);
  }
};

const getMyNotifications = async (req, res, next) => {
  try {
    const requests = await Request.find({ receiver: req.user }).populate(
      "sender",
      "name avatar"
    );

    const allRequest = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      success: true,
      allRequest,
    });
  } catch (error) {
    next(error);
  }
};

const getMyFriends = async (req, res, next) => {
  try {
    const { chatId } = req.query;

    const chats = await Chat.find({
      members: req.user,
      isGroupChat: false,
    }).populate("members", "name avatar");

    const friends = chats.map(({ members }) => {
      const otherMember = members.find(
        (member) => member._id.toString() !== req.user.toString()
      );

      return {
        _id: otherMember._id,
        name: otherMember.name,
        avatar: otherMember.avatar.url,
      };
    });

    if (chatId) {
      const chat = await Chat.findById(chatId);

      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );

      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  login,
  registerUser,
  getMyProfile,
  logoutUser,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};
