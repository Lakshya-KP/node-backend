import { Request, Response } from "express";
import { TaskService } from "./task.service.js";
import { createTaskBody, TaskParams, TaskQuery } from "./task.validator.js";
import { TypedRequest } from "../../common/types/http.types.js";

export class TaskController {

    constructor(
        private readonly taskService: TaskService
    ) { }

    findAll = async (
        req: TypedRequest<{}, {}, TaskQuery>,
        res: Response
    ) => {

        const result = await this.taskService.findAll(req.user.userId, req.query);

        res.json({
            success: true,
            data: result.tasks,
            meta: result.meta
        });

    };

    findById = async (
        req: TypedRequest<{}, TaskParams>,
        res: Response
    ) => {
        const id = req.params.id;
        const userId = req.user.userId;
        const task = await this.taskService.findById(id, userId);
        res.json(task);
    };

    update = async (
        req: TypedRequest<createTaskBody, TaskParams>,
        res: Response
    ) => {
        const id = req.params.id;
        const userId = req.user.userId;
        const task = await this.taskService.update(id, userId, req.body);
        res.json(task);
    };

    delete = async (
        req: TypedRequest<{}, TaskParams>,
        res: Response
    ) => {
        const id = req.params.id;
        const userId = req.user.userId;
        const task = await this.taskService.delete(id, userId);
        res.json(task);
    };

    create = async (
        req: TypedRequest<createTaskBody>,
        res: Response
    ) => {

        const task = await this.taskService.create(
            req.body.title,
            req.user.userId
        );

        res.status(201).json(task);

    };
}