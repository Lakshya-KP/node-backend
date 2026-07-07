import jwt, { type SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.types.js";
import { jwtConfig } from "../../config/jwt.js";

export class JwtService {
    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, jwtConfig.accessToken.secret, { expiresIn: jwtConfig.accessToken.expiresIn as SignOptions["expiresIn"] });
    }

    verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, jwtConfig.accessToken.secret) as JwtPayload;
    }
}