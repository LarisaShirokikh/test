
import { PostsType } from "../types";
import { PostsModelClass } from "../settingses/db";
import {inject, injectable} from "inversify";
import mongoose from "mongoose";

@injectable()
 export class PostsRepository {
    //constructor(@inject(PostsModelClass.name) private postsModelClass: mongoose.Model<PostsType> ) {
   //}
    async findPosts(pageSize:number, pageNumber:number) {
        return PostsModelClass.find({}, {projection: {_id: 0, __v: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    }
    async findPostById(id: string) {
        const post = await PostsModelClass.findOne({id: id}, {projection: {_id: 0, __v: 0}}).lean()
        console.log(post)
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
        const postInstance = await PostsModelClass.findOne({id: id}, {projection: {_id: 0, __v: 0}})
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
        return PostsModelClass.find({bloggerId: bloggerId}, {_id: 0, __v: 0}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()
    }
    async getCountBloggerId(bloggerId: string) {
        return PostsModelClass.count({bloggerId: bloggerId})
    }
    async deleteAllPost(): Promise<boolean> {
        const result = PostsModelClass.deleteMany({})
        return true
    }
        async getPostById (postId: string): Promise<PostsType | null> {
        const post  = await PostsModelClass.findOne({id: postId}, {_id: 0, __v: 0})
        return post;
    }

    async updateLikePost(postId: string, likeStatus: string) {
        const post = await PostsModelClass.findOne({postId: postId})
        if (!post) return false
const newStatus = await PostsModelClass.updateOne({postId}, {$set: {likeStatus: 'None'}})
        return true
    }
}
