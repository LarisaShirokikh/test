

import rateLimit from 'express-rate-limit'

export const limitMiddleware = rateLimit({
    max: 5,
    windowMs: 10000
})