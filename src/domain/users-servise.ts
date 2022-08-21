import {v4 as uuidv4} from 'uuid';
import {usersRepository} from "../repositories/users-repository";
import {UsersDBType, UsersType} from "../types";


export const usersService = {

    async findUsers(pageSize: number, pageNumber: number) {

        return await usersRepository.findUsers(pageSize, pageNumber)
    },
    async getCount() {

        return await usersRepository.getCount()
    },
    async deleteUsers(id: string) {

        return await usersRepository.deleteUsers(id)
    },


    async findUsersById(userId: string) {
        return await usersRepository.findUsersById(userId)
    },

    async createUser(login: string, password: string): Promise<UsersType> {
        const newUser = {
            id: (uuidv4).toString(),
            login,
            password,
            isConfirmed: false
        }
        const createUserDb = await usersRepository.createUser(newUser)
        return createUserDb
    }
}
