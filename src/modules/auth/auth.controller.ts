import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { TypedRequest } from "../../common/types/http.types.js";
import { LoginBody, RegisterBody } from "./auth.validator.js";
import { successResponse } from "../../common/utils/response.js";
import { refreshTokenSchema } from "./auth.validator.js";

export class AuthController {
    constructor(private readonly authService: AuthService){}

    register = async (req: TypedRequest<RegisterBody>, res: Response) => {
        const user = await this.authService.register(req.body);
        res.status(201).json(successResponse(user));
    }

    login = async (req: TypedRequest<LoginBody>, res: Response) => {
        const result = await this.authService.login(req.body);
        res.json(successResponse(result));
    }

    refresh = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const body = refreshTokenSchema.parse(req.body);
            const token = await this.authService.refresh(body.refreshToken);
            res.json(successResponse(token));
        } catch(err){
            next(err);
        }
    }

    me = (req: Request, res: Response) => {
        res.json(successResponse(req.user));
    }
}