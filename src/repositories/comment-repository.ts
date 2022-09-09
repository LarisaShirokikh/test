import {CommentsType, LikesStatusType} from "../types";
import {CommentsModelClass, likesStatusCollection} from "../settingses/db";
import {injectable} from "inversify";


@injectable()
export class CommentsRepository {
    async createComment(newComment: CommentsType): Promise<CommentsType | undefined>  {
        await CommentsModelClass.insertMany([newComment])
        const comment = await CommentsModelClass.findOne({id: newComment.id}, {_id: 0, postId: 0, __v: 0})
        //@ts-ignore
        return comment

    }

    async findComment(commentId: string): Promise<CommentsType | undefined | null> {
        const comment = await CommentsModelClass.findOne({id: commentId},
            {_id: 0, postId: 0, __v: 0})
        return comment
    }

    async findCommentWithPag(postId: string, pageSize: number, pageNumber: number) {
        return CommentsModelClass.find({postId: postId}, {
            _id: 0,
            __v: 0
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
    }

    async getCount(postId: string) {
        return CommentsModelClass.count({postId: postId})
    }

    async deleteComment(id: string) {
        const result = await CommentsModelClass.deleteOne({id: id})
        return result.deletedCount === 1
    }

    async updateComment(commentId: string, content: string) {
        await CommentsModelClass.updateOne({id: commentId}, {$set: {content}})
        const updatedComment = await CommentsModelClass.findOne({id: commentId},
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
        return CommentsModelClass.findOne({userId: userId, id: commentId}, {_id: 0, __v: 0})
    }

    async deleteAllComments() {
        const result = await CommentsModelClass.deleteMany({})
        return result
    }

    async updateLikeStatus(user: any, commentId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean | undefined> {

        const isLikeStatus: LikesStatusType | null = await likesStatusCollection.findOne({
            id: commentId,
            userId: user.accountData.id
        })

        if (!isLikeStatus) {
            await likesStatusCollection.create({id: commentId, userId: user.accountData.id, likeStatus})
            if (likeStatus === "Like") {
                const a = await CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {"likesInfo.likesCount": 1},
                    "likesInfo.myStatus": likeStatus
                })
                return true
            }
            if (likeStatus === "Dislike") {
                await CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {"likesInfo.dislikesCount": 1},
                    "likesInfo.myStatus": likeStatus
                })
                return true
            }

        } else {

            await likesStatusCollection.updateOne({id: commentId, userId: user.accountData.id}, {$set: {likeStatus}})

            if (likeStatus === "Like" && isLikeStatus.likeStatus === "Dislike") {
                const a = await CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {
                        "likesInfo.likesCount": 1,
                        "likesInfo.dislikesCount": -1
                    }, "likesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "Like" && isLikeStatus.likeStatus === "None") {
                const a = await CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {"likesInfo.likesCount": 1},
                    "likesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "Like" && isLikeStatus.likeStatus === "Like") {
                return true
            }

            if (likeStatus === "Dislike" && isLikeStatus.likeStatus === "Like") {
                await CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {
                        "likesInfo.likesCount": -1,
                        "likesInfo.dislikesCount": 1
                    }, "likesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "Dislike" && isLikeStatus.likeStatus === "Dislike") {
                return true
            }

            if (likeStatus === "Dislike" && isLikeStatus.likeStatus !== "Like") {
                await CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {"likesInfo.likesCount": -1},
                    "likesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "None" && isLikeStatus.likeStatus === "Like") {
                await CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {"likesInfo.likesCount": -1},
                    "likesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "None" && isLikeStatus.likeStatus === "Dislike") {
                await CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {"likesInfo.dislikesCount": -1},
                    "likesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "None" && isLikeStatus.likeStatus === "None") {
                return true
            }
            return true
        }
    }
}