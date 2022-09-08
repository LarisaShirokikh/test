
import {BloggersType} from "../types";
import { BloggersModel } from "../settingses/db";
import {injectable} from "inversify";


@injectable()
export class BloggersRepository  {

    async findBloggers(pageSize:number, pageNumber:number, searchNameTerm:string) {
        return BloggersModel
            .find({name: {$regex: searchNameTerm}}, {_id: 0, __v: 0})
            .skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    }
    async findBloggersById(id: string) {
        return BloggersModel.findOne({id: id}, {_id: 0, __v: 0})

    }
    async createBlogger(newBlogger: BloggersType): Promise<BloggersType> {
        await BloggersModel.insertMany([newBlogger])
        const blogger = await BloggersModel.findOne({id: newBlogger.id}, {_id: 0, __v: 0})
        /*const bloggerInstance = new BloggersModelClass(newBlogger)
        bloggerInstance.id = newBlogger.id;
        bloggerInstance.name = newBlogger.name;
        bloggerInstance.youtubeUrl = newBlogger.youtubeUrl

        await bloggerInstance.save()*/
        //const result = await BloggersModelClass.insertMany([newBlogger])
        //const blogger = await BloggersModelClass.findOne({id: newBlogger.id}, {projection: {_id: 0}})
        // @ts-ignore
        return blogger;
    }
    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        const bloggerInstance = await BloggersModel.findOne({id: id}, {_id: 0, __v: 0})
        if (!bloggerInstance) return false
        bloggerInstance.name = name;
        bloggerInstance.youtubeUrl = youtubeUrl

        await bloggerInstance.save()
        return true
    }
    async deleteBloggers(id: string) {
        const bloggerInstance = await BloggersModel.findOne({id: id})
        if (!bloggerInstance) return false

        await bloggerInstance.deleteOne()
        return true
        //const result = await BloggersModelClass.deleteOne({id: id})
        //return result.deletedCount === 1
    }
    async getCount(searchNameTerm: string) {
        return BloggersModel.countDocuments({name: {$regex: searchNameTerm}})
    }

    async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
        const blogger: BloggersType | null = await BloggersModel.findOne({id: bloggerId}, {_id: 0, __v: 0})
        return blogger;
    }
    async isBlogger(bloggerId: string):Promise<boolean> {
        const blogger: BloggersType | null = await BloggersModel.findOne({id: bloggerId}, {_id: 0, __v: 0})
        return !!blogger;
    }
}



