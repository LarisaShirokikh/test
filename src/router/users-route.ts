import {Request, Response, Router} from "express";
import {UsersService} from "../domain/users-servise";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {loginValidation, passwordValidation} from "../middlewares/validations";


export const usersRouter = Router({})

class UsersController {
    private usersService: UsersService;
    constructor() {
        this.usersService = new UsersService()
    }

    async getAllUsers(req: Request, res: Response) {
        // @ts-ignore
        const users = await this.usersService.getAllUsers(req.query.PageNumber, req.query.PageSize)
        res.status(200).send(users);
    }

    async createUser(req: Request, res: Response) {
        const newUser = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
    }

    async deleteUser(req: Request, res: Response) {
        const isDeleted = await this.usersService.deleteUser(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }

}

const usersControllerInstance = new UsersController()

usersRouter.get('/', usersControllerInstance.getAllUsers.bind(usersControllerInstance))

usersRouter.post('/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    inputValidationMiddleWare,
    usersControllerInstance.createUser.bind(usersControllerInstance)
)

usersRouter.delete('/:id', authMiddleware,
    usersControllerInstance.deleteUser.bind(usersControllerInstance)
)