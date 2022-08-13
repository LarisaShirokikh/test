
import bcrypt  from 'bcrypt';
import {usersRepository} from "../repositories/users-repository";
import { v4 as uuidv4 } from 'uuid';
import {Pagination, UsersType, UsersWithHashType} from "../types";

export const usersService = {

    async createUser(
        login: string,
        password: string
    ): Promise<UsersWithHashType | null> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UsersWithHashType = {
            id: uuidv4(),
            login: login,
            passwordHash,
            passwordSalt,
        }

        return usersRepository.createUser(newUser)
    },

    async findUserById(id: string): Promise<UsersType | null> {
        return usersRepository.findUserById(id)
    },


    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findByLogin(login)
        if (!user) return false
        const passwordHash = await this._generateHash(password,
            user.passwordSalt)
        if (user.passwordHash === passwordHash) {
            return true
        }
        return false
    },


    async getAllUsers(
        pageNumber: string,
        pageSize:string
    ): Promise<Pagination<UsersType[]> | null> {

        const users = await usersRepository
            .getAllUsersDb(+pageNumber, +pageSize)

        return users
    },

    async deleteUser (id: string
    ): Promise<boolean> {
        return usersRepository.deleteUser(id)
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        console.log('hash: ' + hash)
        return hash
    }
}
