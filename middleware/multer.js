const multer = require('multer')

module.exports = {
    multerUpload : (directry = "./public", name = "PIMG") => {
        const storage = multer.diskStorage({
            destination : (req, file, cb) => {
                cb(null, './public')
            },
            filename : (req, file, cb) => {
                cb(null, 
                    "PIMG" + 
                    "-" + 
                    Date.now() +
                    Math.round(Math.random() * 100000) +
                    '.' + 
                    file.mimetype.split('/')[1]
                    )
            }
        })
        
        const fileFilter = (req, file, cb) => {
            const extFilter = ['jpg', 'jpeg', 'png', 'webp', 'gif']
            const checkExt = extFilter.includes(file.mimetype.split('/')[1])
        
            if (!checkExt) {
                cb(new Error('Your File Ext Denied'), false)
            }
            else {
                cb(null, true)
            }
        } 
        return multer({storage, fileFilter})
    }
}
