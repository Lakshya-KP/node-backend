import { Role } from "@prisma/client";
import { RequestHandler } from "express";
import { ForbiddenError } from "../errors/ForbiddenError.js";

export function authorize(...roles: Role[]): RequestHandler {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) throw new ForbiddenError("Access Denied");
        next();
    };
}