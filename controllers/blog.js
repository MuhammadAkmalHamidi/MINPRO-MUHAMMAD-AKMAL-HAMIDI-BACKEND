const db = require('../models')
const blog = db.blog
const like = db.like
const category = db.category
const  {Op, Sequelize}  = require('sequelize')


module.exports = {
    createBlog : async (req, res) => {
        try {
            const {title, content, keyword, country, categoryId} = req.body
            const id = req.user.id
            const image = req.file.filename

            
            const result = await blog.create({title,content,keyword,country,categoryId,ProfileId : id, imgURL : image})
            res.status(200).send({
                status : true,
                message : "Create Blog Success",
                result
            })
        } catch (error) {
            res.status(400).send(error)
        }
        
    },
    myBlog : async (req, res) => {
        try {
            const {id} = req.user
            const result = await blog.findAll(
                {where : {profileId : id}}
            )
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    },


    favoriteBlog : async (req, res) => {
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit || 10
            const sort = req.query.sort || "DESC"
            const sortBy = req.query.sortBy
            const result = await blog.findAll(
                {
                include : [{model : like}],
                attributes : 
                    [
                        'id',
                        'title',
                        'imgURL',
                        'keyword',
                        'country',
                        'video',
                        'createdAt',
                        'categoryId',
                        'ProfileId',
                        [
                            Sequelize.literal(
                                '(SELECT COUNT(*) FROM likes WHERE likes.blogId = blog.id)'
                            ),
                            "totalLike",
                        ]
                    ],
                    limit,
                    offset : limit * (page - 1),
                    order: [["totalLike", sort]],
                    subQuery : false
                },
            )
            res.status(200).send(result)
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },



    getAllBlog : async (req, res) => {
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit || 10

            const sort = req.query.sort || "DESC"
            const sortBy = req.query.sortBy || "createdAt"

            const result = await blog.findAll(
                {   
                    order : [[sortBy, sort]],
                    limit,
                    offset : limit * (page - 1)
            })
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    getBlogById : async (req, res) => {
        try {
            const {id} = req.params
            const result = await blog.findOne(
                {where : {id : id}}
            )
            res.status(200).send(result)
        } catch (error) {
            res.staus(200).send(error)
        }
    },
    likeBlog : async (req, res) => {
        try {
            const userId = req.user.id
            const {blogId} = req.body
            const isLike = await like.findOne(
                {where : {ProfileId : userId, blogId : req.body.blogId}}
            )
            if (isLike === null) {
                await like.create(
                    {ProfileId : userId, blogId : blogId}
                )
                res.status(200).send({
                    message : "like success"
                })
            }
            else{
                await like.destroy(
                    {
                        where : {ProfileId : userId, blogId : blogId}
                    }
                    )
                    res.status(200).send({
                    message : "unlike success"
                })
                }
        } catch (error) {
            res.status(400).send(error)
        }
    },
    sortBlog : async (req,res) => {
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit || 10
            const {catId, title, keyword} = req.query 
            const clause = []
            if (catId) {
                clause.push({categoryId : catId})
            }
            if (title) {
                clause.push({title : title})
            }
            if (keyword) {
                clause.push({keyword : keyword})
            }
            const result = await blog.findAll(
                {
                    include : category,
                    where : {[Op.or] : clause}
                },
                )
                res.status(200).send({
                    result
                })
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    getAllCategory : async (req, res) => {
        try {
            const result = await category.findAll()
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    deleteBlog : async (req, res) => {
        try {
            const result = await blog.destroy(
                { where : {ProfileId : req.user.id, id : req.body.blogId}}
            )
            await like.destroy(
                {where : {blogId : req.body.blogId}}
            )
            res.status(200).send({
                message : "delete blog success",
            })
        } catch (error) {
            res.status(400).send(error)
        }
    },
    getLikeBlog : async (req,res) => {
        try {
            const result = await like.findAll(
            {
                include : [{model : blog}],
                where : {ProfileId : req.user.id}
            }
            )
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    }

}