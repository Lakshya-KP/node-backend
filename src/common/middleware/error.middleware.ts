import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: { 
                message: err.message,
                code: err.name
            }
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}