import { NotFoundError } from "../../common/errors/NotFoundError.js"
import prisma from "../../config/prisma.js"

export class UserService {
    async delete(id: number){
        const userToBeDeleted = await prisma.user.findUnique({
            where: {id}
        })
        if(!userToBeDeleted) throw new NotFoundError("User Not Found");
        
        const deletedUser = await prisma.user.delete({
            where : {id}
        })

        return deletedUser;
    }
}