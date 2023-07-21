const db = require('../models')
const profile = db.Profile
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const  {Op}  = require('sequelize')
const transporter = require('../middleware/transporter')
const fs = require('fs')
const handlebars = require('handlebars')

module.exports = {
    register : async (req,res) => {
        try {
            const {username,email,phoneNumber,password} = req.body
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const result = await profile.create({username,email,phoneNumber,password : hashPassword})
            const payload = {id : result.id}
            const token = jwt.sign(payload, 'key', {expiresIn : '1d'})
        
            const data = await fs.readFileSync('./index.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({token})

           await transporter.sendMail({
            from : 'hamidiakmal193@gmail.com',
            to : email,
            subject : "Verify Account",
            html : tempResult
           })

            res.status(200).send({
                status : true,
                message : 'Register Success',
                result,
                token
            })
        } catch (error) {
            res.status(200).send(error)
        }

    },

    verify : async (req, res) => {
            await profile.update(
                {
                 isVerify : true,
                },
                {
                    where : {id: req.user.id}
                }
            )
            res.status(200).send('verification success')
    },
    login : async (req,res) => {
        try {
            const username = req.body.username || ""
            const email = req.body.email || ""
            const phoneNumber = req.body.phoneNumber || ""
            const password = req.body.password
            const result = await profile.findOne(
                {
                        where : {
                        [Op.or] : [
                        {email : email},
                        {username : username},
                        {phoneNumber : phoneNumber},  
                    ]
                }
            }
            )
            if (!result) throw{
                message : "User Not Found"
            }
            const isValid = await bcrypt.compare(password, result.password)
            if (!isValid) throw{
                message : "Wrong Password"
            }
            const isVerified = result.isVerify
            if (!isVerified) throw{
                message : "Account must have verify"
            }

            const payload = {id : result.id}
            const token = jwt.sign(payload, "key", {expiresIn: '1d'})

            res.status(200).send({
                result,
                token
            })
        }
        catch (error) {
            res.status(400).send(error.message)
        }
    },
    keepLogin : async (req, res) => {
        try {
            const result = await profile.findOne({
                where : {id : req.user.id}
            })
            res.status(200).send(result)
            
        } catch (error) {
            res.status(400).send(error)
        }
    }
}