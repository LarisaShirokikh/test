import {bloggersRepository} from "../repositories/bloggers-repository";
import {ObjectId} from "mongodb";


export const bloggersService = {
    async findBloggers(pageSize:number, pageNumber:number, searchNameTerm:string) {

        return await bloggersRepository.findBloggers(pageSize, pageNumber, searchNameTerm)
    },
    async findBloggersById(id: string) {
        return await bloggersRepository.findBloggersById(id)

    },
    async createBloggers(name: string, youtubeUrl: string) {
        const newBlogger = {
            id: new ObjectId().toString(),
            name: name,
            youtubeUrl: youtubeUrl,
        }

        return await bloggersRepository.createBloggers(newBlogger)
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


