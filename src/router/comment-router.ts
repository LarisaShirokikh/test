import { Router} from "express";

import {authBearer} from "../middlewares/auth-middleware";
import {commentValidation, likeStatusValidation} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {container} from "../composition-root";
import {CommentsController} from "../controllers/comments-controller";


export const commentsRouter = Router({})

const commentsController = container.resolve<CommentsController>(CommentsController)



commentsRouter.put('/:commentId',
    authBearer, commentValidation, inputValidationMiddleWare,
    commentsController.findComment.bind(commentsController))


commentsRouter.delete('/:commentId', authBearer,
    commentsController.deleteComment.bind(commentsController))

commentsRouter.get('/:commentId',
    commentsController.getComment.bind(commentsController))

commentsRouter.put('/:commentId/like-status', authBearer, likeStatusValidation, inputValidationMiddleWare,
    commentsController.commentLikeStatus.bind(commentsController))