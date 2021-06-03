const userCredentials = require('../models/UserCredentials');
const role = require('../models/Role');

const {validationResult} = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');

const maxTokenAge = 1000 * 60 * 60; // 1 hour


const generateAccessToken = (id, username, roles, maxScore) => {
    const payload = {
        id,
        username,
        roles,
        maxScore
    }
    return jwt.sign(payload, secret, {expiresIn: "1h"});
};


function handleErrors(username, password) {
    let msg_error = {username: '', password: ''};
    if (username.isEmpty) {
        msg_error.username = "Username can't be empty!";
    }
    else if (password.isEmpty) {
        msg_error.password = "Password can't be empty!";
    }
    else if (!username || typeof username !== 'string') {
        msg_error.username = "Invalid username";
    }
    else if (!password || typeof password !== 'string') {
        msg_error.password = "Invalid password";
    }
    else if (password.length < 4) {
        msg_error.password = "Password can't be less than 4 symbols";
    }
    else if (password.length > 10) {
        msg_error.password = "Password length can't be more than 10 symbols";
    }
    return msg_error;
}

function handleErrorsLogin(username, password) {
    let msg_error = {username: '', password: ''};
    if (username.isEmpty) {
        msg_error.username = "Username can't be empty!";
    }
    else if (password.isEmpty) {
        msg_error.password = "Password can't be empty!";
    }
    else if (!username || typeof username !== 'string') {
        msg_error.username = "Invalid username";
    }
    else if (!password || typeof password !== 'string') {
        msg_error.password = "Invalid password";
    }
    return msg_error;
}

function handleErrorsPassword (newPassword) {

    let password = '';

    if (newPassword.isEmpty) {
        password = "Password can't be empty!";
    }
    else if (!newPassword || typeof newPassword !== 'string') {
        password = "Invalid password";
    }
    else if (newPassword.length < 4) {
        password = "Password can't be less than 4 symbols";
    }
    else if (newPassword.length > 10) {
        password = "Password length can't be more than 10 symbols";
    }
    return password;
}



function noErrors(msg_error) {
    return msg_error.username === '' && msg_error.password === '';
}


class appController {
    async registration(req, res) {
        try{
            const {username, password} = req.body;
            const errors = validationResult(req);
            let msg_error = {username: '', password: ''};
            if (!errors.isEmpty()){

                msg_error = handleErrors(username, password);
                return res.status(400).json({status: 'registration_error', error: msg_error});
            }

            const candidate = await userCredentials.findOne({username});
            if (candidate) {
                msg_error.username = "Username is already taken";
                return res.status(200).json({status: 'registration_error', error: msg_error});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userRole = await role.findOne({value: "USER"})

            const user = await userCredentials.create(({
                username: username,
                password: hashedPassword,
                roles: [userRole.value]
            }))

            await user.save();

            res.json({status: 'ok', message: "Successful registration"});
        }
        catch (e){
            console.log("registration error: ", e);
            return res.status(400).json({status: 'registration_error', error: "Unknown reason"});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            let msg_errors = {username: '', password: ''};
            msg_errors = handleErrorsLogin(username, password);

            if (!noErrors(msg_errors)) {
                return res.status(400).json({status: 'login error', error: msg_errors});
            }

            const user = await userCredentials.findOne({username});

            if (!user) {
                msg_errors.username = "No such user";
                return res.status(200).json({status: "login_error", error: msg_errors});
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                msg_errors.password = 'Wrong password';
                return res.status(200).json({status: "login_error", error: msg_errors});
            }

            const token = generateAccessToken(user._id, user.username, user.roles, user.maxScore);
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxTokenAge})
            res.status(200).json({status: 'ok', data: user})
        }
        catch (e){
            console.log('Login error', e);
        }
    }

    async changePass(req, res) {
        try {
            const {oldPassword, newPassword} = req.body;
            const token = req.cookies.jwt;
            const loggedUser = jwt.verify(token, secret);

            const findUser = await userCredentials.findOne({username: loggedUser.username});

            let msg_errors = {oldPassword: '', newPassword: ''};

            const validPassword = await bcrypt.compare(oldPassword, findUser.password);
            if (!validPassword) {
                msg_errors.oldPassword = 'Invalid old password';
                return res.status(200).json({status: "old_password_error", error: msg_errors});
            }

            msg_errors.newPassword = handleErrorsPassword(newPassword);
            if (msg_errors.newPassword !== '') {
                return res.status(200).json({status: 'new_password_error', error: msg_errors});
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const _id = findUser._id;

            await userCredentials.updateOne(
                {_id},
                {$set: {password: hashedPassword}}
                )
            res.json({status: 'ok'});
        }
        catch (e) {
            console.log('Change Password Error: ', e);
        }
    }

    async logout(req, res) {
        res.cookie('jwt', '', {maxAge: 1});
        res.status(200).json({status: 'ok'});
    }

    async getUsers(req, res) {
        try{
            const users = await userCredentials.find();
            res.json(users);
        }
        catch (e) {
            console.log('Error in getUsers');
        }
    }
}

module.exports = new appController();