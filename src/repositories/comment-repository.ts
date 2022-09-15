import {CommentsType, LikesStatusType, UsersDBType, UsersType} from "../types";
import {CommentsModelClass, likesStatusCollection, PostsModelClass} from "../settingses/db";
import {injectable} from "inversify";


@injectable()
export class CommentsRepository {

    async createComment(newComment: CommentsType): Promise<CommentsType | undefined> {
        await CommentsModelClass.insertMany([newComment])
        console.log(newComment)
        const comment = await CommentsModelClass.findOne({id: newComment.id}, {_id: 0, postId: 0, __v: 0})
        //@ts-ignore
        return comment

    }

    async getComment(commentId: string, userId: string) {
        let myStatus = 'None'
        const comment = await CommentsModelClass.findOne({id: commentId}, {_id: 0, __v: 0})

        if (comment !== null) {
            console.log('comment 1', comment)
            if (comment.likesInfo.newestLikes.length > 0) {
                console.log('comment12345', comment.likesInfo.newestLikes)
                const likeComment = comment.likesInfo.newestLikes.find((comment: any) => comment.userId === userId)

                console.log(likeComment)
                if (likeComment) {
                    myStatus = likeComment.myStatus || 'None'
                }

                const objectStatus = comment.likesInfo.newestLikes;
                let likesCount = 0;
                let dislikesCount = 0;

                // for (let x = 0; objectStatus.length > x; x++) {
                //     if (objectStatus[x].myStatus === 'Like')
                if (objectStatus.map(l => l.myStatus === 'Like')) {
                    likesCount = likesCount + 1
                }
                if (objectStatus.map(l => l.myStatus === 'Dislike')) {
                    dislikesCount = dislikesCount + 1
                }


                function byDate(a: any, b: any) {
                    if (a.addedAt < b.addedAt) return 1;
                    if (a.addedAt > b.addedAt) return -1;
                    return 0;
                }

                const newArr = objectStatus
                    .filter(a => a.myStatus !== 'None')
                    .filter(a => a.myStatus !== 'Dislike')
                    .sort(byDate)
                    .slice(0, 3)

                const newestLikes = newArr.map(a => ({
                    addedAt: a.addedAt,
                    userId: a.userId,
                    login: a.login
                }))
                const returnComment = JSON.parse(JSON.stringify(comment))
                return {
                    ...returnComment,
                    likeInfo: {
                        ...returnComment.likesInfo,
                        likesCount: likesCount,
                        dislikesCount: dislikesCount,
                        myStatus: myStatus,
                        newestLikes: newestLikes
                    }
                }
            }
            return comment
        }
        // const comment = await CommentsModelClass.findOne({id: commentId},
        //     {_id: 0, postId: 0, __v: 0})
        // return comment
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

    async updateLikeStatus(user: any, commentId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean | null> {
        const comment = await CommentsModelClass.findOne({id: commentId})

        if (comment !== null) {
            console.log(comment.likesInfo.newestLikes)
            const findUser = comment.likesInfo.newestLikes.find(c => c.userId === user.accountData.id)
            console.log(findUser, 'findUser')
            if (findUser) {
                const count = CommentsModelClass.findOneAndUpdate({id: commentId}, {
                    $inc: {
                        'likesInfo.likesCount': 1
                    }, 'likesInfo.myStatus': likeStatus
                })
                const newestLike = {
                    //addedAt: addedLikeStatusAt,
                    userId: user.accountData.id,
                    login: user.accountData.login,
                    myStatus: likeStatus
                }
                return true
            }
            await CommentsModelClass.updateOne({id: commentId},
                {
                    $push: {
                        'likesInfo.newestLikes': {
                            //addedAt: addedLikeStatusAt,
                            userId: user.accountData.id,
                            login: user.accountData.login,
                            myStatus: likeStatus
                        }
                    }
                })
            // await CommentsModelClass.updateOne({id: commentId},
            //     {
            //         $push: {
            //             'likesInfo': {
            //
            //             }
            //         }
            //     }
            //     )
            return true

        }
        return null
        // const isLikeStatus: LikesStatusType | null = await likesStatusCollection.findOne({
        //     commentId: commentId,
        //     userId: user.accountData.id
        // })
        // console.log(isLikeStatus)
        // if (!isLikeStatus) {
        //     await likesStatusCollection.insertMany({id: commentId, userId: user.accountData.id, likeStatus})
        //     if (likeStatus === "Like") {
        //         await CommentsModelClass.findOneAndUpdate({id: commentId}, {
        //             $inc: {"likesInfo.likesCount": 1},
        //             "likesInfo.myStatus": likeStatus
        //         })
        //         return true
        //     }
        //     if (likeStatus === "Dislike") {
        //         await CommentsModelClass.findOneAndUpdate({id: commentId}, {
        //             $inc: {"likesInfo.dislikesCount": 1},
        //             "likesInfo.myStatus": likeStatus
        //         })
        //         return true
        //     }
        //
        // }
        // else {
        //
        //     await likesStatusCollection.updateOne({id: commentId, userId: user.accountData.id}, {$set: {likeStatus}})
        //
        //     if (likeStatus === "Like" && isLikeStatus.likeStatus === "Dislike") {
        //         await CommentsModelClass.findOneAndUpdate({id: commentId}, {
        //             $inc: {
        //                 "likesInfo.likesCount": 1,
        //                 "likesInfo.dislikesCount": -1
        //             }, "likesInfo.myStatus": likeStatus
        //         })
        //         return true
        //     }
        //
        //     if (likeStatus === "Like" && isLikeStatus.likeStatus === "None") {
        //         await CommentsModelClass.findOneAndUpdate({id: commentId}, {
        //             $inc: {"likesInfo.likesCount": 1},
        //             "likesInfo.myStatus": likeStatus
        //         })
        //         return true
        //     }
        //
        //     if (likeStatus === "Like" && isLikeStatus.likeStatus === "Like") {
        //         return true
        //     }
        //
        //     if (likeStatus === "Dislike" && isLikeStatus.likeStatus === "Like") {
        //         await CommentsModelClass.findOneAndUpdate({id: commentId}, {
        //             $inc: {
        //                 "likesInfo.likesCount": -1,
        //                 "likesInfo.dislikesCount": 1
        //             }, "likesInfo.myStatus": likeStatus
        //         })
        //         return true
        //     }
        //
        //     if (likeStatus === "Dislike" && isLikeStatus.likeStatus === "Dislike") {
        //         return true
        //     }
        //
        //     if (likeStatus === "Dislike" && isLikeStatus.likeStatus !== "Like") {
        //         await CommentsModelClass.findOneAndUpdate({id: commentId}, {
        //             $inc: {"likesInfo.likesCount": -1},
        //             "likesInfo.myStatus": likeStatus
        //         })
        //         return true
        //     }
        //
        //     if (likeStatus === "None" && isLikeStatus.likeStatus === "Like") {
        //         await CommentsModelClass.findOneAndUpdate({id: commentId}, {
        //             $inc: {"likesInfo.likesCount": -1},
        //             "likesInfo.myStatus": likeStatus
        //         })
        //         return true
        //     }
        //
        //     if (likeStatus === "None" && isLikeStatus.likeStatus === "Dislike") {
        //         await CommentsModelClass.findOneAndUpdate({id: commentId}, {
        //             $inc: {"likesInfo.dislikesCount": -1},
        //             "likesInfo.myStatus": likeStatus
        //         })
        //         return true
        //     }
        //
        //     if (likeStatus === "None" && isLikeStatus.likeStatus === "None") {
        //         return true
        //     }
        //     return true
        // }
        // return null
    }



}
