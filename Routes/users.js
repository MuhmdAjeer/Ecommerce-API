const express = require('express')
const router = express.Router()
const {register} = require('../controller/authController')

router.post('/',register)
router.get('/',(req,res)=>{
    console.log('dsf');
})

module.exports = router;