import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
    contentValidation, urlValidation, nameValidationCreate, shortDescriptionValidation, titleValidationCreate
} from "../middlewares/title-validation";

import {bloggersService} from "../domain/bloggers-service";
import {bloggersDbRepository} from "../repositories/bloggers-db-repository";
import {authRouterBasic} from "../middlewares/auth-basic";

export const bloggersRoute = Router({});


bloggersRoute.get('/',
    async (req: Request, res: Response) => {
        const bloggers = await bloggersService
            .getAllBloggers(
                // @ts-ignore
                req.query.PageNumber,
                req.query.PageSize,
                req.query.SearchNameTerm)
        res.status(200).send(bloggers);
    }
)

bloggersRoute.post('/',
    authRouterBasic,
    nameValidationCreate,
    urlValidation,
    inputValidationMiddleware,
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
    authRouterBasic,
    nameValidationCreate,
    urlValidation,
    inputValidationMiddleware,
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
    authRouterBasic,
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
                .send({errorsMessages: [{
                        message: "Problem with a bloggerId field", field: "bloggerId"}]});
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
    authRouterBasic,
    titleValidationCreate,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,

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
