import {UsersRepository} from "../repositories/users-repository";
import {inject, injectable} from "inversify";



@injectable()
export class UsersService  {

    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {
        this.usersRepository =  new UsersRepository
    }
    async findUsers(pageSize: number, pageNumber: number) {

        return await this.usersRepository.findUsers(pageSize, pageNumber)
    }
    async getCount() {

        return await this.usersRepository.getCount()
    }
    async deleteUsers(id: string) {

        return await this.usersRepository.deleteUsers(id)
    }
    async findUsersById(userId: string) {
        return await this.usersRepository.findUsersById(userId)
    }
    async getAllUsers(PageNumber: number, PageSize: number ) {
        return await this.usersRepository.findUsers(PageNumber, PageSize )
    }

}

