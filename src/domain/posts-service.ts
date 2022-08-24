import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {PostsType} from "../types";
import {bloggersRepository} from "../repositories/bloggers-repository";




export const postsService = {
    async findPosts(pageSize:number, pageNumber:number) {
        return await postsRepository.findPosts(pageSize, pageNumber )
    },
    async findPostById(id: string) {
        return await postsRepository.findPostById(id)
    },
    async createPost (title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostsType | undefined> {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            const newPost = {
                id: (+(new Date())).toString(),
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName: blogger.name
            }

            const createdPost = await postsRepository.createPost(newPost)
            return createdPost
        }
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
    async getPostById (postId: string): Promise<PostsType | null> {

        return postsRepository.getPostById(postId)
    },
}
