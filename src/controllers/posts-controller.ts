import {inject, injectable} from "inversify";
import {PostsService} from "../domain/posts-service";
import {NextFunction, Request, Response} from "express";
import {BloggersService} from "../domain/bloggers-service";
import {CommentsService} from "../domain/comment-service";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {jwtService} from "../application/jwt-service";

@injectable()
export class PostsController {

    constructor(@inject(PostsService)
                protected postsService: PostsService,
                protected bloggersService: BloggersService,
                protected commentService: CommentsService
    ) {
    }

    async getAllPosts(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1]
        let userId = ' '
        if (token) {
            userId = await jwtService.getUserIdByToken(token)

        }
// @ts-ignore
        const posts = await this.postsService.getAllPosts(req.query.PageNumber, req.query.PageSize, userId)
        res.status(200).send(posts);
        return
    }

    async creatPost(req: Request, res: Response) {
        const post = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.bloggerId)
        if (!post) return res.sendStatus(400)
        res.status(201).send(post)
        return

    }

    async creatPostByBlogger(req: Request, res: Response) {
        const blogger = await this.bloggersService.findBloggersById(req.params.bloggerId)
        console.log(blogger)

        if (!blogger) {
            res.sendStatus(404)
            return
        }
        const post = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.bloggerId)
        if (!post) return res.sendStatus(404)

        res.status(201).send(post)
        return
    }

    async getPostById(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1]
        let userId = ' '
        if (token) {
            userId = await jwtService.getUserIdByToken(token)

        }
        //console.log(1234, userId)

        if (typeof req.params.postId !== "string") {
            res.send(400);
            return;
        }

        const post = await this.postsService.findPostById(req.params.postId, userId)

        if (post) {
            res.status(200).send(post);
        } else {
            res.send(404);
        }

    }

    async updatePost(req: Request, res: Response) {

        let blogger = await this.bloggersService.findBloggersById(req.body.bloggerId)
        if (!blogger) {
            return res.status(400).send({errorsMessages: [{message: 'Invalid bloggerId', field: "bloggerId"}]})
        } else {
            const isUpdate = await this.postsService.updatePost(req.params.id,
                req.body.title,
                req.body.shortDescription,
                req.body.content,
                req.body.bloggerId)
            if (isUpdate) res.status(204).send(isUpdate)
            return
            res.sendStatus(401)
        }

    }

    async deletePost(req: Request, res: Response) {
        const isDeleted = await this.postsService.deletePosts(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }

    async createCommentByPostId(req: Request, res: Response) {
        const post = await this.postsService.getPostById(req.params.postId)

        if (!post) return res.sendStatus(404)

        const newComment = await this.commentService.createCommentByPostId(req.user, post.id, req.body.content)
        console.log(newComment)

        res.status(201).send(newComment)
        return
    }

    async getCountCommentsPost(req: Request, res: Response) {
        const pageSize: number = Number(req.query.PageSize) || 10
        const pageNumber: number = Number(req.query.PageNumber) || 1

        const findComment = await this.commentService.findCommentWithPag(req.params.postId, pageSize, pageNumber)
        const getCount = await this.commentService.getCount(req.params.postId)
        const result = {
            "pagesCount": Math.ceil(getCount / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": getCount,
            "items": findComment
        }
        res.send(result)
        return
    }

    async likeStatusPost(req: Request, res: Response) {

        const post = await this.postsService.getPostById(req.params.postId)

        if (!post) {
            res.status(404).send({
                errorsMessages: [{
                    message: "Post with specified postId doesn't exists",
                    field: "postId"
                }]
            });
            return
        }


        await this.postsService.updateLikeStatus(req.user, req.params.postId, req.body.likeStatus)

        res.status(204).send()
        return
    }

}