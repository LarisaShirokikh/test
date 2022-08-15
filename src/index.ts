import express from 'express'
import bodyParser from "body-parser"
import {bloggersRoute} from "./router/bloggers-route";
import {postsRouter} from "./router/posts-route";
import {runDb} from "./settings"
import cors from "cors"
import {commentRouter} from "./router/comment-router";
import {usersRouter} from "./router/users-route";
import {authRouter} from "./router/auth-router";
import {feedbackRouter} from "./router/feedback-router";



const app = express()
const port = process.env.PORT || 3000

const parserMiddleware = bodyParser.json()
app.use(cors())
app.use(parserMiddleware)

app.use('/bloggers', bloggersRoute)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comment', commentRouter)
app.use('/auth', authRouter)
app.use('/feedback', feedbackRouter)



app.get('/', (req, res) => {
    res.send('Hello World!')
})

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
