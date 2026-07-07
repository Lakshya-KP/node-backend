import { env } from "./env.js";

export const jwtConfig = {
    accessToken: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN
    }, 

    refreshToken: {
        expiresInDays: 7
    }
};