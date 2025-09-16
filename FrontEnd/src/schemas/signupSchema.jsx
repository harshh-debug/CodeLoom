import { z } from "zod";

export const signupSchema = z.object({
	firstName: z
		.string()
		.min(3, "First name should have at least 3 characters")
		.max(20, "First name should not exceed 20 characters")
		.regex(/^[A-Za-z]+$/, "First name should only contain letters"),

	lastName: z
		.string()
		.min(3, "Last name should have at least 3 characters"),

	emailId: z.string().email("Invalid email address"),

	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.superRefine((val, ctx) => {
			if (!/[a-z]/.test(val)) {
				ctx.addIssue({
					code: "custom",
					message: "Password must include at least one lowercase letter",
				});
			}
			if (!/[A-Z]/.test(val)) {
				ctx.addIssue({
					code: "custom",
					message: "Password must include at least one uppercase letter",
				});
			}
			if (!/[0-9]/.test(val)) {
				ctx.addIssue({
					code: "custom",
					message: "Password must include at least one number",
				});
			}
		}),
});
