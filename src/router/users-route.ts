import {Request, Response, Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {loginValidation, passwordValidation} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {usersService} from "../domain/users-servise";
import {authService} from "../domain/auth-service";


export const usersRouter = Router({})


usersRouter.post('/', authMiddleware, loginValidation,
    passwordValidation, inputValidationMiddleWare, async (req: Request, res: Response) => {
        const newUser = await authService.userRegistration(req.body.login, req.body.email, req.body.password)
        if (newUser) {
            res.status(201).send({
                id: newUser.accountData.id,
                login: newUser.accountData.login
            })
            return
        }
        res.status(400)
        return
    })

usersRouter.get('/', async (req: Request, res: Response) => {

    const pageSize: number = Number(req.query.PageSize) || 10
    const pageNumber: number = Number(req.query.PageNumber) || 1

    const foundUsers = await usersService.findUsers(pageSize, pageNumber)
    const getCount = await usersService.getCount()

    res.send({
        "pagesCount": Math.ceil(getCount / pageSize),
        "page": pageNumber,
        "pageSize": pageSize,
        "totalCount": getCount,
        "items": foundUsers
    })
})
usersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await usersService.deleteUsers(req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})