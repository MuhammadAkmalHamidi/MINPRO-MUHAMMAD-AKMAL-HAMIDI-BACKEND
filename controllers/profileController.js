const  transporter  = require('../middleware/transporter')
const db = require('../models')
const user = db.Profile
const bcrypt = require('bcrypt')
const fs = require('fs')
const handlebars = require('handlebars')
const jwt = require('jsonwebtoken')

module.exports = {
    resetPassword : async (req, res) => {
        try {
            const { newPassword, confirmPassword } = req.body
            if (confirmPassword !== newPassword) throw{
                message : "Confirm Password Not Match"
            }
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(newPassword, salt)
            const result = await user.update(
                {password : hashPassword},
                {where : {id : req.user.id}},
            )
            res.status(200).send({
                status : true,
                result
            })
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    forgetPassword : async (req, res) => {
        try {
            
            const isEmailExist = await user.findOne(
                {
                    where : {email : req.body.email}
                }
            )
            if (!isEmailExist) throw{
                message : "Email Not Found!"
            }
            const {email} = req.body
            const payload = {id : isEmailExist.id}
            const token = jwt.sign(payload, 'key', {expiresIn : '1d'})
            const data = await fs.readFileSync('./index.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({token})
            
            await user.update(
                {
                    isVerify : 1
                },
                {
                    where : {email : req.body.email}
                })
                
                await transporter.sendMail({
                    from : 'hamidiakmal193@gmail.com',
                    to : email,
                    subject : "Verify Account",
                    html : tempResult
                })
                
           res.status(200).send({
            message : "Check Your Email To Verify Your Account:)",
            token
           })

        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },


    changeUsername : async (req, res) => {
        try {
            const {currentUsername,newUsername} = req.body
            const checkUsername = await user.findOne({
                where : {id : req.user.id}
            })
            if (currentUsername !== checkUsername.username) throw{
                message : 'Wrong Current Username'
            }
            const change = 'Username'
            const data = await fs.readFileSync('./change.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({change})

            await transporter.sendMail({
                from : 'hamidiakmal193@gmail.com',
                to : checkUsername.email,
                subject : "Change Username",
                html : tempResult
               })

            const result = await user.update(
                {username : newUsername},
                {where : {id : req.user.id}}
            )
            res.status(200).send({
                message : 'Change Username Success',
            })
            
                
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    changePassword : async (req, res) => {
        try {
            const {currentPassword,newPassword,confirmPassword} = req.body
            const checkPassword = await user.findOne({
                where : {id : req.user.id}
            })
            const isValid = await bcrypt.compare(currentPassword, checkPassword.password)
            if (!isValid) throw {
                message : "password incorrect"
            }
            if (confirmPassword !== newPassword) throw{
                message : "password not match"
            }

            const change = 'password'
            const data = await fs.readFileSync('./change.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({change})

            await transporter.sendMail({
                from : 'hamidiakmal193@gmail.com',
                to : checkPassword.email,
                subject : "Change password",
                html : tempResult
               })

               const salt = await bcrypt.genSalt(10)
               const hashPassword = await bcrypt.hash(newPassword, salt)
               const result = await user.update(
                   {password : hashPassword},
                   {where : {id : req.user.id}},
               )
            res.status(200).send({
                message : 'Change Password Success',
            })

            
            
                
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    changePhoneNumber : async (req, res) => {
        try {
            const {currentPhoneNumber,newPhoneNumber} = req.body
            const checkPhoneNumber = await user.findOne({
                where : {id : req.user.id}
            })
            if (currentPhoneNumber !== checkPhoneNumber.phoneNumber) throw{
                message : 'Wrong Current Phone Number'
            }
            const change = "phone Number"
            const data = await fs.readFileSync('./change.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({change})

            await transporter.sendMail({
                from : 'hamidiakmal193@gmail.com',
                to : checkPhoneNumber.email,
                subject : "Change Phone Number",
                html : tempResult
               })

            const result = await user.update(
                {phoneNumber : newPhoneNumber},
                {where : {id : req.user.id}}
            )
            res.status(200).send({
                message : 'Change Phone Number Success',
            })
            
                
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    changeEmail : async (req, res) => {
        try {
            const {currentEmail,newEmail} = req.body
            const checkEmail = await user.findOne({
                where : {id : req.user.id}
            })
            if (currentEmail !== checkEmail.email) throw{
                message : 'Wrong Current email'
            }
            email = "Email"
                  
            await user.update({
                isVerify : 0,
            },
            {
                where : {id : req.user.id}
            }
            )
            
            const result = await user.update(
                {email : newEmail},
                {where : {id : req.user.id}}
                )
                
                const payload = {id : req.user.id}
                const token = jwt.sign(payload, 'key', {expiresIn : '1d'})
                
                const data = await fs.readFileSync('./index.html', 'utf-8')
                const tempCompile = await handlebars.compile(data)
                const tempResult = tempCompile({token})

                res.status(200).send({
                    message : 'Change email Success',
                })

                await transporter.sendMail({
                    from : 'hamidiakmal193@gmail.com',
                    to : currentEmail,
                    subject : "Verify Account",
                    html : tempResult
                })
                
                
            } catch (error) {
                res.status(400).send(error)
            }
    },
    imageProfile : async (req, res) => {
        try {
            if (req.file == undefined) throw{
                message : "Image should not be empty"
            }
            if (req.file.size > 1024 * 1024) throw{
                message : 'file size too large'
            }
            await user.update({
                ImgProfile : req.file.filename
            },{
                where : {
                    id : req.user.id
                }
            }
            )
            res.status(200).send('success')
        } catch (error) {
            res.status(400).send(error)
        }
    }
}