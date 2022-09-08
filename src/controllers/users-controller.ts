
import {UsersService} from "../domain/users-servise";
import {Request, Response} from "express";
import {UsersRepository} from "../repositories/users-repository";
import {AuthService} from "../domain/auth-service";
import {inject, injectable} from "inversify";

@injectable()
export class UsersController {
    constructor(@inject(UsersService)
                protected usersService: UsersService,
                protected usersRepository: UsersRepository,
                protected authService: AuthService
    ) { }


    async createUser(req: Request, res: Response) {
        const findEmailOrlogin = await this.usersRepository.findUserByEmailOrlogin(req.body.email, req.body.login)

        if (findEmailOrlogin) {
            res.sendStatus(401)
            return
        }
        const newUser = await this.authService.userRegistration(req.body.login, req.body.email, req.body.password)

        if (newUser) {
            res.status(201).send({
                id: newUser.accountData.id,
                login: newUser.accountData.login
            })
            return
        }
    }
    async deleteUser(req: Request<{ id: string }>, res: Response) {
        const isDeleted = await this.usersService.deleteUsers(req.params.id)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }
    async getUsers(req: Request<{ id: string }>, res: Response) {
        const pageSize: number = Number(req.query.PageSize) || 10
        const pageNumber: number = Number(req.query.PageNumber) || 1

        const foundUsers = await this.usersService.findUsers(pageSize, pageNumber)
        const getCount = await this.usersService.getCount()

        res.send({
            "pagesCount": Math.ceil(getCount / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": getCount,
            "items": foundUsers
        })
    }
}