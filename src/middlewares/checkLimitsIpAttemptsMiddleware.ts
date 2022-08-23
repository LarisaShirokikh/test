import {NextFunction, Request, Response} from "express";
import {attemptsRepository} from "../repositories/attempts-repository";


const LIMIT_OF_ATTEMPTS = 10 * 1000

export const checkLimitsIpAttemptsMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const ip = req.ip
    console.log(ip)
    console.log(req.ips)
    const url = req.url
    const currentTime = Date.now()
    const limitTime = currentTime - LIMIT_OF_ATTEMPTS
    await attemptsRepository.addAttempt(ip, url, currentTime)
    const countOfAttempts = await attemptsRepository.getLastAttempts(ip, url, limitTime)
    console.log(countOfAttempts)


    if(countOfAttempts! < 5 ) {
        next()
    } else {
        res.sendStatus(429)
    }
}