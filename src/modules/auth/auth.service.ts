import bcrypt from "bcrypt"
import prisma from "../../config/prisma.js";
import { LoginBody, RegisterBody } from "./auth.validator.js";
import { ConflictError } from "../../common/errors/ConflictError.js";
import { UnauthorizedError } from "../../common/errors/UnauthorizedError.js";
import { JwtService } from "../../common/services/jwt.service.js";
import { RefreshTokenService } from "../../common/services/refresh-token.service.js";

export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService
    ) {}

    async register(data: RegisterBody) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            }
        })
        if (existingUser) {
            throw new ConflictError(`User with email: ${data.email} already exists`);
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        })
        return user;
    }

    async login(data: LoginBody) {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            }
        })

        if (!user) throw new UnauthorizedError("Invalid email or password");

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

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

        const user = await prisma.user.findUnique({
            where: {
                id: session.userId
            }
        })

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