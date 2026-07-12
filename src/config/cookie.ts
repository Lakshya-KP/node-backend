import type { CookieOptions } from "express";
import { env } from "./env.js";

const sameSite: CookieOptions["sameSite"] = env.NODE_ENV === "production" ? "none" : "lax";

export const cookieConfig: { refreshToken: CookieOptions } = {
    refreshToken: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite,
        path: "/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};