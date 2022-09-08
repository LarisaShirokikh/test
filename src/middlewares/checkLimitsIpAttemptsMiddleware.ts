import {NextFunction, Request, Response} from "express";
import {endpointsAttemptsTrysCollection, UsersEmailConfDataModel} from "../settingses/db";

const
    LIMIT_OF_ATTEMPTS = 10 * 1000

    export const checkLimitsIPAttemptsMiddleware = async (req: Request, res: Response, next: NextFunction) => {

        const ip = req.ip
        console.log(ip)
        const url = req.url
        const currentTime: Date = new Date()
        const limitTime: Date = new Date(currentTime.getTime() - LIMIT_OF_ATTEMPTS)
        const userIP = ip
        const time = new Date()

        const countOfAttempts = await UsersEmailConfDataModel.countDocuments({
            userIP: ip,
            url,
            time: {$gt: limitTime}
        })

        await endpointsAttemptsTrysCollection.insertMany({ userIP, url, time})

        if (countOfAttempts! < 10) {
            next()
        } else {
            res.sendStatus(429)
        }
    }