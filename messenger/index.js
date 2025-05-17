const router = require('express').Router()
const messageController = require('./controller')

router.get('/messages', messageController.getMessage)
router.post('/messages', messageController.postMessage)

module.exports = router