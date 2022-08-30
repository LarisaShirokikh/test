import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {authService} from "../domain/auth-service";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {usersRepository} from "../repositories/users-repository";
import {checkLimitsIPAttemptsMiddleware} from "../middlewares/checkLimitsIpAttemptsMiddleware";
import {authBearer} from "../middlewares/auth-middleware";
import {usersService} from "../domain/users-servise";


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
    passwordValidation, inputValidationMiddleWare,
    checkLimitsIPAttemptsMiddleware,

    async (req: Request, res: Response) => {
        const findEmailOrlogin = await usersRepository.findUserByEmailOrlogin(req.body.email, req.body.login)
        console.log(findEmailOrlogin)
        if (findEmailOrlogin) {

            res.sendStatus(401)
            return
        }
        const userRegistration = await authService.userRegistration(req.body.login, req.body.email, req.body.password)
        res.status(204).send(userRegistration)
        return

    })

authRouter.post('/registration-email-resending',
    emailValidation, inputValidationMiddleWare, checkLimitsIPAttemptsMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersRepository.findUserByEmail(req.body.email)
        if (user?.accountData.isConfirmed === true || !user) {
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
    inputValidationMiddleWare,
    checkLimitsIPAttemptsMiddleware,
    async (req: Request, res: Response) => {

        const user = await authService.checkCredentials(req.body.login, req.body.password)
        if (!user) {
            res.status(401).send()
            return
        }
        const jwtTokenPair = await jwtService.createJWTPair(user)
        res.cookie('refreshToken', jwtTokenPair.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send({accessToken: jwtTokenPair.accessToken})
        return
    })

authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        const tokenTime = await jwtService.getTokenTime(refreshToken)
        if (!tokenTime) return res.sendStatus(401)

        const isRefreshTokenInBlackList = await authService.checkTokenInBlackList(refreshToken)
        if (isRefreshTokenInBlackList) return res.sendStatus(401)

        // достаём юзерАйди из токена
        const userId = await jwtService.getUserIdByToken(refreshToken)
        // проверяем что юзер в базе
        const user = await usersService.findUsersById(userId)
        if (!user) return res.sendStatus(401)

        await authService.addRefreshTokenToBlackList(refreshToken)
        const jwtTokenPair = await jwtService.createJWTPair(user)

        res.cookie('refreshToken', jwtTokenPair.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send({accessToken: jwtTokenPair.accessToken})
        return

    })

authRouter.post('/logout',
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        const tokenTime = await jwtService.getTokenTime(refreshToken)
        if (!tokenTime) return res.sendStatus(401)

        const isRefreshTokenInBlackList = await authService.checkTokenInBlackList(refreshToken)
        if (isRefreshTokenInBlackList) return res.sendStatus(401)

        // достаём юзерАйди из токена
        const userId = await jwtService.getUserIdByToken(refreshToken)
        // проверяем что юзер в базе
        const user = await usersService.findUsersById(userId)
        if (!user) return res.sendStatus(401)

        await authService.addRefreshTokenToBlackList(refreshToken)
        res.sendStatus(204)
        return
    })


authRouter.get('/me', authBearer,
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
    })




