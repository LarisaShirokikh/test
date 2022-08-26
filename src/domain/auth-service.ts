import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../managers/email-manager";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {refreshRepository} from "../repositories/refresh-repository";
import bcrypt from "bcrypt";
import {usersService} from "./users-servise";

export const authService = {
    async userRegistration(login: string, email: string, password: string) {
        const newUser = {
            accountData: {
                id: uuidv4(),
                login,
                email,
                password,
                isConfirmed: false
            },
            emailConfirmation: {
                email,
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 3,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        await usersRepository.createUser(newUser.accountData)
        await usersRepository.insertDbUnconfirmedEmail(newUser.emailConfirmation)
        console.log(777)
        await emailManager.sendEmailConfirmationCode(newUser.emailConfirmation.confirmationCode, email)
        return newUser

    },
    async userRegConfirmation(confirmationCode: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmCode(confirmationCode)
        if (!!user.emailConfirmation && user.emailConfirmation.isConfirmed === false) {
            const result = await usersRepository.updateEmailConfirmation(user.emailConfirmation.email)
            if(result) {
                emailManager.sendEmailConfirmation(user.emailConfirmation.email)
            }
            return true
        } else {
            return false
        }
    },
    async resendingEmailConfirm(email: string) {
        const user = await usersRepository.findUserByEmail(email)
        if (!user) return false
        if (user?.isConfirmed === true) return false
        const newEmailConfirmation = {
            email,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 3,
                minutes: 3
            }),
            isConfirmed: false
        }

        await usersRepository.updateUnconfirmedEmailData(newEmailConfirmation)

        await emailManager.sendEmailConfirmationCode( newEmailConfirmation.confirmationCode, email)
        return true
    },
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)
        console.log(user)
        const passwordSalt = await bcrypt.genSalt(10)
        console.log(passwordSalt)
        const passwordHash = await usersService._generateHash(password, passwordSalt)
        console.log(passwordHash)
//@ts-ignore
        if (passwordSalt[1] === user!.passwordSalt[1]) {
            console.log(80)
            return user
        }
        return false
    },
    async checkTokenInBlackList(refreshToken: string) {
        return refreshRepository.checkTokenInBlackList(refreshToken)
    },
    async addRefreshTokenToBlackList(refreshToken: string) {
        debugger
        const result =  await refreshRepository.addRefreshTokenToBlackList(refreshToken)

        return result
    },
}