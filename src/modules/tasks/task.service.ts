import { AppError } from "../../common/errors/AppError.js";
import { NotFoundError } from "../../common/errors/NotFoundError.js";
import prisma from "../../config/prisma.js";
import { TaskQuery } from "./task.validator.js";

export class TaskService {

    async findAll(userId: number, query: TaskQuery) {
        const skip = (query.page - 1) * query.limit;

        const where = {
            userId,
            ...(query.completed !== undefined && { completed: query.completed }),
            ...(query.search && { title: { contains: query.search }})
        }

        const orderBy = {
            [query.sort]: query.order
        }

        const [tasks, total] = await prisma.$transaction([
            prisma.task.findMany({
                where,
                orderBy,
                skip,
                take: query.limit
            }),
            prisma.task.count({
                where
            })
        ])
        if (!tasks) {
            throw new NotFoundError();
        }
        return {
            tasks,
            meta: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
                hasNextPage: skip + tasks.length < total,
                hasPreviousPage: query.page > 1
            } 

        }
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