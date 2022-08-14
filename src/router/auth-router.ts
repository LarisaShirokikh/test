import {Request, Response, Router} from "express";

import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {loginValidator, passwordValidator} from "../middlewares/validations";
import {inputValidation} from "../middlewares/input-validation";
import {usersService} from "../domain/users-servise";
import {usersCollection} from "../settings";
import {UsersWithHashType} from "../types";


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.login, req.body.password)

        if (!user) {
            res.sendStatus(401)
        } else {

            // @ts-ignore

            const findUser:  UsersWithHashType = await usersCollection.findOne({login: req.body.login})

            const token = await jwtService.createJWT(findUser, req.body.password)
            const userUpdate = await usersCollection
                .updateOne({login: req.body.login}, {$set: {passwordHash: token}})
           //const token1 = {
             //   token: token
           //}
            res.status(200).send(token)
        }

    })




