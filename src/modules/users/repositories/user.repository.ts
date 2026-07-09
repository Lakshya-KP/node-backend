import { PrismaExecutor } from "../../../common/types/prima.types.js";

export class UserRepository {

    async findById(db: PrismaExecutor, id: number) {
        return db.user.findUnique({
            where: { id }
        });
    }

    async delete(db: PrismaExecutor, id: number) {
        return db.user.delete({
            where: { id }
        });
    }

    async create(db: PrismaExecutor, options: any) {
        return db.user.create(options);
    }

    async update(db: PrismaExecutor, id: number, data: any) {
        return db.user.update({ where: { id }, data });
    }

    async findAll(db: PrismaExecutor, args: any = {}) {
        return db.user.findMany(args);
    }
}
