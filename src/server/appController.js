const userCredentials = require('./models/UserCredentials');
const role = require('./models/Role');

const {validationResult} = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require('./config');


const generateAccessToken = (id, username, roles) => {
    const payload = {
        id,
        username,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "1h"});
};


class appController {
    async registration(req, res) {
        try{
            const {username, password} = req.body;
            const errors = validationResult(req);
            let msg_error = {username: '', password: ''};
            if (!errors.isEmpty()){

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
                    msg_error.password = "Password length can't be more than 10 sybmols";
                }

                return res.status(200).json({status: 'registration_error', error: msg_error});
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
            const user = await userCredentials.findOne({username});

            if (!user) {
                return res.status(400).json({status: "login_error", error: "No such user"});
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({status: "login_error", error: "Wrong password"});
            }

            const token = generateAccessToken(user._id, user.username, user.roles);

            res.json({status: 'ok', data: token})
        }
        catch (e){

        }
    }
    async changePass(req, res) {
        const {token, newPassword} = req.body;
        try {
            const user = jwt.verify(token, secret);

            const _id = user.id;
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await userCredentials.updateOne(
                {_id},
                {$set: {password: hashedPassword}}
                )
            // res.setHeader('Set-Cookie', 'man=true');
            res.cookie('newUser', false, {maxAge: 1000 * 60 * 60 * 24});
            res.cookie('god', true);
            const cookies = req.cookies;
            // console.log(req);
            console.log('cookies', cookies);
            res.json({status: 'ok'});

        }
        catch (e) {
            console.log(e);
            res.json({status: "error", error: 'bad access'})
        }
    }
}

module.exports = new appController();