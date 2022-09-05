import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
    contentValidation,
    nameValidation,
    shortDescriptionValidation,
    titleValidation,
    urlValidation
} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {container} from "../composition-root";
import {BloggersController} from "../controllers/bloggers-controller";



const bloggersController = container.resolve<BloggersController>(BloggersController)


export const bloggersRouter = Router({})



bloggersRouter.get('/', bloggersController.getAllBloggers.bind(bloggersController))
bloggersRouter.post('/', authMiddleware,
    nameValidation, urlValidation, inputValidationMiddleWare,
    bloggersController.createBlogger.bind(bloggersController))

bloggersRouter.get('/:id', bloggersController.findBloggersById.bind(bloggersController))
bloggersRouter.put('/:id',
    authMiddleware, nameValidation,
    urlValidation, inputValidationMiddleWare,
    bloggersController.updateBlogger.bind(bloggersController))
bloggersRouter.delete('/:id', authMiddleware, bloggersController.deleteBloggers.bind(bloggersController))

bloggersRouter.post('/:bloggerId/posts',
    authMiddleware, titleValidation,
    shortDescriptionValidation, contentValidation,
    inputValidationMiddleWare,
    bloggersController.createPostByBloggerId.bind(bloggersController))

bloggersRouter.get('/:bloggerId/posts', bloggersController.createPostByBloggerId.bind(bloggersController))



