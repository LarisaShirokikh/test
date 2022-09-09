
import {ObjectId} from "mongodb";
import {PostsType} from "../types";
import {PostsRepository} from "../repositories/posts-repository";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {injectable} from "inversify";


@injectable()
export class PostsService {
     postsRepository: PostsRepository
     bloggersRepository: BloggersRepository
     constructor() {
         this.postsRepository = new PostsRepository()
         this.bloggersRepository = new BloggersRepository()
     }
    async findPosts(pageSize:number, pageNumber:number) {
        return await this.postsRepository.findPosts(pageSize, pageNumber )
    }
    async findPostById(postId: string): Promise<PostsType | null> {
        return await this.postsRepository.findPostById(postId)
    }
    async createPost (title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostsType | undefined> {
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
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                    newestLikes: [

                    ]
                }
            }

            // @ts-ignore
            const createdPost = await this.postsRepository.createPost(newPost)
            return createdPost
        }
    }
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        return await this.postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    }
    async deletePosts(id: string) {
        return await this.postsRepository.deletePosts(id)
    }
    async getCount() {
        return await this.postsRepository.getCount()
    }
    async findBloggersPost(pageSize:number, pageNumber:number,bloggerId:string) {
        return await this.postsRepository.findBloggersPost(pageSize, pageNumber, bloggerId)
    }
    async getCountBloggerId(bloggerId: string) {
        return await this.postsRepository.getCountBloggerId(bloggerId)
    }

    async getPostById(postId: string): Promise<PostsType | null> {
        return this.postsRepository.getPostById(postId)
    }

    async updateLikeStatus(user: any, postId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean|undefined>  {
        const addedLikeStatusAt = new Date()
         return this.postsRepository.updateLikeStatus(user, postId, likeStatus, addedLikeStatusAt)

    }
}


