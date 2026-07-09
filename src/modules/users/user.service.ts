import { NotFoundError } from "../../common/errors/NotFoundError.js"
import prisma from "../../config/prisma.js"
import { UserRepository } from "./repositories/user.repository.js";

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async delete(id: number){
        const userToBeDeleted = await this.userRepository.findById(prisma, id);
        if(!userToBeDeleted) throw new NotFoundError("User Not Found");
        
        const deletedUser = await this.userRepository.delete(prisma, id);

        return deletedUser;
    }

    async findByEmail(email: string) {
        return this.userRepository.findAll(prisma, { where: { email } }).then(users => users[0] ?? null);
    }

    async create(data: any, select?: any) {
        const options = select ? { data, select } : { data };
        return this.userRepository.create(prisma, options);
    }

    async findById(id: number) {
        return this.userRepository.findById(prisma, id);
    }
}