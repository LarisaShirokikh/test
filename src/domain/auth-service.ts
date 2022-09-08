
import {emailManager} from "../managers/email-manager";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import bcrypt from "bcrypt";
import {UsersDBType} from "../types";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {UsersRepository} from "../repositories/users-repository";
import {RefreshRepository} from "../repositories/refresh-repository";



@injectable()
export class AuthService  {

    constructor(@inject(UsersRepository)
                protected usersRepository: UsersRepository,
                protected refreshRepository: RefreshRepository
    ) {
        this.usersRepository = new UsersRepository,
        this.refreshRepository = new RefreshRepository
    }
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

        await this.usersRepository.createUser(newUser)
        await this.usersRepository.insertDbUnconfirmedEmail(newUser.emailConfirmation)
        await emailManager.sendEmailConfirmationCode(newUser.emailConfirmation.confirmationCode, email)
        return newUser

    }
    async userRegConfirmation(confirmationCode: string): Promise<boolean> {
        const user = await this.usersRepository.findUserByConfirmCode(confirmationCode)
        if (!!user.emailConfirmation && user.emailConfirmation.isConfirmed === false) {
            const result = await this.usersRepository.updateEmailConfirmation(user.emailConfirmation.email)
            if(result) {
               await emailManager.sendEmailConfirmation(user.emailConfirmation.email)
            }
            return true
        } else {
            return false
        }
    }
    async resendingEmailConfirm(email: string) {
        const user = await this.usersRepository.findUserByEmail(email)
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

        await this.usersRepository.updateUnconfirmedEmailData(newEmailConfirmation)

        await emailManager.sendEmailConfirmationCode( newEmailConfirmation.confirmationCode, email)
        return true
    }
    async checkCredentials(login: string, password: string){
            const user = await this.usersRepository.findUserByLogin(login)
        if (!user) return null
            const validPassword = await bcrypt.compare(password, user.accountData.passwordHash)
        if (validPassword) return user
                return false
    }
    async checkTokenInBlackList(refreshToken: string) {
        return this.refreshRepository.checkTokenInBlackList(refreshToken)
    }
    async addRefreshTokenToBlackList(refreshToken: string) {
        const result =  await this.refreshRepository.addRefreshTokenToBlackList(refreshToken)

        return result
    }
    async findUserById(userId: string): Promise<UsersDBType | undefined | null>{
        const user = await this.usersRepository.findUserWithEmailById(userId)
        return user
    }
}