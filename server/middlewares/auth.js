import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies["flashtalk-token"];

    if (!token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedData.id;

    next();
  } catch (error) {}
};

export { isAuthenticated };
