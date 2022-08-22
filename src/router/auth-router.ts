import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {authService} from "../domain/auth-service";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {checkLimitsIpAttemptsMiddleware} from "../middlewares/checkLimitsIpAttemptsMiddleware";
import {usersRepository} from "../repositories/users-repository";


export const authRouter = Router({})

authRouter.post('/registration-confirmation', inputValidationMiddleWare, checkLimitsIpAttemptsMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.userRegisrationConfirmation(req.body.code)
        if (result) {
            res.sendStatus(204)
        }
        res.sendStatus(400)
    })

authRouter.post('/registration',
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleWare, checkLimitsIpAttemptsMiddleware,
    async (req: Request, res: Response) => {
        const findEmailOrlogin = await usersRepository.findUserByEmailOrlogin(req.body.email, req.body.login)
        if (!findEmailOrlogin) {
            const user = await authService.userRegistration(req.body.login, req.body.email, req.body.password)
            res.status(204).send(user)
            return
        }
        res.status(400).send({ errorsMessages: [{ message: "Invalid data", field: "email" }] })
    })

authRouter.post('/registration-email-resending', emailValidation, inputValidationMiddleWare, checkLimitsIpAttemptsMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersRepository.findUserByEmail(req.body.email)
        if (user?.isConfirmed === true || !user) {
            res.status(400)

        } else {
            const result = await authService.resendingEmailConfirm(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else {
                res.sendStatus(400)
            }
        }

    }
)

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send({token: token})
        } else {
            res.sendStatus(401)
        }
    })




