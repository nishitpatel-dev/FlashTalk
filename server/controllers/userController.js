import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/features.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // console.log(username, password);

    const user = await User.findOne({ username }).select("+password");
    // console.log(user);

    if (!user) {
      return next(new Error("Invalid credentials"));
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return next(new Error("Invalid credentials"));
    }

    sendToken(user, 200, `Welcome Back ${user.name}`, res);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res) => {
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
};

const getMyProfile = async (req, res) => {};

export { login, registerUser, getMyProfile };
