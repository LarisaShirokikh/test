import {Request, Response, Router} from "express";

import {authBearer} from "../middlewares/auth-middleware";
import {inputValidation} from "../middlewares/input-validation";
import {commentValidation} from "../middlewares/validations";
import {commentService} from "../domain/comment-service";




export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    console.log(1111)
    const comment = await commentService.findComment(req.params.id)

    if(comment){
        res.status(200).send(comment)
    } else {
        res.sendStatus(404)
    }

})
commentsRouter.delete('/:id', authBearer, async (req: Request, res: Response) => {
    let comment = await commentService.findComment(req.params.id)
    let user = await commentService.findUser(req.user!.id, req.params.id)
    if (!comment){
        res.sendStatus(404)
    }

    if(user){
        const isDeleted = await commentService.deleteComment(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }else{
        res.sendStatus(403)
    }
})
commentsRouter.put('/:commentId',authBearer, commentValidation, inputValidation, async (req: Request, res: Response) => {
    let comment = await commentService.findComment(req.params.commentId)
    let user = await commentService.findUser(req.user!.id, req.params.commentId)
    if (!comment) {
        return res.status(404).send({errorsMessages: [{message: 'Invalid comment', field: "comment"}]})
    }
    if (user) {
        const isUpdate = await commentService.updateComment(req.body.content, req.params.commentId)
        if (isUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(403)
    }
})