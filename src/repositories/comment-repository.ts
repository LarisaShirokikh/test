import {commentsCollection} from "../settingses/settings";



export const commentRepository = {
    async createComment(newComment: any) {
        await commentsCollection.insertOne(newComment)
        const {id, content, userId, userLogin, addedAt} = newComment
        return {id, content, userId, userLogin, addedAt}
    },
    async findComment(id:string){
        return await commentsCollection.findOne({id: id}, {projection: {_id: 0, postId: 0}})
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
    async updateComment(content:string, id:string ){
        const result = await commentsCollection.updateOne({id: id}, {
            $set: {
                content: content,
            }
        })
        return result.matchedCount === 1

    },
    async findUser(userId:string, commentId: string){
        return await commentsCollection.findOne({userId: userId, id:commentId})
    },

    async deleteAllComments(): Promise<boolean> {
        const result = await commentsCollection.deleteMany({})
        return true
    }
}