const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = async(req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, 'secret token', async(error, decodedToken) => {
            if(error) {
                console.log(error)
                res.redirect('/login')
            }
            else {
                console.log(decodedToken)
                const user = await User.findById(decodedToken.id)
                req.user = user
                console.log(user)
                next()
            }
        })
    }else {
        res.redirect('/login')
    }
}

module.exports = auth