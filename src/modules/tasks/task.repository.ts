import { PrismaExecutor } from "../../common/types/prima.types.js";

export class TaskRepository {

    async create(db: PrismaExecutor, data: { title: string; userId: number }) {
        return db.task.create({
            data
        });
    }

    async findAll(db: PrismaExecutor, userId: number, query: { completed?: boolean; search?: string; sort: string; order: 'asc' | 'desc'; page: number; limit: number }) {
        const skip = (query.page - 1) * query.limit;

        const where = {
            userId,
            ...(query.completed !== undefined && { completed: query.completed }),
            ...(query.search && { title: { contains: query.search } })
        };

        const orderBy = {
            [query.sort]: query.order
        };

        return db.task.findMany({
            where,
            orderBy,
            skip,
            take: query.limit
        });
    }

    async count(db: PrismaExecutor, userId: number, query: { completed?: boolean; search?: string }) {
        const where = {
            userId,
            ...(query.completed !== undefined && { completed: query.completed }),
            ...(query.search && { title: { contains: query.search } })
        };

        return db.task.count({
            where
        });
    }

    async findById(db: PrismaExecutor, data: { id: number; userId: number }) {
        return db.task.findUnique({
            where: data
        });
    }

    async update(db: PrismaExecutor, data: { id: number; userId: number; title: string }) {
        return db.task.updateMany({
            where: {
                id: data.id,
                userId: data.userId
            },
            data: {
                title: data.title
            }
        });
    }

    async delete(db: PrismaExecutor, data: { id: number; userId: number }) {
        return db.task.deleteMany({
            where: data
        });
    }
}