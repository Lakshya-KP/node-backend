import { JwtService } from "../services/jwt.service.js";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export function createAuthenticationMiddleware(jwtService: JwtService) {return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) throw new UnauthorizedError("Missing Authorization error");

    const [schema, token] = authHeader.split(" ");

    if (schema !== "Bearer" || !token) throw new UnauthorizedError("Invalid Authorization Header");

    try {
        req.user = jwtService.verifyToken(token);
        next();
    } catch {
        throw new UnauthorizedError("Invalid or Expired Token");
    }
}}