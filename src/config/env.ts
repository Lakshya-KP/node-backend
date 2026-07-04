import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

    JWT_EXPIRES_IN: z.string().default("15m"),
});

export const env = envSchema.parse(process.env);