import {NextFunction, Request, Response} from "express";
import {postsService} from "../domain/posts-service";

export const postMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const post = await postsService.findPostById(req.params.id)
    if (post) return post
    next()
    res.status(404).send({errorsMessages: [{message: "Post with specified postId doesn't exists", field: "postId"}]});
    return

}

export const createPostMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const newPost = await postsService
        .createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
    if (newPost) return newPost
    next()
    res.status(400).send(
        {errorsMessages: [{message: "Problem with a bloggerId field", field: "bloggerId"}]})
    return
}