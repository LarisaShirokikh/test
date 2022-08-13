
import {usersCollection} from "../settings";
import {UsersType, UsersWithHashType} from "../types";

export const usersRepository = {

    async getAllUsersDb(
        pageNumber: number,
        pageSize: number): Promise<UsersType | undefined | null> {

        const usersCount = await usersCollection.count({})
        const pagesCount = Math.ceil(usersCount / pageSize)
        const users: UsersType[] = await usersCollection
            .find({}, {projection : {_id: 0 } })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const result = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: usersCount,
            items: users
        }
// @ts-ignore
        return result
    },

    async getAllUsers(): Promise<UsersType[]> {
        return usersCollection.find().sort('createdAt', -1).toArray()
    },

    async createUser(newUser: UsersWithHashType): Promise<UsersWithHashType> {
        const result = await usersCollection.insertOne(newUser)
        return newUser
    },

    async findUserById(id: string): Promise<UsersType | null> {
        let product = await usersCollection
            .findOne({id: id})
        if (product) {
            return product
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
