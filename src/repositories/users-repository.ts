import {UsersDBType, UsersEmailConfDataType} from "../types";
import {UserModelClass, UsersEmailConfDataModelClass} from "../settingses/db";
import {injectable} from "inversify";
import "reflect-metadata";



@injectable()
export class UsersRepository  {

    async createUser(user: UsersDBType) {
        const newUser = await UserModelClass.insertMany([user])
        return newUser

    }
    async findUsers(PageSize: number, PageNumber: number) {
        return UserModelClass
            .find({}, {projection: {_id: 0, passwordHash: 0, passwordSalt: 0}})
            .skip((PageNumber - 1) * PageSize).limit(PageSize).lean([]);
    }
    async getCount() {
        return UserModelClass.countDocuments()
    }
    async deleteUsers(id: string) {
        const result = await UserModelClass.deleteOne({id: id})
        return result.deletedCount === 1
    }
    async findUsersById(userId: string) {
        return UserModelClass.findOne({id: userId},  {projection: {_id: 0}})
    }
    async findUserByConfirmCode(confirmationCode: string) {
        const emailData = await UsersEmailConfDataModelClass.findOne({confirmationCode: confirmationCode}, {projection: {_id: 0}})

        const accountData = await UserModelClass.findOne({email: emailData?.email}, {projection: {_id: 0}})

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
    }
    async updateEmailConfirmation(email: string) {
        const accountDataRes = UserModelClass
            .updateOne({email}, {isConfirmed: true})
        if (!accountDataRes) {
            return null
        } else {
            await UsersEmailConfDataModelClass.deleteOne({email})
            const result = await UserModelClass.findOne({email}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}})
            return result
        }

    }
    async findUserByEmail(email: string) {
        const user = await UserModelClass.findOne({email}, {projection: {_id: 0}})
        return user
    }
    async findUserByLogin(login: string) {
        const user = await UserModelClass.findOne({'accountData.login': login})

        if (user === null) return false
        return user
    }
    async insertDbUnconfirmedEmail(newUserEmail: UsersEmailConfDataType) {
        const result = await UsersEmailConfDataModelClass.insertMany([newUserEmail])
        return result
    }
    async updateUnconfirmedEmailData(updetedEmailConfirmationData: UsersEmailConfDataType): Promise<boolean> {
        const result = await UsersEmailConfDataModelClass.updateOne(
            {email: updetedEmailConfirmationData.email},
            {$set: {confirmationCode: updetedEmailConfirmationData.confirmationCode,
                expirationDate: updetedEmailConfirmationData.expirationDate}})
        return result.acknowledged;
    }
    async deleteAllUsers(): Promise<boolean> {
         await UserModelClass.deleteMany({})
        return true

    }
    async findUserByEmailOrlogin(email: string, login: string) {
        const user = await UserModelClass
            .findOne( {$or: [{'accountData.login': login}, {'accountData.email': email}]} )
        console.log(user)
        if (!user) return null
        return user

    }
    async findUserWithEmailById(userId: string) {
        const user = await UserModelClass.findOne({id: userId}, {_id: 0, password: 0, isConfirmed: 0, __v: 0})

        return user
    }

}


