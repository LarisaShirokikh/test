import jwt from 'jsonwebtoken'

import {ObjectId} from "mongodb";
import {toString} from "express-validator/src/utils";
import {settings} from "../settingses/settings";

export const jwtService = {
    async createJWT(user:any){
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'} )
        return token
    },

    async getUserIdByToken (token: string){
        try{
            const result:any =  jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}