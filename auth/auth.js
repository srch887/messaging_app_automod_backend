const jwt = require('jsonwebtoken')

exports.verifyAccessToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']

    if(!bearerHeader) {
        return res.status(400).send("A token is required for authentication")
    }
    try {
        const bearer = bearerHeader.split(' ')
        const token = bearer[1]

        if (!token || token === 'null') {
            return res.status(400).send("A token is required for authentication")
        }

        const decoded = jwt.verify(token, process.env.ACCESS_KEY)
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid token")
    }
    return next()
}