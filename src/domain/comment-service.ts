import {ObjectId} from "mongodb";

import {commentRepository} from "../repositories/comment-repository";
import {postsRepository} from "../repositories/posts-repository";
import {CommentContentType, CommentsType} from "../types";

export const commentService = {
    async createCommentByPostId (user:any, postId: string, content:string): Promise<CommentsType | undefined> {
        const post = await postsRepository.getPostById(postId)
        if (post) {
            const newComment = {
                postId: postId,
                id: (+(new Date())).toString(),
                content: content,
                userId: user.id,
                userLogin: user.login,
                addedAt: new Date
            }
            const createdComment = await commentRepository.createComment(newComment)
            return createdComment
        }
    },
    async findComment (id: string){
        return await commentRepository.findComment(id)
    },
    async findCommentWithPag (postId: string, pageSize:number, pageNumber:number){
        return await commentRepository.findCommentWithPag(postId, pageSize, pageNumber)
    },
    async getCount(postId:string){
        return await commentRepository.getCount(postId)
    },
    async deleteComment(id:string){
        return await commentRepository.deleteComment(id)
    },
    async updateComment (commentId: string, content: string): Promise<CommentContentType>  {
        return commentRepository.updateComment(commentId, content)
    },
    async findUser(userId:string, commentId:string){
        return await commentRepository.findUser(userId, commentId)
    },

}