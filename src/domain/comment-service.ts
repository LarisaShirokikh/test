import {CommentsRepository} from "../repositories/comment-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {injectable} from "inversify";
import {CommentsType} from "../types";
import {Schema} from "mongoose";
import {ObjectId} from "mongodb";



@injectable()
export class CommentsService {
    commentsRepository: CommentsRepository
    postsRepository: PostsRepository

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.postsRepository = new PostsRepository()
    }

    async createCommentByPostId(user: any, id: string, content: string): Promise<CommentsType | undefined> {
        const post = await this.postsRepository.getPostById(id)
        console.log('post', post )
        if (post) {

            const newComment = {
                postId: id,
                id: new ObjectId().toString(),
                content: content,
                userId: user.accountData.id,
                userLogin: user.accountData.login,
                addedAt: new Date,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }
            }

            console.log(20012345)
            const createdComment = await this.commentsRepository.createComment(newComment)
            return createdComment
        }
    }

    async findComment(commentId: string): Promise<CommentsType | undefined | null> {
        const comment = await this.commentsRepository.findComment(commentId)
        return comment
    }

    async findCommentWithPag(postId: string, pageSize: number, pageNumber: number) {
        return await this.commentsRepository.findCommentWithPag(postId, pageSize, pageNumber)
    }

    async getCount(postId: string) {
        return await this.commentsRepository.getCount(postId)
    }

    async deleteComment(id: string) {
        return await this.commentsRepository.deleteComment(id)
    }

    async updateComment(commentId: string, content: string) {
        return this.commentsRepository.updateComment(commentId, content)
    }

    async findUser(userId: string, commentId: string) {
        return await this.commentsRepository.findUser(userId, commentId)
    }

    async updateLikeStatus(user: string, commentId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean|undefined> {
        return await this.commentsRepository.updateLikeStatus(user, commentId, likeStatus)
    }
}

