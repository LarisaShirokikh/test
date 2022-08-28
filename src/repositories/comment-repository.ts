
import {CommentsType} from "../types";
import {CommentsModel} from "../settingses/db";



export const commentRepository = {
    async createComment (newComment: CommentsType) {
        const result = await CommentsModel.create(newComment)
        const comment = await CommentsModel.findOne({id: newComment.id}, {projection: {_id: 0, postId: 0}})
        return comment
    },
    async findComment (commentId: string): Promise<CommentsType | undefined | null> {
        const comment = await CommentsModel.findOne({id: commentId}, {projection: {_id: 0, postId: 0}})
        return comment
    },
    async findCommentWithPag(postId: string, pageSize:number, pageNumber:number){
        return CommentsModel.find({postId: postId}, {projection: {_id: 0, postId: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    },
    async getCount(postId:string){
        return CommentsModel.count({postId: postId})
    },
    async deleteComment(id: string) {
        const result = await CommentsModel.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async updateComment (commentId: string, content: string) {
        const update = await CommentsModel.updateOne({id: commentId}, {$set: {content}})
        const updatedComment = await CommentsModel.findOne({id: commentId}, {projection: {_id: 0, postId: 0, id: 0, userId: 0, userLogin: 0, addedAt: 0}})
        return updatedComment
    },
    async findUser(userId:string, commentId: string){
        return CommentsModel.findOne({userId: userId, id:commentId})
    },
    async deleteAllComments() {
        const result = await CommentsModel.deleteMany({})
        return result
    }
}