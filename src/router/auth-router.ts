import {Router, Response, Request} from "express";
import {checkLimitsIPAttemptsMiddleware} from "../middlewares/checkLimitsIpAttemptsMiddleware";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {authService} from "../domain/auth-service";
import {jwtService} from "../application/jwt-service";
import {authBearer} from "../middlewares/auth-middleware";
import {usersRepository} from "../repositories/users-repository";



export const authRouter = Router({})

authRouter.post('/login',
    loginValidation,
    passwordValidation,
    inputValidationMiddleWare,
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password)
        if (!user) {
            res.send(401)
            return
        }
        // @ts-ignore
        const jwtTokenPair = await jwtService.createJWTPair(user)


        res.cookie('refreshToken', jwtTokenPair.refreshToken, {
        })

        res.status(200).send({accessToken: jwtTokenPair.accessToken})
    }
)

authRouter.post('/refresh-token', async (req: Request, res: Response) => {


        const refreshToken = await req.cookies?.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        let tokenExpTime = await jwtService.getTokenTime(refreshToken)
        // if (tokenExpTime < +(new Date())) return res.sendStatus(401)
        if (!tokenExpTime) return res.sendStatus(401)

        const isRefreshTokenInBlackList = await authService.checkTokenInBlackList(refreshToken)


        if (isRefreshTokenInBlackList) return res.sendStatus(401)

        const user = {id: ""}
        user.id = await jwtService.getUserIdByToken(refreshToken)
        if (user.id === null) res.sendStatus(401)

        const jwtTokenPair = await jwtService.createJWTPair(user)
        res.cookie('refreshToken', jwtTokenPair.refreshToken, {
        })

        await authService.addRefreshTokenToBlackList(refreshToken)

        res.status(200).send({accessToken: jwtTokenPair.accessToken})

    }
)

authRouter.post('/logout', async (req: Request, res: Response) => {

        const refreshToken = await req.cookies?.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        let tokenExpTime = await jwtService.getTokenTime(refreshToken)
        if (!tokenExpTime) return res.sendStatus(401)

        const isRefreshTokenInBlackList = await authService.checkTokenInBlackList(refreshToken)
        if (isRefreshTokenInBlackList) return res.sendStatus(401)

        await authService.addRefreshTokenToBlackList(refreshToken)
        res.sendStatus(204)

    }
)

authRouter.get('/me',
    authBearer,
    async (req: Request, res: Response) => {

        const header = req.headers.authorization
        if (!header) return res.sendStatus(401)

        const token = header!.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)
        const user = await authService.findUserById(userId)

        if (user) {
            res.status(200).send(user)
        } else {
            res.sendStatus(401)
        }
    }
)

authRouter.post('/registration',
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleWare,
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {

        const isEmail = await usersRepository.findUserByEmail(req.body.email)
        const isLogin = await usersRepository.findUserByLogin(req.body.login)

        // @ts-ignore
        if (!!isEmail && isEmail.email) {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "email"}]})
        }

        // @ts-ignore
        if (isLogin && isLogin.login) {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "login"}]})
        }

        const userRegistration = await authService.userRegistration(req.body.login, req.body.email, req.body.password)
        res.status(204).send(userRegistration)
    }
)

authRouter.post('/registration-confirmation',
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {
        // @ts-ignore
        const result = await authService.userRegConfirmation(req.body.code)

        if (result) {
            res.status(204).send()
        } else {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "code"}]})
        }
    }
)

authRouter.post('/registration-email-resending',
    emailValidation,
    inputValidationMiddleWare,
    checkLimitsIPAttemptsMiddleware,

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
    }
)