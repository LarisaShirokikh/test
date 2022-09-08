
import {UsersService} from "../domain/users-servise";
import {Request, Response} from "express";
import {UsersRepository} from "../repositories/users-repository";

import {inject, injectable} from "inversify";

@injectable()
export class UsersController {
    constructor(@inject(UsersService)
                protected usersService: UsersService,
                protected usersRepository: UsersRepository,

    ) { }


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


