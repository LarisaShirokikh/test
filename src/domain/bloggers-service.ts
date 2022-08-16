import {bloggersDbRepository} from "../repositories/bloggers-repository";
import {ObjectId} from "mongodb";


export const bloggersService = {

    async findBloggers(pageSize: number, pageNumber: number, searchNameTerm: string) {

        return await bloggersDbRepository.findBloggers(pageSize, pageNumber, searchNameTerm)
    },
    async findBloggersById(id: string) {
        return await bloggersDbRepository.findBloggersById(id)

    },
    async createBloggers(name: string, youtubeUrl: string) {
        const newBlogger = {
            id: new ObjectId().toString(),
            name: name,
            youtubeUrl: youtubeUrl,
        }

        return await bloggersDbRepository.createBloggers(newBlogger)
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        return await bloggersDbRepository.updateBlogger(id, name, youtubeUrl)
    },
    async deleteBloggers(id: string) {
        return await bloggersDbRepository.deleteBloggers(id)
    },
    async getCount(searchNameTerm: string) {
        return await bloggersDbRepository.getCount(searchNameTerm)
    },
}


