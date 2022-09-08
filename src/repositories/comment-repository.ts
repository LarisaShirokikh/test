import {CommentType, LikesStatusType} from "../types";
import {CommentsModel, likesStatusCollection} from "../settingses/db";
import {injectable} from "inversify";


@injectable()
export class CommentsRepository {
    async createComment(newComment: CommentType): Promise<CommentType | undefined> {
        await CommentsModel.insertMany([newComment])
        const comment = await CommentsModel.findOne({id: newComment.id}, {_id: 0, postId: 0, __v: 0})
        // @ts-ignore
        return comment
    }

    async findComment(commentId: string): Promise<CommentType | undefined | null> {
        const comment = await CommentsModel.findOne({id: commentId}, {_id: 0, __v: 0})
        return comment
    }

    async findCommentWithPag(postId: string, pageSize: number, pageNumber: number) {
        return CommentsModel.find({postId: postId}, {
            _id: 0,
            __v: 0
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
    }

    async getCount(postId: string) {
        return CommentsModel.count({postId: postId})
    }

    async deleteComment(id: string) {
        const result = await CommentsModel.deleteOne({id: id})
        return result.deletedCount === 1
    }

    async updateComment(commentId: string, content: string) {
        await CommentsModel.updateOne({id: commentId}, {$set: {content}})
        const updatedComment = await CommentsModel.findOne({id: commentId},
            {
                _id: 0,
                postId: 0,
                id: 0,
                userId: 0,
                userLogin: 0,
                addedAt: 0,
                __v: 0
            }
        )
        return updatedComment
    }

    async findUser(userId: string, commentId: string) {
        return CommentsModel.findOne({userId: userId, id: commentId}, {_id: 0, __v: 0})
    }

    async updateLikeStatus(user: any, commentId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean|undefined> {

        const isLikeStatus:LikesStatusType|null = await likesStatusCollection.findOne({id: commentId, userId: user.id})

        if (!isLikeStatus) {
            await likesStatusCollection.insertMany({id: commentId, userId: user.id, likeStatus})
            if(likeStatus === "Like") {
                const a = await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": 1}, "likesInfo.myStatus": likeStatus})
                return true
            }
            if(likeStatus === "Dislike") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.dislikesCount": 1}, "likesInfo.myStatus": likeStatus})
                return true
            }

        } else {

            await likesStatusCollection.updateOne({id: commentId, userId: user.id}, {$set: {likeStatus}})

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "Dislike") {
                const a = await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": 1, "likesInfo.dislikesCount": -1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "None") {
                const a = await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": 1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "Like") {
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus === "Like") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": -1, "likesInfo.dislikesCount": 1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus === "Dislike") {
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus !== "Like") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": -1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "Like") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": -1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "Dislike") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.dislikesCount": -1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "None") {
                return true
            }
            return true
        }
    }
}