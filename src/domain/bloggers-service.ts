import {ObjectId} from "mongodb";
import {BloggersType, PostsOfBloggerType, PostsType} from "../types";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {inject, injectable} from "inversify";

@injectable()
export class BloggersService {
    bloggersRepository: BloggersRepository
    postsRepository: PostsRepository
    constructor() {
        this.bloggersRepository = new BloggersRepository()
        this.postsRepository = new PostsRepository()
    }
    async findBloggers(pageSize:number, pageNumber:number, searchNameTerm:string) {

        return await this.bloggersRepository.findBloggers(pageSize, pageNumber, searchNameTerm)
    }
    async findBloggersById(bloggerId: string): Promise<BloggersType | null> {

        return await this.bloggersRepository.getBloggerById(bloggerId)

    }
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger: BloggersType = {
            id: (new ObjectId()).toString(),
            name,
            youtubeUrl
        }
        const createdBlogger = this.bloggersRepository.createBlogger(newBlogger)
        return createdBlogger
    }
    async updateBlogger(id: string, name: string, youtubeUrl: string) {
        return await this.bloggersRepository.updateBlogger(id, name, youtubeUrl)
    }
    async deleteBloggers(id: string) {
        return await this.bloggersRepository.deleteBloggers(id)
    }
    async getCount(searchNameTerm:string) {
        return await this.bloggersRepository.getCount(searchNameTerm)
    }
    async createPostByBloggerId (bloggerId: string, title: string, shortDescription: string, content: string) {
        const blogger = await this.bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            const newPost = {
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
                    newestLikes: []
                }
            }
            //@ts-ignore
            const createdPostDb = await this.postsRepository.createPost(newPost)
            return createdPostDb
        }
    }
    // async getPostsByBloggerId(bloggerId: string, pageNumber: string = '1' || undefined || null, pageSize: string = '10' || undefined || null, userId?: string): Promise<PostsOfBloggerType | null | undefined> {
    //
    //     if (!userId) {
    //
    //         const posts = await this.bloggersRepository.getPostsByBloggerId(bloggerId, +pageNumber, +pageSize);
    //
    //         if (posts) {
    //             for (let item of posts.items) {
    //
    //                 items.extendedLikesInfo.newestLikes = items.extendedLikesInfo.newestLikes.splice(0, 3)
    //             }
    //             return posts
    //         } else {
    //             return undefined
    //         }
    //
    //     } else {
    //         const [likesStatus, posts] = await this.bloggersRepository.getPostsByBloggerId(bloggerId, +pageNumber, +pageSize, userId);
    //
    //         for (const el of posts.items) {
    //             for (const item of likesStatus) {
    //                 if (item.id === el.id && item.userId === userId) {
    //                     el.extendedLikesInfo.myStatus = item.likeStatus
    //                 }
    //             }
    //         }
    //
    //         for (let item of posts.items) {
    //             item.extendedLikesInfo.newestLikes = item.extendedLikesInfo.newestLikes.splice(0, 3)
    //         }
    //         return posts
    //     }
    //
    // }
}


