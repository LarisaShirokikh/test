import {Request, Response, Router} from "express";

import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {loginValidator, passwordValidator} from "../middlewares/validations";
import {inputValidation} from "../middlewares/input-validation";
import {usersService} from "../domain/users-servise";


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.login, req.body.password)
        if (!user) {
            res.sendStatus(401)
        } else {
            const token = await jwtService.createJWT(user)
            console.log(token)
            res.status(200).send(token)
        }
    })




