import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";

import {UsersModel} from "../settingses/db";




export const authBaseMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const header = req.headers.authorization
    if (header === 'Basic YWRtaW46cXdlcnR5') {
        next()
        return
    }
    res.send(401)
}

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {


    const header = req.headers.authorization
    if (!header) {
        res.send(401)
        return
    }
    const token = header.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if(userId) {
        // @ts-ignore
        req.user = await usersService.findUserById(userId)
        next()
    } else {
        res.send(401)
    }
}
