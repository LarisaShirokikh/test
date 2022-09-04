import {inject, injectable} from "inversify";
import {PostsService} from "../domain/posts-service";
import {NextFunction, Request, Response} from "express";
import {BloggersService} from "../domain/bloggers-service";
import {CommentsService} from "../domain/comment-service";

@injectable()
export class PostsController {
    constructor(@inject(PostsService)
                protected postsService: PostsService,
                protected bloggersService: BloggersService,
                protected commentService: CommentsService
    ) {}

    async getAllPosts(req: Request, res: Response) {

        const pageSize: number = Number(req.query.PageSize) || 10
        const pageNumber: number = Number(req.query.PageNumber) || 1


        const findPost = await this.postsService.findPosts(pageSize, pageNumber)
        const getCount = await this.postsService.getCount()
        res.send({
            "pagesCount": Math.ceil(getCount / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": getCount,
            "items": findPost
        })
    }
    async creatPostByBlogger(req: Request, res: Response) {
        const blogger = await this.bloggersService.findBloggersById(req.params.id)
        if (!blogger) res.sendStatus(404)
        res.status(201).send({
            addedAt: new Date,
            bloggerId: req.query.bloggerId,
            bloggerName: req.query.bloggerName,
            content: req.query.content,
            extendedLikesInfo: {
                dislikesCount: req.query.dislikesCount,
                likesCount: req.query.likesCount,
                myStatus: req.query.myStatus,
                newestLikes: req.query.newestLikes
            },
            id: new Object(),
            shortDescription: req.query.shortDescription,
            title: req.query.title
        })
    }
    async getPostById(req: Request, res: Response, next: NextFunction) {
        const post = await this.postsService.findPostById(req.params.id)
        if (post) return post
        next()
        res.status(404).send({
            errorsMessages: [{
                message: "Post with specified postId doesn't exists",
                field: "postId"
            }]
        });
        return

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
        const newComment = await this.commentService.createCommentByPostId(req.user, req.params.postId, req.body.content)
        res.status(201).send(newComment)
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
    //async likeStatus(req: Request, res: Response){}

}