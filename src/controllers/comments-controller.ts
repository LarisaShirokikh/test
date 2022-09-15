import {inject, injectable} from "inversify";
import {CommentsService} from "../domain/comment-service";
import {Request, Response} from "express";
import {CommentsType} from "../types";
import {jwtService} from "../application/jwt-service";

@injectable()
export class CommentsController {
    constructor(@inject(CommentsService)
                protected commentsService: CommentsService
    ) {
    }

    async findComment(req: Request, res: Response) {
        const comment: CommentsType | null | undefined = await this.commentsService.findComment(req.params.commentId)
        if (!comment) {
            res.status(404).send({errorsMessages: [{message: "Comment not found", field: "commentId"}]});
            return
        }
        const token = req.headers.authorization!.split(' ')[1]
        const userId = await jwtService.userIdByToken(token)
        if (!userId) {
            res.send(401)
        } else {
            if (comment.userId !== userId) {
                res.status(403).send({errorsMessages: [{message: "It's not your post", field: "userId"}]});
                return
            }
        }
        const updatedComment = await this.commentsService.updateComment(req.params.commentId, req.body.content)

        if (updatedComment) {
            res.status(204).send(updatedComment);
        } else {
            res.send(400)
            return
        }
    }

    async deleteComment(req: Request, res: Response) {

        const comment: CommentsType | null | undefined = await this.commentsService.findComment(req.params.commentId)

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

        const isDeleted = await this.commentsService.deleteComment(req.params.commentId)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
            return
        }
    }

    async getComment(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1]
        let userId = ' '
        if (token) {
            userId = await jwtService.getUserIdByToken(token)

        }
        if (typeof req.params.commentId !== "string") {
            res.status(400);
            return;
        }

        const comment = await this.commentsService.getComment(req.params.commentId, userId)

        if (comment) {
            res.status(200).send(comment);
        } else {
            res.send(404);
            return
        }
    }

    async commentLikeStatus(req: Request, res: Response) {
        const user = req.user!
        const comment = await this.commentsService.findComment(req.params.commentId)
        console.log('comment', comment)
        if (!comment) return res.status(404).send({errorsMessages: [{message: "Comment not found", field: "commentId"}]})

        await this.commentsService.updateLikeStatus(user, comment.id, req.body.likeStatus)

        res.status(204)
        return

    }
}