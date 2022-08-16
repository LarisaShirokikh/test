
import {commentsCollection, postsCollection} from "../settings";
import {CommentType, Pagination, PostType} from "../types";



export const postDbRepository = {
    async findPosts(pageSize:number, pageNumber:number) {
        return await postsCollection.find({}, {projection: {_id: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()
    },
    async findPostById(id: string) {
        return await postsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async createPost(newPosts: PostType) {
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
        return await postsCollection.find({bloggerId: bloggerId}, {projection: {_id: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()
    },
    async getCountBloggerId(bloggerId: string) {
        return await postsCollection.count({bloggerId: bloggerId})
    },


}