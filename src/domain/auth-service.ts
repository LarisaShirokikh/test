import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../managers/email-manager";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'

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
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }

        await usersRepository.createUser(newUser.accountData)
        await usersRepository.insertDbUnconfirmedEmail(newUser.emailConfirmation)
        try {
            await emailManager.sendEmailConfirmationCode(newUser.emailConfirmation.confirmationCode, email)
        } catch (err) {
            console.error(err)
            usersRepository.deleteUsers(newUser.accountData.id)
            usersRepository.deleteUserUnconfirmedEmail(newUser.emailConfirmation.email)
            return null
        }
        return true
    },

    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findLogin(login)
        if (!user) return null
//@ts-ignore
        if (user.password !== password) {
            return false
        }
        return user
    },

    async userRegisrationConfirmation(confirmationCode: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmCode(confirmationCode)
        if (!!user.emailConfirmation && user.emailConfirmation.isConfirmed === false) {
            const result = await usersRepository.updateEmailConfirmation(user.emailConfirmation.email)
            if (result) {
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
        await emailManager.sendEmailConfirmationCode(email, newEmailConfirmation.confirmationCode)
        return true
    }
}