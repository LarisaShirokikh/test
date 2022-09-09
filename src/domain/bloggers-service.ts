import {ObjectId} from "mongodb";
import {BloggersType, PostsType} from "../types";
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
                postId: (new ObjectId()).toString(),
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

}


