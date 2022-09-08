import { Router, Request, Response } from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
    bloggerIdValidation, commentValidation,
    contentValidation, likeStatusValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {postsService} from "../domain/posts-service";
import {bloggersRepository} from "../repositories/bloggers-repository";


export const postsRouter = Router({});


postsRouter.get('/', async (req: Request, res: Response) => {
        // @ts-ignore
        const posts = await postsService.getAllPosts(req.query.PageNumber, req.query.PageSize)
        res.status(200).send(posts);
    }
)

postsRouter.post('/',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
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

postsRouter.put('/:postId',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleWare,
    async (req: Request, res: Response) => {


        const blogger = await bloggersRepository.isBlogger(req.body.bloggerId);

        if (!blogger) {
            res.status(400).send({errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]});
            return
        }

        const isUpdated = await postsService.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)

        if (isUpdated) {
            const blogPost = await postsService.getPostById(req.params.postId)
            res.status(204).send(blogPost);
        } else {
            res.send(404)
        }
    }
)

postsRouter.get('/:postId', async (req: Request, res: Response) => {

        if (typeof req.params.postId !== "string") {
            res.send(400);
            return;
        }

        const post = await postsService.getPostById(req.params.postId)

        if (post) {
            res.status(200).send(post);
        } else {
            res.send(404);
        }
    }
)

postsRouter.delete('/:postId', authMiddleware, async (req: Request, res: Response) => {

        const isDeleted = await postsService.deletePost(req.params.postId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
)

postsRouter.post('/:postId/comments',
    authMiddleware,
    commentValidation,
    inputValidationMiddleWare,

    async (req: Request, res: Response) => {

        const post = await postsService.getPostById(req.params.postId)

        if (!post) {
            res.status(404).send({errorsMessages: [{message: "Post with specified postId doesn't exists", field: "postId"}]});
            return
        }

        // @ts-ignore
        const newComment = await commentsService.createCommentByPostId(req.user, req.params.postId, req.body.content)

        res.status(201).send(newComment)
    }
)

postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {


        const post = await postsService.getPostById(req.params.postId,)

        if (!post) {
            res.status(404).send({errorsMessages: [{message: "Post with specified postId doesn't exists", field: "postId"}]});
            return
        }

        // @ts-ignore
        const comments = await commentsService.getAllCommentsByPostId(req.params.postId, req.query.PageNumber, req.query.PageSize)

        res.status(200).send(comments)
    }
)


postsRouter.post('/:postId/like-status',
    authMiddleware,
   likeStatusValidation,
    inputValidationMiddleWare,
    async (req: Request, res: Response) => {

        const post = await postsService.getPostById(req.params.postId)

        if (!post) {
            res.status(404).send({errorsMessages: [{message: "Post with specified postId doesn't exists", field: "postId"}]});
            return
        }

        // @ts-ignore
        const likeStatus = await postsService.updateLikeStatus(req.user, req.params.postId, req.body.likeStatus)

        res.status(201).send(likeStatus)
    }
)






