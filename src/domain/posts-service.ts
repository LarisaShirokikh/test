import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";




export const postsService = {
    async findPosts(pageSize:number, pageNumber:number) {
        return await postsRepository.findPosts(pageSize, pageNumber )
    },
    async findPostById(id: string) {
        return await postsRepository.findPostById(id)
    },
    async createPost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        const newPosts = {
            id: new ObjectId().toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: "Brendan Eich"
        }
        return await postsRepository.createPost(newPosts)

    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        return await postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    },
    async deletePosts(id: string) {
        return await postsRepository.deletePosts(id)
    },
    async getCount() {
        return await postsRepository.getCount()
    },
    async findBloggersPost(pageSize:number, pageNumber:number,bloggerId:string) {
        return await postsRepository.findBloggersPost(pageSize, pageNumber, bloggerId)
    },
    async getCountBloggerId(bloggerId: string) {
        return await postsRepository.getCountBloggerId(bloggerId)
    },
}
