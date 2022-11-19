const express = require('express')
const router = express.Router()

const auth = require('../methods/auth')
const db = require('../methods/database')

// Authorizing request
router.use((req, res, next) => {
    auth(req.body, res, next)
})

// Returns all connections by user id
router.get('/all/:user_id', (req, res) => {
    const { user_id } = req.params

    db.query('SELECT * FROM connections WHERE user_id = ?', [ user_id ], (error, results) => {
        if (error) return res.status(404).send({ error: error })
        res.status(200).send({ data: results })
    })
})

// Creates connection(s)
router.post('/create', (req, res) => {
    const { channel_id, user_id } = req.body

    db.query('SELECT * FROM sessions JOIN connections ON connections.session_id = sessions.id WHERE channel_id = ? AND end_date IS NULL AND user_id = ?', [ channel_id, user_id ], (error, results) => {
        if (error) return res.status(404).send({ error: error })
        if (results.length > 0) return res.status(200).send({ data: 'Connection already exists' })

        db.query('INSERT INTO connections (user_id, session_id) VALUES (?, (SELECT id FROM sessions WHERE channel_id = ? ORDER BY create_date DESC LIMIT 1))', [ user_id, channel_id ], (error, results) => {
            if (error) return res.status(404).send({ error: error })
            res.status(200).send({ data: 'Creating connection was successful' })
        })
    })
})

module.exports = router