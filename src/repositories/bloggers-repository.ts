
import {BloggersType} from "../types";
import {BloggersModel} from "../settingses/db";



export const bloggersRepository = {
    async findBloggers(pageSize:number, pageNumber:number, searchNameTerm:string) {
        return BloggersModel.find({name: {$regex: searchNameTerm}}, {projection: {_id: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    },
    async findBloggersById(id: string) {
        return BloggersModel.findOne({id: id}, {projection: {_id: 0}})

    },
    async createBlogger(newBlogger: BloggersType): Promise<BloggersType> {
        await BloggersModel.create(newBlogger)
        const blogger = await BloggersModel.findOne({id: newBlogger.id}, {projection: {_id: 0}})

        // @ts-ignore
        return blogger;
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        const result = await BloggersModel.updateOne({id: id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })
        return result.matchedCount === 1
    },
    async deleteBloggers(id: string) {

        const result = await BloggersModel.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async getCount(searchNameTerm: string) {
        return BloggersModel.countDocuments({name: {$regex: searchNameTerm}})
    },
    async deleteAllBloggers(): Promise<boolean> {
        const result = BloggersModel.deleteMany({})
        return true
    },
    async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
        const blogger: BloggersType | null = await BloggersModel.findOne({id: bloggerId}, {projection: {_id: 0}})
        return blogger;
    },
    async isBlogger(bloggerId: string):Promise<boolean> {
        const blogger: BloggersType | null = await BloggersModel.findOne({id: bloggerId}, {projection: {_id: 0}})
        return !!blogger;
    },
}



