import {bloggersCollection} from "../settings";
import {BloggersType} from "../types";


const options = {
    projection: {
        _id: 0,
    }
}

export const bloggersRepository = {
    async findBloggers(pageSize:number, pageNumber:number, searchNameTerm:string) {
        return await bloggersCollection.find({name: {$regex: searchNameTerm}}, options).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()
    },


    async findBloggersById(id: string) {
        return await bloggersCollection.findOne({id: id}, options)

    },

    async createBloggers(newBlogger: BloggersType) {

        await bloggersCollection.insertOne(newBlogger)
        const {id, name, youtubeUrl} = newBlogger
        return {
            id, name, youtubeUrl
        }

    }
    ,
    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        const result = await bloggersCollection.updateOne({id: id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })
        return result.matchedCount === 1
    },
    async deleteBloggers(id: string) {

        const result = await bloggersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async getCount(searchNameTerm: string) {
        return await bloggersCollection.countDocuments({name: {$regex: searchNameTerm}})
    }


}



