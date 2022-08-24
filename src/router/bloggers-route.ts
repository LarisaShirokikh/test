import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";

import {toString} from "express-validator/src/utils";
import {postsService} from "../domain/posts-service";
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


export const bloggersRouter = Router({})
bloggersRouter.get('/', async (req: Request, res: Response) => {

    const pageSize: number = Number(req.query.PageSize) || 10
    const pageNumber: number = Number(req.query.PageNumber) || 1
    const searchNameTerm = toString(req.query.SearchNameTerm)


    const foundBloggers = await bloggersService.findBloggers(pageSize, pageNumber, searchNameTerm)
    const getCount = await bloggersService.getCount(searchNameTerm)

    res.send({
        "pagesCount": Math.ceil(getCount / pageSize),
        "page": pageNumber,
        "pageSize": pageSize,
        "totalCount": getCount,
        "items": foundBloggers
    })
})

bloggersRouter.post('/',
    authMiddleware,
    nameValidation,
    urlValidation, inputValidationMiddleWare,
    async (req: Request, res: Response) => {
        const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlogger)
    })
bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const blogger = await bloggersService.findBloggersById(req.params.id)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }
})
bloggersRouter.put('/:id', authMiddleware, nameValidation, urlValidation, inputValidationMiddleWare, async (req: Request, res: Response) => {
    const name = req.body.name
    const youtubeUrl = req.body.youtubeUrl
    const isUpdated = await bloggersService.updateBlogger(req.params.id, name, youtubeUrl)
    if (isUpdated) {
        const blogger = await bloggersService.findBloggersById(req.params.id)
        res.status(204).send(blogger)
    } else {
        res.send(404)
    }

})
bloggersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await bloggersService.deleteBloggers(req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})
bloggersRouter.post('/:bloggerId/posts',
    authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleWare,
    async (req: Request, res: Response) => {

        const blogger = await bloggersRepository.isBlogger(req.params.bloggerId);
        if (!blogger) {
            res.status(404).send({errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]});
        } else {
            const newPost = await bloggersService.createPostByBloggerId(req.params.bloggerId, req.body.title, req.body.shortDescription, req.body.content)

            if (newPost) {
                res.status(201).send(newPost)
            } else {
                res.status(400).send({
                    errorsMessages: [{
                        message: "Problem with a bloggerId field",
                        field: "bloggerId"
                    }]
                })
            }
        }
    })
bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
            const pageSize: number = Number(req.query.PageSize) || 10
            const pageNumber: number = Number(req.query.PageNumber) || 1
            const findPost = await postsService.findBloggersPost(pageSize, pageNumber, req.params.bloggerId)
            const getCount = await postsService.getCountBloggerId(req.params.bloggerId)

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

        })



