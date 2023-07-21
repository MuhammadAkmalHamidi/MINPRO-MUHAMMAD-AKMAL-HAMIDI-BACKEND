const { body, validationResult } = require('express-validator')

module.exports = {
    checkRegister : async (req, res, next) => {
        try {
            await body('username').notEmpty().isAlphanumeric().run(req)
            await body('email').notEmpty().isEmail().run(req)
            await body('password').notEmpty().isStrongPassword({
                minLength : 5,
                minNumbers : 1,
                minSymbols : 1,
                minUppercase : 1
            }).run(req)

            const validation = validationResult(req)

            if (validation.isEmpty()) {
                next()
            }
            else {
                res.status(400).send({
                    status : false,
                    message : 'Validation Invalid',
                    error : validation.array()
                })
            }


        } catch (error) {
            res.status(400).send(error)
        }
    },
    checkLogin : async (req, res ,next) => {
        await body('username').isAlphanumeric().optional({nullable : true}).run(req)
        await body('email').isEmail().optional({nullable : true}).run(req)
        await body('phoneNumber').isMobilePhone().optional({nullable : true})

        const validation = validationResult(req)
        
        if (validation.isEmpty()) {
            next()
        }
        else {
            return res.status(400).send({
                status : false ,
                message : "Validation Invalid",
                error : validation.array()
            })
        }
    },
    checkCreateBlog : async (req, res, next) => {
        await body('title').notEmpty().withMessage("title should not be empty").run(req)
        await body('content').notEmpty().withMessage("content should not be empty").run(req)
        await body('keyword').notEmpty().withMessage("keyword should not be empty").run(req)
        await body('country').notEmpty().withMessage("country should not be empty").run(req)

        const validation = validationResult(req)
        
        if (req.file === undefined) {
            res.status(400).send({
                message : "You Must Add A Picture"
            })
        }
        else {
        
            if (validation.isEmpty()) {
                next()
            }
            else {
                return res.status(400).send({
                    error : validation.array()
                })
            }   
        }   
    },

    checkPassword : async (req,res,next) => {
        await body('newPassword').notEmpty().isStrongPassword({
            minLength : 5,
            minNumbers : 1,
            minSymbols : 1,
            minUppercase : 1
        }).run(req) 
        const validation = validationResult(req)

        if (validation.isEmpty()) {
            next()
        }
        else {
            res.status(400).send({
                status : false,
                message : 'Password To Weak',
                error : validation.array()
            })
        }
    },


    checkUsername : async (req, res, next) => {
        await body('newUsername').notEmpty().withMessage('New Username Should Not Be Empty').isAlphanumeric().run(req)

        const validation = validationResult(req)

        if (validation.isEmpty()) {
            next()
        }
        else {
            return res.status(400).send({
                error : validation.array()
            })
        }
    },
    checkEmail : async (req, res, next) => {
        await body('newEmail').notEmpty().withMessage('New Email Should Not Be Empty').isEmail().run(req)

        const validation = validationResult(req)

        if (validation.isEmpty()) {
            next()
        }
        else{
            return res.status(400).send({
                error : validation.array()
            })
        }
    },
    
    checkPhone : async (req, res, next) => {
        await body('newPhoneNumber').notEmpty().withMessage('New Phone Number Should Not Be Empty').isMobilePhone().run(req)

        const validation = validationResult(req)
        
        if (validation.isEmpty()) {
            next()
        }
        else{
            return res.status(400).send({
                error : validation.array()
            })
        }
    }
}