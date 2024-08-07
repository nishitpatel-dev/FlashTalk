import { z } from "zod";

export const groupChatValidator = z.object({
  chatName: z
    .string({ required_error: "Group Name Is Required" })
    .trim()
    .min(3, { message: "Group Name Must Be At Least Of 3 Chars" }),
  members: z
    .array(
      z.string({ invalid_type_error: "Each member ID must be a string" }),
      {
        required_error: "Please Provide Members",
      }
    )
    .min(2, {
      message: "Group Must Have At Least 2 Members",
    })
    .max(100, { message: "Group Can Have At Most 100 Members" }),
});

export const addMembersValidator = z.object({
  chatId: z.string({ required_error: "Chat ID Is Required" }).trim(),
  members: z
    .array(
      z.string({ invalid_type_error: "Each member ID must be a string" }),
      {
        required_error: "Please Provide Members",
      }
    )
    .min(1, {
      message: "Please Provide At Least 1 Member",
    })
    .max(99, { message: "Group Can Have At Most 99 Members" }),
});

export const removeMembersValidator = z.object({
  chatId: z.string({ required_error: "Chat ID Is Required" }).trim(),
  userId: z.string({ required_error: "User ID Is Required" }).trim(),
});

export const leaveGroupValidator = z.object({
  id: z.string({ required_error: "Chat ID Is Required" }).trim(),
});

export const sendAttachmentChatIdValidator = z.object({
  chatId: z.string({ required_error: "Chat ID Is Required" }).trim(),
});

export const sendAttachmentValidator = z
  .array(
    z.object({}, { invalid_type_error: "Should Be An Object" }).passthrough(),
    {
      required_error: "Please Provide Files",
    }
  )
  .min(1, {
    message: "Please Provide At Least 1 File",
  })
  .max(5, {
    message: "You Can Upload At Most 5 Files",
  });

export const chatIdValidator = z.object({
  id: z.string({ required_error: "Chat ID Is Required" }).trim(),
});

export const renameGroupValidator = z.object({
  name: z
    .string({ required_error: "Group Name Is Required" })
    .trim()
    .min(3, { message: "Group Name Must Be At Least Of 3 Chars" }),
});
