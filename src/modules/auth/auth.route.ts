import { RequestHandler, Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.validator.js";

export function createAuthRouter(authController: AuthController, authMiddleware: RequestHandler) {
    const router = Router();

    router.get("/me", authMiddleware, authController.me)
    router.post("/refresh", authController.refresh)
    router.post("/login", validate(loginSchema), authController.login)
    router.post("/register", validate(registerSchema), authController.register);

    return router;
}