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
    console.log(decodedData);

    req.user = decodedData.id;

    next();
  } catch (error) {
    next(error);
  }
};

const isAdminAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies["flashTalk-admin-token"];

    if (!token) {
      return next(new ErrorHandler("Only admin can access", 401));
    }

    const adminId = jwt.verify(token, process.env.JWT_SECRET);

    if (adminId !== process.env.ADMIN_SECRET_KEY) {
      return next(new ErrorHandler("Only admin can access", 401));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { isAuthenticated, isAdminAuthenticated };
