import jwt from 'jsonwebtoken'
import {UsersType} from "../types";

export const jwtService = {
    async createJWTPair(user: UsersType) {
        const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET || '123', {
            expiresIn: 10
        })

        const refreshToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET || '123', {
            expiresIn: 20
        })

        const jwtTokenPair = {accessToken, refreshToken}

        return jwtTokenPair
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