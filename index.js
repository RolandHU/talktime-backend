const express = require('express')
const app = express()
const sessionRoute = require('./routes/session')
const connectionRoute = require('./routes/connection')

const dotenv = require('dotenv')
dotenv.config()

app.use(express.json())
app.use('/session', sessionRoute)
app.use('/connection', connectionRoute)

app.listen(process.env.SERVER_PORT, () => console.log(`Server started running on port ${process.env.SERVER_PORT}...`))