import {UsersDBType, UsersEmailConfDataType, UsersType, UsersWithPassType} from "../types";
import {usersCollection, usersEmailConfDataCollection} from "../settingses/db";
import {usersService} from "../domain/users-servise";



export const usersRepository = {

    async createUser(user: UsersType): Promise<UsersType> {
        const newUser = await usersCollection.insertOne(user)
        return user

    },
    async findUsers(pageSize: number, pageNumber: number) {
        return await usersCollection.find({}, {
            projection: {
                _id: 0, passwordHash: 0,
                passwordSalt: 0
            }
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
    },
    async getCount() {
        return await usersCollection.countDocuments()
    },
    async deleteUsers(id: string) {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findUsersById(userId: string) {
        return await usersCollection.findOne({id: userId})
    },
    async findUserByConfirmCode(confirmationCode: string) {
        const emailData = await usersEmailConfDataCollection.findOne({confirmationCode: confirmationCode}, {projection: {_id: 0}})

        const accountData = await usersCollection.findOne({email: emailData?.email}, {projection: {_id: 0}})

        if(emailData === null && accountData === null) {
            const user = {
                accountData: undefined,
                emailConfirmation: undefined
            }
            return user
        } else {
            const user = {
                accountData,
                emailConfirmation: emailData
            }
            return user
        }
    },
    async updateEmailConfirmation(email: string): Promise<UsersType | null> {

        const accountDataRes = await usersCollection.updateOne({email}, {$set: {isConfirmed: true}})

        if (!accountDataRes) {
            return null
        } else {
            await usersEmailConfDataCollection.deleteOne({email})
            const result = await usersCollection.findOne({email}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}})

            return result
        }

    },
    async findUserByEmail(email: string) {
        const user = await usersCollection.findOne({email}, {projection: {_id: 0}})
        return user
    },
    async findUserByLogin(login: string) {
        const user = await usersCollection.findOne({login}, {projection: {_id: 0}})
        if (user === null) return false
        return user
    },
    async insertDbUnconfirmedEmail(newUserEmail: UsersEmailConfDataType): Promise<boolean> {
        const result = await usersEmailConfDataCollection.insertOne(newUserEmail)
        console.log(555)
        return result.acknowledged
    },
    async updateUnconfirmedEmailData(updetedEmailConfirmationData: UsersEmailConfDataType): Promise<boolean> {
        const result = await usersEmailConfDataCollection.updateOne(
            {email: updetedEmailConfirmationData.email},
            {$set: {confirmationCode: updetedEmailConfirmationData.confirmationCode,
                expirationDate: updetedEmailConfirmationData.expirationDate}})
        return result.acknowledged;
    },
    async deleteAllUsers(): Promise<boolean> {
         await usersCollection.deleteMany({})
        return true

    },
    async findByLogin(login: string): Promise<UsersWithPassType | boolean> {
        console.log(8181)
        const user = await usersCollection.findOne({login: login}, {projection: {_id: 0, email: 0, isConfirmed: 0}})

        if(user === null) return false
        // @ts-ignore
        console.log(8080)
        return user
    },
    async findLogin(login:string){
        return await usersCollection.findOne({login: login})
    },

    async createNewUser(newUser: UsersDBType) {
        //@ts-ignore
        let user = await usersCollection.insertOne(newUser)
        const newUserDb = {
            id: newUser.id,
            login: newUser.userName
        }
        return newUserDb
    }
}


