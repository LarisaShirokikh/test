import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../managers/email-manager";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {refreshRepository} from "../repositories/refresh-repository";
import bcrypt from "bcrypt";
import {UsersDBType} from "../types";
import {ObjectId} from "mongodb";



export const authService = {
    async userRegistration(login: string, email: string, password: string) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser: UsersDBType = {
            accountData: {
                id: (new ObjectId()).toString(),
                login,
                email,
                passwordHash,
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

        await usersRepository.createUser(newUser)
        await usersRepository.insertDbUnconfirmedEmail(newUser.emailConfirmation)
        await emailManager.sendEmailConfirmationCode(newUser.emailConfirmation.confirmationCode, email)
        return newUser

    },
    async userRegConfirmation(confirmationCode: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmCode(confirmationCode)
        if (!!user.emailConfirmation && user.emailConfirmation.isConfirmed === false) {
            const result = await usersRepository.updateEmailConfirmation(user.emailConfirmation.email)
            if(result) {
               await emailManager.sendEmailConfirmation(user.emailConfirmation.email)
            }
            return true
        } else {
            return false
        }
    },
    async resendingEmailConfirm(email: string) {
        const user = await usersRepository.findUserByEmail(email)
        if (!user) return false
        if (user?.emailConfirmation.isConfirmed === true) return false
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
    async checkCredentials(login: string, password: string){
            const user = await usersRepository.findUserByLogin(login)
        if (!user) return false
            const validPassword = await bcrypt.compare(password, user.accountData.passwordHash)
        if (validPassword) return user
                return false
    },

    async checkTokenInBlackList(refreshToken: string) {
        return refreshRepository.checkTokenInBlackList(refreshToken)
    },

    async addRefreshTokenToBlackList(refreshToken: string) {
        const result =  await refreshRepository.addRefreshTokenToBlackList(refreshToken)

        return result
    },
    async findUserById(userId: string): Promise<UsersDBType | undefined | null>{
        const user = await usersRepository.findUserWithEmailById(userId)

        /*user['userId'] = user['id'];
        delete user['id'];

        const nUser = {
            email: user.email,
            login: user.login,
            userId: user.userId
        }*/
        return user
    }
}