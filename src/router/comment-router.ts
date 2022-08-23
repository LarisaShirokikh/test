import {Request, Response, Router} from "express";
import {commentService} from "../domain/comment-service";
import {authBearer} from "../middlewares/auth-middleware";
import {commentValidation, contentValidation} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {CommentsType} from "../types";
import {jwtService} from "../application/jwt-service";




export const commentsRouter = Router({})

commentsRouter.put('/:commentId',
    authBearer,
    commentValidation,
    inputValidationMiddleWare,
    async (req: Request, res: Response) => {

        const comment: CommentsType | null | undefined = await commentService.findComment(req.params.commentId)

        if (!comment) {
            res.status(404).send({errorsMessages: [{message: "Comment not found", field: "commentId"}]});
            return
        }

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)

        if (!userId) {
            res.send(401)
        } else {
            if (comment.userId !== userId) {
                res.status(403).send({errorsMessages: [{message: "It's not your post", field: "userId"}]});
                return
            }
        }

        const updatedComment = await commentService.updateComment(req.params.commentId, req.body.content)

        if (updatedComment) {
            res.status(204).send(updatedComment);
        } else {
            res.send(400)
        }
    }
)


commentsRouter.delete('/:commentId', authBearer, async (req: Request, res: Response) => {

        const comment: CommentsType | null | undefined = await commentService.findComment(req.params.commentId)

        if (!comment) {
            res.status(404).send({errorsMessages: [{message: "Comment not found", field: "commentId"}]});
            return
        }

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)

        if (!userId) {
            res.send(401)
        } else {
            if (comment.userId !== userId) {
                res.status(403).send({errorsMessages: [{message: "It's not your comment", field: "userId"}]});
                return
            }
        }

        const isDeleted = await commentService.deleteComment(req.params.commentId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
)

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {

        if (typeof req.params.commentId !== "string") {
            res.send(400);
            return;
        }

        const comment = await commentService.findComment(req.params.commentId)

        if (comment) {
            res.status(200).send(comment);
        } else {
            res.send(404);
        }
    }
)