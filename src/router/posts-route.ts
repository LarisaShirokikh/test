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
        const newPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
        if (!newPost) {
            res.status(400).send(
                {errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]})
            return
        }

        res.status(201).send(newPost)
    }
)
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const post = await postsService.findPostById(req.params.id)

    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404)
    }
})
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
        if (isUpdate) {
            const post = await postsService.findPostById(req.params.id)
            res.status(204).send({post})
        } else {
            res.send(404)
        }
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
postsRouter.post('/:postId/comments', authBearer, commentValidation, inputValidationMiddleWare,
    async (req: Request, res: Response) => {
        const post = await postsService.getPostById(req.params.postId)

        if (!post) {
            res.status(404).send({errorsMessages: [{message: "Post with specified postId doesn't exists", field: "postId"}]});
            return
        }
        // @ts-ignore
        const newComment = await commentsService.createCommentByPostId(req.user, req.params.postId, req.body.content)

        res.status(201).send(newComment)
        return
    })
postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
    const pageSize: number = Number(req.query.PageSize) || 10
    const pageNumber: number = Number(req.query.PageNumber) || 1

    const findPost = await postsService.findPostById(req.params.postId)
    if (findPost) {
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
    } else {
        res.sendStatus(404)
    }
})