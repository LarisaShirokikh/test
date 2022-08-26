import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {authService} from "../domain/auth-service";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {usersRepository} from "../repositories/users-repository";
import {checkLimitsIPAttemptsMiddleware} from "../middlewares/checkLimitsIpAttemptsMiddleware";
import {usersService} from "../domain/users-servise";
import {authBearer} from "../middlewares/auth-middleware";
import {usersCollection} from "../settingses/db";


export const authRouter = Router({})

authRouter.post('/registration-confirmation',
    checkLimitsIPAttemptsMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.userRegConfirmation(req.body.code)
        if (result) {
            res.status(204).send()
        } else {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "code"}]})
            return
        }
    }
)

authRouter.post('/registration',
    loginValidation,
    emailValidation,
    passwordValidation, inputValidationMiddleWare, checkLimitsIPAttemptsMiddleware,
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
    emailValidation, inputValidationMiddleWare, checkLimitsIPAttemptsMiddleware,
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

authRouter.post('/login', loginValidation, passwordValidation,
    inputValidationMiddleWare, checkLimitsIPAttemptsMiddleware,
    async (req: Request, res: Response) => {
        console.log(90)
        const user = await authService.checkCredentials(req.body.login, req.body.password)
        if (!user) {
            console.log(222)
            res.status(401)
            return
        }
        console.log(11)
        const jwtTokenPair = await jwtService.createJWTPair(user)
        res.cookie('refreshToken', jwtTokenPair.refreshToken, {})
        const accessToken = jwtTokenPair.accessToken
        res.status(200).send({accessToken})
        return
    })

authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {
        const refreshToken = await req.cookies?.refreshToken

        const isRefreshTokenInBlackList = await authService.checkTokenInBlackList(refreshToken)
        if (isRefreshTokenInBlackList) return false
        if (refreshToken) {
            const user = {id: ""}
            user.id = await jwtService.getUserIdByToken(refreshToken)
            const jwtTokenPair = await jwtService.createJWTPair(user)
            res.cookie('refreshToken', jwtTokenPair.refreshToken, {
            })

            await authService.addRefreshTokenToBlackList(refreshToken)
            res.status(200).send(jwtTokenPair.accessToken)
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post('/logout',
    async (req: Request, res: Response) => {

    })

authRouter.get('/me', authBearer,
    async (req: Request, res: Response) => {
    res.render('/profile', {
        email: req.user?.email,
        login: req.user?.login,
        userId: req.user?.id
    })
    })




