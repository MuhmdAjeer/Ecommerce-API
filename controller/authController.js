const asyncWrapper = require('express-async-handler');
const User = require('../Model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)

module.exports = {
    register : asyncWrapper(async(req,res,next)=>{
        console.log(req.body);
        const {username , email,password,phone} = req.body;

        if(!username || !email || !password || !phone){
            res.status(404)
            throw new Error('Please provide full credentials!');
        }

        let exists = await User.findOne({email:email})
        
        if(exists){
            res.status(400)
            throw new Error('User already exists')
        }

        client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
                .verifications.create({
                    to: `+91${phone}`, 
                    channel: 'sms'
                }).then(({status})=> {
                    res.status(200).json({ status , user : req.body })
                }).catch((err)=> console.log(err))


        // const user = User.create({
        //     username : username,
        //     email : email,
        //     password : (await bcrypt.hash(password,10)),
        //     phone : phone
        // })

        // res.status(201).json({
        //     _id : user.id,
        //     username : user.username,
        //     email : user.username,
        //     token : generateJWT(user.id,user.username)
        // })

    }),
    verifyOtp : asyncWrapper(async(req,res)=>{

        let body = req.body;
        code = parseInt(req.body.code)

        client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
        .verificationChecks
        .create({to: `+91${body.user.phone}`, code: body.code })
        .then(async({status})=> {

        const user = User.create({
            username : username,
            email : email,
            password : (await bcrypt.hash(password,10)),
            phone : phone
        })

            res.status(201).json({
                _id : user.id,
                username : user.username,
                email : user.username,
                token : generateJWT(user.id,user.username)
            })
        })
        .catch((err)=> {
            res.status(400)
            throw new Error('OTP verification failed')
        })
        })
}

const generateJWT = (id,name) => {
    return jwt.sign({id , name}, process.env.JWT_SECRET , {expiresIn : '30d'})
}