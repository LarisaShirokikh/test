
import jwt from 'jsonwebtoken'
import {ObjectId} from 'mongodb'
import {UsersType} from "../types";


export const jwtService = {

    async createJWT(user: UsersType) {

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET || '123', {expiresIn: '24h'})
        return {token: token}
    },

    async getUserIdByToken (token: string) {
        try {

            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123')
            return result.userId
        } catch (error) {
            return null
        }
    }

}