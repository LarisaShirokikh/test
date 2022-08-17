import {Request, Response, Router} from "express";
import {commentService} from "../domain/comment-service";
import {authBearer} from "../middlewares/auth-middleware";
import {commentValidation} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";




export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
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
commentsRouter.put('/:commentId',
    authBearer, commentValidation, inputValidationMiddleWare,
    async (req: Request, res: Response) => {
    let comment = await commentService.findComment(req.params.commentId)
        console.log(111,comment)
    let user = await commentService.findUser(req.user!.id, req.params.commentId)
    if (!comment) {
        console.log(222, user)
        return res.status(404).send({errorsMessages: [{message: 'Invalid commentId', field: "comment"}]})
    }
    if (user){
        console.log(333, user)
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