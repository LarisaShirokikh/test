
import jwt from 'jsonwebtoken'

import {ObjectId} from "mongodb";
import {settings} from "../settings";

export const jwtService = {
    async createJWT(user:any){
        let payload = {"userId": user.id.toString()}
        const token = jwt.sign(payload, settings.JWT_SECRET, {noTimestamp: true,expiresIn: '1h'} )
        return token
    },

    async getUserIdByToken (token: string){
        try{
            const result:any =  await jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}