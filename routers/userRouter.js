const { userController } = require('../controllers')
const { verifyToken } = require('../middleware/auth')
const { transporter } = require('../middleware/transporter')
const { checkRegister, checkLogin } = require('../middleware/validator')
const router = require('express').Router()

router.post('/regis',checkRegister , userController.register)
router.patch('/verify',verifyToken , userController.verify)
router.post('/login', checkLogin ,userController.login)
router.post('/keepLogin', verifyToken, userController.keepLogin)

module.exports = router