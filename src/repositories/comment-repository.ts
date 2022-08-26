import {commentsCollection} from "../settingses/db";
import {CommentContentType, CommentsType} from "../types";



export const commentRepository = {
    async createComment (newComment: CommentsType): Promise<CommentsType | undefined> {
        const result = await commentsCollection.insertOne(newComment)
        const comment = await commentsCollection.findOne({id: newComment.id}, {projection: {_id: 0, postId: 0}})
        // @ts-ignore
        return comment
    },
    async findComment (commentId: string): Promise<CommentsType | undefined | null> {
        const comment = await commentsCollection.findOne({id: commentId}, {projection: {_id: 0, postId: 0}})

        return comment
    },
    async findCommentWithPag(postId: string, pageSize:number, pageNumber:number){
        return await commentsCollection.find({postId: postId}, {projection: {_id: 0, postId: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()
    },
    async getCount(postId:string){
        return await commentsCollection.count({postId: postId})
    },
    async deleteComment(id: string) {

        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async updateComment (commentId: string, content: string): Promise<CommentContentType>  {
        const update = await commentsCollection.updateOne({id: commentId}, {$set: {content}})

        const updatedComment = await commentsCollection.findOne({id: commentId}, {projection: {_id: 0, postId: 0, id: 0, userId: 0, userLogin: 0, addedAt: 0}})
        // @ts-ignore
        return updatedComment
    },
    async findUser(userId:string, commentId: string){
        return await commentsCollection.findOne({userId: userId, id:commentId})
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await commentsCollection.deleteMany({})
        return true
    }
}