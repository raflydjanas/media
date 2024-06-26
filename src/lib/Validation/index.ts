import { z } from "zod";

export const SignupValidation = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
