
import {injectable} from "inversify";
import {RefreshTokensBlackListModel} from "../settingses/db";


export const refreshTokensBLRepository = {

    async addRefreshTokenToBlackList(token: string) {

        const result = await RefreshTokensBlackListModel.insertMany({refreshToken: token})
        return result
    },

    async checkTokenInBlackList(refreshToken: string) {
        const result  = await RefreshTokensBlackListModel.findOne({refreshToken}, {projection: {_id: 0}})
        if(result === null) {
            return false
        } else {
            return result
        }
    },

    async deleteAllTokensInBlackList(): Promise<boolean> {
        await RefreshTokensBlackListModel.deleteMany({})
        return true
    }

}