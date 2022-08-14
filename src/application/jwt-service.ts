
import {settings} from "../settings";
import jwt from 'jsonwebtoken'
import {UsersType, UsersWithHashType} from "../types";
import {ObjectId} from "mongodb";

export const jwtService = {

    async createJWT(user: any) {


            const token = jwt
                .sign({userId: user.id, },
                    settings.JWT_SECRET, {expiresIn: '10h'})
            return token


    },

    async getUserIdByToken (token: string) {
        try {
            //const result: any = jwt.decode(token)
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}