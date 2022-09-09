import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";

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


            const user = await UserModelClass.findOne({'accountData.id': userId}, {_id: 0, __v: 0})
            if (!user)
                res.sendStatus(401)
            //@ts-ignore
            req.user = user;
            next()
        } else {
            res.sendStatus(401)
            return
        }
    }