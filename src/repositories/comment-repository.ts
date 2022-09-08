
import {CommentsType} from "../types";
import { CommentsModelClass} from "../settingses/db";
import {injectable} from "inversify";


@injectable()
export class CommentsRepository  {
    async createComment (newComment: CommentsType) {
        const result = await CommentsModelClass.insertMany([newComment])
        const comment = await CommentsModelClass.findOne({id: newComment.id}, {projection: {_id: 0, __v: 0}})
        return comment
    }
    async findComment (commentId: string): Promise<CommentsType | undefined | null> {
        const comment = await CommentsModelClass.findOne({id: commentId}, {projection: {_id: 0, __v: 0}})
        return comment
    }
    async findCommentWithPag(postId: string, pageSize:number, pageNumber:number){
        return CommentsModelClass.find({postId: postId}, {projection: {_id: 0, __v: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    }
    async getCount(postId:string){
        return CommentsModelClass.count({postId: postId})
    }
    async deleteComment(id: string) {
        const result = await CommentsModelClass.deleteOne({id: id})
        return result.deletedCount === 1
    }
    async updateComment (commentId: string, content: string) {
        const update = await CommentsModelClass.updateOne({id: commentId}, {$set: {content}})
        const updatedComment = await CommentsModelClass.findOne({id: commentId}, {projection: {_id: 0, postId: 0, id: 0, userId: 0, userLogin: 0, addedAt: 0}})
        return updatedComment
    }
    async findUser(userId:string, commentId: string){
        return CommentsModelClass.findOne({userId: userId, id:commentId}, {projection: {_id: 0, __v: 0}})
    }
    async deleteAllComments() {
        const result = await CommentsModelClass.deleteMany({})
        return result
    }

    async updateCommentLikeStatus(user: string, commentId: string, likeStatus: string) {
        return CommentsModelClass.updateOne({id: commentId}, {$set: {likeStatus: +1}})
    }
}