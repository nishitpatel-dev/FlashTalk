import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name Is Required" })
    .trim()
    .min(3, { message: "Name Must Be At Least Of 3 Chars" }),
  username: z
    .string({ required_error: "Username Is Required" })
    .trim()
    .min(3, { message: "Username Must Be At Least Of 3 Chars" }),
  password: z
    .string({ required_error: "Password Is Required" })
    .min(6, { message: "Password Must Be At Least Of 6 Chars" }),
  avatar: z.object({
    public_id: z.string({ required_error: "Public Id Is Required" }),
    url: z.string({ required_error: "Avatar Url Is Required" }),
  }),
});

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Username Is Required" })
    .trim()
    .min(3, { message: "Username Must Be At Least Of 3 Chars" }),
  password: z
    .string({ required_error: "Password Is Required" })
    .min(6, { message: "Password Must Be At Least Of 6 Chars" }),
});
