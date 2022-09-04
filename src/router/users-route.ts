import {Request, Response, Router} from "express";

import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {container} from "../composition-root";
import {UsersController} from "../controllers/users-controller";
import {authMiddleware} from "../middlewares/auth-middleware";



const usersController = container.resolve<UsersController>(UsersController)



export const usersRouter = Router({})


usersRouter.get('/', usersController.getUsers.bind(usersController))
usersRouter.post('/', authMiddleware, loginValidation, emailValidation,
    passwordValidation, inputValidationMiddleWare, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', authMiddleware, usersController.deleteUser.bind(usersController))