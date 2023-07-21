require('dotenv').config()
const express = require('express')
const PORT = 2000
const db = require('./models')
const { userRouter, blogRouter, profileRouter } = require('./routers')

const server = (express())

server.use(express.json())

server.use('/user', userRouter)
server.use('/profile', profileRouter)
server.use('/blog', blogRouter)
server.use(express.static('./public'))



server.listen(PORT, () => {
    // db.sequelize.sync({ alter : true })
    console.log(`server is running at port : ${PORT}`);
})