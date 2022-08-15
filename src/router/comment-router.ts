import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comment-service";
import {authBarer} from "../middlewares/auth-middleware";
import {inputValidation} from "../middlewares/input-validation";
import {commentValidator} from "../middlewares/validations";



export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentsService.findComment(req.params.id)

    if(comment){
        res.status(200).send(comment)
    } else {
        res.sendStatus(404)
    }

})
commentsRouter.delete('/:id', authBarer, async (req: Request, res: Response) => {
    let comment = await commentsService.findComment(req.params.id)
    let user = await commentsService.findUser(req.user!.id, req.params.id)
    if (!comment){
        res.sendStatus(404)
    }

    if(user){
        const isDeleted = await commentsService.deleteComment(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }else{
        res.sendStatus(403)
    }
})
commentsRouter.put('/:commentId',authBarer, commentValidator, inputValidation,
    async (req: Request, res: Response) => {
    let comment = await commentsService.findComment(req.params.commentId)
    let user = await commentsService.findUser(req.user!.id, req.params.commentId)
    if (!comment) {
        return res.status(404).send({errorsMessages: [{message: 'Invalid comment', field: "comment"}]})
    }
    if (user){
        const isUpdate = await commentsService.updateComment(req.body.content, req.params.commentId)
        if (isUpdate) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(403)
    }


})