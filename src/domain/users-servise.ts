import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {UsersSaltType, UsersType} from "../types";

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
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)
        if (!user) return false
        // @ts-ignore
        if (user.password !== password) {
            return false
        }
        return user
    }
}
