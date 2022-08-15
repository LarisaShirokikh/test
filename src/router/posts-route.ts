import {Request, Response, Router} from "express"
import {postsService} from "../domain/posts-service";
import {authBearer, authMiddleware} from "../middlewares/auth-middleware";
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middlewares/validations";
import {inputValidation} from "../middlewares/input-validation";
import {bloggersDbRepository} from "../repositories/bloggers-repository";
import {commentService} from "../domain/comment-service";



export const postsRouter = Router({})


postsRouter.get('/',
    async (req: Request, res: Response) => {

        const posts = await postsService.getAllPosts(
            // @ts-ignore
            req.query.PageNumber,
            req.query.PageSize)
        res.status(200).send(posts);
    })

postsRouter.post('/',
   authMiddleware,
    titleValidation,
    shortDescriptionValidation,
   contentValidation,
    inputValidation,
    async (req: Request, res: Response) => {

        const newPost = await postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.bloggerId)

        if (!newPost) {
            res.status(400).send(
                {errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]})
            return
        }

        res.status(201).send(newPost)
    })

postsRouter.put('/:postId',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation,
    async (req: Request, res: Response) => {


        const blogger = await bloggersDbRepository.isBlogger(req.body.bloggerId);

        if (!blogger) {
            res.status(400).send(
                {errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]})
            return
        }

        const isUpdated = await postsService.updatePost(
            req.params.postId,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.bloggerId)

        if (isUpdated) {
            const blogPost = await postsService.getPostById(
                req.params.postId
            )
            res.status(204).send(blogPost);
        } else {
            res.send(404)
        }
    })

postsRouter.get('/:postId', async (req: Request, res: Response) => {

        const post = await postsService.getPostById(
            req.params.postId)

        if (post) {
            res.status(200).send(post);
        } else {
            res.send(404);
        }
    })

postsRouter.delete('/:postId', authMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await postsService.deletePost(req.params.postId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })

postsRouter.post('/:postId/comments', authBearer, contentValidation, inputValidation, async (req: Request, res: Response) => {
        const post = await postsService.findPostById(req.params.postId)

        if (post) {
            const newComment = await commentService
                .createComment(req.body.content, req.user.id, req.user.login, req.params.postId)
            res.status(201).send(newComment)
        } else {
            res.send(404)
        }
    }
)
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


