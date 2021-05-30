const {Schema, model} = require('mongoose')

const UserCredentials = new Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    maxScore: {
        type: Number,
        required: false,
        default: 0
    },
    roles: [
        {
            type: String,
            ref: 'Role',
            required: false
        }
    ]
}, {collection: 'usersCredentials'})

module.exports = model('UserCredentials', UserCredentials)