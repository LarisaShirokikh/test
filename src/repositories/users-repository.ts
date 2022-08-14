
import {usersCollection} from "../settings";
import {Pagination, UsersType, UsersWithHashType} from "../types";
import {ObjectId} from "mongodb";

export const usersRepository = {

    async getAllUsersDb(
        pageNumber: number,
        pageSize: number
    ): Promise<Pagination<UsersType[]>> {

        const users = await usersCollection
            .find({})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize).toArray()

        const usersCount = await usersCollection.count({})
        const pagesCount = Math.ceil(usersCount / pageSize)
        const result: Pagination<UsersType[]> = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: usersCount,
            items: users.map((user) => {
                return {
                    id: user.id,
                    login: user.login
                }
        })
        }
        return result


    },

    async createUser(newUser: UsersWithHashType): Promise<UsersWithHashType> {
        const result = await usersCollection.insertOne(newUser)
        return newUser
    },

    async findUserById(id: string): Promise<UsersWithHashType | null> {
        let user = await usersCollection
            .findOne({id: id})
        if (user) {
            return user
        } else {
            return null
        }
    },

    async findByLogin(login: string) {
        const user = await usersCollection
            .findOne({ login: login } )

            return user

    },

    async deleteUser (id: string): Promise<boolean> {
        const result = await usersCollection
            .deleteOne({id: id})
        return result.deletedCount === 1
    },

    async getUserById(login: string): Promise<UsersType | null> {
        const user: UsersType | null = await usersCollection
            .findOne({login: login}, {projection: {_id: 0}})
        return user;
    },
}
