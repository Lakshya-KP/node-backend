import crypto from 'crypto';
import prisma from '../../config/prisma.js';

export class RefreshTokenService {
    generate(): string {
        return crypto.randomBytes(64).toString('hex');
    }

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async createSession(userId: number, refreshToken: string, expiresAt: Date) {
        const tokenHash = this.hashToken(refreshToken);
        return prisma.refreshToken.create({
            data: {
                tokenHash, 
                userId,
                expiresAt
            }
        })
    }

    async findSession(refreshToken: string){
        const tokenHash = this.hashToken(refreshToken);
        return prisma.refreshToken.findUnique({
            where: {
                tokenHash
            }
        })
    }

    async revokeSession(refreshToken: string){
        const tokenHash = this.hashToken(refreshToken);
        await prisma.refreshToken.update({
            where: {
                tokenHash
            },
            data: {
                revokedAt: new Date()
            }
        })
    }
}