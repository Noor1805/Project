import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain uppercase letter")
      .regex(/[a-z]/, "Password must contain lowercase letter")
      .regex(/[0-9]/, "Password must contain number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

export const passwordResetSchema = z
  .object({
    token: z.string(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain uppercase letter")
      .regex(/[a-z]/, "Password must contain lowercase letter")
      .regex(/[0-9]/, "Password must contain number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const blueprintInputSchema = z.object({
  ideaTitle: z.string().min(3, "Title must be at least 3 characters").max(200),
  ideaDescription: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000),
  targetAudience: z.string().min(5, "Target audience description required"),
  platformType: z
    .enum(["web", "mobile", "desktop", "saas", "marketplace", "api", "other"])
    .default("web"),
  budgetRange: z
    .enum(["<10k", "10k-50k", "50k-100k", "100k-250k", "250k+"])
    .default("50k-100k"),
  technicalSkillLevel: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .default("intermediate"),
  criticModeEnabled: z.boolean().default(false),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type BlueprintInput = z.infer<typeof blueprintInputSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const validateBlueprintRequest = (data: unknown) => {
  return blueprintInputSchema.parse(data);
};
