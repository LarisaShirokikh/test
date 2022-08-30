import {AttemptType} from "../types";
import {EndpointsAttemptsTrysModel, UsersEmailConfDataModel} from "../settingses/db";


export const attemptsRepository = {

    async getLastAttempts(ip: string, url: string, limitTime: Date): Promise<number | undefined | null> {

        const countAttempts = await UsersEmailConfDataModel.countDocuments({
            userIP: ip,
            url,
            time: {$gt: limitTime}
        })
        return countAttempts
    },

    async addAttempt(userIP: string, url: string, time: Date){
        const result = EndpointsAttemptsTrysModel.insertMany({ userIP, url, time})
        return result
    },

    async deleteAllAttempts(): Promise<boolean> {
        const result = await EndpointsAttemptsTrysModel.deleteMany({})
        return true
    }
}
