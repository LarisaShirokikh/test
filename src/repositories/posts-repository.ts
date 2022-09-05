
import { PostsType } from "../types";
import { PostsModelClass } from "../settingses/db";
import {inject, injectable} from "inversify";
import mongoose from "mongoose";

@injectable()
 export class PostsRepository {
    //constructor(@inject(PostsModelClass.name) private postsModelClass: mongoose.Model<PostsType> ) {
   //}
    async findPosts(pageSize:number, pageNumber:number) {
        return PostsModelClass.find({}, {projection: {_id: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    }
    async findPostById(id: string) {
        return PostsModelClass.findOne({id: id}, {projection: {_id: 0, __v: 0}}).lean()
    }
    async createPost(newPosts: PostsType) {
        const postInstance = new PostsModelClass({...newPosts})
        await postInstance.save()
        return newPosts;

    }
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        const postInstance = await PostsModelClass.findOne({id: id})
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
    async findBloggersPost(pageSize:number, pageNumber:number, bloggerId: string){
        return PostsModelClass.find({bloggerId: bloggerId}, {projection: {_id: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    }
    async getCountBloggerId(bloggerId: string) {
        return PostsModelClass.count({bloggerId: bloggerId})
    }
    async deleteAllPost(): Promise<boolean> {
        const result = PostsModelClass.deleteMany({})
        return true
    }
        async getPostById (postId: string): Promise<PostsType | null> {
        const post  = await PostsModelClass.findOne({id: postId},  {_id: false, __v: false})
        return post;
    }
}
