import {CommentsRepository} from "../repositories/comment-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {injectable} from "inversify";
import {CommentType} from "../types";


@injectable()
export class CommentsService {
    commentsRepository: CommentsRepository
    postsRepository: PostsRepository

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.postsRepository = new PostsRepository()
    }

    async createCommentByPostId(user: any, postId: string, content: string): Promise<CommentType | undefined>  {
        const post = await this.postsRepository.getPostById(postId)
        console.log(post)
        if (post) {

            const newComment = {
                postId: postId,
                id: (+(new Date())).toString(),
                content: content,
                userId: user.id,
                userLogin: user.login,
                addedAt: new Date,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }
            }
            console.log(90)
            const createdComment = await this.commentsRepository.createComment(newComment)
            console.log(901)
            return createdComment
        }
    }

    async findComment(commentId: string) {
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

    async updateLikeStatus (user: any, commentId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean|undefined>  {

        return this.commentsRepository.updateLikeStatus(user, commentId, likeStatus)
    }
}

