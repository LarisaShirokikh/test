import {Router, Request, Response} from "express";

import {bloggersRepository} from "../repositories/bloggers-repository";
import {bloggersService} from "../domain/bloggers-service";
import {authBaseMiddleware} from "../middlewares/auth-middleware";
import {fieldsValidationMiddleware} from "../middlewares/fields-Validation-Middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation";



export const bloggersRouter = Router({})


bloggersRouter.get('/',
    async (req: Request, res: Response) => {

        // @ts-ignore
        const bloggers = await bloggersService.getAllBloggers(
            // @ts-ignore
            req.query.PageNumber,
            req.query.PageSize,
            req.query.SearchNameTerm
        )
        res.status(200).send(bloggers);
    }
)

bloggersRouter.post('/',
    authBaseMiddleware,
    fieldsValidationMiddleware.nameValidation,
    fieldsValidationMiddleware.youtubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    }
)

bloggersRouter.get('/:bloggerId', async (req: Request, res: Response) => {
        const blogger = await bloggersService.getBloggerById(req.params.bloggerId);
        if (blogger) {
            res.status(200).send(blogger);
        } else {
            res.send(404);
        }
    }
)

bloggersRouter.put('/:bloggerId',
    authBaseMiddleware,
    fieldsValidationMiddleware.nameValidation,
    fieldsValidationMiddleware.youtubeValidation,
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

bloggersRouter.delete('/:bloggerId',
    authBaseMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersService.deleteBlogger(req.params.bloggerId)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
)

bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {

        const blogger = await bloggersRepository.isBlogger(req.params.bloggerId);
        if (!blogger) {
            res.status(404).send({errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]});
        } else {
            // @ts-ignore
            const posts = await bloggersService.getPostsByBloggerId(req.params.bloggerId, req.query.PageNumber, req.query.PageSize);
            res.status(200).send(posts);
        }
    }
)

bloggersRouter.post('/:bloggerId/posts',
    authBaseMiddleware,
    fieldsValidationMiddleware.titleValidation,
    fieldsValidationMiddleware.shortDescriptionValidation,
    fieldsValidationMiddleware.contentValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {

        const blogger = await bloggersRepository.isBlogger(req.params.bloggerId);
        if (!blogger) {
            res.status(404).send({errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]});
        } else {
            const newPost = await bloggersService.createPostByBloggerId(req.params.bloggerId, req.body.title, req.body.shortDescription, req.body.content)

            if (newPost) {
                res.status(201).send(newPost)
            } else {
                res.status(400).send({errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]})
            }
        }

    })

