import {Request, Response, Router} from "express";
import {commentRepository} from "../repositories/comment-repository";
import {commentsService} from "../domain/comment-service";
import {authMiddleware} from "../middlewares/auth-middleware";



export const commentRouter = Router({})

commentRouter.put('/:commentId',
    authMiddleware,


    async (req: Request, res: Response) => {
        const comment = await commentRepository
            .isComment(req.body.commentId);
        if (!comment) {
            res.status(400).send({
                errorsMessages: [{
                    message: "Problem with a commentId field", field: "commentId"
                }]
            })
            return
        }
        const isUpdated = await commentsService.updateComment(
            req.params.commentId,
            req.body.content
        )
        if (isUpdated) {
            const comment = await commentsService.getCommentById(
                req.params.commentId
            )
            res.status(200).send(comment);
        } else {
            res.send(404)
        }
    })

commentRouter.delete('/:commentId',
    authMiddleware, async (req: Request, res: Response) => {

        const isDeleted = await commentsService.deleteComment(req.params.commentId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })

commentRouter.get('/:id',
    async (req: Request, res: Response) => {
        const comment = await commentsService.getCommentById(req.params.id);
        if (comment) {
            res.status(200).send(comment);
        } else {
            res.send(404);
        }
    }
)