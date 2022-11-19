const express = require('express')
const router = express.Router()

const auth = require('../methods/auth')
const db = require('../methods/database')

// Authorizing request
router.use((req, res, next) => {
    auth(req.body, res, next)
})

// Returns all sessions from specific server
router.get('/all/:server_id', (req, res) => {
    const { server_id } = req.params

    db.query('SELECT * FROM sessions WHERE server_id =?', [ server_id ], (error, results) => {
        if (error) return res.status(404).send({ error: error })
        res.status(200).send({ data: results })
    })
})

// Creates session
router.post('/create', (req, res) => {
    const { server_id, channel_id, users } = req.body

    db.query('INSERT INTO sessions VALUES (NULL, ?, ?, DEFAULT, NULL)', [ server_id, channel_id ], (error, results) => {
        if (error) return res.status(404).send({ error: error })

        db.query('INSERT INTO connections (user_id, session_id) VALUES ?', [users.map(id => [ id, results.insertId ])], (error, resulsts) => {
            if (error) return res.status(404).send({ error: error })
            res.status(200).send({ data: 'Session created successfully' })
        })
    })
})

// Ends session
router.patch('/end/:session_id', (req, res) => {
    const { session_id } = req.params

    db.query('UPDATE sessions SET end_date = CURRENT_TIMESTAMP WHERE id = ?', [ session_id ], (error, results) => {
        if (error) return res.status(404).send({ error: error })
        res.status(200).send({ data: 'Session ended successfully' })
    })
})

module.exports = router