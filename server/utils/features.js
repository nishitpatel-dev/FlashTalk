import jwt from "jsonwebtoken";

const cookieOption = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

const sendToken = async (user, statusCode, message, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(statusCode).cookie("flashtalk-token", token, cookieOption).json({
    success: true,
    message,
  });
};

export { sendToken, cookieOption };
