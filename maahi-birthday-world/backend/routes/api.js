const express = require('express')
const router = express.Router()
const { postLimiter } = require('../middleware/rateLimiter')
const giftController = require('../controllers/giftController')

router.get('/gift-options', giftController.getGiftOptions)
router.post('/gift-request', postLimiter, giftController.submitGiftRequest)
router.post('/birthday-message', postLimiter, giftController.submitBirthdayMessage)

module.exports = router
