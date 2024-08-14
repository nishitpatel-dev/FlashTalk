import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { getBase64 } from "./helper.js";

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

const emitEvent = (req, event, users, data) => {
  console.log("Emitting event", event);
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const result = await Promise.all(uploadPromises);

    const formattedResult = result.map((item) => {
      return {
        public_id: item.public_id,
        url: item.secure_url,
      };
    });
    return formattedResult;
  } catch (error) {
    throw new Error("Error uploading files to cloudinary", error);
  }
};

const deleteFilesFromCloudniary = async (public_ids) => {
  console.log("Deleting files from cloudinary");
};

export {
  sendToken,
  cookieOption,
  emitEvent,
  deleteFilesFromCloudniary,
  uploadFilesToCloudinary,
};
