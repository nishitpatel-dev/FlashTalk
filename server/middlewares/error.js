import { envMode } from "../app.js";

const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.statusCode = 400;
    err.message = `Duplicate field - ${error}`;
  }

  if (err.name == "CastError") {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: envMode === "Development" ? err : err.message,
  });
};

export { errorMiddleware };
