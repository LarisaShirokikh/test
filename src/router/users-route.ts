import {Request, Response, Router} from "express";

import {usersService} from "../domain/users-servise";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../middlewares/input-validation";
import {loginValidation, passwordValidation} from "../middlewares/validations";



export const usersRouter = Router({})


usersRouter.get('/',
    async (req: Request, res: Response) => {
        const pageNumber = typeof req.query.PageNumber === 'string' ? req.query.PageNumber : '1'
        const pageSize = typeof req.query.PageSize === 'string' ? req.query.PageSize : '10'

        const users = await usersService.getAllUsers(
            pageNumber,
            pageSize
        )

        if (!users) {
            return res.status(500).send('wrong')
        }
        res.status(200).send(users);

    })


usersRouter.post('/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    inputValidation,
    async (req: Request, res: Response) => {
        const newUser = await usersService.createUser(req.body.login, req.body.password)

        if (!newUser) {
            res.status(401)
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