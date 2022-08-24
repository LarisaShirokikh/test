import {bloggersRepository} from "../repositories/bloggers-repository";
import {ObjectId} from "mongodb";
import {BloggersType} from "../types";


export const bloggersService = {
    async findBloggers(pageSize:number, pageNumber:number, searchNameTerm:string) {

        return await bloggersRepository.findBloggers(pageSize, pageNumber, searchNameTerm)
    },
    async findBloggersById(id: string) {
        return await bloggersRepository.findBloggersById(id)

    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger = {
            id: (+(new Date())).toString(),
            name,
            youtubeUrl
        }
        const createdBloggerDb = await bloggersRepository.createBlogger(newBlogger)
        return createdBloggerDb;
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },
    async deleteBloggers(id: string) {
        return await bloggersRepository.deleteBloggers(id)
    },
    async getCount(searchNameTerm:string) {
        return await bloggersRepository.getCount(searchNameTerm)
    },



}


