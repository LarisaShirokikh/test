import {postsCollection} from "../settingses/db";
import {PostsType} from "../types";


const options = {
    projection: {
        _id: 0,
    }
}
export const postsRepository = {
    async findPosts(pageSize:number, pageNumber:number) {
        return await postsCollection.find({}, options).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()
    },
    async findPostById(id: string) {
        return await postsCollection.findOne({id: id}, options)
    },
    async createPost(newPosts: PostsType) {
        await postsCollection.insertOne(newPosts)
        const {id, title, shortDescription, content, bloggerId, bloggerName} = newPosts
        return {
            id, title, shortDescription, content, bloggerId, bloggerName
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        const result = await postsCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
            }
        })
        return result.matchedCount === 1
    },
    async deletePosts(id: string) {

        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async getCount() {
        return await postsCollection.count({})
    },
    async findBloggersPost(pageSize:number, pageNumber:number, bloggerId: string){
        return await postsCollection.find({bloggerId: bloggerId}, options).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()
    },
    async getCountBloggerId(bloggerId: string) {
        return await postsCollection.count({bloggerId: bloggerId})
    },
    async deleteAllPost(): Promise<boolean> {
        const result = postsCollection.deleteMany({})
        return true
    },
    async getPostById (postId: string): Promise<PostsType | null> {
        const post  = await postsCollection.findOne({id: postId}, {projection: {_id: 0}})
        return post;
    },
}