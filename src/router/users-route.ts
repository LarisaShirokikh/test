import {Request, Response, Router} from "express";

import {usersService} from "../domain/users-servise";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../middlewares/input-validation";
import {loginValidator, passwordValidator} from "../middlewares/validations";


export const usersRouter = Router({})


usersRouter.get('/',
    async (req: Request, res: Response) => {

        const users = await usersService.getAllUsers(
            // @ts-ignore
            req.query.PageNumber,
            req.query.PageSize
        )
        res.status(200).send(users);
    })

usersRouter.post('/',
    authMiddleware,
    loginValidator,
    passwordValidator,
    inputValidation,
    async (req: Request, res: Response) => {
        const newUser = await usersService.createUser(req.body.login, req.body.password)

        if (!newUser) {
            res.status(400)
            return
        }

        res.status(201).send({
            id: newUser.id,
            login: newUser.login
        })
    })

usersRouter.delete('/:id',
    authMiddleware, async (req: Request, res: Response) => {

        const isDeleted = await usersService
            .deleteUser(req.params.id)

        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    })