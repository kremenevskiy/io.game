const express = require('express');
const router = express.Router();
const controller = require('./appController');
const {check} = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware')
// const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/register',[
    check('username').notEmpty(),
    check('password').notEmpty(),
    check('password').isLength({min:4, max: 10}),
], controller.registration);

router.post('/login', controller.login);
router.post('/change-password', authMiddleware, controller.changePass);
router.get('/logout', controller.logout);



module.exports = router