import {LikesStatusType, PostType} from "../types";
import {likesStatusCollection, PostsModel} from "../settingses/db";
import {injectable} from "inversify";


@injectable()
export class PostsRepository {

    async findPosts(pageSize: number, pageNumber: number) {
        return PostsModel.find({}, {

                _id: 0,
                __v: 0

        }).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
    }

    async findPostById(postId: string): Promise<PostType | null> {
        const post = await PostsModel.findOne({id: postId}, {_id: 0, __v: 0})
        return post
    }

    async createPost(newPost: PostType): Promise<PostType | undefined> {
        await PostsModel.insertMany([newPost])
        return newPost
    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        const result = await PostsModel.updateOne({id: postId}, {$set: {title, shortDescription, content, bloggerId}})
        return result.matchedCount === 1
    }

    async deletePosts(id: string) {

        const result = await PostsModel.deleteOne({id: id})
        return result.deletedCount === 1
    }

    async getCount() {
        return PostsModel.count({})
    }

    async findBloggersPost(pageSize: number, pageNumber: number, bloggerId: string) {
        return PostsModel.find({bloggerId: bloggerId}, {
            _id: 0,
            __v: 0
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
    }

    async getCountBloggerId(bloggerId: string) {
        return PostsModel.count({bloggerId: bloggerId})
    }


    async getPostById(postId: string): Promise<PostType | null> {
        const post = await PostsModel.findOne({id: postId}, {_id: 0, __v: 0})

        return post;
    }

    async updateLikeStatus(user: any, postId: string, likeStatus: "None" | "Like" | "Dislike", addedLikeStatusAt: object): Promise<boolean|undefined> {

        debugger
        const isLikeStatus:LikesStatusType|null = await likesStatusCollection.findOne({id: postId, userId: user.id})

        if (!isLikeStatus) {
            await likesStatusCollection.insertMany({id: postId, userId: user.id, likeStatus})
            if(likeStatus === "Like") {
                // await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": 1}, })
                // await PostsModel.findOneAndUpdate({id: postId}, {"likesInfo.myStatus": likeStatus})
                const a = await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": 1}, "likesInfo.myStatus": likeStatus})

                const newestLike = {
                    addedAt:addedLikeStatusAt,
                    userId: user.id,
                    login: user.login
                }

                // @ts-ignore
                a.likesInfo.newestLikes = [newestLike, ...a.likesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }
            if(likeStatus === "Dislike") {
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.dislikesCount": 1}, "likesInfo.myStatus": likeStatus})
                return true
            }

        } else {

            await likesStatusCollection.updateOne({id: postId, userId: user.id}, {$set: {likeStatus}})

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "Dislike") {
                const a = await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": 1, "likesInfo.dislikesCount": -1}, "likesInfo.myStatus": likeStatus})
                const newestLike = {
                    addedAt:addedLikeStatusAt,
                    userId: user.id,
                    login: user.login
                }
                // @ts-ignore
                a.likesInfo.newestLikes = [newestLike, ...a.likesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "None") {
                const a = await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": 1}, "likesInfo.myStatus": likeStatus})

                const newestLike = {
                    addedAt:addedLikeStatusAt,
                    userId: user.id,
                    login: user.login
                }
                // @ts-ignore
                a.likesInfo.newestLikes = [newestLike, ...a.likesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "Like") {
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus === "Like") {
                // await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": -1}})
                // await PostsModel.findOneAndUpdate({id: postId}, {"likesInfo.myStatus": likeStatus})
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": -1, "likesInfo.dislikesCount": 1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus === "Dislike") {
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus !== "Like") {
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": -1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "Like") {
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": -1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "Dislike") {
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.dislikesCount": -1}, "likesInfo.myStatus": likeStatus})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "None") {
                return true
            }
            return true
        }
    }
}
