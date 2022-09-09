import { Router} from "express";
import {authBearer, authMiddleware} from "../middlewares/auth-middleware";
import {
    commentContentValidation,
    commentValidation,
    contentValidation, likeStatusValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";

import {container} from "../composition-root";
import {PostsController} from "../controllers/posts-controller";

const postsController = container.resolve<PostsController>(PostsController)
export const postsRouter = Router({})



postsRouter.get('/', postsController.getAllPosts.bind(postsController))

postsRouter.post('/', authMiddleware, titleValidation,
    shortDescriptionValidation, contentValidation,
    inputValidationMiddleWare,  postsController.creatPost.bind(postsController))


postsRouter.put('/:id', authMiddleware,
    titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleWare,
    postsController.updatePost.bind(postsController))
postsRouter.delete('/:id', authMiddleware, postsController.deletePost.bind(postsController))

postsRouter.post('/:postId/comments',
    authBearer,
    commentValidation,
    inputValidationMiddleWare,
    postsController.createCommentByPostId.bind(postsController))


postsRouter.get('/:postId/comments', postsController.getCountCommentsPost.bind(postsController))

postsRouter.get('/:postId', postsController.getPostById.bind(postsController))

postsRouter.put('/:postId/like-status',
   authBearer, likeStatusValidation, inputValidationMiddleWare,
    postsController.likeStatusPost.bind(postsController))


