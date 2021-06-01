const jwt = require('jsonwebtoken')
const {secret} = require('../config')

const checkAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                return res.status(400).json({authorised: false})
            }
            next();
        })
    }
    else {
        return res.status(200).json({authorised: false})
    }
}

module.exports = checkAuth;