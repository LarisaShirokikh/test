import {NextFunction, Response} from "express";

const requestIP = require('request-ip');
const nodeCache = require('node-cache');
const isIp = require('is-ip');


const TIME_FRAME_IN_S = 10;
const TIME_FRAME_IN_MS = TIME_FRAME_IN_S * 1000;
const MS_TO_S = 1 / 1000;
const RPS_LIMIT = 5;

const IPCache = new nodeCache({stdTTL: TIME_FRAME_IN_S, deleteOnExpire: false, checkperiod: TIME_FRAME_IN_S});
IPCache.on('expired', (key: any, value: any) => {
    // @ts-ignore
    if (new Date() - value[value.length - 1] > TIME_FRAME_IN_MS) {
        IPCache.del(key);
    } else {
        // @ts-ignore
        const updatedValue = value.filter(function (element) {
            // @ts-ignore
            return new Date() - element < TIME_FRAME_IN_MS;
        });
        // @ts-ignore
        IPCache.set(key, updatedValue, TIME_FRAME_IN_S - (new Date() - updatedValue[0]) * MS_TO_S);
    }
});
const updateCache = (ip: any) => {
    let IPArray = IPCache.get(ip) || [];
    IPArray.push(new Date());
    IPCache.set(ip, IPArray, (IPCache.getTtl(ip) - Date.now()) * MS_TO_S || TIME_FRAME_IN_S);
};


const ipMiddleware = async function (req: Request, res: Response, next: NextFunction) {
    let clientIP = requestIP.getClientIp(req);
    if (isIp.v6(clientIP)) {
        clientIP = clientIP.split(':').splice(0, 4).join(':') + '::/64';
    }
    updateCache(clientIP);
    const IPArray = IPCache.get(clientIP);
    if (IPArray.length > 1) {
        const rps = IPArray.length / ((IPArray[IPArray.length - 1] - IPArray[0]) * MS_TO_S);
        if (rps > RPS_LIMIT) {
            console.log('You are hitting limit', clientIP);
        }
    }
    next();
};