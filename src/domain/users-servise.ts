
import {usersRepository} from "../repositories/users-repository";
import { v4 as uuidv4 } from 'uuid';
import {UsersType, UsersWithPassType} from "../types";

export const usersService = {

    async createUser(
        login: string,
        password: string
    ): Promise<UsersType | null> {

        let newUser = {
            id: uuidv4(),
            login: login
        }
        // @ts-ignore
        return usersRepository.createUser(newUser)
    },

    async findUserById(id: string): Promise<UsersType | null> {
        return usersRepository.findUserById(id)
    },


    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findByLogin(login, password)
        if (!user) {
            return false
        } else {
            return true
        }
    },


    async getAllUsers(
        pageNumber: string = '1' || undefined,
        pageSize:string = '10' || undefined
    ): Promise<UsersType | undefined | null> {

        const users = await usersRepository.getAllUsersDb(+pageNumber, +pageSize)

        return users
    },

    async deleteUser (id: string
    ): Promise<boolean> {
        return usersRepository.deleteUser(id)
    }
}