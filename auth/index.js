const router = require('express').Router()
const authController = require('./controller')
const authMiddleware = require('./auth.js')

router.post('/authenticate', authMiddleware.verifyAccessToken, authController.authenticate)

module.exports = router