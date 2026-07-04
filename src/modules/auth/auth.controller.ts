import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { TypedRequest } from "../../common/types/http.types.js";
import { LoginBody, RegisterBody } from "./auth.validator.js";
import { success } from "zod";

export class AuthController {
    constructor(private readonly authService: AuthService){}

    register = async (req: TypedRequest<RegisterBody>, res: Response) => {
        const user = await this.authService.register(req.body);

        res.status(201).json({
            success: true,
            data: user
        })
    }

    login = async (req: TypedRequest<LoginBody>, res: Response) => {
        const result = await this.authService.login(req.body);

        res.json({
            success: true,
            data: result
        })
    }

    me = (req: Request, res: Response) => {
        res.json({
            success: true,
            data: req.user
        })
    }
}