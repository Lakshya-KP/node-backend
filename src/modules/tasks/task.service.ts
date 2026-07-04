import { AppError } from "../../common/errors/AppError.js";
import { NotFoundError } from "../../common/errors/NotFoundError.js";
import prisma from "../../config/prisma.js";
import { TaskQuery } from "./task.validator.js";

export class TaskService {

    async findAll(userId: number, query: TaskQuery) {
        const skip = (query.page - 1) * query.limit;
        const tasks= await prisma.task.findMany({
            where: {
                userId
            },
            skip,
            take: query.limit,
            orderBy: {
                createdAt: "desc"
            }
        });
        if (!tasks) {
            throw new NotFoundError();
        }
        return tasks;
    }

    async findById(id: number, userId: number) {
        const task = await prisma.task.findUnique({
            where: {
                id,
                userId
            }
        });
        if (!task) {
            throw new NotFoundError(`Task with ID: ${id} not found`);
        }
        return task;
    }

    async update(id: number, userId: number, data: { title: string }) {
        const updatedTask = await prisma.task.updateMany({
            where: {
                id,
                userId
            },
            data
        });
        if (!updatedTask) {
            throw new AppError(500, "Error in updating a task");
        }
        return updatedTask;
    }

    async delete(id: number, userId: number) {
        const deletedTask = await prisma.task.deleteMany({
            where: {
                id,
                userId
            }
        });
        if (!deletedTask) {
            throw new AppError(500, "Error in deleting a task");
        }
        return deletedTask;
    }

    async create(title: string, userId: number) {
        const createdTask = await prisma.task.create({
            data: {
                title,
                userId
            }
        });
        if (!createdTask) {
            throw new AppError(500, "Error in creating a task");
        }
        return createdTask;
    }
}