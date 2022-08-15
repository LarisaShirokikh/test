
import { v4 as uuidv4 } from 'uuid';
import {postDbRepository} from "../repositories/posts-repository";
import {bloggersDbRepository} from "../repositories/bloggers-repository";
import {CommentType, Pagination, PostType} from "../types";

export const postsService = {
    async getAllPosts (
        pageNumber: string = "1" || undefined || null,
        pageSize: string = "10" || undefined || null
    ): Promise<PostType | undefined | null> {

        const postsDb = await postDbRepository
            .getAllPosts(+pageNumber, +pageSize)
        return postsDb


    },

    async createPost (title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | undefined> {
        const blogger = await bloggersDbRepository.getBloggerById(bloggerId)
        if (blogger) {
            const newPost: PostType = {

                id: uuidv4(),
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName: blogger.name
            }


            const createdPost = await postDbRepository.createPost(newPost)
            return createdPost
        }
    },

    async getPostById (postId: string): Promise<PostType | null> {

        return postDbRepository.getPostById(postId)
    },

    async updatePost (postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean>  {
        return postDbRepository.updatePost(postId, title, shortDescription, content, bloggerId)
    },

    async deletePost (postId: string): Promise<boolean>  {
        return postDbRepository.deletePost(postId)
    },

    async getCommentsByPostId(
        postId: string,
        pageNumber: string,
        pageSize: string
    ): Promise<Pagination<CommentType[]> | null > {
        const commentsDb = await postDbRepository
            .getCommentsByPostId
            (
                postId,
                +pageSize,
                +pageNumber
            );
        return commentsDb
    },

    async findPostById(id: string) {
        return await postDbRepository.findPostById(id)
    },

}