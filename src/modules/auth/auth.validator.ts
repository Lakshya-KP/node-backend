import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50),

    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
})

export const refreshTokenSchema = z.object({
    refreshToken: z.string().trim().min(1, "Refresh token is required"),
})

export const logoutSchema = z.object({
    refreshToken: z.string().trim().min(1, "Refresh token is required"),
})

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;