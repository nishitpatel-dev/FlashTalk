import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { cookieOption, sendToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

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
    const { name, username, password, avatar } = req.body;

    // console.log(req.body.name);
    // console.log(req.file);

    const user = await User.create({
      name,
      username,
      password,
      avatar: {
        public_id: avatar.public_id,
        url: avatar.url,
      },
    });

    sendToken(user, 201, "User registered successfully", res);
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

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

const searchUser = async (req, res) => {
  const { name } = req.query;

  // console.log(name);

  res.status(200).json({ success: true, message: "User found" });
};

export { login, registerUser, getMyProfile, logoutUser, searchUser };
