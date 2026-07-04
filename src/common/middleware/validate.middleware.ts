import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";

type RequestPart = "body" | "params" | "query";

export function validate(
    schema: ZodTypeAny,
    target: RequestPart = "body"
) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const parsed = schema.parse(req[target]);

            if (target === "body") {
                req.body = parsed;
            } else {
                // In Express 5, req.query and req.params are read-only getters,
                // so we can't reassign them directly. Redefine the property
                // with the validated (and coerced) value instead.
                Object.defineProperty(req, target, {
                    value: parsed,
                    writable: true,
                    configurable: true,
                    enumerable: true,
                });
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues,
                });
            }

            next(error);
        }
    };
}