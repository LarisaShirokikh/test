import {RefreshTokensBlackListModelClass} from "../settingses/db";
import {injectable} from "inversify";

@injectable()
export class RefreshRepository  {

    async addRefreshTokenToBlackList(token: string) {
        const result = await RefreshTokensBlackListModelClass.insertMany([{refreshToken: token}])
        return result
    }
    async checkTokenInBlackList(refreshToken: string) {
        const result  = await RefreshTokensBlackListModelClass.findOne({refreshToken})
        return result;
    }
    async deleteAllTokensInBlackList(): Promise<boolean> {
        await RefreshTokensBlackListModelClass.deleteMany({})
        return true
    }
}