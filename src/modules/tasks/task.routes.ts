import { Router, RequestHandler } from "express";
import { TaskController } from "./task.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { createTaskBodySchema, taskParamsSchema, taskQuerySchema } from "./task.validator.js";

export function createTaskRouter(
    taskController: TaskController, authenticationMiddleWare: RequestHandler
) {
    const router = Router();

    router.get("/", authenticationMiddleWare, validate(taskQuerySchema, "query"), taskController.findAll as unknown as RequestHandler);
    router.post("/", authenticationMiddleWare, validate(createTaskBodySchema), taskController.create);
    router.put("/:id", authenticationMiddleWare, validate(taskParamsSchema, "params"), validate(createTaskBodySchema), taskController.update as unknown as RequestHandler);
    router.get("/:id", authenticationMiddleWare, validate(taskParamsSchema, "params"), taskController.findById as unknown as RequestHandler);
    router.delete("/:id", authenticationMiddleWare, validate(taskParamsSchema, "params"), taskController.delete as unknown as RequestHandler);

    return router;
}