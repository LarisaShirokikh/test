import {bloggersRepository} from "../repositories/bloggers-repository";
import {ObjectId} from "mongodb";
import {BloggersType, PostsType} from "../types";
import {postsRepository} from "../repositories/posts-repository";


export const bloggersService = {
    async findBloggers(pageSize:number, pageNumber:number, searchNameTerm:string) {

        return await bloggersRepository.findBloggers(pageSize, pageNumber, searchNameTerm)
    },
    async findBloggersById(id: string) {
        return await bloggersRepository.findBloggersById(id)

    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger: BloggersType = {
            id: (new ObjectId()).toString(),
            name,
            youtubeUrl
        }
        return bloggersRepository.createBlogger(newBlogger)
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
    async createPostByBloggerId (bloggerId: string, title: string, shortDescription: string, content: string) {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            const newPost: PostsType = {
                id: (new ObjectId()).toString(),
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName: blogger.name,
                addedAt: new Date,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: [
                        {
                            addedAt: new Date,
                            userId: blogger.id,
                            login: blogger.name
                        }]
                }
            }
            const createdPostDb = await postsRepository.createPost(newPost)
            return createdPostDb
        }
    }

}


