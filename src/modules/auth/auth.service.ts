import bcrypt from "bcrypt"
import { LoginBody, RegisterBody } from "./auth.validator.js";
import { ConflictError } from "../../common/errors/ConflictError.js";
import { UnauthorizedError } from "../../common/errors/UnauthorizedError.js";
import { JwtService } from "../../common/services/jwt.service.js";
import { RefreshTokenService } from "../../common/services/refresh-token.service.js";
import { UserService } from "../users/user.service.js";
import prisma from "../../config/prisma.js";

export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly userService: UserService
    ) {}

    async register(data: RegisterBody) {
        const existingUser = await this.userService.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError(`User with email: ${data.email} already exists`);
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userService.create({
            name: data.name,
            email: data.email,
            password: hashedPassword
        }, { id: true, name: true, email: true, createdAt: true });
        return user;
    }

    async login(data: LoginBody) {
        const user = await this.userService.findByEmail(data.email);

        if (!user) throw new UnauthorizedError("Invalid email or password");

        const isPasswordValid = await bcrypt.compare(data.password, (user as any).password);

        if (!isPasswordValid) throw new UnauthorizedError("Invalid email or password");

        const token = this.jwtService.generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        const refreshToken = this.refreshTokenService.generate();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.refreshTokenService.createSession(prisma, user.id, refreshToken, expiresAt);

        return { token, refreshToken, user: { id: user.id, name: user.name, email: user.email } };
    }

    async logout(refreshToken: string) {
        await this.refreshTokenService.revokeSession(prisma, refreshToken);
    }

    async logoutAll(userId: number) {
        await this.refreshTokenService.revokeAllSessions(prisma, userId);
    }

    async refresh(refreshToken: string){
        const session = await this.refreshTokenService.findSession(prisma, refreshToken);
        if(!session){
            throw new UnauthorizedError("Invalid refresh token");
        }

        if(session.revokedAt){
            throw new UnauthorizedError("Refresh token revoked");
        }

        if(session.expiresAt < new Date()){
            throw new UnauthorizedError("Refresh token expired");
        }

        const user = await this.userService.findById(session.userId);

        if(!user){
            throw new UnauthorizedError("User not found");
        }

        const accessToken = this.jwtService.generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        const newRefreshToken = this.refreshTokenService.generate();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.$transaction(async (tx) => {
            await this.refreshTokenService.revokeSession(tx, refreshToken);
            await this.refreshTokenService.createSession(tx, user.id, newRefreshToken, expiresAt);
        })


        return { accessToken: accessToken, refreshToken: newRefreshToken };
    }
}