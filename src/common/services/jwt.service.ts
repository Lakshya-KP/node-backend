import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { JwtPayload } from "../types/jwt.types.js";

export class JwtService {
    generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, env.JWT_SECRET, {expiresIn: "1h"});
    }

    verifyToken(token: string): JwtPayload {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    }
}