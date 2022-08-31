import {RefreshTokensBlackListModelClass} from "../settingses/db";


export const refreshRepository = {
    async addRefreshTokenToBlackList(token: string) {
        const result = await RefreshTokensBlackListModelClass.insertMany([{refreshToken: token}])
        return result
    },
    async checkTokenInBlackList(refreshToken: string) {
        const result  = await RefreshTokensBlackListModelClass.findOne({refreshToken})
        return result;
    },
    async deleteAllTokensInBlackList(): Promise<boolean> {
        await RefreshTokensBlackListModelClass.deleteMany({})
        return true
    }
}