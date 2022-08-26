import {bloggersCollection} from "../settingses/db";
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
    async createBlogger(newBlogger: BloggersType): Promise<BloggersType> {
        await bloggersCollection.insertOne(newBlogger)
        const blogger = await bloggersCollection.findOne({id: newBlogger.id}, {projection: {_id: 0}})

        // @ts-ignore
        return blogger;
    },
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
    },
    async deleteAllBloggers(): Promise<boolean> {
        const result = bloggersCollection.deleteMany({})
        return true
    },
    async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
        const blogger: BloggersType | null = await bloggersCollection.findOne({id: bloggerId}, {projection: {_id: 0}})
        return blogger;
    },
    async isBlogger(bloggerId: string):Promise<boolean> {
        const blogger: BloggersType | null = await bloggersCollection.findOne({id: bloggerId}, {projection: {_id: 0}})
        return !!blogger;
    },
}



