import { AppError } from "../../common/errors/AppError.js";
import { NotFoundError } from "../../common/errors/NotFoundError.js";
import prisma from "../../config/prisma.js";
import { TaskQuery } from "./task.validator.js";
import { buildPaginationMeta } from "../../common/utils/pagination.js";
import { TaskRepository } from "./task.repository.js";

export class TaskService {

    constructor(private readonly taskRepository: TaskRepository){}

    async findAll(userId: number, query: TaskQuery) {
        const {tasks, total} = await prisma.$transaction(async (tx) => {
            const tasks = await this.taskRepository.findAll(tx, userId, query);
            const total = await this.taskRepository.count(tx, userId, { ...query, search: query.search });
            return { tasks, total };
        });
        if (!tasks) {
            throw new NotFoundError();
        }
        return {
            tasks,
            meta: buildPaginationMeta({
                page: query.page,
                limit: query.limit,
                total,
                itemCount: tasks.length
            })

        }
    }

    async findById(id: number, userId: number) {
        const task = await this.taskRepository.findById(prisma, { id, userId });
        if (!task) {
            throw new NotFoundError(`Task with ID: ${id} not found`);
        }
        return task;
    }

    async update(id: number, userId: number, data: { title: string }) {
        const updatedTask = await this.taskRepository.update(prisma, { id, userId, ...data });
        if (!updatedTask) {
            throw new AppError(500, "Error in updating a task");
        }
        return updatedTask;
    }

    async delete(id: number, userId: number) {
        const deletedTask = await this.taskRepository.delete(prisma, { id, userId });
        if (!deletedTask) {
            throw new AppError(500, "Error in deleting a task");
        }
        return deletedTask;
    }

    async create(title: string, userId: number) {
        const createdTask = await this.taskRepository.create(prisma, { title, userId });
        if (!createdTask) {
            throw new AppError(500, "Error in creating a task");
        }
        return createdTask;
    }
}