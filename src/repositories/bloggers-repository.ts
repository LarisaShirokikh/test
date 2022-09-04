
import {BloggersType} from "../types";
import { BloggersModelClass} from "../settingses/db";
import {injectable} from "inversify";


@injectable()
export class BloggersRepository  {

    async findBloggers(pageSize:number, pageNumber:number, searchNameTerm:string) {
        return BloggersModelClass
            .find({name: {$regex: searchNameTerm}}, {projection: {_id: 0}})
            .skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    }
    async findBloggersById(id: string) {
        return BloggersModelClass.findOne({id: id}, {projection: {_id: 0}})

    }
    async createBlogger(newBlogger: BloggersType): Promise<BloggersType> {
        const bloggerInstance = new BloggersModelClass(newBlogger)
        bloggerInstance.id = newBlogger.id;
        bloggerInstance.name = newBlogger.name;
        bloggerInstance.youtubeUrl = newBlogger.youtubeUrl

        await bloggerInstance.save()

        //const result = await BloggersModelClass.insertMany([newBlogger])
        //const blogger = await BloggersModelClass.findOne({id: newBlogger.id}, {projection: {_id: 0}})
        return newBlogger;
    }
    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        const bloggerInstance = await BloggersModelClass.findOne({id: id})
        if (!bloggerInstance) return false
        bloggerInstance.name = name;
        bloggerInstance.youtubeUrl = youtubeUrl

        await bloggerInstance.save()
        return true
    }
    async deleteBloggers(id: string) {
        const bloggerInstance = await BloggersModelClass.findOne({id: id})
        if (!bloggerInstance) return false

        await bloggerInstance.deleteOne()
        return true
        //const result = await BloggersModelClass.deleteOne({id: id})
        //return result.deletedCount === 1
    }
    async getCount(searchNameTerm: string) {
        return BloggersModelClass.countDocuments({name: {$regex: searchNameTerm}})
    }
    async deleteAllBloggers(): Promise<boolean> {
        const result = BloggersModelClass.deleteMany({})
        return true
    }
    async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
        const blogger: BloggersType | null = await BloggersModelClass.findOne({id: bloggerId}, {projection: {_id: 0}})
        return blogger;
    }
    async isBlogger(bloggerId: string):Promise<boolean> {
        const blogger: BloggersType | null = await BloggersModelClass.findOne({id: bloggerId}, {projection: {_id: 0}})
        return !!blogger;
    }
}



