import {CommentsRepository} from "../repositories/comment-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {injectable} from "inversify";


@injectable()
export class CommentsService {
    commentsRepository: CommentsRepository
    postsRepository: PostsRepository

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.postsRepository = new PostsRepository()
    }

    async createCommentByPostId(user: any, postId: string, content: string) {
        const post = await this.postsRepository.getPostById(postId)
        if (post) {
            const newComment =
                {
                    "id": postId,
                    "content": content,
                    "userId": user.id,
                    "userLogin": user.userLogin,
                    "addedAt": new Date,
                    "likesInfo": {}

                }

            const createdComment = await this.commentsRepository.createComment(newComment)
            return createdComment
        }
    }

    async findComment(id: string) {
        return await this.commentsRepository.findComment(id)
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

    async updateLikeStatus(user: string, commentId: string, likeStatus: "None" | "Like" | "Dislike") {
        return await this.commentsRepository.updateLikeStatus(user, commentId, likeStatus)
    }
}

