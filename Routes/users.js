const express = require('express')
const router = express.Router()
const {register, verifyOtp} = require('../controller/authController')

router.post('/register',register)
router.post('/verifyOtp',verifyOtp)

module.exports = router;