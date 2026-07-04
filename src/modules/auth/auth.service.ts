import bcrypt from "bcrypt"
import prisma from "../../config/prisma.js";
import { LoginBody, RegisterBody } from "./auth.validator.js";
import { ConflictError } from "../../common/errors/ConflictError.js";
import { UnauthorizedError } from "../../common/errors/UnauthorizedError.js";
import { JwtService } from "../../common/services/jwt.service.js";

export class AuthService {

    constructor(private readonly jwtService: JwtService) {}

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

        const token = this.jwtService.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        return { token, user: { id: user.id, name: user.name, email: user.email } };
    }
}