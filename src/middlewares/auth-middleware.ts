import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {UsersService} from "../domain/users-servise";
import {UsersRepository} from "../repositories/users-repository";
import {UserModelClass} from "../settingses/db";




   export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization
        if (header === 'Basic YWRtaW46cXdlcnR5') {
            next()
            return
        }
        res.sendStatus(401)
    }

    export const authBearer = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers.authorization) {
            res.sendStatus(401)
            return
        }
        const token = req.headers.authorization.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)
        if (userId) {


            req.user = await UserModelClass.findOne({id: userId}, {_id: 0, __v: 0})
            next()
        } else {
            res.sendStatus(401)
        }
    }