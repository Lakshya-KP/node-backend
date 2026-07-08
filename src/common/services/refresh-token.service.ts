import crypto from 'crypto';
import prisma from '../../config/prisma.js';
import { PrismaExecutor } from '../types/prima.types.js';

export class RefreshTokenService {
    generate(): string {
        return crypto.randomBytes(64).toString('hex');
    }

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async createSession(db: PrismaExecutor, userId: number, refreshToken: string, expiresAt: Date) {
        const tokenHash = this.hashToken(refreshToken);
        return db.refreshToken.create({
            data: {
                tokenHash, 
                userId,
                expiresAt
            }
        })
    }

    async findSession(db: PrismaExecutor, refreshToken: string){
        const tokenHash = this.hashToken(refreshToken);
        return db.refreshToken.findUnique({
            where: {
                tokenHash
            }
        })
    }

    async revokeSession(db: PrismaExecutor, refreshToken: string){
        const tokenHash = this.hashToken(refreshToken);
        await db.refreshToken.update({
            where: {
                tokenHash
            },
            data: {
                revokedAt: new Date()
            }
        })
    }
}