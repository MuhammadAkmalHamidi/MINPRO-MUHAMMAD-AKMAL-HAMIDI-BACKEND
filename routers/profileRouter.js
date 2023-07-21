
const { profileController } = require('../controllers')
const { verifyToken } = require('../middleware/auth')
const  {multerUpload}  = require('../middleware/multer')
const { checkPassword, checkEmail, checkUsername, checkPhone } = require('../middleware/validator')

const router = require('express').Router()

router.patch('/forgetPass', profileController.forgetPassword)
router.patch('/resetPassword', verifyToken, checkPassword , profileController.resetPassword)
router.patch('/changeUsername', verifyToken,checkUsername, profileController.changeUsername)
router.patch('/changePhoneNumber', verifyToken,checkPhone , profileController.changePhoneNumber)
router.patch('/changeEmail', verifyToken,checkEmail, profileController.changeEmail)
router.patch('/changePassword', verifyToken, checkPassword ,profileController.changePassword)
router.post('/upload', verifyToken, multerUpload('./public/avatar', 'avatar').single('file') , profileController.imageProfile)

module.exports = router