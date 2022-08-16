import {Request, Response, Router} from "express";

import {bloggersService} from "../domain/bloggers-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../middlewares/input-validation";
import {contentValidation, nameValidation,shortDescriptionValidation, titleValidation,
    urlValidation} from "../middlewares/validations";
import {postsService} from "../domain/posts-service";


export const bloggersRoute = Router({});


bloggersRoute.get('/', async (req: Request, res: Response) => {

    const pageSize: number = Number(req.query.PageSize) || 10
    const pageNumber: number = Number(req.query.PageNumber) || 1
    // @ts-ignore
    const searchNameTerm = toString(req.query.SearchNameTerm)


    const foundBloggers = await bloggersService.findBloggers(pageSize, pageNumber,searchNameTerm )
    const getCount = await bloggersService.getCount(searchNameTerm)

    res.send({
        "pagesCount": Math.ceil(getCount/ pageSize),
        "page": pageNumber,
        "pageSize": pageSize,
        "totalCount": getCount,
        "items": foundBloggers
    })
})

bloggersRoute.post('/', authMiddleware, nameValidation, urlValidation, inputValidation, async (req: Request, res: Response) => {
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl

    const newBlogger = await bloggersService.createBloggers(name, youtubeUrl)
    res.status(201).send(newBlogger)

})
bloggersRoute.get('/:id', async (req: Request, res: Response) => {
    const blogger = await bloggersService.findBloggersById(req.params.id)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }
})
bloggersRoute.put('/:id', authMiddleware, nameValidation, urlValidation, inputValidation, async (req: Request, res: Response) => {
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
bloggersRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await bloggersService.deleteBloggers(req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})


bloggersRoute.post('/:bloggerId/posts', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidation, async (req: Request, res: Response) => {
    let blogger = await bloggersService.findBloggersById(req.params.bloggerId)
    if (!blogger) {
        return res.status(404).send({errorsMessages: [{message: 'Invalid bloggerId', field: "bloggerId"}]})
    } else {
        const newPost = await postsService.createPost(
            req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.params.bloggerId)

        res.status(201).send(newPost)
    }
})

bloggersRoute.get('/:bloggerId/posts',async (req: Request, res: Response) => {
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