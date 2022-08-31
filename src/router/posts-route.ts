import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {postsService} from "../domain/posts-service";
import {commentService} from "../domain/comment-service";
import {authBearer, authMiddleware} from "../middlewares/auth-middleware";
import {
    commentValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {postMiddleware} from "../middlewares/post-middleware";


export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {

    const pageSize: number = Number(req.query.PageSize) || 10
    const pageNumber: number = Number(req.query.PageNumber) || 1


    const findPost = await postsService.findPosts(pageSize, pageNumber)
    const getCount = await postsService.getCount()
    res.send({
        "pagesCount": Math.ceil(getCount / pageSize),
        "page": pageNumber,
        "pageSize": pageSize,
        "totalCount": getCount,
        "items": findPost
    })
})
postsRouter.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation,
    inputValidationMiddleWare,
    async (req: Request, res: Response) => {
        const newPost = await postsService
            .createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
        if (!newPost) {
            res.status(400).send(
                {errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]})
            return
        }

        res.status(201).send({

        })
    }
)
postsRouter.get('/:id', postMiddleware )
postsRouter.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleWare, async (req: Request, res: Response) => {

    let blogger = await bloggersService.findBloggersById(req.body.bloggerId)
    if (!blogger) {
        return res.status(400).send({errorsMessages: [{message: 'Invalid bloggerId', field: "bloggerId"}]})
    } else {
        const isUpdate = await postsService.updatePost(req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.bloggerId)
        if (isUpdate) postMiddleware
    }

})
postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await postsService.deletePosts(req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})
postsRouter.post('/:postId/comments',
    authBearer,
    commentValidation,
    inputValidationMiddleWare,
    postMiddleware,
    async (req: Request, res: Response) => {
        const newComment = await commentService.createCommentByPostId(req.user, req.params.postId, req.body.content)
        res.status(201).send(newComment)
    })
postsRouter.get('/:postId/comments', postMiddleware, async (req: Request, res: Response) => {
    const pageSize: number = Number(req.query.PageSize) || 10
    const pageNumber: number = Number(req.query.PageNumber) || 1

        const findComment = await commentService.findCommentWithPag(req.params.postId, pageSize, pageNumber)
        const getCount = await commentService.getCount(req.params.postId)
        const result = {
            "pagesCount": Math.ceil(getCount / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": getCount,
            "items": findComment
        }
        res.send(result)
    return
})

postsRouter.put('/:postId/like-status', authBearer, postMiddleware, async (req: Request, res: Response) => {


})