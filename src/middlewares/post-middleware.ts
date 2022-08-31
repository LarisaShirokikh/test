import {NextFunction, Request, Response} from "express";
import {postsService} from "../domain/posts-service";

export const postMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const post = await postsService.findPostById(req.params.id)
    if (post) return post
    next()
    res.status(404).send({errorsMessages: [{message: "Post with specified postId doesn't exists", field: "postId"}]});
    return

}