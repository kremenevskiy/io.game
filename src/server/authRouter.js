const Router = require('express');
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration',[
    check('username', "username can't be empty").notEmpty(),
    check('password', "Password can't be less than 4 symbols and more then 10").isLength({min:4, max: 10})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', authMiddleware, controller.getUsers)

module.exports = router