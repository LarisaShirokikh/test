import {postDbRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";

export const postsService = {
    async findPosts(pageSize:number, pageNumber:number) {
        return await postDbRepository.findPosts(pageSize, pageNumber )
    },
    async findPostById(id: string) {
        return await postDbRepository.findPostById(id)
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
        return await postDbRepository.createPost(newPosts)

    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        return await postDbRepository.updatePost(id, title, shortDescription, content, bloggerId)
    },
    async deletePosts(id: string) {
        return await postDbRepository.deletePosts(id)
    },
    async getCount() {
        return await postDbRepository.getCount()
    },
    async findBloggersPost(pageSize:number, pageNumber:number,bloggerId:string) {
        return await postDbRepository.findBloggersPost(pageSize, pageNumber, bloggerId)
    },
    async getCountBloggerId(bloggerId: string) {
        return await postDbRepository.getCountBloggerId(bloggerId)
    },
}