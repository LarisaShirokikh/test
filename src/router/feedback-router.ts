import {Request, Response, Router} from "express"

import {authMiddleware} from "../middlewares/auth-middleware";

export const feedbackRouter = Router({})

feedbackRouter.post('/', authMiddleware,
    async (req: Request, res: Response) => {
    const newComment = await feedbackService.sendFeedback(req.body.content, req.user!.id)
    res.status(201).send(newComment)
})