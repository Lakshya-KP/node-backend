import { PrismaExecutor } from "../../../common/types/prima.types.js";

export class RefreshTokenRepository {
    async create(
        db: PrismaExecutor,
        data: {
            userId: number,
            tokenHash: string,
            expiresAt: Date
        }
    ) {
        return db.refreshToken.create({
            data,
        })
    }

    async findByHash(db: PrismaExecutor, tokenHash: string) {
        return db.refreshToken.findUnique({
            where: {
                tokenHash
            },
        })
    }

    async revokeByHash(db: PrismaExecutor, tokenHash: string) {
        await db.refreshToken.updateMany({
            where: {
                tokenHash,
                revokedAt: null
            },
            data: {
                revokedAt: new Date(),
            }
        })
    }

    async revokeAllByUserId(db: PrismaExecutor, userId: number) {
        return db.refreshToken.updateMany({
            where: {
                userId, 
                revokedAt: null
            },
            data: {
                revokedAt: new Date(),
            }
        })
    }
}