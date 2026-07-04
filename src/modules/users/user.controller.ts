import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { TypedRequest } from "../../common/types/http.types.js";
import { UserParams } from "./user.validator.js";
import { successResponse } from "../../common/utils/response.js";

export class UserController {
    constructor(private readonly userService: UserService){}
    delete = async(req: TypedRequest<{}, UserParams>, res: Response) => {
        const deletedUser = await this.userService.delete(req.params.id);
        res.status(201).json(successResponse(deletedUser));
    }
}