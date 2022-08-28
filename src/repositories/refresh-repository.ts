import {RefreshTokensBlackListModel} from "../settingses/db";


export const refreshRepository = {
    async addRefreshTokenToBlackList(token: string) {
        const result = await RefreshTokensBlackListModel.create({refreshToken: token})
        return result
    },

    async checkTokenInBlackList(refreshToken: string) {
        const result  = await RefreshTokensBlackListModel
            .findOne({refreshToken}, {projection: {_id: 0}})
        return result;
    },
    async deleteAllTokensInBlackList(): Promise<boolean> {
        await RefreshTokensBlackListModel.deleteMany({})
        return true
    }
}