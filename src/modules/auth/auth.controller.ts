import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { TypedRequest } from "../../common/types/http.types.js";
import { LoginBody, RegisterBody } from "./auth.validator.js";
import { successResponse } from "../../common/utils/response.js";
import { cookieConfig } from "../../config/cookie.js";

export class AuthController {
    constructor(private readonly authService: AuthService){}

    register = async (req: TypedRequest<RegisterBody>, res: Response) => {
        const user = await this.authService.register(req.body);
        res.status(201).json(successResponse(user));
    }

    login = async (req: TypedRequest<LoginBody>, res: Response) => {
        const result = await this.authService.login(req.body);
        res.cookie("refreshToken", result.refreshToken, cookieConfig.refreshToken);
        res.json(successResponse({ accessToken: result.token }));
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try{
            // const body = logoutSchema.parse(req.body);
            const refreshToken = req.cookies.refreshToken;
            await this.authService.logout(refreshToken);
            res.clearCookie("refreshToken", cookieConfig.refreshToken);
        } catch(err){
            next(err);
        }
    }

    logoutAll = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const userId = req.user.userId;
            await this.authService.logoutAll(userId);
        } catch(err){
            next(err);
        }
    }

    refresh = async(req: TypedRequest<{ refreshToken: string }>, res: Response, next: NextFunction) => {
        try{
            const refreshToken = req.cookies.refreshToken;
            const tokens = await this.authService.refresh(refreshToken);
            res.cookie("refreshToken", tokens.refreshToken, cookieConfig.refreshToken);
            res.json(successResponse({ accessToken: tokens.accessToken }));
        } catch(err){
            next(err);
        }
    }

    me = (req: Request, res: Response) => {
        res.json(successResponse(req.user));
    }
}