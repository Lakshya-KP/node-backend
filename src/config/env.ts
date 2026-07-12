import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

    JWT_EXPIRES_IN: z.string().default("15m"),

    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);