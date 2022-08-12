import {Request, Response, Router} from "express"

import {inputValidationMiddleware, } from "../middlewares/input-validation-middleware";
import {
    bloggerIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidationCreate
} from "../middlewares/title-validation";

import {postsService} from "../domain/posts-service";
import {bloggersDbRepository} from "../repositories/bloggers-db-repository";
import {postDbRepository} from "../repositories/post-db-repository";
import {commentsService} from "../domain/commets-service";
import {authBarer, authRouterBasic} from "../middlewares/auth-basic";


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
    authRouterBasic,
    titleValidationCreate,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
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
    authRouterBasic,
    titleValidationCreate,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
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

postsRouter.get('/:postId',
    async (req: Request, res: Response) => {

        const post = await postsService.getPostById(
            req.params.postId)

        if (post) {
            res.status(200).send(post);
        } else {
            res.send(404);
        }
    })

postsRouter.delete('/:postId',
    authRouterBasic,
    async (req: Request, res: Response) => {

        const isDeleted = await postsService.deletePost(req.params.postId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })

postsRouter.get('/:postsId/comments',
    async (req: Request, res: Response) => {

        const post = await postDbRepository.isPost(req.params.postId);
        if (!post) {
            res.status(404)
                .send({errorsMessages: [{message: "Problem with a postId field", field: "postId"}]});
        } else {

            const comments = await postsService
                // @ts-ignore
                .getCommentsByPostId(req.params.postId, req.query.pageNumber, req.query.pageSize);
            res.status(200).send(comments);
        }
    })

postsRouter.post('/:postsId/comments',
    authBarer,
    contentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const post = await postDbRepository
            .isPost(req.params.postId);
        if (!post) {
            res.status(404)
                .send({errorsMessages:
                        [{
                            message: "Problem with a postId field",
                            field: "postId"}]});
        } else {
            const newComment = await commentsService
                .creatComments(
                    req.body.content,
                )

            if (newComment) {
                res.status(201).send(newComment)
            } else {
                res.status(400).send({errorsMessages:
                        [{
                            message: "Problem with a postId field",
                            field: "postId"}]})
            }
        }
    })