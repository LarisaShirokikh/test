import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-servise";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization

    if (header === 'Basic YWRtaW46cXdlcnR5') {
        next()
        return
    }
    res.send(401)
}

export const authBearer = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if(userId){
        req.user = await usersService.findUsersById(userId)
        next()
    } else {
        res.sendStatus(401)

    }


}