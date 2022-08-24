import express from 'express'
import bodyParser from "body-parser"
import {bloggersRouter} from "./router/bloggers-route";
import {postsRouter} from "./router/posts-route";
import {runDb} from "./settingses/settings"
import cors from "cors"
import {usersRouter} from "./router/users-route";
import {authRouter} from "./router/auth-router";
import {commentsRouter} from "./router/comment-router";
import {testingRouter} from "./router/testing-router";
const cookieParser = require('cookie-parser')





const app = express()
const port = process.env.PORT || 3000

app.set("trust proxy", true) // fix ip
// X-Forwardet-For

const parserMiddleware = bodyParser.json()
app.use(cors())
app.use(parserMiddleware)
app.use(cookieParser());

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/auth', authRouter)
app.use('/testing', testingRouter)




app.get('/', (req, res) => {
    res.send('Hello World!')
})

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp();


