import {commentRepository} from "../repositories/comment-repository";
import {CommentType} from "../types";





export const commentsService = {
    async updateComment(commentId: string, content: string): Promise<CommentType | undefined> {
        return commentRepository.updateComment(commentId, content)
    },


    async getCommentById (
        commentId: string
    ): Promise<CommentType | null> {

        const comment =  commentRepository
            .getCommentById(commentId);
        return comment
    },

    async deleteComment(commentId: string): Promise<boolean> {
        return commentRepository.deleteComment(commentId)
    },

    async creatComments(content: string): Promise<CommentType | undefined> {
        //@ts-ignore
        const newComment: CommentType = {
            content
        }
        const createdCommentDb = await commentRepository
            .createComment(newComment)
        return createdCommentDb
    }

}