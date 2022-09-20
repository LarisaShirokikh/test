import {CommentsType, LikesStatusType, PostsType, ReturnFindCommentIdType, UsersDBType, UsersType} from "../types";
import {CommentsModelClass, likesStatusCollection, PostsModelClass} from "../settingses/db";
import {injectable} from "inversify";


const addLikesToComment = async (comment: CommentsType, userId: string) => {
    let myStatus = 'None'
    if (comment !== null) {
        if (comment.likesInfo.newestLikes.length > 0) {
            const userInNewestLikes = comment.likesInfo.newestLikes
                .find((l: any) => l.userId === userId)

            if (userInNewestLikes) {
                myStatus = userInNewestLikes.myStatus
            }
        }

        const newestLikesArray = comment.likesInfo.newestLikes;
        let like = 0;
        let dislike = 0;
        for (let x = 0; newestLikesArray.length > x; x++) {
            if (newestLikesArray[x].myStatus === 'Like') {
                like = like + 1
            }
            if (newestLikesArray[x].myStatus === 'Dislike') {
                dislike = dislike + 1
            }
        }

        function byDate(a: any, b: any) {
            if (a.addedAt < b.addedAt) return 1;
            if (a.addedAt > b.addedAt) return -1;
            return 0;
        }
        const newArr = newestLikesArray
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
            LikesInfo: {
                ...returnComment.LikesInfo,
                likesCount: like,
                dislikesCount: dislike,
                myStatus: myStatus,
                newestLikes: newestLikes
            }
        }
    }
    return addLikesToComment
}





@injectable()
export class CommentsRepository {

    async createComment(newComment: CommentsType): Promise<CommentsType | undefined> {
        await CommentsModelClass.insertMany({...newComment})
        console.log(newComment)
        const comment = await CommentsModelClass.findOne({id: newComment.id}, {_id: 0, postId: 0, __v: 0})
        //@ts-ignore
        return comment

    }

    async findComment(commentId: string, userId: string): Promise<ReturnFindCommentIdType | null> {
        let myStatus = "None"
        const comment = await CommentsModelClass.findOne({id: commentId})

        if (comment !== null) {
            if (comment.likesInfo.newestLikes.length > 0) {
                const userInNewestLikes = comment.likesInfo.newestLikes.find((l: any) => l.userId === userId)

                if (userInNewestLikes) {
                    myStatus = userInNewestLikes.myStatus
                }
            }
            const newestLikesArray = comment.likesInfo.newestLikes;
            let like = 0;
            let dislike = 0;
            for (let x = 0; newestLikesArray.length > x; x++) {
                if (newestLikesArray[x].myStatus === 'Like') {
                    like = like + 1
                }
                if (newestLikesArray[x].myStatus === 'Dislike') {
                    dislike = dislike + 1
                }
            }

            function byDate(a: any, b: any) {
                if (a.addedAt < b.addedAt) return 1;
                if (a.addedAt > b.addedAt) return -1;
                return 0;
            }

            const newArr = newestLikesArray
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
            //  const retComment = delete returnComment.likesInfo.newestLikes

            const commentId: ReturnFindCommentIdType = {
                id: returnComment.id as string,
                content: returnComment.content as string,
                userId: returnComment.userId as string,
                userLogin: returnComment.userLogin as string,
                addedAt: returnComment.addedAt as any,
                likesInfo: {
                    likesCount: like as number,
                    dislikesCount: dislike as number,
                    myStatus: myStatus as string
                }

            }
            return commentId
        }
        return comment

    }

    async findAllCommentWithPag(postId: string, pageSize: number, pageNumber: number, userId: string) {
        const commentsCount = await CommentsModelClass.count({})
        const pagesCount = Math.ceil(commentsCount / pageSize)

        const comments = await CommentsModelClass.find({postId: postId}, {_id: 0, __v: 0})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        let commentsWithLikes: CommentsType[] = []

        for (let comment of comments) {
            const commentWithLikesInfo = await addLikesToComment(comment, userId)
            commentsWithLikes.push(commentWithLikesInfo)
        }

        const allComments = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: commentsCount,
            items: commentsWithLikes
        }
        return allComments
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
