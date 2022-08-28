
import {PostsType} from "../types";
import {PostsModel} from "../settingses/db";


export const postsRepository = {
    async findPosts(pageSize:number, pageNumber:number) {
        return PostsModel.find({}, {projection: {_id: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    },
    async findPostById(id: string) {
        return PostsModel.findOne({id: id}, {projection: {_id: 0}})
    },
    async createPost(newPosts: PostsType) {
        await PostsModel.create(newPosts)
        const {id, title, shortDescription, content, bloggerId, bloggerName} = newPosts
        return {
            id, title, shortDescription, content, bloggerId, bloggerName
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        const result = await PostsModel.updateOne({id: id}, {
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

        const result = await PostsModel.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async getCount() {
        return PostsModel.count({})
    },
    async findBloggersPost(pageSize:number, pageNumber:number, bloggerId: string){
        return PostsModel.find({bloggerId: bloggerId}, {projection: {_id: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    },
    async getCountBloggerId(bloggerId: string) {
        return PostsModel.count({bloggerId: bloggerId})
    },
    async deleteAllPost(): Promise<boolean> {
        const result = PostsModel.deleteMany({})
        return true
    },
    async getPostById (postId: string): Promise<PostsType | null> {
        const post  = await PostsModel.findOne({id: postId}, {projection: {_id: 0}})
        return post;
    },
}