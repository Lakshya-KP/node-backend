import crypto from 'crypto';
import { PrismaExecutor } from '../types/prima.types.js';
import { RefreshTokenRepository } from '../../modules/auth/repositories/refresh-token.repository.js';

export class RefreshTokenService {

    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) { }

    generate(): string {
        return crypto.randomBytes(64).toString('hex');
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async createSession(db: PrismaExecutor, userId: number, refreshToken: string, expiresAt: Date) {
        return this.refreshTokenRepository.create(db, {
            userId,
            tokenHash: this.hashToken(refreshToken),
            expiresAt
        });
    }

    async revokeAllSessions(db: PrismaExecutor, userId: number) {
        return this.refreshTokenRepository.revokeAllByUserId(db, userId);
    }

    async findSession(db: PrismaExecutor, refreshToken: string) {
        return this.refreshTokenRepository.findByHash(db, this.hashToken(refreshToken));
    }

    async revokeSession(db: PrismaExecutor, refreshToken: string) {
        await this.refreshTokenRepository.revokeByHash(db, this.hashToken(refreshToken));
    }
}