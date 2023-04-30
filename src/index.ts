import express from 'express'
import bodyParser from "body-parser"
import cors from "cors"

const cookieParser = require('cookie-parser')



const app = express()
const port = process.env.PORT || 3000

app.set("trust proxy", true) // fix ip
// X-Forwardet-For

const parserMiddleware = bodyParser.json()
app.use(cors())
app.use(parserMiddleware)
app.use(cookieParser());




app.get('/', (req, res) => {
    res.send('Hello World!')
})


    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })





