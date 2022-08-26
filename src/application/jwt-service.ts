import jwt from 'jsonwebtoken'
import { db } from '../settingses/setting';
import {UsersType, UsersWithPassType} from "../types";


export const jwtService = {
    async createJWT(user:any){
        const token = jwt.sign({userId: user.id}, db.JWT_SECRET, {expiresIn: '1h'} )
        return token
    },

    async getUserIdByToken (token: string){
        try{
            const result:any =  jwt.verify(token, db.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    },
    async userIdByToken (token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123')
            return result.userId
        } catch (error) {
            return null
        }
    },
    async createJWTPair(user: UsersWithPassType) {
        const accessToken = jwt
            .sign({userId: user.id},
                process.env.JWT_SECRET || '123', {expiresIn: 10})
        const refreshToken = jwt
            .sign({userId: user.id},
                process.env.JWT_SECRET || '123', {expiresIn: 20})
        const jwtTokenPair = {accessToken, refreshToken}
        return jwtTokenPair
    },
}