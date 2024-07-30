import { User } from "../models/userModel.js";

const login = (req, res) => {
  res.send("Login route");
};

const registerUser = async (req, res) => {
  // await User.create({
  //   name: "Nishit",
  //   username: "abhi",
  //   password: "123456",
  //   avatar: {
  //     public_id: "123",
  //     url: "https://www.google.com",
  //   },
  // });

  res.status(201).json({ message: "User registered successfully" });
};

export { login, registerUser };
