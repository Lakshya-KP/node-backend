import jwt, { type SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.types.js";
import { jwtConfig } from "../../config/jwt.js";

export class JwtService {
    generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn as SignOptions["expiresIn"] });
    }

    verifyToken(token: string): JwtPayload {
        return jwt.verify(token, jwtConfig.secret) as JwtPayload;
    }
}