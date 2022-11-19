function auth({ bot_token }, res, next) {
    if (!bot_token || bot_token !== process.env.BOT_TOKEN) return res.status(401).send({ message: 'Unauthorized' })
    return next()
}

module.exports = auth