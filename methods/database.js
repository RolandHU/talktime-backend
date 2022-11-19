const mysql = require('mysql2')

const dotenv = require('dotenv')
dotenv.config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
})

module.exports = connection