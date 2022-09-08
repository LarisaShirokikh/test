import express from 'express'
import bodyParser from "body-parser"
import {bloggersRouter} from "./router/bloggers-route";
import {postsRouter} from "./router/posts-route";
import {runDb} from "./settingses/db"
import cors from "cors"
import {usersRouter} from "./router/users-route";
import {authRouter} from "./router/auth-router";
import {commentsRouter} from "./router/comment-router";
import {testingRouter} from "./router/testing-router";
var cookieParser = require('cookie-parser')




const app = express()
app.use(cors())
app.use(bodyParser())
app.use(cookieParser());


const port = process.env.PORT || 3000

app.set("trust proxy", true)

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp();

