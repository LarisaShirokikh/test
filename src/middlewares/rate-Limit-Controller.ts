import {NextFunction, Request, Response} from "express";

const redis = require('ioredis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redisClient = new redis({ enableOfflineQueue: false });
const rateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    points: 5, // Number of points
    duration: 10, // Per second
});

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    rateLimiterRedis.consume(req.ip)
        .then(() => {
            next();
        })
        //@ts-ignore
        .catch(_ => {
            res.status(429).send('Too Many Requests');
        });
};
