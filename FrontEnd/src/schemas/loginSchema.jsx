import { z } from "zod";
export const loginSchema = z.object({
	emailId: z.string().email("Invalid email address"),
	password: z.string().min(6, "password must be atleast 6 characters"),
});
