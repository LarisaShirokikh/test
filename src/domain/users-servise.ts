
import {usersRepository} from "../repositories/users-repository";



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

   /* async createUser(login: string, password: string): Promise<UsersEmailConfDataType> {
        const newUser = {
            id: (uuidv4).toString(),
            login,
            password,
            isConfirmed: false
        }
        const createUserDb = await usersRepository.createUser(newUser)
        return newUser
    }*/
}
