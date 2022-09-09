import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {inject, injectable} from "inversify";
import {UsersService} from "../domain/users-servise";
import {UsersRepository} from "../repositories/users-repository";
import {AuthService} from "../domain/auth-service";
import {UsersType} from "../types";


@injectable()
export class AuthController {
    constructor(@inject(AuthService)
                protected usersService: UsersService,
                protected usersRepository: UsersRepository,
                protected authService: AuthService
    ) {
    }


    async userRegConfirmation(req: Request, res: Response) {
        const result = await this.authService.userRegConfirmation(req.body.code)
        if (result) {
            res.status(204).send()
        } else {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "code"}]})
            return
        }
    }

    async userRegistration(req: Request, res: Response) {
        const findEmailOrlogin = await this.usersRepository.findUserByEmailOrlogin(req.body.email, req.body.login)
        console.log(findEmailOrlogin)
        if (findEmailOrlogin) {

            res.sendStatus(401)
            return
        }
        const userRegistration = await this.authService.userRegistration(req.body.login, req.body.email, req.body.password)
        res.status(204).send(userRegistration)
        return

    }

    async resendingEmailConfirm(req: Request, res: Response) {
        const user = await this.usersRepository.findUserByEmail(req.body.email)
        if (user?.isConfirmed === true || !user) {
            res.status(400).send({errorsMessages: [{message: "ErrorMessage", field: "email"}]})
        } else {
            const result = await this.authService.resendingEmailConfirm(req.body.email)
            if (result) {
                res.sendStatus(204)
            } else {
                res.sendStatus(400)
            }
        }

    }

    async createJWTPair(req: Request, res: Response) {

        const user = await this.authService.checkCredentials(req.body.login, req.body.password)
        if (!user) {
            res.status(401).send()
            return
        }
        // @ts-ignore
        const jwtTokenPair = await jwtService.createJWTPair(user)
        res.cookie('refreshToken', jwtTokenPair.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send({accessToken: jwtTokenPair.accessToken})
        return
    }

    async sendRefreshToken(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        const tokenTime = await jwtService.getTokenTime(refreshToken)
        if (!tokenTime) return res.sendStatus(401)

        const isRefreshTokenInBlackList = await this.authService.checkTokenInBlackList(refreshToken)
        if (isRefreshTokenInBlackList) return res.sendStatus(401)

        // достаём юзерАйди из токена
        const userId = await jwtService.getUserIdByToken(refreshToken)
        // проверяем что юзер в базе
        const user = await this.usersService.findUsersById(userId)
        if (!user) return res.sendStatus(401)

        await this.authService.addRefreshTokenToBlackList(refreshToken)
        const jwtTokenPair = await jwtService.createJWTPair(user)

        res.cookie('refreshToken', jwtTokenPair.refreshToken, {httpOnly: true, secure: true})
        res.status(200).send({accessToken: jwtTokenPair.accessToken})
        return

    }

    async userLogout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)

        const tokenTime = await jwtService.getTokenTime(refreshToken)
        if (!tokenTime) return res.sendStatus(401)

        const isRefreshTokenInBlackList = await this.authService.checkTokenInBlackList(refreshToken)
        if (isRefreshTokenInBlackList) return res.sendStatus(401)

        // достаём юзерАйди из токена
        const userId = await jwtService.getUserIdByToken(refreshToken)
        // проверяем что юзер в базе
        const user = await this.usersService.findUsersById(userId)
        if (!user) return res.sendStatus(401)

        await this.authService.addRefreshTokenToBlackList(refreshToken)
        res.sendStatus(204)
        return
    }

    async aboutMe(req: Request, res: Response) {
        const header = req.headers.authorization
        if (!header) return res.sendStatus(401)

        const token = header!.split(' ')[1]
        const userId = await jwtService.getUserIdByToken(token)
        const user = await this.authService.findUserById(userId)

        if (user) {
            res.status(200).send({
                email: user.email,
                login: user.login,
                userId: user.id,
            })
        } else {
            res.sendStatus(401)
        }
    }
}