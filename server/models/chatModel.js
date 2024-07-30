import mongoose, { Schema, model, Types } from "mongoose";

const chatSchema = new Schema({
  chatName: {
    type: String,
    required: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  creator: {
    type: Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Chat = mongoose.models.Chat || model("Chat", chatSchema);
