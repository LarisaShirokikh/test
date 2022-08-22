import {NextFunction, Request, Response} from "express";

import rateLimit from 'express-rate-limit'

export const limitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const rateLimit = ({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
    if (rateLimit) {

        res.status(201)
        next()
    }
    res.status(429)
    return
}