import {inject, injectable} from "inversify";
import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {toString} from "express-validator/src/utils";
import {PostsService} from "../domain/posts-service";

@injectable()
export class BloggersController {
    constructor(@inject(BloggersService)
                protected bloggersService: BloggersService,
                protected postsService: PostsService
    ) {}

    async getAllBloggers(req: Request, res: Response) {

        const pageSize: number = Number(req.query.PageSize) || 10
        const pageNumber: number = Number(req.query.PageNumber) || 1
        const searchNameTerm = toString(req.query.SearchNameTerm)


        const foundBloggers = await this.bloggersService.findBloggers(pageSize, pageNumber, searchNameTerm)
        const getCount = await this.bloggersService.getCount(searchNameTerm)

        res.send({
            "pagesCount": Math.ceil(getCount / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": getCount,
            "items": foundBloggers
        })
    }
    async createBlogger(req: Request, res: Response) {
        const newBlogger = await this.bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
        return
    }
    async findBloggersById(req: Request, res: Response) {
        const blogger = await this.bloggersService.findBloggersById(req.params.id)
        if (blogger) {
            res.send(blogger)
        } else {
            res.send(404)
            return
        }
    }
    async updateBlogger(req: Request, res: Response) {
        const name = req.body.name
        const youtubeUrl = req.body.youtubeUrl
        const isUpdatedBlogger = await this.bloggersService.updateBlogger(req.params.id, name, youtubeUrl)
        if (isUpdatedBlogger) {
            res.status(201).send()
            return
        }
    }
    async createPostByBloggerId(req: Request, res: Response) {
        const blogger = await this.bloggersService.findBloggersById(req.params.bloggerId)
        if (!blogger) res.sendStatus(400)
        const newPost = await this.bloggersService
            .createPostByBloggerId(req.params.bloggerId, req.body.title, req.body.shortDescription,
                req.body.content)
        if (newPost) {
            res.status(201).send(newPost)
            return
        }
    }
    async findBloggersPost(req: Request, res: Response) {
        const pageSize: number = Number(req.query.PageSize) || 10
        const pageNumber: number = Number(req.query.PageNumber) || 1
        const findPost = await this.postsService.findBloggersPost(pageSize, pageNumber, req.params.bloggerId)
        const getCount = await this.postsService.getCountBloggerId(req.params.bloggerId)

        if (findPost.length > 0) {
            res.send({
                "pagesCount": Math.ceil(getCount / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": getCount,
                "items": findPost
            })
        } else {
            res.send(404)
        }

    }
    async deleteBloggers(req: Request, res: Response) {
        const isDeleted = await this.bloggersService.deleteBloggers(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
            return
        }
    }
}