import { JwtPayload } from "../common/types/jwt.types.ts";

export {};

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}