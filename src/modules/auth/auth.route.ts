import { RequestHandler, Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { loginSchema, registerSchema, refreshTokenSchema } from "./auth.validator.js";

export function createAuthRouter(authController: AuthController, authMiddleware: RequestHandler) {
    const router = Router();

    router.get("/me", authMiddleware, authController.me)
    router.post("/refresh", validate(refreshTokenSchema), authController.refresh)
    router.post("/login", validate(loginSchema), authController.login)
    router.post("/logout", authController.logout)
    router.post("/logout-all", authMiddleware, authController.logoutAll)
    router.post("/register", validate(registerSchema), authController.register);

    return router;
}