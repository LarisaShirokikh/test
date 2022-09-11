import {LikesStatusType, NewestLikes, PostsType} from "../types";
import {likesStatusCollection, PostsModelClass} from "../settingses/db";
import {injectable} from "inversify";
import mongoose from "mongoose";

@injectable()
export class PostsRepository {
    //constructor(@inject(PostsModelClass.name) private postsModelClass: mongoose.Model<PostsType> ) {
    //}
    async findPosts(pageSize: number, pageNumber: number) {
        return PostsModelClass.find({}, {

            _id: 0,
            __v: 0

        }).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
    }

    async findPostById(postId: string): Promise<PostsType | null> {
        const post = await PostsModelClass.findOne({id: postId}, {_id: 0, __v: 0})
        return post
    }

    async createPost(newPosts: PostsType) {
        //const postInstance = new PostsModelClass({...newPosts})
        //console.log(postIn)
        //await postInstance.save()
        const post = await PostsModelClass.insertMany({...newPosts})
        console.log(post)
        return newPosts;

    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        const postInstance = await PostsModelClass.findOne({id: id}, {_id: 0, __v: 0})
        if (!postInstance) return false
        postInstance.title = title;
        postInstance.shortDescription = shortDescription;
        postInstance.content = content;
        postInstance.bloggerId = bloggerId
        await postInstance.save()
        return true
    }

    async deletePosts(id: string) {

        const result = await PostsModelClass.deleteOne({id: id})
        return result.deletedCount === 1
    }

    async getCount() {
        return PostsModelClass.count({})
    }

    async findBloggersPost(pageSize: number, pageNumber: number, bloggerId: string) {
        return PostsModelClass.find({bloggerId: bloggerId}, {
            _id: 0,
            __v: 0
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
    }

    async getCountBloggerId(bloggerId: string) {
        return PostsModelClass.count({bloggerId: bloggerId})
    }


    async getPostById(postId: string): Promise<PostsType | null> {
        const post = await PostsModelClass.findOne({id: postId}, {_id: 0, __v: 0})

        return post;
    }

    async updateLikeStatus(user: any, postId: string, likeStatus: "None" | "Like" | "Dislike", addedLikeStatusAt: object): Promise<boolean | undefined> {


        const isLikeStatus: LikesStatusType | null = await likesStatusCollection.findOne({
            parentId: postId,
            userId: user.accountData.id
        })

        if (!isLikeStatus) {
            await likesStatusCollection.insertMany({id: postId, userId: user.accountData.id, likeStatus})
            if (likeStatus === "Like") {

                const a = await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {"extendedLikesInfo.likesCount": 1},
                    "likesInfo.myStatus": likeStatus
                })

                const newestLike = {
                    addedAt: addedLikeStatusAt,
                    userId: user.accountData.id,
                    login: user.accountData.login
                }

                // @ts-ignore
                a.extendedLikesInfo.newestLikes = [newestLike, ...a.extendedLikesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }
            if (likeStatus === "Dislike") {
                await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {"extendedLikesInfo.dislikesCount": 1},
                    "extendedLikesInfo.myStatus": likeStatus
                })
                return true
            }

        } else {

            await likesStatusCollection.updateOne({id: postId, userId: user.accountData.id}, {$set: {likeStatus}})

            if (likeStatus === "Like" && isLikeStatus.likeStatus === "Dislike") {
                const a = await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {
                        "extendedLikesInfo.likesCount": 1,
                        "extendedLikesInfo.dislikesCount": -1
                    }, "extendedLikesInfo.myStatus": likeStatus
                })
                const newestLike = {
                    addedAt: addedLikeStatusAt,
                    userId: user.accountData.id,
                    login: user.accountData.login
                }
                // @ts-ignore
                a.extendedLikesInfo.newestLikes = [newestLike, ...a.extendedLikesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }

            if (likeStatus === "Like" && isLikeStatus.likeStatus === "None") {
                const a = await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {"extendedLikesInfo.likesCount": 1},
                    "extendedLikesInfo.myStatus": likeStatus
                })

                const newestLike = {
                    addedAt: addedLikeStatusAt,
                    userId: user.accountData.id,
                    login: user.accountData.login
                }
                // @ts-ignore
                a.extendedLikesInfo.newestLikes = [newestLike, ...a.extendedLikesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }

            if (likeStatus === "Like" && isLikeStatus.likeStatus === "Like") {
                return true
            }

            if (likeStatus === "Dislike" && isLikeStatus.likeStatus === "Like") {
                await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {
                        "extendedLikesInfo.likesCount": -1,
                        "extendedLikesInfo.dislikesCount": 1
                    }, "extendedLikesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "Dislike" && isLikeStatus.likeStatus === "Dislike") {
                return true
            }

            if (likeStatus === "Dislike" && isLikeStatus.likeStatus !== "Like") {
                await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {"extendedLikesInfo.likesCount": -1},
                    "extendedLikesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "None" && isLikeStatus.likeStatus === "Like") {
                await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {"extendedLikesInfo.likesCount": -1},
                    "extendedLikesInfo.myStatus": likeStatus
                })
                return true
            }

            if (likeStatus === "None" && isLikeStatus.likeStatus === "Dislike") {
                await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {"extendedLikesInfo.dislikesCount": -1},
                    "extendedLikesInfo.myStatus": likeStatus
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
