import {RefreshTokensBlackListModel} from "../settingses/db";


export const refreshRepository = {
    async addRefreshTokenToBlackList(token: string) {
        const result = await RefreshTokensBlackListModel.insertMany([{refreshToken: token}])
        return result
    },
    async checkTokenInBlackList(refreshToken: string) {
        const result  = await RefreshTokensBlackListModel.findOne({refreshToken})
        return result;
    },
    async deleteAllTokensInBlackList(): Promise<boolean> {
        await RefreshTokensBlackListModel.deleteMany({})
        return true
    }
}