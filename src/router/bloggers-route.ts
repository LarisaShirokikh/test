import {Request, Response, Router} from "express";

import {bloggersService} from "../domain/bloggers-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../middlewares/input-validation";
import {bloggersDbRepository} from "../repositories/bloggers-repository";
import {
    contentValidation,
    nameValidationCreate,
    shortDescriptionValidation, titleValidationCreate,
    urlValidation
} from "../middlewares/validations";


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
    authMiddleware,
    nameValidationCreate,
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
    nameValidationCreate,
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
    authMiddleware,
    titleValidationCreate,
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
