import {AttemptType} from "../types";
import {endpointsAttemptsTrysCollection} from "../settingses/settings";

export const attemptsRepository = {

    async getLastAttempts(ip: string, url: string, limitTime: number): Promise<number | undefined | null> {

        const countAttempts = await endpointsAttemptsTrysCollection.count({
            userIP: ip,
            url,
            time: {$gte: limitTime}
        })
        return countAttempts
    },

    async addAttempt(userIP: string, url: string, time: number):  Promise<AttemptType> {

        const result = endpointsAttemptsTrysCollection.insertOne({ userIP, url, time})
        // @ts-ignore
      return result
    },

    async deleteAllAttempts(): Promise<boolean> {
        const result = await endpointsAttemptsTrysCollection.deleteMany({})
        return true
    }

}
