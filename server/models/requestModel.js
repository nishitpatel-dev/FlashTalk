import mongoose, { Schema, model, Types } from "mongoose";

const requestSchema = new Schema({
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Accepted", "Rejected"],
  },

  sender: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiver: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Request =
  mongoose.models.Request || model("Request", requestSchema);
