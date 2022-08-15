import {Request, Response, Router} from "express";

import {bloggersService} from "../domain/bloggers-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../middlewares/input-validation";
import {bloggersDbRepository} from "../repositories/bloggers-repository";
import {
    contentValidation, nameValidation,

    shortDescriptionValidation, titleValidation,
    urlValidation
} from "../middlewares/validations";


export const bloggersRoute = Router({});


bloggersRoute.get('/',
    async (req: Request, res: Response) => {
        const pageNumber = typeof req.query.PageNumber === 'string' ? req.query.PageNumber : '1'
        const pageSize = typeof req.query.PageSize === 'string' ? req.query.PageSize : '10'
        const searchNameTerm = typeof req.query.SearchNameTerm === 'string' ? req.query.SearchNameTerm : null

        const bloggers = await bloggersService
            .getAllBloggers(
                pageNumber,
                pageSize,
                searchNameTerm)

        if (!bloggers) {
            return res.status(500).send('something went wrong')
        }

        res.status(200).send(bloggers);
    }
)

bloggersRoute.post('/',
    authMiddleware,
    nameValidation,
    urlValidation,
    inputValidation,
    async (req: Request, res: Response) => {
        const newBlogger = await bloggersService
            .createBlogger(
                req.body.name,
                req.body.youtubeUrl
            )
        res.status(201).send(newBlogger)
    }
)

bloggersRoute.get('/:bloggerId',
    async (req: Request, res: Response) => {
        const blogger = await bloggersService
            .getBloggerById(req.params.bloggerId);
        if (blogger) {
            res.status(200).send(blogger);
        } else {
            res.send(404);
        }
    }
)

bloggersRoute.put('/:bloggerId',
    authMiddleware,
    nameValidation,
    urlValidation,
    inputValidation,
    async (req: Request, res: Response) => {

        const isUpdated = await bloggersService.updateBlogger(req.params.bloggerId, req.body.name, req.body.youtubeUrl)

        if (isUpdated) {
            const blogger = await bloggersService.getBloggerById(req.params.bloggerId)
            res.status(204).send(blogger);
        } else {
            res.send(404)
        }
    }
)

bloggersRoute.delete('/:bloggerId',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersService.deleteBlogger(req.params.bloggerId)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
)

bloggersRoute.get('/:bloggerId/posts',
    async (req: Request, res: Response) => {

        const blogger = await bloggersDbRepository.isBlogger(req.params.bloggerId);
        if (!blogger) {
            res.status(404)
                .send({
                    errorsMessages: [{
                        message: "Problem with a bloggerId field", field: "bloggerId"
                    }]
                });
        } else {
            const posts = await bloggersService
                .getPostsByBloggerId(
                    req.params.bloggerId,
                    // @ts-ignore
                    req.query.PageNumber,
                    req.query.PageSize
                );
            res.status(200).send(posts);
        }
    }
)

bloggersRoute.post('/:bloggerId/posts',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation,

    async (req: Request, res: Response) => {

        const blogger = await bloggersDbRepository
            .isBlogger(req.params.bloggerId);
        if (!blogger) {
            res.status(404)
                .send({
                    errorsMessages:
                        [{
                            message: "Problem with a bloggerId field",
                            field: "bloggerId"
                        }]
                });
        } else {
            const newPost = await bloggersService
                .createPostByBloggerId(
                    req.params.bloggerId,
                    req.body.title,
                    req.body.shortDescription,
                    req.body.content)

            if (newPost) {
                res.status(201).send(newPost)
            } else {
                res.status(400).send({
                    errorsMessages: [{
                        message: "Problem with a bloggerId field",
                        field: "bloggerId"
                    }]
                });
            }
        }

    })
