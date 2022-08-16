import {UsersType} from "../types";
import {usersCollection} from "../settingses/settings";


const options = {
    projection: {
        _id: 0,
        passwordHash: 0,
        passwordSalt: 0
    },
}

export const usersRepository = {

    async createUser(newUser: UsersType) {
        await usersCollection.insertOne(newUser)
        const {id, login} = newUser
        return{
            id, login
        }
    },
    async findUsers(pageSize:number, pageNumber:number) {
        return await usersCollection.find({}, options).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()
    },
    async getCount(){
        return await usersCollection.countDocuments()
    },
    async deleteUsers(id:string){
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findLogin(login:string){
        return await usersCollection.findOne({login: login})
    },
    async findUsersById(userId:string){
        return await usersCollection.findOne({id: userId})
    }
}


