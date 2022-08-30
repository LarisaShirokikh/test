import {UsersDBType, UsersEmailConfDataType, UsersType} from "../types";
import {UserModelClass, UsersEmailConfDataModel} from "../settingses/db";
import {ObjectId} from "mongodb";



export const usersRepository = {

    async createUser(user: UsersDBType) {
        const newUser = await UserModelClass.insertMany([user])
        return newUser

    },
    async findUsers(pageSize: number, pageNumber: number): Promise<UsersDBType[]> {
        return UserModelClass.find({}, {
            projection: {
                _id: 0, passwordHash: 0,
                passwordSalt: 0
            }
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).lean();
    },
    async getCount() {
        return UserModelClass.countDocuments()
    },
    async deleteUsers(id: string) {
        const result = await UserModelClass.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findUsersById(userId: string) {
        return UserModelClass.findOne({id: userId})
    },
    async findUserByConfirmCode(confirmationCode: string) {
        const emailData = await UsersEmailConfDataModel.findOne({confirmationCode: confirmationCode}, {projection: {_id: 0}})

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
    },
    async updateEmailConfirmation(email: string) {
        const accountDataRes = UserModelClass
            .updateOne({email}, {isConfirmed: true})
        if (!accountDataRes) {
            return null
        } else {
            await UsersEmailConfDataModel.deleteOne({email})
            const result = await UserModelClass.findOne({email}, {projection: {_id: 0, password: 0, email: 0, isConfirmed: 0}})
            return result
        }

    },
    async findUserByEmail(email: string) {
        const user = await UserModelClass.findOne({email}, {projection: {_id: 0}})
        return user
    },
    async findUserByLogin(login: string) {
        const user = await UserModelClass.findOne({'accountData.login': login})

        if (user === null) return false
        return user
    },
    async insertDbUnconfirmedEmail(newUserEmail: UsersEmailConfDataType) {
        const result = await UsersEmailConfDataModel.insertMany([newUserEmail])
        return result
    },
    async updateUnconfirmedEmailData(updetedEmailConfirmationData: UsersEmailConfDataType): Promise<boolean> {
        const result = await UsersEmailConfDataModel.updateOne(
            {email: updetedEmailConfirmationData.email},
            {$set: {confirmationCode: updetedEmailConfirmationData.confirmationCode,
                expirationDate: updetedEmailConfirmationData.expirationDate}})
        return result.acknowledged;
    },
    async deleteAllUsers(): Promise<boolean> {
         await UserModelClass.deleteMany({})
        return true

    },
    async findByLogin(login: string): Promise<UsersDBType | boolean> {
        console.log(8181)
        const user = await UserModelClass.findOne({login: login}, {projection: {_id: 0, email: 0, isConfirmed: 0}})
        if(user === null) return false
        console.log(8080)
        return true
    },
    async findLogin(login:string){
        return  UserModelClass.findOne({login: login})
    },
    /*async createNewUser(newUser: UsersType): Promise<UsersType> {
        await UserModelClass.insertMany({newUser})
        //const user: UsersType = {
            //id: newUser.id,
            //login: newUser.login
        }
        return user

    },*/
    async findUserByEmailOrlogin(email: string, login: string) {
        const user = await UserModelClass
            .findOne( {$or: [{'accountData.login': login}, {'accountData.email': email}]} )
        console.log(user)
        if (!user) return null
        return user

    },
    async findUserWithEmailById(userId: string) {
        const user = await UserModelClass.findOne({id: userId}, {_id: 0, password: 0, isConfirmed: 0, __v: 0})

        return user
    }
}


