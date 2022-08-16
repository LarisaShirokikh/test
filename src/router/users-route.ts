import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-servise";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../middlewares/input-validation";
import {loginValidation, passwordValidation} from "../middlewares/validations";


export const usersRouter = Router({})


usersRouter.post('/', authMiddleware, loginValidation,passwordValidation, inputValidation, async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body.login, req.body.password)
    res.status(201).send(newUser)

})

usersRouter.get('/', async (req: Request, res: Response) => {

    const pageSize: number = Number(req.query.PageSize) || 10
    const pageNumber: number = Number(req.query.PageNumber) || 1

    const foundUsers = await usersService.findUsers(pageSize, pageNumber )
    const getCount = await usersService.getCount()

    res.send({
        "pagesCount": Math.ceil(getCount/ pageSize),
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