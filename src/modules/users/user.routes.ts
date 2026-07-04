import { RequestHandler, Router } from "express";
import { UserController } from "./user.controller.js";
import { authorize } from "../../common/middleware/authorize.middleware.js";
import { Role } from "@prisma/client";
import { validate } from "../../common/middleware/validate.middleware.js";
import { userParamsSchema } from "./user.validator.js";

export function createUserRouter(userController: UserController, authMiddleWare: RequestHandler){
    const router = Router();

    router.delete("/:id", authMiddleWare, authorize(Role.ADMIN), validate(userParamsSchema, "params"), userController.delete as unknown as RequestHandler);

    return router;
}