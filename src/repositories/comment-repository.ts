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

    async findComment(commentId: string, userId: string) {
        let myStatus = "None"
        return  CommentsModelClass.findOne({id: commentId},
            {_id: 0, postId: 0, __v: 0, 'likesInfo.newestLikes': 0})
    }
    //     if (comment !== null) {
    //         if (comment.likesInfo.newestLikes.length > 0) {
    //             const userInNewestLikes = comment.likesInfo.newestLikes.find((l: any) => l.userId === userId)
    //
    //             if (userInNewestLikes) {
    //                 myStatus = userInNewestLikes.myStatus
    //             }
    //         }
    //         const newestLikesArray = comment.likesInfo.newestLikes;
    //         let like = 0;
    //         let dislike = 0;
    //         for (let x = 0; newestLikesArray.length > x; x++) {
    //             if (newestLikesArray[x].myStatus === 'Like') {
    //                 like = like + 1
    //             }
    //             if (newestLikesArray[x].myStatus === 'Dislike') {
    //                 dislike = dislike + 1
    //             }
    //         }
    //
    //         function byDate(a: any, b: any) {
    //             if (a.addedAt < b.addedAt) return 1;
    //             if (a.addedAt > b.addedAt) return -1;
    //             return 0;
    //         }
    //
    //         const newArr = newestLikesArray
    //             .filter(a => a.myStatus !== 'None')
    //             .filter(a => a.myStatus !== 'Dislike')
    //             .sort(byDate)
    //             .slice(0, 3)
    //
    //         const newestLikes = newArr.map(a => ({
    //             addedAt: a.addedAt,
    //             userId: a.userId,
    //             login: a.login
    //         }))
    //         const returnComment = JSON.parse(JSON.stringify(comment))
    //         const retComment = delete returnComment.likesInfo.newestLikes
    //         console.log(retComment)
    //         return {
    //             ...returnComment,
    //             likesInfo: {
    //                 ...returnComment.likesInfo,
    //                 likesCount: like,
    //                 dislikesCount: dislike,
    //                 myStatus: myStatus
    //             }
    //         }
    //     }
    //     return comment
    // }

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

    async updateLikeStatus(user: any, commentId: string, likeStatus: "None" | "Like" | "Dislike", addedLikeStatusAt: object): Promise<boolean | undefined> {
        const comment = await CommentsModelClass.findOne({id: commentId})
        if (comment !== null) {
            const findUser = comment.likesInfo.newestLikes.find(p => p.userId === user.accountData.id)
            //const postLikeStatus = post.extendedLikesInfo.myStatus
            //if (postLikeStatus == likeStatus)
            if (!findUser) {
                await CommentsModelClass.updateOne({id: commentId},
                    {
                        $push: {
                            'likesInfo.newestLikes': {
                                addedAt: addedLikeStatusAt,
                                userId: user.accountData.id,
                                login: user.accountData.login,
                                myStatus: likeStatus
                            }
                        }
                    })
                return true
            } else {

                await CommentsModelClass.updateOne({id: commentId, 'likesInfo.newestLikes.userId': findUser.userId},
                    {
                        $pull:
                            {
                                'likesInfo.newestLikes': {'userId': findUser.userId}
                            }
                    })
                await CommentsModelClass.updateOne({id: commentId},
                    {
                        $push: {
                            'likesInfo.newestLikes': {
                                addedAt: addedLikeStatusAt,
                                userId: user.accountData.id,
                                login: user.accountData.login,
                                myStatus: likeStatus
                            }
                        }
                    })
                return true
            }
        }
    }


}
