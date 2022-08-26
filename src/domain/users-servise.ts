import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
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
    },
    async createNewUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt( 10);//получаем соль с помощью библиотеки бикрипт
        const passwordHash = await this._generateHash(password, passwordSalt)//гененрируем хэш
        const newUser: UsersDBType = {
            id: uuidv4(),
            login: login,
            email,
            passwordSalt,
            passwordHash,
            createdAt: new Date()
        }
        return usersRepository.createNewUser(newUser)



    }
}
