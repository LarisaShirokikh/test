import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-servise";
import {jwtService} from "../application/jwt-service";





export const authRouter = Router({})

authRouter.post('/login',
    async (req:Request, res:Response) =>{
        const user = await usersService.checkCredentials(req.body.login, req.body.password)
        if(user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send({token: token})
        } else {
            res.sendStatus(401)
        }
    })




