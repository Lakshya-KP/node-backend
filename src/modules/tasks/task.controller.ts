import { Request, Response } from "express";
import { TaskService } from "./task.service.js";
import { createTaskBody, TaskParams, TaskQuery } from "./task.validator.js";
import { TypedRequest } from "../../common/types/http.types.js";
import { successResponse } from "../../common/utils/response.js";

export class TaskController {

    constructor(
        private readonly taskService: TaskService
    ) { }

    findAll = async (
        req: TypedRequest<{}, {}, TaskQuery>,
        res: Response
    ) => {

        const result = await this.taskService.findAll(req.user.userId, req.query);

        res.json(successResponse(result.tasks, result.meta));

    };

    findById = async (
        req: TypedRequest<{}, TaskParams>,
        res: Response
    ) => {
        const id = req.params.id;
        const userId = req.user.userId;
        const task = await this.taskService.findById(id, userId);
        res.json(successResponse(task));
    };

    update = async (
        req: TypedRequest<createTaskBody, TaskParams>,
        res: Response
    ) => {
        const id = req.params.id;
        const userId = req.user.userId;
        const task = await this.taskService.update(id, userId, req.body);
        res.json(successResponse(task));
    };

    delete = async (
        req: TypedRequest<{}, TaskParams>,
        res: Response
    ) => {
        const id = req.params.id;
        const userId = req.user.userId;
        const task = await this.taskService.delete(id, userId);
        res.json(successResponse(task));
    };

    create = async (
        req: TypedRequest<createTaskBody>,
        res: Response
    ) => {

        const task = await this.taskService.create(
            req.body.title,
            req.user.userId
        );

        res.status(201).json(successResponse(task));

    };
}