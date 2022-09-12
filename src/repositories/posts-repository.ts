import {LikesStatusType, likeStatusEnum, NewestLikes, PostsType} from "../types";
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

    async findPostById(postId: string, userId: string) {
        let myStatus = 'None'
        const post = await PostsModelClass.findOne({id: postId}, {_id: 0, __v: 0})
        if (post !== null) {
            console.log('1234post', post)
            if (post.extendedLikesInfo.newestLikes.length > 0) {
                const likesPost = post.extendedLikesInfo.newestLikes.find((l: any) => l.userId === userId)
                console.log('likesPost', likesPost)
                if (likesPost) {
                    myStatus = likesPost.myStatus || 'None'
                }
            }
            console.log(post.extendedLikesInfo.newestLikes)

            const arrayStatus = post.extendedLikesInfo.newestLikes;
            let like = 0;
            let dislike = 0;
            for (let x = 0; arrayStatus.length > x; x++) {
                if (arrayStatus[x].myStatus === 'Like') {
                    like = like + 1
                }
                if (arrayStatus[x].myStatus === 'Dislike') {
                    dislike = dislike + 1
                }
            }

            function byDate(a: any, b: any) {
                if (a.addedAt < b.addedAt) return 1;
                if (a.addedAt > b.addedAt) return -1;
                return 0;
            }

            const newArr = arrayStatus
                .filter(a => a.myStatus !== 'None')
                .filter(a => a.myStatus !== 'Dislike')
                .sort(byDate)
                .slice(0, 3)

            const newestLikes = newArr.map(a => ({
                addedAt: a.addedAt,
                userId: a.userId,
                login: a.login
            }))
            const returnPost = JSON.parse(JSON.stringify(post))
            return {
                ...returnPost,
                extendedLikesInfo: {
                    ...returnPost.extendedLikesInfo,
                    likesCount: like,
                    dislikesCount: dislike,
                    myStatus: myStatus,
                    newestLikes: newestLikes
                }
            }
        }
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

        const post = await PostsModelClass.findOne({id: postId})
        if (post !== null) {
            const findUser = post.extendedLikesInfo.newestLikes.find(p => p.userId === user.accountData.id)

            if (findUser) {
                const a = await PostsModelClass.findOneAndUpdate({id: postId}, {
                    $inc: {
                        "extendedLikesInfo.likesCount": 1,
                        // "extendedLikesInfo.dislikesCount": -1
                    }, "extendedLikesInfo.myStatus": likeStatus
                })
                const newestLike = {
                    addedAt: addedLikeStatusAt,
                    userId: user.accountData.id,
                    login: user.accountData.login,
                    myStatus: likeStatus
                }

                return true
            }
            await PostsModelClass.updateOne({id: postId},
                {
                    $push: {
                        'extendedLikesInfo.newestLikes': {
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



