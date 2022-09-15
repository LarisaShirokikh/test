import {CommentsRepository} from "../repositories/comment-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {injectable} from "inversify";
import {CommentsType, likeStatusEnum, PostsType, UsersDBType, UsersType} from "../types";
import {Schema} from "mongoose";
import {ObjectId} from "mongodb";
import {LikesRepository} from "../repositories/likes-repository";


@injectable()
export class CommentsService {
    commentsRepository: CommentsRepository
    postsRepository: PostsRepository
    likesRepository: LikesRepository

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.postsRepository = new PostsRepository()
        this.likesRepository = new LikesRepository()
    }

    async createCommentByPostId(user: any, id: string, content: string): Promise<CommentsType | undefined> {
        const post = await this.postsRepository.getPostById(id)

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
                    myStatus: "None",
                    newestLikes: []
                }
            }
//@ts-ignore
            const createdComment = await this.commentsRepository.createComment(newComment)
            return createdComment
        }
    }

    async getComment(commentId: string, userId: string): Promise<CommentsType | null> {
        // @ts-ignore
        return await this.commentsRepository.getComment(commentId, userId)

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

    async updateLikeStatus(user: any, commentId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean | null> {


        return this.commentsRepository.updateLikeStatus(user, commentId, likeStatus)
    }
}

