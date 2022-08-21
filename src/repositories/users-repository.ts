import {UsersDBType, UsersEmailConfDataType, UsersType, UsersWithPassType} from "../types";
import {usersCollection, usersEmailConfDataCollection} from "../settingses/settings";



export const usersRepository = {

    async createUser(user: UsersWithPassType): Promise<UsersType> {
// @ts-ignore
        const result = await usersCollection.insertOne(user)
        const newUser = await usersCollection
            .findOne({id: user?.id}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}})
        // @ts-ignore
        return newUser

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
    async findLogin(login: string) {
        const user = await usersCollection
            .findOne({login: login}, {projection: {_id: 0, email: 0, isConfirmed: 0}})
        if(user === null) return false
        return user
    },
    async findUsersById(userId: string) {
        return await usersCollection.findOne({id: userId})
    },
    /*async updateConfirmation(_id: ObjectId): Promise<UsersDBType | boolean> {
        let result = await usersCollection.updateOne({_id},
            {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },*/
    async findUserByConfirmationCode(emailConfirmationCode: object) {
        const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
        return user
    },
    async findUserByConfirmCode(confirmationCode: string) {
        const emailData = await usersEmailConfDataCollection
            .findOne({confirmationCode: confirmationCode}, {projection: {_id: 0}})
        const accountData = await usersCollection
            .findOne({email: emailData?.email}, {projection: {_id: 0}})
        if (emailData === null && accountData === null) {
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
    async updateEmailConfirmation(email: string): Promise<UsersDBType | null> {
        const accountDataRes = await usersCollection.updateOne({email}, {$set: {isConfirmed: true}})
        if (!accountDataRes) {
            return null
        } else {
            await usersEmailConfDataCollection.deleteOne({email})
            const result = await usersCollection.findOne({email}, {
                projection: {
                    _id: 0,
                    password: 0,
                    email: 0,
                    isConfirmed: 0
                }
            })
            return result
        }

    },
    async findUserByEmail(email: string) {
        const user = await usersCollection.findOne({email}, {projection: {_id: 0, password: 0}})
        return user
    },
    async findUserByLogin(login: string) {
        const user = await usersCollection.findOne({login}, {projection: {_id: 0, password: 0}})
        return user

    },
    async insertDbUnconfirmedEmail(newUserEmail: UsersEmailConfDataType): Promise<boolean> {
        const result = await usersEmailConfDataCollection.insertOne(newUserEmail)
        return result.acknowledged
    },
    async updateUnconfirmedEmailData(updetedEmailConfirmationData: UsersEmailConfDataType): Promise<boolean> {
        const result = await usersEmailConfDataCollection.updateOne(
            {email: updetedEmailConfirmationData.email},
            {$set: {confirmationCode: updetedEmailConfirmationData.confirmationCode,
                expirationDate: updetedEmailConfirmationData.expirationDate}})
        return result.acknowledged;
    },
    async deleteUserUnconfirmedEmail(email: string): Promise<boolean> {
        const result = await usersEmailConfDataCollection.deleteOne({email})
        return result.deletedCount === 1
    },
    async deleteAllUsers(): Promise<boolean> {
        const result = usersCollection.deleteMany({})
        return true

    }
}


