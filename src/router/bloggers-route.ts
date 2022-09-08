import {Router, Request, Response} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
    contentValidation,
    nameValidation,
    shortDescriptionValidation,
    titleValidation,
    urlValidation
} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {bloggersService} from "../domain/bloggers-service";





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
    authMiddleware,
    nameValidation,
    urlValidation,
    inputValidationMiddleWare,
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
    authMiddleware,
    nameValidation,
    urlValidation,
   inputValidationMiddleWare,
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
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleWare,

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

