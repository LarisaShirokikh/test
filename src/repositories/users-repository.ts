
import {usersCollection} from "../settings";
import {UsersType} from "../types";

export const usersRepository = {

    async createUser(newUser: UsersType) {
        await usersCollection.insertOne(newUser)
        const {id, login} = newUser
        return{
            id, login
        }
    },
    async findUsers(pageSize:number, pageNumber:number) {
        return await usersCollection.find({}, {projection: {_id: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()
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
