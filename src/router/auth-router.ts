import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {authService} from "../domain/auth-service";
import {emailValidation, limitMiddleware, loginValidation, passwordValidation} from "../middlewares/validations";
import {usersRepository} from "../repositories/users-repository";

import {checkLimitsIpAttemptsMiddleware} from "../middlewares/checkLimitsIpAttemptsMiddleware";




export const authRouter = Router({})

authRouter.post('/registration-confirmation', checkLimitsIpAttemptsMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.userRegistrationConfirmation(req.body.code)
        if (result) {
            res.sendStatus(204)
        }
        res.sendStatus(400).send({errorsMessages: [{message: "ErrorMessage", field: "code"}]})
    })

authRouter.post('/registration',
    loginValidation,
    emailValidation,
    passwordValidation, inputValidationMiddleWare, checkLimitsIpAttemptsMiddleware,
    async (req: Request, res: Response) => {
        //const findEmailOrlogin = await usersRepository.findUserByEmailOrlogin(req.body.email, req.body.login)
        const isEmail = await usersRepository.findUserByEmail(req.body.email)
        const isLogin = await usersRepository.findUserByLogin(req.body.login)

        if (!!isEmail && isEmail.email) {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "email"}]})
            return false
        }
        if (isLogin && isLogin.login) {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "login"}]})
            return false
        }
        const userRegistration = await authService.userRegistration(req.body.login, req.body.email, req.body.password)
        res.status(204).send(userRegistration)

    })

authRouter.post('/registration-email-resending',
    emailValidation, inputValidationMiddleWare, checkLimitsIpAttemptsMiddleware,
    async (req: Request, res: Response) => {

        const user = await usersRepository.findUserByEmail(req.body.email)

        if (user?.isConfirmed === true || !user) {

            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "email"}]})
        } else {

            const result = await authService.resendingEmailConfirm(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else {
                res.sendStatus(400)
            }
        }

    })

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send({token: token})
        } else {
            res.status(401)
            return
        }
    })




