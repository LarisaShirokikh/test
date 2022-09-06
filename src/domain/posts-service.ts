
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
    async findPostById(id: string) {
        return await this.postsRepository.findPostById(id)
    }
    async createPost (title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostsType | undefined> {
        const blogger = await this.bloggersRepository.getBloggerById(bloggerId)

        if (blogger) {
            const newPost: PostsType = new PostsType(
                (new ObjectId()).toString(),
                title,
                shortDescription,
                content,
                bloggerId,
                blogger.name,
                new Date,
                {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                })

            await this.postsRepository.createPost(newPost)
            return newPost
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
    async getPostById (postId: string): Promise<PostsType | null> {
        return this.postsRepository.getPostById(postId)
    }

    async updateLike(user: any, postId: string, likeStatus: "None" | "Like" | "Dislike", addedLikeStatusAt: Date) {
         return await this.postsRepository.updateLikeStatus(user, postId, likeStatus, addedLikeStatusAt)

    }
}


