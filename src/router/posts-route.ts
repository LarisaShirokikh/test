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
import {createPostMiddleware, postMiddleware} from "../middlewares/post-middleware";


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
postsRouter.post('/', authMiddleware, titleValidation,
    shortDescriptionValidation, contentValidation,
    inputValidationMiddleWare, createPostMiddleware,
    async (req: Request, res: Response) => {
const blogger = await bloggersService.findBloggersById(req.params.id)
        if (!blogger) res.sendStatus(404)
        res.status(201).send({
            addedAt: new Date,
            bloggerId: req.query.bloggerId,
            bloggerName: req.query.bloggerName,
            content: req.query.content,
            extendedLikesInfo: {
                dislikesCount: req.query.dislikesCount,
                likesCount: req.query.likesCount,
                myStatus: req.query.myStatus,
                newestLikes: req.query.newestLikes
            },
            id: new Object(),
            shortDescription: req.query.shortDescription,
            title: req.query.title
        })
    }
)
postsRouter.get('/:id', postMiddleware)
postsRouter.put('/:id', authMiddleware,
    titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleWare, async (req: Request, res: Response) => {

    let blogger = await bloggersService.findBloggersById(req.body.bloggerId)
    if (!blogger) {
        return res.status(400).send({errorsMessages: [{message: 'Invalid bloggerId', field: "bloggerId"}]})
    } else {
        const isUpdate = await postsService.updatePost(req.params.id,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.bloggerId)
        if (isUpdate) res.status(204).send(isUpdate)
        return
        res.sendStatus(401)
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
postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
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

postsRouter.put('/:postId/like-status',
    authBearer,  async (req: Request, res: Response) => {
       // ищу пост по айди
        //сделать абдейт поста


})