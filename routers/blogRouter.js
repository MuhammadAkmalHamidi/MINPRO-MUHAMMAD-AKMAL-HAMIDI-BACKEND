const blog = require('../controllers/blog')
const { verifyToken } = require('../middleware/auth')
const { multerUpload } = require('../middleware/multer')
const { checkCreateBlog } = require('../middleware/validator')

const router = require('express').Router()

router.post('/createBlog', verifyToken, multerUpload('./public/imgURL', 'imgURL').single('file'),checkCreateBlog,blog.createBlog)
router.delete('/deleteBlog', verifyToken, blog.deleteBlog)
router.get('/myBlog', verifyToken, blog.myBlog)
router.get('/getAll', blog.getAllBlog)
router.get('/searchBlog', blog.sortBlog)
router.post('/likeBlog', verifyToken, blog.likeBlog)
router.get('/favBlog', blog.favoriteBlog)
router.get('/getCategory', blog.getAllCategory)
router.get('/likeBlog', verifyToken, blog.getLikeBlog)
router.get('/:id', blog.getBlogById)
module.exports = router