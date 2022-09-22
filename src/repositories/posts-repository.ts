import {PostsOfBloggerType, PostsType} from "../types";
import {PostsModelClass} from "../settingses/db";
import {injectable} from "inversify";


const addLikesToPost = async (post: PostsType, userId: string) => {
    let myStatus = 'None'
    if (post !== null) {

        if (post.extendedLikesInfo.newestLikes.length > 0) {
            const userInNewestLikes = post.extendedLikesInfo.newestLikes
                .find((l: any) => l.userId === userId)

            if (userInNewestLikes) {
                myStatus = userInNewestLikes.myStatus
            }
        }

        const newestLikesArray = post.extendedLikesInfo.newestLikes;
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
    return addLikesToPost
}


@injectable()
export class PostsRepository {

    async getAllPosts(pageNumber: number, pageSize: number, userId: string): Promise<PostsOfBloggerType | undefined | null> {
        const postsCount = await PostsModelClass.count({})
        const pagesCount = Math.ceil(postsCount / pageSize)

        const posts = await PostsModelClass.find({}, {_id: 0, __v: 0})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
        let postsWithLikes: PostsType[] = []

        for (let post of posts) {
            const postWithLikesInfo = await addLikesToPost(post, userId)
            postsWithLikes.push(postWithLikesInfo)
        }
        const allPosts = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: postsWithLikes
        }
        //console.log('posts', allPosts)
//@ts-ignore
        return allPosts
    }

    async findBloggersPost(pageNumber: number, pageSize: number, bloggerId: string, userId: string): Promise<PostsOfBloggerType | undefined | null> {

        const postsCount = await PostsModelClass.count({bloggerId: bloggerId})
        //console.log(postsCount)
        const pagesCount = Math.ceil(postsCount / pageSize)
        //console.log(pagesCount)
        const posts = await PostsModelClass.find({bloggerId: bloggerId}, {_id: 0, __v: 0})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()
        let postsWithLikes: PostsType[] = []
        for (let post of posts) {
            const postWithLikesInfo = await addLikesToPost(post, userId)
            postsWithLikes.push(postWithLikesInfo)
        }
        //console.log("12345", postsWithLikes)
        const allPosts = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: postsWithLikes
        }
        //@ts-ignore
        return allPosts
    }

    async findPosts(pageSize: number, pageNumber: number, userId: string) {
        let myStatus = 'None'
        return PostsModelClass.find({}, {_id: 0, __v: 0})
            .skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        //console.log('posts', posts)

    }

    async findPostById(postId: string, userId: string) {
        let myStatus = 'None'
        const post = await PostsModelClass.findOne({id: postId}, {_id: 0, __v: 0})

        //
        if (post !== null) {

            if (post.extendedLikesInfo.newestLikes.length > 0) {
                const userInNewestLikes = post.extendedLikesInfo.newestLikes.find((l: any) => l.userId === userId)

                if (userInNewestLikes) {
                    myStatus = userInNewestLikes.myStatus
                }
            }

            const newestLikesArray = post.extendedLikesInfo.newestLikes;
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
            if (!findUser) {
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
            } else {

                await PostsModelClass.updateOne({id: postId, 'extendedLikesInfo.newestLikes.userId': findUser.userId},
                    {
                        $pull:
                            {
                                'extendedLikesInfo.newestLikes': {'userId': findUser.userId}
                            }
                    })
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
}



